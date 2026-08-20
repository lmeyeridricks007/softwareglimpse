import fs from "node:fs";
import path from "node:path";
import { loadContentScoreSnapshot } from "../overview/sources";
import { loadSerpCompetitorInput } from "../competitive-benchmark/load-serp";
import { buildCrmQuerySeeds } from "../serp-competitors/query-seeds";
import { SERP_COMPETITOR_FIXTURES } from "../serp-competitors/fixtures";
import { aggregateSerpCompetitors } from "../serp-competitors/aggregate";
import type { QueryBenchmark } from "../competitive-benchmark/types";
import type { QuerySeed, SerpCompetitorDiscoveryReport } from "../serp-competitors/types";
import type { ContentScoreSnapshot } from "../overview/sources";

const ROOT = process.cwd();

export type MapCoverageItem = {
  id: string;
  priority: string;
  title: string;
  path?: string;
  status: "missing" | "thin" | "optional";
};

export type BenchmarkJson = {
  generatedAt: string;
  cluster: string;
  serpSource: string;
  observationMode: string;
  benchmarks: QueryBenchmark[];
  profiles?: Array<{
    domain: string;
    type: string;
    mainStrengths: string[];
    mainWeaknesses: string[];
    learnFrom: string[];
    doNotCopy: string[];
  }>;
  notes?: string[];
};

export type GapInputs = {
  scores: ContentScoreSnapshot | null;
  serp: SerpCompetitorDiscoveryReport;
  seeds: QuerySeed[];
  benchmark: BenchmarkJson | null;
  mapMissing: MapCoverageItem[];
  mapThin: MapCoverageItem[];
  sources: Array<{ id: string; path: string; status: "available" | "missing" | "fixture" }>;
};

function abs(rel: string): string {
  return path.join(ROOT, rel);
}

function parseMapCoverage(md: string | null): {
  missing: MapCoverageItem[];
  thin: MapCoverageItem[];
} {
  const missing: MapCoverageItem[] = [];
  const thin: MapCoverageItem[] = [];
  if (!md) return { missing, thin };

  const missSection =
    md.split(/## Missing \/ not-yet-implemented/i)[1]?.split(/^## /m)[0] ?? "";
  const thinSection =
    md.split(/## Thin \/ research-required/i)[1]?.split(/^## /m)[0] ?? "";

  const lineRe =
    /^-\s+`([^`]+)`\s+\(([^)]+)\)\s+(.+?)(?:\s+—\s+`([^`]+)`)?(?:\s+—\s+.+)?$/;

  for (const line of missSection.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("- ")) continue;
    const m = t.match(lineRe);
    if (m) {
      missing.push({
        id: m[1]!,
        priority: m[2]!,
        title: m[3]!.replace(/\s+—\s+.*/, "").trim(),
        path: m[4],
        status: "missing",
      });
    }
  }
  for (const line of thinSection.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("- ")) continue;
    const m = t.match(lineRe);
    if (m) {
      thin.push({
        id: m[1]!,
        priority: m[2]!,
        title: m[3]!.replace(/\s+—\s+.*/, "").trim(),
        path: m[4],
        status: "thin",
      });
    }
  }
  return { missing, thin };
}

function loadBenchmarkJson(explicit?: string): {
  data: BenchmarkJson | null;
  path: string;
  status: "available" | "missing";
} {
  const rel =
    explicit ??
    "docs/site-intelligence/competitors/competitive-benchmark-latest.json";
  const p = path.isAbsolute(rel) ? rel : abs(rel);
  if (!fs.existsSync(p)) {
    return { data: null, path: rel, status: "missing" };
  }
  try {
    return {
      data: JSON.parse(fs.readFileSync(p, "utf8")) as BenchmarkJson,
      path: path.relative(ROOT, p),
      status: "available",
    };
  } catch {
    return { data: null, path: rel, status: "missing" };
  }
}

