export {
  EARNED_BACKLINK_AGENT,
  runEarnedBacklinkOpportunityAgent,
} from "./agent";
export type { EarnedBacklinkAgentOptions, EarnedBacklinkAgentResult } from "./agent";
export {
  EARNED_LIVE_HITS,
  EARNED_LIVE_QUERIES_RUN,
  EARNED_LIVE_HITS_VERIFIED_AT,
  assertLiveHitsPresent,
} from "./live-hits";
export { qualifyLiveHit, rankTopN } from "./qualify";
export type {
  LiveSearchHit,
  EarnedBacklinkOpportunity,
  EarnedRejectedOpportunity,
  EarnedBacklinkReport,
  CompetitorGapClass,
  EarnedRejectReason,
} from "./types";
