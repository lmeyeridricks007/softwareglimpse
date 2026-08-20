import { z } from "zod";
import { SlugSchema } from "./primitives";
import {
  RiskSeveritySchema,
  RiskStatusSchema,
  ReadinessGapKindSchema,
  UatTestStatusSchema,
  ChecklistItemStatusSchema,
  ComplexityDriverSchema,
  ImplementationComplexityLevelSchema,
} from "./implementation-plan";

/**
 * CRM (and category-agnostic) migration planning model.
 * Plans / maps / validates readiness — does NOT execute ETL.
 * Product import capabilities must never be invented here.
 * Affiliate status must never appear in this model.
 */

export const CRM_MIGRATION_PLAN_VERSION = 1 as const;

export const MigrationSourceSystemTypeSchema = z.enum([
  "existing-crm",
  "spreadsheet",
  "database",
  "marketing-platform",
  "customer-service",
  "erp",
  "custom-application",
  "other",
]);
export type MigrationSourceSystemType = z.infer<
  typeof MigrationSourceSystemTypeSchema
>;

export const TriStateKnownSchema = z.enum(["yes", "no", "unknown"]);
export type TriStateKnown = z.infer<typeof TriStateKnownSchema>;

export const MigrationObjectKeySchema = z.enum([
  "contacts",
  "companies",
  "leads",
  "deals",
  "activities",
  "tasks",
  "notes",
  "emails",
  "attachments",
  "products",
  "quotes",
  "users",
  "teams",
  "custom-fields",
  "custom-objects",
  "pipeline-stages",
  "tags",
  "campaigns",
  "other",
]);
export type MigrationObjectKey = z.infer<typeof MigrationObjectKeySchema>;

export const MigrationPrioritySchema = z.enum([
  "must-migrate",
  "should-migrate",
  "archive-only",
  "do-not-migrate",
  "unknown",
]);
export type MigrationPriority = z.infer<typeof MigrationPrioritySchema>;

export const HistoryDepthSchema = z.enum([
  "all-history",
  "last-12-months",
  "last-24-months",
  "current-open-only",
  "custom",
  "unknown",
]);
export type HistoryDepth = z.infer<typeof HistoryDepthSchema>;

export const ObjectInventoryStatusSchema = z.enum([
  "not-started",
  "in-progress",
  "ready",
  "blocked",
  "excluded",
]);
export type ObjectInventoryStatus = z.infer<typeof ObjectInventoryStatusSchema>;

export const FieldMappingStatusSchema = z.enum([
  "mapped",
  "needs-review",
  "no-target-field",
  "transformation-needed",
  "do-not-migrate",
  "suggested",
  "unknown",
]);
export type FieldMappingStatus = z.infer<typeof FieldMappingStatusSchema>;

export const TransformationKindSchema = z.enum([
  "none",
  "format",
  "value-mapping",
  "user-mapping",
  "truncate",
  "format-conversion",
  "boolean-conversion",
  "concatenate",
  "split",
  "country-normalization",
  "currency-normalization",
  "id-mapping",
  "other",
]);
export type TransformationKind = z.infer<typeof TransformationKindSchema>;

export const UserMappingStatusSchema = z.enum([
  "mapped",
  "needs-decision",
  "unassigned",
  "excluded",
  "unknown",
]);
export type UserMappingStatus = z.infer<typeof UserMappingStatusSchema>;

export const InactiveOwnerStrategySchema = z.enum([
  "reassign-manager",
  "reassign-selected",
  "keep-historical-if-supported",
  "leave-unassigned-if-supported",
  "manual-decision",
  "unknown",
]);
export type InactiveOwnerStrategy = z.infer<typeof InactiveOwnerStrategySchema>;

export const PipelineMappingWarnSchema = z.enum([
  "many-to-one",
  "missing-target",
  "unused-target",
  "closed-state-mismatch",
  "target-support-unverified",
]);
export type PipelineMappingWarn = z.infer<typeof PipelineMappingWarnSchema>;

export const DedupeMatchMethodSchema = z.enum([
  "email",
  "phone",
  "company-plus-name",
  "external-id",
  "manual",
  "target-crm-dedupe",
  "unknown",
]);
export type DedupeMatchMethod = z.infer<typeof DedupeMatchMethodSchema>;

export const DedupePrimaryRuleSchema = z.enum([
  "most-recently-updated",
  "prefer-with-email",
  "manual-merge",
  "custom",
  "unknown",
]);
export type DedupePrimaryRule = z.infer<typeof DedupePrimaryRuleSchema>;

