import { existsSync, readFileSync } from "node:fs";
import type {
  ChangeEvent,
  ContentRegistryEntry,
  RefreshCandidate,
  RefreshPriority,
} from "@/domain";
import { maxPriority } from "@/data/config/publishing/refresh-rules";
import { listChangeEvents } from "@/data/publishing/store";
import { getSoftwareBySlug } from "@/data";
import {
  applyGrowthSignalsToRefreshCandidates,
} from "@/services/price-change-monitor/growth-feed-apply";
import type { PriceChangeGrowthFeed } from "@/services/price-change-monitor/growth-feed";
import {
  classifyEnrichmentLane,
  compareByLaneThenScore,
  laneReportFields,
  loadExternalEnrichmentEvidence,
} from "@/services/seo/enrichment-lanes";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import { parseContentId, pathForContent, softwareContentId } from "../ids";
import { isPastReviewDate } from "../review-dates";
import { resolveRefreshCandidates } from "../refresh-resolver";

export type RefreshScannerOptions = {
  now?: Date;
  entries?: ContentRegistryEntry[];
  changeEvents?: ChangeEvent[];
  /**
   * Optional research freshness hook — return product slugs that are stale.
   */
  listStaleResearchProducts?: () => string[];
  /**
   * When true (default), merge price-change growth signals so ranking pages
   * with outdated pricing risk get increased refresh priority.
   */
  includePriceMonitorSignals?: boolean;
  /**
   * When true (default), attach enrichment lanes and sort so proven GSC
   * demand is not buried by catalogue/commercial refresh noise.
   */
  applyEnrichmentLanes?: boolean;
};

export type RefreshScanResult = {
  candidates: RefreshCandidate[];
  fromChangeEvents: number;
  fromStaleReview: number;
  fromResearch: number;
  fromPriceMonitor: number;
};

function loadPriceMonitorGrowthFeed(): PriceChangeGrowthFeed | null {
  const file = `${process.cwd()}/data/pricing/price-change-growth-signals.json`;
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as PriceChangeGrowthFeed;
  } catch {
    return null;
  }
}

const PRIORITY_RANK: Record<RefreshPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
  low: 3,
};

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

/**
 * Attach Lane A/B/C scores and sort: refresh urgency first, then lane,
 * then overallScore. Zero-GSC catalogue pages stay behind proven demand
 * unless strategicOverride.
 */
export function applyEnrichmentLanesToRefreshCandidates(
  candidates: RefreshCandidate[],
): RefreshCandidate[] {
  const gscByPath = loadGscOpportunitySignalsByPath();
  const external = loadExternalEnrichmentEvidence();

  const ranked = candidates.map((candidate) => {
    let type: string;
    let slug: string;
    try {
      const parsed = parseContentId(String(candidate.contentId));
      type = parsed.type;
      slug = parsed.slug;
    } catch {
      return candidate;
    }

    const pagePath = pathForContent(type as Parameters<typeof pathForContent>[0], slug);
    const pathKey = pagePath.endsWith("/") ? pagePath : `${pagePath}/`;
    const gsc = gscByPath.get(pathKey) ?? gscByPath.get(pagePath);

    const software = type === "software" ? getSoftwareBySlug(slug) : null;
    const categoryImportance = software
      ? (CATEGORY_IMPORTANCE[software.primaryCategorySlug || ""] ?? 20)
      : type === "comparison" || type === "guide"
        ? 50
        : 25;
    const commercialRelevance = software?.affiliate?.enabled
      ? 28
      : candidate.priority === "critical"
        ? 22
        : candidate.priority === "high"
          ? 16
          : 8;
    const qualityGap =
      candidate.priority === "critical"
        ? 35
        : candidate.priority === "high"
          ? 25
          : candidate.reasons.includes("past-next-review-at")
            ? 18
            : 12;

    const laneResult = classifyEnrichmentLane({
      gsc: {
        impressions: gsc?.impressions ?? 0,
        clicks: gsc?.clicks ?? 0,
        position: gsc?.position ?? null,
        opportunityScore: gsc?.opportunityScore ?? 0,
        hasDirectQuery: gsc?.hasDirectQuery,
        knownBacklinks: external.backlinksByPath.get(pathKey) ?? 0,
        realAiCitations: external.aiCitationsByPath.get(pathKey) ?? 0,
      },
      strategic: {
        categoryImportance,
        productPopularity: software?.affiliate?.enabled ? 20 : 8,
        commercialRelevance,
        internalJourneyStrength:
          candidate.affectedDomains.includes("editorial") ? 12 : 6,
        competitorRelationship: type === "comparison",
        importantBuyerQuestion:
          type === "guide" || type === "comparison" || type === "best",
      },
      qualityGap,
    });

    const fields = laneReportFields(laneResult);
    return {
      ...candidate,
      enrichmentLane: fields.lane,
      overallScore: fields.overallScore,
      gscDemandScore: fields.gscDemandScore,
      strategicScore: fields.strategicScore,
      qualityGapScore: fields.qualityGapScore,
      commercialScore: fields.commercialScore,
      authorityScore: fields.authorityScore,
      strategicOverride: fields.strategicOverride,
      laneReason: fields.reason,
      reasons: fields.strategicOverride
        ? [
            ...candidate.reasons,
            `strategicOverride=${fields.strategicOverrideReasons.join(",")}`,
          ]
        : candidate.reasons,
    } satisfies RefreshCandidate;
  });

  return ranked.sort((a, b) => {
    const pr =
      PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (pr !== 0) return pr;
    return compareByLaneThenScore(
      {
        lane: a.enrichmentLane ?? "C",
        priorityScore: a.overallScore ?? 0,
        gscEvidenceScore: a.gscDemandScore ?? 0,
      },
      {
        lane: b.enrichmentLane ?? "C",
        priorityScore: b.overallScore ?? 0,
        gscEvidenceScore: b.gscDemandScore ?? 0,
      },
    );
  });
}

