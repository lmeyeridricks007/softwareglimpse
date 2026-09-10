import { describe, expect, it } from "vitest";
import {
  GATE_PAGE_TYPES,
  GATE_DIMENSION_IDS,
  GATE_DIMENSION_META,
  GATE_PROFILES,
  UNIQUE_RATIO_MIN,
  UNIQUE_RATIO_MIN_TEMPLATE_HEAVY,
  INDEX_QUALITY_SCORE_MIN,
  collectHardFails,
  evaluateContentQualityGate,
  analyzePageQualityGate,
  guidePassesIndexGates,
  runGateImprovementLoop,
} from "@/services/content-quality/gate";
import { getFixtureSnapshot } from "@/services/content-quality/fixtures";
import { getGuideBySlug } from "@/data/repositories/guides";

describe("content quality gate", () => {
  it("covers required page types and explainable dimensions", () => {
    expect(GATE_PAGE_TYPES).toEqual(
      expect.arrayContaining([
        "software",
        "guide",
        "comparison",
        "product-explainer",
        "best",
        "alternatives",
        "category",
        "use-case",
        "industry",
        "capability",
        "tool-landing",
        "research",
      ]),
    );
    expect(GATE_PAGE_TYPES).toHaveLength(12);
    for (const id of GATE_DIMENSION_IDS) {
      expect(GATE_DIMENSION_META[id].explanation.length).toBeGreaterThan(20);
    }
    for (const type of GATE_PAGE_TYPES) {
      expect(GATE_PROFILES[type].minIndexScore).toBe(INDEX_QUALITY_SCORE_MIN);
    }
  });

  it("never hard-fails on word count alone", () => {
    const fails = collectHardFails({
      pageType: "guide",
      path: "/guides/example/",
      title: "Example",
      // no wordCount field — hard fails must not invent one
    });
    expect(fails.every((f) => f.code !== "thin_word_count")).toBe(true);
    expect(UNIQUE_RATIO_MIN).toBe(0.35);
    expect(UNIQUE_RATIO_MIN_TEMPLATE_HEAVY).toBe(0.45);
  });

  it("hard-fails empty generated content and broken identity", () => {
    const fails = collectHardFails({
      pageType: "guide",
      path: "/guides/x/",
      title: "",
      emptyGenerated: true,
    });
    expect(fails.some((f) => f.code === "missing_identity")).toBe(true);
    expect(fails.some((f) => f.code === "empty_generated_content")).toBe(true);
  });

  it("hard-fails SEMANTIC_TEMPLATE_RISK", () => {
    const fails = collectHardFails({
      pageType: "guide",
      path: "/guides/x/",
      title: "Example guide title here",
      semanticTemplateRisk: true,
    });
    expect(fails.some((f) => f.code === "semantic_template_risk")).toBe(true);
  });

  it("scores a fixture guide with full gate output shape", () => {
    const snap = getFixtureSnapshot("excellent-guide");
    const result = evaluateContentQualityGate({
      pageType: "guide",
      path: snap.route,
      slug: "excellent-guide",
      title: snap.title,
      snapshot: snap,
      lifecycleState: "IMPROVE",
      typeIndexGatesOk: true,
      evaluatedAt: "2026-09-06T00:00:00.000Z",
    });
    expect(result.qualityScore).toBeGreaterThanOrEqual(70);
    expect(result.dimensions).toHaveLength(10);
    expect(result).toMatchObject({
      indexEligible: expect.any(Boolean),
      lifecycleState: "IMPROVE",
      failures: expect.any(Array),
      warnings: expect.any(Array),
      requiredImprovements: expect.any(Array),
      recommendedImprovements: expect.any(Array),
    });
    expect(result.dimensions.every((d) => d.explanation.length > 10)).toBe(
      true,
    );
  });

  it("weights comparison profiles toward decision support", () => {
    const compare = GATE_PROFILES.comparison.weights.decisionSupport;
    const guide = GATE_PROFILES.guide.weights.decisionSupport;
    expect(compare).toBeGreaterThan(guide);
  });

  it("analyzes a live CRM guide without throwing", () => {
    const guide = getGuideBySlug("what-is-crm", { includeUnpublished: true });
    expect(guide).toBeTruthy();
    const gates = guidePassesIndexGates(guide!);
    expect(gates).toHaveProperty("ok");
    const result = analyzePageQualityGate({
      pageType: "guide",
      slug: "what-is-crm",
    });
    expect(result).toBeTruthy();
    expect(result!.path).toBe("/guides/what-is-crm/");
    expect(result!.pageType).toBe("guide");
  }, 60_000);

  it("stores before/after in the improvement loop without persist", () => {
    const snap = getFixtureSnapshot("thin-guide");
    const before = evaluateContentQualityGate({
      pageType: "guide",
      path: snap.route,
      slug: "thin",
      title: snap.title,
      snapshot: snap,
      typeIndexGatesOk: false,
      typeIndexGateDetail: ["thin-sections"],
      evaluatedAt: "2026-09-06T00:00:00.000Z",
    });
    const afterSnap = getFixtureSnapshot("excellent-guide");
    const after = evaluateContentQualityGate({
      pageType: "guide",
      path: afterSnap.route,
      slug: "thin",
      title: afterSnap.title,
      snapshot: afterSnap,
      typeIndexGatesOk: true,
      evaluatedAt: "2026-09-06T01:00:00.000Z",
    });
    const loop = runGateImprovementLoop({
      before,
      after,
      persist: false,
    });
    expect(loop.scoreDelta).toBeGreaterThan(0);
    expect(loop.becameIndexEligible || after.indexEligible).toBe(true);
  });
});
