export {
  loadBacklinkExport,
  discoverLatestBacklinkExport,
  ensureBacklinkImportDirs,
} from "./ingest";
export { classifyProspectType } from "./classify";
export {
  buildProspectsFromGaps,
  buildPitchAngle,
  buildOutreachDraft,
} from "./prospects";
export { evaluateProspectQuality } from "./prospect-quality";
export {
  classifyBacklinkExportValidity,
  isProductionEligibleExport,
  isExampleOrPlaceholderDomain,
} from "./validity";
export {
  computeBacklinkExportMetrics,
  classifyTargetPath,
  loadReferringDomainSnapshot,
} from "./metrics";
export {
  loadDigitalPrTracking,
  saveDigitalPrTracking,
  upsertDigitalPrTracking,
  getDigitalPrTrackingPath,
} from "./tracking";
export { analyzeLinkOpportunities } from "./analyze";
export { formatWeeklyLinkOpportunitiesMarkdown } from "./report";
export { inventoryAndScoreLinkableAssets } from "./assets";
export { buildAssetOutreachPriorities } from "./asset-outreach";
export { computeCompetitorLinkGaps } from "./gap";
export type { AnalyzeLinkOpportunitiesOptions } from "./analyze";
export type * from "./types";
export { LINK_OPPORTUNITY_ENGINE_VERSION } from "./types";
