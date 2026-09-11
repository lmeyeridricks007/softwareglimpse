import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getCapabilities,
  getCategories,
  getIndustries,
  getSoftware,
  getUseCases,
} from "@/data";
import { getGuides } from "@/data/repositories/guides";
import { getRoutableTools } from "@/data/config/tools/registry";
import { listFeatureDetailParams } from "@/data/feature-detail";
import { isEntityIndexable } from "@/domain/quality-gates";
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";
import { normalizePath } from "@/seo/canonical";
import {
  KNOWLEDGE_GRAPH_VERSION,
  type KnowledgeEdge,
  type KnowledgeGraph,
  type KnowledgeNode,
  type KnowledgeRelation,
} from "./types";

function nodeId(kind: KnowledgeNode["kind"], slug: string): string {
  return `${kind}:${slug}`;
}

function ensureSlash(p: string): string {
  return normalizePath(p);
}

function isImproveGuide(slug: string, indexable: boolean): boolean {
  const life = getLifecycleOverrideState("guide", slug);
  if (life === "IMPROVE" || life === "IMPROVING" || life === "INDEXABLE_READY") {
    return true;
  }
  return !indexable;
}

function isImproveComparison(slug: string, indexable: boolean): boolean {
  const life = getLifecycleOverrideState("comparison", slug);
  if (life === "IMPROVE" || life === "IMPROVING" || life === "INDEXABLE_READY") {
    return true;
  }
  return !indexable;
}

function pushEdge(
  edges: KnowledgeEdge[],
  seen: Set<string>,
  from: string,
  to: string,
  relation: KnowledgeRelation,
  weight: number,
  reason: string,
): void {
  if (!from || !to || from === to) return;
  const key = `${from}|${to}|${relation}`;
  if (seen.has(key)) return;
  seen.add(key);
  edges.push({ from, to, relation, weight, reason });
}

/**
 * Build the semantic content knowledge graph from catalogue entities.
 * Relationships are typed (category↔product↔guides↔compare↔tools…), not random.
 */
