import type {
  DetectedPriceChange,
  PriceChangeConfidence,
  PriceChangeKind,
  Pricing,
  PricingPlan,
} from "@/domain";
import { PricingSchema } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { getSoftwareBySlug } from "@/data";
import { normalizePricingInput } from "@/services/pricing/build-snapshot";
import {
  calculatePriceChange,
  extractObservationsFromPricing,
  getLatestObservationInSeries,
  listPriceObservations,
  priceObservationFingerprint,
  priceObservationSeriesKey,
} from "@/services/pricing-history";
import { classifyPriceChangeConfidence } from "./confidence";

function hasFreePlan(pricing: Pricing): boolean {
  return (
    pricing.hasFreePlan === true || pricing.plans.some((p) => p.isFree === true)
  );
}

function contactSalesOnly(plan: PricingPlan): boolean {
  return plan.contactSales === true && plan.rules.length === 0;
}

function isAiNamedPlan(plan: PricingPlan): boolean {
  const name = `${plan.name} ${plan.slug}`.toLowerCase();
  return /\bai\b|agentforce|copilot|gpt|llm/.test(name);
}

function yearMonthlyEquivalent(amount: number, billingPeriod: string): number {
  if (billingPeriod === "year" && amount > 50) return amount / 12;
  return amount;
}

function pushChange(
  out: DetectedPriceChange[],
  partial: {
    productId: string;
    productName: string;
    kind: PriceChangeKind;
    summary: string;
    previousPrice?: number | null;
    newPrice?: number | null;
    absoluteChange?: number | null;
    percentageChange?: number | null;
    planId?: string | null;
    planName?: string | null;
    seriesKey?: string;
    confidenceHints?: Parameters<typeof classifyPriceChangeConfidence>[0];
  },
): void {
  const classified = classifyPriceChangeConfidence({
    kind: partial.kind,
    percentageChange: partial.percentageChange ?? null,
    absoluteChange: partial.absoluteChange ?? null,
    ...partial.confidenceHints,
  });
  out.push({
    productId: partial.productId,
    productName: partial.productName,
    kind: partial.kind,
    confidence: classified.confidence,
    summary: partial.summary,
    previousPrice: partial.previousPrice ?? null,
    newPrice: partial.newPrice ?? null,
    absoluteChange: partial.absoluteChange ?? null,
    percentageChange: partial.percentageChange ?? null,
    planId: partial.planId ?? null,
    planName: partial.planName ?? null,
    seriesKey: partial.seriesKey,
    requiresHumanVerification: classified.requiresHumanVerification,
    validationNotes: classified.validationNotes,
    noteworthy: classified.noteworthy,
  });
}

/**
 * Compare current enrichment Pricing against latest PriceObservation series.
 * Does not invent prices — only diffs stored catalogue vs observation store.
 */
