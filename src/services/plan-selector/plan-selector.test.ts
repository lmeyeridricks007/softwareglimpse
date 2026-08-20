import { describe, expect, it } from "vitest";
import type {
  CrmPlanSelectorAnswers,
  FeatureSupport,
  Pricing,
  PricingPlan,
} from "@/domain";
import {
  analyzePlanSelection,
  classifyVendorSupport,
} from "@/services/plan-selector";
import type { PricingSnapshot } from "@/services/pricing";

function perSeat(
  amount: number,
  opts: { minimumSeats?: number; maximumSeats?: number } = {},
): PricingPlan["rules"][number] {
  return {
    kind: "per-seat",
    amountPerSeat: amount,
    currency: "USD",
    interval: "month",
    amountPeriod: "month",
    minimumSeats: opts.minimumSeats,
    maximumSeats: opts.maximumSeats,
  };
}

function plan(
  slug: string,
  name: string,
  amount: number,
  extras: Partial<PricingPlan> = {},
): PricingPlan {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: amount === 0,
    rules: amount === 0 ? [perSeat(0)] : [perSeat(amount)],
    ...extras,
  };
}

function fs(
  featureSlug: string,
  planSlugs: string[],
  availability: FeatureSupport["availability"] = "supported",
): FeatureSupport {
  return {
    featureSlug,
    availability,
    planSlugs,
    sourceIds: ["test"],
  };
}

