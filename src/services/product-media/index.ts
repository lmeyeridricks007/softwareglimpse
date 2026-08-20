import type {
  ProductMedia,
  ProductMediaPlacement,
  ProductMediaProvider,
} from "@/domain";
import {
  isOfficialVendorMedia,
  mediaLimitations,
  mediaWhatThisShows,
} from "@/domain";

export type ParsedVideoSource = {
  provider: ProductMediaProvider;
  sourceUrl: string;
  videoId?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  embeddingSupported: boolean;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

function hostnameOf(url: URL): string {
  return url.hostname.toLowerCase();
}

function youtubeVideoId(url: URL): string | null {
  const host = hostnameOf(url);
  if (host === "youtu.be" || host === "www.youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  }
  if (!YOUTUBE_HOSTS.has(host)) return null;
  const v = url.searchParams.get("v");
  if (v && /^[\w-]{11}$/.test(v)) return v;
  const parts = url.pathname.split("/").filter(Boolean);
  const embedIdx = parts.indexOf("embed");
  if (
    embedIdx >= 0 &&
    parts[embedIdx + 1] &&
    /^[\w-]{11}$/.test(parts[embedIdx + 1]!)
  ) {
    return parts[embedIdx + 1]!;
  }
  const shortsIdx = parts.indexOf("shorts");
  if (
    shortsIdx >= 0 &&
    parts[shortsIdx + 1] &&
    /^[\w-]{11}$/.test(parts[shortsIdx + 1]!)
  ) {
    return parts[shortsIdx + 1]!;
  }
  return null;
}

function vimeoVideoId(url: URL): string | null {
  if (!VIMEO_HOSTS.has(hostnameOf(url))) return null;
  const parts = url.pathname.split("/").filter(Boolean);
  const id = parts.find((p) => /^\d+$/.test(p));
  return id ?? null;
}

/** Privacy-enhanced YouTube embed URL (youtube-nocookie). */
export function youtubePrivacyEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

/**
 * Parse a vendor watch URL into provider + embed metadata.
 * Never invents ids — returns null when the URL is not a recognized video source.
 */
export function parseVideoSourceUrl(sourceUrl: string): ParsedVideoSource | null {
  let url: URL;
  try {
    url = new URL(sourceUrl.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const yt = youtubeVideoId(url);
  if (yt) {
    return {
      provider: "youtube",
      sourceUrl: `https://www.youtube.com/watch?v=${yt}`,
      videoId: yt,
      embedUrl: youtubePrivacyEmbedUrl(yt),
      thumbnailUrl: `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
      embeddingSupported: true,
    };
  }

  const vimeo = vimeoVideoId(url);
  if (vimeo) {
    return {
      provider: "vimeo",
      sourceUrl: `https://vimeo.com/${vimeo}`,
      videoId: vimeo,
      embedUrl: `https://player.vimeo.com/video/${vimeo}`,
      embeddingSupported: true,
    };
  }

  // Loom share/embed — thumbnails are hashed CDN paths; set thumbnailUrl in enrichment
  // (via Loom oEmbed) rather than inventing one here.
  const host = hostnameOf(url);
  if (host === "loom.com" || host === "www.loom.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const shareIdx = parts.findIndex((p) => p === "share" || p === "embed");
    const loomId =
      shareIdx >= 0 && parts[shareIdx + 1] ? parts[shareIdx + 1]! : null;
    if (loomId && /^[a-f0-9]{32}$/i.test(loomId)) {
      return {
        provider: "vendor-hosted",
        sourceUrl: `https://www.loom.com/share/${loomId}`,
        videoId: loomId,
        embedUrl: `https://www.loom.com/embed/${loomId}`,
        embeddingSupported: true,
      };
    }
  }

  // Vendor-hosted: keep URL; embedding only when caller supplies embedUrl.
  return {
    provider: "vendor-hosted",
    sourceUrl: url.toString(),
    embeddingSupported: false,
  };
}

export function enrichMediaFromSourceUrl(media: ProductMedia): ProductMedia {
  if (media.embedUrl && (media.videoId || media.providerId)) return media;
  const parsed = parseVideoSourceUrl(media.sourceUrl);
  if (!parsed) return media;
  return {
    ...media,
    provider: media.provider || parsed.provider,
    videoId: media.videoId ?? parsed.videoId,
    providerId: media.providerId ?? parsed.videoId,
    embedUrl: media.embedUrl ?? parsed.embedUrl,
    thumbnailUrl: media.thumbnailUrl ?? parsed.thumbnailUrl,
  };
}

export function formatDurationLabel(
  durationSeconds: number | undefined,
): string | null {
  if (durationSeconds == null || durationSeconds <= 0) return null;
  const m = Math.floor(durationSeconds / 60);
  const s = durationSeconds % 60;
  if (m <= 0) return `${s}s`;
  if (s === 0) return `${m} min`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function providerWatchLabel(provider: ProductMediaProvider): string {
  switch (provider) {
    case "youtube":
      return "Watch on YouTube";
    case "vimeo":
      return "Watch on Vimeo";
    default:
      return "Watch official video";
  }
}

export function providerConsentLabel(provider: ProductMediaProvider): string {
  switch (provider) {
    case "youtube":
      return "This video is hosted on YouTube";
    case "vimeo":
      return "This video is hosted on Vimeo";
    default:
      return "This video is hosted by the vendor";
  }
}

const PUBLIC_STATUSES = new Set([
  "active",
  "published",
  "embedding-disabled",
]);

export type VideoEligibilityResult = {
  eligible: boolean;
  reasons: string[];
  linkOnly: boolean;
};

/**
 * Public UI eligibility for official vendor media.
 * Discovered / verified / classified / needs-review are research-only.
 */
export function isVideoPublicEligible(
  media: ProductMedia,
): VideoEligibilityResult {
  const reasons: string[] = [];
  const linkOnly =
    media.status === "embedding-disabled" || media.embeddingAllowed === false;

  if (!isOfficialVendorMedia(media)) {
    reasons.push("not-official-vendor-media");
  }
  if (!PUBLIC_STATUSES.has(media.status)) {
    reasons.push(`status-${media.status}`);
  }
  if (media.status === "unavailable" || media.status === "rejected") {
    reasons.push("unavailable-or-rejected");
  }
  if (media.sourceHealth === "unavailable") {
    reasons.push("source-health-unavailable");
  }
  if (media.refreshFlags?.includes("source-unavailable")) {
    reasons.push("refresh-flag-source-unavailable");
  }
  if (!media.title?.trim()) {
    reasons.push("missing-title");
  }
  if (!media.sourceUrl?.trim()) {
    reasons.push("missing-source-url");
  }
  if (!media.verifiedAt) {
    reasons.push("missing-verified-at");
  }

  const canShowPlayer =
    !linkOnly && Boolean(media.embedUrl || media.videoId || media.providerId);
  const canShowLink = Boolean(media.sourceUrl);
  if (!canShowPlayer && !canShowLink) {
    reasons.push("no-embed-or-source-link");
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    linkOnly,
  };
}

export type SelectProductVideosOptions = {
  placement?: ProductMediaPlacement;
  featureSlug?: string;
  requirementSlug?: string;
  capabilitySlug?: string;
  useCaseSlug?: string;
  preferSpecific?: boolean;
  limit?: number;
  excludeIds?: string[];
};

function specificityScore(
  media: ProductMedia,
  opts: SelectProductVideosOptions,
): number {
  let score = 0;
  if (opts.featureSlug && media.featureIds.includes(opts.featureSlug)) score += 8;
  if (
    opts.requirementSlug &&
    media.requirementIds.includes(opts.requirementSlug)
  ) {
    score += 8;
  }
  if (opts.capabilitySlug && media.capabilityIds.includes(opts.capabilitySlug)) {
    score += 6;
  }
  if (opts.useCaseSlug && media.useCaseIds.includes(opts.useCaseSlug)) score += 6;
  if (media.type === "official-tutorial") score += 2;
  if (media.type === "official-webinar") score += 1;
  if (
    opts.preferSpecific !== false &&
    media.featureIds.length === 0 &&
    media.requirementIds.length === 0 &&
    media.capabilityIds.length === 0 &&
    media.useCaseIds.length === 0
  ) {
    score -= 3;
  }
  return score;
}

function matchesContext(
  media: ProductMedia,
  opts: SelectProductVideosOptions,
): boolean {
  if (opts.placement && media.placements.length > 0) {
    if (!media.placements.includes(opts.placement)) {
      const hasRel =
        (opts.featureSlug && media.featureIds.includes(opts.featureSlug)) ||
        (opts.requirementSlug &&
          media.requirementIds.includes(opts.requirementSlug)) ||
        (opts.capabilitySlug &&
          media.capabilityIds.includes(opts.capabilitySlug)) ||
        (opts.useCaseSlug && media.useCaseIds.includes(opts.useCaseSlug));
      if (!hasRel) return false;
    }
  }
  return true;
}

export function selectProductVideos(
  media: ProductMedia[],
  opts: SelectProductVideosOptions = {},
): ProductMedia[] {
  const limit = opts.limit ?? 6;
  const exclude = new Set(opts.excludeIds ?? []);
  const ranked = media
    .map((item) => enrichMediaFromSourceUrl(item))
    .filter((item) => !exclude.has(item.id))
    .filter((item) => isVideoPublicEligible(item).eligible)
    .filter((item) => matchesContext(item, opts))
    .map((item) => ({ item, score: specificityScore(item, opts) }))
    .sort(
      (a, b) =>
        b.score - a.score || a.item.id.localeCompare(b.item.id),
    );

  const out: ProductMedia[] = [];
  const seen = new Set<string>();
  for (const { item } of ranked) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

export const VIDEO_DISALLOWED_EVIDENCE_CLAIMS = [
  "pricing",
  "security-certification",
  "performance",
  "comparative-superiority",
] as const;

export function videoMaySupportClaim(
  media: ProductMedia,
  kind: ProductMedia["evidenceClaimKinds"][number],
): boolean {
  if (!isVideoPublicEligible(media).eligible) return false;
  if (media.evidenceClaimKinds.length === 0) {
    return (
      kind === "workflow-demo" ||
      kind === "ui-layout" ||
      kind === "feature-existence" ||
      kind === "setup-tutorial"
    );
  }
  return media.evidenceClaimKinds.includes(kind);
}

export { mediaLimitations, mediaWhatThisShows, isOfficialVendorMedia };

export {
  evaluateMediaGovernance,
  applyMediaGovernanceResult,
  isMediaActivePublicDisplay,
  shouldShowWatchOfficialFallback,
  structuralMediaLinkChecks,
  isValidProviderId,
  resolveMediaProviderId,
  type MediaGovernanceInput,
  type MediaGovernanceResult,
  type MediaLinkProbe,
  type MediaPublicVisibility,
} from "./governance";

/**
 * Client-safe barrel only.
 *
 * Do NOT re-export page selectors, media-health-report, or *-media-research
 * here — those pull Node (catalog / research stores / node:fs) and break
 * Turbopack when OfficialProductVideo and other client modules import this
 * package.
 *
 * Import page / research APIs from their modules instead, e.g.:
 *   `@/services/product-media/industry-page-media`
 *   `@/services/product-media/media-health-report`
 *   `@/services/feature-media-research`
 */
