import {
  ProductMediaSchema,
  type ProductMedia,
} from "@/domain";
import {
  enrichMediaFromSourceUrl,
  parseVideoSourceUrl,
} from "@/services/product-media";
import { findDuplicateResearchMedia } from "@/services/feature-media-research/duplicates";
import {
  CAPABILITY_MEDIA_STAGE_STATUS,
  CAPABILITY_VIDEO_DISCOVERY_TYPES,
  type ActivateCapabilityOfficialVideoInput,
  type CapabilityMediaResearchStage,
  type CapabilityMediaWorkflowResult,
  type ClassifyCapabilityOfficialVideoInput,
  type DiscoverCapabilityOfficialVideoInput,
  type MarkCapabilityUnavailableInput,
  type SubmitCapabilityEditorialReviewInput,
  type VerifyCapabilityOfficialSourceInput,
} from "./types";

function nowIso(override?: string): string {
  return override ?? new Date().toISOString();
}

function slugId(parts: string[]): string {
  return parts
    .map((p) =>
      p.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    )
    .filter(Boolean)
    .join("-");
}

function mediaWhatThisShowsEmpty(media: ProductMedia): boolean {
  return (
    media.whatThisShows.filter((s) => s.trim()).length === 0 &&
    media.whatToNotice.filter((s) => s.trim()).length === 0
  );
}

export function resolveCapabilityMediaStage(
  media: ProductMedia,
): CapabilityMediaResearchStage | "unavailable" | "rejected" | "legacy" {
  switch (media.status) {
    case "discovered":
    case "candidate":
    case "draft":
      return media.officialSource ? "verified" : "discovered";
    case "verified":
      return "verified";
    case "classified":
      return "classified";
    case "needs-review":
      return "editorially-reviewed";
    case "active":
    case "published":
    case "embedding-disabled":
      return "active";
    case "unavailable":
      return "unavailable";
    case "rejected":
      return "rejected";
    default:
      return "legacy";
  }
}

/**
 * Register a potential official video during Capability research.
 * Path: Capability → Products → Requirements → Features → Evidence discovery.
 * Always starts as status=discovered with officialSource=false.
 * Does NOT auto-publish.
 */
export function discoverCapabilityOfficialVideo(
  input: DiscoverCapabilityOfficialVideoInput,
  existingMedia: ProductMedia[] = [],
): CapabilityMediaWorkflowResult {
  const type = input.type ?? "official-video";
  if (
    type === "softwareglimpse-video" ||
    !CAPABILITY_VIDEO_DISCOVERY_TYPES.includes(type)
  ) {
    return {
      ok: false,
      code: "UNSUPPORTED_TYPE",
      message:
        "Capability discovery accepts official-video, official-tutorial, or official-webinar only",
    };
  }

  const parsed = parseVideoSourceUrl(input.sourceUrl);
  if (!parsed) {
    return {
      ok: false,
      code: "INVALID_SOURCE_URL",
      message: "sourceUrl could not be parsed as a video source",
    };
  }

  if (!input.capabilityId.trim()) {
    return {
      ok: false,
      code: "MISSING_CAPABILITY",
      message: "capabilityId is required for Capability media discovery",
    };
  }

  const productSlug = input.productSlug || input.productId;
  if (!productSlug) {
    return {
      ok: false,
      code: "INVALID_SOURCE_URL",
      message: "productSlug (productId) is required",
    };
  }

  const provider = input.provider ?? parsed.provider;
  const providerId = parsed.videoId;
  const duplicate = findDuplicateResearchMedia(
    {
      id: input.id ?? "",
      provider,
      sourceUrl: parsed.sourceUrl,
      videoId: providerId,
      providerId,
    },
    existingMedia,
  );
  if (duplicate) {
    return {
      ok: false,
      code: "DUPLICATE",
      message: `Reuse canonical ResearchMedia ${duplicate.id} — do not create a Capability/Product copy`,
      duplicateOf: duplicate,
    };
  }

  const id =
    input.id ??
    slugId([
      productSlug,
      provider,
      providerId ?? "hosted",
      input.capabilityId,
      "discovered",
    ]);

  const discoveredAt = nowIso();
  const draft = ProductMediaSchema.parse({
    id,
    productSlug,
    productIds: [productSlug],
    type,
    provider,
    sourceUrl: parsed.sourceUrl,
    videoId: providerId,
    providerId,
    embedUrl: parsed.embedUrl,
    thumbnailUrl: parsed.thumbnailUrl,
    title: input.title.trim(),
    sourceOrganization: input.sourceOrganization,
    channelName: input.channelName,
    publishedAt: input.publishedAt,
    officialSource: false,
    verifiedAt: discoveredAt,
    lastCheckedAt: discoveredAt,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: parsed.embeddingSupported,
    capabilityIds: [input.capabilityId],
    featureIds: input.potentialFeatureIds ?? [],
    requirementIds: input.potentialRequirementIds ?? [],
    useCaseIds: input.potentialUseCaseIds ?? [],
    industryIds: input.potentialIndustryIds ?? [],
    workflowStageIds: input.potentialWorkflowStageIds ?? [],
    demonstratedDimensionIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    placements: [],
    purpose:
      input.purpose ??
      `Discovered during Capability research for ${input.capabilityId}`,
    whatThisShows: [],
    limitations: [],
    whatToNotice: [],
    status: CAPABILITY_MEDIA_STAGE_STATUS.discovered,
  });

  return {
    ok: true,
    media: enrichMediaFromSourceUrl(draft),
    stage: "discovered",
  };
}

