import type { FinderOption } from "@/components/finder/crm-finder-questions";
import type { NewToolCategorySlug } from "@/data/config/tools/category-tool-meta";

export type CategoryFinderClientKit = {
  categorySlug: NewToolCategorySlug;
  storageKey: string;
  title: string;
  productNoun: string;
  productNounPlural: string;
  shortName: string;
  softwarePhrase: string;
  estimatedMinutes: string;
  finderHref: string;
  costHref: string;
  planSelectorHref: string;
  requirementsHref: string;
  scorecardHref: string;
  rfpHref: string;
  demoHref: string;
  readinessHref: string;
  bestHref: string;
  categoryHref: string;
  useCaseOptions: FinderOption[];
  capabilityOptions: FinderOption[];
  integrationOptions: FinderOption[];
  matchCriteria: Array<{ id: string; label: string }>;
  methodologyCriteria: Array<{
    slug: string;
    label: string;
    defaultImportance: "critical" | "high" | "medium" | "low";
  }>;
};
