/**
 * Website Intelligence Orchestrator contracts.
 * Evaluate / recommend only — never mutates production.
 */

export type WebsiteIntelligenceMode = "LIGHT" | "FULL" | "DEEP";

export type ScoreStatus = "scored" | "unavailable" | "not-measured" | "not-available" | "not-connected";

export type ScorecardCell = {
  id: string;
  label: string;
  score: number | null;
  status: ScoreStatus;
  display: string;
  confidence?: string;
  note?: string;
};

export type ScoreHistoryRow = {
  id: string;
  label: string;
  previous: number | null;
  current: number | null;
  previousDisplay: string;
  currentDisplay: string;
  delta: number | null;
  change: "IMPROVED" | "REGRESSED" | "UNCHANGED" | "NEW" | "N/A";
};

export type IntelligenceAction = {
  id: string;
  priority: "P0" | "P1" | "P2" | "P3";
  area: string;
  affected: string;
  problem: string;
  evidence: string;
  recommendation: string;
  impact: "large" | "medium" | "small";
  effort: "small" | "medium" | "large";
  dependency: string;
};

export type IntelligenceRisk = {
  id: string;
  priority: "P0" | "P1" | "P2";
  area: string;
  title: string;
  evidence: string;
};

export type WebsiteIntelligenceModel = {
  generatedAt: string;
  mode: WebsiteIntelligenceMode;
  cluster: string;
  agentVersion: string;
  executiveVerdict: {
    howGood: string;
    howCompetitive: string;
    rankingOutlook: string;
    growthLimits: string;
  };
  scorecard: ScorecardCell[];
  overallScore: number | null;
  confidence: {
    level: "high" | "medium" | "low";
    reasons: string[];
  };
  doesWell: string[];
  behindCompetitors: string[];
  seoHealth: string[];
  contentHealth: string[];
  uxProductHealth: string[];
  competitorLandscape: string[];
  rankingFeasibility: string[];
  strongestClusters: string[];
  weakestClusters: string[];
  closestToRanking: string[];
  unlikelyWithoutMajorWork: string[];
  missingContent: string[];
  missingToolsResources: string[];
  internalLinkOpportunities: string[];
  authorityLimitations: string[];
  measurementStatus: Array<{ label: string; status: string }>;
  topRisks: IntelligenceRisk[];
  topAdvantages: string[];
  topActions: IntelligenceAction[];
  scoreHistory: ScoreHistoryRow[];
  sources: Array<{ id: string; path: string; status: string; notes?: string }>;
  refreshNotes: string[];
  disclaimers: string[];
};

export type ScorecardSnapshot = {
  generatedAt: string;
  mode: WebsiteIntelligenceMode;
  cluster: string;
  scores: Record<string, number | null>;
  displays: Record<string, string>;
};
