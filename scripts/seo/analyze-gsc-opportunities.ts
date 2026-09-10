#!/usr/bin/env npx tsx
/**
 * GSC Opportunity Engine CLI
 *
 *   npm run seo:gsc-opportunities
 *   npm run seo:gsc-opportunities -- --export docs/migration/data/gsc-export.json
 *   npm run seo:gsc-opportunities -- --export path/to/gsc-export.json --no-write --json
 *
 * Ingests a Google Search Console Performance JSON export, scores existing
 * pages for organic growth opportunity, and writes reproducible reports.
 * Does NOT create pages, rewrite content, or change production SEO settings.
 */
import {
  analyzeGscOpportunities,
  discoverLatestGscExport,
} from "@/services/seo/gsc-opportunity";

function usage(code = 1): never {
  console.error(`GSC Opportunity Engine

Usage:
  npm run seo:gsc-opportunities
  npm run seo:gsc-opportunities -- --export <path-to-gsc-export.json>
  npm run seo:gsc-opportunities -- --export <path> --no-write --json

Flags:
  --export <path>   GSC SearchSnapshot JSON (pages + optional queries[])
  --no-write        Do not write docs/seo or data/seo outputs
  --json            Print compact JSON summary to stdout
  --diagnose <n>    Diagnose top N pages (default 200)
  --min-imp <n>     Minimum rolled-up impressions to score (default 10)
  --help            Show this help

When --export is omitted, the newest known export under docs/migration/data,
src/data/seo, or data/seo is selected automatically.
`);
  process.exit(code);
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) usage(0);

  let exportPath: string | undefined;
  let diagnoseTopN = 200;
  let minImpressions = 10;
  let write = true;
  let json = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a === "--export") {
      exportPath = args[++i];
      continue;
    }
    if (a.startsWith("--export=")) {
      exportPath = a.slice("--export=".length);
      continue;
    }
    if (a === "--diagnose") {
      diagnoseTopN = Number(args[++i] ?? 200);
      continue;
    }
    if (a === "--min-imp") {
      minImpressions = Number(args[++i] ?? 10);
      continue;
    }
    if (a === "--no-write") {
      write = false;
      continue;
    }
    if (a === "--json") {
      json = true;
      continue;
    }
    console.error(`Unknown flag: ${a}`);
    usage();
  }

  if (!exportPath) {
    const discovered = discoverLatestGscExport();
    console.error(
      `Using newest GSC export: ${discovered.sourcePath} (sort key ${discovered.sortKey})`,
    );
    exportPath = discovered.absolutePath;
  }

  const report = analyzeGscOpportunities({
    exportPath,
    write,
    diagnoseTopN,
    minImpressions,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          engineVersion: report.engineVersion,
          generatedAt: report.generatedAt,
          sourceFile: report.sourceFile,
          dataThroughDate: report.dataThroughDate,
          totals: report.totals,
          exclusionSummary: report.exclusionSummary,
          top20: report.top20.map((r) => ({
            rank: r.rank,
            path: r.path,
            primaryQuery: r.primaryQuery,
            impressions: r.impressions,
            position: r.avgPosition,
            ctr: r.ctr,
            score: r.opportunityScore,
            action: r.primaryAction,
            causes: r.rootCauses,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`GSC Opportunity Engine v${report.engineVersion}`);
  console.log(`Source:     ${report.sourceFile}`);
  console.log(
    `Range:      ${report.provenance.dateRangeStart ?? "?"} → ${report.provenance.dateRangeEnd ?? report.dataThroughDate ?? "—"}`,
  );
  console.log(`Imported:   ${report.provenance.importRetrievedAt ?? "—"}`);
  console.log(`Through:    ${report.dataThroughDate ?? "—"}`);
  console.log(
    `Rows:       ${report.totals.rawPageRows} pages · ${report.totals.rawQueryRows} queries`,
  );
  console.log(
    `Eligible:   ${report.totals.eligiblePages} rolled-up · ${report.totals.scoredPages} scored`,
  );
  console.log(
    `Queues:     A indexed=${report.totals.indexedImprovementCount} · B promote=${report.totals.improvePromotionCount} · CREATE deferred=${report.totals.createCandidatesDeferred}`,
  );
  console.log(`Excluded:   ${report.totals.excludedPages} page rows`);
  console.log("");
  console.log("TOP 10");
  for (const row of report.top20.slice(0, 10)) {
    console.log(
      `  ${String(row.rank).padStart(2)}. [${row.opportunityScore}] ${row.queueBucket === "improve_promotion" ? "B" : "A"} ${row.path} · ${Math.round(row.impressions)} imp · pos ${row.avgPosition.toFixed(1)} · ${row.primaryAction}`,
    );
  }
  if (write) {
    console.log("");
    console.log("Wrote:");
    console.log("  data/seo/gsc-opportunities.json");
    console.log("  docs/seo/GSC-OPPORTUNITIES.md");
    console.log("  docs/seo/TOP-20-GROWTH-PAGES.md");
    console.log("  data/seo/feeds/gsc-*.json");
  }
  console.log("");
  console.log("No production content was modified.");
}

main();
