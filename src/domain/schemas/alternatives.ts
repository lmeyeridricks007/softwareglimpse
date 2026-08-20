import { z } from "zod";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { SlugSchema } from "./primitives";

/**
 * Contextual alternative entry — not just a bare slug list.
 */
export const AlternativeEntrySchema = z.object({
  targetSlug: SlugSchema,
  reason: z.string().optional(),
  betterWhen: z.array(z.string().min(1)).default([]),
  worseWhen: z.array(z.string().min(1)).default([]),
  keyTradeoff: z.string().optional(),
  targetAudience: z.string().optional(),
  relativePricing: z
    .enum(["unknown", "lower", "similar", "higher"])
    .default("unknown"),
  useCaseSlugs: z.array(SlugSchema).default([]),
  editorialNote: z.string().optional(),
  researchStatus: z
    .enum(["none", "in-progress", "complete", "stale"])
    .default("none"),
});

export type AlternativeEntry = z.infer<typeof AlternativeEntrySchema>;

export const AlternativesPageSchema = z.object({
  id: z.string().min(1),
  /** Usually matches source product slug. */
  slug: SlugSchema,
  title: z.string().min(1),
  sourceSlug: SlugSchema,
  alternatives: z.array(AlternativeEntrySchema).default([]),
  summary: z.string().optional(),
  editorialRecommendation: z.string().optional(),
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

export type AlternativesPage = z.infer<typeof AlternativesPageSchema>;
