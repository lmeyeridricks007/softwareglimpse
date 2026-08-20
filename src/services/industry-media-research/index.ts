export type {
  IndustryMediaResearchStage,
  DiscoverIndustryOfficialVideoInput,
  VerifyIndustryOfficialSourceInput,
  ClassifyIndustryOfficialVideoInput,
  SubmitIndustryEditorialReviewInput,
  ActivateIndustryOfficialVideoInput,
  MarkIndustryUnavailableInput,
  FlagIndustryMediaHealthInput,
  IndustryMediaWorkflowResult,
  IndustryVisualCoverageReport,
} from "./types";
export {
  INDUSTRY_MEDIA_STAGE_STATUS,
  INDUSTRY_VIDEO_DISCOVERY_TYPES,
} from "./types";

export {
  findDuplicateResearchMedia,
  findDuplicateAcrossCatalog,
  mediaProviderKey,
} from "@/services/feature-media-research/duplicates";

export {
  isLikelyGenericBrandMarketing,
  resolveIndustryMediaStage,
  discoverIndustryOfficialVideo,
  verifyIndustryOfficialSource,
  classifyIndustryOfficialVideo,
  submitIndustryEditorialReview,
  activateIndustryOfficialVideo,
  markIndustryOfficialVideoUnavailable,
  flagIndustryMediaHealth,
  mapVideoToAdditionalIndustry,
  mapIndustryResearchTags,
} from "./lifecycle";

export {
  buildIndustryVisualCoverageReport,
  formatIndustryVisualCoverageReportText,
} from "./coverage-report";

export {
  listCatalogResearchMedia,
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
  productHasEnrichment,
  evaluateIndustryMediaHealth,
} from "./persist";
