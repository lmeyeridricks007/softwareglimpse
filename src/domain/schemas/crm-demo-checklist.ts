import { z } from "zod";

/**
 * CRM Demo Checklist Builder session.
 * Buyer-authored, reusable demo agenda + evaluation workbook.
 * Demo plan is shared across vendors; results are per-vendor.
 */

export const CRM_DEMO_CHECKLIST_SESSION_VERSION = 1 as const;
export const CRM_DEMO_CHECKLIST_STORAGE_KEY = "sg-crm-demo-checklist-v1";
export const SI_DEMO_CHECKLIST_STORAGE_KEY = "sg-si-demo-checklist-v1";

export function demoChecklistStorageKey(categorySlug: string = "crm"): string {
  if (categorySlug === "crm") return CRM_DEMO_CHECKLIST_STORAGE_KEY;
  if (categorySlug === "sales-intelligence") {
    return SI_DEMO_CHECKLIST_STORAGE_KEY;
  }
  return `sg-${categorySlug}-demo-checklist-v1`;
}

export const DemoWizardStepSchema = z.enum([
  "setup",
  "priorities",
  "scenarios",
  "questions",
  "integrations",
  "reporting-admin",
  "commercial",
  "scoring",
  "agenda",
  "review",
  "results",
]);
export type DemoWizardStep = z.infer<typeof DemoWizardStepSchema>;

export const DemoDurationOptionSchema = z.enum([
  "30",
  "45",
  "60",
  "90",
  "120",
  "custom",
]);
export type DemoDurationOption = z.infer<typeof DemoDurationOptionSchema>;

export const DemoTypeSchema = z.enum([
  "initial",
  "shortlist",
  "technical",
  "final-validation",
]);
export type DemoType = z.infer<typeof DemoTypeSchema>;

export const DemoAttendeeRoleSchema = z.enum([
  "executive-sponsor",
  "sales-leadership",
  "sales-operations",
  "sales-representatives",
  "marketing",
  "customer-service",
  "it",
  "security",
  "data",
  "procurement",
  "other",
]);
export type DemoAttendeeRole = z.infer<typeof DemoAttendeeRoleSchema>;

export const DemoPriorityLevelSchema = z.enum([
  "must-test",
  "should-test",
  "optional",
  "not-relevant",
]);
export type DemoPriorityLevel = z.infer<typeof DemoPriorityLevelSchema>;

export const DemoItemPrioritySchema = z.enum([
  "must-have",
  "should-have",
  "optional",
]);
export type DemoItemPriority = z.infer<typeof DemoItemPrioritySchema>;

export const DemoScoreSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type DemoScore = z.infer<typeof DemoScoreSchema>;

export const DemoEvidenceStatusSchema = z.enum([
  "verified-in-demo",
  "vendor-stated",
  "documentation-verified",
  "requires-follow-up",
  "not-verified",
]);
export type DemoEvidenceStatus = z.infer<typeof DemoEvidenceStatusSchema>;

export const DemoTaskResultSchema = z.enum([
  "completed",
  "completed-with-limitation",
  "not-demonstrated",
  "unable",
  "follow-up-required",
]);
export type DemoTaskResult = z.infer<typeof DemoTaskResultSchema>;

export const MustHaveGateResultSchema = z.enum([
  "pass",
  "fail",
  "not-verified",
]);
export type MustHaveGateResult = z.infer<typeof MustHaveGateResultSchema>;

export const DemoIntegrationDeliverySchema = z.enum([
  "native",
  "marketplace",
  "api",
  "custom",
  "unknown",
]);
export type DemoIntegrationDelivery = z.infer<
  typeof DemoIntegrationDeliverySchema
>;

export const ScoringMethodologySchema = z.enum([
  "0-5",
  "pass-fail",
  "weighted",
]);
export type ScoringMethodology = z.infer<typeof ScoringMethodologySchema>;

