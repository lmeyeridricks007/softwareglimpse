import type { BudgetBand } from "@/domain";
import type { CrmFinderConfig } from "@/data/config/recommendation/crm-finder-v1";

/**
 * Sales Intelligence Finder methodology config.
 * Weights mirror CRM Finder — scoring math is shared via recommendForCategory.
 * Budget bands stay EUR/user/month; credit-based SI pricing often unknown → soft budgetFit.
 */
export const siFinderConfig: CrmFinderConfig = {
  version: "si-finder-v1",
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
  } satisfies Record<BudgetBand, number | null>,
  hardExcludeIfRequiredFeatureNotSupported: true,
  unknownDoesNotExclude: true,
};
