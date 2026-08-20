import { describe, expect, it } from "vitest";
import {
  isThinComparisonMesh,
  researchedAvailabilityTieReason,
} from "./distinctive-research";

describe("researchedAvailabilityTieReason", () => {
  it("names both products and actual availability instead of comparable-support boilerplate", () => {
    const reason = researchedAvailabilityTieReason("Harbor", "Pulse", [
      { feature: "email-sync", availabilityA: "supported", availabilityB: "supported" },
      { feature: "calling", availabilityA: "limited", availabilityB: "limited" },
    ]);
    expect(reason).toMatch(/Harbor/);
    expect(reason).toMatch(/Pulse/);
    expect(reason).toMatch(/supported/);
    expect(reason).not.toMatch(/comparable support/i);
  });
});

describe("isThinComparisonMesh", () => {
  it("treats sparse unresearched rows as thin mesh", () => {
    expect(
      isThinComparisonMesh({
        outcomes: [
          { winnerKind: "tie", confidence: "medium" },
          { winnerKind: "product-a", confidence: "medium" },
          { winnerKind: "depends", confidence: "medium" },
        ],
      }),
    ).toBe(true);
  });

  it("keeps pairs with two researched winners unless most outcomes are low confidence", () => {
    expect(
      isThinComparisonMesh({
        outcomes: [
          { winnerKind: "product-a", confidence: "medium" },
          { winnerKind: "product-b", confidence: "medium" },
          { winnerKind: "tie", confidence: "medium" },
        ],
      }),
    ).toBe(false);
    expect(
      isThinComparisonMesh({
        outcomes: [
          { winnerKind: "product-a", confidence: "low" },
          { winnerKind: "product-b", confidence: "low" },
          { winnerKind: "tie", confidence: "low" },
        ],
      }),
    ).toBe(true);
  });

  it("indexes assessment-backed close peers even when scores tie across the board", () => {
    const assessmentIds = ["assessment-a", "assessment-b"];
    expect(
      isThinComparisonMesh({
        outcomes: Array.from({ length: 6 }, (_, i) => ({
          winnerKind: "tie" as const,
          confidence: "medium" as const,
          researchStatus: "complete" as const,
          reason: `Close on criterion ${i}`,
          assessmentIds,
        })),
      }),
    ).toBe(false);
  });
});