export const ArchiveStrategySchema = z.enum([
  "keep-source-read-only",
  "export-archive",
  "store-externally",
  "delete-per-policy",
  "unknown",
]);
export type ArchiveStrategy = z.infer<typeof ArchiveStrategySchema>;

export const EvidenceSupportStatusSchema = z.enum([
  "verified",
  "partial",
  "not-researched",
  "unknown",
]);
export type EvidenceSupportStatus = z.infer<typeof EvidenceSupportStatusSchema>;

export const MigrationTaskStatusSchema = z.enum([
  "not-started",
  "in-progress",
  "blocked",
  "complete",
  "not-applicable",
]);
export type MigrationTaskStatus = z.infer<typeof MigrationTaskStatusSchema>;

export const ReadinessStateSchema = z.enum(["ready", "needs-work", "blocked"]);
export type ReadinessState = z.infer<typeof ReadinessStateSchema>;

export const CutoverRelativeDaySchema = z.enum([
  "t-minus-7",
  "t-minus-5",
  "t-minus-3",
  "t-minus-1",
  "t-0",
  "t-plus-1",
  "custom",
]);
export type CutoverRelativeDay = z.infer<typeof CutoverRelativeDaySchema>;

export const MigrationSourceSystemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  type: MigrationSourceSystemTypeSchema,
  systemLabel: z.string().max(120).optional(),
  dataOwner: z.string().max(120).optional(),
  exportAvailable: TriStateKnownSchema.default("unknown"),
  apiAvailable: TriStateKnownSchema.default("unknown"),
  formatKnown: TriStateKnownSchema.default("unknown"),
  notes: z.string().max(2000).optional(),
});
export type MigrationSourceSystem = z.infer<typeof MigrationSourceSystemSchema>;

export const MigrationObjectInventorySchema = z.object({
  id: z.string().min(1),
  sourceSystemId: z.string().min(1),
  objectKey: MigrationObjectKeySchema,
  sourceObjectLabel: z.string().min(1).max(120),
  targetObjectLabel: z.string().max(120).optional(),
  recordCount: z.number().int().nonnegative().nullable().optional(),
  required: z.boolean().default(true),
  priority: MigrationPrioritySchema.default("unknown"),
  historyDepth: HistoryDepthSchema.default("unknown"),
  status: ObjectInventoryStatusSchema.default("not-started"),
  notes: z.string().max(2000).optional(),
});
export type MigrationObjectInventory = z.infer<
  typeof MigrationObjectInventorySchema
>;

export const FieldMappingSchema = z.object({
  id: z.string().min(1),
  sourceSystemId: z.string().min(1),
  sourceObject: z.string().min(1).max(120),
  sourceField: z.string().min(1).max(120),
  sourceType: z.string().max(80).optional(),
  exampleValue: z.string().max(200).optional(),
  targetObject: z.string().max(120).optional(),
  targetField: z.string().max(120).optional(),
  targetType: z.string().max(80).optional(),
  transformation: TransformationKindSchema.default("none"),
  required: z.boolean().default(false),
  status: FieldMappingStatusSchema.default("unknown"),
  notes: z.string().max(2000).optional(),
  /** True when a deterministic name/type suggestion was applied but not confirmed. */
  suggestionPending: z.boolean().default(false),
});
export type FieldMapping = z.infer<typeof FieldMappingSchema>;

export const ValueMappingSchema = z.object({
  id: z.string().min(1),
  fieldMappingId: z.string().min(1),
  sourceValue: z.string().min(1).max(200),
  targetValue: z.string().max(200).optional(),
  status: z
    .enum(["mapped", "unmapped", "excluded", "unknown"])
    .default("unknown"),
});
export type ValueMapping = z.infer<typeof ValueMappingSchema>;

export const UserMappingSchema = z.object({
  id: z.string().min(1),
  sourceUser: z.string().min(1).max(160),
  email: z.string().max(200).optional(),
  active: TriStateKnownSchema.default("unknown"),
  targetUser: z.string().max(160).optional(),
  role: z.string().max(80).optional(),
  status: UserMappingStatusSchema.default("unknown"),
  notes: z.string().max(1000).optional(),
});
export type UserMapping = z.infer<typeof UserMappingSchema>;

