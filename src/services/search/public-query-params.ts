import {
  SEARCH_FILTER_TYPES,
  type SearchFilterType,
} from "./types";

/** Same bounds the results page used when search ran in the RSC tree. */
export const PUBLIC_SEARCH_MAX_QUERY_LENGTH = 80;
export const PUBLIC_SEARCH_RESULT_LIMIT = 48;
export const PUBLIC_SEARCH_GROUP_LIMIT = 6;

/** Client-safe. Does not load the search index. */
export function parsePublicSearchType(raw: string | null | undefined): SearchFilterType {
  if (!raw) return "all";
  return (SEARCH_FILTER_TYPES as readonly string[]).includes(raw)
    ? (raw as SearchFilterType)
    : "all";
}
