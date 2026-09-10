#!/usr/bin/env tsx
/**
 * MigrationSEOAuditAgent CLI
 *
 *   npm run migration:seo-audit
 *   npm run migration:seo-audit -- --base-url=http://127.0.0.1:3000
 *   BASE_URL=http://127.0.0.1:3000 npm run migration:seo-audit
 *   npm run migration:seo-audit -- --no-write
 *   npm run migration:seo-audit -- --json
 */
import { runMigrationSeoAudit } from "@/services/legacy-url-migration/seo-audit";

async function main() {
  const args = process.argv.slice(2);
  const write = !args.includes("--no-write");
  const json = args.includes("--json");
  const liveBaseUrl =
    args.find((a) => a.startsWith("--base-url="))?.split("=")[1] ||
    process.env.BASE_URL ||
    undefined;

  const result = await runMigrationSeoAudit({ write, liveBaseUrl });

  if (json) {
    console.log(
      JSON.stringify(
        {
          overall: result.summary.overall,
          mode: result.summary.mode,
          totals: result.summary.totals,
          checks: result.summary.checks,
          findingCount: result.findings.length,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `MigrationSEOAuditAgent v1.0.0 — ${result.summary.overall} (${result.summary.mode})`,
  );
  if (liveBaseUrl) {
    console.log(`  live origin:     ${liveBaseUrl}`);
  } else {
    console.log(
      "  live origin:     (none — pass --base-url or BASE_URL for live HTTP probes)",
    );
  }
  console.log(`  legacy URLs:     ${result.summary.totals.legacyUrls}`);
  console.log(
    `  fate OK/issues:  ${result.summary.totals.fateOk}/${result.summary.totals.fateIssues}`,
  );
  console.log(`  redirects:       ${result.summary.totals.redirectsConfigured}`);
  console.log(
    `  high-risk:       ${result.summary.totals.highRiskRedirectOk} ok / ${result.summary.totals.highRiskRedirectIssues} issues`,
  );
  console.log(
    `  findings:        P0=${result.summary.totals.findingsP0} P1=${result.summary.totals.findingsP1} P2=${result.summary.totals.findingsP2}`,
  );
  for (const c of result.summary.checks) {
    if (c.status !== "pass") {
      console.log(`  [${c.status}] ${c.id}: ${c.summary}`);
    }
  }
  if (write) {
    console.log(`  wrote ${result.paths.markdown}`);
    console.log(`  wrote ${result.paths.json}`);
  }

  if (result.summary.overall === "FAIL") {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
