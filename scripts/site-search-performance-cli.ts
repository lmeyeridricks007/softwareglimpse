#!/usr/bin/env tsx
/**
 * SearchPerformanceAgent CLI
 *
 *   npm run site:search-performance
 *   npm run site:search-performance -- --fixture
 *   npm run site:search-performance -- --import path/to/gsc-export.json
 *
 * Uses approved GSC connector / import / fixtures.
 * Does NOT scrape Search Console. Does NOT invent credentials.
 */
import { runSearchPerformanceAgent } from "@/services/site-intelligence/search-performance";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const fixture = args.includes("--fixture");
  const importIdx = args.indexOf("--import");
  const importPath =
    importIdx >= 0 && args[importIdx + 1] ? args[importIdx + 1] : undefined;

  const result = await runSearchPerformanceAgent({
    write: !noWrite,
    fixture,
    importPath,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          sourceMode: result.report.sourceMode,
          live: result.report.live,
          synthetic: result.report.synthetic,
          nearWins: result.report.nearWins.length,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `SEARCH PERFORMANCE — ${result.agent.name} v${result.agent.version}`,
  );
  console.log(`Mode:       ${result.report.sourceMode}`);
  console.log(`Live:       ${result.report.live}`);
  console.log(`Synthetic:  ${result.report.synthetic}`);
  console.log(`Near-wins:  ${result.report.nearWins.length}`);
  console.log(`CTR opps:   ${result.report.ctrOpportunities.length}`);
  console.log(`Refresh:    ${result.report.refreshCandidates.length}`);
  console.log(`Emerging:   ${result.report.emergingTopics.length}`);
  console.log(`Defend:     ${result.report.defendCluster.length}`);
  if (result.paths.latest) console.log(`Latest:     ${result.paths.latest}`);
  if (result.paths.visibility) {
    console.log(`Visibility: ${result.paths.visibility}`);
  }
  console.log("\nAverage position ≠ fixed SERP rank.");
  console.log("No production content was modified.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
