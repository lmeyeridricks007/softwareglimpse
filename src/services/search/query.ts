import { getSearchRuntime } from "./build-index";
import { relatedSearchesForQuery } from "./curated-queries";
import { isCloseTypo } from "./fuzzy";
import { detectSearchIntent } from "./intent";
import { SEARCH_TYPE_LABELS } from "./labels";
import { candidateDocuments } from "./runtime-index";
import { scoreDocuments } from "./score";
import type {
  SearchCorrection,
  SearchDocument,
  SearchFilterType,
  SearchGroupId,
  SearchResponse,
  SearchResultGroup,
  SearchResultType,
  SearchSidebarModel,
  SearchTypeCount,
  ScoredSearchHit,
} from "./types";

const TYPE_LABELS = SEARCH_TYPE_LABELS;

const FILTER_ORDER: SearchResultType[] = [
  "SOFTWARE",
  "COMPARISON",
  "GUIDE",
  "TOOL",
  "RESOURCE",
  "FEATURE",
  "REQUIREMENT",
  "USE_CASE",
  "INDUSTRY",
  "CAPABILITY",
  "CATEGORY",
  "BEST_PAGE",
];

export type RunSearchOptions = {
  query: string;
  type?: SearchFilterType;
  limit?: number;
  groupLimit?: number;
};

function countByType(hits: ScoredSearchHit[]): SearchTypeCount[] {
  const map = new Map<SearchResultType, number>();
  for (const hit of hits) {
    map.set(hit.document.type, (map.get(hit.document.type) ?? 0) + 1);
  }
  return FILTER_ORDER.filter((type) => (map.get(type) ?? 0) > 0).map((type) => ({
    type,
    count: map.get(type)!,
    label: TYPE_LABELS[type],
  }));
}

function findTypoCorrection(
  query: string,
  documents: SearchDocument[],
): SearchCorrection | undefined {
  const q = query.trim().toLowerCase();
  if (q.length < 4) return undefined;

  const entities = documents.filter(
    (d) => d.type === "SOFTWARE" || d.type === "CATEGORY" || d.type === "TOOL",
  );

  for (const doc of entities) {
    const candidates = [doc.title, doc.slug, ...doc.aliases];
    for (const candidate of candidates) {
      if (isCloseTypo(q, candidate)) {
        return {
          original: query,
          suggested: doc.title,
          mode: "showing-for",
        };
      }
    }
  }
  return undefined;
}

function buildGroups(
  hits: ScoredSearchHit[],
  query: string,
  featured?: ScoredSearchHit,
  groupLimit = 6,
): SearchResultGroup[] {
  const featuredId = featured?.document.id;
  const rest = hits.filter((h) => h.document.id !== featuredId);

  const take = (
    id: SearchGroupId,
    title: string,
    types: SearchResultType[],
    viewAllType?: SearchResultType,
  ): SearchResultGroup | null => {
    const matched = rest.filter((h) => types.includes(h.document.type));
    if (!matched.length) return null;
    return {
      id,
      title,
      hits: matched.slice(0, groupLimit),
      total: matched.length,
      viewAllHref:
        matched.length > groupLimit && viewAllType
          ? `/search/?q=${encodeURIComponent(query)}&type=${viewAllType}`
          : undefined,
    };
  };

  const groups: SearchResultGroup[] = [];

  if (featured) {
    groups.push({
      id: "top_match",
      title: "Top match",
      hits: [featured],
      total: 1,
    });
  }

  const software = take("software", "Related software", ["SOFTWARE", "BEST_PAGE", "CATEGORY"], "SOFTWARE");
  const comparisons = take("comparisons", "Comparisons", ["COMPARISON"], "COMPARISON");
  const guides = take(
    "guides_resources",
    "Guides & resources",
    ["GUIDE", "RESOURCE"],
    "GUIDE",
  );
  const features = take(
    "features_requirements",
    "Features & requirements",
    ["FEATURE", "REQUIREMENT", "CAPABILITY", "USE_CASE"],
    "FEATURE",
  );
  const tools = take("tools", "Tools", ["TOOL"], "TOOL");
  const taxonomy = take(
    "taxonomy",
    "Industries & categories",
    ["INDUSTRY", "CATEGORY"],
    "INDUSTRY",
  );

  for (const g of [software, comparisons, guides, features, tools, taxonomy]) {
    if (g) groups.push(g);
  }

  return groups;
}