export const PipelineStageMapSchema = z.object({
  sourceStage: z.string().min(1).max(120),
  targetStage: z.string().max(120).optional(),
  warnings: z.array(PipelineMappingWarnSchema).default([]),
});
export type PipelineStageMap = z.infer<typeof PipelineStageMapSchema>;

export const PipelineMappingSchema = z.object({
  id: z.string().min(1),
  sourcePipelineName: z.string().min(1).max(120),
  targetPipelineName: z.string().max(120).optional(),
  stageMaps: z.array(PipelineStageMapSchema).default([]),
  targetSupportStatus: EvidenceSupportStatusSchema.default("unknown"),
  notes: z.string().max(2000).optional(),
});
export type PipelineMapping = z.infer<typeof PipelineMappingSchema>;

export const CleaningTaskSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(240),
  owner: z.string().max(120).optional(),
  status: ChecklistItemStatusSchema.default("pending"),
  dueDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
  category: z
    .enum([
      "duplicates",
      "normalization",
      "required-fields",
      "ownership",
      "pipeline",
      "archive",
      "other",
    ])
    .default("other"),
});
export type CleaningTask = z.infer<typeof CleaningTaskSchema>;

export const ValidationCheckSchema = z.object({
  id: z.string().min(1),
  objectKey: MigrationObjectKeySchema.optional(),
  objectLabel: z.string().min(1).max(120),
  sourceCount: z.number().int().nonnegative().nullable().optional(),
  importedCount: z.number().int().nonnegative().nullable().optional(),
  validatedSampleCount: z.number().int().nonnegative().nullable().optional(),
  checkKind: z.enum([
    "record-counts",
    "required-fields",
    "field-values",
    "relationships",
    "ownership",
    "pipeline-stages",
    "dates",
    "activity-history",
    "attachments",
    "duplicate-count",
    "permissions",
    "other",
  ]),
  status: UatTestStatusSchema.default("not-tested"),
  notes: z.string().max(2000).optional(),
});
export type ValidationCheck = z.infer<typeof ValidationCheckSchema>;

export const MigrationTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(240),
  description: z.string().max(1000).optional(),
  reason: z.string().max(500).optional(),
  owner: z.string().max(120).optional(),
  status: MigrationTaskStatusSchema.default("not-started"),
  section: z.enum([
    "discovery",
    "inventory",
    "mapping",
    "cleaning",
    "test",
    "validation",
    "cutover",
    "other",
  ]),
  ruleId: z.string().optional(),
});
export type MigrationTask = z.infer<typeof MigrationTaskSchema>;

export const MigrationRiskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  severity: RiskSeveritySchema,
  reason: z.string().min(1).max(500),
  recommendedAction: z.string().min(1).max(500),
  owner: z.string().max(120).optional(),
  status: RiskStatusSchema.default("open"),
  sourceRefs: z.array(z.string()).default([]),
});
export type MigrationRisk = z.infer<typeof MigrationRiskSchema>;

export const MigrationReadinessGapSchema = z.object({
  id: z.string().min(1),
  kind: ReadinessGapKindSchema,
  title: z.string().min(1).max(200),
  detail: z.string().min(1).max(500),
  state: ReadinessStateSchema.default("needs-work"),
  resolved: z.boolean().default(false),
});
export type MigrationReadinessGap = z.infer<typeof MigrationReadinessGapSchema>;

export const CutoverStepSchema = z.object({
  id: z.string().min(1),
  relativeDay: CutoverRelativeDaySchema,
  customLabel: z.string().max(80).optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: ChecklistItemStatusSchema.default("pending"),
  editableDefault: z.boolean().default(true),
});
export type CutoverStep = z.infer<typeof CutoverStepSchema>;

export const TestMigrationPlanSchema = z.object({
  status: MigrationTaskStatusSchema.default("not-started"),
  sampleNotes: z.string().max(2000).optional(),
  sandboxAvailability: EvidenceSupportStatusSchema.default("unknown"),
  steps: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1).max(240),
        status: ChecklistItemStatusSchema.default("pending"),
      }),
    )
    .default([]),
});
export type TestMigrationPlan = z.infer<typeof TestMigrationPlanSchema>;

export const AttachmentsPlanSchema = z.object({
  needed: TriStateKnownSchema.default("unknown"),
  approxVolume: z.string().max(80).optional(),
  types: z.string().max(200).optional(),
  sizeKnown: z.string().max(80).optional(),
  sourceSystemId: z.string().optional(),
  targetSupportStatus: EvidenceSupportStatusSchema.default("unknown"),
  notes: z.string().max(2000).optional(),
});
export type AttachmentsPlan = z.infer<typeof AttachmentsPlanSchema>;

