import { describe, expect, it } from "vitest";
import {
  fromMajor,
  toMajor,
  formatMoney,
  type CrmRequirements,
  type FeatureSupport,
  type Pricing,
  type PricingPlan,
} from "@/domain";
import {
  calculatePlanCost,
  calculateProductCost,
  compareProductCosts,
  evaluateRule,
  findMinimumSuitablePlan,
  resolvePlanDisplayPrice,
  type PricingSnapshot,
} from "@/services/pricing";
import { buildPricingSnapshot } from "@/services/pricing/server";
import type { Software } from "@/domain";

const now = new Date("2026-08-13T12:00:00.000Z");

function perSeatRule(
  amountPerSeat: number,
  opts: {
    interval?: "month" | "year";
    amountPeriod?: "month" | "year";
    minimumSeats?: number;
  } = {},
): Pricing["plans"][number]["rules"][number] {
  return {
    kind: "per-seat",
    amountPerSeat,
    currency: "USD",
    interval: opts.interval ?? "year",
    amountPeriod: opts.amountPeriod ?? "month",
    minimumSeats: opts.minimumSeats,
  };
}

function plan(
  slug: string,
  name: string,
  rules: PricingPlan["rules"],
  extras: Partial<PricingPlan> = {},
): PricingPlan {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    rules,
    ...extras,
  };
}

function snapshot(overrides: Partial<PricingSnapshot> & { pricing: Pricing }): PricingSnapshot {
  return {
    productSlug: "pipedrive",
    name: "Pipedrive",
    primaryCategorySlug: "crm",
    featureSupport: [],
    hasFixtureResearch: true,
    sourceIds: ["pipedrive-pricing-fixture"],
    pricingCheckedAt: "2026-08-01T00:00:00.000Z",
    ...overrides,
  };
}

const pipedriveLikePricing: Pricing = {
  currency: "USD",
  model: "subscription",
  hasFreeTrial: true,
  hasFreePlan: false,
  startingPriceMonthly: 14,
  plans: [
    plan("essential", "Essential", [perSeatRule(14)]),
    plan("advanced", "Advanced", [perSeatRule(24)]),
    plan("enterprise", "Enterprise", [], { contactSales: true }),
  ],
  sourceIds: ["pipedrive-pricing-fixture"],
  notes: "fixture",
};

describe("money", () => {
  it("uses integer minor units", () => {
    const m = fromMajor(14, "USD");
    expect(m.amountMinor).toBe(1400);
    expect(toMajor(m)).toBe(14);
    expect(formatMoney(m)).toContain("14");
  });
});

describe("evaluate-rule amountPeriod semantics", () => {
  it("monthly amount + annual billing: monthly eq vs annual cash distinct", () => {
    const result = evaluateRule({
      rule: perSeatRule(14, { interval: "year", amountPeriod: "month" }),
      seats: 15,
      billingPreference: "annual",
    })!;

    // monthlyEquivalent = 14 * 15 = 210
    expect(result.monthlyEquivalent.amountMinor).toBe(21000);
    // annual cash = 210 * 12 = 2520
    expect(result.annualCost.amountMinor).toBe(252000);
    expect(result.monthlyCashCost).toBeUndefined();
    expect(toMajor(result.monthlyEquivalent)).not.toBe(toMajor(result.annualCost));
  });

  it("monthly amount + monthly billing produces monthly cash", () => {
    const result = evaluateRule({
      rule: perSeatRule(14, { interval: "month", amountPeriod: "month" }),
      seats: 15,
      billingPreference: "monthly",
    })!;
    expect(result.monthlyCashCost?.amountMinor).toBe(21000);
    expect(result.annualCost.amountMinor).toBe(252000);
  });

  it("yearly amountPeriod + year interval divides for monthly eq", () => {
    const result = evaluateRule({
      rule: perSeatRule(168, { interval: "year", amountPeriod: "year" }),
      seats: 1,
      billingPreference: "annual",
    })!;
    expect(result.annualCost.amountMinor).toBe(16800);
    expect(result.monthlyEquivalent.amountMinor).toBe(1400);
  });
});

