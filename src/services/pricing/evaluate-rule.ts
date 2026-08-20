import type {
  BillingPreference,
  PricingRule,
} from "@/domain";
import type { CurrencyCode } from "@/domain/schemas/primitives";
import {
  add,
  fromMajor,
  multiply,
  zeroMoney,
  type Money,
} from "@/domain/money";
import type { CostComponent } from "@/domain/schemas/pricing-estimate";
import type { EvaluatedRuleCost } from "./types";

export type EvaluateRuleInput = {
  rule: PricingRule;
  seats: number;
  units?: number;
  billingPreference: BillingPreference;
  /** Required addon ids when evaluating addon rules. */
  requiredAddonIds?: string[];
};

/**
 * Evaluate a single pricing rule.
 *
 * Semantics:
 * - amountPeriod month + interval year: amount is monthly rate;
 *   annual cash = amount * qty * 12; monthlyEquivalent = amount * qty
 * - amountPeriod month + interval month: monthly cash = amount * qty
 * - amountPeriod year + interval year: annual = amount * qty; monthly eq = annual/12
 */
export function evaluateRule(input: EvaluateRuleInput): EvaluatedRuleCost | null {
  const { rule, seats, billingPreference } = input;

  if (rule.kind === "addon") {
    const required = input.requiredAddonIds ?? [];
    if (!required.includes(rule.addonId)) return null;
  }

  switch (rule.kind) {
    case "flat":
      return evaluateAmountRule({
        id: `flat-${rule.interval}`,
        label: "Plan base",
        kind: "base",
        amountMajor: rule.amount,
        currency: rule.currency as CurrencyCode,
        interval: rule.interval,
        amountPeriod: rule.amountPeriod ?? "month",
        quantity: 1,
        billingPreference,
      });
    case "per-seat": {
      const qty = Math.max(seats, rule.minimumSeats ?? 1);
      const assumptions: string[] = [];
      if (rule.minimumSeats && seats < rule.minimumSeats) {
        assumptions.push(
          `Minimum ${rule.minimumSeats} seats applied (requested ${seats})`,
        );
      }
      const result = evaluateAmountRule({
        id: "per-seat",
        label: `Per seat × ${qty}`,
        kind: "seat",
        amountMajor: rule.amountPerSeat,
        currency: rule.currency as CurrencyCode,
        interval: rule.interval,
        amountPeriod: rule.amountPeriod ?? "month",
        quantity: qty,
        billingPreference,
      });
      return result
        ? { ...result, assumptions: [...assumptions, ...result.assumptions] }
        : null;
    }
    case "per-unit": {
      const units = input.units ?? seats;
      const billable = Math.max(0, units - (rule.includedUnits ?? 0));
      return evaluateAmountRule({
        id: `per-unit-${rule.unit}`,
        label: `Per ${rule.unit} × ${billable}`,
        kind: "unit",
        amountMajor: rule.amountPerUnit,
        currency: rule.currency as CurrencyCode,
        interval: rule.interval,
        amountPeriod: rule.amountPeriod ?? "month",
        quantity: billable,
        billingPreference,
      });
    }
    case "tiered": {
      const units = input.units ?? seats;
      const amountMajor = tieredAmount(rule.tiers, units);
      return evaluateAmountRule({
        id: `tiered-${rule.unit}`,
        label: `Tiered ${rule.unit} × ${units}`,
        kind: "tiered",
        amountMajor,
        currency: rule.currency as CurrencyCode,
        interval: rule.interval,
        amountPeriod: rule.amountPeriod ?? "month",
        quantity: 1,
        billingPreference,
        alreadyTotal: true,
      });
    }
    case "usage": {
      const units = input.units ?? 0;
      const billable = Math.max(0, units - (rule.includedUnits ?? 0));
      const currency = rule.currency as CurrencyCode;
      const monthly = fromMajor(rule.amountPerUnit * billable, currency);
      return {
        billingPeriodMoney: monthly,
        monthlyEquivalent: monthly,
        monthlyCashCost: monthly,
        annualCost: multiply(monthly, 12),
        components: [
          {
            id: `usage-${rule.unit}`,
            label: `Usage ${rule.unit} × ${billable}`,
            money: monthly,
            kind: "usage",
          },
        ],
        assumptions: ["Usage treated as monthly metered cost"],
      };
    }
    case "addon":
      return evaluateAmountRule({
        id: `addon-${rule.addonId}`,
        label: rule.name,
        kind: "addon",
        amountMajor: rule.amount,
        currency: rule.currency as CurrencyCode,
        interval: rule.interval,
        amountPeriod: rule.amountPeriod ?? "month",
        quantity: 1,
        billingPreference,
      });
    case "minimum":
      // Handled as floor in plan-cost; return the floor amount for reference.
      return evaluateAmountRule({
        id: "minimum",
        label: "Minimum commitment",
        kind: "minimum",
        amountMajor: rule.amount,
        currency: rule.currency as CurrencyCode,
        interval: rule.interval,
        amountPeriod: rule.amountPeriod ?? "month",
        quantity: 1,
        billingPreference,
      });
    default:
      return null;
  }
}

