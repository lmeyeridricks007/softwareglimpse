/**
 * Client-safe requirement detail labels.
 * Keep out of build-page-model so "use client" UI never pulls catalogue fs stores.
 */

export type RequirementFitStatus =
  | "strong-support"
  | "good-support"
  | "partial-support"
  | "limited-support"
  | "does-not-satisfy"
  | "insufficient-evidence";

export type RequirementFeatureCellStatus =
  | "supported"
  | "partially-supported"
  | "plan-dependent"
  | "limited"
  | "not-supported"
  | "not-evidenced";

export type RequirementConfidence = "High" | "Medium" | "Low" | "Unknown";

export function fitStatusLabel(status: RequirementFitStatus): string {
  switch (status) {
    case "strong-support":
      return "Strong support";
    case "good-support":
      return "Good support";
    case "partial-support":
      return "Partial support";
    case "limited-support":
      return "Limited support";
    case "does-not-satisfy":
      return "Does not satisfy";
    default:
      return "Insufficient evidence";
  }
}

/** Compact scorecard cell label (Strong / Good / Partial / …). */
export function fitStatusShortLabel(status: RequirementFitStatus): string {
  switch (status) {
    case "strong-support":
      return "Strong";
    case "good-support":
      return "Good";
    case "partial-support":
      return "Partial";
    case "limited-support":
      return "Limited";
    case "does-not-satisfy":
      return "No";
    default:
      return "Insufficient evidence";
  }
}
