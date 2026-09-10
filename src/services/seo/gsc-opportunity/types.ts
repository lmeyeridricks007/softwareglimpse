/**
 * GSC Opportunity Engine — analysis-only types.
 * Never mutates production content, canonicals, or robots.
 */

export const GSC_OPPORTUNITY_ENGINE_VERSION = "3.1.0";

/**
 * How a page↔query relationship was established.
 * INFERRED_* are never interchangeable with DIRECT_GSC for auto-rewrites.
 */
export const QueryRelationshipSourceSchema = [
  "DIRECT_GSC",
  "HISTORICAL_DIRECT_GSC",
  "INFERRED_HIGH",
  "INFERRED_MEDIUM",
  "INFERRED_LOW",
  "UNKNOWN",
] as const;

export type QueryRelationshipSource =
  (typeof QueryRelationshipSourceSchema)[number];

/** @deprecated Prefer relationshipSource — kept for feed/report compatibility. */
export const QueryProvenanceSchema = [
  "DIRECT_GSC",
  "HISTORICAL_DIRECT_GSC",
  "INFERRED",
  "UNKNOWN",
] as const;

export type QueryProvenance = (typeof QueryProvenanceSchema)[number];

export const QueryMappingConfidenceSchema = [
  "UNKNOWN",
  "LOW",
  "MEDIUM",
  "HIGH",
] as const;

export type QueryMappingConfidence =
  (typeof QueryMappingConfidenceSchema)[number];

/** Whether query-specific actions may drive automated rewrites. */
export const ActionConfidenceSchema = [
  /** Direct page×query evidence — may auto-apply query-scoped actions. */
  "EVIDENCED",
  /** INFERRED_HIGH only — recommend query actions but require human review. */
  "REVIEW_REQUIRED",
  /** INFERRED_MEDIUM / INFERRED_LOW — must not rewrite from target query. */
  "SUPPRESSED",
  /** Page-level metrics only; no trusted target query. */
  "PAGE_LEVEL",
] as const;

export type ActionConfidence = (typeof ActionConfidenceSchema)[number];

export type QueryRelationshipEvidence = {
  label: string;
  detail?: string;
};

export type QuerySourceDateRange = {
  startDate: string | null;
  endDate: string | null;
};
export const GscRootCauseSchema = [
  "TITLE_WEAK",
  "INTENT_MISMATCH",
  "THIN_CONTENT",
  "GENERIC_CONTENT",
  "NO_UNIQUE_VERDICT",
  "PRICING_MISSING",
  "OUTDATED",
  "WEAK_INTERNAL_LINKS",
  "LOW_INBOUND_LINKS",
  "CANNIBALIZATION",
  "POSSIBLE_INTENT_OVERLAP",
  "POOR_CTR",
  "WEAK_ABOVE_THE_FOLD",
  "NO_SCREENSHOTS",
  "NO_EDITORIAL_EVIDENCE",
  "MISSING_SCHEMA",
  "WEAK_META_DESCRIPTION",
  "DUPLICATE_TEMPLATE_CONTENT",
  "OTHER",
] as const;

export type GscRootCause = (typeof GscRootCauseSchema)[number];

export const GscActionTypeSchema = [
  /** Page-level title fix from TITLE_WEAK / POOR_CTR — no target query required. */
  "OPTIMIZE_TITLE",
  /** Query-scoped title rewrite — DIRECT_GSC / HISTORICAL only for auto-apply. */
  "OPTIMIZE_TITLE_FOR_QUERY",
  /** Query-scoped H1 rewrite — DIRECT_GSC / HISTORICAL only for auto-apply. */
  "REWRITE_H1_FOR_QUERY",
  "OPTIMIZE_META",
  "IMPROVE_INTRO",
  "ADD_UNIQUE_ANALYSIS",
  "ADD_PRICING",
  "ADD_SCREENSHOTS",
  "ADD_COMPARISON_DATA",
  "ADD_INTERNAL_LINKS",
  /** Query-scoped intent remediation — requires direct query evidence to auto-apply. */
  "SEARCH_INTENT_MISMATCH",
  /** Confirmed multi-URL same-query consolidation — DIRECT_GSC only. */
  "QUERY_CLUSTER_CONSOLIDATION",
  /** @deprecated Prefer SEARCH_INTENT_MISMATCH */
  "FIX_INTENT_MATCH",
  /** @deprecated Prefer QUERY_CLUSTER_CONSOLIDATION */
  "CONSOLIDATE",
  "REFRESH_CONTENT",
  "ADD_EDITORIAL_EVIDENCE",
  "BUILD_LINKS",
  "ENRICH_AND_PROMOTE",
  "NO_ACTION",
  "MANUAL_REVIEW",
] as const;

