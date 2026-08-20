import type {
  ProductMedia,
  ResearchMediaRefreshFlag,
  ResearchMediaSourceHealth,
  ResearchMediaStatus,
} from "@/domain";
import { isOfficialVendorMedia } from "@/domain";
import { isResearchDomainStale } from "@/services/research/freshness";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
  parseVideoSourceUrl,
} from "@/services/product-media";

export type MediaPublicVisibility = "active" | "link-only" | "hidden";

export type MediaLinkProbe = {
  mediaId: string;
  /** Source watch URL reachable. */
  sourceLive?: boolean;
  /** Embed endpoint / oEmbed detectable as available. */
  embedAvailable?: boolean;
  /** Thumbnail URL reachable. */
  thumbnailLive?: boolean;
  /** Channel / host still looks like official vendor property. */
  stillOfficial?: boolean;
};

export type MediaGovernanceInput = {
  media: ProductMedia;
  now?: Date;
  /** Product research signalled a material product change. */
  productMateriallyChanged?: boolean;
  /** Feature slugs that changed since media.verifiedAt / lastCheckedAt. */
  changedFeatureSlugs?: string[];
  /** Optional remote probe results from link validation / refresh jobs. */
  probe?: MediaLinkProbe;
  /** Industry relationship may be stale / misclassified. */
  industryRelationshipNeedsReview?: boolean;
  /** Demo UI appears outdated vs current product surfaces. */
  uiStale?: boolean;
  /** Canonical source URL / provider identity changed. */
  sourceChanged?: boolean;
};

export type MediaGovernanceResult = {
  mediaId: string;
  flags: ResearchMediaRefreshFlag[];
  publicVisibility: MediaPublicVisibility;
  /** Suggested status — never auto-applied; callers persist after review. */
  recommendedStatus: ResearchMediaStatus | null;
  sourceHealth: ResearchMediaSourceHealth;
  beyondReviewThreshold: boolean;
  /** True when research refresh should be queued. */
  needsResearchRefresh: boolean;
  notes: string[];
};

const YOUTUBE_ID = /^[\w-]{11}$/;
const VIMEO_ID = /^\d+$/;

export function resolveMediaProviderId(media: ProductMedia): string | null {
  const enriched = enrichMediaFromSourceUrl(media);
  return enriched.providerId ?? enriched.videoId ?? null;
}

export function isValidProviderId(
  provider: ProductMedia["provider"],
  id: string | null | undefined,
): boolean {
  if (!id?.trim()) return false;
  if (provider === "youtube") return YOUTUBE_ID.test(id);
  if (provider === "vimeo") return VIMEO_ID.test(id);
  // vendor-hosted: any non-empty id is acceptable when present
  return id.trim().length > 0;
}

/**
 * Evaluate refresh flags and public visibility for official media.
 * Does not mutate or delete research history.
 */
