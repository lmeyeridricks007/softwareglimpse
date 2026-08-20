export { computeRoi, computeRoiForScenario, computeRoiWithOverrides, computeBreakEven, computeInvestmentTotals, currentHoursForRole, resolveHoursSaved, annualizeSoftwareRow, costAvoidanceAnnual } from "./compute";
export type {
  RoiComputeResult,
  RoiBenefitLine,
  RoiAssumptionRow,
  RoiCashFlowYear,
  RoiScenarioResult,
  RoiSensitivityPoint,
  RoiAssessment,
  RoiBreakEven,
} from "./compute";
export {
  createEmptyRoiSession,
  createDefaultRoiInputs,
  loadCrmRoiSession,
  saveCrmRoiSession,
  resetCrmRoiSession,
  saveBusinessCaseHandoff,
  loadBusinessCaseHandoff,
  CRM_ROI_STORAGE_KEY,
  CRM_ROI_BUSINESS_CASE_HANDOFF_KEY,
} from "./persistence";
export {
  applyCostCalculatorHandoff,
  applyTcoHandoff,
} from "./handoff";
export {
  buildHandoffPayload,
  formatRoiPercent,
  formatPaybackMonths,
  roiToPlainText,
} from "./format";
