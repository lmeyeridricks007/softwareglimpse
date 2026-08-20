import fs from "node:fs";
import path from "node:path";
import {
  loadContentScoreSnapshot,
  loadSeoIssuesSnapshot,
  type ContentScoreSnapshot,
} from "../overview/sources";
import { buildCrmQuerySeeds } from "../serp-competitors/query-seeds";
import type { QuerySeed } from "../serp-competitors/types";
import type { RankingOpportunitiesReport } from "../ranking-opportunities/types";
import type { CompetitiveGapReport } from "../competitive-gaps/types";
import type { BenchmarkJson } from "../competitive-gaps/load-inputs";
import type { ResolvedPage } from "./resolve-page";

const ROOT = process.cwd();

export type PageReadinessContext = {
  page: ResolvedPage;
  cq: ContentScoreSnapshot["pages"][string] | null;
  scoresAvailable: boolean;
  seeds: QuerySeed[];
  relatedSeeds: QuerySeed[];
  ranking: RankingOpportunitiesReport | null;
  relatedOpportunities: RankingOpportunitiesReport["opportunities"];
  gaps: CompetitiveGapReport | null;
  pageGaps: {
    advantages: CompetitiveGapReport["advantages"];
    weaker: CompetitiveGapReport["competitorStronger"];
    missing: CompetitiveGapReport["missingTopics"];
  };
  benchmark: BenchmarkJson | null;
  relatedBenchmarks: BenchmarkJson["benchmarks"];
  searchPerf: {
    live: boolean;
    synthetic: boolean;
    rows: Array<{
      page: string;
      query: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
  } | null;
  technicalFindings: Array<{
    id: string;
    severity?: string;
    problem?: string;
  }>;
  linkingNotes: string[];
  assetNotes: string[];
  sources: Array<{ id: string; path: string; status: string }>;
};

function abs(rel: string): string {
  return path.join(ROOT, rel);
}

function readJson<T>(rel: string): T | null {
  const p = abs(rel);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
}

function readText(rel: string): string | null {
  const p = abs(rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

function sameRoute(a: string, b: string): boolean {
  const na = a.replace(/\/$/, "").toLowerCase();
  const nb = b.replace(/\/$/, "").toLowerCase();
  return na === nb || na.endsWith(nb) || nb.endsWith(na);
}

function pageMatchesUrl(pageRoute: string, urlOrPath: string): boolean {
  try {
    const u = urlOrPath.includes("://")
      ? new URL(urlOrPath).pathname
      : urlOrPath;
    return sameRoute(pageRoute, u);
  } catch {
    return sameRoute(pageRoute, urlOrPath);
  }
}

export function loadPageReadinessContext(
  page: ResolvedPage,
): PageReadinessContext {
  const sources: PageReadinessContext["sources"] = [];
  const scores = loadContentScoreSnapshot();
  sources.push({
    id: "content-scores",
    path: "docs/content-quality/archive/scores-latest.json",
    status: scores ? "available" : "missing",
  });

  const cq =
    scores?.pages[page.route] ??
    scores?.pages[page.route.replace(/\/$/, "")] ??
    null;

  const seeds = buildCrmQuerySeeds({ max: 40 });
  const relatedSeeds = seeds.filter(
    (s) => s.associatedPage && sameRoute(s.associatedPage, page.route),
  );

  const ranking = readJson<RankingOpportunitiesReport>(
    "docs/site-intelligence/ranking-opportunities-latest.json",
  );
  sources.push({
    id: "ranking-opportunities",
    path: "docs/site-intelligence/ranking-opportunities-latest.json",
    status: ranking ? "available" : "missing",
  });
  const relatedOpportunities = (ranking?.opportunities ?? []).filter(
    (o) => o.targetPage && sameRoute(o.targetPage, page.route),
  );

  const gaps = readJson<CompetitiveGapReport>(
    "docs/site-intelligence/competitors/competitive-gaps-latest.json",
  );
  sources.push({
    id: "competitive-gaps",
    path: "docs/site-intelligence/competitors/competitive-gaps-latest.json",
    status: gaps ? "available" : "missing",
  });

  const pageGaps = {
    advantages: (gaps?.advantages ?? []).filter(
      (g) => g.sgPage && sameRoute(g.sgPage, page.route),
    ),
    weaker: (gaps?.competitorStronger ?? []).filter(
      (g) => g.sgPage && sameRoute(g.sgPage, page.route),
    ),
    missing: (gaps?.missingTopics ?? []).filter(
      (g) => g.sgPage && sameRoute(g.sgPage, page.route),
    ),
  };

  const benchmark = readJson<BenchmarkJson>(
    "docs/site-intelligence/competitors/competitive-benchmark-latest.json",
  );
  sources.push({
    id: "competitive-benchmark",
    path: "docs/site-intelligence/competitors/competitive-benchmark-latest.json",
    status: benchmark ? "available" : "missing",
  });
  const relatedBenchmarks = (benchmark?.benchmarks ?? []).filter(
    (b) =>
      (b.softwareGlimpsePage && sameRoute(b.softwareGlimpsePage, page.route)) ||
      b.rows.some((r) => pageMatchesUrl(page.route, r.url)),
  );

  const searchRaw = readJson<{
    live?: boolean;
    synthetic?: boolean;
    snapshots?: Array<{
      page: string;
      query: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
  }>("docs/site-intelligence/search-performance-latest.json");
  sources.push({
    id: "search-performance",
    path: "docs/site-intelligence/search-performance-latest.json",
    status: searchRaw ? "available" : "missing",
  });

  let searchPerf: PageReadinessContext["searchPerf"] = null;
  if (searchRaw) {
    const rows = (searchRaw.snapshots ?? []).filter((r) =>
      pageMatchesUrl(page.route, r.page),
    );
    searchPerf = {
      live: Boolean(searchRaw.live) && !searchRaw.synthetic,
      synthetic: Boolean(searchRaw.synthetic),
      rows,
    };
  }

  const issues = loadSeoIssuesSnapshot();
  sources.push({
    id: "seo-issues",
    path: "docs/seo/reports/archive/seo-issues-latest.json",
    status: issues ? "available" : "missing",
  });
  const technicalFindings = (issues?.findings ?? [])
    .filter((f) =>
      (f.affectedPages ?? []).some((p) => pageMatchesUrl(page.route, p)),
    )
    .slice(0, 12)
    .map((f) => ({
      id: f.id,
      severity: f.severity,
      problem: f.problem,
    }));

  const linkingMd = readText("docs/seo/reports/internal-linking-latest.md");
  sources.push({
    id: "internal-linking",
    path: "docs/seo/reports/internal-linking-latest.md",
    status: linkingMd ? "available" : "missing",
  });
  const linkingNotes: string[] = [];
  if (!linkingMd) {
    linkingNotes.push("Internal linking report missing");
  } else {
    linkingNotes.push("Site-wide internal linking report available");
    if (linkingMd.includes(page.route) || linkingMd.includes(page.slug)) {
      linkingNotes.push("Page path appears in linking report context");
    } else {
      linkingNotes.push(
        "No page-specific link count extracted — use cluster link recommendations",
      );
    }
  }

  const assetMd = readText("docs/content-assets/ASSET-INTELLIGENCE-LATEST.md");
  sources.push({
    id: "asset-intelligence",
    path: "docs/content-assets/ASSET-INTELLIGENCE-LATEST.md",
    status: assetMd ? "available" : "missing",
  });
  const assetNotes: string[] = [];
  if (!assetMd) assetNotes.push("Asset intelligence report missing");
  else if (assetMd.includes(page.route) || (page.contentId && assetMd.includes(page.contentId))) {
    assetNotes.push("Page/content referenced in Asset Intelligence");
  } else {
    assetNotes.push("No page-specific asset excerpt found — media scored from CQ/benchmark proxies");
  }

  sources.push({
    id: "serp-competitors",
    path: "docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md",
    status: fs.existsSync(abs("docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md"))
      ? "available"
      : "missing",
  });

  return {
    page,
    cq,
    scoresAvailable: Boolean(scores),
    seeds,
    relatedSeeds,
    ranking,
    relatedOpportunities,
    gaps,
    pageGaps,
    benchmark,
    relatedBenchmarks,
    searchPerf,
    technicalFindings,
    linkingNotes,
    assetNotes,
    sources,
  };
}
