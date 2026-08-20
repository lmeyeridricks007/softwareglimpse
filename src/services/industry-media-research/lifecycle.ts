import {
  ProductMediaSchema,
  type ProductMedia,
  type ResearchMediaRefreshFlag,
} from "@/domain";
import {
  enrichMediaFromSourceUrl,
  parseVideoSourceUrl,
} from "@/services/product-media";
import { findDuplicateResearchMedia } from "@/services/feature-media-research/duplicates";
import {
  INDUSTRY_MEDIA_STAGE_STATUS,
  INDUSTRY_VIDEO_DISCOVERY_TYPES,
  type ActivateIndustryOfficialVideoInput,
  type ClassifyIndustryOfficialVideoInput,
  type DiscoverIndustryOfficialVideoInput,
  type FlagIndustryMediaHealthInput,
  type IndustryMediaResearchStage,
  type IndustryMediaWorkflowResult,
  type MarkIndustryUnavailableInput,
  type SubmitIndustryEditorialReviewInput,
  type VerifyIndustryOfficialSourceInput,
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
 * Soft detector for generic corporate / brand marketing (not industry demos).
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
    /\b(workflow|demo|demonstration|tutorial|how to|walkthrough|setup|webinar|feature|pipeline|industry|financial services|real estate|healthcare|edition|cloud|customer (story|case)|crm|sales hub)\b/.test(
      text,
    );
  return brandOnly && !useful;
}

export function resolveIndustryMediaStage(
  media: ProductMedia,
): IndustryMediaResearchStage | "unavailable" | "rejected" | "legacy" {
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
 * Register a potential official industry video during Industry research.
 * Always starts as status=discovered with officialSource=false.
 * Does NOT auto-publish. Do not infer official from title/logo.
 */
export function discoverIndustryOfficialVideo(
  input: DiscoverIndustryOfficialVideoInput,
  existingMedia: ProductMedia[] = [],
): IndustryMediaWorkflowResult {
  const type = input.type ?? "official-video";
  if (
    type === "softwareglimpse-video" ||
    !INDUSTRY_VIDEO_DISCOVERY_TYPES.includes(type)
  ) {
    return {
      ok: false,
      code: "UNSUPPORTED_TYPE",
      message:
        "Industry discovery accepts official-video, official-tutorial, official-webinar, or official-customer-case-study",
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
        "Skip generic corporate/brand marketing — prefer industry demos, editions, workflows, webinars, tutorials, or official customer stories",
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
      message: `Reuse canonical ResearchMedia ${duplicate.id} — one industry video may also support Product / Use Case / Capability pages without duplication`,
      duplicateOf: duplicate,
    };
  }

  const industryIds = [
    ...new Set(
      [
        input.industryId,
        ...(input.potentialIndustryIds ?? []),
      ].filter((x): x is string => Boolean(x?.trim())),
    ),
  ];

  const id =
    input.id ??
    slugId([
      productSlug,
      provider,
      providerId ?? "hosted",
      industryIds[0] ?? "industry",
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
    industryIds,
    useCaseIds: input.potentialUseCaseIds ?? [],
    capabilityIds: input.potentialCapabilityIds ?? [],
    requirementIds: input.potentialRequirementIds ?? [],
    featureIds: input.potentialFeatureIds ?? [],
    workflowStageIds: [],
    demonstratedDimensionIds: [],
    requirementCriterionIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    reportedOutcomes: [],
    mediaContext: input.suggestedMediaContext,
    industryEditionLabel: input.industryEditionLabel,
    placements: [],
    purpose:
      input.purpose ??
      `Discovered during Industry research${
        industryIds[0] ? ` for ${industryIds[0]}` : ""
      }`,
    whatThisShows: [],
    limitations: [],
    whatToNotice: [],
    status: INDUSTRY_MEDIA_STAGE_STATUS.discovered,
  });

  return {
    ok: true,
    media: enrichMediaFromSourceUrl(draft),
    stage: "discovered",
  };
}

/**
 * Confirm official vendor source before classification / activation.
 * Does NOT activate for public UI. Do not infer official from title/logo.
 */
export function verifyIndustryOfficialSource(
  input: VerifyIndustryOfficialSourceInput,
): IndustryMediaWorkflowResult {
  const stage = resolveIndustryMediaStage(input.media);
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
    status: INDUSTRY_MEDIA_STAGE_STATUS.verified,
  });

  return { ok: true, media, stage: "verified" };
}

/**
 * Map video to industry (+ optional use case / capability / requirement / feature).
 * Requires mediaContext + industryRelevance. Does NOT auto-publish.
 */
