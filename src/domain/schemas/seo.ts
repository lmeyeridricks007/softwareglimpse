import { z } from "zod";
import { IsoDateSchema, IsoDateTimeSchema, SlugSchema } from "./primitives";
import { ContentIdSchema } from "./publishing-ops";

/** Inclusive ISO date range for Search Console / fixture windows. */
export const DateRangeSchema = z.object({
  startDate: IsoDateSchema,
  endDate: IsoDateSchema,
});

export type DateRange = z.infer<typeof DateRangeSchema>;

export const SearchPerformanceRowSchema = z.object({
  dateRange: DateRangeSchema,
  query: z.string().optional(),
  page: z.string().optional(),
  country: z.string().optional(),
  device: z.string().optional(),
  clicks: z.number().nonnegative(),
  impressions: z.number().nonnegative(),
  ctr: z.number().nonnegative(),
  position: z.number().positive(),
});

export type SearchPerformanceRow = z.infer<typeof SearchPerformanceRowSchema>;

export const SearchSnapshotSourceSchema = z.enum(["gsc", "fixture", "import"]);

export type SearchSnapshotSource = z.infer<typeof SearchSnapshotSourceSchema>;

export const SearchSnapshotMetaSchema = z.object({
  id: z.string().min(1),
  retrievedAt: IsoDateTimeSchema,
  dataThroughDate: IsoDateSchema,
  source: SearchSnapshotSourceSchema,
  rangeLabel: z.string().min(1),
});

export type SearchSnapshotMeta = z.infer<typeof SearchSnapshotMetaSchema>;

export const UrlResolutionStatusSchema = z.enum([
  "resolved",
  "legacy",
  "redirected",
  "unknown",
  "noncanonical",
]);

export type UrlResolutionStatus = z.infer<typeof UrlResolutionStatusSchema>;

export const UrlResolutionSchema = z.object({
  inputUrl: z.string().min(1),
  normalizedPath: z.string().min(1),
  contentId: ContentIdSchema.optional(),
  status: UrlResolutionStatusSchema,
  notes: z.string().optional(),
});

export type UrlResolution = z.infer<typeof UrlResolutionSchema>;

export const QueryIntentSchema = z.enum([
  "brand",
  "review",
  "pricing",
  "comparison",
  "alternatives",
  "best",
  "category",
  "problem",
  "informational",
  "transactional",
  "tool",
  "unknown",
]);

export type QueryIntent = z.infer<typeof QueryIntentSchema>;

export const ClassifiedQuerySchema = z.object({
  raw: z.string(),
  normalized: z.string(),
  intent: QueryIntentSchema,
  productSlugs: z.array(SlugSchema).default([]),
  categorySlugs: z.array(SlugSchema).default([]),
  audienceSlugs: z.array(SlugSchema).default([]),
  businessTypeSlugs: z.array(SlugSchema).default([]),
});

export type ClassifiedQuery = z.infer<typeof ClassifiedQuerySchema>;

export const SeoOpportunityTypeSchema = z.enum([
  "striking-distance",
  "high-impression-low-ctr",
  "high-impression-no-click",
  "query-page-mismatch",
  "missing-content",
  "cannibalization",
  "content-decay",
  "growth",
  "internal-link-opportunity",
  "comparison-opportunity",
  "alternatives-opportunity",
  "pricing-opportunity",
  "use-case-opportunity",
]);

export type SeoOpportunityType = z.infer<typeof SeoOpportunityTypeSchema>;

export const SeoOpportunityStatusSchema = z.enum([
  "detected",
  "reviewed",
  "accepted",
  "dismissed",
  "queued",
  "implemented",
  "measuring",
  "closed",
]);

export type SeoOpportunityStatus = z.infer<typeof SeoOpportunityStatusSchema>;

export const SeoEvidenceSchema = z.object({
  impressions: z.number().nonnegative().optional(),
  clicks: z.number().nonnegative().optional(),
  ctr: z.number().nonnegative().optional(),
  position: z.number().positive().optional(),
  priorImpressions: z.number().nonnegative().optional(),
  priorClicks: z.number().nonnegative().optional(),
  priorPosition: z.number().positive().optional(),
  pages: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
});

export type SeoEvidence = z.infer<typeof SeoEvidenceSchema>;

