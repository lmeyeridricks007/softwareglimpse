import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getComparisonBySlug,
  getSoftware,
  getSoftwareBySlug,
} from "@/data";
import type { Comparison } from "@/domain/schemas";
import { loadExternalEnrichmentEvidence } from "@/services/seo/enrichment-lanes";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import {
  buildSoftwareLookup,
  runCompareIndexAudit,
} from "@/services/seo/compare-index-worthiness";
import type { CompareIndexEvaluation } from "@/services/seo/compare-index-worthiness/types";
import { buildRelationshipEvidence } from "./evidence";
import { classifyManualReviewPair } from "./classify";
import { decideManualReviewAction } from "./decide";
import { resolveManualReviewThesis } from "./thesis";
import {
  COMPARE_MANUAL_REVIEW_VERSION,
  ENRICHABLE_CLASSES,
  type ManualReviewClass,
  type ManualReviewDecision,
  type ManualReviewReport,
  type ManualReviewReportSummary,
  type ManualReviewTriageResult,
} from "./types";

export type RunManualReviewOptions = {
  /** Limit how many MANUAL_REVIEW pages to triage (tests). */
  limit?: number;
  /** Precomputed audit evaluations (skip re-audit). */
  evaluations?: CompareIndexEvaluation[];
  /** Slugs that co-appear on best lists. */
  bestCoAppearance?: Set<string>;
};

function emptySummary(): ManualReviewReportSummary {
  const byClass = {
    DIRECT_COMPETITOR: 0,
    ALTERNATIVE: 0,
    CROSS_CATEGORY_DECISION: 0,
    SPECIALIST_VS_GENERALIST: 0,
    WEAK_RELATIONSHIP: 0,
    MISSING_DATA: 0,
    NONSENSICAL: 0,
  } satisfies Record<ManualReviewClass, number>;
  const byDecision = {
    ENQUEUE_ENRICHMENT: 0,
    LEAVE_IMPROVE_WITH_REMEDIATION: 0,
    BLOCK_PENDING_CATALOGUE: 0,
    PRESERVE_NOINDEX_REVIEW: 0,
    CANDIDATE_RETIRE_NOINDEX: 0,
  } satisfies Record<ManualReviewDecision, number>;
  return {
    totalReviewed: 0,
    byClass,
    byDecision,
    enqueueEnrichment: 0,
    leaveImprove: 0,
    blockCatalogue: 0,
    retireCandidates: 0,
    preserveReview: 0,
    appliedToImprove: 0,
    retainedManualReview: 0,
  };
}

