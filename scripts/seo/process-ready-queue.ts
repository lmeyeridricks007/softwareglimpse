#!/usr/bin/env npx tsx
/**
 * Process INDEXABLE_READY guides/comparisons in batches of 25.
 *
 * Re-validates current state before promote — never bulk-promotes from
 * stale enrichment estimates.
 *
 *   npm run seo:ready-queue
 *   npm run seo:ready-queue -- --dry-run --limit 25
 *   npm run seo:ready-queue -- --apply --persist --batch-size 25
 *   npm run seo:ready-queue -- --apply --persist --kind guides
 *   npm run seo:ready-queue -- --apply --persist --kind comparisons --limit 200
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import {
  processReadyBatch,
  selectReadyQueue,
  tallyResults,
  type ReadyKind,
  type ReadyReviewResult,
} from "@/services/seo/ready-queue";
import { runSitemapEstateReconcile } from "@/services/seo/sitemap-reconcile/run";
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph/analyze";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "data/seo/batches/ready-queue");
const WAVE = `ready-queue-${new Date().toISOString().slice(0, 10)}`;

function argFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function argValue(args: string[], name: string): string | undefined {
  const eq = args.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1]!.startsWith("--")) {
    return args[idx + 1];
  }
  return undefined;
}

async function postBatchHooks(batchIndex: number): Promise<void> {
  console.log(`\n── Post-batch ${batchIndex}: sitemap reconcile + knowledge graph ──`);
  try {
    const report = runSitemapEstateReconcile({ skipLive: true });
    console.log(
      `  sitemap discrepancies=${report.totals.discrepancyCount} (lifecycle_orphan included)`,
    );
  } catch (err) {
    console.warn("  sitemap reconcile failed:", err);
  }
  try {
    analyzeKnowledgeGraph({ write: true });
    console.log("  knowledge graph refreshed");
  } catch (err) {
    console.warn("  knowledge graph failed:", err);
  }
}

function writeMarkdown(
  all: ReadyReviewResult[],
  counts: ReturnType<typeof tallyResults>,
): string {
  const lines = [
    `# INDEXABLE_READY review — ${WAVE}`,
    "",
    "## Totals",
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Ready reviewed | ${all.length} |`,
    `| Promoted | ${counts.PROMOTED} |`,
    `| Remain ready | ${counts.REMAIN_READY} |`,
    `| Returned to improve | ${counts.BACK_TO_IMPROVE} |`,
    `| Manual review | ${counts.MANUAL_REVIEW} |`,
    `| Skipped (already indexable) | ${counts.SKIPPED} |`,
    `| Quality failures | ${counts.qualityFailures} |`,
    `| Semantic failures | ${counts.semanticFailures} |`,
    `| Missing entities | ${counts.missingEntities} |`,
    `| Missing links | ${counts.missingLinks} |`,
    `| Pricing/evidence blockers | ${counts.pricingEvidenceBlockers} |`,
    "",
    "## Per page",
    "",
  ];
  for (const r of all) {
    lines.push(
      `- **${r.outcome}** \`${r.path}\` (lane ${r.lane}, rank ${Math.round(r.rankingScore)}, q=${r.qualityScore ?? "—"}) — ${r.reason}`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = argFlag(args, "--apply");
  const persist = argFlag(args, "--persist") || apply;
  const dryRun = argFlag(args, "--dry-run") || !apply;
  const batchSize = Number(argValue(args, "--batch-size") ?? "25");
  const limitArg = argValue(args, "--limit");
  const limit = limitArg ? Number(limitArg) : undefined;
  const kindArg = argValue(args, "--kind") ?? "all";
  const kinds: ReadyKind[] =
    kindArg === "guides" || kindArg === "guide"
      ? ["guide"]
      : kindArg === "comparisons" || kindArg === "comparison"
        ? ["comparison"]
        : ["guide", "comparison"];
  const skipHooks = argFlag(args, "--skip-hooks");

  loadContentLifecycleStoreFromDisk();
  process.env.SG_ENFORCE_LINK_READINESS = "1";
  process.env.SG_LINK_READINESS_LIGHT = "1";

  console.log(
    `Ready queue: kinds=${kinds.join("+")} batchSize=${batchSize}` +
      (limit != null ? ` limit=${limit}` : "") +
      ` mode=${dryRun ? "DRY-RUN" : "APPLY"}${persist && apply ? "+PERSIST" : ""}`,
  );

  console.log("Selecting prioritized INDEXABLE_READY estate…");
  const queue = selectReadyQueue({ kinds, limit });
  console.log(`Queue size: ${queue.length}`);
  console.log(
    "Top 10:",
    queue
      .slice(0, 10)
      .map(
        (c) =>
          `${c.kind}:${c.slug} [lane=${c.lane} rank=${Math.round(c.rankingScore)} gsc=${c.gscImpressions}]`,
      ),
  );

  mkdirSync(OUT_DIR, { recursive: true });
  const allResults: ReadyReviewResult[] = [];
  const batchCount = Math.ceil(queue.length / batchSize) || 0;

  for (let i = 0; i < batchCount; i++) {
    const slice = queue.slice(i * batchSize, (i + 1) * batchSize);
    console.log(
      `\n══ Batch ${i + 1}/${batchCount} (${slice.length} pages) ══`,
    );
    const report = processReadyBatch(slice, {
      batchIndex: i + 1,
      apply: apply && !dryRun,
      persist: persist && apply && !dryRun,
    });
    allResults.push(...report.reviewed);
    console.log("  counts:", report.counts);
    for (const r of report.reviewed) {
      console.log(
        `  [${r.outcome}] ${r.path} — ${r.reason}` +
          (r.detail[0] ? ` (${r.detail[0]})` : ""),
      );
    }

    const batchPath = path.join(OUT_DIR, `${WAVE}-batch-${i + 1}.json`);
    writeFileSync(batchPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(`  wrote ${batchPath}`);

    if (apply && !dryRun && !skipHooks) {
      await postBatchHooks(i + 1);
    }
  }

  const totals = tallyResults(allResults);
  const summary = {
    wave: WAVE,
    generatedAt: new Date().toISOString(),
    applied: apply && !dryRun,
    queueSize: queue.length,
    totals,
    reviewed: allResults,
  };
  const summaryPath = path.join(OUT_DIR, `${WAVE}-summary.json`);
  const mdPath = path.join(ROOT, "docs/seo", `${WAVE.toUpperCase()}.md`);
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  writeFileSync(mdPath, writeMarkdown(allResults, totals), "utf8");

  console.log("\n════════ FINAL ════════");
  console.log(`Ready reviewed: ${allResults.length}`);
  console.log(`Promoted: ${totals.PROMOTED}`);
  console.log(`Returned to improve: ${totals.BACK_TO_IMPROVE}`);
  console.log(`Remain ready: ${totals.REMAIN_READY}`);
  console.log(`Manual: ${totals.MANUAL_REVIEW}`);
  console.log(`Quality failures: ${totals.qualityFailures}`);
  console.log(`Semantic failures: ${totals.semanticFailures}`);
  console.log(`Missing entities: ${totals.missingEntities}`);
  console.log(`Missing links: ${totals.missingLinks}`);
  console.log(`Pricing/evidence blockers: ${totals.pricingEvidenceBlockers}`);
  console.log(`Wrote ${summaryPath}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
