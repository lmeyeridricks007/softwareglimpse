import type { RecommendationConfidence } from "@/domain";
import type { PricingSnapshot } from "./types";
import { isPricingStale } from "./eligibility";

export type ConfidenceFactors = {
  hasFixtureResearch: boolean;
  matrixIncomplete: boolean;
  stale: boolean;
  hasAssumptions: boolean;
  unknownFeatures: boolean;
  base?: RecommendationConfidence;
};

/**
 * Derive confidence. Fixture research and incomplete feature-plan matrix
 * always cap at medium. Stale pricing and heavy assumptions lower further.
 */
export function derivePricingConfidence(
  factors: ConfidenceFactors,
): RecommendationConfidence {
  let level: RecommendationConfidence = factors.base ?? "high";

  if (factors.hasFixtureResearch && level === "high") {
    level = "medium";
  }
  if (factors.matrixIncomplete && level === "high") {
    level = "medium";
  }
  if (factors.stale) {
    level = level === "high" ? "medium" : "low";
  }
  if (factors.unknownFeatures) {
    level = "low";
  }
  if (factors.hasAssumptions && level === "high") {
    level = "medium";
  }

  return level;
}

export function confidenceFromSnapshot(
  snapshot: PricingSnapshot,
  opts: {
    now?: Date;
    matrixIncomplete?: boolean;
    unknownFeatures?: boolean;
    hasAssumptions?: boolean;
  } = {},
): RecommendationConfidence {
  return derivePricingConfidence({
    hasFixtureResearch: snapshot.hasFixtureResearch,
    matrixIncomplete: opts.matrixIncomplete ?? false,
    stale: isPricingStale(snapshot, opts.now ?? new Date()),
    hasAssumptions: opts.hasAssumptions ?? false,
    unknownFeatures: opts.unknownFeatures ?? false,
  });
}
