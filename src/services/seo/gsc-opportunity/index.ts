export { GSC_OPPORTUNITY_ENGINE_VERSION } from "./types";
export type {
  GscOpportunityReport,
  GscOpportunityRow,
  GscRootCause,
  GscActionType,
  GscCommercialIntent,
  ExclusionReason,
  QueryProvenance,
  QueryMappingConfidence,
  QueryRelationshipSource,
  ActionConfidence,
  InferredQueryCandidate,
  MappedQuery,
} from "./types";

export {
  loadGscExport,
  discoverLatestGscExport,
  aggregatePagesByPath,
  aggregateQueries,
  aggregatePageQueryMatrix,
  parsePageQueryCsv,
  parseGscApiPageQueryPayload,
} from "./ingest";

export {
  inferEstateType,
  resolveOpportunityQueueBucket,
  type GscEstateType,
  type OpportunityQueueBucket,
} from "./estate";

export {
  resolveCreateCandidate,
  findExistingPageForQuery,
} from "./existing-page";

export { loadGscOpportunityReport, loadGscOpportunitySignalsByPath } from "./load-report";

export { writeGscSystemFeeds } from "./feeds";

export {
  buildCanonicalizerContext,
  resolveCanonicalOpportunity,
  loadLegacyRedirectMap,
  loadUrlMappingPlan,
} from "./canonicalize";

export {
  scorePageOpportunity,
  GSC_OPPORTUNITY_WEIGHTS,
  positionProximityScore,
  impressionDemandScore,
} from "./score";

export {
  matchQueriesToPage,
  inferPageQueryMapping,
  mapQueriesFromPageQueryMatrix,
  toCommercialIntent,
  primaryCommercialIntent,
  gateQuerySpecificActions,
  attachQueryScopedActions,
  relationshipSourceFrom,
  QUERY_SCOPED_REWRITE_ACTIONS,
} from "./query-map";

export { diagnosePage } from "./diagnose";

export {
  formatGscOpportunitiesMarkdown,
  formatTop20GrowthPagesMarkdown,
} from "./report";

export {
  analyzeGscOpportunities,
  writeGscOpportunityOutputs,
} from "./analyze";
export type { AnalyzeGscOpportunitiesOptions } from "./analyze";
