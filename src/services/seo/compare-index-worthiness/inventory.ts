import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getSoftware,
} from "@/data";
import type { Comparison } from "@/domain/schemas";
import { getComparisonsForProduct } from "@/data";
import { normalizePath } from "@/seo/canonical";
import {
  emptyLifecycleSummaryCounts,
  type LifecycleSummaryCounts,
} from "@/services/seo/content-lifecycle";
import { buildSoftwareLookup } from "./relationship";
import { evaluateComparisonIndexWorthiness } from "./evaluate";
import type {
  CompareAuditReport,
  CompareAuditSummary,
  CompareIndexClass,
  CompareIndexEvaluation,
} from "./types";
import { COMPARE_INDEX_WORTHINESS_VERSION } from "./types";

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor((sorted.length - 1) * p)),
  );
  return sorted[idx]!;
}

function distribution(values: number[]): {
  p25: number;
  p50: number;
  p75: number;
} {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    p25: Number(percentile(sorted, 0.25).toFixed(3)),
    p50: Number(percentile(sorted, 0.5).toFixed(3)),
    p75: Number(percentile(sorted, 0.75).toFixed(3)),
  };
}

function buildBestCoAppearance(
  comparisons: Comparison[],
): Set<string> {
  const bestPages = getAllBestPagesUnfiltered();
  const co = new Set<string>();
  for (const page of bestPages) {
    // Ranked / awarded recommendations only — eligible pools are too broad
    // and would mark almost every same-category Cartesian as REVIEW_MANUALLY.
    const pool = new Set(page.recommendations.map((r) => r.productSlug));
    for (const cluster of page.useCaseRecommendations ?? []) {
      if (cluster.productSlug) pool.add(cluster.productSlug);
    }
    if (pool.size < 2) continue;
    for (const c of comparisons) {
      const [a, b] = c.productSlugs;
      if (a && b && pool.has(a) && pool.has(b)) {
        co.add(c.slug);
      }
    }
  }
  return co;
}

/**
 * Approximate inbound: each published product page can surface its comparisons.
 * Count how many of the two products exist (1–2) plus related-comparison backlinks
 * from peer comparisons (capped).
 */
function estimateInbound(comparison: Comparison): number {
  let count = 0;
  for (const slug of comparison.productSlugs) {
    const peers = getComparisonsForProduct(slug);
    if (peers.some((p) => p.slug === comparison.slug)) count += 1;
  }
  // Peer comparisons that list this slug in relatedAlternative / same products
  // are expensive to scan fully; product-page links are the primary signal.
  return count;
}

function estimateOutbound(comparison: Comparison): number {
  // Parent hub + category hub + 2 product pages + related compares (typical plan)
  return 4 + Math.min(comparison.productSlugs.length, 2);
}

function findDuplicateClusters(
  evaluations: CompareIndexEvaluation[],
): CompareAuditReport["duplicateClusters"] {
  // Cluster by low unique ratio + same category + shared boilerplate risk
  const byCat = new Map<string, CompareIndexEvaluation[]>();
  for (const e of evaluations) {
    if (e.metrics.duplicateNearDuplicateRisk === "low") continue;
    const key = e.categorySlug || "none";
    const list = byCat.get(key) ?? [];
    list.push(e);
    byCat.set(key, list);
  }
  const clusters: CompareAuditReport["duplicateClusters"] = [];
  let n = 0;
  for (const [cat, list] of byCat) {
    const high = list.filter(
      (e) =>
        e.metrics.duplicateNearDuplicateRisk === "high" &&
        e.metrics.uniqueContentRatio < 0.4,
    );
    if (high.length < 5) continue;
    n += 1;
    clusters.push({
      id: `dup-${cat}-${n}`,
      slugs: high
        .slice(0, 40)
        .map((e) => e.slug)
        .sort(),
      risk: "high",
      note: `${high.length} ${cat} comparisons with high template/boilerplate risk`,
    });
  }
  return clusters;
}

