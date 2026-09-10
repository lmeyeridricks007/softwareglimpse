export { IMPROVE_LINKING_VERSION } from "./types";
export type {
  BatchPageRef,
  BatchLinkingReport,
  BatchLinkingMetrics,
  PageLinkingPlan,
  PageLinkingImpact,
  LinkingEligibility,
  InboundOpportunity,
  LinkReadinessResult,
} from "./types";

export {
  assessLinkingEligibility,
  MIN_QUALITY_DELTA,
  minQualityScore,
} from "./eligibility";
export { moduleForTarget } from "./module-for-target";
export { applyBatchLinkingPlans } from "./apply";
export { planBatchLinking } from "./plan";
export { prioritizePagesForLinking } from "./prioritize";
export type { LanePrioritizedPage } from "./prioritize";
export {
  selectAuthorityFlowTargets,
  planAuthorityHoarderOutbounds,
} from "./authority-flow";
export type { AuthorityFlowTarget } from "./authority-flow";
export { assessLinkReadiness } from "./link-gates";
export {
  snapshotKnowledgeGraphLinking,
  buildBatchLinkingMetrics,
} from "./metrics";
export { runImproveBatchLinking } from "./run";
export {
  upsertLinkInjections,
  pruneRedundantLinkInjections,
  dedupeInjectionEdges,
} from "./injection-store";
