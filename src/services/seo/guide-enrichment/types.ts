/**
 * Progressive guide enrichment — types.
 * Improve existing URLs; never invent replacement slugs or fabricate facts.
 */

import type { ImprovementReason } from "@/services/seo/content-lifecycle";
import type { ContentLifecycleState } from "@/services/seo/content-lifecycle";
import type {
  EnrichmentLane,
  LaneAllocation,
  StrategicOverrideReason,
} from "@/services/seo/enrichment-lanes";
import { DEFAULT_LANE_ALLOCATION } from "@/services/seo/enrichment-lanes";

export const GUIDE_ENRICHMENT_VERSION = "2.0.0";

export const DEFAULT_ENRICHMENT_BATCH_SIZE = 30;

export { DEFAULT_LANE_ALLOCATION };
export type { EnrichmentLane, LaneAllocation, StrategicOverrideReason };

/** Enrichment taxonomy — distinct from audit GuideAuditType. */
export type EnrichmentGuideType =
  | "CATEGORY_EDUCATION"
  | "BUYING_GUIDE"
  | "IMPLEMENTATION_GUIDE"
  | "USE_CASE_GUIDE"
  | "INDUSTRY_GUIDE"
  | "PRODUCT_EXPLAINER"
  | "FEATURE_GUIDE"
  | "COST_GUIDE"
  | "MIGRATION_GUIDE"
  | "INTEGRATION_GUIDE"
  | "DECISION_GUIDE"
  | "OTHER";

export type CommercialIntent = "informational" | "commercial" | "mixed";

export type GuideSearchIntent = {
  primaryIntent: string;
  likelyReader: string;
  decisionStage: string;
  categorySlug: string | null;
  relatedProductSlugs: string[];
  relatedUseCaseSlugs: string[];
  relatedCapabilitySlugs: string[];
  commercialIntent: CommercialIntent;
  /** When GSC queries matched this URL. */
  gscQueries: string[];
  gscImpressions: number | null;
  gscPosition: number | null;
  inferenceSource: "gsc" | "topic" | "mixed";
};

export type BlueprintSectionId =
  | "problem_or_definition"
  | "who_needs_it"
  | "workflows"
  | "capabilities"
  | "requirements"
  | "implementation"
  | "pricing_expectations"
  | "common_mistakes"
  | "candidate_products"
  | "tradeoffs"
  | "checklist"
  | "alternatives"
  | "comparisons"
  | "limitations"
  | "evidence"
  | "next_decision"
  | "industry_constraints"
  | "integrations"
  | "scenario_analysis";

export type GuideQualityBlueprint = {
  guideType: EnrichmentGuideType;
  requiredSections: BlueprintSectionId[];
  optionalSections: BlueprintSectionId[];
  minUniqueElements: number;
  notes: string;
};

export type UniqueValueElement =
  | "decision_framework"
  | "product_shortlist"
  | "pricing_comparison"
  | "category_criteria"
  | "scenario_analysis"
  | "implementation_workflow"
  | "tradeoff_table"
  | "buyer_checklist"
  | "sg_original_data"
  | "limitations_evidence"
  | "alternatives_map";

export type DataEnrichmentSignals = {
  hasPricing: boolean;
  hasPlanStructure: boolean;
  hasFreeOrTrial: boolean;
  hasCapabilities: boolean;
  hasIntegrations: boolean;
  hasUseCases: boolean;
  hasAlternatives: boolean;
  hasCompetitors: boolean;
  hasResearchStats: boolean;
  hasTestingEvidence: boolean;
  omittedUnsupported: string[];
};

export type CredibilitySignals = {
  lastResearched: string | null;
  pricingChecked: string | null;
  evidenceLevel: string | null;
  hasSources: boolean;
  methodologyHref: string | null;
  authorName: string | null;
  lastSubstantiveUpdate: string | null;
};

export type DecisionSupportAction = {
  kind:
    | "finder"
    | "cost_calculator"
    | "compare"
    | "review"
    | "pricing"
    | "research"
    | "requirements"
    | "hub";
  label: string;
  href: string;
  reason: string;
};

