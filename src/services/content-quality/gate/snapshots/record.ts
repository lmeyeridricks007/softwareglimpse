import type { ContentQualityGateResult } from "../types";
import {
  appendQualitySnapshot,
  mapLegacyPhaseToSourceEvent,
  snapshotFromGateResult,
} from "./store";
import { detectQualityRegression, latestSnapshot } from "./query";
import type {
  QualityObservationSnapshot,
  QualityRegressionFlag,
  QualitySnapshotSourceEvent,
} from "./types";

export type RecordQualitySnapshotInput = {
  result: ContentQualityGateResult;
  sourceEvent?: QualitySnapshotSourceEvent;
  /** Legacy phase — mapped when sourceEvent omitted. */
  phase?: "before" | "after" | "analyze";
  note?: string;
  semanticRisk?: string | null;
  evidenceLevel?: string | null;
  cwd?: string;
  persist?: boolean;
  /** Run regression detection against previous snapshot. */
  detectRegression?: boolean;
};

/**
 * Persist a measurable quality observation (append-only).
 */
export function recordQualitySnapshot(
  input: RecordQualitySnapshotInput,
): {
  snapshot: QualityObservationSnapshot;
  regression: QualityRegressionFlag | null;
} {
  const sourceEvent =
    input.sourceEvent ??
    mapLegacyPhaseToSourceEvent(input.phase, input.note);

  // Prior observation for this URL (before we append). Use latest, not
  // previousSnapshot — previousSnapshot is second-to-last after ≥2 exist.
  const prior = latestSnapshot(input.result.path, input.cwd);
  let event = sourceEvent;
  if (!prior && (event === "analyzed" || event === "improvement_before")) {
    event = "first_analyzed";
  }

  const snapshot = snapshotFromGateResult(input.result, {
    sourceEvent: event,
    timestamp: input.result.evaluatedAt,
    semanticRisk: input.semanticRisk ?? null,
    evidenceLevel: input.evidenceLevel ?? null,
    note: input.note,
    legacyPhase: input.phase,
  });

  appendQualitySnapshot(snapshot, {
    cwd: input.cwd,
    persist: input.persist,
  });

  let regression: QualityRegressionFlag | null = null;
  if (input.detectRegression !== false) {
    regression = detectQualityRegression(snapshot, prior, {
      cwd: input.cwd,
      persist: input.persist,
    });
  }

  return { snapshot, regression };
}
