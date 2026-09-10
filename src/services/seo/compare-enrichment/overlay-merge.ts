/**
 * Pure overlay merge — safe for any bundle (no node:fs).
 */
import type { Comparison } from "@/domain/schemas";
import type {
  CapabilityCompareRow,
  ComparisonThesis,
  EvidencePairSummary,
  PricingDiffSummary,
  UniqueDecisionElement,
} from "./types";

export type CompareEnrichmentOverlay = {
  slug: string;
  updatedAt: string;
  uniqueValueAdded: UniqueDecisionElement[];
  thesis: ComparisonThesis | null;
  capabilityRows: CapabilityCompareRow[];
  pricing: PricingDiffSummary | null;
  evidence: EvidencePairSummary | null;
  patch: Partial<
    Pick<
      Comparison,
      | "summary"
      | "verdict"
      | "pricingNotes"
      | "bestFor"
      | "scenarioRecommendations"
      | "relatedAlternativeSlugs"
      | "outcomes"
      | "overallWinnerKind"
    >
  >;
  notes: string[];
};

export function mergeComparisonWithOverlay(
  comparison: Comparison,
  overlay: CompareEnrichmentOverlay | null,
): Comparison {
  if (!overlay || overlay.slug !== comparison.slug) return comparison;
  const patch = overlay.patch;

  const mergedOutcomes =
    patch.outcomes && patch.outcomes.length > 0
      ? (() => {
          // Overlay owns the merged mesh (factory wins rewritten + pair diffs).
          // Do not fall back to untouched factory reasons — that reintroduces
          // REPEATED_PROS_CONS across siblings.
          return patch.outcomes;
        })()
      : comparison.outcomes;

  return {
    ...comparison,
    summary: patch.summary ?? comparison.summary,
    verdict: patch.verdict ?? comparison.verdict,
    pricingNotes: patch.pricingNotes ?? comparison.pricingNotes,
    bestFor:
      patch.bestFor && patch.bestFor.length > 0
        ? patch.bestFor
        : comparison.bestFor,
    scenarioRecommendations:
      patch.scenarioRecommendations && patch.scenarioRecommendations.length > 0
        ? patch.scenarioRecommendations
        : comparison.scenarioRecommendations,
    relatedAlternativeSlugs:
      patch.relatedAlternativeSlugs && patch.relatedAlternativeSlugs.length > 0
        ? patch.relatedAlternativeSlugs
        : comparison.relatedAlternativeSlugs,
    outcomes: mergedOutcomes,
    overallWinnerKind: patch.overallWinnerKind ?? comparison.overallWinnerKind,
  };
}
