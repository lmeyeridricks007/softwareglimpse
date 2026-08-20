import { getAllSoftwareUnfiltered } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { isPubliclyAvailable } from "@/domain/publishing";
import type { ProductMedia } from "@/domain";
import { isOfficialVendorMedia } from "@/domain";
import { resolveCommercialCta } from "@/services/affiliate/resolve-cta";
import { validateAffiliateUrl } from "@/services/affiliate/url-validation";
import { resolveProductOfficialLinks } from "@/services/outbound/resolve-product-links";
import {
  evaluateMediaGovernance,
  isValidProviderId,
  resolveMediaProviderId,
  structuralMediaLinkChecks,
  type MediaLinkProbe,
} from "@/services/product-media/governance";
import { enrichMediaFromSourceUrl } from "@/services/product-media";

export type LinkValidationIssue = {
  code:
    | "AFFILIATE_URL_INVALID"
    | "AFFILIATE_MISSING_MAPPING"
    | "AFFILIATE_USES_GO_PATH_IN_RESOLVER"
    | "EVIDENCE_NOT_HTTPS"
    | "EVIDENCE_UNAVAILABLE"
    | "EVIDENCE_AFFILIATE_AS_SOURCE"
    | "MISSING_PRICING_SOURCE"
    | "UNVERIFIED_SOURCE"
    | "MEDIA_SOURCE_NOT_HTTPS"
    | "MEDIA_SOURCE_UNPARSEABLE"
    | "MEDIA_SOURCE_UNAVAILABLE"
    | "MEDIA_EMBED_UNAVAILABLE"
    | "MEDIA_PROVIDER_ID_INVALID"
    | "MEDIA_THUMBNAIL_MISSING"
    | "MEDIA_OFFICIAL_SOURCE_NOT_RETAINED"
    | "MEDIA_BEYOND_REVIEW_THRESHOLD"
    | "MEDIA_NEEDS_REFRESH";
  severity: "critical" | "high" | "medium" | "low";
  productSlug: string;
  message: string;
  url?: string;
  mediaId?: string;
};

export type ValidateOutboundLinksOptions = {
  productSlug?: string;
  /** Optional remote probe results keyed by media id. */
  mediaProbes?: MediaLinkProbe[];
  now?: Date;
};

/**
 * LinkValidationAgent-style inspector for publication checks and refreshes.
 * Does not mutate data — callers flag refresh / hide broken links in UI.
 * Official media checks are structural (+ optional probes); no silent deletes.
 */
