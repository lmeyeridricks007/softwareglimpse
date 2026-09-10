import type { Comparison } from "@/domain/schemas";
import {
  evaluateComparisonQuality,
} from "@/domain/quality-gates";
import {
  isCanonicalComparisonSlug,
  canonicalizeComparisonSlug,
} from "@/domain/comparison-slug";
import { isThinComparisonMesh } from "@/services/comparison-research/distinctive-research";
import {
  effectiveSeoIndexable,
  getLifecycleOverrideState,
  improvementReasonsFromCompareGates,
  remediationForReasons,
  resolveLifecycleState,
} from "@/services/seo/content-lifecycle";
import {
  hasIndexableRelationship,
  resolveComparisonRelationship,
  type SoftLookup,
} from "./relationship";
import { estimateUniqueContentRatio, titleQualityFor } from "./uniqueness";
import type {
  CompareGateResult,
  CompareIndexClass,
  CompareIndexEvaluation,
  ComparePageMetrics,
} from "./types";

export type EvaluateCompareOptions = {
  soft: SoftLookup;
  /** Inbound internal links to `/compare/{slug}/` (content graph). */
  inboundCount?: number;
  /** Outbound internal links from the comparison plan. */
  outboundCount?: number;
  /** Screenshot / image count from page model when available. */
  screenshotCount?: number;
  /** Pros/cons present on composed page model. */
  hasProsCons?: boolean;
  /** Structured data emitted (WebPage + Breadcrumb at minimum). */
  structuredDataPresent?: boolean;
  /** Duplicate cluster id when near-duplicate of another pair page. */
  duplicateClusterId?: string | null;
  /** Recommended redirect target for MERGE/REDIRECT. */
  recommendedRedirect?: string | null;
  /** Products appear together on a best-of / shortlist page. */
  coAppearOnBestPage?: boolean;
};

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
}

function featureCompleteness(comparison: Comparison): number {
  const outcomes = comparison.outcomes ?? [];
  const criteria = comparison.criterionSlugs?.length
    ? comparison.criterionSlugs.length
    : Math.max(outcomes.length, 1);
  const complete = outcomes.filter(
    (o) => o.researchStatus === "complete" && Boolean(o.reason?.trim()),
  ).length;
  return Math.min(1, complete / Math.max(criteria, 1));
}

function pricingCompleteness(comparison: Comparison): number {
  if (comparison.pricingNotes?.trim()) return 1;
  return 0;
}

function searchIntentFromRelationship(
  kind: ReturnType<typeof resolveComparisonRelationship>["kind"],
  coAppearOnBestPage: boolean,
): "high" | "medium" | "low" {
  if (
    kind === "declared_competitor" ||
    kind === "declared_alternative" ||
    kind === "declared_comparable"
  ) {
    return "high";
  }
  if (kind === "data_backed_comparable") return "medium";
  if (coAppearOnBestPage && kind === "same_category_only") return "medium";
  if (kind === "same_category_only") return "low";
  return "low";
}

