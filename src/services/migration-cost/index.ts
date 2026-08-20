export {
  computeMigrationCost,
  applyScopeReductions,
  CATEGORY_LABELS,
  type McComputeResult,
  type McCostLine,
  type McCostDriver,
  type McUnknownDriver,
  type McCategoryTotal,
  type McWorkSplit,
} from "./compute";

export {
  computeComplexityProfile,
  historicalActivityImpact,
  mappingComplexityBand,
  type McComplexityProfile,
  type McComplexityDimension,
} from "./complexity";

export {
  createEmptyMigrationCostInputs,
  createEmptyMigrationCostSession,
  loadMigrationCostSession,
  saveMigrationCostSession,
  resetMigrationCostSession,
  buildTcoHandoffPayload,
  buildRoiHandoffPayload,
  buildBusinessCaseHandoffPayload,
  saveTcoHandoff,
  saveRoiHandoff,
  saveBusinessCaseHandoff,
  loadTcoHandoff,
  loadRoiHandoff,
  detectRoiOverlap,
  CRM_MIGRATION_COST_STORAGE_KEY,
  CRM_MIGRATION_COST_TCO_HANDOFF_KEY,
  CRM_MIGRATION_COST_ROI_HANDOFF_KEY,
  CRM_MIGRATION_COST_BUSINESS_CASE_HANDOFF_KEY,
} from "./persistence";

export {
  previewFieldMappingImport,
  applyFieldMappingImport,
  previewReadinessWarnings,
  type FieldMappingImportPreview,
  type ReadinessImportPreview,
} from "./handoff";

export {
  downloadMigrationCostPdf,
  downloadMigrationCostExcel,
  downloadMigrationCostMarkdown,
} from "./export";
