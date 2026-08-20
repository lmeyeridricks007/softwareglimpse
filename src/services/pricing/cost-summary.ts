import { formatMoney, type Money, type ProductCostEstimate } from "@/domain";

export type CalculableEstimate = ProductCostEstimate & {
  monthlyEquivalent: Money;
  currency: NonNullable<ProductCostEstimate["currency"]>;
};

export type CostRangeSummary = {
  currency: NonNullable<ProductCostEstimate["currency"]>;
  lowest: CalculableEstimate;
  highest: CalculableEstimate;
  /** Catalogue midpoint (median of sorted calculable monthly equivalents) — not a market average. */
  midpoint: CalculableEstimate;
  sorted: CalculableEstimate[];
  /** 25th–75th percentile band when enough calculable rows exist (≥ 4). */
  interquartile?: { low: Money; high: Money };
};

/**
 * Calculable rows with a monthly equivalent, same-currency only when filtering
 * for a single comparable band.
 */
export function listCalculableEstimates(
  estimates: ProductCostEstimate[],
): CalculableEstimate[] {
  return estimates.filter(
    (e): e is CalculableEstimate =>
      (e.status === "calculated" || e.status === "partial") &&
      e.monthlyEquivalent != null &&
      e.currency != null,
  );
}

export function sameCurrencyCode(
  estimates: CalculableEstimate[],
): CalculableEstimate["currency"] | null {
  const currencies = [...new Set(estimates.map((e) => e.currency))];
  return currencies.length === 1 ? currencies[0]! : null;
}

/**
 * Derive lowest / midpoint / highest from researched calculable estimates.
 * Midpoint is the median catalogue row — not a statistical market typical.
 */
export function deriveCostRangeSummary(
  estimates: ProductCostEstimate[],
): CostRangeSummary | null {
  const rows = listCalculableEstimates(estimates);
  const currency = sameCurrencyCode(rows);
  if (!currency || rows.length === 0) return null;

  const sorted = [...rows].sort(
    (a, b) =>
      a.monthlyEquivalent.amountMinor - b.monthlyEquivalent.amountMinor,
  );
  const lowest = sorted[0]!;
  const highest = sorted[sorted.length - 1]!;
  const midpoint = sorted[Math.floor((sorted.length - 1) / 2)]!;

  let interquartile: CostRangeSummary["interquartile"];
  if (sorted.length >= 4) {
    const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)]!;
    const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)]!;
    interquartile = {
      low: q1.monthlyEquivalent,
      high: q3.monthlyEquivalent,
    };
  }

  return { currency, lowest, highest, midpoint, sorted, interquartile };
}

export function positionInRangeLabel(
  currentMinor: number,
  range: CostRangeSummary,
): string {
  const { lowest, highest, midpoint } = range;
  const span =
    highest.monthlyEquivalent.amountMinor -
    lowest.monthlyEquivalent.amountMinor;
  if (span <= 0) {
    return "All calculable options share the same researched monthly equivalent.";
  }
  if (currentMinor <= lowest.monthlyEquivalent.amountMinor) {
    return "You are currently at the low end of researched catalogue pricing.";
  }
  if (currentMinor >= highest.monthlyEquivalent.amountMinor) {
    return "You are currently at the high end of researched catalogue pricing.";
  }
  if (currentMinor <= midpoint.monthlyEquivalent.amountMinor) {
    return "You are currently below the catalogue midpoint of researched pricing.";
  }
  return "You are currently above the catalogue midpoint of researched pricing.";
}

export type PricingInsight = {
  id: string;
  text: string;
};

/**
 * Deterministic buyer insights from calculated results only.
 */
export function buildPricingInsights(
  estimates: ProductCostEstimate[],
): PricingInsight[] {
  const range = deriveCostRangeSummary(estimates);
  if (!range) return [];

  const insights: PricingInsight[] = [];
  const { lowest, sorted } = range;

  insights.push({
    id: "lowest",
    text: `${lowest.productName} is the lowest calculable option for your current configuration${
      lowest.recommendedPlan ? ` (${lowest.recommendedPlan.name})` : ""
    } at ${formatMoney(lowest.monthlyEquivalent)}/month.`,
  });

  for (const row of sorted.slice(1, 4)) {
    const delta =
      row.monthlyEquivalent.amountMinor - lowest.monthlyEquivalent.amountMinor;
    if (delta <= 0) continue;
    insights.push({
      id: `delta-${row.productSlug}`,
      text: `${row.productName} costs ${formatMoney({
        amountMinor: delta,
        currency: range.currency,
      })}/month more than ${lowest.productName} for this configuration.`,
    });
  }

  const annualOnly = sorted.filter(
    (e) => e.annualCost && e.monthlyCashCost == null,
  ).length;
  if (annualOnly > 0) {
    insights.push({
      id: "annual-billing",
      text: `Annual billing affects the cash payment schedule for ${annualOnly} of the compared plans (monthly equivalent shown for comparison).`,
    });
  }

  const partial = estimates.filter((e) => e.status === "partial").length;
  if (partial > 0) {
    insights.push({
      id: "partial",
      text: `${partial} product${partial === 1 ? "" : "s"} returned a partial estimate — some pricing components may require vendor confirmation.`,
    });
  }

  const notCalculable = estimates.filter(
    (e) =>
      e.status === "insufficient-data" ||
      e.status === "custom-quote" ||
      e.status === "no-suitable-plan",
  ).length;
  if (notCalculable > 0) {
    insights.push({
      id: "not-calculable",
      text: `${notCalculable} product${notCalculable === 1 ? "" : "s"} could not be fully priced from public research for this configuration.`,
    });
  }

  return insights;
}
