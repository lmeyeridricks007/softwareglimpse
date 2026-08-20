import { z } from "zod";
import { SlugSchema } from "./primitives";
import { BillingPreferenceSchema } from "./crm-requirements";

export const PlanRequirementPrioritySchema = z.enum([
  "must",
  "nice",
  "dont-need",
]);

export type PlanRequirementPriority = z.infer<
  typeof PlanRequirementPrioritySchema
>;

export const PlanPreferenceSchema = z.enum([
  "lowest-cost",
  "balanced",
  "growth",
  "enterprise",
]);

export type PlanPreference = z.infer<typeof PlanPreferenceSchema>;

export const PlanImplementationComplexitySchema = z.enum([
  "simple",
  "moderate",
  "complex",
]);

export type PlanImplementationComplexity = z.infer<
  typeof PlanImplementationComplexitySchema
>;

export const PlanBusinessMaturitySchema = z.enum([
  "starting",
  "replacing-spreadsheets",
  "replacing-crm",
  "scaling",
]);

export type PlanBusinessMaturity = z.infer<typeof PlanBusinessMaturitySchema>;

export const FullAccessNeedSchema = z.enum(["yes", "no", "not-sure"]);

export type FullAccessNeed = z.infer<typeof FullAccessNeedSchema>;

/**
 * Plan Selector questionnaire answers — separate from presentation.
 * Feature priorities use canonical feature slugs only.
 */
export const CrmPlanSelectorAnswersSchema = z.object({
  productSlug: SlugSchema.optional(),
  crmUsers: z.number().int().min(1).max(10_000).default(10),
  usersIn12Months: z.number().int().min(1).max(10_000).optional(),
  fullAccessNeed: FullAccessNeedSchema.default("yes"),
  roleBreakdown: z
    .object({
      salesReps: z.number().int().min(0).optional(),
      salesManagers: z.number().int().min(0).optional(),
      administrators: z.number().int().min(0).optional(),
      marketing: z.number().int().min(0).optional(),
      customerService: z.number().int().min(0).optional(),
      operations: z.number().int().min(0).optional(),
      other: z.number().int().min(0).optional(),
    })
    .optional(),
  /** featureSlug → priority */
  requirementPriorities: z
    .record(SlugSchema, PlanRequirementPrioritySchema)
    .default({}),
  /** Optional usage assumptions keyed by limit id (e.g. pipelines, workflows). */
  usageAssumptions: z.record(z.string(), z.number()).default({}),
  billingPreference: BillingPreferenceSchema.default("annual"),
  preference: PlanPreferenceSchema.default("balanced"),
  implementationComplexity: PlanImplementationComplexitySchema.optional(),
  businessMaturity: PlanBusinessMaturitySchema.optional(),
  requireSso: z.boolean().default(false),
  requireAuditLogs: z.boolean().default(false),
  requireSandbox: z.boolean().default(false),
  requireAdvancedPermissions: z.boolean().default(false),
});

export type CrmPlanSelectorAnswers = z.infer<
  typeof CrmPlanSelectorAnswersSchema
>;

export const PlanSelectorSupportStatusSchema = z.enum([
  "supported",
  "partial",
  "unsupported",
]);

export type PlanSelectorSupportStatus = z.infer<
  typeof PlanSelectorSupportStatusSchema
>;
