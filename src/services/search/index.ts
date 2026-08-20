export type * from "./types";
export { SEARCH_RESULT_TYPES, SEARCH_FILTER_TYPES } from "./types";
export {
  buildSearchIndex,
  buildSearchIndexFromSources,
  __resetSearchIndexCache,
  getSearchIndexSize,
  getSearchRuntime,
} from "./build-index";
export { runSearch } from "./query";
export { getTypeLabel } from "./labels";
export { suggestSearch } from "./suggest";
export { buildDiscoveryHub } from "./discovery";
export { detectSearchIntent } from "./intent";
export { scoreDocuments } from "./score";
export { CURATED_TRY_QUERIES, relatedSearchesForQuery } from "./curated-queries";
export { expandSynonyms, synonymBoostTerms } from "./synonyms";
export { trackSearchEvent } from "./analytics";
export type { SearchAnalyticsEventName } from "./analytics";
export { searchCatalog } from "./catalog-search";
export {
  runSearchQualityAgent,
  writeSearchQualityReport,
  formatSearchQualityMarkdown,
} from "./quality-agent";
export {
  runSearchDemandOpportunityAgent,
  writeSearchDemandReports,
} from "./demand-agent";
export { SEARCH_RELEVANCE_FIXTURES } from "./fixtures";
