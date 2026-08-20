export {
  computeWeightedOverall,
  validateCriterionAssessment,
  buildProvisionalAssessmentsFromEnrichment,
  provisionalAssessmentsForProduct,
  CRITERION_FEATURE_MAP,
  FEATURE_AVAILABILITY_SCORE,
} from "./scoring";

export { buildSoftwareReviewBrief } from "./build-brief";

export {
  type EditorialGenerator,
  DeterministicEditorialGenerator,
  ManualEditorialGenerator,
} from "./generator";

export {
  validateEditorialDraft,
  type DraftValidationResult,
} from "./validate-draft";

export {
  evaluateSoftwareReviewQuality,
  evaluateEditorialComparisonQuality,
  evaluateEditorialAlternativesQuality,
  evaluateEditorialBestQuality,
  evaluatePageQuality,
  type EditorialQualityResult,
} from "./quality";

export {
  resolveAffectedPages,
  type AffectedPage,
} from "./dependencies";

export {
  rankRecommendationCandidates,
  assessmentToCandidateSignal,
  type RecommendationCandidate,
  type RankCandidatesInput,
} from "./recommendation-engine";

export {
  titleTemplates,
  renderTitle,
  buildPageTitle,
  type TitleTokens,
} from "./title-templates";

export {
  buildEditorialCompletenessReport,
  buildSoftwareEditorialCompleteness,
  formatEditorialCompletenessReport,
  type CompletenessStatus,
  type EditorialCompletenessReport,
} from "./completeness-report";

export {
  generateEditorial,
  type GenerateOptions,
  type GenerateResult,
} from "./generate";

export {
  validateEditorialRepository,
  type EditorialValidationIssue,
  type EditorialValidationReport,
} from "./validate";

export {
  buildEditorialReport,
  formatEditorialReport,
  type EditorialReport,
} from "./report";

export {
  scoreLabel,
  formatScoreWithLabel,
} from "./score-labels";

export {
  CTA_BUDGET_BY_PAGE_TYPE,
  getCtaBudget,
  maxCtasForPlacement,
  canPlaceCta,
  type CtaPlacement,
  type CtaBudget,
} from "./cta-rules";

export {
  markDependentPagesRefreshNeeded,
  listStaleSeedDependencies,
  type RefreshMarkResult,
} from "./refresh";
