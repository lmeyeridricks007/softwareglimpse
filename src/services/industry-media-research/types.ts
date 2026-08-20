import type {
  IndustryMediaRelevance,
  OfficialSourceKind,
  ProductMedia,
  ResearchMediaContext,
  ResearchMediaProvider,
  ResearchMediaStatus,
  ResearchMediaType,
} from "@/domain";

/**
 * Industry research video lifecycle (never auto-publish).
 * Status mapping: editorially-reviewed → needs-review.
 */
export type IndustryMediaResearchStage =
  | "discovered"
  | "verified"
  | "classified"
  | "editorially-reviewed"
  | "active";

export const INDUSTRY_MEDIA_STAGE_STATUS: Record<
  IndustryMediaResearchStage,
  ResearchMediaStatus
> = {
  discovered: "discovered",
  verified: "verified",
  classified: "classified",
  "editorially-reviewed": "needs-review",
  active: "active",
};

/**
 * Discovery kinds for Industry research / onboarding.
 * Prefer industry demos, editions, workflows, webinars, tutorials, case studies.
 * Avoid generic brand marketing.
 */
export const INDUSTRY_VIDEO_DISCOVERY_TYPES: ResearchMediaType[] = [
  "official-video",
  "official-tutorial",
  "official-webinar",
  "official-customer-case-study",
];

export type DiscoverIndustryOfficialVideoInput = {
  id?: string;
  /** Product under which the ResearchMedia record is stored (productId). */
  productSlug: string;
  productId?: string;
  sourceUrl: string;
  title: string;
  /** Primary industry being researched (optional at discovery; required to classify). */
  industryId?: string;
  potentialIndustryIds?: string[];
  potentialUseCaseIds?: string[];
  potentialCapabilityIds?: string[];
  potentialRequirementIds?: string[];
  potentialFeatureIds?: string[];
  /** Suggested mediaContext — not trusted until classify. */
  suggestedMediaContext?: ResearchMediaContext;
  industryEditionLabel?: string;
  sourceOrganization?: string;
  publishedAt?: string;
  type?: ResearchMediaType;
  provider?: ResearchMediaProvider;
  channelName?: string;
  purpose?: string;
  /**
   * When true (default), reject titles that look like brand-only marketing
   * with no industry / workflow / demo signal.
   */
  rejectGenericBrandMarketing?: boolean;
};

export type VerifyIndustryOfficialSourceInput = {
  media: ProductMedia;
  officialSourceKind: OfficialSourceKind;
  sourceOrganization?: string;
  channelName?: string;
  verifiedAt?: string;
};

export type ClassifyIndustryOfficialVideoInput = {
  media: ProductMedia;
  /** Required product id(s) — defaults to media.productSlug. */
  productIds?: string[];
  /** Required — at least one industry for Industry research classification. */
  industryIds: string[];
  /**
   * Required display / evidence classification.
   * Never auto-promote general demos to industry-specific.
   */
  mediaContext: ResearchMediaContext;
  /**
   * Researcher judgment — weak must not surface prominently.
   */
  industryRelevance: IndustryMediaRelevance;
  industryEditionLabel?: string;
  customerOrganization?: string;
  useCaseIds?: string[];
  capabilityIds?: string[];
  requirementIds?: string[];
  featureIds?: string[];
  workflowStageIds?: string[];
  /** Grounded observations — never vendor marketing copy as SG analysis. */
  whatThisShows?: string[];
  whatToNotice?: string[];
  limitations?: string[];
  /**
   * Vendor-reported outcomes for case studies only.
   * Stored as claims — never SoftwareGlimpse facts.
   */
  reportedOutcomes?: string[];
  evidenceClaimKinds?: ProductMedia["evidenceClaimKinds"];
  placements?: ProductMedia["placements"];
  demonstratesCaption?: string;
};

export type SubmitIndustryEditorialReviewInput = {
  media: ProductMedia;
  editorialCommentary?: string;
};

export type ActivateIndustryOfficialVideoInput = {
  media: ProductMedia;
  status?: "active" | "published";
  verifiedAt?: string;
};

export type MarkIndustryUnavailableInput = {
  media: ProductMedia;
  reason?: "source-unavailable" | "source-no-longer-official" | "deleted";
  checkedAt?: string;
};

export type FlagIndustryMediaHealthInput = {
  media: ProductMedia;
  flags: Array<
    | "unavailable"
    | "embedding-disabled"
    | "stale-ui"
    | "source-changed"
    | "industry-relationship-needs-review"
  >;
  checkedAt?: string;
};

export type IndustryMediaWorkflowResult =
  | {
      ok: true;
      media: ProductMedia;
      stage: IndustryMediaResearchStage | "unavailable";
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
        | "MISSING_INDUSTRY"
        | "MISSING_PRODUCT"
        | "MISSING_MEDIA_CONTEXT"
        | "MISSING_RELEVANCE"
        | "MISSING_EDITION_LABEL"
        | "UNOFFICIAL_BLOCKED"
        | "UNSUPPORTED_TYPE"
        | "GENERIC_BRAND_MARKETING"
        | "CASE_STUDY_TYPE_REQUIRED";
      message: string;
      duplicateOf?: ProductMedia;
    };

export type IndustryVisualCoverageReport = {
  industrySlug: string;
  industryName: string;
  generatedAt: string;
  industrySpecificVideos: number;
  industryEditionsRepresented: number;
  industryEditionLabels: string[];
  productsWithIndustryDemos: number;
  generalRelevantWorkflows: number;
  caseStudies: number;
  weakRelevanceCount: number;
  pipelineVideoCount: number;
  products: Array<{
    productSlug: string;
    productName: string;
    industrySpecificCount: number;
    industryEditionCount: number;
    generalWorkflowCount: number;
    caseStudyCount: number;
    weakCount: number;
    pipelineCount: number;
  }>;
  /**
   * Informational only — must NOT alter industry product rankings / fit.
   */
  note: string;
};
