#!/usr/bin/env npx tsx
/**
 * Digital PR / Backlink Opportunity Engine
 *
 * Usage:
 *   npm run seo:link-opportunities
 *   npm run seo:link-opportunities -- --export data/seo/imports/ahrefs/sample.csv
 *   npm run seo:link-opportunities -- --no-write --json
 *
 * Never sends outreach. Never invents backlink metrics.
 */
import { analyzeLinkOpportunities } from "@/services/seo/link-opportunity";

function flag(name: string): boolean {
  return process.argv.includes(name);
}

function argValue(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function main() {
  const report = analyzeLinkOpportunities({
    exportPath: argValue("--export"),
    write: !flag("--no-write"),
    prospectLimit: argValue("--limit")
      ? Number(argValue("--limit"))
      : 40,
  });

  if (flag("--json")) {
    console.log(JSON.stringify(report.summary, null, 2));
  } else {
    console.log("link-opportunity-engine");
    console.log(`  assets: ${report.summary.assetCount}`);
    console.log(`  topAssetScore: ${report.summary.topAssetScore}`);
    console.log(`  exportAvailable: ${report.summary.exportAvailable}`);
    console.log(`  gaps: ${report.summary.gapCount}`);
    console.log(`  prospects: ${report.summary.prospectCount}`);
    console.log(`  linksEarned: ${report.summary.linksEarnedCount}`);
    if (!flag("--no-write")) {
      console.log("  wrote: data/seo/link-opportunities.json");
      console.log("  wrote: docs/seo/WEEKLY-LINK-OPPORTUNITIES.md");
    }
    console.log(
      "\nCompliance: no auto-send, no link buying, no fabricated metrics.",
    );
  }
}

main();
