import fs from "node:fs";
import path from "node:path";
import type { WebsiteIntelligenceMode } from "./types";

const ROOT = process.cwd();

export type CollectedSource = {
  id: string;
  path: string;
  status: "available" | "missing" | "stale";
  mtimeIso?: string;
  excerpt?: string;
  notes?: string;
};

function abs(rel: string): string {
  return path.join(ROOT, rel);
}

function meta(rel: string): CollectedSource {
  const p = abs(rel);
  if (!fs.existsSync(p)) {
    return { id: rel, path: rel, status: "missing" };
  }
  const st = fs.statSync(p);
  const ageMs = Date.now() - st.mtimeMs;
  const stale = ageMs > 14 * 24 * 60 * 60 * 1000;
  return {
    id: rel,
    path: rel,
    status: stale ? "stale" : "available",
    mtimeIso: st.mtime.toISOString(),
  };
}

function read(rel: string): string | null {
  const p = abs(rel);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}

function readJson<T>(rel: string): T | null {
  const raw = read(rel);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export type CollectedIntelligence = {
  mode: WebsiteIntelligenceMode;
  sources: CollectedSource[];
  texts: {
    seoHealth: string | null;
    performance: string | null;
    internalLinks: string | null;
    contentIntelligence: string | null;
    contentQuality: string | null;
    assetIntelligence: string | null;
    resourceAudit: string | null;
    mapCoverage: string | null;
    serpCompetitors: string | null;
    competitiveBenchmark: string | null;
    competitiveGaps: string | null;
    rankingOpportunities: string | null;
    searchPerformance: string | null;
    websiteOverview: string | null;
  };
  json: {
    competitorPack: {
      competitorsSampled?: number;
      dimensions?: Array<{ id: string; score: number; reason: string }>;
      backlinkDataAvailable?: boolean;
      generatedAt?: string;
    } | null;
    competitiveGaps: {
      advantages?: Array<{ title: string; detail?: string; sgPage?: string }>;
      competitorStronger?: Array<{ title: string; detail?: string }>;
      missingTopics?: Array<{ title: string }>;
      missingTools?: Array<{ title: string }>;
      missingResources?: Array<{ title: string }>;
      topActions?: Array<{ title: string; action?: string; why?: string; page?: string }>;
    } | null;
    rankingOpportunities: {
      topStrongest?: Array<{
        query: string;
        targetPage?: string | null;
        opportunityScore: number;
        feasibility: string;
        recommendedAction: string;
      }>;
      topHardest?: Array<{
        query: string;
        targetPage?: string | null;
        opportunityScore: number;
        feasibility: string;
      }>;
      closestToBreakthrough?: Array<{
        query: string;
        targetPage?: string | null;
        opportunityScore: number;
        feasibility: string;
      }>;
      needsSubstantialUpgrade?: Array<{
        query: string;
        targetPage?: string | null;
        feasibility: string;
      }>;
      clusters?: Array<{
        label: string;
        avgScore: number;
        feasibility: string;
      }>;
      authorityMeasured?: boolean;
      visibilityAvailable?: boolean;
    } | null;
    searchPerformance: {
      live?: boolean;
      synthetic?: boolean;
      sourceMode?: string;
      nearWins?: Array<{ page: string; query?: string; position: number }>;
      ctrOpportunities?: Array<{ page: string; query?: string }>;
    } | null;
    contentScores: {
      pages?: Record<string, { score: number; band: string }>;
    } | null;
  };
};

const SOURCE_PATHS = [
  "docs/seo/reports/SEO-HEALTH-LATEST.md",
  "docs/seo/reports/performance-latest.md",
  "docs/seo/reports/internal-linking-latest.md",
  "docs/content-quality/CONTENT-INTELLIGENCE-LATEST.md",
  "docs/content-quality/CONTENT-QUALITY-LATEST.md",
  "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md",
  "docs/content-assets/ASSET-INTELLIGENCE-LATEST.md",
  "docs/content-ecosystem/resources/RESOURCE-AUDIT.md",
  "docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md",
  "docs/site-intelligence/competitors/COMPETITIVE-BENCHMARK-LATEST.md",
  "docs/site-intelligence/competitors/COMPETITIVE-GAPS-LATEST.md",
  "docs/site-intelligence/RANKING-OPPORTUNITIES-LATEST.md",
  "docs/site-intelligence/SEARCH-PERFORMANCE-LATEST.md",
  "docs/site-intelligence/WEBSITE-OVERVIEW-LATEST.md",
  "docs/site-intelligence/competitors/competitor-pack-latest.json",
] as const;

export function collectWebsiteIntelligence(
  mode: WebsiteIntelligenceMode,
): CollectedIntelligence {
  const sources = SOURCE_PATHS.map((p) => {
    const s = meta(p);
    return { ...s, id: p.split("/").pop() ?? p };
  });

  return {
    mode,
    sources,
    texts: {
      seoHealth: read("docs/seo/reports/SEO-HEALTH-LATEST.md"),
      performance: read("docs/seo/reports/performance-latest.md"),
      internalLinks: read("docs/seo/reports/internal-linking-latest.md"),
      contentIntelligence: read(
        "docs/content-quality/CONTENT-INTELLIGENCE-LATEST.md",
      ),
      contentQuality: read("docs/content-quality/CONTENT-QUALITY-LATEST.md"),
      assetIntelligence: read(
        "docs/content-assets/ASSET-INTELLIGENCE-LATEST.md",
      ),
      resourceAudit: read(
        "docs/content-ecosystem/resources/RESOURCE-AUDIT.md",
      ),
      mapCoverage: read(
        "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md",
      ),
      serpCompetitors: read(
        "docs/site-intelligence/competitors/SERP-COMPETITORS-LATEST.md",
      ),
      competitiveBenchmark: read(
        "docs/site-intelligence/competitors/COMPETITIVE-BENCHMARK-LATEST.md",
      ),
      competitiveGaps: read(
        "docs/site-intelligence/competitors/COMPETITIVE-GAPS-LATEST.md",
      ),
      rankingOpportunities: read(
        "docs/site-intelligence/RANKING-OPPORTUNITIES-LATEST.md",
      ),
      searchPerformance: read(
        "docs/site-intelligence/SEARCH-PERFORMANCE-LATEST.md",
      ),
      websiteOverview: read(
        "docs/site-intelligence/WEBSITE-OVERVIEW-LATEST.md",
      ),
    },
    json: {
      competitorPack: readJson(
        "docs/site-intelligence/competitors/competitor-pack-latest.json",
      ),
      competitiveGaps: readJson(
        "docs/site-intelligence/competitors/competitive-gaps-latest.json",
      ),
      rankingOpportunities: readJson(
        "docs/site-intelligence/ranking-opportunities-latest.json",
      ),
      searchPerformance: readJson(
        "docs/site-intelligence/search-performance-latest.json",
      ),
      contentScores: readJson(
        "docs/content-quality/archive/scores-latest.json",
      ),
    },
  };
}

export function extractBulletSection(
  md: string | null,
  heading: string,
  limit = 12,
): string[] {
  if (!md) return [];
  const re = new RegExp(`## ${heading}([\\s\\S]*?)(?=\\n## |$)`, "i");
  const block = md.match(re)?.[1] ?? "";
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .map((l) => l.replace(/^-\s+/, "").replace(/\*\*/g, ""))
    .slice(0, limit);
}

export function extractTableRows(
  md: string | null,
  heading: string,
  limit = 15,
): string[] {
  if (!md) return [];
  const re = new RegExp(`## ${heading}([\\s\\S]*?)(?=\\n## |$)`, "i");
  const block = md.match(re)?.[1] ?? "";
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !/^\|\s*---/.test(l) && !/^\|\s*#/.test(l) && !/^\|\s*Metric/.test(l) && !/^\|\s*Query/.test(l) && !/^\|\s*Cluster/.test(l) && !/^\|\s*Page/.test(l) && !/^\|\s*Source/.test(l))
    .slice(0, limit)
    .map((l) => l.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()).filter(Boolean).join(" — "));
}
