/**
 * Graph-driven internal linking — shared types.
 * Relationships follow docs/content-ecosystem/03-crm-linking-architecture.md
 */

export type GraphRelation =
  | "parent"
  | "child"
  | "supports"
  | "supportedBy"
  | "related"
  | "nextStep"
  | "previousStep"
  | "explains"
  | "implements"
  | "requires"
  | "satisfies"
  | "compares"
  | "alternativeTo"
  | "relevantToIndustry"
  | "relevantToUseCase"
  | "toolFor"
  | "resourceFor"
  | "pricingFor";

export type LinkModuleId =
  | "parentHub"
  | "relatedGuides"
  | "relatedProducts"
  | "relatedComparisons"
  | "relatedCapabilities"
  | "relatedRequirements"
  | "relatedFeatures"
  | "relatedUseCases"
  | "relatedIndustries"
  | "relatedResources"
  | "recommendedNextStep"
  | "tryDecisionTool";

export type LinkEntityType =
  | "home"
  | "hub"
  | "category"
  | "software"
  | "comparison"
  | "alternatives"
  | "best"
  | "guide"
  | "industry"
  | "use-case"
  | "capability"
  | "requirement"
  | "feature"
  | "resource"
  | "audience"
  | "tool"
  | "pricing"
  | "company"
  | "legal";

export type ContextualLink = {
  /** Canonical pathname with trailing slash (absolute URL resolved at render/SEO time). */
  href: string;
  label: string;
  relationship: GraphRelation;
  module: LinkModuleId;
  /** Higher = preferred when trimming to 3–6. */
  score: number;
  entityType: LinkEntityType;
  description?: string;
};

export type PageLinkPlan = {
  sourcePath: string;
  sourceType: LinkEntityType;
  parentHub: ContextualLink[];
  relatedGuides: ContextualLink[];
  relatedProducts: ContextualLink[];
  relatedComparisons: ContextualLink[];
  relatedCapabilities: ContextualLink[];
  relatedRequirements: ContextualLink[];
  relatedFeatures: ContextualLink[];
  relatedUseCases: ContextualLink[];
  relatedIndustries: ContextualLink[];
  relatedResources: ContextualLink[];
  recommendedNextStep: ContextualLink[];
  tryDecisionTool: ContextualLink[];
};

export const EMPTY_LINK_PLAN = (
  sourcePath: string,
  sourceType: LinkEntityType,
): PageLinkPlan => ({
  sourcePath,
  sourceType,
  parentHub: [],
  relatedGuides: [],
  relatedProducts: [],
  relatedComparisons: [],
  relatedCapabilities: [],
  relatedRequirements: [],
  relatedFeatures: [],
  relatedUseCases: [],
  relatedIndustries: [],
  relatedResources: [],
  recommendedNextStep: [],
  tryDecisionTool: [],
});

export const MODULE_LIMITS: Record<LinkModuleId, { min: number; max: number }> =
  {
    parentHub: { min: 1, max: 2 },
    relatedGuides: { min: 0, max: 4 },
    relatedProducts: { min: 0, max: 6 },
    relatedComparisons: { min: 0, max: 4 },
    relatedCapabilities: { min: 0, max: 6 },
    relatedRequirements: { min: 0, max: 6 },
    relatedFeatures: { min: 0, max: 6 },
    relatedUseCases: { min: 0, max: 6 },
    relatedIndustries: { min: 0, max: 6 },
    relatedResources: { min: 0, max: 3 },
    recommendedNextStep: { min: 0, max: 3 },
    tryDecisionTool: { min: 0, max: 3 },
  };
