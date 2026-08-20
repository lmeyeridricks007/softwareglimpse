import { z } from "zod";
import { CurrencyCodeSchema, SlugSchema } from "./primitives";

/**
 * Structured requirements for the deterministic recommendation engine.
 * AI may later map natural language → this shape; ranking stays deterministic.
 */
export const RecommendationCriteriaSchema = z.object({
  companySize: z
    .enum(["solo", "micro", "small", "medium", "enterprise", "unknown"])
    .optional(),
  teamSize: z.number().int().positive().optional(),
  industrySlug: SlugSchema.optional(),
  budgetMonthly: z.number().nonnegative().optional(),
  budgetCurrency: CurrencyCodeSchema.optional(),
  requiredFeatureSlugs: z.array(SlugSchema).default([]),
  preferredIntegrationSlugs: z.array(SlugSchema).default([]),
  technicalCapability: z
    .enum(["low", "medium", "high", "unknown"])
    .optional(),
  countryOrRegion: z.string().optional(),
  businessMaturity: z
    .enum(["idea", "startup", "growth", "mature", "unknown"])
    .optional(),
  primaryUseCaseSlug: SlugSchema.optional(),
  secondaryUseCaseSlugs: z.array(SlugSchema).default([]),
  deploymentPreference: z
    .enum(["saas", "self-hosted", "hybrid", "on-premise", "any"])
    .optional(),
  categorySlug: SlugSchema.optional(),
});

export type RecommendationCriteria = z.infer<typeof RecommendationCriteriaSchema>;

export const RecommendationMatchSchema = z.object({
  softwareSlug: SlugSchema,
  matchScore: z.number().min(0).max(100),
  matchPercentage: z.number().min(0).max(100),
  whyItMatches: z.array(z.string().min(1)).default([]),
  potentialIssues: z.array(z.string().min(1)).default([]),
  estimatedPriceMonthly: z.number().nonnegative().optional(),
  estimatedCurrency: CurrencyCodeSchema.optional(),
  recommendedPlanSlug: SlugSchema.optional(),
  alternativeSlugs: z.array(SlugSchema).default([]),
});

export type RecommendationMatch = z.infer<typeof RecommendationMatchSchema>;
