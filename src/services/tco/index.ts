export { buildSeatPlan } from "./seat-plan";
export {
  calculateSoftwareCostsOverHorizon,
  type SoftwareYearCost,
} from "./software-costs";
export {
  computeTco,
  buildAssumptionCostItems,
  majorToMinor,
  minorToMajor,
} from "./compute";
export { deriveCostDrivers, type TCOCostDriver } from "./drivers";
export {
  buildSensitivityAnalysis,
  type SensitivityDelta,
} from "./sensitivity";
export {
  CRM_TCO_STORAGE_KEY,
  createDefaultScenario,
  createEmptyTcoSession,
  loadCrmTcoSession,
  saveCrmTcoSession,
  resetCrmTcoSession,
  getActiveScenario,
  updateActiveScenario,
  duplicateScenario,
  deleteScenario,
} from "./persistence";
export {
  sessionFromDecisionProfile,
  requiredFeaturesFromProfile,
  summarizeProfile,
  applyCostCalculatorHandoff,
  type ProfileSummary,
} from "./from-profile";
export { tcoToPlainText, tcoToCsv } from "./export";
export {
  buildMigrationEstimateTemplates,
  buildImplementationEstimateTemplates,
  adminHoursWeekPresets,
  trainingHoursPerUserPresets,
  supportMonthlyPresets,
  INTERNAL_HOURLY_PRESETS,
} from "./estimate-helpers";
export type {
  MigrationEstimateTemplate,
  ImplementationEstimateTemplate,
} from "./estimate-helpers";
