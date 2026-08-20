import { z } from "zod";
import { CurrencyCodeSchema, SlugSchema } from "./primitives";

export const FitLevelSchema = z.enum([
  "strong",
  "good",
  "moderate",
  "weak",
  "not-suitable",
  "unknown",
]);

export type FitLevel = z.infer<typeof FitLevelSchema>;

export const BudgetBandSchema = z.enum([
  "under-15",
  "15-30",
  "30-60",
  "60-100",
  "100-plus",
  "no-limit",
]);

export type BudgetBand = z.infer<typeof BudgetBandSchema>;

export const EasePreferenceSchema = z.enum([
  "easy-setup",
  "balanced",
  "advanced-customization",
]);

export type EasePreference = z.infer<typeof EasePreferenceSchema>;

export const FinderPrioritySlugSchema = z.enum([
  "ease-of-use",
  "fast-setup",
  "customization",
  "minimal-admin",
]);

export type FinderPrioritySlug = z.infer<typeof FinderPrioritySlugSchema>;

/** UI-facing CRM finder answers (wizard state). */
export const CrmFinderAnswersSchema = z.object({
  companySizeSlug: SlugSchema,
  crmUsers: z.number().int().min(1).max(10_000),
  primaryUseCaseSlug: SlugSchema,
  secondaryUseCaseSlugs: z.array(SlugSchema).optional(),
  requiredFeatureSlugs: z.array(SlugSchema).optional(),
  preferredFeatureSlugs: z.array(SlugSchema).optional(),
  preferredIntegrationSlugs: z.array(SlugSchema).optional(),
  budgetBand: BudgetBandSchema.optional(),
  budgetMode: z.literal("per-user-month").default("per-user-month"),
  easePreference: EasePreferenceSchema.optional(),
  businessTypeSlug: SlugSchema.optional(),
});

export type CrmFinderAnswers = z.infer<typeof CrmFinderAnswersSchema>;

export const CrmFinderPrioritiesSchema = z.object({
  "ease-of-use": z.number().min(0).max(1),
  "fast-setup": z.number().min(0).max(1),
  customization: z.number().min(0).max(1),
  "minimal-admin": z.number().min(0).max(1),
});

export type CrmFinderPriorities = z.infer<typeof CrmFinderPrioritiesSchema>;

/**
 * Categories that share the CRM-shaped finder / decision-tool pipeline.
 * CRM and Sales Intelligence keep dedicated storage keys; others use
 * `sg-{slug}-…` keys.
 */
export const TOOL_CATEGORY_SLUGS = [
  "crm",
  "sales-intelligence",
  "marketing",
  "email-marketing",
  "business-communications",
  "customer-service",
  "project-management",
  "hr",
  "ecommerce",
  "ai",
  "it-development",
] as const;

export const FinderCategorySlugSchema = z.enum(TOOL_CATEGORY_SLUGS);

export type FinderCategorySlug = z.infer<typeof FinderCategorySlugSchema>;

/**
 * Normalized scoring input for category finders (CRM, Sales Intelligence).
 * Seat count is `crmUsers` for scoring reuse across finders.
 */
export const CrmFinderCriteriaSchema = z.object({
  categorySlug: FinderCategorySlugSchema,
  companySizeSlug: SlugSchema,
  crmUsers: z.number().int().min(1).max(10_000),
  primaryUseCaseSlug: SlugSchema,
  secondaryUseCaseSlugs: z.array(SlugSchema).default([]),
  requiredFeatureSlugs: z.array(SlugSchema).default([]),
  preferredFeatureSlugs: z.array(SlugSchema).default([]),
  preferredIntegrationSlugs: z.array(SlugSchema).default([]),
  /** Max EUR per user / month. null = no limit. */
  budgetPerUserMax: z.number().nonnegative().nullable().optional(),
  budgetMode: z.literal("per-user-month").default("per-user-month"),
  priorities: CrmFinderPrioritiesSchema,
  businessTypeSlug: SlugSchema.optional(),
  methodologyVersion: z.string().min(1),
});

export type CrmFinderCriteria = z.infer<typeof CrmFinderCriteriaSchema>;

/** SI Finder answers — same shape as CRM; seats map to `crmUsers` for scoring. */
export const SiFinderAnswersSchema = CrmFinderAnswersSchema;
export type SiFinderAnswers = CrmFinderAnswers;

/** SI Finder criteria — categorySlug must be sales-intelligence. */
export const SiFinderCriteriaSchema = CrmFinderCriteriaSchema;
export type SiFinderCriteria = CrmFinderCriteria;

