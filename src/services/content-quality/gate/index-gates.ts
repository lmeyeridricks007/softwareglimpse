import type { Comparison, GuidePage } from "@/domain/schemas";
import { getAllComparisonsUnfiltered } from "@/data";
import { getGuides } from "@/data/repositories/guides";
import {
  isFactoryProductPackGuide,
  isProductExplainerGuide,
} from "@/services/seo/guides-index-worthiness/classify";
import {
  estimateGuidePromotionUniqueRatio,
  guideBodyHasUniqueAnalysis,
} from "@/services/seo/guides-index-worthiness/uniqueness";
import { isThinComparisonMesh } from "@/services/comparison-research/distinctive-research";
import {
  hasIndexableRelationship,
  resolveComparisonRelationship,
  type SoftLookup,
} from "@/services/seo/compare-index-worthiness/relationship";
import { estimateUniqueContentRatio } from "@/services/seo/compare-index-worthiness/uniqueness";
import {
  BOILERPLATE_SHARE_MAX,
  UNIQUE_RATIO_MIN,
  UNIQUE_RATIO_MIN_TEMPLATE_HEAVY,
} from "./thresholds";
import {
  assessComparisonSemanticTemplateRisk,
  assessGuideSemanticTemplateRisk,
  recordSemanticTemplateHistory,
  type SemanticTemplateAssessment,
} from "./semantic-template";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";

export type IndexGateOptions = {
  /** Sibling pages for semantic template comparison (same type/category/family). */
  peers?: GuidePage[] | Comparison[];
  /** Persist semantic similarity into quality-gate history. */
  persistSemanticHistory?: boolean;
  /** History phase label. */
  semanticPhase?: "before" | "after" | "analyze" | "promotion_block";
};

export type IndexGateResult = {
  ok: boolean;
  detail: string[];
  semantic?: SemanticTemplateAssessment;
};

/**
 * Shared guide promotion / search-index substance gates.
 * Single implementation used by lifecycle promote + runtime indexability.
 */
export function guidePassesIndexGates(
  guide: GuidePage,
  opts: IndexGateOptions = {},
): IndexGateResult {
  const detail: string[] = [];
  if (!guide.title?.trim()) {
    detail.push("missing-title");
  }
  const hasBlocks = (guide.blocks?.length ?? 0) >= 3;
  const hasSections = (guide.sections?.length ?? 0) >= 2;
  if (!hasBlocks && !hasSections) {
    detail.push("thin-sections");
  }
  if (!(guide.supports?.length > 0)) {
    detail.push("missing-anchor-supports");
  }
  if (!guide.heroVisual?.src?.trim()) {
    detail.push("missing-hero-visual");
  }
  if (!guide.seo?.description?.trim()) {
    detail.push("missing-meta-description");
  }

  const uniq = estimateGuidePromotionUniqueRatio(guide);
  const templateHeavy =
    isFactoryProductPackGuide(guide) || isProductExplainerGuide(guide);
  const minRatio = templateHeavy
    ? UNIQUE_RATIO_MIN_TEMPLATE_HEAVY
    : UNIQUE_RATIO_MIN;

  if (uniq.ratio < minRatio) {
    detail.push(`unique-ratio-below-${minRatio}:${uniq.ratio}`);
  }
  if (uniq.boilerplateShare >= BOILERPLATE_SHARE_MAX) {
    detail.push("high-boilerplate-share");
  }
  if (
    templateHeavy &&
    !guideBodyHasUniqueAnalysis(guide, { allowEnrichedFactory: true })
  ) {
    detail.push("missing-product-specific-analysis");
  }

  let peers = (opts.peers ?? []) as GuidePage[];
  if (peers.length === 0 && opts.persistSemanticHistory) {
    try {
      peers = getGuides({ includeUnpublished: true });
    } catch {
      peers = [];
    }
  }
  const semantic = assessGuideSemanticTemplateRisk(guide, peers);
  if (semantic.blocksAutoPromotion) {
    detail.push("SEMANTIC_TEMPLATE_RISK");
    for (const signal of semantic.riskSignals) {
      if (signal !== "SEMANTIC_TEMPLATE_RISK") detail.push(signal);
    }
    detail.push(...semantic.reasons.map((r) => `semantic:${r}`));
  } else if (semantic.riskLevel === "elevated") {
    // Soft signal in detail for observability; does not fail alone when signals clear.
    detail.push(`semantic-elevated:${semantic.maxSemanticSimilarity}`);
  }

  if (opts.persistSemanticHistory) {
    recordSemanticTemplateHistory(semantic, {
      phase: semantic.blocksAutoPromotion
        ? "promotion_block"
        : (opts.semanticPhase ?? "analyze"),
      pageType: "guide",
      persist: true,
    });
  }

  const informational = detail.filter((d) =>
    d.startsWith("semantic-elevated:"),
  );
  const hard = detail.filter((d) => !d.startsWith("semantic-elevated:"));

  return {
    ok: hard.length === 0,
    detail: hard.length > 0 ? hard : informational,
    semantic,
  };
}

