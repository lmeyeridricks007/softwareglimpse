import {
  crmRequirementsFromCalculatorInput,
  type BillingPreference,
  type ProductCostEstimate,
  type TCOCostItem,
  type TCOSeatYear,
} from "@/domain";
import {
  calculatePlanCost,
  calculateProductCost,
  isCalculablePlan,
  type PricingSnapshot,
} from "@/services/pricing";

export type SoftwareYearCost = {
  year: number;
  users: number;
  annualCostMinor: number | null;
  monthlyEquivalentMinor: number | null;
  status: string;
  planName?: string;
  planSlug?: string;
  sourceIds: string[];
  pricingVerifiedAt?: string;
  currency?: string;
};

function hasPricedAnnual(estimate: ProductCostEstimate): boolean {
  return (
    (estimate.status === "calculated" || estimate.status === "partial") &&
    estimate.annualCost != null
  );
}

/**
 * Price an explicitly selected plan for the given seat count.
 * Contact-sales / empty-rule plans stay unknown (never treated as $0).
 */
function estimateSelectedPlan(
  snapshot: PricingSnapshot,
  planSlug: string,
  seats: number,
  billingPreference: BillingPreference,
): ProductCostEstimate | null {
  const plan = snapshot.pricing?.plans.find((p) => p.slug === planSlug);
  if (!plan) return null;

  const currency = (snapshot.pricing?.currency ?? "USD") as
    | "EUR"
    | "USD"
    | "GBP";
  const sourceIds = [
    ...new Set([
      ...snapshot.sourceIds,
      ...(snapshot.pricing?.sourceIds ?? []),
    ]),
  ];
  const base = {
    productSlug: snapshot.productSlug,
    productName: snapshot.name,
    currency,
    sourceIds,
    pricingVerifiedAt:
      snapshot.pricingCheckedAt ?? snapshot.pricing?.verifiedAt,
    eligibilityStatus: "CALCULABLE" as const,
    recommendedPlan: {
      id: plan.id,
      slug: plan.slug,
      name: plan.name,
    },
  };

  if (!isCalculablePlan(plan)) {
    return {
      ...base,
      status: "custom-quote",
      components: [],
      assumptions: [],
      warnings: ["selected-plan-contact-sales"],
      confidence: "low",
      explanation: `${plan.name} requires a custom quote — not treated as $0`,
    };
  }

  const planCost = calculatePlanCost({
    plan,
    seats,
    billingPreference,
    currencyFallback: currency,
  });

  return {
    ...base,
    status: "calculated",
    monthlyEquivalent: planCost.monthlyEquivalent,
    monthlyCashCost: planCost.monthlyCashCost,
    annualCost: planCost.annualCost,
    components: planCost.components,
    assumptions: [
      ...planCost.assumptions,
      "Plan selected in TCO calculator",
    ],
    warnings: planCost.warnings,
    confidence: "medium",
    explanation: "Costs use your selected subscription plan and seat count",
  };
}

function resolveSoftwareEstimate(input: {
  snapshot: PricingSnapshot;
  users: number;
  requiredFeatureSlugs: string[];
  billingPreference: BillingPreference;
  selectedPlanSlug?: string;
}): {
  estimate: ProductCostEstimate;
  usedSeatsOnlyFallback: boolean;
} {
  const { snapshot, users, requiredFeatureSlugs, billingPreference } = input;

  if (input.selectedPlanSlug) {
    const selected = estimateSelectedPlan(
      snapshot,
      input.selectedPlanSlug,
      users,
      billingPreference,
    );
    if (selected) {
      return { estimate: selected, usedSeatsOnlyFallback: false };
    }
  }

  const withFeatures = calculateProductCost(
    snapshot,
    crmRequirementsFromCalculatorInput({
      crmUsers: users,
      requiredFeatureSlugs,
      billingPreference,
    }),
  );

  if (hasPricedAnnual(withFeatures) || requiredFeatureSlugs.length === 0) {
    return { estimate: withFeatures, usedSeatsOnlyFallback: false };
  }

  // TCO must still price the subscription for seats + billing. Feature fit
  // gaps (unknown coverage / no suitable plan) belong in Scorecard — they
  // must not wipe licence cost to "Unknown" or imply a free tier.
  const seatsOnly = calculateProductCost(
    snapshot,
    crmRequirementsFromCalculatorInput({
      crmUsers: users,
      requiredFeatureSlugs: [],
      billingPreference,
    }),
  );

  if (hasPricedAnnual(seatsOnly)) {
    return {
      estimate: {
        ...seatsOnly,
        status: seatsOnly.status === "calculated" ? "partial" : seatsOnly.status,
        assumptions: [
          ...seatsOnly.assumptions,
          "Subscription priced by seats and billing; profile must-haves did not block licence cost",
        ],
        warnings: [
          ...new Set([
            ...withFeatures.warnings,
            ...seatsOnly.warnings,
            "tco-seats-only-software-fallback",
          ]),
        ],
        explanation:
          withFeatures.explanation ??
          seatsOnly.explanation ??
          "Subscription based on seats and billing preference",
      },
      usedSeatsOnlyFallback: true,
    };
  }

  return { estimate: withFeatures, usedSeatsOnlyFallback: false };
}

