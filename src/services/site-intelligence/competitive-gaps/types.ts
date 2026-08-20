/**
 * Competitive gap contracts — STRONGER / COMPARABLE / WEAKER / MISSING.
 * Feature-copy recommendations are rejected when they lack user value.
 */

export type GapType =
  | "CONTENT_DEPTH_GAP"
  | "EVIDENCE_GAP"
  | "MEDIA_GAP"
  | "TOOL_GAP"
  | "RESOURCE_GAP"
  | "QUERY_COVERAGE_GAP"
  | "INTERNAL_LINK_GAP"
  | "FRESHNESS_GAP"
  | "TRUST_GAP"
  | "UX_GAP"
  | "CONTENT_DIFFERENTIATION_GAP";

export type Stance = "STRONGER" | "COMPARABLE" | "WEAKER" | "MISSING";

export type QueryAction =
  | "improve-existing"
  | "create-new"
  | "merge"
  | "no-action";

export type GapFinding = {
  id: string;
  gapType: GapType;
  stance: Stance;
  title: string;
  detail: string;
  query?: string;
  sgPage?: string | null;
  competitorDomains?: string[];
  sgScore?: number | null;
  competitorAvg?: number | null;
  delta?: number | null;
  userValue: string;
  /** True when a naive "copy competitor feature" was considered and rejected. */
  rejectedFeatureCopy?: boolean;
  rejectedFeatureNote?: string;
  priority: number; // 1 = highest
};

export type QueryGap = {
  query: string;
  intent: string;
  matchingPage: string | null;
  pageExists: boolean;
  intentMatchScore: number | null;
  qualityScore: number | null;
  qualityBand: string | null;
  competitorAvgStrength: number | null;
  sgBenchmarkStrength: number | null;
  stance: Stance;
  action: QueryAction;
  rationale: string;
  dimensionGaps: Array<{
    gapType: GapType;
    stance: Stance;
    sg: number | null;
    competitorAvg: number | null;
    delta: number | null;
  }>;
};

export type CompetitiveAction = {
  rank: number;
  title: string;
  action: QueryAction | "strengthen-advantage" | "add-tool" | "add-resource" | "add-media" | "differentiate";
  gapType?: GapType;
  query?: string;
  page?: string | null;
  why: string;
  userValue: string;
  notRecommended?: string;
};

export type CompetitiveGapReport = {
  generatedAt: string;
  cluster: string;
  sources: Array<{ id: string; path: string; status: "available" | "missing" | "fixture" }>;
  advantages: GapFinding[];
  competitorStronger: GapFinding[];
  missingTopics: GapFinding[];
  weakPages: GapFinding[];
  missingTools: GapFinding[];
  missingResources: GapFinding[];
  missingMedia: GapFinding[];
  differentiation: GapFinding[];
  queryGaps: QueryGap[];
  topActions: CompetitiveAction[];
  notes: string[];
  disclaimers: string[];
};
