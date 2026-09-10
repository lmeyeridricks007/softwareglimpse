import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Comparison } from "@/domain/schemas";
import {
  getAllComparisonsUnfiltered,
  getComparisonBySlug,
  getSoftware,
  getSoftwareBySlug,
} from "@/data";
import {
  buildSoftwareLookup,
  runCompareIndexAudit,
} from "@/services/seo/compare-index-worthiness";
import type { CompareIndexEvaluation } from "@/services/seo/compare-index-worthiness/types";
import {
  allocateEnrichmentBatch,
  classifyEnrichmentLane,
  compareByLaneThenScore,
  DEFAULT_LANE_ALLOCATION,
  laneReportFields,
  loadExternalEnrichmentEvidence,
  type LaneAllocation,
} from "@/services/seo/enrichment-lanes";
import { planCompareEnrichment } from "./plan";
import type { CompareEnrichmentQueueItem } from "./types";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";

const CATEGORY_IMPORTANCE: Record<string, number> = {
  crm: 100,
  "sales-intelligence": 90,
  "email-marketing": 85,
  marketing: 75,
  hr: 70,
  "project-management": 65,
  ecommerce: 60,
  "business-communications": 55,
  ai: 50,
  "it-development": 40,
};

export type GscCompareSignal = {
  impressions: number;
  clicks?: number;
  position: number | null;
  queries?: string[];
  opportunityScore?: number;
  queueBucket?: string | null;
  hasDirectQuery?: boolean;
};

export type BuildCompareEnrichmentQueueOptions = {
  gscByPath?: Map<string, GscCompareSignal>;
  limit?: number;
  laneAllocation?: Partial<LaneAllocation>;
  allocateByLane?: boolean;
};

function gscForSlug(
  slug: string,
  gscByPath?: Map<string, GscCompareSignal>,
): GscCompareSignal | null {
  if (!gscByPath) return null;
  return (
    gscByPath.get(`/compare/${slug}/`) ||
    gscByPath.get(`/compare/${slug}`) ||
    null
  );
}

