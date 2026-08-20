import type { BillingPreference, PricingPlan, PricingRule } from "@/domain";
import type { CurrencyCode } from "@/domain/schemas/primitives";
import { fromMajor, type Money, zeroMoney } from "@/domain/money";
import { evaluateRule, sumEvaluated } from "./evaluate-rule";
import type { PlanCostResult } from "./types";

export type PlanCostInput = {
  plan: PricingPlan;
  seats: number;
  units?: number;
  billingPreference: BillingPreference;
  requiredAddonIds?: string[];
  currencyFallback?: CurrencyCode;
};

/**
 * Sum non-addon rules for a plan (addons only if required).
 * Free plans cost 0. Minimum rules raise the floor on billing-period total.
 * hasFreeTrial on envelope/plan does NOT make ongoing cost free.
 */
export function calculatePlanCost(input: PlanCostInput): PlanCostResult {
  const { plan, seats, units, billingPreference, requiredAddonIds } = input;
  const currency = resolveCurrency(plan, input.currencyFallback ?? "USD");
  const warnings: string[] = [];
  const assumptions: string[] = [];

  if (plan.isFree) {
    const z = zeroMoney(currency);
    assumptions.push("Free plan — ongoing cost is $0 (trial ≠ free plan)");
    return {
      plan,
      billingPeriodMoney: z,
      monthlyEquivalent: z,
      monthlyCashCost: z,
      annualCost: z,
      components: [
        {
          id: "free",
          label: "Free plan",
          money: z,
          kind: "base",
        },
      ],
      assumptions,
      warnings,
    };
  }

  if (plan.contactSales || plan.rules.length === 0) {
    const z = zeroMoney(currency);
    warnings.push("contact-sales-or-empty-rules");
    return {
      plan,
      billingPeriodMoney: z,
      monthlyEquivalent: z,
      annualCost: z,
      components: [],
      assumptions: ["Contact sales / empty rules — not a $0 price"],
      warnings,
    };
  }

  const nonMinimum = plan.rules.filter((r) => r.kind !== "minimum");
  const minimums = plan.rules.filter((r) => r.kind === "minimum");

  const evaluated = nonMinimum
    .map((rule) =>
      evaluateRule({
        rule,
        seats,
        units,
        billingPreference,
        requiredAddonIds,
      }),
    )
    .filter((x): x is NonNullable<typeof x> => x != null);

  // Skip addon rules that were not required (evaluateRule returns null)
  const summed = sumEvaluated(evaluated, currency);

  let billingPeriodMoney = summed.billingPeriodMoney;
  let monthlyEquivalent = summed.monthlyEquivalent;
  let monthlyCashCost = summed.monthlyCashCost;
  let annualCost = summed.annualCost;
  const components = [...summed.components];
  assumptions.push(...summed.assumptions);

  for (const minRule of minimums) {
    const floor = minimumFloor(minRule, currency, billingPreference);
    if (floor && billingPeriodMoney.amountMinor < floor.billing.amountMinor) {
      const bump = {
        id: "minimum-floor",
        label: "Minimum commitment floor",
        money: floor.billing,
        kind: "minimum" as const,
      };
      components.push(bump);
      billingPeriodMoney = floor.billing;
      monthlyEquivalent = floor.monthly;
      annualCost = floor.annual;
      monthlyCashCost = floor.monthlyCash;
      assumptions.push("Minimum commitment raised total to floor");
    }
  }

  return {
    plan,
    billingPeriodMoney,
    monthlyEquivalent,
    monthlyCashCost,
    annualCost,
    components,
    assumptions,
    warnings,
  };
}

function minimumFloor(
  rule: PricingRule,
  currency: CurrencyCode,
  billingPreference: BillingPreference,
): {
  billing: Money;
  monthly: Money;
  annual: Money;
  monthlyCash?: Money;
} | null {
  if (rule.kind !== "minimum") return null;
  const amountPeriod = rule.amountPeriod ?? "month";
  const amount = rule.amount;
  if (amountPeriod === "month" && rule.interval === "year") {
    const monthly = fromMajor(amount, currency);
    const annual = fromMajor(amount * 12, currency);
    return { billing: annual, monthly, annual };
  }
  if (amountPeriod === "month" && rule.interval === "month") {
    const monthly = fromMajor(amount, currency);
    const annual = fromMajor(amount * 12, currency);
    return {
      billing: billingPreference === "annual" ? annual : monthly,
      monthly,
      annual,
      monthlyCash: monthly,
    };
  }
  if (amountPeriod === "year") {
    const annual = fromMajor(amount, currency);
    const monthly = fromMajor(amount / 12, currency);
    return { billing: annual, monthly, annual };
  }
  return null;
}

function resolveCurrency(
  plan: PricingPlan,
  fallback: CurrencyCode,
): CurrencyCode {
  const rule = plan.rules[0];
  if (rule && "currency" in rule && typeof rule.currency === "string") {
    return rule.currency as CurrencyCode;
  }
  return fallback;
}

export function isCalculablePlan(plan: PricingPlan): boolean {
  if (plan.contactSales) return false;
  if (plan.rules.length === 0) return false;
  // Free plans are calculable (zero).
  if (plan.isFree) return true;
  return plan.rules.some((r) => r.kind !== "addon");
}
