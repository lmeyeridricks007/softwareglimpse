import type {
  FeatureAvailability,
  ProductResearchEnrichment,
  Software,
} from "@/domain";
import { PricingSchema } from "@/domain";
import type { IntegrationKindScoreKey } from "@/domain/recommendation/fit-values";
import { crmFitBySlug, resolveCrmProductFit } from "@/data/seed/crm-fit";
import { siFitBySlug, resolveSiProductFit } from "@/data/seed/si-fit";
import type { ProductRecommendationSnapshot } from "./types";

export type BuildSnapshotInput = {
  software: Software;
  enrichment?: ProductResearchEnrichment | null;
  /** Override research completeness 0–1; otherwise derived. */
  researchCompleteness?: number;
};

/**
 * Build a scoring snapshot from Software + enrichment + derived product fit.
 * Strips affiliate — never copies affiliate onto the snapshot.
 * Fit always starts from catalogue taxonomy so every candidate participates.
 */
export function buildProductSnapshot(
  input: BuildSnapshotInput,
): ProductRecommendationSnapshot {
  const { software, enrichment } = input;
  // Intentionally ignore software.affiliate

  const fit =
    software.primaryCategorySlug === "sales-intelligence"
      ? (siFitBySlug[software.slug] ?? resolveSiProductFit(software))
      : (crmFitBySlug[software.slug] ?? resolveCrmProductFit(software));

  const featureSupport =
    enrichment?.featureSupport.map((f) => ({
      slug: f.featureSlug,
      availability: f.availability as FeatureAvailability,
    })) ?? [];

  const integrationSupport =
    enrichment?.integrationSupport.map((i) => ({
      slug: i.integrationSlug,
      kind: (i.kind ?? "unknown") as IntegrationKindScoreKey,
    })) ?? [];

  const pricing = extractPricing(software, enrichment);
  const hasFixtureResearch = detectFixtureResearch(enrichment);
  const researchCompleteness =
    input.researchCompleteness ??
    deriveResearchCompleteness({
      software,
      enrichment,
      featureSupportCount: featureSupport.length,
      hasPricing: pricing?.startingPriceMonthly != null,
    });

  return {
    slug: software.slug,
    name: software.name,
    primaryCategorySlug: software.primaryCategorySlug,
    secondaryCategorySlugs: [...software.secondaryCategorySlugs],
    subcategorySlugs: [...software.subcategorySlugs],
    useCaseSlugs: [...software.useCaseSlugs],
    businessSizeSlugs: [...software.businessSizeSlugs],
    businessTypeSlugs: [...software.businessTypeSlugs],
    userPrioritySlugs: [...software.userPrioritySlugs],
    featureSupport,
    integrationSupport,
    pricing,
    researchCompleteness,
    hasFixtureResearch,
    fit,
  };
}

export function buildProductSnapshots(
  items: BuildSnapshotInput[],
): ProductRecommendationSnapshot[] {
  return items.map(buildProductSnapshot);
}

function extractPricing(
  software: Software,
  enrichment?: ProductResearchEnrichment | null,
): ProductRecommendationSnapshot["pricing"] {
  const fromEnrichment = enrichment?.pricing;
  if (fromEnrichment != null) {
    const parsed = PricingSchema.safeParse(fromEnrichment);
    if (parsed.success) {
      return {
        startingPriceMonthly: parsed.data.startingPriceMonthly,
        currency: parsed.data.currency,
        model: parsed.data.model,
        hasFreePlan: parsed.data.hasFreePlan,
        plans: parsed.data.plans,
      };
    }
  }
  if (software.pricing) {
    return {
      startingPriceMonthly: software.pricing.startingPriceMonthly,
      currency: software.pricing.currency,
      model: software.pricing.model,
      hasFreePlan: software.pricing.hasFreePlan,
      plans: software.pricing.plans,
    };
  }
  return undefined;
}

function detectFixtureResearch(
  enrichment?: ProductResearchEnrichment | null,
): boolean {
  if (!enrichment) return false;
  if (enrichment.sourceIds.some((id) => id.includes("fixture"))) return true;
  if (enrichment.notes?.toLowerCase().includes("fixture")) return true;
  return enrichment.featureSupport.some((f) =>
    f.sourceIds.some((id) => id.includes("fixture")),
  );
}

export function deriveResearchCompleteness(input: {
  software: Software;
  enrichment?: ProductResearchEnrichment | null;
  featureSupportCount: number;
  hasPricing: boolean;
}): number {
  let score = 0;
  let total = 0;

  const push = (ok: boolean, weight = 1) => {
    total += weight;
    if (ok) score += weight;
  };

  push(Boolean(input.software.primaryCategorySlug));
  push(input.software.useCaseSlugs.length > 0);
  push(input.software.subcategorySlugs.length > 0, 0.5);
  push(input.featureSupportCount > 0, 1.5);
  push(input.hasPricing, 1);
  push((input.enrichment?.integrationSupport.length ?? 0) > 0, 0.5);
  push(Boolean(input.enrichment?.shortDescription), 0.5);

  return total > 0 ? Math.round((score / total) * 100) / 100 : 0;
}
