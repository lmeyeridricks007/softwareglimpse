import { z } from "zod";
import { AffiliateRelationshipSchema } from "./affiliate";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { PricingSchema } from "./pricing";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import { ResearchSourceSchema } from "./research-source";

export const EditorialScoresSchema = z.object({
  overall: z.number().min(0).max(10).optional(),
  easeOfUse: z.number().min(0).max(10).optional(),
  value: z.number().min(0).max(10).optional(),
  features: z.number().min(0).max(10).optional(),
  support: z.number().min(0).max(10).optional(),
  ai: z.number().min(0).max(10).optional(),
  automation: z.number().min(0).max(10).optional(),
  reporting: z.number().min(0).max(10).optional(),
  integrations: z.number().min(0).max(10).optional(),
});

export type EditorialScores = z.infer<typeof EditorialScoresSchema>;

export const SoftwareFeatureRatingSchema = z.object({
  featureSlug: SlugSchema,
  rating: z.number().min(0).max(10).optional(),
  available: z.boolean().optional(),
  notes: z.string().optional(),
});

/**
 * Product entity shape for catalogue vs adjacent affiliate inventory.
 * Non-software types must not auto-create `/software/.../` pages.
 */
export const SoftwareEntityTypeSchema = z.enum([
  "software",
  "service",
  "marketplace",
  "platform",
  "hybrid",
]);

export type SoftwareEntityType = z.infer<typeof SoftwareEntityTypeSchema>;

/** Product lifecycle — distinct from content publish status. */
export const ProductLifecycleSchema = z.enum([
  "candidate",
  "active",
  "discontinued",
  "merged",
  "archived",
]);

export type ProductLifecycle = z.infer<typeof ProductLifecycleSchema>;

/**
 * Canonical software product entity.
 * Typed graph edges live in SoftwareRelationship; slug arrays are denormalized hints.
 */
export const SoftwareSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  /** Alternate names / former brands — not separate products. */
  aliases: z.array(z.string().min(1)).default([]),
  formerlyKnownAs: z.array(z.string().min(1)).default([]),
  entityType: SoftwareEntityTypeSchema.default("software"),
  productLifecycle: ProductLifecycleSchema.default("active"),
  company: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  logo: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
    })
    .optional(),
  website: z.string().url().optional(),

  primaryCategorySlug: SlugSchema,
  secondaryCategorySlugs: z.array(SlugSchema).default([]),
  subcategorySlugs: z.array(SlugSchema).default([]),
  industrySlugs: z.array(SlugSchema).default([]),
  businessSizeSlugs: z.array(SlugSchema).default([]),
  businessTypeSlugs: z.array(SlugSchema).default([]),
  teamTypeSlugs: z.array(SlugSchema).default([]),
  useCaseSlugs: z.array(SlugSchema).default([]),
  userPrioritySlugs: z.array(SlugSchema).default([]),

  featureRatings: z.array(SoftwareFeatureRatingSchema).default([]),
  integrationSlugs: z.array(SlugSchema).default([]),
  platforms: z.array(z.string().min(1)).default([]),
  deploymentModels: z
    .array(z.enum(["saas", "self-hosted", "hybrid", "on-premise", "unknown"]))
    .default([]),
  aiCapabilities: z.array(z.string().min(1)).default([]),

  pricing: PricingSchema.optional(),

  scores: EditorialScoresSchema.optional(),
  pros: z.array(z.string().min(1)).default([]),
  cons: z.array(z.string().min(1)).default([]),
  bestFor: z.array(z.string().min(1)).default([]),
  notIdealFor: z.array(z.string().min(1)).default([]),
  verdict: z.string().optional(),

  /** Denormalized hints — prefer SoftwareRelationship edges for resolution. */
  competitorSlugs: z.array(SlugSchema).default([]),
  alternativeSlugs: z.array(SlugSchema).default([]),
  comparableSlugs: z.array(SlugSchema).default([]),

  affiliate: AffiliateRelationshipSchema.default({
    enabled: false,
    network: "none",
    disclosureRequired: true,
  }),

  sources: z.array(ResearchSourceSchema).default([]),
  lastResearchedAt: IsoDateTimeSchema.optional(),
  lastVerifiedAt: IsoDateTimeSchema.optional(),
  pricingVerifiedAt: IsoDateTimeSchema.optional(),
  editorialReviewedAt: IsoDateTimeSchema.optional(),

  metadata: ContentMetadataSchema.default({
    status: "draft",
    researchStatus: "none",
  }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type Software = z.infer<typeof SoftwareSchema>;
