import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Software Price Change Monitor — verdicts are separate from
 * PriceObservation.confidence. Unverified scrapes must not become
 * CONFIRMED public claims.
 */
export const PriceMonitorFrequencySchema = z.enum(["HIGH", "MEDIUM", "LOW"]);
export type PriceMonitorFrequency = z.infer<typeof PriceMonitorFrequencySchema>;

export const PriceChangeConfidenceSchema = z.enum([
  "CONFIRMED",
  "LIKELY",
  "REQUIRES_REVIEW",
  "NO_CHANGE",
]);
export type PriceChangeConfidence = z.infer<typeof PriceChangeConfidenceSchema>;

export const PriceChangeKindSchema = z.enum([
  "plan_price_increase",
  "plan_price_decrease",
  "new_plan",
  "removed_plan",
  "free_plan_added",
  "free_plan_removed",
  "billing_model_changed",
  "annual_discount_changed",
  "ai_addon_introduced",
  "ai_pricing_changed",
  "contact_sales_conversion",
  "starting_price_changed",
  "other",
]);
export type PriceChangeKind = z.infer<typeof PriceChangeKindSchema>;

export const PriceMonitorQueueItemSchema = z.object({
  rank: z.number().int().positive(),
  productId: SlugSchema,
  productName: z.string().min(1),
  categorySlug: SlugSchema.nullable(),
  frequency: PriceMonitorFrequencySchema,
  priorityScore: z.number(),
  opportunityScore: z.number(),
  impressions: z.number().nonnegative(),
  comparisonCount: z.number().int().nonnegative(),
  affectedPageCount: z.number().int().nonnegative(),
  volatilityScore: z.number().nonnegative(),
  commercialScore: z.number().nonnegative(),
  reasons: z.array(z.string()),
  lastObservedAt: z.string().nullable(),
});

export type PriceMonitorQueueItem = z.infer<typeof PriceMonitorQueueItemSchema>;

export const DetectedPriceChangeSchema = z.object({
  productId: SlugSchema,
  productName: z.string().min(1),
  kind: PriceChangeKindSchema,
  confidence: PriceChangeConfidenceSchema,
  summary: z.string().min(1),
  previousPrice: z.number().nullable().optional(),
  newPrice: z.number().nullable().optional(),
  absoluteChange: z.number().nullable().optional(),
  percentageChange: z.number().nullable().optional(),
  planId: z.string().nullable().optional(),
  planName: z.string().nullable().optional(),
  seriesKey: z.string().optional(),
  requiresHumanVerification: z.boolean(),
  validationNotes: z.array(z.string()).default([]),
  noteworthy: z.boolean().default(false),
});

export type DetectedPriceChange = z.infer<typeof DetectedPriceChangeSchema>;

export const PriceChangeEditorialCandidateSchema = z.object({
  productId: SlugSchema,
  productName: z.string().min(1),
  title: z.string().min(1),
  rationale: z.string().min(1),
  changeKinds: z.array(PriceChangeKindSchema),
  confidence: PriceChangeConfidenceSchema,
  /** Never auto-publish — editorial queue only. */
  publishStatus: z.literal("candidate"),
});

export type PriceChangeEditorialCandidate = z.infer<
  typeof PriceChangeEditorialCandidateSchema
>;

export const PriceMonitorGrowthSignalSchema = z.object({
  path: z.string().min(1),
  productId: SlugSchema,
  refreshPriorityBoost: z.enum(["critical", "high", "normal"]),
  reason: z.string().min(1),
  confidence: PriceChangeConfidenceSchema,
  outdatedPricing: z.literal(true),
  /** Machine-readable stale code for dependent pages. */
  staleCode: z.literal("OUTDATED_PRICING").default("OUTDATED_PRICING"),
});

export type PriceMonitorGrowthSignal = z.infer<
  typeof PriceMonitorGrowthSignalSchema
>;

/** Plan snapshot row for human verification diffs. */
export const PricingVerificationPlanRowSchema = z.object({
  planId: z.string(),
  planName: z.string(),
  price: z.number().nullable(),
  currency: z.string().nullable(),
  billingPeriod: z.string().nullable(),
  contactSales: z.boolean().optional(),
  isFree: z.boolean().optional(),
});

export type PricingVerificationPlanRow = z.infer<
  typeof PricingVerificationPlanRowSchema
>;

/**
 * Human verification task — REQUIRES_REVIEW / LIKELY stay unpublished
 * until confirmed.
 */
export const PricingVerificationTaskSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "rejected"]),
  productId: SlugSchema,
  productName: z.string().min(1),
  confidence: z.enum(["REQUIRES_REVIEW", "LIKELY"]),
  kind: PriceChangeKindSchema,
  /** Where the detected pricing came from. */
  source: z.object({
    label: z.string(),
    enrichmentPath: z.string().nullable(),
    sourceIds: z.array(z.string()),
    verifiedAt: z.string().nullable(),
  }),
  currentStoredPricing: z.object({
    startingPriceMonthly: z.number().nullable(),
    plans: z.array(PricingVerificationPlanRowSchema),
    observationCount: z.number().int().nonnegative(),
  }),
  detectedPricing: z.object({
    startingPriceMonthly: z.number().nullable(),
    plans: z.array(PricingVerificationPlanRowSchema),
  }),
  difference: z.object({
    summary: z.string(),
    previousPrice: z.number().nullable(),
    newPrice: z.number().nullable(),
    absoluteChange: z.number().nullable(),
    percentageChange: z.number().nullable(),
    notes: z.array(z.string()),
  }),
  affectedPlans: z.array(
    z.object({
      planId: z.string().nullable(),
      planName: z.string().nullable(),
      changeKind: PriceChangeKindSchema,
    }),
  ),
  affectedPages: z.array(
    z.object({
      path: z.string(),
      pageType: z.string(),
      slug: z.string(),
      productId: SlugSchema,
      refreshTier: z.number().int().positive(),
    }),
  ),
  /** True while pending — do not publish as facts. Confirmed may still await page refresh. */
  publishBlocked: z.boolean(),
  createdAt: z.string(),
  confirmedAt: z.string().nullable().optional(),
  rejectedAt: z.string().nullable().optional(),
});
export type PricingVerificationTask = z.infer<
  typeof PricingVerificationTaskSchema
>;

export const OutdatedPricingMarkSchema = z.object({
  code: z.literal("OUTDATED_PRICING"),
  path: z.string().min(1),
  productId: SlugSchema,
  reason: z.string().min(1),
  confidence: PriceChangeConfidenceSchema,
  markedAt: z.string(),
  clearedAt: z.string().nullable(),
  /** UI must show a freshness/stale state while active. */
  visibleFreshnessRequired: z.literal(true),
});

export type OutdatedPricingMark = z.infer<typeof OutdatedPricingMarkSchema>;
