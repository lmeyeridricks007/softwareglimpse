import { normalizePath } from "@/seo/canonical";
import { collectCrmOutboundEdges } from "@/services/internal-linking/outbound-graph";
import {
  adjacencyFromKnowledgeGraph,
  authorityScoreForPath,
  getOrphanReport,
  hubDepthFromAdjacency,
  inboundStatsFromReport,
} from "./authority";
import type { KnowledgeGraph, ImproveInboundReport } from "./types";

export type ImproveInboundOptions = {
  limit?: number;
  /** Skip CRM outbound + orphan detector (unit tests / light CLI). */
  light?: boolean;
};

/**
 * For IMPROVE / temporary-noindex pages: find relevant referring pages,
 * inbound counts, hub depth, and suggested contextual additions (capped).
 */
export function buildImproveInboundReports(
  graph: KnowledgeGraph,
  options: ImproveInboundOptions = {},
): ImproveInboundReport[] {
  const limit = options.limit ?? 80;
  const light = options.light === true;
  const improveNodes = graph.nodes.filter((n) => n.improveLifecycle);
  const linkedFrom = new Map<string, Set<string>>();
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));

  if (!light) {
    for (const e of collectCrmOutboundEdges()) {
      const to = normalizePath(e.to);
      const from = normalizePath(e.from);
      if (!linkedFrom.has(to)) linkedFrom.set(to, new Set());
      linkedFrom.get(to)!.add(from);
    }
  } else {
    for (const e of graph.edges) {
      const fromNode = byId.get(e.from);
      const toNode = byId.get(e.to);
      if (!fromNode || !toNode) continue;
      const to = normalizePath(toNode.path);
      const from = normalizePath(fromNode.path);
      if (!linkedFrom.has(to)) linkedFrom.set(to, new Set());
      linkedFrom.get(to)!.add(from);
    }
  }

  const orphanReport = light ? null : getOrphanReport();
  const adj = adjacencyFromKnowledgeGraph(graph);
  const reports: ImproveInboundReport[] = [];

  for (const node of improveNodes) {
    const already = linkedFrom.get(normalizePath(node.path)) ?? new Set();
    const reportStats = orphanReport
      ? inboundStatsFromReport(node.path, orphanReport)
      : null;
    // Orphan detector only scans indexable sitemap URLs — IMPROVE/noindex
    // pages are absent and would falsely report 0 inbound. Prefer the
    // outbound-graph inbound set (same source as rendered link plans).
    const contentInboundCount = Math.max(
      already.size,
      reportStats?.contentInboundCount ?? 0,
    );
    const inboundCount = Math.max(
      already.size,
      reportStats?.inboundCount ?? 0,
    );
    const orphanStatus =
      contentInboundCount === 0
        ? ("orphan" as const)
        : contentInboundCount < 2
          ? ("weak" as const)
          : reportStats?.orphanStatus === "chrome-only"
            ? ("chrome-only" as const)
            : ("ok" as const);
    const depth = hubDepthFromAdjacency(node.path, adj);

    const candidates = [];
    for (const edge of graph.edges) {
      if (edge.to !== node.id && edge.from !== node.id) continue;
      const otherId = edge.from === node.id ? edge.to : edge.from;
      const other = byId.get(otherId);
      if (!other) continue;
      // Prefer indexable / hub referrers — not mutual IMPROVE dumps
      if (other.improveLifecycle && !other.indexable) continue;
      if (other.path === node.path) continue;

      const sameCategory =
        Boolean(node.categorySlug) &&
        node.categorySlug === other.categorySlug;
      const semantic =
        sameCategory ||
        edge.relation === "explains" ||
        edge.relation === "reviews" ||
        edge.relation === "compares" ||
        edge.relation === "belongs_to" ||
        edge.relation === "has_product" ||
        edge.relation === "hub_of";
      if (!semantic) continue;

      candidates.push({
        fromPath: other.path,
        fromTitle: other.title,
        relation: edge.relation,
        reason: edge.reason,
        alreadyLinked: already.has(normalizePath(other.path)),
        authorityScore: authorityScoreForPath(other.path, other),
      });
    }

    candidates.sort(
      (a, b) =>
        Number(a.alreadyLinked) - Number(b.alreadyLinked) ||
        b.authorityScore - a.authorityScore,
    );

    const suggestedAdditions = candidates
      .filter((c) => !c.alreadyLinked)
      .slice(0, 5);

    reports.push({
      path: node.path,
      title: node.title,
      inboundCount,
      contentInboundCount,
      hubDepth: depth,
      orphanStatus,
      candidates: candidates.slice(0, 12),
      suggestedAdditions,
    });
  }

  reports.sort((a, b) => {
    const orphanRank = { orphan: 0, "chrome-only": 1, weak: 2, ok: 3 };
    return (
      orphanRank[a.orphanStatus] - orphanRank[b.orphanStatus] ||
      a.contentInboundCount - b.contentInboundCount ||
      (a.hubDepth ?? 99) - (b.hubDepth ?? 99)
    );
  });

  return reports.slice(0, limit);
}
