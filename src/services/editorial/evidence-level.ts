import type {
  EvidenceLevel,
  EditorialTrustMetadata,
  ProductEditorialAssessment,
  ProductReview,
  Software,
} from "@/domain";
import { EditorialTrustMetadataSchema } from "@/domain";
import { getValidCompletedTestSession } from "@/services/product-testing/sessions";
import {
  resolvePricingVerifiedAtForEvidence,
} from "./pricing-verified-at";

export type ResolveEvidenceLevelInput = {
  handsOnTesting?: boolean;
  testedAt?: string | null;
  pricingVerifiedAt?: string | null;
  lastVerifiedAt?: string | null;
  researchDate?: string | null;
  lastResearchedAt?: string | null;
  hasResearchSources?: boolean;
};

/**
 * Resolve the highest evidence level supported by structured metadata.
 *
 * Rules:
 * - HANDS_ON_TESTED only when handsOnTesting is true AND testedAt (or equivalent) exists.
 *   Current remediation phase: HANDS_ON is NOT_CURRENT_SCOPE — absence must not
 *   block DATA_VERIFIED promotion or page improvement.
 * - DATA_VERIFIED when pricing/data verification timestamps exist (without conflating testing).
 * - RESEARCHED otherwise when research activity is recorded or assumed for a review surface.
 * - Never promote to HANDS_ON_TESTED because an AI pipeline processed the product.
 */
export function resolveEvidenceLevel(
  input: ResolveEvidenceLevelInput,
): EvidenceLevel {
  const tested =
    input.handsOnTesting === true &&
    Boolean(input.testedAt?.trim());

  if (tested) return "hands_on_tested";

  if (
    Boolean(input.pricingVerifiedAt?.trim()) ||
    Boolean(input.lastVerifiedAt?.trim())
  ) {
    return "data_verified";
  }

  return "researched";
}

export type BuildEditorialTrustInput = {
  software?: Software | null;
  review?: ProductReview | null;
  assessment?: ProductEditorialAssessment | null;
  authorId?: string | null;
  reviewerId?: string | null;
  methodologySlug?: string | null;
  methodologyVersion?: string | null;
  sourceIds?: string[];
  /** Optional override when the caller already resolved pricing verification. */
  pricingVerifiedAt?: string | null;
};

/**
 * Build trust metadata from live product/review/assessment fields
 * and any valid completed human ProductTestSession.
 * Only includes fields with real data — never fabricates dates or testing.
 */
export function buildEditorialTrustMetadata(
  input: BuildEditorialTrustInput,
): EditorialTrustMetadata {
  const { software, review, assessment } = input;

  const completedSession = software?.slug
    ? getValidCompletedTestSession(software.slug)
    : null;

  const handsOnTesting = Boolean(
    completedSession ||
      review?.handsOnTesting ||
      assessment?.handsOnTesting,
  );
  const testedAt =
    (handsOnTesting
      ? (completedSession?.completedAt ??
        review?.testedAt ??
        assessment?.testedAt)
      : undefined) ?? undefined;

  const pricingVerifiedAt =
    input.pricingVerifiedAt?.trim() ||
    completedSession?.pricingVerifiedAt ||
    resolvePricingVerifiedAtForEvidence(
      software,
      review?.pricingVerifiedAt,
    ) ||
    undefined;

  const researchDate =
    review?.researchDate ??
    software?.lastResearchedAt ??
    undefined;
  const lastUpdated =
    review?.lastUpdatedAt ??
    assessment?.updatedAt ??
    software?.metadata?.updatedAt ??
    undefined;

  const authorId =
    input.authorId ??
    review?.metadata?.author ??
    software?.metadata?.author ??
    undefined;
  const reviewerId =
    input.reviewerId ??
    review?.metadata?.reviewer ??
    assessment?.reviewer ??
    software?.metadata?.reviewer ??
    undefined;

  // lastVerifiedAt only elevates when it matches an accepted pricing stamp —
  // never treat an opaque lastVerifiedAt as DATA_VERIFIED on its own.
  const acceptedPricing = pricingVerifiedAt?.trim() || null;
  const lastVerifiedAt =
    software?.lastVerifiedAt?.trim() &&
    acceptedPricing &&
    software.lastVerifiedAt.trim() === acceptedPricing
      ? software.lastVerifiedAt.trim()
      : null;

  const evidenceLevel = resolveEvidenceLevel({
    handsOnTesting,
    testedAt,
    pricingVerifiedAt: acceptedPricing,
    lastVerifiedAt,
    researchDate,
    lastResearchedAt: software?.lastResearchedAt,
    hasResearchSources: Boolean(
      (input.sourceIds?.length ?? 0) > 0 ||
        (review?.researchSourceIds?.length ?? 0) > 0 ||
        (software?.sources?.length ?? 0) > 0,
    ),
  });

  const affiliateEnabled = software?.affiliate?.enabled;
  const affiliateRelationship =
    affiliateEnabled === true
      ? true
      : affiliateEnabled === false
        ? false
        : undefined;

  return EditorialTrustMetadataSchema.parse({
    authorId: authorId || undefined,
    reviewerId: reviewerId || undefined,
    researchDate: researchDate || undefined,
    lastUpdated: lastUpdated || undefined,
    pricingVerifiedAt: pricingVerifiedAt || undefined,
    testedAt: testedAt || undefined,
    evidenceLevel,
    methodologySlug:
      input.methodologySlug ??
      assessment?.methodologySlug ??
      review?.methodologySlug ??
      undefined,
    methodologyVersion:
      input.methodologyVersion ??
      assessment?.methodologyVersion ??
      review?.methodologyVersion ??
      undefined,
    sourceIds:
      input.sourceIds ??
      review?.researchSourceIds ??
      software?.sources?.map((s) => s.id) ??
      [],
    affiliateRelationship,
    handsOnTesting,
  });
}
