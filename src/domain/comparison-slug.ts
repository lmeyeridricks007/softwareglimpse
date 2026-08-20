/**
 * Comparison URL canonicalization.
 *
 * Strategy: lexicographic ascending by product slug.
 * Example: Pipedrive + Freshsales → `freshsales-vs-pipedrive`
 *
 * Rationale: fully deterministic without popularity signals.
 * Display titles may still read "Pipedrive vs Freshsales".
 * Reverse URLs must 301 to the canonical slug.
 */

export function sortProductPair(slugs: readonly string[]): [string, string] {
  if (slugs.length !== 2) {
    throw new Error("Comparison requires exactly two product slugs");
  }
  const [a, b] = slugs;
  if (a === b) {
    throw new Error("Comparison products must be distinct");
  }
  return a < b ? [a, b] : [b, a];
}

export function canonicalizeComparisonSlug(
  productSlugs: readonly string[],
): string {
  const [a, b] = sortProductPair(productSlugs);
  return `${a}-vs-${b}`;
}

export function parseComparisonSlug(
  slug: string,
): { left: string; right: string } | null {
  const match = /^([a-z0-9]+(?:-[a-z0-9]+)*)-vs-([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(
    slug,
  );
  if (!match) return null;
  return { left: match[1], right: match[2] };
}

export function isCanonicalComparisonSlug(slug: string): boolean {
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return false;
  return slug === canonicalizeComparisonSlug([parsed.left, parsed.right]);
}

export function reverseComparisonSlug(slug: string): string | null {
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return null;
  return `${parsed.right}-vs-${parsed.left}`;
}
