export type {
  EnrichmentLane,
  StrategicOverrideReason,
  LaneAllocation,
  LaneClassification,
  LaneAwareItem,
  GscEvidenceInput,
  StrategicSignalsInput,
} from "./types";
export {
  ENRICHMENT_LANES_VERSION,
  DEFAULT_LANE_ALLOCATION,
  LANE_A_MIN_IMPRESSIONS,
} from "./types";
export {
  scoreGscEvidence,
  scoreAuthorityEvidence,
  hasProvenSearchDemand,
  scoreStrategicSignals,
  classifyEnrichmentLane,
  normalizeLaneAllocation,
  allocateEnrichmentBatch,
  compareByLaneThenScore,
  laneReportFields,
} from "./lanes";
export {
  loadExternalEnrichmentEvidence,
  type ExternalEnrichmentEvidence,
} from "./external-evidence";
