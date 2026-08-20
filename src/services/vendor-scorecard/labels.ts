import type { FeatureAvailability } from "@/domain";
import {
  FEATURE_AVAILABILITY_SCORE,
} from "@/domain/recommendation/fit-values";

/**
 * Qualitative research assessment labels for scorecard cells.
 * Prefer these when numeric precision would overstate confidence.
 */
export type ResearchQualitativeLabel =
  | "strong"
  | "good"
  | "partial"
  | "unknown"
  | "does-not-meet";

export type OverallFitLabel =
  | "excellent-fit"
  | "strong-fit"
  | "good-fit"
  | "conditional-fit"
  | "poor-fit"
  | "insufficient-evidence";

export const RESEARCH_LABEL_DISPLAY: Record<ResearchQualitativeLabel, string> =
  {
    strong: "Strong",
    good: "Good",
    partial: "Partial / plan dependent",
    unknown: "Unknown / Verify",
    "does-not-meet": "Does not meet",
  };

export const OVERALL_FIT_DISPLAY: Record<OverallFitLabel, string> = {
  "excellent-fit": "Excellent fit",
  "strong-fit": "Strong fit",
  "good-fit": "Good fit",
  "conditional-fit": "Conditional fit",
  "poor-fit": "Poor fit",
  "insufficient-evidence": "Insufficient evidence",
};

/** Map approved 0–10 editorial scores → qualitative labels (deterministic). */
export function scoreToQualitativeLabel(
  score: number | null | undefined,
): ResearchQualitativeLabel {
  if (score == null || Number.isNaN(score)) return "unknown";
  if (score >= 8.5) return "strong";
  if (score >= 7) return "good";
  if (score >= 5) return "partial";
  return "does-not-meet";
}

/** Map feature availability → qualitative support (unknown ≠ unsupported). */
export function availabilityToQualitative(
  availability: FeatureAvailability | undefined,
): ResearchQualitativeLabel {
  switch (availability) {
    case "supported":
      return "strong";
    case "limited":
    case "add-on":
    case "higher-plan-only":
      return "partial";
    case "not-supported":
      return "does-not-meet";
    default:
      return "unknown";
  }
}

export type MustHaveStatus =
  | "satisfied"
  | "partial"
  | "failed"
  | "unknown";

/**
 * Must-have evaluation — fail ONLY on explicit not-supported.
 * Unknown stays unknown (never treated as failure).
 */
export function evaluateMustHave(
  availability: FeatureAvailability | undefined,
): MustHaveStatus {
  if (!availability || availability === "unknown") return "unknown";
  if (availability === "not-supported") return "failed";
  if (
    availability === "limited" ||
    availability === "add-on" ||
    availability === "higher-plan-only"
  ) {
    return "partial";
  }
  return "satisfied";
}

export type MustHaveSummary = {
  satisfied: number;
  partial: number;
  failed: number;
  unknown: number;
  total: number;
};

export function summarizeMustHaves(
  statuses: MustHaveStatus[],
): MustHaveSummary {
  const summary: MustHaveSummary = {
    satisfied: 0,
    partial: 0,
    failed: 0,
    unknown: 0,
    total: statuses.length,
  };
  for (const s of statuses) {
    summary[s] += 1;
  }
  return summary;
}

/**
 * Deterministic overall fit from research + must-haves.
 * Does not invent numbers when evidence is thin.
 */
export function deriveOverallFit(input: {
  mustHaveFailed: number;
  mustHaveUnknown: number;
  scoredCriterionCount: number;
  /** Weighted average 0–10 when enough approved scores exist; else null. */
  weightedScore: number | null;
}): OverallFitLabel {
  if (input.mustHaveFailed > 0) return "poor-fit";
  if (input.scoredCriterionCount < 2 || input.weightedScore == null) {
    return "insufficient-evidence";
  }
  if (input.mustHaveUnknown > 0 && input.weightedScore < 8) {
    // Unknown must-haves prevent "excellent" claims
    if (input.weightedScore >= 7.5) return "conditional-fit";
  }
  const s = input.weightedScore;
  if (s >= 8.5) return "excellent-fit";
  if (s >= 7.5) return "strong-fit";
  if (s >= 6.5) return "good-fit";
  if (s >= 5) return "conditional-fit";
  return "poor-fit";
}

/** Numeric contribution for weighted avg — unknown excluded. */
export function qualitativeToScore(
  label: ResearchQualitativeLabel,
): number | null {
  switch (label) {
    case "strong":
      return 9;
    case "good":
      return 7.5;
    case "partial":
      return 5.5;
    case "does-not-meet":
      return 2;
    default:
      return null;
  }
}

export function featureAvailabilityNumeric(
  availability: FeatureAvailability | undefined,
): number | null {
  if (!availability) return null;
  return FEATURE_AVAILABILITY_SCORE[availability];
}
