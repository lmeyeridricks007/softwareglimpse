import { describe, expect, it } from "vitest";
import {
  SI_CREDIT_TCO_DEFAULTS,
  computeSiCreditTco,
} from "./compute";

describe("computeSiCreditTco", () => {
  it("keeps null unit prices unknown and excludes them from known TCO", () => {
    const result = computeSiCreditTco(SI_CREDIT_TCO_DEFAULTS);
    expect(result.knownMonthlyMinor).toBe(0);
    expect(result.knownAnnualMinor).toBe(0);
    expect(result.unknownLineIds).toEqual(
      expect.arrayContaining(["seats", "credits"]),
    );
    expect(result.allLinesKnown).toBe(false);
  });

  it("sums seats, credits, overage, and mobile into monthly and annual TCO", () => {
    const result = computeSiCreditTco({
      seats: 5,
      seatPricePerMonth: 49,
      creditsPerMonth: 2_000,
      creditUnitPrice: 0.1,
      overageCredits: 100,
      overageUnitPrice: 0.2,
      mobileCredits: 50,
      mobileUnitPrice: 0.5,
      annualDiscountPercent: 0,
    });

    // 5*49 = 245; 2000*0.10 = 200; 100*0.20 = 20; 50*0.50 = 25 → 490
    expect(result.knownMonthlyMinor).toBe(49_000);
    expect(result.knownAnnualMinor).toBe(49_000 * 12);
    expect(result.allLinesKnown).toBe(true);
    expect(result.unknownLineIds).toEqual([]);
  });

  it("treats zero-volume unknown-price lines as known $0", () => {
    const result = computeSiCreditTco({
      seats: 3,
      seatPricePerMonth: 99,
      creditsPerMonth: 1_000,
      creditUnitPrice: 0.05,
      overageCredits: 0,
      overageUnitPrice: null,
      mobileCredits: 0,
      mobileUnitPrice: null,
      annualDiscountPercent: 0,
    });
    expect(result.unknownLineIds).toEqual([]);
    expect(result.allLinesKnown).toBe(true);
    // 3*99 + 1000*0.05 = 297 + 50 = 347
    expect(result.knownMonthlyMinor).toBe(34_700);
  });

  it("applies annual discount only to the annual figure", () => {
    const result = computeSiCreditTco({
      seats: 1,
      seatPricePerMonth: 100,
      creditsPerMonth: 0,
      creditUnitPrice: null,
      overageCredits: 0,
      overageUnitPrice: null,
      mobileCredits: 0,
      mobileUnitPrice: null,
      annualDiscountPercent: 20,
    });
    expect(result.knownMonthlyMinor).toBe(10_000);
    expect(result.knownAnnualMinor).toBe(96_000); // 1200 * 0.8 * 100
  });

  it("marks overage unknown when volume > 0 without a unit price", () => {
    const result = computeSiCreditTco({
      seats: 1,
      seatPricePerMonth: 10,
      creditsPerMonth: 0,
      creditUnitPrice: null,
      overageCredits: 25,
      overageUnitPrice: null,
      mobileCredits: 0,
      mobileUnitPrice: null,
      annualDiscountPercent: 0,
    });
    expect(result.unknownLineIds).toContain("overage");
    expect(result.knownMonthlyMinor).toBe(1_000);
  });
});
