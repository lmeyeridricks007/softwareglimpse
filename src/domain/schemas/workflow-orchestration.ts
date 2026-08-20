import { z } from "zod";
import { ContentAgentIdSchema } from "./content-agents";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

export const WorkflowTargetTypeSchema = z.enum([
  "software",
  "category",
  "content",
  "refresh",
]);

export type WorkflowTargetType = z.infer<typeof WorkflowTargetTypeSchema>;

export const WorkflowRunStatusSchema = z.enum([
  "created",
  "running",
  "waiting",
  "blocked",
  "review-required",
  "completed",
  "completed-with-warnings",
  "failed",
  "cancelled",
  "superseded",
]);

export type WorkflowRunStatus = z.infer<typeof WorkflowRunStatusSchema>;

export const WorkflowStepStatusSchema = z.enum([
  "pending",
  "ready",
  "running",
  "waiting",
  "blocked",
  "review-required",
  "completed",
  "completed-with-warning",
  "failed",
  "skipped",
  "cancelled",
  "stale",
]);

export type WorkflowStepStatus = z.infer<typeof WorkflowStepStatusSchema>;

export const WorkflowFailurePolicySchema = z.enum([
  "block-workflow",
  "continue",
  "continue-with-warning",
  "retry",
  "manual-review",
]);

export type WorkflowFailurePolicy = z.infer<typeof WorkflowFailurePolicySchema>;

export const ApprovalTypeSchema = z.enum([
  "editorial",
  "relationship",
  "taxonomy",
  "publication",
]);

export type ApprovalType = z.infer<typeof ApprovalTypeSchema>;

export const ApprovalStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;

export const ApprovalPolicySchema = z.object({
  type: ApprovalTypeSchema,
  required: z.boolean().default(true),
});

export type ApprovalPolicy = z.infer<typeof ApprovalPolicySchema>;

export const WorkflowHandlerIdSchema = z.enum([
  "software-onboarding",
  "category-onboarding",
  "research",
  "research-refresh",
  "relationship-resolution",
  "content-plan",
  "agent-run",
  "qa",
  "revision",
  "approval-check",
  "schedule",
  "publish",
  "internal-link",
  "update-recommendation-readiness",
  "content-graph-sync",
  "pre-publish-validation",
  "noop",
]);

export type WorkflowHandlerId = z.infer<typeof WorkflowHandlerIdSchema>;

export const RetryPolicySchema = z.object({
  maxAttempts: z.number().int().positive().default(2),
  backoffMs: z.number().int().nonnegative().default(0),
  retryableErrorCodes: z
    .array(z.string())
    .default(["provider-timeout", "rate-limit", "temporary-fetch", "transient"]),
});

export type RetryPolicy = z.infer<typeof RetryPolicySchema>;

export const WorkflowStepConfigSchema = z.object({
  agentId: ContentAgentIdSchema.optional(),
  targetSlug: z.string().optional(),
  pageType: z.string().optional(),
  approvalType: ApprovalTypeSchema.optional(),
  maxAutomaticRevisions: z.number().int().nonnegative().default(1),
  expandFromContentPlan: z.boolean().default(false),
  /** Dynamic child template — expanded at plan time. */
  expandKind: z
    .enum(["comparisons", "use-cases", "none"])
    .default("none"),
  stopAfterApproval: z.boolean().default(true),
  allowNormalizedFacts: z.boolean().default(false),
  optionalWhenBlocked: z.boolean().default(false),
  /** Fixture/test hooks */
  forceError: z.string().optional(),
  forceTransientFailOnce: z.boolean().default(false),
});

export type WorkflowStepConfig = z.infer<typeof WorkflowStepConfigSchema>;

export const WorkflowStepDefinitionSchema = z.object({
  id: z.string().min(1),
  handler: WorkflowHandlerIdSchema,
  dependsOn: z.array(z.string()).default([]),
  required: z.boolean().default(true),
  approval: ApprovalPolicySchema.optional(),
  failurePolicy: WorkflowFailurePolicySchema.default("block-workflow"),
  retryPolicy: RetryPolicySchema.optional(),
  priority: z.enum(["critical", "high", "normal", "low"]).default("normal"),
  config: WorkflowStepConfigSchema.optional().default(() => ({
    maxAutomaticRevisions: 1,
    expandFromContentPlan: false,
    expandKind: "none" as const,
    stopAfterApproval: true,
    allowNormalizedFacts: false,
    optionalWhenBlocked: false,
    forceTransientFailOnce: false,
  })),
  label: z.string().optional(),
});

