import { z } from "zod";

/**
 * CRM Readiness Assessment session.
 * Deterministic diagnostic — selection readiness vs implementation readiness.
 * Versioned so completed reports stay reproducible after scoring changes.
 */

export const CRM_READINESS_ASSESSMENT_VERSION = "crm-readiness-v1" as const;
export const SI_READINESS_ASSESSMENT_VERSION = "si-readiness-v1" as const;
export const CRM_READINESS_SESSION_VERSION = 1 as const;
export const CRM_READINESS_STORAGE_KEY = "sg-crm-readiness-assessment-v1";
export const SI_READINESS_STORAGE_KEY = "sg-si-readiness-assessment-v1";

export const ReadinessAssessmentVersionSchema = z.enum([
  CRM_READINESS_ASSESSMENT_VERSION,
  SI_READINESS_ASSESSMENT_VERSION,
]);
export type ReadinessAssessmentVersion = z.infer<
  typeof ReadinessAssessmentVersionSchema
>;

export function readinessStorageKey(categorySlug: string = "crm"): string {
  if (categorySlug === "crm") return CRM_READINESS_STORAGE_KEY;
  if (categorySlug === "sales-intelligence") return SI_READINESS_STORAGE_KEY;
  return `sg-${categorySlug}-readiness-assessment-v1`;
}

export const ReadinessWizardStepSchema = z.enum([
  "landing",
  "context",
  "assessment",
  "computing",
  "results",
]);
export type ReadinessWizardStep = z.infer<typeof ReadinessWizardStepSchema>;

export const ReadinessCompanySizeSchema = z.enum([
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
]);
export type ReadinessCompanySize = z.infer<typeof ReadinessCompanySizeSchema>;

export const ReadinessSalesModelSchema = z.enum(["b2b", "b2c", "both"]);
export type ReadinessSalesModel = z.infer<typeof ReadinessSalesModelSchema>;

export const ReadinessSalesComplexitySchema = z.enum([
  "simple",
  "moderate",
  "complex",
]);
export type ReadinessSalesComplexity = z.infer<
  typeof ReadinessSalesComplexitySchema
>;

export const ReadinessImplementationApproachSchema = z.enum([
  "internal",
  "partner",
  "hybrid",
  "not-sure",
]);
export type ReadinessImplementationApproach = z.infer<
  typeof ReadinessImplementationApproachSchema
>;

export const ReadinessOrgComplexitySchema = z.enum([
  "small",
  "mid",
  "enterprise",
]);
export type ReadinessOrgComplexity = z.infer<typeof ReadinessOrgComplexitySchema>;

export const ReadinessActionStatusSchema = z.enum([
  "not-started",
  "in-progress",
  "done",
  "not-applicable",
]);
export type ReadinessActionStatus = z.infer<typeof ReadinessActionStatusSchema>;

export const ReadinessActionPhaseSchema = z.enum([
  "do-now",
  "before-demos",
  "before-contract",
  "before-go-live",
]);
export type ReadinessActionPhase = z.infer<typeof ReadinessActionPhaseSchema>;

export const ReadinessActionEffortSchema = z.enum(["low", "medium", "high"]);
export type ReadinessActionEffort = z.infer<typeof ReadinessActionEffortSchema>;

export const ReadinessFindingSeveritySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);
export type ReadinessFindingSeverity = z.infer<
  typeof ReadinessFindingSeveritySchema
>;

export const ReadinessFindingTypeSchema = z.enum([
  "strength",
  "gap",
  "blocker",
  "discovery",
  "risk",
]);
export type ReadinessFindingType = z.infer<typeof ReadinessFindingTypeSchema>;

export const ReadinessLevelSchema = z.enum([
  "foundations-not-ready",
  "preparation-required",
  "ready-for-structured-discovery",
  "ready-for-selection",
  "strongly-prepared",
]);
export type ReadinessLevel = z.infer<typeof ReadinessLevelSchema>;

export const ReadinessDimensionLevelSchema = z.enum([
  "strong",
  "good",
  "needs-work",
  "at-risk",
]);
export type ReadinessDimensionLevel = z.infer<
  typeof ReadinessDimensionLevelSchema
>;

export const ReadinessAnswerValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  z.null(),
]);
export type ReadinessAnswerValue = z.infer<typeof ReadinessAnswerValueSchema>;

export const ReadinessAnswerSchema = z.object({
  questionId: z.string().min(1),
  value: ReadinessAnswerValueSchema,
  /** Optional confidence — used when the question supports it. */
  confidence: z.enum(["high", "medium", "low", "not-sure"]).optional(),
  /** Provenance when prefilled from another tool. */
  source: z
    .enum(["user", "decision-profile", "requirements", "imported"])
    .default("user"),
  updatedAt: z.string().min(1),
});
export type ReadinessAnswer = z.infer<typeof ReadinessAnswerSchema>;