export function validateOutboundLinks(
  options?: ValidateOutboundLinksOptions,
): LinkValidationIssue[] {
  const issues: LinkValidationIssue[] = [];
  const now = options?.now ?? new Date();
  const probeById = new Map(
    (options?.mediaProbes ?? []).map((p) => [p.mediaId, p]),
  );

  const products = getAllSoftwareUnfiltered().filter((p) => {
    if (options?.productSlug && p.slug !== options.productSlug) return false;
    return isPubliclyAvailable(p.metadata) || options?.productSlug;
  });

  for (const product of products) {
    const cta = resolveCommercialCta({
      productSlug: product.slug,
      context: "software-review",
    });

    if (product.affiliate?.enabled && (!cta.available || !cta.externalUrl)) {
      issues.push({
        code: "AFFILIATE_MISSING_MAPPING",
        severity: "high",
        productSlug: product.slug,
        message: `${product.slug}: affiliate enabled but no resolvable destination`,
      });
    }

    if (cta.available && cta.externalUrl) {
      const validated = validateAffiliateUrl(cta.externalUrl);
      if (!validated.ok) {
        issues.push({
          code: "AFFILIATE_URL_INVALID",
          severity: "critical",
          productSlug: product.slug,
          message: `${product.slug}: commercial destination failed URL validation`,
          url: cta.externalUrl,
        });
      }
      if (cta.goPath && !cta.externalUrl.startsWith("http")) {
        issues.push({
          code: "AFFILIATE_USES_GO_PATH_IN_RESOLVER",
          severity: "critical",
          productSlug: product.slug,
          message: `${product.slug}: externalUrl is not an absolute http(s) URL`,
          url: cta.externalUrl,
        });
      }
    }

    const official = resolveProductOfficialLinks(product);
    if (!official.pricing && product.pricing) {
      issues.push({
        code: "MISSING_PRICING_SOURCE",
        severity: "medium",
        productSlug: product.slug,
        message: `${product.slug}: pricing present without official pricing source URL`,
      });
    }

    for (const source of product.sources ?? []) {
      if (!source.url) continue;
      if (source.sourceType === "affiliate-network") {
        issues.push({
          code: "EVIDENCE_AFFILIATE_AS_SOURCE",
          severity: "high",
          productSlug: product.slug,
          message: `${product.slug}: affiliate network URL used as research evidence (${source.id})`,
          url: source.url,
        });
      }
      if (source.sourceHealth === "unavailable") {
        issues.push({
          code: "EVIDENCE_UNAVAILABLE",
          severity: "high",
          productSlug: product.slug,
          message: `${product.slug}: evidence source unavailable (${source.id}) — refresh required`,
          url: source.url,
        });
      }
      if (!source.url.startsWith("https://")) {
        issues.push({
          code: "EVIDENCE_NOT_HTTPS",
          severity: "medium",
          productSlug: product.slug,
          message: `${product.slug}: evidence source is not HTTPS (${source.id})`,
          url: source.url,
        });
      }
      if (!source.verifiedAt && !source.retrievedAt && source.status === "active") {
        issues.push({
          code: "UNVERIFIED_SOURCE",
          severity: "low",
          productSlug: product.slug,
          message: `${product.slug}: active source missing verified/retrieved date (${source.id})`,
          url: source.url,
        });
      }
    }

    const enrichment = loadEnrichment(product.slug);
    const mediaList = (enrichment?.media ?? []) as ProductMedia[];
    const hasActiveOfficialReplacement = mediaList.some((raw) => {
      const item = enrichMediaFromSourceUrl(raw);
      if (!isOfficialVendorMedia(item)) return false;
      const vis = evaluateMediaGovernance({ media: item, now }).publicVisibility;
      return vis === "active" || vis === "link-only";
    });

    for (const raw of mediaList) {
      const media = enrichMediaFromSourceUrl(raw);
      const probe = probeById.get(media.id);
      const structural = structuralMediaLinkChecks(media);
      const governance = evaluateMediaGovernance({
        media,
        now,
        probe,
      });
      const archivedWithReplacement =
        hasActiveOfficialReplacement &&
        (media.status === "unavailable" ||
          media.status === "rejected" ||
          media.sourceHealth === "unavailable");

      // Dead official URL kept as research history — not an open health issue
      // once a live vendor replacement is active.
      if (archivedWithReplacement) continue;

      for (const code of structural) {
        if (code === "source-url-not-https") {
          issues.push({
            code: "MEDIA_SOURCE_NOT_HTTPS",
            severity: "medium",
            productSlug: product.slug,
            mediaId: media.id,
            message: `${product.slug}: media sourceUrl is not HTTPS (${media.id})`,
            url: media.sourceUrl,
          });
        }
        if (code === "source-url-unparseable") {
          issues.push({
            code: "MEDIA_SOURCE_UNPARSEABLE",
            severity: "high",
            productSlug: product.slug,
            mediaId: media.id,
            message: `${product.slug}: media sourceUrl could not be parsed (${media.id})`,
            url: media.sourceUrl,
          });
        }
        if (code === "provider-id-invalid") {
          issues.push({
            code: "MEDIA_PROVIDER_ID_INVALID",
            severity: "high",
            productSlug: product.slug,
            mediaId: media.id,
            message: `${product.slug}: media provider id invalid (${media.id}, ${resolveMediaProviderId(media) ?? "missing"})`,
            url: media.sourceUrl,
          });
        }
        if (code === "thumbnail-missing") {
          issues.push({
            code: "MEDIA_THUMBNAIL_MISSING",
            severity: "medium",
            productSlug: product.slug,
            mediaId: media.id,
            message: `${product.slug}: published media missing thumbnail (${media.id})`,
            url: media.sourceUrl,
          });
        }
        if (code === "official-source-not-retained") {
          issues.push({
            code: "MEDIA_OFFICIAL_SOURCE_NOT_RETAINED",
            severity: "high",
            productSlug: product.slug,
            mediaId: media.id,
            message: `${product.slug}: official vendor media missing officialSource=true (${media.id})`,
            url: media.sourceUrl,
          });
        }
        if (code === "source-health-unavailable") {
          issues.push({
            code: "MEDIA_SOURCE_UNAVAILABLE",
            severity: "high",
            productSlug: product.slug,
            mediaId: media.id,
            message: `${product.slug}: media source unavailable — hide public display + refresh (${media.id})`,
            url: media.sourceUrl,
          });
        }
        if (code === "embed-url-missing") {
          issues.push({
            code: "MEDIA_EMBED_UNAVAILABLE",
            severity: "medium",
            productSlug: product.slug,
            mediaId: media.id,
            message: `${product.slug}: embed not detectable for allowed embedding (${media.id})`,
            url: media.sourceUrl,
          });
        }
      }

      if (probe?.sourceLive === false) {
        issues.push({
          code: "MEDIA_SOURCE_UNAVAILABLE",
          severity: "high",
          productSlug: product.slug,
          mediaId: media.id,
          message: `${product.slug}: media source URL failed probe (${media.id})`,
          url: media.sourceUrl,
        });
      }
      if (probe?.embedAvailable === false) {
        issues.push({
          code: "MEDIA_EMBED_UNAVAILABLE",
          severity: "medium",
          productSlug: product.slug,
          mediaId: media.id,
          message: `${product.slug}: media embed unavailable — use Watch official video fallback (${media.id})`,
          url: media.embedUrl ?? media.sourceUrl,
        });
      }
      if (probe?.thumbnailLive === false) {
        issues.push({
          code: "MEDIA_THUMBNAIL_MISSING",
          severity: "low",
          productSlug: product.slug,
          mediaId: media.id,
          message: `${product.slug}: media thumbnail probe failed (${media.id})`,
          url: media.thumbnailUrl,
        });
      }
      if (probe?.stillOfficial === false) {
        issues.push({
          code: "MEDIA_OFFICIAL_SOURCE_NOT_RETAINED",
          severity: "high",
          productSlug: product.slug,
          mediaId: media.id,
          message: `${product.slug}: media no longer appears official (${media.id})`,
          url: media.sourceUrl,
        });
      }

      if (governance.beyondReviewThreshold) {
        issues.push({
          code: "MEDIA_BEYOND_REVIEW_THRESHOLD",
          severity: "medium",
          productSlug: product.slug,
          mediaId: media.id,
          message: `${product.slug}: media beyond official-media review threshold (${media.id})`,
          url: media.sourceUrl,
        });
      } else if (governance.needsResearchRefresh) {
        issues.push({
          code: "MEDIA_NEEDS_REFRESH",
          severity: "medium",
          productSlug: product.slug,
          mediaId: media.id,
          message: `${product.slug}: media flagged for research refresh (${media.id}: ${governance.flags.join(", ")})`,
          url: media.sourceUrl,
        });
      }

      // Provider id cross-check when present on record
      const providerId = resolveMediaProviderId(media);
      if (
        providerId &&
        (media.provider === "youtube" || media.provider === "vimeo") &&
        !isValidProviderId(media.provider, providerId)
      ) {
        // already covered by structural; keep single issue
      }
    }
  }

  return issues;
}
