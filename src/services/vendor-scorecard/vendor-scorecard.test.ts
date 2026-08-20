import { describe, expect, it } from "vitest";
import {
  createEmptyCrmDecisionProfile,
  type CrmDecisionProfile,
  type ScorecardCriterion,
  type VendorScorecardState,
} from "@/domain";
import {
  applyImportance,
  deriveOverallFit,
  evaluateMustHave,
  evaluateScorecard,
  generateCriteriaFromProfile,
  rankScorecardResults,
  recommendationSentence,
  scoreToQualitativeLabel,
  type ScorecardResearchCatalog,
} from "@/services/vendor-scorecard";

function baseResearch(
  overrides: Partial<ScorecardResearchCatalog["products"][0]> & {
    slug: string;
    name: string;
  },
): ScorecardResearchCatalog["products"][0] {
  return {
    logo: null,
    reviewScore: null,
    reviewApproved: false,
    startingPriceLabel: null,
    assessmentStatus: "approved",
    assessmentUpdatedAt: "2026-08-01T00:00:00.000Z",
    researchConfidence: "medium",
    strengths: ["Pipeline clarity"],
    weaknesses: ["Admin depth"],
    tradeoffs: [],
    criteria: [],
    featureSupport: [],
    ...overrides,
  };
}

const catalog = (products: ScorecardResearchCatalog["products"]): ScorecardResearchCatalog => ({
  products,
  methodologyVersion: "1.0.0",
  methodologyHref: "/company/editorial-methodology/",
  generatedAt: "2026-08-14T00:00:00.000Z",
  featureLabels: {
    reporting: "Reporting",
    "workflow-automation": "Workflow automation",
    sso: "SSO",
  },
});

const defaultCriteria = (): ScorecardCriterion[] =>
  generateCriteriaFromProfile(null);

describe("vendor scorecard labels", () => {
  it("maps approved scores to qualitative labels without inventing", () => {
    expect(scoreToQualitativeLabel(9)).toBe("strong");
    expect(scoreToQualitativeLabel(7.2)).toBe("good");
    expect(scoreToQualitativeLabel(5.5)).toBe("partial");
    expect(scoreToQualitativeLabel(3)).toBe("does-not-meet");
    expect(scoreToQualitativeLabel(null)).toBe("unknown");
  });

  it("treats unknown availability as unknown, not failed", () => {
    expect(evaluateMustHave(undefined)).toBe("unknown");
    expect(evaluateMustHave("unknown")).toBe("unknown");
    expect(evaluateMustHave("not-supported")).toBe("failed");
    expect(evaluateMustHave("supported")).toBe("satisfied");
    expect(evaluateMustHave("higher-plan-only")).toBe("partial");
  });

  it("derives overall fit deterministically", () => {
    expect(
      deriveOverallFit({
        mustHaveFailed: 1,
        mustHaveUnknown: 0,
        scoredCriterionCount: 5,
        weightedScore: 9,
      }),
    ).toBe("poor-fit");
    expect(
      deriveOverallFit({
        mustHaveFailed: 0,
        mustHaveUnknown: 0,
        scoredCriterionCount: 1,
        weightedScore: 9,
      }),
    ).toBe("insufficient-evidence");
    expect(
      deriveOverallFit({
        mustHaveFailed: 0,
        mustHaveUnknown: 0,
        scoredCriterionCount: 4,
        weightedScore: 8.6,
      }),
    ).toBe("excellent-fit");
  });
});

