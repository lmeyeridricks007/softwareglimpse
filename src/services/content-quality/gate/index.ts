export {
  CONTENT_QUALITY_GATE_VERSION,
  UNIQUE_RATIO_MIN,
  UNIQUE_RATIO_MIN_TEMPLATE_HEAVY,
  BOILERPLATE_SHARE_MAX,
  INDEX_QUALITY_SCORE_MIN,
  WORD_COUNT_SOFT_WARN,
} from "./thresholds";

export type {
  GatePageType,
  GateDimensionId,
  GateIssue,
  GateDimensionResult,
  ContentQualityGateResult,
  GateHistoryRecord,
  GateHistoryFile,
  GateHardFailCode,
} from "./types";

export { GATE_PAGE_TYPES, GATE_DIMENSION_IDS } from "./types";
export { GATE_DIMENSION_META } from "./dimensions";
export { GATE_PROFILES, getGateProfile } from "./profiles";
export { collectHardFails } from "./hard-fails";
export {
  guidePassesIndexGates,
  comparisonPassesIndexGates,
  type IndexGateOptions,
  type IndexGateResult,
} from "./index-gates";
export {
  assessGuideSemanticTemplateRisk,
  assessComparisonSemanticTemplateRisk,
  assessEnrichmentBatchFamilyQa,
  detectUniqueAnalysisSignals,
  normalizeEditorialText,
  recordSemanticTemplateHistory,
  recordSemanticEnrichmentPair,
  recordFamilyQaHistory,
  SEMANTIC_TEMPLATE_VERSION,
  SEMANTIC_SIMILARITY_HIGH,
  DEFAULT_FAMILY_SHARED_RATIO,
  type SemanticTemplateAssessment,
  type FamilyQaSummary,
  type TemplateRiskSignal,
} from "./semantic-template";
export { evaluateContentQualityGate } from "./evaluate";
export {
  analyzePageQualityGate,
  type AnalyzePageRef,
} from "./adapters";
export {
  loadGateHistory,
  recordGateResult,
  runGateImprovementLoop,
  getGateHistoryPath,
} from "./history";
export {
  QUALITY_SNAPSHOT_VERSION,
  loadQualitySnapshotStore,
  recordQualitySnapshot,
  latestSnapshot,
  previousSnapshot,
  qualityDelta,
  deltaBetween,
  promotionHistory,
  detectQualityRegression,
  computeWeeklyQualityVelocity,
  snapshotFromGateResult,
  appendQualitySnapshot,
} from "./snapshots";
export type {
  QualityObservationSnapshot,
  QualitySnapshotSourceEvent,
  QualityRegressionFlag,
  QualityDelta,
  WeeklyQualityVelocity,
} from "./snapshots";
export { formatGateResultMarkdown } from "./report";