describe("pipedrive-like 15 users annual", () => {
  const requirements: CrmRequirements = {
    crmUsers: 15,
    requiredFeatureSlugs: ["workflow-automation", "reporting"],
    billingPreference: "annual",
  };

  const featureSupport: FeatureSupport[] = [
    {
      featureSlug: "workflow-automation",
      availability: "supported",
      planSlugs: [],
      sourceIds: ["fixture"],
    },
    {
      featureSlug: "reporting",
      availability: "supported",
      planSlugs: [],
      sourceIds: ["fixture"],
    },
  ];

  it("picks cheapest calculable plan with matrix-incomplete warning", () => {
    const snap = snapshot({
      pricing: pipedriveLikePricing,
      featureSupport,
      hasFixtureResearch: true,
    });
    const estimate = calculateProductCost(snap, requirements, { now });
    expect(estimate.recommendedPlan?.slug).toBe("essential");
    expect(estimate.monthlyEquivalent?.amountMinor).toBe(21000);
    expect(estimate.annualCost?.amountMinor).toBe(252000);
    expect(estimate.warnings).toContain("feature-plan-matrix-incomplete");
    expect(estimate.confidence).not.toBe("high"); // fixture + matrix cap
  });
});

describe("plan matrix", () => {
  it("rejects cheaper plan when feature only on higher plan", () => {
    const pricing: Pricing = {
      currency: "USD",
      model: "subscription",
      plans: [
        plan("basic", "Basic", [perSeatRule(10)]),
        plan("pro", "Pro", [perSeatRule(30)]),
      ],
      sourceIds: [],
    };
    const featureSupport: FeatureSupport[] = [
      {
        featureSlug: "workflow-automation",
        availability: "higher-plan-only",
        planSlugs: ["pro"],
        sourceIds: ["x"],
      },
    ];
    const snap = snapshot({
      pricing,
      featureSupport,
      hasFixtureResearch: false,
      pricingCheckedAt: "2026-08-10T00:00:00.000Z",
    });
    const resolution = findMinimumSuitablePlan(snap, {
      crmUsers: 5,
      requiredFeatureSlugs: ["workflow-automation"],
      billingPreference: "annual",
    });
    expect(resolution.kind).toBe("recommended");
    expect(resolution.plan?.slug).toBe("pro");
  });

  it("treats higher-plan-only without planSlugs as unknown", () => {
    const snap = snapshot({
      pricing: pipedriveLikePricing,
      featureSupport: [
        {
          featureSlug: "forecasting",
          availability: "higher-plan-only",
          planSlugs: [],
          sourceIds: [],
        },
      ],
    });
    const resolution = findMinimumSuitablePlan(snap, {
      crmUsers: 5,
      requiredFeatureSlugs: ["forecasting"],
      billingPreference: "either",
    });
    expect(resolution.kind).toBe("unknown-coverage");
  });

  it("excludes free plans when required features exist without plan matrix", () => {
    const pricing: Pricing = {
      currency: "USD",
      model: "freemium",
      hasFreePlan: true,
      plans: [
        plan("free", "Free", [perSeatRule(0, { interval: "month" })], {
          isFree: true,
        }),
        plan("growth", "Growth", [perSeatRule(9)]),
        plan("pro", "Pro", [perSeatRule(39)]),
      ],
      sourceIds: [],
    };
    const snap = snapshot({
      productSlug: "freshsales",
      name: "Freshsales",
      pricing,
      featureSupport: [
        {
          featureSlug: "workflow-automation",
          availability: "supported",
          planSlugs: [],
          sourceIds: ["f"],
        },
        {
          featureSlug: "reporting",
          availability: "supported",
          planSlugs: [],
          sourceIds: ["f"],
        },
      ],
    });
    const resolution = findMinimumSuitablePlan(snap, {
      crmUsers: 15,
      requiredFeatureSlugs: ["workflow-automation", "reporting"],
      billingPreference: "annual",
    });
    expect(resolution.kind).toBe("recommended");
    expect(resolution.plan?.slug).toBe("growth");
    expect(resolution.plan?.isFree).toBe(false);
    expect(resolution.warnings).toContain(
      "excluded-free-plan-with-required-features",
    );
  });

  it("returns no-suitable-plan for not-supported required feature", () => {
    const snap = snapshot({
      pricing: pipedriveLikePricing,
      featureSupport: [
        {
          featureSlug: "telephony",
          availability: "not-supported",
          planSlugs: [],
          sourceIds: [],
        },
      ],
    });
    const estimate = calculateProductCost(
      snap,
      {
        crmUsers: 5,
        requiredFeatureSlugs: ["telephony"],
        billingPreference: "either",
      },
      { now },
    );
    expect(estimate.status).toBe("no-suitable-plan");
  });
});

