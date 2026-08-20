import { z } from "zod";
import { CurrencyCodeSchema } from "./primitives";

/**
 * CRM Migration Cost Calculator session.
 *
 * Money uses integer minor units. Unknown costs stay null — never silent zeros.
 * No invented partner rates, industry averages, or vendor “free migration” assumptions.
 */

export const MIGRATION_COST_SESSION_VERSION = 1 as const;

export const CRM_MIGRATION_COST_STORAGE_KEY = "sg-crm-migration-cost-v1";
export const CRM_MIGRATION_COST_TCO_HANDOFF_KEY =
  "sg-crm-migration-cost-tco-handoff-v1";
export const CRM_MIGRATION_COST_ROI_HANDOFF_KEY =
  "sg-crm-migration-cost-roi-handoff-v1";
export const CRM_MIGRATION_COST_BUSINESS_CASE_HANDOFF_KEY =
  "sg-crm-migration-cost-business-case-v1";

/** Optional monetary field: undefined = not set; null = explicitly unknown. */
export const McOptionalMoneyMinorSchema = z
  .number()
  .int()
  .nullable()
  .optional();

export const McConfidenceSchema = z.enum(["high", "medium", "low"]);
export type McConfidence = z.infer<typeof McConfidenceSchema>;

export const McComplexityBandSchema = z.enum([
  "low",
  "moderate",
  "high",
  "very-high",
  "unknown",
]);
export type McComplexityBand = z.infer<typeof McComplexityBandSchema>;

export const McWizardStepSchema = z.enum([
  "current-system",
  "data-scope",
  "data-quality",
  "mapping",
  "integrations",
  "approach",
  "internal-effort",
  "testing-cutover",
  "results",
]);
export type McWizardStep = z.infer<typeof McWizardStepSchema>;

export const McSourceTypeSchema = z.enum([
  "existing-crm",
  "spreadsheets",
  "multiple-systems",
  "legacy-database",
  "combination",
  "other",
]);
export type McSourceType = z.infer<typeof McSourceTypeSchema>;

export const McMigrationTypeSchema = z.enum([
  "simple",
  "moderate",
  "complex",
  "custom",
  "not-sure",
]);
export type McMigrationType = z.infer<typeof McMigrationTypeSchema>;

export const McCutoverApproachSchema = z.enum([
  "one-time",
  "phased",
  "parallel",
  "not-sure",
]);
export type McCutoverApproach = z.infer<typeof McCutoverApproachSchema>;

export const McHistoryDepthSchema = z.enum([
  "current-only",
  "1-year",
  "3-years",
  "5-plus-years",
  "all-history",
  "unknown",
]);
export type McHistoryDepth = z.infer<typeof McHistoryDepthSchema>;

export const McRecordVolumeBandSchema = z.enum([
  "under-10k",
  "10k-50k",
  "50k-250k",
  "250k-1m",
  "1m-plus",
  "unknown",
]);
export type McRecordVolumeBand = z.infer<typeof McRecordVolumeBandSchema>;

export const McTriStateSchema = z.enum(["yes", "no", "unknown"]);
export type McTriState = z.infer<typeof McTriStateSchema>;

export const McIssueSeveritySchema = z.enum([
  "low",
  "some",
  "significant",
  "unknown",
]);
export type McIssueSeverity = z.infer<typeof McIssueSeveritySchema>;

export const McWorkOwnerSchema = z.enum([
  "internal",
  "external",
  "not-sure",
]);
export type McWorkOwner = z.infer<typeof McWorkOwnerSchema>;

export const McAttachmentScopeSchema = z.enum([
  "no",
  "some",
  "most-all",
  "not-sure",
]);
export type McAttachmentScope = z.infer<typeof McAttachmentScopeSchema>;

export const McStorageBandSchema = z.enum([
  "under-5gb",
  "5-25gb",
  "25-100gb",
  "100gb-plus",
  "unknown",
]);
export type McStorageBand = z.infer<typeof McStorageBandSchema>;

export const McIntegrationDispositionSchema = z.enum([
  "rebuild",
  "replace",
  "retire",
  "validate",
  "unknown",
]);
export type McIntegrationDisposition = z.infer<
  typeof McIntegrationDispositionSchema
>;

export const McIntegrationTypeSchema = z.enum([
  "native",
  "marketplace",
  "ipaas",
  "custom-api",
  "batch-file",
  "unknown",
]);
export type McIntegrationType = z.infer<typeof McIntegrationTypeSchema>;

