import type { DiscoveredAsset, ResearchMedia } from "@/domain";
import { ResearchMediaSchema } from "@/domain";
import { parseVideoSourceUrl } from "@/services/product-media";

/**
 * Bridge DiscoveredAsset video recommendations → ResearchMedia candidate shape.
 * Does NOT persist enrichment. Callers must run the existing media research
 * lifecycle (discover → verify → classify → review → activate) separately.
 */

export type ResearchMediaBridgeResult =
  | {
      ok: true;
      media: ResearchMedia;
      note: string;
    }
  | {
      ok: false;
      code: "NOT_VIDEO" | "NOT_OFFICIAL" | "INVALID_URL" | "DO_NOT_USE";
      message: string;
    };

/**
 * Build a ResearchMedia draft (status=discovered, officialSource=false)
 * from a discovered video asset recommendation.
 */
export function bridgeDiscoveredAssetToResearchMedia(
  asset: DiscoveredAsset,
  opts?: { productSlug?: string },
): ResearchMediaBridgeResult {
  if (asset.recommendation === "do-not-use") {
    return {
      ok: false,
      code: "DO_NOT_USE",
      message: "Asset marked do-not-use — do not bridge into ResearchMedia",
    };
  }
  if (asset.mediaFormat !== "video" && asset.mediaFormat !== "embed") {
    return {
      ok: false,
      code: "NOT_VIDEO",
      message:
        "Only video/embed assets bridge into ResearchMedia; images/PDFs stay as link/cite recommendations",
    };
  }
  if (!asset.officialSource) {
    return {
      ok: false,
      code: "NOT_OFFICIAL",
      message:
        "Refuse bridge when officialSource is false — complete verification first",
    };
  }

  const parsed = parseVideoSourceUrl(asset.sourceUrl);
  if (!parsed) {
    return {
      ok: false,
      code: "INVALID_URL",
      message: "sourceUrl is not a supported video provider URL",
    };
  }

  const productSlug =
    opts?.productSlug ?? asset.productIds[0] ?? "unknown-product";
  const now = asset.lastVerifiedAt ?? new Date().toISOString();

  const type =
    asset.assetType === "official-tutorial"
      ? "official-tutorial"
      : asset.assetType === "official-webinar"
        ? "official-webinar"
        : asset.assetType === "official-customer-story"
          ? "official-customer-case-study"
          : "official-video";

  const media = ResearchMediaSchema.parse({
    id: `discovered-${asset.id}`.slice(0, 120),
    productSlug,
    productIds: asset.productIds.length ? asset.productIds : [productSlug],
    type,
    provider: parsed.provider,
    sourceUrl: parsed.sourceUrl,
    videoId: parsed.videoId,
    providerId: parsed.videoId,
    embedUrl: parsed.embedUrl,
    thumbnailUrl: parsed.thumbnailUrl,
    title: asset.title,
    sourceOrganization: asset.sourceOrganization,
    channelName: asset.officialVerificationNotes
      .find((n) => n.includes("channel"))
      ?.match(/“([^”]+)”/)?.[1],
    /** Must be re-verified in ResearchMedia lifecycle. */
    officialSource: false,
    verifiedAt: now,
    lastCheckedAt: now,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: parsed.embeddingSupported,
    featureIds: asset.featureIds,
    capabilityIds: asset.capabilityIds,
    requirementIds: asset.requirementIds,
    useCaseIds: asset.useCaseIds,
    industryIds: asset.industryIds,
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    placements: [],
    purpose: asset.potentialUses[0] ?? asset.reason,
    whatThisShows: asset.whatItShows,
    limitations: [],
    whatToNotice: [],
    status: "discovered",
  });

  return {
    ok: true,
    media,
    note:
      "Draft only (status=discovered, officialSource=false). Run feature/capability/use-case/requirement/industry media research lifecycle before any public activation. Never auto-publish.",
  };
}
