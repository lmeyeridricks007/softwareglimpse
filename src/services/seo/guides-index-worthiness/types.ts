/**
 * Guides search index-worthiness — types & classification labels.
 *
 * Search indexing (sitemap + robots index) is driven by lifecycle INDEXABLE
 * (legacy KEEP_INDEX). Weak pages stay live under IMPROVE with temporary
 * noindex until remediated and promoted — NOINDEX is not a permanent
 * business classification.
 */

import type {
  ContentLifecycleState,
  ImprovementReason,
  LifecycleSummaryCounts,
  RemediationRequirement,
} from "@/services/seo/content-lifecycle";

export const GUIDES_INDEX_WORTHINESS_VERSION = "2.2.0";

export type GuideIndexClass =
  | "KEEP_INDEX"
  | "IMPROVE"
  | "NOINDEX"
  | "MERGE"
  | "REMOVE"
  | "REVIEW_MANUALLY";

export type GuideAuditType =
  | "buying-guide"
  | "how-to"
  | "pricing-guide"
  | "software-selection"
  | "migration-guide"
  | "industry-guide"
  | "use-case-guide"
  | "educational-explainer"
  | "methodology"
  | "trend-research"
  | "product-pack-factory"
  | "product-explainer"
  | "comparison-education"
  | "checklist"
  | "implementation-guide"
  | "other";

export type GuideGateId =
  | "distinct_search_intent"
  | "content_substance"
  | "unique_analysis"
  | "internal_discoverability"
  | "canonical_validity"
  | "editorial_completeness"
  | "not_factory_boilerplate";

export type GuideGateResult = {
  id: GuideGateId;
  passed: boolean;
  severity: "hard" | "soft";
  reasons: string[];
  score?: number;
};

export type GuidePageMetrics = {
  wordCount: number;
  uniqueContentRatio: number;
  guideType: GuideAuditType;
  topicType: string;
  journeyStage: string;
  categorySlug: string | null;
  productSlugCount: number;
  meaningfulProductReferences: number;
  blockCount: number;
  sectionCount: number;
  faqCount: number;
  checklistCount: number;
  hasHeroVisual: boolean;
  hasSupports: boolean;
  hasNextAction: boolean;
  relatedGuideCount: number;
  outgoingInternalLinks: number;
  incomingInternalLinks: number;
  uniqueTitle: boolean;
  titleQuality: "strong" | "adequate" | "weak" | "missing";
  uniqueMetaDescription: boolean;
  canonicalPresent: boolean;
  selfCanonical: boolean;
  indexDirective: "index" | "noindex";
  sitemapInclusion: boolean;
  structuredDataPresent: boolean;
  authorAttribution: boolean;
  uniqueAnalysisPresent: boolean;
  originalResearchPresent: boolean;
  tablesOrDataPresent: boolean;
  imagesOrScreenshots: number;
  contentCompleteness: number;
  staleDataRisk: "high" | "medium" | "low";
  dataFreshnessDays: number | null;
  lastUpdated: string | null;
  publishedAt: string | null;
  duplicateNearDuplicateRisk: "high" | "medium" | "low";
  duplicateIntentRisk: "high" | "medium" | "low";
  factoryPackKind: string | null;
  qualityGateOk: boolean;
  qualityGateFailures: string[];
  seedIndexableFlag: boolean;
};

export type GuideIndexEvaluation = {
  slug: string;
  url: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** @deprecated Prefer `lifecycle` — kept for compatibility. */
  classification: GuideIndexClass;
  lifecycle: ContentLifecycleState;
  improvementReasons: ImprovementReason[];
  remediationRequirements: RemediationRequirement[];
  searchIndexable: boolean;
  /** True when quality gates pass but page is not yet index/sitemap eligible. */
  readyForPromotion: boolean;
  guideType: GuideAuditType;
  targetIntent: string;
  primaryTopic: string;
  categorySlug: string | null;
  gates: GuideGateResult[];
  metrics: GuidePageMetrics;
  failedGateIds: GuideGateId[];
  passedGateIds: GuideGateId[];
  reasons: string[];
  priorityScore: number;
  recommendedRedirect?: string | null;
  duplicateClusterId?: string | null;
  intentClusterRole?: "PRIMARY" | "MERGE_INTO_PRIMARY" | "KEEP_DISTINCT" | null;
  intentClusterId?: string | null;
};

