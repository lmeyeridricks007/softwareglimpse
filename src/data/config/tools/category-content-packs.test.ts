import { describe, expect, it } from "vitest";
import {
  NEW_TOOL_CATEGORY_SLUGS,
} from "@/data/config/tools/category-tool-meta";
import { getCategoryContentPack } from "@/data/config/tools/category-content-packs";
import {
  localizeCrmReadinessCatalog,
  rewriteCrmReadinessLanguage,
} from "@/services/readiness-assessment/localize-catalog";
import { buildCategoryToolDefinitions } from "@/data/config/tools/category-tool-meta";

describe("category content packs", () => {
  it("authors RFP + demo catalogs for every new tool category", () => {
    for (const slug of NEW_TOOL_CATEGORY_SLUGS) {
      const pack = getCategoryContentPack(slug);
      expect(pack, slug).toBeTruthy();
      expect(pack!.rfp.scopeCatalog.length).toBeGreaterThanOrEqual(8);
      expect(pack!.rfp.changeTriggers.length).toBeGreaterThanOrEqual(6);
      expect(pack!.demo.scenarios.length).toBeGreaterThanOrEqual(4);
      expect(pack!.demo.evaluationAreas.length).toBeGreaterThanOrEqual(6);
      expect(pack!.demo.guidelines).toContain("DEMO GUIDELINES");
    }
  });
});

describe("category tool completeness", () => {
  it("marks cost calculator and plan selector available with honesty notes", () => {
    const tools = buildCategoryToolDefinitions();
    const cost = tools.filter((tool) => tool.slug.endsWith("-cost-calculator"));
    const plans = tools.filter((tool) => tool.slug.endsWith("-plan-selector"));
    expect(cost).toHaveLength(NEW_TOOL_CATEGORY_SLUGS.length);
    expect(plans).toHaveLength(NEW_TOOL_CATEGORY_SLUGS.length);
    for (const tool of [...cost, ...plans]) {
      expect(tool.status).toBe("available");
      expect(tool.availabilityNote).toBeTruthy();
    }
  });
});

describe("readiness CRM copy rewrite", () => {
  it("relabels CRM questionnaire language for HR without changing question ids", () => {
    const copy = {
      shortName: "HR",
      productNoun: "HR",
      softwarePhrase: "HR software",
    };
    const catalog = localizeCrmReadinessCatalog(copy);
    expect(catalog.questions.map((q) => q.id)).toEqual(
      expect.arrayContaining(["bc-drivers"]),
    );
    expect(catalog.questions.some((q) => q.prompt.includes("CRM"))).toBe(false);
    expect(
      catalog.dimensions.find((d) => d.id === "sales-process")?.title,
    ).toBe("Operating process");
    expect(
      rewriteCrmReadinessLanguage("Expected CRM users", copy),
    ).toBe("Expected users / seats");
  });
});
