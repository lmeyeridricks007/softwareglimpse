import { canonicalizeComparisonSlug } from "@/domain/comparison-slug";
import type { SeoOpportunityType } from "@/domain";
import { normalizeQuery } from "./normalize-query";

function lexProducts(slugs: readonly string[]): string[] {
  return [...slugs].map((s) => s.toLowerCase()).sort();
}

/**
 * Stable opportunity ids — idempotent across detection runs.
 */
export function opportunityIdForComparison(
  productSlugs: readonly string[],
): string {
  const [a, b] = lexProducts(productSlugs);
  if (!a || !b) {
    throw new Error("comparison opportunity requires two product slugs");
  }
  const slug = canonicalizeComparisonSlug([a, b]);
  return `seo-opportunity:comparison:${slug.replace(/-vs-/, ":")}`;
}

export function opportunityIdForPricing(productSlug: string): string {
  return `seo-opportunity:pricing:${productSlug}`;
}

export function opportunityIdForAlternatives(productSlug: string): string {
  return `seo-opportunity:alternatives:${productSlug}`;
}

export function opportunityIdForBest(bestSlug: string): string {
  return `seo-opportunity:best:${bestSlug}`;
}

export function opportunityIdForUseCase(
  categoryOrUseCaseSlug: string,
): string {
  return `seo-opportunity:use-case:${categoryOrUseCaseSlug}`;
}

export function opportunityIdForCtr(contentId: string): string {
  return `seo-opportunity:ctr:${contentId}`;
}

export function opportunityIdForNoClick(contentId: string, query: string): string {
  return `seo-opportunity:no-click:${contentId}:${normalizeQuery(query).replace(/\s+/g, "-")}`;
}

export function opportunityIdForStrikingDistance(
  contentId: string,
  query: string,
): string {
  return `seo-opportunity:striking-distance:${contentId}:${normalizeQuery(query).replace(/\s+/g, "-")}`;
}

export function opportunityIdForCannibalization(query: string): string {
  return `seo-opportunity:cannibalization:${normalizeQuery(query).replace(/\s+/g, "-")}`;
}

export function opportunityIdForDecay(contentId: string): string {
  return `seo-opportunity:decay:${contentId}`;
}

export function opportunityIdForGrowth(contentId: string): string {
  return `seo-opportunity:growth:${contentId}`;
}

export function opportunityIdForMismatch(
  query: string,
  contentId: string,
): string {
  return `seo-opportunity:mismatch:${contentId}:${normalizeQuery(query).replace(/\s+/g, "-")}`;
}

export function opportunityIdForInternalLink(
  sourceContentId: string,
  targetContentId: string,
): string {
  return `seo-opportunity:internal-link:${sourceContentId}:${targetContentId}`;
}

export function opportunityIdForMissing(
  type: Extract<
    SeoOpportunityType,
    | "missing-content"
    | "comparison-opportunity"
    | "alternatives-opportunity"
    | "pricing-opportunity"
    | "use-case-opportunity"
  >,
  key: string,
): string {
  return `seo-opportunity:${type}:${key}`;
}
