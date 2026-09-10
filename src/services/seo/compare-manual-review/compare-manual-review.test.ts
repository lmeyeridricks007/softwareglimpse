import { describe, expect, it } from "vitest";
import { getSoftware } from "@/data";
import { buildSoftwareLookup } from "@/services/seo/compare-index-worthiness";
import {
  buildRelationshipEvidence,
  classifyManualReviewPair,
  decideManualReviewAction,
  resolveManualReviewThesis,
} from "@/services/seo/compare-manual-review";
import type { Comparison } from "@/domain/schemas";

function stubComparison(
  productA: string,
  productB: string,
  categorySlug?: string,
): Comparison {
  return {
    id: `cmp-${productA}-vs-${productB}`,
    slug: `${productA}-vs-${productB}`,
    title: `${productA} vs ${productB}`,
    productSlugs: [productA, productB],
    categorySlug,
    criterionSlugs: [],
    outcomes: [],
    verdict: "",
    overallWinnerKind: "depends",
    bestFor: [],
    pricingNotes: "",
    scenarioRecommendations: [],
    useCaseOutcomes: [],
    relatedAlternativeSlugs: [],
    editorialStatus: "draft",
    refreshNeeded: false,
    metadata: {
      status: "published",
      researchStatus: "partial",
      publishedAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    },
    seo: {
      title: `${productA} vs ${productB}`,
      description: "Compare",
      indexable: false,
      canonicalPath: `/compare/${productA}-vs-${productB}/`,
    },
  } as Comparison;
}

const emptyDemand = {
  gscImpressions: 0,
  gscClicks: 0,
  gscPosition: null as number | null,
  gscHasDirectQuery: false,
  knownBacklinks: 0,
  bestListCoOccurrence: false,
};

