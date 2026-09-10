import {
  getAllComparisonsUnfiltered,
  getSoftware,
} from "@/data";
import { buildSoftwareLookup } from "@/services/seo/compare-index-worthiness";
import {
  assessComparisonSemanticTemplateRisk,
  assessEnrichmentBatchFamilyQa,
  extractComparisonAnalysisSections,
  recordFamilyQaHistory,
} from "@/services/content-quality/gate/semantic-template";
import { applyCompareEnrichment } from "./apply";
import { loadCompareEnrichmentOverlay } from "./overlay-store";
import { mergeComparisonWithOverlay } from "./overlay-merge";
import { planCompareEnrichment } from "./plan";
import {
  peekCompareEnrichmentBatch,
  peerComparisonsFor,
  type BuildCompareEnrichmentQueueOptions,
} from "./queue";
import { validateAndMaybePromoteComparison } from "./validate";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import {
  COMPARE_ENRICHMENT_VERSION,
  DEFAULT_COMPARE_ENRICHMENT_BATCH_SIZE,
  type CompareEnrichmentBatchResult,
} from "./types";

export type RunCompareEnrichmentBatchOptions = BuildCompareEnrichmentQueueOptions & {
  batchSize?: number;
  apply?: boolean;
  promote?: boolean;
  slugs?: string[];
  familySharedRatioThreshold?: number;
  persistFamilyQa?: boolean;
};

/**
 * Process a controllable enrichment batch for existing /compare/ URLs.
 */
export function runCompareEnrichmentBatch(
  opts: RunCompareEnrichmentBatchOptions = {},
): CompareEnrichmentBatchResult {
  try {
    loadContentLifecycleStoreFromDisk();
  } catch {
    // non-node
  }
  const soft = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
  const batchSize = opts.batchSize ?? DEFAULT_COMPARE_ENRICHMENT_BATCH_SIZE;

  const queueItems = opts.slugs?.length
    ? opts.slugs
        .map((slug) => {
          const fromQueue = peekCompareEnrichmentBatch(10_000, opts).find(
            (q) => q.slug === slug,
          );
          if (fromQueue) return fromQueue;
          const comparison = getAllComparisonsUnfiltered().find(
            (c) => c.slug === slug,
          );
          if (!comparison) return null;
          const plan = planCompareEnrichment(comparison, soft);
          return {
            slug: comparison.slug,
            url: `/compare/${comparison.slug}/`,
            title: comparison.title,
            productA: comparison.productSlugs[0] ?? "",
            productB: comparison.productSlugs[1] ?? "",
            categorySlug: comparison.categorySlug ?? null,
            lifecycle: "IMPROVE" as const,
            relationshipKind: plan.relationshipKind,
            improvementReasons: plan.remediationFocus,
            priorityScore: 0,
            overallScore: 0,
            lane: "C" as const,
            gscEvidenceScore: 0,
            gscDemandScore: 0,
            strategicScore: 0,
            qualityGap: 0,
            qualityGapScore: 0,
            commercialScore: 0,
            authorityScore: 0,
            strategicOverride: false,
            strategicOverrideReasons: [],
            orderingReason: "Manual slug run — lane not scored from queue",
            reason: "Manual slug run — lane not scored from queue",
            prioritySignals: {
              gscImpressions: 0,
              gscClicks: 0,
              gscPosition: null,
              hasDirectQuery: false,
              realAiCitations: 0,
              knownBacklinks: 0,
              knownCompetitor: false,
              productPopularity: 0,
              commercialValue: 0,
              internalLinkDemand: 0,
              comparisonFrequency: 0,
              existingEvidence: 0,
              qualityGap: 0,
            },
            thesisPreview: plan.thesis?.label ?? null,
          };
        })
        .filter((q): q is NonNullable<typeof q> => q != null)
    : peekCompareEnrichmentBatch(batchSize, opts);

  const planned = [];
  const applied = [];
  const promoted: string[] = [];
  const skippedPromotion: Array<{ slug: string; reasons: string[] }> = [];
  const familyMembers: Array<{
    slug: string;
    stripTokens: string[];
    sections: ReturnType<typeof extractComparisonAnalysisSections>;
    assessment: ReturnType<typeof assessComparisonSemanticTemplateRisk>;
  }> = [];

  for (const item of queueItems) {
    const comparison = getAllComparisonsUnfiltered().find(
      (c) => c.slug === item.slug,
    );
    if (!comparison) continue;

    const peers = peerComparisonsFor(item.categorySlug);
    const plan = planCompareEnrichment(comparison, soft);
    planned.push(plan);

    let working = comparison;
    let capabilityRows = plan.capabilityRows;
    let evidence = plan.evidence;

    if (opts.apply === true && plan.canApplyDeterministically) {
      const result = applyCompareEnrichment(comparison, soft, {
        peerComparisons: peers,
      });
      applied.push(result);
      if (result.applied) {
        const overlay = loadCompareEnrichmentOverlay(comparison.slug);
        working = mergeComparisonWithOverlay(comparison, overlay);
        if (overlay) {
          capabilityRows = overlay.capabilityRows;
          evidence = overlay.evidence ?? evidence;
        }
      }
    } else {
      applied.push({
        slug: comparison.slug,
        applied: false,
        overlayPath: null,
        uniqueValueAdded: [],
        notes: plan.canApplyDeterministically
          ? ["Apply skipped by flag"]
          : ["Insufficient data for deterministic apply"],
        qa: { ok: true, findings: [] },
      });
      const existing = loadCompareEnrichmentOverlay(comparison.slug);
      if (existing) {
        working = mergeComparisonWithOverlay(comparison, existing);
        capabilityRows = existing.capabilityRows;
        evidence = existing.evidence ?? evidence;
      }
    }

    const decision = validateAndMaybePromoteComparison(working, soft, {
      peerComparisons: peers,
      promote: Boolean(opts.promote),
      capabilityRows,
      evidence,
    });
    if (decision.promoted) {
      promoted.push(comparison.slug);
    } else if (!decision.ok) {
      skippedPromotion.push({
        slug: comparison.slug,
        reasons: decision.reasons,
      });
    }

    const afterAssessment = assessComparisonSemanticTemplateRisk(
      working,
      peers,
    );
    familyMembers.push({
      slug: working.slug,
      stripTokens: [...working.productSlugs],
      sections: extractComparisonAnalysisSections(working),
      assessment: afterAssessment,
    });
  }

  const familyQa = assessEnrichmentBatchFamilyQa(familyMembers, {
    pageType: "comparison",
    sharedRatioThreshold: opts.familySharedRatioThreshold,
  });
  if (opts.persistFamilyQa !== false && (opts.apply || opts.promote)) {
    recordFamilyQaHistory(familyQa, { persist: true });
  }

  const remaining = Math.max(
    0,
    peekCompareEnrichmentBatch(10_000, opts).length - queueItems.length,
  );

  return {
    version: COMPARE_ENRICHMENT_VERSION,
    generatedAt: new Date().toISOString(),
    batchSize: queueItems.length,
    planned,
    applied,
    promoted,
    skippedPromotion,
    queueRemaining: remaining,
    familyQa,
  };
}
