export {
  buildIndustryUseCaseModel,
  getIndustryUseCasePage,
} from "./build-page-model";
export type {
  IndustryUseCaseModel,
  IndustryUseCaseNavItem,
  IndustryUseCaseProductRow,
  IndustryUseCaseScreenshot,
  IndustryUseCaseScenarioPick,
  IndustryUseCaseSummaryPick,
  UseCaseEvidenceConfidence,
  UseCaseFitLabel,
  UseCaseScoreContribution,
} from "./build-page-model";
export { validateIndustryUseCasePage } from "./quality-gate";
export type { UseCasePageGateIssue } from "./quality-gate";
