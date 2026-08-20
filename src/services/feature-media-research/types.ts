import type {
  OfficialSourceKind,
  ProductMedia,
  ResearchMediaProvider,
  ResearchMediaStatus,
  ResearchMediaType,
} from "@/domain";

/**
 * Explicit research pipeline stages for Feature media onboarding.
 * Maps onto ResearchMedia.status — never auto-activates for public UI.
 */
export type FeatureMediaResearchStage =
  | "discovered"
  | "verified"
  | "classified"
  | "editorial-review"
  | "active";

export const FEATURE_MEDIA_STAGE_STATUS: Record<
  FeatureMediaResearchStage,
  ResearchMediaStatus
> = {
  discovered: "discovered",
  verified: "verified",
  classified: "classified",
  "editorial-review": "needs-review",
  active: "active",
};

export type DiscoverOfficialVideoInput = {
  /** Stable id; when omitted, derived from product + provider id. */
  id?: string;
  productSlug: string;
  sourceUrl: string;
  title: string;
  /** Feature being researched (primary). */
  featureId: string;
  /** Potential evaluation dimensions — not yet confirmed observations. */
  potentialDimensionIds?: string[];
  sourceOrganization?: string;
  publishedAt?: string;
  type?: ResearchMediaType;
  provider?: ResearchMediaProvider;
  channelName?: string;
  purpose?: string;
};

export type VerifyOfficialSourceInput = {
  media: ProductMedia;
  officialSourceKind: OfficialSourceKind;
  sourceOrganization?: string;
  channelName?: string;
  /** ISO timestamp — defaults to now. */
  verifiedAt?: string;
};

export type ClassifyOfficialVideoInput = {
  media: ProductMedia;
  featureIds: string[];
  /** Product id/slug — defaults to media.productSlug. */
  productIds?: string[];
  demonstratedDimensionIds?: string[];
  requirementIds?: string[];
  capabilityIds?: string[];
  useCaseIds?: string[];
  /**
   * Grounded observations only — researcher-supplied.
   * Do not invent unsupported AI observations.
   */
  whatThisShows?: string[];
  limitations?: string[];
  evidenceClaimKinds?: ProductMedia["evidenceClaimKinds"];
  placements?: ProductMedia["placements"];
  demonstratesCaption?: string;
};

export type SubmitEditorialReviewInput = {
  media: ProductMedia;
  editorialCommentary?: string;
};

export type ActivateOfficialVideoInput = {
  media: ProductMedia;
  /** Defaults to "active". Never called implicitly after discovery. */
  status?: "active" | "published";
  verifiedAt?: string;
};

export type MarkUnavailableInput = {
  media: ProductMedia;
  reason?: "source-unavailable" | "source-no-longer-official" | "deleted";
  checkedAt?: string;
};

export type FeatureMediaWorkflowResult =
  | {
      ok: true;
      media: ProductMedia;
      stage: FeatureMediaResearchStage | "unavailable";
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
        | "MISSING_FEATURE"
        | "UNOFFICIAL_BLOCKED";
      message: string;
      duplicateOf?: ProductMedia;
    };

export type FeatureVisualCoverageProduct = {
  productSlug: string;
  productName: string;
  researched: boolean;
  hasScreenshots: boolean;
  hasOfficialVideos: boolean;
  /** Screenshots or official videos (active or in pipeline). */
  hasVisualEvidence: boolean;
  screenshotCount: number;
  officialVideoCount: number;
  /** Pipeline videos not yet active/published. */
  pipelineVideoCount: number;
};

export type FeatureVisualCoverageReport = {
  featureSlug: string;
  featureName: string;
  generatedAt: string;
  productsResearched: number;
  productsWithScreenshots: number;
  productsWithOfficialVideos: number;
  productsLackingVisualEvidence: string[];
  /**
   * Missing video is never treated as research failure.
   * These products have docs/screenshots or assessments but no official video.
   */
  productsMissingOfficialVideo: string[];
  note: string;
  products: FeatureVisualCoverageProduct[];
};
