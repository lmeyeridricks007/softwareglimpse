import type { ResearchDomain, ResearchPlan } from "@/domain";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";

/**
 * Category-aware research plan — not product-specific hardcoding.
 */
export function buildResearchPlan(input: {
  productSlug: string;
  primaryCategorySlug: string;
}): ResearchPlan {
  const override = getCategoryOnboardingOverride(input.primaryCategorySlug);
  const required = [...override.requiredResearchDomains] as ResearchDomain[];
  const optional = [...override.optionalResearchDomains] as ResearchDomain[];

  return {
    productSlug: input.productSlug,
    primaryCategorySlug: input.primaryCategorySlug,
    requiredDomains: required,
    optionalDomains: optional,
    notes: [
      ...override.notes,
      "Orchestrator calls existing research pipeline — does not scrape itself",
      "Fixtures are labeled and never treated as live vendor truth without review",
    ],
  };
}
