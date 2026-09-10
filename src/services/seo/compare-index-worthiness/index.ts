export { COMPARE_INDEX_WORTHINESS_VERSION } from "./types";
export type {
  CompareIndexClass,
  CompareGateId,
  CompareGateResult,
  CompareIndexEvaluation,
  ComparePageMetrics,
  CompareAuditReport,
  CompareAuditSummary,
  CompareRelationshipKind,
} from "./types";

export {
  buildSoftwareLookup,
  resolveComparisonRelationship,
  hasIndexableRelationship,
  analyzeProductComparability,
} from "./relationship";
export type {
  SoftLookup,
  ComparabilityAnalysis,
  ComparabilitySignal,
  ComparabilitySignalId,
} from "./relationship";

export {
  estimateUniqueContentRatio,
  titleQualityFor,
} from "./uniqueness";

export {
  evaluateComparisonIndexWorthiness,
} from "./evaluate";
export type { EvaluateCompareOptions } from "./evaluate";

export { isComparisonSearchIndexWorthy } from "./search-indexable";

export {
  mayCreateIndexableComparison,
  mayMaterializeCategoryPair,
} from "./generation-policy";

export { runCompareIndexAudit, normalizeComparePath } from "./inventory";

export {
  formatCompareAuditMarkdown,
  writeCompareAuditOutputs,
} from "./report";

export {
  canPromoteToIndexable,
  promoteToIndexable,
} from "@/services/seo/content-lifecycle";
