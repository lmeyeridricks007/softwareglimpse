import type { CurrencyCode, PricingPlan, PricingRule } from "@/domain";
import { listCrmPricingSnapshots } from "@/services/pricing/build-snapshot";
import type { PricingSnapshot } from "@/services/pricing/types";

export const CRM_PRICING_REPORT = {
  slug: "crm-pricing",
  path: "/research/crm-pricing/",
  title: "CRM Pricing Statistics & Benchmarks 2026",
  shortTitle: "CRM Pricing Benchmarks 2026",
  year: 2026,
  datasetId: "sg-crm-pricing-catalog-v1",
} as const;

export type PriceBucket = {
  id: string;
  label: string;
  minInclusive: number;
  maxExclusive: number | null;
  count: number;
};

export type CrmPricingResearchReport = {
  dataset: string;
  title: string;
  path: string;
  observationDate: string;
  methodologyVersion: string;
  sample: {
    primaryCrmProducts: number;
    productsWithPlans: number;
    usdProductsWithPlans: number;
    usdWithStartingPrice: number;
    productsWithFreePlan: number;
    productsWithFreeTrial: number;
    productsWithMonthlySeatRule: number;
    productsWithAnnualDiscountPair: number;
  };
  metrics: {
    medianStartingPriceMonthlyUsd: number | null;
    startingPriceMinUsd: number | null;
    startingPriceMaxUsd: number | null;
    medianEntryMonthlySeatUsd: number | null;
    freePlanSharePct: number | null;
    freeTrialSharePct: number | null;
    medianAnnualDiscountPct: number | null;
  };
  startingPriceDistribution: PriceBucket[];
  rows: Array<{
    productSlug: string;
    productName: string;
    currency: CurrencyCode;
    hasFreePlan: boolean;
    hasFreeTrial: boolean;
    startingPriceMonthly: number | null;
    entryMonthlySeat: number | null;
    annualDiscountPct: number | null;
    pricingCheckedAt: string | null;
  }>;
  calculationLogic: string[];
  limitations: string[];
};

function isPerSeat(
  rule: PricingRule,
): rule is Extract<PricingRule, { kind: "per-seat" }> {
  return rule.kind === "per-seat";
}

function annualMonthlyEquivalent(rule: Extract<PricingRule, { kind: "per-seat" }>): number {
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

function round1(n: number): number {
  return Math.round(n * 10) / 10;
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

function observationDateFrom(snapshots: PricingSnapshot[]): string {
  const dates = snapshots
    .map((s) => s.pricingCheckedAt || s.pricing?.verifiedAt)
    .filter((d): d is string => Boolean(d?.trim()))
    .sort();
  return dates.at(-1)?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
}

/**
 * Build CRM pricing research report from live catalogue enrichment pricing.
 * Never invents statistics — omits metrics without enough structured rows.
 */
export function buildCrmPricingResearchReport(): CrmPricingResearchReport {
  const snapshots = listCrmPricingSnapshots();
  const withPlans = snapshots.filter((s) => (s.pricing?.plans?.length ?? 0) > 0);
  const usd = withPlans.filter((s) => (s.pricing?.currency ?? "USD") === "USD");

  const rows = usd.map((s) => {
    const plans = s.pricing!.plans;
    return {
      productSlug: s.productSlug,
      productName: s.name,
      currency: "USD" as CurrencyCode,
      hasFreePlan: Boolean(
        s.pricing!.hasFreePlan || plans.some((p) => p.isFree),
      ),
      hasFreeTrial: Boolean(s.pricing!.hasFreeTrial),
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
  const entrySeats = rows
    .map((r) => r.entryMonthlySeat)
    .filter((n): n is number => n != null);
  const annualDiscounts = rows
    .map((r) => r.annualDiscountPct)
    .filter((n): n is number => n != null);

  const freeCount = rows.filter((r) => r.hasFreePlan).length;
  const trialCount = rows.filter((r) => r.hasFreeTrial).length;

  return {
    dataset: CRM_PRICING_REPORT.datasetId,
    title: CRM_PRICING_REPORT.title,
    path: CRM_PRICING_REPORT.path,
    observationDate: observationDateFrom(usd),
    methodologyVersion: "1.0.0",
    sample: {
      primaryCrmProducts: snapshots.length,
      productsWithPlans: withPlans.length,
      usdProductsWithPlans: usd.length,
      usdWithStartingPrice: startingPrices.length,
      productsWithFreePlan: freeCount,
      productsWithFreeTrial: trialCount,
      productsWithMonthlySeatRule: entrySeats.length,
      productsWithAnnualDiscountPair: annualDiscounts.length,
    },
    metrics: {
      medianStartingPriceMonthlyUsd: median(startingPrices),
      startingPriceMinUsd:
        startingPrices.length > 0 ? Math.min(...startingPrices) : null,
      startingPriceMaxUsd:
        startingPrices.length > 0 ? Math.max(...startingPrices) : null,
      medianEntryMonthlySeatUsd: median(entrySeats),
      freePlanSharePct:
        usd.length > 0 ? round1((freeCount / usd.length) * 100) : null,
      freeTrialSharePct:
        usd.length > 0 ? round1((trialCount / usd.length) * 100) : null,
      medianAnnualDiscountPct:
        annualDiscounts.length >= 5 ? median(annualDiscounts) : null,
    },
    startingPriceDistribution: bucketStartingPrices(startingPrices),
    rows: rows.sort((a, b) => a.productName.localeCompare(b.productName)),
    calculationLogic: [
      "Universe: products with primaryCategorySlug === \"crm\" from the SoftwareGlimpse catalogue (published).",
      "Pricing source: research enrichment pricing resolved per product (vendor list prices), not affiliate commissions.",
      "Currency filter for published price statistics: USD only (EUR products counted in catalogue size but excluded from USD medians).",
      "Starting price: pricing.startingPriceMonthly when present.",
      "Entry monthly seat: cheapest non-free per-seat rule with interval=month.",
      "Annual discount %: for plans with both month and year per-seat rules, (monthly − annual-as-monthly-equivalent) / monthly × 100; product uses its largest such discount.",
      "Free plan: hasFreePlan or any plan with isFree.",
      "Medians use the standard middle value of the sorted sample (average of two middle values for even n).",
    ],
    limitations: [
      "List prices only — negotiated enterprise quotes are not included.",
      "Contact-sales / custom plans do not enter seat medians.",
      "Annual discount requires both monthly and annual seat rules on the same plan; products without that pair are excluded from the discount median.",
      "AI feature premiums are not published — capability flags are present but not reliably paired to priced SKUs.",
      "Company-size suitability is editorial fit metadata, not a pricing dimension in this report.",
      "Integrations coverage is too sparse for market penetration claims.",
    ],
  };
}

export function crmPricingReportToCsv(report: CrmPricingResearchReport): string {
  const header = [
    "product_slug",
    "product_name",
    "currency",
    "has_free_plan",
    "has_free_trial",
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
        row.startingPriceMonthly ?? "",
        row.entryMonthlySeat ?? "",
        row.annualDiscountPct ?? "",
        row.pricingCheckedAt ?? "",
      ].join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`;
  return value;
}
