#!/usr/bin/env tsx
/**
 * CompetitorWebsiteAnalysisAgent CLI
 *
 *   npm run site:competitive-benchmark -- --fixture
 *   npm run site:competitive-benchmark -- --live
 *   npm run site:competitive-benchmark -- --serp-snapshot docs/site-intelligence/competitors/snapshots/….json
 *
 * Evaluates representative competitor pages from SERP-COMPETITORS input.
 * Does NOT crawl entire competitor sites. Does NOT mutate production content.
 */
import { runCompetitorWebsiteAnalysisAgent } from "@/services/site-intelligence/competitive-benchmark";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const fixture = args.includes("--fixture");
  const live = args.includes("--live");
  const snapIdx = args.indexOf("--serp-snapshot");
  const serpSnapshotPath =
    snapIdx >= 0 && args[snapIdx + 1] ? args[snapIdx + 1] : undefined;
  const maxDomIdx = args.indexOf("--max-domains");
  const maxDomains =
    maxDomIdx >= 0 && args[maxDomIdx + 1]
      ? Number(args[maxDomIdx + 1])
      : undefined;
  const maxPageIdx = args.indexOf("--max-pages");
  const maxPages =
    maxPageIdx >= 0 && args[maxPageIdx + 1]
      ? Number(args[maxPageIdx + 1])
      : undefined;

  if (fixture && live) {
    console.error("Use either --fixture or --live, not both.");
    process.exit(1);
  }

  const result = await runCompetitorWebsiteAnalysisAgent({
    write: !noWrite,
    fixture,
    live,
    serpSnapshotPath,
    maxDomains,
    maxPages,
    delayMs: live ? 400 : undefined,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          domainsSampled: result.report.domainsSampled,
          pagesSampled: result.report.pagesSampled,
          observationMode: result.report.observationMode,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `COMPETITIVE BENCHMARK — ${result.agent.name} v${result.agent.version}`,
  );
  console.log(`SERP source: ${result.report.serpSource}`);
  console.log(`Mode:        ${result.report.observationMode}`);
  console.log(`Domains:     ${result.report.domainsSampled}`);
  console.log(`Pages:       ${result.report.pagesSampled}`);
  console.log(`Benchmarks:  ${result.report.benchmarks.length}`);
  if (result.paths.latest) console.log(`Latest:      ${result.paths.latest}`);
  if (result.paths.domains?.length) {
    console.log(`Profiles:    ${result.paths.domains.length} domain files`);
  }
  if (result.paths.pack) console.log(`Pack:        ${result.paths.pack}`);
  if (result.paths.archive) console.log(`Archive:     ${result.paths.archive}`);
  console.log("\nNo production content was modified.");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
