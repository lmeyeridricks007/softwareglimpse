import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Generic implementation-plan model — category-agnostic core with CRM usage.
 * Phase/task existence must come from deterministic rules, not LLM invention.
 * Affiliate status must never appear in this model.
 * Timeline durations are planning assumptions derived from scope — never facts.
 */

export const IMPLEMENTATION_PLAN_VERSION = 1 as const;

export const ImplementationTypeSchema = z.enum([
  "new-from-scratch",
  "replace-existing",
  "consolidate-multiple",
  "from-spreadsheets",
  "major-reconfiguration",
  "expansion",
]);
export type ImplementationType = z.infer<typeof ImplementationTypeSchema>;

export const LaunchScopeSchema = z.enum([
  "core-only",
  "most-requirements",
  "full-target-state",
]);
export type LaunchScope = z.infer<typeof LaunchScopeSchema>;

export const ImplementationComplexityLevelSchema = z.enum([
  "low",
  "moderate",
  "high",
  "very-high",
]);
export type ImplementationComplexityLevel = z.infer<
  typeof ImplementationComplexityLevelSchema
>;

export const PlanPhaseStatusSchema = z.enum([
  "not-started",
  "in-progress",
  "complete",
  "not-applicable",
]);
export type PlanPhaseStatus = z.infer<typeof PlanPhaseStatusSchema>;

export const PlanTaskStatusSchema = z.enum([
  "not-started",
  "in-progress",
  "blocked",
  "complete",
  "not-applicable",
]);
export type PlanTaskStatus = z.infer<typeof PlanTaskStatusSchema>;

export const PlanTaskPrioritySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
]);
export type PlanTaskPriority = z.infer<typeof PlanTaskPrioritySchema>;

export const PlanTaskSourceTypeSchema = z.enum([
  "generic",
  "requirement-derived",
  "feature-derived",
  "integration-derived",
  "migration-derived",
  "security-derived",
  "product-specific",
  "user-added",
]);
export type PlanTaskSourceType = z.infer<typeof PlanTaskSourceTypeSchema>;

export const RiskSeveritySchema = z.enum(["low", "medium", "high", "blocker"]);
export type RiskSeverity = z.infer<typeof RiskSeveritySchema>;

export const RiskStatusSchema = z.enum([
  "open",
  "mitigating",
  "accepted",
  "resolved",
]);
export type RiskStatus = z.infer<typeof RiskStatusSchema>;

export const ReadinessGapKindSchema = z.enum([
  "definition",
  "owner",
  "decision",
  "verification",
]);
export type ReadinessGapKind = z.infer<typeof ReadinessGapKindSchema>;

export const UatTestStatusSchema = z.enum([
  "not-tested",
  "passed",
  "partial",
  "failed",
  "blocked",
]);
export type UatTestStatus = z.infer<typeof UatTestStatusSchema>;

export const TrainingApproachSchema = z.enum([
  "self-service",
  "internal-trainer",
  "vendor",
  "partner",
  "mixed",
  "undecided",
]);
export type TrainingApproach = z.infer<typeof TrainingApproachSchema>;

export const MigrationSourceSchema = z.enum([
  "spreadsheet",
  "existing-crm",
  "multiple-systems",
  "other",
  "none",
  "unknown",
]);
export type MigrationSource = z.infer<typeof MigrationSourceSchema>;

export const ChecklistItemStatusSchema = z.enum([
  "pending",
  "done",
  "not-applicable",
]);
export type ChecklistItemStatus = z.infer<typeof ChecklistItemStatusSchema>;

export const PlanPhaseIdSchema = z.enum([
  "discovery",
  "requirements-validation",
  "process-design",
  "data-model",
  "configuration",
  "data-migration",
  "integrations",
  "automation-reporting",
  "security",
  "testing-uat",
  "training-change",
  "go-live",
  "stabilization",
]);
export type PlanPhaseId = z.infer<typeof PlanPhaseIdSchema>;

export const ProjectRoleIdSchema = z.enum([
  "executive-sponsor",
  "project-manager",
  "crm-owner",
  "sales-operations",
  "it-integrations",
  "data-owner",
  "security",
  "business-representative",
  "trainer-change",
  "vendor-partner",
]);
export type ProjectRoleId = z.infer<typeof ProjectRoleIdSchema>;

