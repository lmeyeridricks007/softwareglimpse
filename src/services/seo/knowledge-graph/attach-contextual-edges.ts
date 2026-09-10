/**
 * Attach navigational (rendered) contextual edges to the semantic KG.
 *
 * Source of truth: the same outbound link plans used for HTML
 * (`collectCrmOutboundEdges` → builders + overlays + injections).
 * Never invents edges — only maps real from→to hrefs onto KG nodes.
 */
import { collectCrmOutboundEdges } from "@/services/internal-linking/outbound-graph";
import { normalizePath } from "@/seo/canonical";
import type { KnowledgeEdge, KnowledgeGraph } from "./types";

export function attachContextualNavigationalEdges(
  graph: KnowledgeGraph,
): KnowledgeGraph {
  const byPath = new Map(
    graph.nodes.map((n) => [normalizePath(n.path), n.id] as const),
  );
  const seen = new Set(
    graph.edges.map((e) => `${e.from}|${e.to}|${e.relation}`),
  );
  // Also skip if any semantic relation already connects the same pair.
  const pairSeen = new Set(graph.edges.map((e) => `${e.from}|${e.to}`));

  const edges: KnowledgeEdge[] = [...graph.edges];
  let added = 0;

  for (const e of collectCrmOutboundEdges({ refresh: true })) {
    const fromId = byPath.get(normalizePath(e.from));
    const toId = byPath.get(normalizePath(e.to));
    if (!fromId || !toId || fromId === toId) continue;
    const pair = `${fromId}|${toId}`;
    if (pairSeen.has(pair)) continue;
    const key = `${pair}|contextual_related`;
    if (seen.has(key)) continue;
    seen.add(key);
    pairSeen.add(pair);
    edges.push({
      from: fromId,
      to: toId,
      relation: "contextual_related",
      weight: 0.55,
      reason: `navigational:${e.module}`,
    });
    added += 1;
  }

  return {
    ...graph,
    edges,
    edgeCount: edges.length,
    // Preserve generatedAt/version from semantic build
  };
}

export function countContextualEdges(graph: KnowledgeGraph): number {
  return graph.edges.filter((e) => e.relation === "contextual_related").length;
}
