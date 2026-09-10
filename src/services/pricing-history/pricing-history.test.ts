import { describe, expect, it, afterAll } from "vitest";
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import {
  PriceObservationSchema,
  priceObservationFingerprint,
  priceObservationSeriesKey,
  type Pricing,
} from "@/domain";
import {
  calculatePriceChange,
  extractObservationsFromPricing,
  recordPriceObservations,
  buildProductPriceHistorySummary,
} from "@/services/pricing-history";
import {
  getPriceHistoryObservationsRoot,
  loadProductPriceHistory,
} from "@/data/research/pricing-history/store";

const TEST_PRODUCT_ID = `hist-test-ephemeral`;

afterAll(() => {
  const filePath = path.join(
    getPriceHistoryObservationsRoot(),
    `${TEST_PRODUCT_ID}.json`,
  );
  if (existsSync(filePath)) rmSync(filePath);
});

const samplePricing: Pricing = {
  currency: "USD",
  model: "subscription",
  hasFreePlan: false,
  hasFreeTrial: true,
  startingPriceMonthly: 20,
  plans: [
    {
      id: "growth",
      slug: "growth",
      name: "Growth",
      isFree: false,
      rules: [
        {
          kind: "per-seat",
          amountPerSeat: 20,
          currency: "USD",
          interval: "month",
          amountPeriod: "month",
        },
        {
          kind: "per-seat",
          amountPerSeat: 16,
          currency: "USD",
          interval: "year",
          amountPeriod: "month",
        },
      ],
    },
  ],
  sourceIds: ["example-pricing"],
  verifiedAt: "2026-09-01",
};

describe("price observation model", () => {
  it("extracts starting-price and rule observations from Pricing without inventing amounts", () => {
    const rows = extractObservationsFromPricing({
      productId: "example-crm",
      pricing: samplePricing,
      categorySlug: "crm",
      observedAt: "2026-09-01",
      verificationMethod: "manual",
      confidence: "high",
    });

    expect(rows.length).toBeGreaterThanOrEqual(2);
    const starting = rows.find((r) => r.metricKind === "starting-price");
    expect(starting?.price).toBe(20);
    expect(starting?.currency).toBe("USD");
    expect(starting?.billingPeriod).toBe("month");

    for (const row of rows) {
      expect(() => PriceObservationSchema.parse(row)).not.toThrow();
    }
  });

  it("calculates absolute and percentage change", () => {
    const previous = PriceObservationSchema.parse({
      id: "a",
      productId: "example-crm",
      planId: null,
      observedAt: "2026-01-01",
      price: 20,
      currency: "USD",
      billingPeriod: "month",
      billingBasis: "per-user",
      perUser: true,
      source: "test",
      sourceIds: [],
      verificationMethod: "manual",
      confidence: "high",
      metricKind: "starting-price",
    });
    const current = PriceObservationSchema.parse({
      ...previous,
      id: "b",
      observedAt: "2026-06-01",
      price: 25,
    });

    const change = calculatePriceChange(previous, current);
    expect(change.absoluteChange).toBe(5);
    expect(change.percentageChange).toBe(25);
    expect(change.previousPrice).toBe(20);
    expect(change.newPrice).toBe(25);
    expect(change.changeDate).toBe("2026-06-01");
  });

  it("skips duplicate snapshots when material fields are unchanged", () => {
    const productId = TEST_PRODUCT_ID;
    // Reset any leftover file from a previous interrupted run
    const filePath = path.join(
      getPriceHistoryObservationsRoot(),
      `${productId}.json`,
    );
    if (existsSync(filePath)) rmSync(filePath);
    const candidates = extractObservationsFromPricing({
      productId,
      pricing: samplePricing,
      categorySlug: "crm",
      observedAt: "2026-09-01",
      verificationMethod: "manual",
      confidence: "high",
    });

    const first = recordPriceObservations(candidates);
    expect(first.appended.length).toBeGreaterThan(0);

    const second = recordPriceObservations(
      extractObservationsFromPricing({
        productId,
        pricing: samplePricing,
        categorySlug: "crm",
        observedAt: "2026-09-15",
        verificationMethod: "manual",
        confidence: "high",
      }),
    );
    expect(second.appended.length).toBe(0);
    expect(second.skippedUnchanged.length).toBeGreaterThan(0);

    const raised = {
      ...samplePricing,
      startingPriceMonthly: 30,
      plans: samplePricing.plans.map((p) => ({
        ...p,
        rules: p.rules.map((r) =>
          r.kind === "per-seat" && r.interval === "month"
            ? { ...r, amountPerSeat: 30 }
            : r,
        ),
      })),
    };

    const third = recordPriceObservations(
      extractObservationsFromPricing({
        productId,
        pricing: raised,
        categorySlug: "crm",
        observedAt: "2026-09-20",
        verificationMethod: "manual",
        confidence: "high",
      }),
    );
    expect(third.appended.length).toBeGreaterThan(0);

    const summary = buildProductPriceHistorySummary(productId);
    expect(summary.hasMeaningfulHistory).toBe(true);

    // Cleanup test artifact observations so migration store stays clean-ish
    const file = loadProductPriceHistory(productId);
    expect(file.observations.length).toBeGreaterThan(1);

    // Fingerprint helpers stay stable
    const a = candidates[0]!;
    expect(priceObservationSeriesKey(a)).toContain(productId);
    expect(priceObservationFingerprint(a).length).toBeGreaterThan(5);
  });
});
