/** Weekly existing-content improvement cycle — orchestration types only. */

export const IMPROVEMENT_CYCLE_VERSION = "1.0.0";

export type ImprovementCycleMode = "plan" | "apply";

export type CyclePageKind = "guide" | "comparison" | "software";

export type CycleQueueItem = {
  kind: CyclePageKind;
  slug: string;
  path: string;
  lane: string | null;
  score: number;
  reason: string;
  action:
    | "enrich"
    | "refresh"
    | "promote_eval"
    | "link"
    | "verify_pricing"
    | "human_test"
    | "blocked";
  lifecycle: string | null;
  blockedReasons: string[];
};

export type RankingMovement = {
  path: string;
  previousPosition: number | null;
  currentPosition: number | null;
  previousClicks: number;
  currentClicks: number;
  previousImpressions: number;
  currentImpressions: number;
  deltaClicks: number;
  deltaPosition: number | null;
  note: string;
};

export type ImprovementCycleStepResult = {
  id: string;
  label: string;
  status: "ok" | "skipped" | "partial" | "failed";
  detail: string;
  artifactPaths: string[];
};

export type ImprovementCycleOperatingSummary = {
  rankingWins: RankingMovement[];
  rankingLosses: RankingMovement[];
  pagesToRefresh: CycleQueueItem[];
  pagesToEnrich: CycleQueueItem[];
  pagesReadyToPromote: CycleQueueItem[];
  pagesBlocked: CycleQueueItem[];
  dataVerificationRequired: CycleQueueItem[];
  humanTestingRequired: CycleQueueItem[];
  internalLinkOpportunities: Array<{
    path: string;
    detail: string;
  }>;
  technicalIssues: string[];
};

export type ImprovementCycleReport = {
  version: string;
  generatedAt: string;
  weekId: string;
  mode: ImprovementCycleMode;
  batchSize: number;
  steps: ImprovementCycleStepResult[];
  selectedBatch: CycleQueueItem[];
  summary: ImprovementCycleOperatingSummary;
  existingArtifacts: string[];
  notes: string[];
};

export type ImprovementCycleSnapshot = {
  generatedAt: string;
  weekId: string;
  pages: Array<{
    path: string;
    position: number | null;
    clicks: number;
    impressions: number;
    opportunityScore: number;
  }>;
};
