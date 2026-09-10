export type {
  ComparisonCriterionRow,
  ComparisonFeatureRow,
  ComparisonPageModel,
  ComparisonPageProduct,
  QualitativeStrength,
} from "./types";
export type {
  ComparisonDecisionNarrative,
  CategoryWinnerRow,
  RealDifference,
  SeatScenarioRow,
  IntegrationCompare,
} from "./decision-narrative";
export {
  COMPARISON_PAGE_TABS,
  getComparisonPageTab,
  isComparisonPageTabId,
  type ComparisonPageTabId,
} from "./tabs";
export {
  buyerFacingOutcomeLabel,
  comparisonPublicCopy,
  firstComparisonPublicCopy,
  isComparisonInternalCopy,
  rewriteComparisonCopy,
} from "./public-copy";

/**
 * Intentionally does NOT re-export buildComparisonPageModel or
 * buildDecisionNarrative helpers that pull Node-only stores.
 * Server pages must import builders from:
 *   `@/services/comparison-page/build-page-model`
 *   `@/services/comparison-page/decision-narrative` (pure; OK if needed)
 */
