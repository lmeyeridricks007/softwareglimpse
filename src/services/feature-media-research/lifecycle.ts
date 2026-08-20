import {
  ProductMediaSchema,
  type ProductMedia,
} from "@/domain";
import {
  enrichMediaFromSourceUrl,
  parseVideoSourceUrl,
} from "@/services/product-media";
import { findDuplicateResearchMedia } from "./duplicates";
import {
  FEATURE_MEDIA_STAGE_STATUS,
  type ActivateOfficialVideoInput,
  type ClassifyOfficialVideoInput,
  type DiscoverOfficialVideoInput,
  type FeatureMediaResearchStage,
  type FeatureMediaWorkflowResult,
  type MarkUnavailableInput,
  type SubmitEditorialReviewInput,
  type VerifyOfficialSourceInput,
} from "./types";

function nowIso(override?: string): string {
  return override ?? new Date().toISOString();
}

function slugId(parts: string[]): string {
  return parts
    .map((p) => p.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""))
    .filter(Boolean)
    .join("-");
}

export function resolveFeatureMediaStage(
  media: ProductMedia,
): FeatureMediaResearchStage | "unavailable" | "rejected" | "legacy" {
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
      return "editorial-review";
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
 * Register a potential official video for Feature research.
 * Always starts as status=discovered with officialSource=false.
 * Does NOT auto-publish.
 */
export function discoverOfficialVideo(
  input: DiscoverOfficialVideoInput,
  existingMedia: ProductMedia[] = [],
): FeatureMediaWorkflowResult {
  const parsed = parseVideoSourceUrl(input.sourceUrl);
  if (!parsed) {
    return {
      ok: false,
      code: "INVALID_SOURCE_URL",
      message: "sourceUrl could not be parsed as a video source",
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
      message: `Duplicate ResearchMedia already exists (${duplicate.id})`,
      duplicateOf: duplicate,
    };
  }

  const id =
    input.id ??
    slugId([
      input.productSlug,
      provider,
      providerId ?? "hosted",
      input.featureId,
      "discovered",
    ]);

  const discoveredAt = nowIso();
  const draft = ProductMediaSchema.parse({
    id,
    productSlug: input.productSlug,
    productIds: [input.productSlug],
    type: input.type ?? "official-video",
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
    /** Must be verified by researcher before true. */
    officialSource: false,
    verifiedAt: discoveredAt,
    lastCheckedAt: discoveredAt,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: parsed.embeddingSupported,
    featureIds: [input.featureId],
    demonstratedDimensionIds: input.potentialDimensionIds ?? [],
    requirementIds: [],
    capabilityIds: [],
    useCaseIds: [],
    industryIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    placements: [],
    purpose:
      input.purpose ??
      `Discovered during Feature research for ${input.featureId}`,
    whatThisShows: [],
    limitations: [],
    whatToNotice: [],
    status: FEATURE_MEDIA_STAGE_STATUS.discovered,
  });
  const media = enrichMediaFromSourceUrl(draft);

  return { ok: true, media, stage: "discovered" };
}

/**
 * Confirm official vendor source. Sets officialSource=true and status=verified.
 * Does NOT activate for public UI.
 */
export function verifyOfficialSource(
  input: VerifyOfficialSourceInput,
): FeatureMediaWorkflowResult {
  const stage = resolveFeatureMediaStage(input.media);
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
    status: FEATURE_MEDIA_STAGE_STATUS.verified,
  });

  return { ok: true, media, stage: "verified" };
}

/**
 * Map video to feature / product / evaluation dimensions + grounded observations.
 * Rejects empty whatThisShows invention — observations must be supplied by researcher.
 * Does NOT auto-publish.
 */
