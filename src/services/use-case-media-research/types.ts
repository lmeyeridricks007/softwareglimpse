import type {
  OfficialSourceKind,
  ProductMedia,
  ResearchMediaProvider,
  ResearchMediaStatus,
  ResearchMediaType,
} from "@/domain";

/**
 * Use Case / Product research video lifecycle (never auto-publish).
 * Status mapping: editorially-reviewed → needs-review.
 */
export type UseCaseMediaResearchStage =
  | "discovered"
  | "verified"
  | "classified"
  | "editorially-reviewed"
  | "active";

export const USE_CASE_MEDIA_STAGE_STATUS: Record<
  UseCaseMediaResearchStage,
  ResearchMediaStatus
> = {
  discovered: "discovered",
  verified: "verified",
  classified: "classified",
  "editorially-reviewed": "needs-review",
  active: "active",
};

/**
 * Discovery kinds for Product / Use Case research.
 * Prefer workflow demos, tutorials, product demos, official webinars.
 * Avoid generic corporate/brand marketing.
 */
export const USE_CASE_VIDEO_DISCOVERY_TYPES: ResearchMediaType[] = [
  "official-video",
  "official-tutorial",
  "official-webinar",
];

export type WorkflowStepCoverageStatus = "demonstrated" | "not-shown";

export type UseCaseWorkflowStepCoverage = {
  stepId: string;
  label: string;
  status: WorkflowStepCoverageStatus;
};

export type DiscoverUseCaseOfficialVideoInput = {
  id?: string;
  /** Product under which the ResearchMedia record is stored (productId). */
  productSlug: string;
  productId?: string;
  sourceUrl: string;
  title: string;
  /** Primary use case being researched (optional at discovery; required to classify). */
  useCaseId?: string;
  potentialUseCaseIds?: string[];
  potentialWorkflowStepIds?: string[];
  potentialCapabilityIds?: string[];
  potentialRequirementIds?: string[];
  potentialFeatureIds?: string[];
  potentialIndustryIds?: string[];
  sourceOrganization?: string;
  publishedAt?: string;
  type?: ResearchMediaType;
  provider?: ResearchMediaProvider;
  channelName?: string;
  purpose?: string;
  /**
   * When true (default), reject titles that look like brand-only marketing
   * with no workflow / demo / tutorial signal.
   */
  rejectGenericBrandMarketing?: boolean;
};

export type VerifyUseCaseOfficialSourceInput = {
  media: ProductMedia;
  officialSourceKind: OfficialSourceKind;
  sourceOrganization?: string;
  channelName?: string;
  verifiedAt?: string;
};

export type ClassifyUseCaseOfficialVideoInput = {
  media: ProductMedia;
  /** Required product id(s) — defaults to media.productSlug. */
  productIds?: string[];
  /** Required — at least one use case for Use Case research classification. */
  useCaseIds: string[];
  /**
   * Workflow steps genuinely demonstrated in the video.
   * Stored as workflowStageIds — do not include unseen steps.
   */
  workflowStepIds?: string[];
  capabilityIds?: string[];
  requirementIds?: string[];
  featureIds?: string[];
  industryIds?: string[];
  /** Grounded observations — never vendor marketing copy as SG analysis. */
  whatThisShows?: string[];
  whatToNotice?: string[];
  limitations?: string[];
  evidenceClaimKinds?: ProductMedia["evidenceClaimKinds"];
  placements?: ProductMedia["placements"];
  demonstratesCaption?: string;
};

export type SubmitUseCaseEditorialReviewInput = {
  media: ProductMedia;
  editorialCommentary?: string;
};

export type ActivateUseCaseOfficialVideoInput = {
  media: ProductMedia;
  status?: "active" | "published";
  verifiedAt?: string;
};

export type MarkUseCaseUnavailableInput = {
  media: ProductMedia;
  reason?: "source-unavailable" | "source-no-longer-official" | "deleted";
  checkedAt?: string;
};

export type UseCaseMediaWorkflowResult =
  | {
      ok: true;
      media: ProductMedia;
      stage: UseCaseMediaResearchStage | "unavailable";
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
        | "MISSING_USE_CASE"
        | "MISSING_PRODUCT"
        | "UNOFFICIAL_BLOCKED"
        | "UNSUPPORTED_TYPE"
        | "GENERIC_BRAND_MARKETING";
      message: string;
      duplicateOf?: ProductMedia;
    };

export type UseCaseVisualCoverageProduct = {
  productSlug: string;
  productName: string;
  researched: boolean;
  hasWorkflowEvidence: boolean;
  hasScreenshots: boolean;
  hasOfficialWorkflowVideo: boolean;
  screenshotCount: number;
  officialWorkflowVideoCount: number;
  pipelineVideoCount: number;
};

export type UseCaseVisualCoverageReport = {
  useCaseSlug: string;
  useCaseName: string;
  generatedAt: string;
  productsAssessed: number;
  productsWithWorkflowEvidence: number;
  productsWithScreenshots: number;
  productsWithOfficialWorkflowVideo: number;
  productsLackingVisualEvidence: string[];
  productsMissingOfficialWorkflowVideo: string[];
  /**
   * Informational only — must NOT alter research completeness scores
   * unless visual evidence is explicitly required by methodology.
   */
  note: string;
  products: UseCaseVisualCoverageProduct[];
};