/**
 * Scan stale nextReviewAt, change events, and research freshness hooks
 * → refresh candidates. Optionally boost from price-change monitor signals.
 */
export function scanRefreshCandidates(
  opts: RefreshScannerOptions = {},
): RefreshScanResult {
  const now = opts.now ?? new Date();
  const bucket = new Map<string, RefreshCandidate>();

  let fromChangeEvents = 0;
  let fromStaleReview = 0;
  let fromResearch = 0;
  let fromPriceMonitor = 0;

  const events = opts.changeEvents ?? listChangeEvents();
  for (const event of events) {
    const resolved = resolveRefreshCandidates(event);
    fromChangeEvents += resolved.length;
    mergeCandidates(bucket, resolved);
  }

  for (const entry of opts.entries ?? []) {
    const nextReview = entry.nextReviewAt ?? entry.metadata.nextReviewAt;
    if (isPastReviewDate(nextReview, now)) {
      fromStaleReview += 1;
      const key = String(entry.contentId);
      const existing = bucket.get(key);
      const candidate: RefreshCandidate = {
        contentId: entry.contentId,
        priority: existing?.priority ?? "normal",
        refreshStatus: "refresh-recommended",
        reasons: [
          ...new Set([...(existing?.reasons ?? []), "past-next-review-at"]),
        ],
        changeEventIds: existing?.changeEventIds ?? [],
        affectedDomains: existing?.affectedDomains ?? ["editorial"],
      };
      bucket.set(key, candidate);
    }
  }

  const staleProducts = opts.listStaleResearchProducts?.() ?? [];
  for (const slug of staleProducts) {
    fromResearch += 1;
    const contentId = softwareContentId(slug);
    const key = String(contentId);
    const existing = bucket.get(key);
    bucket.set(key, {
      contentId,
      priority: existing?.priority ?? "normal",
      refreshStatus: "refresh-recommended",
      reasons: [...new Set([...(existing?.reasons ?? []), "research-stale"])],
      changeEventIds: [
        ...new Set([
          ...(existing?.changeEventIds ?? []),
          `research-stale-${slug}`,
        ]),
      ],
      affectedDomains: [
        ...new Set([...(existing?.affectedDomains ?? []), "editorial"]),
      ] as RefreshCandidate["affectedDomains"],
    });
  }

  let candidates = [...bucket.values()];
  if (opts.includePriceMonitorSignals !== false) {
    const feed = loadPriceMonitorGrowthFeed();
    if (feed?.signals?.length) {
      const beforeKeys = new Set(candidates.map((c) => String(c.contentId)));
      candidates = applyGrowthSignalsToRefreshCandidates(
        candidates,
        feed.signals,
      );
      fromPriceMonitor = candidates.filter(
        (c) =>
          !beforeKeys.has(String(c.contentId)) ||
          c.reasons.some((r) => r.includes("price-monitor")),
      ).length;
    }
  }

  if (opts.applyEnrichmentLanes !== false) {
    candidates = applyEnrichmentLanesToRefreshCandidates(candidates);
  }

  return {
    candidates,
    fromChangeEvents,
    fromStaleReview,
    fromResearch,
    fromPriceMonitor,
  };
}

function mergeCandidates(
  bucket: Map<string, RefreshCandidate>,
  candidates: RefreshCandidate[],
): void {
  for (const candidate of candidates) {
    const key = String(candidate.contentId);
    const existing = bucket.get(key);
    if (!existing) {
      bucket.set(key, candidate);
      continue;
    }
    bucket.set(key, {
      contentId: candidate.contentId,
      priority: maxPriority(existing.priority, candidate.priority),
      refreshStatus: candidate.refreshStatus,
      reasons: [...new Set([...existing.reasons, ...candidate.reasons])],
      changeEventIds: [
        ...new Set([...existing.changeEventIds, ...candidate.changeEventIds]),
      ],
      affectedDomains: [
        ...new Set([...existing.affectedDomains, ...candidate.affectedDomains]),
      ] as RefreshCandidate["affectedDomains"],
    });
  }
}
