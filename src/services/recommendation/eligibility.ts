import type { CrmFinderCriteria } from "@/domain";
import type { CrmFinderConfig } from "@/data/config/recommendation/crm-finder-v1";
import type {
  EligibilityExclusion,
  EligibilityResult,
  ProductRecommendationSnapshot,
} from "./types";

/**
 * Hard eligibility for finder scoring.
 * Unknown required features do NOT exclude when unknownDoesNotExclude is true.
 */
export function evaluateEligibility(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
  config: CrmFinderConfig,
  categorySlug = "crm",
): EligibilityResult {
  const exclusions: EligibilityExclusion[] = [];

  if (snapshot.primaryCategorySlug !== categorySlug) {
    exclusions.push({
      productSlug: snapshot.slug,
      reason: `Primary category is not ${categorySlug}`,
      code: "wrong-category",
    });
    return { eligible: false, exclusions };
  }

  if (config.hardExcludeIfRequiredFeatureNotSupported) {
    for (const featureSlug of criteria.requiredFeatureSlugs) {
      const support = snapshot.featureSupport.find((f) => f.slug === featureSlug);
      if (!support) {
        // Missing enrichment = unknown — does not exclude
        if (!config.unknownDoesNotExclude) {
          exclusions.push({
            productSlug: snapshot.slug,
            reason: `Required feature ${featureSlug} is unknown`,
            code: "required-feature-not-supported",
          });
        }
        continue;
      }
      if (support.availability === "not-supported") {
        exclusions.push({
          productSlug: snapshot.slug,
          reason: `Required feature ${featureSlug} is not supported`,
          code: "required-feature-not-supported",
        });
      }
      // unknown / limited / add-on / higher-plan-only / supported: do not hard-exclude
    }
  }

  return {
    eligible: exclusions.length === 0,
    exclusions,
  };
}

/**
 * Enough catalogue data to participate in the finder.
 * Separate from SEO / publishing eligibility.
 */
export function isFinderEligible(
  snapshot: ProductRecommendationSnapshot,
  categorySlug = "crm",
): boolean {
  if (snapshot.primaryCategorySlug !== categorySlug) return false;
  return (
    snapshot.useCaseSlugs.length > 0 || snapshot.featureSupport.length > 0
  );
}
