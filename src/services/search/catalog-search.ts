/**
 * Public catalogue search — extended cross-site discovery index.
 * Prefer `runSearch` / `suggestSearch` for new callers.
 */

export type { SearchDocument } from "./types";
export {
  buildSearchIndex,
  __resetSearchIndexCache,
  getSearchIndexSize,
} from "./build-index";
export { runSearch } from "./query";
export { suggestSearch } from "./suggest";

import { runSearch } from "./query";
import type { SearchDocument } from "./types";

/** Back-compat thin wrapper used by older callers. */
export function searchCatalog(query: string, limit = 20): SearchDocument[] {
  return runSearch({ query, limit }).hits.map((hit) => hit.document);
}
