import {
  CrmFinderAnswersSchema,
  CrmFinderCriteriaSchema,
  type CrmFinderAnswers,
  type CrmFinderCriteria,
  type CrmFinderPriorities,
  type EasePreference,
  type FinderCategorySlug,
  type SiFinderAnswers,
} from "@/domain";
import {
  crmFinderConfig,
  type CrmFinderConfig,
} from "@/data/config/recommendation/crm-finder-v1";
import { siFinderConfig } from "@/data/config/recommendation/si-finder-v1";

const BALANCED_PRIORITIES: CrmFinderPriorities = {
  "ease-of-use": 0.5,
  "fast-setup": 0.5,
  customization: 0.5,
  "minimal-admin": 0.5,
};

function normalizeFinderAnswers(
  answers: CrmFinderAnswers,
  config: CrmFinderConfig,
  categorySlug: FinderCategorySlug,
): CrmFinderCriteria {
  const parsed = CrmFinderAnswersSchema.parse(answers);
  const budgetBand = parsed.budgetBand ?? "no-limit";
  const budgetPerUserMax = config.budgetBandsEurPerUser[budgetBand];

  return CrmFinderCriteriaSchema.parse({
    categorySlug,
    companySizeSlug: parsed.companySizeSlug,
    crmUsers: parsed.crmUsers,
    primaryUseCaseSlug: parsed.primaryUseCaseSlug,
    secondaryUseCaseSlugs: parsed.secondaryUseCaseSlugs ?? [],
    requiredFeatureSlugs: parsed.requiredFeatureSlugs ?? [],
    preferredFeatureSlugs: parsed.preferredFeatureSlugs ?? [],
    preferredIntegrationSlugs: parsed.preferredIntegrationSlugs ?? [],
    budgetPerUserMax,
    budgetMode: "per-user-month",
    priorities: easePreferenceToPriorities(parsed.easePreference),
    businessTypeSlug: parsed.businessTypeSlug,
    methodologyVersion: config.version,
  });
}

/**
 * Map UI answers → normalized CrmFinderCriteria.
 */
export function normalizeCrmFinderAnswers(
  answers: CrmFinderAnswers,
  config: CrmFinderConfig = crmFinderConfig,
): CrmFinderCriteria {
  return normalizeFinderAnswers(answers, config, "crm");
}

/** Map SI Finder UI answers → criteria with categorySlug sales-intelligence. */
export function normalizeSiFinderAnswers(
  answers: SiFinderAnswers,
  config: CrmFinderConfig = siFinderConfig,
): CrmFinderCriteria {
  return normalizeFinderAnswers(answers, config, "sales-intelligence");
}

/** Map category Finder UI answers → criteria with the given categorySlug. */
export function normalizeCategoryFinderAnswers(
  answers: CrmFinderAnswers,
  config: CrmFinderConfig,
  categorySlug: FinderCategorySlug,
): CrmFinderCriteria {
  return normalizeFinderAnswers(answers, config, categorySlug);
}

export function easePreferenceToPriorities(
  preference: EasePreference | undefined,
): CrmFinderPriorities {
  switch (preference) {
    case "easy-setup":
      return {
        "ease-of-use": 1,
        "fast-setup": 1,
        customization: 0.2,
        "minimal-admin": 0.9,
      };
    case "advanced-customization":
      return {
        "ease-of-use": 0.3,
        "fast-setup": 0.25,
        customization: 1,
        "minimal-admin": 0.3,
      };
    case "balanced":
    default:
      return { ...BALANCED_PRIORITIES };
  }
}
