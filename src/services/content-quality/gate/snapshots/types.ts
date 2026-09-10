/**
 * Append-only quality observation snapshots for measurable improvement over time.
 */

import type { ContentLifecycleState } from "@/services/seo/content-lifecycle/types";
import type {
  ContentQualityGateResult,
  GateDimensionResult,
  GateIssue,
  GatePageType,
} from "../types";

export const QUALITY_SNAPSHOT_VERSION = "1.0.0";

/** Why this observation was recorded. */
export type QualitySnapshotSourceEvent =
  | "first_analyzed"
  | "analyzed"
  | "enriched"
  | "manually_edited"
  | "promoted"
  | "materially_refreshed"
  | "improvement_before"
  | "improvement_after";

export type QualitySnapshotDimensions = Array<{
  id: string;
  score: number;
  weight?: number;
}>;

/**
 * One immutable observation. Append only — never rewrite in place.
 */
export type QualityObservationSnapshot = {
  id: string;
  url: string;
  pageType: GatePageType | string;
  timestamp: string;
  lifecycleState: ContentLifecycleState | string;
  qualityScore: number;
  dimensions: QualitySnapshotDimensions;
  failures: string[];
  warnings: string[];
  semanticRisk: string | null;
  evidenceLevel: string | null;
  indexEligible: boolean;
  sourceEvent: QualitySnapshotSourceEvent;
  /** Optional linkage to legacy gate history phase. */
  legacyPhase?: "before" | "after" | "analyze";
  slug?: string;
  note?: string;
};

export type QualityRegressionFlag = {
  code: "QUALITY_REGRESSION";
  url: string;
  detectedAt: string;
  previousScore: number;
  currentScore: number;
  previousIndexEligible: boolean;
  currentIndexEligible: boolean;
  previousLifecycle: string;
  currentLifecycle: string;
  detail: string[];
  /** Never auto-deindex — human/policy guard required. */
  autoDeindex: false;
};

export type QualityDelta = {
  url: string;
  fromTimestamp: string;
  toTimestamp: string;
  scoreDelta: number;
  dimensionDeltas: Array<{ id: string; before: number; after: number; delta: number }>;
  becameIndexEligible: boolean;
  lostIndexEligible: boolean;
  lifecycleBefore: string;
  lifecycleAfter: string;
};

export type QualitySnapshotStoreFile = {
  version: string;
  updatedAt: string;
  /** Append-only observation log. */
  snapshots: QualityObservationSnapshot[];
  /** Detected regressions (append-only flags; not auto-applied). */
  regressions: QualityRegressionFlag[];
};
