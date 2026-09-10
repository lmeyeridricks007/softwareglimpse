import { describe, expect, it } from "vitest";
import type { Comparison, Software } from "@/domain/schemas";
import {
  analyzeProductComparability,
  buildSoftwareLookup,
  hasIndexableRelationship,
  resolveComparisonRelationship,
} from "@/services/seo/compare-index-worthiness/relationship";
import { buildCapabilityCompareRows } from "@/services/seo/compare-enrichment/capability-table";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import { planCompareEnrichment } from "@/services/seo/compare-enrichment/plan";
import { resolveComparisonThesis } from "@/services/seo/compare-enrichment/thesis";
import { runCompareEnrichmentQa } from "@/services/seo/compare-enrichment/qa";

function softProduct(
  overrides: Partial<Software> & Pick<Software, "slug" | "name" | "primaryCategorySlug">,
): Software {
  return {
    id: `soft-${overrides.slug}`,
    aliases: [],
    formerlyKnownAs: [],
    entityType: "software",
    productLifecycle: "active",
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    industrySlugs: [],
    businessSizeSlugs: [],
    businessTypeSlugs: [],
    teamTypeSlugs: [],
    useCaseSlugs: [],
    userPrioritySlugs: [],
    featureRatings: [],
    integrationSlugs: [],
    platforms: [],
    deploymentModels: [],
    aiCapabilities: [],
    pros: [],
    cons: [],
    bestFor: [],
    notIdealFor: [],
    competitorSlugs: [],
    alternativeSlugs: [],
    comparableSlugs: [],
    affiliate: {
      enabled: false,
      network: "none",
      disclosureRequired: true,
    },
    sources: [],
    metadata: { status: "published", researchStatus: "complete" },
    seo: { indexable: true },
    ...overrides,
  };
}

function stubComparison(
  a: string,
  b: string,
  overrides: Partial<Comparison> = {},
): Comparison {
  const slug = `${a}-vs-${b}`;
  return {
    id: `cmp-${slug}`,
    slug,
    title: `${a} vs ${b}`,
    productSlugs: [a, b],
    categorySlug: "crm",
    criterionSlugs: [],
    outcomes: [],
    bestFor: [],
    scenarioRecommendations: [],
    useCaseOutcomes: [],
    relatedAlternativeSlugs: [],
    editorialStatus: "not-assessed",
    refreshNeeded: false,
    metadata: { status: "published" },
    seo: {
      indexable: false,
      canonicalPath: `/compare/${slug}/`,
    },
    ...overrides,
  };
}

describe("compare relationship data-backed model", () => {
  it("does not treat same-category-only as indexable", () => {
    const a = softProduct({
      slug: "alpha",
      name: "Alpha",
      primaryCategorySlug: "crm",
    });
    const b = softProduct({
      slug: "beta",
      name: "Beta",
      primaryCategorySlug: "crm",
    });
    const soft = buildSoftwareLookup([a, b]);
    const rel = resolveComparisonRelationship(
      stubComparison("alpha", "beta"),
      soft,
    );
    expect(rel.kind).toBe("same_category_only");
    expect(hasIndexableRelationship(rel.kind)).toBe(false);
  });

  it("promotes data-backed comparability without declared competitor edge", () => {
    const a = softProduct({
      slug: "alpha",
      name: "Alpha",
      primaryCategorySlug: "crm",
      useCaseSlugs: ["pipeline-management", "email-tracking"],
      businessSizeSlugs: ["smb", "startup"],
      featureRatings: [
        { featureSlug: "pipeline", available: true, rating: 8 },
        { featureSlug: "email", available: true, rating: 7 },
        { featureSlug: "reporting", available: true, rating: 6 },
      ],
      integrationSlugs: ["gmail", "slack", "zapier"],
      bestFor: ["SMB sales teams closing outbound deals"],
    });
    const b = softProduct({
      slug: "beta",
      name: "Beta",
      primaryCategorySlug: "crm",
      useCaseSlugs: ["pipeline-management", "forecasting"],
      businessSizeSlugs: ["smb"],
      featureRatings: [
        { featureSlug: "pipeline", available: true, rating: 7 },
        { featureSlug: "email", available: false },
        { featureSlug: "reporting", rating: 8 },
      ],
      integrationSlugs: ["gmail", "slack", "hubspot"],
      bestFor: ["SMB sales teams needing forecasting"],
      pricing: {
        model: "subscription",
        startingPriceMonthly: 15,
        plans: [],
        sourceIds: [],
      },
    });
    a.pricing = {
      model: "subscription",
      startingPriceMonthly: 14,
      plans: [],
      sourceIds: [],
    };

    const analysis = analyzeProductComparability(a, b);
    expect(analysis.dataBackedComparable).toBe(true);

    const soft = buildSoftwareLookup([a, b]);
    const rel = resolveComparisonRelationship(
      stubComparison("alpha", "beta"),
      soft,
    );
    expect(rel.kind).toBe("data_backed_comparable");
    expect(hasIndexableRelationship(rel.kind)).toBe(true);
  });
});

