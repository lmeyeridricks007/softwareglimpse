import type { CrmRequirements, ProductCostEstimate } from "@/domain";
import type { CurrencyCode } from "@/domain/schemas/primitives";
import { canCalculatePricing } from "./eligibility";
import { confidenceFromSnapshot } from "./confidence";
import { calculatePlanCost } from "./plan-cost";
import { findMinimumSuitablePlan } from "./plan-resolver";
import type { CalculateOptions, PricingSnapshot } from "./types";

/**
 * Calculate product cost for CRM requirements.
 * Pure — no I/O. Pass `now` for deterministic freshness/confidence.
 */
export function calculateProductCost(
  snapshot: PricingSnapshot,
  requirements: CrmRequirements,
  opts: CalculateOptions = {},
): ProductCostEstimate {
  const now = opts.now ?? new Date();
  const eligibility = canCalculatePricing(
    snapshot,
    { requirements },
    now,
  );

  const sourceIds = [
    ...new Set([
      ...snapshot.sourceIds,
      ...(snapshot.pricing?.sourceIds ?? []),
    ]),
  ];
  const currency = (snapshot.pricing?.currency ?? "USD") as CurrencyCode;
  const base = {
    productSlug: snapshot.productSlug,
    productName: snapshot.name,
    currency,
    sourceIds,
    pricingVerifiedAt:
      snapshot.pricingCheckedAt ?? snapshot.pricing?.verifiedAt,
    eligibilityStatus: eligibility.status,
  };

  if (
    eligibility.status === "INSUFFICIENT_DATA" &&
    (eligibility.reasons.includes("unsupported-category") ||
      eligibility.reasons.includes("not-primary-crm"))
  ) {
    return {
      ...base,
      status: "insufficient-data",
      components: [],
      assumptions: [],
      warnings: eligibility.reasons,
      confidence: "low",
      explanation:
        "Product category is outside this calculator’s verified pricing pool",
    };
  }

  if (
    eligibility.status === "INSUFFICIENT_DATA" &&
    (eligibility.reasons.includes("no-pricing-plans") ||
      eligibility.reasons.includes("no-calculable-plans"))
  ) {
    return {
      ...base,
      status: "insufficient-data",
      components: [],
      assumptions: [],
      warnings: eligibility.reasons,
      confidence: "low",
      explanation: "No calculable pricing data for this product",
    };
  }

  if (
    eligibility.status === "CUSTOM_QUOTE" ||
    (eligibility.status === "STALE_DATA" &&
      eligibility.reasons.includes("all-plans-contact-sales"))
  ) {
    return {
      ...base,
      status: "custom-quote",
      components: [],
      assumptions: [],
      warnings: eligibility.reasons,
      confidence: confidenceFromSnapshot(snapshot, { now }),
      explanation: "Contact sales — not treated as $0",
    };
  }

  const resolution = findMinimumSuitablePlan(snapshot, requirements);

  if (resolution.kind === "no-suitable-plan") {
    return {
      ...base,
      status: "no-suitable-plan",
      components: [],
      assumptions: [],
      warnings: [...eligibility.reasons, ...resolution.warnings],
      confidence: confidenceFromSnapshot(snapshot, { now }),
      explanation: resolution.explanation,
    };
  }

  if (resolution.kind === "unknown-coverage") {
    return {
      ...base,
      status: "partial",
      components: [],
      assumptions: [],
      warnings: [...eligibility.reasons, ...resolution.warnings],
      confidence: confidenceFromSnapshot(snapshot, {
        now,
        unknownFeatures: true,
      }),
      explanation: resolution.explanation,
    };
  }

  if (resolution.kind === "custom-quote" || !resolution.plan) {
    return {
      ...base,
      status: "custom-quote",
      recommendedPlan: resolution.plan
        ? {
            id: resolution.plan.id,
            slug: resolution.plan.slug,
            name: resolution.plan.name,
          }
        : undefined,
      components: [],
      assumptions: [],
      warnings: [...eligibility.reasons, ...resolution.warnings],
      confidence: confidenceFromSnapshot(snapshot, { now }),
      explanation: resolution.explanation ?? "Custom quote required",
    };
  }

  const planCost = calculatePlanCost({
    plan: resolution.plan,
    seats: requirements.crmUsers,
    billingPreference: requirements.billingPreference,
    currencyFallback: currency,
  });

  const matrixIncomplete = resolution.warnings.includes(
    "feature-plan-matrix-incomplete",
  );

  const warnings = [
    ...new Set([
      ...eligibility.reasons,
      ...resolution.warnings,
      ...planCost.warnings,
    ]),
  ];

  // Free trial on envelope must not imply free ongoing cost
  const assumptions = [...planCost.assumptions];
  if (snapshot.pricing?.hasFreeTrial && !resolution.plan.isFree) {
    assumptions.push(
      "Product offers a free trial — trial does not change ongoing calculated cost",
    );
  }

  const confidence = confidenceFromSnapshot(snapshot, {
    now,
    matrixIncomplete,
    hasAssumptions: assumptions.length > 0,
  });

  const isPartial =
    matrixIncomplete ||
    eligibility.status === "PARTIALLY_CALCULABLE" ||
    eligibility.stale;

  return {
    ...base,
    status: isPartial ? "partial" : "calculated",
    recommendedPlan: {
      id: resolution.plan.id,
      slug: resolution.plan.slug,
      name: resolution.plan.name,
    },
    monthlyEquivalent: planCost.monthlyEquivalent,
    monthlyCashCost: planCost.monthlyCashCost,
    annualCost: planCost.annualCost,
    components: planCost.components,
    assumptions,
    warnings,
    confidence,
    explanation:
      requirements.billingPreference === "annual"
        ? "Costs reflect annual billing cadence where plans bill yearly"
        : undefined,
  };
}
