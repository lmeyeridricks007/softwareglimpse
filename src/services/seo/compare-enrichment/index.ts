export {
  COMPARE_ENRICHMENT_VERSION,
  DEFAULT_COMPARE_ENRICHMENT_BATCH_SIZE,
} from "./types";
export type {
  ComparisonThesisKind,
  ComparisonThesis,
  FeatureSupportStatus,
  CapabilityCompareRow,
  PricingDiffSummary,
  EvidencePairSummary,
  DecisionContentDraft,
  UniqueDecisionElement,
  CompareEnrichmentPlan,
  CompareEnrichmentQueueItem,
  CompareEnrichmentQaFinding,
  CompareEnrichmentQaResult,
  CompareEnrichmentApplyResult,
  CompareEnrichmentBatchResult,
  CompareEnrichmentReport,
} from "./types";

export { resolveComparisonThesis, thesisKindLabel } from "./thesis";
export {
  buildCapabilityCompareRows,
  hasFakeFeatureDifference,
} from "./capability-table";
export {
  buildPricingDiffSummary,
  pricingDifferenceBullets,
} from "./pricing";
export { resolveComparisonEvidence } from "./evidence";
export { buildDecisionContentDraft } from "./decision-content";
export { planCompareEnrichment } from "./plan";
export { applyCompareEnrichment } from "./apply";
export { runCompareEnrichmentQa } from "./qa";
export type { CompareQaContext } from "./qa";
export { checkComparisonDifferentiation } from "./differentiation";
export {
  buildCompareEnrichmentQueue,
  peekCompareEnrichmentBatch,
  gscMapFromCompareRows,
  peerComparisonsFor,
} from "./queue";
export type { GscCompareSignal, BuildCompareEnrichmentQueueOptions } from "./queue";
export { runCompareEnrichmentBatch } from "./run";
export { validateAndMaybePromoteComparison } from "./validate";
export { mergeComparisonWithOverlay } from "./overlay-merge";
export type { CompareEnrichmentOverlay } from "./overlay-merge";

/**
 * Overlay persistence (`loadCompareEnrichmentOverlay`, `saveCompareEnrichmentOverlay`)
 * lives in `./overlay-store` — import that path from Node/CLI only (uses node:fs).
 */
export {
  buildCompareEnrichmentReport,
  formatCompareEnrichmentMarkdown,
  writeCompareEnrichmentOutputs,
} from "./report";
