import type { PriceChangeImpactPage } from "./impact";

/**
 * Dependency order for pricing propagation refresh.
 *
 * 1. software pricing source (canonical — handled before page refresh)
 * 2. pricing page
 * 3. software review
 * 4. cost calculator data
 * 5. highest-priority comparisons
 * 6. best / category pages
 * 7. research aggregates
 */
export const PRICING_REFRESH_TIERS = {
  software_pricing_source: 1,
  pricing_page: 2,
  software_review: 3,
  cost_calculator: 4,
  comparison: 5,
  best_or_category: 6,
  research: 7,
  other: 8,
} as const;

export type PricingRefreshTierName = keyof typeof PRICING_REFRESH_TIERS;

export type OrderedPriceRefreshPage = PriceChangeImpactPage & {
  refreshTier: number;
  tierName: PricingRefreshTierName;
};

function tierForPage(page: PriceChangeImpactPage): {
  refreshTier: number;
  tierName: PricingRefreshTierName;
} {
  switch (page.pageType) {
    case "pricing":
      return {
        refreshTier: PRICING_REFRESH_TIERS.pricing_page,
        tierName: "pricing_page",
      };
    case "software-review":
      return {
        refreshTier: PRICING_REFRESH_TIERS.software_review,
        tierName: "software_review",
      };
    case "tool":
      return {
        refreshTier: PRICING_REFRESH_TIERS.cost_calculator,
        tierName: "cost_calculator",
      };
    case "comparison":
      return {
        refreshTier: PRICING_REFRESH_TIERS.comparison,
        tierName: "comparison",
      };
    case "best":
    case "category":
    case "alternatives":
      return {
        refreshTier: PRICING_REFRESH_TIERS.best_or_category,
        tierName: "best_or_category",
      };
    case "research":
      return {
        refreshTier: PRICING_REFRESH_TIERS.research,
        tierName: "research",
      };
    default:
      return {
        refreshTier: PRICING_REFRESH_TIERS.other,
        tierName: "other",
      };
  }
}

/**
 * Sort impact pages into the required refresh dependency order.
 * Comparisons are secondary-sorted by path for stable queues.
 */
export function orderPriceRefreshPages(
  pages: PriceChangeImpactPage[],
): OrderedPriceRefreshPage[] {
  return pages
    .map((page) => {
      const tier = tierForPage(page);
      return { ...page, ...tier };
    })
    .sort((a, b) => {
      if (a.refreshTier !== b.refreshTier) {
        return a.refreshTier - b.refreshTier;
      }
      return a.path.localeCompare(b.path);
    });
}
