/**
 * Priority score weights (sum ≈ 1.0).
 *
 * commercialOpportunity is planning-only: it may boost editorial queue priority
 * when an optional commercialBoost is supplied. It MUST NEVER feed product
 * recommendation rankings (recommendCrm / finder scoring).
 */
export const opportunityWeights = {
  demand: 0.25,
  strikingDistance: 0.2,
  purchaseIntent: 0.2,
  researchReadiness: 0.1,
  topicalAuthority: 0.1,
  /** Planning-only commercial/affiliate signal — never product ranking. */
  commercialOpportunity: 0.1,
  effortInverse: 0.05,
} as const;

export type OpportunityWeightKey = keyof typeof opportunityWeights;
