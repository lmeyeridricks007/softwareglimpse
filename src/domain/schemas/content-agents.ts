import { z } from "zod";
import { AgentTypeSchema } from "./onboarding";
import { EditorialBriefSchema, EditorialPageTypeSchema } from "./editorial-brief";
import { EditorialDraftSchema } from "./editorial-draft";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Stable agent registry IDs — specialized content agents only.
 * `research-agent` remains an onboarding handoff type, not a content agent.
 */
export const ContentAgentIdSchema = z.enum([
  "software-review-agent",
  "pricing-page-agent",
  "comparison-agent",
  "alternatives-agent",
  "best-software-agent",
  "category-hub-agent",
  "use-case-page-agent",
  "guide-agent",
  "internal-link-agent",
  "refresh-agent",
  "qa-agent",
  "category-knowledge-planner-agent",
  "product-knowledge-planner-agent",
  "supporting-content-planner-agent",
]);

export type ContentAgentId = z.infer<typeof ContentAgentIdSchema>;

/** Map onboarding handoff agent types → content agent IDs. */
export function contentAgentIdFromHandoff(
  agentType: z.infer<typeof AgentTypeSchema>,
): ContentAgentId | null {
  switch (agentType) {
    case "software-review-agent":
    case "pricing-page-agent":
    case "comparison-agent":
    case "alternatives-agent":
    case "category-hub-agent":
    case "guide-agent":
    case "internal-link-agent":
    case "refresh-agent":
    case "qa-agent":
    case "category-knowledge-planner-agent":
    case "product-knowledge-planner-agent":
    case "supporting-content-planner-agent":
      return agentType;
    case "best-page-agent":
      return "best-software-agent";
    case "best-software-agent":
      return "best-software-agent";
    case "use-case-agent":
    case "use-case-page-agent":
      return "use-case-page-agent";
    case "research-agent":
      return null;
    default:
      return null;
  }
}

export const AgentReadinessStatusSchema = z.enum([
  "READY",
  "BLOCKED",
  "REVIEW_REQUIRED",
]);

export type AgentReadinessStatus = z.infer<typeof AgentReadinessStatusSchema>;

export const AgentReadinessReasonSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  critical: z.boolean().default(true),
});

export const AgentReadinessSchema = z.object({
  status: AgentReadinessStatusSchema,
  reasons: z.array(AgentReadinessReasonSchema).default([]),
  missingDependencies: z.array(z.string()).default([]),
});

export type AgentReadiness = z.infer<typeof AgentReadinessSchema>;

export const AgentExecutionModeSchema = z.enum([
  "CREATE",
  "REFRESH",
  "REWRITE",
  "MIGRATION",
]);

export type AgentExecutionMode = z.infer<typeof AgentExecutionModeSchema>;

export const SearchIntentKindSchema = z.enum([
  "evaluate-one-product",
  "decide-between-products",
  "replace-product",
  "shortlist-products",
  "understand-cost",
  "discover-category",
  "learn-solve",
  "link-graph",
  "refresh-existing",
  "quality-assurance",
  "plan-category-knowledge",
  "plan-product-knowledge",
  "plan-supporting-content",
]);

export type SearchIntentKind = z.infer<typeof SearchIntentKindSchema>;

export const CtaIntentSchema = z.object({
  type: z.enum([
    "visit-product",
    "open-pricing",
    "open-calculator",
    "open-finder",
    "open-comparison",
    "open-alternatives",
    "open-best",
    "open-category",
    "open-guide",
    /** Semantic commercial intents — resolved centrally; never include raw URLs */
    "VISIT",
    "START_TRIAL",
    "VIEW_PRICING",
    "GET_DEAL",
    "REQUEST_DEMO",
    "SIGN_UP",
    "LEARN_MORE",
  ]),
  productId: SlugSchema.optional(),
  targetContentId: z.string().optional(),
  placement: z.enum(["header", "mid", "final"]).default("mid"),
  labelHint: z.string().optional(),
});

export type CtaIntent = z.infer<typeof CtaIntentSchema>;

export const LinkCandidateSchema = z.object({
  sourceSection: z.string().min(1),
  targetContentId: z.string().min(1),
  relationship: z.string().min(1),
  anchorConcept: z.string().min(1),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
  reason: z.string().min(1),
  publicationStatus: z.string().optional(),
});

export type LinkCandidate = z.infer<typeof LinkCandidateSchema>;

export const AgentContextSnapshotSchema = z.object({
  productUpdatedAt: IsoDateTimeSchema.optional(),
  researchSnapshotIds: z.array(z.string()).default([]),
  factIds: z.array(z.string()).default([]),
  methodologySlug: z.string().optional(),
  methodologyVersion: z.string().optional(),
  rankingVersion: z.string().optional(),
  pricingFreshnessAt: IsoDateTimeSchema.optional(),
  builtAt: IsoDateTimeSchema,
});

export type AgentContextSnapshot = z.infer<typeof AgentContextSnapshotSchema>;

/**
 * Constrained generation context — never the full repository.
 * Affiliate commission / payout fields are intentionally absent.
 */
