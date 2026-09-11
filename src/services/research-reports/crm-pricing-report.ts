import type { CurrencyCode, PricingPlan, PricingRule } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { listCrmPricingSnapshots } from "@/services/pricing/build-snapshot";
import { analyzeCategoryPriceChanges } from "@/services/pricing-history";
import type { PricingSnapshot } from "@/services/pricing/types";

export const CRM_PRICING_REPORT = {
  slug: "crm-pricing",
  path: "/research/crm-pricing/",
  title: "CRM Pricing Statistics & Benchmarks 2026",
  shortTitle: "CRM Pricing Benchmarks 2026",
  year: 2026,
  datasetId: "sg-crm-pricing-catalog-v1",
  /** Editorial publication of methodology 2.0 (not a vendor pricing date). */
  editorialPublishedAt: "2026-09-11",
} as const;

const MIN_MEDIAN_N = 5;

export type PriceBucket = {
  id: string;
  label: string;
  minInclusive: number;
  maxExclusive: number | null;
  count: number;
};

export type ResearchStatistic = {
  id: string;
  label: string;
  valueDisplay: string;
  numericValue: number | null;
  dataset: string;
  sampleSize: number;
  calculation: string;
  date: string;
  limitations: string[];
};

export type NamedOutlier = {
  productSlug: string;
  productName: string;
  metric: string;
  value: number;
  unit: string;
  direction: "high" | "low";
};

export type SegmentStartingRow = {
  segment: string;
  sampleSize: number;
  medianUsd: number | null;
  meanUsd: number | null;
};

export type CrmPricingResearchRow = {
  productSlug: string;
  productName: string;
  currency: CurrencyCode;
  hasFreePlan: boolean;
  hasFreeTrial: boolean;
  hasContactSalesPlan: boolean;
  publicPricedPlanCount: number;
  planCount: number;
  startingPriceMonthly: number | null;
  entryMonthlySeat: number | null;
  annualDiscountPct: number | null;
  pricingCheckedAt: string | null;
};

export type CrmPricingResearchReport = {
  dataset: string;
  title: string;
  path: string;
  observationDate: string;
  observationWindow: { start: string; end: string };
  publishedAt: string;
  lastUpdated: string;
  methodologyVersion: string;
  sample: {
    primaryCrmProducts: number;
    productsWithPlans: number;
    usdProductsWithPlans: number;
    eurProductsWithPlans: number;
    usdWithStartingPrice: number;
    usdPaidStartingPrice: number;
    productsWithFreePlan: number;
    productsWithFreeTrial: number;
    productsWithMonthlySeatRule: number;
    productsWithAnnualDiscountPair: number;
    productsWithContactSalesPlan: number;
    productsContactSalesOnly: number;
    productsWithPublicPricedPlan: number;
    usdPlanCount: number;
    productsWithTwoPlusPaidSeatTiers: number;
    adjacentPaidSeatSteps: number;
  };
  metrics: {
    medianStartingPriceMonthlyUsd: number | null;
    meanStartingPriceMonthlyUsd: number | null;
    startingPriceP25Usd: number | null;
    startingPriceP75Usd: number | null;
    startingPriceMinUsd: number | null;
    startingPriceMaxUsd: number | null;
    paidMedianStartingPriceMonthlyUsd: number | null;
    paidMeanStartingPriceMonthlyUsd: number | null;
    medianEntryMonthlySeatUsd: number | null;
    meanEntryMonthlySeatUsd: number | null;
    freePlanSharePct: number | null;
    freeTrialSharePct: number | null;
    freePlanWithZeroStartingCount: number;
    medianAnnualDiscountPct: number | null;
    meanAnnualDiscountPct: number | null;
    minAnnualDiscountPct: number | null;
    maxAnnualDiscountPct: number | null;
    contactSalesPlanSharePct: number | null;
    publicPricedPlanSharePct: number | null;
    missingStartingPriceSharePct: number | null;
    medianPaidSeatTierStepRatio: number | null;
    medianPlansPerUsdProduct: number | null;
  };
  statistics: ResearchStatistic[];
  executiveFindingIds: string[];
  startingPriceDistribution: PriceBucket[];
  annualDiscountDistribution: PriceBucket[];
  outliers: NamedOutlier[];
  segmentStarting: SegmentStartingRow[];
  history: {
    productsWithTwoPlusStartingObservations: number;
    increases: number;
    decreases: number;
    unchangedReobservations: number;
  };
  ai: {
    productsWithCapabilityRows: number;
    capabilityRows: number;
    higherPlanOnlyRows: number;
    productsWithHigherPlanOnlyCapability: number;
    pricedAddonRules: number;
    skuPricingSufficient: boolean;
  };
  rows: CrmPricingResearchRow[];
  calculationLogic: string[];
  limitations: string[];
  citation: {
    organization: string;
    title: string;
    publishedAt: string;
    updatedAt: string;
    urlPath: string;
    suggestedAttribution: string;
  };
};

function isPerSeat(
  rule: PricingRule,
): rule is Extract<PricingRule, { kind: "per-seat" }> {
  return rule.kind === "per-seat";
}