export const ActivitiesPlanSchema = z.object({
  includeEmails: TriStateKnownSchema.default("unknown"),
  includeCalls: TriStateKnownSchema.default("unknown"),
  includeMeetings: TriStateKnownSchema.default("unknown"),
  includeNotes: TriStateKnownSchema.default("unknown"),
  includeTasks: TriStateKnownSchema.default("unknown"),
  historyMatters: HistoryDepthSchema.default("unknown"),
  targetSupportStatus: EvidenceSupportStatusSchema.default("unknown"),
  notes: z.string().max(2000).optional(),
});
export type ActivitiesPlan = z.infer<typeof ActivitiesPlanSchema>;

export const DeltaMigrationPlanSchema = z.object({
  sourceRemainsActive: TriStateKnownSchema.default("unknown"),
  cutoffTimestamp: z.string().optional(),
  changedRecordsApproach: z.string().max(500).optional(),
  secondImportIfSupported: TriStateKnownSchema.default("unknown"),
  incrementalImportSupport: EvidenceSupportStatusSchema.default("unknown"),
  notes: z.string().max(2000).optional(),
});
export type DeltaMigrationPlan = z.infer<typeof DeltaMigrationPlanSchema>;

export const RollbackPlanSchema = z.object({
  retainSourceAccess: z.boolean().default(true),
  preserveOriginalExport: z.boolean().default(true),
  doNotDeleteSourceData: z.boolean().default(true),
  decisionPointDocumented: z.boolean().default(false),
  goLiveApprover: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});
export type RollbackPlan = z.infer<typeof RollbackPlanSchema>;

export const DedupeStrategySchema = z.object({
  matchMethods: z.array(DedupeMatchMethodSchema).default([]),
  primaryRule: DedupePrimaryRuleSchema.default("unknown"),
  notes: z.string().max(2000).optional(),
});
export type DedupeStrategy = z.infer<typeof DedupeStrategySchema>;

export const CustomFieldsPanelSchema = z.object({
  sourceCount: z.number().int().nonnegative().nullable().optional(),
  mappedCount: z.number().int().nonnegative().nullable().optional(),
  newFieldsRequired: z.number().int().nonnegative().nullable().optional(),
  transformationRequired: z.number().int().nonnegative().nullable().optional(),
  notMigrating: z.number().int().nonnegative().nullable().optional(),
  unknownCount: z.number().int().nonnegative().nullable().optional(),
});
export type CustomFieldsPanel = z.infer<typeof CustomFieldsPanelSchema>;

export const MigrationComplexityAssessmentSchema = z.object({
  level: ImplementationComplexityLevelSchema,
  drivers: z.array(ComplexityDriverSchema).default([]),
  score: z.number().int().min(0),
});
export type MigrationComplexityAssessment = z.infer<
  typeof MigrationComplexityAssessmentSchema
>;

export const MigrationDecisionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1).max(300),
  decision: z.string().max(500).optional(),
  status: z.enum(["open", "decided", "deferred"]).default("open"),
});
export type MigrationDecision = z.infer<typeof MigrationDecisionSchema>;