export const McSimpleComplexitySchema = z.enum([
  "simple",
  "moderate",
  "complex",
  "unknown",
]);
export type McSimpleComplexity = z.infer<typeof McSimpleComplexitySchema>;

export const McDeliveryWhoSchema = z.enum([
  "internal",
  "crm-vendor",
  "partner",
  "other-vendor",
  "unknown",
]);
export type McDeliveryWho = z.infer<typeof McDeliveryWhoSchema>;

export const McMigrationPerformerSchema = z.enum([
  "internal",
  "crm-vendor",
  "implementation-partner",
  "data-specialist",
  "hybrid",
  "not-sure",
]);
export type McMigrationPerformer = z.infer<typeof McMigrationPerformerSchema>;

export const McPricingModelSchema = z.enum([
  "fixed",
  "rate-times-effort",
  "mixed",
  "unknown",
]);
export type McPricingModel = z.infer<typeof McPricingModelSchema>;

export const McToolBillingSchema = z.enum([
  "one-time",
  "monthly",
  "annual",
  "unknown",
]);
export type McToolBilling = z.infer<typeof McToolBillingSchema>;

export const McTestMigrationsSchema = z.enum([
  "0",
  "1",
  "2",
  "3-plus",
]);
export type McTestMigrations = z.infer<typeof McTestMigrationsSchema>;

export const McCutoverModelSchema = z.enum([
  "weekend",
  "business-hours",
  "phased",
  "parallel",
  "unknown",
]);
export type McCutoverModel = z.infer<typeof McCutoverModelSchema>;

export const McHypercarePeriodSchema = z.enum([
  "none",
  "1-week",
  "2-weeks",
  "4-weeks",
  "custom",
]);
export type McHypercarePeriod = z.infer<typeof McHypercarePeriodSchema>;

export const McTrainingApproachSchema = z.enum([
  "internal",
  "vendor",
  "partner",
  "self-service",
  "mixed",
  "unknown",
]);
export type McTrainingApproach = z.infer<typeof McTrainingApproachSchema>;

export const McTrainingClassificationSchema = z.enum([
  "migration",
  "implementation",
]);
export type McTrainingClassification = z.infer<
  typeof McTrainingClassificationSchema
>;

export const McContingencyPercentSchema = z.union([
  z.literal(0),
  z.literal(5),
  z.literal(10),
  z.literal(15),
  z.literal(20),
]);
export type McContingencyPercent = z.infer<typeof McContingencyPercentSchema>;

export const McCostCategoryIdSchema = z.enum([
  "discovery",
  "data-preparation",
  "mapping",
  "integrations",
  "migration-execution",
  "testing",
  "internal-labour",
  "training",
  "cutover-hypercare",
  "tooling",
  "contingency",
  "optional",
]);
export type McCostCategoryId = z.infer<typeof McCostCategoryIdSchema>;

/** Range for a single estimated cost — only when user supplies bounds. */
export const McMoneyRangeSchema = z.object({
  lowMinor: McOptionalMoneyMinorSchema,
  expectedMinor: McOptionalMoneyMinorSchema,
  highMinor: McOptionalMoneyMinorSchema,
});
export type McMoneyRange = z.infer<typeof McMoneyRangeSchema>;

// ─── Step 1: Current system ─────────────────────────────────────────────────

export const McCurrentSystemSchema = z.object({
  sourceType: McSourceTypeSchema.optional(),
  currentPlatform: z.string().max(80).optional(),
  currentPlatformOther: z.string().max(80).optional(),
  targetCrm: z.string().max(80).optional(),
  targetCrmOther: z.string().max(80).optional(),
  currentUsers: z.number().int().min(0).max(100_000).optional(),
  targetUsers: z.number().int().min(0).max(100_000).optional(),
  migrationDeadline: z.string().max(40).optional(),
  cutoverApproach: McCutoverApproachSchema.optional(),
  migrationType: McMigrationTypeSchema.optional(),
  projectName: z.string().min(1).max(120).default("CRM Migration Estimate"),
  projectOwner: z.string().max(80).optional(),
});
export type McCurrentSystem = z.infer<typeof McCurrentSystemSchema>;

// ─── Step 2: Data scope ─────────────────────────────────────────────────────

export const DEFAULT_DATA_OBJECTS = [
  { id: "contacts", label: "Contacts" },
  { id: "accounts", label: "Accounts / companies" },
  { id: "leads", label: "Leads" },
  { id: "deals", label: "Opportunities / deals" },
  { id: "activities", label: "Activities / tasks" },
  { id: "emails", label: "Emails" },
  { id: "calendar", label: "Calendar events" },
  { id: "notes", label: "Notes" },
  { id: "products", label: "Products" },
  { id: "quotes", label: "Quotes" },
  { id: "campaigns", label: "Campaigns" },
  { id: "tickets", label: "Tickets" },
  { id: "custom-objects", label: "Custom objects" },
  { id: "attachments", label: "Attachments / files" },
] as const;