function snap(
  overrides: Partial<PricingSnapshot> & { pricing: Pricing },
): PricingSnapshot {
  return {
    productSlug: "test-crm",
    name: "Test CRM",
    primaryCategorySlug: "crm",
    featureSupport: [],
    hasFixtureResearch: false,
    sourceIds: ["test"],
    pricingCheckedAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

const ladderPricing: Pricing = {
  currency: "USD",
  model: "subscription",
  hasFreeTrial: true,
  hasFreePlan: true,
  startingPriceMonthly: 0,
  plans: [
    plan("lite", "Lite", 14),
    plan("growth", "Growth", 29),
    plan("premium", "Premium", 49),
    plan("ultimate", "Ultimate", 79),
  ],
  sourceIds: ["test"],
};

const matrix: FeatureSupport[] = [
  fs("pipeline-management", ["lite", "growth", "premium", "ultimate"]),
  fs("email-sync", ["growth", "premium", "ultimate"]),
  fs("workflow-automation", ["growth", "premium", "ultimate"]),
  fs("email-sequences", ["growth", "premium", "ultimate"]),
  fs("forecasting", ["premium", "ultimate"], "higher-plan-only"),
  fs("role-permissions", ["ultimate"], "higher-plan-only"),
  fs("sso", ["ultimate"], "higher-plan-only"),
  fs("reporting", ["lite", "growth", "premium", "ultimate"]),
  fs("custom-fields", ["lite", "growth", "premium", "ultimate"]),
  fs("ai-assistance", ["premium", "ultimate"]),
];

function answers(
  partial: Partial<CrmPlanSelectorAnswers> = {},
): CrmPlanSelectorAnswers {
  return {
    productSlug: "test-crm",
    crmUsers: 10,
    usersIn12Months: 10,
    fullAccessNeed: "yes",
    requirementPriorities: {},
    usageAssumptions: {},
    billingPreference: "annual",
    preference: "balanced",
    requireSso: false,
    requireAuditLogs: false,
    requireSandbox: false,
    requireAdvancedPermissions: false,
    ...partial,
  };
}

describe("CRM Plan Selector recommendation engine", () => {
  it("TEST 1: basic pipeline → cheapest qualifying plan", () => {
    const analysis = analyzePlanSelection(
      snap({ pricing: ladderPricing, featureSupport: matrix }),
      answers({
        requirementPriorities: { "pipeline-management": "must" },
      }),
    );
    expect(analysis.kind).toBe("recommended");
    expect(analysis.recommendedPlan?.slug).toBe("lite");
  });

  it("TEST 2: higher-plan-only must-have → upgrade + driver", () => {
    const analysis = analyzePlanSelection(
      snap({ pricing: ladderPricing, featureSupport: matrix }),
      answers({
        requirementPriorities: {
          "pipeline-management": "must",
          forecasting: "must",
        },
      }),
    );
    expect(analysis.recommendedPlan?.slug).toBe("premium");
    expect(
      analysis.requirementDrivers.some((d) => d.featureSlug === "forecasting"),
    ).toBe(true);
  });

  it("TEST 3: nice-to-have only on higher plan → cheaper stays recommended", () => {
    const analysis = analyzePlanSelection(
      snap({ pricing: ladderPricing, featureSupport: matrix }),
      answers({
        requirementPriorities: {
          "pipeline-management": "must",
          "email-sync": "must",
          forecasting: "nice",
        },
      }),
    );
    expect(analysis.recommendedPlan?.slug).toBe("growth");
    expect(analysis.upgradeBenefits).toContain("Sales forecasting");
  });

  it("TEST 4: usage/seat exceeds lower-plan limit → next plan", () => {
    const pricing: Pricing = {
      ...ladderPricing,
      plans: [
        {
          ...plan("lite", "Lite", 14),
          limits: { maxSeats: 5 },
        },
        plan("growth", "Growth", 29),
        plan("premium", "Premium", 49),
      ],
    };
    const analysis = analyzePlanSelection(
      snap({ pricing, featureSupport: matrix }),
      answers({
        crmUsers: 12,
        requirementPriorities: { "pipeline-management": "must" },
      }),
    );
    expect(analysis.recommendedPlan?.slug).toBe("growth");
    expect(
      analysis.planLadder.some(
        (e) => e.plan.slug === "lite" && e.status === "failed",
      ),
    ).toBe(true);
  });

  it("TEST 5: unknown required feature → confidence reduced / unknown shown", () => {
    const analysis = analyzePlanSelection(
      snap({ pricing: ladderPricing, featureSupport: matrix }),
      answers({
        requirementPriorities: {
          "pipeline-management": "must",
          "mystery-feature": "must",
        },
      }),
    );
    expect(analysis.unknowns).toContain("mystery-feature");
    expect(analysis.confidence).toBe("low");
    expect(
      analysis.kind === "unknown-coverage" || analysis.unknowns.length > 0,
    ).toBe(true);
  });

  it("TEST 6: enterprise SSO gate", () => {
    const analysis = analyzePlanSelection(
      snap({ pricing: ladderPricing, featureSupport: matrix }),
      answers({
        requirementPriorities: { "pipeline-management": "must" },
        requireSso: true,
      }),
    );
    expect(analysis.recommendedPlan?.slug).toBe("ultimate");
    expect(
      analysis.requirementDrivers.some((d) => d.featureSlug === "sso"),
    ).toBe(true);
  });

  it("TEST 7: no plan satisfies → do not recommend highest blindly", () => {
    const thinMatrix: FeatureSupport[] = [
      fs("pipeline-management", ["lite"]),
      fs("sso", [], "not-supported"),
    ];
    const analysis = analyzePlanSelection(
      snap({ pricing: ladderPricing, featureSupport: thinMatrix }),
      answers({
        requirementPriorities: {
          "pipeline-management": "must",
          sso: "must",
        },
      }),
    );
    expect(analysis.kind).toBe("no-suitable-plan");
    expect(analysis.recommendedPlan).toBeNull();
  });

  it("TEST 8: custom pricing → no invented total", () => {
    const pricing: Pricing = {
      currency: "USD",
      model: "subscription",
      hasFreeTrial: false,
      hasFreePlan: false,
      plans: [
        plan("growth", "Growth", 29),
        {
          id: "plan-ent",
          slug: "enterprise",
          name: "Enterprise",
          isFree: false,
          contactSales: true,
          rules: [],
        },
      ],
      sourceIds: ["test"],
    };
    const analysis = analyzePlanSelection(
      snap({
        pricing,
        featureSupport: [
          fs("pipeline-management", ["growth", "enterprise"]),
          fs("sso", ["enterprise"], "higher-plan-only"),
        ],
      }),
      answers({
        requirementPriorities: { sso: "must" },
      }),
    );
    expect(
      analysis.kind === "custom-quote" ||
        analysis.planLadder.some((e) => e.status === "custom"),
    ).toBe(true);
    if (analysis.recommendedPlan?.contactSales) {
      expect(analysis.pricingNow).toBeNull();
    }
  });

  it("TEST 9: 12-month growth scenario recalculated", () => {
    const analysis = analyzePlanSelection(
      snap({ pricing: ladderPricing, featureSupport: matrix }),
      answers({
        crmUsers: 10,
        usersIn12Months: 20,
        requirementPriorities: {
          "pipeline-management": "must",
          "email-sync": "must",
        },
      }),
    );
    expect(analysis.pricingNow).not.toBeNull();
    expect(analysis.pricingGrowth).not.toBeNull();
    expect(analysis.pricingGrowth!.monthlyEquivalent.amountMinor).toBeGreaterThan(
      analysis.pricingNow!.monthlyEquivalent.amountMinor,
    );
  });

  it("classifies vendor support from matrix quality", () => {
    const supported = classifyVendorSupport(
      snap({ pricing: ladderPricing, featureSupport: matrix }),
    );
    expect(supported.status).toBe("supported");

    const unsupported = classifyVendorSupport(
      snap({
        pricing: { ...ladderPricing, plans: [] },
        featureSupport: [],
      }),
    );
    expect(unsupported.status).toBe("unsupported");
  });

  it("classifies complete single-tier products as supported", () => {
    const single: Pricing = {
      currency: "USD",
      model: "subscription",
      hasFreeTrial: true,
      hasFreePlan: false,
      startingPriceMonthly: 25,
      plans: [plan("business", "Business", 25)],
      sourceIds: ["test"],
    };
    const result = classifyVendorSupport(
      snap({ pricing: single, featureSupport: matrix }),
    );
    expect(result.status).toBe("supported");
    expect(result.calculablePlanCount).toBe(1);
  });

  it("keeps empty-rule paid stubs as partial", () => {
    const thin: Pricing = {
      currency: "USD",
      model: "freemium",
      hasFreeTrial: false,
      hasFreePlan: true,
      startingPriceMonthly: 0,
      plans: [
        plan("free", "Free", 0, { isFree: true }),
        {
          id: "plan-paid",
          slug: "paid",
          name: "Paid",
          isFree: false,
          contactSales: false,
          rules: [],
        },
      ],
      sourceIds: ["test"],
    };
    const result = classifyVendorSupport(
      snap({ pricing: thin, featureSupport: matrix }),
    );
    expect(result.status).toBe("partial");
  });
});
