import { describe, expect, it } from "vitest";
import {
  buildKnowledgeGraph,
  buildCategoryHubSections,
  buildEstateBreadcrumbs,
  listJourneyTemplates,
  analyzeKnowledgeGraph,
} from "@/services/seo/knowledge-graph";

describe("knowledge graph", () => {
  it(
    "builds semantic nodes and edges across the estate",
    () => {
      const graph = buildKnowledgeGraph();
      expect(graph.nodeCount).toBeGreaterThan(50);
      expect(graph.edgeCount).toBeGreaterThan(50);
      expect(graph.nodes.some((n) => n.kind === "category")).toBe(true);
      expect(graph.nodes.some((n) => n.kind === "product")).toBe(true);
      expect(graph.nodes.some((n) => n.kind === "guide")).toBe(true);
      expect(
        graph.edges.some(
          (e) => e.relation === "belongs_to" || e.relation === "has_product",
        ),
      ).toBe(true);
    },
    180_000,
  );

  it("defines the three core buyer journeys", () => {
    const ids = listJourneyTemplates().map((j) => j.id);
    expect(ids).toContain("guide-to-decision");
    expect(ids).toContain("product-explainer");
    expect(ids).toContain("research-to-tool");
  });

  it("organizes CRM hub sections without dumping everything", () => {
    const sections = buildCategoryHubSections("crm");
    expect(sections.some((s) => s.id === "start_here")).toBe(true);
    for (const section of sections) {
      expect(section.links.length).toBeLessThanOrEqual(8);
    }
  });

  it("builds meaningful software breadcrumbs", () => {
    const crumbs = buildEstateBreadcrumbs("/software/hubspot/");
    expect(crumbs[0]?.path).toBe("/");
    expect(crumbs.some((c) => c.path.includes("/categories/"))).toBe(true);
    expect(crumbs.some((c) => c.path === "/software/hubspot/")).toBe(true);
  });

  it(
    "analyzes without write and reports summary",
    () => {
      const report = analyzeKnowledgeGraph({
        write: false,
        improveLimit: 20,
        lightQa: true,
      });
      expect(report.summary.nodes).toBeGreaterThan(0);
      expect(report.journeys.length).toBeGreaterThanOrEqual(3);
      expect(Array.isArray(report.qa)).toBe(true);
    },
    180_000,
  );
});
