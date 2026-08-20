import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import { PublishStatusSchema } from "./content-metadata";

/**
 * Content type for registry / content IDs.
 * Comparison pages use the `compare` segment in ContentId strings
 * (e.g. content:compare:freshsales-vs-pipedrive) — see buildContentId.
 */
export const ContentTypeSchema = z.enum([
  "software",
  "category",
  "comparison",
  "alternatives",
  "best",
  "pricing",
  "guide",
  "industry",
  "use-case",
  "tool",
]);

export type ContentType = z.infer<typeof ContentTypeSchema>;

/** URL / ContentId path segment for each ContentType. */
export const CONTENT_TYPE_ID_SEGMENT: Record<ContentType, string> = {
  software: "software",
  category: "category",
  comparison: "compare",
  alternatives: "alternatives",
  best: "best",
  pricing: "pricing",
  guide: "guide",
  industry: "industry",
  "use-case": "use-case",
  tool: "tool",
};

const ID_SEGMENT_TO_CONTENT_TYPE: Record<string, ContentType> = {
  software: "software",
  category: "category",
  compare: "comparison",
  comparison: "comparison",
  alternatives: "alternatives",
  best: "best",
  pricing: "pricing",
  guide: "guide",
  industry: "industry",
  "use-case": "use-case",
  tool: "tool",
};

const CONTENT_ID_PATTERN =
  /^content:(software|category|compare|comparison|alternatives|best|pricing|guide|industry|use-case|tool):([a-z0-9]+(?:-[a-z0-9]+)*)$/;

/**
 * Branded content id: `content:{type-segment}:{slug}`
 * Examples: content:software:pipedrive, content:compare:freshsales-vs-pipedrive
 */
export const ContentIdSchema = z
  .string()
  .regex(
    CONTENT_ID_PATTERN,
    "ContentId must be content:{type}:{slug} (e.g. content:software:pipedrive)",
  )
  .brand<"ContentId">();

export type ContentId = z.infer<typeof ContentIdSchema>;

export function buildContentId(type: ContentType, slug: string): ContentId {
  const parsedSlug = SlugSchema.parse(slug);
  const segment = CONTENT_TYPE_ID_SEGMENT[type];
  return ContentIdSchema.parse(`content:${segment}:${parsedSlug}`);
}

export function parseContentId(id: string): {
  type: ContentType;
  slug: string;
  contentId: ContentId;
} {
  const contentId = ContentIdSchema.parse(id);
  const match = CONTENT_ID_PATTERN.exec(contentId);
  if (!match) {
    throw new Error(`Invalid ContentId: ${id}`);
  }
  const segment = match[1];
  const slug = match[2];
  const type = ID_SEGMENT_TO_CONTENT_TYPE[segment];
  if (!type) {
    throw new Error(`Unknown ContentId type segment: ${segment}`);
  }
  return { type, slug, contentId };
}

/** Safe filesystem token: replace `:` with `__`. */
export function contentIdToFileToken(contentId: ContentId | string): string {
  return String(contentId).replace(/:/g, "__");
}

export function fileTokenToContentId(token: string): ContentId {
  return ContentIdSchema.parse(token.replace(/__/g, ":"));
}

/**
 * Separate from PublishStatus — tracks freshness / refresh ops.
 */
export const RefreshStatusSchema = z.enum([
  "current",
  "refresh-recommended",
  "refresh-required",
  "refresh-in-progress",
  "review-required",
]);

export type RefreshStatus = z.infer<typeof RefreshStatusSchema>;

export const LifecycleTransitionSchema = z.object({
  from: PublishStatusSchema,
  to: PublishStatusSchema,
  at: IsoDateTimeSchema,
  actor: z.string().min(1).optional(),
  reason: z.string().min(1).optional(),
});

export type LifecycleTransition = z.infer<typeof LifecycleTransitionSchema>;

export const ChangeEventDomainSchema = z.enum([
  "pricing",
  "features",
  "editorial",
  "taxonomy",
  "affiliate",
  "identity",
  "availability",
]);

export type ChangeEventDomain = z.infer<typeof ChangeEventDomainSchema>;