export const McDataObjectRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  migrate: z.boolean().default(false),
  recordCountExact: z.number().int().nonnegative().optional(),
  recordVolumeBand: McRecordVolumeBandSchema.default("unknown"),
  historyDepth: McHistoryDepthSchema.default("unknown"),
  customFieldsApprox: z.number().int().nonnegative().optional(),
  hasAttachments: McTriStateSchema.default("unknown"),
  importantRelationships: McTriStateSchema.default("unknown"),
  isCustom: z.boolean().default(false),
});
export type McDataObjectRow = z.infer<typeof McDataObjectRowSchema>;

export const McHistoricalActivitySchema = z.object({
  emails: z.boolean().default(false),
  calls: z.boolean().default(false),
  meetings: z.boolean().default(false),
  tasks: z.boolean().default(false),
  notes: z.boolean().default(false),
  stageHistory: z.boolean().default(false),
  ownerHistory: z.boolean().default(false),
});
export type McHistoricalActivity = z.infer<typeof McHistoricalActivitySchema>;

export const McAttachmentsSchema = z.object({
  scope: McAttachmentScopeSchema.default("not-sure"),
  storageBand: McStorageBandSchema.default("unknown"),
  fileTypesNote: z.string().max(200).optional(),
  externalFileLinks: McTriStateSchema.default("unknown"),
  emailAttachments: McTriStateSchema.default("unknown"),
  /** Optional provider/storage migration cost — only if user supplies. */
  storageMigrationCostMinor: McOptionalMoneyMinorSchema,
});
export type McAttachments = z.infer<typeof McAttachmentsSchema>;

export const McDataScopeSchema = z.object({
  objects: z.array(McDataObjectRowSchema).default([]),
  historicalActivity: McHistoricalActivitySchema.default({
    emails: false,
    calls: false,
    meetings: false,
    tasks: false,
    notes: false,
    stageHistory: false,
    ownerHistory: false,
  }),
  attachments: McAttachmentsSchema.default({
    scope: "not-sure",
    storageBand: "unknown",
    externalFileLinks: "unknown",
    emailAttachments: "unknown",
  }),
});
export type McDataScope = z.infer<typeof McDataScopeSchema>;

// ─── Step 3: Data quality ───────────────────────────────────────────────────

export const DATA_QUALITY_ISSUES = [
  { id: "duplicates", label: "Duplicates" },
  { id: "missing-required", label: "Missing required fields" },
  { id: "invalid-emails", label: "Invalid email addresses" },
  { id: "inconsistent-company", label: "Inconsistent company names" },
  { id: "inconsistent-geo", label: "Inconsistent country/state values" },
  { id: "free-text", label: "Free-text fields needing normalization" },
  { id: "outdated", label: "Outdated records" },
  { id: "unowned", label: "Unowned records" },
  { id: "conflicting-ids", label: "Conflicting IDs" },
  { id: "broken-relationships", label: "Broken relationships" },
  { id: "unknown-sources", label: "Unknown data sources" },
] as const;

export const McDataQualityIssueSchema = z.object({
  id: z.string().min(1),
  severity: McIssueSeveritySchema.default("unknown"),
  owner: McWorkOwnerSchema.default("not-sure"),
  estimatedHours: z.number().nonnegative().optional(),
  externalQuoteMinor: McOptionalMoneyMinorSchema,
});
export type McDataQualityIssue = z.infer<typeof McDataQualityIssueSchema>;

export const McDataQualitySchema = z.object({
  issues: z.array(McDataQualityIssueSchema).default([]),
  /** Optional overall cleansing quote if not broken down by issue. */
  overallExternalQuoteMinor: McOptionalMoneyMinorSchema,
  overallInternalHours: z.number().nonnegative().optional(),
});
export type McDataQuality = z.infer<typeof McDataQualitySchema>;

// ─── Step 4: Mapping & transformation ───────────────────────────────────────

