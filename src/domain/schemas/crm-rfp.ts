import { z } from "zod";
import { CurrencyCodeSchema } from "./primitives";

/**
 * CRM RFP / Vendor Brief Builder session.
 * Buyer-authored procurement package — never invents requirements, pricing,
 * timelines, security claims or vendor capabilities.
 */

export const CRM_RFP_SESSION_VERSION = 1 as const;
export const CRM_RFP_STORAGE_KEY = "sg-crm-rfp-brief-v1";
export const SI_RFP_STORAGE_KEY = "sg-si-rfp-brief-v1";

export function rfpStorageKey(categorySlug: string = "crm"): string {
  if (categorySlug === "crm") return CRM_RFP_STORAGE_KEY;
  if (categorySlug === "sales-intelligence") return SI_RFP_STORAGE_KEY;
  return `sg-${categorySlug}-rfp-brief-v1`;
}

export const RfpModeSchema = z.enum(["vendor-brief", "formal-rfp"]);
export type RfpMode = z.infer<typeof RfpModeSchema>;

export const RfpWizardStepSchema = z.enum([
  "mode",
  "project",
  "business-context",
  "scope-users",
  "requirements",
  "integrations",
  "implementation",
  "security-support",
  "commercials",
  "response-rules",
  "review",
  "results",
]);
export type RfpWizardStep = z.infer<typeof RfpWizardStepSchema>;

/** MoSCoW-style priorities (not High/Medium/Low alone). */
export const RfpRequirementPrioritySchema = z.enum([
  "must-have",
  "should-have",
  "could-have",
  "future",
  "out-of-scope",
]);
export type RfpRequirementPriority = z.infer<
  typeof RfpRequirementPrioritySchema
>;

export const RfpDeliveryMethodSchema = z.enum([
  "native",
  "configuration",
  "custom",
  "third-party",
  "roadmap",
  "not-supported",
  "n-a",
]);
export type RfpDeliveryMethod = z.infer<typeof RfpDeliveryMethodSchema>;

export const RfpProcurementModeSchema = z.enum([
  "informal-evaluation",
  "structured-shortlist",
  "formal-rfp",
  "existing-procurement",
]);
export type RfpProcurementMode = z.infer<typeof RfpProcurementModeSchema>;

export const RfpScopePhaseSchema = z.enum([
  "phase-1",
  "phase-2",
  "future",
  "out-of-scope",
]);
export type RfpScopePhase = z.infer<typeof RfpScopePhaseSchema>;

export const RfpObjectivePrioritySchema = z.enum([
  "high",
  "medium",
  "low",
]);
export type RfpObjectivePriority = z.infer<typeof RfpObjectivePrioritySchema>;

export const RfpIntegrationCriticalitySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
]);
export type RfpIntegrationCriticality = z.infer<
  typeof RfpIntegrationCriticalitySchema
>;

export const RfpIntegrationDirectionSchema = z.enum([
  "inbound",
  "outbound",
  "bidirectional",
  "unknown",
]);
export type RfpIntegrationDirection = z.infer<
  typeof RfpIntegrationDirectionSchema
>;

export const RfpMigrationPerformerSchema = z.enum([
  "buyer",
  "vendor",
  "implementation-partner",
  "shared",
  "tbd",
]);
export type RfpMigrationPerformer = z.infer<typeof RfpMigrationPerformerSchema>;

export const RfpImplementationModelSchema = z.enum([
  "vendor-led",
  "partner-led",
  "customer-led",
  "hybrid",
  "open",
]);
export type RfpImplementationModel = z.infer<
  typeof RfpImplementationModelSchema
>;

export const RfpVendorTrackerStatusSchema = z.enum([
  "not-sent",
  "sent",
  "acknowledged",
  "questions",
  "response-received",
  "clarification-required",
  "qualified",
  "rejected",
  "demo",
  "closed",
]);
export type RfpVendorTrackerStatus = z.infer<
  typeof RfpVendorTrackerStatusSchema
>;

export const RfpReadinessStatusSchema = z.enum([
  "ready",
  "ready-with-gaps",
  "incomplete",
]);
export type RfpReadinessStatus = z.infer<typeof RfpReadinessStatusSchema>;

export const RfpChangeKindSchema = z.enum(["added", "removed", "modified"]);
export type RfpChangeKind = z.infer<typeof RfpChangeKindSchema>;

