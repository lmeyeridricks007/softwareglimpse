import { beforeEach, describe, expect, it } from "vitest";
import { __resetDataCaches } from "@/data";
import { crmMethodology } from "@/data/seed/crm-methodology";
import {
  evaluateAlternativesQuality,
  evaluateBestQuality,
  evaluateComparisonQuality,
  isEntityIndexable,
} from "@/domain/quality-gates";
import type {
  BestPage,
  EditorialBrief,
  EditorialDraft,
  ProductReview,
} from "@/domain";
import {
  CriterionAssessmentSchema,
  ProductEditorialAssessmentSchema,
} from "@/domain";
import {
  DeterministicEditorialGenerator,
  validateCriterionAssessment,
  validateEditorialDraft,
  evaluateSoftwareReviewQuality,
  resolveAffectedPages,
  rankRecommendationCandidates,
  markDependentPagesRefreshNeeded,
  listStaleSeedDependencies,
} from "@/services/editorial";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
} from "@/data/repositories/catalog";
import { loadAssessment } from "@/data/editorial/store";

beforeEach(() => {
  __resetDataCaches();
});

describe("editorial assessments", () => {
  it("rejects invalid scores outside methodology scale", () => {
    const result = validateCriterionAssessment(
      {
        criterionSlug: "ease-of-use",
        score: 12,
        rationale: "Too high",
        supportingFactIds: [],
        confidence: "low",
        status: "assessment-in-progress",
      },
      crmMethodology,
    );
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.startsWith("score-out-of-range"))).toBe(
      true,
    );
  });

  it("rejects missing rationale", () => {
    const parsed = CriterionAssessmentSchema.safeParse({
      criterionSlug: "reporting",
      score: 7,
      rationale: "",
      supportingFactIds: [],
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects unsupported criterion", () => {
    const result = validateCriterionAssessment(
      {
        criterionSlug: "telepathy",
        score: 5,
        rationale: "Not a real criterion",
        supportingFactIds: [],
        confidence: "low",
        status: "assessment-in-progress",
      },
      crmMethodology,
    );
    expect(result.ok).toBe(false);
    expect(result.errors[0]).toContain("unknown-criterion");
  });

  it("loads approved Pipedrive assessment with full CRM criteria", () => {
    const assessment = loadAssessment("pipedrive");
    expect(assessment).not.toBeNull();
    expect(assessment?.status).toBe("approved");
    expect(assessment?.handsOnTesting).toBe(false);
    expect(assessment?.confidence).toBe("medium");
    expect(assessment?.criterionAssessments).toHaveLength(10);
    expect(assessment?.overallScore).toBe(7.5);
    for (const c of assessment?.criterionAssessments ?? []) {
      expect(c.status).toBe("approved");
      expect(c.rationale.length).toBeGreaterThan(0);
    }
  });
});

describe("review publish gates", () => {
  it("rejects unapproved review for publish", () => {
    const review: ProductReview = {
      id: "review-pipedrive",
      productSlug: "pipedrive",
      assessmentId: "assessment-pipedrive",
      editorialStatus: "review-required",
      title: "Pipedrive Review",
      h1: "Pipedrive Review",
      criterionAssessments: [],
      bestFor: [],
      notIdealFor: [],
      pros: [],
      cons: [],
      keyFeatures: [],
      limitations: [],
      alternativeSlugs: [],
      comparisonSlugs: [],
      relatedGuidePaths: [],
      researchSourceIds: [],
      factRefs: [],
      faq: [],
      sections: [],
      confidence: "low",
      handsOnTesting: false,
      contentVersion: 1,
      refreshNeeded: false,
      metadata: { status: "draft" },
      seo: { indexable: false },
    };
    const result = evaluateSoftwareReviewQuality(review);
    expect(result.publishable).toBe(false);
    expect(result.failures).toContain("editorial-not-approved");
  });
});

