import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for Category Hub pages.
 * Complements Category / CategoryDefinition — does not replace taxonomy or methodology.
 * Components hide sections when optional fields are empty.
 */

export const CategoryHubLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
});

export type CategoryHubLink = z.infer<typeof CategoryHubLinkSchema>;

export const CategoryHubTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  /** Lucide icon key resolved in UI (string keeps profile serializable). */
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
  ctaLabel: z.string().optional(),
});

export type CategoryHubType = z.infer<typeof CategoryHubTypeSchema>;

export const CategoryHubGlanceSchema = z.object({
  whatItDoes: z.array(z.string().min(1)).default([]),
  bestFor: z.array(z.string().min(1)).default([]),
  typicalFeatures: z.array(z.string().min(1)).default([]),
});

export type CategoryHubGlance = z.infer<typeof CategoryHubGlanceSchema>;

export const CategoryHubExplorePathSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1),
  ctaLabel: z.string().min(1),
  /** Visual tone key — resolved to design-system pastel chips in UI. */
  tone: z
    .enum(["gold", "green", "violet", "blue", "pink", "teal", "amber"])
    .default("blue"),
  icon: z.string().min(1).optional(),
});

export type CategoryHubExplorePath = z.infer<
  typeof CategoryHubExplorePathSchema
>;

export const CategoryHubBuyingStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
});

export type CategoryHubBuyingStep = z.infer<typeof CategoryHubBuyingStepSchema>;

export const CategoryHubFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type CategoryHubFaqItem = z.infer<typeof CategoryHubFaqItemSchema>;

export const CategoryHubFinderExampleSchema = z.object({
  requirements: z.array(z.string().min(1)).default([]),
  /** Demo/example matches only — never live scores. */
  matchSlugs: z.array(SlugSchema).default([]),
  disclaimer: z
    .string()
    .default("Example only — not a live Finder result."),
});

export type CategoryHubFinderExample = z.infer<
  typeof CategoryHubFinderExampleSchema
>;

export const CategoryHubPricingModelSchema = z.object({
  summary: z.string().min(1),
  /** Example team sizes for seat-based illustration — no invented market averages. */
  seatExamples: z
    .array(
      z.object({
        label: z.string().min(1),
        seats: z.number().int().positive(),
        note: z.string().optional(),
      }),
    )
    .default([]),
  calculatorHref: z.string().optional(),
  guideHref: z.string().optional(),
});

export type CategoryHubPricingModel = z.infer<
  typeof CategoryHubPricingModelSchema
>;

export const CategoryHubProfileSchema = z.object({
  categorySlug: SlugSchema,
  shortName: z.string().min(1).optional(),
  /** Hero H1 override (e.g. "CRM Software"). */
  displayName: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  definition: z.string().min(1).optional(),
  longDescription: z.string().optional(),
  iconSlug: SlugSchema.optional(),
  decisionCriteria: z.array(z.string().min(1)).default([]),
  popularNeeds: z.array(z.string().min(1)).default([]),
  chooseGuideHref: z.string().optional(),
  glance: CategoryHubGlanceSchema.optional(),
  types: z.array(CategoryHubTypeSchema).default([]),
  explorePaths: z.array(CategoryHubExplorePathSchema).default([]),
  buyingFramework: z.array(CategoryHubBuyingStepSchema).default([]),
  buyingGuideHref: z.string().optional(),
  faq: z.array(CategoryHubFaqItemSchema).default([]),
  finderHref: z.string().optional(),
  finderExample: CategoryHubFinderExampleSchema.optional(),
  pricingModel: CategoryHubPricingModelSchema.optional(),
  methodologyHref: z.string().optional(),
  /** Feature slugs highlighted in the features explorer (must exist in catalogue). */
  featuredFeatureSlugs: z.array(SlugSchema).default([]),
  /** Feature slugs for matrix rows — matrix only renders when verified evidence exists. */
  matrixFeatureSlugs: z.array(SlugSchema).default([]),
  relatedCategorySlugs: z.array(SlugSchema).default([]),
  lastReviewedAt: z.string().optional(),
});

export type CategoryHubProfile = z.infer<typeof CategoryHubProfileSchema>;
