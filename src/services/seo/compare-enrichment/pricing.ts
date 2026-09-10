import type { Software } from "@/domain/schemas";
import { categoryDecisionCostHref } from "@/data/config/tools/category-tool-meta";
import type { PricingDiffSummary } from "./types";

function billingHint(product: Software): string | null {
  const plans = product.pricing?.plans ?? [];
  for (const plan of plans) {
    for (const rule of plan.rules ?? []) {
      if ("interval" in rule && rule.interval) {
        return String(rule.interval);
      }
    }
  }
  return product.pricing?.model && product.pricing.model !== "unknown"
    ? product.pricing.model
    : null;
}

function planComplexity(product: Software): string | null {
  const plans = product.pricing?.plans ?? [];
  if (plans.length === 0) return null;
  const contact = plans.some((p) => p.contactSales);
  if (contact) return "Includes contact-sales / custom quote plans";
  if (plans.length >= 4) return `${plans.length} published plans — higher pricing complexity`;
  if (plans.length === 1) return "Single published plan structure";
  return `${plans.length} published plans`;
}

/**
 * Pricing diffs from canonical Software.pricing only.
 * Never invent amounts; omit rather than guess.
 */
export function buildPricingDiffSummary(
  a: Software,
  b: Software,
): PricingDiffSummary {
  const category =
    a.primaryCategorySlug === b.primaryCategorySlug
      ? a.primaryCategorySlug
      : a.primaryCategorySlug;
  const costHref = categoryDecisionCostHref(category);
  const notes: string[] = [];

  const startA = a.pricing?.startingPriceMonthly ?? null;
  const startB = b.pricing?.startingPriceMonthly ?? null;
  if (startA == null && startB == null) {
    notes.push("Starting prices not verified for either product");
  } else if (startA == null || startB == null) {
    notes.push("Starting price verified for only one side — other marked unknown");
  }

  const freeA =
    a.pricing?.hasFreePlan ??
    (a.pricing?.plans?.some((p) => p.isFree) ? true : null);
  const freeB =
    b.pricing?.hasFreePlan ??
    (b.pricing?.plans?.some((p) => p.isFree) ? true : null);
  const trialA =
    a.pricing?.hasFreeTrial ??
    (a.pricing?.plans?.some((p) => p.hasFreeTrial) ? true : null);
  const trialB =
    b.pricing?.hasFreeTrial ??
    (b.pricing?.plans?.some((p) => p.hasFreeTrial) ? true : null);

  const complexityParts = [planComplexity(a), planComplexity(b)].filter(
    Boolean,
  ) as string[];

  if (costHref) {
    notes.push(`Model team cost scenarios in the ${category} cost calculator`);
  }

  return {
    startingPriceA: startA,
    startingPriceB: startB,
    billingA: billingHint(a),
    billingB: billingHint(b),
    freeTier: { a: freeA, b: freeB },
    trials: { a: trialA, b: trialB },
    modelA: a.pricing?.model && a.pricing.model !== "unknown" ? a.pricing.model : null,
    modelB: b.pricing?.model && b.pricing.model !== "unknown" ? b.pricing.model : null,
    complexityNote: complexityParts.length > 0 ? complexityParts.join("; ") : null,
    costCalculatorHref: costHref,
    notes,
  };
}

export function pricingDifferenceBullets(
  a: Software,
  b: Software,
  pricing: PricingDiffSummary,
): string[] {
  const lines: string[] = [];
  if (pricing.startingPriceA != null && pricing.startingPriceB != null) {
    lines.push(
      `${a.name} starts around $${pricing.startingPriceA}/mo listed; ${b.name} around $${pricing.startingPriceB}/mo (catalogue startingPriceMonthly).`,
    );
  } else if (pricing.startingPriceA != null) {
    lines.push(
      `${a.name} lists a starting price of $${pricing.startingPriceA}/mo; ${b.name} starting price is not verified here.`,
    );
  } else if (pricing.startingPriceB != null) {
    lines.push(
      `${b.name} lists a starting price of $${pricing.startingPriceB}/mo; ${a.name} starting price is not verified here.`,
    );
  }

  if (pricing.modelA && pricing.modelB && pricing.modelA !== pricing.modelB) {
    lines.push(
      `Pricing models differ: ${a.name} (${pricing.modelA}) vs ${b.name} (${pricing.modelB}).`,
    );
  }

  if (pricing.freeTier.a === true || pricing.freeTier.b === true) {
    const freeNames = [
      pricing.freeTier.a ? a.name : null,
      pricing.freeTier.b ? b.name : null,
    ].filter(Boolean);
    lines.push(`Free tier documented for: ${freeNames.join(", ")}.`);
  }

  if (pricing.trials.a === true || pricing.trials.b === true) {
    const trialNames = [
      pricing.trials.a ? a.name : null,
      pricing.trials.b ? b.name : null,
    ].filter(Boolean);
    lines.push(`Trial documented for: ${trialNames.join(", ")}.`);
  }

  if (pricing.complexityNote) {
    lines.push(pricing.complexityNote);
  }

  return lines;
}
