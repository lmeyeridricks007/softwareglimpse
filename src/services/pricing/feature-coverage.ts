import type { FeatureSupport } from "@/domain";

export type FeatureCoverageSummary = {
  /** Required features with evidenced support (supported / limited / add-on / higher-plan-only). */
  matched: number;
  /** Required features explicitly not supported. */
  unsupported: number;
  /** Required features missing from the matrix or marked unknown. */
  unknown: number;
  total: number;
  /** True when at least one required feature has a researched availability entry. */
  hasEvidence: boolean;
};

/**
 * Count how many required capabilities are covered per catalogue featureSupport.
 * Does not invent coverage — unknown/missing entries stay unknown.
 */
export function summarizeFeatureCoverage(
  featureSupport: FeatureSupport[],
  requiredFeatureSlugs: string[],
): FeatureCoverageSummary | null {
  if (requiredFeatureSlugs.length === 0) return null;

  let matched = 0;
  let unsupported = 0;
  let unknown = 0;

  for (const slug of requiredFeatureSlugs) {
    const entry = featureSupport.find((f) => f.featureSlug === slug);
    if (!entry) {
      unknown += 1;
      continue;
    }
    switch (entry.availability) {
      case "supported":
      case "limited":
      case "add-on":
      case "higher-plan-only":
        matched += 1;
        break;
      case "not-supported":
        unsupported += 1;
        break;
      case "unknown":
      default:
        unknown += 1;
        break;
    }
  }

  const hasEvidence = matched + unsupported > 0;
  if (!hasEvidence) return null;

  return {
    matched,
    unsupported,
    unknown,
    total: requiredFeatureSlugs.length,
    hasEvidence,
  };
}
