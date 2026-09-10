import type { GuidePage } from "@/domain/schemas";
import { guidePassesIndexGates } from "@/services/content-quality/gate/index-gates";
import {
  UNIQUE_RATIO_MIN,
  BOILERPLATE_SHARE_MAX,
} from "@/services/content-quality/gate/thresholds";
import { isLifecyclePromotedIndexable } from "@/services/seo/content-lifecycle/store";
import {
  isFactoryProductPackGuide,
  isProductExplainerGuide,
} from "./classify";
import {
  estimateGuideUniqueContentRatio,
  guideBodyHasUniqueAnalysis,
} from "./uniqueness";

/**
 * Runtime search-index gate used by `isEntityIndexable`.
 * Shares thresholds with Content Quality Gate / promotion — not a parallel bar.
 *
 * Factory packs stay blocked until lifecycle promotion.
 * Product explainers may index when they clear enrichment promotion gates —
 * never permanently blocked solely because they share the what-is-{product} type.
 *
 * Hero visual is mandatory for all indexable guides (FR-007 editorial_completeness).
 */
export function isGuideSearchIndexWorthy(guide: GuidePage): boolean {
  if (!guide.heroVisual?.src?.trim()) return false;

  if (isLifecyclePromotedIndexable("guide", guide.slug)) {
    return guidePassesIndexGates(guide).ok;
  }

  if (isFactoryProductPackGuide(guide)) return false;

  if (isProductExplainerGuide(guide)) {
    if (!guideBodyHasUniqueAnalysis(guide, { allowEnrichedFactory: true })) {
      return false;
    }
    return guidePassesIndexGates(guide).ok;
  }

  if (!guide.title?.trim()) return false;
  const hasBlocks = (guide.blocks?.length ?? 0) >= 3;
  const hasSections = (guide.sections?.length ?? 0) >= 2;
  if (!hasBlocks && !hasSections) return false;
  if (!(guide.supports?.length > 0)) return false;
  if (!guide.seo?.description?.trim()) return false;

  const uniq = estimateGuideUniqueContentRatio(guide);
  if (uniq.ratio < UNIQUE_RATIO_MIN) return false;
  if (uniq.boilerplateShare >= BOILERPLATE_SHARE_MAX) return false;

  return true;
}