export function loadCompetitiveGapInputs(opts: {
  fixture?: boolean;
  serpSnapshotPath?: string;
  benchmarkJsonPath?: string;
}): GapInputs {
  const sources: GapInputs["sources"] = [];

  if (opts.fixture) {
    const seeds = buildCrmQuerySeeds({ max: 28 });
    const serpResults = seeds.map((s) => {
      const fix = SERP_COMPETITOR_FIXTURES[s.query];
      return (
        fix ?? {
          query: s.query,
          searchedAt: "2026-08-15T00:00:00.000Z",
          provider: "fixture",
          results: [],
        }
      );
    });
    const serp = aggregateSerpCompetitors({
      cluster: "crm",
      seeds,
      serpResults,
      generatedAt: "2026-08-15T00:00:00.000Z",
      provider: "fixture",
    });
    sources.push({ id: "serp", path: "serp-fixtures", status: "fixture" });
    sources.push({
      id: "benchmark",
      path: "fixture-benchmark",
      status: "fixture",
    });
    sources.push({
      id: "content-scores",
      path: "docs/content-quality/archive/scores-latest.json",
      status: fs.existsSync(abs("docs/content-quality/archive/scores-latest.json"))
        ? "available"
        : "missing",
    });
    const mapMd = fs.existsSync(
      abs("docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md"),
    )
      ? fs.readFileSync(
          abs("docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md"),
          "utf8",
        )
      : null;
    const map = parseMapCoverage(mapMd);
    sources.push({
      id: "content-map-coverage",
      path: "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md",
      status: mapMd ? "available" : "missing",
    });
    sources.push({
      id: "content-map",
      path: "docs/content-ecosystem/04-crm-master-content-map.md",
      status: fs.existsSync(
        abs("docs/content-ecosystem/04-crm-master-content-map.md"),
      )
        ? "available"
        : "missing",
    });

    return {
      scores: loadContentScoreSnapshot(),
      serp,
      seeds,
      benchmark: buildFixtureBenchmark(seeds),
      mapMissing: map.missing,
      mapThin: map.thin,
      sources,
    };
  }

  const loaded = loadSerpCompetitorInput({
    snapshotPath: opts.serpSnapshotPath,
  });
  sources.push({
    id: "serp",
    path: loaded.sourceLabel,
    status: "available",
  });
  sources.push({
    id: "serp-md",
    path: "docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md",
    status: fs.existsSync(
      abs("docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md"),
    )
      ? "available"
      : "missing",
  });

  const bench = loadBenchmarkJson(opts.benchmarkJsonPath);
  sources.push({
    id: "benchmark",
    path: bench.path,
    status: bench.status,
  });
  sources.push({
    id: "benchmark-md",
    path: "docs/site-intelligence/competitors/COMPETITIVE-BENCHMARK-LATEST.md",
    status: fs.existsSync(
      abs(
        "docs/site-intelligence/competitors/COMPETITIVE-BENCHMARK-LATEST.md",
      ),
    )
      ? "available"
      : "missing",
  });

  const scores = loadContentScoreSnapshot();
  sources.push({
    id: "content-scores",
    path: "docs/content-quality/archive/scores-latest.json",
    status: scores ? "available" : "missing",
  });
  sources.push({
    id: "content-intelligence",
    path: "docs/content-quality/CONTENT-INTELLIGENCE-LATEST.md",
    status: fs.existsSync(
      abs("docs/content-quality/CONTENT-INTELLIGENCE-LATEST.md"),
    )
      ? "available"
      : "missing",
  });

  const mapRel = "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md";
  const mapMd = fs.existsSync(abs(mapRel))
    ? fs.readFileSync(abs(mapRel), "utf8")
    : null;
  const map = parseMapCoverage(mapMd);
  sources.push({
    id: "content-map-coverage",
    path: mapRel,
    status: mapMd ? "available" : "missing",
  });
  sources.push({
    id: "content-map",
    path: "docs/content-ecosystem/04-crm-master-content-map.md",
    status: fs.existsSync(
      abs("docs/content-ecosystem/04-crm-master-content-map.md"),
    )
      ? "available"
      : "missing",
  });

  return {
    scores,
    serp: loaded.report,
    seeds: loaded.seeds,
    benchmark: bench.data,
    mapMissing: map.missing,
    mapThin: map.thin,
    sources,
  };
}

