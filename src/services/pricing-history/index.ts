import type {
  PriceObservation,
  PriceObservationConfidence,
  PriceVerificationMethod,
  Pricing,
  PricingPlan,
  PricingRule,
} from "@/domain";
import {
  priceObservationFingerprint,
  priceObservationSeriesKey,
} from "@/domain";
import type { PricingHistorySnapshot } from "@/data/research/pricing-history";
import { getCrmPricingHistory } from "@/data/research/pricing-history";
import {
  appendPriceObservations,
  listAllPriceObservations,
  loadProductPriceHistory,
} from "@/data/research/pricing-history/store";

export {
  priceObservationFingerprint,
  priceObservationSeriesKey,
} from "@/domain";

export type { PricingHistorySnapshot } from "@/data/research/pricing-history";

export type PriceChange = {
  productId: string;
  planId: string | null;
  planName: string | null;
  previousPrice: number | null;
  newPrice: number | null;
  absoluteChange: number | null;
  percentageChange: number | null;
  changeDate: string;
  previousObservedAt: string;
  currency: string;
  billingPeriod: string;
  billingBasis: string;
  previous: PriceObservation;
  current: PriceObservation;
};

export type RecordObservationOptions = {
  /** Append even when fingerprint matches latest in series (periodic re-verify). */
  forcePeriodic?: boolean;
};

export type ProductPriceHistorySummary = {
  productId: string;
  /** True when at least one series has ≥2 observations. */
  hasMeaningfulHistory: boolean;
  series: Array<{
    seriesKey: string;
    planId: string | null;
    planName: string | null;
    metricKind: string;
    billingPeriod: string;
    billingBasis: string;
    current: PriceObservation;
    previous: PriceObservation | null;
    change: PriceChange | null;
    observationCount: number;
  }>;
};

function toDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function buildObservationId(parts: {
  productId: string;
  planId: string | null;
  metricKind: string;
  billingPeriod: string;
  billingBasis: string;
  observedAt: string;
  price: number | null;
}): string {
  return [
    parts.productId,
    parts.planId ?? "product",
    parts.metricKind,
    parts.billingPeriod,
    parts.billingBasis,
    toDateOnly(parts.observedAt),
    parts.price == null ? "null" : String(parts.price),
  ].join("__");
}

function basisFromRule(rule: PricingRule): {
  billingBasis: PriceObservation["billingBasis"];
  perUser: boolean;
  price: number | null;
  minimumUsers: number | null;
  billingPeriod: PriceObservation["billingPeriod"];
} {
  if (rule.kind === "per-seat") {
    return {
      billingBasis: "per-user",
      perUser: true,
      price: rule.amountPerSeat,
      minimumUsers: rule.minimumSeats ?? null,
      billingPeriod: rule.interval,
    };
  }
  if (rule.kind === "flat") {
    return {
      billingBasis: "flat-rate",
      perUser: false,
      price: rule.amount,
      minimumUsers: null,
      billingPeriod: rule.interval,
    };
  }
  if (rule.kind === "usage" || rule.kind === "per-unit" || rule.kind === "tiered") {
    return {
      billingBasis: "usage-based",
      perUser: false,
      price:
        rule.kind === "usage" || rule.kind === "per-unit"
          ? rule.amountPerUnit
          : null,
      minimumUsers: null,
      billingPeriod:
        rule.kind === "usage"
          ? "custom"
          : rule.interval,
    };
  }
  return {
    billingBasis: "flat-rate",
    perUser: false,
    price: "amount" in rule ? rule.amount : null,
    minimumUsers: null,
    billingPeriod: "interval" in rule ? rule.interval : "custom",
  };
}

export type ExtractPricingObservationInput = {
  productId: string;
  pricing: Pricing;
  categorySlug?: string;
  observedAt: string;
  verificationMethod: PriceVerificationMethod;
  confidence: PriceObservationConfidence;
  source?: string;
  notes?: string;
};

/**
 * Derive observation candidates from current-state Pricing.
 * Does not invent amounts — only copies stored fields.
 */
