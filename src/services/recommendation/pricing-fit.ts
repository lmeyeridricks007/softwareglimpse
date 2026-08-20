import type { CrmFinderCriteria } from "@/domain";
import type { ProductRecommendationSnapshot } from "./types";

export type PricingEstimate = {
  estimatedMonthlyTotal?: number;
  estimatedCurrency?: string;
};

/**
 * Estimate monthly total = startingPriceMonthly * crmUsers when price is known
 * and model looks per-seat-ish. Do not invent prices.
 */
export function estimateMonthlyTotal(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): PricingEstimate {
  const pricing = snapshot.pricing;
  if (!pricing || pricing.startingPriceMonthly == null) {
    return {};
  }

  const model = pricing.model ?? "unknown";
  const perSeatIsh =
    model === "subscription" ||
    model === "freemium" ||
    model === "unknown" ||
    model === "free";

  if (!perSeatIsh) {
    return {};
  }

  const currency =
    pricing.currency && /^[A-Z]{3}$/.test(pricing.currency)
      ? pricing.currency
      : undefined;

  return {
    estimatedMonthlyTotal:
      Math.round(pricing.startingPriceMonthly * criteria.crmUsers * 100) / 100,
    estimatedCurrency: currency,
  };
}
