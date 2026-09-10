import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import type { GuidePage } from "@/domain/schemas";
import {
  assessEnrichmentBatchFamilyQa,
  assessGuideSemanticTemplateRisk,
  extractGuideAnalysisSections,
  recordFamilyQaHistory,
} from "@/services/content-quality/gate/semantic-template";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import {
  isFactoryProductPackGuide,
  isProductExplainerGuide,
} from "@/services/seo/guides-index-worthiness/classify";
import { applyGuideEnrichment } from "./apply";
import {
  deleteGuideEnrichmentOverlay,
  loadGuideEnrichmentOverlay,
  saveGuideEnrichmentOverlay,
} from "./overlay-store";
import { mergeGuideWithOverlay } from "./overlay-merge";
import { planGuideEnrichment } from "./plan";
import { peekEnrichmentBatch, type BuildEnrichmentQueueOptions } from "./queue";
import { validateAndMaybePromoteGuide } from "./validate";
import {
  DEFAULT_ENRICHMENT_BATCH_SIZE,
  GUIDE_ENRICHMENT_VERSION,
  type EnrichmentBatchResult,
  type EnrichmentQueueItem,
} from "./types";
import {
  loadGscOpportunitySignalsByPath,
  type GscOpportunityPathSignal,
} from "@/services/seo/gsc-opportunity/load-report";

export type RunEnrichmentBatchOptions = BuildEnrichmentQueueOptions & {
  batchSize?: number;
  /** Persist overlays from deterministic apply. */
  apply?: boolean;
  /** Promote when gates + QA pass after apply/merge. */
  promote?: boolean;
  slugs?: string[];
  /** Family QA shared-pattern threshold (default 0.35). */
  familySharedRatioThreshold?: number;
  persistFamilyQa?: boolean;
};

/**
 * Overlay-merge template-heavy pages (factory/explainers) — the only peers
 * that can score into a factory sibling cluster. Avoids re-reading overlays
 * for educational guides that never enter the cluster.
 */
function peersWithOverlays(seeds: GuidePage[]): GuidePage[] {
  return seeds.map((g) => {
    if (!isFactoryProductPackGuide(g) && !isProductExplainerGuide(g)) {
      return g;
    }
    const overlay = loadGuideEnrichmentOverlay(g.slug);
    return overlay ? mergeGuideWithOverlay(g, overlay) : g;
  });
}

/**
 * Resolve a slug without rebuilding the IMPROVE queue.
 * peekEnrichmentBatch → runGuidesIndexAudit; calling it per slug makes a
 * 20-page factory wave re-run the full estate semantic audit 20 times.
 */
function queueItemForSlug(
  slug: string,
  gscMap: Map<string, GscOpportunityPathSignal>,
): EnrichmentQueueItem | null {
  const guide = getGuideBySlug(slug, { includeUnpublished: true });
  if (!guide) return null;
  const plan = planGuideEnrichment(guide);
  const path = `/guides/${slug}/`;
  const gsc = gscMap.get(path);
  const impressions = gsc?.impressions ?? 0;
  const clicks = gsc?.clicks ?? 0;
  const position = gsc?.position ?? null;
  const hasDirectQuery = gsc?.hasDirectQuery ?? false;
  return {
    slug: guide.slug,
    url: path,
    title: guide.title,
    enrichmentType: plan.enrichmentType,
    lifecycle: "IMPROVE",
    improvementReasons: plan.remediationFocus,
    priorityScore: 0,
    overallScore: 0,
    lane: impressions > 0 ? "A" : "C",
    gscEvidenceScore: 0,
    gscDemandScore: 0,
    strategicScore: 0,
    qualityGap: 0,
    qualityGapScore: 0,
    commercialScore: 0,
    authorityScore: 0,
    strategicOverride: false,
    strategicOverrideReasons: [],
    orderingReason: "Manual slug run — skip estate-audit queue rebuild",
    reason: "Manual slug run — skip estate-audit queue rebuild",
    prioritySignals: {
      gscImpressions: impressions,
      gscClicks: clicks,
      gscPosition: position,
      hasDirectQuery,
      realAiCitations: 0,
      knownBacklinks: 0,
      commercialIntentWeight: 0,
      categoryImportance: 0,
      internalLinkOpportunity: 0,
      productPopularity: 0,
      affiliateOpportunity: 0,
      qualityGap: 0,
      existingAuthority: 0,
    },
    intent: plan.intent,
  };
}

