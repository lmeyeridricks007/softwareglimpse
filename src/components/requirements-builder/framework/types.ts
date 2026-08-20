/**
 * Category-agnostic Requirements Builder framework types.
 * Concrete categories supply a definition; UI shell stays reusable.
 */

export type RequirementBuilderStageDef = {
  id: string;
  label: string;
  shortLabel?: string;
};

export type RequirementsBuilderDefinition = {
  id: string;
  categorySlug: string;
  storageKey: string;
  title: string;
  productNoun: string;
  estimatedMinutes: string;
  methodologyHref: string;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  scorecardHref: string | null;
  stages: RequirementBuilderStageDef[];
};
