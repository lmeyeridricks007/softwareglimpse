#!/usr/bin/env npx tsx
/**
 * Growth Dashboard CLI
 *
 *   npm run seo:growth-dashboard
 *   npm run seo:growth-dashboard -- --no-write --json
 *
 * Internal measurement only. Never fabricates unavailable metrics.
 */
import { runGrowthDashboard } from "@/services/seo/growth-dashboard";

function flag(name: string): boolean {
  return process.argv.includes(name);
}

function main(): void {
  if (flag("--help") || flag("-h")) {
    console.error(`Growth Dashboard

Usage:
  npm run seo:growth-dashboard
  npm run seo:growth-dashboard -- --no-write --json
`);
    process.exit(0);
  }

  const report = runGrowthDashboard({ write: !flag("--no-write") });

  if (flag("--json")) {
    console.log(
      JSON.stringify(
        {
          generatedAt: report.generatedAt,
          scorecard: report.scorecard.map((p) => ({
            id: p.id,
            status: p.status,
            summary: p.summary,
          })),
          sources: report.sourceInventory,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`growth-dashboard v${report.engineVersion}`);
  for (const p of report.scorecard) {
    console.log(`  ${p.label}: ${p.status}`);
  }
  if (!flag("--no-write")) {
    console.log("  wrote: data/seo/growth-dashboard.json");
    console.log("  wrote: docs/seo/GROWTH-DASHBOARD.md");
  }
  console.log("\nInternal only — not connected metrics stay not connected.");
}

main();