function scoreQueueItem(
  evaluation: CompareIndexEvaluation,
  soft: ReturnType<typeof buildSoftwareLookup>,
  gsc: GscCompareSignal | null,
  external: { aiCitations: number; knownBacklinks: number },
): CompareEnrichmentQueueItem | null {
  const comparison =
    getAllComparisonsUnfiltered().find((c) => c.slug === evaluation.slug) ??
    getComparisonBySlug(evaluation.slug, { includeUnpublished: true });
  if (!comparison) return null;

  const plan = planCompareEnrichment(comparison, soft);
  const [slugA, slugB] = comparison.productSlugs;
  const productA = slugA ? getSoftwareBySlug(slugA) : null;
  const productB = slugB ? getSoftwareBySlug(slugB) : null;

  const gscImpressions = gsc?.impressions ?? 0;
  const gscClicks = gsc?.clicks ?? 0;
  const gscPosition = gsc?.position ?? null;
  const gscOpportunityScore = gsc?.opportunityScore ?? 0;
  const hasDirectQuery = Boolean(gsc?.hasDirectQuery);
  const knownCompetitor =
    evaluation.relationshipKind === "declared_competitor" ||
    evaluation.relationshipKind === "declared_alternative" ||
    evaluation.relationshipKind === "declared_comparable" ||
    evaluation.relationshipKind === "data_backed_comparable";

  const productPopularity =
    (productA?.affiliate?.enabled ? 18 : productA ? 8 : 0) +
    (productB?.affiliate?.enabled ? 18 : productB ? 8 : 0);
  const commercialValue =
    (productA?.affiliate?.enabled ? 20 : 0) +
    (productB?.affiliate?.enabled ? 20 : 0) +
    (CATEGORY_IMPORTANCE[evaluation.categorySlug || ""] ?? 15) * 0.25;

  const internalLinkDemand =
    evaluation.metrics.incomingInternalLinks === 0
      ? 22
      : evaluation.metrics.incomingInternalLinks === 1
        ? 10
        : 3;

  const comparisonFrequency = Math.min(
    20,
    Math.round(gscImpressions / 40) +
      (gscPosition != null && gscPosition >= 10 && gscPosition <= 50 ? 14 : 0),
  );

  const existingEvidence =
    (productA?.lastVerifiedAt || productA?.pricingVerifiedAt ? 8 : 0) +
    (productB?.lastVerifiedAt || productB?.pricingVerifiedAt ? 8 : 0) +
    (plan.evidence.handsOnA || plan.evidence.handsOnB ? 10 : 0);

  const qualityGap = Math.min(
    40,
    evaluation.improvementReasons.length * 5 +
      Math.round((1 - evaluation.metrics.uniqueContentRatio) * 18) +
      Math.round((1 - evaluation.metrics.featureDataCompleteness) * 12),
  );

  const categoryImportance =
    CATEGORY_IMPORTANCE[evaluation.categorySlug || ""] ?? 15;

  const laneResult = classifyEnrichmentLane({
    gsc: {
      impressions: gscImpressions,
      clicks: gscClicks,
      position: gscPosition,
      opportunityScore: gscOpportunityScore,
      hasDirectQuery,
      knownBacklinks: external.knownBacklinks,
      realAiCitations: external.aiCitations,
    },
    strategic: {
      categoryImportance,
      productPopularity,
      commercialRelevance: commercialValue,
      internalJourneyStrength: internalLinkDemand,
      competitorRelationship: knownCompetitor,
      importantBuyerQuestion:
        evaluation.relationshipKind === "declared_competitor" ||
        evaluation.relationshipKind === "declared_alternative",
    },
    qualityGap,
  });

  const nudge =
    (gscPosition != null && gscPosition >= 10 && gscPosition <= 50 ? 4 : 0) +
    (evaluation.relationshipKind === "data_backed_comparable" ? 3 : 0) +
    (gsc?.queueBucket === "improve_promotion" ? 4 : 0) +
    comparisonFrequency * 0.15 +
    existingEvidence * 0.1;
  const fields = laneReportFields(laneResult);
  const overallScore = Number((fields.overallScore + nudge).toFixed(2));

  return {
    slug: comparison.slug,
    url: evaluation.url,
    title: comparison.title,
    productA: slugA ?? "",
    productB: slugB ?? "",
    categorySlug: evaluation.categorySlug,
    lifecycle: evaluation.lifecycle,
    relationshipKind: evaluation.relationshipKind,
    improvementReasons: evaluation.improvementReasons,
    ...fields,
    priorityScore: overallScore,
    overallScore,
    prioritySignals: {
      gscImpressions,
      gscClicks,
      gscPosition,
      hasDirectQuery,
      realAiCitations: external.aiCitations,
      knownBacklinks: external.knownBacklinks,
      knownCompetitor,
      productPopularity,
      commercialValue: Number(commercialValue.toFixed(2)),
      internalLinkDemand,
      comparisonFrequency,
      existingEvidence,
      qualityGap,
    },
    thesisPreview: plan.thesis?.label ?? null,
  };
}

/**
 * Ordered IMPROVE queue for existing comparison URLs.
 * Sorted Lane A → B → C so zero-impression catalogue pairs never bury GSC demand.
 */