export function buildKnowledgeGraph(): KnowledgeGraph {
  const nodes: KnowledgeNode[] = [];
  const edges: KnowledgeEdge[] = [];
  const seen = new Set<string>();
  const byId = new Map<string, KnowledgeNode>();

  const addNode = (node: KnowledgeNode) => {
    if (byId.has(node.id)) return;
    byId.set(node.id, node);
    nodes.push(node);
  };

  // Hubs
  for (const [slug, path, title] of [
    ["categories", "/categories/", "Categories"],
    ["software", "/software/", "Software"],
    ["guides", "/guides/", "Guides"],
    ["compare", "/compare/", "Comparisons"],
    ["best", "/best/", "Best software"],
    ["tools", "/tools/", "Tools"],
    ["research", "/research/", "Research"],
  ] as const) {
    addNode({
      id: nodeId("hub", slug),
      kind: "hub",
      slug,
      path,
      title,
      categorySlug: null,
      indexable: true,
      improveLifecycle: false,
    });
  }

  for (const cat of getCategories()) {
    const path = ensureSlash(
      cat.seo.canonicalPath || `/categories/${cat.path.join("/")}/`,
    );
    const indexable = isEntityIndexable({ kind: "category", entity: cat });
    const id = nodeId("category", cat.slug);
    addNode({
      id,
      kind: "category",
      slug: cat.slug,
      path,
      title: cat.name,
      categorySlug: cat.slug,
      indexable,
      improveLifecycle: false,
    });
    pushEdge(
      edges,
      seen,
      nodeId("hub", "categories"),
      id,
      "hub_of",
      100,
      "Category listing hub",
    );
  }

  for (const soft of getSoftware({ includeUnpublished: true })) {
    const indexable = isEntityIndexable({ kind: "software", entity: soft });
    const id = nodeId("product", soft.slug);
    addNode({
      id,
      kind: "product",
      slug: soft.slug,
      path: `/software/${soft.slug}/`,
      title: soft.name,
      categorySlug: soft.primaryCategorySlug ?? null,
      indexable,
      improveLifecycle: !indexable,
    });
    if (soft.primaryCategorySlug) {
      pushEdge(
        edges,
        seen,
        nodeId("category", soft.primaryCategorySlug),
        id,
        "has_product",
        90,
        "Primary category membership",
      );
      pushEdge(
        edges,
        seen,
        id,
        nodeId("category", soft.primaryCategorySlug),
        "belongs_to",
        90,
        "Product belongs to category",
      );
    }
    pushEdge(
      edges,
      seen,
      nodeId("hub", "software"),
      id,
      "hub_of",
      70,
      "Software catalogue hub",
    );
  }

  for (const guide of getGuides({ includeUnpublished: true })) {
    const indexable = isEntityIndexable({ kind: "guide", entity: guide });
    const id = nodeId("guide", guide.slug);
    const categorySlug = guide.categorySlugs[0] ?? null;
    addNode({
      id,
      kind: "guide",
      slug: guide.slug,
      path: `/guides/${guide.slug}/`,
      title: guide.title,
      categorySlug,
      indexable,
      improveLifecycle: isImproveGuide(guide.slug, indexable),
    });
    if (categorySlug) {
      pushEdge(
        edges,
        seen,
        id,
        nodeId("category", categorySlug),
        "belongs_to",
        85,
        "Guide category",
      );
    }
    for (const productSlug of guide.productSlugs.slice(0, 4)) {
      const topic = (guide.topicType || "").toLowerCase();
      const relation: KnowledgeRelation =
        topic.includes("what-is") || guide.slug.startsWith("what-is-")
          ? "explains"
          : "reviews";
      pushEdge(
        edges,
        seen,
        id,
        nodeId("product", productSlug),
        relation,
        80,
        "Guide ↔ product",
      );
    }
    pushEdge(
      edges,
      seen,
      nodeId("hub", "guides"),
      id,
      "hub_of",
      60,
      "Guides hub",
    );
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    const indexable = isEntityIndexable({
      kind: "comparison",
      entity: comparison,
    });
    const id = nodeId("comparison", comparison.slug);
    addNode({
      id,
      kind: "comparison",
      slug: comparison.slug,
      path: `/compare/${comparison.slug}/`,
      title: comparison.title,
      categorySlug: comparison.categorySlug ?? null,
      indexable,
      improveLifecycle: isImproveComparison(comparison.slug, indexable),
    });
    for (const productSlug of comparison.productSlugs.slice(0, 2)) {
      pushEdge(
        edges,
        seen,
        id,
        nodeId("product", productSlug),
        "compares",
        88,
        "Comparison product",
      );
      pushEdge(
        edges,
        seen,
        nodeId("product", productSlug),
        id,
        "compares",
        75,
        "Product has comparison",
      );
    }
    if (comparison.categorySlug) {
      pushEdge(
        edges,
        seen,
        id,
        nodeId("category", comparison.categorySlug),
        "belongs_to",
        70,
        "Comparison category",
      );
    }
  }

  for (const alt of getAllAlternativesUnfiltered()) {
    const indexable = isEntityIndexable({ kind: "alternatives", entity: alt });
    const id = nodeId("alternatives", alt.slug);
    addNode({
      id,
      kind: "alternatives",
      slug: alt.slug,
      path: `/alternatives/${alt.slug}/`,
      title: alt.title,
      categorySlug: null,
      indexable,
      improveLifecycle: !indexable,
    });
    pushEdge(
      edges,
      seen,
      id,
      nodeId("product", alt.sourceSlug),
      "alternative_to",
      90,
      "Alternatives for source product",
    );
  }

  for (const best of getAllBestPagesUnfiltered()) {
    const indexable = isEntityIndexable({ kind: "best", entity: best });
    const id = nodeId("best", best.slug);
    addNode({
      id,
      kind: "best",
      slug: best.slug,
      path: `/best/${best.slug}/`,
      title: best.title,
      categorySlug: best.categorySlug ?? null,
      indexable,
      improveLifecycle: !indexable,
    });
    if (best.categorySlug) {
      pushEdge(
        edges,
        seen,
        id,
        nodeId("category", best.categorySlug),
        "best_for_category",
        95,
        "Best page for category",
      );
    }
  }

  for (const uc of getUseCases()) {
    const indexable = uc.seo?.indexable === true;
    const id = nodeId("use_case", uc.slug);
    addNode({
      id,
      kind: "use_case",
      slug: uc.slug,
      path: `/use-cases/${uc.slug}/`,
      title: uc.name,
      categorySlug: uc.categorySlugs?.[0] ?? null,
      indexable,
      improveLifecycle: !indexable,
    });
    for (const cat of uc.categorySlugs?.slice(0, 2) ?? []) {
      pushEdge(
        edges,
        seen,
        id,
        nodeId("category", cat),
        "relevant_to_use_case",
        70,
        "Use case category",
      );
    }
  }

  for (const cap of getCapabilities()) {
    const indexable = cap.seo?.indexable === true;
    const id = nodeId("capability", cap.slug);
    addNode({
      id,
      kind: "capability",
      slug: cap.slug,
      path: `/capabilities/${cap.slug}/`,
      title: cap.name,
      categorySlug: cap.categorySlugs?.[0] ?? null,
      indexable,
      improveLifecycle: !indexable,
    });
  }

  for (const feat of listFeatureDetailParams()) {
    const id = nodeId("feature", feat.slug);
    addNode({
      id,
      kind: "feature",
      slug: feat.slug,
      path: `/features/${feat.slug}/`,
      title: feat.slug.replace(/-/g, " "),
      categorySlug: "crm",
      indexable: true,
      improveLifecycle: false,
    });
  }

  for (const ind of getIndustries()) {
    const indexable = ind.seo?.indexable === true;
    const id = nodeId("industry", ind.slug);
    addNode({
      id,
      kind: "industry",
      slug: ind.slug,
      path: `/industries/${ind.slug}/`,
      title: ind.name,
      categorySlug: null,
      indexable,
      improveLifecycle: !indexable,
    });
  }

  for (const soft of getSoftware()) {
    if (!soft.pricing) continue;
    const id = nodeId("pricing", soft.slug);
    addNode({
      id,
      kind: "pricing",
      slug: soft.slug,
      path: `/software/${soft.slug}/pricing/`,
      title: `${soft.name} pricing`,
      categorySlug: soft.primaryCategorySlug ?? null,
      indexable: false,
      improveLifecycle: false,
    });
    pushEdge(
      edges,
      seen,
      id,
      nodeId("product", soft.slug),
      "pricing_for",
      85,
      "Product pricing tab",
    );
  }

  addNode({
    id: nodeId("research", "crm-pricing"),
    kind: "research",
    slug: "crm-pricing",
    path: "/research/crm-pricing/",
    title: "CRM Pricing Benchmarks 2026",
    categorySlug: "crm",
    indexable: true,
    improveLifecycle: false,
  });
  pushEdge(
    edges,
    seen,
    nodeId("research", "crm-pricing"),
    nodeId("category", "crm"),
    "research_for",
    90,
    "Research supports category",
  );
  pushEdge(
    edges,
    seen,
    nodeId("hub", "research"),
    nodeId("research", "crm-pricing"),
    "hub_of",
    100,
    "Research hub",
  );

  for (const tool of getRoutableTools()) {
    if (!tool.href || tool.status !== "available") continue;
    if (
      tool.slug === "software-finder" ||
      tool.slug === "software-stack-builder"
    ) {
      continue;
    }
    const categorySlug = tool.categorySlugs[0] ?? null;
    const id = nodeId("tool", tool.slug);
    addNode({
      id,
      kind: "tool",
      slug: tool.slug,
      path: ensureSlash(tool.href),
      title: tool.name,
      categorySlug,
      indexable: true,
      improveLifecycle: false,
    });
    for (const cat of tool.categorySlugs.slice(0, 3)) {
      pushEdge(
        edges,
        seen,
        id,
        nodeId("category", cat),
        "tool_for",
        88,
        "Decision tool for category",
      );
    }
  }

  // Drop edges whose endpoints are missing (unpublished / unknown slugs)
  const filteredEdges = edges.filter(
    (e) => byId.has(e.from) && byId.has(e.to),
  );

  return {
    generatedAt: new Date().toISOString(),
    version: KNOWLEDGE_GRAPH_VERSION,
    nodeCount: nodes.length,
    edgeCount: filteredEdges.length,
    nodes,
    edges: filteredEdges,
  };
}

export function getNodeByPath(
  graph: KnowledgeGraph,
  path: string,
): KnowledgeNode | null {
  const p = ensureSlash(path);
  return graph.nodes.find((n) => n.path === p) ?? null;
}

export function neighbors(
  graph: KnowledgeGraph,
  nodeIdValue: string,
  relation?: KnowledgeRelation,
): KnowledgeEdge[] {
  return graph.edges.filter(
    (e) =>
      (e.from === nodeIdValue || e.to === nodeIdValue) &&
      (!relation || e.relation === relation),
  );
}
