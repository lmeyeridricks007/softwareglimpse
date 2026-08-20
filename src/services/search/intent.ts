import type { SearchDocument, SearchIntent, SearchResultType } from "./types";

const VS_RE = /\b(?:vs\.?|versus)\b/i;
const PRICING_RE = /\b(?:pricing|price|cost|plans?|subscription)\b/i;
const TOOL_RE =
  /\b(?:finder|calculator|scorecard|planner|builder|tco)\b/i;
const RESOURCE_RE =
  /\b(?:checklist|template|worksheet|rfp|scorecard download)\b/i;
const FEATURE_HINTS = [
  "workflow automation",
  "multiple pipelines",
  "pipeline",
  "email sync",
  "lead scoring",
  "forecasting",
  "reporting",
];
const REQUIREMENT_HINTS = [
  "assign leads",
  "lead assignment",
  "lead follow",
  "separate sales",
  "restrict access",
];
const BEST_RE = /\bbest\b/i;
const INDUSTRY_HINTS = [
  "financial services",
  "healthcare",
  "retail",
  "saas",
  "nonprofit",
  "real estate",
  "manufacturing",
  "education",
];

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1);
}

function findProductSlugs(
  query: string,
  softwareDocuments: SearchDocument[],
): string[] {
  const q = query.toLowerCase().trim();
  const hits: Array<{ slug: string; score: number }> = [];

  for (const product of softwareDocuments) {
    const title = product.title.toLowerCase();
    const slug = product.slug.toLowerCase();
    const aliases = product.aliases.map((a) => a.toLowerCase());
    let score = 0;

    // Exact entity identity only — do not treat category tokens (crm) as products.
    if (q === title || q === slug || aliases.includes(q)) score = 100;
    else if (title.length >= 4 && (q === title || q.startsWith(title + " ") || q.endsWith(" " + title))) {
      score = 90;
    } else if (
      title.length >= 4 &&
      q.includes(title) &&
      // require product name as a whole segment
      new RegExp(`(^|\\s)${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(q)
    ) {
      score = 80;
    } else if (aliases.some((a) => a.length >= 4 && q.includes(a))) {
      score = 70;
    } else if (
      q.split(/\s+/).some((tok) => tok.length >= 4 && (tok === slug || tok === title))
    ) {
      score = 60;
    }

    if (score > 0) hits.push({ slug: product.slug, score });
  }

  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((h) => h.slug);
}

/**
 * Deterministic intent rules before semantic/token fallback.
 */
export function detectSearchIntent(
  query: string,
  documents: SearchDocument[],
  softwareDocuments?: SearchDocument[],
): SearchIntent {
  const normalizedQuery = query.trim().toLowerCase().replace(/\s+/g, " ");
  const tokens = tokenize(normalizedQuery);
  const products =
    softwareDocuments ?? documents.filter((document) => document.type === "SOFTWARE");
  const productSlugs = findProductSlugs(normalizedQuery, products);

  let kind: SearchIntent["kind"] = "generic";
  let preferredTypes: SearchResultType[] = [];

  if (VS_RE.test(normalizedQuery)) {
    kind = "comparison";
    preferredTypes = ["COMPARISON", "SOFTWARE"];
  } else if (BEST_RE.test(normalizedQuery)) {
    kind = "best";
    preferredTypes = ["BEST_PAGE", "CATEGORY", "SOFTWARE", "GUIDE"];
  } else if (TOOL_RE.test(normalizedQuery)) {
    kind = "tool";
    preferredTypes = ["TOOL", "RESOURCE"];
  } else if (RESOURCE_RE.test(normalizedQuery)) {
    kind = "resource";
    preferredTypes = ["RESOURCE", "GUIDE", "TOOL"];
  } else if (PRICING_RE.test(normalizedQuery)) {
    kind = "pricing";
    preferredTypes = ["SOFTWARE", "GUIDE", "COMPARISON", "TOOL"];
  } else if (
    FEATURE_HINTS.some((hint) => normalizedQuery.includes(hint)) ||
    normalizedQuery.includes("feature")
  ) {
    kind = "feature";
    preferredTypes = ["FEATURE", "CAPABILITY", "REQUIREMENT", "SOFTWARE"];
  } else if (REQUIREMENT_HINTS.some((hint) => normalizedQuery.includes(hint))) {
    kind = "requirement";
    preferredTypes = ["REQUIREMENT", "FEATURE", "USE_CASE"];
  } else if (INDUSTRY_HINTS.some((hint) => normalizedQuery.includes(hint))) {
    kind = "industry";
    preferredTypes = ["INDUSTRY", "BEST_PAGE", "USE_CASE", "GUIDE", "CATEGORY"];
  } else if (productSlugs.length === 1 && tokens.length <= 3) {
    kind = "entity";
    preferredTypes = [
      "SOFTWARE",
      "COMPARISON",
      "GUIDE",
      "FEATURE",
      "RESOURCE",
      "TOOL",
    ];
  } else if (productSlugs.length > 0) {
    kind = "entity";
    preferredTypes = ["SOFTWARE", "COMPARISON", "GUIDE", "FEATURE"];
  } else if (
    documents.some(
      (d) =>
        d.type === "CATEGORY" &&
        (d.title.toLowerCase() === normalizedQuery ||
          d.slug.toLowerCase() === normalizedQuery),
    )
  ) {
    kind = "generic";
    preferredTypes = [
      "CATEGORY",
      "BEST_PAGE",
      "SOFTWARE",
      "TOOL",
      "GUIDE",
      "RESOURCE",
    ];
  } else {
    preferredTypes = [
      "CATEGORY",
      "BEST_PAGE",
      "SOFTWARE",
      "TOOL",
      "GUIDE",
      "FEATURE",
      "RESOURCE",
    ];
  }

  return {
    kind,
    productSlugs,
    preferredTypes,
    normalizedQuery,
    tokens,
  };
}
