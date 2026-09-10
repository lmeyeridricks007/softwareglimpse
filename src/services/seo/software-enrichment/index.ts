export { SOFTWARE_ENRICHMENT_VERSION } from "./types";
export type {
  FieldStatus,
  SoftwareFieldId,
  SoftwareFieldAuditItem,
  SoftwareFieldAudit,
  DependentPageRef,
  DecisionHubDraft,
  SoftwareEnrichmentOverlay,
  SoftwareQueueItem,
} from "./types";

export { auditSoftwareFields } from "./field-audit";
export {
  listSoftwareDependents,
  dependentCounts,
} from "./dependents";
export { buildDecisionHubDraft } from "./decision-hub";
export { buildSoftwareEnrichmentQueue } from "./queue";
export type { BuildSoftwareQueueOptions } from "./queue";
export {
  loadSoftwareEnrichmentOverlay,
  saveSoftwareEnrichmentOverlay,
  listSoftwareEnrichmentOverlaySlugs,
} from "./overlay-store";
export { applySoftwareEnrichment } from "./apply";
export type { SoftwareEnrichmentApplyResult } from "./apply";
export { runSoftwareEnrichmentBatch } from "./run-batch";
export type {
  RunSoftwareEnrichmentBatchOptions,
  SoftwareEnrichmentBatchResult,
} from "./run-batch";