function buildMetrics(
  comparison: Comparison,
  opts: EvaluateCompareOptions,
  relationship: ReturnType<typeof resolveComparisonRelationship>,
): ComparePageMetrics {
  const uniq = estimateUniqueContentRatio(comparison);
  const quality = evaluateComparisonQuality(comparison);
  const [a, b] = comparison.productSlugs;
  const title = comparison.seo.title || comparison.title;
  const canonicalPath =
    comparison.seo.canonicalPath || `/compare/${comparison.slug}/`;
  const expectedCanonical = `/compare/${canonicalizeComparisonSlug(comparison.productSlugs)}/`;
  const thin = isThinComparisonMesh(comparison);
  const intent = searchIntentFromRelationship(
    relationship.kind,
    Boolean(opts.coAppearOnBestPage),
  );
  const dupRisk: ComparePageMetrics["duplicateNearDuplicateRisk"] =
    uniq.boilerplateOutcomeShare >= 0.5 || uniq.ratio < 0.35
      ? "high"
      : uniq.ratio < 0.5
        ? "medium"
        : "low";

  const seedIndexable = comparison.seo.indexable === true;
  const wouldKeep =
    hasIndexableRelationship(relationship.kind) &&
    quality.ok &&
    !thin &&
    uniq.ratio >= 0.35;

  return {
    wordCount: uniq.wordCount,
    uniqueContentRatio: Number(uniq.ratio.toFixed(3)),
    comparedProductCount: comparison.productSlugs.length,
    featureDataCompleteness: Number(featureCompleteness(comparison).toFixed(3)),
    pricingDataCompleteness: Number(pricingCompleteness(comparison).toFixed(3)),
    uniqueEditorialVerdict: Boolean(comparison.verdict?.trim()),
    bestForGuidance:
      (comparison.bestFor?.some((bf) => (bf.scenarios?.length ?? 0) > 0) ??
        false) ||
      (comparison.scenarioRecommendations?.length ?? 0) > 0,
    productSpecificProsCons: Boolean(opts.hasProsCons),
    outgoingInternalLinks: opts.outboundCount ?? 0,
    incomingInternalLinks: opts.inboundCount ?? 0,
    screenshotImageCount: opts.screenshotCount ?? 0,
    productSpecificVisualEvidence: (opts.screenshotCount ?? 0) > 0,
    structuredDataPresent: opts.structuredDataPresent ?? true,
    uniqueTitle: Boolean(title?.trim()),
    titleQuality: titleQualityFor(title, a ?? "", b ?? ""),
    uniqueMetaDescription: Boolean(comparison.seo.description?.trim()),
    canonicalPresent: Boolean(comparison.seo.canonicalPath || comparison.slug),
    selfCanonical: canonicalPath === expectedCanonical,
    indexDirective: wouldKeep ? "index" : "noindex",
    sitemapInclusion: wouldKeep,
    genuineCompetitors: relationship.genuineCompetitors,
    sharedCategoryOrUseCase: relationship.sharedCategoryOrUseCase,
    searchIntentPlausibility: intent,
    duplicateNearDuplicateRisk: dupRisk,
    dataFreshnessDays: daysSince(
      comparison.metadata.updatedAt || comparison.metadata.publishedAt,
    ),
    lastUpdated:
      comparison.metadata.updatedAt || comparison.metadata.publishedAt || null,
    completeOutcomeCount: (comparison.outcomes ?? []).filter(
      (o) => o.researchStatus === "complete" && o.reason?.trim(),
    ).length,
    outcomeCount: comparison.outcomes?.length ?? 0,
    boilerplateOutcomeShare: Number(uniq.boilerplateOutcomeShare.toFixed(3)),
    thinMesh: thin,
    qualityGateOk: quality.ok,
    qualityGateFailures: quality.failures,
    seedIndexableFlag: seedIndexable,
  };
}

