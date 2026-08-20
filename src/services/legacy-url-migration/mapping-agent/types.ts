/**
 * LegacyUrlMappingAgent contracts.
 * Maps meaningful legacy URLs → best new URLs (no redirect implementation).
 */

export type MappingRelationship =
  | "EXACT"
  | "EQUIVALENT"
  | "MERGED_INTO"
  | "SPLIT_INTO"
  | "NO_EQUIVALENT"
  | "DUPLICATE"
  | "UNKNOWN";

export type MappingAction =
  | "KEEP"
  | "301_REDIRECT"
  | "MERGE_AND_301"
  | "404"
  | "410"
  | "NOINDEX"
  | "REVIEW";

export type MappingConfidence = "HIGH" | "MEDIUM" | "LOW";

export type MappingSeoRisk = "HIGH" | "MEDIUM" | "LOW";

export type MappingMatchBasis =
  | "explicit_historical"
  | "canonical_entity"
  | "exact_title_topic"
  | "same_product"
  | "same_comparison_pair"
  | "same_guide_intent"
  | "same_category_cluster"
  | "semantic_similarity"
  | "taxonomy_retire"
  | "strategy_retire"
  | "unmapped";

export type LegacyIntentKind =
  | "home"
  | "hub"
  | "legal"
  | "company"
  | "product_review"
  | "product_pricing"
  | "product_alternatives"
  | "comparison"
  | "best"
  | "guide"
  | "industry"
  | "use_case"
  | "feature"
  | "resource"
  | "tool"
  | "category"
  | "tag"
  | "author"
  | "attachment"
  | "feed"
  | "pagination"
  | "query"
  | "locale"
  | "other";

export type UrlMappingRow = {
  legacyUrl: string;
  legacyPath: string;
  legacyTitle: string;
  legacyPageType: string;
  legacyIntent: LegacyIntentKind;
  newUrl: string | null;
  newPath: string | null;
  newTitle: string | null;
  relationship: MappingRelationship;
  recommendedAction: MappingAction;
  confidence: MappingConfidence;
  seoRisk: MappingSeoRisk;
  highRiskFlags: string[];
  matchBasis: MappingMatchBasis;
  reason: string;
  notes: string[];
};

export type UrlMappingPlanSummary = {
  agent: string;
  version: string;
  generatedAt: string;
  totalLegacy: number;
  meaningfulLegacy: number;
  mapped: number;
  unmapped: number;
  keep: number;
  redirect301: number;
  mergeAnd301: number;
  status404: number;
  status410: number;
  review: number;
  highRisk: number;
  lowConfidenceMapped: number;
  byMatchBasis: Record<string, number>;
  byIntent: Record<string, number>;
};

export const LEGACY_URL_MAPPING_AGENT = {
  id: "legacy-url-mapping-agent",
  name: "LegacyUrlMappingAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};