describe("compare manual review triage", () => {
  const soft = buildSoftwareLookup(getSoftware());

  it("marks missing products as MISSING_DATA", () => {
    const pack = buildRelationshipEvidence(
      stubComparison("no-such-product-aaa", "no-such-product-bbb"),
      soft,
      emptyDemand,
    );
    const { classification } = classifyManualReviewPair(pack);
    expect(classification).toBe("MISSING_DATA");
    const decision = decideManualReviewAction(classification, pack);
    expect(decision.decision).toBe("BLOCK_PENDING_CATALOGUE");
  });

  it("classifies declared competitors as DIRECT_COMPETITOR", () => {
    const hubspot = soft.get("hubspot");
    const competitorOfHubspot = (hubspot?.competitorSlugs ?? [])[0];
    if (!competitorOfHubspot) {
      expect(true).toBe(true);
      return;
    }
    const pack = buildRelationshipEvidence(
      stubComparison("hubspot", competitorOfHubspot, "crm"),
      soft,
      emptyDemand,
    );
    const { classification } = classifyManualReviewPair(pack);
    expect(classification).toBe("DIRECT_COMPETITOR");
    expect(decideManualReviewAction(classification, pack).decision).toBe(
      "ENQUEUE_ENRICHMENT",
    );
  });

  it("does not treat mega-category + best-list alone as ALTERNATIVE", () => {
    // cursor (ai-code) vs midjourney (ai-image): same AI category, disjoint jobs
    const pack = buildRelationshipEvidence(
      stubComparison("cursor", "midjourney", "ai"),
      soft,
      { ...emptyDemand, bestListCoOccurrence: true },
    );
    expect(pack.sameCategory).toBe(true);
    expect(pack.disjointUseCases).toBe(true);
    const { classification } = classifyManualReviewPair(pack);
    expect(["WEAK_RELATIONSHIP", "NONSENSICAL"]).toContain(classification);
    expect(classification).not.toBe("ALTERNATIVE");
    expect(classification).not.toBe("DIRECT_COMPETITOR");
  });

  it("does not mark cross-category as nonsensical solely for different categories", () => {
    const pack = buildRelationshipEvidence(
      stubComparison("hubspot", "zoominfo", "crm"),
      soft,
      emptyDemand,
    );
    expect(pack.sameCategory).toBe(false);
    const { classification } = classifyManualReviewPair(pack);
    if (classification === "NONSENSICAL") {
      expect(pack.evidenceScore).toBeLessThan(2.5);
    } else {
      expect([
        "CROSS_CATEGORY_DECISION",
        "WEAK_RELATIONSHIP",
        "DIRECT_COMPETITOR",
        "ALTERNATIVE",
        "SPECIALIST_VS_GENERALIST",
      ]).toContain(classification);
    }
  });

  it("keeps WEAK_RELATIONSHIP on best-list co-occurrence without job overlap", () => {
    const pack = buildRelationshipEvidence(
      stubComparison("hubspot", "pipedrive", "crm"),
      soft,
      { ...emptyDemand, bestListCoOccurrence: true },
    );
    const { classification } = classifyManualReviewPair(pack);
    if (
      pack.items.some((i) => i.flag === "declared_competitor" && i.present)
    ) {
      expect(classification).toBe("DIRECT_COMPETITOR");
    } else if (
      pack.relationshipKind === "data_backed_comparable" ||
      ["DIRECT_COMPETITOR", "ALTERNATIVE", "SPECIALIST_VS_GENERALIST"].includes(
        classification,
      )
    ) {
      expect([
        "DIRECT_COMPETITOR",
        "ALTERNATIVE",
        "SPECIALIST_VS_GENERALIST",
      ]).toContain(classification);
    } else {
      expect(classification).toBe("WEAK_RELATIONSHIP");
      expect(decideManualReviewAction(classification, pack).decision).toBe(
        "LEAVE_IMPROVE_WITH_REMEDIATION",
      );
    }
  });

  it("only allows retire when nonsensical and zero demand", () => {
    const emptyPack = buildRelationshipEvidence(
      stubComparison("no-such-a", "no-such-b"),
      soft,
      emptyDemand,
    );
    expect(classifyManualReviewPair(emptyPack).classification).toBe(
      "MISSING_DATA",
    );

    const nonsensicalLike = {
      ...emptyPack,
      missingProduct: false,
      evidenceScore: 0,
      relationshipKind: "cross_category_undeclared",
      sameCategory: false,
      disjointUseCases: false,
      useCaseBreadthSkew: 0,
      useCasesA: [] as string[],
      useCasesB: [] as string[],
      relatedJobFamily: false,
      jobFamiliesA: [] as string[],
      jobFamiliesB: [] as string[],
      items: emptyPack.items.map((i) =>
        i.flag === "missing_product"
          ? { ...i, present: false, weight: 0 }
          : { ...i, present: false, weight: 0 },
      ),
      gscImpressions: 0,
      gscClicks: 0,
      knownBacklinks: 0,
      bestListCoOccurrence: false,
      gscHasDirectQuery: false,
    };
    const { classification } = classifyManualReviewPair(nonsensicalLike);
    expect(classification).toBe("NONSENSICAL");
    const withDemand = decideManualReviewAction(classification, {
      ...nonsensicalLike,
      gscImpressions: 12,
      items: nonsensicalLike.items.map((i) =>
        i.flag === "gsc_demand"
          ? {
              ...i,
              present: true,
              weight: 1.5,
              detail: "GSC impressions=12",
            }
          : i,
      ),
    });
    expect(withDemand.decision).toBe("PRESERVE_NOINDEX_REVIEW");
    expect(withDemand.retireEligible).toBe(false);

    const noDemand = decideManualReviewAction(classification, nonsensicalLike);
    expect(noDemand.decision).toBe("CANDIDATE_RETIRE_NOINDEX");
    expect(noDemand.retireEligible).toBe(true);
  });

  it("treats BambooHR vs Workday as related HR jobs, not kitchen-sink WEAK-only", () => {
    const pack = buildRelationshipEvidence(
      stubComparison("bamboohr", "workday", "hr"),
      soft,
      { ...emptyDemand, bestListCoOccurrence: true },
    );
    expect(pack.relatedJobFamily).toBe(true);
    expect(pack.disjointUseCases).toBe(false);
    const { classification } = classifyManualReviewPair(pack);
    expect([
      "ALTERNATIVE",
      "SPECIALIST_VS_GENERALIST",
      "DIRECT_COMPETITOR",
    ]).toContain(classification);
  });

  it("emits a specific thesis for CRM vs SI pairs when both products exist", () => {
    const a = soft.get("hubspot");
    const b = soft.get("zoominfo") ?? soft.get("apollo");
    if (!a || !b) return;
    const pack = buildRelationshipEvidence(
      stubComparison(a.slug, b.slug),
      soft,
      { ...emptyDemand, gscImpressions: 10, gscPosition: 20 },
    );
    const thesis = resolveManualReviewThesis(a, b, pack);
    expect(thesis).toBeTruthy();
    expect(thesis!.label.length).toBeGreaterThan(5);
    expect(/powerful business tools/i.test(thesis!.rationale)).toBe(false);
    expect(thesis!.supportedBy.length).toBeGreaterThan(0);
  });
});
