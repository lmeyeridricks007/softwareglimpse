export { buildBestPageModel } from "./build-best-page-model";
export {
  assertNoBestPageLeaks,
  bestPublicCopy,
  BEST_PAGE_LEAK_PATTERNS,
  containsBestPageLeak,
  findBestPageLeaks,
} from "./public-gate";
export type * from "./types";

/**
 * Research/assessment loaders (node:fs) live in `./enrichment-deps`.
 * Import them only from Server Components / server modules — never via this
 * barrel from Client Components (even as `import type`), or Turbopack will
 * pull node:fs into browser chunks.
 */
