#!/usr/bin/env tsx
/**
 * RankingOpportunityAgent CLI
 *
 *   npm run site:ranking-opportunities
 *   npm run site:ranking-opportunities -- --fixture
 *
 * Relative opportunity/feasibility only — NOT a ranking probability.
 * Does NOT mutate production content.
 */
import { runRankingOpportunityAgent } from "@/services/site-intelligence/ranking-opportunities";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const fixture = args.includes("--fixture");
  const snapIdx = args.indexOf("--serp-snapshot");
  const serpSnapshotPath =
    snapIdx >= 0 && args[snapIdx + 1] ? args[snapIdx + 1] : undefined;

  const result = await runRankingOpportunityAgent({
    write: !noWrite,
    fixture,
    serpSnapshotPath,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          opportunities: result.report.opportunities.length,
          clusters: result.report.clusters.length,
          authorityMeasured: result.report.authorityMeasured,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `RANKING OPPORTUNITIES — ${result.agent.name} v${result.agent.version}`,
  );
  console.log(`Opportunities: ${result.report.opportunities.length}`);
  console.log(`Clusters:      ${result.report.clusters.length}`);
  console.log(
    `Strongest:     ${result.report.topStrongest[0]?.query ?? "—"} (${result.report.topStrongest[0]?.feasibility ?? "—"})`,
  );
  console.log(
    `Authority:     ${result.report.authorityMeasured ? "measured" : "NOT measured — feasibility may be overstated"}`,
  );
  if (result.paths.latest) console.log(`Latest:        ${result.paths.latest}`);
  if (result.paths.json) console.log(`JSON:          ${result.paths.json}`);
  if (result.paths.archive) console.log(`Archive:       ${result.paths.archive}`);
  console.log("\nRelative opportunity only — not a ranking probability.");
  console.log("No production content was modified.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
