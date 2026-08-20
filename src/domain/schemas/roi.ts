import { z } from "zod";
import { CurrencyCodeSchema } from "./primitives";

/**
 * CRM ROI Calculator session — costs and measurable benefits with explicit
 * assumption quality. Unknown costs stay unknown (null), never silent zeros.
 * No invented vendor uplift or industry-average benefits.
 */

export const ROI_SESSION_VERSION = 1 as const;

export const RoiAssumptionTypeSchema = z.enum([
  "verified",
  "estimated",
  "scenario",
  "unknown",
]);
export type RoiAssumptionType = z.infer<typeof RoiAssumptionTypeSchema>;

export const RoiConfidenceSchema = z.enum(["high", "medium", "low"]);
export type RoiConfidence = z.infer<typeof RoiConfidenceSchema>;

export const RoiWizardStepSchema = z.enum([
  "current-state",
  "crm-investment",
  "productivity",
  "cost-revenue",
  "assumptions",
  "results",
]);
export type RoiWizardStep = z.infer<typeof RoiWizardStepSchema>;

export const RoiScenarioKeySchema = z.enum([
  "conservative",
  "base",
  "upside",
]);
export type RoiScenarioKey = z.infer<typeof RoiScenarioKeySchema>;

export const RoiValueBasisSchema = z.enum([
  "contribution",
  "revenue",
  "other",
]);
export type RoiValueBasis = z.infer<typeof RoiValueBasisSchema>;

export const RoiProductivityInputModeSchema = z.enum([
  "reduction-percent",
  "hours-saved",
]);
export type RoiProductivityInputMode = z.infer<
  typeof RoiProductivityInputModeSchema
>;

/** Optional monetary field: undefined = not set; null = explicitly unknown. */
export const RoiOptionalMoneyMinorSchema = z.number().int().nullable().optional();

export const RoiHourlyCostSchema = z.object({
  salesRepMinor: z.number().int().nonnegative().optional(),
  managerMinor: z.number().int().nonnegative().optional(),
  opsAdminMinor: z.number().int().nonnegative().optional(),
  /** When true, user will supply costs later / leave blank. */
  deferHourlyCosts: z.boolean().default(false),
});
export type RoiHourlyCost = z.infer<typeof RoiHourlyCostSchema>;

export const RoiProcessHoursSchema = z.object({
  salesRep: z.object({
    dataEntry: z.number().nonnegative().default(0),
    searching: z.number().nonnegative().default(0),
    reporting: z.number().nonnegative().default(0),
    duplicateAdmin: z.number().nonnegative().default(0),
  }),
  manager: z.object({
    pipelineReporting: z.number().nonnegative().default(0),
    forecasting: z.number().nonnegative().default(0),
    reconciliation: z.number().nonnegative().default(0),
  }),
  opsAdmin: z.object({
    administration: z.number().nonnegative().default(0),
    reporting: z.number().nonnegative().default(0),
    dataCleanup: z.number().nonnegative().default(0),
    leadRouting: z.number().nonnegative().default(0),
  }),
});
export type RoiProcessHours = z.infer<typeof RoiProcessHoursSchema>;

export const RoiSoftwareCostRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  /** Annual amount in minor units when known. */
  annualMinor: RoiOptionalMoneyMinorSchema,
  /** When monthly entered, stored separately then normalized. */
  monthlyMinor: RoiOptionalMoneyMinorSchema,
  include: z.boolean().default(true),
  billing: z.enum(["annual", "monthly"]).default("annual"),
});
export type RoiSoftwareCostRow = z.infer<typeof RoiSoftwareCostRowSchema>;

