/**
 * Ranking opportunity contracts — relative feasibility only.
 * Never a ranking probability or timeline prediction.
 */

export type QueryIntentClass =
  | "informational"
  | "commercial"
  | "tool-resource"
  | "product"
  | "other";

export type FeasibilityBand =
  | "STRONG OPPORTUNITY"
  | "GOOD OPPORTUNITY"
  | "MODERATE"
  | "DIFFICULT"
  | "VERY DIFFICULT";

export type OpportunityDimensionId =
  | "intent-match"
  | "current-page-quality"
  | "competitive-content-gap"
  | "sg-differentiation"
  | "topical-authority"
  | "internal-link-support"
  | "evidence-quality"
  | "media-tool-advantage"
  | "technical-readiness"
  | "current-search-traction"
  | "external-authority-gap";

export type OpportunityDimension = {
  id: OpportunityDimensionId;
  score: number | null;
  reason: string;
  available: boolean;
};

export type RankingOpportunity = {
  query: string;
  intent: string;
  intentClass: QueryIntentClass;
  targetPage: string | null;
  currentRank: number | null;
  opportunityScore: number;
  feasibility: FeasibilityBand;
  confidence: "high" | "medium" | "low";
  competitorStrength: number | null;
  dimensions: OpportunityDimension[];
  strengths: string[];
  weaknesses: string[];
  requiredImprovements: string[];
  internalLinksRequired: string[];
  supportingContentNeeded: string[];
  researchNeeded: string[];
  authorityCaveat: string;
  recommendedAction: string;
  clusterIds: string[];
  avoid?: boolean;
  avoidReason?: string;
};

export type ClusterOpportunity = {
  id: string;
  label: string;
  queries: string[];
  avgScore: number;
  feasibility: FeasibilityBand;
  pageCount: number;
  strengths: string[];
  weaknesses: string[];
  recommendedAction: string;
  authorityCaveat: string;
};

export type RankingOpportunitiesReport = {
  generatedAt: string;
  cluster: string;
  sources: Array<{ id: string; path: string; status: "available" | "missing" | "fixture" | "unavailable" }>;
  authorityMeasured: boolean;
  authorityCaveatGlobal: string;
  visibilityAvailable: boolean;
  opportunities: RankingOpportunity[];
  clusters: ClusterOpportunity[];
  topStrongest: RankingOpportunity[];
  topHardest: RankingOpportunity[];
  closestToBreakthrough: RankingOpportunity[];
  needsSubstantialUpgrade: RankingOpportunity[];
  newContentOpportunities: RankingOpportunity[];
  lowValueAvoid: RankingOpportunity[];
  notes: string[];
  disclaimers: string[];
};