export const RfpProjectSchema = z.object({
  projectName: z.string().max(200).default(""),
  organization: z.string().max(200).default(""),
  owner: z.string().max(120).default(""),
  executiveSponsor: z.string().max(120).default(""),
  primaryVendorContact: z.string().max(120).default(""),
  issueDate: z.string().max(40).default(""),
  responseDeadline: z.string().max(40).default(""),
  decisionDate: z.string().max(40).default(""),
  goLiveDate: z.string().max(40).default(""),
  currentCrm: z.string().max(120).default(""),
  geography: z.string().max(200).default(""),
  currency: CurrencyCodeSchema.default("EUR"),
  procurementMode: RfpProcurementModeSchema.optional(),
  vendorsExpected: z.number().int().min(0).max(50).optional(),
});
export type RfpProject = z.infer<typeof RfpProjectSchema>;

export const RfpBusinessContextSchema = z.object({
  currentSituation: z.string().max(4000).default(""),
  businessProblem: z.string().max(4000).default(""),
  /** Prompt labels only — never auto-selected as facts. */
  changeTriggers: z.array(z.string().max(80)).default([]),
  desiredFutureState: z.string().max(4000).default(""),
  successOutcomes: z.string().max(4000).default(""),
});
export type RfpBusinessContext = z.infer<typeof RfpBusinessContextSchema>;

export const RfpObjectiveSchema = z.object({
  id: z.string().min(1).max(40),
  objective: z.string().max(400).default(""),
  currentBaseline: z.string().max(400).default(""),
  desiredOutcome: z.string().max(400).default(""),
  measurement: z.string().max(400).default(""),
  priority: RfpObjectivePrioritySchema.default("medium"),
  owner: z.string().max(120).default(""),
});
export type RfpObjective = z.infer<typeof RfpObjectiveSchema>;

export const RfpScopeItemSchema = z.object({
  id: z.string().min(1).max(80),
  label: z.string().min(1).max(120),
  /** Optional link to CRM graph capability slug. */
  capabilitySlug: z.string().max(80).optional(),
  phase: RfpScopePhaseSchema.default("phase-1"),
});
export type RfpScopeItem = z.infer<typeof RfpScopeItemSchema>;

export const RfpUserGroupSchema = z.object({
  id: z.string().min(1).max(40),
  group: z.string().max(120).default(""),
  users: z.number().int().min(0).max(100_000).optional(),
  primaryJob: z.string().max(200).default(""),
  accessType: z.string().max(120).default(""),
  keyWorkflows: z.string().max(500).default(""),
});
export type RfpUserGroup = z.infer<typeof RfpUserGroupSchema>;

export const RfpRequirementSchema = z.object({
  id: z.string().min(1).max(40),
  category: z.string().max(80).default("Core CRM"),
  requirement: z.string().max(2000).default(""),
  priority: RfpRequirementPrioritySchema.default("should-have"),
  rationale: z.string().max(1000).default(""),
  acceptanceCriterion: z.string().max(1000).default(""),
  evidenceRequested: z.string().max(500).default(""),
  mandatory: z.boolean().default(false),
  owner: z.string().max(120).default(""),
  /** Graph slug when imported from decision profile / library. */
  sourceSlug: z.string().max(80).optional(),
  source: z
    .enum(["manual", "profile", "library", "template"])
    .default("manual"),
  sortOrder: z.number().int().default(0),
});
export type RfpRequirement = z.infer<typeof RfpRequirementSchema>;

export const RfpIntegrationSchema = z.object({
  id: z.string().min(1).max(40),
  system: z.string().max(120).default(""),
  category: z.string().max(80).default("Other"),
  direction: RfpIntegrationDirectionSchema.default("unknown"),
  data: z.string().max(400).default(""),
  frequency: z.string().max(80).default(""),
  criticality: RfpIntegrationCriticalitySchema.default("medium"),
  preferredMethod: z.string().max(120).default(""),
  owner: z.string().max(120).default(""),
  notes: z.string().max(500).default(""),
  /** Finder / profile integration id when imported. */
  sourceId: z.string().max(80).optional(),
});
export type RfpIntegration = z.infer<typeof RfpIntegrationSchema>;

export const RfpMigrationObjectSchema = z.object({
  id: z.string().min(1).max(40),
  objectName: z.string().max(80).default(""),
  sourceSystem: z.string().max(120).default(""),
  approxRecordCount: z.string().max(40).default(""),
  historyRequired: z.boolean().default(false),
  attachments: z.boolean().default(false),
  customFields: z.boolean().default(false),
  migrationOwner: z.string().max(120).default(""),
  priority: RfpRequirementPrioritySchema.default("should-have"),
});
export type RfpMigrationObject = z.infer<typeof RfpMigrationObjectSchema>;

