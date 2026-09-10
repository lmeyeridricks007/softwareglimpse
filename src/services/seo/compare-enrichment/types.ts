/**
 * Progressive comparison enrichment — types.
 * Improve existing /compare/ URLs; never invent replacement slugs or fabricate facts.
 */

import type {
  ContentLifecycleState,
  ImprovementReason,
} from "@/services/seo/content-lifecycle";
import type { ComparabilitySignalId } from "@/services/seo/compare-index-worthiness/relationship";
import type { CompareRelationshipKind } from "@/services/seo/compare-index-worthiness/types";
import type {
  EnrichmentLane,
  LaneAllocation,
  StrategicOverrideReason,
} from "@/services/seo/enrichment-lanes";
import { DEFAULT_LANE_ALLOCATION } from "@/services/seo/enrichment-lanes";

export const COMPARE_ENRICHMENT_VERSION = "2.0.0";

export const DEFAULT_COMPARE_ENRICHMENT_BATCH_SIZE = 25;

export { DEFAULT_LANE_ALLOCATION };
export type { EnrichmentLane, LaneAllocation, StrategicOverrideReason };

export type ComparisonThesisKind =
  | "same_category_different_company_size"
  | "similar_product_different_pricing_model"
  | "general_purpose_vs_specialist"
  | "enterprise_vs_smb"
  | "automation_first_vs_simplicity_first"
  | "ai_first_vs_traditional"
  | "same_category_different_strengths"
  | "overlapping_use_case_tradeoff";

export type ComparisonThesis = {
  kind: ComparisonThesisKind;
  label: string;
  rationale: string;
  supportedBy: ComparabilitySignalId[];
};

export type FeatureSupportStatus =
  | "supported"
  | "unsupported"
  | "partial"
  | "unknown";

export type CapabilityCompareRow = {
  featureSlug: string;
  label: string;
  statusA: FeatureSupportStatus;
  statusB: FeatureSupportStatus;
  noteA?: string;
  noteB?: string;
};

export type PricingDiffSummary = {
  startingPriceA: number | null;
  startingPriceB: number | null;
  billingA: string | null;
  billingB: string | null;
  freeTier: { a: boolean | null; b: boolean | null };
  trials: { a: boolean | null; b: boolean | null };
  modelA: string | null;
  modelB: string | null;
  complexityNote: string | null;
  costCalculatorHref: string | null;
  notes: string[];
};

export type EvidencePairSummary = {
  levelA: string;
  levelB: string;
  handsOnA: boolean;
  handsOnB: boolean;
  disclaimer: string;
};

export type DecisionContentDraft = {
  quickVerdict: string;
  chooseAIf: string[];
  chooseBIf: string[];
  keyDifferences: string[];
  pricingDifferences: string[];
  targetCompany: string[];
  easeImplementation: string[];
  integrationDifferences: string[];
  strengthsA: string[];
  strengthsB: string[];
  limitationsA: string[];
  limitationsB: string[];
  bestFitScenarios: string[];
  poorFitScenarios: string[];
  alternatives: string[];
  finalRecommendation: string;
};

export type UniqueDecisionElement =
  | "quick_verdict"
  | "choose_if_rules"
  | "key_differences"
  | "pricing_diff"
  | "capability_table"
  | "target_audience"
  | "scenario_fit"
  | "evidence_clarity"
  | "alternatives"
  | "final_recommendation";

export type CompareEnrichmentPlan = {
  slug: string;
  productA: string;
  productB: string;
  relationshipKind: CompareRelationshipKind;
  intentValid: boolean;
  thesis: ComparisonThesis | null;
  capabilityRows: CapabilityCompareRow[];
  pricing: PricingDiffSummary;
  evidence: EvidencePairSummary;
  decisionDraft: DecisionContentDraft;
  uniquePresent: UniqueDecisionElement[];
  uniqueMissing: UniqueDecisionElement[];
  canApplyDeterministically: boolean;
  notes: string[];
  remediationFocus: ImprovementReason[];
};

export type CompareEnrichmentQueueItem = {
  slug: string;
  url: string;
  title: string;
  productA: string;
  productB: string;
  categorySlug: string | null;
  lifecycle: ContentLifecycleState;
  relationshipKind: CompareRelationshipKind;
  improvementReasons: ImprovementReason[];
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
    knownCompetitor: boolean;
    productPopularity: number;
    commercialValue: number;
    internalLinkDemand: number;
    comparisonFrequency: number;
    existingEvidence: number;
    qualityGap: number;
  };
  thesisPreview: string | null;
};

export type CompareEnrichmentQaFinding = {
  code:
    | "nonsensical_comparison"
    | "near_duplicate_page"
    | "contradictory_winners"
    | "unsupported_claim"
    | "fake_feature_difference"
    | "missing_canonical"
    | "broken_product_link"
    | "stale_pricing"
    | "empty_decision_section"
    | "insufficient_differentiation"
    | "semantic_template_risk";
  severity: "block" | "warn";
  detail: string;
};

export type CompareEnrichmentQaResult = {
  ok: boolean;
  findings: CompareEnrichmentQaFinding[];
};

export type CompareEnrichmentApplyResult = {
  slug: string;
  applied: boolean;
  overlayPath: string | null;
  uniqueValueAdded: UniqueDecisionElement[];
  notes: string[];
  qa: CompareEnrichmentQaResult;
};

export type CompareEnrichmentBatchResult = {
  version: string;
  generatedAt: string;
  batchSize: number;
  planned: CompareEnrichmentPlan[];
  applied: CompareEnrichmentApplyResult[];
  promoted: string[];
  skippedPromotion: Array<{ slug: string; reasons: string[] }>;
  queueRemaining: number;
  familyQa?: import("@/services/content-quality/gate/semantic-template").FamilyQaSummary;
};

export type CompareEnrichmentReport = {
  version: string;
  generatedAt: string;
  summary: {
    improveQueueSize: number;
    queued: number;
    byRelationship: Array<{ kind: CompareRelationshipKind; count: number }>;
    byLane: Array<{ lane: EnrichmentLane; count: number }>;
    laneAllocation: LaneAllocation;
    batchSizeDefault: number;
    readyForPromotionEstimate: number;
  };
  queue: CompareEnrichmentQueueItem[];
  laneA: CompareEnrichmentQueueItem[];
  laneB: CompareEnrichmentQueueItem[];
  laneC: CompareEnrichmentQueueItem[];
};