export function extractObservationsFromPricing(
  input: ExtractPricingObservationInput,
): PriceObservation[] {
  const {
    productId,
    pricing,
    categorySlug,
    observedAt,
    verificationMethod,
    confidence,
  } = input;
  const currency = pricing.currency ?? "USD";
  const sourceIds = pricing.sourceIds ?? [];
  const source =
    input.source ??
    sourceIds[0] ??
    `${productId}-pricing`;
  const notes = input.notes;
  const out: PriceObservation[] = [];

  const entryPlan =
    pricing.plans.find((p) => !p.isFree && !p.contactSales) ??
    pricing.plans[0] ??
    null;

  if (pricing.startingPriceMonthly != null || pricing.model === "custom" || pricing.model === "custom-quote") {
    const contactSales =
      pricing.model === "custom" ||
      pricing.model === "custom-quote" ||
      (entryPlan?.contactSales === true && pricing.startingPriceMonthly == null);

    const starting: PriceObservation = {
      id: buildObservationId({
        productId,
        planId: null,
        metricKind: "starting-price",
        billingPeriod: "month",
        billingBasis: contactSales ? "contact-sales" : "per-user",
        observedAt,
        price: pricing.startingPriceMonthly ?? null,
      }),
      productId,
      planId: null,
      planName: entryPlan?.name,
      observedAt: toDateOnly(observedAt),
      price: pricing.startingPriceMonthly ?? null,
      currency,
      billingPeriod: "month",
      billingBasis: contactSales ? "contact-sales" : "per-user",
      perUser: !contactSales,
      minimumUsers: null,
      source,
      sourceIds,
      verificationMethod,
      confidence,
      notes,
      categorySlug,
      metricKind: "starting-price",
    };
    out.push(starting);
  }

  for (const plan of pricing.plans) {
    out.push(...observationsFromPlan({
      productId,
      plan,
      currency,
      categorySlug,
      observedAt,
      verificationMethod,
      confidence,
      source,
      sourceIds,
      notes,
    }));
  }

  return out;
}

function observationsFromPlan(input: {
  productId: string;
  plan: PricingPlan;
  currency: string;
  categorySlug?: string;
  observedAt: string;
  verificationMethod: PriceVerificationMethod;
  confidence: PriceObservationConfidence;
  source: string;
  sourceIds: string[];
  notes?: string;
}): PriceObservation[] {
  const { productId, plan } = input;
  const out: PriceObservation[] = [];

  if (plan.contactSales && plan.rules.length === 0) {
    const obs: PriceObservation = {
      id: buildObservationId({
        productId,
        planId: plan.id,
        metricKind: "plan-list",
        billingPeriod: "custom",
        billingBasis: "contact-sales",
        observedAt: input.observedAt,
        price: null,
      }),
      productId,
      planId: plan.id,
      planName: plan.name,
      observedAt: toDateOnly(input.observedAt),
      price: null,
      currency: input.currency as PriceObservation["currency"],
      billingPeriod: "custom",
      billingBasis: "contact-sales",
      perUser: false,
      minimumUsers: null,
      source: input.source,
      sourceIds: input.sourceIds,
      verificationMethod: input.verificationMethod,
      confidence: input.confidence,
      notes: input.notes,
      categorySlug: input.categorySlug,
      metricKind: "plan-list",
    };
    out.push(obs);
    return out;
  }

  if (plan.isFree) {
    const obs: PriceObservation = {
      id: buildObservationId({
        productId,
        planId: plan.id,
        metricKind: "plan-list",
        billingPeriod: "month",
        billingBasis: "flat-rate",
        observedAt: input.observedAt,
        price: 0,
      }),
      productId,
      planId: plan.id,
      planName: plan.name,
      observedAt: toDateOnly(input.observedAt),
      price: 0,
      currency: input.currency as PriceObservation["currency"],
      billingPeriod: "month",
      billingBasis: "flat-rate",
      perUser: false,
      minimumUsers: null,
      source: input.source,
      sourceIds: input.sourceIds,
      verificationMethod: input.verificationMethod,
      confidence: input.confidence,
      notes: input.notes,
      categorySlug: input.categorySlug,
      metricKind: "plan-list",
    };
    out.push(obs);
  }

  for (const rule of plan.rules) {
    if (
      rule.kind !== "flat" &&
      rule.kind !== "per-seat" &&
      rule.kind !== "usage" &&
      rule.kind !== "per-unit"
    ) {
      continue;
    }
    const derived = basisFromRule(rule);
    const obs: PriceObservation = {
      id: buildObservationId({
        productId,
        planId: plan.id,
        metricKind: "rule",
        billingPeriod: derived.billingPeriod,
        billingBasis: derived.billingBasis,
        observedAt: input.observedAt,
        price: derived.price,
      }),
      productId,
      planId: plan.id,
      planName: plan.name,
      observedAt: toDateOnly(input.observedAt),
      price: derived.price,
      currency: rule.currency,
      billingPeriod: derived.billingPeriod,
      billingBasis: derived.billingBasis,
      perUser: derived.perUser,
      minimumUsers: derived.minimumUsers,
      source: input.source,
      sourceIds: input.sourceIds,
      verificationMethod: input.verificationMethod,
      confidence: input.confidence,
      notes: input.notes,
      categorySlug: input.categorySlug,
      metricKind: "rule",
    };
    out.push(obs);
  }

  return out;
}

