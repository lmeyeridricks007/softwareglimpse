import type { BudgetBand } from "@/domain";

export type CrmFinderWeightKey =
  | "useCaseFit"
  | "requiredFeatures"
  | "preferredFeatures"
  | "businessSizeFit"
  | "integrations"
  | "priorities"
  | "budgetFit"
  | "businessTypeFit";

export type CrmFinderConfig = {
  version: string;
  weights: Record<CrmFinderWeightKey, number>;
  /** Percentage points — scores within this range may share a tie label. */
  tieThresholdPoints: number;
  /**
   * Minimum fraction of applicable weight that must be known for a product
   * to appear in soft-ranked results.
   */
  minEligibleDataScore: number;
  /** Max EUR per user / month for each budget band. null = no limit. */
  budgetBandsEurPerUser: Record<BudgetBand, number | null>;
  hardExcludeIfRequiredFeatureNotSupported: boolean;
  unknownDoesNotExclude: boolean;
};

export const crmFinderConfig: CrmFinderConfig = {
  version: "crm-finder-v1",
  weights: {
    useCaseFit: 0.28,
    requiredFeatures: 0.2,
    preferredFeatures: 0.08,
    businessSizeFit: 0.14,
    integrations: 0.08,
    priorities: 0.12,
    budgetFit: 0.07,
    businessTypeFit: 0.03,
  },
  tieThresholdPoints: 2,
  minEligibleDataScore: 0.5,
  budgetBandsEurPerUser: {
    "under-15": 15,
    "15-30": 30,
    "30-60": 60,
    "60-100": 100,
    "100-plus": null,
    "no-limit": null,
  },
  hardExcludeIfRequiredFeatureNotSupported: true,
  unknownDoesNotExclude: true,
};

export function finderConfigForCategory(slug: string): CrmFinderConfig {
  return {
    ...crmFinderConfig,
    version: `${slug}-finder-v1`,
  };
}