export const RoiCurrentStateSchema = z.object({
  crmUsers: z.number().int().min(0).max(10_000).default(0),
  salesReps: z.number().int().min(0).max(10_000).default(0),
  managers: z.number().int().min(0).max(10_000).default(0),
  opsAdminUsers: z.number().int().min(0).max(10_000).default(0),
  hourlyCosts: RoiHourlyCostSchema.default({ deferHourlyCosts: false }),
  processHours: RoiProcessHoursSchema.default({
    salesRep: {
      dataEntry: 0,
      searching: 0,
      reporting: 0,
      duplicateAdmin: 0,
    },
    manager: {
      pipelineReporting: 0,
      forecasting: 0,
      reconciliation: 0,
    },
    opsAdmin: {
      administration: 0,
      reporting: 0,
      dataCleanup: 0,
      leadRouting: 0,
    },
  }),
  softwareCosts: z.array(RoiSoftwareCostRowSchema).default([]),
  workingWeeksPerYear: z.number().min(1).max(52).default(46),
});
export type RoiCurrentState = z.infer<typeof RoiCurrentStateSchema>;

export const RoiInternalLabourRowSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1).max(80),
  people: z.number().int().min(0).max(500).default(0),
  hours: z.number().nonnegative().default(0),
  hourlyCostMinor: z.number().int().nonnegative().optional(),
});
export type RoiInternalLabourRow = z.infer<typeof RoiInternalLabourRowSchema>;

export const RoiInvestmentSchema = z.object({
  source: z.enum(["manual", "cost-calculator", "tco"]).default("manual"),
  /** Software licences — Year 1 / recurring annual. */
  licencesMinor: RoiOptionalMoneyMinorSchema,
  addOnsMinor: RoiOptionalMoneyMinorSchema,
  otherRecurringSoftwareMinor: RoiOptionalMoneyMinorSchema,
  /** One-time implementation. */
  implementationPartnerMinor: RoiOptionalMoneyMinorSchema,
  migrationMinor: RoiOptionalMoneyMinorSchema,
  integrationsMinor: RoiOptionalMoneyMinorSchema,
  trainingMinor: RoiOptionalMoneyMinorSchema,
  changeManagementMinor: RoiOptionalMoneyMinorSchema,
  customizationMinor: RoiOptionalMoneyMinorSchema,
  otherOneTimeMinor: RoiOptionalMoneyMinorSchema,
  /** Recurring ownership. */
  crmAdministrationMinor: RoiOptionalMoneyMinorSchema,
  premiumSupportMinor: RoiOptionalMoneyMinorSchema,
  integrationPlatformMinor: RoiOptionalMoneyMinorSchema,
  ongoingTrainingMinor: RoiOptionalMoneyMinorSchema,
  internalLabour: z.array(RoiInternalLabourRowSchema).default([]),
  importedFromCostAt: z.string().datetime().optional(),
  importedProductName: z.string().max(120).optional(),
});
export type RoiInvestment = z.infer<typeof RoiInvestmentSchema>;

export const RoiProductivityRoleSchema = z.object({
  inputMode: RoiProductivityInputModeSchema.default("reduction-percent"),
  /** Expected % reduction of current process hours (0–100). */
  reductionPercent: z.number().min(0).max(100).optional(),
  /** Or direct hours saved per user per week. */
  hoursSavedPerWeek: z.number().nonnegative().optional(),
  /** Per-scenario overrides when user defines ranges. */
  scenarioHours: z
    .object({
      conservative: z.number().nonnegative().optional(),
      base: z.number().nonnegative().optional(),
      upside: z.number().nonnegative().optional(),
    })
    .optional(),
  included: z.boolean().default(true),
  assumptionType: RoiAssumptionTypeSchema.default("estimated"),
  confidence: RoiConfidenceSchema.default("medium"),
});
export type RoiProductivityRole = z.infer<typeof RoiProductivityRoleSchema>;

export const RoiProductivitySchema = z.object({
  salesReps: RoiProductivityRoleSchema.default({}),
  managers: RoiProductivityRoleSchema.default({}),
  opsAdmin: RoiProductivityRoleSchema.default({}),
  /** Share of saved time counted as realizable value (0–1). Default 0.5. */
  realizationFactor: z.number().min(0).max(1).default(0.5),
  realizationCustom: z.boolean().default(false),
});
export type RoiProductivity = z.infer<typeof RoiProductivitySchema>;

