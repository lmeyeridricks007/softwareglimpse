/**
 * High-value CRM/sales features worth official demo search.
 * Do not search every tiny feature — importance-gated.
 */
export const MAJOR_FEATURE_SEARCH_SLUGS = [
  "workflow-automation",
  "lead-scoring",
  "pipeline-management",
  "deal-management",
  "lead-management",
  "reporting",
  "forecasting",
  "email-sequences",
  "email-sync",
  "role-permissions",
  "integrations",
  "sales-automation",
  "contact-management",
  "ai-assistance",
] as const;

export type MajorFeatureSearchSlug =
  (typeof MAJOR_FEATURE_SEARCH_SLUGS)[number];

export const MAJOR_FEATURE_LABELS: Record<string, string> = {
  "workflow-automation": "workflow automation",
  "lead-scoring": "lead scoring",
  "pipeline-management": "pipelines",
  "deal-management": "deal management",
  "lead-management": "lead management",
  reporting: "reporting",
  forecasting: "forecasting",
  "email-sequences": "sequences",
  "email-sync": "email",
  "role-permissions": "permissions",
  integrations: "integrations",
  "sales-automation": "sales automation",
  "contact-management": "contact management",
  "ai-assistance": "AI assistance",
};

/** Max major features to deep-search per product. */
export const MAX_MAJOR_FEATURES_PER_PRODUCT = 8;

/** Max use cases to deep-search per product. */
export const MAX_USE_CASES_PER_PRODUCT = 4;

/** Max industries to deep-search per product. */
export const MAX_INDUSTRIES_PER_PRODUCT = 3;
