import { describe, expect, it } from "vitest";
import {
  confidenceForAssessmentOutcome,
  confidenceForFeatureBundle,
  confidenceForPricingOutcome,
  normalizeOutcomeConfidence,
} from "./comparison-confidence";

describe("comparison-confidence", () => {
  it("promotes assessment outcomes with clear delta and evidence to high", () => {
    expect(
      confidenceForAssessmentOutcome({
        scoreA: 8,
        scoreB: 5,
        supportingFactIds: ["fact-a"],
        assessmentIds: ["assess-a", "assess-b"],
        researchStatus: "complete",
      }),
    ).toBe("high");
  });

  it("keeps incomplete pricing at low", () => {
    expect(
      confidenceForPricingOutcome({
        hasVerifiedPrices: false,
        supportingFactIds: [],
        researchStatus: "in-progress",
        hasWinner: false,
      }),
    ).toBe("low");
  });

  it("promotes feature bundles with multiple diffs to high", () => {
    expect(
      confidenceForFeatureBundle({
        known: 3,
        featureCount: 3,
        diffNotes: 2,
        scoreDiff: 2,
        supportingFactIds: ["f1", "f2"],
        researchStatus: "complete",
        hasWinner: true,
      }),
    ).toBe("high");
  });

  it("normalizes low winners with facts to medium", () => {
    expect(
      normalizeOutcomeConfidence({
        winnerKind: "product-a",
        confidence: "low",
        supportingFactIds: ["fact-1"],
        researchStatus: "complete",
        reason: "HubSpot leads on reporting.",
      }),
    ).toBe("medium");
  });

  it("normalizes strong evidence to high", () => {
    expect(
      normalizeOutcomeConfidence({
        winnerKind: "product-a",
        confidence: "medium",
        supportingFactIds: ["f1", "f2", "f3"],
        assessmentIds: ["a1", "a2"],
        researchStatus: "complete",
        reason: "Clear editorial lead.",
      }),
    ).toBe("high");
  });

  it("preserves low for in-progress research", () => {
    expect(
      normalizeOutcomeConfidence({
        winnerKind: "depends",
        confidence: "low",
        researchStatus: "in-progress",
        reason: "Incomplete.",
      }),
    ).toBe("low");
  });
});
