/**
 * Category-agnostic Finder framework types.
 * Concrete finders (CRM, etc.) supply a definition; UI + engines stay reusable.
 */

export type FinderOptionDef = {
  value: string;
  label: string;
  description?: string;
};

export type FinderQuestionKind = "single" | "multi" | "number";

export type FinderStageDef = {
  id: string;
  label: string;
  /** Short label for compact progress. */
  shortLabel?: string;
  questionIds: string[];
};

export type FinderMatchCriterion = {
  id: string;
  label: string;
};

export type SoftwareFinderDefinition = {
  id: string;
  categorySlug: string;
  storageKey: string;
  title: string;
  productNoun: string;
  estimatedMinutes: string;
  methodologyHref: string;
  calculatorHref: string;
  stages: FinderStageDef[];
  matchCriteria: FinderMatchCriterion[];
};