export type WorkflowStepDefinition = z.infer<typeof WorkflowStepDefinitionSchema>;

export const WorkflowCompletionPolicySchema = z.object({
  requireAllRequired: z.boolean().default(true),
  allowOptionalBlocked: z.boolean().default(true),
  stopAfterApproval: z.boolean().default(true),
  scheduleAfterApproval: z.boolean().default(false),
  publishAfterApproval: z.boolean().default(false),
});

export type WorkflowCompletionPolicy = z.infer<
  typeof WorkflowCompletionPolicySchema
>;

export const WorkflowDefinitionSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  name: z.string().min(1),
  targetType: WorkflowTargetTypeSchema,
  steps: z.array(WorkflowStepDefinitionSchema).min(1),
  completionPolicy: WorkflowCompletionPolicySchema.optional().default(() => ({
    requireAllRequired: true,
    allowOptionalBlocked: true,
    stopAfterApproval: true,
    scheduleAfterApproval: false,
    publishAfterApproval: false,
  })),
  maxAgentTasksPerRun: z.number().int().positive().default(10),
  maxResearchTasksPerRun: z.number().int().positive().default(5),
  maxEstimatedGenerationCost: z.number().nonnegative().optional(),
});

export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

export const WorkflowStepInputSnapshotSchema = z.object({
  researchFactIds: z.array(z.string()).default([]),
  methodologySlug: z.string().optional(),
  methodologyVersion: z.string().optional(),
  productUpdatedAt: IsoDateTimeSchema.optional(),
  agentVersion: z.string().optional(),
  contextBuiltAt: IsoDateTimeSchema.optional(),
});

export type WorkflowStepInputSnapshot = z.infer<
  typeof WorkflowStepInputSnapshotSchema
>;

export const WorkflowStepRunSchema = z.object({
  id: z.string().min(1),
  definitionStepId: z.string().min(1),
  handler: WorkflowHandlerIdSchema,
  label: z.string().optional(),
  status: WorkflowStepStatusSchema.default("pending"),
  required: z.boolean().default(true),
  failurePolicy: WorkflowFailurePolicySchema.default("block-workflow"),
  attempt: z.number().int().nonnegative().default(0),
  maxAttempts: z.number().int().positive().default(1),
  dependsOn: z.array(z.string()).default([]),
  priority: z.enum(["critical", "high", "normal", "low"]).default("normal"),
  config: WorkflowStepConfigSchema.optional().default(() => ({
    maxAutomaticRevisions: 1,
    expandFromContentPlan: false,
    expandKind: "none" as const,
    stopAfterApproval: true,
    allowNormalizedFacts: false,
    optionalWhenBlocked: false,
    forceTransientFailOnce: false,
  })),
  /** Expanded child identity (e.g. comparison slug). */
  expansionKey: z.string().optional(),
  inputRefs: z.record(z.string(), z.string()).default({}),
  outputRefs: z.record(z.string(), z.string()).default({}),
  inputSnapshot: WorkflowStepInputSnapshotSchema.optional(),
  blockers: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  error: z.string().optional(),
  agentTaskId: z.string().optional(),
  draftId: z.string().optional(),
  approvalId: z.string().optional(),
  startedAt: IsoDateTimeSchema.optional(),
  completedAt: IsoDateTimeSchema.optional(),
  revisionAttempts: z.number().int().nonnegative().default(0),
});

export type WorkflowStepRun = z.infer<typeof WorkflowStepRunSchema>;

