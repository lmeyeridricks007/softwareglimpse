import type { ProductMedia } from "@/domain";
import { ProductMediaSchema } from "@/domain";
import {
  isVideoPublicEligible,
  parseVideoSourceUrl,
} from "@/services/product-media";

export type ProductMediaValidationIssue = {
  mediaId: string;
  code:
    | "SCHEMA_INVALID"
    | "SOURCE_UNPARSEABLE"
    | "PROVIDER_MISMATCH"
    | "MISSING_EMBED_WHEN_ALLOWED"
    | "NOT_OFFICIAL"
    | "NOT_PUBLIC_ELIGIBLE"
    | "AFFILIATE_URL_SUSPECT";
  message: string;
};

/**
 * Validate researcher/agent-recorded official videos before publish.
 * Does not auto-publish; does not fetch remote availability.
 */
export function validateProductMediaEntries(
  items: unknown[],
): ProductMediaValidationIssue[] {
  const issues: ProductMediaValidationIssue[] = [];

  for (const raw of items) {
    const parsed = ProductMediaSchema.safeParse(raw);
    if (!parsed.success) {
      issues.push({
        mediaId:
          typeof raw === "object" &&
          raw &&
          "id" in raw &&
          typeof (raw as { id: unknown }).id === "string"
            ? (raw as { id: string }).id
            : "unknown",
        code: "SCHEMA_INVALID",
        message: parsed.error.issues.map((i) => i.message).join("; "),
      });
      continue;
    }

    const media: ProductMedia = parsed.data;
    const fromUrl = parseVideoSourceUrl(media.sourceUrl);
    if (!fromUrl) {
      issues.push({
        mediaId: media.id,
        code: "SOURCE_UNPARSEABLE",
        message: "sourceUrl could not be parsed as a video source",
      });
    } else if (fromUrl.provider !== media.provider) {
      issues.push({
        mediaId: media.id,
        code: "PROVIDER_MISMATCH",
        message: `provider ${media.provider} does not match URL provider ${fromUrl.provider}`,
      });
    }

    if (
      media.embeddingAllowed !== false &&
      (media.provider === "youtube" || media.provider === "vimeo") &&
      !media.embedUrl &&
      !media.videoId
    ) {
      issues.push({
        mediaId: media.id,
        code: "MISSING_EMBED_WHEN_ALLOWED",
        message: "embeddingAllowed but missing embedUrl/videoId",
      });
    }

    if (!media.officialSource) {
      issues.push({
        mediaId: media.id,
        code: "NOT_OFFICIAL",
        message: "primary research UI requires officialSource=true",
      });
    }

    const eligibility = isVideoPublicEligible(media);
    if (
      (media.status === "published" ||
        media.status === "active" ||
        media.status === "embedding-disabled") &&
      !eligibility.eligible
    ) {
      issues.push({
        mediaId: media.id,
        code: "NOT_PUBLIC_ELIGIBLE",
        message: eligibility.reasons.join(", "),
      });
    }

    if (/affiliate|partner\.|ref=|utm_campaign=aff/i.test(media.sourceUrl)) {
      issues.push({
        mediaId: media.id,
        code: "AFFILIATE_URL_SUSPECT",
        message: "video sourceUrl must not be an affiliate/tracking destination",
      });
    }
  }

  return issues;
}
