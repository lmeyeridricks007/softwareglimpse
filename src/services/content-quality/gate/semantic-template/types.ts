/**
 * Semantic template-risk detection.
 *
 * Prevents enrichment from “passing” uniqueness via substituted product names,
 * prices, and table values while analysis structure stays interchangeable.
 */

export const SEMANTIC_TEMPLATE_VERSION = "1.1.0";

/** Max siblings compared for cluster similarity (nearest 20–50). */
export const SIBLING_COMPARE_LIMIT = 40;
export const SIBLING_COMPARE_MIN = 20;
export const SIBLING_COMPARE_MAX = 50;

/** Mean section similarity (normalized) at/above this → high SEMANTIC_TEMPLATE_RISK. */
export const SEMANTIC_SIMILARITY_HIGH = 0.72;

/** Elevated risk band — needs unique-analysis signals to clear promotion. */
export const SEMANTIC_SIMILARITY_ELEVATED = 0.55;

/** Recurring identical normalized phrase across this many siblings → risk. */
export const RECURRING_PHRASE_SIBLING_MIN = 4;

/**
 * Family QA: flag batch when more than this share of pages share the same
 * thesis / recommendation structure / paragraph skeleton.
 */
export const DEFAULT_FAMILY_SHARED_RATIO = 0.35;

export type AnalysisSectionId =
  | "intro"
  | "decision_thesis"
  | "pros_cons"
  | "limitations"
  | "recommendation"
  | "scenario_analysis"
  | "conclusion";

/**
 * Page-specific reasoning signals. Pure variable substitution does not count.
 */
export type UniqueAnalysisSignal =
  | "specific_buyer_fit"
  | "specific_poor_fit_buyer"
  | "specific_price_threshold"
  | "specific_workflow_advantage"
  | "specific_limitation"
  | "specific_migration_concern"
  | "specific_implementation_complexity"
  | "specific_competitor_difference"
  | "specific_plan_tradeoff"
  | "specific_use_case_advantage"
  /** @deprecated Prefer specific_* names — kept for history compatibility. */
  | "worth_it_judgment"
  | "pricing_threshold"
  | "specific_tradeoff"
  | "target_buyer"
  | "weak_fit"
  | "migration_risk"
  | "use_case_recommendation"
  | "competitor_difference";

export type TemplateRiskSignal =
  | "SEMANTIC_TEMPLATE_RISK"
  | "REPEATED_VERDICT_PATTERN"
  | "REPEATED_INTRO_PATTERN"
  | "REPEATED_CONCLUSION_PATTERN"
  | "REPEATED_PROS_CONS_PATTERN"
  | "INSUFFICIENT_PAGE_SPECIFIC_ANALYSIS";

export type SemanticRiskLevel = "none" | "elevated" | "high";

export type SectionSimilarity = {
  section: AnalysisSectionId;
  maxSimilarity: number;
  meanTopSimilarity: number;
  nearestSiblingSlug: string | null;
};

export type SemanticTemplateAssessment = {
  version: string;
  path: string;
  slug: string;
  siblingCluster: {
    size: number;
    guideTypeOrRelationship: string | null;
    categorySlug: string | null;
    templateFamily: string | null;
    siblingSlugs: string[];
  };
  sectionSimilarities: SectionSimilarity[];
  /** Max of section maxSimilarities (normalized text — names/prices stripped). */
  maxSemanticSimilarity: number;
  meanSemanticSimilarity: number;
  recurringPatterns: string[];
  /** Explicit Phase-3 risk codes. */
  riskSignals: TemplateRiskSignal[];
  uniqueAnalysisSignals: UniqueAnalysisSignal[];
  riskLevel: SemanticRiskLevel;
  /** Hard promotion block when true — stay IMPROVE or MANUAL_REVIEW. */
  blocksAutoPromotion: boolean;
  reasons: string[];
  promotionReason: string;
};

export type SemanticPromotionOutcome =
  | "promoted"
  | "blocked_improve"
  | "blocked_manual_review"
  | "cleared_not_promoted"
  | "analyze_only";

export type SemanticHistorySnapshot = {
  recordedAt: string;
  phase: "before" | "after" | "analyze" | "promotion_block" | "family_qa";
  path: string;
  slug: string;
  pageType: "guide" | "comparison";
  maxSemanticSimilarity: number;
  meanSemanticSimilarity: number;
  /** Explicit before/after pair fields when available. */
  beforeSimilarity?: number;
  afterSimilarity?: number;
  riskLevel: SemanticRiskLevel;
  siblingCluster: SemanticTemplateAssessment["siblingCluster"];
  uniqueAnalysisSignals: UniqueAnalysisSignal[];
  riskSignals?: TemplateRiskSignal[];
  blocksAutoPromotion: boolean;
  promotionReason: string;
  promotionOutcome?: SemanticPromotionOutcome;
  reasons: string[];
};

export type FamilyQaSharedPattern = {
  kind: "thesis" | "recommendation" | "paragraph_skeleton" | "pros_cons";
  fingerprint: string;
  share: number;
  slugs: string[];
};

export type FamilyQaSummary = {
  version: string;
  generatedAt: string;
  batchSize: number;
  pageType: "guide" | "comparison";
  sharedRatioThreshold: number;
  flagged: boolean;
  sharedPatterns: FamilyQaSharedPattern[];
  pageAssessments: Array<{
    slug: string;
    maxSemanticSimilarity: number;
    riskLevel: SemanticRiskLevel;
    riskSignals: TemplateRiskSignal[];
    uniqueAnalysisSignals: UniqueAnalysisSignal[];
    blocksAutoPromotion: boolean;
  }>;
  notes: string[];
};
