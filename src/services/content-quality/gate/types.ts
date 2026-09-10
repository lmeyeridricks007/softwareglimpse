import type { ContentLifecycleState } from "@/services/seo/content-lifecycle/types";
import type { ContentQualityDimensionId } from "@/domain/schemas/content-quality";

export const GATE_PAGE_TYPES = [
  "software",
  "guide",
  "comparison",
  "product-explainer",
  "best",
  "alternatives",
  "category",
  "use-case",
  "industry",
  "capability",
  "tool-landing",
  "research",
] as const;

export type GatePageType = (typeof GATE_PAGE_TYPES)[number];

export const GATE_DIMENSION_IDS = [
  "searchIntentFit",
  "uniqueValue",
  "dataCompleteness",
  "decisionSupport",
  "evidenceQuality",
  "freshness",
  "internalDiscoverability",
  "contentSpecificity",
  "technicalSEO",
  "duplicationRisk",
] as const;

export type GateDimensionId = (typeof GATE_DIMENSION_IDS)[number];

export type GateHardFailCode =
  | "broken_canonical"
  | "invalid_route"
  | "substantial_duplicate"
  | "unsupported_claims"
  | "empty_generated_content"
  | "nonsensical_comparison"
  | "missing_identity"
  | "retired_lifecycle"
  | "invalid_relationship"
  | "semantic_template_risk";

export type GateIssue = {
  code: string;
  message: string;
  dimension?: GateDimensionId;
};

export type GateDimensionResult = {
  id: GateDimensionId;
  label: string;
  score: number; // 0–100
  weight: number;
  explanation: string;
  evidence: string[];
  gap?: string;
};

export type ContentQualityGateResult = {
  version: string;
  pageType: GatePageType;
  path: string;
  slug: string;
  title: string;
  qualityScore: number;
  dimensions: GateDimensionResult[];
  failures: GateIssue[];
  warnings: GateIssue[];
  requiredImprovements: string[];
  recommendedImprovements: string[];
  lifecycleState: ContentLifecycleState;
  indexEligible: boolean;
  evaluatedAt: string;
  /** Underlying content-quality dimension ids for traceability. */
  mappedQualityDimensions?: ContentQualityDimensionId[];
};

export type GateHistoryRecord = {
  path: string;
  pageType: GatePageType;
  slug: string;
  phase: "before" | "after" | "analyze";
  result: ContentQualityGateResult;
  recordedAt: string;
  note?: string;
  /** Semantic template snapshot when available. */
  semantic?: {
    beforeSimilarity?: number;
    afterSimilarity?: number;
    maxSemanticSimilarity?: number;
    meanSemanticSimilarity?: number;
    siblingCluster?: {
      size: number;
      guideTypeOrRelationship: string | null;
      categorySlug: string | null;
      templateFamily: string | null;
      siblingSlugs: string[];
    };
    uniqueAnalysisSignals?: string[];
    promotionReason?: string;
    riskLevel?: string;
    blocksAutoPromotion?: boolean;
    riskSignals?: string[];
    promotionOutcome?: string;
  };
};

export type GateHistoryFile = {
  version: string;
  updatedAt: string;
  records: GateHistoryRecord[];
};