export function getLatestObservationInSeries(
  observations: PriceObservation[],
  seriesKey: string,
): PriceObservation | null {
  const series = observations
    .filter((o) => priceObservationSeriesKey(o) === seriesKey)
    .sort((a, b) => b.observedAt.localeCompare(a.observedAt));
  return series[0] ?? null;
}

/**
 * Compare candidate with latest observation in the same series.
 * Skips duplicates unless forcePeriodic.
 */
export function recordPriceObservations(
  candidates: PriceObservation[],
  options: RecordObservationOptions = {},
): {
  appended: PriceObservation[];
  skippedUnchanged: PriceObservation[];
  skippedExistingIds: string[];
} {
  const byProduct = new Map<string, PriceObservation[]>();
  for (const c of candidates) {
    const list = byProduct.get(c.productId) ?? [];
    list.push(c);
    byProduct.set(c.productId, list);
  }

  const appended: PriceObservation[] = [];
  const skippedUnchanged: PriceObservation[] = [];
  const skippedExistingIds: string[] = [];

  for (const [productId, list] of byProduct) {
    const existing = loadProductPriceHistory(productId).observations;
    const toAppend: PriceObservation[] = [];

    for (const candidate of list) {
      const seriesKey = priceObservationSeriesKey(candidate);
      const latest = getLatestObservationInSeries(existing, seriesKey);
      if (
        latest &&
        !options.forcePeriodic &&
        priceObservationFingerprint(latest) ===
          priceObservationFingerprint(candidate)
      ) {
        skippedUnchanged.push(candidate);
        continue;
      }
      // Also skip if identical id already stored
      if (existing.some((o) => o.id === candidate.id)) {
        skippedExistingIds.push(candidate.id);
        continue;
      }
      toAppend.push(candidate);
      existing.push(candidate);
    }

    if (toAppend.length > 0) {
      const result = appendPriceObservations(productId, toAppend);
      appended.push(...result.appended);
      skippedExistingIds.push(...result.skippedExistingIds);
    }
  }

  return { appended, skippedUnchanged, skippedExistingIds };
}

export function calculatePriceChange(
  previous: PriceObservation,
  current: PriceObservation,
): PriceChange {
  const previousPrice = previous.price;
  const newPrice = current.price;
  let absoluteChange: number | null = null;
  let percentageChange: number | null = null;

  if (previousPrice != null && newPrice != null) {
    absoluteChange = newPrice - previousPrice;
    if (previousPrice !== 0) {
      percentageChange = (absoluteChange / previousPrice) * 100;
    } else if (newPrice === 0) {
      percentageChange = 0;
    } else {
      percentageChange = null;
    }
  }

  return {
    productId: current.productId,
    planId: current.planId,
    planName: current.planName ?? null,
    previousPrice,
    newPrice,
    absoluteChange,
    percentageChange,
    changeDate: toDateOnly(current.observedAt),
    previousObservedAt: toDateOnly(previous.observedAt),
    currency: current.currency,
    billingPeriod: current.billingPeriod,
    billingBasis: current.billingBasis,
    previous,
    current,
  };
}

export function listPriceObservations(filters?: {
  productId?: string;
  planId?: string | null;
  categorySlug?: string;
  metricKind?: PriceObservation["metricKind"];
}): PriceObservation[] {
  let rows = filters?.productId
    ? loadProductPriceHistory(filters.productId).observations
    : listAllPriceObservations();

  if (filters?.planId !== undefined) {
    rows = rows.filter((o) => o.planId === filters.planId);
  }
  if (filters?.categorySlug) {
    rows = rows.filter((o) => o.categorySlug === filters.categorySlug);
  }
  if (filters?.metricKind) {
    rows = rows.filter((o) => o.metricKind === filters.metricKind);
  }

  return [...rows].sort((a, b) => b.observedAt.localeCompare(a.observedAt));
}

