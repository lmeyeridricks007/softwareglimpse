/**
 * Catalogue accessors only.
 *
 * Do not re-export guides, editorial, or research from this barrel — importing
 * `@/data` for software/categories would otherwise evaluate those heavy modules
 * on every page that only needs the catalogue. Import those from:
 *   `@/data/repositories/guides`
 *   `@/data/editorial/store`
 *   `@/data/research/store`
 */
export {
  __resetDataCaches,
  getSoftware,
  getSoftwareBySlug,
  getAllSoftwareUnfiltered,
  getCategories,
  getAllCategoriesUnfiltered,
  getCategoryBySlug,
  getCategoryByPath,
  getChildCategories,
  getChildCategoriesIncludingSupported,
  getTopLevelCategories,
  getSoftwareByCategory,
  getPrimarySoftwareByCategory,
  getCategoryMembershipStrength,
  getRelationships,
  getComparisons,
  getAllComparisonsUnfiltered,
  getComparisonBySlug,
  getComparisonsForProduct,
  getAlternativesPages,
  getAllAlternativesUnfiltered,
  getAlternativesPageBySlug,
  getBestPages,
  getAllBestPagesUnfiltered,
  getBestPageBySlug,
  getIndustries,
  getAllIndustriesUnfiltered,
  getIndustryBySlug,
  getMigrationRecords,
  getBusinessSizes,
  getTeamTypes,
  getBusinessTypes,
  getUseCases,
  getCapabilities,
  getCapabilityBySlug,
  getResources,
  getAllResourcesUnfiltered,
  getResourceBySlug,
  getUserPriorities,
  getAudiences,
  getAllAudiencesUnfiltered,
  getAudienceBySlug,
  getScoringCriteria,
  getComparisonCriteria,
  parseSoftware,
  safeParseSoftware,
  safeParseRelationship,
  safeParseAlternativesPage,
  safeParseComparison,
} from "./repositories/catalog";