describe("custom-quote and free trial", () => {
  it("empty rules enterprise is custom-quote not zero", () => {
    const pricing: Pricing = {
      currency: "USD",
      model: "custom",
      plans: [plan("enterprise", "Enterprise", [], { contactSales: true })],
      sourceIds: [],
    };
    const snap = snapshot({ pricing, featureSupport: [] });
    const estimate = calculateProductCost(
      snap,
      { crmUsers: 10, requiredFeatureSlugs: [], billingPreference: "either" },
      { now },
    );
    expect(estimate.status).toBe("custom-quote");
    expect(estimate.monthlyEquivalent).toBeUndefined();
  });

  it("contact sales is not treated as $0 in plan cost", () => {
    const cost = calculatePlanCost({
      plan: plan("enterprise", "Enterprise", [], { contactSales: true }),
      seats: 10,
      billingPreference: "annual",
    });
    expect(cost.warnings).toContain("contact-sales-or-empty-rules");
    expect(cost.assumptions.some((a) => a.includes("not a $0"))).toBe(true);
  });

  it("free trial does not make ongoing cost free", () => {
    const snap = snapshot({
      pricing: {
        ...pipedriveLikePricing,
        hasFreeTrial: true,
        plans: [plan("essential", "Essential", [perSeatRule(14)])],
      },
      featureSupport: [],
    });
    const estimate = calculateProductCost(
      snap,
      { crmUsers: 3, requiredFeatureSlugs: [], billingPreference: "annual" },
      { now },
    );
    expect(estimate.monthlyEquivalent?.amountMinor).toBe(4200);
    expect(
      estimate.assumptions.some((a) => a.toLowerCase().includes("free trial")),
    ).toBe(true);
  });

  it("isFree plan is genuinely zero", () => {
    const cost = calculatePlanCost({
      plan: plan("free", "Free", [perSeatRule(0, { interval: "month" })], {
        isFree: true,
      }),
      seats: 10,
      billingPreference: "monthly",
    });
    expect(cost.monthlyEquivalent.amountMinor).toBe(0);
  });
});

describe("confidence and freshness", () => {
  it("stale pricing reduces confidence when now is injected", () => {
    const snap = snapshot({
      pricing: pipedriveLikePricing,
      featureSupport: [],
      hasFixtureResearch: false,
      pricingCheckedAt: "2026-01-01T00:00:00.000Z",
    });
    const fresh = calculateProductCost(
      snap,
      { crmUsers: 5, requiredFeatureSlugs: [], billingPreference: "annual" },
      { now: new Date("2026-01-15T00:00:00.000Z") },
    );
    const stale = calculateProductCost(
      snap,
      { crmUsers: 5, requiredFeatureSlugs: [], billingPreference: "annual" },
      { now: new Date("2026-08-13T00:00:00.000Z") },
    );
    expect(fresh.confidence === "high" || fresh.confidence === "medium").toBe(
      true,
    );
    // Stale reduces confidence vs a fresh check on the same snapshot.
    const rank = { high: 3, medium: 2, low: 1 } as const;
    expect(rank[stale.confidence]).toBeLessThanOrEqual(rank[fresh.confidence]);
    expect(stale.confidence).not.toBe("high");
    expect(stale.warnings).toContain("pricing-stale");
  });
});