function buildSidebar(
  hits: ScoredSearchHit[],
  query: string,
  documents: SearchDocument[],
): SearchSidebarModel {
  const related = relatedSearchesForQuery(query);
  const softwareHit =
    hits.find((h) => h.document.type === "SOFTWARE") ??
    documents
      .filter((d) => d.type === "SOFTWARE")
      .map((document) => ({ document, score: 0, matchReasons: [] as string[] }))
      .find((h) =>
        query.toLowerCase().includes(h.document.title.toLowerCase()),
      );

  const entityExplore = softwareHit
    ? {
        productName: softwareHit.document.title,
        productSlug: softwareHit.document.slug,
        links: softwareHit.document.quickLinks ?? [
          {
            label: "Overview",
            href: softwareHit.document.canonicalUrl,
          },
        ],
      }
    : undefined;

  const popularComparisons = hits
    .filter((h) => h.document.type === "COMPARISON")
    .slice(0, 3)
    .map((h) => ({
      title: h.document.title,
      href: h.document.canonicalUrl,
      logoA: h.document.logo,
      logoB: h.document.logoB,
    }));

  const tool =
    hits.find((h) => h.document.type === "TOOL")?.document ??
    documents.find((d) => d.type === "TOOL" && d.slug === "crm-finder");

  return {
    entityExplore,
    popularComparisons,
    toolPromo: tool
      ? {
          title: tool.title,
          summary: tool.summary,
          href: tool.canonicalUrl,
          ctaLabel: tool.toolMeta?.ctaLabel ?? "Start tool",
        }
      : undefined,
    relatedSearches: related,
  };
}

function pickFeatured(
  hits: ScoredSearchHit[],
  intent: ReturnType<typeof detectSearchIntent>,
): ScoredSearchHit | undefined {
  if (!hits.length) return undefined;

  if (intent.kind === "comparison") {
    return hits.find((h) => h.document.type === "COMPARISON") ?? hits[0];
  }
  if (intent.kind === "tool") {
    return hits.find((h) => h.document.type === "TOOL") ?? hits[0];
  }
  if (intent.kind === "resource") {
    return hits.find((h) => h.document.type === "RESOURCE") ?? hits[0];
  }
  if (intent.kind === "feature") {
    return hits.find((h) => h.document.type === "FEATURE") ?? hits[0];
  }
  if (intent.kind === "requirement") {
    return hits.find((h) => h.document.type === "REQUIREMENT") ?? hits[0];
  }
  if (intent.kind === "best") {
    return hits.find((h) => h.document.type === "BEST_PAGE") ?? hits[0];
  }
  if (intent.kind === "pricing") {
    return (
      hits.find((h) => h.document.type === "SOFTWARE") ??
      hits.find((h) => h.document.type === "GUIDE") ??
      hits[0]
    );
  }

  const exactSoftware = hits.find(
    (h) =>
      h.document.type === "SOFTWARE" &&
      (h.matchReasons.includes("exact-title") ||
        h.matchReasons.includes("exact-slug") ||
        h.matchReasons.includes("entity-self") ||
        h.matchReasons.includes("fuzzy-title")),
  );
  if (exactSoftware) return exactSoftware;

  if (intent.kind === "entity") {
    return hits.find((h) => h.document.type === "SOFTWARE") ?? hits[0];
  }

  const exactCategory = hits.find(
    (h) =>
      h.document.type === "CATEGORY" &&
      (h.matchReasons.includes("exact-title") ||
        h.matchReasons.includes("exact-slug")),
  );
  if (exactCategory) return exactCategory;

  const exactIndustry = hits.find(
    (h) =>
      h.document.type === "INDUSTRY" &&
      (h.matchReasons.includes("exact-title") ||
        h.matchReasons.includes("title-contains") ||
        h.matchReasons.includes("title-prefix")),
  );
  if (intent.kind === "industry" && exactIndustry) return exactIndustry;

  return hits[0];
}

