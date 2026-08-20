import type {
  MediaCoverageRating,
  SoftwareAssetRecommendationLevel,
} from "@/domain/schemas/asset-discovery";

/**
 * Qualitative media coverage rating.
 * Not based purely on asset counts — considers placement specificity,
 * official verification, and whether high-value sections have support.
 */
export function rateMediaCoverage(input: {
  officialVideoCount: number;
  screenshotCount: number;
  officialSourceCount: number;
  hasOverviewVideo: boolean;
  hasFeatureSpecificVideo: boolean;
  hasImplementationVideo: boolean;
  proseHeavyGaps: number;
  staleCount: number;
}): { rating: MediaCoverageRating; reason: string } {
  const {
    officialVideoCount,
    screenshotCount,
    hasOverviewVideo,
    hasFeatureSpecificVideo,
    hasImplementationVideo,
    proseHeavyGaps,
    staleCount,
  } = input;

  if (
    officialVideoCount >= 2 &&
    hasOverviewVideo &&
    hasFeatureSpecificVideo &&
    (screenshotCount > 0 || hasImplementationVideo) &&
    proseHeavyGaps <= 1 &&
    staleCount === 0
  ) {
    return {
      rating: "excellent",
      reason:
        "Overview + feature-specific official media with low prose-only gaps and no stale flags",
    };
  }

  if (
    officialVideoCount >= 1 &&
    hasOverviewVideo &&
    (hasFeatureSpecificVideo || screenshotCount > 0) &&
    proseHeavyGaps <= 2
  ) {
    return {
      rating: "strong",
      reason:
        "Official overview media present with some feature or screenshot coverage",
    };
  }

  if (officialVideoCount >= 1 || (screenshotCount >= 2 && input.officialSourceCount >= 3)) {
    return {
      rating: "adequate",
      reason:
        "Some official media or screenshots exist, but high-value feature/workflow coverage is incomplete",
    };
  }

  if (officialVideoCount === 0 && screenshotCount === 0) {
    return {
      rating: "very-weak",
      reason:
        "No active official videos or screenshots — product page relies on prose and sources only",
    };
  }

  return {
    rating: "weak",
    reason:
      "Limited visual evidence relative to product-page section needs; several prose-heavy gaps remain",
  };
}

export function classifyRecommendationLevel(input: {
  hasSourceUrl: boolean;
  officialSource: boolean;
  reuseExisting: boolean;
  isGenericBrand?: boolean;
  isOldAd?: boolean;
  specificity: "high" | "medium" | "low";
  sectionImportance: "critical" | "high" | "medium" | "low";
  usageIsDoNotUse?: boolean;
  sourceOnly?: boolean;
}): SoftwareAssetRecommendationLevel {
  if (input.usageIsDoNotUse || input.isOldAd) return "do-not-use";
  if (input.reuseExisting) return "reuse-existing";
  if (input.sourceOnly || (!input.hasSourceUrl && input.officialSource === false)) {
    if (!input.hasSourceUrl) {
      // Open search opportunity
      if (
        input.specificity === "high" &&
        (input.sectionImportance === "critical" ||
          input.sectionImportance === "high")
      ) {
        return "add-now";
      }
      if (input.specificity === "high" || input.sectionImportance === "high") {
        return "strong-opportunity";
      }
      return "optional";
    }
    return "source-only";
  }

  if (input.isGenericBrand) return "optional";

  if (
    input.hasSourceUrl &&
    input.officialSource &&
    input.specificity === "high" &&
    (input.sectionImportance === "critical" ||
      input.sectionImportance === "high")
  ) {
    return "add-now";
  }

  if (
    input.hasSourceUrl &&
    input.officialSource &&
    (input.specificity === "high" || input.specificity === "medium")
  ) {
    return "strong-opportunity";
  }

  if (input.hasSourceUrl && input.officialSource) return "optional";
  return "source-only";
}

export function recommendationLevelLabel(
  level: SoftwareAssetRecommendationLevel,
): string {
  switch (level) {
    case "add-now":
      return "ADD NOW";
    case "strong-opportunity":
      return "STRONG OPPORTUNITY";
    case "optional":
      return "OPTIONAL";
    case "source-only":
      return "SOURCE ONLY";
    case "reuse-existing":
      return "REUSE EXISTING MEDIA";
    case "do-not-use":
      return "DO NOT USE";
  }
}
