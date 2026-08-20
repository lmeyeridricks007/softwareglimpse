import fs from "node:fs";
import path from "node:path";
import {
  loadContentScoreSnapshot,
  loadSeoIssuesSnapshot,
  type ContentScoreSnapshot,
} from "../overview/sources";
import { loadSerpCompetitorInput } from "../competitive-benchmark/load-serp";
import type { BenchmarkJson } from "../competitive-gaps/load-inputs";
import { loadCompetitiveGapInputs } from "../competitive-gaps/load-inputs";
import type { CompetitiveGapReport } from "../competitive-gaps/types";
import { buildCrmQuerySeeds } from "../serp-competitors/query-seeds";
import { SERP_COMPETITOR_FIXTURES } from "../serp-competitors/fixtures";
import { aggregateSerpCompetitors } from "../serp-competitors/aggregate";
import type {
  QuerySeed,
  SerpCompetitorDiscoveryReport,
} from "../serp-competitors/types";
import { loadSearchVisibilityMetricsFile } from "../search-performance";

const ROOT = process.cwd();

export type RankingOppSource = {
  id: string;
  path: string;
  status: "available" | "missing" | "fixture" | "unavailable";
};

export type RankingOppInputs = {
  scores: ContentScoreSnapshot | null;
  serp: SerpCompetitorDiscoveryReport;
  seeds: QuerySeed[];
  benchmark: BenchmarkJson | null;
  gaps: CompetitiveGapReport | null;
  mapMissing: Array<{ id: string; priority: string; title: string; path?: string }>;
  mapThin: Array<{ id: string; priority: string; title: string; path?: string }>;
  technicalScoreProxy: number | null;
  technicalNotes: string[];
  linkingNotes: string[];
  visibilityAvailable: boolean;
  authorityMeasured: boolean;
  sources: RankingOppSource[];
};

function abs(rel: string): string {
  return path.join(ROOT, rel);
}

function readIf(rel: string): string | null {
  const p = abs(rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

function technicalProxy(): { score: number | null; notes: string[] } {
  const issues = loadSeoIssuesSnapshot();
  const health = readIf("docs/seo/reports/SEO-HEALTH-LATEST.md");
  const notes: string[] = [];
  if (!issues && !health) {
    return { score: null, notes: ["Technical health reports missing"] };
  }
  const findingCount = issues?.findings?.length ?? 0;
  const p0 = (issues?.findings ?? []).filter(
    (f) => (f.severity ?? "").toLowerCase() === "p0" || (f.severity ?? "").toLowerCase() === "critical",
  ).length;
  // Rough readiness: fewer critical findings → higher readiness
  let score = 78;
  if (findingCount > 100) score -= 15;
  else if (findingCount > 40) score -= 8;
  if (p0 > 0) score -= Math.min(25, p0 * 5);
  if (health?.includes("FAST") && findingCount === 0) {
    notes.push("SEO-HEALTH may be FAST/stale vs issues snapshot — readiness is a proxy");
    score = Math.min(score, 65);
  }
  notes.push(
    `Technical readiness proxy from ${findingCount} SEO findings (${p0} critical/P0-ish)`,
  );
  return { score: Math.max(25, Math.min(95, score)), notes };
}

function linkingNotes(): string[] {
  const md = readIf("docs/seo/reports/internal-linking-latest.md");
  if (!md) return ["Internal linking report missing — link support scored cautiously"];
  const notes = ["Internal linking report available"];
  if (/orphan/i.test(md)) notes.push("Orphan/link-gap language present in linking report");
  if (/incomplete|gap|missing/i.test(md)) {
    notes.push("Linking report mentions gaps/incomplete coverage");
  }
  return notes;
}

function loadGapsJson(): CompetitiveGapReport | null {
  const p = abs(
    "docs/site-intelligence/competitors/competitive-gaps-latest.json",
  );
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as CompetitiveGapReport;
  } catch {
    return null;
  }
}

function loadBenchmarkJson(): BenchmarkJson | null {
  const p = abs(
    "docs/site-intelligence/competitors/competitive-benchmark-latest.json",
  );
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as BenchmarkJson;
  } catch {
    return null;
  }
}

