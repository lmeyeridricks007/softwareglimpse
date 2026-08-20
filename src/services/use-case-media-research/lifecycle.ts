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
  USE_CASE_MEDIA_STAGE_STATUS,
  USE_CASE_VIDEO_DISCOVERY_TYPES,
  type ActivateUseCaseOfficialVideoInput,
  type ClassifyUseCaseOfficialVideoInput,
  type DiscoverUseCaseOfficialVideoInput,
  type MarkUseCaseUnavailableInput,
  type SubmitUseCaseEditorialReviewInput,
  type UseCaseMediaResearchStage,
  type UseCaseMediaWorkflowResult,
  type UseCaseWorkflowStepCoverage,
  type VerifyUseCaseOfficialSourceInput,
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

/**
 * Soft detector for generic corporate / brand marketing (not workflow demos).
 * Prefer workflow demonstrations, tutorials, product demos, official webinars.
 */
export function isLikelyGenericBrandMarketing(input: {
  title: string;
  purpose?: string;
}): boolean {
  const text = `${input.title} ${input.purpose ?? ""}`.toLowerCase();
  const brandOnly =
    /\b(brand story|our story|about us|company culture|welcome to|rebrand|corporate overview|brand film|manifesto)\b/.test(
      text,
    ) ||
    /^(about|welcome to|meet |introducing our brand)\b/.test(text.trim());
  const useful =
    /\b(workflow|demo|demonstration|tutorial|how to|walkthrough|setup|webinar|feature|lead|pipeline|assign|qualify|capture|convert|sales hub|crm)\b/.test(
      text,
    );
  return brandOnly && !useful;
}