function tieredAmount(
  tiers: Array<{ upTo: number | null; amountPerUnit: number }>,
  units: number,
): number {
  let remaining = units;
  let total = 0;
  let prevUpTo = 0;
  for (const tier of tiers) {
    if (remaining <= 0) break;
    const cap = tier.upTo == null ? remaining : Math.max(0, tier.upTo - prevUpTo);
    const take = Math.min(remaining, cap);
    total += take * tier.amountPerUnit;
    remaining -= take;
    if (tier.upTo != null) prevUpTo = tier.upTo;
  }
  return total;
}

function evaluateAmountRule(args: {
  id: string;
  label: string;
  kind: CostComponent["kind"];
  amountMajor: number;
  currency: CurrencyCode;
  interval: "month" | "year" | "one-time" | "custom";
  amountPeriod: "month" | "year";
  quantity: number;
  billingPreference: BillingPreference;
  alreadyTotal?: boolean;
}): EvaluatedRuleCost {
  const {
    id,
    label,
    kind,
    amountMajor,
    currency,
    interval,
    amountPeriod,
    quantity,
    billingPreference,
    alreadyTotal,
  } = args;

  const unitMajor = alreadyTotal ? amountMajor : amountMajor * quantity;
  const assumptions: string[] = [];

  let monthlyEquivalent: Money;
  let annualCost: Money;
  let monthlyCashCost: Money | undefined;
  let billingPeriodMoney: Money;

  if (amountPeriod === "month" && interval === "year") {
    monthlyEquivalent = fromMajor(unitMajor, currency);
    annualCost = multiply(monthlyEquivalent, 12);
    billingPeriodMoney = annualCost;
    assumptions.push(
      "Amount is monthly-equivalent; billed annually (annual cash = monthly × 12)",
    );
    if (billingPreference === "monthly") {
      assumptions.push(
        "Plan bills annually; monthly cash cost omitted for this preference",
      );
    }
  } else if (amountPeriod === "month" && interval === "month") {
    monthlyEquivalent = fromMajor(unitMajor, currency);
    monthlyCashCost = monthlyEquivalent;
    annualCost = multiply(monthlyEquivalent, 12);
    billingPeriodMoney =
      billingPreference === "annual" ? annualCost : monthlyCashCost;
  } else if (amountPeriod === "year" && interval === "year") {
    annualCost = fromMajor(unitMajor, currency);
    monthlyEquivalent = fromMajor(unitMajor / 12, currency);
    billingPeriodMoney = annualCost;
    assumptions.push("Amount is annual list price; monthly equivalent = annual ÷ 12");
  } else if (amountPeriod === "year" && interval === "month") {
    // Unusual: annual amount quoted but monthly billing — treat amount as annual run-rate.
    annualCost = fromMajor(unitMajor, currency);
    monthlyEquivalent = fromMajor(unitMajor / 12, currency);
    monthlyCashCost = monthlyEquivalent;
    billingPeriodMoney = monthlyCashCost;
    assumptions.push(
      "Annual amountPeriod with monthly interval treated as annual run-rate / 12 cash",
    );
  } else if (interval === "one-time") {
    const oneTime = fromMajor(unitMajor, currency);
    monthlyEquivalent = zeroMoney(currency);
    annualCost = oneTime;
    billingPeriodMoney = oneTime;
    assumptions.push("One-time charge excluded from monthly equivalent");
  } else {
    // custom / unknown — treat as monthly amount for transparency
    monthlyEquivalent = fromMajor(unitMajor, currency);
    monthlyCashCost = monthlyEquivalent;
    annualCost = multiply(monthlyEquivalent, 12);
    billingPeriodMoney = monthlyEquivalent;
    assumptions.push(`Custom/unknown interval treated as monthly for ${id}`);
  }

  const components: CostComponent[] = [
    {
      id,
      label,
      money: billingPeriodMoney,
      kind,
    },
  ];

  return {
    billingPeriodMoney,
    monthlyEquivalent,
    monthlyCashCost,
    annualCost,
    components,
    assumptions,
  };
}

export function sumEvaluated(parts: EvaluatedRuleCost[], currency: CurrencyCode): EvaluatedRuleCost {
  if (parts.length === 0) {
    const z = zeroMoney(currency);
    return {
      billingPeriodMoney: z,
      monthlyEquivalent: z,
      monthlyCashCost: z,
      annualCost: z,
      components: [],
      assumptions: [],
    };
  }

  let billingPeriodMoney = parts[0]!.billingPeriodMoney;
  let monthlyEquivalent = parts[0]!.monthlyEquivalent;
  let annualCost = parts[0]!.annualCost;
  let monthlyCash: Money | undefined = parts[0]!.monthlyCashCost;
  const components: CostComponent[] = [...parts[0]!.components];
  const assumptions: string[] = [...parts[0]!.assumptions];

  for (let i = 1; i < parts.length; i++) {
    const p = parts[i]!;
    billingPeriodMoney = add(billingPeriodMoney, p.billingPeriodMoney);
    monthlyEquivalent = add(monthlyEquivalent, p.monthlyEquivalent);
    annualCost = add(annualCost, p.annualCost);
    if (monthlyCash && p.monthlyCashCost) {
      monthlyCash = add(monthlyCash, p.monthlyCashCost);
    } else if (!p.monthlyCashCost) {
      monthlyCash = undefined;
    }
    components.push(...p.components);
    assumptions.push(...p.assumptions);
  }

  return {
    billingPeriodMoney,
    monthlyEquivalent,
    monthlyCashCost: monthlyCash,
    annualCost,
    components,
    assumptions,
  };
}