describe("comparison editorial", () => {
  it("supports tie and depends winners", () => {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.slug === "freshsales-vs-pipedrive",
    );
    expect(comparison).toBeTruthy();
    expect(comparison?.overallWinnerKind).toBe("depends");
    const kinds = new Set(
      comparison?.outcomes.map((o) => o.winnerKind).filter(Boolean),
    );
    expect(kinds.has("tie") || kinds.has("depends")).toBe(true);
  });

  it("keeps incomplete comparison non-indexable", () => {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.metadata.researchStatus !== "complete",
    );
    expect(comparison).toBeTruthy();
    expect(comparison!.seo.indexable).toBe(false);
    expect(
      isEntityIndexable({ kind: "comparison", entity: comparison! }),
    ).toBe(false);
    const quality = evaluateComparisonQuality(comparison!);
    expect(quality.ok).toBe(false);
  });

  it("publishes researched CRM comparisons when quality gate passes", () => {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.slug === "freshsales-vs-pipedrive",
    )!;
    expect(comparison.editorialStatus).toBe("approved");
    expect(comparison.metadata.researchStatus).toBe("complete");
    expect(
      isEntityIndexable({ kind: "comparison", entity: comparison }),
    ).toBe(true);
    expect(evaluateComparisonQuality(comparison).ok).toBe(true);
  });

  it("does not fabricate a forced overall winner for the POC", () => {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.slug === "freshsales-vs-pipedrive",
    )!;
    expect(comparison.overallWinnerSlug == null).toBe(true);
    expect(["depends", "tie"]).toContain(comparison.overallWinnerKind);
  });
});

describe("best pages", () => {
  it("rejects recommendation without rationale at quality gate", () => {
    const page: BestPage = {
      id: "best-test",
      slug: "crm-software-test",
      title: "Best CRM",
      methodology: "Test methodology",
      eligibleProductSlugs: ["a", "b", "c"],
      recommendations: [
        {
          productSlug: "pipedrive",
          rationale: undefined,
          strengths: [],
          tradeOffs: [],
          scenarios: [],
          idealFor: [],
          avoidIf: [],
          alternatives: [],
          featureSnapshot: [],
          keyDetails: [],
          useCaseSlugs: [],
          audienceSlugs: [],
          approved: false,
        },
        {
          productSlug: "freshsales",
          rationale: "Has automation",
          strengths: [],
          tradeOffs: [],
          scenarios: [],
          idealFor: [],
          avoidIf: [],
          alternatives: [],
          featureSnapshot: [],
          keyDetails: [],
          useCaseSlugs: [],
          audienceSlugs: [],
          approved: true,
        },
      ],
      audienceSlugs: [],
      useCaseSlugs: [],
      useCaseRecommendations: [],
      decisionPaths: [],
      landscape: [],
      companySizes: [],
      softwareTypes: [],
      buyingGuideSteps: [],
      relatedComparisonSlugs: [],
      relatedAlternativeSlugs: [],
      relatedToolPaths: [],
      featureMatrixSlugs: [],
      faq: [],
      editorialStatus: "approved",
      refreshNeeded: false,
      metadata: { status: "published", researchStatus: "complete" },
      seo: { indexable: true },
    };
    const result = evaluateBestQuality(page);
    expect(result.failures).toContain("insufficient-rationales");
  });

  it("rejects publish without methodology", () => {
    const page = getAllBestPagesUnfiltered().find(
      (p) => p.slug === "crm-software",
    )!;
    const withoutMethod: BestPage = {
      ...page,
      methodology: undefined,
      editorialStatus: "approved",
      metadata: { ...page.metadata, researchStatus: "complete" },
      recommendations: page.recommendations.map((r) => ({
        ...r,
        approved: true,
        rationale: r.rationale || "Approved rationale",
      })),
    };
    expect(evaluateBestQuality(withoutMethod).failures).toContain(
      "missing-methodology",
    );
  });

  it("does not let affiliate state alter ranking candidates", () => {
    const ranked = rankRecommendationCandidates({
      criteria: {
        categorySlug: "crm",
        requiredFeatureSlugs: [],
        preferredIntegrationSlugs: [],
        secondaryUseCaseSlugs: [],
      },
      productSlugs: ["pipedrive", "freshsales"],
    });
    expect(ranked.length).toBe(2);
    expect(ranked.every((c) => c.autoPublish === false)).toBe(true);
    // Scores come from assessments/enrichment — never affiliate fields.
    const joined = ranked.flatMap((c) => c.rationale).join(" ").toLowerCase();
    expect(joined).not.toContain("affiliate");
    const fresh = ranked.find((c) => c.softwareSlug === "freshsales")!;
    const pipe = ranked.find((c) => c.softwareSlug === "pipedrive")!;
    expect(typeof fresh.score).toBe("number");
    expect(typeof pipe.score).toBe("number");
    expect(pipe.rationale.join(" ")).toMatch(/7\.5/);
  });
});

describe("alternatives editorial", () => {
  it("requires structured reasons for indexability", () => {
    const page = getAllAlternativesUnfiltered().find(
      (p) => p.slug === "pipedrive",
    )!;
    expect(page.editorialStatus).not.toBe("approved");
    expect(isEntityIndexable({ kind: "alternatives", entity: page })).toBe(
      false,
    );
    const reasoned = page.alternatives.filter((a) => a.reason && a.keyTradeoff);
    expect(reasoned.length).toBeGreaterThanOrEqual(2);
  });
});

