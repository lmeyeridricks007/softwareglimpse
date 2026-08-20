import { describe, expect, it } from "vitest";
import type { FeatureSupport, ProductCostEstimate } from "@/domain";
import { summarizeFeatureCoverage } from "./feature-coverage";
import {
  buildPricingInsights,
  deriveCostRangeSummary,
} from "./cost-summary";

describe("summarizeFeatureCoverage", () => {
  const support: FeatureSupport[] = [
    {
      featureSlug: "workflow-automation",
      availability: "supported",
      planSlugs: ["growth"],
      sourceIds: ["t"],
    },
    {
      featureSlug: "reporting",
      availability: "not-supported",
      planSlugs: [],
      sourceIds: ["t"],
    },
    {
      featureSlug: "telephony",
      availability: "unknown",
      planSlugs: [],
      sourceIds: ["t"],
    },
  ];

  it("returns null when no required features", () => {
    expect(summarizeFeatureCoverage(support, [])).toBeNull();
  });

  it("counts matched / unsupported / unknown from evidence", () => {
    const summary = summarizeFeatureCoverage(support, [
      "workflow-automation",
      "reporting",
      "telephony",
      "missing",
    ]);
    expect(summary).toEqual({
      matched: 1,
      unsupported: 1,
      unknown: 2,
      total: 4,
      hasEvidence: true,
    });
  });

  it("returns null when all required features lack evidence", () => {
    expect(
      summarizeFeatureCoverage([], ["workflow-automation", "reporting"]),
    ).toBeNull();
  });
});

describe("deriveCostRangeSummary + insights", () => {
  function estimate(
    partial: Partial<ProductCostEstimate> &
      Pick<ProductCostEstimate, "productSlug" | "productName">,
  ): ProductCostEstimate {
    return {
      status: "calculated",
      components: [],
      assumptions: [],
      warnings: [],
      confidence: "medium",
      sourceIds: [],
      currency: "USD",
      monthlyEquivalent: { amountMinor: 10_000, currency: "USD" },
      ...partial,
    };
  }

  it("derives lowest / midpoint / highest without inventing prices", () => {
    const range = deriveCostRangeSummary([
      estimate({
        productSlug: "a",
        productName: "A",
        monthlyEquivalent: { amountMinor: 18_000, currency: "USD" },
      }),
      estimate({
        productSlug: "b",
        productName: "B",
        monthlyEquivalent: { amountMinor: 100_000, currency: "USD" },
      }),
      estimate({
        productSlug: "c",
        productName: "C",
        monthlyEquivalent: { amountMinor: 50_000, currency: "USD" },
      }),
    ]);
    expect(range?.lowest.productSlug).toBe("a");
    expect(range?.highest.productSlug).toBe("b");
    expect(range?.midpoint.productSlug).toBe("c");
  });

  it("builds deterministic insights from calculable rows", () => {
    const insights = buildPricingInsights([
      estimate({
        productSlug: "hubspot",
        productName: "HubSpot",
        monthlyEquivalent: { amountMinor: 18_000, currency: "USD" },
        recommendedPlan: { id: "1", slug: "starter", name: "Starter" },
      }),
      estimate({
        productSlug: "capsule",
        productName: "Capsule",
        monthlyEquivalent: { amountMinor: 21_600, currency: "USD" },
      }),
    ]);
    expect(insights[0]?.text).toContain("HubSpot is the lowest calculable");
    expect(insights.some((i) => i.text.includes("Capsule costs"))).toBe(true);
  });
});
