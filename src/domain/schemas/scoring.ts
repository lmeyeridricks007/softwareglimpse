import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Category-specific editorial scoring dimensions.
 * Do not force irrelevant ratings onto every product category.
 */
export const ScoringCriterionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  categorySlug: SlugSchema,
  displayOrder: z.number().int().nonnegative().default(0),
  weightPotential: z.number().positive().optional(),
});

export type ScoringCriterion = z.infer<typeof ScoringCriterionSchema>;

/**
 * Standard scoring dimension catalog.
 * Categories map a subset of these (or category-specific criteria) with weights.
 * Do NOT assign arbitrary scores to products without editorial assessment.
 */
export const StandardScoringDimensionIdSchema = z.enum([
  "easeOfUse",
  "features",
  "automation",
  "reporting",
  "integrations",
  "value",
  "setup",
  "support",
  "scalability",
]);

export type StandardScoringDimensionId = z.infer<
  typeof StandardScoringDimensionIdSchema
>;

export const STANDARD_SCORING_DIMENSIONS: Record<
  StandardScoringDimensionId,
  { slug: string; name: string; description: string }
> = {
  easeOfUse: {
    slug: "ease-of-use",
    name: "Ease of use",
    description: "Learning curve, daily usability, and time-to-productivity.",
  },
  features: {
    slug: "features",
    name: "Features",
    description: "Breadth and depth of core product capabilities.",
  },
  automation: {
    slug: "automation",
    name: "Automation",
    description: "Workflow automation and reduction of repetitive work.",
  },
  reporting: {
    slug: "reporting",
    name: "Reporting",
    description: "Dashboards, analytics depth, and forecasting quality.",
  },
  integrations: {
    slug: "integrations",
    name: "Integrations",
    description: "Native integrations, APIs, and ecosystem connectivity.",
  },
  value: {
    slug: "value",
    name: "Value",
    description: "Value relative to list pricing and plan packaging.",
  },
  setup: {
    slug: "setup",
    name: "Setup",
    description: "Implementation effort, onboarding, and time-to-value.",
  },
  support: {
    slug: "support",
    name: "Support",
    description: "Support channels, documentation, and customer success.",
  },
  scalability: {
    slug: "scalability",
    name: "Scalability",
    description: "Fit as team size, volume, and complexity grow.",
  },
};

/**
 * Per-dimension editorial score with weight, evidence refs, and notes.
 * Final overall scores must be traceable to these rows.
 *
 * Named Editorial* to avoid clashing with site-intelligence DimensionScoreSchema.
 */
export const EditorialDimensionScoreSchema = z.object({
  dimensionId: z.string().min(1),
  dimensionSlug: SlugSchema,
  score: z.number().min(0).max(10),
  weight: z.number().positive(),
  evidence: z.array(z.string().min(1)).default([]),
  notes: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
});

export type EditorialDimensionScore = z.infer<
  typeof EditorialDimensionScoreSchema
>;

/**
 * Category scoring profile — which dimensions apply and their default weights.
 * Profiles configure infrastructure; they do not invent product scores.
 */
export const CategoryScoringProfileSchema = z.object({
  id: z.string().min(1),
  categorySlug: SlugSchema,
  version: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  /** Maps methodology/standard dimension slugs → relative weights */
  dimensionWeights: z
    .array(
      z.object({
        dimensionSlug: SlugSchema,
        weight: z.number().positive(),
        required: z.boolean().default(false),
        standardDimensionId: StandardScoringDimensionIdSchema.optional(),
      }),
    )
    .min(1),
  scoringScaleMin: z.number().default(0),
  scoringScaleMax: z.number().default(10),
  notes: z.string().optional(),
});

export type CategoryScoringProfile = z.infer<
  typeof CategoryScoringProfileSchema
>;

/**
 * Traceable overall score derived from dimension rows.
 * Never fabricate historical scores or invent overall without dimensions.
 */
export const TraceableOverallScoreSchema = z.object({
  overall: z.number().min(0).max(10),
  dimensions: z.array(EditorialDimensionScoreSchema).min(1),
  methodologySlug: SlugSchema.optional(),
  methodologyVersion: z.string().optional(),
  profileId: z.string().optional(),
  computedAt: IsoDateTimeSchema.optional(),
  rationale: z.string().optional(),
});

export type TraceableOverallScore = z.infer<typeof TraceableOverallScoreSchema>;