function annualMonthlyEquivalent(
  rule: Extract<PricingRule, { kind: "per-seat" }>,
): number {
  if (rule.amountPeriod === "year") return rule.amountPerSeat / 12;
  return rule.amountPerSeat;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1]! + sorted[mid]!) / 2
    : sorted[mid]!;
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (idx - lo);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundMoney(n: number): number {
  return Number.isInteger(n) ? n : round2(n);
}

function sharePct(count: number, denom: number): number | null {
  if (denom <= 0) return null;
  return round1((count / denom) * 100);
}

function entryMonthlySeat(plans: PricingPlan[]): number | null {
  let cheapest: number | null = null;
  for (const plan of plans) {
    if (plan.isFree || plan.contactSales) continue;
    for (const rule of plan.rules.filter(isPerSeat)) {
      if (rule.interval !== "month") continue;
      if (cheapest == null || rule.amountPerSeat < cheapest) {
        cheapest = rule.amountPerSeat;
      }
    }
  }
  return cheapest;
}

function bestAnnualDiscountPct(plans: PricingPlan[]): number | null {
  let best: number | null = null;
  for (const plan of plans) {
    if (plan.isFree || plan.contactSales) continue;
    const seats = plan.rules.filter(isPerSeat);
    const monthly = seats.find((r) => r.interval === "month");
    const annual = seats.find((r) => r.interval === "year");
    if (!monthly || !annual || monthly.amountPerSeat <= 0) continue;
    const annualEq = annualMonthlyEquivalent(annual);
    if (monthly.amountPerSeat <= annualEq) continue;
    const pct = ((monthly.amountPerSeat - annualEq) / monthly.amountPerSeat) * 100;
    if (best == null || pct > best) best = pct;
  }
  return best == null ? null : round1(best);
}

function paidMonthlySeatLadder(plans: PricingPlan[]): number[] {
  const seats: number[] = [];
  for (const plan of plans) {
    if (plan.isFree || plan.contactSales) continue;
    const monthly = plan.rules
      .filter(isPerSeat)
      .filter((r) => r.interval === "month")
      .map((r) => r.amountPerSeat);
    if (monthly.length > 0) seats.push(Math.min(...monthly));
  }
  return seats.sort((a, b) => a - b);
}

function publicPricedPlanCount(plans: PricingPlan[]): number {
  return plans.filter(
    (p) => !p.isFree && !p.contactSales && p.rules.length > 0,
  ).length;
}

function bucketStartingPrices(prices: number[]): PriceBucket[] {
  const defs: Array<Omit<PriceBucket, "count">> = [
    { id: "free", label: "$0 (free starting)", minInclusive: 0, maxExclusive: 0.01 },
    { id: "1-14", label: "$1–$14", minInclusive: 0.01, maxExclusive: 15 },
    { id: "15-29", label: "$15–$29", minInclusive: 15, maxExclusive: 30 },
    { id: "30-49", label: "$30–$49", minInclusive: 30, maxExclusive: 50 },
    { id: "50-99", label: "$50–$99", minInclusive: 50, maxExclusive: 100 },
    { id: "100-plus", label: "$100+", minInclusive: 100, maxExclusive: null },
  ];
  return defs.map((def) => ({
    ...def,
    count: prices.filter((p) => {
      if (def.maxExclusive == null) return p >= def.minInclusive;
      if (def.id === "free") return p === 0;
      return p >= def.minInclusive && p < def.maxExclusive;
    }).length,
  }));
}

function bucketAnnualDiscounts(pcts: number[]): PriceBucket[] {
  const defs: Array<Omit<PriceBucket, "count">> = [
    { id: "under-20", label: "Under 20%", minInclusive: 0, maxExclusive: 20 },
    { id: "20-24", label: "20–24.9%", minInclusive: 20, maxExclusive: 25 },
    { id: "25-29", label: "25–29.9%", minInclusive: 25, maxExclusive: 30 },
    { id: "30-plus", label: "30%+", minInclusive: 30, maxExclusive: null },
  ];
  return defs.map((def) => ({
    ...def,
    count: pcts.filter((p) => {
      if (def.maxExclusive == null) return p >= def.minInclusive;
      return p >= def.minInclusive && p < def.maxExclusive;
    }).length,
  }));
}

function observationDatesFrom(snapshots: PricingSnapshot[]): string[] {
  return snapshots
    .map((s) => s.pricingCheckedAt || s.pricing?.verifiedAt)
    .filter((d): d is string => Boolean(d?.trim()))
    .map((d) => d.slice(0, 10))
    .sort();
}