export function evaluateMediaGovernance(
  input: MediaGovernanceInput,
): MediaGovernanceResult {
  const media = enrichMediaFromSourceUrl(input.media);
  const now = input.now ?? new Date();
  const flags = new Set<ResearchMediaRefreshFlag>(media.refreshFlags);
  const notes: string[] = [];

  const checkedAt = media.lastCheckedAt ?? media.verifiedAt;
  const beyondReviewThreshold = isResearchDomainStale({
    domain: "official-media",
    checkedAt,
    now,
  });
  if (beyondReviewThreshold) {
    flags.add("beyond-review-threshold");
    notes.push("Media verification age exceeds official-media freshness policy");
  }

  let sourceHealth: ResearchMediaSourceHealth =
    media.sourceHealth ?? "unknown";

  if (input.probe?.sourceLive === false || media.status === "unavailable") {
    sourceHealth = "unavailable";
    flags.add("source-unavailable");
    notes.push("Source unavailable — hide from active public display");
  } else if (input.probe?.sourceLive === true) {
    sourceHealth = "live";
  }

  if (
    media.status === "embedding-disabled" ||
    media.embeddingAllowed === false ||
    input.probe?.embedAvailable === false
  ) {
    flags.add("embedding-disabled");
    notes.push("Embedding disabled or unavailable — use source link fallback");
  }

  if (input.productMateriallyChanged) {
    flags.add("product-materially-changed");
    notes.push("Product materially changed since media verification");
  }

  const changed = input.changedFeatureSlugs ?? [];
  if (
    changed.length > 0 &&
    media.featureIds.some((id) => changed.includes(id))
  ) {
    flags.add("linked-feature-changed");
    notes.push("Linked feature(s) changed — re-verify demo relevance");
  }

  if (
    input.probe?.stillOfficial === false ||
    (isOfficialVendorMedia(media) === false &&
      media.type !== "softwareglimpse-video")
  ) {
    flags.add("source-no-longer-official");
    notes.push("Official-source claim needs re-verification");
  }

  if (media.type !== "softwareglimpse-video" && media.officialSource !== true) {
    flags.add("source-no-longer-official");
  }

  if (input.uiStale || media.refreshFlags?.includes("stale-ui")) {
    flags.add("stale-ui");
    notes.push("Demo UI may be stale — re-verify against current product surfaces");
  }

  if (input.sourceChanged || media.refreshFlags?.includes("source-changed")) {
    flags.add("source-changed");
    notes.push("Source identity changed — re-verify URL / provider id");
  }

  if (
    input.industryRelationshipNeedsReview ||
    media.refreshFlags?.includes("industry-relationship-needs-review")
  ) {
    flags.add("industry-relationship-needs-review");
    notes.push(
      "Industry relationship needs review — re-check industryIds / mediaContext / relevance",
    );
  }

  const flagList = [...flags];
  const sourceFailed =
    sourceHealth === "unavailable" ||
    flagList.includes("source-unavailable") ||
    media.status === "unavailable" ||
    media.status === "rejected";

  const embeddingOnly =
    !sourceFailed &&
    (flagList.includes("embedding-disabled") ||
      media.status === "embedding-disabled" ||
      media.embeddingAllowed === false);

  let publicVisibility: MediaPublicVisibility = "active";
  let recommendedStatus: ResearchMediaStatus | null = null;

  if (sourceFailed) {
    publicVisibility = "hidden";
    recommendedStatus =
      media.status === "rejected" ? "rejected" : "unavailable";
  } else if (embeddingOnly) {
    publicVisibility = "link-only";
    recommendedStatus =
      media.status === "embedding-disabled" ? null : "embedding-disabled";
  } else if (
    flagList.includes("beyond-review-threshold") ||
    flagList.includes("product-materially-changed") ||
    flagList.includes("linked-feature-changed") ||
    flagList.includes("source-no-longer-official") ||
    flagList.includes("stale-ui") ||
    flagList.includes("source-changed") ||
    flagList.includes("industry-relationship-needs-review")
  ) {
    publicVisibility = isVideoPublicEligible(media).eligible
      ? "active"
      : "hidden";
    if (media.status === "published" || media.status === "active") {
      recommendedStatus = "needs-review";
    }
  }

  const needsResearchRefresh =
    sourceFailed ||
    flagList.includes("beyond-review-threshold") ||
    flagList.includes("product-materially-changed") ||
    flagList.includes("linked-feature-changed") ||
    flagList.includes("source-no-longer-official") ||
    flagList.includes("stale-ui") ||
    flagList.includes("source-changed") ||
    flagList.includes("industry-relationship-needs-review");

  return {
    mediaId: media.id,
    flags: flagList,
    publicVisibility,
    recommendedStatus,
    sourceHealth,
    beyondReviewThreshold,
    needsResearchRefresh,
    notes,
  };
}

/**
 * Merge governance evaluation onto a media record without deleting history.
 * Returns a new object — does not write to disk.
 */
export function applyMediaGovernanceResult(
  media: ProductMedia,
  result: MediaGovernanceResult,
  checkedAt: string = new Date().toISOString(),
): ProductMedia {
  return {
    ...media,
    lastCheckedAt: checkedAt,
    sourceHealth: result.sourceHealth,
    refreshFlags: result.flags,
    status: result.recommendedStatus ?? media.status,
  };
}

/** Active public product UI — excludes unavailable / rejected / source-failed. */
export function isMediaActivePublicDisplay(media: ProductMedia): boolean {
  const result = evaluateMediaGovernance({ media });
  if (result.publicVisibility === "hidden") return false;
  return isVideoPublicEligible(enrichMediaFromSourceUrl(media)).eligible;
}

/** Link-only public fallback when embed fails but source remains live. */
export function shouldShowWatchOfficialFallback(media: ProductMedia): boolean {
  const result = evaluateMediaGovernance({ media });
  return result.publicVisibility === "link-only";
}

export function structuralMediaLinkChecks(media: ProductMedia): string[] {
  const issues: string[] = [];
  const enriched = enrichMediaFromSourceUrl(media);

  if (!enriched.sourceUrl?.startsWith("https://")) {
    issues.push("source-url-not-https");
  }
  const parsed = parseVideoSourceUrl(enriched.sourceUrl);
  if (!parsed) {
    issues.push("source-url-unparseable");
  }

  const providerId = resolveMediaProviderId(enriched);
  if (
    (enriched.provider === "youtube" || enriched.provider === "vimeo") &&
    !isValidProviderId(enriched.provider, providerId)
  ) {
    issues.push("provider-id-invalid");
  }

  if (
    enriched.embeddingAllowed !== false &&
    enriched.status !== "embedding-disabled" &&
    (enriched.provider === "youtube" || enriched.provider === "vimeo") &&
    !enriched.embedUrl
  ) {
    issues.push("embed-url-missing");
  }

  if (
    (enriched.status === "published" || enriched.status === "active") &&
    !enriched.thumbnailUrl
  ) {
    issues.push("thumbnail-missing");
  }

  if (
    enriched.type !== "softwareglimpse-video" &&
    enriched.officialSource !== true
  ) {
    issues.push("official-source-not-retained");
  }

  if (enriched.sourceHealth === "unavailable") {
    issues.push("source-health-unavailable");
  }

  return issues;
}
