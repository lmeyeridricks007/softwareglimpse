import {
  getAlternativesPageBySlug,
  getBestPages,
  getComparisonBySlug,
  getSoftwareBySlug,
} from "@/data";
import { onboardingPolicy } from "@/data/config/onboarding/policy";
import {
  canonicalizeComparisonSlug,
  comparisonCandidateId,
  type PageCandidate,
  type PricingReadinessStatus,
  type RelationshipCandidate,
  type Software,
} from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { planProductKnowledge } from "@/services/knowledge-planners";

export type EditorialReadinessMap = {
  review: "READY" | "PARTIAL" | "BLOCKED";
  pricing: "READY" | "PARTIAL" | "BLOCKED";
  alternatives: "READY" | "PARTIAL" | "BLOCKED";
  comparisons: "READY" | "PARTIAL" | "BLOCKED";
  bestInclusion: "READY" | "PARTIAL" | "BLOCKED";
  notes: string[];
};

export function assessEditorialReadiness(input: {
  product: Software;
  researchPercent: number;
  categoryContentReady: boolean;
  pricingStatus: PricingReadinessStatus;
  relationshipCandidates: RelationshipCandidate[];
}): EditorialReadinessMap {
  const notes: string[] = [];
  const { product, researchPercent, categoryContentReady, pricingStatus } =
    input;

  if (!categoryContentReady) {
    notes.push("Category methodology not ready — content may be category-blocked");
  }

  const review: EditorialReadinessMap["review"] =
    researchPercent >= onboardingPolicy.minResearchPercentForContent &&
    product.entityType === "software"
      ? categoryContentReady
        ? "READY"
        : "PARTIAL"
      : "BLOCKED";

  const pricing: EditorialReadinessMap["pricing"] =
    pricingStatus === "FULL"
      ? "READY"
      : pricingStatus === "PARTIAL"
        ? "PARTIAL"
        : "BLOCKED";

  const approvedAlts = input.relationshipCandidates.filter(
    (c) =>
      (c.type === "alternative-to" || c.type === "competes-with") &&
      c.confidence !== "low",
  );
  const alternatives: EditorialReadinessMap["alternatives"] =
    approvedAlts.length >= onboardingPolicy.minApprovedAlternativesForPage
      ? "READY"
      : approvedAlts.length > 0
        ? "PARTIAL"
        : "BLOCKED";

  const comparisons: EditorialReadinessMap["comparisons"] =
    approvedAlts.length > 0 ? "PARTIAL" : "BLOCKED";

  const bestInclusion: EditorialReadinessMap["bestInclusion"] =
    product.entityType === "software" && researchPercent >= 30
      ? "READY"
      : "BLOCKED";

  return {
    review,
    pricing,
    alternatives,
    comparisons,
    bestInclusion,
    notes,
  };
}

/**
 * Structured content map — candidates only, never auto-publish.
 */
