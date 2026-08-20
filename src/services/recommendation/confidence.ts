import type { RecommendationConfidence } from "@/domain";
import type { ProductRecommendationSnapshot, ScoredCandidate } from "./types";

export type ConfidenceInput = {
  scored: ScoredCandidate;
  requiredFeatureUnknownRatio: number;
};

/**
 * Derive high/medium/low confidence from known-dimension coverage,
 * research completeness, fixture flag, and required-feature unknowns.
 * Fixture research caps confidence at medium.
 */
export function deriveConfidence(input: ConfidenceInput): RecommendationConfidence {
  const { scored, requiredFeatureUnknownRatio } = input;
  const { knownWeight, totalApplicableWeight, snapshot } = scored;

  const knownRatio =
    totalApplicableWeight > 0 ? knownWeight / totalApplicableWeight : 0;

  let level: RecommendationConfidence = "low";
  if (knownRatio >= 0.7 && snapshot.researchCompleteness >= 0.5) {
    level = "high";
  } else if (knownRatio >= 0.4 || snapshot.researchCompleteness >= 0.35) {
    level = "medium";
  }

  if (requiredFeatureUnknownRatio >= 0.5 && level === "high") {
    level = "medium";
  }
  if (requiredFeatureUnknownRatio >= 0.75) {
    level = "low";
  }

  if (snapshot.hasFixtureResearch && level === "high") {
    level = "medium";
  }

  return level;
}

export function requiredFeatureUnknownRatio(
  snapshot: ProductRecommendationSnapshot,
  requiredFeatureSlugs: string[],
): number {
  if (requiredFeatureSlugs.length === 0) return 0;
  let unknown = 0;
  for (const slug of requiredFeatureSlugs) {
    const support = snapshot.featureSupport.find((f) => f.slug === slug);
    if (!support || support.availability === "unknown") unknown += 1;
  }
  return unknown / requiredFeatureSlugs.length;
}
