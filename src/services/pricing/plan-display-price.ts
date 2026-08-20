import type { CurrencyCode, PricingPlan, PricingRule } from "@/domain";
import { formatMoney, fromMajor } from "@/domain";

export type PlanDisplayPrice = {
  amount: number | null;
  priceLabel: string;
  unitLabel: string;
  contact: boolean;
  isFree: boolean;
};

function pickBillingRule<T extends PricingRule>(
  rules: T[],
  preferAnnual: boolean,
): T | undefined {
  const annual = rules.find((r) => r.interval === "year");
  const monthly = rules.find((r) => r.interval === "month");
  const oneTime = rules.find((r) => r.interval === "one-time");
  if (preferAnnual) {
    return annual ?? monthly ?? oneTime ?? rules[0];
  }
  return monthly ?? annual ?? oneTime ?? rules[0];
}

function unitLabelForRule(
  rule: PricingRule,
  preferAnnual: boolean,
  shape: "seat" | "flat" | "unit" | "usage",
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
    return rule.interval === "year"
      ? "per user / year"
      : "per user / month";
  }

  if (shape === "flat") {
    if (billedAnnually && preferAnnual) {
      return "per month, billed annually";
    }
    if (billedAnnually && !preferAnnual) {
      return "per month (annual billing rate shown)";
    }
    return rule.interval === "year" ? "per year" : "per month";
  }

  if (shape === "usage") {
    return rule.kind === "usage"
      ? `per ${rule.unit.replace(/-/g, " ")} / month`
      : "usage-based";
  }

  if (shape === "unit" && rule.kind === "per-unit") {
    return `per ${rule.unit.replace(/-/g, " ")}`;
  }

  return "Plan rules apply";
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

  if (plan.contactSales || plan.rules.length === 0) {
    return {
      amount: null,
      priceLabel: "Custom",
      unitLabel: "Contact sales",
      contact: true,
      isFree: false,
    };
  }

  const seatRules = plan.rules.filter((r) => r.kind === "per-seat");
  if (seatRules.length > 0) {
    const rule = pickBillingRule(seatRules, preferAnnual);
    if (rule?.kind === "per-seat") {
      return {
        amount: rule.amountPerSeat,
        priceLabel: formatMoney(fromMajor(rule.amountPerSeat, currency)),
        unitLabel: unitLabelForRule(rule, preferAnnual, "seat"),
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
        unitLabel: unitLabelForRule(rule, preferAnnual, "flat"),
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
      unitLabel: unitLabelForRule(usageRule, preferAnnual, "usage"),
      contact: false,
      isFree: false,
    };
  }

  const unitRule = plan.rules.find((r) => r.kind === "per-unit");
  if (unitRule?.kind === "per-unit") {
    return {
      amount: unitRule.amountPerUnit,
      priceLabel: formatMoney(fromMajor(unitRule.amountPerUnit, currency)),
      unitLabel: unitLabelForRule(unitRule, preferAnnual, "unit"),
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
