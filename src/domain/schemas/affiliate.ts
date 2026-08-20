import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

export const AffiliateNetworkSchema = z.enum([
  "impact",
  "partnerstack",
  "shareasale",
  "cj",
  "awin",
  "direct",
  "other",
  "none",
]);

export type AffiliateNetwork = z.infer<typeof AffiliateNetworkSchema>;

/**
 * Legacy / denormalized affiliate fields on Software.
 * Prefer centralized programmes + destinations; keep for disclosure/completeness sync.
 * Never embed tracking URLs in prose — resolve via commercial CTA resolver.
 */
export const AffiliateRelationshipSchema = z.object({
  enabled: z.boolean().default(false),
  network: AffiliateNetworkSchema.default("none"),
  program: z.string().optional(),
  /** @deprecated Prefer AffiliateDestination.url — kept for migration/compat */
  trackingUrl: z.string().url().optional(),
  /** Vendor destination when affiliate is disabled or unavailable. */
  destinationUrl: z.string().url().optional(),
  campaignParam: z.string().optional(),
  subIdParam: z.string().optional(),
  /** Internal ops only — never feed ranking or public client bundles. */
  commissionNotes: z.string().optional(),
  disclosureRequired: z.boolean().default(true),
  lastVerifiedAt: IsoDateTimeSchema.optional(),
  /** Link to centralized programme id when mapped. */
  programmeId: z.string().min(1).optional(),
});

export type AffiliateRelationship = z.infer<typeof AffiliateRelationshipSchema>;

export const AffiliateProgrammeStatusSchema = z.enum([
  "active",
  "pending",
  "inactive",
  "suspended",
  "expired",
]);

export type AffiliateProgrammeStatus = z.infer<
  typeof AffiliateProgrammeStatusSchema
>;