export function buildCompareEnrichmentQueue(
  opts: BuildCompareEnrichmentQueueOptions = {},
): CompareEnrichmentQueueItem[] {
  const external = loadExternalEnrichmentEvidence();
  const gscByPath =
    opts.gscByPath ??
    (() => {
      const signals = loadGscOpportunitySignalsByPath();
      const map = new Map<string, GscCompareSignal>();
      for (const [p, s] of signals) {
        if (!p.includes("/compare/")) continue;
        map.set(p, {
          impressions: s.impressions,
          clicks: s.clicks,
          position: s.position,
          queries: s.queries,
          opportunityScore: s.opportunityScore,
          queueBucket: s.queueBucket,
          hasDirectQuery: s.hasDirectQuery,
        });
      }
      return map;
    })();

  const audit = runCompareIndexAudit();
  const soft = buildSoftwareLookup(getSoftware());

  // VALID_* MANUAL_REVIEW pairs from the latest triage (if present) join the queue.
  let validManualSlugs = new Set<string>();
  try {
    const triagePath = path.join(
      process.cwd(),
      "data/seo/compare-manual-review.json",
    );
    if (existsSync(triagePath)) {
      const triage = JSON.parse(readFileSync(triagePath, "utf8")) as {
        enrichmentQueueSlugs?: string[];
      };
      validManualSlugs = new Set(triage.enrichmentQueueSlugs ?? []);
    }
  } catch {
    validManualSlugs = new Set();
  }

  const improve = audit.evaluations.filter(
    (e) =>
      e.lifecycle === "IMPROVE" ||
      e.lifecycle === "IMPROVING" ||
      e.lifecycle === "INDEXABLE_READY" ||
      (e.lifecycle === "MANUAL_REVIEW" && validManualSlugs.has(e.slug)),
  );

  const items: CompareEnrichmentQueueItem[] = [];
  for (const evaluation of improve) {
    const path = evaluation.url.endsWith("/")
      ? evaluation.url
      : `${evaluation.url}/`;
    const item = scoreQueueItem(
      evaluation,
      soft,
      gscForSlug(evaluation.slug, gscByPath),
      {
        aiCitations: external.aiCitationsByPath.get(path) ?? 0,
        knownBacklinks: external.backlinksByPath.get(path) ?? 0,
      },
    );
    if (item) items.push(item);
  }

  items.sort(compareByLaneThenScore);
  if (opts.limit != null) return items.slice(0, opts.limit);
  return items;
}

export function peekCompareEnrichmentBatch(
  size: number,
  opts: BuildCompareEnrichmentQueueOptions = {},
): CompareEnrichmentQueueItem[] {
  const queue = buildCompareEnrichmentQueue({ ...opts, limit: undefined });
  if (opts.allocateByLane === false) {
    return queue.slice(0, size);
  }
  return allocateEnrichmentBatch(
    queue,
    size,
    opts.laneAllocation ?? DEFAULT_LANE_ALLOCATION,
  );
}

export function gscMapFromCompareRows(
  rows: Array<{
    path?: string;
    page?: string;
    impressions: number;
    clicks?: number;
    position?: number;
    queries?: string[];
  }>,
): Map<string, GscCompareSignal> {
  const map = new Map<string, GscCompareSignal>();
  for (const row of rows) {
    const raw = row.path || row.page || "";
    if (!raw.includes("/compare/")) continue;
    const pathName = raw.startsWith("http")
      ? new URL(raw).pathname
      : raw.startsWith("/")
        ? raw
        : `/${raw}`;
    const normalized = pathName.endsWith("/") ? pathName : `${pathName}/`;
    const prev = map.get(normalized);
    map.set(normalized, {
      impressions: (prev?.impressions ?? 0) + row.impressions,
      clicks: (prev?.clicks ?? 0) + (row.clicks ?? 0),
      position: row.position ?? prev?.position ?? null,
      queries: [
        ...new Set([...(prev?.queries ?? []), ...(row.queries ?? [])]),
      ].slice(0, 10),
    });
  }
  return map;
}

/** Peer set for differentiation QA (category-scoped when possible). */
export function peerComparisonsFor(
  categorySlug: string | null | undefined,
): Comparison[] {
  const all = getAllComparisonsUnfiltered();
  if (!categorySlug) return all.slice(0, 80);
  const peers = all.filter((c) => c.categorySlug === categorySlug);
  return peers.length > 0 ? peers : all.slice(0, 80);
}