export const RoiCostAvoidanceRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(120),
  currentAnnualMinor: RoiOptionalMoneyMinorSchema,
  eliminationPercent: z.number().min(0).max(100).default(100),
  /** Whether this saving is included in the ROI total. */
  included: z.boolean().default(true),
  assumptionType: RoiAssumptionTypeSchema.default("estimated"),
  confidence: RoiConfidenceSchema.default("medium"),
});
export type RoiCostAvoidanceRow = z.infer<typeof RoiCostAvoidanceRowSchema>;

export const RoiWinRateScenarioSchema = z.object({
  enabled: z.boolean().default(false),
  annualQualifiedOpportunities: z.number().nonnegative().optional(),
  currentWinRatePercent: z.number().min(0).max(100).optional(),
  /** Absolute win rate under scenario (percentage points on the rate scale). */
  scenarioWinRatePercent: z.number().min(0).max(100).optional(),
  /** Per-scenario win-rate percentage-point improvements (absolute pp). */
  scenarioImprovementPp: z
    .object({
      conservative: z.number().optional(),
      base: z.number().optional(),
      upside: z.number().optional(),
    })
    .optional(),
  contributionPerWinMinor: z.number().int().nonnegative().optional(),
  valueBasis: RoiValueBasisSchema.default("contribution"),
  included: z.boolean().default(true),
  assumptionType: RoiAssumptionTypeSchema.default("scenario"),
  confidence: RoiConfidenceSchema.default("low"),
});
export type RoiWinRateScenario = z.infer<typeof RoiWinRateScenarioSchema>;

export const RoiConversionScenarioSchema = z.object({
  enabled: z.boolean().default(false),
  leadsPerYear: z.number().nonnegative().optional(),
  currentConversionPercent: z.number().min(0).max(100).optional(),
  scenarioConversionPercent: z.number().min(0).max(100).optional(),
  contributionPerDealMinor: z.number().int().nonnegative().optional(),
  valueBasis: RoiValueBasisSchema.default("contribution"),
  included: z.boolean().default(true),
  assumptionType: RoiAssumptionTypeSchema.default("scenario"),
  confidence: RoiConfidenceSchema.default("low"),
});
export type RoiConversionScenario = z.infer<typeof RoiConversionScenarioSchema>;

export const RoiRecoveredOpportunitiesSchema = z.object({
  enabled: z.boolean().default(false),
  opportunitiesRecovered: z.number().nonnegative().optional(),
  contributionPerOpportunityMinor: z.number().int().nonnegative().optional(),
  winProbabilityPercent: z.number().min(0).max(100).optional(),
  valueBasis: RoiValueBasisSchema.default("contribution"),
  included: z.boolean().default(true),
  assumptionType: RoiAssumptionTypeSchema.default("scenario"),
  confidence: RoiConfidenceSchema.default("low"),
});
export type RoiRecoveredOpportunities = z.infer<
  typeof RoiRecoveredOpportunitiesSchema
>;

export const RoiCapacityScenarioSchema = z.object({
  enabled: z.boolean().default(false),
  /**
   * Explicit additional contribution from capacity / faster cash — user must
   * enter a defensible amount. Not auto-derived from cycle-time.
   */
  additionalAnnualContributionMinor: z.number().int().nonnegative().optional(),
  notes: z.string().max(500).optional(),
  included: z.boolean().default(false),
  assumptionType: RoiAssumptionTypeSchema.default("scenario"),
  confidence: RoiConfidenceSchema.default("low"),
});
export type RoiCapacityScenario = z.infer<typeof RoiCapacityScenarioSchema>;

export const RoiCostRevenueSchema = z.object({
  costAvoidance: z.array(RoiCostAvoidanceRowSchema).default([]),
  otherBenefitsMinor: z.number().int().nonnegative().optional(),
  otherBenefitsLabel: z.string().max(120).optional(),
  otherBenefitsType: RoiAssumptionTypeSchema.default("estimated"),
  otherBenefitsConfidence: RoiConfidenceSchema.default("medium"),
  otherBenefitsIncluded: z.boolean().default(false),
  winRate: RoiWinRateScenarioSchema.default({}),
  conversion: RoiConversionScenarioSchema.default({}),
  recovered: RoiRecoveredOpportunitiesSchema.default({}),
  capacity: RoiCapacityScenarioSchema.default({}),
});
export type RoiCostRevenue = z.infer<typeof RoiCostRevenueSchema>;