export const AffiliateProgrammeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  network: AffiliateNetworkSchema.default("other"),
  status: AffiliateProgrammeStatusSchema.default("pending"),
  productSlugs: z.array(SlugSchema).default([]),
  notes: z.string().optional(),
  /** Catalogue source id when linked from Prompt 13 inventory. */
  catalogueSourceId: z.string().optional(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export type AffiliateProgramme = z.infer<typeof AffiliateProgrammeSchema>;

export const AffiliateDestinationTypeSchema = z.enum([
  "homepage",
  "pricing",
  "signup",
  "trial",
  "demo",
  "contact-sales",
  "offer",
  "other",
]);

export type AffiliateDestinationType = z.infer<
  typeof AffiliateDestinationTypeSchema
>;

export const AffiliateDestinationStatusSchema = z.enum(["active", "inactive"]);

export const AffiliateDestinationSchema = z.object({
  id: z.string().min(1),
  programmeId: z.string().min(1),
  productSlug: SlugSchema,
  destinationType: AffiliateDestinationTypeSchema,
  url: z.string().url(),
  status: AffiliateDestinationStatusSchema.default("active"),
  isDefault: z.boolean().default(false),
  notes: z.string().optional(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export type AffiliateDestination = z.infer<typeof AffiliateDestinationSchema>;

export const PromotionTypeSchema = z.enum([
  "percentage-discount",
  "fixed-discount",
  "extended-trial",
  "free-months",
  "free-plan",
  "credit",
  "bundle",
  "other",
]);

export type PromotionType = z.infer<typeof PromotionTypeSchema>;

export const PromotionScopeSchema = z.enum([
  "public",
  "affiliate",
  "exclusive",
]);

export type PromotionScope = z.infer<typeof PromotionScopeSchema>;

export const PromotionManualStatusSchema = z.enum([
  "draft",
  "scheduled",
  "active",
  "expired",
  "disabled",
]);

export type PromotionManualStatus = z.infer<typeof PromotionManualStatusSchema>;

/**
 * Effective status derived from dates + manual override.
 * `disabled` always wins.
 */
export const PromotionEffectiveStatusSchema = z.enum([
  "draft",
  "scheduled",
  "active",
  "expired",
  "disabled",
]);

export type PromotionEffectiveStatus = z.infer<
  typeof PromotionEffectiveStatusSchema
>;

export const PromotionSchema = z
  .object({
    id: z.string().min(1),
    productSlug: SlugSchema,
    programmeId: z.string().min(1).optional(),
    name: z.string().min(1),
    headline: z.string().min(1),
    description: z.string().optional(),
    promoCode: z.string().optional(),
    codeRequired: z.boolean().default(false),
    promotionType: PromotionTypeSchema.default("other"),
    scope: PromotionScopeSchema.default("affiliate"),
    value: z.number().optional(),
    currency: z
      .string()
      .length(3)
      .regex(/^[A-Z]{3}$/)
      .optional(),
    startsAt: IsoDateTimeSchema.optional(),
    endsAt: IsoDateTimeSchema.optional(),
    /** When true, no endsAt is expected. */
    noExpiry: z.boolean().default(false),
    status: PromotionManualStatusSchema.default("draft"),
    isPrimary: z.boolean().default(false),
    priority: z.number().int().default(100),
    destinationId: z.string().min(1).optional(),
    terms: z.array(z.string().min(1)).default([]),
    termsUrl: z.string().url().optional(),
    source: z.string().min(1).optional(),
    verifiedAt: IsoDateTimeSchema.optional(),
    createdAt: IsoDateTimeSchema,
    updatedAt: IsoDateTimeSchema,
  })
  .superRefine((value, ctx) => {
    if (value.startsAt && value.endsAt && value.startsAt > value.endsAt) {
      ctx.addIssue({
        code: "custom",
        message: "Promotion endsAt must be >= startsAt",
        path: ["endsAt"],
      });
    }
    if (value.scope === "exclusive" && !value.verifiedAt && !value.source) {
      ctx.addIssue({
        code: "custom",
        message: "Exclusive promotions require source or verifiedAt",
        path: ["scope"],
      });
    }
  });

export type Promotion = z.infer<typeof PromotionSchema>;

/** Page / tool context for CTA resolution strategy. */
export const CommercialCtaContextSchema = z.enum([
  "software-review",
  "pricing-page",
  "comparison",
  "alternatives",
  "best-page",
  "finder",
  "calculator",
  "category-page",
  "other",
]);

export type CommercialCtaContext = z.infer<typeof CommercialCtaContextSchema>;

/** Semantic CTA intents — agents emit these; resolver picks the URL. */
export const CommercialCtaIntentSchema = z.enum([
  "VISIT",
  "START_TRIAL",
  "VIEW_PRICING",
  "GET_DEAL",
  "REQUEST_DEMO",
  "SIGN_UP",
  "LEARN_MORE",
]);

export type CommercialCtaIntent = z.infer<typeof CommercialCtaIntentSchema>;

export const AffiliateCtaLocationSchema = z.enum([
  "hero",
  "inline",
  "sidebar",
  "comparison",
  "pricing",
  "recommendation",
  "footer",
  "tool-result",
  "promotion-banner",
  "other",
]);

export const AffiliateResolveInputSchema = z.object({
  softwareSlug: SlugSchema,
  location: AffiliateCtaLocationSchema.default("other"),
  campaign: z.string().optional(),
  subId: z.string().optional(),
});

export type AffiliateResolveInput = z.infer<typeof AffiliateResolveInputSchema>;

export const CommercialCtaResolveInputSchema = z.object({
  productSlug: SlugSchema,
  context: CommercialCtaContextSchema.default("other"),
  intent: CommercialCtaIntentSchema.optional(),
  preferredDestinationType: AffiliateDestinationTypeSchema.optional(),
  promotionId: z.string().min(1).optional(),
  location: AffiliateCtaLocationSchema.default("other"),
  campaign: z.string().optional(),
  subId: z.string().optional(),
  /** Injected clock for tests. */
  now: IsoDateTimeSchema.optional(),
});

export type CommercialCtaResolveInput = z.input<
  typeof CommercialCtaResolveInputSchema
>;
