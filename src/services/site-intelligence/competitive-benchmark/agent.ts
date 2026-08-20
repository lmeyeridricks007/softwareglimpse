import fs from "node:fs";
import path from "node:path";
import { SERP_COMPETITOR_FIXTURES } from "../serp-competitors/fixtures";
import { aggregateSerpCompetitors } from "../serp-competitors/aggregate";
import { buildCrmQuerySeeds } from "../serp-competitors/query-seeds";
import type { SerpQueryResult } from "../serp-competitors/types";
import {
  getFixtureObservation,
  softwareGlimpseFixturePage,
} from "./fixtures";
import { COMPETITORS_DIR, loadSerpCompetitorInput } from "./load-serp";
import { fetchCompetitorPage, sleep } from "./observe";
import { buildCompetitorProfile } from "./profile";
import {
  formatCompetitiveBenchmarkMarkdown,
  formatDomainProfileMarkdown,
  toCompetitorPackDimensions,
} from "./report";
import {
  sampleCompetitorClusters,
  topDomainsAcrossClusters,
  uniqueSamplePages,
} from "./sample";
import { BENCHMARK_DIMENSION_KEYS, scorePageObservation } from "./score-page";
import type {
  CompetitiveBenchmarkReport,
  CompetitorProfile,
  PageBenchmarkRow,
  PageObservation,
  QueryBenchmark,
  ScoredPage,
} from "./types";

