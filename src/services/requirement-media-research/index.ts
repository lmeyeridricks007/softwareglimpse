export type {
  RequirementMediaResearchStage,
  CriterionCoverageStatus,
  RequirementCriterionCoverage,
  DiscoverRequirementOfficialVideoInput,
  VerifyRequirementOfficialSourceInput,
  ClassifyRequirementOfficialVideoInput,
  SubmitRequirementEditorialReviewInput,
  ActivateRequirementOfficialVideoInput,
  MarkRequirementUnavailableInput,
  RequirementMediaWorkflowResult,
  RequirementEvidenceCoverageLevel,
  RequirementVisualCoverageProduct,
  RequirementVisualCoverageReport,
} from "./types";
export {
  REQUIREMENT_MEDIA_STAGE_STATUS,
  REQUIREMENT_VIDEO_DISCOVERY_TYPES,
} from "./types";

export {
  findDuplicateResearchMedia,
  findDuplicateAcrossCatalog,
  mediaProviderKey,
} from "@/services/feature-media-research/duplicates";

export {
  isLikelyGenericBrandMarketing,
  resolveRequirementMediaStage,
  discoverRequirementOfficialVideo,
  verifyRequirementOfficialSource,
  classifyRequirementOfficialVideo,
  buildExplicitCriterionCoverage,
  submitRequirementEditorialReview,
  activateRequirementOfficialVideo,
  markRequirementOfficialVideoUnavailable,
  mapVideoToAdditionalRequirement,
  mapRequirementResearchTags,
} from "./lifecycle";

export {
  buildRequirementVisualCoverageReport,
  formatRequirementVisualCoverageReportText,
} from "./coverage-report";

export {
  listCatalogResearchMedia,
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
  productHasEnrichment,
  evaluateRequirementMediaHealth,
} from "./persist";