function buildBestCoAppearance(comparisons: Comparison[]): Set<string> {
  const bestPages = getAllBestPagesUnfiltered();
  const co = new Set<string>();
  for (const page of bestPages) {
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

function demandForSlug(
  slug: string,
  gscByPath: Map<
    string,
    {
      impressions: number;
      clicks: number;
      position: number | null;
      hasDirectQuery?: boolean;
    }
  >,
  backlinksByPath: Map<string, number>,
  bestCo: Set<string>,
) {
  const path = `/compare/${slug}/`;
  const gsc =
    gscByPath.get(path) || gscByPath.get(`/compare/${slug}`) || null;
  return {
    gscImpressions: gsc?.impressions ?? 0,
    gscClicks: gsc?.clicks ?? 0,
    gscPosition: gsc?.position ?? null,
    gscHasDirectQuery: Boolean(gsc?.hasDirectQuery),
    knownBacklinks: backlinksByPath.get(path) ?? 0,
    bestListCoOccurrence: bestCo.has(slug),
  };
}

/**
 * Triage MANUAL_REVIEW / REVIEW_MANUALLY comparisons with evidence packs.
 */
export function runCompareManualReview(
  options: RunManualReviewOptions = {},
): ManualReviewReport {
  const soft = buildSoftwareLookup(getSoftware());
  const allComparisons = getAllComparisonsUnfiltered();
  const auditEvals =
    options.evaluations ?? runCompareIndexAudit().evaluations;

  const manual = auditEvals.filter(
    (e) =>
      e.lifecycle === "MANUAL_REVIEW" ||
      e.classification === "REVIEW_MANUALLY",
  );

  const limited =
    options.limit != null ? manual.slice(0, options.limit) : manual;

  const gscSignals = loadGscOpportunitySignalsByPath();
  const gscByPath = new Map<
    string,
    {
      impressions: number;
      clicks: number;
      position: number | null;
      hasDirectQuery?: boolean;
    }
  >();
  for (const [p, s] of gscSignals) {
    if (!p.includes("/compare/")) continue;
    gscByPath.set(p, {
      impressions: s.impressions,
      clicks: s.clicks,
      position: s.position,
      hasDirectQuery: s.hasDirectQuery,
    });
  }

  const external = loadExternalEnrichmentEvidence();
  const bestCo =
    options.bestCoAppearance ?? buildBestCoAppearance(allComparisons);

  const results: ManualReviewTriageResult[] = [];
  const summary = emptySummary();

  for (const evaluation of limited) {
    const comparison =
      allComparisons.find((c) => c.slug === evaluation.slug) ??
      getComparisonBySlug(evaluation.slug, { includeUnpublished: true });
    if (!comparison) continue;

    const demand = demandForSlug(
      evaluation.slug,
      gscByPath,
      external.backlinksByPath,
      bestCo,
    );
    if (
      evaluation.reasons.some((r) => r.toLowerCase().includes("best-of"))
    ) {
      demand.bestListCoOccurrence = true;
    }

    const evidence = buildRelationshipEvidence(comparison, soft, demand);
    let { classification, reasons } = classifyManualReviewPair(evidence);

    const productA = getSoftwareBySlug(evidence.productA);
    const productB = getSoftwareBySlug(evidence.productB);
    let thesis =
      productA && productB
        ? resolveManualReviewThesis(productA, productB, evidence)
        : null;

    // Enrichable classes require a specific evidence-backed thesis — otherwise
    // demote to WEAK (do not invent “both are powerful tools” framing).
    if (ENRICHABLE_CLASSES.has(classification) && !thesis) {
      reasons = [
        ...reasons,
        "Demoted to WEAK_RELATIONSHIP: no pair-specific buyer thesis from catalogue evidence",
      ];
      classification = "WEAK_RELATIONSHIP";
    }

    const { decision, remediation, retireEligible } = decideManualReviewAction(
      classification,
      evidence,
    );

    // Only attach thesis for enrichable / weak documentation — never for missing
    if (
      classification === "MISSING_DATA" ||
      (classification === "NONSENSICAL" && !retireEligible && !thesis)
    ) {
      thesis = null;
    }
    if (!ENRICHABLE_CLASSES.has(classification) && classification !== "WEAK_RELATIONSHIP") {
      // Keep disjoint-job thesis on nonsensical for audit transparency when present
      if (classification !== "NONSENSICAL") thesis = null;
    }

    const result: ManualReviewTriageResult = {
      slug: evaluation.slug,
      url: evaluation.url,
      productA: evidence.productA,
      productB: evidence.productB,
      classification,
      decision,
      evidence,
      thesis: ENRICHABLE_CLASSES.has(classification) || classification === "WEAK_RELATIONSHIP" || classification === "NONSENSICAL"
        ? thesis
        : null,
      remediation,
      reasons,
      retireEligible,
    };
    results.push(result);

    summary.totalReviewed += 1;
    summary.byClass[classification] += 1;
    summary.byDecision[decision] += 1;
    if (decision === "ENQUEUE_ENRICHMENT") summary.enqueueEnrichment += 1;
    if (decision === "LEAVE_IMPROVE_WITH_REMEDIATION") summary.leaveImprove += 1;
    if (decision === "BLOCK_PENDING_CATALOGUE") summary.blockCatalogue += 1;
    if (decision === "CANDIDATE_RETIRE_NOINDEX") summary.retireCandidates += 1;
    if (decision === "PRESERVE_NOINDEX_REVIEW") summary.preserveReview += 1;
  }

  results.sort(
    (a, b) =>
      b.evidence.evidenceScore - a.evidence.evidenceScore ||
      a.slug.localeCompare(b.slug),
  );

  return {
    version: COMPARE_MANUAL_REVIEW_VERSION,
    generatedAt: new Date().toISOString(),
    summary,
    results,
    enrichmentQueueSlugs: results
      .filter((r) => r.decision === "ENQUEUE_ENRICHMENT")
      .map((r) => r.slug),
    retireCandidates: results
      .filter((r) => r.retireEligible)
      .map((r) => r.slug),
    weakRelationshipSlugs: results
      .filter((r) => r.classification === "WEAK_RELATIONSHIP")
      .map((r) => r.slug),
    missingDataSlugs: results
      .filter((r) => r.classification === "MISSING_DATA")
      .map((r) => r.slug),
    nonsensicalSlugs: results
      .filter((r) => r.classification === "NONSENSICAL")
      .map((r) => r.slug),
  };
}