/**
 * Factory-origin inventory vs quality. Origin total is history — it does
 * not fall when a pack becomes excellent. Remediation KPIs are the rest.
 */
export type FactoryRemediationKpis = {
  /** FACTORY_ORIGIN_TOTAL — existing pages created from factory families. */
  originTotal: number;
  /** FACTORY_HIGH_RISK — factory-origin currently failing semantic uniqueness. */
  highRisk: number;
  /** FACTORY_LIMITED_UNIQUE — factory-origin lacking sufficient unique analysis. */
  limitedUnique: number;
  /** FACTORY_QUALITY_PASS — factory-origin passing the current quality gate. */
  qualityPass: number;
  /** FACTORY_INDEXABLE — factory-origin legitimately INDEXABLE. */
  indexable: number;
  /** FACTORY_IMPROVE — factory-origin still IMPROVE / IMPROVING. */
  improve: number;
  /** FACTORY_PROMOTED — factory-origin promoted after remediation (= INDEXABLE). */
  promoted: number;
};

export type GuideAuditSummary = {
  total: number;
  byClass: Record<GuideIndexClass, number>;
  byLifecycle: LifecycleSummaryCounts;
  byGuideType: Array<{ type: GuideAuditType; total: number; keepIndex: number }>;
  byCategory: Array<{
    category: string;
    total: number;
    keepIndex: number;
    noindex: number;
    improve: number;
  }>;
  orphanCount: number;
  nearOrphanCount: number;
  duplicateClusterCount: number;
  intentClusterCount: number;
  searchIndexableCount: number;
  improvementQueueCount: number;
  readyForPromotionCount: number;
  manualReviewCount: number;
  retiredCount: number;
  potentialIndexableAfterRemediation: number;
  previouslySeedIndexableCount: number;
  /**
   * Inventory alias of `factoryKpis.originTotal`.
   * Slug-class factory product packs — NOT a quality KPI. Do not treat
   * a stable 1272 as remediation failure.
   */
  factoryPackCount: number;
  /** Estate-wide (factory + non-factory) high-near-duplicate-risk reason. */
  highNearDuplicateRiskCount: number;
  /** Estate-wide (factory + non-factory) limited-unique-analysis-signals. */
  limitedUniqueAnalysisCount: number;
  /**
   * Factory-origin remediation KPIs. Origin total is inventory/history.
   * HIGH_RISK ↓, LIMITED_UNIQUE ↓, QUALITY_PASS ↑, INDEXABLE ↑, IMPROVE ↓.
   */
  factoryKpis: FactoryRemediationKpis;
  uniqueRatio: { p25: number; p50: number; p75: number };
  wordCount: { p25: number; p50: number; p75: number };
};

export type GuideAuditReport = {
  version: string;
  generatedAt: string;
  summary: GuideAuditSummary;
  evaluations: GuideIndexEvaluation[];
  orphans: string[];
  nearOrphans: string[];
  duplicateClusters: Array<{
    id: string;
    slugs: string[];
    risk: "high" | "medium" | "low";
    note: string;
  }>;
  intentClusters: Array<{
    id: string;
    primarySlug: string;
    members: Array<{
      slug: string;
      role: "PRIMARY" | "MERGE_INTO_PRIMARY" | "KEEP_DISTINCT" | "REVIEW_MANUALLY";
    }>;
    note: string;
  }>;
  proposedMerges: Array<{
    from: string;
    into: string;
    reason: string;
    confidence: "high" | "medium" | "low";
  }>;
  proposedRedirects: Array<{
    from: string;
    to: string;
    reason: string;
  }>;
  topImprove: GuideIndexEvaluation[];
  readyForPromotion: GuideIndexEvaluation[];
  weakGuides: GuideIndexEvaluation[];
  generationPolicy: {
    factoryProductPacksDefaultNoindex: true;
    indexableRequiresKeepClass: true;
    preserveWeakPagesForRemediation: true;
  };
};
