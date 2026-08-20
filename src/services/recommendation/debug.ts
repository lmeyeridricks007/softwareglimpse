import type { ScoreBreakdown } from "@/domain";

/** Format score breakdown for CLI / debug output. */
export function formatScoreBreakdown(breakdown: ScoreBreakdown): string {
  const lines: string[] = [];
  const dims: (keyof Omit<
    ScoreBreakdown,
    "unknownDimensions" | "knownWeight" | "totalApplicableWeight"
  >)[] = [
    "useCaseFit",
    "requiredFeatures",
    "preferredFeatures",
    "businessSizeFit",
    "integrations",
    "priorities",
    "budgetFit",
    "businessTypeFit",
  ];

  for (const key of dims) {
    const value = breakdown[key];
    const display = value == null ? "n/a" : value.toFixed(3);
    lines.push(`  ${key}: ${display}`);
  }

  if (breakdown.unknownDimensions.length > 0) {
    lines.push(`  unknown: ${breakdown.unknownDimensions.join(", ")}`);
  }
  if (
    breakdown.knownWeight != null &&
    breakdown.totalApplicableWeight != null
  ) {
    lines.push(
      `  knownWeight: ${breakdown.knownWeight.toFixed(3)} / ${breakdown.totalApplicableWeight.toFixed(3)}`,
    );
  }

  return lines.join("\n");
}
