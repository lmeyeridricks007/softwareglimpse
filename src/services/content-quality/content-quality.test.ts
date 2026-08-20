import { describe, expect, it } from "vitest";
import {
  evaluatePageQuality,
  formatQualityMarkdown,
  FIXTURE_SNAPSHOTS,
  getFixtureSnapshot,
  computeOverallScore,
  qualityBandForScore,
  PAGE_QUALITY_PROFILES,
  parsePageSnapshot,
} from "@/services/content-quality";
import { ContentQualityAssessmentSchema } from "@/domain/schemas/content-quality";

describe("content quality framework", () => {
  it("defines profiles for all supported page types", () => {
    const types = Object.keys(PAGE_QUALITY_PROFILES);
    expect(types).toEqual(
      expect.arrayContaining([
        "article",
        "guide",
        "product-review",
        "comparison",
        "best",
        "product-guide",
        "industry",
        "use-case",
        "capability",
        "requirement",
        "feature",
        "implementation-guide",
        "resource",
        "tool-landing",
      ]),
    );
    expect(types).toHaveLength(14);
  });

  it("maps overall scores to quality bands without decimals", () => {
    expect(qualityBandForScore(95)).toBe("excellent");
    expect(qualityBandForScore(85)).toBe("strong");
    expect(qualityBandForScore(75)).toBe("good-but-improvable");
    expect(qualityBandForScore(65)).toBe("weak");
    expect(qualityBandForScore(50)).toBe("poor");
    expect(qualityBandForScore(20)).toBe("critical-incomplete");
    expect(computeOverallScore([{ score: 5, weight: 1 }])).toBe(100);
    expect(computeOverallScore([{ score: 0, weight: 1 }])).toBe(0);
  });

  it("scores excellent guide clearly above thin guide", () => {
    const excellent = evaluatePageQuality(getFixtureSnapshot("excellent-guide"), {
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    const thin = evaluatePageQuality(getFixtureSnapshot("thin-guide"), {
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });

    expect(excellent.overallScore).toBeGreaterThanOrEqual(85);
    expect(["excellent", "strong"]).toContain(excellent.qualityBand);
    expect(thin.overallScore).toBeLessThan(55);
    expect(["poor", "critical-incomplete"]).toContain(thin.qualityBand);
    expect(excellent.overallScore - thin.overallScore).toBeGreaterThanOrEqual(35);

    const intent = excellent.dimensions.find((d) => d.id === "user-intent-fit");
    expect(intent?.score).toBeGreaterThanOrEqual(4);
    expect(intent?.reason.length).toBeGreaterThan(10);
    expect(intent?.evidence.length).toBeGreaterThan(0);
  });

  it("scores good product review as strong/excellent", () => {
    const review = evaluatePageQuality(
      getFixtureSnapshot("good-product-review"),
      { evaluatedAt: "2026-08-15T00:00:00.000Z" },
    );
    expect(review.overallScore).toBeGreaterThanOrEqual(80);
    expect(review.profileId).toBe("ProductReviewQualityProfile");
    const evidence = review.dimensions.find(
      (d) => d.id === "evidence-source-quality",
    );
    expect(evidence?.score).toBeGreaterThanOrEqual(4);
  });

  it("flags thin industry as weak differentiation and completeness", () => {
    const industry = evaluatePageQuality(getFixtureSnapshot("thin-industry"), {
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    expect(industry.overallScore).toBeLessThan(50);
    const diff = industry.dimensions.find(
      (d) => d.id === "content-differentiation",
    );
    expect(diff?.score).toBeLessThanOrEqual(2);
    expect(industry.criticalGaps.length + industry.weaknesses.length).toBeGreaterThan(
      0,
    );
  });

  it("flags duplicate supporting article intent", () => {
    const article = evaluatePageQuality(
      getFixtureSnapshot("duplicate-article"),
      { evaluatedAt: "2026-08-15T00:00:00.000Z" },
    );
    const diff = article.dimensions.find(
      (d) => d.id === "content-differentiation",
    );
    expect(diff?.score).toBeLessThanOrEqual(2);
    expect(diff?.gap?.length).toBeGreaterThan(0);
    expect(
      article.dimensions.every(
        (d) => d.reason.length > 0 && Array.isArray(d.evidence),
      ),
    ).toBe(true);
  });

  it("flags feature page missing evidence while preserving other strengths", () => {
    const feature = evaluatePageQuality(
      getFixtureSnapshot("feature-missing-evidence"),
      { evaluatedAt: "2026-08-15T00:00:00.000Z" },
    );
    const evidence = feature.dimensions.find(
      (d) => d.id === "evidence-source-quality",
    );
    expect(evidence?.score).toBeLessThanOrEqual(2);
    expect(feature.researchGaps.length).toBeGreaterThan(0);
    const depth = feature.dimensions.find((d) => d.id === "subject-depth");
    expect(depth?.score).toBeGreaterThanOrEqual(3);
  });

  it("produces schema-valid assessment and markdown with recommendations", () => {
    const assessment = evaluatePageQuality(getFixtureSnapshot("thin-guide"), {
      evaluatedAt: "2026-08-15T00:00:00.000Z",
    });
    expect(() => ContentQualityAssessmentSchema.parse(assessment)).not.toThrow();
    const md = formatQualityMarkdown(assessment);
    expect(md).toContain("# Content Quality Assessment");
    expect(md).toContain("**Reason:**");
    expect(md).toContain("Evaluation only");
    expect(Number.isInteger(assessment.overallScore)).toBe(true);
  });

  it("loads all fixtures as valid snapshots", () => {
    for (const id of Object.keys(FIXTURE_SNAPSHOTS)) {
      expect(() => parsePageSnapshot(getFixtureSnapshot(id))).not.toThrow();
    }
  });

  it("caps completeness when expected sections exist but copy is surface template language", () => {
    const base = getFixtureSnapshot("excellent-guide");
    const assessment = evaluatePageQuality(
      {
        ...base,
        depthSignals: [
          ...base.depthSignals,
          "surface: comparable-support boilerplate outcomes",
        ],
        originalValueSignals: [
          ...base.originalValueSignals,
          "template outcome language (comparable support)",
        ],
      },
      { evaluatedAt: "2026-08-15T00:00:00.000Z" },
    );
    const completeness = assessment.dimensions.find(
      (d) => d.id === "content-completeness",
    );
    expect(completeness?.score).toBeLessThanOrEqual(3);
    expect(completeness?.reason).toMatch(/surface or template/i);
    expect(assessment.majorImprovements.join(" ")).toMatch(
      /template or surface/i,
    );
  });
});