export const McFieldMappingSchema = z.object({
  importedFromFieldMapping: z.boolean().default(false),
  importedAt: z.string().datetime().optional(),
  sourceFieldsApprox: z.number().int().nonnegative().optional(),
  targetFieldsApprox: z.number().int().nonnegative().optional(),
  directMappings: z.number().int().nonnegative().optional(),
  renamedFields: z.number().int().nonnegative().optional(),
  transformationRules: z.number().int().nonnegative().optional(),
  valueMappings: z.number().int().nonnegative().optional(),
  lookupMappings: z.number().int().nonnegative().optional(),
  customObjects: z.number().int().nonnegative().optional(),
  fieldsNeedingReview: z.number().int().nonnegative().optional(),
  unmappedRequired: z.number().int().nonnegative().optional(),
  openIssues: z.number().int().nonnegative().optional(),
  /** User-supplied mapping/transform effort or quotes. */
  externalQuoteMinor: McOptionalMoneyMinorSchema,
  internalHours: z.number().nonnegative().optional(),
  range: McMoneyRangeSchema.optional(),
});
export type McFieldMapping = z.infer<typeof McFieldMappingSchema>;

// ─── Step 5: Integrations & customization ───────────────────────────────────

export const DEFAULT_INTEGRATIONS = [
  { id: "email-calendar", label: "Email / calendar" },
  { id: "marketing", label: "Marketing automation" },
  { id: "erp", label: "ERP" },
  { id: "customer-service", label: "Customer service" },
  { id: "website-forms", label: "Website / forms" },
  { id: "telephony", label: "Telephony" },
  { id: "data-warehouse", label: "Data warehouse" },
  { id: "bi", label: "BI" },
  { id: "identity", label: "Identity provider" },
  { id: "cpq", label: "CPQ" },
  { id: "billing", label: "Billing" },
  { id: "ecommerce", label: "E-commerce" },
] as const;

export const McIntegrationRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  existing: McTriStateSchema.default("unknown"),
  disposition: McIntegrationDispositionSchema.default("unknown"),
  integrationType: McIntegrationTypeSchema.default("unknown"),
  complexity: McSimpleComplexitySchema.default("unknown"),
  who: McDeliveryWhoSchema.default("unknown"),
  externalCostMinor: McOptionalMoneyMinorSchema,
  internalHours: z.number().nonnegative().optional(),
  isCustom: z.boolean().default(false),
  include: z.boolean().default(true),
});
export type McIntegrationRow = z.infer<typeof McIntegrationRowSchema>;

export const CUSTOMIZATION_ITEMS = [
  { id: "workflows", label: "Custom workflow recreation" },
  { id: "custom-objects", label: "Custom objects" },
  { id: "custom-code", label: "Custom code" },
  { id: "custom-ui", label: "Custom UI / extensions" },
  { id: "custom-reports", label: "Custom reports" },
  { id: "permissions", label: "Advanced permissions" },
  { id: "api-work", label: "Custom API work" },
  { id: "legacy-automation", label: "Legacy automation conversion" },
  { id: "transform-scripts", label: "Data transformation scripts" },
] as const;

export const McCustomizationRowSchema = z.object({
  id: z.string().min(1),
  required: McTriStateSchema.default("unknown"),
  estimatedHours: z.number().nonnegative().optional(),
  owner: McWorkOwnerSchema.default("not-sure"),
  costMinor: McOptionalMoneyMinorSchema,
});
export type McCustomizationRow = z.infer<typeof McCustomizationRowSchema>;

export const McIntegrationsSchema = z.object({
  rows: z.array(McIntegrationRowSchema).default([]),
  customizations: z.array(McCustomizationRowSchema).default([]),
});
export type McIntegrations = z.infer<typeof McIntegrationsSchema>;

// ─── Step 6: Migration approach & tooling ───────────────────────────────────

export const McPartnerQuoteSchema = z.object({
  id: z.string().min(1),
  provider: z.string().max(80).default(""),
  fixedCostMinor: McOptionalMoneyMinorSchema,
  dayRateMinor: McOptionalMoneyMinorSchema,
  estimatedDays: z.number().nonnegative().optional(),
  includedScope: z.string().max(500).optional(),
  excludedScope: z.string().max(500).optional(),
  contingencyPercent: z.number().min(0).max(50).optional(),
  notes: z.string().max(500).optional(),
  selected: z.boolean().default(false),
});
export type McPartnerQuote = z.infer<typeof McPartnerQuoteSchema>;

export const McToolingRowSchema = z.object({
  id: z.string().min(1),
  tool: z.string().min(1).max(80),
  costMinor: McOptionalMoneyMinorSchema,
  billing: McToolBillingSchema.default("one-time"),
  durationMonths: z.number().nonnegative().optional(),
  include: z.boolean().default(true),
});
export type McToolingRow = z.infer<typeof McToolingRowSchema>;

