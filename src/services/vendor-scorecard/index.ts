/** Client-safe vendor scorecard API (no Node fs). */
export {
  generateCriteriaFromProfile,
  applyImportance,
  CRM_METHODOLOGY_CRITERIA,
  CAPABILITY_TO_CRITERION,
} from "./criteria";
export {
  generateSiCriteriaFromProfile,
  SI_METHODOLOGY_CRITERIA,
  SI_CAPABILITY_TO_CRITERION,
} from "./si-criteria";
export {
  scoreToQualitativeLabel,
  availabilityToQualitative,
  evaluateMustHave,
  summarizeMustHaves,
  deriveOverallFit,
  qualitativeToScore,
  RESEARCH_LABEL_DISPLAY,
  OVERALL_FIT_DISPLAY,
  type ResearchQualitativeLabel,
  type OverallFitLabel,
  type MustHaveStatus,
  type MustHaveSummary,
} from "./labels";
export {
  resolveCriterionCell,
  resolveMustHaves,
  evaluateProductScorecard,
  evaluateScorecard,
  rankScorecardResults,
  buildFeatureRequirementMatrix,
  type ScorecardCriterionResearch,
  type ScorecardProductResearch,
  type ScorecardResearchCatalog,
  type CriterionCellResult,
  type MustHaveCellResult,
  type ProductScorecardResult,
  type ScorecardEngineInput,
} from "./engine";
export {
  buildTradeoffCards,
  buildPairwiseSummaries,
  buildOpenQuestions,
  recommendationSentence,
  buildLeaderRationale,
  type TradeoffCard,
  type PairwiseSummary,
  type OpenQuestion,
  type LeaderRationale,
} from "./summaries";
export {
  loadVendorScorecard,
  saveVendorScorecard,
  resetVendorScorecard,
  resetUserEvaluationOnly,
  touchVendorScorecard,
  createEmptyVendorScorecard,
  CRM_VENDOR_SCORECARD_STORAGE_KEY,
  SI_VENDOR_SCORECARD_STORAGE_KEY,
  vendorScorecardStorageKey,
} from "./persistence";
export { scorecardToPlainText, scorecardToCsv } from "./export";
