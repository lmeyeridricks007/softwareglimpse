import fs from "node:fs";
import path from "node:path";
import { aggregateSerpCompetitors } from "../serp-competitors/aggregate";
import { buildCrmQuerySeeds } from "../serp-competitors/query-seeds";
import type {
  QuerySeed,
  SerpCompetitorDiscoveryReport,
  SerpQueryResult,
} from "../serp-competitors/types";

const COMPETITORS_DIR = path.join(
  process.cwd(),
  "docs",
  "site-intelligence",
  "competitors",
);
const SNAPSHOT_DIR = path.join(COMPETITORS_DIR, "snapshots");
const SERP_LATEST = path.join(COMPETITORS_DIR, "SERP-COMPETITORS-LATEST.md");

export type LoadedSerpInput = {
  report: SerpCompetitorDiscoveryReport;
  seeds: QuerySeed[];
  serpResults: SerpQueryResult[];
  sourceLabel: string;
};

function readSnapshot(abs: string): {
  seeds?: QuerySeed[];
  results?: SerpQueryResult[];
  generatedAt?: string;
  cluster?: string;
  provider?: string;
} {
  return JSON.parse(fs.readFileSync(abs, "utf8")) as {
    seeds?: QuerySeed[];
    results?: SerpQueryResult[];
    generatedAt?: string;
    cluster?: string;
    provider?: string;
  };
}

/** Prefer *-live.json, else newest *-crm-serp.json. */
export function findDefaultSerpSnapshot(): string | null {
  if (!fs.existsSync(SNAPSHOT_DIR)) return null;
  const files = fs
    .readdirSync(SNAPSHOT_DIR)
    .filter((f) => f.endsWith(".json") && f.includes("crm-serp"))
    .sort()
    .reverse();
  const live = files.find((f) => f.includes("-live"));
  const pick = live ?? files[0];
  return pick ? path.join(SNAPSHOT_DIR, pick) : null;
}

export function loadSerpCompetitorInput(opts: {
  snapshotPath?: string;
  requireLatestMarkdown?: boolean;
}): LoadedSerpInput {
  const snapshotPath = opts.snapshotPath
    ? path.isAbsolute(opts.snapshotPath)
      ? opts.snapshotPath
      : path.join(process.cwd(), opts.snapshotPath)
    : findDefaultSerpSnapshot();

  if (!snapshotPath || !fs.existsSync(snapshotPath)) {
    throw new Error(
      `No SERP competitor snapshot found. Run npm run site:serp-competitors first, or pass --serp-snapshot <path>. Expected under ${SNAPSHOT_DIR}`,
    );
  }

  if (opts.requireLatestMarkdown !== false && !fs.existsSync(SERP_LATEST)) {
    throw new Error(
      `Missing ${path.relative(process.cwd(), SERP_LATEST)} — run SERPCompetitorDiscoveryAgent first.`,
    );
  }

  const raw = readSnapshot(snapshotPath);
  const seeds = raw.seeds?.length
    ? raw.seeds
    : buildCrmQuerySeeds({ max: 28 });
  const serpResults = raw.results ?? [];
  const generatedAt = raw.generatedAt ?? new Date().toISOString();
  const report = aggregateSerpCompetitors({
    cluster: raw.cluster ?? "crm",
    seeds,
    serpResults,
    generatedAt,
    provider: raw.provider ?? "snapshot",
  });

  return {
    report,
    seeds,
    serpResults,
    sourceLabel: path.relative(process.cwd(), snapshotPath),
  };
}

export { SERP_LATEST, COMPETITORS_DIR };