describe("refresh / dependency graph", () => {
  it("resolves Pipedrive dependents across page types", () => {
    const affected = resolveAffectedPages("pipedrive");
    const paths = affected.map((a) => a.path);
    expect(paths).toContain("/software/pipedrive/");
    expect(paths).toContain("/compare/freshsales-vs-pipedrive/");
    expect(paths).toContain("/alternatives/pipedrive/");
    expect(paths).toContain("/best/crm-software/");
  });

  it("marks dependent pages when product facts change", () => {
    const stale = listStaleSeedDependencies("pipedrive");
    expect(stale.comparisons).toContain("freshsales-vs-pipedrive");
    expect(stale.best).toContain("crm-software");
    const result = markDependentPagesRefreshNeeded(
      "pipedrive",
      "pricing-fact-changed",
    );
    expect(result.affected.length).toBeGreaterThan(0);
    expect(result.reason).toBe("pricing-fact-changed");
  });
});

describe("AI generation safeguards", () => {
  const baseBrief = (): EditorialBrief => ({
    id: "brief-test",
    pageType: "software-review",
    targetIntent: "decide if pipedrive fits",
    productSlug: "pipedrive",
    productSlugs: ["pipedrive"],
    requiredSections: ["summary", "verdict"],
    facts: [
      {
        id: "fact:pipedrive:positioning",
        domain: "product-positioning",
        claim: "Sales CRM focused on pipeline visibility",
      },
    ],
    editorialAssessments: [
      {
        criterionSlug: "pipeline-management",
        score: 7,
        rationale: "Pipeline features evidenced",
        supportingFactIds: ["fact:pipedrive:positioning"],
        confidence: "low",
        status: "assessment-in-progress",
      },
    ],
    allowedComparisons: [],
    allowedAlternatives: [],
    internalLinks: [],
    prohibitedClaims: ["We tested", "revolutionary", "game-changing"],
    approvedNumbers: [{ kind: "score", value: 7 }],
    handsOnTestingAllowed: false,
    toneNotes: [],
  });

  it("generation only receives brief facts (no free browse)", async () => {
    const generator = new DeterministicEditorialGenerator();
    const draft = await generator.generate(baseBrief());
    expect(draft.provider).toBe("deterministic-v1");
    expect(draft.status).toBe("generated");
    const validation = validateEditorialDraft(draft, baseBrief());
    expect(validation.ok).toBe(true);
  });

  it("rejects hands-on claims when testing not allowed", () => {
    const draft: EditorialDraft = {
      id: "draft-bad",
      briefId: "brief-test",
      pageType: "software-review",
      targetSlug: "pipedrive",
      provider: "test",
      status: "generated",
      summary: "We tested Pipedrive for three weeks.",
      pros: [],
      cons: [],
      sections: [],
      faq: [],
      factRefs: [],
      validationErrors: [],
      createdAt: "2026-08-13T00:00:00.000Z",
    };
    const result = validateEditorialDraft(draft, baseBrief());
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("hands-on"))).toBe(true);
  });

  it("rejects unsourced numbers", () => {
    const draft: EditorialDraft = {
      id: "draft-nums",
      briefId: "brief-test",
      pageType: "software-review",
      targetSlug: "pipedrive",
      provider: "test",
      status: "generated",
      summary: "Used by 100000 companies with 99% satisfaction.",
      pros: [],
      cons: [],
      sections: [],
      faq: [],
      factRefs: [],
      validationErrors: [],
      createdAt: "2026-08-13T00:00:00.000Z",
    };
    const result = validateEditorialDraft(draft, baseBrief());
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("unsourced-number"))).toBe(
      true,
    );
  });

  it("draft never directly overwrites published content via promote gate", () => {
    const assessment = ProductEditorialAssessmentSchema.parse({
      id: "a1",
      productSlug: "pipedrive",
      methodologySlug: "crm-editorial",
      methodologyVersion: "1.0.0",
      status: "review-required",
      handsOnTesting: false,
      confidence: "low",
      criterionAssessments: [],
      scoreAudit: [],
      strengths: [],
      weaknesses: [],
      bestFor: [],
      notIdealFor: [],
      tradeoffs: [],
    });
    expect(assessment.status).not.toBe("approved");
  });
});

describe("POC alternatives quality shell", () => {
  it("pipedrive alternatives page stays non-indexable", () => {
    const page = getAllAlternativesUnfiltered().find(
      (p) => p.slug === "pipedrive",
    )!;
    const quality = evaluateAlternativesQuality(page);
    expect(quality.ok).toBe(false);
  });
});