export const AgentContextSchema = z.object({
  agentId: ContentAgentIdSchema,
  mode: AgentExecutionModeSchema.default("CREATE"),
  primaryIntent: SearchIntentKindSchema,
  productSlugs: z.array(SlugSchema).default([]),
  categorySlugs: z.array(SlugSchema).default([]),
  targetSlug: SlugSchema.optional(),
  contentId: z.string().optional(),
  /** Approved/verified factual claims only for publication drafts. */
  facts: z
    .array(
      z.object({
        id: z.string().min(1),
        domain: z.string().min(1),
        claim: z.string().min(1),
        value: z.unknown().optional(),
        sourceIds: z.array(z.string()).default([]),
        status: z.string().optional(),
      }),
    )
    .default([]),
  editorialAssessments: z
    .array(
      z.object({
        productSlug: SlugSchema,
        criterionSlug: z.string().min(1),
        score: z.number(),
        rationale: z.string().min(1),
        supportingFactIds: z.array(z.string()).default([]),
        confidence: z.string().optional(),
      }),
    )
    .default([]),
  methodology: z
    .object({
      slug: z.string().min(1),
      version: z.string().min(1),
      name: z.string().optional(),
    })
    .optional(),
  pricingSummary: z
    .object({
      verified: z.boolean(),
      criticallyStale: z.boolean().default(false),
      modelSupported: z.boolean().default(true),
      planCount: z.number().int().nonnegative().default(0),
      engineExamples: z
        .array(
          z.object({
            label: z.string().min(1),
            amount: z.union([z.string(), z.number()]),
            factId: z.string().optional(),
          }),
        )
        .default([]),
      caveats: z.array(z.string()).default([]),
    })
    .optional(),
  /** Approved alternative/comparable relationships only. */
  relationships: z
    .array(
      z.object({
        type: z.string().min(1),
        sourceSlug: SlugSchema,
        targetSlug: SlugSchema,
        status: z.string().optional(),
        reason: z.string().optional(),
      }),
    )
    .default([]),
  /** Approved ranking inputs — agents must not reorder. */
  approvedRanking: z
    .array(
      z.object({
        productSlug: SlugSchema,
        rank: z.number().int().positive(),
        label: z.string().optional(),
        rationale: z.string().min(1),
        approved: z.boolean(),
      }),
    )
    .default([]),
  seo: z
    .object({
      primaryIntent: z.string().optional(),
      targetQueries: z.array(z.string()).default([]),
      opportunityIds: z.array(z.string()).default([]),
    })
    .optional(),
  existingPublished: z
    .object({
      contentId: z.string().min(1),
      version: z.number().int().positive(),
      sections: z
        .array(
          z.object({
            id: z.string().min(1),
            heading: z.string().min(1),
            body: z.string().min(1),
          }),
        )
        .default([]),
    })
    .optional(),
  changeEvents: z
    .array(
      z.object({
        type: z.string().min(1),
        affectedSections: z.array(z.string()).default([]),
        summary: z.string().min(1),
      }),
    )
    .default([]),
  internalLinkOpportunities: z.array(LinkCandidateSchema).default([]),
  ctaBudget: z
    .object({
      header: z.number().int().nonnegative(),
      mid: z.number().int().nonnegative(),
      final: z.number().int().nonnegative(),
    })
    .optional(),
  prohibitedClaims: z.array(z.string()).default([]),
  handsOnTestingAllowed: z.boolean().default(false),
  legacyContent: z.string().optional(),
  migrationAction: z.string().optional(),
  /** Opaque product display names — no affiliate economics. */
  productLabels: z.record(z.string(), z.string()).default({}),
  snapshot: AgentContextSnapshotSchema,
  notes: z.array(z.string()).default([]),
});

export type AgentContext = z.infer<typeof AgentContextSchema>;

export const AgentBriefSchema = z.object({
  id: z.string().min(1),
  agentId: ContentAgentIdSchema,
  agentVersion: z.string().min(1),
  methodologyVersion: z.string().optional(),
  pageType: EditorialPageTypeSchema,
  mode: AgentExecutionModeSchema,
  primaryIntent: SearchIntentKindSchema,
  targetSlug: SlugSchema,
  requiredSections: z.array(z.string()).default([]),
  editorialBrief: EditorialBriefSchema,
  ctaIntents: z.array(CtaIntentSchema).default([]),
  promptTemplateId: z.string().optional(),
  promptTemplateVersion: z.string().optional(),
  contextSnapshot: AgentContextSnapshotSchema,
  createdAt: IsoDateTimeSchema,
});

export type AgentBrief = z.infer<typeof AgentBriefSchema>;

export const AgentDraftExtensionSchema = z.object({
  agentId: ContentAgentIdSchema,
  agentVersion: z.string().min(1),
  methodologyVersion: z.string().optional(),
  generationProvider: z.string().min(1),
  generationProviderVersion: z.string().optional(),
  generatedAt: IsoDateTimeSchema,
  mode: AgentExecutionModeSchema,
  ctaIntents: z.array(CtaIntentSchema).default([]),
  internalLinkCandidates: z.array(LinkCandidateSchema).default([]),
  contextSnapshot: AgentContextSnapshotSchema,
  /** Refresh-only metadata */
  sectionsChanged: z.array(z.string()).default([]),
  changeReasons: z
    .array(
      z.object({
        section: z.string().min(1),
        reason: z.string().min(1),
      }),
    )
    .default([]),
  draftStale: z.boolean().default(false),
  staleReasons: z.array(z.string()).default([]),
});

