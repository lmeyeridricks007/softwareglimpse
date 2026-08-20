export type {
  CapabilityMediaResearchStage,
  DiscoverCapabilityOfficialVideoInput,
  VerifyCapabilityOfficialSourceInput,
  ClassifyCapabilityOfficialVideoInput,
  SubmitCapabilityEditorialReviewInput,
  ActivateCapabilityOfficialVideoInput,
  MarkCapabilityUnavailableInput,
  CapabilityMediaWorkflowResult,
  CapabilityVisualCoverageProduct,
  CapabilityVisualCoverageReport,
} from "./types";
export {
  CAPABILITY_MEDIA_STAGE_STATUS,
  CAPABILITY_VIDEO_DISCOVERY_TYPES,
} from "./types";

export {
  findDuplicateResearchMedia,
  findDuplicateAcrossCatalog,
  mediaProviderKey,
} from "@/services/feature-media-research/duplicates";

export {
  resolveCapabilityMediaStage,
  discoverCapabilityOfficialVideo,
  verifyCapabilityOfficialSource,
  classifyCapabilityOfficialVideo,
  submitCapabilityEditorialReview,
  activateCapabilityOfficialVideo,
  markCapabilityOfficialVideoUnavailable,
  mapVideoToAdditionalCapability,
  mapCapabilityResearchTags,
} from "./lifecycle";

export {
  buildCapabilityVisualCoverageReport,
  formatCapabilityVisualCoverageReportText,
} from "./coverage-report";

export {
  listCatalogResearchMedia,
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
  productHasEnrichment,
} from "./persist";
