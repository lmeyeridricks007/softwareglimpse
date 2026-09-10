import type { CurrencyCode, PricingPlan, PricingRule } from "@/domain";
import { formatMoney, fromMajor } from "@/domain";

export type PlanDisplayPrice = {
  amount: number | null;
  priceLabel: string;
  unitLabel: string;
  contact: boolean;
  isFree: boolean;
  /** Prefer for plan-card buttons when set (e.g. "Get Go"). */
  ctaLabel?: string;
};

type IntervalPricingRule = Extract<
  PricingRule,
  { kind: "flat" | "per-seat" }
>;

function hasBillingInterval(rule: PricingRule): rule is IntervalPricingRule {
  return rule.kind === "flat" || rule.kind === "per-seat";
}

function pickBillingRule(
  rules: PricingRule[],
  preferAnnual: boolean,
): IntervalPricingRule | undefined {
  const billable = rules.filter(hasBillingInterval);
  const annual = billable.find((r) => r.interval === "year");
  const monthly = billable.find((r) => r.interval === "month");
  const oneTime = billable.find((r) => r.interval === "one-time");
  if (preferAnnual) {
    return annual ?? monthly ?? oneTime ?? billable[0];
  }
  return monthly ?? annual ?? oneTime ?? billable[0];
}

function unitLabelForIntervalRule(
  rule: IntervalPricingRule,
  preferAnnual: boolean,
  shape: "seat" | "flat",
): string {
  if (rule.interval === "one-time") return "one-time";

  const billedAnnually =
    rule.interval === "year" && (rule.amountPeriod ?? "month") === "month";

  if (shape === "seat") {
    if (billedAnnually && preferAnnual) {
      return "per user / mo, billed annually";
    }
    if (billedAnnually && !preferAnnual) {
      return "per user / month (annual billing rate shown)";
    }
    if (rule.interval === "month") {
      return "per user / mo, billed monthly";
    }
    return "per user / year";
  }

  if (billedAnnually && preferAnnual) {
    return "per month, billed annually";
  }
  if (billedAnnually && !preferAnnual) {
    return "per month (annual billing rate shown)";
  }
  if (rule.interval === "month") {
    return "per month, billed monthly";
  }
  return "per year";
}

function unitLabelForUsageRule(
  rule: Extract<PricingRule, { kind: "usage" }>,
): string {
  return `per ${rule.unit.replace(/-/g, " ")} / month`;
}

function unitLabelForUnitRule(
  rule: Extract<PricingRule, { kind: "per-unit" }>,
): string {
  return `per ${rule.unit.replace(/-/g, " ")}`;
}

/**
 * Resolve list price for plan cards — supports per-seat, flat, usage, and per-unit rules.
 */
export function resolvePlanDisplayPrice(
  plan: PricingPlan,
  currency: CurrencyCode,
  preferAnnual: boolean,
): PlanDisplayPrice {
  if (plan.isFree) {
    return {
      amount: 0,
      priceLabel: formatMoney(fromMajor(0, currency)),
      unitLabel: "Free plan",
      contact: false,
      isFree: true,
    };
  }

  if (plan.contactSales) {
    return {
      amount: null,
      priceLabel: "Custom",
      unitLabel: "Contact sales",
      contact: true,
      isFree: false,
      ctaLabel: "Contact sales",
    };
  }

  // Self-serve plan with no captured list $ (e.g. ChatGPT Go) — never invent
  // dollars and never label as contact-sales.
  if (plan.rules.length === 0) {
    const getLabel = plan.name?.trim() ? `Get ${plan.name.trim()}` : "See plans";
    return {
      amount: null,
      priceLabel: "See plans",
      unitLabel: "Verify live list price on vendor site",
      contact: false,
      isFree: false,
      ctaLabel: getLabel,
    };
  }

  const seatRules = plan.rules.filter((r) => r.kind === "per-seat");
  if (seatRules.length > 0) {
    const rule = pickBillingRule(seatRules, preferAnnual);
    if (rule?.kind === "per-seat") {
      return {
        amount: rule.amountPerSeat,
        priceLabel: formatMoney(fromMajor(rule.amountPerSeat, currency)),
        unitLabel: unitLabelForIntervalRule(rule, preferAnnual, "seat"),
        contact: false,
        isFree: false,
      };
    }
  }

  const flatRules = plan.rules.filter((r) => r.kind === "flat");
  if (flatRules.length > 0) {
    const rule = pickBillingRule(flatRules, preferAnnual);
    if (rule?.kind === "flat") {
      return {
        amount: rule.amount,
        priceLabel: formatMoney(fromMajor(rule.amount, currency)),
        unitLabel: unitLabelForIntervalRule(rule, preferAnnual, "flat"),
        contact: false,
        isFree: false,
      };
    }
  }

  const usageRule = plan.rules.find((r) => r.kind === "usage");
  if (usageRule?.kind === "usage") {
    return {
      amount: usageRule.amountPerUnit,
      priceLabel: formatMoney(fromMajor(usageRule.amountPerUnit, currency)),
      unitLabel: unitLabelForUsageRule(usageRule),
      contact: false,
      isFree: false,
    };
  }

  const unitRule = plan.rules.find((r) => r.kind === "per-unit");
  if (unitRule?.kind === "per-unit") {
    return {
      amount: unitRule.amountPerUnit,
      priceLabel: formatMoney(fromMajor(unitRule.amountPerUnit, currency)),
      unitLabel: unitLabelForUnitRule(unitRule),
      contact: false,
      isFree: false,
    };
  }

  return {
    amount: null,
    priceLabel: "See details",
    unitLabel: "Plan rules apply",
    contact: false,
    isFree: false,
  };
}