export const McApproachSchema = z.object({
  performer: McMigrationPerformerSchema.optional(),
  pricingModel: McPricingModelSchema.default("unknown"),
  externalImplementationQuoteMinor: McOptionalMoneyMinorSchema,
  migrationSpecificQuoteMinor: McOptionalMoneyMinorSchema,
  toolingLicenseCostMinor: McOptionalMoneyMinorSchema,
  partnerDayRateMinor: McOptionalMoneyMinorSchema,
  estimatedDays: z.number().nonnegative().optional(),
  discoveryPlanningMinor: McOptionalMoneyMinorSchema,
  executionExternalMinor: McOptionalMoneyMinorSchema,
  quotes: z.array(McPartnerQuoteSchema).max(3).default([]),
  tooling: z.array(McToolingRowSchema).default([]),
});
export type McApproach = z.infer<typeof McApproachSchema>;

// ─── Step 7: Internal effort ────────────────────────────────────────────────

export const DEFAULT_INTERNAL_ROLES = [
  { id: "pm", label: "Project manager" },
  { id: "crm-admin", label: "CRM administrator" },
  { id: "revops", label: "RevOps" },
  { id: "sales-ops", label: "Sales Operations" },
  { id: "it", label: "IT" },
  { id: "data-engineer", label: "Data engineer" },
  { id: "security", label: "Security / privacy" },
  { id: "sme", label: "Business SMEs" },
  { id: "sales-managers", label: "Sales managers" },
  { id: "uat", label: "End users / UAT" },
  { id: "training-lead", label: "Training / change lead" },
] as const;

export const McInternalRoleRowSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  people: z.number().int().min(0).max(500).default(0),
  hoursPerPerson: z.number().nonnegative().default(0),
  hourlyCostMinor: z.number().int().nonnegative().optional(),
  /** Alternative: total estimated cost instead of rate × hours. */
  totalCostMinor: McOptionalMoneyMinorSchema,
  include: z.boolean().default(true),
  isCustom: z.boolean().default(false),
});
export type McInternalRoleRow = z.infer<typeof McInternalRoleRowSchema>;

export const EFFORT_CATEGORIES = [
  { id: "discovery", label: "Discovery" },
  { id: "data-inventory", label: "Data inventory" },
  { id: "field-mapping", label: "Field mapping" },
  { id: "cleansing", label: "Cleansing" },
  { id: "integration-work", label: "Integration work" },
  { id: "configuration", label: "Configuration" },
  { id: "test-migration", label: "Test migration" },
  { id: "validation", label: "Validation" },
  { id: "uat", label: "User acceptance testing" },
  { id: "training", label: "Training" },
  { id: "cutover", label: "Cutover" },
  { id: "hypercare", label: "Hypercare" },
] as const;

export const McEffortCategoryRowSchema = z.object({
  id: z.string().min(1),
  hours: z.number().nonnegative().optional(),
});
export type McEffortCategoryRow = z.infer<typeof McEffortCategoryRowSchema>;

export const McInternalEffortSchema = z.object({
  roles: z.array(McInternalRoleRowSchema).default([]),
  categories: z.array(McEffortCategoryRowSchema).default([]),
});
export type McInternalEffort = z.infer<typeof McInternalEffortSchema>;

// ─── Step 8: Testing, cutover, hypercare, training, contingency ─────────────

export const McTestCycleSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  hours: z.number().nonnegative().optional(),
  partnerCostMinor: McOptionalMoneyMinorSchema,
  toolCostMinor: McOptionalMoneyMinorSchema,
  include: z.boolean().default(true),
});
export type McTestCycle = z.infer<typeof McTestCycleSchema>;

export const McTestingSchema = z.object({
  testMigrationCount: McTestMigrationsSchema.default("1"),
  reconciliationRequired: McTriStateSchema.default("unknown"),
  sampleValidationOnly: z.boolean().default(false),
  fullReconciliation: z.boolean().default(false),
  businessUat: z.boolean().default(false),
  technicalValidation: z.boolean().default(false),
  securityValidation: z.boolean().default(false),
  integrationRegression: z.boolean().default(false),
  reportingValidation: z.boolean().default(false),
  cycles: z.array(McTestCycleSchema).default([]),
  sharedHours: z.number().nonnegative().optional(),
  sharedPartnerCostMinor: McOptionalMoneyMinorSchema,
});
export type McTesting = z.infer<typeof McTestingSchema>;

