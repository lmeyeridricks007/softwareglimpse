import type {
  AssetType,
  MediaFormat,
  UsageRightsStatus,
  AssetRecommendationAction,
  AssetSourceType,
} from "@/domain/schemas/asset-discovery";

/**
 * Copyright / usage classification for discovered assets.
 * Does not make definitive legal claims when terms are unclear.
 */

export type UsageClassification = {
  usageRightsStatus: UsageRightsStatus;
  recommendation: AssetRecommendationAction;
  reason: string;
  embedAvailable?: boolean;
  directLinkAvailable: boolean;
};

function isVideoEmbedType(assetType: AssetType, format: MediaFormat): boolean {
  return (
    format === "video" ||
    format === "embed" ||
    assetType === "official-product-video" ||
    assetType === "official-feature-demo" ||
    assetType === "official-workflow-demo" ||
    assetType === "official-tutorial" ||
    assetType === "official-webinar" ||
    assetType === "official-customer-story"
  );
}

function isImageLike(assetType: AssetType, format: MediaFormat): boolean {
  if (format === "page" || format === "pdf" || format === "video" || format === "embed") {
    return false;
  }
  return (
    format === "image" ||
    format === "diagram" ||
    assetType === "official-screenshot" ||
    assetType === "official-ui-image" ||
    assetType === "official-diagram" ||
    assetType === "official-architecture-diagram" ||
    assetType === "official-workflow-diagram" ||
    assetType === "official-integration-diagram" ||
    assetType === "official-logo" ||
    assetType === "official-brand-asset"
  );
}

export type ClassifyUsageInput = {
  assetType: AssetType;
  mediaFormat: MediaFormat;
  sourceType: AssetSourceType;
  officialSource: boolean;
  sourceUrl: string;
  /** Researcher observed that YouTube/Vimeo embedding is enabled. */
  embedEnabled?: boolean;
};

/**
 * Classify safe usage posture for a candidate asset.
 * Prefer embed for official video embeds; link for docs; original redraw for images.
 */
export function classifyUsageRights(
  input: ClassifyUsageInput,
): UsageClassification {
  const { assetType, mediaFormat, sourceType, officialSource, sourceUrl } =
    input;

  if (sourceType === "secondary" && !officialSource) {
    return {
      usageRightsStatus: "do-not-use",
      recommendation: "do-not-use",
      reason:
        "Non-official / secondary source with unclear rights — do not embed or rehost",
      directLinkAvailable: false,
    };
  }

  if (assetType === "softwareglimpse-original-visual-opportunity") {
    return {
      usageRightsStatus: "better-create-original-visual",
      recommendation: "create-original-visual-based-on-source",
      reason:
        "Prefer an original SoftwareGlimpse teaching visual grounded in verified facts rather than copying vendor imagery",
      directLinkAvailable: true,
    };
  }

  if (
    isVideoEmbedType(assetType, mediaFormat) &&
    (sourceType === "vendor-youtube" || sourceType === "vendor-vimeo") &&
    officialSource
  ) {
    const embedOk = input.embedEnabled !== false;
    if (embedOk) {
      return {
        usageRightsStatus: "safe-to-embed",
        recommendation: "embed",
        reason:
          "Official vendor video channel with embedding typically allowed — prefer canonical embed/link; do not rehost the file",
        embedAvailable: true,
        directLinkAvailable: true,
      };
    }
    return {
      usageRightsStatus: "safe-to-link",
      recommendation: "link",
      reason:
        "Official vendor video but embedding disabled/unavailable — link to canonical watch URL only",
      embedAvailable: false,
      directLinkAvailable: true,
    };
  }

  if (
    officialSource &&
    (sourceType === "vendor-documentation" ||
      sourceType === "vendor-help-center" ||
      sourceType === "vendor-official-site" ||
      sourceType === "vendor-pricing" ||
      sourceType === "vendor-academy" ||
      sourceType === "vendor-trust-center" ||
      sourceType === "government" ||
      sourceType === "regulator" ||
      sourceType === "standards-body" ||
      sourceType === "authoritative-primary")
  ) {
    if (mediaFormat === "page" || mediaFormat === "pdf") {
      return {
        usageRightsStatus: "safe-to-link",
        recommendation:
          mediaFormat === "pdf" || sourceType.includes("pricing")
            ? "use-as-evidence"
            : "link",
        reason:
          "Official / authoritative page or PDF — safe to link and cite; do not scrape/rehost",
        directLinkAvailable: true,
      };
    }
  }

  if (isImageLike(assetType, mediaFormat) && officialSource) {
    if (
      assetType === "official-logo" ||
      assetType === "official-brand-asset"
    ) {
      return {
        usageRightsStatus: "potentially-reusable-with-permission",
        recommendation: "link",
        reason:
          "Vendor brand assets may allow limited use under brand guidelines — verify terms; prefer linking to brand center when unclear",
        directLinkAvailable: true,
      };
    }
    return {
      usageRightsStatus: "better-create-original-visual",
      recommendation: "create-original-visual-based-on-source",
      reason:
        "Vendor-hosted screenshots/diagrams: usage rights unclear for rehosting — link/reference the source or create an original SoftwareGlimpse visual based on underlying facts",
      directLinkAvailable: true,
    };
  }

  if (officialSource && mediaFormat === "interactive") {
    return {
      usageRightsStatus: "safe-to-link",
      recommendation: "link",
      reason: "Official interactive tour / demo page — link, do not iframe unless terms allow",
      directLinkAvailable: true,
    };
  }

  // Default conservative posture
  void sourceUrl;
  return {
    usageRightsStatus: "usage-rights-unclear-link-only",
    recommendation: "cite",
    reason:
      "usage rights unclear — link/reference only; do not download, rehost, or embed without clearer terms",
    directLinkAvailable: true,
  };
}
