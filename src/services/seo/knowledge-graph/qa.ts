import { normalizePath, resolveCanonicalPath } from "@/seo/canonical";
import { validateInternalLinkHealth } from "@/services/internal-linking/health";
import { collectCrmOutboundEdges } from "@/services/internal-linking/outbound-graph";
import { detectSeoOrphans } from "@/services/internal-linking/orphan-detector";
import {
  adjacencyFromKnowledgeGraph,
  hubDepthFromAdjacency,
} from "./authority";
import type { KnowledgeGraph, KnowledgeGraphQaIssue } from "./types";

const MAX_MODULE_LINKS = 8;
const MAX_HUB_DEPTH = 5;

export type KnowledgeGraphQaOptions = {
  /** Skip expensive orphan/health scans (unit tests). */
  light?: boolean;
};

/**
 * Knowledge-graph QA: orphans, irrelevant/broken/redirect links,
 * duplicate nav, excessive blocks, hub depth, breadcrumb gaps.
 */
export function runKnowledgeGraphQa(
  graph: KnowledgeGraph,
  options: KnowledgeGraphQaOptions = {},
): KnowledgeGraphQaIssue[] {
  const issues: KnowledgeGraphQaIssue[] = [];
  const light = options.light === true;

  if (!light) {
    const edges = collectCrmOutboundEdges();
    const orphans = detectSeoOrphans({ edges });
    const health = validateInternalLinkHealth();

    for (const o of orphans.orphans.slice(0, 40)) {
      issues.push({
        code: "ORPHAN",
        severity: "warning",
        path: o.path,
        message: o.notes || "Indexable page with no meaningful inbound links",
      });
    }

    for (const h of health) {
      if (h.code === "BROKEN_TARGET") {
        issues.push({
          code: "BROKEN_LINK",
          severity: "error",
          path: h.from,
          relatedPath: h.to,
          message: h.message,
        });
      } else if (h.code === "REDIRECT_ALIAS") {
        issues.push({
          code: "REDIRECT_LINK",
          severity: "error",
          path: h.from,
          relatedPath: h.to,
          message: h.message,
        });
      } else if (h.code === "DUPLICATE_MODULE_HREF") {
        issues.push({
          code: "DUPLICATE_NAV",
          severity: "warning",
          path: h.from,
          relatedPath: h.to,
          message: h.message,
        });
      } else if (h.code === "DRAFT_OR_NOINDEX_TARGET") {
        // UX noindex links are allowed when useful — only flag dumps.
      }
    }

    // Excessive link blocks per source page / module
    const byFromModule = new Map<string, number>();
    for (const e of edges) {
      const key = `${normalizePath(e.from)}::${e.module}`;
      byFromModule.set(key, (byFromModule.get(key) ?? 0) + 1);
    }
    for (const [key, count] of byFromModule) {
      if (count <= MAX_MODULE_LINKS) continue;
      const [from, module] = key.split("::");
      issues.push({
        code: "EXCESSIVE_LINK_BLOCK",
        severity: "warning",
        path: from,
        message: `Module ${module} emits ${count} links (cap guidance ${MAX_MODULE_LINKS})`,
      });
    }

    // Irrelevant / redirect via outbound edges
    for (const e of edges) {
      if (normalizePath(e.from) === normalizePath(e.to)) {
        issues.push({
          code: "IRRELEVANT_LINK",
          severity: "error",
          path: e.from,
          relatedPath: e.to,
          message: "Self-referential internal link",
        });
      }
      try {
        const canonical = resolveCanonicalPath(e.to);
        if (canonical !== normalizePath(e.to)) {
          issues.push({
            code: "REDIRECT_LINK",
            severity: "warning",
            path: e.from,
            relatedPath: e.to,
            message: `Outbound target ${e.to} canonicalizes to ${canonical}`,
          });
        }
      } catch {
        // ignore
      }
    }
  }

  // Hub depth via semantic graph (fast)
  const adj = adjacencyFromKnowledgeGraph(graph);
  for (const node of graph.nodes) {
    if (node.kind === "hub") continue;
    if (!node.indexable && !node.improveLifecycle) continue;
    const depth = hubDepthFromAdjacency(node.path, adj);
    if (depth != null && depth > MAX_HUB_DEPTH) {
      issues.push({
        code: "HUB_DEPTH_TOO_DEEP",
        severity: "warning",
        path: node.path,
        message: `${depth} meaningful navigation steps from a hub (target ≤${MAX_HUB_DEPTH})`,
      });
    }
  }

  // Breadcrumb hierarchy gaps: product without category
  for (const node of graph.nodes.filter((n) => n.kind === "product")) {
    if (!node.categorySlug) {
      issues.push({
        code: "BREADCRUMB_GAP",
        severity: "warning",
        path: node.path,
        message: "Product missing primary category for breadcrumb hierarchy",
      });
    }
  }

  return issues.slice(0, 200);
}