function runGates(
  comparison: Comparison,
  metrics: ComparePageMetrics,
  relationship: ReturnType<typeof resolveComparisonRelationship>,
  opts: EvaluateCompareOptions,
): CompareGateResult[] {
  const gates: CompareGateResult[] = [];

  // 1. Meaningful product relationship
  const relOk = hasIndexableRelationship(relationship.kind);
  gates.push({
    id: "meaningful_relationship",
    passed: relOk,
    severity: "hard",
    score: relOk ? 1 : 0,
    reasons: relationship.reasons,
  });

  // 2. Content / data completeness
  const completenessOk =
    metrics.qualityGateOk &&
    metrics.featureDataCompleteness >= 0.5 &&
    metrics.pricingDataCompleteness >= 0.5;
  const completenessSoft =
    metrics.qualityGateOk && metrics.featureDataCompleteness >= 0.35;
  gates.push({
    id: "content_data_completeness",
    passed: completenessOk,
    severity: completenessSoft ? "soft" : "hard",
    score: metrics.featureDataCompleteness,
    reasons: [
      ...metrics.qualityGateFailures.map((f) => `quality:${f}`),
      `featureCompleteness=${metrics.featureDataCompleteness}`,
      `pricingCompleteness=${metrics.pricingDataCompleteness}`,
    ],
  });

  // 3. Minimum differentiation
  const diffOk =
    !metrics.thinMesh &&
    metrics.uniqueContentRatio >= 0.35 &&
    metrics.boilerplateOutcomeShare < 0.55;
  gates.push({
    id: "minimum_differentiation",
    passed: diffOk,
    severity: "hard",
    score: metrics.uniqueContentRatio,
    reasons: [
      metrics.thinMesh ? "thin-comparison-mesh" : "mesh-ok",
      `uniqueContentRatio=${metrics.uniqueContentRatio}`,
      `boilerplateOutcomeShare=${metrics.boilerplateOutcomeShare}`,
    ],
  });

  // 4. Decision guidance
  const guidanceOk =
    metrics.uniqueEditorialVerdict && metrics.bestForGuidance;
  gates.push({
    id: "decision_guidance",
    passed: guidanceOk,
    severity: "soft",
    score: guidanceOk ? 1 : 0.3,
    reasons: [
      metrics.uniqueEditorialVerdict ? "verdict-present" : "missing-verdict",
      metrics.bestForGuidance ? "best-for-present" : "missing-best-for",
    ],
  });

  // 5. Canonical validity
  const canonOk =
    isCanonicalComparisonSlug(comparison.slug) && metrics.selfCanonical;
  gates.push({
    id: "canonical_validity",
    passed: canonOk,
    severity: "soft",
    reasons: [
      isCanonicalComparisonSlug(comparison.slug)
        ? "canonical-slug"
        : "non-canonical-slug",
      metrics.selfCanonical ? "self-canonical" : "canonical-mismatch",
    ],
  });

  // 6. Internal discoverability
  // Declared relationships imply intentional IA; otherwise require inbound ≥ 1
  // from somewhere other than pure hope (product pages always can link).
  const inbound = opts.inboundCount ?? 0;
  const discoverOk =
    relOk || inbound >= 1 || Boolean(opts.coAppearOnBestPage);
  gates.push({
    id: "internal_discoverability",
    passed: discoverOk,
    severity: "soft",
    score: inbound,
    reasons: [
      `inbound=${inbound}`,
      relOk ? "relationship-implies-ia" : "no-declared-relationship",
    ],
  });

  return gates;
}

function classifyFromGates(
  gates: CompareGateResult[],
  metrics: ComparePageMetrics,
  relationship: ReturnType<typeof resolveComparisonRelationship>,
  opts: EvaluateCompareOptions,
): { classification: CompareIndexClass; reasons: string[] } {
  const reasons: string[] = [];
  const hardFails = gates.filter((g) => !g.passed && g.severity === "hard");
  const softFails = gates.filter((g) => !g.passed && g.severity === "soft");
  const relGate = gates.find((g) => g.id === "meaningful_relationship");

  if (opts.recommendedRedirect && opts.duplicateClusterId) {
    reasons.push("Near-duplicate of a stronger comparison");
    return { classification: "MERGE", reasons };
  }

  if (!relGate?.passed) {
    // Same-category Cartesian without declaration → preserve for UX; improve queue
    if (
      relationship.kind === "same_category_only" ||
      relationship.kind === "cross_category_undeclared"
    ) {
      reasons.push(...(relGate?.reasons ?? []));
      if (opts.coAppearOnBestPage && metrics.qualityGateOk && !metrics.thinMesh) {
        reasons.push(
          "Co-appears on a best-of shortlist — editorial review before indexing",
        );
        return { classification: "REVIEW_MANUALLY", reasons };
      }
      return { classification: "IMPROVE", reasons };
    }
    reasons.push(...(relGate?.reasons ?? ["relationship-failed"]));
    return { classification: "IMPROVE", reasons };
  }

  if (hardFails.length > 0) {
    reasons.push(...hardFails.flatMap((g) => g.reasons));
    if (metrics.searchIntentPlausibility === "high" && metrics.qualityGateOk) {
      return { classification: "IMPROVE", reasons };
    }
    // Remediable quality gaps — preserve URL, queue improvement (not permanent NOINDEX)
    return { classification: "IMPROVE", reasons };
  }

  if (softFails.length > 0) {
    reasons.push(...softFails.flatMap((g) => g.reasons));
    return { classification: "IMPROVE", reasons };
  }

  reasons.push("All index-worthiness gates passed");
  return { classification: "KEEP_INDEX", reasons };
}