export const RoiAdoptionRampSchema = z.object({
  enabled: z.boolean().default(false),
  year1Percent: z.number().min(0).max(100).default(60),
  year2Percent: z.number().min(0).max(100).default(85),
  year3Percent: z.number().min(0).max(100).default(100),
});
export type RoiAdoptionRamp = z.infer<typeof RoiAdoptionRampSchema>;

export const RoiAssumptionOverrideSchema = z.object({
  id: z.string().min(1),
  included: z.boolean().optional(),
  assumptionType: RoiAssumptionTypeSchema.optional(),
  confidence: RoiConfidenceSchema.optional(),
  notes: z.string().max(300).optional(),
});
export type RoiAssumptionOverride = z.infer<typeof RoiAssumptionOverrideSchema>;

export const RoiInputsSchema = z.object({
  analysisName: z.string().min(1).max(120).default("My CRM ROI"),
  currency: CurrencyCodeSchema.default("EUR"),
  horizonYears: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(3),
  activeScenario: RoiScenarioKeySchema.default("base"),
  currentState: RoiCurrentStateSchema.default({}),
  investment: RoiInvestmentSchema.default({}),
  productivity: RoiProductivitySchema.default({}),
  costRevenue: RoiCostRevenueSchema.default({}),
  adoption: RoiAdoptionRampSchema.default({}),
  assumptionOverrides: z.array(RoiAssumptionOverrideSchema).default([]),
  /** Allow provisional ROI when material costs are unknown. */
  allowProvisional: z.boolean().default(false),
});
export type RoiInputs = z.infer<typeof RoiInputsSchema>;

export const RoiSessionSchema = z.object({
  version: z.literal(ROI_SESSION_VERSION).default(ROI_SESSION_VERSION),
  wizardStepId: RoiWizardStepSchema.default("current-state"),
  maxReachableStepIndex: z.number().int().min(0).max(5).default(0),
  inputs: RoiInputsSchema.default({}),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  /** Confirmed handoff payload for business case (never silent). */
  businessCaseHandoffConfirmedAt: z.string().datetime().optional(),
});
export type RoiSession = z.infer<typeof RoiSessionSchema>;

/** Serializable snapshot for business-case / export handoff. */
export const RoiHandoffPayloadSchema = z.object({
  version: z.literal(1),
  analysisName: z.string(),
  currency: CurrencyCodeSchema,
  horizonYears: z.number().int(),
  scenario: RoiScenarioKeySchema,
  year1InvestmentMinor: z.number().int().nullable(),
  annualRecurringMinor: z.number().int().nullable(),
  threeYearTcoMinor: z.number().int().nullable(),
  annualBenefitMinor: z.number().int(),
  netAnnualBenefitMinor: z.number().int().nullable(),
  threeYearBenefitMinor: z.number().int(),
  netThreeYearValueMinor: z.number().int().nullable(),
  roiPercent: z.number().nullable(),
  paybackMonths: z.number().nullable(),
  benefitBreakdown: z.array(
    z.object({
      category: z.string(),
      annualMinor: z.number().int(),
      sharePercent: z.number(),
      assumptionType: RoiAssumptionTypeSchema,
    }),
  ),
  assumptions: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      valueLabel: z.string(),
      assumptionType: RoiAssumptionTypeSchema,
      confidence: RoiConfidenceSchema,
      included: z.boolean(),
    }),
  ),
  status: z.enum(["complete", "provisional", "incomplete", "negative"]),
  createdAt: z.string().datetime(),
});
export type RoiHandoffPayload = z.infer<typeof RoiHandoffPayloadSchema>;

export const CRM_ROI_STORAGE_KEY = "sg-crm-roi-v1";
export const CRM_ROI_BUSINESS_CASE_HANDOFF_KEY = "sg-crm-roi-business-case-v1";
