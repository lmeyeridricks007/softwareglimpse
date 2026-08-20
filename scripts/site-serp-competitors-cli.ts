#!/usr/bin/env tsx
/**
 * SERPCompetitorDiscoveryAgent CLI
 *
 *   npm run site:serp-competitors -- --fixture
 *   npm run site:serp-competitors -- --import docs/site-intelligence/competitors/snapshots/….json
 *   npm run site:serp-competitors              # requires BRAVE_API_KEY / SERPER_API_KEY / Google CSE
 *
 * Discovers organic SERP competitors via approved search APIs.
 * Does NOT scrape Google HTML. Does NOT mutate production content.
 */
import {
  runSerpCompetitorDiscoveryAgent,
  SerpProviderNotConfiguredError,
} from "@/services/site-intelligence/serp-competitors";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const fixture = args.includes("--fixture");
  const importIdx = args.indexOf("--import");
  const importPath =
    importIdx >= 0 && args[importIdx + 1] ? args[importIdx + 1] : undefined;
  const maxIdx = args.indexOf("--max");
  const maxQueries =
    maxIdx >= 0 && args[maxIdx + 1] ? Number(args[maxIdx + 1]) : undefined;

  try {
    const result = await runSerpCompetitorDiscoveryAgent({
      cluster: "crm",
      write: !noWrite,
      fixture,
      importPath,
      maxQueries,
      delayMs: 350,
    });

    if (json) {
      console.log(
        JSON.stringify(
          {
            agent: result.agent,
            generatedAt: result.generatedAt,
            provider: result.providerId,
            live: result.live,
            queryCount: result.seeds.length,
            paths: result.paths,
          },
          null,
          2,
        ),
      );
      return;
    }

    console.log(
      `SERP COMPETITORS — ${result.agent.name} v${result.agent.version}`,
    );
    console.log(`Provider:   ${result.providerId} (live=${result.live})`);
    console.log(`Queries:    ${result.seeds.length}`);
    console.log(
      `Results:    ${result.serpResults.reduce((s, r) => s + r.results.length, 0)}`,
    );
    if (result.paths.latest) console.log(`Latest:     ${result.paths.latest}`);
    if (result.paths.querySet) console.log(`Query set:  ${result.paths.querySet}`);
    if (result.paths.snapshot) console.log(`Snapshot:   ${result.paths.snapshot}`);
    if (result.paths.archive) console.log(`Archive:    ${result.paths.archive}`);
    if (!result.live) {
      console.log(
        "\nNote: non-live provider — refresh with an approved API for current SERPs.",
      );
    }
    console.log("\nNo production content was modified.");
  } catch (err) {
    if (err instanceof SerpProviderNotConfiguredError) {
      console.error(err.message);
      console.error(
        "\nOffline options:\n  npm run site:serp-competitors -- --fixture\n  npm run site:serp-competitors -- --import <snapshot.json>",
      );
      process.exit(1);
    }
    throw err;
  }
}

main();