export function buildContentMap(input: {
  product: Software;
  categoryContentReady: boolean;
  researchPercent: number;
  pricingStatus: PricingReadinessStatus;
  relationshipCandidates: RelationshipCandidate[];
  seoPrioritySlugs?: string[];
}): PageCandidate[] {
  const {
    product,
    categoryContentReady,
    researchPercent,
    pricingStatus,
    relationshipCandidates,
  } = input;
  const candidates: PageCandidate[] = [];
  const seoBoost = new Set(input.seoPrioritySlugs ?? []);

  if (product.entityType !== "software" && product.entityType !== "platform" && product.entityType !== "hybrid") {
    return [
      {
        id: `page-candidate:skip:${product.slug}`,
        pageType: "software-review",
        canonicalPath: `/software/${product.slug}/`,
        canonicalIntent: "software-review",
        productSlugs: [product.slug],
        reason: `Entity type ${product.entityType} is not standard software`,
        readiness: "not-recommended",
        priority: 0,
        dependencies: [],
        status: "not-recommended",
      },
    ];
  }

  const existingProduct = getSoftwareBySlug(product.slug, {
    includeUnpublished: true,
  });
  const productPageStatus =
    !categoryContentReady
      ? ("category-blocked" as const)
      : researchPercent < onboardingPolicy.minResearchPercentForContent
        ? ("research-required" as const)
        : ("ready-to-create" as const);

  candidates.push({
    id: `page-candidate:software:${product.slug}`,
    pageType: "software-review",
    canonicalPath: `/software/${product.slug}/`,
    canonicalIntent: "software-review",
    productSlugs: [product.slug],
    categorySlug: product.primaryCategorySlug,
    reason: existingProduct
      ? "Canonical product page candidate (entity exists)"
      : "Canonical product page for valid software product",
    readiness: productPageStatus,
    priority: 90,
    dependencies: [`research:${product.slug}`],
    status: productPageStatus,
  });

  const pricingReady =
    pricingStatus === "FULL"
      ? ("ready-to-create" as const)
      : pricingStatus === "PARTIAL"
        ? ("research-required" as const)
        : ("blocked" as const);

  candidates.push({
    id: `page-candidate:pricing:${product.slug}`,
    pageType: "pricing",
    canonicalPath: `/pricing/${product.slug}/`,
    canonicalIntent: "pricing",
    productSlugs: [product.slug],
    reason:
      pricingStatus === "UNSUPPORTED_MODEL"
        ? "Pricing model unsupported by calculator — blocked"
        : "Pricing page when verified pricing exists",
    readiness: pricingReady,
    priority: 75,
    dependencies: [`research:${product.slug}:pricing`],
    status: pricingReady,
  });

  const altPeers = relationshipCandidates
    .filter(
      (c) =>
        c.type === "alternative-to" ||
        c.type === "competes-with" ||
        c.type === "related-to",
    )
    .filter((c) => c.confidence !== "low");

  const existingAlts = getAlternativesPageBySlug(product.slug, {
    includeUnpublished: true,
  });
  const altStatus =
    altPeers.length >= onboardingPolicy.minApprovedAlternativesForPage
      ? existingAlts
        ? ("duplicate" as const)
        : ("ready-to-create" as const)
      : ("relationship-review-required" as const);

  candidates.push({
    id: `page-candidate:alternatives:${product.slug}`,
    pageType: "alternatives",
    canonicalPath: `/alternatives/${product.slug}/`,
    canonicalIntent: "alternatives",
    productSlugs: [product.slug, ...altPeers.slice(0, 5).map((c) => c.targetSlug)],
    reason:
      altStatus === "relationship-review-required"
        ? "Need meaningful approved alternatives before creating page"
        : "Alternatives page candidate",
    readiness: altStatus,
    priority: 70,
    dependencies: altPeers.slice(0, 3).map((c) => `relationship:${c.targetSlug}`),
    status: altStatus,
  });

  // Cap comparisons — prefer competitors, then SEO demand
  const comparisonTargets = [
    ...relationshipCandidates.filter((c) => c.type === "competes-with"),
    ...relationshipCandidates.filter((c) => c.type === "alternative-to"),
    ...relationshipCandidates.filter((c) => c.type === "related-to"),
  ]
    .filter((c, i, arr) => arr.findIndex((x) => x.targetSlug === c.targetSlug) === i)
    .sort((a, b) => {
      const aBoost = seoBoost.has(a.targetSlug) ? 1 : 0;
      const bBoost = seoBoost.has(b.targetSlug) ? 1 : 0;
      if (aBoost !== bBoost) return bBoost - aBoost;
      const conf = { high: 3, medium: 2, low: 1 };
      return conf[b.confidence] - conf[a.confidence];
    })
    .slice(0, onboardingPolicy.maxDefaultComparisons);

  for (const rel of comparisonTargets) {
    const other = getSoftwareBySlug(rel.targetSlug, { includeUnpublished: true });
    const slug = canonicalizeComparisonSlug([product.slug, rel.targetSlug]);
    const existing = getComparisonBySlug(slug, { includeUnpublished: true });
    let status: PageCandidate["status"] = "ready-to-create";
    if (!other) status = "research-required";
    else if (existing) status = "duplicate";
    else if (rel.confidence === "low") status = "relationship-review-required";
    else if (!categoryContentReady) status = "category-blocked";

    const priority = 60 + (seoBoost.has(rel.targetSlug) ? 15 : 0);

    candidates.push({
      id: comparisonCandidateId(product.slug, rel.targetSlug),
      pageType: "comparison",
      canonicalPath: `/compare/${slug}/`,
      canonicalIntent: "comparison",
      productSlugs: [product.slug, rel.targetSlug].sort(),
      reason: `Comparison candidate via ${rel.origin} (${rel.confidence})`,
      readiness: status,
      priority,
      dependencies: [
        `research:${product.slug}`,
        `research:${rel.targetSlug}`,
        `relationship:${rel.targetSlug}`,
      ],
      status,
    });
  }

  const bestPages = getBestPages({ includeUnpublished: true }).filter(
    (b) =>
      b.categorySlug === product.primaryCategorySlug ||
      product.secondaryCategorySlugs.includes(b.categorySlug ?? ""),
  );

  for (const best of bestPages.slice(0, 3)) {
    candidates.push({
      id: `page-candidate:best-inclusion:${best.slug}:${product.slug}`,
      pageType: "best-inclusion",
      canonicalPath: `/best/${best.slug}/`,
      canonicalIntent: "best-inclusion",
      productSlugs: [product.slug],
      categorySlug: best.categorySlug,
      reason:
        "Eligible for editorial evaluation on existing best page — NOT auto-ranked",
      readiness:
        researchPercent >= 30 ? "ready-to-create" : "research-required",
      priority: 55,
      dependencies: [`research:${product.slug}`, `editorial-eval:${best.slug}`],
      status: researchPercent >= 30 ? "ready-to-create" : "research-required",
    });
  }

  // Touch enrichment so research overlay is acknowledged (no side effects)
  void loadEnrichment(product.slug);

  // Optional product supporting-content candidates (never required for onboarding completeness)
  try {
    const productPlan = planProductKnowledge(product.slug);
    for (const topic of productPlan.topicCandidates.slice(0, 5)) {
      candidates.push({
        id: `page-candidate:guide:${topic.suggestedSlug}`,
        pageType: "guide",
        canonicalPath: `/guides/${topic.suggestedSlug}/`,
        canonicalIntent: "guide",
        productSlugs: [product.slug],
        categorySlug: product.primaryCategorySlug,
        reason: `Optional product supporting topic (${productPlan.eligibility}) — not required for onboarding`,
        readiness:
          productPlan.eligibility === "GUIDES_NOT_NEEDED"
            ? "not-recommended"
            : topic.readiness === "ready"
              ? "ready-to-create"
              : "research-required",
        priority: 35,
        dependencies: [`research:${product.slug}`, `product-knowledge-plan`],
        status:
          productPlan.eligibility === "GUIDES_NOT_NEEDED"
            ? "not-recommended"
            : topic.readiness === "ready"
              ? "ready-to-create"
              : "research-required",
      });
    }
  } catch {
    // Product knowledge planner may be blocked on research — do not fail content map
  }

  return candidates;
}
