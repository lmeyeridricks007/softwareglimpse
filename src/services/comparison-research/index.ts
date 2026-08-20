export {
  buildCrmComparisonsFromResearch,
  crmComparisonCoverageReport,
  listCrmProductSlugs,
} from "./materialize-crm-comparisons";
export {
  buildCompetitorPairComparisonsFromResearch,
  competitorPairMaterializeReport,
  clustersAreSubstitutes,
  listEligibleCompetitorPairs,
} from "./materialize-competitor-pairs";
export {
  attachExistingSupportingFacts,
  existingFactIdsForCriterion,
  softenUnfactedProductA,
} from "./attach-supporting-facts";
export {
  confidenceForAssessmentOutcome,
  confidenceForFeatureBundle,
  confidenceForPricingOutcome,
  normalizeOutcomeConfidence,
} from "./comparison-confidence";
export {
  isThinComparisonMesh,
  researchedAvailabilityTieReason,
} from "./distinctive-research";
export {
  researchedFeatureOutcome,
  researchedFreePlanOutcome,
} from "./researched-factual";
