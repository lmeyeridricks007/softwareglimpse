export type {
  FeatureMediaResearchStage,
  DiscoverOfficialVideoInput,
  VerifyOfficialSourceInput,
  ClassifyOfficialVideoInput,
  SubmitEditorialReviewInput,
  ActivateOfficialVideoInput,
  MarkUnavailableInput,
  FeatureMediaWorkflowResult,
  FeatureVisualCoverageProduct,
  FeatureVisualCoverageReport,
} from "./types";
export { FEATURE_MEDIA_STAGE_STATUS } from "./types";

export {
  findDuplicateResearchMedia,
  findDuplicateAcrossCatalog,
  mediaProviderKey,
} from "./duplicates";

export {
  resolveFeatureMediaStage,
  discoverOfficialVideo,
  verifyOfficialSource,
  classifyOfficialVideo,
  submitEditorialReview,
  activateOfficialVideo,
  markOfficialVideoUnavailable,
  mapVideoToAdditionalFeature,
} from "./lifecycle";

export {
  buildFeatureVisualCoverageReport,
  formatFeatureVisualCoverageReportText,
} from "./coverage-report";

export {
  upsertResearchMediaInEnrichment,
  listEnrichmentMedia,
} from "./persist";