export function comparisonPassesIndexGates(
  comparison: Comparison,
  soft: SoftLookup,
  opts: IndexGateOptions = {},
): IndexGateResult {
  let page = comparison;
  try {
    page = mergeComparisonWithOverlay(
      comparison,
      loadCompareEnrichmentOverlay(comparison.slug),
    );
  } catch {
    page = comparison;
  }

  const detail: string[] = [];
  const rel = resolveComparisonRelationship(page, soft);
  if (!hasIndexableRelationship(rel.kind)) {
    detail.push(`relationship:${rel.kind}`);
  }
  if (isThinComparisonMesh(page)) {
    detail.push("thin-comparison-mesh");
  }
  const uniq = estimateUniqueContentRatio(page);
  if (uniq.ratio < UNIQUE_RATIO_MIN) {
    detail.push(`unique-ratio-below-${UNIQUE_RATIO_MIN}:${uniq.ratio}`);
  }
  if (uniq.boilerplateOutcomeShare >= BOILERPLATE_SHARE_MAX) {
    detail.push("high-boilerplate-share");
  }
  if (!page.verdict?.trim()) {
    detail.push("missing-verdict");
  }
  const hasBestFor =
    (page.bestFor?.some((bf) => (bf.scenarios?.length ?? 0) > 0) ?? false) ||
    (page.scenarioRecommendations?.length ?? 0) > 0;
  if (!hasBestFor) {
    detail.push("missing-best-for");
  }

  let peers = (opts.peers ?? []) as Comparison[];
  if (peers.length === 0 && opts.persistSemanticHistory) {
    try {
      peers = getAllComparisonsUnfiltered();
    } catch {
      peers = [];
    }
  }
  const semantic = assessComparisonSemanticTemplateRisk(page, peers);
  if (semantic.blocksAutoPromotion) {
    detail.push("SEMANTIC_TEMPLATE_RISK");
    for (const signal of semantic.riskSignals) {
      if (signal !== "SEMANTIC_TEMPLATE_RISK") detail.push(signal);
    }
    detail.push(...semantic.reasons.map((r) => `semantic:${r}`));
  } else if (semantic.riskLevel === "elevated") {
    detail.push(`semantic-elevated:${semantic.maxSemanticSimilarity}`);
  }

  if (opts.persistSemanticHistory) {
    recordSemanticTemplateHistory(semantic, {
      phase: semantic.blocksAutoPromotion
        ? "promotion_block"
        : (opts.semanticPhase ?? "analyze"),
      pageType: "comparison",
      persist: true,
    });
  }

  const informational = detail.filter((d) =>
    d.startsWith("semantic-elevated:"),
  );
  const hard = detail.filter((d) => !d.startsWith("semantic-elevated:"));

  return {
    ok: hard.length === 0,
    detail: hard.length > 0 ? hard : informational,
    semantic,
  };
}