describe("sales-intelligence category eligibility", () => {
  it("calculates SI seat pricing instead of excluding the category", () => {
    const snap = snapshot({
      productSlug: "apollo",
      name: "Apollo",
      primaryCategorySlug: "sales-intelligence",
      pricing: pipedriveLikePricing,
      featureSupport: [],
    });
    const estimate = calculateProductCost(
      snap,
      { crmUsers: 5, requiredFeatureSlugs: [], billingPreference: "monthly" },
      { now },
    );
    expect(estimate.status).toBe("partial");
    expect(estimate.monthlyEquivalent?.amountMinor).toBe(7000);
    expect(estimate.explanation ?? "").not.toMatch(/outside this calculator/i);
  });

  it("marks credit-pack ladders as custom-quote without invented totals", () => {
    const snap = snapshot({
      productSlug: "bookyourdata",
      name: "BookYourData",
      primaryCategorySlug: "sales-intelligence",
      pricing: {
        currency: "USD",
        model: "usage",
        plans: [
          {
            id: "plan-credits",
            slug: "credit-packs",
            name: "Credit packs",
            isFree: false,
            contactSales: true,
            rules: [],
          },
        ],
        sourceIds: ["test"],
      },
      featureSupport: [],
    });
    const estimate = calculateProductCost(
      snap,
      { crmUsers: 5, requiredFeatureSlugs: [], billingPreference: "monthly" },
      { now },
    );
    expect(estimate.status).toBe("custom-quote");
    expect(estimate.monthlyEquivalent).toBeUndefined();
  });
});

describe("affiliate isolation", () => {
  it("buildPricingSnapshot strips affiliate and ignores it for cost", () => {
    const software = {
      id: "soft-x",
      slug: "pipedrive",
      name: "Pipedrive",
      aliases: [],
      formerlyKnownAs: [],
      entityType: "software" as const,
      productLifecycle: "active" as const,
      primaryCategorySlug: "crm",
      secondaryCategorySlugs: [],
      subcategorySlugs: [],
      industrySlugs: [],
      businessSizeSlugs: [],
      businessTypeSlugs: [],
      teamTypeSlugs: [],
      useCaseSlugs: [],
      userPrioritySlugs: [],
      featureRatings: [],
      integrationSlugs: [],
      platforms: [],
      deploymentModels: [],
      aiCapabilities: [],
      pros: [],
      cons: [],
      bestFor: [],
      notIdealFor: [],
      competitorSlugs: [],
      alternativeSlugs: [],
      comparableSlugs: [],
      sources: [],
      affiliate: {
        enabled: true,
        network: "impact",
        disclosureRequired: true,
        trackingUrl: "https://example.com/aff",
      },
      pricing: pipedriveLikePricing,
      metadata: { status: "published" as const, researchStatus: "none" as const },
      seo: { indexable: false },
    } as Software;

    const snap = buildPricingSnapshot({ software, enrichment: null });
    expect(snap).not.toHaveProperty("affiliate");
    const estimate = calculateProductCost(
      snap,
      { crmUsers: 2, requiredFeatureSlugs: [], billingPreference: "annual" },
      { now },
    );
    expect(estimate.monthlyEquivalent?.amountMinor).toBe(2800);
  });
});

describe("currency sort safety", () => {
  it("does not treat USD and EUR as comparable in lowest-cost sort", () => {
    const usd = snapshot({
      productSlug: "pipedrive",
      name: "Pipedrive",
      pricing: {
        currency: "USD",
        model: "subscription",
        plans: [plan("a", "A", [perSeatRule(100)])],
        sourceIds: [],
      },
      featureSupport: [],
      hasFixtureResearch: false,
      pricingCheckedAt: "2026-08-10T00:00:00.000Z",
    });
    const eur = snapshot({
      productSlug: "freshsales",
      name: "Freshsales",
      pricing: {
        currency: "EUR",
        model: "subscription",
        plans: [
          plan("b", "B", [
            {
              kind: "per-seat",
              amountPerSeat: 10,
              currency: "EUR",
              interval: "year",
              amountPeriod: "month",
            },
          ]),
        ],
        sourceIds: [],
      },
      featureSupport: [],
      hasFixtureResearch: false,
      pricingCheckedAt: "2026-08-10T00:00:00.000Z",
    });

    const comparison = compareProductCosts(
      [eur, usd],
      { crmUsers: 1, requiredFeatureSlugs: [], billingPreference: "annual" },
      { sortMode: "lowest-cost", now },
    );

    // USD group preferred first; never claim €10 < $100 as FX truth
    expect(comparison.notes.some((n) => n.toLowerCase().includes("currenc"))).toBe(
      true,
    );
    expect(comparison.results[0]?.currency).toBe("USD");
    expect(comparison.currencyGroups).toContain("USD");
    expect(comparison.currencyGroups).toContain("EUR");
  });
});

