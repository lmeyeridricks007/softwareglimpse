/**
 * Comparison search index-worthiness — types & classification labels.
 *
 * Search indexing is driven by lifecycle INDEXABLE (legacy KEEP_INDEX).
 * Weak / Cartesian pairs stay live under IMPROVE with temporary noindex
 * until remediated and promoted — not permanently classified as NOINDEX.
 */

import type {
  ContentLifecycleState,
  ImprovementReason,
  LifecycleSummaryCounts,
  RemediationRequirement,
} from "@/services/seo/content-lifecycle";

export const COMPARE_INDEX_WORTHINESS_VERSION = "2.0.0";

export type CompareIndexClass =
  | "KEEP_INDEX"
  | "IMPROVE"
  | "NOINDEX"
  | "MERGE"
  | "REDIRECT"
  | "REVIEW_MANUALLY";

export type CompareGateId =
  | "meaningful_relationship"
  | "content_data_completeness"
  | "minimum_differentiation"
  | "decision_guidance"
  | "canonical_validity"
  | "internal_discoverability";

export type CompareGateResult = {
  id: CompareGateId;
  passed: boolean;
  /** Soft fail → IMPROVE; hard fail → NOINDEX (when relationship/intent fails). */
  severity: "hard" | "soft";
  reasons: string[];
  score?: number;
};

export type CompareRelationshipKind =
  | "declared_competitor"
  | "declared_alternative"
  | "declared_comparable"
  | "data_backed_comparable"
  | "same_category_only"
  | "cross_category_undeclared"
  | "missing_product";

export type CompareIndexEvaluation = {
  slug: string;
  url: string;
  productA: string;
  productB: string;
  categorySlug: string | null;
  /** @deprecated Prefer `lifecycle` — kept for compatibility. */
  classification: CompareIndexClass;
  lifecycle: ContentLifecycleState;
  improvementReasons: ImprovementReason[];
  remediationRequirements: RemediationRequirement[];
  searchIndexable: boolean;
  readyForPromotion: boolean;
  gates: CompareGateResult[];
  relationshipKind: CompareRelationshipKind;
  metrics: ComparePageMetrics;
  failedGateIds: CompareGateId[];
  passedGateIds: CompareGateId[];
  reasons: string[];
  priorityScore: number;
  recommendedRedirect?: string | null;
  duplicateClusterId?: string | null;
};

export type ComparePageMetrics = {
  wordCount: number;
  uniqueContentRatio: number;
  comparedProductCount: number;
  featureDataCompleteness: number;
  pricingDataCompleteness: number;
  uniqueEditorialVerdict: boolean;
  bestForGuidance: boolean;
  productSpecificProsCons: boolean;
  outgoingInternalLinks: number;
  incomingInternalLinks: number;
  screenshotImageCount: number;
  productSpecificVisualEvidence: boolean;
  structuredDataPresent: boolean;
  uniqueTitle: boolean;
  titleQuality: "strong" | "adequate" | "weak" | "missing";
  uniqueMetaDescription: boolean;
  canonicalPresent: boolean;
  selfCanonical: boolean;
  indexDirective: "index" | "noindex";
  sitemapInclusion: boolean;
  genuineCompetitors: boolean;
  sharedCategoryOrUseCase: boolean;
  searchIntentPlausibility: "high" | "medium" | "low";
  duplicateNearDuplicateRisk: "high" | "medium" | "low";
  dataFreshnessDays: number | null;
  lastUpdated: string | null;
  completeOutcomeCount: number;
  outcomeCount: number;
  boilerplateOutcomeShare: number;
  thinMesh: boolean;
  qualityGateOk: boolean;
  qualityGateFailures: string[];
  seedIndexableFlag: boolean;
};

export type CompareAuditSummary = {
  total: number;
  byClass: Record<CompareIndexClass, number>;
  byLifecycle: LifecycleSummaryCounts;
  byCategory: Array<{ category: string; total: number; keepIndex: number; noindex: number; improve: number }>;
  contentCompleteness: {
    feature: { p25: number; p50: number; p75: number };
    pricing: { p25: number; p50: number; p75: number };
    uniqueRatio: { p25: number; p50: number; p75: number };
  };
  orphanCount: number;
  nearOrphanCount: number;
  duplicateClusterCount: number;
  searchIndexableCount: number;
  improvementQueueCount: number;
  readyForPromotionCount: number;
  manualReviewCount: number;
  retiredCount: number;
  potentialIndexableAfterRemediation: number;
  previouslySeedIndexableCount: number;
};

export type CompareAuditReport = {
  version: string;
  generatedAt: string;
  summary: CompareAuditSummary;
  evaluations: CompareIndexEvaluation[];
  orphans: string[];
  nearOrphans: string[];
  duplicateClusters: Array<{
    id: string;
    slugs: string[];
    risk: "high" | "medium" | "low";
    note: string;
  }>;
  topImprove: CompareIndexEvaluation[];
  readyForPromotion: CompareIndexEvaluation[];
  generationPolicy: {
    cartesianSameCategoryRequiresDeclaration: true;
    indexableRequiresKeepClass: true;
    preserveWeakPagesForRemediation: true;
  };
};
