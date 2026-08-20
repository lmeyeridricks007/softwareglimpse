import type { ResearchDomain } from "@/domain";
import { loadActivatedCategory } from "@/data/category-onboarding/store";

/**
 * Category-independent onboarding policy.
 * Workflow decisions live here — not in CLI handlers.
 */
export const onboardingPolicy = {
  requireIdentity: true,
  requirePrimaryCategory: true,
  /** Completeness % below this blocks READY (research stage may still complete). */
  minResearchPercentForReady: 60,
  /** Completeness % below this marks research stage as blocked/incomplete. */
  minResearchPercentForContent: 40,
  maxDefaultComparisons: 5,
  minApprovedAlternativesForPage: 2,
  requireRelationshipScan: true,
  requireContentPlan: true,
  requireValidation: true,
  /** Affiliate absence never blocks product onboarding. */
  affiliateRequired: false,
  /** Never auto-publish or assign editorial scores during onboarding. */
  allowAutoPublish: false,
  allowAutoEditorialScores: false,
  allowAutoBestRanking: false,
} as const;

export type OnboardingPolicy = typeof onboardingPolicy;

/**
 * Category overrides for research domains + readiness gates.
 * Keys are primary category slugs.
 */
export type CategoryOnboardingOverride = {
  requiredResearchDomains: ResearchDomain[];
  optionalResearchDomains: ResearchDomain[];
  /** Methodology / feature-map readiness for content generation. */
  categoryContentReady: boolean;
  finder: "crm" | "sales-intelligence" | "none" | "future";
  pricingModelsSupported: Array<
    "per-seat" | "flat" | "contact-tiers" | "usage" | "credits" | "custom" | "hybrid"
  >;
  notes: string[];
};

export const categoryOnboardingOverrides: Record<
  string,
  CategoryOnboardingOverride
> = {
  crm: {
    requiredResearchDomains: [
      "identity",
      "pricing",
      "plans",
      "features",
      "integrations",
      "ai-capabilities",
      "free-trial",
      "support",
    ],
    optionalResearchDomains: [
      "free-plan",
      "limits",
      "security-compliance",
      "product-positioning",
      "use-cases",
      "business-size-fit",
    ],
    categoryContentReady: true,
    finder: "crm",
    pricingModelsSupported: ["per-seat", "flat", "custom", "hybrid"],
    notes: [
      "Requires CRM feature map + methodology",
      "Eligible for CRM Finder when enrichment present",
    ],
  },
  "sales-intelligence": {
    requiredResearchDomains: [
      "identity",
      "pricing",
      "plans",
      "features",
      "integrations",
      "free-trial",
    ],
    optionalResearchDomains: [
      "ai-capabilities",
      "limits",
      "product-positioning",
    ],
    categoryContentReady: true,
    finder: "sales-intelligence",
    pricingModelsSupported: ["per-seat", "flat", "credits", "usage", "custom"],
    notes: [
      "Sales Intelligence hub supported; dedicated SI Finder available",
    ],
  },
  marketing: {
    requiredResearchDomains: [
      "identity",
      "pricing",
      "plans",
      "features",
      "integrations",
      "free-trial",
      "limits",
    ],
    optionalResearchDomains: [
      "ai-capabilities",
      "product-positioning",
      "support",
      "free-plan",
    ],
    /** Parent hub — prefer email-marketing subcategory when activated. */
    categoryContentReady: false,
    finder: "none",
    pricingModelsSupported: ["contact-tiers", "flat", "usage", "custom", "hybrid"],
    notes: [
      "Contact-tier pricing often required for email tools",
      "Prefer email-marketing subcategory once Category Onboarding activates it",
    ],
  },
};

export const defaultCategoryOverride: CategoryOnboardingOverride = {
  requiredResearchDomains: [
    "identity",
    "pricing",
    "plans",
    "features",
    "integrations",
  ],
  optionalResearchDomains: [
    "ai-capabilities",
    "free-trial",
    "support",
    "product-positioning",
  ],
  categoryContentReady: false,
  finder: "future",
  pricingModelsSupported: ["flat", "per-seat", "custom"],
  notes: ["Generic category — content may be category-blocked"],
};

/**
 * Resolve override from activated category definition first,
 * then static policy table. Category Onboarding flips readiness via activation.
 */
export function getCategoryOnboardingOverride(
  categorySlug: string,
): CategoryOnboardingOverride {
  try {
    const activated = loadActivatedCategory(categorySlug);
    if (activated) {
      const def = activated.definition;
      return {
        requiredResearchDomains: def.requiredResearchDomains.length
          ? def.requiredResearchDomains
          : (def.researchRequirements
              .filter((r) => r.level === "required")
              .map((r) => r.domain)
              .filter((d): d is ResearchDomain => typeof d === "string") as ResearchDomain[]),
        optionalResearchDomains: def.optionalResearchDomains,
        categoryContentReady: true,
        finder:
          def.finderReadiness === "UI_READY" || def.finderReadiness === "ENGINE_READY"
            ? categorySlug === "crm"
              ? "crm"
              : categorySlug === "sales-intelligence"
                ? "sales-intelligence"
                : "future"
            : def.finderReadiness === "DATA_MODEL_READY"
              ? "future"
              : "none",
        pricingModelsSupported: def.pricingModelsSupported,
        notes: [
          ...def.notes,
          `Activated category config v${def.configVersion}`,
        ],
      };
    }
  } catch {
    // fall through to static table
  }
  return categoryOnboardingOverrides[categorySlug] ?? defaultCategoryOverride;
}
