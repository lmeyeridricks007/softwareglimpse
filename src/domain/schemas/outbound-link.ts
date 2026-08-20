import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Semantic type for every outbound destination.
 * Renderers derive rel/target/analytics from type — never from URL string inspection.
 */
export const OutboundLinkTypeSchema = z.enum([
  "affiliate",
  "vendor-official",
  "evidence-source",
  "documentation",
  "pricing-source",
  "security-source",
  "regulatory-source",
  "editorial-reference",
]);

export type OutboundLinkType = z.infer<typeof OutboundLinkTypeSchema>;

/**
 * Internal research authority — not shown as an SEO score to users.
 */
export const SourceAuthorityTierSchema = z.enum([
  "primary",
  "authoritative-secondary",
  "secondary",
]);

export type SourceAuthorityTier = z.infer<typeof SourceAuthorityTierSchema>;

export const OutboundLinkSchema = z.object({
  url: z.string().url(),
  type: OutboundLinkTypeSchema,
  domain: z.string().optional(),
  title: z.string().optional(),
  softwareId: SlugSchema.optional(),
  affiliateProgramId: z.string().min(1).optional(),
  promotionId: z.string().min(1).optional(),
  sourceId: z.string().min(1).optional(),
  verifiedAt: IsoDateTimeSchema.optional(),
  /** Internal only — do not surface as a public "SEO score". */
  authorityTier: SourceAuthorityTierSchema.optional(),
});

export type OutboundLink = z.infer<typeof OutboundLinkSchema>;

/** Official / research destinations for a product (never affiliate tracking URLs). */
export const ProductOfficialLinksSchema = z.object({
  officialWebsite: z.string().url().optional(),
  pricing: z.string().url().optional(),
  documentation: z.string().url().optional(),
  helpCenter: z.string().url().optional(),
  security: z.string().url().optional(),
  support: z.string().url().optional(),
  developer: z.string().url().optional(),
});

export type ProductOfficialLinks = z.infer<typeof ProductOfficialLinksSchema>;

/**
 * Rel tokens derived from outbound type.
 * Affiliate / paid → sponsored. Untrusted → nofollow. Editorial → none required.
 */
export function relForOutboundType(
  type: OutboundLinkType,
  options: { openInNewTab?: boolean; untrusted?: boolean } = {},
): string[] {
  const rel: string[] = [];
  if (type === "affiliate") {
    rel.push("sponsored");
  } else if (options.untrusted) {
    rel.push("nofollow");
  }
  if (options.openInNewTab !== false) {
    rel.push("noopener", "noreferrer");
  }
  return rel;
}

export function outboundTypeFromResearchSourceType(
  sourceType: string,
): OutboundLinkType {
  switch (sourceType) {
    case "official-pricing-page":
    case "pricing-page":
      return "pricing-source";
    case "official-documentation":
    case "docs":
      return "documentation";
    case "official-security-page":
      return "security-source";
    case "official-product-page":
    case "vendor":
    case "official-help-center":
    case "official-blog":
    case "official-integration-directory":
    case "official-video":
    case "official-webinar":
    case "official-tutorial":
    case "first-party":
      return "vendor-official";
    case "affiliate-network":
      return "affiliate";
    default:
      return "evidence-source";
  }
}
