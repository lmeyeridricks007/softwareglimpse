/**
 * Pure SEO intelligence helpers — safe for most imports.
 * Filesystem store / sync live in `./server`.
 */
export type {
  SearchPerformanceProvider,
  SearchPerformanceRequest,
  SearchPerformanceResult,
} from "./providers/search-performance-provider";
export { FixtureSearchPerformanceProvider } from "./providers/fixture-provider";
export { GoogleSearchConsoleProvider, gscConfigured } from "./providers/gsc-provider";
export { ImportSearchPerformanceProvider } from "./providers/import-provider";
export {
  resolveSearchPerformanceProvider,
  isGscConfigured,
} from "./providers/resolve";

export {
  normalizePagePath,
  resolveSearchUrl,
} from "./url-resolver";

export {
  aggregatePage,
  aggregateQuery,
  aggregatePageQuery,
  comparePeriods,
} from "./aggregate";
export type {
  AggregatedMetrics,
  PageAggregate,
  QueryAggregate,
  PageQueryAggregate,
  PeriodDelta,
} from "./aggregate";

export { normalizeQuery } from "./normalize-query";
export { classifyQuery } from "./classify-query";
export { recognizeEntities } from "./recognize-entities";
export {
  clusterKeyForQuery,
  queriesInSameCluster,
} from "./cluster-queries";

export { scoreOpportunity } from "./score-opportunity";
export type { ScoreOpportunityInput } from "./score-opportunity";

export {
  opportunityIdForComparison,
  opportunityIdForPricing,
  opportunityIdForAlternatives,
  opportunityIdForCtr,
  opportunityIdForStrikingDistance,
  opportunityIdForCannibalization,
} from "./opportunity-ids";

export {
  detectAllOpportunities,
  detectStrikingDistance,
  detectLowCtr,
  detectMissingContent,
  detectCannibalization,
  detectDecayGrowth,
  detectQueryPageMismatch,
  detectInternalLinkOpportunities,
} from "./opportunities/detect-all";

export {
  buildEditorialBriefCandidate,
} from "./queue";
export type { EditorialBriefCandidate } from "./queue";

export { createExperiment, evaluateExperiment } from "./measurement";

export { buildStatusReport } from "./reports/status-report";
export {
  buildProductGapReport,
  buildCategoryGapReport,
} from "./reports/gap-report";
export { buildPageReport } from "./reports/page-report";
export { buildQueryReport } from "./reports/query-report";