export function classifyOfficialVideo(
  input: ClassifyOfficialVideoInput,
): FeatureMediaWorkflowResult {
  if (!input.media.officialSource) {
    return {
      ok: false,
      code: "OFFICIAL_SOURCE_REQUIRED",
      message: "Verify official vendor source before classification",
    };
  }

  const stage = resolveFeatureMediaStage(input.media);
  if (
    stage !== "verified" &&
    stage !== "classified" &&
    stage !== "editorial-review"
  ) {
    return {
      ok: false,
      code: "NOT_VERIFIED",
      message: `Classify requires verified (or later) status; got ${input.media.status}`,
    };
  }

  if (input.featureIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_FEATURE",
      message: "At least one featureId is required",
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
        "Provide grounded whatThisShows observations — do not invent unsupported AI copy",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    featureIds: [...new Set(input.featureIds)],
    productIds: [
      ...new Set(input.productIds ?? [input.media.productSlug]),
    ],
    demonstratedDimensionIds: [
      ...new Set(input.demonstratedDimensionIds ?? []),
    ],
    requirementIds: [...new Set(input.requirementIds ?? [])],
    capabilityIds: [...new Set(input.capabilityIds ?? [])],
    useCaseIds: [...new Set(input.useCaseIds ?? [])],
    whatThisShows,
    limitations: input.limitations ?? input.media.limitations,
    evidenceClaimKinds:
      input.evidenceClaimKinds ?? input.media.evidenceClaimKinds,
    placements: input.placements ?? input.media.placements,
    demonstratesCaption:
      input.demonstratesCaption ?? input.media.demonstratesCaption,
    status: FEATURE_MEDIA_STAGE_STATUS.classified,
  });

  return { ok: true, media, stage: "classified" };
}

/**
 * Move classified media into editorial review. Still not public.
 */
export function submitEditorialReview(
  input: SubmitEditorialReviewInput,
): FeatureMediaWorkflowResult {
  const stage = resolveFeatureMediaStage(input.media);
  if (stage !== "classified" && stage !== "editorial-review") {
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

  const media = ProductMediaSchema.parse({
    ...input.media,
    editorialCommentary:
      input.editorialCommentary ?? input.media.editorialCommentary,
    status: FEATURE_MEDIA_STAGE_STATUS["editorial-review"],
  });

  return { ok: true, media, stage: "editorial-review" };
}

/**
 * Explicit activation for public Feature / Product UI.
 * Never called automatically after discovery.
 */
export function activateOfficialVideo(
  input: ActivateOfficialVideoInput,
): FeatureMediaWorkflowResult {
  const stage = resolveFeatureMediaStage(input.media);
  if (stage !== "editorial-review" && stage !== "active") {
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
  if (input.media.featureIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_FEATURE",
      message: "Cannot activate without feature mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    verifiedAt: nowIso(input.verifiedAt),
    status: input.status ?? FEATURE_MEDIA_STAGE_STATUS.active,
  });

  return { ok: true, media, stage: "active" };
}

/**
 * Mark deleted / unavailable sources without erasing research history.
 */
export function markOfficialVideoUnavailable(
  input: MarkUnavailableInput,
): FeatureMediaWorkflowResult {
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

function mediaWhatThisShowsEmpty(media: ProductMedia): boolean {
  return (
    media.whatThisShows.filter((s) => s.trim()).length === 0 &&
    media.whatToNotice.filter((s) => s.trim()).length === 0
  );
}

/**
 * Append an additional Feature mapping onto an already-classified/active record.
 * Supports one video mapped to multiple Features without duplicating the record.
 */
export function mapVideoToAdditionalFeature(
  media: ProductMedia,
  featureId: string,
  dimensionIds: string[] = [],
): FeatureMediaWorkflowResult {
  if (!featureId.trim()) {
    return {
      ok: false,
      code: "MISSING_FEATURE",
      message: "featureId required",
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    featureIds: [...new Set([...media.featureIds, featureId])],
    demonstratedDimensionIds: [
      ...new Set([...media.demonstratedDimensionIds, ...dimensionIds]),
    ],
  });
  const stage = resolveFeatureMediaStage(next);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map features on status ${media.status}`,
    };
  }
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}
