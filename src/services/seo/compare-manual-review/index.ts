export { COMPARE_MANUAL_REVIEW_VERSION, ENRICHABLE_CLASSES } from "./types";
export type {
  ManualReviewClass,
  ManualReviewDecision,
  RelationshipEvidenceFlag,
  RelationshipEvidenceItem,
  RelationshipEvidencePack,
  BuyerThesisDraft,
  ManualReviewTriageResult,
  ManualReviewReportSummary,
  ManualReviewReport,
} from "./types";

export {
  buildRelationshipEvidence,
  presentFlags,
  isCrmVsSalesIntelligence,
} from "./evidence";
export type { DemandSignals } from "./evidence";

export {
  classifyManualReviewPair,
  hasHistoricalOrBuyerDemand,
} from "./classify";

export { decideManualReviewAction } from "./decide";
export { resolveManualReviewThesis, isGenericThesis } from "./thesis";
export { runCompareManualReview } from "./run";
export type { RunManualReviewOptions } from "./run";
export {
  formatManualReviewMarkdown,
  writeManualReviewOutputs,
} from "./report";
export {
  applyManualReviewTriage,
} from "./apply";
export type { ApplyManualReviewResult } from "./apply";