export function resolveUseCaseMediaStage(
  media: ProductMedia,
): UseCaseMediaResearchStage | "unavailable" | "rejected" | "legacy" {
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
 * Register a potential official video during Product / Use Case research.
 * Always starts as status=discovered with officialSource=false.
 * Does NOT auto-publish.
 */
export function discoverUseCaseOfficialVideo(
  input: DiscoverUseCaseOfficialVideoInput,
  existingMedia: ProductMedia[] = [],
): UseCaseMediaWorkflowResult {
  const type = input.type ?? "official-video";
  if (
    type === "softwareglimpse-video" ||
    !USE_CASE_VIDEO_DISCOVERY_TYPES.includes(type)
  ) {
    return {
      ok: false,
      code: "UNSUPPORTED_TYPE",
      message:
        "Use Case discovery accepts official-video, official-tutorial, or official-webinar only",
    };
  }

  const rejectBrand = input.rejectGenericBrandMarketing !== false;
  if (
    rejectBrand &&
    isLikelyGenericBrandMarketing({
      title: input.title,
      purpose: input.purpose,
    })
  ) {
    return {
      ok: false,
      code: "GENERIC_BRAND_MARKETING",
      message:
        "Skip generic corporate/brand marketing — prefer workflow demos, tutorials, product demos, or official webinars",
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

  const productSlug = input.productSlug || input.productId;
  if (!productSlug?.trim()) {
    return {
      ok: false,
      code: "MISSING_PRODUCT",
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
      message: `Reuse canonical ResearchMedia ${duplicate.id} — one video may support Product / Feature / Capability / Requirement / Use Case without duplication`,
      duplicateOf: duplicate,
    };
  }

  const useCaseIds = [
    ...new Set(
      [
        input.useCaseId,
        ...(input.potentialUseCaseIds ?? []),
      ].filter((x): x is string => Boolean(x?.trim())),
    ),
  ];

  const id =
    input.id ??
    slugId([
      productSlug,
      provider,
      providerId ?? "hosted",
      useCaseIds[0] ?? "use-case",
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
    useCaseIds,
    capabilityIds: input.potentialCapabilityIds ?? [],
    featureIds: input.potentialFeatureIds ?? [],
    requirementIds: input.potentialRequirementIds ?? [],
    industryIds: input.potentialIndustryIds ?? [],
    workflowStageIds: input.potentialWorkflowStepIds ?? [],
    demonstratedDimensionIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    placements: [],
    purpose:
      input.purpose ??
      `Discovered during Use Case / Product research${
        useCaseIds[0] ? ` for ${useCaseIds[0]}` : ""
      }`,
    whatThisShows: [],
    limitations: [],
    whatToNotice: [],
    status: USE_CASE_MEDIA_STAGE_STATUS.discovered,
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
export function verifyUseCaseOfficialSource(
  input: VerifyUseCaseOfficialSourceInput,
): UseCaseMediaWorkflowResult {
  const stage = resolveUseCaseMediaStage(input.media);
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
    status: USE_CASE_MEDIA_STAGE_STATUS.verified,
  });

  return { ok: true, media, stage: "verified" };
}

/**
 * Map video to use case / workflow steps / capability / requirement / feature / industry.
 * workflowStepIds must be genuinely demonstrated — do not infer unseen stages.
 * Does NOT auto-publish.
 */
export function classifyUseCaseOfficialVideo(
  input: ClassifyUseCaseOfficialVideoInput,
): UseCaseMediaWorkflowResult {
  if (!input.media.officialSource) {
    return {
      ok: false,
      code: "OFFICIAL_SOURCE_REQUIRED",
      message: "Verify official vendor source before classification",
    };
  }

  const stage = resolveUseCaseMediaStage(input.media);
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

  if (input.useCaseIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_USE_CASE",
      message: "At least one useCaseId is required",
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
        "Provide grounded whatThisShows — do not copy vendor marketing as SoftwareGlimpse analysis",
    };
  }

  const workflowStepIds = [
    ...new Set(
      input.workflowStepIds ?? input.media.workflowStageIds ?? [],
    ),
  ];

  const media = ProductMediaSchema.parse({
    ...input.media,
    productIds: [
      ...new Set(input.productIds ?? [input.media.productSlug]),
    ],
    useCaseIds: [...new Set(input.useCaseIds)],
    workflowStageIds: workflowStepIds,
    capabilityIds: [...new Set(input.capabilityIds ?? [])],
    requirementIds: [...new Set(input.requirementIds ?? [])],
    featureIds: [...new Set(input.featureIds ?? [])],
    industryIds: [...new Set(input.industryIds ?? [])],
    whatThisShows,
    whatToNotice: input.whatToNotice ?? input.media.whatToNotice,
    limitations: input.limitations ?? input.media.limitations,
    evidenceClaimKinds:
      input.evidenceClaimKinds ?? input.media.evidenceClaimKinds,
    placements: input.placements ?? input.media.placements,
    demonstratesCaption:
      input.demonstratesCaption ?? input.media.demonstratesCaption,
    status: USE_CASE_MEDIA_STAGE_STATUS.classified,
  });

  return { ok: true, media, stage: "classified" };
}

/**
 * Explicit workflow coverage from classified workflowStepIds only.
 * Never infers unseen stages from titles or marketing copy.
 */
export function buildExplicitWorkflowCoverage(
  media: ProductMedia,
  steps: Array<{ id: string; label: string }>,
): UseCaseWorkflowStepCoverage[] {
  const demonstrated = new Set(
    media.workflowStageIds.map((id) => id.toLowerCase()),
  );
  return steps.map((step) => {
    const id = step.id.toLowerCase();
    const labelSlug = step.label.toLowerCase().replace(/\s+/g, "-");
    const shown = demonstrated.has(id) || demonstrated.has(labelSlug);
    return {
      stepId: step.id,
      label: step.label,
      status: shown ? "demonstrated" : "not-shown",
    };
  });
}

export function submitUseCaseEditorialReview(
  input: SubmitUseCaseEditorialReviewInput,
): UseCaseMediaWorkflowResult {
  const stage = resolveUseCaseMediaStage(input.media);
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
  if (input.media.useCaseIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_USE_CASE",
      message: "Editorial review requires use-case mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    editorialCommentary:
      input.editorialCommentary ?? input.media.editorialCommentary,
    status: USE_CASE_MEDIA_STAGE_STATUS["editorially-reviewed"],
  });

  return { ok: true, media, stage: "editorially-reviewed" };
}

/**
 * Explicit activation for public Use Case / Product UI.
 * Never called automatically after discovery.
 */
export function activateUseCaseOfficialVideo(
  input: ActivateUseCaseOfficialVideoInput,
): UseCaseMediaWorkflowResult {
  const stage = resolveUseCaseMediaStage(input.media);
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
  if (input.media.useCaseIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_USE_CASE",
      message: "Cannot activate without use-case mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    verifiedAt: nowIso(input.verifiedAt),
    status: input.status ?? USE_CASE_MEDIA_STAGE_STATUS.active,
  });

  return { ok: true, media, stage: "active" };
}

export function markUseCaseOfficialVideoUnavailable(
  input: MarkUseCaseUnavailableInput,
): UseCaseMediaWorkflowResult {
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
 * Append an additional Use Case mapping onto an existing ResearchMedia record.
 * Supports multi-context videos without duplicating the canonical record.
 */
export function mapVideoToAdditionalUseCase(
  media: ProductMedia,
  useCaseId: string,
): UseCaseMediaWorkflowResult {
  if (!useCaseId.trim()) {
    return {
      ok: false,
      code: "MISSING_USE_CASE",
      message: "useCaseId required",
    };
  }
  const stage = resolveUseCaseMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map use cases on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    useCaseIds: [...new Set([...media.useCaseIds, useCaseId])],
  });
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}

/**
 * Append capability / feature / requirement / industry / workflow tags
 * onto an existing canonical ResearchMedia (no duplication).
 */
export function mapUseCaseResearchTags(
  media: ProductMedia,
  tags: {
    capabilityIds?: string[];
    featureIds?: string[];
    requirementIds?: string[];
    industryIds?: string[];
    workflowStepIds?: string[];
    useCaseIds?: string[];
  },
): UseCaseMediaWorkflowResult {
  const stage = resolveUseCaseMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map tags on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    useCaseIds: [
      ...new Set([...(media.useCaseIds ?? []), ...(tags.useCaseIds ?? [])]),
    ],
    capabilityIds: [
      ...new Set([
        ...(media.capabilityIds ?? []),
        ...(tags.capabilityIds ?? []),
      ]),
    ],
    featureIds: [
      ...new Set([...(media.featureIds ?? []), ...(tags.featureIds ?? [])]),
    ],
    requirementIds: [
      ...new Set([
        ...(media.requirementIds ?? []),
        ...(tags.requirementIds ?? []),
      ]),
    ],
    industryIds: [
      ...new Set([...(media.industryIds ?? []), ...(tags.industryIds ?? [])]),
    ],
    workflowStageIds: [
      ...new Set([
        ...(media.workflowStageIds ?? []),
        ...(tags.workflowStepIds ?? []),
      ]),
    ],
  });
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}
