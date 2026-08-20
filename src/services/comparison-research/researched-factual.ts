import { loadEnrichment } from "@/data/research/store";
import { confidenceForFeatureBundle } from "./comparison-confidence";
import { researchedAvailabilityTieReason } from "./distinctive-research";

type WinnerKind = "product-a" | "product-b" | "tie" | "depends";

export type ResearchedFactualOutcome = {
  criterionSlug: string;
  winnerKind: WinnerKind;
  winnerSlug: string | null;
  reason: string;
  confidence: "low" | "medium" | "high";
  supportingFactIds: string[];
  researchStatus: "complete" | "in-progress";
};

function enrichmentPricing(slug: string): {
  hasFreePlan: boolean | null;
} {
  const pricing = loadEnrichment(slug)?.pricing;
  if (!pricing || typeof pricing !== "object") {
    return { hasFreePlan: null };
  }
  const value = (pricing as { hasFreePlan?: unknown }).hasFreePlan;
  return { hasFreePlan: typeof value === "boolean" ? value : null };
}

function availabilityOf(slug: string, featureSlug: string): string | undefined {
  return loadEnrichment(slug)?.featureSupport?.find(
    (row) => row.featureSlug === featureSlug,
  )?.availability;
}

function availabilityScore(value: string | undefined): number | null {
  if (!value || value === "unknown") return null;
  if (value === "supported") return 3;
  if (value === "limited" || value === "add-on" || value === "higher-plan-only") {
    return 2;
  }
  if (value === "not-supported") return 0;
  return 1;
}

/**
 * Declare a free-plan winner only when both products have a verified boolean.
 * Does not treat a cheaper starting price as a value win.
 */
export function researchedFreePlanOutcome(
  slugA: string,
  slugB: string,
  labelA: string,
  labelB: string,
  fallbackReason: string,
): ResearchedFactualOutcome {
  const freeA = enrichmentPricing(slugA).hasFreePlan;
  const freeB = enrichmentPricing(slugB).hasFreePlan;
  if (freeA === true && freeB === false) {
    return {
      criterionSlug: "free-plan",
      winnerKind: "product-a",
      winnerSlug: slugA,
      reason: `${labelA} researches a free plan; ${labelB} does not in current verified pricing.`,
      confidence: "medium",
      supportingFactIds: [],
      researchStatus: "complete",
    };
  }
  if (freeB === true && freeA === false) {
    return {
      criterionSlug: "free-plan",
      winnerKind: "product-b",
      winnerSlug: slugB,
      reason: `${labelB} researches a free plan; ${labelA} does not in current verified pricing.`,
      confidence: "medium",
      supportingFactIds: [],
      researchStatus: "complete",
    };
  }
  if (freeA === true && freeB === true) {
    return {
      criterionSlug: "free-plan",
      winnerKind: "tie",
      winnerSlug: null,
      reason: `${labelA} and ${labelB} both research a free plan. Confirm what each path unlocks on the live vendor pricing page.`,
      confidence: "medium",
      supportingFactIds: [],
      researchStatus: "complete",
    };
  }
  return {
    criterionSlug: "free-plan",
    winnerKind: "depends",
    winnerSlug: null,
    reason: fallbackReason,
    confidence: "medium",
    supportingFactIds: [],
    researchStatus: "complete",
  };
}

/**
 * Compare researched feature availability. Returns a winner only when scores differ.
 * Incomplete evidence stays as the caller’s fallback (typically depends).
 */
export function researchedFeatureOutcome(
  slugA: string,
  slugB: string,
  labelA: string,
  labelB: string,
  criterionSlug: string,
  features: string[],
  fallbackReason: string,
): ResearchedFactualOutcome {
  let scoreA = 0;
  let scoreB = 0;
  let known = 0;
  const notes: string[] = [];
  const supportingFactIds: string[] = [];
  const rows = features.map((feature) => ({
    feature,
    availabilityA: availabilityOf(slugA, feature),
    availabilityB: availabilityOf(slugB, feature),
  }));

  for (const row of rows) {
    const sa = availabilityScore(row.availabilityA);
    const sb = availabilityScore(row.availabilityB);
    if (sa == null && sb == null) continue;
    known += 1;
    if (sa != null) {
      scoreA += sa;
      supportingFactIds.push(`fact-${slugA}-${row.feature}`);
    }
    if (sb != null) {
      scoreB += sb;
      supportingFactIds.push(`fact-${slugB}-${row.feature}`);
    }
    if (sa != null && sb != null && sa !== sb) {
      const stronger = sa > sb ? labelA : labelB;
      notes.push(
        `${row.feature.replace(/-/g, " ")}: ${stronger} shows stronger researched availability (${row.availabilityA ?? "unknown"} vs ${row.availabilityB ?? "unknown"}).`,
      );
    }
  }

  if (known === 0) {
    return {
      criterionSlug,
      winnerKind: "depends",
      winnerSlug: null,
      reason: fallbackReason,
      confidence: "medium",
      supportingFactIds: [],
      researchStatus: "complete",
    };
  }

  if (scoreA === scoreB) {
    return {
      criterionSlug,
      winnerKind: "tie",
      winnerSlug: null,
      reason:
        notes[0] ??
        researchedAvailabilityTieReason(labelA, labelB, rows) ??
        fallbackReason,
      confidence: confidenceForFeatureBundle({
        known,
        featureCount: features.length,
        diffNotes: notes.length,
        scoreDiff: 0,
        supportingFactIds,
        researchStatus: "complete",
        hasWinner: false,
      }),
      supportingFactIds,
      researchStatus: "complete",
    };
  }

  const aWins = scoreA > scoreB;
  return {
    criterionSlug,
    winnerKind: aWins ? "product-a" : "product-b",
    winnerSlug: aWins ? slugA : slugB,
    reason:
      notes[0] ??
      `${aWins ? labelA : labelB} has stronger researched coverage across ${features.join(", ").replace(/-/g, " ")}.`,
    confidence: confidenceForFeatureBundle({
      known,
      featureCount: features.length,
      diffNotes: notes.length,
      scoreDiff: Math.abs(scoreA - scoreB),
      supportingFactIds,
      researchStatus: "complete",
      hasWinner: true,
    }),
    supportingFactIds,
    researchStatus: "complete",
  };
}
