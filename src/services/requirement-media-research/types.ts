import type {
  OfficialSourceKind,
  ProductMedia,
  ResearchMediaProvider,
  ResearchMediaStatus,
  ResearchMediaType,
} from "@/domain";

/**
 * Requirement / Product research video lifecycle (never auto-publish).
 * Status mapping: editorially-reviewed → needs-review.
 */
export type RequirementMediaResearchStage =
  | "discovered"
  | "verified"
  | "classified"
  | "editorially-reviewed"
  | "active";

export const REQUIREMENT_MEDIA_STAGE_STATUS: Record<
  RequirementMediaResearchStage,
  ResearchMediaStatus
> = {
  discovered: "discovered",
  verified: "verified",
  classified: "classified",
  "editorially-reviewed": "needs-review",
  active: "active",
};

/**
 * Discovery kinds for Product / Requirement research.
 * Prefer demos, tutorials, webinars that show criterion-relevant behavior.
 * Avoid generic corporate/brand marketing.
 */
export const REQUIREMENT_VIDEO_DISCOVERY_TYPES: ResearchMediaType[] = [
  "official-video",
  "official-tutorial",
  "official-webinar",
];

export type CriterionCoverageStatus = "demonstrated" | "not-shown";

export type RequirementCriterionCoverage = {
  criterionId: string;
  label: string;
  status: CriterionCoverageStatus;
};

export type DiscoverRequirementOfficialVideoInput = {
  id?: string;
  /** Product under which the ResearchMedia record is stored (productId). */
  productSlug: string;
  productId?: string;
  sourceUrl: string;
  title: string;
  /** Primary requirement being researched (optional at discovery; required to classify). */
  requirementId?: string;
  potentialRequirementIds?: string[];
  potentialCriterionIds?: string[];
  potentialFeatureIds?: string[];
  potentialCapabilityIds?: string[];
  potentialUseCaseIds?: string[];
  potentialIndustryIds?: string[];
  sourceOrganization?: string;
  publishedAt?: string;
  type?: ResearchMediaType;
  provider?: ResearchMediaProvider;
  channelName?: string;
  purpose?: string;
  /**
   * When true (default), reject titles that look like brand-only marketing
   * with no requirement / feature / demo signal.
   */
  rejectGenericBrandMarketing?: boolean;
};

export type VerifyRequirementOfficialSourceInput = {
  media: ProductMedia;
  officialSourceKind: OfficialSourceKind;
  sourceOrganization?: string;
  channelName?: string;
  verifiedAt?: string;
};

export type ClassifyRequirementOfficialVideoInput = {
  media: ProductMedia;
  /** Required product id(s) — defaults to media.productSlug. */
  productIds?: string[];
  /** Required — at least one requirement for Requirement research classification. */
  requirementIds: string[];
  /**
   * Evaluation criteria genuinely demonstrated in the video.
   * Partial evidence only — never treat as full-requirement support.
   * Empty allowed when video only supports linked features (not criteria).
   */
  requirementCriterionIds?: string[];
  featureIds?: string[];
  capabilityIds?: string[];
  useCaseIds?: string[];
  industryIds?: string[];
  /** Grounded observations — never vendor marketing copy as SG analysis. */
  whatThisShows?: string[];
  whatToNotice?: string[];
  limitations?: string[];
  evidenceClaimKinds?: ProductMedia["evidenceClaimKinds"];
  placements?: ProductMedia["placements"];
  demonstratesCaption?: string;
};

export type SubmitRequirementEditorialReviewInput = {
  media: ProductMedia;
  editorialCommentary?: string;
};

export type ActivateRequirementOfficialVideoInput = {
  media: ProductMedia;
  status?: "active" | "published";
  verifiedAt?: string;
};

export type MarkRequirementUnavailableInput = {
  media: ProductMedia;
  reason?: "source-unavailable" | "source-no-longer-official" | "deleted";
  checkedAt?: string;
};

export type RequirementMediaWorkflowResult =
  | {
      ok: true;
      media: ProductMedia;
      stage: RequirementMediaResearchStage | "unavailable";
      duplicateOf?: never;
    }
  | {
      ok: false;
      code:
        | "INVALID_SOURCE_URL"
        | "DUPLICATE"
        | "NOT_DISCOVERED"
        | "OFFICIAL_SOURCE_REQUIRED"
        | "NOT_VERIFIED"
        | "NOT_CLASSIFIED"
        | "NOT_IN_REVIEW"
        | "EMPTY_WHAT_THIS_SHOWS"
        | "MISSING_REQUIREMENT"
        | "MISSING_PRODUCT"
        | "UNOFFICIAL_BLOCKED"
        | "UNSUPPORTED_TYPE"
        | "GENERIC_BRAND_MARKETING";
      message: string;
      duplicateOf?: ProductMedia;
    };

export type RequirementEvidenceCoverageLevel =
  | "High"
  | "Medium"
  | "Low"
  | "Unknown";

export type RequirementVisualCoverageProduct = {
  productSlug: string;
  productName: string;
  researched: boolean;
  /** Feature / doc / screenshot evidence — excludes video-only. */
  hasNonVideoEvidence: boolean;
  hasScreenshots: boolean;
  hasOfficialCriterionVideo: boolean;
  screenshotCount: number;
  officialCriterionVideoCount: number;
  pipelineVideoCount: number;
  featureEvidenceCount: number;
};

export type RequirementVisualCoverageReport = {
  requirementSlug: string;
  requirementName: string;
  generatedAt: string;
  criteriaCount: number;
  productsAssessed: number;
  /**
   * Derived from non-video research evidence density across assessed products.
   * Video count must NOT feed requirement fit / score.
   */
  evidenceCoverage: RequirementEvidenceCoverageLevel;
  productsWithNonVideoEvidence: number;
  productsWithScreenshots: number;
  productsWithOfficialVideo: number;
  productsLackingNonVideoEvidence: string[];
  productsMissingOfficialVideo: string[];
  /**
   * Informational only — must NOT alter requirement fit scores.
   */
  note: string;
  products: RequirementVisualCoverageProduct[];
};