export const RfpImplementationQuestionSchema = z.object({
  id: z.string().min(1).max(60),
  label: z.string().min(1).max(200),
  requested: z.boolean().default(true),
  notes: z.string().max(500).default(""),
});
export type RfpImplementationQuestion = z.infer<
  typeof RfpImplementationQuestionSchema
>;

export const RfpTimelinePhaseSchema = z.object({
  id: z.string().min(1).max(40),
  phase: z.string().min(1).max(80),
  /** Vendor fills duration — buyer never prefills. */
  durationRequested: z.boolean().default(true),
  dependenciesRequested: z.boolean().default(true),
  customerResourcesRequested: z.boolean().default(true),
});
export type RfpTimelinePhase = z.infer<typeof RfpTimelinePhaseSchema>;

export const RfpSecurityQuestionSchema = z.object({
  id: z.string().min(1).max(40),
  area: z.string().max(80).default(""),
  question: z.string().max(500).default(""),
  required: z.boolean().default(false),
  evidenceRequested: z.boolean().default(false),
  comments: z.string().max(500).default(""),
  /** Graph / library slug when applicable. */
  sourceSlug: z.string().max(80).optional(),
});
export type RfpSecurityQuestion = z.infer<typeof RfpSecurityQuestionSchema>;

export const RfpSupportQuestionSchema = z.object({
  id: z.string().min(1).max(40),
  topic: z.string().max(120).default(""),
  requested: z.boolean().default(false),
  notes: z.string().max(400).default(""),
});
export type RfpSupportQuestion = z.infer<typeof RfpSupportQuestionSchema>;

export const RfpPricingAssumptionsSchema = z.object({
  usersYear1: z.number().int().min(0).max(100_000).optional(),
  usersYear2: z.number().int().min(0).max(100_000).optional(),
  usersYear3: z.number().int().min(0).max(100_000).optional(),
  requiredAddOns: z.string().max(500).default(""),
  regions: z.string().max(200).default(""),
  supportTier: z.string().max(120).default(""),
  implementationScope: z.string().max(500).default(""),
  currency: CurrencyCodeSchema.default("EUR"),
  taxTreatment: z
    .enum(["exclude", "include-if-required", "specify"])
    .default("exclude"),
});
export type RfpPricingAssumptions = z.infer<typeof RfpPricingAssumptionsSchema>;

export const RfpResponseRulesSchema = z.object({
  rules: z.array(z.string().max(500)).default([]),
  responseDeadline: z.string().max(40).default(""),
  questionsDeadline: z.string().max(40).default(""),
  contactPerson: z.string().max(120).default(""),
  contactEmail: z.string().max(200).default(""),
  submissionMethod: z.string().max(200).default(""),
  clarificationCallWindow: z.string().max(200).default(""),
});
export type RfpResponseRules = z.infer<typeof RfpResponseRulesSchema>;

export const RfpClarificationEntrySchema = z.object({
  id: z.string().min(1).max(40),
  vendor: z.string().max(120).default(""),
  question: z.string().max(1000).default(""),
  rfpSection: z.string().max(80).default(""),
  askedDate: z.string().max(40).default(""),
  response: z.string().max(2000).default(""),
  responseDate: z.string().max(40).default(""),
  sharedWithAll: z.boolean().default(false),
  decisionImpact: z.string().max(500).default(""),
});
export type RfpClarificationEntry = z.infer<typeof RfpClarificationEntrySchema>;

export const RfpVendorTrackerEntrySchema = z.object({
  id: z.string().min(1).max(40),
  vendor: z.string().max(120).default(""),
  rfpSent: z.boolean().default(false),
  acknowledged: z.boolean().default(false),
  questionsReceived: z.boolean().default(false),
  responseReceived: z.boolean().default(false),
  complete: z.boolean().default(false),
  clarificationRequired: z.boolean().default(false),
  demoInvited: z.boolean().default(false),
  status: RfpVendorTrackerStatusSchema.default("not-sent"),
  notes: z.string().max(500).default(""),
});
export type RfpVendorTrackerEntry = z.infer<typeof RfpVendorTrackerEntrySchema>;

export const RfpChangeLogEntrySchema = z.object({
  id: z.string().min(1).max(40),
  at: z.string().min(1),
  version: z.string().min(1).max(20),
  kind: RfpChangeKindSchema,
  requirementId: z.string().max(40).default(""),
  summary: z.string().max(500).default(""),
});
export type RfpChangeLogEntry = z.infer<typeof RfpChangeLogEntrySchema>;

