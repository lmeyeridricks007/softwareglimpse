import type { ResearchFact } from "@/domain";
import { coerceAiCapabilityKind, coerceFeatureAvailability } from "@/domain";
import { nowIso } from "./utils";

export type NormalizedPlan = {
  id: string;
  slug: string;
  name: string;
  isFree: boolean;
  hasFreeTrial?: boolean;
  rules: Array<
    | {
        kind: "per-seat";
        amountPerSeat: number;
        currency: string;
        /** Billing cadence. */
        interval: "month" | "year";
        /** What the amount represents (monthly-equivalent vs annual list). */
        amountPeriod: "month" | "year";
        minimumSeats?: number;
      }
    | {
        kind: "flat";
        amount: number;
        currency: string;
        interval: "month" | "year";
        amountPeriod: "month" | "year";
      }
    | {
        kind: "per-unit";
        unit: string;
        amountPerUnit: number;
        currency: string;
        interval: "month" | "year";
        amountPeriod: "month" | "year";
      }
  >;
  contactSales?: boolean;
};

/**
 * Separates extraction from normalization.
 * Vendor wording → typed pricing/feature structures.
 *
 * Fixture fields:
 * - `interval` = what the listed amount represents (month|year)
 * - `billingInterval` = how often billed (month|annual)
 * Mapped to: amountPeriod ← interval, interval ← billing cadence.
 */
export function normalizeFact(fact: ResearchFact): ResearchFact {
  if (fact.field.startsWith("pricing.plans.")) {
    return normalizePlanFact(fact);
  }
  if (fact.field.startsWith("features.")) {
    return normalizeFeatureFact(fact);
  }
  if (fact.field.startsWith("ai.")) {
    return normalizeAiFact(fact);
  }

  return {
    ...fact,
    status: fact.status === "extracted" ? "normalized" : fact.status,
    normalizedAt: nowIso(),
  };
}

function normalizePlanFact(fact: ResearchFact): ResearchFact {
  const raw = fact.value as Record<string, unknown>;
  const slug = String(raw.slug);
  const currency = String(raw.currency || "USD").toUpperCase();
  const billingInterval =
    raw.billingInterval === "annual" ? "annual" : "month";
  /** Billing cadence stored on the rule. */
  const interval = billingInterval === "annual" ? "year" : "month";
  /**
   * What the amount represents. Fixture `interval=month` with annual billing
   * means monthly-equivalent rate billed yearly — preserve amountPeriod=month.
   */
  const amountPeriod: "month" | "year" =
    raw.interval === "year" || raw.interval === "annual" ? "year" : "month";

  const plan: NormalizedPlan = {
    id: `plan-${slug}`,
    slug,
    name: String(raw.name),
    isFree: Boolean(raw.isFree),
    contactSales: Boolean(raw.contactSales),
    rules: [],
  };

  if (typeof raw.amountPerSeat === "number") {
    plan.rules.push({
      kind: "per-seat",
      amountPerSeat: raw.amountPerSeat,
      currency,
      interval,
      amountPeriod,
      minimumSeats:
        typeof raw.minimumSeats === "number" ? raw.minimumSeats : undefined,
    });
  } else if (typeof raw.amount === "number" && raw.unit) {
    plan.rules.push({
      kind: "per-unit",
      unit: String(raw.unit),
      amountPerUnit: raw.amount as number,
      currency,
      interval,
      amountPeriod,
    });
  } else if (typeof raw.amount === "number") {
    plan.rules.push({
      kind: "flat",
      amount: raw.amount as number,
      currency,
      interval,
      amountPeriod,
    });
  }

  return {
    ...fact,
    value: plan,
    status: "normalized",
    normalizedAt: nowIso(),
    notes:
      (fact.notes ? `${fact.notes}; ` : "") +
      `Normalized billingInterval=${billingInterval}; interval=${interval}; amountPeriod=${amountPeriod}`,
  };
}

function normalizeFeatureFact(fact: ResearchFact): ResearchFact {
  const raw = fact.value as { featureSlug: string; availability: string };
  return {
    ...fact,
    value: {
      featureSlug: raw.featureSlug,
      availability: coerceFeatureAvailability(raw.availability),
      planSlugs: [],
      sourceIds: fact.sourceIds,
    },
    status: "normalized",
    normalizedAt: nowIso(),
  };
}

function normalizeAiFact(fact: ResearchFact): ResearchFact {
  const raw = fact.value as { capability: string; availability: string };
  return {
    ...fact,
    value: {
      capability: coerceAiCapabilityKind(raw.capability),
      availability: coerceFeatureAvailability(raw.availability),
      sourceIds: fact.sourceIds,
    },
    status: "normalized",
    normalizedAt: nowIso(),
  };
}

export function buildPricingEnvelope(facts: ResearchFact[]) {
  const planFacts = facts.filter((f) => f.field.startsWith("pricing.plans."));
  const currencyFact = facts.find((f) => f.field === "pricing.currency");
  const modelFact = facts.find((f) => f.field === "pricing.model");
  const freeTrial = facts.find((f) => f.field === "pricing.hasFreeTrial");
  const freePlan = facts.find((f) => f.field === "pricing.hasFreePlan");

  const plans = planFacts.map((f) => f.value as NormalizedPlan);
  const starting = plans
    .flatMap((plan) =>
      plan.rules.map((rule) =>
        rule.kind === "per-seat"
          ? rule.amountPerSeat
          : rule.kind === "flat"
            ? rule.amount
            : rule.amountPerUnit,
      ),
    )
    .filter((n) => typeof n === "number" && n > 0);

  return {
    currency: (currencyFact?.value as string | undefined) || "USD",
    model: (modelFact?.value as string | undefined) || "subscription",
    hasFreePlan: Boolean(freePlan?.value),
    hasFreeTrial: Boolean(freeTrial?.value),
    startingPriceMonthly:
      starting.length > 0 ? Math.min(...starting) : undefined,
    plans,
    notes: facts.some((f) => f.isFixture)
      ? "Includes fixture-derived pricing for pipeline demonstration — verify against live vendor pages before publishing as truth."
      : undefined,
    sourceIds: [...new Set(facts.flatMap((f) => f.sourceIds))],
  };
}
