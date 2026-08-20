import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Editorial lifecycle — distinct from research/fact verification.
 * Researched product data ≠ editorial review.
 */
export const EditorialStatusSchema = z.enum([
  "not-assessed",
  "assessment-in-progress",
  "review-required",
  "approved",
  "outdated",
]);

export type EditorialStatus = z.infer<typeof EditorialStatusSchema>;

export const EditorialConfidenceSchema = z.enum(["low", "medium", "high"]);

export type EditorialConfidence = z.infer<typeof EditorialConfidenceSchema>;

/**
 * Category methodology criterion (CRM evaluation framework).
 */
export const MethodologyCriterionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  weight: z.number().positive().default(1),
  evidenceRequirements: z.array(z.string().min(1)).default([]),
  scoringScaleMin: z.number().default(0),
  scoringScaleMax: z.number().default(10),
  categorySlug: SlugSchema,
  displayOrder: z.number().int().nonnegative().default(0),
});

export type MethodologyCriterion = z.infer<typeof MethodologyCriterionSchema>;

export const MethodologySchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  version: z.string().min(1),
  categorySlug: SlugSchema,
  description: z.string().min(1),
  criteria: z.array(MethodologyCriterionSchema).min(1),
  notes: z.string().optional(),
});

export type Methodology = z.infer<typeof MethodologySchema>;

/**
 * Criterion assessment — score must include rationale.
 */
export const CriterionAssessmentSchema = z.object({
  criterionSlug: SlugSchema,
  score: z.number().min(0).max(10),
  rationale: z.string().min(1),
  supportingFactIds: z.array(z.string().min(1)).default([]),
  confidence: EditorialConfidenceSchema.default("medium"),
  status: EditorialStatusSchema.default("assessment-in-progress"),
  reviewedAt: IsoDateTimeSchema.optional(),
  reviewer: z.string().optional(),
});

export type CriterionAssessment = z.infer<typeof CriterionAssessmentSchema>;

/**
 * Product-level editorial assessment (judgments, not vendor facts).
 */
export const ProductEditorialAssessmentSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema,
  methodologySlug: SlugSchema,
  methodologyVersion: z.string().min(1),
  status: EditorialStatusSchema.default("not-assessed"),
  verdict: z.string().optional(),
  strengths: z.array(z.string().min(1)).default([]),
  weaknesses: z.array(z.string().min(1)).default([]),
  bestFor: z.array(z.string().min(1)).default([]),
  notIdealFor: z.array(z.string().min(1)).default([]),
  tradeoffs: z.array(z.string().min(1)).default([]),
  recommendation: z.string().optional(),
  editorialNotes: z.string().optional(),
  /** Explicit: whether hands-on testing occurred. Default false. */
  handsOnTesting: z.boolean().default(false),
  testingNotes: z.string().optional(),
  handsOnSummary: z.string().optional(),
  testedAt: IsoDateTimeSchema.optional(),
  testEnvironment: z.string().optional(),
  confidence: EditorialConfidenceSchema.default("low"),
  criterionAssessments: z.array(CriterionAssessmentSchema).default([]),
  overallScore: z.number().min(0).max(10).optional(),
  overallScoreRationale: z.string().optional(),
  scoreAudit: z
    .array(
      z.object({
        at: IsoDateTimeSchema,
        actor: z.string().min(1),
        change: z.string().min(1),
        previousOverall: z.number().optional(),
        nextOverall: z.number().optional(),
      }),
    )
    .default([]),
  reviewedAt: IsoDateTimeSchema.optional(),
  reviewer: z.string().optional(),
  createdAt: IsoDateTimeSchema.optional(),
  updatedAt: IsoDateTimeSchema.optional(),
});

export type ProductEditorialAssessment = z.infer<
  typeof ProductEditorialAssessmentSchema
>;