describe("criteria generation", () => {
  it("CASE 2: generates default methodology criteria without a profile", () => {
    const criteria = generateCriteriaFromProfile(null);
    expect(criteria.length).toBeGreaterThanOrEqual(6);
    expect(criteria.every((c) => c.sourceId)).toBe(true);
  });

  it("CASE 1: raises importance from profile capabilities", () => {
    const profile: CrmDecisionProfile = {
      ...createEmptyCrmDecisionProfile("2026-08-14T00:00:00.000Z"),
      businessContext: {
        industrySlug: "financial-services",
        companySizeSlug: "small-business",
        crmUserCount: 25,
        teamIds: ["sales"],
      },
      capabilities: [
        { id: "pipeline-management", priority: "critical", source: "user-selected" },
        { id: "sales-automation", priority: "high", source: "user-selected" },
      ],
      features: [
        { id: "reporting", priority: "must-have", source: "user-selected" },
        { id: "workflow-automation", priority: "must-have", source: "user-selected" },
      ],
    };
    const criteria = generateCriteriaFromProfile(profile);
    const pipeline = criteria.find((c) => c.sourceId === "pipeline-management");
    expect(pipeline?.importance).toBe("critical");
  });

  it("normalizes weights after importance changes", () => {
    let criteria = defaultCriteria();
    const first = criteria[0]!;
    criteria = applyImportance(criteria, first.id, "ignore");
    const active = criteria.filter((c) => c.importance !== "ignore");
    const sum = active.reduce((s, c) => s + (c.normalizedWeight ?? 0), 0);
    expect(sum).toBeCloseTo(1, 5);
  });
});

