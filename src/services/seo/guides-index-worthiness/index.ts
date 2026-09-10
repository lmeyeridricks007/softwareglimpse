export { GUIDES_INDEX_WORTHINESS_VERSION } from "./types";
export type {
  GuideIndexClass,
  GuideAuditType,
  GuideGateId,
  GuideGateResult,
  GuideIndexEvaluation,
  GuidePageMetrics,
  GuideAuditReport,
  GuideAuditSummary,
} from "./types";

export {
  classifyGuideAuditType,
  guideTargetIntent,
  isFactoryProductPackGuide,
  isProductExplainerGuide,
  isIndustryVariantGuide,
  intentClusterKey,
  normalizeIntentTitle,
} from "./classify";

export {
  estimateGuideUniqueContentRatio,
  estimateGuidePromotionUniqueRatio,
  titleQualityFor,
  guideBodyHasUniqueAnalysis,
  guideHasTablesOrData,
} from "./uniqueness";

export { evaluateGuideIndexWorthiness } from "./evaluate";
export type { EvaluateGuideOptions } from "./evaluate";

export { isGuideSearchIndexWorthy } from "./search-indexable";

export { mayCreateIndexableProductPackGuide } from "./generation-policy";

export { runGuidesIndexAudit, normalizeGuidePath } from "./inventory";

export {
  formatGuidesAuditMarkdown,
  writeGuidesAuditOutputs,
} from "./report";

export {
  canPromoteToIndexable,
  promoteToIndexable,
} from "@/services/seo/content-lifecycle";
