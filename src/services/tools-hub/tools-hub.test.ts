import { describe, expect, it } from "vitest";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { buildToolsHubModel } from "@/services/tools-hub";

describe("buildToolsHubModel", () => {
  it("exposes registry tools without inventing availability", () => {
    const model = buildToolsHubModel();
    expect(model.allTools.length).toBe(TOOLS_REGISTRY.length);
    expect(model.featuredTools.every((t) => t.featured)).toBe(true);
    expect(
      model.allTools.find((t) => t.id === "software-cost-calculator")?.href,
    ).toBe("/tools/software-cost-calculator/");
    expect(
      model.allTools.find((t) => t.id === "software-cost-calculator")?.status,
    ).toBe("partial");
    expect(
      model.allTools.find((t) => t.id === "sales-intelligence-cost-calculator")
        ?.href,
    ).toBe("/tools/sales-intelligence-cost-calculator/");
    expect(
      model.allTools.find((t) => t.id === "crm-finder")?.isInteractive,
    ).toBe(true);
  });

  it("groups category tools from registry categorySlugs only", () => {
    const model = buildToolsHubModel();
    for (const group of model.categoryGroups) {
      expect(group.toolCount).toBeGreaterThan(0);
      for (const tool of group.tools) {
        const def = TOOLS_REGISTRY.find((t) => t.id === tool.id);
        expect(def?.categorySlugs).toContain(group.categorySlug);
      }
    }
  });

  it("builds a decision preview with live samples when CRM data exists", () => {
    const model = buildToolsHubModel();
    expect(model.decisionPreview.requirements.length).toBe(4);
    if (model.decisionPreview.isLiveSample) {
      expect(model.decisionPreview.matches.length).toBeGreaterThan(0);
      for (const m of model.decisionPreview.matches) {
        expect(m.matchScore).toBeGreaterThanOrEqual(0);
        expect(m.matchScore).toBeLessThanOrEqual(100);
      }
    }
  });

  it("assigns unique preview kinds to interactive CRM decision tools", () => {
    const model = buildToolsHubModel();
    const byId = Object.fromEntries(model.allTools.map((t) => [t.id, t]));
    expect(byId["crm-finder"]?.previewKind).toBe("finder");
    expect(byId["crm-requirements-builder"]?.previewKind).toBe("builder");
    expect(byId["crm-vendor-scorecard"]?.previewKind).toBe("scorecard");
    expect(byId["crm-implementation-planner"]?.previewKind).toBe(
      "implementation",
    );
    expect(byId["crm-migration-planner"]?.previewKind).toBe("migration");
    expect(byId["crm-migration-planner"]?.icon).toBe("migration");
  });

  it("scopes hub to sales-intelligence when categorySlug is set", () => {
    const model = buildToolsHubModel({ categorySlug: "sales-intelligence" });
    expect(model.activeCategory?.slug).toBe("sales-intelligence");
    expect(model.primaryFinder.href).toBe("/tools/sales-intelligence-finder/");
    expect(model.primaryFinder.label).toMatch(/sales intelligence/i);
    expect(
      model.featuredTools.every((t) =>
        t.categorySlugs.includes("sales-intelligence"),
      ),
    ).toBe(true);
    expect(model.hero.eyebrow.toLowerCase()).toContain("sales intelligence");
    expect(model.browseSoftwareHref).toBe("/categories/sales-intelligence/");
    expect(model.decisionPreview.caption.toLowerCase()).toContain(
      "sales intelligence",
    );
    const stack = model.featuredTools.find((t) => t.id === "software-stack-builder");
    expect(stack).toBeTruthy();
    expect(stack?.categoryLabels).toEqual(["Sales Intelligence"]);
    expect(stack?.categoryLabel).toMatch(/sales intelligence/i);
  });

  it("shows all categories for shared tools on the unscoped hub", () => {
    const model = buildToolsHubModel();
    const stack = model.allTools.find((t) => t.id === "software-stack-builder");
    expect(stack?.categorySlugs).toContain("crm");
    expect(stack?.categorySlugs).toContain("sales-intelligence");
    expect(stack?.categorySlugs).toContain("hr");
    expect(stack?.categoryLabels.length).toBeGreaterThanOrEqual(2);
  });

  it("scopes hub to crm when categorySlug is crm", () => {
    const model = buildToolsHubModel({ categorySlug: "crm" });
    expect(model.activeCategory?.slug).toBe("crm");
    expect(model.primaryFinder.href).toBe("/tools/crm-finder/");
    expect(model.primaryFinder.label).toMatch(/crm/i);
    expect(
      model.featuredTools.every((t) => t.categorySlugs.includes("crm")),
    ).toBe(true);
    expect(model.hero.eyebrow.toLowerCase()).toContain("crm");
  });

  it("scopes hub to hr with dedicated category tools", () => {
    const model = buildToolsHubModel({ categorySlug: "hr" });
    expect(model.activeCategory?.slug).toBe("hr");
    expect(model.primaryFinder.href).toBe("/tools/hr-finder/");
    expect(model.featuredTools.some((t) => t.id === "hr-finder")).toBe(true);
    expect(
      model.featuredTools.every((t) => t.categorySlugs.includes("hr")),
    ).toBe(true);
  });

  it("keeps unscoped featured tools to CRM, SI, and shared tools", () => {
    const model = buildToolsHubModel();
    expect(model.featuredTools.some((t) => t.id === "crm-finder")).toBe(true);
    expect(model.featuredTools.some((t) => t.id === "hr-finder")).toBe(false);
  });
});
