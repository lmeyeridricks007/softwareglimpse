export { AFFILIATE_FUNNEL_VERSION } from "./types";
export type {
  AffiliateClickEvent,
  AffiliateClickStore,
  AffiliateClickAggregates,
  AffiliateConversionRow,
  AffiliateConversionStore,
  AffiliateFunnelValidity,
  AffiliateFunnelReport,
} from "./types";
export {
  affiliateClicksPath,
  affiliateConversionsPath,
  loadAffiliateClickStore,
  saveAffiliateClickStore,
  ensureAffiliateClickStore,
  loadAffiliateConversionStore,
  saveAffiliateConversionStore,
  ensureAffiliateConversionPlaceholder,
  recomputeClickAggregates,
} from "./store";
export {
  recordAffiliateClick,
  sanitizeSourcePage,
  sanitizeReferrerHost,
  inferTrafficSource,
} from "./record-click";
export type { RecordAffiliateClickInput } from "./record-click";
export {
  importAffiliateClicksFromFile,
  importAffiliateConversionsFromFile,
  discoverLatestConversionExport,
  ensureAffiliateImportDirs,
  loadFunnelStores,
  looksFixturePath,
} from "./ingest";
export {
  parseNetworkExportPayload,
  parseCsv,
  mapRowToConversion,
} from "./adapters";
export {
  buildAffiliateFunnelReport,
  matchConversionsToClicks,
  recomputeConversionMoney,
  classifyFunnelValidity,
} from "./funnel";