export const AdoptionMetricIdSchema = z.enum([
  "active-users",
  "login-frequency",
  "records-updated",
  "required-field-completion",
  "activities-logged",
  "pipeline-hygiene",
  "workflow-completion",
  "manager-dashboard-usage",
]);
export type AdoptionMetricId = z.infer<typeof AdoptionMetricIdSchema>;

export const PlanPhaseSchema = z.object({
  id: PlanPhaseIdSchema,
  name: z.string().min(1),
  order: z.number().int().min(0),
  /** Planning duration in weeks — assumption, not a vendor claim. */
  durationWeeks: z.number().min(0.25).max(26),
  startWeek: z.number().int().min(1).optional(),
  endWeek: z.number().int().min(1).optional(),
  status: PlanPhaseStatusSchema.default("not-started"),
  included: z.boolean().default(true),
  rationale: z.string().max(500).optional(),
});
export type PlanPhase = z.infer<typeof PlanPhaseSchema>;

export const PlanTaskSchema = z.object({
  id: z.string().min(1),
  phaseId: PlanPhaseIdSchema,
  title: z.string().min(1),
  description: z.string().max(1000).optional(),
  reason: z.string().max(500).optional(),
  sourceType: PlanTaskSourceTypeSchema,
  sourceRefs: z.array(z.string()).default([]),
  ownerRole: ProjectRoleIdSchema.optional(),
  /** Optional duration hint in days — planning assumption. */
  durationDays: z.number().min(0.5).max(60).optional(),
  dependencyIds: z.array(z.string()).default([]),
  priority: PlanTaskPrioritySchema.default("medium"),
  status: PlanTaskStatusSchema.default("not-started"),
  targetDate: z.string().optional(),
  requirementIds: z.array(z.string()).default([]),
  featureIds: z.array(z.string()).default([]),
  integrationIds: z.array(z.string()).default([]),
  evidenceRefs: z.array(z.string()).default([]),
  criticalPath: z.boolean().default(false),
  notes: z.string().max(2000).optional(),
  /** True when user customized a generated task. */
  userEdited: z.boolean().default(false),
});
export type PlanTask = z.infer<typeof PlanTaskSchema>;

export const PlanRiskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  severity: RiskSeveritySchema,
  reason: z.string().min(1),
  recommendedAction: z.string().min(1),
  ownerRole: ProjectRoleIdSchema.optional(),
  status: RiskStatusSchema.default("open"),
  sourceRefs: z.array(z.string()).default([]),
});
export type PlanRisk = z.infer<typeof PlanRiskSchema>;

export const ReadinessGapSchema = z.object({
  id: z.string().min(1),
  kind: ReadinessGapKindSchema,
  title: z.string().min(1),
  detail: z.string().min(1),
  resolved: z.boolean().default(false),
});
export type ReadinessGap = z.infer<typeof ReadinessGapSchema>;

export const ProjectRoleAssignmentSchema = z.object({
  roleId: ProjectRoleIdSchema,
  /** Optional display label / initials — never required PII. */
  label: z.string().max(80).optional(),
  responsibility: z.string().max(300).optional(),
  assigned: z.boolean().default(false),
});
export type ProjectRoleAssignment = z.infer<typeof ProjectRoleAssignmentSchema>;

export const UatChecklistItemSchema = z.object({
  id: z.string().min(1),
  requirementId: z.string().min(1),
  requirementLabel: z.string().min(1),
  scenario: z.string().min(1),
  expectedResult: z.string().min(1),
  ownerRole: ProjectRoleIdSchema.optional(),
  status: UatTestStatusSchema.default("not-tested"),
});
export type UatChecklistItem = z.infer<typeof UatChecklistItemSchema>;

export const GoLiveChecklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: ChecklistItemStatusSchema.default("pending"),
  category: z.enum(["cutover", "validation", "people", "systems"]).default("validation"),
});
export type GoLiveChecklistItem = z.infer<typeof GoLiveChecklistItemSchema>;