export const DemoSetupSchema = z.object({
  projectName: z.string().max(200).default(""),
  initiative: z.string().max(200).default(""),
  evaluationTeam: z.string().max(400).default(""),
  demoOwner: z.string().max(120).default(""),
  expectedVendors: z.number().int().min(1).max(10).optional(),
  durationOption: DemoDurationOptionSchema.default("90"),
  customDurationMinutes: z.number().int().min(15).max(480).optional(),
  demoType: DemoTypeSchema.default("shortlist"),
  attendeeRoles: z.array(DemoAttendeeRoleSchema).default([]),
  targetDecisionDate: z.string().max(40).default(""),
  notes: z.string().max(4000).default(""),
});
export type DemoSetup = z.infer<typeof DemoSetupSchema>;

export const DemoEvaluationAreaSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(120),
  priority: DemoPriorityLevelSchema.default("should-test"),
  custom: z.boolean().default(false),
});
export type DemoEvaluationArea = z.infer<typeof DemoEvaluationAreaSchema>;

export const DemoScenarioSchema = z.object({
  id: z.string().min(1),
  name: z.string().max(200).default(""),
  businessContext: z.string().max(2000).default(""),
  persona: z.string().max(120).default(""),
  categoryId: z.string().max(80).default(""),
  startingState: z.string().max(2000).default(""),
  vendorTasks: z.array(z.string().max(500)).default([]),
  expectedOutcome: z.string().max(2000).default(""),
  successCriteria: z.array(z.string().max(400)).default([]),
  evidenceRequired: z.array(z.string().max(400)).default([]),
  requirementIds: z.array(z.string().max(120)).default([]),
  priority: DemoItemPrioritySchema.default("should-have"),
  estimatedMinutes: z.number().int().min(1).max(120).default(10),
  moderatorScript: z.string().max(4000).default(""),
  notes: z.string().max(2000).default(""),
  templateId: z.string().max(80).optional(),
  sortOrder: z.number().int().min(0).default(0),
  included: z.boolean().default(true),
});
export type DemoScenario = z.infer<typeof DemoScenarioSchema>;

export const DemoQuestionSchema = z.object({
  id: z.string().min(1),
  group: z.enum(["functional", "administration", "data", "custom"]),
  question: z.string().max(500),
  included: z.boolean().default(true),
  askDontDemo: z.boolean().default(false),
  notes: z.string().max(1000).default(""),
});
export type DemoQuestion = z.infer<typeof DemoQuestionSchema>;

export const DemoIntegrationCheckSchema = z.object({
  id: z.string().min(1),
  integration: z.string().max(160),
  required: z.boolean().default(false),
  delivery: DemoIntegrationDeliverySchema.default("unknown"),
  demoRequested: z.boolean().default(true),
  testTask: z.string().max(1000).default(""),
  evidenceRequired: z.string().max(500).default(""),
  notes: z.string().max(1000).default(""),
});
export type DemoIntegrationCheck = z.infer<typeof DemoIntegrationCheckSchema>;

export const DemoAdminTaskSchema = z.object({
  id: z.string().min(1),
  category: z.enum(["reporting", "administration", "ai", "custom"]),
  label: z.string().max(200),
  vendorTask: z.string().max(1000).default(""),
  successCriteria: z.string().max(1000).default(""),
  evidenceRequired: z.string().max(500).default(""),
  estimatedMinutes: z.number().int().min(1).max(60).default(5),
  priority: DemoItemPrioritySchema.default("should-have"),
  included: z.boolean().default(true),
});
export type DemoAdminTask = z.infer<typeof DemoAdminTaskSchema>;

export const DemoCommercialQuestionSchema = z.object({
  id: z.string().min(1),
  topic: z.string().max(200),
  question: z.string().max(500),
  included: z.boolean().default(true),
  notes: z.string().max(1000).default(""),
});
export type DemoCommercialQuestion = z.infer<
  typeof DemoCommercialQuestionSchema
>;

export const DemoScoringRulesSchema = z.object({
  methodology: ScoringMethodologySchema.default("0-5"),
  requireEvidenceStatus: z.boolean().default(true),
  separateVendorStated: z.boolean().default(true),
  mustHaveGatesEnabled: z.boolean().default(true),
  notes: z.string().max(2000).default(""),
});
export type DemoScoringRules = z.infer<typeof DemoScoringRulesSchema>;