/**
 * Primary search entry point — deterministic index + scoring (no SaaS).
 */
export function runSearch(options: RunSearchOptions): SearchResponse {
  const rawQuery = options.query.trim();
  const runtime = getSearchRuntime();
  const documents = runtime.documents;
  const limit = options.limit ?? 40;
  const groupLimit = options.groupLimit ?? 6;

  if (!rawQuery) {
    return {
      query: "",
      normalizedQuery: "",
      total: 0,
      counts: [],
      intent: detectSearchIntent("", documents, runtime.softwareDocuments),
      groups: [],
      hits: [],
      relatedSearches: relatedSearchesForQuery(""),
      sidebar: {
        popularComparisons: [],
        relatedSearches: relatedSearchesForQuery(""),
        toolPromo: (() => {
          const tool = documents.find((d) => d.slug === "crm-finder");
          return tool
            ? {
                title: tool.title,
                summary: tool.summary,
                href: tool.canonicalUrl,
                ctaLabel: tool.toolMeta?.ctaLabel ?? "Start Finder",
              }
            : undefined;
        })(),
      },
    };
  }

  let queryForScoring = rawQuery;
  let correction = findTypoCorrection(rawQuery, documents);
  const preliminaryIntent = detectSearchIntent(
    rawQuery,
    documents,
    runtime.softwareDocuments,
  );
  const scoringPool =
    candidateDocuments(runtime, preliminaryIntent.tokens) ?? documents;
  let hits = scoreDocuments(documents, preliminaryIntent, scoringPool);

  const usedFuzzy = hits
    .slice(0, 3)
    .some((h) => h.matchReasons.some((r) => r.startsWith("fuzzy")));

  if (correction && (hits.length === 0 || (hits.length <= 3 && usedFuzzy))) {
    queryForScoring = correction.suggested;
    const correctedIntent = detectSearchIntent(
      correction.suggested,
      documents,
      runtime.softwareDocuments,
    );
    const correctedPool =
      candidateDocuments(runtime, correctedIntent.tokens) ?? documents;
    hits = scoreDocuments(documents, correctedIntent, correctedPool);
    if (hits.length === 0) correction = undefined;
  } else if (!usedFuzzy) {
    correction = undefined;
  }

  const intent = detectSearchIntent(
    queryForScoring,
    documents,
    runtime.softwareDocuments,
  );
  if (hits.length === 0) {
    // retry with corrected intent path already done
  }

  const filtered =
    options.type && options.type !== "all"
      ? hits.filter((h) => h.document.type === options.type)
      : hits;

  const limited = filtered.slice(0, limit);
  const featured =
    !options.type || options.type === "all"
      ? pickFeatured(limited, intent)
      : undefined;

  return {
    query: rawQuery,
    normalizedQuery: intent.normalizedQuery,
    total: filtered.length,
    counts: countByType(hits),
    intent,
    correction,
    featured,
    groups:
      !options.type || options.type === "all"
        ? buildGroups(limited, rawQuery, featured, groupLimit)
        : [
            {
              id: "other",
              title: TYPE_LABELS[options.type] ?? "Results",
              hits: limited,
              total: filtered.length,
            },
          ],
    hits: limited,
    relatedSearches: relatedSearchesForQuery(rawQuery),
    sidebar: buildSidebar(limited, rawQuery, documents),
  };
}
