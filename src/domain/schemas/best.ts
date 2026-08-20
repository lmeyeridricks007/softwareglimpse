import { z } from "zod";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { SlugSchema } from "./primitives";

export const BestFeatureLevelSchema = z.enum([
  "strong",
  "good",
  "limited",
  "unknown",
]);

export type BestFeatureLevel = z.infer<typeof BestFeatureLevelSchema>;

export const BestRecommendationSchema = z.object({
  productSlug: SlugSchema,
  rank: z.number().int().positive().optional(),
  /** Structured label e.g. "Best overall" — requires editorial approval. */
  badge: z.string().optional(),
  recommendationLabel: z.string().optional(),
  rationale: z.string().optional(),
  /** Longer public editorial summary (2–3 paragraphs). */
  editorialSummary: z.string().optional(),
  strengths: z.array(z.string().min(1)).default([]),
  tradeOffs: z.array(z.string().min(1)).default([]),
  scenarios: z.array(z.string().min(1)).default([]),
  whyPicked: z.string().optional(),
  idealFor: z.array(z.string().min(1)).default([]),
  avoidIf: z.array(z.string().min(1)).default([]),
  alternatives: z
    .array(
      z.object({
        productSlug: SlugSchema,
        when: z.string().min(1),
      }),
    )
    .default([]),
  featureSnapshot: z
    .array(
      z.object({
        label: z.string().min(1),
        level: BestFeatureLevelSchema.optional(),
        /** Numeric 0–10 only when editorially approved scores exist. */
        score: z.number().min(0).max(10).optional(),
      }),
    )
    .default([]),
  keyDetails: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .default([]),
  useCaseSlugs: z.array(SlugSchema).default([]),
  audienceSlugs: z.array(SlugSchema).default([]),
  score: z.number().min(0).max(10).optional(),
  approved: z.boolean().default(false),
  /**
   * Internal editorial notes — NEVER rendered on public pages.
   * Use for provisional/fixture/workflow commentary.
   */
  editorialNotes: z.string().optional(),
});

export type BestRecommendation = z.infer<typeof BestRecommendationSchema>;

export const BestBuyingStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const BestLandscapeGroupSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  productSlugs: z.array(SlugSchema).default([]),
});

export const BestCompanySizeGuideSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  href: z.string().optional(),
});

export const BestSoftwareTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  href: z.string().optional(),
});

export const BestDecisionPathSchema = z.object({
  priority: z.string().min(1),
  productSlug: SlugSchema,
  label: z.string().optional(),
  approved: z.boolean().default(false),
});

export const BestVerdictPathSchema = z.object({
  productSlug: SlugSchema,
  when: z.string().min(1),
  approved: z.boolean().default(false),
});

/**
 * Best-software guide — rankings are explicit editorial data, never affiliate-derived.
 */
export const BestPageSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  title: z.string().min(1),
  summary: z.string().optional(),
  /** Eyebrow above H1, e.g. "CRM SOFTWARE BUYING GUIDE". */
  heroEyebrow: z.string().optional(),
  /** Hero subtitle — public buyer language only. */
  heroSubtitle: z.string().optional(),
  /** Short intro under "at a glance". */
  quickAnswerIntro: z.string().optional(),
  categorySlug: SlugSchema.optional(),
  audienceSlugs: z.array(SlugSchema).default([]),
  useCaseSlugs: z.array(SlugSchema).default([]),
  methodology: z.string().optional(),
  methodologyVersion: z.string().optional(),
  /** Public methodology intro — never expose version numbers here. */
  methodologyIntro: z.string().optional(),
  eligibleProductSlugs: z.array(SlugSchema).default([]),
  recommendations: z.array(BestRecommendationSchema).default([]),
  useCaseRecommendations: z
    .array(
      z.object({
        useCaseSlug: SlugSchema,
        label: z.string().min(1),
        productSlug: SlugSchema,
        rationale: z.string().min(1),
        approved: z.boolean().default(false),
        editorialNotes: z.string().optional(),
      }),
    )
    .default([]),
  decisionPaths: z.array(BestDecisionPathSchema).default([]),
  landscape: z.array(BestLandscapeGroupSchema).default([]),
  companySizes: z.array(BestCompanySizeGuideSchema).default([]),
  softwareTypes: z.array(BestSoftwareTypeSchema).default([]),
  buyingGuideSteps: z.array(BestBuyingStepSchema).default([]),
  buyingGuideHref: z.string().optional(),
  verdict: z
    .object({
      heading: z.string().optional(),
      body: z.string().min(1),
      paths: z.array(BestVerdictPathSchema).default([]),
    })
    .optional(),
  relatedComparisonSlugs: z.array(SlugSchema).default([]),
  relatedAlternativeSlugs: z.array(SlugSchema).default([]),
  relatedToolPaths: z.array(z.string().startsWith("/")).default([]),
  /** Feature slugs for matrix when verified support data exists. */
  featureMatrixSlugs: z.array(SlugSchema).default([]),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .default([]),
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
  /** Internal-only commentary — never rendered publicly. */
  editorialNotes: z.string().optional(),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type BestPage = z.infer<typeof BestPageSchema>;
