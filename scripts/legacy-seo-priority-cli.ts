#!/usr/bin/env tsx
/**
 * SeoPriorityMigrationAgent CLI
 *
 *   npm run migration:seo-priority
 *   npm run migration:seo-priority -- --import path/to/gsc-export.json
 *   npm run migration:seo-priority -- --json
 *   npm run migration:seo-priority -- --no-write
 *
 * Does NOT invent metrics. Does NOT implement redirects.
 */
import { runSeoPriorityMigrationAgent } from "@/services/legacy-url-migration/seo-priority";

function main() {
  const args = process.argv.slice(2);
  const write = !args.includes("--no-write");
  const json = args.includes("--json");
  const importEq = args.find((a) => a.startsWith("--import="));
  const importIdx = args.indexOf("--import");
  const importPath =
    importEq?.split("=")[1] ??
    (importIdx >= 0 && args[importIdx + 1] && !args[importIdx + 1]!.startsWith("-")
      ? args[importIdx + 1]
      : undefined);

  const result = runSeoPriorityMigrationAgent({ write, importPath });
  const a = result.availability;
  const rows = result.rows;

  const counts = {
    critical: rows.filter((r) => r.historicalSeoImportance === "CRITICAL")
      .length,
    high: rows.filter((r) => r.historicalSeoImportance === "HIGH").length,
    medium: rows.filter((r) => r.historicalSeoImportance === "MEDIUM").length,
    low: rows.filter((r) => r.historicalSeoImportance === "LOW").length,
    riskHigh: rows.filter(
      (r) => r.migrationRisk === "CRITICAL" || r.migrationRisk === "HIGH",
    ).length,
  };

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          availability: {
            gsc: a.searchConsole.available,
            analytics: a.analytics.available,
            backlinks: a.backlinks.available,
            mode: a.searchConsole.mode,
          },
          counts,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`${result.agent.name} v${result.agent.version}`);
  console.log(
    `  GSC available:       ${a.searchConsole.available} (${a.searchConsole.mode})`,
  );
  console.log(`  Analytics available: ${a.analytics.available}`);
  console.log(`  Backlinks available: ${a.backlinks.available}`);
  console.log(
    `  importance CRITICAL/HIGH/MEDIUM/LOW: ${counts.critical}/${counts.high}/${counts.medium}/${counts.low}`,
  );
  console.log(`  migration risk CRITICAL+HIGH: ${counts.riskHigh}`);
  if (write) console.log(`  wrote ${result.paths.markdown}`);
}

main();
