import fs from "node:fs";
import path from "node:path";
import { aggregateSerpCompetitors } from "./aggregate";
import {
  buildCrmQuerySeeds,
  formatCrmQuerySetMarkdown,
} from "./query-seeds";
import { formatSerpCompetitorsMarkdown } from "./report";
import { SERP_COMPETITOR_FIXTURES } from "./fixtures";
import type { QuerySeed, SerpQueryResult } from "./types";
import type { SerpSearchProvider } from "./providers/types";
import {
  createFixtureSerpProvider,
  createImportSnapshotProvider,
  resolveSerpProvider,
} from "./providers/resolve";
import { SerpProviderNotConfiguredError } from "./providers/types";

export const SERP_COMPETITOR_DISCOVERY_AGENT = {
  id: "serp-competitor-discovery-agent",
  name: "SERPCompetitorDiscoveryAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};

const OUT_DIR = path.join(
  process.cwd(),
  "docs",
  "site-intelligence",
  "competitors",
);
const SNAPSHOT_DIR = path.join(OUT_DIR, "snapshots");
const LATEST_PATH = path.join(OUT_DIR, "SERP-COMPETITORS-LATEST.md");
const QUERY_SET_PATH = path.join(OUT_DIR, "CRM-QUERY-SET.md");

export type SerpCompetitorDiscoveryOptions = {
  cluster?: "crm";
  write?: boolean;
  archive?: boolean;
  /** Use built-in synthetic fixtures (tests / offline). */
  fixture?: boolean;
  /** Import previously captured SERP JSON snapshot. */
  importPath?: string;
  /** Inject provider (tests). */
  provider?: SerpSearchProvider;
  maxQueries?: number;
  resultsPerQuery?: number;
  generatedAt?: string;
  /** Delay between live API calls (ms). */
  delayMs?: number;
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runSerpCompetitorDiscoveryAgent(
  opts: SerpCompetitorDiscoveryOptions = {},
): Promise<{
  agent: typeof SERP_COMPETITOR_DISCOVERY_AGENT;
  generatedAt: string;
  seeds: QuerySeed[];
  serpResults: SerpQueryResult[];
  markdown: string;
  querySetMarkdown: string;
  paths: {
    latest?: string;
    querySet?: string;
    snapshot?: string;
    archive?: string;
  };
  providerId: string;
  live: boolean;
}> {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;
  const cluster = opts.cluster ?? "crm";
  const seeds = buildCrmQuerySeeds({ max: opts.maxQueries ?? 28 });

  let provider: SerpSearchProvider;
  if (opts.provider) {
    provider = opts.provider;
  } else if (opts.importPath) {
    const abs = path.isAbsolute(opts.importPath)
      ? opts.importPath
      : path.join(process.cwd(), opts.importPath);
    const raw = JSON.parse(fs.readFileSync(abs, "utf8")) as {
      results?: SerpQueryResult[];
    } | SerpQueryResult[];
    const results = Array.isArray(raw) ? raw : (raw.results ?? []);
    provider = createImportSnapshotProvider(results);
  } else if (opts.fixture) {
    provider = createFixtureSerpProvider(SERP_COMPETITOR_FIXTURES);
  } else {
    provider = resolveSerpProvider();
  }

  const serpResults: SerpQueryResult[] = [];
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i]!;
    // Fixture map may only cover a subset — still query all seeds
    const result = await provider.search(seed.query, {
      num: opts.resultsPerQuery ?? 10,
    });
    serpResults.push(result);
    if (provider.isLive && opts.delayMs && i < seeds.length - 1) {
      await sleep(opts.delayMs);
    }
  }

  // When using fixtures, only keep queries that returned results OR still list seeds with empty for honesty
  const report = aggregateSerpCompetitors({
    cluster,
    seeds,
    serpResults,
    generatedAt,
    provider: provider.id,
  });

  if (!provider.isLive) {
    report.notes.push(
      "Provider is not live — do not claim these domains as current SERP truth without a live/API refresh",
    );
  }

  const markdown = formatSerpCompetitorsMarkdown(report);
  const querySetMarkdown = formatCrmQuerySetMarkdown(seeds, generatedAt);
  const paths: {
    latest?: string;
    querySet?: string;
    snapshot?: string;
    archive?: string;
  } = {};

  if (write) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    fs.writeFileSync(QUERY_SET_PATH, querySetMarkdown, "utf8");
    paths.latest = path.relative(process.cwd(), LATEST_PATH);
    paths.querySet = path.relative(process.cwd(), QUERY_SET_PATH);

    const day = generatedAt.slice(0, 10);
    const snapshotPath = path.join(
      SNAPSHOT_DIR,
      `${day}-${cluster}-serp.json`,
    );
    fs.writeFileSync(
      snapshotPath,
      JSON.stringify(
        {
          generatedAt,
          cluster,
          provider: provider.id,
          live: provider.isLive,
          seeds,
          results: serpResults,
        },
        null,
        2,
      ),
      "utf8",
    );
    paths.snapshot = path.relative(process.cwd(), snapshotPath);

    if (opts.archive !== false) {
      const archivePath = path.join(
        OUT_DIR,
        "archive",
        `${day}-serp-competitors.md`,
      );
      fs.mkdirSync(path.dirname(archivePath), { recursive: true });
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }
  }

  return {
    agent: SERP_COMPETITOR_DISCOVERY_AGENT,
    generatedAt,
    seeds,
    serpResults,
    markdown,
    querySetMarkdown,
    paths,
    providerId: provider.id,
    live: provider.isLive,
  };
}

export { SerpProviderNotConfiguredError, resolveSerpProvider };
