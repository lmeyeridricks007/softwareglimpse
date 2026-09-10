#!/usr/bin/env npx tsx
/**
 * Weekly EXISTING-CONTENT improvement cycle.
 *
 *   npm run seo:improvement-cycle
 *   npm run seo:improvement-cycle -- --apply --batch 25
 *   npm run seo:improvement-cycle -- --export docs/migration/data/gsc-export.json
 *
 * Default = PLAN/DRY-RUN. Never fabricates data/testing, never auto-creates URLs.
 */
import {
  runImprovementCycle,
  type ImprovementCycleMode,
} from "@/services/seo/improvement-cycle";

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function usage(code = 0): never {
  console.log(`Weekly existing-content improvement cycle

Usage:
  npm run seo:improvement-cycle
  npm run seo:improvement-cycle -- --apply --batch 25
  npm run seo:improvement-cycle -- --export <gsc-export.json>
  npm run seo:improvement-cycle -- --skip-seo-audit

Default mode is PLAN (dry-run). Pass --apply to enrich selected pages only.

Never fabricates GSC/testing data, never creates new URLs, never mass-deletes.
`);
  process.exit(code);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) usage(0);

  const mode: ImprovementCycleMode = args.includes("--apply") ? "apply" : "plan";
  const batchSize = Number(argValue(args, "--batch") ?? "25");
  const gscExport = argValue(args, "--export");
  const skipSeoAudit = args.includes("--skip-seo-audit");

  console.log(
    `improvement-cycle mode=${mode.toUpperCase()} batch=${batchSize}${gscExport ? ` export=${gscExport}` : ""}`,
  );

  const report = await runImprovementCycle({
    mode,
    batchSize,
    gscExport,
    skipSeoAudit,
  });

  console.log(`\nWeek ${report.weekId} · steps=${report.steps.length}`);
  for (const st of report.steps) {
    console.log(`  [${st.status}] ${st.label}: ${st.detail}`);
  }

  const s = report.summary;
  console.log(`\n=== OPERATING SUMMARY ===`);
  console.log(`Ranking wins: ${s.rankingWins.length}`);
  console.log(`Ranking losses: ${s.rankingLosses.length}`);
  console.log(`Pages to refresh: ${s.pagesToRefresh.length}`);
  console.log(`Pages to enrich: ${s.pagesToEnrich.length}`);
  console.log(`Ready to promote: ${s.pagesReadyToPromote.length}`);
  console.log(`Blocked: ${s.pagesBlocked.length}`);
  console.log(`Data verification: ${s.dataVerificationRequired.length}`);
  console.log(`Human testing: ${s.humanTestingRequired.length}`);
  console.log(`Link opportunities: ${s.internalLinkOpportunities.length}`);
  console.log(`Technical issues: ${s.technicalIssues.length}`);
  console.log(`Selected batch: ${report.selectedBatch.length}`);
  console.log(`\nWrote docs/seo/IMPROVEMENT-CYCLE.md`);

  const failed = report.steps.filter((st) => st.status === "failed");
  if (failed.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
