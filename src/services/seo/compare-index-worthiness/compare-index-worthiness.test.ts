import { describe, expect, it } from "vitest";
import type { Comparison } from "@/domain/schemas";
import { getAllComparisonsUnfiltered, getSoftware } from "@/data";
import { isEntityIndexable } from "@/domain/quality-gates";
import { getSitemapEntries } from "@/seo/sitemap";
import { canonicalUrl } from "@/seo/canonical";
import {
  buildSoftwareLookup,
  evaluateComparisonIndexWorthiness,
  mayCreateIndexableComparison,
  resolveComparisonRelationship,
  isComparisonSearchIndexWorthy,
} from "@/services/seo/compare-index-worthiness";

function stubComparison(
  overrides: Partial<Comparison> &
    Pick<Comparison, "slug" | "productSlugs">,
): Comparison {
  return {
    id: `cmp-${overrides.slug}`,
    title: overrides.title ?? `${overrides.productSlugs[0]} vs ${overrides.productSlugs[1]}`,
    categorySlug: overrides.categorySlug,
    criterionSlugs: overrides.criterionSlugs ?? ["ease-of-use", "pricing", "integrations"],
    outcomes: overrides.outcomes ?? [
      {
        criterionSlug: "ease-of-use",
        winnerKind: "product-a",
        reason: "Product A is simpler for SMB pipelines on daily deal updates.",
        confidence: "high",
        supportingFactIds: ["f1"],
        assessmentIds: ["a1"],
        researchStatus: "complete",
      },
      {
        criterionSlug: "pricing",
        winnerKind: "product-b",
        reason: "Product B seats cost less at five-seller teams.",
        confidence: "high",
        supportingFactIds: ["f2"],
        assessmentIds: ["a2"],
        researchStatus: "complete",
      },
      {
        criterionSlug: "integrations",
        winnerKind: "product-a",
        reason: "Product A documents deeper CRM sync for this buyer.",
        confidence: "medium",
        supportingFactIds: ["f3"],
        assessmentIds: ["a3"],
        researchStatus: "complete",
      },
    ],
    verdict:
      overrides.verdict ??
      "Pick A for suite breadth; pick B when pipeline speed matters most.",
    overallWinnerKind: overrides.overallWinnerKind ?? "depends",
    bestFor: overrides.bestFor ?? [
      { productSlug: overrides.productSlugs[0]!, scenarios: ["SMB sales teams"] },
      { productSlug: overrides.productSlugs[1]!, scenarios: ["Growing GTM orgs"] },
    ],
    pricingNotes: overrides.pricingNotes ?? "Both publish seat-based list pricing.",
    scenarioRecommendations: overrides.scenarioRecommendations ?? [],
    useCaseOutcomes: [],
    relatedAlternativeSlugs: [],
    editorialStatus: overrides.editorialStatus ?? "approved",
    refreshNeeded: false,
    metadata: overrides.metadata ?? {
      status: "published",
      researchStatus: "complete",
      publishedAt: "2026-08-01T00:00:00.000Z",
      updatedAt: "2026-08-01T00:00:00.000Z",
    },
    seo: overrides.seo ?? {
      title: "A vs B CRM",
      description: "Compare A and B on features and pricing.",
      indexable: true,
      canonicalPath: `/compare/${overrides.slug}/`,
    },
    ...overrides,
  } as Comparison;
}

describe("compare index-worthiness", () => {
  const soft = buildSoftwareLookup(getSoftware());

  it("NOINDEX same-category Cartesian pairs without declared competitors", () => {
    // Find a live indexable-seeded pair that is same-category-only
    const all = getAllComparisonsUnfiltered().filter((c) => c.seo.indexable);
    const cartesian = all.find((c) => {
      const rel = resolveComparisonRelationship(c, soft);
      return rel.kind === "same_category_only";
    });
    expect(cartesian).toBeTruthy();
    if (!cartesian) return;

    const evaluation = evaluateComparisonIndexWorthiness(cartesian, { soft });
    expect(evaluation.classification).toBe("IMPROVE");
    expect(evaluation.lifecycle).toBe("IMPROVE");
    expect(evaluation.searchIndexable).toBe(false);
    expect(evaluation.improvementReasons).toContain(
      "WEAK_COMPARISON_RELATIONSHIP",
    );
    expect(isComparisonSearchIndexWorthy(cartesian, soft)).toBe(false);
    expect(
      isEntityIndexable({ kind: "comparison", entity: cartesian }),
    ).toBe(false);
  });

  it("KEEP_INDEX declared competitor pairs that pass quality gates", () => {
    const all = getAllComparisonsUnfiltered();
    const declared = all.find((c) => {
      const rel = resolveComparisonRelationship(c, soft);
      return (
        rel.kind === "declared_competitor" &&
        c.seo.indexable &&
        c.metadata.researchStatus === "complete" &&
        c.verdict &&
        (c.bestFor?.length ?? 0) > 0
      );
    });
    expect(declared).toBeTruthy();
    if (!declared) return;

    const evaluation = evaluateComparisonIndexWorthiness(declared, {
      soft,
      inboundCount: 2,
    });
    expect(evaluation.classification).toBe("KEEP_INDEX");
    expect(evaluation.lifecycle).toBe("INDEXABLE");
    expect(evaluation.searchIndexable).toBe(true);
    expect(isEntityIndexable({ kind: "comparison", entity: declared })).toBe(
      true,
    );
  });

  it("blocks Cartesian generation from becoming indexable", () => {
    const products = getSoftware().filter(
      (s) => s.primaryCategorySlug === "crm" && s.metadata.status === "published",
    );
    const a = products[0];
    const b = products.find(
      (p) =>
        p.slug !== a?.slug &&
        !(a?.competitorSlugs ?? []).includes(p.slug) &&
        !(p.competitorSlugs ?? []).includes(a?.slug ?? "") &&
        !(a?.alternativeSlugs ?? []).includes(p.slug) &&
        !(p.alternativeSlugs ?? []).includes(a?.slug ?? ""),
    );
    expect(a && b).toBeTruthy();
    if (!a || !b) return;

    const policy = mayCreateIndexableComparison({ productA: a, productB: b });
    expect(policy.ok).toBe(false);
    expect(policy.reasons.join(" ")).toMatch(/Cartesian|declared/i);
  });

  it("sitemap only includes KEEP_INDEX comparisons", () => {
    const entries = getSitemapEntries();
    const compareUrls = entries.filter((e) =>
      e.url.includes("/compare/") && !e.url.endsWith("/compare/"),
    );
    expect(compareUrls.length).toBeGreaterThan(50);
    expect(compareUrls.length).toBeLessThan(2500);

    // Spot-check: no Cartesian-only slug from a known NOINDEX evaluation
    const softMap = soft;
    for (const entry of compareUrls.slice(0, 40)) {
      const slug = entry.url.split("/compare/")[1]?.replace(/\/$/, "") ?? "";
      const comparison = getAllComparisonsUnfiltered().find((c) => c.slug === slug);
      if (!comparison) continue;
      expect(isComparisonSearchIndexWorthy(comparison, softMap)).toBe(true);
      expect(entry.url).toBe(canonicalUrl(`/compare/${slug}/`));
    }
  }, 30_000);

  it("stub without relationship fails search gate", () => {
    const c = stubComparison({
      slug: "zzzz-aaa-vs-zzzz-bbb",
      productSlugs: ["zzzz-aaa", "zzzz-bbb"],
      categorySlug: "crm",
    });
    expect(isComparisonSearchIndexWorthy(c, soft)).toBe(false);
  });
});