export const CrmMigrationPlanSchema = z.object({
  id: z.string().min(1),
  version: z.literal(CRM_MIGRATION_PLAN_VERSION),
  categorySlug: z.literal("crm"),

  decisionProfileUpdatedAt: z.string().optional(),
  implementationPlanId: z.string().optional(),
  implementationPlanUpdatedAt: z.string().optional(),
  tcoSessionUpdatedAt: z.string().optional(),

  targetProductId: SlugSchema.optional(),
  targetProductName: z.string().optional(),
  targetPlanLabel: z.string().max(120).optional(),
  vendorNeutral: z.boolean().default(false),
  migrationResearchStatus: EvidenceSupportStatusSchema.default("not-researched"),

  migrationType: z
    .enum([
      "spreadsheet",
      "existing-crm",
      "multiple-systems",
      "legacy-database",
      "mixed-manual",
      "unknown",
    ])
    .default("unknown"),

  sourceSystems: z.array(MigrationSourceSystemSchema).default([]),
  objects: z.array(MigrationObjectInventorySchema).default([]),
  fieldMappings: z.array(FieldMappingSchema).default([]),
  valueMappings: z.array(ValueMappingSchema).default([]),
  userMappings: z.array(UserMappingSchema).default([]),
  inactiveOwnerStrategy: InactiveOwnerStrategySchema.default("unknown"),
  pipelineMappings: z.array(PipelineMappingSchema).default([]),
  customFields: CustomFieldsPanelSchema.default({}),
  cleaningTasks: z.array(CleaningTaskSchema).default([]),
  dedupe: DedupeStrategySchema.default({
    matchMethods: [],
    primaryRule: "unknown",
  }),
  attachments: AttachmentsPlanSchema.default({
    needed: "unknown",
    targetSupportStatus: "unknown",
  }),
  activities: ActivitiesPlanSchema.default({
    includeEmails: "unknown",
    includeCalls: "unknown",
    includeMeetings: "unknown",
    includeNotes: "unknown",
    includeTasks: "unknown",
    historyMatters: "unknown",
    targetSupportStatus: "unknown",
  }),
  testMigration: TestMigrationPlanSchema.default({
    status: "not-started",
    sandboxAvailability: "unknown",
    steps: [],
  }),
  validationChecks: z.array(ValidationCheckSchema).default([]),
  cutoverSteps: z.array(CutoverStepSchema).default([]),
  deltaMigration: DeltaMigrationPlanSchema.default({
    sourceRemainsActive: "unknown",
    secondImportIfSupported: "unknown",
    incrementalImportSupport: "unknown",
  }),
  rollback: RollbackPlanSchema.default({
    retainSourceAccess: true,
    preserveOriginalExport: true,
    doNotDeleteSourceData: true,
    decisionPointDocumented: false,
  }),
  archiveStrategy: ArchiveStrategySchema.default("unknown"),
  migrationTasks: z.array(MigrationTaskSchema).default([]),
  risks: z.array(MigrationRiskSchema).default([]),
  readinessGaps: z.array(MigrationReadinessGapSchema).default([]),
  decisions: z.array(MigrationDecisionSchema).default([]),
  assumptions: z.array(z.string()).default([]),
  complexity: MigrationComplexityAssessmentSchema.optional(),
  targetGoLive: z.string().optional(),
  /** Optional planning estimates for TCO handoff — never overwrite without confirm. */
  tcoHints: z
    .object({
      externalMigrationCostMinor: z.number().int().nullable().optional(),
      internalMigrationHours: z.number().nonnegative().nullable().optional(),
      dataCleaningEffortHours: z.number().nonnegative().nullable().optional(),
      partnerCostMinor: z.number().int().nullable().optional(),
    })
    .default({}),
  /** Active workspace section for resume. */
  wizardStepId: z.string().optional(),
  planGeneratedAt: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type CrmMigrationPlan = z.infer<typeof CrmMigrationPlanSchema>;

export const CRM_MIGRATION_PLAN_STORAGE_KEY = "sg-crm-migration-plan-v1";

export function createEmptyCrmMigrationPlan(
  now: string = new Date().toISOString(),
): CrmMigrationPlan {
  return CrmMigrationPlanSchema.parse({
    id: `mig-${now.slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`,
    version: CRM_MIGRATION_PLAN_VERSION,
    categorySlug: "crm",
    createdAt: now,
    updatedAt: now,
  });
}

/** Canonical CRM object catalogue for inventory UI — labels only, not product claims. */
export const DEFAULT_CRM_OBJECT_CATALOGUE: Array<{
  key: MigrationObjectKey;
  label: string;
}> = [
  { key: "contacts", label: "Contacts / People" },
  { key: "companies", label: "Companies / Accounts" },
  { key: "leads", label: "Leads" },
  { key: "deals", label: "Deals / Opportunities" },
  { key: "activities", label: "Activities" },
  { key: "tasks", label: "Tasks" },
  { key: "notes", label: "Notes" },
  { key: "emails", label: "Emails" },
  { key: "attachments", label: "Attachments" },
  { key: "products", label: "Products" },
  { key: "quotes", label: "Quotes" },
  { key: "users", label: "Users" },
  { key: "teams", label: "Teams" },
  { key: "custom-fields", label: "Custom fields" },
  { key: "custom-objects", label: "Custom objects" },
  { key: "pipeline-stages", label: "Pipeline stages" },
  { key: "tags", label: "Tags / labels" },
  { key: "campaigns", label: "Campaigns" },
];
