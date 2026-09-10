export {
  GUIDE_ENRICHMENT_VERSION,
  DEFAULT_ENRICHMENT_BATCH_SIZE,
} from "./types";
export type {
  EnrichmentGuideType,
  GuideSearchIntent,
  GuideQualityBlueprint,
  UniqueValueElement,
  DataEnrichmentSignals,
  CredibilitySignals,
  DecisionSupportAction,
  EnrichmentQueueItem,
  EnrichmentPlan,
  EnrichmentQaResult,
  EnrichmentApplyResult,
  EnrichmentBatchResult,
  GuideEnrichmentReport,
  BlueprintSectionId,
  CommercialIntent,
  EnrichmentQaFinding,
} from "./types";

export { classifyEnrichmentGuideType } from "./taxonomy";
export { blueprintForType, allBlueprints } from "./blueprints";
export { resolveGuideSearchIntent } from "./intent";
export type { GscGuideSignal } from "./intent";
export {
  detectUniqueValueElements,
  requiredUniqueValueForType,
  uniqueValueGap,
  hasGenericFiller,
} from "./unique-value";
export { resolveCredibilitySignals } from "./credibility";
export { resolveDecisionSupportActions } from "./decision-support";
export { collectDataEnrichmentSignals } from "./enrich-context";
export { planGuideEnrichment } from "./plan";
export { applyGuideEnrichment } from "./apply";
export {
  buildProductExplainerOverlay,
  productExplainerSeo,
  countProductSpecificSignals,
} from "./product-explainer";
export { checkExplainerReviewCannibalization } from "./cannibalization";
export { runEnrichmentQa } from "./qa";
export {
  buildGuideEnrichmentQueue,
  peekEnrichmentBatch,
  gscMapFromPageRows,
} from "./queue";
export { runGuideEnrichmentBatch } from "./run";
export { validateAndMaybePromoteGuide } from "./validate";
export {
  mergeGuideWithOverlay,
} from "./overlay-merge";
export type { GuideEnrichmentOverlay } from "./overlay-merge";

/**
 * Overlay persistence (`loadGuideEnrichmentOverlay`, `saveGuideEnrichmentOverlay`)
 * lives in `./overlay-store` — import that path from Node/CLI only (uses node:fs).
 */
export {
  buildGuideEnrichmentReport,
  formatGuideEnrichmentMarkdown,
  writeGuideEnrichmentOutputs,
} from "./report";
