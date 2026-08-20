import { z } from "zod";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { DeepReviewContentSchema } from "./deep-review";
import {
  CriterionAssessmentSchema,
  EditorialConfidenceSchema,
  EditorialStatusSchema,
} from "./editorial";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Review list bullets are canonical strings. Agents sometimes emit
 * `{ name|title|label|text|description }` objects — coerce so one bad
 * write cannot crash module init (SI product guides load every review).
 */
function bulletFromObject(obj: Record<string, unknown>): string {
  for (const key of [
    "text",
    "label",
    "name",
    "title",
    "feature",
    "description",
    "value",
  ] as const) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  for (const value of Object.values(obj)) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

const StringBulletSchema = z.union([
  z.string().min(1),
  z
    .record(z.string(), z.unknown())
    .transform(bulletFromObject)
    .pipe(z.string().min(1)),
]);

const StringBulletListSchema = z.array(StringBulletSchema).default([]);

/**
 * First-class product review content model.
 * Canonical URL: /software/{slug}/ (not /reviews/).
 * Structured sections — not a single markdown blob.
 */
export const ProductReviewSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema,
  assessmentId: z.string().min(1),
  editorialStatus: EditorialStatusSchema.default("not-assessed"),
  title: z.string().min(1),
  h1: z.string().min(1),
  intro: z.string().optional(),
  summary: z.string().optional(),
  verdict: z.string().optional(),
  overallScore: z.number().min(0).max(10).optional(),
  criterionAssessments: z.array(CriterionAssessmentSchema).default([]),
  bestFor: StringBulletListSchema,
  notIdealFor: StringBulletListSchema,
  pros: StringBulletListSchema,
  cons: StringBulletListSchema,
  pricingSummary: z.string().optional(),
  keyFeatures: StringBulletListSchema,
  limitations: StringBulletListSchema,
  whoShouldChoose: z.string().optional(),
  whoShouldConsiderAlternatives: z.string().optional(),
  alternativeSlugs: z.array(SlugSchema).default([]),
  comparisonSlugs: z.array(SlugSchema).default([]),
  relatedGuidePaths: z.array(z.string().startsWith("/")).default([]),
  methodologySlug: SlugSchema.optional(),
  methodologyVersion: z.string().optional(),
  researchSourceIds: z.array(z.string().min(1)).default([]),
  factRefs: z
    .array(
      z.object({
        section: z.string().min(1),
        factIds: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
        factIds: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  sections: z
    .array(
      z.object({
        id: z.string().min(1),
        heading: z.string().min(1),
        body: z.string().min(1),
        factRefs: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  /** Optional structured deep-review layer (preferred over giant markdown). */
  deepReview: DeepReviewContentSchema.optional(),
  confidence: EditorialConfidenceSchema.default("low"),
  handsOnTesting: z.boolean().default(false),
  draftId: z.string().optional(),
  contentVersion: z.number().int().positive().default(1),
  refreshNeeded: z.boolean().default(false),
  refreshReason: z.string().optional(),
  lastUpdatedAt: IsoDateTimeSchema.optional(),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type ProductReview = z.infer<typeof ProductReviewSchema>;
