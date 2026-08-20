import { getSearchRuntime } from "./build-index";
import { detectSearchIntent } from "./intent";
import { candidateDocuments } from "./runtime-index";
import { scoreDocuments } from "./score";
import type {
  AutocompleteResponse,
  AutocompleteSuggestion,
  SearchResultType,
} from "./types";

const AUTOCOMPLETE_TYPES: SearchResultType[] = [
  "SOFTWARE",
  "COMPARISON",
  "TOOL",
  "GUIDE",
  "RESOURCE",
  "FEATURE",
  "CATEGORY",
  "BEST_PAGE",
];

const MAX_SUGGESTIONS = 8;

/**
 * Compact autocomplete — same index/scoring as full search.
 */
export function suggestSearch(query: string): AutocompleteResponse {
  const trimmed = query.trim();
  const seeAllHref = trimmed
    ? `/search/?q=${encodeURIComponent(trimmed)}`
    : "/search/";

  if (trimmed.length < 2) {
    return { query: trimmed, suggestions: [], seeAllHref };
  }

  const runtime = getSearchRuntime();
  const documents = runtime.documents.filter((d) =>
    AUTOCOMPLETE_TYPES.includes(d.type),
  );
  const intent = detectSearchIntent(trimmed, documents, runtime.softwareDocuments);
  const scoringPool =
    candidateDocuments(runtime, intent.tokens)?.filter((doc) =>
      AUTOCOMPLETE_TYPES.includes(doc.type),
    ) ?? documents;
  const hits = scoreDocuments(documents, intent, scoringPool).slice(
    0,
    MAX_SUGGESTIONS,
  );

  const suggestions: AutocompleteSuggestion[] = hits.map((hit) => ({
    type: hit.document.type,
    title: hit.document.title,
    href: hit.document.canonicalUrl,
    badge: hit.document.badge,
  }));

  return { query: trimmed, suggestions, seeAllHref };
}