/**
 * Confirm official vendor source before classification / activation.
 * Does NOT activate for public UI.
 */
export function verifyCapabilityOfficialSource(
  input: VerifyCapabilityOfficialSourceInput,
): CapabilityMediaWorkflowResult {
  const stage = resolveCapabilityMediaStage(input.media);
  if (stage !== "discovered" && stage !== "verified") {
    if (stage === "unavailable" || stage === "rejected") {
      return {
        ok: false,
        code: "NOT_DISCOVERED",
        message: `Cannot verify media in status ${input.media.status}`,
      };
    }
  }

  if (input.media.type === "softwareglimpse-video") {
    return {
      ok: false,
      code: "UNOFFICIAL_BLOCKED",
      message: "SoftwareGlimpse analysis videos are not official vendor media",
    };
  }

  const verifiedAt = nowIso(input.verifiedAt);
  const media = ProductMediaSchema.parse({
    ...input.media,
    officialSource: true,
    officialSourceKind: input.officialSourceKind,
    sourceOrganization:
      input.sourceOrganization ?? input.media.sourceOrganization,
    channelName: input.channelName ?? input.media.channelName,
    verifiedAt,
    status: CAPABILITY_MEDIA_STAGE_STATUS.verified,
  });

  return { ok: true, media, stage: "verified" };
}

/**
 * Map video to capability / requirement / feature / use case / industry.
 * Requires grounded whatThisShows — do not invent unsupported AI observations.
 * Does NOT auto-publish.
 */
export function classifyCapabilityOfficialVideo(
  input: ClassifyCapabilityOfficialVideoInput,
): CapabilityMediaWorkflowResult {
  if (!input.media.officialSource) {
    return {
      ok: false,
      code: "OFFICIAL_SOURCE_REQUIRED",
      message: "Verify official vendor source before classification",
    };
  }

  const stage = resolveCapabilityMediaStage(input.media);
  if (
    stage !== "verified" &&
    stage !== "classified" &&
    stage !== "editorially-reviewed"
  ) {
    return {
      ok: false,
      code: "NOT_VERIFIED",
      message: `Classify requires verified (or later) status; got ${input.media.status}`,
    };
  }

  if (input.capabilityIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_CAPABILITY",
      message: "At least one capabilityId is required",
    };
  }

  const whatThisShows = (input.whatThisShows ?? input.media.whatThisShows)
    .map((s) => s.trim())
    .filter(Boolean);

  if (whatThisShows.length === 0) {
    return {
      ok: false,
      code: "EMPTY_WHAT_THIS_SHOWS",
      message:
        "Provide grounded whatThisShows observations — do not claim things not visible in the video",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    capabilityIds: [...new Set(input.capabilityIds)],
    productIds: [
      ...new Set(input.productIds ?? [input.media.productSlug]),
    ],
    requirementIds: [...new Set(input.requirementIds ?? [])],
    featureIds: [...new Set(input.featureIds ?? [])],
    useCaseIds: [...new Set(input.useCaseIds ?? [])],
    industryIds: [...new Set(input.industryIds ?? [])],
    workflowStageIds: [
      ...new Set(
        input.workflowStageIds ?? input.media.workflowStageIds ?? [],
      ),
    ],
    whatThisShows,
    limitations: input.limitations ?? input.media.limitations,
    evidenceClaimKinds:
      input.evidenceClaimKinds ?? input.media.evidenceClaimKinds,
    placements: input.placements ?? input.media.placements,
    demonstratesCaption:
      input.demonstratesCaption ?? input.media.demonstratesCaption,
    status: CAPABILITY_MEDIA_STAGE_STATUS.classified,
  });

  return { ok: true, media, stage: "classified" };
}

/**
 * Move classified media into editorial review (status needs-review).
 * Still not public.
 */
