import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { normalizePath } from "@/seo/canonical";
import { collectCrmOutboundEdges, clearCrmOutboundEdgeCache } from "@/services/internal-linking/outbound-graph";
import { detectSeoOrphans } from "@/services/internal-linking/orphan-detector";
import type { KnowledgeGraph, KnowledgeNode } from "./types";

export type AuthoritySignals = {
  gscOpportunityScore: number;
  impressions: number;
  cornerstone: boolean;
  handsOnOrStrongCompare: boolean;
  researchOrTool: boolean;
};

const CORNERSTONE_PATHS = new Set(
  [
    "/categories/crm/",
    "/best/crm-software/",
    "/guides/how-to-choose-crm/",
    "/guides/what-is-crm/",
    "/research/crm-pricing/",
    "/tools/crm-finder/",
    "/tools/crm-cost-calculator/",
  ].map(normalizePath),
);

const DEFAULT_HUBS = [
  "/categories/crm/",
  "/categories/",
  "/software/",
  "/guides/",
  "/compare/",
  "/best/",
  "/tools/",
  "/research/",
  "/",
];

let gscCache: Map<string, { score: number; impressions: number }> | null = null;
let gscCacheCwd: string | null = null;
let orphanCache: ReturnType<typeof detectSeoOrphans> | null = null;
let adjCache: Map<string, Set<string>> | null = null;

function loadGscScores(
  cwd = process.cwd(),
): Map<string, { score: number; impressions: number }> {
  if (gscCache && gscCacheCwd === cwd) return gscCache;
  const map = new Map<string, { score: number; impressions: number }>();
  const file = path.join(cwd, "data/seo/gsc-opportunities.json");
  if (existsSync(file)) {
    try {
      const raw = JSON.parse(readFileSync(file, "utf8")) as {
        provenance?: { synthetic?: boolean };
        allRanked?: Array<{
          path: string;
          opportunityScore: number;
          impressions: number;
        }>;
      };
      if (!raw.provenance?.synthetic) {
        for (const row of raw.allRanked ?? []) {
          map.set(normalizePath(row.path), {
            score: row.opportunityScore,
            impressions: row.impressions,
          });
        }
      }
    } catch {
      // ignore
    }
  }
  gscCache = map;
  gscCacheCwd = cwd;
  return map;
}

/** Test / CLI helper — drop memoized graphs between runs. */
export function clearAuthorityCaches(): void {
  gscCache = null;
  gscCacheCwd = null;
  orphanCache = null;
  adjCache = null;
  // Outbound edge cache must refresh after link-injection writes.
  clearCrmOutboundEdgeCache();
}

export function getOrphanReport(): ReturnType<typeof detectSeoOrphans> {
  if (!orphanCache) orphanCache = detectSeoOrphans();
  return orphanCache;
}

export function getOutboundAdjacency(): Map<string, Set<string>> {
  if (adjCache) return adjCache;
  const adj = new Map<string, Set<string>>();
  for (const e of collectCrmOutboundEdges()) {
    const a = normalizePath(e.from);
    const b = normalizePath(e.to);
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  }
  adjCache = adj;
  return adj;
}

/** Path adjacency from semantic knowledge-graph edges (fast; no CRM plan rebuild). */
export function adjacencyFromKnowledgeGraph(
  graph: KnowledgeGraph,
): Map<string, Set<string>> {
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const adj = new Map<string, Set<string>>();
  for (const e of graph.edges) {
    const a = byId.get(e.from)?.path;
    const b = byId.get(e.to)?.path;
    if (!a || !b) continue;
    const ap = normalizePath(a);
    const bp = normalizePath(b);
    if (!adj.has(ap)) adj.set(ap, new Set());
    if (!adj.has(bp)) adj.set(bp, new Set());
    adj.get(ap)!.add(bp);
    adj.get(bp)!.add(ap);
  }
  return adj;
}

/**
 * Authority score 0–100 for link prominence (GSC + cornerstone + research/tools).
 */
export function authorityScoreForPath(
  pagePath: string,
  node?: KnowledgeNode | null,
  cwd = process.cwd(),
): number {
  const p = normalizePath(pagePath);
  const gsc = loadGscScores(cwd).get(p);
  let score = 20;
  if (gsc) {
    score += Math.min(45, gsc.score * 0.45);
    if (gsc.impressions >= 100) score += 8;
    if (gsc.impressions >= 500) score += 5;
  }
  if (CORNERSTONE_PATHS.has(p)) score += 20;
  if (node?.kind === "research" || node?.kind === "tool") score += 12;
  if (node?.kind === "best" || node?.kind === "comparison") score += 8;
  if (node?.kind === "product" && node.indexable) score += 6;
  if (node?.improveLifecycle) score -= 5; // still linkable, slightly less SEO prominence
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function loadAuthorityMap(
  graph: KnowledgeGraph,
  cwd = process.cwd(),
): Map<string, number> {
  const map = new Map<string, number>();
  for (const node of graph.nodes) {
    map.set(node.path, authorityScoreForPath(node.path, node, cwd));
  }
  return map;
}

export function hubDepthFromAdjacency(
  pagePath: string,
  adj: Map<string, Set<string>>,
  hubPaths: string[] = DEFAULT_HUBS,
): number | null {
  const target = normalizePath(pagePath);
  const hubs = new Set(hubPaths.map(normalizePath));
  if (hubs.has(target)) return 0;

  const queue: Array<{ path: string; depth: number }> = [];
  const visited = new Set<string>();
  for (const h of hubs) {
    queue.push({ path: h, depth: 0 });
    visited.add(h);
  }
  while (queue.length) {
    const cur = queue.shift()!;
    for (const next of adj.get(cur.path) ?? []) {
      if (visited.has(next)) continue;
      const depth = cur.depth + 1;
      if (next === target) return depth;
      if (depth >= 8) continue;
      visited.add(next);
      queue.push({ path: next, depth });
    }
  }
  return null;
}

/** BFS hub depth from nearest hub (null if disconnected). */
export function hubDepthForPath(
  pagePath: string,
  hubPaths: string[] = DEFAULT_HUBS,
): number | null {
  return hubDepthFromAdjacency(pagePath, getOutboundAdjacency(), hubPaths);
}

export function inboundStatsFromReport(
  pagePath: string,
  report: ReturnType<typeof detectSeoOrphans> = getOrphanReport(),
): {
  inboundCount: number;
  contentInboundCount: number;
  orphanStatus: "orphan" | "chrome-only" | "weak" | "ok";
} {
  const p = normalizePath(pagePath);
  const inboundCount = report.inboundCounts.get(p) ?? 0;
  const contentInboundCount = report.contentInboundCounts.get(p) ?? 0;
  if (report.orphans.some((o) => o.path === p)) {
    return { inboundCount, contentInboundCount, orphanStatus: "orphan" };
  }
  if (report.chromeOnly.some((o) => o.path === p)) {
    return { inboundCount, contentInboundCount, orphanStatus: "chrome-only" };
  }
  if (report.weaklyLinked.some((o) => o.path === p)) {
    return { inboundCount, contentInboundCount, orphanStatus: "weak" };
  }
  if (contentInboundCount === 0 && inboundCount === 0) {
    return { inboundCount, contentInboundCount, orphanStatus: "orphan" };
  }
  return { inboundCount, contentInboundCount, orphanStatus: "ok" };
}

export function inboundStatsForPath(pagePath: string): {
  inboundCount: number;
  contentInboundCount: number;
  orphanStatus: "orphan" | "chrome-only" | "weak" | "ok";
} {
  return inboundStatsFromReport(pagePath, getOrphanReport());
}
