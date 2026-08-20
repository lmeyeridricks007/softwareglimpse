export { selectCrmCandidates, selectCandidatesByCategory } from "./candidates";
export {
  evaluateEligibility,
  isFinderEligible,
} from "./eligibility";
export { scoreSnapshot } from "./scoring";
export {
  deriveConfidence,
  requiredFeatureUnknownRatio,
} from "./confidence";
export { explainRecommendation } from "./explanation";
export { estimateMonthlyTotal } from "./pricing-fit";
export {
  recommendCrm,
  recommendForCategory,
  recommendSalesIntelligence,
} from "./recommend";
export type { RecommendCrmResult } from "./recommend";
export {
  normalizeCrmFinderAnswers,
  normalizeSiFinderAnswers,
  normalizeCategoryFinderAnswers,
  easePreferenceToPriorities,
} from "./normalize";
export {
  buildProductSnapshot,
  buildProductSnapshots,
  deriveResearchCompleteness,
} from "./build-snapshot";
export { formatScoreBreakdown } from "./debug";
export type {
  ProductRecommendationSnapshot,
  EligibilityResult,
  EligibilityExclusion,
  ScoredCandidate,
  EmptyRecommendReason,
  SnapshotFeatureSupport,
  SnapshotIntegrationSupport,
  SnapshotPricing,
} from "./types";
