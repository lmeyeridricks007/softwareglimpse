import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import { MoneySchema } from "./pricing-estimate";
import { SoftwareEntityTypeSchema } from "./software";

/**
 * Raw affiliate catalogue entry — commercial planning layer only.
 * Never merge commission/revenue into Software editorial scoring.
 */
export const AffiliateCatalogueStatusSchema = z.enum([
  "active",
  "pending",
  "terms-review",
  "inactive",
  "unknown",
]);

export type AffiliateCatalogueStatus = z.infer<
  typeof AffiliateCatalogueStatusSchema
>;

export const AffiliateCatalogueEntrySchema = z.object({
  sourceId: z.string().min(1),
  rawName: z.string().min(1),
  status: AffiliateCatalogueStatusSchema.default("unknown"),
  clicks: z.number().nonnegative().optional(),
  conversions: z.number().nonnegative().optional(),
  /** Planning-only fixture/commercial signal — never public / never editorial. */
  revenue: MoneySchema.optional(),
  pendingRevenue: MoneySchema.optional(),
  website: z.string().url().optional(),
  network: z
    .enum([
      "impact",
      "partnerstack",
      "shareasale",
      "cj",
      "awin",
      "direct",
      "other",
      "none",
    ])
    .default("other"),
  categoryHint: z.string().optional(),
  aliases: z.array(z.string()).default([]),
  entityTypeHint: SoftwareEntityTypeSchema.optional(),
  vendorFamily: z.string().optional(),
  /** Composite programs representing multiple products. */
  multiProductHint: z.boolean().default(false),
  splitCandidates: z.array(z.string()).default([]),
  notes: z.string().optional(),
  sourceMetadata: z.record(z.string(), z.unknown()).default({}),
  importedAt: IsoDateTimeSchema,
});

export type AffiliateCatalogueEntry = z.infer<
  typeof AffiliateCatalogueEntrySchema
>;

export const CatalogueBucketSchema = z.enum([
  "SOFTWARE",
  "SOFTWARE_LIKE_PLATFORM",
  "SERVICE",
  "MARKETPLACE",
  "LOGISTICS",
  "OTHER",
  "MULTI_PRODUCT_PROGRAM",
  "REVIEW_REQUIRED",
]);

export type CatalogueBucket = z.infer<typeof CatalogueBucketSchema>;

export const CatalogueEntryStateSchema = z.enum([
  "unprocessed",
  "normalized",
  "classified",
  "mapped",
  "onboarding-created",
  "blocked",
  "onboarded",
  "excluded",
  "review-required",
]);

export type CatalogueEntryState = z.infer<typeof CatalogueEntryStateSchema>;

export const CatalogueExclusionReasonSchema = z.enum([
  "NOT_SOFTWARE",
  "OUT_OF_SCOPE",
  "DUPLICATE_PROGRAM",
  "MULTI_PRODUCT_PROGRAM",
  "PRODUCT_DISCONTINUED",
  "MANUAL_REVIEW_REQUIRED",
]);

export type CatalogueExclusionReason = z.infer<
  typeof CatalogueExclusionReasonSchema
>;

export const CategoryReadinessStatusSchema = z.enum([
  "CATEGORY_READY",
  "CATEGORY_PARTIAL",
  "CATEGORY_NOT_READY",
  "CATEGORY_UNKNOWN",
]);

export type CategoryReadinessStatus = z.infer<
  typeof CategoryReadinessStatusSchema
>;

export const ProductMaturityTierSchema = z.enum([
  "TIER_0_CATALOGUE_ONLY",
  "TIER_1_IDENTITY_TAXONOMY",
  "TIER_2_RESEARCH",
  "TIER_3_CORE_PAGE",
  "TIER_4_DECISION_ECOSYSTEM",
  "TIER_5_FULLY_INTEGRATED",
]);

export type ProductMaturityTier = z.infer<typeof ProductMaturityTierSchema>;

export const CategoryMaturitySchema = z.enum([
  "DEFINED",
  "RESEARCH_READY",
  "CONTENT_READY",
  "DECISION_READY",
  "TOOL_READY",
  "MATURE",
]);

export type CategoryMaturity = z.infer<typeof CategoryMaturitySchema>;

