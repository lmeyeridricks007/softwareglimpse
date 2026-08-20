import { queryClusterSynonyms } from "@/data/config/seo/query-patterns";
import { normalizeQuery } from "./normalize-query";
import { classifyQuery } from "./classify-query";

/**
 * Collapse pricing / alternatives / comparison synonym variants into a cluster key.
 */
export function clusterKeyForQuery(raw: string): string {
  const classified = classifyQuery(raw);
  const normalized = classified.normalized;
  const products = classified.productSlugs.join("+") || "none";
  const categories = classified.categorySlugs.join("+") || "none";

  if (classified.intent === "pricing") {
    return `pricing:${products}`;
  }
  if (classified.intent === "alternatives") {
    return `alternatives:${products}`;
  }
  if (classified.intent === "comparison") {
    return `comparison:${products}`;
  }
  if (classified.intent === "best") {
    return `best:${categories}:${products}`;
  }

  // Synonym token rewrite for residual clustering
  let rewritten = normalized;
  for (const [group, synonyms] of Object.entries(queryClusterSynonyms)) {
    for (const syn of synonyms) {
      const re = new RegExp(`\\b${escapeRegex(syn)}\\b`, "g");
      if (re.test(rewritten)) {
        rewritten = rewritten.replace(re, group);
      }
    }
  }
  return normalizeQuery(rewritten);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function queriesInSameCluster(a: string, b: string): boolean {
  return clusterKeyForQuery(a) === clusterKeyForQuery(b);
}
