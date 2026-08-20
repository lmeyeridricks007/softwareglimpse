#!/usr/bin/env tsx
/**
 * LegacyMigrationMonitorAgent CLI
 *
 *   npm run migration:monitor
 *   npm run migration:monitor -- --no-write
 *   npm run migration:monitor -- --no-archive
 *   npm run migration:monitor -- --json
 *   npm run migration:monitor -- --import path/to/gsc-export.json
 */
import { runLegacyMigrationMonitor } from "@/services/legacy-url-migration/monitor";

function main() {
  const args = process.argv.slice(2);
  const write = !args.includes("--no-write");
  const archive = !args.includes("--no-archive");
  const json = args.includes("--json");
  const importIdx = args.indexOf("--import");
  const importPath =
    importIdx >= 0 && args[importIdx + 1]
      ? args[importIdx + 1]
      : undefined;

  const result = runLegacyMigrationMonitor({
    write,
    archive,
    importPath,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          overall: result.summary.overall,
          totals: result.summary.totals,
          checks: result.summary.checks,
          gscAvailable: result.gsc.available,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `LegacyMigrationMonitorAgent v1.0.0 — ${result.summary.overall}`,
  );
  console.log(`  redirects checked: ${result.summary.totals.redirectsChecked}`);
  console.log(
    `  important watched:  ${result.summary.totals.importantUrlsWatched}`,
  );
  console.log(
    `  issues: NEW=${result.summary.totals.issuesNew} OPEN=${result.summary.totals.issuesOpen} REGRESSED=${result.summary.totals.issuesRegressed} RESOLVED=${result.summary.totals.issuesResolved} INTENTIONAL=${result.summary.totals.issuesIntentional}`,
  );
  console.log(
    `  severity: P0=${result.summary.totals.p0} P1=${result.summary.totals.p1} P2=${result.summary.totals.p2}`,
  );
  console.log(`  GSC: ${result.gsc.available ? result.gsc.mode : "unavailable"}`);
  for (const c of result.summary.checks) {
    if (c.status !== "pass") {
      console.log(`  [${c.status}] ${c.id}: ${c.summary}`);
    }
  }
  if (write) {
    console.log(`  wrote ${result.paths.markdown}`);
    if (result.paths.archive) console.log(`  archive ${result.paths.archive}`);
    console.log(`  snapshot ${result.paths.snapshot}`);
  }

  if (result.summary.overall === "CRITICAL") {
    process.exitCode = 1;
  }
}

main();