export function submitCapabilityEditorialReview(
  input: SubmitCapabilityEditorialReviewInput,
): CapabilityMediaWorkflowResult {
  const stage = resolveCapabilityMediaStage(input.media);
  if (stage !== "classified" && stage !== "editorially-reviewed") {
    return {
      ok: false,
      code: "NOT_CLASSIFIED",
      message: `Editorial review requires classified status; got ${input.media.status}`,
    };
  }
  if (!input.media.officialSource) {
    return {
      ok: false,
      code: "OFFICIAL_SOURCE_REQUIRED",
      message: "Official source verification required before editorial review",
    };
  }
  if (mediaWhatThisShowsEmpty(input.media)) {
    return {
      ok: false,
      code: "EMPTY_WHAT_THIS_SHOWS",
      message: "Editorial review requires grounded whatThisShows",
    };
  }
  if (input.media.capabilityIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_CAPABILITY",
      message: "Editorial review requires capability mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    editorialCommentary:
      input.editorialCommentary ?? input.media.editorialCommentary,
    status: CAPABILITY_MEDIA_STAGE_STATUS["editorially-reviewed"],
  });

  return { ok: true, media, stage: "editorially-reviewed" };
}

/**
 * Explicit activation for public Capability / Product UI.
 * Never called automatically after discovery.
 */
export function activateCapabilityOfficialVideo(
  input: ActivateCapabilityOfficialVideoInput,
): CapabilityMediaWorkflowResult {
  const stage = resolveCapabilityMediaStage(input.media);
  if (stage !== "editorially-reviewed" && stage !== "active") {
    return {
      ok: false,
      code: "NOT_IN_REVIEW",
      message: `Activation requires editorial review; got ${input.media.status}`,
    };
  }
  if (!input.media.officialSource) {
    return {
      ok: false,
      code: "OFFICIAL_SOURCE_REQUIRED",
      message: "Cannot activate unofficial media",
    };
  }
  if (mediaWhatThisShowsEmpty(input.media)) {
    return {
      ok: false,
      code: "EMPTY_WHAT_THIS_SHOWS",
      message: "Cannot activate without grounded whatThisShows",
    };
  }
  if (input.media.capabilityIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_CAPABILITY",
      message: "Cannot activate without capability mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    verifiedAt: nowIso(input.verifiedAt),
    status: input.status ?? CAPABILITY_MEDIA_STAGE_STATUS.active,
  });

  return { ok: true, media, stage: "active" };
}

/**
 * Mark deleted / unavailable sources without erasing research history.
 */
export function markCapabilityOfficialVideoUnavailable(
  input: MarkCapabilityUnavailableInput,
): CapabilityMediaWorkflowResult {
  const flag =
    input.reason === "source-no-longer-official"
      ? "source-no-longer-official"
      : "source-unavailable";
  const media = ProductMediaSchema.parse({
    ...input.media,
    status: "unavailable",
    sourceHealth: "unavailable",
    lastCheckedAt: nowIso(input.checkedAt),
    refreshFlags: [...new Set([...(input.media.refreshFlags ?? []), flag])],
    officialSource:
      input.reason === "source-no-longer-official"
        ? false
        : input.media.officialSource,
  });

  return { ok: true, media, stage: "unavailable" };
}

/**
 * Append an additional Capability mapping onto an existing ResearchMedia record.
 * Supports multi-capability videos without duplicating the canonical record.
 */
export function mapVideoToAdditionalCapability(
  media: ProductMedia,
  capabilityId: string,
): CapabilityMediaWorkflowResult {
  if (!capabilityId.trim()) {
    return {
      ok: false,
      code: "MISSING_CAPABILITY",
      message: "capabilityId required",
    };
  }
  const stage = resolveCapabilityMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map capabilities on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    capabilityIds: [...new Set([...media.capabilityIds, capabilityId])],
  });
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}

/**
 * Append feature / requirement / use-case / industry tags onto an existing record.
 * Used when Capability research finds a Feature-scoped video already in catalog.
 */
export function mapCapabilityResearchTags(
  media: ProductMedia,
  tags: {
    featureIds?: string[];
    requirementIds?: string[];
    useCaseIds?: string[];
    industryIds?: string[];
    workflowStageIds?: string[];
  },
): CapabilityMediaWorkflowResult {
  const stage = resolveCapabilityMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map tags on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    featureIds: [
      ...new Set([...(media.featureIds ?? []), ...(tags.featureIds ?? [])]),
    ],
    requirementIds: [
      ...new Set([
        ...(media.requirementIds ?? []),
        ...(tags.requirementIds ?? []),
      ]),
    ],
    useCaseIds: [
      ...new Set([...(media.useCaseIds ?? []), ...(tags.useCaseIds ?? [])]),
    ],
    industryIds: [
      ...new Set([...(media.industryIds ?? []), ...(tags.industryIds ?? [])]),
    ],
    workflowStageIds: [
      ...new Set([
        ...(media.workflowStageIds ?? []),
        ...(tags.workflowStageIds ?? []),
      ]),
    ],
  });
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}
