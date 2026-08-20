/**
 * Curated discovery queries — not fabricated analytics popularity.
 * Label in UI as "Try:" unless real analytics later justify "Popular".
 */

export const CURATED_TRY_QUERIES = [
  "CRM software",
  "Pipedrive",
  "HubSpot vs Pipedrive",
  "CRM migration",
  "Workflow automation",
  "CRM Finder",
  "CRM evaluation checklist",
  "Best CRM",
] as const;

export const RELATED_SEARCH_TEMPLATES: Record<string, string[]> = {
  pipedrive: [
    "pipedrive pricing",
    "pipedrive features",
    "pipedrive vs hubspot",
    "pipedrive automation",
    "best crm for small business",
  ],
  hubspot: [
    "hubspot pricing",
    "hubspot vs pipedrive",
    "hubspot crm",
    "best crm",
  ],
  crm: [
    "best crm",
    "crm finder",
    "crm evaluation checklist",
    "workflow automation",
    "crm migration",
  ],
};

export function relatedSearchesForQuery(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...CURATED_TRY_QUERIES].slice(0, 5);

  for (const [key, values] of Object.entries(RELATED_SEARCH_TEMPLATES)) {
    if (q.includes(key)) {
      return values.filter((v) => v.toLowerCase() !== q);
    }
  }

  return CURATED_TRY_QUERIES.filter((v) => v.toLowerCase() !== q).slice(0, 5);
}