describe("scorecard engine", () => {
  const criteria = defaultCriteria().map((c) =>
    c.sourceId === "pipeline-management" || c.sourceId === "sales-automation"
      ? c
      : c,
  );

  it("CASE 5: qualitative-only when numeric scores absent", () => {
    const research = catalog([
      baseResearch({
        slug: "alpha",
        name: "Alpha",
        criteria: [],
      }),
      baseResearch({
        slug: "beta",
        name: "Beta",
        criteria: [],
      }),
    ]);
    const results = evaluateScorecard({
      criteria,
      productIds: ["alpha", "beta"],
      research,
      mustHaveFeatureSlugs: [],
      userAverages: {},
    });
    expect(results.every((r) => r.weightedResearchScore == null)).toBe(true);
    expect(results.every((r) => r.overallFit === "insufficient-evidence")).toBe(
      true,
    );
  });

  it("CASE 6: uses approved numeric criterion scores", () => {
    const research = catalog([
      baseResearch({
        slug: "pipedrive",
        name: "Pipedrive",
        criteria: [
          {
            criterionSlug: "pipeline-management",
            score: 9,
            qualitative: "strong",
            rationale: "Pipeline-first CRM",
            confidence: "high",
            supportingFactIds: ["fact-1"],
            assessmentUpdatedAt: "2026-08-01T00:00:00.000Z",
          },
          {
            criterionSlug: "sales-automation",
            score: 7,
            qualitative: "good",
            rationale: "Automation from Growth",
            confidence: "medium",
            supportingFactIds: ["fact-2"],
            assessmentUpdatedAt: "2026-08-01T00:00:00.000Z",
          },
          {
            criterionSlug: "ease-of-use",
            score: 8,
            qualitative: "good",
            rationale: "Simple UX",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
        ],
      }),
      baseResearch({
        slug: "hubspot",
        name: "HubSpot",
        criteria: [
          {
            criterionSlug: "pipeline-management",
            score: 8,
            qualitative: "good",
            rationale: "Solid pipelines",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
          {
            criterionSlug: "sales-automation",
            score: 9,
            qualitative: "strong",
            rationale: "Strong automation",
            confidence: "high",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
          {
            criterionSlug: "ease-of-use",
            score: 7,
            qualitative: "good",
            rationale: "Good UX",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
        ],
      }),
    ]);
    const results = rankScorecardResults(
      evaluateScorecard({
        criteria,
        productIds: ["pipedrive", "hubspot"],
        research,
        mustHaveFeatureSlugs: [],
        userAverages: {},
      }),
    );
    expect(results[0]?.weightedResearchScore).not.toBeNull();
    expect(results.every((r) => r.cells.some((c) => c.numericScore != null))).toBe(
      true,
    );
    const rec = recommendationSentence(results[0]!);
    expect(rec).toContain("strongest fit");
    expect(rec).not.toContain("best CRM");
  });

  it("CASE 3: product fails verified must-have", () => {
    const research = catalog([
      baseResearch({
        slug: "alpha",
        name: "Alpha",
        criteria: [
          {
            criterionSlug: "pipeline-management",
            score: 9,
            qualitative: "strong",
            rationale: "x",
            confidence: "high",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
          {
            criterionSlug: "sales-automation",
            score: 9,
            qualitative: "strong",
            rationale: "x",
            confidence: "high",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
        ],
        featureSupport: [{ featureSlug: "sso", availability: "not-supported" }],
      }),
      baseResearch({
        slug: "beta",
        name: "Beta",
        criteria: [
          {
            criterionSlug: "pipeline-management",
            score: 7,
            qualitative: "good",
            rationale: "x",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
          {
            criterionSlug: "sales-automation",
            score: 7,
            qualitative: "good",
            rationale: "x",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
        ],
        featureSupport: [{ featureSlug: "sso", availability: "supported" }],
      }),
    ]);
    const ranked = rankScorecardResults(
      evaluateScorecard({
        criteria,
        productIds: ["alpha", "beta"],
        research,
        mustHaveFeatureSlugs: ["sso"],
        userAverages: {},
      }),
    );
    expect(ranked.find((r) => r.productSlug === "alpha")?.failsMustHave).toBe(
      true,
    );
    expect(ranked.find((r) => r.productSlug === "alpha")?.overallFit).toBe(
      "poor-fit",
    );
    expect(ranked[0]?.productSlug).toBe("beta");
  });

  it("CASE 4: unknown must-have does not fail", () => {
    const research = catalog([
      baseResearch({
        slug: "alpha",
        name: "Alpha",
        criteria: [
          {
            criterionSlug: "pipeline-management",
            score: 8,
            qualitative: "good",
            rationale: "x",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
          {
            criterionSlug: "sales-automation",
            score: 8,
            qualitative: "good",
            rationale: "x",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
        ],
        featureSupport: [],
      }),
    ]);
    const [result] = evaluateScorecard({
      criteria,
      productIds: ["alpha"],
      research,
      mustHaveFeatureSlugs: ["sso"],
      userAverages: {},
    });
    expect(result?.mustHaveSummary.unknown).toBe(1);
    expect(result?.failsMustHave).toBe(false);
    expect(result?.overallFit).not.toBe("poor-fit");
  });

  it("CASE 7: user scores stay separate unless combine enabled", () => {
    const research = catalog([
      baseResearch({
        slug: "alpha",
        name: "Alpha",
        criteria: [
          {
            criterionSlug: "pipeline-management",
            score: 8,
            qualitative: "good",
            rationale: "x",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
          {
            criterionSlug: "sales-automation",
            score: 8,
            qualitative: "good",
            rationale: "x",
            confidence: "medium",
            supportingFactIds: [],
            assessmentUpdatedAt: null,
          },
        ],
      }),
    ]);
    const without = evaluateScorecard({
      criteria,
      productIds: ["alpha"],
      research,
      mustHaveFeatureSlugs: [],
      userAverages: { alpha: 4.5 },
      combination: { enabled: false, researchPercent: 70, userPercent: 30 },
    })[0];
    expect(without?.combinedScore).toBeNull();
    expect(without?.userAverage).toBe(4.5);

    const withCombine = evaluateScorecard({
      criteria,
      productIds: ["alpha"],
      research,
      mustHaveFeatureSlugs: [],
      userAverages: { alpha: 4.5 },
      combination: { enabled: true, researchPercent: 70, userPercent: 30 },
    })[0];
    expect(withCombine?.combinedScore).not.toBeNull();
  });
});

describe("scorecard state shape", () => {
  it("CASE 12: empty state is versioned", () => {
    const state: VendorScorecardState = {
      version: 1,
      categorySlug: "crm",
      productIds: [],
      criteria: [],
      productAssessments: [],
      createdAt: "2026-08-14T00:00:00.000Z",
      updatedAt: "2026-08-14T00:00:00.000Z",
    };
    expect(state.version).toBe(1);
  });
});