export function loadRankingOpportunityInputs(opts: {
  fixture?: boolean;
  serpSnapshotPath?: string;
}): RankingOppInputs {
  const sources: RankingOppSource[] = [];
  const tech = technicalProxy();
  const linking = linkingNotes();

  if (opts.fixture) {
    const gapInputs = loadCompetitiveGapInputs({ fixture: true });
    sources.push(
      { id: "serp", path: "serp-fixtures", status: "fixture" },
      { id: "benchmark", path: "fixture-benchmark", status: "fixture" },
      {
        id: "gaps",
        path: "fixture-gaps",
        status: "fixture",
      },
      {
        id: "content-scores",
        path: "docs/content-quality/archive/scores-latest.json",
        status: gapInputs.scores ? "available" : "missing",
      },
      {
        id: "content-map-coverage",
        path: "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md",
        status: gapInputs.mapMissing.length || gapInputs.mapThin.length
          ? "available"
          : "missing",
      },
      {
        id: "technical",
        path: "docs/seo/reports/archive/seo-issues-latest.json",
        status: tech.score != null ? "available" : "missing",
      },
      {
        id: "internal-linking",
        path: "docs/seo/reports/internal-linking-latest.md",
        status: fs.existsSync(abs("docs/seo/reports/internal-linking-latest.md"))
          ? "available"
          : "missing",
      },
      {
        id: "search-visibility",
        path: "GSC / search performance",
        status: "unavailable",
      },
      {
        id: "authority-backlinks",
        path: "backlink / domain metrics",
        status: "unavailable",
      },
    );

    const seeds = buildCrmQuerySeeds({ coverage: "full" });
    const serpResults = seeds.slice(0, 28).map((s) => {
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
      seeds: seeds.slice(0, 28),
      serpResults,
      generatedAt: "2026-08-15T00:00:00.000Z",
      provider: "fixture",
    });

    return {
      scores: gapInputs.scores,
      serp,
      seeds,
      benchmark: gapInputs.benchmark,
      gaps: null,
      mapMissing: gapInputs.mapMissing,
      mapThin: gapInputs.mapThin,
      technicalScoreProxy: tech.score ?? 70,
      technicalNotes: tech.notes,
      linkingNotes: linking,
      visibilityAvailable: false,
      authorityMeasured: false,
      sources,
    };
  }

  const loaded = loadSerpCompetitorInput({
    snapshotPath: opts.serpSnapshotPath,
  });
  sources.push({ id: "serp", path: loaded.sourceLabel, status: "available" });

  const benchmark = loadBenchmarkJson();
  sources.push({
    id: "benchmark",
    path: "docs/site-intelligence/competitors/competitive-benchmark-latest.json",
    status: benchmark ? "available" : "missing",
  });

  const gaps = loadGapsJson();
  sources.push({
    id: "gaps",
    path: "docs/site-intelligence/competitors/competitive-gaps-latest.json",
    status: gaps ? "available" : "missing",
  });

  const scores = loadContentScoreSnapshot();
  sources.push({
    id: "content-scores",
    path: "docs/content-quality/archive/scores-latest.json",
    status: scores ? "available" : "missing",
  });

  const gapInputs = loadCompetitiveGapInputs({
    serpSnapshotPath: opts.serpSnapshotPath,
  });
  sources.push({
    id: "content-map-coverage",
    path: "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md",
    status:
      gapInputs.mapMissing.length || gapInputs.mapThin.length
        ? "available"
        : "missing",
  });
  sources.push({
    id: "technical",
    path: "docs/seo/reports/archive/seo-issues-latest.json",
    status: tech.score != null ? "available" : "missing",
  });
  sources.push({
    id: "internal-linking",
    path: "docs/seo/reports/internal-linking-latest.md",
    status: fs.existsSync(abs("docs/seo/reports/internal-linking-latest.md"))
      ? "available"
      : "missing",
  });
  sources.push({
    id: "search-visibility",
    path: "GSC / search performance",
    status: "unavailable",
  });
  sources.push({
    id: "authority-backlinks",
    path: "backlink / domain metrics",
    status: "unavailable",
  });

  // Prefer derived visibility metrics from SearchPerformanceAgent when live/import
  let visibilityAvailable = false;
  const vis = loadSearchVisibilityMetricsFile();
  if (vis && vis.live && !vis.synthetic) {
    visibilityAvailable = true;
    sources.push({
      id: "search-visibility-metrics",
      path: "docs/site-intelligence/search-visibility-metrics-latest.json",
      status: "available",
    });
    const idx = sources.findIndex((s) => s.id === "search-visibility");
    if (idx >= 0) sources[idx]!.status = "available";
  }

  // Full CRM catalogue seeds for ranking — not the bounded SERP discovery set
  const seeds = buildCrmQuerySeeds({ coverage: "full" });
  sources.push({
    id: "crm-catalogue-seeds",
    path: "buildCrmQuerySeeds({ coverage: \"full\" })",
    status: "available",
  });

  return {
    scores,
    serp: loaded.report,
    seeds,
    benchmark,
    gaps,
    mapMissing: gapInputs.mapMissing,
    mapThin: gapInputs.mapThin,
    technicalScoreProxy: tech.score,
    technicalNotes: tech.notes,
    linkingNotes: linking,
    visibilityAvailable,
    authorityMeasured: false,
    sources,
  };
}
