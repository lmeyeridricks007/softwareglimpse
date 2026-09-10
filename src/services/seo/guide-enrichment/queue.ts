import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { runGuidesIndexAudit } from "@/services/seo/guides-index-worthiness/inventory";
import type { GuideIndexEvaluation } from "@/services/seo/guides-index-worthiness/types";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import {
  allocateEnrichmentBatch,
  classifyEnrichmentLane,
  compareByLaneThenScore,
  DEFAULT_LANE_ALLOCATION,
  laneReportFields,
  loadExternalEnrichmentEvidence,
  type LaneAllocation,
} from "@/services/seo/enrichment-lanes";
import { resolveGuideSearchIntent, type GscGuideSignal } from "./intent";
import { classifyEnrichmentGuideType } from "./taxonomy";
import type { EnrichmentQueueItem } from "./types";

/** Category priority for enrichment sequencing (higher = sooner). */
const CATEGORY_IMPORTANCE: Record<string, number> = {
  crm: 100,
  "sales-intelligence": 90,
  "email-marketing": 80,
  marketing: 75,
  hr: 70,
  "project-management": 65,
  ecommerce: 60,
  "business-communications": 55,
  ai: 50,
  "it-development": 45,
};

export type BuildEnrichmentQueueOptions = {
  gscByPath?: Map<string, GscGuideSignal>;
  limit?: number;
  laneAllocation?: Partial<LaneAllocation>;
  /** When peaking a batch, apply A/B/C allocation mix. */
  allocateByLane?: boolean;
};

function gscForSlug(
  slug: string,
  gscByPath?: Map<string, GscGuideSignal>,
): GscGuideSignal | null {
  if (!gscByPath) return null;
  return (
    gscByPath.get(`/guides/${slug}/`) ||
    gscByPath.get(`/guides/${slug}`) ||
    null
  );
}

function scoreQueueItem(
  evaluation: GuideIndexEvaluation,
  gsc: GscGuideSignal | null,
  external: {
    aiCitations: number;
    knownBacklinks: number;
  },
): EnrichmentQueueItem | null {
  const guide = getGuideBySlug(evaluation.slug, { includeUnpublished: true });
  if (!guide) return null;

  const enrichmentType = classifyEnrichmentGuideType(guide);
  const intent = resolveGuideSearchIntent(guide, gsc);

  const gscImpressions = gsc?.impressions ?? 0;
  const gscClicks = gsc?.clicks ?? 0;
  const gscPosition = gsc?.position ?? null;
  const gscOpportunityScore = gsc?.opportunityScore ?? 0;
  const hasDirectQuery = Boolean(gsc?.hasDirectQuery);

  const commercialIntentWeight =
    intent.commercialIntent === "commercial"
      ? 30
      : intent.commercialIntent === "mixed"
        ? 18
        : 8;
  const categoryImportance =
    CATEGORY_IMPORTANCE[evaluation.categorySlug || ""] ?? 20;
  const internalLinkOpportunity =
    evaluation.metrics.incomingInternalLinks === 0
      ? 25
      : evaluation.metrics.incomingInternalLinks === 1
        ? 12
        : 4;
  const product = guide.productSlugs[0]
    ? getSoftwareBySlug(guide.productSlugs[0])
    : null;
  const productPopularity = product?.affiliate?.enabled ? 20 : product ? 10 : 0;
  const affiliateOpportunity = product?.affiliate?.enabled ? 22 : 0;
  const qualityGap = Math.min(
    40,
    evaluation.improvementReasons.length * 6 +
      Math.round((1 - evaluation.metrics.contentCompleteness) * 20) +
      Math.round((1 - evaluation.metrics.uniqueContentRatio) * 15),
  );
  const existingAuthority = Math.min(
    25,
    Math.round(gscImpressions / 50) +
      (gscPosition != null && gscPosition <= 20 ? 12 : 0),
  );

  const importantBuyerQuestion =
    enrichmentType === "BUYING_GUIDE" ||
    enrichmentType === "DECISION_GUIDE" ||
    enrichmentType === "COST_GUIDE" ||
    enrichmentType === "PRODUCT_EXPLAINER";

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
      productPopularity: productPopularity + affiliateOpportunity * 0.25,
      commercialRelevance: commercialIntentWeight + affiliateOpportunity * 0.4,
      internalJourneyStrength: internalLinkOpportunity,
      competitorRelationship: false,
      importantBuyerQuestion,
    },
    qualityGap,
  });

  // Small within-lane nudge for improve_promotion + type — never overrides lane.
  const typeNudge =
    (enrichmentType === "PRODUCT_EXPLAINER" ? 4 : 0) +
    (enrichmentType === "INDUSTRY_GUIDE" ? 3 : 0) +
    (gsc?.queueBucket === "improve_promotion" ? 5 : 0);
  const fields = laneReportFields(laneResult);
  const overallScore = Number((fields.overallScore + typeNudge).toFixed(2));

  return {
    slug: guide.slug,
    url: evaluation.url,
    title: guide.title,
    enrichmentType,
    lifecycle: evaluation.lifecycle,
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
      commercialIntentWeight,
      categoryImportance,
      internalLinkOpportunity,
      productPopularity,
      affiliateOpportunity,
      qualityGap,
      existingAuthority,
    },
    intent,
  };
}

/**
 * Ordered improvement queue for IMPROVE / IMPROVING guides.
 * Sorted Lane A → B → C; within lane by proven demand / strategy / gap.
 * Auto-loads real GSC opportunity signals when `gscByPath` is omitted.
 */
export function buildGuideEnrichmentQueue(
  opts: BuildEnrichmentQueueOptions = {},
): EnrichmentQueueItem[] {
  const external = loadExternalEnrichmentEvidence();
  const gscByPath =
    opts.gscByPath ??
    (() => {
      const signals = loadGscOpportunitySignalsByPath();
      const map = new Map<string, GscGuideSignal>();
      for (const [p, s] of signals) {
        if (!p.includes("/guides/")) continue;
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

  const audit = runGuidesIndexAudit();
  const improve = audit.evaluations.filter(
    (e) =>
      e.lifecycle === "IMPROVE" ||
      e.lifecycle === "IMPROVING" ||
      e.lifecycle === "INDEXABLE_READY",
  );

  const items: EnrichmentQueueItem[] = [];
  for (const evaluation of improve) {
    const path = evaluation.url.endsWith("/")
      ? evaluation.url
      : `${evaluation.url}/`;
    const item = scoreQueueItem(
      evaluation,
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

export function peekEnrichmentBatch(
  size: number,
  opts: BuildEnrichmentQueueOptions = {},
): EnrichmentQueueItem[] {
  const queue = buildGuideEnrichmentQueue({ ...opts, limit: undefined });
  if (opts.allocateByLane === false) {
    return queue.slice(0, size);
  }
  return allocateEnrichmentBatch(
    queue,
    size,
    opts.laneAllocation ?? DEFAULT_LANE_ALLOCATION,
  );
}

/** Lightweight GSC map helper for scripts that already loaded page aggregates. */
export function gscMapFromPageRows(
  rows: Array<{
    path?: string;
    page?: string;
    impressions: number;
    clicks?: number;
    position?: number;
    queries?: string[];
  }>,
): Map<string, GscGuideSignal> {
  const map = new Map<string, GscGuideSignal>();
  for (const row of rows) {
    const raw = row.path || row.page || "";
    if (!raw.includes("/guides/")) continue;
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

export function guideCountInCatalogue(): number {
  return getGuides({ includeUnpublished: true }).length;
}
