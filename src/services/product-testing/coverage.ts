import { getSoftware } from "@/data";
import { getAllComparisonsUnfiltered } from "@/data/repositories/catalog";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import { resolveEvidenceLevel } from "@/services/editorial/evidence-level";
import { resolvePricingVerifiedAtForEvidence } from "@/services/editorial/pricing-verified-at";
import {
  buildPublicHandsOnSummary,
  productHasHandsOnTest,
} from "@/services/product-testing/sessions";

export type TestCoverageMetrics = {
  generatedAt: string;
  totalProducts: number;
  researched: number;
  dataVerified: number;
  handsOnTested: number;
  reviewsWithEvidence: number;
  comparisonsWithEvidence: number;
  comparisonsBothTested: number;
  comparisonsOneTested: number;
  comparisonsNoneTested: number;
};

/**
 * Catalogue-wide testing coverage metrics.
 * Hands-on counts only valid completed human test sessions (or assessment/review
 * flags that already meet evidence-level rules).
 * Data-verified uses canonical pricing verification (product + enrichment stamps).
 */
export function buildTestCoverageMetrics(): TestCoverageMetrics {
  const software = getSoftware({ includeUnpublished: true });
  let researched = 0;
  let dataVerified = 0;
  let handsOnTested = 0;
  let reviewsWithEvidence = 0;

  for (const product of software) {
    const assessment = loadAssessment(product.slug);
    const review = loadReview(product.slug);
    const sessionHandsOn = productHasHandsOnTest(product.slug);
    const pricingVerifiedAt = resolvePricingVerifiedAtForEvidence(
      product,
      review?.pricingVerifiedAt,
    );
    const level = resolveEvidenceLevel({
      handsOnTesting:
        sessionHandsOn ||
        Boolean(review?.handsOnTesting || assessment?.handsOnTesting),
      testedAt:
        (sessionHandsOn
          ? buildPublicHandsOnSummary(product.slug)?.testedAt
          : undefined) ??
        review?.testedAt ??
        assessment?.testedAt,
      pricingVerifiedAt,
      lastVerifiedAt:
        product.lastVerifiedAt &&
        pricingVerifiedAt &&
        product.lastVerifiedAt === pricingVerifiedAt
          ? product.lastVerifiedAt
          : null,
    });

    if (level === "hands_on_tested") handsOnTested += 1;
    else if (level === "data_verified") dataVerified += 1;
    else researched += 1;

    const publicSummary = buildPublicHandsOnSummary(product.slug);
    if (
      publicSummary &&
      (publicSummary.publicEvidence.length > 0 ||
        publicSummary.strengths.length > 0)
    ) {
      reviewsWithEvidence += 1;
    }
  }

  const comparisons = getAllComparisonsUnfiltered();
  let comparisonsWithEvidence = 0;
  let comparisonsBothTested = 0;
  let comparisonsOneTested = 0;
  let comparisonsNoneTested = 0;

  for (const comparison of comparisons) {
    const [slugA, slugB] = comparison.productSlugs;
    const a = slugA ? productHasHandsOnTest(slugA) : false;
    const b = slugB ? productHasHandsOnTest(slugB) : false;
    if (a && b) {
      comparisonsBothTested += 1;
      comparisonsWithEvidence += 1;
    } else if (a || b) {
      comparisonsOneTested += 1;
      comparisonsWithEvidence += 1;
    } else {
      comparisonsNoneTested += 1;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    totalProducts: software.length,
    researched,
    dataVerified,
    handsOnTested,
    reviewsWithEvidence,
    comparisonsWithEvidence,
    comparisonsBothTested,
    comparisonsOneTested,
    comparisonsNoneTested,
  };
}