export const COMPETITOR_WEBSITE_ANALYSIS_AGENT = {
  id: "competitor-website-analysis-agent",
  name: "CompetitorWebsiteAnalysisAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};

const LATEST_PATH = path.join(COMPETITORS_DIR, "COMPETITIVE-BENCHMARK-LATEST.md");
const ARCHIVE_DIR = path.join(COMPETITORS_DIR, "archive");
const PACK_PATH = path.join(COMPETITORS_DIR, "competitor-pack-latest.json");
const JSON_PATH = path.join(COMPETITORS_DIR, "competitive-benchmark-latest.json");

export type CompetitiveBenchmarkOptions = {
  write?: boolean;
  archive?: boolean;
  /** Use SERP fixtures + HTML fixtures (offline). */
  fixture?: boolean;
  /** Attempt live HTML fetches of representative competitor URLs. */
  live?: boolean;
  serpSnapshotPath?: string;
  maxDomains?: number;
  maxPages?: number;
  delayMs?: number;
  generatedAt?: string;
};

async function observePage(
  input: {
    url: string;
    title: string;
    query: string;
  },
  mode: "fixture" | "live",
): Promise<PageObservation> {
  if (mode === "fixture") {
    const fix = getFixtureObservation(input.url, input.query);
    if (fix) return fix;
    // Unknown fixture URL — SERP metadata-style stub from fixture HTML absence
    const { observeFromSerpMetadata } = await import("./observe");
    return observeFromSerpMetadata({
      url: input.url,
      title: input.title,
      query: input.query,
      snippet: input.title,
    });
  }
  return fetchCompetitorPage({
    url: input.url,
    title: input.title,
    query: input.query,
  });
}

function buildBenchmarks(input: {
  clusters: ReturnType<typeof sampleCompetitorClusters>;
  scoredByUrl: Map<string, ScoredPage>;
  sgByQuery: Map<string, ScoredPage>;
}): QueryBenchmark[] {
  const benchmarks: QueryBenchmark[] = [];

  for (const cluster of input.clusters) {
    for (const query of cluster.queries.slice(0, 3)) {
      const rows: PageBenchmarkRow[] = [];
      const sg = input.sgByQuery.get(query.toLowerCase());
      if (sg) {
        rows.push(toRow("SoftwareGlimpse", sg));
      }

      // Prefer one page per domain for diversity
      const comps: ScoredPage[] = [];
      const seenDomains = new Set<string>();
      for (const d of cluster.domains) {
        if (comps.length >= 3) break;
        for (const p of d.samplePages) {
          if (p.query.toLowerCase() !== query.toLowerCase()) continue;
          const scored = input.scoredByUrl.get(p.url);
          if (!scored) continue;
          if (seenDomains.has(d.domain)) continue;
          seenDomains.add(d.domain);
          comps.push(scored);
          break;
        }
      }
      // Fill from other sample pages if under 3 domains
      if (comps.length < 3) {
        for (const d of cluster.domains) {
          if (comps.length >= 3) break;
          if (seenDomains.has(d.domain)) continue;
          for (const p of d.samplePages) {
            const scored = input.scoredByUrl.get(p.url);
            if (!scored) continue;
            seenDomains.add(d.domain);
            comps.push(scored);
            break;
          }
        }
      }

      for (const c of comps.slice(0, 3)) {
        rows.push(toRow(c.observation.domain, c));
      }

      if (rows.length < 2) continue;

      benchmarks.push({
        query,
        clusterId: cluster.id,
        softwareGlimpsePage: cluster.softwareGlimpsePage,
        rows,
      });
    }
  }

  return benchmarks;
}

function toRow(label: string, scored: ScoredPage): PageBenchmarkRow {
  const dimensions: Record<string, number | null> = {};
  for (const id of BENCHMARK_DIMENSION_KEYS) {
    dimensions[id] =
      scored.dimensions.find((d) => d.id === id)?.score ?? null;
  }
  return {
    label,
    domain: scored.observation.domain,
    url: scored.observation.url,
    dimensions,
    notes: scored.observation.notes ?? [],
  };
}

export async function runCompetitorWebsiteAnalysisAgent(
  opts: CompetitiveBenchmarkOptions = {},
): Promise<{
  agent: typeof COMPETITOR_WEBSITE_ANALYSIS_AGENT;
  generatedAt: string;
  report: CompetitiveBenchmarkReport;
  markdown: string;
  domainMarkdown: Record<string, string>;
  paths: {
    latest?: string;
    domains?: string[];
    archive?: string;
    pack?: string;
    json?: string;
  };
}> {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;
  const fixture = opts.fixture === true || opts.live !== true;
  // Default offline-safe: fixture unless --live explicitly requested
  const mode: "fixture" | "live" = opts.live ? "live" : "fixture";

  let serpSource: string;
  let reportAgg: ReturnType<typeof aggregateSerpCompetitors>;

  if (opts.fixture && !opts.serpSnapshotPath) {
    const seeds = buildCrmQuerySeeds({ max: 28 });
    const serpResults: SerpQueryResult[] = seeds.map((s) => {
      const fix = SERP_COMPETITOR_FIXTURES[s.query];
      return (
        fix ?? {
          query: s.query,
          searchedAt: generatedAt,
          provider: "fixture",
          results: [],
        }
      );
    });
    reportAgg = aggregateSerpCompetitors({
      cluster: "crm",
      seeds,
      serpResults,
      generatedAt,
      provider: "fixture",
    });
    serpSource = "serp-fixtures";
  } else {
    const loaded = loadSerpCompetitorInput({
      snapshotPath: opts.serpSnapshotPath,
    });
    reportAgg = loaded.report;
    serpSource = loaded.sourceLabel;
  }

  const clusters = sampleCompetitorClusters(reportAgg, {
    minDomainsPerCluster: 3,
    maxDomainsPerCluster: opts.maxDomains ?? 8,
    maxPagesPerDomain: 2,
  });

  const maxDomains = opts.maxDomains ?? 8;
  const focusDomains = topDomainsAcrossClusters(
    clusters,
    reportAgg.domains,
    maxDomains,
  );

  // One representative page per focus domain first, then fill remaining budget
  const allPages = uniqueSamplePages(clusters, 48);
  const pagesToFetch: typeof allPages = [];
  const seenUrl = new Set<string>();
  for (const domain of focusDomains) {
    const hit = allPages.find((p) => p.domain === domain && !seenUrl.has(p.url));
    if (!hit) continue;
    seenUrl.add(hit.url);
    pagesToFetch.push(hit);
  }
  for (const p of allPages) {
    if (pagesToFetch.length >= (opts.maxPages ?? 24)) break;
    if (seenUrl.has(p.url)) continue;
    if (!focusDomains.includes(p.domain)) continue;
    seenUrl.add(p.url);
    pagesToFetch.push(p);
  }

  const scoredByUrl = new Map<string, ScoredPage>();
  const observations: PageObservation[] = [];
  let liveOk = 0;
  let liveFail = 0;

  for (let i = 0; i < pagesToFetch.length; i++) {
    const p = pagesToFetch[i]!;
    const obs = await observePage(
      { url: p.url, title: p.title, query: p.query },
      mode,
    );
    observations.push(obs);
    if (obs.source === "live-html") liveOk += 1;
    if (obs.error) liveFail += 1;
    scoredByUrl.set(p.url, scorePageObservation(obs));
    if (mode === "live" && opts.delayMs && i < pagesToFetch.length - 1) {
      await sleep(opts.delayMs);
    }
  }

  // SoftwareGlimpse proxy pages for key queries
  const sgByQuery = new Map<string, ScoredPage>();
  for (const c of clusters) {
    for (const q of c.queries.slice(0, 2)) {
      const pagePath = c.softwareGlimpsePage ?? "/";
      const obs = softwareGlimpseFixturePage(pagePath, q);
      sgByQuery.set(q.toLowerCase(), scorePageObservation(obs));
    }
  }

  const profiles: CompetitorProfile[] = [];
  for (const domain of focusDomains) {
    const domainPages = [...scoredByUrl.values()].filter(
      (s) => s.observation.domain === domain,
    );
    if (!domainPages.length) continue;
    const meta = reportAgg.domains.find((d) => d.domain === domain);
    const typeFromCluster = clusters
      .flatMap((c) => c.domains)
      .find((d) => d.domain === domain);
    profiles.push(
      buildCompetitorProfile({
        domain,
        type: meta?.type ?? typeFromCluster?.type ?? "other",
        significance:
          meta?.significance ?? typeFromCluster?.significance ?? "query-specific",
        pages: domainPages,
        clusters,
      }),
    );
  }
  profiles.sort((a, b) => a.domain.localeCompare(b.domain));

  const benchmarks = buildBenchmarks({
    clusters,
    scoredByUrl,
    sgByQuery,
  });

  const observationMode: CompetitiveBenchmarkReport["observationMode"] =
    mode === "fixture"
      ? "fixture"
      : liveFail > 0 && liveOk > 0
        ? "mixed"
        : liveOk > 0
          ? "live"
          : "mixed";

  const report: CompetitiveBenchmarkReport = {
    generatedAt,
    cluster: reportAgg.cluster,
    serpSource,
    observationMode,
    domainsSampled: profiles.length,
    pagesSampled: scoredByUrl.size,
    clusters,
    profiles,
    benchmarks,
    softwareGlimpseNotes: [
      "SoftwareGlimpse benchmark rows use a local structural proxy by page type (tools/methodology/disclosure patterns), not a claim of live production HTML unless separately fetched.",
      "Prefer comparing decision criteria, checklists, and trade-off depth — not marketplace review volume.",
    ],
    disclaimers: [
      "Only externally observable aspects assessed.",
      "Do not claim traffic, conversion, backlinks, domain authority, or revenue from this report.",
      "Representative page sample only — not a full competitor-site crawl.",
      "SERP competitor inputs go stale; refresh SERPCompetitorDiscoveryAgent before re-benchmarking.",
    ],
    notes: [
      `Observation mode: ${observationMode}`,
      mode === "live"
        ? `Live fetches: ok=${liveOk}, fallback/errors=${liveFail}`
        : "Fixture HTML observations — not live competitor claims",
      `Query clusters sampled: ${clusters.map((c) => c.id).join(", ")}`,
      fixture && mode === "fixture"
        ? "Run with --live to fetch representative competitor HTML"
        : "Limited fetch budget applied",
    ],
  };

  const markdown = formatCompetitiveBenchmarkMarkdown(report);
  const domainMarkdown: Record<string, string> = {};
  for (const p of profiles) {
    domainMarkdown[p.domain] = formatDomainProfileMarkdown(p, generatedAt);
  }

  const paths: {
    latest?: string;
    domains?: string[];
    archive?: string;
    pack?: string;
    json?: string;
  } = {};

  if (write) {
    fs.mkdirSync(COMPETITORS_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.latest = path.relative(process.cwd(), LATEST_PATH);

    const domainPaths: string[] = [];
    const writtenDomains = new Set(Object.keys(domainMarkdown));
    for (const [domain, md] of Object.entries(domainMarkdown)) {
      const fp = path.join(COMPETITORS_DIR, `${domain}.md`);
      fs.writeFileSync(fp, md, "utf8");
      domainPaths.push(path.relative(process.cwd(), fp));
    }
    // Remove stale per-domain profiles from prior runs
    for (const name of fs.readdirSync(COMPETITORS_DIR)) {
      if (!name.endsWith(".md")) continue;
      if (
        [
          "COMPETITIVE-BENCHMARK-LATEST.md",
          "SERP-COMPETITORS-LATEST.md",
          "CRM-QUERY-SET.md",
          "README.md",
        ].includes(name)
      ) {
        continue;
      }
      const domain = name.replace(/\.md$/, "");
      if (!writtenDomains.has(domain) && domain.includes(".")) {
        fs.unlinkSync(path.join(COMPETITORS_DIR, name));
      }
    }
    paths.domains = domainPaths;

    const pack = {
      clusterId: report.cluster,
      competitorsSampled: report.domainsSampled,
      dimensions: toCompetitorPackDimensions(report),
      strongerThan: [],
      weakerThan: [],
      notes: report.notes,
      backlinkDataAvailable: false,
      generatedAt,
    };
    fs.writeFileSync(PACK_PATH, JSON.stringify(pack, null, 2), "utf8");
    paths.pack = path.relative(process.cwd(), PACK_PATH);

    fs.writeFileSync(
      JSON_PATH,
      JSON.stringify(
        {
          generatedAt,
          cluster: report.cluster,
          serpSource: report.serpSource,
          observationMode: report.observationMode,
          domainsSampled: report.domainsSampled,
          pagesSampled: report.pagesSampled,
          clusters: report.clusters,
          profiles: report.profiles.map((p) => ({
            domain: p.domain,
            type: p.type,
            significance: p.significance,
            mainStrengths: p.mainStrengths,
            mainWeaknesses: p.mainWeaknesses,
            learnFrom: p.learnFrom,
            doNotCopy: p.doNotCopy,
            topicsStrong: p.topicsStrong,
            topicsWeak: p.topicsWeak,
            pagesAnalyzed: p.pagesAnalyzed.map((page) => ({
              url: page.observation.url,
              title: page.observation.title,
              pageType: page.observation.pageType,
              query: page.observation.query,
              overall: page.overall,
              dimensions: Object.fromEntries(
                page.dimensions
                  .filter((d) => d.score != null)
                  .map((d) => [d.id, d.score]),
              ),
            })),
          })),
          benchmarks: report.benchmarks,
          notes: report.notes,
          disclaimers: report.disclaimers,
        },
        null,
        2,
      ),
      "utf8",
    );
    paths.json = path.relative(process.cwd(), JSON_PATH);

    if (opts.archive !== false) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-competitive-benchmark.md`,
      );
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }
  }

  return {
    agent: COMPETITOR_WEBSITE_ANALYSIS_AGENT,
    generatedAt,
    report,
    markdown,
    domainMarkdown,
    paths,
  };
}