export const DemoAgendaBlockSchema = z.object({
  id: z.string().min(1),
  label: z.string().max(200),
  minutes: z.number().int().min(0).max(240).default(5),
  kind: z.enum([
    "intro",
    "scenario",
    "reporting",
    "admin",
    "integrations",
    "ai",
    "commercial",
    "questions",
    "wrap",
    "custom",
  ]),
  scenarioId: z.string().optional(),
  sortOrder: z.number().int().min(0).default(0),
  included: z.boolean().default(true),
});
export type DemoAgendaBlock = z.infer<typeof DemoAgendaBlockSchema>;

export const DemoItemResultSchema = z.object({
  itemId: z.string().min(1),
  itemType: z.enum([
    "scenario",
    "question",
    "integration",
    "admin-task",
    "commercial",
    "requirement-gate",
  ]),
  result: DemoTaskResultSchema.optional(),
  score: DemoScoreSchema.optional(),
  evidenceStatus: DemoEvidenceStatusSchema.default("not-verified"),
  mustHaveGate: MustHaveGateResultSchema.optional(),
  evaluatorNotes: z.string().max(4000).default(""),
  vendorExplanation: z.string().max(4000).default(""),
  followUpRequired: z.boolean().default(false),
  evidenceReference: z.string().max(500).default(""),
  documentationUrl: z.string().max(500).default(""),
});
export type DemoItemResult = z.infer<typeof DemoItemResultSchema>;

export const VendorDemoEvaluationSchema = z.object({
  vendorId: z.string().min(1),
  vendorLabel: z.string().max(160).default(""),
  productId: z.string().max(120).optional(),
  demoDate: z.string().max(40).default(""),
  evaluator: z.string().max(120).default(""),
  results: z.array(DemoItemResultSchema).default([]),
  overallNotes: z.string().max(8000).default(""),
  completedAt: z.string().optional(),
});
export type VendorDemoEvaluation = z.infer<typeof VendorDemoEvaluationSchema>;

export const DemoCoverageDecisionSchema = z.object({
  requirementId: z.string().min(1),
  decision: z.enum(["add-to-demo", "written-verification", "exclude"]),
  notes: z.string().max(500).default(""),
});
export type DemoCoverageDecision = z.infer<typeof DemoCoverageDecisionSchema>;

export const CrmDemoChecklistDraftSchema = z.object({
  setup: DemoSetupSchema,
  evaluationAreas: z.array(DemoEvaluationAreaSchema).default([]),
  scenarios: z.array(DemoScenarioSchema).default([]),
  questions: z.array(DemoQuestionSchema).default([]),
  integrations: z.array(DemoIntegrationCheckSchema).default([]),
  adminTasks: z.array(DemoAdminTaskSchema).default([]),
  commercialQuestions: z.array(DemoCommercialQuestionSchema).default([]),
  scoringRules: DemoScoringRulesSchema,
  agenda: z.array(DemoAgendaBlockSchema).default([]),
  demoGuidelines: z.string().max(8000).default(""),
  importedRequirementIds: z.array(z.string()).default([]),
  coverageDecisions: z.array(DemoCoverageDecisionSchema).default([]),
  vendorEvaluations: z.array(VendorDemoEvaluationSchema).default([]),
  activeVendorId: z.string().optional(),
});
export type CrmDemoChecklistDraft = z.infer<typeof CrmDemoChecklistDraftSchema>;

export const CrmDemoChecklistSessionSchema = z.object({
  version: z.literal(CRM_DEMO_CHECKLIST_SESSION_VERSION),
  wizardStepId: DemoWizardStepSchema.default("setup"),
  maxReachableStepIndex: z.number().int().min(0).default(0),
  draft: CrmDemoChecklistDraftSchema,
  generatedAt: z.string().optional(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});
export type CrmDemoChecklistSession = z.infer<
  typeof CrmDemoChecklistSessionSchema
>;

export function createEmptyCrmDemoChecklistSession(
  now: string = new Date().toISOString(),
): CrmDemoChecklistSession {
  return CrmDemoChecklistSessionSchema.parse({
    version: CRM_DEMO_CHECKLIST_SESSION_VERSION,
    wizardStepId: "setup",
    draft: {
      setup: {},
      scoringRules: {},
    },
    createdAt: now,
    updatedAt: now,
  });
}