export const RecommendationConfidenceSchema = z.enum([
  "high",
  "medium",
  "low",
]);

export type RecommendationConfidence = z.infer<
  typeof RecommendationConfidenceSchema
>;

export const ScoreBreakdownSchema = z.object({
  useCaseFit: z.number().min(0).max(1).nullable(),
  requiredFeatures: z.number().min(0).max(1).nullable(),
  preferredFeatures: z.number().min(0).max(1).nullable(),
  businessSizeFit: z.number().min(0).max(1).nullable(),
  integrations: z.number().min(0).max(1).nullable(),
  priorities: z.number().min(0).max(1).nullable(),
  budgetFit: z.number().min(0).max(1).nullable(),
  businessTypeFit: z.number().min(0).max(1).nullable(),
  unknownDimensions: z.array(z.string()).default([]),
  knownWeight: z.number().min(0).max(1).optional(),
  totalApplicableWeight: z.number().min(0).max(1).optional(),
});

export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

export const ReasonCodeSchema = z.enum([
  "strong-primary-use-case",
  "good-primary-use-case",
  "moderate-primary-use-case",
  "weak-primary-use-case",
  "secondary-use-case-fit",
  "required-feature-supported",
  "required-feature-limited",
  "required-feature-add-on",
  "required-feature-higher-plan",
  "required-feature-unknown",
  "preferred-feature-supported",
  "preferred-feature-partial",
  "business-size-strong",
  "business-size-good",
  "business-size-moderate",
  "business-size-unknown",
  "integration-strong",
  "integration-partial",
  "integration-unknown",
  "priority-ease-fit",
  "priority-setup-fit",
  "priority-customization-fit",
  "priority-admin-fit",
  "budget-good",
  "budget-tight",
  "budget-unknown",
  "business-type-fit",
  "business-type-unknown",
  "research-limited",
  "fixture-research",
]);

export type ReasonCode = z.infer<typeof ReasonCodeSchema>;

export const TradeoffCodeSchema = z.enum([
  "required-feature-limited",
  "required-feature-add-on",
  "required-feature-higher-plan",
  "preferred-feature-weak",
  "weak-primary-use-case",
  "business-size-uncertain",
  "integration-weak",
  "priority-mismatch",
  "budget-over",
  "budget-unknown",
  "customization-limited",
  "research-incomplete",
]);

export type TradeoffCode = z.infer<typeof TradeoffCodeSchema>;

export const BudgetFitLabelSchema = z.enum([
  "good",
  "tight",
  "over",
  "unknown",
]);

export type BudgetFitLabel = z.infer<typeof BudgetFitLabelSchema>;

export const FinderReasonSchema = z.object({
  code: ReasonCodeSchema,
  text: z.string().min(1),
  positive: z.boolean(),
});

export type FinderReason = z.infer<typeof FinderReasonSchema>;

export const FinderTradeoffSchema = z.object({
  code: TradeoffCodeSchema,
  text: z.string().min(1),
});

export type FinderTradeoff = z.infer<typeof FinderTradeoffSchema>;

/** User-facing CRM finder recommendation DTO. */
export const FinderRecommendationResultSchema = z.object({
  productSlug: SlugSchema,
  name: z.string().min(1),
  matchScore: z.number().min(0).max(100),
  confidence: RecommendationConfidenceSchema,
  breakdown: ScoreBreakdownSchema,
  reasons: z.array(FinderReasonSchema).default([]),
  tradeoffs: z.array(FinderTradeoffSchema).default([]),
  unknowns: z.array(z.string()).default([]),
  estimatedMonthlyTotal: z.number().nonnegative().optional(),
  estimatedCurrency: CurrencyCodeSchema.optional(),
  budgetFit: BudgetFitLabelSchema.optional(),
  labels: z.array(z.string()).optional(),
  comparisonPath: z.string().optional(),
});

export type FinderRecommendationResult = z.infer<
  typeof FinderRecommendationResultSchema
>;

export const CrmProductFitSchema = z.object({
  productSlug: SlugSchema,
  businessSizeFits: z.record(z.string(), FitLevelSchema),
  useCaseFits: z.record(z.string(), FitLevelSchema),
  priorityFits: z.partialRecord(FinderPrioritySlugSchema, FitLevelSchema),
  businessTypeFits: z.record(z.string(), FitLevelSchema).default({}),
});

export type CrmProductFit = z.infer<typeof CrmProductFitSchema>;