/**
 * Resolve multi-year software subscription costs via the canonical pricing engine.
 * One calculateProductCost call per year (seat growth). Never invents prices.
 * Never defaults unknown feature coverage to a free tier or $0 licence.
 */
export function calculateSoftwareCostsOverHorizon(input: {
  snapshot: PricingSnapshot;
  seatPlan: TCOSeatYear[];
  requiredFeatureSlugs: string[];
  billingPreference: BillingPreference;
  /** User-assumed discount 0–90; applied only to calculated software. */
  negotiatedDiscountPercent?: number;
  /** Explicit plan slug for this product, when the user picked one. */
  selectedPlanSlug?: string;
}): {
  years: SoftwareYearCost[];
  items: TCOCostItem[];
  status: string;
  planName?: string;
  planSlug?: string;
  sourceIds: string[];
  pricingVerifiedAt?: string;
  currency?: string;
} {
  const discount = Math.min(
    90,
    Math.max(0, input.negotiatedDiscountPercent ?? 0),
  );
  const years: SoftwareYearCost[] = [];
  const items: TCOCostItem[] = [];
  let status = "insufficient-data";
  let planName: string | undefined;
  let planSlug: string | undefined;
  let sourceIds: string[] = [];
  let pricingVerifiedAt: string | undefined;
  let currency: string | undefined;
  let usedFallback = false;

  for (const seat of input.seatPlan) {
    const { estimate, usedSeatsOnlyFallback } = resolveSoftwareEstimate({
      snapshot: input.snapshot,
      users: seat.users,
      requiredFeatureSlugs: input.requiredFeatureSlugs,
      billingPreference: input.billingPreference,
      selectedPlanSlug: input.selectedPlanSlug,
    });
    usedFallback = usedFallback || usedSeatsOnlyFallback;
    status = estimate.status;
    planName = estimate.recommendedPlan?.name ?? planName;
    planSlug = estimate.recommendedPlan?.slug ?? planSlug;
    sourceIds = estimate.sourceIds ?? sourceIds;
    pricingVerifiedAt = estimate.pricingVerifiedAt ?? pricingVerifiedAt;
    currency = estimate.currency ?? currency;

    let annualMinor: number | null = null;
    let monthlyMinor: number | null = null;

    if (hasPricedAnnual(estimate) && estimate.annualCost) {
      annualMinor = estimate.annualCost.amountMinor;
      monthlyMinor = estimate.monthlyEquivalent?.amountMinor ?? null;
      if (discount > 0 && annualMinor != null) {
        annualMinor = Math.round(annualMinor * (1 - discount / 100));
        if (monthlyMinor != null) {
          monthlyMinor = Math.round(monthlyMinor * (1 - discount / 100));
        }
      }
    }

    years.push({
      year: seat.year,
      users: seat.users,
      annualCostMinor: annualMinor,
      monthlyEquivalentMinor: monthlyMinor,
      status: estimate.status,
      planName: estimate.recommendedPlan?.name,
      planSlug: estimate.recommendedPlan?.slug,
      sourceIds: estimate.sourceIds,
      pricingVerifiedAt: estimate.pricingVerifiedAt,
      currency: estimate.currency,
    });

    if (annualMinor != null && estimate.currency) {
      const notes: string[] = [];
      if (discount > 0) {
        notes.push(`Includes your assumed ${discount}% negotiated discount`);
      }
      if (input.selectedPlanSlug) {
        notes.push("Based on your selected plan");
      } else if (usedSeatsOnlyFallback) {
        notes.push("Based on seats and billing (not free tier)");
      }
      items.push({
        id: `software-y${seat.year}-${input.snapshot.productSlug}`,
        category: "software",
        label: `Software subscription — Year ${seat.year}`,
        sourceType: discount > 0 || input.selectedPlanSlug ? "calculated" : "researched",
        frequency: "annual",
        amountMinor: annualMinor,
        currency: estimate.currency,
        startYear: seat.year,
        endYear: seat.year,
        productId: input.snapshot.productSlug,
        evidenceRef: estimate.sourceIds[0],
        userNote: notes.length > 0 ? notes.join(". ") : undefined,
      });
    }
  }

  const y1 = years[0];
  if (y1 && y1.annualCostMinor == null) {
    items.push({
      id: `software-unknown-${input.snapshot.productSlug}`,
      category: "software",
      label: "Software subscription",
      sourceType: "unknown",
      frequency: "annual",
      amountMinor: null,
      productId: input.snapshot.productSlug,
      userNote:
        status === "custom-quote"
          ? "Custom quote — not treated as €0"
          : "No calculable public pricing for selected seats / plan",
    });
  }

  return {
    years,
    items,
    status,
    planName,
    planSlug,
    sourceIds,
    pricingVerifiedAt,
    currency,
  };
}