export const RfpVersionMetaSchema = z.object({
  version: z.string().min(1).max(20).default("1.0"),
  generatedAt: z.string().optional(),
  lastModifiedAt: z.string().optional(),
  frozen: z.boolean().default(false),
  freezeNote: z.string().max(500).default(""),
  changedAfterIssue: z.boolean().default(false),
});
export type RfpVersionMeta = z.infer<typeof RfpVersionMetaSchema>;

export const RfpUsersSchema = z.object({
  currentUsers: z.number().int().min(0).max(100_000).optional(),
  users12Month: z.number().int().min(0).max(100_000).optional(),
  users36Month: z.number().int().min(0).max(100_000).optional(),
  groups: z.array(RfpUserGroupSchema).default([]),
});
export type RfpUsers = z.infer<typeof RfpUsersSchema>;

export const RfpImplementationSchema = z.object({
  questions: z.array(RfpImplementationQuestionSchema).default([]),
  preferredGoLive: z.string().max(40).default(""),
  model: RfpImplementationModelSchema.optional(),
  timelinePhases: z.array(RfpTimelinePhaseSchema).default([]),
  customRequirements: z.string().max(2000).default(""),
});
export type RfpImplementation = z.infer<typeof RfpImplementationSchema>;

export const RfpMigrationSchema = z.object({
  objects: z.array(RfpMigrationObjectSchema).default([]),
  performer: RfpMigrationPerformerSchema.optional(),
  constraints: z.string().max(2000).default(""),
});
export type RfpMigration = z.infer<typeof RfpMigrationSchema>;

export const CrmRfpDraftSchema = z.object({
  project: RfpProjectSchema.default({
    projectName: "",
    organization: "",
    owner: "",
    executiveSponsor: "",
    primaryVendorContact: "",
    issueDate: "",
    responseDeadline: "",
    decisionDate: "",
    goLiveDate: "",
    currentCrm: "",
    geography: "",
    currency: "EUR",
  }),
  businessContext: RfpBusinessContextSchema.default({
    currentSituation: "",
    businessProblem: "",
    changeTriggers: [],
    desiredFutureState: "",
    successOutcomes: "",
  }),
  objectives: z.array(RfpObjectiveSchema).default([]),
  scope: z.array(RfpScopeItemSchema).default([]),
  users: RfpUsersSchema.default({ groups: [] }),
  requirements: z.array(RfpRequirementSchema).default([]),
  integrations: z.array(RfpIntegrationSchema).default([]),
  migration: RfpMigrationSchema.default({
    objects: [],
    constraints: "",
  }),
  implementation: RfpImplementationSchema.default({
    questions: [],
    preferredGoLive: "",
    timelinePhases: [],
    customRequirements: "",
  }),
  securityQuestions: z.array(RfpSecurityQuestionSchema).default([]),
  supportQuestions: z.array(RfpSupportQuestionSchema).default([]),
  pricingAssumptions: RfpPricingAssumptionsSchema.default({
    requiredAddOns: "",
    regions: "",
    supportTier: "",
    implementationScope: "",
    currency: "EUR",
    taxTreatment: "exclude",
  }),
  responseRules: RfpResponseRulesSchema.default({
    rules: [],
    responseDeadline: "",
    questionsDeadline: "",
    contactPerson: "",
    contactEmail: "",
    submissionMethod: "",
    clarificationCallWindow: "",
  }),
  clarifications: z.array(RfpClarificationEntrySchema).default([]),
  vendorTracker: z.array(RfpVendorTrackerEntrySchema).default([]),
  vendorPackageNames: z.array(z.string().max(120)).default([]),
});
export type CrmRfpDraft = z.infer<typeof CrmRfpDraftSchema>;

export const CrmRfpSessionSchema = z.object({
  version: z.literal(CRM_RFP_SESSION_VERSION),
  mode: RfpModeSchema.optional(),
  wizardStepId: RfpWizardStepSchema.default("mode"),
  draft: CrmRfpDraftSchema,
  versionMeta: RfpVersionMetaSchema.default({
    version: "1.0",
    frozen: false,
    freezeNote: "",
    changedAfterIssue: false,
  }),
  changeLog: z.array(RfpChangeLogEntrySchema).default([]),
  /** Snapshot of requirement IDs+text at last generate — for change detection. */
  lastIssuedRequirementFingerprint: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type CrmRfpSession = z.infer<typeof CrmRfpSessionSchema>;

export function createEmptyCrmRfpSession(
  now: string = new Date().toISOString(),
): CrmRfpSession {
  return CrmRfpSessionSchema.parse({
    version: CRM_RFP_SESSION_VERSION,
    wizardStepId: "mode",
    draft: {},
    createdAt: now,
    updatedAt: now,
  });
}