export function detectPriceChangesForProduct(
  productId: string,
): DetectedPriceChange[] {
  const software = getSoftwareBySlug(productId);
  if (!software) return [];

  const enrichment = loadEnrichment(productId);
  const raw = enrichment?.pricing ?? software.pricing;
  if (!raw) return [];

  const parsed = PricingSchema.safeParse(normalizePricingInput(raw));
  if (!parsed.success) return [];

  const pricing = parsed.data;
  const productName = software.name;
  const existing = listPriceObservations({ productId });
  const changes: DetectedPriceChange[] = [];

  const candidates = extractObservationsFromPricing({
    productId,
    pricing,
    categorySlug: software.primaryCategorySlug,
    observedAt: pricing.verifiedAt ?? new Date().toISOString().slice(0, 10),
    verificationMethod: "research-merge",
    confidence: "medium",
  });

  const deterministic =
    Boolean(pricing.verifiedAt) &&
    (pricing.sourceIds?.length ?? 0) > 0 &&
    !pricing.notes?.toLowerCase().includes("verify-live");

  for (const candidate of candidates) {
    const seriesKey = priceObservationSeriesKey(candidate);
    const latest = getLatestObservationInSeries(existing, seriesKey);
    if (!latest) continue;
    if (
      priceObservationFingerprint(latest) ===
      priceObservationFingerprint(candidate)
    ) {
      continue;
    }

    const calc = calculatePriceChange(latest, candidate);
    let kind: PriceChangeKind = "other";
    if (
      (candidate.billingBasis === "contact-sales") !==
      (latest.billingBasis === "contact-sales")
    ) {
      kind = "contact_sales_conversion";
    } else if (candidate.metricKind === "starting-price") {
      kind = "starting_price_changed";
    } else if (calc.absoluteChange != null && calc.absoluteChange > 0) {
      kind = "plan_price_increase";
    } else if (calc.absoluteChange != null && calc.absoluteChange < 0) {
      kind = "plan_price_decrease";
    } else if (latest.billingPeriod !== candidate.billingPeriod) {
      kind = "billing_model_changed";
    }

    pushChange(changes, {
      productId,
      productName,
      kind,
      summary: `${productName}: ${kind.replace(/_/g, " ")} (${latest.price ?? "—"} → ${candidate.price ?? "—"} ${candidate.currency})`,
      previousPrice: calc.previousPrice,
      newPrice: calc.newPrice,
      absoluteChange: calc.absoluteChange,
      percentageChange: calc.percentageChange,
      planId: candidate.planId,
      planName: candidate.planName,
      seriesKey,
      confidenceHints: {
        kind,
        deterministicSource: deterministic,
        currencyChanged: latest.currency !== candidate.currency,
        verifyLiveFlag:
          pricing.notes?.toLowerCase().includes("verify-live") ?? false,
        observationCountInSeries: existing.filter(
          (o) => priceObservationSeriesKey(o) === seriesKey,
        ).length,
      },
    });
  }

  const observedPlanIds = new Set(
    existing.filter((o) => o.planId).map((o) => o.planId as string),
  );
  const currentPlanIds = new Set(pricing.plans.map((p) => p.id));

  if (observedPlanIds.size > 0) {
    for (const plan of pricing.plans) {
      if (!observedPlanIds.has(plan.id)) {
        pushChange(changes, {
          productId,
          productName,
          kind: "new_plan",
          summary: `${productName}: new plan detected in catalogue (${plan.name})`,
          planId: plan.id,
          planName: plan.name,
          confidenceHints: {
            kind: "new_plan",
            deterministicSource: deterministic,
            structuralChange: true,
          },
        });
      }
    }
    for (const planId of observedPlanIds) {
      if (!currentPlanIds.has(planId)) {
        const sample = existing.find((o) => o.planId === planId);
        pushChange(changes, {
          productId,
          productName,
          kind: "removed_plan",
          summary: `${productName}: plan missing from current catalogue (${sample?.planName ?? planId})`,
          planId,
          planName: sample?.planName,
          confidenceHints: {
            kind: "removed_plan",
            deterministicSource: deterministic,
            structuralChange: true,
          },
        });
      }
    }
  }

  const hadFreeObservation = existing.some(
    (o) =>
      (o.metricKind === "plan-list" || o.metricKind === "starting-price") &&
      o.price === 0,
  );
  const hasFree = hasFreePlan(pricing);
  if (hasFree && !hadFreeObservation && existing.length > 0) {
    pushChange(changes, {
      productId,
      productName,
      kind: "free_plan_added",
      summary: `${productName}: free plan present in current pricing but not in prior observations`,
      confidenceHints: {
        kind: "free_plan_added",
        deterministicSource: deterministic,
        structuralChange: true,
      },
    });
  }
  if (!hasFree && hadFreeObservation) {
    pushChange(changes, {
      productId,
      productName,
      kind: "free_plan_removed",
      summary: `${productName}: free plan absent in current pricing but prior observations include $0`,
      confidenceHints: {
        kind: "free_plan_removed",
        deterministicSource: deterministic,
        structuralChange: true,
        noteworthyOverride: true,
      },
    });
  }

  for (const plan of pricing.plans) {
    if (!contactSalesOnly(plan)) continue;
    const priorNumeric = existing.find(
      (o) =>
        o.planId === plan.id &&
        o.price != null &&
        o.billingBasis !== "contact-sales",
    );
    if (priorNumeric) {
      pushChange(changes, {
        productId,
        productName,
        kind: "contact_sales_conversion",
        summary: `${productName}: ${plan.name} appears contact-sales; prior observation had list price ${priorNumeric.price}`,
        previousPrice: priorNumeric.price,
        newPrice: null,
        planId: plan.id,
        planName: plan.name,
        confidenceHints: {
          kind: "contact_sales_conversion",
          deterministicSource: false,
          structuralChange: true,
          noteworthyOverride: true,
        },
      });
    }
  }

  for (const plan of pricing.plans) {
    const monthCand = candidates.find(
      (c) =>
        c.planId === plan.id &&
        c.metricKind === "rule" &&
        c.billingPeriod === "month" &&
        c.billingBasis === "per-user",
    );
    const yearCand = candidates.find(
      (c) =>
        c.planId === plan.id &&
        c.metricKind === "rule" &&
        c.billingPeriod === "year" &&
        c.billingBasis === "per-user",
    );
    if (
      !monthCand ||
      !yearCand ||
      monthCand.price == null ||
      yearCand.price == null
    ) {
      continue;
    }
    const monthLatest = getLatestObservationInSeries(
      existing,
      priceObservationSeriesKey(monthCand),
    );
    const yearLatest = getLatestObservationInSeries(
      existing,
      priceObservationSeriesKey(yearCand),
    );
    if (!monthLatest?.price || !yearLatest?.price || monthLatest.price === 0) {
      continue;
    }
    const prevPct =
      ((monthLatest.price -
        yearMonthlyEquivalent(yearLatest.price, yearLatest.billingPeriod)) /
        monthLatest.price) *
      100;
    const nextPct =
      ((monthCand.price -
        yearMonthlyEquivalent(yearCand.price, yearCand.billingPeriod)) /
        monthCand.price) *
      100;
    if (!Number.isFinite(prevPct) || !Number.isFinite(nextPct)) continue;
    if (Math.abs(prevPct - nextPct) < 1) continue;

    pushChange(changes, {
      productId,
      productName,
      kind: "annual_discount_changed",
      summary: `${productName}: annual discount on ${plan.name} ~${prevPct.toFixed(0)}% → ~${nextPct.toFixed(0)}%`,
      planId: plan.id,
      planName: plan.name,
      percentageChange: nextPct - prevPct,
      confidenceHints: {
        kind: "annual_discount_changed",
        deterministicSource: deterministic,
      },
    });
  }

  const aiPlans = pricing.plans.filter(isAiNamedPlan);
  const priorAiObs = existing.filter(
    (o) => o.planName && /\bai\b|agentforce|copilot|gpt|llm/i.test(o.planName),
  );
  if (aiPlans.length > 0 && priorAiObs.length === 0 && existing.length > 0) {
    const hasPricedAi = aiPlans.some(
      (p) => p.rules.length > 0 || p.contactSales,
    );
    if (hasPricedAi) {
      pushChange(changes, {
        productId,
        productName,
        kind: "ai_addon_introduced",
        summary: `${productName}: AI-labelled plan present in current catalogue`,
        confidenceHints: {
          kind: "ai_addon_introduced",
          deterministicSource: deterministic,
          structuralChange: true,
          noteworthyOverride: true,
        },
      });
    }
  } else if (aiPlans.length > 0 && priorAiObs.length > 0) {
    for (const cand of candidates) {
      if (!cand.planName || !/\bai\b|agentforce|copilot/i.test(cand.planName)) {
        continue;
      }
      const latest = getLatestObservationInSeries(
        existing,
        priceObservationSeriesKey(cand),
      );
      if (
        latest &&
        priceObservationFingerprint(latest) !==
          priceObservationFingerprint(cand)
      ) {
        pushChange(changes, {
          productId,
          productName,
          kind: "ai_pricing_changed",
          summary: `${productName}: AI plan pricing changed (${cand.planName})`,
          previousPrice: latest.price,
          newPrice: cand.price,
          planId: cand.planId,
          planName: cand.planName,
          confidenceHints: {
            kind: "ai_pricing_changed",
            deterministicSource: deterministic,
            noteworthyOverride: true,
          },
        });
      }
    }
  }

  if (changes.length === 0) {
    return [
      {
        productId,
        productName,
        kind: "other",
        confidence: "NO_CHANGE" satisfies PriceChangeConfidence,
        summary: `${productName}: no material pricing difference vs latest observations`,
        requiresHumanVerification: false,
        validationNotes: [
          "Fingerprints match or insufficient history for diff",
        ],
        noteworthy: false,
      },
    ];
  }

  return changes;
}

export function detectPriceChangesForProducts(
  productIds: string[],
): DetectedPriceChange[] {
  return productIds.flatMap((id) =>
    detectPriceChangesForProduct(id).filter(
      (r) => r.confidence !== "NO_CHANGE",
    ),
  );
}
