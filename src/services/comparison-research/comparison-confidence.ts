export type ComparisonConfidence = "low" | "medium" | "high";

/** Assessment-backed criterion outcome from approved editorial scores. */
export function confidenceForAssessmentOutcome(input: {
  scoreA: number;
  scoreB: number;
  supportingFactIds?: string[];
  assessmentIds?: string[];
  researchStatus?: string | null;
}): ComparisonConfidence {
  if (input.researchStatus === "in-progress" || input.researchStatus === "none") {
    return "low";
  }
  const factCount = input.supportingFactIds?.length ?? 0;
  const assessmentCount = input.assessmentIds?.length ?? 0;
  const delta = Math.abs(input.scoreA - input.scoreB);
  if (assessmentCount >= 2 && delta >= 2 && factCount >= 1) return "high";
  if (delta >= 1.5 || factCount >= 1 || assessmentCount >= 2) return "medium";
  return "medium";
}

/** Researched feature-availability bundle (enrichment featureSupport). */
export function confidenceForFeatureBundle(input: {
  known: number;
  featureCount: number;
  diffNotes: number;
  scoreDiff: number;
  supportingFactIds?: string[];
  researchStatus?: string | null;
  hasWinner: boolean;
}): ComparisonConfidence {
  if (input.researchStatus === "in-progress" || input.researchStatus === "none") {
    return "low";
  }
  const factCount = input.supportingFactIds?.length ?? 0;
  if (!input.hasWinner) {
    if (input.known === 0) return "low";
    return input.known >= input.featureCount ? "medium" : "medium";
  }
  if (input.diffNotes >= 2 || input.scoreDiff >= 4) return "high";
  if (input.known >= 1 && factCount >= 1) return "medium";
  if (input.known >= 1) return "medium";
  return "medium";
}

/** Verified pricing / factual cells with explicit winner. */
export function confidenceForPricingOutcome(input: {
  hasVerifiedPrices: boolean;
  supportingFactIds?: string[];
  researchStatus?: string | null;
  hasWinner: boolean;
}): ComparisonConfidence {
  if (input.researchStatus === "in-progress" || input.researchStatus === "none") {
    return "low";
  }
  if (!input.hasVerifiedPrices) return "low";
  const factCount = input.supportingFactIds?.length ?? 0;
  if (input.hasWinner && factCount >= 2) return "high";
  if (input.hasWinner || factCount >= 1) return "medium";
  return "medium";
}

/** Safety net after supporting facts are attached. */
export function normalizeOutcomeConfidence(outcome: {
  winnerKind?: string | null;
  confidence?: string | null;
  supportingFactIds?: string[] | null;
  assessmentIds?: string[] | null;
  researchStatus?: string | null;
  reason?: string | null;
}): ComparisonConfidence {
  if (outcome.researchStatus === "in-progress" || outcome.researchStatus === "none") {
    return "low";
  }
  if (!outcome.reason?.trim()) return "low";
  if (outcome.confidence === "high") return "high";

  const facts = outcome.supportingFactIds?.length ?? 0;
  const assessments = outcome.assessmentIds?.length ?? 0;
  const hasWinner =
    outcome.winnerKind === "product-a" || outcome.winnerKind === "product-b";

  if (facts >= 3 && assessments >= 2 && hasWinner) return "high";
  if (facts >= 1 || assessments >= 2 || hasWinner) return "medium";
  if (outcome.winnerKind === "tie" && (facts >= 1 || assessments >= 2)) {
    return "medium";
  }
  return outcome.confidence === "low" ? "low" : "medium";
}