describe("insufficient data for CRM without pricing", () => {
  it("returns insufficient-data when no plans", () => {
    const bare: PricingSnapshot = {
      productSlug: "close",
      name: "Close",
      primaryCategorySlug: "crm",
      featureSupport: [],
      hasFixtureResearch: false,
      sourceIds: [],
    };
    const estimate = calculateProductCost(
      bare,
      { crmUsers: 5, requiredFeatureSlugs: [], billingPreference: "either" },
      { now },
    );
    expect(estimate.status).toBe("insufficient-data");
  });
});

describe("seat caps and free-plan team exclusion", () => {
  it("skips free plan when seats exceed maximumSeats", () => {
    const pricing: Pricing = {
      currency: "USD",
      model: "subscription",
      plans: [
        {
          ...plan("free", "Free", [perSeatRule(0)]),
          isFree: true,
          limits: { maxSeats: 3 },
          rules: [
            {
              kind: "per-seat",
              amountPerSeat: 0,
              currency: "USD",
              interval: "year",
              amountPeriod: "month",
              maximumSeats: 3,
            },
          ],
        },
        plan("plus", "Plus", [
          {
            kind: "per-seat",
            amountPerSeat: 35,
            currency: "USD",
            interval: "year",
            amountPeriod: "month",
            maximumSeats: 10,
          },
        ]),
        plan("pro", "Pro", [perSeatRule(79)]),
      ],
      sourceIds: [],
    };
    // attach limits on plus
    pricing.plans[1]!.limits = { maxSeats: 10 };
    const snap = snapshot({
      productSlug: "attio",
      name: "Attio",
      pricing,
      featureSupport: [],
    });
    const estimate = calculateProductCost(
      snap,
      {
        crmUsers: 25,
        requiredFeatureSlugs: [],
        billingPreference: "annual",
      },
      { now },
    );
    expect(estimate.recommendedPlan?.slug).toBe("pro");
    expect(estimate.monthlyEquivalent?.amountMinor).toBe(79 * 25 * 100);
    expect(estimate.warnings).toContain("excluded-plans-over-seat-cap");
  });

  it("excludes unbounded free plan for multi-seat teams", () => {
    const pricing: Pricing = {
      currency: "USD",
      model: "subscription",
      plans: [
        { ...plan("free", "Free", [perSeatRule(0)]), isFree: true },
        plan("standard", "Standard", [perSeatRule(24)]),
      ],
      sourceIds: [],
    };
    const snap = snapshot({
      productSlug: "folk",
      name: "folk",
      pricing,
      featureSupport: [],
    });
    const estimate = calculateProductCost(
      snap,
      {
        crmUsers: 25,
        requiredFeatureSlugs: [],
        billingPreference: "annual",
      },
      { now },
    );
    expect(estimate.recommendedPlan?.slug).toBe("standard");
    expect(estimate.warnings).toContain(
      "excluded-unbounded-free-plan-for-team",
    );
  });

  it("resolvePlanDisplayPrice supports flat annual billing (Shopify-style)", () => {
    const basic = plan("basic", "Basic", [
      {
        kind: "flat",
        amount: 29,
        currency: "USD",
        interval: "year",
        amountPeriod: "month",
      },
      {
        kind: "flat",
        amount: 39,
        currency: "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ]);
    const annual = resolvePlanDisplayPrice(basic, "USD", true);
    expect(annual.priceLabel).toBe("$29.00");
    expect(annual.unitLabel).toContain("billed annually");

    const monthly = resolvePlanDisplayPrice(basic, "USD", false);
    expect(monthly.priceLabel).toBe("$39.00");
    expect(monthly.unitLabel).toBe("per month");
  });

  it("resolvePlanDisplayPrice supports per-seat CRM plans", () => {
    const essential = plan("essential", "Essential", [perSeatRule(14)]);
    const priced = resolvePlanDisplayPrice(essential, "USD", true);
    expect(priced.priceLabel).toBe("$14.00");
    expect(priced.unitLabel).toContain("per user");
  });
});