export const ReadinessContextSchema = z.object({
  projectName: z.string().default(""),
  assessedBy: z.string().default(""),
  organization: z.string().default(""),
  industry: z.string().default(""),
  companySize: ReadinessCompanySizeSchema.optional(),
  crmUsers: z.number().int().nonnegative().optional(),
  salesTeamSize: z.number().int().nonnegative().optional(),
  salesModel: ReadinessSalesModelSchema.optional(),
  salesComplexity: ReadinessSalesComplexitySchema.optional(),
  expectedIntegrations: z.number().int().nonnegative().optional(),
  replacingCrm: z.boolean().optional(),
  currentCrm: z.string().default(""),
  implementationApproach: ReadinessImplementationApproachSchema.optional(),
});
export type ReadinessContext = z.infer<typeof ReadinessContextSchema>;

export const ReadinessTrackedActionSchema = z.object({
  actionId: z.string().min(1),
  status: ReadinessActionStatusSchema.default("not-started"),
  owner: z.string().default(""),
  updatedAt: z.string().min(1),
});
export type ReadinessTrackedAction = z.infer<typeof ReadinessTrackedActionSchema>;

export const ReadinessSnapshotSchema = z.object({
  completedAt: z.string().min(1),
  assessmentVersion: ReadinessAssessmentVersionSchema,
  selectionScore: z.number().min(0).max(100),
  implementationScore: z.number().min(0).max(100),
  overallLevel: ReadinessLevelSchema,
  criticalBlockerCount: z.number().int().nonnegative(),
  significantGapCount: z.number().int().nonnegative(),
  dimensionScores: z.record(z.string(), z.number()),
});
export type ReadinessSnapshot = z.infer<typeof ReadinessSnapshotSchema>;

export const CrmReadinessSessionSchema = z.object({
  version: z.literal(CRM_READINESS_SESSION_VERSION),
  assessmentVersion: ReadinessAssessmentVersionSchema,
  id: z.string().min(1),
  status: z.enum(["in-progress", "completed"]).default("in-progress"),
  wizardStep: ReadinessWizardStepSchema.default("landing"),
  /** Index into visible dimension order (0-based). */
  currentDimensionIndex: z.number().int().nonnegative().default(0),
  context: ReadinessContextSchema.default({
    projectName: "",
    assessedBy: "",
    organization: "",
    industry: "",
    currentCrm: "",
  }),
  answers: z.record(z.string(), ReadinessAnswerSchema).default({}),
  actionStatuses: z.record(z.string(), ReadinessTrackedActionSchema).default({}),
  /** Frozen result from last completion (reproducible). */
  lastResult: ReadinessSnapshotSchema.optional(),
  /** Prior completed snapshot for reassessment delta. */
  previousResult: ReadinessSnapshotSchema.optional(),
  startedAt: z.string().min(1),
  completedAt: z.string().optional(),
  updatedAt: z.string().min(1),
  createdAt: z.string().min(1),
});
export type CrmReadinessSession = z.infer<typeof CrmReadinessSessionSchema>;

export function createEmptyCrmReadinessSession(
  now = new Date().toISOString(),
): CrmReadinessSession {
  return createEmptyReadinessSession("crm", now);
}

export function createEmptySiReadinessSession(
  now = new Date().toISOString(),
): CrmReadinessSession {
  return createEmptyReadinessSession("sales-intelligence", now);
}

export function createEmptyReadinessSession(
  categorySlug: string = "crm",
  now = new Date().toISOString(),
): CrmReadinessSession {
  const assessmentVersion =
    categorySlug === "sales-intelligence"
      ? SI_READINESS_ASSESSMENT_VERSION
      : CRM_READINESS_ASSESSMENT_VERSION;
  const prefix =
    categorySlug === "sales-intelligence"
      ? "sra"
      : categorySlug === "crm"
        ? "cra"
        : `${categorySlug.replace(/[^a-z]/g, "").slice(0, 3) || "cat"}ra`;
  return {
    version: CRM_READINESS_SESSION_VERSION,
    assessmentVersion,
    id: `${prefix}-${now.slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`,
    status: "in-progress",
    wizardStep: "landing",
    currentDimensionIndex: 0,
    context: {
      projectName: "",
      assessedBy: "",
      organization: "",
      industry: "",
      currentCrm: "",
    },
    answers: {},
    actionStatuses: {},
    startedAt: now,
    updatedAt: now,
    createdAt: now,
  };
}
