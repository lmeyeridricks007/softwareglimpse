import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getCategories } from "@/data";
import { clearCrmOutboundEdgeCache } from "@/services/internal-linking/outbound-graph";
import { clearLinkInjectionsCache } from "@/services/internal-linking/link-injections";
import {
  attachContextualNavigationalEdges,
  countContextualEdges,
} from "./attach-contextual-edges";
import { clearAuthorityCaches, loadAuthorityMap } from "./authority";
import { buildKnowledgeGraph } from "./build-graph";
import { buildCategoryHubSections } from "./hub-sections";
import { buildImproveInboundReports } from "./improve-inbound";
import { listJourneyTemplates } from "./journeys";
import { runKnowledgeGraphQa } from "./qa";
import { formatKnowledgeGraphMarkdown } from "./report";

export type KnowledgeGraphReport = {
  generatedAt: string;
  graph: ReturnType<typeof buildKnowledgeGraph>;
  journeys: ReturnType<typeof listJourneyTemplates>;
  improveInbound: ReturnType<typeof buildImproveInboundReports>;
  hubSectionsByCategory: Record<
    string,
    ReturnType<typeof buildCategoryHubSections>
  >;
  authorityTop: Array<{ path: string; score: number }>;
  qa: ReturnType<typeof runKnowledgeGraphQa>;
  summary: {
    nodes: number;
    edges: number;
    /** Catalogue/semantic edges only (excludes navigational attach). */
    semanticEdges: number;
    /** Edges from rendered link plans (overlays + injections). */
    contextualEdges: number;
    improvePages: number;
    improveOrphans: number;
    qaErrors: number;
    qaWarnings: number;
  };
};

export type AnalyzeKnowledgeGraphOptions = {
  cwd?: string;
  write?: boolean;
  improveLimit?: number;
  /** Skip orphan/health link scans (faster unit tests). */
  lightQa?: boolean;
};

export function analyzeKnowledgeGraph(
  options: AnalyzeKnowledgeGraphOptions = {},
): KnowledgeGraphReport {
  const cwd = options.cwd ?? process.cwd();
  const write = options.write !== false;

  // Fresh caches so overlays/injections applied this process are visible.
  clearLinkInjectionsCache();
  clearCrmOutboundEdgeCache();
  clearAuthorityCaches();

  const semantic = buildKnowledgeGraph();
  const semanticEdgeCount = semantic.edgeCount;
  const graph = attachContextualNavigationalEdges(semantic);
  const contextualEdgeCount = countContextualEdges(graph);
  const journeys = listJourneyTemplates();
  const improveInbound = buildImproveInboundReports(graph, {
    limit: options.improveLimit ?? 80,
    light: options.lightQa === true,
  });
  const authority = loadAuthorityMap(graph, cwd);
  const authorityTop = [...authority.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([p, score]) => ({ path: p, score }));

  const hubSectionsByCategory: KnowledgeGraphReport["hubSectionsByCategory"] =
    {};
  for (const cat of getCategories().slice(0, 20)) {
    hubSectionsByCategory[cat.slug] = buildCategoryHubSections(cat.slug);
  }

  const qa = runKnowledgeGraphQa(graph, { light: options.lightQa === true });
  const report: KnowledgeGraphReport = {
    generatedAt: new Date().toISOString(),
    graph: {
      ...graph,
      nodes: graph.nodes,
      edges: graph.edges,
    },
    journeys,
    improveInbound,
    hubSectionsByCategory,
    authorityTop,
    qa,
    summary: {
      nodes: graph.nodeCount,
      edges: graph.edgeCount,
      semanticEdges: semanticEdgeCount,
      contextualEdges: contextualEdgeCount,
      improvePages: improveInbound.length,
      improveOrphans: improveInbound.filter((r) => r.orphanStatus === "orphan")
        .length,
      qaErrors: qa.filter((i) => i.severity === "error").length,
      qaWarnings: qa.filter((i) => i.severity === "warning").length,
    },
  };

  if (write) {
    const dataDir = path.join(cwd, "data/seo");
    const docsDir = path.join(cwd, "docs/seo");
    mkdirSync(dataDir, { recursive: true });
    mkdirSync(docsDir, { recursive: true });

    writeFileSync(
      path.join(dataDir, "knowledge-graph.json"),
      JSON.stringify(
        {
          generatedAt: report.generatedAt,
          version: graph.version,
          summary: report.summary,
          journeys: report.journeys.map((j) => j.id),
          authorityTop: report.authorityTop,
          improveInbound: report.improveInbound,
          hubSectionsByCategory: report.hubSectionsByCategory,
          qa: report.qa,
          nodes: graph.nodes,
          edges: graph.edges,
        },
        null,
        2,
      ) + "\n",
      "utf8",
    );

    writeFileSync(
      path.join(docsDir, "KNOWLEDGE-GRAPH.md"),
      formatKnowledgeGraphMarkdown(report),
      "utf8",
    );
  }

  return report;
}