export const PlanMilestoneSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  /** Relative week from plan start, or absolute ISO date when set. */
  weekOffset: z.number().int().optional(),
  date: z.string().optional(),
  kind: z.enum(["planning", "cutover", "hypercare", "review"]).default("planning"),
});
export type PlanMilestone = z.infer<typeof PlanMilestoneSchema>;

export const ComplexityDriverSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  weight: z.number().int().min(0).max(10),
});
export type ComplexityDriver = z.infer<typeof ComplexityDriverSchema>;

export const ImplementationScopeSchema = z.object({
  users: z.number().int().min(1).max(10_000).optional(),
  teamCount: z.number().int().min(1).max(50).optional(),
  teamLabels: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  launchScope: LaunchScopeSchema.default("most-requirements"),
  capabilityIdsInScope: z.array(z.string()).default([]),
  capabilityIdsLater: z.array(z.string()).default([]),
  recordTypes: z.array(z.string()).default([]),
  migrationSource: MigrationSourceSchema.default("unknown"),
  migrationObjects: z.array(z.string()).default([]),
  trainingApproach: TrainingApproachSchema.default("undecided"),
  trainingGroups: z.array(z.string()).default([]),
  adoptionMetrics: z.array(AdoptionMetricIdSchema).default([]),
});
export type ImplementationScope = z.infer<typeof ImplementationScopeSchema>;

export const ImplementationComplexitySchema = z.object({
  level: ImplementationComplexityLevelSchema,
  drivers: z.array(ComplexityDriverSchema).default([]),
  /** Sum of driver weights — for transparency only, not shown as /100 score. */
  score: z.number().int().min(0),
});
export type ImplementationComplexity = z.infer<
  typeof ImplementationComplexitySchema
>;

export const CrmImplementationPlanSchema = z.object({
  id: z.string().min(1),
  version: z.literal(IMPLEMENTATION_PLAN_VERSION),
  categorySlug: z.literal("crm"),
  decisionProfileUpdatedAt: z.string().optional(),
  tcoSessionUpdatedAt: z.string().optional(),
  productId: SlugSchema.optional(),
  productName: z.string().optional(),
  vendorNeutral: z.boolean().default(false),
  implementationType: ImplementationTypeSchema.optional(),
  scope: ImplementationScopeSchema.default({
    teamLabels: [],
    regions: [],
    launchScope: "most-requirements",
    capabilityIdsInScope: [],
    capabilityIdsLater: [],
    recordTypes: [],
    migrationSource: "unknown",
    migrationObjects: [],
    trainingApproach: "undecided",
    trainingGroups: [],
    adoptionMetrics: [],
  }),
  targetGoLive: z.string().optional(),
  /** Explicit planning model duration in weeks. */
  planningDurationWeeks: z.number().min(1).max(52).optional(),
  complexity: ImplementationComplexitySchema.optional(),
  phases: z.array(PlanPhaseSchema).default([]),
  tasks: z.array(PlanTaskSchema).default([]),
  risks: z.array(PlanRiskSchema).default([]),
  readinessGaps: z.array(ReadinessGapSchema).default([]),
  roles: z.array(ProjectRoleAssignmentSchema).default([]),
  uatItems: z.array(UatChecklistItemSchema).default([]),
  goLiveChecklist: z.array(GoLiveChecklistItemSchema).default([]),
  milestones: z.array(PlanMilestoneSchema).default([]),
  assumptions: z.array(z.string()).default([]),
  /** Wizard / UI step for resume. */
  wizardStepId: z.string().optional(),
  planGeneratedAt: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type CrmImplementationPlan = z.infer<typeof CrmImplementationPlanSchema>;

export const CRM_IMPLEMENTATION_PLAN_STORAGE_KEY =
  "sg-crm-implementation-plan-v1";

export function createEmptyCrmImplementationPlan(
  now: string = new Date().toISOString(),
): CrmImplementationPlan {
  return CrmImplementationPlanSchema.parse({
    id: `impl-${now.slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`,
    version: IMPLEMENTATION_PLAN_VERSION,
    categorySlug: "crm",
    createdAt: now,
    updatedAt: now,
  });
}
