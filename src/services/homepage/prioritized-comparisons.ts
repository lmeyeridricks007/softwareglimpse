import type { Comparison } from "@/domain";
import { getComparisonBySlug } from "@/data/repositories/catalog";

/** Homepage CRM comparison teasers — high-intent pairs first, not alphabetical act-vs-* noise. */
const HOMEPAGE_CRM_COMPARISON_SLUGS = [
  "hubspot-vs-pipedrive",
  "hubspot-vs-salesforce",
  "pipedrive-vs-salesforce",
  "freshsales-vs-pipedrive",
  "close-vs-pipedrive",
  "attio-vs-hubspot",
] as const;

export function homepageCrmComparisons(
  pool: Comparison[],
  limit = 6,
): Comparison[] {
  const bySlug = new Map(pool.map((c) => [c.slug, c]));
  const picked: Comparison[] = [];
  const used = new Set<string>();

  for (const slug of HOMEPAGE_CRM_COMPARISON_SLUGS) {
    const cmp = bySlug.get(slug) ?? getComparisonBySlug(slug);
    if (!cmp || used.has(cmp.slug)) continue;
    picked.push(cmp);
    used.add(cmp.slug);
    if (picked.length >= limit) return picked;
  }

  for (const cmp of pool) {
    if (used.has(cmp.slug)) continue;
    picked.push(cmp);
    used.add(cmp.slug);
    if (picked.length >= limit) break;
  }

  return picked;
}
