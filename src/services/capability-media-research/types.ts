import type {
  OfficialSourceKind,
  ProductMedia,
  ResearchMediaProvider,
  ResearchMediaStatus,
  ResearchMediaType,
} from "@/domain";

/**
 * Capability research video lifecycle (never auto-publish).
 * Status mapping: editorially-reviewed → needs-review.
 */
export type CapabilityMediaResearchStage =
  | "discovered"
  | "verified"
  | "classified"
  | "editorially-reviewed"
  | "active";

export const CAPABILITY_MEDIA_STAGE_STATUS: Record<
  CapabilityMediaResearchStage,
  ResearchMediaStatus
> = {
  discovered: "discovered",
  verified: "verified",
  classified: "classified",
  "editorially-reviewed": "needs-review",
  active: "active",
};

/** Discovery kinds allowed during Capability research. */
export const CAPABILITY_VIDEO_DISCOVERY_TYPES: ResearchMediaType[] = [
  "official-video",
  "official-tutorial",
  "official-webinar",
];

export type DiscoverCapabilityOfficialVideoInput = {
  id?: string;
  /** Product under which the ResearchMedia record is stored. */
  productSlug: string;
  /** Alias accepted for productSlug (classification uses productIds). */
  productId?: string;
  sourceUrl: string;
  title: string;
  /** Primary capability being researched. */
  capabilityId: string;
  /**
   * Potential requirement / feature links noted at discovery —
   * refined during classification; not treated as confirmed.
   */
  potentialRequirementIds?: string[];
  potentialFeatureIds?: string[];
  potentialUseCaseIds?: string[];
  potentialIndustryIds?: string[];
  potentialWorkflowStageIds?: string[];
  sourceOrganization?: string;
  publishedAt?: string;
  type?: ResearchMediaType;
  provider?: ResearchMediaProvider;
  channelName?: string;
  purpose?: string;
};

export type VerifyCapabilityOfficialSourceInput = {
  media: ProductMedia;
  officialSourceKind: OfficialSourceKind;
  sourceOrganization?: string;
  channelName?: string;
  verifiedAt?: string;
};

export type ClassifyCapabilityOfficialVideoInput = {
  media: ProductMedia;
  /** Required — capability research primary mapping. */
  capabilityIds: string[];
  /** productId / productSlug list — defaults to media.productSlug. */
  productIds?: string[];
  requirementIds?: string[];
  featureIds?: string[];
  useCaseIds?: string[];
  industryIds?: string[];
  /** Grounded observations only — never invent unsupported claims. */
  whatThisShows?: string[];
  limitations?: string[];
  /** Optional grounded workflow-stage ids visible in the demo. */
  workflowStageIds?: string[];
  evidenceClaimKinds?: ProductMedia["evidenceClaimKinds"];
  placements?: ProductMedia["placements"];
  demonstratesCaption?: string;
};

export type SubmitCapabilityEditorialReviewInput = {
  media: ProductMedia;
  editorialCommentary?: string;
};

export type ActivateCapabilityOfficialVideoInput = {
  media: ProductMedia;
  status?: "active" | "published";
  verifiedAt?: string;
};

export type MarkCapabilityUnavailableInput = {
  media: ProductMedia;
  reason?: "source-unavailable" | "source-no-longer-official" | "deleted";
  checkedAt?: string;
};

export type CapabilityMediaWorkflowResult =
  | {
      ok: true;
      media: ProductMedia;
      stage: CapabilityMediaResearchStage | "unavailable";
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
        | "MISSING_CAPABILITY"
        | "UNOFFICIAL_BLOCKED"
        | "UNSUPPORTED_TYPE";
      message: string;
      duplicateOf?: ProductMedia;
    };

export type CapabilityVisualCoverageProduct = {
  productSlug: string;
  productName: string;
  researched: boolean;
  hasScreenshots: boolean;
  hasOfficialWorkflowVideo: boolean;
  hasVisualEvidence: boolean;
  screenshotCount: number;
  officialWorkflowVideoCount: number;
  pipelineVideoCount: number;
};

export type CapabilityVisualCoverageReport = {
  capabilitySlug: string;
  capabilityName: string;
  industrySlug: string | null;
  generatedAt: string;
  productsAssessed: number;
  productsWithScreenshots: number;
  productsWithOfficialWorkflowVideo: number;
  productsLackingVisualEvidence: string[];
  /**
   * Missing video is NEVER treated as research incompleteness by itself.
   */
  productsMissingOfficialWorkflowVideo: string[];
  note: string;
  products: CapabilityVisualCoverageProduct[];
};
