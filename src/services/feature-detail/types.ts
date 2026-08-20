/**
 * Client-safe type surface for Feature Detail pages.
 * Do not import `@/services/feature-detail` (barrel) from client components —
 * that entry re-exports server builders that read research files via node:fs.
 */
export type {
  FeatureConfidence,
  FeatureDepthLabel,
  FeatureDetailModel,
  FeatureDimensionCell,
  FeatureDimensionCellEvidence,
  FeatureProductRow,
  FeatureScreenshot,
  FeatureSupportStatus,
} from "./build-page-model";
