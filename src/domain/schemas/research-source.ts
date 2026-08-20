import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import { SourceAuthorityTierSchema } from "./outbound-link";

/**
 * Research domains for objective product facts.
 * Editorial judgments are separate (see vendorPositioning vs editorialFit).
 */
export const ResearchDomainSchema = z.enum([
  "identity",
  "pricing",
  "plans",
  "features",
  "integrations",
  "ai-capabilities",
  "business-size-fit",
  "use-cases",
  "platforms",
  "deployment",
  "free-plan",
  "free-trial",
  "limits",
  "support",
  "security-compliance",
  "company-information",
  "product-positioning",
  /** Official vendor video / webinar / tutorial research media. */
  "official-media",
]);

export type ResearchDomain = z.infer<typeof ResearchDomainSchema>;

export const ResearchSourceTypeSchema = z.enum([
  "official-product-page",
  "official-pricing-page",
  "official-documentation",
  "official-help-center",
  "official-security-page",
  "official-blog",
  "official-integration-directory",
  "official-video",
  "official-webinar",
  "official-tutorial",
  "trusted-third-party",
  "review-platform",
  "fixture",
  "other",
  // Legacy Prompt 1 values kept for embedded software.sources compatibility
  "vendor",
  "docs",
  "pricing-page",
  "press",
  "review",
  "affiliate-network",
  "first-party",
]);

export type ResearchSourceType = z.infer<typeof ResearchSourceTypeSchema>;

/**
 * Lower number = higher priority.
 * Fixtures are for pipeline demos only and never outrank first-party sources.
 */
export const SOURCE_TYPE_PRIORITY: Record<ResearchSourceType, number> = {
  "official-pricing-page": 1,
  "official-product-page": 2,
  "official-documentation": 3,
  "official-help-center": 3,
  "official-integration-directory": 4,
  "official-security-page": 5,
  "official-blog": 6,
  "official-video": 6,
  "official-webinar": 6,
  "official-tutorial": 6,
  "trusted-third-party": 7,
  "review-platform": 8,
  "first-party": 2,
  vendor: 2,
  docs: 3,
  "pricing-page": 1,
  press: 7,
  review: 8,
  "affiliate-network": 9,
  other: 9,
  fixture: 100,
};

export function getSourcePriority(type: ResearchSourceType): number {
  return SOURCE_TYPE_PRIORITY[type] ?? 99;
}

export const ResearchSourceAuthoritySchema = z.enum([
  "first-party",
  "trusted-third-party",
  "review-platform",
  "fixture",
  "unknown",
]);

export const ResearchSourceStatusSchema = z.enum([
  "candidate",
  "active",
  "stale",
  "rejected",
  "archived",
]);

export const ResearchSourceSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema.optional(),
  url: z.string().url().optional(),
  domain: z.string().optional(),
  title: z.string().min(1).optional(),
  publisher: z.string().min(1).optional(),
  sourceType: ResearchSourceTypeSchema,
  authority: ResearchSourceAuthoritySchema.default("unknown"),
  retrievedAt: IsoDateTimeSchema.optional(),
  verifiedAt: IsoDateTimeSchema.optional(),
  lastCheckedAt: IsoDateTimeSchema.optional(),
  language: z.string().default("en"),
  domains: z.array(ResearchDomainSchema).default([]),
  /** @deprecated Prefer `domains`. Kept for Prompt 1 software.sources embeds. */
  fieldsSupported: z.array(z.string().min(1)).default([]),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  status: ResearchSourceStatusSchema.default("candidate"),
  notes: z.string().optional(),
  /**
   * Internal research preference metadata — not rendered as a public SEO score.
   * Prefer primary (official vendor) over secondary aggregators.
   */
  authorityTier: SourceAuthorityTierSchema.optional(),
  /** Set when a previously verified URL no longer resolves. */
  sourceHealth: z
    .enum(["ok", "unavailable", "redirecting", "unchecked"])
    .optional(),
});

export type ResearchSource = z.infer<typeof ResearchSourceSchema>;

export const ResearchSourceCandidateSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  sourceType: ResearchSourceTypeSchema.default("other"),
  domains: z.array(ResearchDomainSchema).default([]),
  discoveryMethod: z
    .enum(["manual", "search", "crawl", "fixture", "api"])
    .default("manual"),
  priority: z.number().int().positive().optional(),
});

export type ResearchSourceCandidate = z.infer<
  typeof ResearchSourceCandidateSchema
>;
