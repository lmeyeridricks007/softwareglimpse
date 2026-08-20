export type {
  UseCaseMediaResearchStage,
  WorkflowStepCoverageStatus,
  UseCaseWorkflowStepCoverage,
  DiscoverUseCaseOfficialVideoInput,
  VerifyUseCaseOfficialSourceInput,
  ClassifyUseCaseOfficialVideoInput,
  SubmitUseCaseEditorialReviewInput,
  ActivateUseCaseOfficialVideoInput,
  MarkUseCaseUnavailableInput,
  UseCaseMediaWorkflowResult,
  UseCaseVisualCoverageProduct,
  UseCaseVisualCoverageReport,
} from "./types";
export {
  USE_CASE_MEDIA_STAGE_STATUS,
  USE_CASE_VIDEO_DISCOVERY_TYPES,
} from "./types";

export {
  findDuplicateResearchMedia,
  findDuplicateAcrossCatalog,
  mediaProviderKey,
} from "@/services/feature-media-research/duplicates";

export {
  isLikelyGenericBrandMarketing,
  resolveUseCaseMediaStage,
  discoverUseCaseOfficialVideo,
  verifyUseCaseOfficialSource,
  classifyUseCaseOfficialVideo,
  buildExplicitWorkflowCoverage,
  submitUseCaseEditorialReview,
  activateUseCaseOfficialVideo,
  markUseCaseOfficialVideoUnavailable,
  mapVideoToAdditionalUseCase,
  mapUseCaseResearchTags,
} from "./lifecycle";

export {
  buildUseCaseVisualCoverageReport,
  formatUseCaseVisualCoverageReportText,
} from "./coverage-report";

export {
  listCatalogResearchMedia,
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
  productHasEnrichment,
  evaluateUseCaseMediaHealth,
} from "./persist";
