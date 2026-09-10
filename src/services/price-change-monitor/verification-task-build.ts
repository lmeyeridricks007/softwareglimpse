import { createHash } from "node:crypto";
import type {
  DetectedPriceChange,
  Pricing,
  PricingVerificationPlanRow,
  PricingVerificationTask,
} from "@/domain";
import { PricingSchema } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { normalizePricingInput } from "@/services/pricing/build-snapshot";
import { listPriceObservations } from "@/services/pricing-history";
import { resolvePlanDisplayPrice as resolveDisplay } from "@/services/pricing/plan-display-price";
import { resolvePriceChangeImpactPages } from "./impact";
import { orderPriceRefreshPages } from "./refresh-order";

function taskId(change: DetectedPriceChange): string {
  return createHash("sha1")
    .update(
      [
        change.productId,
        change.kind,
        change.planId ?? "",
        change.summary,
      ].join("|"),
    )
    .digest("hex")
    .slice(0, 16);
}

function planRowsFromPricing(pricing: Pricing): PricingVerificationPlanRow[] {
  return pricing.plans.map((plan) => {
    const display = resolveDisplay(
      plan,
      (pricing.currency ?? "USD") as "USD",
      false,
    );
    return {
      planId: plan.id,
      planName: plan.name,
      price: display.amount,
      currency: pricing.currency ?? null,
      billingPeriod: "month",
      contactSales: plan.contactSales === true,
      isFree: plan.isFree === true || display.isFree,
    };
  });
}

function planRowsFromObservations(
  productId: string,
): PricingVerificationPlanRow[] {
  const obs = listPriceObservations({ productId });
  const byPlan = new Map<string, (typeof obs)[number]>();
  for (const o of obs) {
    if (!o.planId) continue;
    const prev = byPlan.get(o.planId);
    if (!prev || o.observedAt > prev.observedAt) {
      byPlan.set(o.planId, o);
    }
  }
  return [...byPlan.values()].map((o) => ({
    planId: o.planId!,
    planName: o.planName ?? o.planId!,
    price: o.price,
    currency: o.currency,
    billingPeriod: o.billingPeriod,
    contactSales: o.billingBasis === "contact-sales",
    isFree: o.price === 0,
  }));
}

function loadCataloguePricing(productId: string): {
  pricing: Pricing | null;
  sourceIds: string[];
  verifiedAt: string | null;
  enrichmentPath: string | null;
} {
  const software = getSoftwareBySlug(productId);
  const enrichment = loadEnrichment(productId);
  const raw = enrichment?.pricing ?? software?.pricing;
  if (!raw) {
    return {
      pricing: null,
      sourceIds: [],
      verifiedAt: null,
      enrichmentPath: null,
    };
  }
  const parsed = PricingSchema.safeParse(normalizePricingInput(raw));
  if (!parsed.success) {
    return {
      pricing: null,
      sourceIds: [],
      verifiedAt: null,
      enrichmentPath: null,
    };
  }
  return {
    pricing: parsed.data,
    sourceIds: parsed.data.sourceIds ?? enrichment?.sourceIds ?? [],
    verifiedAt: parsed.data.verifiedAt ?? null,
    enrichmentPath: enrichment
      ? `src/data/research/${productId}/enrichment.json`
      : null,
  };
}

/**
 * Build a human verification task for an unverified pricing change.
 * Publish remains blocked until confirmPricingVerificationTask.
 */
export function buildPricingVerificationTask(
  change: DetectedPriceChange,
): PricingVerificationTask | null {
  if (
    change.confidence !== "REQUIRES_REVIEW" &&
    change.confidence !== "LIKELY"
  ) {
    return null;
  }

  const catalogue = loadCataloguePricing(change.productId);
  const storedPlans = planRowsFromObservations(change.productId);
  const detectedPlans = catalogue.pricing
    ? planRowsFromPricing(catalogue.pricing)
    : [];

  const ordered = orderPriceRefreshPages(
    resolvePriceChangeImpactPages(change.productId),
  );

  return {
    id: taskId(change),
    status: "pending",
    productId: change.productId,
    productName: change.productName,
    confidence: change.confidence,
    kind: change.kind,
    source: {
      label: catalogue.enrichmentPath
        ? "catalogue enrichment pricing"
        : "software catalogue pricing",
      enrichmentPath: catalogue.enrichmentPath,
      sourceIds: catalogue.sourceIds,
      verifiedAt: catalogue.verifiedAt,
    },
    currentStoredPricing: {
      startingPriceMonthly: null,
      plans: storedPlans,
      observationCount: listPriceObservations({
        productId: change.productId,
      }).length,
    },
    detectedPricing: {
      startingPriceMonthly: catalogue.pricing?.startingPriceMonthly ?? null,
      plans: detectedPlans,
    },
    difference: {
      summary: change.summary,
      previousPrice: change.previousPrice ?? null,
      newPrice: change.newPrice ?? null,
      absoluteChange: change.absoluteChange ?? null,
      percentageChange: change.percentageChange ?? null,
      notes: change.validationNotes ?? [],
    },
    affectedPlans: [
      {
        planId: change.planId ?? null,
        planName: change.planName ?? null,
        changeKind: change.kind,
      },
    ],
    affectedPages: ordered.map((p) => ({
      path: p.path,
      pageType: p.pageType,
      slug: p.slug,
      productId: p.productId,
      refreshTier: p.refreshTier,
    })),
    publishBlocked: true,
    createdAt: new Date().toISOString(),
    confirmedAt: null,
    rejectedAt: null,
  };
}

export function buildPricingVerificationTasks(
  changes: DetectedPriceChange[],
): PricingVerificationTask[] {
  const out: PricingVerificationTask[] = [];
  const seen = new Set<string>();
  for (const change of changes) {
    const task = buildPricingVerificationTask(change);
    if (!task || seen.has(task.id)) continue;
    seen.add(task.id);
    out.push(task);
  }
  return out;
}