export const SeoActionTypeSchema = z.enum([
  "refresh-content",
  "create-content",
  "improve-title",
  "improve-meta",
  "add-internal-link",
  "strengthen-section",
  "review-canonical",
  "investigate-cannibalization",
  "merge-content",
  "update-structured-data",
  "queue-research",
]);

export type SeoActionType = z.infer<typeof SeoActionTypeSchema>;

export const SeoActionSchema = z.object({
  type: SeoActionTypeSchema,
  description: z.string().min(1),
  effort: z.enum(["small", "medium", "large"]),
  risk: z.enum(["low", "medium", "high"]),
});

export type SeoAction = z.infer<typeof SeoActionSchema>;

export const SeoOpportunitySchema = z.object({
  id: z.string().min(1),
  type: SeoOpportunityTypeSchema,
  status: SeoOpportunityStatusSchema,
  contentId: ContentIdSchema.optional(),
  query: z.string().optional(),
  queryCluster: z.string().optional(),
  productSlugs: z.array(SlugSchema).default([]),
  categorySlugs: z.array(SlugSchema).default([]),
  evidence: SeoEvidenceSchema,
  priorityScore: z.number().min(0).max(100),
  confidence: z.enum(["low", "medium", "high"]),
  scoreBreakdown: z.record(z.string(), z.number()),
  reasons: z.array(z.string()).default([]),
  recommendedActions: z.array(SeoActionSchema).default([]),
  prerequisites: z.array(z.string()).default([]),
  detectedAt: IsoDateTimeSchema,
  lastDetectedAt: IsoDateTimeSchema.optional(),
  dismissedReason: z.string().optional(),
});

export type SeoOpportunity = z.infer<typeof SeoOpportunitySchema>;

/** Measurement stub — baseline vs after windows for an accepted opportunity. */
export const SeoExperimentSchema = z.object({
  id: z.string().min(1),
  opportunityId: z.string().min(1),
  contentId: ContentIdSchema.optional(),
  hypothesis: z.string().min(1),
  baselineRange: DateRangeSchema,
  afterRange: DateRangeSchema.optional(),
  status: z.enum(["planned", "running", "completed", "abandoned"]),
  createdAt: IsoDateTimeSchema,
  notes: z.array(z.string()).default([]),
});

export type SeoExperiment = z.infer<typeof SeoExperimentSchema>;

export const SeoActionOutcomeSchema = z.object({
  experimentId: z.string().min(1),
  opportunityId: z.string().min(1),
  result: z.enum(["positive", "neutral", "negative", "insufficient-data"]),
  clicksDeltaPct: z.number().optional(),
  impressionsDeltaPct: z.number().optional(),
  ctrDeltaPct: z.number().optional(),
  positionDelta: z.number().optional(),
  evaluatedAt: IsoDateTimeSchema,
  notes: z.array(z.string()).default([]),
});

export type SeoActionOutcome = z.infer<typeof SeoActionOutcomeSchema>;

/**
 * SEO → editorial queue handoff.
 * Never auto-publishes; editorial/publishing own the next steps.
 */
export const ContentQueueItemSchema = z.object({
  id: z.string().min(1),
  opportunityId: z.string().min(1),
  status: z.enum(["queued", "in-progress", "done", "cancelled"]),
  suggestedPageType: z
    .enum([
      "software-review",
      "comparison",
      "alternatives",
      "best",
      "pricing",
      "guide",
      "other",
    ])
    .optional(),
  productSlugs: z.array(SlugSchema).default([]),
  categorySlugs: z.array(SlugSchema).default([]),
  primaryKeyword: z.string().optional(),
  briefHint: z.string().optional(),
  queuedAt: IsoDateTimeSchema,
  notes: z.array(z.string()).default([]),
});

export type ContentQueueItem = z.infer<typeof ContentQueueItemSchema>;

export const SearchSnapshotSchema = z.object({
  meta: SearchSnapshotMetaSchema,
  rows: z.array(SearchPerformanceRowSchema),
  /** Always true for repo fixtures — never claim live SoftwareGlimpse GSC data. */
  synthetic: z.boolean().optional(),
  label: z.string().optional(),
});

export type SearchSnapshot = z.infer<typeof SearchSnapshotSchema>;
