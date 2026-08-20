#!/usr/bin/env tsx
/**
 * CompetitiveGapAgent CLI
 *
 *   npm run site:competitive-gaps
 *   npm run site:competitive-gaps -- --fixture
 *
 * Compares SoftwareGlimpse vs ranking competitors using existing reports.
 * Does NOT mutate production content.
 */
import { runCompetitiveGapAgent } from "@/services/site-intelligence/competitive-gaps";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const fixture = args.includes("--fixture");
  const snapIdx = args.indexOf("--serp-snapshot");
  const serpSnapshotPath =
    snapIdx >= 0 && args[snapIdx + 1] ? args[snapIdx + 1] : undefined;
  const benchIdx = args.indexOf("--benchmark");
  const benchmarkJsonPath =
    benchIdx >= 0 && args[benchIdx + 1] ? args[benchIdx + 1] : undefined;

  const result = await runCompetitiveGapAgent({
    write: !noWrite,
    fixture,
    serpSnapshotPath,
    benchmarkJsonPath,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          advantages: result.report.advantages.length,
          competitorStronger: result.report.competitorStronger.length,
          queryGaps: result.report.queryGaps.length,
          topActions: result.report.topActions.length,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`COMPETITIVE GAPS — ${result.agent.name} v${result.agent.version}`);
  console.log(`Advantages:     ${result.report.advantages.length}`);
  console.log(`Comp stronger:  ${result.report.competitorStronger.length}`);
  console.log(`Missing topics: ${result.report.missingTopics.length}`);
  console.log(`Weak pages:     ${result.report.weakPages.length}`);
  console.log(`Query gaps:     ${result.report.queryGaps.length}`);
  console.log(`Top actions:    ${result.report.topActions.length}`);
  if (result.paths.latest) console.log(`Latest:         ${result.paths.latest}`);
  if (result.paths.json) console.log(`JSON:           ${result.paths.json}`);
  if (result.paths.archive) console.log(`Archive:        ${result.paths.archive}`);
  console.log("\nNo production content was modified.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