export type EnrichmentQueueItem = {
  slug: string;
  url: string;
  title: string;
  enrichmentType: EnrichmentGuideType;
  lifecycle: ContentLifecycleState;
  improvementReasons: ImprovementReason[];
  /** Within-lane priority (not a cross-lane vanity score). */
  priorityScore: number;
  overallScore: number;
  lane: EnrichmentLane;
  gscEvidenceScore: number;
  gscDemandScore: number;
  strategicScore: number;
  qualityGap: number;
  qualityGapScore: number;
  commercialScore: number;
  authorityScore: number;
  strategicOverride: boolean;
  strategicOverrideReasons: StrategicOverrideReason[];
  orderingReason: string;
  reason: string;
  prioritySignals: {
    gscImpressions: number;
    gscClicks: number;
    gscPosition: number | null;
    hasDirectQuery: boolean;
    realAiCitations: number;
    knownBacklinks: number;
    commercialIntentWeight: number;
    categoryImportance: number;
    internalLinkOpportunity: number;
    productPopularity: number;
    affiliateOpportunity: number;
    qualityGap: number;
    existingAuthority: number;
  };
  intent: GuideSearchIntent;
};

export type EnrichmentPlan = {
  slug: string;
  enrichmentType: EnrichmentGuideType;
  intent: GuideSearchIntent;
  blueprint: GuideQualityBlueprint;
  uniqueValueRequired: UniqueValueElement[];
  uniqueValuePresent: UniqueValueElement[];
  uniqueValueMissing: UniqueValueElement[];
  dataSignals: DataEnrichmentSignals;
  credibility: CredibilitySignals;
  decisionActions: DecisionSupportAction[];
  proposedBlockTypes: string[];
  remediationFocus: ImprovementReason[];
  canApplyDeterministically: boolean;
  notes: string[];
};

export type EnrichmentQaFinding = {
  code:
    | "repeated_paragraph"
    | "near_duplicate_intro"
    | "near_identical_conclusion"
    | "identical_table"
    | "unsupported_statistic"
    | "generic_ai_filler"
    | "keyword_stuffing"
    | "insufficient_unique_value"
    | "review_intent_cannibalization"
    | "semantic_template_risk"
    | "REPEATED_VERDICT_PATTERN"
    | "REPEATED_INTRO_PATTERN"
    | "REPEATED_CONCLUSION_PATTERN"
    | "REPEATED_PROS_CONS_PATTERN"
    | "INSUFFICIENT_PAGE_SPECIFIC_ANALYSIS";
  severity: "block" | "warn";
  detail: string;
};

export type EnrichmentQaResult = {
  ok: boolean;
  findings: EnrichmentQaFinding[];
};

export type EnrichmentApplyResult = {
  slug: string;
  applied: boolean;
  overlayPath: string | null;
  uniqueValueAdded: UniqueValueElement[];
  blocksAdded: number;
  notes: string[];
  qa: EnrichmentQaResult;
};

export type EnrichmentBatchResult = {
  version: string;
  generatedAt: string;
  batchSize: number;
  planned: EnrichmentPlan[];
  applied: EnrichmentApplyResult[];
  promoted: string[];
  skippedPromotion: Array<{ slug: string; reasons: string[] }>;
  queueRemaining: number;
  /** Phase 5 — sibling similarity summary for this enrichment batch. */
  familyQa?: import("@/services/content-quality/gate/semantic-template").FamilyQaSummary;
};

export type GuideEnrichmentReport = {
  version: string;
  generatedAt: string;
  summary: {
    improveQueueSize: number;
    queued: number;
    byType: Array<{ type: EnrichmentGuideType; count: number }>;
    byLane: Array<{ lane: EnrichmentLane; count: number }>;
    laneAllocation: LaneAllocation;
    batchSizeDefault: number;
    readyForPromotionEstimate: number;
  };
  queue: EnrichmentQueueItem[];
  laneA: EnrichmentQueueItem[];
  laneB: EnrichmentQueueItem[];
  laneC: EnrichmentQueueItem[];
  blueprints: GuideQualityBlueprint[];
};
