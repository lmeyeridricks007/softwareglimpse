import { z } from "zod";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { SlugSchema } from "./primitives";

export const ComparisonCriterionConfigSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  /** Potential weight for future scoring (relative). */
  weightPotential: z.number().positive().optional(),
  applicableCategorySlugs: z.array(SlugSchema).default([]),
  displayOrder: z.number().int().nonnegative().default(0),
});

export type ComparisonCriterionConfig = z.infer<
  typeof ComparisonCriterionConfigSchema
>;

/**
 * Overall comparison outcome — never force a universal winner.
 */
export const ComparisonWinnerKindSchema = z.enum([
  "product-a",
  "product-b",
  "tie",
  "depends",
]);

export type ComparisonWinnerKind = z.infer<typeof ComparisonWinnerKindSchema>;

export const CriterionOutcomeSchema = z.object({
  criterionSlug: SlugSchema,
  /** Explicit product slug winner, or null for tie/depends. */
  winnerSlug: SlugSchema.nullable().optional(),
  /** Structured outcome when a single winnerSlug is insufficient. */
  winnerKind: ComparisonWinnerKindSchema.optional(),
  reason: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  supportingFactIds: z.array(z.string().min(1)).default([]),
  assessmentIds: z.array(z.string().min(1)).default([]),
  researchStatus: z
    .enum(["none", "in-progress", "complete", "stale"])
    .default("none"),
});

export type CriterionOutcome = z.infer<typeof CriterionOutcomeSchema>;

/**
 * First-class comparison document.
 * Canonical slug is always lexicographic: `{a}-vs-{b}` where a < b.
 */
export const ComparisonSchema = z.object({
  id: z.string().min(1),
  /** Must match canonicalizeComparisonSlug(productSlugs). */
  slug: SlugSchema,
  title: z.string().min(1),
  productSlugs: z.array(SlugSchema).length(2),
  categorySlug: SlugSchema.optional(),
  /** Criterion slugs from category comparison config. */
  criterionSlugs: z.array(SlugSchema).default([]),
  outcomes: z.array(CriterionOutcomeSchema).default([]),
  verdict: z.string().optional(),
  /** Overall outcome — prefer depends/tie when no universal winner. */
  overallWinnerKind: ComparisonWinnerKindSchema.optional(),
  overallWinnerSlug: SlugSchema.nullable().optional(),
  bestFor: z
    .array(
      z.object({
        productSlug: SlugSchema,
        scenarios: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  summary: z.string().optional(),
  pricingNotes: z.string().optional(),
  scenarioRecommendations: z
    .array(
      z.object({
        scenario: z.string().min(1),
        preferredSlug: SlugSchema.nullable().optional(),
        rationale: z.string().min(1),
      }),
    )
    .default([]),
  useCaseOutcomes: z
    .array(
      z.object({
        useCaseSlug: SlugSchema,
        preferredSlug: SlugSchema.nullable().optional(),
        notes: z.string().optional(),
      }),
    )
    .default([]),
  relatedAlternativeSlugs: z.array(SlugSchema).default([]),
  methodologyVersion: z.string().optional(),
  editorialStatus: z
    .enum([
      "not-assessed",
      "assessment-in-progress",
      "review-required",
      "approved",
      "outdated",
    ])
    .default("not-assessed"),
  refreshNeeded: z.boolean().default(false),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type Comparison = z.infer<typeof ComparisonSchema>;
