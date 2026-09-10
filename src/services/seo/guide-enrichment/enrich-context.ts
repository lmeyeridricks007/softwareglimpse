import type { GuidePage } from "@/domain/schemas";
import {
  getComparisonsForProduct,
  getSoftwareBySlug,
} from "@/data/repositories/catalog";
import { loadEnrichment } from "@/data/research/store";
import { loadProductGuideContext } from "@/services/product-guides/context";
import type { DataEnrichmentSignals } from "./types";

/**
 * Inspect which structured SG data is available for enrichment.
 * Unsupported sections are listed in omittedUnsupported — never fabricate.
 */
export function collectDataEnrichmentSignals(
  guide: GuidePage,
): DataEnrichmentSignals {
  const omitted: string[] = [];
  const productSlug = guide.productSlugs[0];
  const software = productSlug ? getSoftwareBySlug(productSlug) : null;
  const enrichment = productSlug ? loadEnrichment(productSlug) : null;

  let ctx: ReturnType<typeof loadProductGuideContext> | null = null;
  if (productSlug) {
    try {
      ctx = loadProductGuideContext(productSlug);
    } catch {
      ctx = null;
      omitted.push("product_guide_context");
    }
  } else {
    omitted.push("product_context");
  }

  const hasPricing = Boolean(
    ctx?.plans?.length ||
      software?.pricingVerifiedAt ||
      enrichment?.pricing,
  );
  if (!hasPricing) omitted.push("pricing_expectations");

  const hasPlanStructure = Boolean(ctx?.hasPlanMatrix || (ctx?.plans?.length ?? 0) > 0);
  if (!hasPlanStructure) omitted.push("plan_structure");

  const hasFreeOrTrial = Boolean(
    (ctx?.freePlanNames?.length ?? 0) > 0 ||
      (ctx?.trialDays != null && ctx.trialDays > 0),
  );

  const hasCapabilities = Boolean(
    (ctx?.features?.length ?? 0) > 0 ||
      (enrichment?.featureSupport?.length ?? 0) > 0,
  );
  if (!hasCapabilities) omitted.push("capabilities");

  const hasIntegrations = Boolean(
    (ctx?.integrationNames?.length ?? 0) > 0 ||
      (enrichment?.integrationSupport?.length ?? 0) > 0,
  );
  if (!hasIntegrations) omitted.push("integrations");

  const hasUseCases = Boolean((enrichment?.editorialFit?.length ?? 0) > 0);
  if (!hasUseCases) omitted.push("use_cases");

  const altSlugs = [
    ...(software?.alternativeSlugs ?? []),
    ...(software?.competitorSlugs ?? []),
  ];
  const hasAlternatives = altSlugs.length > 0;
  if (!hasAlternatives) omitted.push("alternatives");

  const hasCompetitors = (software?.competitorSlugs?.length ?? 0) > 0;
  if (!hasCompetitors) omitted.push("competitors");

  const hasResearchStats = Boolean(
    enrichment?.notes || (enrichment?.sourceIds?.length ?? 0) > 0,
  );
  if (!hasResearchStats) omitted.push("research_statistics");

  const hasTestingEvidence = Boolean(
    enrichment?.screenshots?.some((s) => s.kind === "vendor-ui"),
  );
  if (!hasTestingEvidence) omitted.push("testing_evidence");

  // Comparisons exist for product?
  const hasComparisons =
    productSlug != null &&
    getComparisonsForProduct(productSlug).some((c) => c.seo.indexable);
  if (!hasComparisons) omitted.push("comparisons");

  return {
    hasPricing,
    hasPlanStructure,
    hasFreeOrTrial,
    hasCapabilities,
    hasIntegrations,
    hasUseCases,
    hasAlternatives,
    hasCompetitors,
    hasResearchStats,
    hasTestingEvidence,
    omittedUnsupported: [...new Set(omitted)],
  };
}

export function loadSafeProductContext(productSlug: string) {
  try {
    return loadProductGuideContext(productSlug);
  } catch {
    return null;
  }
}
