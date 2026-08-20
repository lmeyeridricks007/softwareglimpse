export {
  buildFeatureDetailModel,
  getFeatureDetailPage,
  toEvidenceCellStatus,
} from "./build-page-model";
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
export type { FeatureSeeInActionCard } from "@/services/product-media/feature-page-media";
export { validateFeatureDetailPage } from "./quality-gate";
export type { FeaturePageGateIssue } from "./quality-gate";
export {
  buildMatrixCellEvidence,
  mediaMatchesEvaluationDimension,
  matrixEvidenceIndicatorLabel,
} from "./matrix-cell-evidence";
export type {
  MatrixCellEvidence,
  MatrixCellDocSource,
  MatrixCellScreenshot,
} from "./matrix-cell-evidence";
