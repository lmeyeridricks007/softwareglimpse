export type {
  ComparisonCriterionRow,
  ComparisonFeatureRow,
  ComparisonPageModel,
  ComparisonPageProduct,
  QualitativeStrength,
} from "./types";
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
 * Intentionally does NOT re-export buildComparisonPageModel.
 * That module uses node:fs via research/editorial stores — importing it from
 * this barrel would pull Node into client chunks (Turbopack).
 *
 * Server pages must import the builder from:
 *   `@/services/comparison-page/build-page-model`
 */
