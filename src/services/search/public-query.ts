import type { SearchFilterType, SearchResponse } from "./types";
import { runSearch } from "./query";
import {
  PUBLIC_SEARCH_GROUP_LIMIT,
  PUBLIC_SEARCH_MAX_QUERY_LENGTH,
  PUBLIC_SEARCH_RESULT_LIMIT,
  parsePublicSearchType,
} from "./public-query-params";

export {
  PUBLIC_SEARCH_GROUP_LIMIT,
  PUBLIC_SEARCH_MAX_QUERY_LENGTH,
  PUBLIC_SEARCH_RESULT_LIMIT,
  parsePublicSearchType,
};

/**
 * Full results-page search. Not the autocomplete contract (`suggestSearch`
 * returns at most 8 suggestions).
 */
export function runPublicSearch(
  rawQuery: string,
  rawType: string | null | undefined,
): { ok: true; type: SearchFilterType; all: SearchResponse; result: SearchResponse } | { ok: false; status: 400; query: string } {
  const query = rawQuery.trim();
  if (query.length > PUBLIC_SEARCH_MAX_QUERY_LENGTH) {
    return { ok: false, status: 400, query };
  }

  const type = parsePublicSearchType(rawType);
  const all = runSearch({
    query,
    type: "all",
    limit: PUBLIC_SEARCH_RESULT_LIMIT,
    groupLimit: PUBLIC_SEARCH_GROUP_LIMIT,
  });

  if (type === "all") {
    return { ok: true, type, all, result: all };
  }

  const hits = all.hits
    .filter((hit) => hit.document.type === type)
    .slice(0, PUBLIC_SEARCH_RESULT_LIMIT);
  const total = all.hits.filter((hit) => hit.document.type === type).length;
  const result: SearchResponse = {
    ...all,
    total,
    featured: undefined,
    groups: [
      {
        id: "other",
        title: all.counts.find((count) => count.type === type)?.label ?? "Results",
        hits,
        total,
      },
    ],
    hits,
  };

  return { ok: true, type, all, result };
}