export function classifyIndustryOfficialVideo(
  input: ClassifyIndustryOfficialVideoInput,
): IndustryMediaWorkflowResult {
  if (!input.media.officialSource) {
    return {
      ok: false,
      code: "OFFICIAL_SOURCE_REQUIRED",
      message:
        "Verify official vendor source before classification — do not infer from title or logo",
    };
  }

  const stage = resolveIndustryMediaStage(input.media);
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

  if (input.industryIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_INDUSTRY",
      message: "At least one industryId is required",
    };
  }

  if (!input.mediaContext) {
    return {
      ok: false,
      code: "MISSING_MEDIA_CONTEXT",
      message:
        "mediaContext required: industry-specific | industry-edition | general-workflow | customer-case-study",
    };
  }

  if (!input.industryRelevance) {
    return {
      ok: false,
      code: "MISSING_RELEVANCE",
      message:
        "industryRelevance required: exact-industry-specific | strongly-relevant-general | weak",
    };
  }

  if (
    input.mediaContext === "industry-edition" &&
    !(input.industryEditionLabel ?? input.media.industryEditionLabel)?.trim()
  ) {
    return {
      ok: false,
      code: "MISSING_EDITION_LABEL",
      message:
        "industryEditionLabel required when mediaContext is industry-edition",
    };
  }

  if (
    input.mediaContext === "customer-case-study" &&
    input.media.type !== "official-customer-case-study" &&
    input.media.type !== "official-video" &&
    input.media.type !== "official-webinar"
  ) {
    return {
      ok: false,
      code: "CASE_STUDY_TYPE_REQUIRED",
      message:
        "Case studies should use official-customer-case-study (or official webinar/video on a verified vendor channel)",
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

  const reportedOutcomes = (input.reportedOutcomes ?? input.media.reportedOutcomes ?? [])
    .map((s) => s.trim())
    .filter(Boolean);

  if (
    reportedOutcomes.length > 0 &&
    input.mediaContext !== "customer-case-study" &&
    input.media.type !== "official-customer-case-study"
  ) {
    // Allow storage only on case-study context — otherwise ignore by requiring context
    return {
      ok: false,
      code: "CASE_STUDY_TYPE_REQUIRED",
      message:
        "reportedOutcomes are only for customer-case-study media and must be treated as vendor-reported",
    };
  }

  const nextType =
    input.mediaContext === "customer-case-study"
      ? ("official-customer-case-study" as const)
      : input.media.type === "official-customer-case-study" &&
          input.mediaContext !== "customer-case-study"
        ? ("official-video" as const)
        : input.media.type;

  const media = ProductMediaSchema.parse({
    ...input.media,
    type: nextType,
    productIds: [
      ...new Set(input.productIds ?? [input.media.productSlug]),
    ],
    industryIds: [...new Set(input.industryIds)],
    useCaseIds: [...new Set(input.useCaseIds ?? input.media.useCaseIds)],
    capabilityIds: [
      ...new Set(input.capabilityIds ?? input.media.capabilityIds),
    ],
    requirementIds: [
      ...new Set(input.requirementIds ?? input.media.requirementIds),
    ],
    featureIds: [...new Set(input.featureIds ?? input.media.featureIds)],
    workflowStageIds: [
      ...new Set(input.workflowStageIds ?? input.media.workflowStageIds),
    ],
    mediaContext: input.mediaContext,
    industryRelevance: input.industryRelevance,
    industryEditionLabel:
      input.industryEditionLabel ?? input.media.industryEditionLabel,
    customerOrganization:
      input.customerOrganization ?? input.media.customerOrganization,
    whatThisShows,
    whatToNotice: input.whatToNotice ?? input.media.whatToNotice,
    limitations: input.limitations ?? input.media.limitations,
    reportedOutcomes,
    evidenceClaimKinds:
      input.evidenceClaimKinds ?? input.media.evidenceClaimKinds,
    placements: input.placements ?? input.media.placements,
    demonstratesCaption:
      input.demonstratesCaption ?? input.media.demonstratesCaption,
    status: INDUSTRY_MEDIA_STAGE_STATUS.classified,
  });

  return { ok: true, media, stage: "classified" };
}

export function submitIndustryEditorialReview(
  input: SubmitIndustryEditorialReviewInput,
): IndustryMediaWorkflowResult {
  const stage = resolveIndustryMediaStage(input.media);
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
  if (input.media.industryIds.length === 0) {
    return {
      ok: false,
      code: "MISSING_INDUSTRY",
      message: "Editorial review requires industry mapping",
    };
  }
  if (!input.media.mediaContext) {
    return {
      ok: false,
      code: "MISSING_MEDIA_CONTEXT",
      message: "Editorial review requires mediaContext classification",
    };
  }
  if (!input.media.industryRelevance) {
    return {
      ok: false,
      code: "MISSING_RELEVANCE",
      message: "Editorial review requires industryRelevance judgment",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    editorialCommentary:
      input.editorialCommentary ?? input.media.editorialCommentary,
    status: INDUSTRY_MEDIA_STAGE_STATUS["editorially-reviewed"],
  });

  return { ok: true, media, stage: "editorially-reviewed" };
}

/**
 * Explicit activation for public Industry / Product / Use Case / Capability UI.
 * Never called automatically after discovery.
 */
export function activateIndustryOfficialVideo(
  input: ActivateIndustryOfficialVideoInput,
): IndustryMediaWorkflowResult {
  const stage = resolveIndustryMediaStage(input.media);
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
  if (input.media.industryIds.length === 0 || !input.media.mediaContext) {
    return {
      ok: false,
      code: "MISSING_INDUSTRY",
      message: "Cannot activate without industry + mediaContext mapping",
    };
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    verifiedAt: nowIso(input.verifiedAt),
    status: input.status ?? INDUSTRY_MEDIA_STAGE_STATUS.active,
  });

  return { ok: true, media, stage: "active" };
}