/** Replace one slug in a cached peer list after overlay write/delete. */
function refreshPeerSlug(
  peers: GuidePage[],
  seedsBySlug: Map<string, GuidePage>,
  slug: string,
): GuidePage[] {
  const seed = seedsBySlug.get(slug);
  if (!seed) return peers;
  const overlay = loadGuideEnrichmentOverlay(slug);
  const merged = overlay ? mergeGuideWithOverlay(seed, overlay) : seed;
  return peers.map((p) => (p.slug === slug ? merged : p));
}

/**
 * Process a controllable enrichment batch (default 20–50).
 * Improves existing URLs via overlays — never creates replacement slugs.
 * Runs Phase-5 family QA so templated sibling batches cannot silently promote.
 * Persist uses overlay-merged peers (same content source as guides-audit).
 */
export function runGuideEnrichmentBatch(
  opts: RunEnrichmentBatchOptions = {},
): EnrichmentBatchResult {
  // Ensure disk promotions are visible when callers forget to load.
  try {
    loadContentLifecycleStoreFromDisk();
  } catch {
    // Browser / non-node contexts skip disk load.
  }
  const batchSize = opts.batchSize ?? DEFAULT_ENRICHMENT_BATCH_SIZE;
  let gscMap: Map<string, GscOpportunityPathSignal> = new Map();
  try {
    gscMap = loadGscOpportunitySignalsByPath();
  } catch {
    gscMap = new Map();
  }
  const queueItems = opts.slugs?.length
    ? opts.slugs
        .map((slug) => queueItemForSlug(slug, gscMap))
        .filter((q): q is EnrichmentQueueItem => q != null)
    : peekEnrichmentBatch(batchSize, opts);

  const seeds = getGuides({ includeUnpublished: true });
  const seedsBySlug = new Map(seeds.map((g) => [g.slug, g]));
  let peers = peersWithOverlays(seeds);
  const planned = [];
  const applied = [];
  const promoted: string[] = [];
  const skippedPromotion: Array<{ slug: string; reasons: string[] }> = [];
  const appliedThisBatch = new Set<string>();
  const priorOverlaySlugs = new Set(
    seeds
      .map((g) => g.slug)
      .filter((slug) => Boolean(loadGuideEnrichmentOverlay(slug))),
  );
  const familyMembers: Array<{
    slug: string;
    stripTokens: string[];
    sections: ReturnType<typeof extractGuideAnalysisSections>;
    assessment: ReturnType<typeof assessGuideSemanticTemplateRisk>;
  }> = [];

  for (const item of queueItems) {
    const guide = getGuideBySlug(item.slug, { includeUnpublished: true });
    if (!guide) continue;

    const gsc = {
      impressions: item.prioritySignals.gscImpressions,
      position: item.prioritySignals.gscPosition,
      queries: item.intent.gscQueries,
    };
    const plan = planGuideEnrichment(guide, gsc);
    planned.push(plan);

    const existingOverlay = loadGuideEnrichmentOverlay(guide.slug);
    const priorSnapshot = existingOverlay
      ? structuredClone(existingOverlay)
      : null;
    const mergedBefore = existingOverlay
      ? mergeGuideWithOverlay(guide, existingOverlay)
      : guide;
    const beforeAssessment = assessGuideSemanticTemplateRisk(
      mergedBefore,
      peers,
    );

    let working = mergedBefore;
    if (opts.apply === true && plan.canApplyDeterministically) {
      const result = applyGuideEnrichment(guide, {
        gsc,
        // Estate-compatible peers: overlays already on disk + prior batch applies.
        peerGuides: peers,
      });
      if (result.applied) {
        peers = refreshPeerSlug(peers, seedsBySlug, guide.slug);
        const overlay = loadGuideEnrichmentOverlay(guide.slug);
        working = overlay ? mergeGuideWithOverlay(guide, overlay) : guide;
        const afterPeerCheck = assessGuideSemanticTemplateRisk(working, peers);
        if (afterPeerCheck.blocksAutoPromotion) {
          if (priorSnapshot) {
            saveGuideEnrichmentOverlay(priorSnapshot);
          } else {
            deleteGuideEnrichmentOverlay(guide.slug);
          }
          applied.push({
            ...result,
            applied: false,
            overlayPath: null,
            notes: [
              ...result.notes,
              "Sibling semantic QA blocked persist — interchangeable with overlay-merged peers (variable substitution rejected)",
              afterPeerCheck.promotionReason,
            ],
          });
          const restored = loadGuideEnrichmentOverlay(guide.slug);
          working = restored
            ? mergeGuideWithOverlay(guide, restored)
            : guide;
          peers = refreshPeerSlug(peers, seedsBySlug, guide.slug);
        } else {
          appliedThisBatch.add(guide.slug);
          applied.push(result);
        }
      } else {
        applied.push(result);
      }
    } else {
      applied.push({
        slug: guide.slug,
        applied: false,
        overlayPath: null,
        uniqueValueAdded: [],
        blocksAdded: 0,
        notes: plan.canApplyDeterministically
          ? ["Apply skipped by flag"]
          : ["Plan-only guide type"],
        qa: { ok: true, findings: [] },
      });
      const existing = loadGuideEnrichmentOverlay(guide.slug);
      if (existing) working = mergeGuideWithOverlay(guide, existing);
    }

    const decision = validateAndMaybePromoteGuide(working, {
      peerGuides: peers,
      promote: Boolean(opts.promote),
      beforeAssessment,
      persistSemanticHistory: Boolean(opts.promote || opts.apply),
    });
    if (decision.promoted) {
      promoted.push(guide.slug);
    } else if (!decision.ok) {
      skippedPromotion.push({ slug: guide.slug, reasons: decision.reasons });
    }

    const afterAssessment = assessGuideSemanticTemplateRisk(working, peers);
    familyMembers.push({
      slug: working.slug,
      stripTokens: [
        ...(working.productSlugs ?? []),
        ...working.title.split(/\s+/).filter((w) => w.length >= 4),
      ],
      sections: extractGuideAnalysisSections(working),
      assessment: afterAssessment,
    });
  }

  const familyQa = assessEnrichmentBatchFamilyQa(familyMembers, {
    pageType: "guide",
    sharedRatioThreshold: opts.familySharedRatioThreshold,
  });
  if (opts.persistFamilyQa !== false && (opts.apply || opts.promote)) {
    recordFamilyQaHistory(familyQa, { persist: true });
  }

  // Family-wide template pattern → roll back overlays applied in this batch only.
  if (familyQa.flagged && opts.apply === true) {
    for (const member of familyQa.pageAssessments) {
      if (!appliedThisBatch.has(member.slug)) continue;
      if (member.riskLevel !== "high" && !member.blocksAutoPromotion) continue;
      if (priorOverlaySlugs.has(member.slug)) continue;
      deleteGuideEnrichmentOverlay(member.slug);
      peers = refreshPeerSlug(peers, seedsBySlug, member.slug);
      const row = applied.find((a) => a.slug === member.slug);
      if (row) {
        row.applied = false;
        row.overlayPath = null;
        row.notes = [
          ...row.notes,
          `FAMILY_QA rollback: ${familyQa.notes[0] ?? "shared thesis/skeleton"}`,
        ];
      }
      const promoIdx = promoted.indexOf(member.slug);
      if (promoIdx >= 0) promoted.splice(promoIdx, 1);
      const note = `FAMILY_QA: ${familyQa.notes[0] ?? "shared thesis/skeleton"}`;
      const already = skippedPromotion.find((s) => s.slug === member.slug);
      if (already) {
        if (!already.reasons.some((r) => r.startsWith("FAMILY_QA"))) {
          already.reasons.push(note);
        }
      } else {
        skippedPromotion.push({ slug: member.slug, reasons: [note] });
      }
    }
  } else if (familyQa.flagged) {
    for (const member of familyQa.pageAssessments) {
      if (promoted.includes(member.slug)) continue;
      const already = skippedPromotion.find((s) => s.slug === member.slug);
      const note = `FAMILY_QA: ${familyQa.notes[0] ?? "shared thesis/skeleton"}`;
      if (already) {
        if (!already.reasons.some((r) => r.startsWith("FAMILY_QA"))) {
          already.reasons.push(note);
        }
      }
    }
  }

  const remaining = Math.max(
    0,
    peekEnrichmentBatch(10_000, opts).length - queueItems.length,
  );

  return {
    version: GUIDE_ENRICHMENT_VERSION,
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