export type AgentDraftExtension = z.infer<typeof AgentDraftExtensionSchema>;

export const AgentDraftBundleSchema = z.object({
  draft: EditorialDraftSchema,
  extension: AgentDraftExtensionSchema,
});

export type AgentDraftBundle = z.infer<typeof AgentDraftBundleSchema>;

export const QaIssueTypeSchema = z.enum([
  "UNSUPPORTED_FACT",
  "UNVERIFIED_NUMBER",
  "MISSING_RATIONALE",
  "FAKE_TESTING_CLAIM",
  "RANKING_CHANGED",
  "AFFILIATE_BIAS",
  "RAW_AFFILIATE_URL",
  "MISSING_REQUIRED_SECTION",
  "BROKEN_INTERNAL_LINK",
  "STALE_CRITICAL_FACT",
  "THIN_CONTENT",
  "DUPLICATE_INTENT",
  "SEO_METADATA_INVALID",
  "SCHEMA_INCOMPLETE",
  "PROHIBITED_CLAIM",
  "METHODOLOGY_MISMATCH",
  "CTA_BUDGET_EXCEEDED",
]);

export type QaIssueType = z.infer<typeof QaIssueTypeSchema>;

export const QaIssueSchema = z.object({
  type: QaIssueTypeSchema,
  severity: z.enum(["blocker", "warning", "suggestion"]),
  message: z.string().min(1),
  section: z.string().optional(),
  path: z.string().optional(),
});

export type QaIssue = z.infer<typeof QaIssueSchema>;

export const QaResultSchema = z.object({
  status: z.enum(["pass", "pass-with-warnings", "fail"]),
  blockers: z.array(QaIssueSchema).default([]),
  warnings: z.array(QaIssueSchema).default([]),
  suggestions: z.array(QaIssueSchema).default([]),
  checkedAt: IsoDateTimeSchema,
});

export type QaResult = z.infer<typeof QaResultSchema>;

export const AgentValidationResultSchema = z.object({
  ok: z.boolean(),
  errors: z.array(z.string()).default([]),
});

export type AgentValidationResult = z.infer<typeof AgentValidationResultSchema>;

export const GenerationCostMetadataSchema = z.object({
  provider: z.string().min(1),
  model: z.string().optional(),
  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),
  estimatedCostUsd: z.number().nonnegative().optional(),
});

export type GenerationCostMetadata = z.infer<
  typeof GenerationCostMetadataSchema
>;

export const AgentExecutionStatusSchema = z.enum([
  "started",
  "completed",
  "failed",
  "blocked",
  "qa-failed",
  "stale",
]);

export const AgentExecutionResultSchema = z.object({
  id: z.string().min(1),
  taskId: z.string().optional(),
  agentId: ContentAgentIdSchema,
  agentVersion: z.string().min(1),
  status: AgentExecutionStatusSchema,
  mode: AgentExecutionModeSchema,
  targetSlug: SlugSchema,
  draftId: z.string().optional(),
  briefId: z.string().optional(),
  validation: AgentValidationResultSchema.optional(),
  qa: QaResultSchema.optional(),
  errors: z.array(z.string()).default([]),
  cost: GenerationCostMetadataSchema.optional(),
  contextSnapshot: AgentContextSnapshotSchema.optional(),
  dryRun: z.boolean().default(false),
  startedAt: IsoDateTimeSchema,
  completedAt: IsoDateTimeSchema.optional(),
});

export type AgentExecutionResult = z.infer<typeof AgentExecutionResultSchema>;

export const AgentRevisionRecordSchema = z.object({
  id: z.string().min(1),
  originalDraftId: z.string().min(1),
  revisedDraftId: z.string().min(1),
  issues: z.array(QaIssueSchema).default([]),
  instructions: z.array(z.string()).default([]),
  sectionsTargeted: z.array(z.string()).default([]),
  createdAt: IsoDateTimeSchema,
});

export type AgentRevisionRecord = z.infer<typeof AgentRevisionRecordSchema>;

export const AgentRunTaskSchema = z.object({
  id: z.string().min(1),
  agentId: ContentAgentIdSchema,
  targetContentId: z.string().optional(),
  productIds: z.array(SlugSchema).default([]),
  categoryIds: z.array(SlugSchema).default([]),
  targetSlug: SlugSchema.optional(),
  dependencies: z.array(z.string()).default([]),
  status: z.enum(["READY", "BLOCKED", "WAITING", "COMPLETE"]).default("READY"),
  statusReason: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  contextRef: z.string().optional(),
  createdBy: z.string().default("system"),
  mode: AgentExecutionModeSchema.default("CREATE"),
  briefInput: z.record(z.string(), z.unknown()).default({}),
});

export type AgentRunTask = z.infer<typeof AgentRunTaskSchema>;
