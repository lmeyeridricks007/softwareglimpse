/**
 * Catalogue commercial priority weights — planning layer only.
 * Must never feed editorial / recommendation ranking.
 */
export const cataloguePriorityWeights = {
  historicalConversionCommission: 0.25,
  existingTrafficDemand: 0.2,
  categoryStrategicPriority: 0.2,
  existingContentEquity: 0.1,
  categoryReadiness: 0.1,
  affiliateStatus: 0.1,
  implementationEffort: 0.05,
} as const;

export const catalogueBatchDefaults = {
  maxProducts: 5,
  minProducts: 3,
  /** Safety: never discover external software in bulk planner. */
  catalogueScope: "existing-only" as const,
};

/** Strategic category preference for cluster completion (not editorial ranking). */
export const categoryStrategicWeights: Record<string, number> = {
  crm: 1,
  "sales-intelligence": 0.95,
  "email-marketing": 0.9,
  marketing: 0.75,
  "customer-service": 0.7,
  "business-communications": 0.65,
  "project-management": 0.6,
  hr: 0.55,
  ai: 0.5,
  "it-development": 0.4,
  ecommerce: 0.45,
};