export function buildProductPriceHistorySummary(
  productId: string,
): ProductPriceHistorySummary {
  const observations = loadProductPriceHistory(productId).observations;
  const bySeries = new Map<string, PriceObservation[]>();

  for (const obs of observations) {
    const key = priceObservationSeriesKey(obs);
    const list = bySeries.get(key) ?? [];
    list.push(obs);
    bySeries.set(key, list);
  }

  const series: ProductPriceHistorySummary["series"] = [];
  let hasMeaningfulHistory = false;

  for (const [seriesKey, list] of bySeries) {
    const sorted = [...list].sort((a, b) =>
      a.observedAt.localeCompare(b.observedAt),
    );
    const current = sorted[sorted.length - 1]!;
    const previous = sorted.length >= 2 ? sorted[sorted.length - 2]! : null;
    if (sorted.length >= 2) hasMeaningfulHistory = true;

    series.push({
      seriesKey,
      planId: current.planId,
      planName: current.planName ?? null,
      metricKind: current.metricKind ?? "starting-price",
      billingPeriod: current.billingPeriod,
      billingBasis: current.billingBasis,
      current,
      previous,
      change: previous ? calculatePriceChange(previous, current) : null,
      observationCount: sorted.length,
    });
  }

  series.sort((a, b) => {
    if (a.metricKind === "starting-price" && b.metricKind !== "starting-price") {
      return -1;
    }
    if (b.metricKind === "starting-price" && a.metricKind !== "starting-price") {
      return 1;
    }
    return (a.planName ?? "").localeCompare(b.planName ?? "");
  });

  return { productId, hasMeaningfulHistory, series };
}

/**
 * Category-level change analysis for research (only real observation pairs).
 */
export function analyzeCategoryPriceChanges(categorySlug: string): {
  categorySlug: string;
  sampleProductsWithHistory: number;
  increases: PriceChange[];
  decreases: PriceChange[];
  unchangedReobservations: number;
} {
  const starting = listPriceObservations({
    categorySlug,
    metricKind: "starting-price",
  });
  const byProduct = new Map<string, PriceObservation[]>();
  for (const obs of starting) {
    const list = byProduct.get(obs.productId) ?? [];
    list.push(obs);
    byProduct.set(obs.productId, list);
  }

  const increases: PriceChange[] = [];
  const decreases: PriceChange[] = [];
  let unchangedReobservations = 0;
  let sampleProductsWithHistory = 0;

  for (const [, list] of byProduct) {
    const sorted = [...list].sort((a, b) =>
      a.observedAt.localeCompare(b.observedAt),
    );
    if (sorted.length < 2) continue;
    sampleProductsWithHistory += 1;
    const previous = sorted[sorted.length - 2]!;
    const current = sorted[sorted.length - 1]!;
    const change = calculatePriceChange(previous, current);
    if (
      change.absoluteChange == null ||
      change.absoluteChange === 0
    ) {
      unchangedReobservations += 1;
      continue;
    }
    if (change.absoluteChange > 0) increases.push(change);
    else decreases.push(change);
  }

  return {
    categorySlug,
    sampleProductsWithHistory,
    increases,
    decreases,
    unchangedReobservations,
  };
}

/**
 * Record observations after pricing verify/refresh.
 */
export function snapshotPricingHistory(input: {
  productId: string;
  pricing: Pricing;
  categorySlug?: string;
  observedAt?: string;
  verificationMethod?: PriceVerificationMethod;
  confidence?: PriceObservationConfidence;
  forcePeriodic?: boolean;
  notes?: string;
}): ReturnType<typeof recordPriceObservations> {
  const observedAt =
    input.observedAt ??
    input.pricing.verifiedAt ??
    new Date().toISOString().slice(0, 10);

  const candidates = extractObservationsFromPricing({
    productId: input.productId,
    pricing: input.pricing,
    categorySlug: input.categorySlug,
    observedAt,
    verificationMethod: input.verificationMethod ?? "research-merge",
    confidence: input.confidence ?? "medium",
    notes: input.notes,
  });

  return recordPriceObservations(candidates, {
    forcePeriodic: input.forcePeriodic,
  });
}

/**
 * CRM starting-price history for research UI.
 * Prefers PriceObservation store; falls back to legacy crm.json.
 */
export function listCrmStartingPriceHistory(): PricingHistorySnapshot[] {
  const fromObservations = listPriceObservations({
    categorySlug: "crm",
    metricKind: "starting-price",
  }).map((obs) => ({
    productSlug: obs.productId,
    observedAt: obs.observedAt.slice(0, 10),
    startingPriceMonthly: obs.price,
    currency: obs.currency,
    planName: obs.planName,
    billingNotes: obs.notes,
    sourceIds: obs.sourceIds.length > 0 ? obs.sourceIds : [obs.source],
  }));

  if (fromObservations.length > 0) {
    return fromObservations.sort((a, b) =>
      b.observedAt.localeCompare(a.observedAt),
    );
  }

  return getCrmPricingHistory().snapshots.slice().sort((a, b) =>
    b.observedAt.localeCompare(a.observedAt),
  );
}
