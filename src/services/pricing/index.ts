/**
 * Pure pricing engine — safe for client bundles.
 * Server-only loaders live in `./server`.
 */
export { evaluateRule, sumEvaluated } from "./evaluate-rule";
export { calculatePlanCost, isCalculablePlan } from "./plan-cost";
export { resolvePlanDisplayPrice } from "./plan-display-price";
export type { PlanDisplayPrice } from "./plan-display-price";
export {
  findMinimumSuitablePlan,
  planMaxSeats,
  planAllowsSeatCount,
} from "./plan-resolver";
export { canCalculatePricing, isPricingStale } from "./eligibility";
export {
  derivePricingConfidence,
  confidenceFromSnapshot,
} from "./confidence";
export { calculateProductCost } from "./calculate";
export { compareProductCosts } from "./compare";
export { summarizeFeatureCoverage } from "./feature-coverage";
export type { FeatureCoverageSummary } from "./feature-coverage";
export {
  listCalculableEstimates,
  sameCurrencyCode,
  deriveCostRangeSummary,
  positionInRangeLabel,
  buildPricingInsights,
} from "./cost-summary";
export type {
  CalculableEstimate,
  CostRangeSummary,
  PricingInsight,
} from "./cost-summary";
export type {
  PricingSnapshot,
  EvaluatedRuleCost,
  PlanCostResult,
  PlanResolution,
  PlanResolutionKind,
  EligibilityResult,
  CompareSortMode,
  CalculateOptions,
  CompareOptions,
} from "./types";