export type GscActionType = (typeof GscActionTypeSchema)[number];

export type GscCommercialIntent =
  | "transactional"
  | "commercial_investigation"
  | "comparison"
  | "review"
  | "pricing"
  | "alternatives"
  | "buying_guide"
  | "informational"
  | "navigational_brand"
  | "low_value";

export type GscDifficulty = "LOW" | "MEDIUM" | "HIGH";

export type GscContentChangeMode = "adjust" | "rewrite" | "none";

export type ExclusionReason =
  | "legacy_locale"
  | "locale_redirect"
  | "taxonomy_junk"
  | "utility_route"
  | "redirect_source"
  | "noindex"
  | "removed_410"
  | "removed_404"
  | "author_archive"
  | "feed"
  | "unmapped_fragment"
  | "below_impression_floor";

export type GscPageMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type MappedQuery = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  intent: GscCommercialIntent;
  matchScore: number;
  clusterKey: string;
  relationshipSource: QueryRelationshipSource;
  /** @deprecated Prefer relationshipSource */
  provenance: QueryProvenance;
  confidence: QueryMappingConfidence;
  /** @deprecated Prefer confidence */
  mappingConfidence: QueryMappingConfidence;
  reason: string;
  /** @deprecated Prefer reason */
  mappingReason: string;
  evidence: QueryRelationshipEvidence[];
  sourceDateRange: QuerySourceDateRange;
};

/** Heuristic candidate when page×query matrix is absent — never pretend this is GSC. */
export type InferredQueryCandidate = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  intent: GscCommercialIntent;
  matchScore: number;
  clusterKey: string;
  relationshipSource: QueryRelationshipSource;
  confidence: QueryMappingConfidence;
  /** @deprecated Prefer confidence */
  mappingConfidence: QueryMappingConfidence;
  reason: string;
  /** @deprecated Prefer reason */
  mappingReason: string;
  evidence: QueryRelationshipEvidence[];
  sourceDateRange: QuerySourceDateRange;
};

export type ScoreBreakdown = {
  impressions: number;
  positionProximity: number;
  rankingProximityToPageOne: number;
  ctrGap: number;
  queryCoverage: number;
  commercialIntent: number;
  contentType: number;
  pageQualityGap: number;
  internalLinkStrength: number;
  topicalRelevance: number;
  freshness: number;
  cannibalizationRisk: number;
  improvementLikelihood: number;
  /** Boost for IMPROVE/noindex pages with real demand (promotion opportunity). */
  improvePromotionBoost: number;
};

export type PageDiagnostics = {
  pageType: string;
  title: string | null;
  titleLength: number | null;
  h1: string | null;
  metaDescription: string | null;
  firstWordsPreview: string | null;
  wordCountEstimate: number | null;
  lastUpdated: string | null;
  uniqueVerdict: boolean | null;
  pricingData: boolean | null;
  screenshots: boolean | null;
  featureTables: boolean | null;
  prosCons: boolean | null;
  outgoingInternalLinks: number | null;
  inboundInternalLinks: number | null;
  breadcrumb: boolean | null;
  canonical: string | null;
  structuredData: boolean | null;
  author: boolean | null;
  editorialMethodology: boolean | null;
  relatedContent: boolean | null;
  toolsLinked: boolean | null;
  mostlyTemplated: boolean | null;
  qualityScore: number | null;
  seoIndexable: boolean | null;
  publishStatus: string | null;
};

export type SearchIntentProfile = {
  primaryQueryCluster: string | null;
  secondaryQueryClusters: string[];
  intent: GscCommercialIntent;
  contentMismatch: boolean;
  mismatchNotes: string[];
  suggestedRemediation: GscActionType[];
};

