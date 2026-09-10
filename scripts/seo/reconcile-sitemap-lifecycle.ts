#!/usr/bin/env npx tsx
/**
 * Estate-wide sitemap ↔ lifecycle reconciliation.
 *
 *   npm run seo:sitemap-reconcile
 *   npm run seo:sitemap-reconcile -- --live https://www.softwareglimpse.com
 *   npm run seo:sitemap-reconcile -- --live http://127.0.0.1:3000
 *
 * Does not change lifecycle states merely to make counts match.
 * Hydrates content-lifecycle.json so promotions appear in sitemap inventory.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  renderSitemapReconcileMarkdown,
  runSitemapEstateReconcile,
  validateLiveSitemaps,
} from "@/services/seo/sitemap-reconcile";
import { getSitemapDiagnostics } from "@/seo/sitemap";

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const live = argValue(args, "--live") ?? null;

  const report = runSitemapEstateReconcile({ liveBaseUrl: live });

  if (live) {
    report.liveValidation = await validateLiveSitemaps(live);
  }

  const diagnostics = getSitemapDiagnostics();
  console.log(
    `Sitemap diagnostics: totalUrls=${diagnostics.totalUrls} prohibited=${diagnostics.prohibitedUrls.length} dups=${diagnostics.duplicateUrls.length}`,
  );
  for (const [type, count] of Object.entries(diagnostics.byContentType)) {
    if (count > 0) console.log(`  ${type}: ${count}`);
  }

  console.log(
    `Reconcile discrepancies: ${report.totals.discrepancyCount} (fixable=${report.totals.fixableCount})`,
  );
  for (const p of report.pageTypes) {
    console.log(
      `  ${p.pageType}: total=${p.counts.totalExisting} INDEXABLE=${p.counts.INDEXABLE} inSm=${p.counts.inSitemap} expected=${p.expectedInSitemap} disc=${p.discrepancies.length}`,
    );
  }

  if (report.discrepancies.length) {
    console.log("Sample discrepancies:");
    for (const d of report.discrepancies.slice(0, 25)) {
      console.log(`  [${d.kind}] ${d.path} — ${d.detail}`);
    }
  }

  const outDir = path.join(process.cwd(), "data/seo");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, "sitemap-lifecycle-reconciliation.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );

  const mdPath = path.join(
    process.cwd(),
    "docs/seo/SITEMAP-LIFECYCLE-RECONCILIATION.md",
  );
  writeFileSync(mdPath, renderSitemapReconcileMarkdown(report), "utf8");
  console.log(`Wrote ${mdPath}`);

  if (diagnostics.prohibitedUrls.length || diagnostics.duplicateUrls.length) {
    process.exitCode = 1;
  }
  if (report.totals.discrepancyCount > 0) {
    // Non-zero discrepancies are reported; exit 1 only for hard inventory faults
    // (indexable missing / noindex included) — not for documented schedule gaps.
    const hard = report.discrepancies.filter(
      (d) =>
        d.kind === "indexable_missing_from_sitemap" ||
        d.kind === "improve_or_noindex_in_sitemap" ||
        d.kind === "sitemap_prohibited_class" ||
        d.kind === "sitemap_noncanonical",
    );
    if (hard.length > 0) {
      console.error(`Hard discrepancies: ${hard.length}`);
      process.exitCode = 1;
    }
  }
  if (live && !report.liveValidation.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
