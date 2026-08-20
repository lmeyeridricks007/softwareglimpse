import { z } from "zod";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { CategoryPageIntentSchema } from "./dimensions";
import { SlugSchema } from "./primitives";

export const CategorySchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  /** Alternate labels for classification / SEO / migration — not separate categories. */
  aliases: z.array(z.string().min(1)).default([]),
  /** Category lifecycle — distinct from page publish status. */
  categoryLifecycle: z
    .enum(["candidate", "active", "deprecated", "merged", "archived"])
    .default("active"),
  parentSlug: SlugSchema.nullable().default(null),
  path: z.array(SlugSchema).min(1),
  sortOrder: z.number().int().nonnegative().default(0),
  /**
   * - supported: in graph only
   * - hub: public decision hub when published
   * - indexable: SEO-eligible when quality + seo.indexable allow
   */
  pageIntent: CategoryPageIntentSchema,
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type Category = z.infer<typeof CategorySchema>;

export const IndustrySchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type Industry = z.infer<typeof IndustrySchema>;

export const UseCaseSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categorySlugs: z.array(SlugSchema).default([]),
  audienceSlugs: z.array(SlugSchema).default([]),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type UseCase = z.infer<typeof UseCaseSchema>;

/** Global capability hubs (`/capabilities/[slug]/`) — category-tagged like use cases. */
export const CapabilitySchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  categorySlugs: z.array(SlugSchema).default([]),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type Capability = z.infer<typeof CapabilitySchema>;

/** Canonical artifact type — do not use "resource" as the meaningful type. */
export const ResourceTypeSchema = z.enum([
  "CHECKLIST",
  "SCORECARD",
  "WORKSHEET",
  "TEMPLATE",
  "MATRIX",
  "QUESTION_LIST",
  "PLANNING_PACK",
  "AUDIT_TEMPLATE",
  "MIGRATION_TEMPLATE",
  "IMPLEMENTATION_TEMPLATE",
  "RFP_TEMPLATE",
  "DECISION_TEMPLATE",
  "CALCULATOR_EXPORT",
]);

export type ResourceType = z.infer<typeof ResourceTypeSchema>;

/** Buying journey stage for resources. */
export const BuyingStageSchema = z.enum([
  "DISCOVER",
  "DEFINE",
  "SHORTLIST",
  "EVALUATE",
  "VALIDATE",
  "DECIDE",
  "BUY",
  "IMPLEMENT",
  "OPTIMIZE",
  "REVIEW",
]);

export type BuyingStage = z.infer<typeof BuyingStageSchema>;

/** Downloadable CRM resources (`/resources/[slug]/`) — checklists, templates, worksheets. */
export const ResourceSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortTitle: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  /** @deprecated Prefer resourceType — kept for legacy filters/UI. */
  kind: z.enum([
    "checklist",
    "template",
    "scorecard",
    "worksheet",
    "planner",
  ]),
  /** @deprecated Prefer buyingStage — kept for legacy filters/UI. */
  stage: z.enum([
    "choose",
    "implement",
    "compare",
    "security",
    "optimize",
  ]),
  resourceType: ResourceTypeSchema.optional(),
  buyingStage: BuyingStageSchema.optional(),
  jobToBeDone: z.string().min(1).optional(),
  bestFor: z.array(z.string().min(1)).default([]),
  timeToComplete: z.string().optional(),
  difficulty: z.enum(["easy", "moderate", "advanced"]).optional(),
  categorySlugs: z.array(SlugSchema).default([]),
  sortOrder: z.number().int().nonnegative().default(0),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type Resource = z.infer<typeof ResourceSchema>;

export const FeatureSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  categorySlugs: z.array(SlugSchema).default([]),
});

export type Feature = z.infer<typeof FeatureSchema>;

export const IntegrationSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

export type Integration = z.infer<typeof IntegrationSchema>;