function priorityScore(
  classification: CompareIndexClass,
  metrics: ComparePageMetrics,
): number {
  const base: Record<CompareIndexClass, number> = {
    KEEP_INDEX: 90,
    IMPROVE: 70,
    REVIEW_MANUALLY: 75,
    MERGE: 40,
    REDIRECT: 30,
    NOINDEX: 10,
  };
  return (
    base[classification] +
    metrics.uniqueContentRatio * 10 +
    metrics.featureDataCompleteness * 5 +
    Math.min(metrics.incomingInternalLinks, 5)
  );
}

/**
 * Evaluate one comparison for search index-worthiness.
 * Does not mutate the entity — callers apply searchIndexable via quality-gates.
 */
export function evaluateComparisonIndexWorthiness(
  comparison: Comparison,
  opts: EvaluateCompareOptions,
): CompareIndexEvaluation {
  const relationship = resolveComparisonRelationship(comparison, opts.soft);
  const metrics = buildMetrics(comparison, opts, relationship);
  const gates = runGates(comparison, metrics, relationship, opts);
  const { classification, reasons } = classifyFromGates(
    gates,
    metrics,
    relationship,
    opts,
  );

  const failedGateIds = gates.filter((g) => !g.passed).map((g) => g.id);
  const passedGateIds = gates.filter((g) => g.passed).map((g) => g.id);

  const improvementReasons =
    classification === "KEEP_INDEX"
      ? []
      : improvementReasonsFromCompareGates({
          failedGateIds,
          relationshipKind: relationship.kind,
          thinMesh: metrics.thinMesh,
          staleDays: metrics.dataFreshnessDays,
        });
  const remediationRequirements = remediationForReasons(improvementReasons);

  const qualityPasses = classification === "KEEP_INDEX";
  const seedOrPromotedIndexable = effectiveSeoIndexable(
    "comparison",
    comparison.slug,
    comparison.seo.indexable === true,
  );
  const lifecycle = resolveLifecycleState({
    legacyClassification: classification,
    qualityPasses,
    seedOrPromotedIndexable,
    registryLifecycle: getLifecycleOverrideState("comparison", comparison.slug),
  });

  // IMPROVE / REVIEW remain noindex until remediated + promoted
  const searchIndexable = lifecycle === "INDEXABLE";
  const readyForPromotion = lifecycle === "INDEXABLE_READY";
  metrics.indexDirective = searchIndexable ? "index" : "noindex";
  metrics.sitemapInclusion = searchIndexable;

  return {
    slug: comparison.slug,
    url: `/compare/${comparison.slug}/`,
    productA: comparison.productSlugs[0] ?? "",
    productB: comparison.productSlugs[1] ?? "",
    categorySlug: comparison.categorySlug ?? null,
    classification,
    lifecycle,
    improvementReasons,
    remediationRequirements,
    searchIndexable,
    readyForPromotion,
    gates,
    relationshipKind: relationship.kind,
    metrics: {
      ...metrics,
      indexDirective: searchIndexable ? "index" : "noindex",
      sitemapInclusion: searchIndexable,
    },
    failedGateIds,
    passedGateIds,
    reasons,
    priorityScore: priorityScore(classification, metrics),
    recommendedRedirect: opts.recommendedRedirect ?? null,
    duplicateClusterId: opts.duplicateClusterId ?? null,
  };
}
