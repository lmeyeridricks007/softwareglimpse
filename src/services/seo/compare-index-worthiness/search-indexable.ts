import type { Comparison } from "@/domain/schemas";
import { comparisonPassesIndexGates } from "@/services/content-quality/gate/index-gates";
import {
  UNIQUE_RATIO_MIN,
  BOILERPLATE_SHARE_MAX,
} from "@/services/content-quality/gate/thresholds";
import { isLifecyclePromotedIndexable } from "@/services/seo/content-lifecycle/store";
import { isThinComparisonMesh } from "@/services/comparison-research/distinctive-research";
import {
  hasIndexableRelationship,
  resolveComparisonRelationship,
  type SoftLookup,
} from "./relationship";
import { estimateUniqueContentRatio } from "./uniqueness";

/**
 * Runtime search-index gate used by `isEntityIndexable`.
 * Shares thresholds with Content Quality Gate / promotion — not a parallel bar.
 */
export function isComparisonSearchIndexWorthy(
  comparison: Comparison,
  soft: SoftLookup,
): boolean {
  if (isLifecyclePromotedIndexable("comparison", comparison.slug)) {
    return comparisonPassesIndexGates(comparison, soft).ok;
  }

  const rel = resolveComparisonRelationship(comparison, soft);
  if (!hasIndexableRelationship(rel.kind)) return false;
  if (isThinComparisonMesh(comparison)) return false;

  const uniq = estimateUniqueContentRatio(comparison);
  if (uniq.ratio < UNIQUE_RATIO_MIN) return false;
  if (uniq.boilerplateOutcomeShare >= BOILERPLATE_SHARE_MAX) return false;

  if (!comparison.verdict?.trim()) return false;
  const hasBestFor =
    (comparison.bestFor?.some((bf) => (bf.scenarios?.length ?? 0) > 0) ??
      false) ||
    (comparison.scenarioRecommendations?.length ?? 0) > 0;
  if (!hasBestFor) return false;

  return true;
}
