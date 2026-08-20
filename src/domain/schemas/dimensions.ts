import { z } from "zod";
import { ContentMetadataSchema, SeoFieldsSchema } from "./content-metadata";
import { SlugSchema } from "./primitives";

export const BusinessSizeSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  employeeMin: z.number().int().nonnegative().nullable().default(null),
  employeeMax: z.number().int().nonnegative().nullable().default(null),
  sortOrder: z.number().int().nonnegative().default(0),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type BusinessSize = z.infer<typeof BusinessSizeSchema>;

export const TeamTypeSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  categorySlugs: z.array(SlugSchema).default([]),
  sortOrder: z.number().int().nonnegative().default(0),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type TeamType = z.infer<typeof TeamTypeSchema>;

export const BusinessTypeSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  sortOrder: z.number().int().nonnegative().default(0),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type BusinessType = z.infer<typeof BusinessTypeSchema>;

export const UserPrioritySchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  defaultWeight: z.number().min(0).max(1).optional(),
  sortOrder: z.number().int().nonnegative().default(0),
});

export type UserPriority = z.infer<typeof UserPrioritySchema>;

export const AudiencePageSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  businessSizeSlugs: z.array(SlugSchema).default([]),
  businessTypeSlugs: z.array(SlugSchema).default([]),
  teamTypeSlugs: z.array(SlugSchema).default([]),
  useCaseSlugs: z.array(SlugSchema).default([]),
  metadata: ContentMetadataSchema.default({ status: "draft" }),
  seo: SeoFieldsSchema.default({ indexable: false }),
});

export type AudiencePage = z.infer<typeof AudiencePageSchema>;

export const CategoryPageIntentSchema = z
  .enum(["supported", "hub", "indexable"])
  .default("supported");

export type CategoryPageIntent = z.infer<typeof CategoryPageIntentSchema>;