export function runCompareIndexAudit(
  comparisons: Comparison[] = getAllComparisonsUnfiltered(),
): CompareAuditReport {
  const soft = buildSoftwareLookup(getSoftware());
  const coAppear = buildBestCoAppearance(comparisons);
  const evaluations: CompareIndexEvaluation[] = [];

  for (const comparison of comparisons) {
    const inbound = estimateInbound(comparison);
    const outbound = estimateOutbound(comparison);
    evaluations.push(
      evaluateComparisonIndexWorthiness(comparison, {
        soft,
        inboundCount: inbound,
        outboundCount: outbound,
        screenshotCount: 0,
        hasProsCons: true,
        structuredDataPresent: true,
        coAppearOnBestPage: coAppear.has(comparison.slug),
      }),
    );
  }

  const duplicateClusters = findDuplicateClusters(evaluations);
  const clusterBySlug = new Map<string, string>();
  for (const cluster of duplicateClusters) {
    for (const slug of cluster.slugs) {
      clusterBySlug.set(slug, cluster.id);
    }
  }
  for (const e of evaluations) {
    const id = clusterBySlug.get(e.slug);
    if (id) e.duplicateClusterId = id;
  }

  const byClass = {
    KEEP_INDEX: 0,
    IMPROVE: 0,
    NOINDEX: 0,
    MERGE: 0,
    REDIRECT: 0,
    REVIEW_MANUALLY: 0,
  } satisfies Record<CompareIndexClass, number>;
  const byLifecycle: LifecycleSummaryCounts = emptyLifecycleSummaryCounts();
  for (const e of evaluations) {
    byClass[e.classification] += 1;
    byLifecycle[e.lifecycle] += 1;
  }

  const catMap = new Map<
    string,
    { total: number; keepIndex: number; noindex: number; improve: number }
  >();
  for (const e of evaluations) {
    const cat = e.categorySlug || "none";
    const row = catMap.get(cat) ?? {
      total: 0,
      keepIndex: 0,
      noindex: 0,
      improve: 0,
    };
    row.total += 1;
    if (e.lifecycle === "INDEXABLE" || e.classification === "KEEP_INDEX") {
      row.keepIndex += 1;
    }
    if (!e.searchIndexable) row.noindex += 1;
    if (
      e.lifecycle === "IMPROVE" ||
      e.lifecycle === "IMPROVING" ||
      e.classification === "IMPROVE"
    ) {
      row.improve += 1;
    }
    catMap.set(cat, row);
  }

  const orphans = evaluations
    .filter((e) => e.metrics.incomingInternalLinks === 0)
    .map((e) => e.url);
  const nearOrphans = evaluations
    .filter((e) => e.metrics.incomingInternalLinks === 1)
    .map((e) => e.url);

  const improvementQueueCount =
    byLifecycle.IMPROVE + byLifecycle.IMPROVING;
  const readyForPromotionCount =
    byLifecycle.INDEXABLE_READY + byLifecycle.READY_FOR_REVIEW;
  const manualReviewCount = byLifecycle.MANUAL_REVIEW;
  const retiredCount = byLifecycle.RETIRED;
  const potentialIndexableAfterRemediation =
    improvementQueueCount + readyForPromotionCount + manualReviewCount;

  const summary: CompareAuditSummary = {
    total: evaluations.length,
    byClass,
    byLifecycle,
    byCategory: [...catMap.entries()]
      .map(([category, row]) => ({ category, ...row }))
      .sort((a, b) => b.total - a.total),
    contentCompleteness: {
      feature: distribution(
        evaluations.map((e) => e.metrics.featureDataCompleteness),
      ),
      pricing: distribution(
        evaluations.map((e) => e.metrics.pricingDataCompleteness),
      ),
      uniqueRatio: distribution(
        evaluations.map((e) => e.metrics.uniqueContentRatio),
      ),
    },
    orphanCount: orphans.length,
    nearOrphanCount: nearOrphans.length,
    duplicateClusterCount: duplicateClusters.length,
    searchIndexableCount: byLifecycle.INDEXABLE,
    improvementQueueCount,
    readyForPromotionCount,
    manualReviewCount,
    retiredCount,
    potentialIndexableAfterRemediation,
    previouslySeedIndexableCount: evaluations.filter(
      (e) => e.metrics.seedIndexableFlag,
    ).length,
  };

  const topImprove = evaluations
    .filter(
      (e) =>
        e.lifecycle === "IMPROVE" ||
        e.lifecycle === "IMPROVING" ||
        e.lifecycle === "MANUAL_REVIEW" ||
        e.classification === "IMPROVE" ||
        e.classification === "REVIEW_MANUALLY",
    )
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 100);

  const readyForPromotion = evaluations
    .filter((e) => e.lifecycle === "INDEXABLE_READY" || e.readyForPromotion)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    version: COMPARE_INDEX_WORTHINESS_VERSION,
    generatedAt: new Date().toISOString(),
    summary,
    evaluations: evaluations.sort((a, b) => a.slug.localeCompare(b.slug)),
    orphans,
    nearOrphans,
    duplicateClusters,
    topImprove,
    readyForPromotion,
    generationPolicy: {
      cartesianSameCategoryRequiresDeclaration: true,
      indexableRequiresKeepClass: true,
      preserveWeakPagesForRemediation: true,
    },
  };
}

export function normalizeComparePath(slug: string): string {
  return normalizePath(`/compare/${slug}/`);
}