export const McCutoverSchema = z.object({
  model: McCutoverModelSchema.default("unknown"),
  dataFreeze: z.boolean().default(false),
  finalDelta: z.boolean().default(false),
  validationWindow: z.boolean().default(false),
  rollbackPlan: z.boolean().default(false),
  businessSupport: z.boolean().default(false),
  extendedHoursSupport: z.boolean().default(false),
  overtimeCostMinor: McOptionalMoneyMinorSchema,
  partnerCoverageMinor: McOptionalMoneyMinorSchema,
  additionalSupportMinor: McOptionalMoneyMinorSchema,
});
export type McCutover = z.infer<typeof McCutoverSchema>;

export const McDowntimeSchema = z.object({
  include: z.boolean().default(false),
  hours: z.number().nonnegative().optional(),
  affectedUsers: z.number().int().nonnegative().optional(),
  hourlyBusinessImpactMinor: McOptionalMoneyMinorSchema,
});
export type McDowntime = z.infer<typeof McDowntimeSchema>;

export const McHypercareSchema = z.object({
  period: McHypercarePeriodSchema.default("none"),
  customWeeks: z.number().nonnegative().optional(),
  internalSupportHours: z.number().nonnegative().optional(),
  internalHourlyCostMinor: z.number().int().nonnegative().optional(),
  externalSupportCostMinor: McOptionalMoneyMinorSchema,
  remediationAllowanceMinor: McOptionalMoneyMinorSchema,
});
export type McHypercare = z.infer<typeof McHypercareSchema>;

export const McTrainingSchema = z.object({
  usersToTrain: z.number().int().nonnegative().optional(),
  approach: McTrainingApproachSchema.default("unknown"),
  trainingCostMinor: McOptionalMoneyMinorSchema,
  internalHours: z.number().nonnegative().optional(),
  internalHourlyCostMinor: z.number().int().nonnegative().optional(),
  environmentSetupMinor: McOptionalMoneyMinorSchema,
  classification: McTrainingClassificationSchema.default("migration"),
});
export type McTraining = z.infer<typeof McTrainingSchema>;

export const McContingencySchema = z.object({
  percent: McContingencyPercentSchema.default(0),
  customPercent: z.number().min(0).max(50).optional(),
  applyToExternal: z.boolean().default(true),
  applyToInternal: z.boolean().default(true),
  applyToTooling: z.boolean().default(true),
  /** Exclude fixed vendor licence / tooling rows from contingency base. */
  excludeFixedLicenses: z.boolean().default(true),
});
export type McContingency = z.infer<typeof McContingencySchema>;

export const McTestingCutoverSchema = z.object({
  testing: McTestingSchema.default({
    testMigrationCount: "1",
    reconciliationRequired: "unknown",
    sampleValidationOnly: false,
    fullReconciliation: false,
    businessUat: false,
    technicalValidation: false,
    securityValidation: false,
    integrationRegression: false,
    reportingValidation: false,
    cycles: [],
  }),
  cutover: McCutoverSchema.default({
    model: "unknown",
    dataFreeze: false,
    finalDelta: false,
    validationWindow: false,
    rollbackPlan: false,
    businessSupport: false,
    extendedHoursSupport: false,
  }),
  downtime: McDowntimeSchema.default({
    include: false,
  }),
  hypercare: McHypercareSchema.default({
    period: "none",
  }),
  training: McTrainingSchema.default({
    approach: "unknown",
    classification: "migration",
  }),
  contingency: McContingencySchema.default({
    percent: 0,
    applyToExternal: true,
    applyToInternal: true,
    applyToTooling: true,
    excludeFixedLicenses: true,
  }),
});
export type McTestingCutover = z.infer<typeof McTestingCutoverSchema>;

// ─── Scenarios / phasing / scope reduction ──────────────────────────────────

export const McScopeToggleSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(120),
  enabled: z.boolean().default(false),
  /** User-supplied reduction when modeled; never invented. */
  reductionMinor: McOptionalMoneyMinorSchema,
});
export type McScopeToggle = z.infer<typeof McScopeToggleSchema>;

export const McPhaseSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  objectIds: z.array(z.string()).default([]),
  integrationIds: z.array(z.string()).default([]),
  includeHistorical: z.boolean().default(false),
  includeCustomObjects: z.boolean().default(false),
  /** Optional user-allocated cost for this phase. */
  allocatedCostMinor: McOptionalMoneyMinorSchema,
});
export type McPhase = z.infer<typeof McPhaseSchema>;

export const McTimelineStageSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(80),
  durationWeeks: z.number().nonnegative().optional(),
  dependsOnIds: z.array(z.string()).default([]),
});
export type McTimelineStage = z.infer<typeof McTimelineStageSchema>;

