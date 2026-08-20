import {
  getAlternativesPageBySlug,
  getBestPages,
  getComparisonsForProduct,
  getSoftwareByCategory,
  getSoftwareBySlug,
  getTopLevelCategories,
} from "@/data";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import { loadEnrichment } from "@/data/research/store";
import type {
  CategoryMaturity,
  ProductMaturityTier,
} from "@/domain";

export function assessProductMaturity(
  productSlug: string | undefined,
): ProductMaturityTier {
  if (!productSlug) return "TIER_0_CATALOGUE_ONLY";
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) return "TIER_0_CATALOGUE_ONLY";

  const enrichment = loadEnrichment(product.slug);
  const hasIdentity = Boolean(product.primaryCategorySlug);
  if (!hasIdentity) return "TIER_1_IDENTITY_TAXONOMY";

  const researched =
    enrichment != null ||
    product.metadata.researchStatus === "complete" ||
    product.metadata.researchStatus === "in-progress";

  if (!researched && product.metadata.status !== "published") {
    return "TIER_1_IDENTITY_TAXONOMY";
  }

  if (!researched) {
    // Published stub without research
    return product.metadata.status === "published"
      ? "TIER_3_CORE_PAGE"
      : "TIER_1_IDENTITY_TAXONOMY";
  }

  const alts = getAlternativesPageBySlug(product.slug, {
    includeUnpublished: true,
  });
  const comps = getComparisonsForProduct(product.slug, {
    includeUnpublished: true,
  });
  const bestEligible = getBestPages({ includeUnpublished: true }).some(
    (b) =>
      b.eligibleProductSlugs.includes(product.slug) ||
      b.recommendations.some((r) => r.productSlug === product.slug),
  );

  const corePage =
    product.metadata.status === "published" ||
    product.metadata.status === "draft";

  if (!corePage) return "TIER_2_RESEARCH";

  const decisionReady = Boolean(alts) && comps.length >= 1;
  if (!decisionReady) return "TIER_3_CORE_PAGE";

  const integrated =
    decisionReady &&
    (bestEligible || comps.length >= 2) &&
    Boolean(product.primaryCategorySlug);

  // Fully integrated if CRM finder-class maturity
  const override = getCategoryOnboardingOverride(product.primaryCategorySlug);
  if (integrated && override.finder === "crm" && bestEligible) {
    return "TIER_5_FULLY_INTEGRATED";
  }
  if (integrated) return "TIER_4_DECISION_ECOSYSTEM";
  return "TIER_3_CORE_PAGE";
}

export function assessCategoryMaturity(categorySlug: string): CategoryMaturity {
  const override = getCategoryOnboardingOverride(categorySlug);
  const products = getSoftwareByCategory(categorySlug, {
    includeUnpublished: true,
  });
  const researched = products.filter((p) => {
    const e = loadEnrichment(p.slug);
    return (
      e != null ||
      p.metadata.researchStatus === "complete" ||
      p.metadata.researchStatus === "in-progress"
    );
  });
  const withAlts = products.filter((p) =>
    getAlternativesPageBySlug(p.slug, { includeUnpublished: true }),
  );
  const best = getBestPages({ includeUnpublished: true }).find(
    (b) =>
      b.categorySlug === categorySlug ||
      b.slug.includes(categorySlug),
  );

  if (override.finder === "crm" && best && researched.length >= 5) {
    return "MATURE";
  }
  if (override.finder !== "none" && best) return "TOOL_READY";
  if (best && withAlts.length >= 2) return "DECISION_READY";
  if (override.categoryContentReady && researched.length >= 1) {
    return "CONTENT_READY";
  }
  if (override.requiredResearchDomains.length > 0) return "RESEARCH_READY";
  return "DEFINED";
}

export function clusterCompletionScore(categorySlug: string): number {
  const products = getSoftwareByCategory(categorySlug, {
    includeUnpublished: true,
  });
  if (products.length === 0) return 0;
  const researched = products.filter(
    (p) => loadEnrichment(p.slug) != null,
  ).length;
  const reviewed = products.filter(
    (p) =>
      p.metadata.status === "published" || p.metadata.status === "draft",
  ).length;
  const comparisonReady = products.filter(
    (p) =>
      getComparisonsForProduct(p.slug, { includeUnpublished: true }).length > 0,
  ).length;
  const best = getBestPages({ includeUnpublished: true }).some(
    (b) => b.categorySlug === categorySlug || b.slug.includes(categorySlug),
  );
  const override = getCategoryOnboardingOverride(categorySlug);
  const tool = override.finder !== "none" ? 1 : 0;

  const n = products.length;
  return Math.round(
    100 *
      (0.25 * (researched / n) +
        0.25 * (reviewed / n) +
        0.2 * (comparisonReady / n) +
        0.15 * (best ? 1 : 0) +
        0.15 * tool),
  );
}

export function listCategoryMaturities(): Array<{
  categorySlug: string;
  maturity: CategoryMaturity;
  clusterScore: number;
  productCount: number;
}> {
  return getTopLevelCategories({ includeUnpublished: true }).map((c) => ({
    categorySlug: c.slug,
    maturity: assessCategoryMaturity(c.slug),
    clusterScore: clusterCompletionScore(c.slug),
    productCount: getSoftwareByCategory(c.slug, { includeUnpublished: true })
      .length,
  }));
}
