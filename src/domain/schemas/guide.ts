import { z } from "zod";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { SlugSchema } from "./primitives";
import { GuideContentBlockSchema } from "./guide-blocks";

/**
 * Educational guide page — supporting content, not a commercial decision anchor.
 */
export const SupportingTopicTypeSchema = z.enum([
  "fundamental",
  "how-it-works",
  "selection",
  "buying-guide",
  "feature-explainer",
  "pricing-education",
  "implementation",
  "migration",
  "setup",
  "integration",
  "use-case",
  "strategy",
  "troubleshooting",
  "comparison-education",
  "checklist",
]);

export type SupportingTopicType = z.infer<typeof SupportingTopicTypeSchema>;

export const UserJourneyStageSchema = z.enum([
  "learn",
  "understand",
  "evaluate",
  "choose",
  "implement",
  "optimize",
  "switch",
]);

export type UserJourneyStage = z.infer<typeof UserJourneyStageSchema>;

export const SupportRelationTypeSchema = z.enum([
  "supports-anchor",
  "explains-feature",
  "explains-pricing",
  "implementation-for",
  "migration-for",
  "answers-question-for",
]);

export type SupportRelationType = z.infer<typeof SupportRelationTypeSchema>;

export const GuideSupportEdgeSchema = z.object({
  contentId: z.string().min(1),
  relationType: SupportRelationTypeSchema.default("supports-anchor"),
  primary: z.boolean().default(false),
});

export type GuideSupportEdge = z.infer<typeof GuideSupportEdgeSchema>;

export const GuideChecklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

/** Unique per-guide hero illustration — never reuse another guide's artwork. */
export const GuideHeroVisualSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export type GuideHeroVisual = z.infer<typeof GuideHeroVisualSchema>;

export const GuidePageSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  title: z.string().min(1),
  summary: z.string().optional(),
  categorySlugs: z.array(SlugSchema).default([]),
  productSlugs: z.array(SlugSchema).default([]),
  topicType: SupportingTopicTypeSchema.default("fundamental"),
  journeyStage: UserJourneyStageSchema.default("learn"),
  knowledgeAreaSlug: SlugSchema.optional(),
  /**
   * Unique hero illustration for this guide.
   * Published guides should set this — must not copy another guide's asset.
   */
  heroVisual: GuideHeroVisualSchema.optional(),
  /** Anchor / tool ContentIds this guide supports. */
  supports: z.array(GuideSupportEdgeSchema).default([]),
  /** Preferred next step after reading (usually an anchor). */
  nextAction: z
    .object({
      contentId: z.string().min(1),
      label: z.string().min(1),
    })
    .optional(),
  relatedGuideSlugs: z.array(SlugSchema).default([]),
  checklist: z.array(GuideChecklistItemSchema).default([]),
  /**
   * Structured decision / educational blocks (preferred for selection guides).
   * When present, the guide renderer prefers blocks over plain sections.
   */
  blocks: z.array(GuideContentBlockSchema).default([]),
  sections: z
    .array(
      z.object({
        id: z.string().min(1),
        heading: z.string().min(1),
        body: z.string().min(1),
        tip: z.string().min(1).optional(),
      }),
    )
    .default([]),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .default([]),
  freshnessClass: z
    .enum(["slow-moving", "medium-moving", "fast-moving"])
    .default("medium-moving"),
  metadata: ContentMetadataSchema,
  seo: SeoFieldsSchema,
});

export type GuidePage = z.infer<typeof GuidePageSchema>;

export * from "./guide-blocks";