describe("capability table unknown semantics", () => {
  it("marks missing ratings as unknown, never unsupported", () => {
    const a = softProduct({
      slug: "alpha",
      name: "Alpha",
      primaryCategorySlug: "crm",
      featureRatings: [{ featureSlug: "pipeline", available: true }],
    });
    const b = softProduct({
      slug: "beta",
      name: "Beta",
      primaryCategorySlug: "crm",
      featureRatings: [],
    });
    const rows = buildCapabilityCompareRows(a, b);
    const pipeline = rows.find((r) => r.featureSlug === "pipeline");
    expect(pipeline?.statusA).toBe("supported");
    expect(pipeline?.statusB).toBe("unknown");
    expect(pipeline?.statusB).not.toBe("unsupported");
  });
});

describe("thesis + plan", () => {
  it("emits pricing-model thesis only when models differ with category overlap", () => {
    const a = softProduct({
      slug: "alpha",
      name: "Alpha",
      primaryCategorySlug: "crm",
      pricing: { model: "freemium", plans: [], sourceIds: [] },
      useCaseSlugs: ["pipeline-management"],
      businessSizeSlugs: ["smb"],
    });
    const b = softProduct({
      slug: "beta",
      name: "Beta",
      primaryCategorySlug: "crm",
      pricing: { model: "custom-quote", plans: [], sourceIds: [] },
      useCaseSlugs: ["pipeline-management"],
      businessSizeSlugs: ["enterprise"],
    });
    const signals = analyzeProductComparability(a, b).signals;
    const thesis = resolveComparisonThesis(a, b, signals);
    expect(thesis).not.toBeNull();
    expect(
      [
        "similar_product_different_pricing_model",
        "enterprise_vs_smb",
        "same_category_different_company_size",
        "overlapping_use_case_tradeoff",
        "same_category_different_strengths",
      ].includes(thesis!.kind),
    ).toBe(true);
  });

  it("plans deterministic apply when choose-if data exists", () => {
    const a = softProduct({
      slug: "alpha",
      name: "Alpha",
      primaryCategorySlug: "crm",
      bestFor: ["simple outbound pipelines"],
      useCaseSlugs: ["pipeline-management", "email-tracking"],
      businessSizeSlugs: ["smb"],
      featureRatings: [
        { featureSlug: "pipeline", available: true },
        { featureSlug: "email", available: true },
      ],
      pricing: {
        model: "subscription",
        startingPriceMonthly: 12,
        plans: [],
        sourceIds: [],
      },
    });
    const b = softProduct({
      slug: "beta",
      name: "Beta",
      primaryCategorySlug: "crm",
      bestFor: ["enterprise reporting suites"],
      useCaseSlugs: ["pipeline-management", "forecasting"],
      businessSizeSlugs: ["enterprise"],
      featureRatings: [
        { featureSlug: "pipeline", available: true },
        { featureSlug: "email", available: false },
      ],
      pricing: {
        model: "custom-quote",
        startingPriceMonthly: 80,
        plans: [],
        sourceIds: [],
      },
    });
    const soft = buildSoftwareLookup([a, b]);
    const plan = planCompareEnrichment(stubComparison("alpha", "beta"), soft);
    expect(plan.canApplyDeterministically).toBe(true);
    expect(plan.decisionDraft.chooseAIf.length).toBeGreaterThan(0);
    expect(plan.evidence.disclaimer.toLowerCase()).toContain("hands-on");
  });
});

describe("overlay merge + QA", () => {
  it("merges verdict and bestFor without dropping slug identity", () => {
    const base = stubComparison("alpha", "beta");
    const merged = mergeComparisonWithOverlay(base, {
      slug: "alpha-vs-beta",
      updatedAt: new Date().toISOString(),
      uniqueValueAdded: ["quick_verdict"],
      thesis: null,
      capabilityRows: [],
      pricing: null,
      evidence: null,
      patch: {
        verdict: "Choose Alpha for simple pipelines; Beta for enterprise reporting.",
        bestFor: [
          { productSlug: "alpha", scenarios: ["simple pipelines"] },
          { productSlug: "beta", scenarios: ["enterprise reporting"] },
        ],
        overallWinnerKind: "depends",
      },
      notes: [],
    });
    expect(merged.slug).toBe("alpha-vs-beta");
    expect(merged.verdict).toContain("Alpha");
    expect(merged.bestFor?.[0]?.scenarios[0]).toBe("simple pipelines");
  });

  it("blocks broken product links in QA", () => {
    const soft = buildSoftwareLookup([]);
    const qa = runCompareEnrichmentQa(
      stubComparison("missing-a", "missing-b"),
      soft,
    );
    expect(qa.ok).toBe(false);
    expect(qa.findings.some((f) => f.code === "broken_product_link")).toBe(
      true,
    );
  });
});