export function markIndustryOfficialVideoUnavailable(
  input: MarkIndustryUnavailableInput,
): IndustryMediaWorkflowResult {
  const flag: ResearchMediaRefreshFlag =
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
 * Apply industry media health flags without deleting research history.
 */
export function flagIndustryMediaHealth(
  input: FlagIndustryMediaHealthInput,
): IndustryMediaWorkflowResult {
  const refreshFlags = new Set<ResearchMediaRefreshFlag>(
    input.media.refreshFlags ?? [],
  );
  let status = input.media.status;
  let sourceHealth = input.media.sourceHealth;
  let embeddingAllowed = input.media.embeddingAllowed;
  let officialSource = input.media.officialSource;

  for (const flag of input.flags) {
    switch (flag) {
      case "unavailable":
        refreshFlags.add("source-unavailable");
        status = "unavailable";
        sourceHealth = "unavailable";
        break;
      case "embedding-disabled":
        refreshFlags.add("embedding-disabled");
        status =
          status === "unavailable" || status === "rejected"
            ? status
            : "embedding-disabled";
        embeddingAllowed = false;
        break;
      case "stale-ui":
        refreshFlags.add("stale-ui");
        break;
      case "source-changed":
        refreshFlags.add("source-changed");
        break;
      case "industry-relationship-needs-review":
        refreshFlags.add("industry-relationship-needs-review");
        break;
    }
  }

  if (
    refreshFlags.has("stale-ui") ||
    refreshFlags.has("source-changed") ||
    refreshFlags.has("industry-relationship-needs-review")
  ) {
    if (status === "active" || status === "published") {
      status = "needs-review";
    }
  }

  const media = ProductMediaSchema.parse({
    ...input.media,
    status,
    sourceHealth,
    embeddingAllowed,
    officialSource,
    lastCheckedAt: nowIso(input.checkedAt),
    refreshFlags: [...refreshFlags],
  });

  const stage = resolveIndustryMediaStage(media);
  if (stage === "unavailable") {
    return { ok: true, media, stage: "unavailable" };
  }
  if (
    stage === "rejected" ||
    stage === "legacy"
  ) {
    return { ok: true, media, stage: "discovered" };
  }
  return { ok: true, media, stage };
}

/**
 * Append an additional industry mapping onto an existing ResearchMedia record.
 */
export function mapVideoToAdditionalIndustry(
  media: ProductMedia,
  industryId: string,
): IndustryMediaWorkflowResult {
  if (!industryId.trim()) {
    return {
      ok: false,
      code: "MISSING_INDUSTRY",
      message: "industryId required",
    };
  }
  const stage = resolveIndustryMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map industries on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    industryIds: [...new Set([...media.industryIds, industryId])],
  });
  return {
    ok: true,
    media: next,
    stage: stage === "discovered" ? "discovered" : stage,
  };
}

/**
 * Append use-case / capability / requirement / feature tags onto canonical ResearchMedia.
 */
export function mapIndustryResearchTags(
  media: ProductMedia,
  tags: {
    industryIds?: string[];
    useCaseIds?: string[];
    capabilityIds?: string[];
    requirementIds?: string[];
    featureIds?: string[];
    workflowStageIds?: string[];
  },
): IndustryMediaWorkflowResult {
  const stage = resolveIndustryMediaStage(media);
  if (stage === "unavailable" || stage === "rejected" || stage === "legacy") {
    return {
      ok: false,
      code: "NOT_DISCOVERED",
      message: `Cannot map tags on status ${media.status}`,
    };
  }
  const next = ProductMediaSchema.parse({
    ...media,
    industryIds: [
      ...new Set([...(media.industryIds ?? []), ...(tags.industryIds ?? [])]),
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
    requirementIds: [
      ...new Set([
        ...(media.requirementIds ?? []),
        ...(tags.requirementIds ?? []),
      ]),
    ],
    featureIds: [
      ...new Set([...(media.featureIds ?? []), ...(tags.featureIds ?? [])]),
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
