/**
 * PageRankingReadinessAgent contracts.
 * Relative readiness / feasibility only — never a ranking promise.
 */
import type { FeasibilityBand } from "../ranking-opportunities/types";

export type ReadinessConfidence = "high" | "medium" | "low";

export type CompetitorStance = "better" | "equal" | "weaker" | "unknown";

export type PageReadinessDimensionId =
  | "target-intent"
  | "query-coverage"
  | "technical-status"
  | "indexability"
  | "content-quality"
  | "content-depth"
  | "original-value"
  | "evidence"
  | "media"
  | "tools-resources"
  | "internal-links"
  | "cluster-support"
  | "freshness"
  | "search-performance"
  | "serp-competitors"
  | "competitor-page-quality"
  | "authority-limitation";

export type PageReadinessDimension = {
  id: PageReadinessDimensionId;
  label: string;
  score: number | null;
  status: "scored" | "not-measured" | "not-available" | "not-connected";
  summary: string;
};

export type CompetitorBenchmarkRow = {
  url: string;
  domain: string;
  title?: string;
  query: string;
  stance: CompetitorStance;
  sgBetter: string[];
  equal: string[];
  weaker: string[];
  notes: string[];
};

export type ImprovementBucket = {
  mustDo: string[];
  shouldDo: string[];
  optional: string[];
  avoid: string[];
};

export type PageRankingReadinessReport = {
  generatedAt: string;
  agentVersion: string;
  route: string;
  slug: string;
  contentId: string | null;
  title: string | null;
  pageType: string | null;
  existsInCatalog: boolean;
  existsInScores: boolean;
  targetIntent: string;
  targetQueries: string[];
  rankingReadiness: number;
  feasibility: FeasibilityBand;
  confidence: ReadinessConfidence;
  confidenceReasons: string[];
  strong: string[];
  weak: string[];
  dimensions: PageReadinessDimension[];
  improvements: ImprovementBucket;
  competitors: CompetitorBenchmarkRow[];
  authorityLimitation: string;
  searchPerformanceNote: string;
  relatedOpportunityScores: Array<{
    query: string;
    opportunityScore: number;
    feasibility: string;
  }>;
  sources: Array<{ id: string; path: string; status: string }>;
  disclaimers: string[];
};

export function routeToSlug(route: string): string {
  return route
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "page";
}

export function normalizeRoute(input: string): string {
  let s = input.trim();
  if (!s) return "/";
  // content id forms: software:pipedrive, guide:how-to-choose-crm, res-crm-evaluation-checklist
  if (!s.includes("/") && s.includes(":")) {
    const [kind, id] = s.split(":", 2);
    const map: Record<string, string> = {
      software: "software",
      product: "software",
      guide: "guides",
      guides: "guides",
      resource: "resources",
      resources: "resources",
      best: "best",
      compare: "compare",
      comparison: "compare",
      tool: "tools",
      tools: "tools",
      industry: "industries",
      industries: "industries",
      "use-case": "use-cases",
      capability: "capabilities",
    };
    const prefix = map[kind!.toLowerCase()] ?? kind!.toLowerCase();
    s = `/${prefix}/${id}/`;
  } else if (/^res-/.test(s) && !s.includes("/")) {
    s = `/resources/${s.replace(/^res-/, "")}/`;
  } else if (!s.startsWith("/") && !s.startsWith("http")) {
    // bare slug heuristic
    if (s.includes("-vs-")) s = `/compare/${s}/`;
    else s = `/${s}/`;
  }
  s = s.replace(/^https?:\/\/(www\.)?softwareglimpse\.com/i, "");
  if (!s.startsWith("/")) s = `/${s}`;
  if (!s.endsWith("/")) s = `${s}/`;
  // collapse double slashes except leading
  s = s.replace(/\/{2,}/g, "/");
  return s;
}
