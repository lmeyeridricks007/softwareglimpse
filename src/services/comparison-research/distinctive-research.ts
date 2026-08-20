/**
 * Comparison mesh honesty: describe researched availability without inventing
 * winners, and do not index pairs that lack a researched difference.
 *
 * Researched close peers (assessment-backed ties + at least one distinctive win)
 * are not thin — that is an honest “these products score nearly equal” conclusion.
 */

export function researchedAvailabilityTieReason(
  labelA: string,
  labelB: string,
  rows: Array<{
    feature: string;
    availabilityA?: string | null;
    availabilityB?: string | null;
  }>,
): string {
  const bits = rows
    .filter((row) => row.availabilityA || row.availabilityB)
    .slice(0, 4)
    .map((row) => {
      const feature = row.feature.replace(/-/g, " ");
      const a = row.availabilityA ?? "unknown";
      const b = row.availabilityB ?? "unknown";
      return `${feature} (${labelA}: ${a}; ${labelB}: ${b})`;
    });
  if (bits.length === 0) {
    return `Structured feature evidence for ${labelA} and ${labelB} does not yet differentiate this criterion — choose by the buyer’s job.`;
  }
  return `${labelA} and ${labelB} have the same researched availability on ${bits.join("; ")}.`;
}

export function isThinComparisonMesh(input: {
  outcomes?: Array<{
    winnerKind?: string | null;
    reason?: string | null;
    confidence?: string | null;
    researchStatus?: string | null;
    assessmentIds?: string[] | null;
  }>;
}): boolean {
  const outcomes = input.outcomes ?? [];
  if (outcomes.length === 0) return true;
  const wins = outcomes.filter(
    (outcome) =>
      outcome.winnerKind === "product-a" || outcome.winnerKind === "product-b",
  ).length;
  const low = outcomes.filter((outcome) => outcome.confidence === "low").length;
  if (low / outcomes.length >= 0.5) return true;
  if (wins >= 2) return false;

  const completeResearched = outcomes.filter(
    (outcome) =>
      Boolean(outcome.reason?.trim()) &&
      outcome.confidence !== "low" &&
      outcome.researchStatus !== "in-progress" &&
      outcome.researchStatus !== "none",
  );
  const assessmentBacked = outcomes.filter(
    (outcome) => (outcome.assessmentIds?.length ?? 0) > 0,
  ).length;

  // Honest close peers: distinctive research exists; scores are nearly equal.
  if (
    completeResearched.length >= Math.min(6, outcomes.length) &&
    assessmentBacked >= 3 &&
    (wins >= 1 || assessmentBacked >= Math.ceil(outcomes.length * 0.5))
  ) {
    return false;
  }

  return wins < 2;
}
