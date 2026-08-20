import { describe, expect, it } from "vitest";
import {
  researchedFeatureOutcome,
  researchedFreePlanOutcome,
} from "./researched-factual";

describe("researchedFreePlanOutcome", () => {
  it("declares Railway over Heroku from verified hasFreePlan booleans", () => {
    const outcome = researchedFreePlanOutcome(
      "heroku",
      "railway",
      "Heroku",
      "Railway",
      "Compare published free tiers.",
    );
    expect(outcome.winnerKind).toBe("product-b");
    expect(outcome.winnerSlug).toBe("railway");
    expect(outcome.confidence).toBe("medium");
    expect(outcome.reason).toMatch(/Railway researches a free plan/);
  });
});

describe("researchedFeatureOutcome", () => {
  it("keeps a depends fallback when neither side has the feature researched", () => {
    const outcome = researchedFeatureOutcome(
      "heroku",
      "railway",
      "Heroku",
      "Railway",
      "power-dialer",
      ["not-a-real-feature-slug"],
      "Fallback copy.",
    );
    expect(outcome.winnerKind).toBe("depends");
    expect(outcome.reason).toBe("Fallback copy.");
  });
});
