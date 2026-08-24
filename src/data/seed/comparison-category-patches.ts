import type { Comparison } from "@/domain";

/**
 * Retag comparisons onto tier hub categories when both products belong on that hub.
 */
export const comparisonCategoryPatches: Record<string, string> = {
  "shore-vs-wati": "reputation-reviews",
  "connecteam-vs-jibble": "field-service-operations",
  "brand24-vs-meltwater": "analytics-bi",
  "brand24-vs-whatconverts": "analytics-bi",
  "brand24-vs-uniqode": "analytics-bi",
  "brand24-vs-databox": "analytics-bi",
  "meltwater-vs-whatconverts": "analytics-bi",
  "meltwater-vs-uniqode": "analytics-bi",
  "uniqode-vs-whatconverts": "analytics-bi",
};

export function applyComparisonCategoryPatches(
  comparisons: Comparison[],
): Comparison[] {
  return comparisons.map((comparison) => {
    const categorySlug = comparisonCategoryPatches[comparison.slug];
    if (!categorySlug) return comparison;
    return { ...comparison, categorySlug };
  });
}
