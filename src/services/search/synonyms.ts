/**
 * Curated synonym / alias expansion for on-site search.
 * Keep manageable and entity-driven — do not AI-rewrite every query.
 */

const SYNONYM_GROUPS: string[][] = [
  ["crm", "customer relationship management", "customer relationship manager"],
  ["pipeline", "sales pipeline", "deal pipeline"],
  ["workflow", "workflows", "automation", "workflow automation"],
  ["sso", "single sign-on", "single sign on"],
  ["tco", "total cost of ownership", "total cost"],
  ["lead assignment", "assign leads", "automatic lead assignment", "auto assign leads"],
  ["migration", "crm migration", "data migration"],
  ["pricing", "cost", "price", "plans"],
  ["finder", "software finder", "recommendation tool"],
  ["checklist", "evaluation checklist", "scorecard checklist"],
  ["hubspot", "hub spot"],
  ["salesforce", "sfdc"],
  ["financial services", "fintech", "banking crm"],
  ["small business", "smb", "sme"],
];

const LOOKUP = new Map<string, string[]>();

for (const group of SYNONYM_GROUPS) {
  const normalized = group.map((term) => term.toLowerCase());
  for (const term of normalized) {
    LOOKUP.set(
      term,
      normalized.filter((other) => other !== term),
    );
  }
}

export function expandSynonyms(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const expansions = new Set<string>([q]);

  for (const [term, aliases] of LOOKUP) {
    if (q === term || q.includes(term)) {
      for (const alias of aliases) expansions.add(alias);
    }
  }

  return [...expansions];
}

export function synonymBoostTerms(query: string): string[] {
  return expandSynonyms(query).filter((term) => term !== query.trim().toLowerCase());
}
