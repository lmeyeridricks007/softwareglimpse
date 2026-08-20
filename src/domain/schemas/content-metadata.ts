import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Publishing lifecycle for software entities and content documents.
 * Scheduled/draft items must not be treated as published or indexable.
 *
 * Conceptual aliases (not separate enum values — keep seed compatibility):
 * - research-needed ≈ idea + researchStatus none
 * - research-complete ≈ researchStatus complete + draft
 * - editorial-draft ≈ draft
 * - editorial-review ≈ review
 *
 * Added operational statuses (seeds must not rely on these):
 * - rejected — editorial/ops rejection
 * - refreshing — optional while a refresh job runs (live copy still public)
 */
export const PublishStatusSchema = z.enum([
  "idea",
  "researching",
  "draft",
  "review",
  "approved",
  "scheduled",
  "published",
  "refresh-needed",
  "refreshing",
  "rejected",
  "archived",
]);

export type PublishStatus = z.infer<typeof PublishStatusSchema>;

/** Statuses where the live public copy remains available. */
export const PUBLISHED_STATUSES: readonly PublishStatus[] = [
  "published",
  "refresh-needed",
  "refreshing",
] as const;

export function isPublishedStatus(status: PublishStatus): boolean {
  return (PUBLISHED_STATUSES as readonly string[]).includes(status);
}

/**
 * Shared editorial/publishing metadata attached to entities and content.
 */
export const ContentMetadataSchema = z.object({
  status: PublishStatusSchema.default("draft"),
  createdAt: IsoDateTimeSchema.optional(),
  updatedAt: IsoDateTimeSchema.optional(),
  publishedAt: IsoDateTimeSchema.optional(),
  scheduledAt: IsoDateTimeSchema.optional(),
  reviewedAt: IsoDateTimeSchema.optional(),
  nextReviewAt: IsoDateTimeSchema.optional(),
  author: z.string().min(1).optional(),
  reviewer: z.string().min(1).optional(),
  researchStatus: z
    .enum(["none", "in-progress", "complete", "stale"])
    .optional(),
  seoStatus: z.enum(["none", "draft", "optimized", "needs-refresh"]).optional(),
});

export type ContentMetadata = z.infer<typeof ContentMetadataSchema>;

/**
 * Page-level SEO fields. Indexability is explicit — never inferred from status alone
 * without also checking publish lifecycle.
 */
export const SeoFieldsSchema = z.object({
  title: z.string().min(1).max(70).optional(),
  description: z.string().min(1).max(320).optional(),
  canonicalPath: z.string().startsWith("/").optional(),
  /** Explicit allowlist for indexing. Default false until content is ready. */
  indexable: z.boolean().default(false),
  nofollow: z.boolean().optional(),
});

export type SeoFields = z.infer<typeof SeoFieldsSchema>;

export const EntityIdSchema = z.string().min(1);
export const EntityRefSchema = SlugSchema;