export type GscOpportunityRow = {
  rank: number;
  url: string;
  path: string;
  pageType: string;
  estateType: string;
  queueBucket: "indexed_improvement" | "improve_promotion";
  lifecycleState: string | null;
  /**
   * Trusted target query for optimization — only set for DIRECT_GSC /
   * HISTORICAL_DIRECT_GSC, or INFERRED_HIGH (still REVIEW_REQUIRED).
   * Prefer `targetQuery`; kept for consumers that still read primaryQuery.
   */
  primaryQuery: string | null;
  /** Same as primaryQuery when trusted; null when only weak candidates exist. */
  targetQuery: string | null;
  /** Explicit page↔query relationship classification. */
  relationshipSource: QueryRelationshipSource;
  /** @deprecated Prefer relationshipSource */
  queryProvenance: QueryProvenance;
  queryMappingConfidence: QueryMappingConfidence;
  queryMappingReason: string;
  queryEvidence: QueryRelationshipEvidence[];
  querySourceDateRange: QuerySourceDateRange;
  /** Heuristic candidates — INFERRED_*, never labeled as GSC evidence. */
  inferredQueryCandidates: InferredQueryCandidate[];
  secondaryQueries: string[];
  queryClusters: string[];
  intentProfile: SearchIntentProfile | null;
  clicks: number;
  impressions: number;
  ctr: number;
  avgPosition: number;
  opportunityScore: number;
  scoreBreakdown: ScoreBreakdown;
  commercialIntent: GscCommercialIntent;
  mappedQueries: MappedQuery[];
  rootCauses: GscRootCause[];
  recommendedActions: GscActionType[];
  primaryAction: GscActionType;
  /** Query-specific rewrite eligibility. */
  actionConfidence: ActionConfidence;
  requiresHumanReview: boolean;
  expectedDifficulty: GscDifficulty;
  internalLinkRecommendations: string[];
  backlinksLikelyHelp: boolean;
  contentChangeMode: GscContentChangeMode;
  diagnostics: PageDiagnostics | null;
  sourcePaths: string[];
  notes: string[];
};

export type QueryWithoutPage = {
  query: string;
  impressions: number;
  position: number;
  intent: GscCommercialIntent;
  reason: string;
  /** Existing-page-first resolution — prefer improve over create. */
  improveExistingPath?: string | null;
  createCandidateSuggested?: boolean;
};

export type CannibalizationFlag = {
  queryOrCluster: string;
  paths: string[];
  impressions: number[];
  /**
   * CANNIBALIZATION only when multiple URLs share the same DIRECT_GSC query.
   * Heuristic name overlap → POSSIBLE_INTENT_OVERLAP (review required).
   */
  classification: "CANNIBALIZATION" | "POSSIBLE_INTENT_OVERLAP";
  queryProvenance: QueryProvenance;
  requiresReview: boolean;
};

export type GscOpportunityProvenance = {
  source: string;
  sourceLabel: string | null;
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
  dataThroughDate: string | null;
  rangeLabel: string | null;
  importRetrievedAt: string | null;
  generatedAt: string;
  synthetic: false;
};

export type GscOpportunityReport = {
  engineVersion: string;
  generatedAt: string;
  sourceFile: string;
  sourceLabel: string | null;
  dataThroughDate: string | null;
  rangeLabel: string | null;
  provenance: GscOpportunityProvenance;
  methodologyNotes: string[];
  totals: {
    rawPageRows: number;
    rawQueryRows: number;
    rawPageQueryRows: number;
    hasPageQueryMatrix: boolean;
    excludedPages: number;
    eligiblePages: number;
    scoredPages: number;
    diagnosedPages: number;
    indexedImprovementCount: number;
    improvePromotionCount: number;
    createCandidatesDeferred: number;
    pagesWithDirectQuery: number;
    pagesWithInferredOnly: number;
    pagesWithUnknownQuery: number;
  };
  exclusionSummary: Record<string, number>;
  /** Queue A — already indexable / keep-index pages. */
  indexedImprovementQueue: GscOpportunityRow[];
  /** Queue B — IMPROVE / noindex promotion opportunities (critical). */
  improvePromotionQueue: GscOpportunityRow[];
  top20: GscOpportunityRow[];
  top50: GscOpportunityRow[];
  top100: GscOpportunityRow[];
  allRanked: GscOpportunityRow[];
  queriesWithoutPage: QueryWithoutPage[];
  cannibalization: CannibalizationFlag[];
  weeklyProcess: string[];
  systemFeeds: Record<string, string> | null;
  /**
   * Snapshot from AI Visibility monitor when `data/seo/ai-visibility.json` exists.
   * Measurement only — never invents citations; null when no report on disk.
   */
  aiVisibility: {
    generatedAt: string;
    totalCitations: number;
    uniqueCitedPages: number;
    topPlatform: string | null;
    platformCount?: number;
    newCitationCount: number;
    lostCitationCount: number;
    exportAvailable: boolean;
    topCitedPaths: string[];
  } | null;
};