export const McScenariosSchema = z.object({
  scopeToggles: z.array(McScopeToggleSchema).default([]),
  phases: z.array(McPhaseSchema).default([]),
  timelineStages: z.array(McTimelineStageSchema).default([]),
});
export type McScenarios = z.infer<typeof McScenariosSchema>;

// ─── Inputs / session ───────────────────────────────────────────────────────

export const McInputsSchema = z.object({
  currency: CurrencyCodeSchema.default("EUR"),
  currentSystem: McCurrentSystemSchema.default({
    projectName: "CRM Migration Estimate",
  }),
  dataScope: McDataScopeSchema.default({
    objects: [],
    historicalActivity: {
      emails: false,
      calls: false,
      meetings: false,
      tasks: false,
      notes: false,
      stageHistory: false,
      ownerHistory: false,
    },
    attachments: {
      scope: "not-sure",
      storageBand: "unknown",
      externalFileLinks: "unknown",
      emailAttachments: "unknown",
    },
  }),
  dataQuality: McDataQualitySchema.default({
    issues: [],
  }),
  fieldMapping: McFieldMappingSchema.default({
    importedFromFieldMapping: false,
  }),
  integrations: McIntegrationsSchema.default({
    rows: [],
    customizations: [],
  }),
  approach: McApproachSchema.default({
    pricingModel: "unknown",
    quotes: [],
    tooling: [],
  }),
  internalEffort: McInternalEffortSchema.default({
    roles: [],
    categories: [],
  }),
  testingCutover: McTestingCutoverSchema.default({
    testing: {
      testMigrationCount: "1",
      reconciliationRequired: "unknown",
      sampleValidationOnly: false,
      fullReconciliation: false,
      businessUat: false,
      technicalValidation: false,
      securityValidation: false,
      integrationRegression: false,
      reportingValidation: false,
      cycles: [],
    },
    cutover: {
      model: "unknown",
      dataFreeze: false,
      finalDelta: false,
      validationWindow: false,
      rollbackPlan: false,
      businessSupport: false,
      extendedHoursSupport: false,
    },
    downtime: { include: false },
    hypercare: { period: "none" },
    training: { approach: "unknown", classification: "migration" },
    contingency: {
      percent: 0,
      applyToExternal: true,
      applyToInternal: true,
      applyToTooling: true,
      excludeFixedLicenses: true,
    },
  }),
  scenarios: McScenariosSchema.default({
    scopeToggles: [],
    phases: [],
    timelineStages: [],
  }),
});
export type McInputs = z.infer<typeof McInputsSchema>;

export const McSessionSchema = z.object({
  version: z
    .literal(MIGRATION_COST_SESSION_VERSION)
    .default(MIGRATION_COST_SESSION_VERSION),
  wizardStepId: McWizardStepSchema.default("current-system"),
  maxReachableStepIndex: z.number().int().min(0).max(8).default(0),
  inputs: McInputsSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tcoHandoffConfirmedAt: z.string().datetime().optional(),
  roiHandoffConfirmedAt: z.string().datetime().optional(),
  businessCaseHandoffConfirmedAt: z.string().datetime().optional(),
});
export type McSession = z.infer<typeof McSessionSchema>;

/** Confirmed handoff for TCO / Cost Calculator migration block. */
export const McTcoHandoffPayloadSchema = z.object({
  version: z.literal(1),
  source: z.literal("crm-migration-cost-calculator"),
  currency: CurrencyCodeSchema,
  expectedTotalMinor: z.number().int().nullable(),
  externalCostMinor: z.number().int().nullable(),
  internalLabourMinor: z.number().int().nullable(),
  internalHours: z.number().nonnegative().nullable(),
  toolingMinor: z.number().int().nullable(),
  contingencyMinor: z.number().int().nullable(),
  dataCleaningCostMinor: z.number().int().nullable(),
  complexity: McComplexityBandSchema,
  confidence: McConfidenceSchema,
  coveragePercent: z.number().min(0).max(100).nullable(),
  createdAt: z.string().datetime(),
});
export type McTcoHandoffPayload = z.infer<typeof McTcoHandoffPayloadSchema>;

export const McRoiHandoffPayloadSchema = z.object({
  version: z.literal(1),
  source: z.literal("crm-migration-cost-calculator"),
  currency: CurrencyCodeSchema,
  migrationMinor: z.number().int().nullable(),
  createdAt: z.string().datetime(),
});
export type McRoiHandoffPayload = z.infer<typeof McRoiHandoffPayloadSchema>;

