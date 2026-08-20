import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Provenance for editorial claims — supports QA without leaking internal IDs publicly.
 */
export const EditorialClaimTypeSchema = z.enum([
  "verified-fact",
  "research-inference",
  "editorial-assessment",
  "hands-on-observation",
]);

export type EditorialClaimType = z.infer<typeof EditorialClaimTypeSchema>;

export const ReviewVerdictLabelSchema = z.enum([
  "excellent",
  "strong",
  "good",
  "mixed",
  "limited",
]);

export type ReviewVerdictLabel = z.infer<typeof ReviewVerdictLabelSchema>;

export const CoverageStateSchema = z.enum([
  "complete",
  "partial",
  "missing",
  "not-applicable",
]);

export type CoverageState = z.infer<typeof CoverageStateSchema>;

export const ReviewCoverageSchema = z.object({
  productOverview: CoverageStateSchema.default("missing"),
  editorialVerdict: CoverageStateSchema.default("missing"),
  majorCriteria: CoverageStateSchema.default("missing"),
  pricing: CoverageStateSchema.default("missing"),
  planSelection: CoverageStateSchema.default("missing"),
  alternatives: CoverageStateSchema.default("missing"),
  competitorContext: CoverageStateSchema.default("missing"),
  limitations: CoverageStateSchema.default("missing"),
  researchTransparency: CoverageStateSchema.default("missing"),
  productExperience: CoverageStateSchema.default("missing"),
});

export type ReviewCoverage = z.infer<typeof ReviewCoverageSchema>;

export const HandsOnTestSchema = z.object({
  productSlug: SlugSchema,
  testedAt: IsoDateTimeSchema,
  testerId: z.string().min(1),
  scope: z.array(z.string().min(1)).default([]),
  notes: z.array(z.string().min(1)).default([]),
  assetIds: z.array(z.string().min(1)).default([]),
});

export type HandsOnTest = z.infer<typeof HandsOnTestSchema>;

export const ProductWorkflowStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
  featureSlug: SlugSchema.optional(),
});

export type ProductWorkflowStep = z.infer<typeof ProductWorkflowStepSchema>;

export const ProductExperienceReviewSchema = z.object({
  summary: z.string().min(1),
  workflowSteps: z.array(ProductWorkflowStepSchema).default([]),
  claimType: EditorialClaimTypeSchema.default("research-inference"),
  evidenceNote: z.string().optional(),
});

export type ProductExperienceReview = z.infer<
  typeof ProductExperienceReviewSchema
>;

export const DetailedReviewSectionSchema = z.object({
  id: z.string().min(1),
  criterionSlug: SlugSchema.optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.array(z.string().min(1)).default([]),
  score: z.number().min(0).max(10).optional(),
  scoreApproved: z.boolean().default(false),
  verdictLabel: ReviewVerdictLabelSchema.optional(),
  strengths: z.array(z.string().min(1)).default([]),
  weaknesses: z.array(z.string().min(1)).default([]),
  claimType: EditorialClaimTypeSchema.default("research-inference"),
  evidenceLabels: z.array(z.string().min(1)).default([]),
  competitorsMentioned: z.array(SlugSchema).default([]),
});

export type DetailedReviewSection = z.infer<typeof DetailedReviewSectionSchema>;

export const LimitationSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  explanation: z.string().min(1),
  whoItAffects: z.string().optional(),
  alternativeSlug: SlugSchema.optional(),
  alternativeName: z.string().optional(),
  claimType: EditorialClaimTypeSchema.default("editorial-assessment"),
});

export type LimitationSection = z.infer<typeof LimitationSectionSchema>;

export const PlanRecommendationSchema = z.object({
  planSlug: SlugSchema,
  planName: z.string().min(1),
  bestFor: z.array(z.string().min(1)).default([]),
  chooseIf: z.array(z.string().min(1)).default([]),
  skipIf: z.array(z.string().min(1)).default([]),
  upgradeWhen: z.array(z.string().min(1)).default([]),
});

export type PlanRecommendation = z.infer<typeof PlanRecommendationSchema>;

export const CompetitorDeepDiveSchema = z.object({
  competitorSlug: SlugSchema,
  competitorName: z.string().min(1),
  competitorLogo: z
    .object({ src: z.string(), alt: z.string() })
    .nullable()
    .optional(),
  headline: z.string().min(1),
  chooseCurrentIf: z.array(z.string().min(1)).default([]),
  chooseCompetitorIf: z.array(z.string().min(1)).default([]),
  keyDifference: z.string().min(1),
  summary: z.string().optional(),
  comparisonHref: z.string().optional(),
});

export type CompetitorDeepDive = z.infer<typeof CompetitorDeepDiveSchema>;

export const FinalVerdictSchema = z.object({
  chooseIf: z.array(z.string().min(1)).default([]),
  considerOtherIf: z.array(z.string().min(1)).default([]),
  body: z.array(z.string().min(1)).min(1),
});

export type FinalVerdict = z.infer<typeof FinalVerdictSchema>;

/**
 * Optional deep-review payload stored on ProductReview (or derived at render time).
 */
export const DeepReviewContentSchema = z.object({
  productExperience: ProductExperienceReviewSchema.optional(),
  detailedSections: z.array(DetailedReviewSectionSchema).default([]),
  limitations: z.array(LimitationSectionSchema).default([]),
  planRecommendations: z.array(PlanRecommendationSchema).default([]),
  competitorDeepDives: z.array(CompetitorDeepDiveSchema).default([]),
  finalVerdict: FinalVerdictSchema.optional(),
  whyWeLike: z.array(z.string().min(1)).default([]),
  keyTakeaway: z.string().optional(),
  handsOnTests: z.array(HandsOnTestSchema).default([]),
  coverage: ReviewCoverageSchema.optional(),
});

export type DeepReviewContent = z.infer<typeof DeepReviewContentSchema>;