export const ChangeEventSchema = z.object({
  id: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  domain: ChangeEventDomainSchema,
  changeType: z.string().min(1),
  detectedAt: IsoDateTimeSchema,
  source: z.string().min(1),
  severity: z.enum(["critical", "high", "medium", "low"]).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ChangeEvent = z.infer<typeof ChangeEventSchema>;

export const ContentVersionStatusSchema = z.enum([
  "draft",
  "approved",
  "published",
  "superseded",
]);

export type ContentVersionStatus = z.infer<typeof ContentVersionStatusSchema>;

export const ContentVersionSchema = z.object({
  contentId: ContentIdSchema,
  version: z.number().int().positive(),
  status: ContentVersionStatusSchema,
  createdAt: IsoDateTimeSchema,
  approvedAt: IsoDateTimeSchema.optional(),
  publishedAt: IsoDateTimeSchema.optional(),
  approvedBy: z.string().min(1).optional(),
  methodologyVersion: z.string().min(1).optional(),
  factRefs: z.array(z.string().min(1)).optional(),
  generator: z.string().min(1).optional(),
  /** Path to draft/json body — never overwrite a published body's file. */
  bodyRef: z.string().min(1).optional(),
  previousVersion: z.number().int().positive().optional(),
  summary: z.record(z.string(), z.unknown()).optional(),
});

export type ContentVersion = z.infer<typeof ContentVersionSchema>;

export const PublishJobTypeSchema = z.enum([
  "scheduled-publish",
  "content-refresh",
  "research-refresh",
  "validation",
  "dependency-check",
]);

export type PublishJobType = z.infer<typeof PublishJobTypeSchema>;

export const PublishJobStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
  "skipped",
]);

export type PublishJobStatus = z.infer<typeof PublishJobStatusSchema>;

export const PublishJobSchema = z.object({
  id: z.string().min(1),
  type: PublishJobTypeSchema,
  target: ContentIdSchema,
  status: PublishJobStatusSchema,
  createdAt: IsoDateTimeSchema,
  startedAt: IsoDateTimeSchema.optional(),
  completedAt: IsoDateTimeSchema.optional(),
  result: z.record(z.string(), z.unknown()).optional(),
  errorCode: z.string().min(1).optional(),
  errorMessage: z.string().min(1).optional(),
  attempt: z.number().int().nonnegative().optional(),
  targetVersion: z.number().int().positive().optional(),
});

export type PublishJob = z.infer<typeof PublishJobSchema>;

export const RefreshPrioritySchema = z.enum([
  "critical",
  "high",
  "normal",
  "low",
]);

export type RefreshPriority = z.infer<typeof RefreshPrioritySchema>;

export const RefreshCandidateSchema = z.object({
  contentId: ContentIdSchema,
  priority: RefreshPrioritySchema,
  refreshStatus: RefreshStatusSchema,
  reasons: z.array(z.string().min(1)),
  changeEventIds: z.array(z.string().min(1)),
  affectedDomains: z.array(ChangeEventDomainSchema),
});

export type RefreshCandidate = z.infer<typeof RefreshCandidateSchema>;

export const ContentRegistryEntrySchema = z.object({
  contentId: ContentIdSchema,
  type: ContentTypeSchema,
  slug: SlugSchema,
  path: z.string().startsWith("/"),
  title: z.string().min(1),
  metadata: z.object({
    status: PublishStatusSchema,
    publishedAt: IsoDateTimeSchema.optional(),
    scheduledAt: IsoDateTimeSchema.optional(),
    updatedAt: IsoDateTimeSchema.optional(),
    nextReviewAt: IsoDateTimeSchema.optional(),
    researchStatus: z
      .enum(["none", "in-progress", "complete", "stale"])
      .optional(),
  }),
  seoIndexable: z.boolean(),
  refreshStatus: RefreshStatusSchema.optional(),
  commercialPriority: z.enum(["critical", "high", "normal", "low"]).optional(),
  firstPublishedAt: IsoDateTimeSchema.optional(),
  lastPublishedAt: IsoDateTimeSchema.optional(),
  lastUpdatedAt: IsoDateTimeSchema.optional(),
  nextReviewAt: IsoDateTimeSchema.optional(),
  liveVersion: z.number().int().positive().optional(),
  draftVersion: z.number().int().positive().optional(),
});

export type ContentRegistryEntry = z.infer<typeof ContentRegistryEntrySchema>;

export const AuditEventSchema = z.object({
  id: z.string().min(1),
  contentId: ContentIdSchema,
  action: z.string().min(1),
  at: IsoDateTimeSchema,
  actor: z.string().min(1).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

export const ScheduleRecordSchema = z.object({
  contentId: ContentIdSchema,
  /** ISO UTC with Z suffix. */
  scheduledAt: IsoDateTimeSchema,
  approvedVersion: z.number().int().positive(),
  createdAt: IsoDateTimeSchema,
});

export type ScheduleRecord = z.infer<typeof ScheduleRecordSchema>;

/**
 * Page-type → max age before nextReviewAt should be refreshed.
 */
export const ReviewPolicySchema = z.record(
  z.string(),
  z.object({ maxAgeDays: z.number().positive() }),
);

export type ReviewPolicy = z.infer<typeof ReviewPolicySchema>;

export const DEFAULT_REVIEW_POLICY_DAYS = {
  software: 90,
  pricing: 30,
  comparison: 90,
  best: 60,
  alternatives: 90,
  guide: 180,
  category: 180,
  tool: 180,
  industry: 180,
  "use-case": 180,
} as const satisfies Record<ContentType, number>;