/** Minimal benchmark for offline gap analysis when no JSON exists. */
function buildFixtureBenchmark(seeds: QuerySeed[]): BenchmarkJson {
  const dim = (sg: Record<string, number>, comp: Record<string, number>) => {
    const keys = [
      "search-intent-alignment",
      "content-depth",
      "original-value",
      "evidence",
      "tools",
      "product-screenshots",
      "comparison-depth",
      "review-quality",
      "freshness",
      "ux",
      "internal-links",
      "author-trust",
      "source-transparency",
      "templates-resources",
      "calculators",
      "video",
      "content-differentiation",
    ] as const;
    return {
      sg: Object.fromEntries(keys.map((k) => [k, sg[k] ?? 60])),
      comp: Object.fromEntries(keys.map((k) => [k, comp[k] ?? 55])),
    };
  };

  const scenarios: Record<
    string,
    { sg: Record<string, number>; comp: Record<string, number> }
  > = {
    "best crm software": dim(
      {
        "search-intent-alignment": 90,
        "content-depth": 70,
        evidence: 75,
        tools: 40,
        "product-screenshots": 35,
        "comparison-depth": 80,
        "review-quality": 80,
        "original-value": 70,
        "content-differentiation": 65,
        "templates-resources": 50,
      },
      {
        "search-intent-alignment": 90,
        "content-depth": 75,
        evidence: 70,
        tools: 50,
        "product-screenshots": 80,
        "comparison-depth": 60,
        "review-quality": 70,
        "original-value": 55,
        "content-differentiation": 50,
        "templates-resources": 40,
      },
    ),
    "crm migration": dim(
      {
        "search-intent-alignment": 90,
        tools: 85,
        calculators: 40,
        "content-depth": 70,
        "product-screenshots": 40,
        evidence: 55,
      },
      {
        "search-intent-alignment": 85,
        tools: 45,
        "content-depth": 75,
        "product-screenshots": 80,
        evidence: 70,
      },
    ),
    "hubspot vs pipedrive": dim(
      {
        "search-intent-alignment": 95,
        "comparison-depth": 85,
        evidence: 70,
        tools: 30,
        "product-screenshots": 40,
      },
      {
        "search-intent-alignment": 90,
        "comparison-depth": 70,
        evidence: 55,
        tools: 40,
        "product-screenshots": 60,
      },
    ),
    "crm evaluation checklist": dim(
      {
        "search-intent-alignment": 90,
        "templates-resources": 80,
        tools: 50,
        evidence: 60,
        "content-depth": 65,
      },
      {
        "search-intent-alignment": 85,
        "templates-resources": 70,
        tools: 70,
        evidence: 55,
        "content-depth": 60,
      },
    ),
  };

  const benchmarks: QueryBenchmark[] = [];
  for (const seed of seeds) {
    const sc = scenarios[seed.query];
    if (!sc) continue;
    benchmarks.push({
      query: seed.query,
      clusterId: seed.query.includes("vs")
        ? "comparison"
        : seed.query.includes("best")
          ? "best-list"
          : seed.query.includes("migration")
            ? "migration-implementation"
            : "other",
      softwareGlimpsePage: seed.associatedPage,
      rows: [
        {
          label: "SoftwareGlimpse",
          domain: "softwareglimpse.com",
          url: `https://softwareglimpse.com${seed.associatedPage ?? "/"}`,
          dimensions: sc.sg,
          notes: [],
        },
        {
          label: "competitor",
          domain: "g2.com",
          url: "https://www.g2.com/categories/crm",
          dimensions: sc.comp,
          notes: [],
        },
        {
          label: "competitor-2",
          domain: "pcmag.com",
          url: "https://www.pcmag.com/picks/the-best-crm-software",
          dimensions: Object.fromEntries(
            Object.entries(sc.comp).map(([k, v]) => [k, Math.max(0, v - 5)]),
          ),
          notes: [],
        },
      ],
    });
  }

  return {
    generatedAt: "2026-08-15T00:00:00.000Z",
    cluster: "crm",
    serpSource: "fixture",
    observationMode: "fixture",
    benchmarks,
    profiles: [
      {
        domain: "g2.com",
        type: "software-marketplace",
        mainStrengths: ["Category taxonomy", "User review volume"],
        mainWeaknesses: ["Editorial depth varies"],
        learnFrom: ["Clear comparison UX"],
        doNotCopy: ["Pay-to-play listing dynamics"],
      },
    ],
    notes: ["Fixture benchmark for CompetitiveGapAgent"],
  };
}
