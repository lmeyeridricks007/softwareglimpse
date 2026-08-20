import {
  getAllAudiencesUnfiltered,
  getAllCategoriesUnfiltered,
  getAllSoftwareUnfiltered,
  getBusinessTypes,
} from "@/data";

export type RecognizedEntities = {
  productSlugs: string[];
  categorySlugs: string[];
  audienceSlugs: string[];
  businessTypeSlugs: string[];
};

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tokenMatches(normalizedQuery: string, token: string): boolean {
  const t = token.trim().toLowerCase();
  if (!t) return false;
  const re = new RegExp(`(?:^|\\s)${escapeRegex(t)}(?:$|\\s)`, "i");
  return re.test(normalizedQuery);
}

/**
 * Match catalogue entities inside a normalized query.
 * Prefers longer name/slug matches to avoid partial collisions.
 */
export function recognizeEntities(normalizedQuery: string): RecognizedEntities {
  const products = getAllSoftwareUnfiltered()
    .map((s) => ({
      slug: s.slug,
      tokens: [...new Set([s.slug.replace(/-/g, " "), s.name.toLowerCase(), s.slug])],
    }))
    .sort(
      (a, b) =>
        Math.max(...b.tokens.map((t) => t.length)) -
        Math.max(...a.tokens.map((t) => t.length)),
    );

  const productSlugs: string[] = [];
  for (const p of products) {
    if (p.tokens.some((t) => tokenMatches(normalizedQuery, t))) {
      productSlugs.push(p.slug);
    }
  }

  const categories = getAllCategoriesUnfiltered()
    .map((c) => ({
      slug: c.slug,
      tokens: [...new Set([c.slug.replace(/-/g, " "), c.name.toLowerCase(), c.slug])],
    }))
    .sort(
      (a, b) =>
        Math.max(...b.tokens.map((t) => t.length)) -
        Math.max(...a.tokens.map((t) => t.length)),
    );

  const categorySlugs: string[] = [];
  for (const c of categories) {
    if (c.tokens.some((t) => tokenMatches(normalizedQuery, t))) {
      categorySlugs.push(c.slug);
    }
  }

  const audienceSlugs: string[] = [];
  for (const a of getAllAudiencesUnfiltered()) {
    const tokens = [a.slug.replace(/-/g, " "), a.name.toLowerCase(), a.slug];
    if (tokens.some((t) => tokenMatches(normalizedQuery, t))) {
      audienceSlugs.push(a.slug);
    }
  }

  const businessTypeSlugs: string[] = [];
  for (const b of getBusinessTypes()) {
    const tokens = [b.slug.replace(/-/g, " "), b.name.toLowerCase(), b.slug];
    if (tokens.some((t) => tokenMatches(normalizedQuery, t))) {
      businessTypeSlugs.push(b.slug);
    }
  }

  return {
    productSlugs: uniqueSorted(productSlugs),
    categorySlugs: uniqueSorted(categorySlugs),
    audienceSlugs: uniqueSorted(audienceSlugs),
    businessTypeSlugs: uniqueSorted(businessTypeSlugs),
  };
}
