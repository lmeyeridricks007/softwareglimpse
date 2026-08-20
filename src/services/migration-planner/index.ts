export {
  assessMigrationComplexity,
  complexityLevelLabel,
} from "./complexity";
export {
  prefillMigrationFromContext,
  seedPlanFromContext,
  normalizeObjectKey,
  complexityToTcoNeeded,
  type MigrationPrefill,
} from "./from-profile";
export {
  generateMigrationPlan,
  generateMigrationRisks,
  generateReadinessGaps,
  generateValidationChecks,
  defaultCleaningTasks,
  defaultTestMigrationPlan,
  defaultCutoverSteps,
  potentialDataLossWarnings,
  type GenerateMigrationPlanOptions,
} from "./generate";
export {
  MIGRATION_RULES,
  applyMigrationRules,
  mergeRuleTasks,
  type MigrationRule,
} from "./rules";
export {
  suggestTargetField,
  applyFieldSuggestions,
  assessFieldTypeRisk,
  type FieldSuggestion,
  type FieldTypeRisk,
} from "./field-suggestions";
export {
  CRM_MIGRATION_PLAN_STORAGE_KEY,
  loadCrmMigrationPlan,
  saveCrmMigrationPlan,
  resetCrmMigrationPlan,
  touchCrmMigrationPlan,
  updateFieldMapping,
  setFieldMappingStatus,
  bulkUpdateFieldMappings,
  setCleaningTaskStatus,
  setMigrationTaskStatus,
  fieldMappingProgress,
  userMappingProgress,
  openMigrationRiskCount,
  totalRecordEstimate,
} from "./persistence";
export {
  previewImplementationHandoff,
  applyImplementationHandoff,
  previewTcoHandoff,
  applyTcoHandoff,
  type ImplementationHandoffPreview,
  type TcoHandoffPreview,
} from "./handoff";
export {
  migrationPlanToPlainText,
  migrationChecklistText,
  fieldMappingToCsv,
  migrationWorkbookCsv,
  downloadTextFile,
} from "./export";
export {
  downloadMigrationPlanPdf,
  downloadMigrationPlanExcel,
  buildMigrationPlanWorkbook,
} from "./export-documents";
export {
  buildMigrationDashboard,
  type MigrationDashboardSummary,
} from "./summary";
