import type { CrmRequirements } from "@/domain";
import {
  DEFAULT_FRESHNESS_POLICIES,
  getFreshnessMaxAgeDays,
} from "@/domain/schemas/freshness";
import type { PricingEligibilityStatus } from "@/domain/schemas/pricing-estimate";
import { isCalculablePlan } from "./plan-cost";
import type { EligibilityResult, PricingSnapshot } from "./types";
import { CRM_PRICING_CONFIG } from "@/data/config/pricing/crm-pricing-v1";

export type PricingRequest = {
  requirements: CrmRequirements;
};

/**
 * Determine whether we can calculate pricing for a snapshot.
 * STALE_DATA is reported via `stale` and may combine with CALCULABLE.
 */
export function canCalculatePricing(
  snapshot: PricingSnapshot,
  request: PricingRequest,
  now: Date = new Date(),
): EligibilityResult {
  const reasons: string[] = [];

  // Best-page interactive estimates and category calculators share this gate.
  // Flat / contact-tier plans still calculate (seat count does not multiply flat).
  const allowedCategories = new Set([
    "crm",
    "sales-intelligence",
    "marketing",
    "email-marketing",
  ]);
  if (!allowedCategories.has(snapshot.primaryCategorySlug)) {
    reasons.push("unsupported-category");
    return { status: "INSUFFICIENT_DATA", reasons, stale: false };
  }

  const pricing = snapshot.pricing;
  if (!pricing || !pricing.plans || pricing.plans.length === 0) {
    reasons.push("no-pricing-plans");
    return { status: "INSUFFICIENT_DATA", reasons, stale: false };
  }

  const stale = isPricingStale(snapshot, now);
  if (stale) reasons.push("pricing-stale");

  const calculable = pricing.plans.filter(isCalculablePlan);
  const allCustom =
    pricing.plans.length > 0 &&
    pricing.plans.every((p) => p.contactSales || p.rules.length === 0);

  if (allCustom) {
    reasons.push("all-plans-contact-sales");
    return {
      status: stale ? "STALE_DATA" : "CUSTOM_QUOTE",
      reasons,
      stale,
    };
  }

  if (calculable.length === 0) {
    reasons.push("no-calculable-plans");
    return {
      status: stale ? "STALE_DATA" : "INSUFFICIENT_DATA",
      reasons,
      stale,
    };
  }

  const seats = request.requirements.crmUsers;
  if (!Number.isFinite(seats) || seats < 1) {
    reasons.push("invalid-seats");
    return { status: "INSUFFICIENT_DATA", reasons, stale };
  }

  // Partial when mix of calculable + custom, or incomplete feature matrix
  const hasCustom = pricing.plans.some(
    (p) => p.contactSales || p.rules.length === 0,
  );
  const matrixIncomplete = snapshot.featureSupport.some(
    (f) =>
      (f.availability === "supported" || f.availability === "limited") &&
      f.planSlugs.length === 0,
  );

  let status: PricingEligibilityStatus = "CALCULABLE";
  if (hasCustom || matrixIncomplete) {
    status = "PARTIALLY_CALCULABLE";
    if (matrixIncomplete) reasons.push("feature-plan-matrix-incomplete");
    if (hasCustom) reasons.push("includes-custom-quote-plans");
  }

  if (stale) {
    // STALE can combine with calculated — surface as STALE_DATA eligibility
    // while still allowing calculation.
    return { status: "STALE_DATA", reasons, stale: true };
  }

  return { status, reasons, stale: false };
}

export function isPricingStale(
  snapshot: PricingSnapshot,
  now: Date = new Date(),
): boolean {
  const checkedAt = snapshot.pricingCheckedAt ?? snapshot.pricing?.verifiedAt;
  if (!checkedAt) return true;

  const maxAgeDays =
    CRM_PRICING_CONFIG.stalenessMaxAgeDays ??
    getFreshnessMaxAgeDays("pricing", DEFAULT_FRESHNESS_POLICIES);

  const checked = new Date(checkedAt).getTime();
  if (Number.isNaN(checked)) return true;
  const ageMs = now.getTime() - checked;
  return ageMs > maxAgeDays * 24 * 60 * 60 * 1000;
}