function moneyDisplay(n: number | null): string {
  if (n == null) return "—";
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

function stat(input: Omit<ResearchStatistic, "dataset"> & { dataset?: string }): ResearchStatistic {
  return {
    dataset: CRM_PRICING_REPORT.datasetId,
    ...input,
  };
}

/**
 * Build CRM pricing research report from live catalogue enrichment pricing.
 * Never invents statistics — omits metrics without enough structured rows.
 */
export function buildCrmPricingResearchReport(): CrmPricingResearchReport {
  const snapshots = listCrmPricingSnapshots();
  const withPlans = snapshots.filter((s) => (s.pricing?.plans?.length ?? 0) > 0);
  const usd = withPlans.filter((s) => (s.pricing?.currency ?? "USD") === "USD");
  const eur = withPlans.filter((s) => s.pricing?.currency === "EUR");
  const checkedDates = observationDatesFrom(snapshots);
  const observationDate =
    checkedDates.at(-1) ?? new Date().toISOString().slice(0, 10);
  const observationWindow = {
    start: checkedDates[0] ?? observationDate,
    end: checkedDates.at(-1) ?? observationDate,
  };
  const publishedAt = CRM_PRICING_REPORT.editorialPublishedAt;
  const lastUpdated =
    publishedAt > observationDate ? publishedAt : observationDate;

  const rows: CrmPricingResearchRow[] = usd.map((s) => {
    const plans = s.pricing!.plans;
    return {
      productSlug: s.productSlug,
      productName: s.name,
      currency: "USD" as CurrencyCode,
      hasFreePlan: Boolean(s.pricing!.hasFreePlan || plans.some((p) => p.isFree)),
      hasFreeTrial: Boolean(s.pricing!.hasFreeTrial),
      hasContactSalesPlan: plans.some((p) => p.contactSales),
      publicPricedPlanCount: publicPricedPlanCount(plans),
      planCount: plans.length,
      startingPriceMonthly:
        s.pricing!.startingPriceMonthly != null &&
        Number.isFinite(s.pricing!.startingPriceMonthly)
          ? s.pricing!.startingPriceMonthly
          : null,
      entryMonthlySeat: entryMonthlySeat(plans),
      annualDiscountPct: bestAnnualDiscountPct(plans),
      pricingCheckedAt: s.pricingCheckedAt ?? s.pricing?.verifiedAt ?? null,
    };
  });

  const startingPrices = rows
    .map((r) => r.startingPriceMonthly)
    .filter((n): n is number => n != null);
  const paidStarting = startingPrices.filter((p) => p > 0);
  const entrySeats = rows
    .map((r) => r.entryMonthlySeat)
    .filter((n): n is number => n != null);
  const annualDiscounts = rows
    .map((r) => r.annualDiscountPct)
    .filter((n): n is number => n != null);

  const freeCount = rows.filter((r) => r.hasFreePlan).length;
  const trialCount = rows.filter((r) => r.hasFreeTrial).length;
  const contactSalesCount = rows.filter((r) => r.hasContactSalesPlan).length;
  const contactSalesOnly = rows.filter(
    (r) => r.hasContactSalesPlan && r.publicPricedPlanCount === 0,
  ).length;
  const publicPriced = rows.filter((r) => r.publicPricedPlanCount > 0).length;
  const missingStarting = rows.filter((r) => r.startingPriceMonthly == null).length;
  const zeroStarting = rows.filter((r) => r.startingPriceMonthly === 0).length;
  const usdPlanCount = rows.reduce((sum, r) => sum + r.planCount, 0);
  const planCounts = rows.map((r) => r.planCount);

  const tierSteps: number[] = [];
  let productsWithTwoPlusPaidSeatTiers = 0;
  for (const s of usd) {
    const ladder = paidMonthlySeatLadder(s.pricing!.plans);
    if (ladder.length >= 2) {
      productsWithTwoPlusPaidSeatTiers += 1;
      for (let i = 1; i < ladder.length; i++) {
        const prev = ladder[i - 1]!;
        if (prev > 0) tierSteps.push(ladder[i]! / prev);
      }
    }
  }

  const sizeBuckets: Record<string, number[]> = {};
  for (const row of rows) {
    if (row.startingPriceMonthly == null) continue;
    const software = getSoftwareBySlug(row.productSlug);
    for (const size of software?.businessSizeSlugs ?? []) {
      (sizeBuckets[size] ??= []).push(row.startingPriceMonthly);
    }
  }
  const segmentOrder = ["micro", "small-business", "mid-market", "enterprise"];
  const segmentStarting: SegmentStartingRow[] = segmentOrder
    .filter((seg) => (sizeBuckets[seg]?.length ?? 0) > 0)
    .map((segment) => {
      const values = sizeBuckets[segment]!;
      return {
        segment,
        sampleSize: values.length,
        medianUsd:
          values.length >= MIN_MEDIAN_N ? roundMoney(median(values)!) : null,
        meanUsd: values.length >= MIN_MEDIAN_N ? roundMoney(mean(values)!) : null,
      };
    });

  let aiCapabilityRows = 0;
  let productsWithCapabilityRows = 0;
  let higherPlanOnlyRows = 0;
  let productsWithHigherPlanOnlyCapability = 0;
  let pricedAddonRules = 0;
  for (const s of snapshots) {
    const enrichment = loadEnrichment(s.productSlug);
    const caps = enrichment?.aiCapabilities ?? [];
    if (caps.length > 0) productsWithCapabilityRows += 1;
    aiCapabilityRows += caps.length;
    if (caps.some((c) => c.availability === "higher-plan-only")) {
      productsWithHigherPlanOnlyCapability += 1;
    }
    higherPlanOnlyRows += caps.filter(
      (c) => c.availability === "higher-plan-only",
    ).length;
    for (const plan of s.pricing?.plans ?? []) {
      pricedAddonRules += plan.rules.filter((r) => r.kind === "addon").length;
    }
  }

  const history = analyzeCategoryPriceChanges("crm");

  const medianStarting =
    startingPrices.length >= MIN_MEDIAN_N
      ? roundMoney(median(startingPrices)!)
      : null;
  const meanStarting =
    startingPrices.length >= MIN_MEDIAN_N
      ? roundMoney(mean(startingPrices)!)
      : null;
  const paidMedianStarting =
    paidStarting.length >= MIN_MEDIAN_N
      ? roundMoney(median(paidStarting)!)
      : null;
  const paidMeanStarting =
    paidStarting.length >= MIN_MEDIAN_N
      ? roundMoney(mean(paidStarting)!)
      : null;
  const p25 =
    startingPrices.length >= MIN_MEDIAN_N
      ? roundMoney(percentile(startingPrices, 0.25)!)
      : null;
  const p75 =
    startingPrices.length >= MIN_MEDIAN_N
      ? roundMoney(percentile(startingPrices, 0.75)!)
      : null;
  const medianSeat =
    entrySeats.length >= MIN_MEDIAN_N ? roundMoney(median(entrySeats)!) : null;
  const meanSeat =
    entrySeats.length >= MIN_MEDIAN_N ? roundMoney(mean(entrySeats)!) : null;
  const medianAnnual =
    annualDiscounts.length >= MIN_MEDIAN_N ? median(annualDiscounts) : null;
  const meanAnnual =
    annualDiscounts.length >= MIN_MEDIAN_N
      ? round1(mean(annualDiscounts)!)
      : null;
  const medianTierStep =
    tierSteps.length >= MIN_MEDIAN_N ? round2(median(tierSteps)!) : null;
  const medianPlans =
    planCounts.length >= MIN_MEDIAN_N ? median(planCounts) : null;

  const distribution = bucketStartingPrices(startingPrices);
  const band15to29 = distribution.find((b) => b.id === "15-29");
  const band15to29Share =
    startingPrices.length > 0 && band15to29
      ? sharePct(band15to29.count, startingPrices.length)
      : null;

  const cheapest = [...rows]
    .filter((r) => r.startingPriceMonthly != null)
    .sort((a, b) => a.startingPriceMonthly! - b.startingPriceMonthly!);
  const expensive = [...rows]
    .filter((r) => r.startingPriceMonthly != null)
    .sort((a, b) => b.startingPriceMonthly! - a.startingPriceMonthly!);
  const discountHigh = [...rows]
    .filter((r) => r.annualDiscountPct != null)
    .sort((a, b) => b.annualDiscountPct! - a.annualDiscountPct!);
  const discountLow = [...discountHigh].reverse();

  const outliers: NamedOutlier[] = [];
  if (expensive[0] && expensive[0].startingPriceMonthly != null) {
    outliers.push({
      productSlug: expensive[0].productSlug,
      productName: expensive[0].productName,
      metric: "startingPriceMonthly",
      value: expensive[0].startingPriceMonthly,
      unit: "USD/mo",
      direction: "high",
    });
  }
  if (
    expensive[1] &&
    expensive[1].startingPriceMonthly != null &&
    expensive[1].productSlug !== expensive[0]?.productSlug
  ) {
    outliers.push({
      productSlug: expensive[1].productSlug,
      productName: expensive[1].productName,
      metric: "startingPriceMonthly",
      value: expensive[1].startingPriceMonthly,
      unit: "USD/mo",
      direction: "high",
    });
  }
  for (const row of cheapest.filter((r) => r.startingPriceMonthly === 0)) {
    outliers.push({
      productSlug: row.productSlug,
      productName: row.productName,
      metric: "startingPriceMonthly",
      value: 0,
      unit: "USD/mo",
      direction: "low",
    });
  }
  if (discountHigh[0]?.annualDiscountPct != null) {
    outliers.push({
      productSlug: discountHigh[0].productSlug,
      productName: discountHigh[0].productName,
      metric: "annualDiscountPct",
      value: discountHigh[0].annualDiscountPct,
      unit: "%",
      direction: "high",
    });
  }
  if (
    discountLow[0]?.annualDiscountPct != null &&
    discountLow[0].productSlug !== discountHigh[0]?.productSlug
  ) {
    outliers.push({
      productSlug: discountLow[0].productSlug,
      productName: discountLow[0].productName,
      metric: "annualDiscountPct",
      value: discountLow[0].annualDiscountPct,
      unit: "%",
      direction: "low",
    });
  }

  const date = lastUpdated;
  const usdN = usd.length;
  const startN = startingPrices.length;

  const statistics: ResearchStatistic[] = [];

  const pushIf = (s: ResearchStatistic, ok: boolean) => {
    if (ok) statistics.push(s);
  };

  pushIf(
    stat({
      id: "median-starting",
      label: "Median starting list price",
      valueDisplay: `${moneyDisplay(medianStarting)}/mo`,
      numericValue: medianStarting,
      sampleSize: startN,
      calculation:
        "Median of pricing.startingPriceMonthly on USD primary CRM products where the field is present. Middle value of the sorted sample (mean of two middle values when n is even).",
      date,
      limitations: [
        "startingPriceMonthly is the researched entry list price and is not always a single-seat price.",
        "Products without a numeric starting price are excluded, including several contact-sales vendors.",
      ],
    }),
    medianStarting != null,
  );

  pushIf(
    stat({
      id: "mean-starting",
      label: "Mean starting list price",
      valueDisplay: `${moneyDisplay(meanStarting)}/mo`,
      numericValue: meanStarting,
      sampleSize: startN,
      calculation:
        "Arithmetic mean of the same startingPriceMonthly sample used for the median.",
      date,
      limitations: [
        "The mean is pulled up by high outliers and should not be quoted as a typical buyer price without the median.",
      ],
    }),
    meanStarting != null,
  );

  pushIf(
    stat({
      id: "starting-range",
      label: "Starting price range",
      valueDisplay:
        startingPrices.length > 0
          ? `${moneyDisplay(Math.min(...startingPrices))}–${moneyDisplay(Math.max(...startingPrices))}/mo`
          : "—",
      numericValue:
        startingPrices.length > 0 ? Math.max(...startingPrices) : null,
      sampleSize: startN,
      calculation: "Minimum and maximum of startingPriceMonthly in the USD sample.",
      date,
      limitations: [
        "Range describes list-price extremes in this catalogue, not negotiated invoices.",
      ],
    }),
    startN > 0,
  );

  pushIf(
    stat({
      id: "starting-iqr",
      label: "Starting price 25th–75th percentile",
      valueDisplay:
        p25 != null && p75 != null
          ? `${moneyDisplay(p25)}–${moneyDisplay(p75)}/mo`
          : "—",
      numericValue: p75,
      sampleSize: startN,
      calculation:
        "Linear interpolation percentile of startingPriceMonthly at 0.25 and 0.75.",
      date,
      limitations: ["Small-n percentiles are sensitive to individual products."],
    }),
    p25 != null && p75 != null,
  );

  pushIf(
    stat({
      id: "modal-band",
      label: "Share of starting prices in $15–$29",
      valueDisplay: band15to29Share != null ? `${band15to29Share}%` : "—",
      numericValue: band15to29Share,
      sampleSize: startN,
      calculation:
        "Count of startingPriceMonthly in [15, 30) divided by USD products with a starting price.",
      date,
      limitations: ["Bucket edges are SoftwareGlimpse reporting bands, not vendor SKUs."],
    }),
    band15to29Share != null,
  );

  pushIf(
    stat({
      id: "paid-median-starting",
      label: "Median paid starting price (excluding $0)",
      valueDisplay: `${moneyDisplay(paidMedianStarting)}/mo`,
      numericValue: paidMedianStarting,
      sampleSize: paidStarting.length,
      calculation:
        "Median of startingPriceMonthly after dropping zeros. Free-plan products whose stored starting price is a paid entry remain in this sample.",
      date,
      limitations: [
        "Does not convert free-plan products to $0 unless research stored startingPriceMonthly as 0.",
      ],
    }),
    paidMedianStarting != null,
  );

  pushIf(
    stat({
      id: "median-seat",
      label: "Median cheapest paid monthly seat",
      valueDisplay: `${moneyDisplay(medianSeat)}/user/mo`,
      numericValue: medianSeat,
      sampleSize: entrySeats.length,
      calculation:
        "Per product, cheapest non-free, non-contact-sales per-seat rule with interval=month; then median across products.",
      date,
      limitations: [
        "Products that only publish annual seats or flat platform fees are excluded.",
      ],
    }),
    medianSeat != null,
  );

  pushIf(
    stat({
      id: "mean-seat",
      label: "Mean cheapest paid monthly seat",
      valueDisplay: `${moneyDisplay(meanSeat)}/user/mo`,
      numericValue: meanSeat,
      sampleSize: entrySeats.length,
      calculation: "Arithmetic mean of the same cheapest monthly seat sample.",
      date,
      limitations: ["Same exclusions as the seat median."],
    }),
    meanSeat != null,
  );

  pushIf(
    stat({
      id: "free-plan-share",
      label: "Share offering a free plan",
      valueDisplay:
        sharePct(freeCount, usdN) != null ? `${sharePct(freeCount, usdN)}%` : "—",
      numericValue: sharePct(freeCount, usdN),
      sampleSize: usdN,
      calculation:
        "USD products with hasFreePlan or any plan.isFree, divided by USD products with plans.",
      date,
      limitations: [
        "A free plan is not a $0 startingPriceMonthly. Feature caps are not scored here.",
      ],
    }),
    usdN > 0,
  );

  pushIf(
    stat({
      id: "free-zero-starting",
      label: "Free-plan products with $0 starting price",
      valueDisplay: `${zeroStarting} of ${freeCount}`,
      numericValue: zeroStarting,
      sampleSize: freeCount,
      calculation:
        "Count of USD products where startingPriceMonthly === 0, shown against the free-plan count.",
      date,
      limitations: [
        "Research often stores paid-entry starting prices even when a free tier exists (for example HubSpot Starter vs Free CRM).",
      ],
    }),
    freeCount > 0,
  );

  pushIf(
    stat({
      id: "trial-share",
      label: "Share offering a free trial",
      valueDisplay:
        sharePct(trialCount, usdN) != null ? `${sharePct(trialCount, usdN)}%` : "—",
      numericValue: sharePct(trialCount, usdN),
      sampleSize: usdN,
      calculation: "USD products with pricing.hasFreeTrial, divided by USD products with plans.",
      date,
      limitations: ["Trial length and credit-card requirements are not uniformly structured."],
    }),
    usdN > 0,
  );

  pushIf(
    stat({
      id: "median-annual-discount",
      label: "Median annual billing discount",
      valueDisplay: medianAnnual != null ? `${medianAnnual}%` : "—",
      numericValue: medianAnnual,
      sampleSize: annualDiscounts.length,
      calculation:
        "For each plan with both month and year per-seat rules, (monthly − annual-as-monthly-equivalent) / monthly × 100. Product uses its largest such discount. Median across products with at least one pair.",
      date,
      limitations: [
        "Requires both monthly and annual seat rules on the same plan. Products without that pair are excluded — including vendors that only publish one cadence.",
      ],
    }),
    medianAnnual != null,
  );

  pushIf(
    stat({
      id: "mean-annual-discount",
      label: "Mean annual billing discount",
      valueDisplay: meanAnnual != null ? `${meanAnnual}%` : "—",
      numericValue: meanAnnual,
      sampleSize: annualDiscounts.length,
      calculation: "Arithmetic mean of the same product-level annual discount sample.",
      date,
      limitations: ["Same pair requirement as the median annual discount."],
    }),
    meanAnnual != null,
  );

  pushIf(
    stat({
      id: "contact-sales-share",
      label: "Share with a contact-sales plan",
      valueDisplay:
        sharePct(contactSalesCount, usdN) != null
          ? `${sharePct(contactSalesCount, usdN)}%`
          : "—",
      numericValue: sharePct(contactSalesCount, usdN),
      sampleSize: usdN,
      calculation:
        "USD products with any plan.contactSales=true, divided by USD products with plans.",
      date,
      limitations: [
        "Contact-sales can sit beside public seats; it is not the same as 'no public price'.",
      ],
    }),
    usdN > 0,
  );

  pushIf(
    stat({
      id: "public-priced-share",
      label: "Share with at least one public priced plan",
      valueDisplay:
        sharePct(publicPriced, usdN) != null
          ? `${sharePct(publicPriced, usdN)}%`
          : "—",
      numericValue: sharePct(publicPriced, usdN),
      sampleSize: usdN,
      calculation:
        "USD products with at least one non-free, non-contact-sales plan that has pricing rules.",
      date,
      limitations: ["Public rules can still omit usage overages and implementation fees."],
    }),
    usdN > 0,
  );

  pushIf(
    stat({
      id: "missing-starting-share",
      label: "Share with no published starting price",
      valueDisplay:
        sharePct(missingStarting, usdN) != null
          ? `${sharePct(missingStarting, usdN)}%`
          : "—",
      numericValue: sharePct(missingStarting, usdN),
      sampleSize: usdN,
      calculation:
        "USD products whose enrichment has plans but no numeric startingPriceMonthly.",
      date,
      limitations: ["Usually enterprise / custom-quote packaging, not a $0 product."],
    }),
    usdN > 0,
  );

  pushIf(
    stat({
      id: "tier-step",
      label: "Median adjacent paid-seat tier step",
      valueDisplay: medianTierStep != null ? `${medianTierStep}×` : "—",
      numericValue: medianTierStep,
      sampleSize: tierSteps.length,
      calculation:
        "For each product with ≥2 paid monthly per-seat plans, sort those cheapest-seat prices and take next/previous. Median of those ratios.",
      date,
      limitations: [
        `Product n with ≥2 paid monthly seat tiers is ${productsWithTwoPlusPaidSeatTiers}. Steps are list-price ratios, not feature-value ratios.`,
      ],
    }),
    medianTierStep != null,
  );

  pushIf(
    stat({
      id: "plans-per-product",
      label: "Median plans per USD CRM",
      valueDisplay: medianPlans != null ? String(medianPlans) : "—",
      numericValue: medianPlans,
      sampleSize: usdN,
      calculation: "Median of pricing.plans.length on USD products with plans.",
      date,
      limitations: ["Plan objects follow vendor packaging; add-ons stored as plans are counted."],
    }),
    medianPlans != null,
  );

  const micro = segmentStarting.find((s) => s.segment === "micro");
  const enterprise = segmentStarting.find((s) => s.segment === "enterprise");
  pushIf(
    stat({
      id: "segment-micro-vs-enterprise",
      label: "Median starting price, micro-tagged vs enterprise-tagged",
      valueDisplay:
        micro?.medianUsd != null && enterprise?.medianUsd != null
          ? `${moneyDisplay(micro.medianUsd)} vs ${moneyDisplay(enterprise.medianUsd)}/mo`
          : "—",
      numericValue: enterprise?.medianUsd ?? null,
      sampleSize: (micro?.sampleSize ?? 0) + (enterprise?.sampleSize ?? 0),
      calculation:
        "Median startingPriceMonthly among products tagged businessSizeSlugs=micro vs enterprise. Tags overlap; a product can appear in both samples.",
      date,
      limitations: [
        "Editorial fit tags, not mutually exclusive market segments.",
        `Micro n=${micro?.sampleSize ?? 0}; enterprise n=${enterprise?.sampleSize ?? 0}.`,
      ],
    }),
    micro?.medianUsd != null && enterprise?.medianUsd != null,
  );

  pushIf(
    stat({
      id: "history-changes",
      label: "Observed starting-price increases / decreases",
      valueDisplay: `${history.increases.length} / ${history.decreases.length}`,
      numericValue: history.increases.length + history.decreases.length,
      sampleSize: history.sampleProductsWithHistory,
      calculation:
        "Products with ≥2 starting-price observations: compare latest pair. Count non-zero absolute changes.",
      date,
      limitations: [
        "The observation store is still collecting. Many rows are migration seeds, not independent vendor re-verifies.",
        "Zero changes is not evidence that CRM list prices were stable in the market.",
      ],
    }),
    history.sampleProductsWithHistory > 0,
  );

  pushIf(
    stat({
      id: "ai-gating",
      label: "AI capabilities marked higher-plan-only",
      valueDisplay: `${higherPlanOnlyRows} of ${aiCapabilityRows} rows`,
      numericValue: higherPlanOnlyRows,
      sampleSize: aiCapabilityRows,
      calculation:
        "Count of enrichment.aiCapabilities rows with availability=higher-plan-only, among primary CRM enrichments.",
      date,
      limitations: [
        "This is capability availability, not a priced AI SKU. Addon pricing rules in this CRM set: 0.",
        "Do not cite as AI feature pricing.",
      ],
    }),
    aiCapabilityRows > 0,
  );

  const executiveFindingIds = [
    "median-starting",
    "mean-starting",
    "modal-band",
    "free-plan-share",
    "free-zero-starting",
    "trial-share",
    "median-annual-discount",
    "contact-sales-share",
    "public-priced-share",
    "tier-step",
  ].filter((id) => statistics.some((s) => s.id === id));

  const suggestedAttribution = `SoftwareGlimpse, ${CRM_PRICING_REPORT.title}, updated ${lastUpdated}. https://www.softwareglimpse.com${CRM_PRICING_REPORT.path}`;

  return {
    dataset: CRM_PRICING_REPORT.datasetId,
    title: CRM_PRICING_REPORT.title,
    path: CRM_PRICING_REPORT.path,
    observationDate,
    observationWindow,
    publishedAt,
    lastUpdated,
    methodologyVersion: "2.0.0",
    sample: {
      primaryCrmProducts: snapshots.length,
      productsWithPlans: withPlans.length,
      usdProductsWithPlans: usd.length,
      eurProductsWithPlans: eur.length,
      usdWithStartingPrice: startingPrices.length,
      usdPaidStartingPrice: paidStarting.length,
      productsWithFreePlan: freeCount,
      productsWithFreeTrial: trialCount,
      productsWithMonthlySeatRule: entrySeats.length,
      productsWithAnnualDiscountPair: annualDiscounts.length,
      productsWithContactSalesPlan: contactSalesCount,
      productsContactSalesOnly: contactSalesOnly,
      productsWithPublicPricedPlan: publicPriced,
      usdPlanCount,
      productsWithTwoPlusPaidSeatTiers,
      adjacentPaidSeatSteps: tierSteps.length,
    },
    metrics: {
      medianStartingPriceMonthlyUsd: medianStarting,
      meanStartingPriceMonthlyUsd: meanStarting,
      startingPriceP25Usd: p25,
      startingPriceP75Usd: p75,
      startingPriceMinUsd:
        startingPrices.length > 0 ? Math.min(...startingPrices) : null,
      startingPriceMaxUsd:
        startingPrices.length > 0 ? Math.max(...startingPrices) : null,
      paidMedianStartingPriceMonthlyUsd: paidMedianStarting,
      paidMeanStartingPriceMonthlyUsd: paidMeanStarting,
      medianEntryMonthlySeatUsd: medianSeat,
      meanEntryMonthlySeatUsd: meanSeat,
      freePlanSharePct: sharePct(freeCount, usdN),
      freeTrialSharePct: sharePct(trialCount, usdN),
      freePlanWithZeroStartingCount: zeroStarting,
      medianAnnualDiscountPct: medianAnnual,
      meanAnnualDiscountPct: meanAnnual,
      minAnnualDiscountPct:
        annualDiscounts.length > 0 ? Math.min(...annualDiscounts) : null,
      maxAnnualDiscountPct:
        annualDiscounts.length > 0 ? Math.max(...annualDiscounts) : null,
      contactSalesPlanSharePct: sharePct(contactSalesCount, usdN),
      publicPricedPlanSharePct: sharePct(publicPriced, usdN),
      missingStartingPriceSharePct: sharePct(missingStarting, usdN),
      medianPaidSeatTierStepRatio: medianTierStep,
      medianPlansPerUsdProduct: medianPlans,
    },
    statistics,
    executiveFindingIds,
    startingPriceDistribution: distribution,
    annualDiscountDistribution: bucketAnnualDiscounts(annualDiscounts),
    outliers,
    segmentStarting,
    history: {
      productsWithTwoPlusStartingObservations: history.sampleProductsWithHistory,
      increases: history.increases.length,
      decreases: history.decreases.length,
      unchangedReobservations: history.unchangedReobservations,
    },
    ai: {
      productsWithCapabilityRows,
      capabilityRows: aiCapabilityRows,
      higherPlanOnlyRows,
      productsWithHigherPlanOnlyCapability,
      pricedAddonRules,
      skuPricingSufficient: false,
    },
    rows: rows.sort((a, b) => a.productName.localeCompare(b.productName)),
    calculationLogic: [
      "Universe: published catalogue products with primaryCategorySlug === \"crm\". This is SoftwareGlimpse's researched CRM set, not a census of every CRM vendor.",
      "Pricing source: research enrichment list prices resolved per product (vendor list prices), not affiliate commissions and not negotiated quotes.",
      "Currency filter for published price statistics: USD only. EUR products are counted in catalogue size and excluded from USD medians/means.",
      "Starting price: pricing.startingPriceMonthly when present. Research often stores the lowest paid list price even when a free tier exists.",
      "Paid starting price: startingPriceMonthly > 0.",
      "Entry monthly seat: cheapest non-free per-seat rule with interval=month.",
      "Annual discount %: for plans with both month and year per-seat rules, (monthly − annual-as-monthly-equivalent) / monthly × 100; product uses its largest such discount. Median/mean require n≥5.",
      "Free plan: hasFreePlan or any plan with isFree.",
      "Contact-sales plan: any plan.contactSales. Public priced plan: non-free, non-contact-sales plan with at least one rule.",
      "Paid-seat tier step: among products with ≥2 paid monthly per-seat plans, ratio of adjacent cheapest-seat list prices; median of those ratios, n≥5 steps.",
      "Business-size splits use overlapping editorial businessSizeSlugs. Products may appear in more than one segment.",
      "Medians use the standard middle value of the sorted sample (average of two middle values for even n). Means are arithmetic. Percentiles use linear interpolation.",
      "AI: capability availability rows only. Priced AI SKUs are not published because addon rules in this CRM set are 0 and capability rows are not paired to amounts.",
      "Price history: starting-price observation pairs with ≥2 points. Zero recorded changes is not a market-stability claim.",
    ],
    limitations: [
      "List prices only — negotiated enterprise quotes, promotional coupons, and implementation fees are not included.",
      "Contact-sales / custom plans do not enter seat medians.",
      "Annual discount requires both monthly and annual seat rules on the same plan; products without that pair are excluded from the discount median.",
      "AI feature premiums are not published as prices. Capability flags exist; they are not reliably paired to priced SKUs.",
      "Company-size suitability tags overlap and are editorial fit metadata, not a pricing dimension.",
      "Integrations coverage is too sparse for market penetration claims.",
      "EUR CRMs (Bitrix24, monday sales CRM in this catalogue) are excluded from USD statistics.",
      "HANDS_ON product testing is not in current scope; no statistic claims SoftwareGlimpse used the products.",
      "Price-history series is still collecting; do not cite category inflation or deflation from this vintage.",
      "SoftwareGlimpse is a commercial software research publication and may earn affiliate commissions on some product pages. Commissions are not an input to these list-price statistics, the public CSV/JSON, or chart values.",
    ],
    citation: {
      organization: "SoftwareGlimpse",
      title: CRM_PRICING_REPORT.title,
      publishedAt,
      updatedAt: lastUpdated,
      urlPath: CRM_PRICING_REPORT.path,
      suggestedAttribution,
    },
  };
}

export function crmPricingReportToCsv(report: CrmPricingResearchReport): string {
  const header = [
    "product_slug",
    "product_name",
    "currency",
    "has_free_plan",
    "has_free_trial",
    "has_contact_sales_plan",
    "public_priced_plan_count",
    "plan_count",
    "starting_price_monthly",
    "entry_monthly_seat",
    "annual_discount_pct",
    "pricing_checked_at",
  ];
  const lines = [header.join(",")];
  for (const row of report.rows) {
    lines.push(
      [
        row.productSlug,
        csvEscape(row.productName),
        row.currency,
        row.hasFreePlan ? "true" : "false",
        row.hasFreeTrial ? "true" : "false",
        row.hasContactSalesPlan ? "true" : "false",
        row.publicPricedPlanCount,
        row.planCount,
        row.startingPriceMonthly ?? "",
        row.entryMonthlySeat ?? "",
        row.annualDiscountPct ?? "",
        row.pricingCheckedAt ?? "",
      ].join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

export function crmPricingReportToPublicJson(
  report: CrmPricingResearchReport,
): string {
  const publicReport = {
    dataset: report.dataset,
    title: report.title,
    path: report.path,
    observationDate: report.observationDate,
    observationWindow: report.observationWindow,
    publishedAt: report.publishedAt,
    lastUpdated: report.lastUpdated,
    methodologyVersion: report.methodologyVersion,
    sample: report.sample,
    metrics: report.metrics,
    statistics: report.statistics,
    startingPriceDistribution: report.startingPriceDistribution,
    annualDiscountDistribution: report.annualDiscountDistribution,
    outliers: report.outliers,
    segmentStarting: report.segmentStarting,
    history: report.history,
    ai: report.ai,
    rows: report.rows,
    calculationLogic: report.calculationLogic,
    limitations: report.limitations,
    citation: report.citation,
  };
  return `${JSON.stringify(publicReport, null, 2)}\n`;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
