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
  REQUIREMENT_MEDIA_STAGE_STATUS,
  REQUIREMENT_VIDEO_DISCOVERY_TYPES,
  type ActivateRequirementOfficialVideoInput,
  type ClassifyRequirementOfficialVideoInput,
  type DiscoverRequirementOfficialVideoInput,
  type MarkRequirementUnavailableInput,
  type RequirementCriterionCoverage,
  type RequirementMediaResearchStage,
  type RequirementMediaWorkflowResult,
  type SubmitRequirementEditorialReviewInput,
  type VerifyRequirementOfficialSourceInput,
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
 * Soft detector for generic corporate / brand marketing (not requirement demos).
 * Prefer demos, tutorials, webinars that show criterion-relevant behavior.
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
    /\b(workflow|demo|demonstration|tutorial|how to|walkthrough|setup|webinar|feature|pipeline|permission|stage|automation|reporting|requirement|crm|sales hub)\b/.test(
      text,
    );
  return brandOnly && !useful;
}

export function resolveRequirementMediaStage(
  media: ProductMedia,
): RequirementMediaResearchStage | "unavailable" | "rejected" | "legacy" {
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
 * Register a potential official video during Requirement research.
 * Path: RequirementDefinition → Criteria → Features → Product Assessments → Evidence.
 * Always starts as status=discovered with officialSource=false.
 * Does NOT auto-publish.
 */
export function discoverRequirementOfficialVideo(
  input: DiscoverRequirementOfficialVideoInput,
  existingMedia: ProductMedia[] = [],
): RequirementMediaWorkflowResult {
  const type = input.type ?? "official-video";
  if (
    type === "softwareglimpse-video" ||
    !REQUIREMENT_VIDEO_DISCOVERY_TYPES.includes(type)
  ) {
    return {
      ok: false,
      code: "UNSUPPORTED_TYPE",
      message:
        "Requirement discovery accepts official-video, official-tutorial, or official-webinar only",
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
        "Skip generic corporate/brand marketing — prefer demos, tutorials, or webinars that show criterion-relevant behavior",
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

  const requirementIds = [
    ...new Set(
      [
        input.requirementId,
        ...(input.potentialRequirementIds ?? []),
      ].filter((x): x is string => Boolean(x?.trim())),
    ),
  ];

  const id =
    input.id ??
    slugId([
      productSlug,
      provider,
      providerId ?? "hosted",
      requirementIds[0] ?? "requirement",
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
    requirementIds,
    requirementCriterionIds: input.potentialCriterionIds ?? [],
    featureIds: input.potentialFeatureIds ?? [],
    capabilityIds: input.potentialCapabilityIds ?? [],
    useCaseIds: input.potentialUseCaseIds ?? [],
    industryIds: input.potentialIndustryIds ?? [],
    workflowStageIds: [],
    demonstratedDimensionIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    placements: [],
    purpose:
      input.purpose ??
      `Discovered during Requirement / Product research${
        requirementIds[0] ? ` for ${requirementIds[0]}` : ""
      }`,
    whatThisShows: [],
    limitations: [],
    whatToNotice: [],
    status: REQUIREMENT_MEDIA_STAGE_STATUS.discovered,
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
export function verifyRequirementOfficialSource(
  input: VerifyRequirementOfficialSourceInput,
): RequirementMediaWorkflowResult {
  const stage = resolveRequirementMediaStage(input.media);
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
    status: REQUIREMENT_MEDIA_STAGE_STATUS.verified,
  });

  return { ok: true, media, stage: "verified" };
}

/**
 * Map video to requirement / criteria / feature / capability / use case / industry.
 * requirementCriterionIds must be genuinely demonstrated — do not infer unseen criteria.
 * Does NOT auto-publish. Video never marks a requirement as fully supported.
 */
export function classifyRequirementOfficialVideo(
  input: ClassifyRequirementOfficialVideoInput,
): RequirementMediaWorkflowResult {
  if (!input.media.officialSource) {
    return {
      ok: false,
      code: "OFFICIAL_SOURCE_REQUIRED",
      message: "Verify official vendor source before classification",
    };
  }

  const stage = resolveRequirementMediaStage(input.media);
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

  if (input.requirementIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_REQUIREMENT",
      message: "At least one requirementId is required",
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

  const requirementCriterionIds = [
    ...new Set(
      input.requirementCriterionIds ??
        input.media.requirementCriterionIds ??
        [],
    ),
  ];

  const media = ProductMediaSchema.parse({
    ...input.media,
    productIds: [
      ...new Set(input.productIds ?? [input.media.productSlug]),
    ],
    requirementIds: [...new Set(input.requirementIds)],
    requirementCriterionIds,
    featureIds: [...new Set(input.featureIds ?? [])],
    capabilityIds: [...new Set(input.capabilityIds ?? [])],
    useCaseIds: [...new Set(input.useCaseIds ?? [])],
    industryIds: [...new Set(input.industryIds ?? [])],
    whatThisShows,
    whatToNotice: input.whatToNotice ?? input.media.whatToNotice,
    limitations: input.limitations ?? input.media.limitations,
    evidenceClaimKinds:
      input.evidenceClaimKinds ?? input.media.evidenceClaimKinds,
    placements: input.placements ?? input.media.placements,
    demonstratesCaption:
      input.demonstratesCaption ?? input.media.demonstratesCaption,
    status: REQUIREMENT_MEDIA_STAGE_STATUS.classified,
  });

  return { ok: true, media, stage: "classified" };
}

/**
 * Explicit criterion coverage from classified requirementCriterionIds only.
 * Never infers unseen criteria from titles or marketing copy.
 */
export function buildExplicitCriterionCoverage(
  media: ProductMedia,
  criteria: Array<{ id: string; label: string }>,
): RequirementCriterionCoverage[] {
  const demonstrated = new Set(
    (media.requirementCriterionIds ?? []).map((id) => id.toLowerCase()),
  );
  return criteria.map((criterion) => {
    const id = criterion.id.toLowerCase();
    const labelSlug = criterion.label.toLowerCase().replace(/\s+/g, "-");
    const shown = demonstrated.has(id) || demonstrated.has(labelSlug);
    return {
      criterionId: criterion.id,
      label: criterion.label,
      status: shown ? "demonstrated" : "not-shown",
    };
  });
}

export function submitRequirementEditorialReview(
  input: SubmitRequirementEditorialReviewInput,
): RequirementMediaWorkflowResult {
  const stage = resolveRequirementMediaStage(input.media);
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
  if (input.media.requirementIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_REQUIREMENT",
      message: "Editorial review requires requirement mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    editorialCommentary:
      input.editorialCommentary ?? input.media.editorialCommentary,
    status: REQUIREMENT_MEDIA_STAGE_STATUS["editorially-reviewed"],
  });

  return { ok: true, media, stage: "editorially-reviewed" };
}

/**
 * Explicit activation for public Requirement / Product UI.
 * Never called automatically after discovery.
 */
export function activateRequirementOfficialVideo(
  input: ActivateRequirementOfficialVideoInput,
): RequirementMediaWorkflowResult {
  const stage = resolveRequirementMediaStage(input.media);
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
  if (input.media.requirementIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_REQUIREMENT",
      message: "Cannot activate without requirement mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    verifiedAt: nowIso(input.verifiedAt),
    status: input.status ?? REQUIREMENT_MEDIA_STAGE_STATUS.active,
  });

  return { ok: true, media, stage: "active" };
}

export function markRequirementOfficialVideoUnavailable(
  input: MarkRequirementUnavailableInput,
): RequirementMediaWorkflowResult {
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
 * Append an additional Requirement mapping onto an existing ResearchMedia record.
 * Supports multi-context videos without duplicating the canonical record.
 */
export function mapVideoToAdditionalRequirement(
  media: ProductMedia,
  requirementId: string,
): RequirementMediaWorkflowResult {
  if (!requirementId.trim()) {
    return {
      ok: false,
      code: "MISSING_REQUIREMENT",
      message: "requirementId required",
    };
  }
  const stage = resolveRequirementMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map requirements on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    requirementIds: [...new Set([...media.requirementIds, requirementId])],
  });
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}

/**
 * Append capability / feature / criterion / use-case / industry tags
 * onto an existing canonical ResearchMedia (no duplication).
 */
export function mapRequirementResearchTags(
  media: ProductMedia,
  tags: {
    capabilityIds?: string[];
    featureIds?: string[];
    requirementIds?: string[];
    requirementCriterionIds?: string[];
    industryIds?: string[];
    useCaseIds?: string[];
  },
): RequirementMediaWorkflowResult {
  const stage = resolveRequirementMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map tags on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    requirementIds: [
      ...new Set([
        ...(media.requirementIds ?? []),
        ...(tags.requirementIds ?? []),
      ]),
    ],
    requirementCriterionIds: [
      ...new Set([
        ...(media.requirementCriterionIds ?? []),
        ...(tags.requirementCriterionIds ?? []),
      ]),
    ],
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
    industryIds: [
      ...new Set([...(media.industryIds ?? []), ...(tags.industryIds ?? [])]),
    ],
  });
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}