export const NormalizedCatalogueCandidateSchema = z.object({
  sourceId: z.string().min(1),
  rawName: z.string().min(1),
  normalizedName: z.string().min(1),
  suggestedSlug: SlugSchema,
  website: z.string().url().optional(),
  aliases: z.array(z.string()).default([]),
  categoryHint: z.string().optional(),
  vendorFamily: z.string().optional(),
  multiProductHint: z.boolean().default(false),
  splitCandidates: z.array(z.string()).default([]),
  entityTypeHint: SoftwareEntityTypeSchema.optional(),
  network: z.string().default("other"),
  affiliateStatus: AffiliateCatalogueStatusSchema.default("unknown"),
  /** Planning signals only */
  commercial: z
    .object({
      clicks: z.number().nonnegative().default(0),
      conversions: z.number().nonnegative().default(0),
      revenueAmount: z.number().nonnegative().default(0),
      pendingRevenueAmount: z.number().nonnegative().default(0),
    })
    .default({
      clicks: 0,
      conversions: 0,
      revenueAmount: 0,
      pendingRevenueAmount: 0,
    }),
  notes: z.string().optional(),
});

export type NormalizedCatalogueCandidate = z.infer<
  typeof NormalizedCatalogueCandidateSchema
>;

export const CatalogueProcessingRecordSchema = z.object({
  sourceId: z.string().min(1),
  state: CatalogueEntryStateSchema.default("unprocessed"),
  bucket: CatalogueBucketSchema.optional(),
  identityOutcome: z.string().optional(),
  canonicalProductSlug: SlugSchema.optional(),
  mappedProductSlugs: z.array(SlugSchema).default([]),
  categorySlug: SlugSchema.optional(),
  categoryReadiness: CategoryReadinessStatusSchema.optional(),
  exclusionReason: CatalogueExclusionReasonSchema.optional(),
  commercialPriorityScore: z.number().min(0).max(100).optional(),
  commercialPriorityLabel: z
    .enum(["very-high", "high", "medium", "low", "none"])
    .optional(),
  priorityReasons: z.array(z.string()).default([]),
  maturityTier: ProductMaturityTierSchema.optional(),
  workflowRunId: z.string().optional(),
  batchId: z.string().optional(),
  blockers: z.array(z.string()).default([]),
  reviewDecision: z
    .enum([
      "approve-as-software",
      "classify-as-service",
      "split-multi-product",
      "map-to-existing",
      "exclude",
    ])
    .optional(),
  reviewNotes: z.string().optional(),
  updatedAt: IsoDateTimeSchema,
});

export type CatalogueProcessingRecord = z.infer<
  typeof CatalogueProcessingRecordSchema
>;

export const CatalogueBatchStatusSchema = z.enum([
  "planned",
  "approved",
  "running",
  "review-required",
  "completed",
  "completed-with-warnings",
  "failed",
  "cancelled",
]);

export type CatalogueBatchStatus = z.infer<typeof CatalogueBatchStatusSchema>;

export const CatalogueOnboardingBatchSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  productIds: z.array(SlugSchema).default([]),
  sourceIds: z.array(z.string()).default([]),
  categoryIds: z.array(SlugSchema).default([]),
  maxProducts: z.number().int().positive().default(5),
  status: CatalogueBatchStatusSchema.default("planned"),
  rationale: z.array(z.string()).default([]),
  workflowRunIds: z.array(z.string()).default([]),
  results: z
    .array(
      z.object({
        sourceId: z.string(),
        productSlug: z.string().optional(),
        status: z.string(),
        message: z.string().optional(),
      }),
    )
    .default([]),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  approvedAt: IsoDateTimeSchema.optional(),
  approvedBy: z.string().optional(),
});

export type CatalogueOnboardingBatch = z.infer<
  typeof CatalogueOnboardingBatchSchema
>;

export const CatalogueAliasMapEntrySchema = z.object({
  affiliateLabel: z.string().min(1),
  canonicalProductSlug: SlugSchema,
  sourceId: z.string().optional(),
  confirmedAt: IsoDateTimeSchema,
});

export type CatalogueAliasMapEntry = z.infer<
  typeof CatalogueAliasMapEntrySchema
>;

export const CatalogueScopeSchema = z.enum(["existing-only", "allow-discovery"]);

/** Safety: bulk planner never adds external discovered software by default. */
export const catalogueScopeDefault: z.infer<typeof CatalogueScopeSchema> =
  "existing-only";
