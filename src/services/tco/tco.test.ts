import { describe, expect, it } from "vitest";
import type { Pricing, PricingPlan } from "@/domain";
import type { PricingSnapshot } from "@/services/pricing";
import {
  buildSeatPlan,
  computeTco,
  createDefaultScenario,
  duplicateScenario,
  createEmptyTcoSession,
  majorToMinor,
} from "@/services/tco";

function perSeatRule(amountPerSeat: number): Pricing["plans"][number]["rules"][number] {
  return {
    kind: "per-seat",
    amountPerSeat,
    currency: "EUR",
    interval: "year",
    amountPeriod: "month",
  };
}

function plan(slug: string, name: string, amount: number): PricingPlan {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    rules: [perSeatRule(amount)],
  };
}

function snap(
  slug: string,
  name: string,
  monthlyPerSeat: number,
): PricingSnapshot {
  return {
    productSlug: slug,
    name,
    primaryCategorySlug: "crm",
    featureSupport: [],
    hasFixtureResearch: true,
    sourceIds: [`${slug}-pricing`],
    pricingCheckedAt: "2026-08-01T00:00:00.000Z",
    pricing: {
      currency: "EUR",
      model: "subscription",
      hasFreeTrial: false,
      hasFreePlan: false,
      startingPriceMonthly: monthlyPerSeat,
      plans: [plan("pro", "Professional", monthlyPerSeat)],
      sourceIds: [`${slug}-pricing`],
      verifiedAt: "2026-08-01T00:00:00.000Z",
    },
  };
}

const snapshots = [
  snap("pipedrive", "Pipedrive", 49),
  snap("hubspot", "HubSpot", 90),
];

describe("buildSeatPlan", () => {
  it("keeps seats flat when growth is not assumed", () => {
    const scenario = createDefaultScenario({
      startingUsers: 25,
      horizonYears: 3,
      growthMode: "flat",
    });
    expect(buildSeatPlan(scenario)).toEqual([
      { year: 1, users: 25 },
      { year: 2, users: 25 },
      { year: 3, users: 25 },
    ]);
  });

  it("applies percent growth", () => {
    const scenario = createDefaultScenario({
      startingUsers: 25,
      horizonYears: 3,
      growthMode: "percent",
      annualGrowthPercent: 10,
    });
    expect(buildSeatPlan(scenario).map((s) => s.users)).toEqual([25, 28, 31]);
  });
});

