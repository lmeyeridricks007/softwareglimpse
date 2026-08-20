/**
 * Natural-language labels for /for/[slug] UI copy.
 * Prefer these over the word "audience" in user-facing text.
 */

const PLURAL_BY_SLUG: Record<string, string> = {
  "small-business": "small businesses",
  startups: "startups",
  enterprise: "enterprise teams",
  freelancers: "freelancers",
  agencies: "agencies",
  nonprofits: "nonprofits",
  "growing-teams": "growing teams",
  "sales-teams": "remote sales teams",
};

const SINGULAR_BY_SLUG: Record<string, string> = {
  "small-business": "a small business",
  startups: "a startup",
  enterprise: "an enterprise team",
  freelancers: "a freelancer",
  agencies: "an agency",
  nonprofits: "a nonprofit",
  "growing-teams": "a growing team",
  "sales-teams": "a remote sales team",
};

export function businessTypePlural(
  slug: string,
  fallbackName?: string,
): string {
  if (PLURAL_BY_SLUG[slug]) return PLURAL_BY_SLUG[slug];
  const name = (fallbackName ?? slug).trim();
  if (!name) return "this business type";
  const lower = name.toLowerCase();
  if (lower.endsWith("s")) return lower;
  return `${lower}s`;
}

export function businessTypeSingular(
  slug: string,
  fallbackName?: string,
): string {
  if (SINGULAR_BY_SLUG[slug]) return SINGULAR_BY_SLUG[slug];
  const name = (fallbackName ?? slug).trim().toLowerCase();
  if (!name) return "this business type";
  if (/^[aeiou]/i.test(name)) return `an ${name}`;
  return `a ${name}`;
}