export const WorkflowHistoryEntrySchema = z.object({
  at: IsoDateTimeSchema,
  event: z.string().min(1),
  stepId: z.string().optional(),
  message: z.string().min(1),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type WorkflowHistoryEntry = z.infer<typeof WorkflowHistoryEntrySchema>;

export const WorkflowRunSchema = z.object({
  id: z.string().min(1),
  workflowId: z.string().min(1),
  workflowVersion: z.string().min(1),
  name: z.string().min(1),
  targetType: WorkflowTargetTypeSchema,
  targetId: z.string().min(1),
  status: WorkflowRunStatusSchema.default("created"),
  steps: z.array(WorkflowStepRunSchema).default([]),
  history: z.array(WorkflowHistoryEntrySchema).default([]),
  options: z.record(z.string(), z.unknown()).default({}),
  softwareOnboardingRunId: z.string().optional(),
  categoryOnboardingRunId: z.string().optional(),
  supersededBy: z.string().optional(),
  cancelReason: z.string().optional(),
  warnings: z.array(z.string()).default([]),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export type WorkflowRun = z.infer<typeof WorkflowRunSchema>;

export const ApprovalRecordSchema = z.object({
  id: z.string().min(1),
  type: ApprovalTypeSchema,
  targetType: z.string().min(1),
  targetId: z.string().min(1),
  workflowRunId: z.string().optional(),
  stepId: z.string().optional(),
  draftId: z.string().optional(),
  status: ApprovalStatusSchema.default("pending"),
  decidedBy: z.string().optional(),
  decidedAt: IsoDateTimeSchema.optional(),
  notes: z.string().optional(),
  qaStatus: z.string().optional(),
  createdAt: IsoDateTimeSchema,
});

export type ApprovalRecord = z.infer<typeof ApprovalRecordSchema>;

export const SoftwareWorkflowInputSchema = z.object({
  productId: SlugSchema,
  softwareOnboardingRunId: z.string().optional(),
  options: z
    .object({
      generateReview: z.boolean().default(true),
      generatePricing: z.boolean().default(true),
      generateAlternatives: z.boolean().default(true),
      generateComparisons: z.boolean().default(true),
      runInternalLinks: z.boolean().default(true),
      stopAfterApproval: z.boolean().default(true),
      allowNormalizedFacts: z.boolean().default(false),
      dryRun: z.boolean().default(false),
      maxComparisons: z.number().int().positive().default(3),
      skipOnboarding: z.boolean().default(false),
    })
    .optional()
    .default(() => ({
      generateReview: true,
      generatePricing: true,
      generateAlternatives: true,
      generateComparisons: true,
      runInternalLinks: true,
      stopAfterApproval: true,
      allowNormalizedFacts: false,
      dryRun: false,
      maxComparisons: 3,
      skipOnboarding: false,
    })),
});

export type SoftwareWorkflowInput = z.infer<typeof SoftwareWorkflowInputSchema>;

export const CategoryWorkflowInputSchema = z.object({
  categoryId: SlugSchema,
  categoryOnboardingRunId: z.string().optional(),
  options: z
    .object({
      generateHub: z.boolean().default(true),
      generateBest: z.boolean().default(true),
      generateUseCases: z.boolean().default(false),
      stopAfterApproval: z.boolean().default(true),
      dryRun: z.boolean().default(false),
    })
    .optional()
    .default(() => ({
      generateHub: true,
      generateBest: true,
      generateUseCases: false,
      stopAfterApproval: true,
      dryRun: false,
    })),
});

export type CategoryWorkflowInput = z.infer<typeof CategoryWorkflowInputSchema>;

export const SingleContentWorkflowInputSchema = z.object({
  agentId: ContentAgentIdSchema,
  targetSlug: z.string().min(1),
  productIds: z.array(SlugSchema).default([]),
  categoryIds: z.array(SlugSchema).default([]),
  options: z
    .object({
      stopAfterApproval: z.boolean().default(true),
      allowNormalizedFacts: z.boolean().default(false),
      dryRun: z.boolean().default(false),
    })
    .optional()
    .default(() => ({
      stopAfterApproval: true,
      allowNormalizedFacts: false,
      dryRun: false,
    })),
});

export type SingleContentWorkflowInput = z.infer<
  typeof SingleContentWorkflowInputSchema
>;

export const RefreshWorkflowInputSchema = z.object({
  contentId: z.string().min(1),
  productId: SlugSchema.optional(),
  changeEventType: z.string().default("pricing-changed"),
  affectedSections: z.array(z.string()).default(["pricing"]),
  options: z
    .object({
      stopAfterApproval: z.boolean().default(true),
      dryRun: z.boolean().default(false),
    })
    .optional()
    .default(() => ({
      stopAfterApproval: true,
      dryRun: false,
    })),
});

export type RefreshWorkflowInput = z.infer<typeof RefreshWorkflowInputSchema>;
