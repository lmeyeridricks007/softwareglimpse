/**
 * Enrichment execution lanes — separate proven search demand from
 * speculative catalogue expansion. Zero-impression pages stay in the
 * estate (Lane B/C); they do not outrank strong GSC opportunities.
 */

export const ENRICHMENT_LANES_VERSION = "1.1.0";

export type EnrichmentLane = "A" | "B" | "C";

/** Why a zero/low-GSC page may still sit in Lane B. */
export type StrategicOverrideReason =
  | "IMPORTANT_CATEGORY"
  | "POPULAR_PRODUCT"
  | "HIGH_COMMERCIAL_RELEVANCE"
  | "STRONG_INTERNAL_JOURNEY"
  | "KEY_COMPETITOR_RELATIONSHIP"
  | "IMPORTANT_BUYER_QUESTION";

export type LaneAllocation = {
  /** Default ~65% of batch slots. */
  laneA: number;
  /** Default ~25% of batch slots. */
  laneB: number;
  /** Default ~10% of batch slots. */
  laneC: number;
};

export const DEFAULT_LANE_ALLOCATION: LaneAllocation = {
  laneA: 0.65,
  laneB: 0.25,
  laneC: 0.1,
};

/** Minimum impressions to count as proven demand (not noise). */
export const LANE_A_MIN_IMPRESSIONS = 10;

export type GscEvidenceInput = {
  impressions: number;
  clicks?: number;
  position?: number | null;
  opportunityScore?: number;
  /** Trusted DIRECT_GSC / HIGH page×query target present. */
  hasDirectQuery?: boolean;
  /** Known referring domains / earned links for this URL (REAL only). */
  knownBacklinks?: number;
  /** REAL AI/search citations for this path — never FIXTURE. */
  realAiCitations?: number;
};

export type StrategicSignalsInput = {
  categoryImportance: number;
  productPopularity: number;
  commercialRelevance: number;
  internalJourneyStrength: number;
  competitorRelationship: boolean;
  importantBuyerQuestion: boolean;
};

export type LaneClassification = {
  lane: EnrichmentLane;
  /** Within-lane composite priority (same as overallScore). */
  priorityScore: number;
  /** Alias of priorityScore for report consumers. */
  overallScore: number;
  /** Proven search/citation demand (same as gscDemandScore). */
  gscEvidenceScore: number;
  /** Alias of gscEvidenceScore. */
  gscDemandScore: number;
  strategicScore: number;
  qualityGap: number;
  /** Alias of qualityGap. */
  qualityGapScore: number;
  /** Commercial relevance alone (affiliate / commercial intent weight). */
  commercialScore: number;
  /** External authority (REAL backlinks + AI citations). */
  authorityScore: number;
  /**
   * True only for Lane B: zero/low GSC demand but explicit strategic
   * override reasons — never lets catalogue signals invent Lane A.
   */
  strategicOverride: boolean;
  strategicOverrideReasons: StrategicOverrideReason[];
  orderingReason: string;
  /** Alias of orderingReason. */
  reason: string;
  hasProvenDemand: boolean;
};

export type LaneAwareItem = {
  lane: EnrichmentLane;
  priorityScore: number;
  gscEvidenceScore: number;
};
