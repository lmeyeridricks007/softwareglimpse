import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Shared Vendor Scorecard state — category-agnostic persistence shape.
 * CRM Vendor Scorecard is the first consumer; product facts stay in editorial
 * assessments + enrichment (never duplicated here).
 */

export const VendorScorecardVersion = 1 as const;

export const CriterionImportanceSchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
  "ignore",
]);
export type CriterionImportance = z.infer<typeof CriterionImportanceSchema>;

export const ScorecardCriterionTypeSchema = z.enum([
  "capability",
  "requirement",
  "feature",
  "cost",
  "implementation",
  "methodology",
  "user-defined",
]);
export type ScorecardCriterionType = z.infer<
  typeof ScorecardCriterionTypeSchema
>;

export const VendorEvaluationStatusSchema = z.enum([
  "researching",
  "demo-scheduled",
  "trialing",
  "shortlisted",
  "finalist",
  "rejected",
  "selected",
]);
export type VendorEvaluationStatus = z.infer<
  typeof VendorEvaluationStatusSchema
>;

export const DemoChecklistResultSchema = z.enum([
  "fully-demonstrated",
  "partially-demonstrated",
  "not-demonstrated",
  "not-tested",
  "needs-follow-up",
]);
export type DemoChecklistResult = z.infer<typeof DemoChecklistResultSchema>;

export const UserRatingLabelSchema = z.enum([
  "poor",
  "fair",
  "good",
  "very-good",
  "excellent",
]);
export type UserRatingLabel = z.infer<typeof UserRatingLabelSchema>;

/** Maps 1–5 numeric ratings ↔ labels. */
export const USER_RATING_TO_LABEL: Record<1 | 2 | 3 | 4 | 5, UserRatingLabel> =
  {
    1: "poor",
    2: "fair",
    3: "good",
    4: "very-good",
    5: "excellent",
  };

export const USER_LABEL_TO_RATING: Record<UserRatingLabel, 1 | 2 | 3 | 4 | 5> =
  {
    poor: 1,
    fair: 2,
    good: 3,
    "very-good": 4,
    excellent: 5,
  };

export const ScorecardCriterionSchema = z.object({
  id: z.string().min(1),
  type: ScorecardCriterionTypeSchema,
  /** Methodology / capability / feature / requirement slug when applicable. */
  sourceId: SlugSchema.optional(),
  label: z.string().min(1),
  importance: CriterionImportanceSchema.default("medium"),
  /** Optional display weight 0–1 after normalization; derived at runtime if omitted. */
  normalizedWeight: z.number().min(0).max(1).optional(),
});
export type ScorecardCriterion = z.infer<typeof ScorecardCriterionSchema>;

export const UserCriterionRatingSchema = z.object({
  criterionId: z.string().min(1),
  /** 1–5; never merged silently into research scores. */
  rating: z.number().int().min(1).max(5),
});
export type UserCriterionRating = z.infer<typeof UserCriterionRatingSchema>;

export const DemoChecklistItemSchema = z.object({
  requirementId: SlugSchema,
  result: DemoChecklistResultSchema.default("not-tested"),
  notes: z.string().max(2000).optional(),
});
export type DemoChecklistItem = z.infer<typeof DemoChecklistItemSchema>;

export const ProductScorecardAssessmentSchema = z.object({
  productId: SlugSchema,
  userRatings: z.array(UserCriterionRatingSchema).default([]),
  notes: z.string().max(8000).optional(),
  status: VendorEvaluationStatusSchema.optional(),
  demoChecklist: z.array(DemoChecklistItemSchema).default([]),
});
export type ProductScorecardAssessment = z.infer<
  typeof ProductScorecardAssessmentSchema
>;

export const ScorecardCombinationSettingsSchema = z.object({
  /** Only applied when `enabled` is true — never implied by default. */
  enabled: z.boolean().default(false),
  researchPercent: z.number().int().min(0).max(100).default(70),
  userPercent: z.number().int().min(0).max(100).default(30),
});
export type ScorecardCombinationSettings = z.infer<
  typeof ScorecardCombinationSettingsSchema
>;

export const VendorScorecardStateSchema = z.object({
  version: z.literal(VendorScorecardVersion),
  categorySlug: SlugSchema,
  /** Profile `updatedAt` when scorecard was last synced from decision profile. */
  profileVersionAt: z.string().optional(),
  /** ISO timestamp when research snapshots were last acknowledged. */
  researchAcknowledgedAt: z.string().optional(),
  productIds: z.array(SlugSchema).default([]),
  criteria: z.array(ScorecardCriterionSchema).default([]),
  productAssessments: z.array(ProductScorecardAssessmentSchema).default([]),
  combinationSettings: ScorecardCombinationSettingsSchema.optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type VendorScorecardState = z.infer<typeof VendorScorecardStateSchema>;

export const CRM_VENDOR_SCORECARD_STORAGE_KEY = "sg-crm-vendor-scorecard-v1";
export const SI_VENDOR_SCORECARD_STORAGE_KEY = "sg-si-vendor-scorecard-v1";

export function vendorScorecardStorageKey(categorySlug: string): string {
  if (categorySlug === "crm") return CRM_VENDOR_SCORECARD_STORAGE_KEY;
  if (categorySlug === "sales-intelligence") {
    return SI_VENDOR_SCORECARD_STORAGE_KEY;
  }
  return `sg-${categorySlug}-vendor-scorecard-v1`;
}

export const DEFAULT_USER_EVALUATION_CRITERIA = [
  { id: "user-demo-quality", label: "Demo quality" },
  { id: "user-ease-of-use", label: "Ease of use" },
  { id: "user-navigation", label: "Navigation" },
  { id: "user-configuration", label: "Configuration" },
  { id: "user-admin-experience", label: "Admin experience" },
  { id: "user-workflow-fit", label: "Workflow fit" },
  { id: "user-reporting-fit", label: "Reporting fit" },
  { id: "user-vendor-responsiveness", label: "Vendor responsiveness" },
  { id: "user-implementation-confidence", label: "Implementation confidence" },
] as const;

export function createEmptyVendorScorecard(
  categorySlug: string,
  now: string = new Date().toISOString(),
): VendorScorecardState {
  return VendorScorecardStateSchema.parse({
    version: VendorScorecardVersion,
    categorySlug,
    createdAt: now,
    updatedAt: now,
  });
}

/** Categorical importance → relative weight before normalization. */
export const IMPORTANCE_WEIGHT: Record<CriterionImportance, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  ignore: 0,
};

export function normalizeCriterionWeights(
  criteria: ScorecardCriterion[],
): ScorecardCriterion[] {
  const active = criteria.filter((c) => c.importance !== "ignore");
  const rawSum = active.reduce(
    (sum, c) => sum + IMPORTANCE_WEIGHT[c.importance],
    0,
  );
  if (rawSum <= 0) {
    return criteria.map((c) => ({ ...c, normalizedWeight: 0 }));
  }
  return criteria.map((c) => ({
    ...c,
    normalizedWeight:
      c.importance === "ignore"
        ? 0
        : IMPORTANCE_WEIGHT[c.importance] / rawSum,
  }));
}