export const McBusinessCaseHandoffPayloadSchema = z.object({
  version: z.literal(1),
  source: z.literal("crm-migration-cost-calculator"),
  currency: CurrencyCodeSchema,
  projectName: z.string(),
  expectedTotalMinor: z.number().int().nullable(),
  externalCostMinor: z.number().int().nullable(),
  internalLabourMinor: z.number().int().nullable(),
  toolingMinor: z.number().int().nullable(),
  contingencyMinor: z.number().int().nullable(),
  complexity: McComplexityBandSchema,
  confidence: McConfidenceSchema,
  timelineWeeks: z.number().nonnegative().nullable(),
  majorAssumptions: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  unknowns: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
});
export type McBusinessCaseHandoffPayload = z.infer<
  typeof McBusinessCaseHandoffPayloadSchema
>;

export function createDefaultDataObjects(): McDataObjectRow[] {
  return DEFAULT_DATA_OBJECTS.map((o) =>
    McDataObjectRowSchema.parse({
      id: o.id,
      label: o.label,
      migrate: false,
      recordVolumeBand: "unknown",
      historyDepth: "unknown",
      hasAttachments: "unknown",
      importantRelationships: "unknown",
      isCustom: false,
    }),
  );
}

export function createDefaultDataQualityIssues(): McDataQualityIssue[] {
  return DATA_QUALITY_ISSUES.map((i) =>
    McDataQualityIssueSchema.parse({
      id: i.id,
      severity: "unknown",
      owner: "not-sure",
    }),
  );
}

export function createDefaultIntegrations(): McIntegrationRow[] {
  return DEFAULT_INTEGRATIONS.map((i) =>
    McIntegrationRowSchema.parse({
      id: i.id,
      label: i.label,
      existing: "unknown",
      disposition: "unknown",
      integrationType: "unknown",
      complexity: "unknown",
      who: "unknown",
      include: true,
      isCustom: false,
    }),
  );
}

export function createDefaultCustomizations(): McCustomizationRow[] {
  return CUSTOMIZATION_ITEMS.map((c) =>
    McCustomizationRowSchema.parse({
      id: c.id,
      required: "unknown",
      owner: "not-sure",
    }),
  );
}

export function createDefaultInternalRoles(): McInternalRoleRow[] {
  return DEFAULT_INTERNAL_ROLES.map((r) =>
    McInternalRoleRowSchema.parse({
      id: r.id,
      label: r.label,
      people: 0,
      hoursPerPerson: 0,
      include: true,
      isCustom: false,
    }),
  );
}

export function createDefaultEffortCategories(): McEffortCategoryRow[] {
  return EFFORT_CATEGORIES.map((c) =>
    McEffortCategoryRowSchema.parse({ id: c.id }),
  );
}

export function createDefaultScopeToggles(): McScopeToggle[] {
  return [
    {
      id: "exclude-historical-emails",
      label: "Exclude historical emails",
      enabled: false,
    },
    {
      id: "archive-attachments",
      label: "Archive attachments rather than migrate",
      enabled: false,
    },
    {
      id: "limit-activity-3y",
      label: "Migrate only 3 years of activity",
      enabled: false,
    },
    {
      id: "retire-legacy-integrations",
      label: "Retire legacy integrations",
      enabled: false,
    },
    {
      id: "clean-before-partner",
      label: "Clean data before partner involvement",
      enabled: false,
    },
    {
      id: "phase-custom-objects",
      label: "Phase custom objects to a later wave",
      enabled: false,
    },
  ].map((t) => McScopeToggleSchema.parse(t));
}

export function createDefaultTimelineStages(): McTimelineStage[] {
  return [
    { id: "discovery", label: "Discovery", dependsOnIds: [] },
    { id: "mapping", label: "Mapping", dependsOnIds: ["discovery"] },
    { id: "cleansing", label: "Cleansing", dependsOnIds: ["discovery"] },
    {
      id: "build",
      label: "Build",
      dependsOnIds: ["mapping", "cleansing"],
    },
    {
      id: "test-migration",
      label: "Test migration",
      dependsOnIds: ["build"],
    },
    {
      id: "remediation",
      label: "Remediation",
      dependsOnIds: ["test-migration"],
    },
    {
      id: "final-rehearsal",
      label: "Final rehearsal",
      dependsOnIds: ["remediation"],
    },
    {
      id: "cutover",
      label: "Cutover",
      dependsOnIds: ["final-rehearsal"],
    },
    { id: "hypercare", label: "Hypercare", dependsOnIds: ["cutover"] },
  ].map((s) => McTimelineStageSchema.parse(s));
}