describe("computeTco", () => {
  it("case 1: software-only known TCO over 3 years", () => {
    const scenario = createDefaultScenario({
      productIds: ["pipedrive"],
      startingUsers: 25,
      horizonYears: 3,
      billingPreference: "annual",
      migration: { needed: "none" },
    });
    const result = computeTco({ scenario, snapshots });
    const product = result.products[0]!;
    expect(product.status).toBe("calculated");
    // 49 EUR/user/mo * 25 * 12 * 3 = 44100 EUR
    expect(product.knownTcoMinor).toBe(majorToMinor(49 * 25 * 12 * 3));
    expect(product.unknownItems.length).toBe(0);
    expect(product.shares.software).toBeCloseTo(1);
  });

  it("includes implementation and migration user estimates", () => {
    const scenario = createDefaultScenario({
      productIds: ["pipedrive", "hubspot"],
      startingUsers: 25,
      horizonYears: 3,
      billingPreference: "annual",
      implementation: {
        approach: "partner",
        externalCostMinor: majorToMinor(10_000),
      },
      migration: {
        needed: "moderate",
        externalCostMinor: majorToMinor(4_500),
      },
    });
    const result = computeTco({ scenario, snapshots });
    expect(result.products).toHaveLength(2);
    const pipe = result.products.find((p) => p.productId === "pipedrive")!;
    const software = majorToMinor(49 * 25 * 12 * 3);
    expect(pipe.knownTcoMinor).toBe(software + majorToMinor(10_000 + 4_500));
    expect(result.comparison[0]?.deltaVsLowestMinor).toBe(0);
  });

  it("case 5: unknown implementation is not treated as €0", () => {
    const scenario = createDefaultScenario({
      productIds: ["pipedrive"],
      startingUsers: 25,
      horizonYears: 3,
      billingPreference: "annual",
      migration: { needed: "none" },
      implementation: {
        approach: "unsure",
        externalCostMinor: null,
      },
    });
    const result = computeTco({ scenario, snapshots });
    const product = result.products[0]!;
    expect(product.unknownItems.some((u) => u.category === "implementation")).toBe(
      true,
    );
    expect(product.knownTcoMinor).toBe(majorToMinor(49 * 25 * 12 * 3));
  });

  it("case 7: custom recurring cost is included", () => {
    const scenario = createDefaultScenario({
      productIds: ["pipedrive"],
      startingUsers: 10,
      horizonYears: 2,
      billingPreference: "annual",
      migration: { needed: "none" },
      customCosts: [
        {
          id: "enrich",
          name: "Data enrichment",
          frequency: "monthly",
          amountMinor: majorToMinor(100),
          startYear: 1,
          endYear: 2,
        },
      ],
    });
    const result = computeTco({ scenario, snapshots });
    const product = result.products[0]!;
    const software = majorToMinor(49 * 10 * 12 * 2);
    const custom = majorToMinor(100 * 12 * 2);
    expect(product.knownTcoMinor).toBe(software + custom);
  });

  it("case 8: duplicate scenario preserves assumptions", () => {
    let session = createEmptyTcoSession();
    session = {
      ...session,
      scenarios: [
        createDefaultScenario({
          id: session.activeScenarioId,
          name: "Base",
          startingUsers: 25,
          administration: {
            hoursPerWeek: 8,
            hourlyCostMinor: majorToMinor(50),
          },
        }),
      ],
    };
    const duped = duplicateScenario(session, "Lean");
    expect(duped.scenarios).toHaveLength(2);
    expect(duped.scenarios[1]?.name).toBe("Lean");
    expect(duped.scenarios[1]?.administration.hoursPerWeek).toBe(8);
  });

  it("warns when currencies differ", () => {
    const usdSnap: PricingSnapshot = {
      ...snap("salesforce", "Salesforce", 165),
      pricing: {
        ...snap("salesforce", "Salesforce", 165).pricing!,
        currency: "USD",
        plans: [
          {
            id: "plan-ent",
            slug: "enterprise",
            name: "Enterprise",
            isFree: false,
            rules: [
              {
                kind: "per-seat",
                amountPerSeat: 165,
                currency: "USD",
                interval: "year",
                amountPeriod: "month",
              },
            ],
          },
        ],
      },
    };
    const scenario = createDefaultScenario({
      productIds: ["pipedrive", "salesforce"],
      migration: { needed: "none" },
    });
    const result = computeTco({
      scenario,
      snapshots: [snapshots[0]!, usdSnap],
    });
    expect(result.currencyWarning).toBeTruthy();
  });

  it("still prices subscription when profile must-haves have unknown coverage", () => {
    const scenario = createDefaultScenario({
      productIds: ["pipedrive"],
      startingUsers: 25,
      horizonYears: 3,
      billingPreference: "annual",
      migration: { needed: "none" },
    });
    const result = computeTco({
      scenario,
      snapshots,
      requiredFeatureSlugs: ["nonexistent-capability-xyz"],
    });
    const product = result.products[0]!;
    const software = product.categoryTotals.find(
      (c) => c.category === "software",
    );
    expect(software?.amountMinor).toBeGreaterThan(0);
    expect(product.unknownItems.some((u) => u.category === "software")).toBe(
      false,
    );
    expect(product.qualifyingPlanSlug).toBe("pro");
  });

  it("uses an explicit plan selection instead of auto-resolving", () => {
    const multiPlan: PricingSnapshot = {
      ...snap("acme", "Acme CRM", 20),
      pricing: {
        currency: "EUR",
        model: "subscription",
        hasFreeTrial: false,
        hasFreePlan: true,
        startingPriceMonthly: 0,
        plans: [
          {
            id: "plan-free",
            slug: "free",
            name: "Free",
            isFree: true,
            rules: [
              {
                kind: "per-seat",
                amountPerSeat: 0,
                currency: "EUR",
                interval: "month",
                amountPeriod: "month",
              },
            ],
          },
          plan("starter", "Starter", 20),
          plan("enterprise", "Enterprise", 80),
        ],
        sourceIds: ["acme-pricing"],
        verifiedAt: "2026-08-01T00:00:00.000Z",
      },
    };
    const auto = computeTco({
      scenario: createDefaultScenario({
        productIds: ["acme"],
        startingUsers: 10,
        horizonYears: 1,
        migration: { needed: "none" },
      }),
      snapshots: [multiPlan],
    });
    expect(auto.products[0]?.qualifyingPlanSlug).toBe("starter");

    const selected = computeTco({
      scenario: createDefaultScenario({
        productIds: ["acme"],
        startingUsers: 10,
        horizonYears: 1,
        migration: { needed: "none" },
        planSelections: { acme: "enterprise" },
      }),
      snapshots: [multiPlan],
    });
    expect(selected.products[0]?.qualifyingPlanSlug).toBe("enterprise");
    const autoSoft =
      auto.products[0]?.categoryTotals.find((c) => c.category === "software")
        ?.amountMinor ?? 0;
    const selectedSoft =
      selected.products[0]?.categoryTotals.find(
        (c) => c.category === "software",
      )?.amountMinor ?? 0;
    expect(selectedSoft).toBeGreaterThan(autoSoft);
  });
});
