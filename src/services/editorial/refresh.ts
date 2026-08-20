import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
} from "@/data/repositories/catalog";
import {
  loadReview,
  saveReview,
} from "@/data/editorial/store";
import { resolveAffectedPages } from "./dependencies";

export type RefreshMarkResult = {
  productSlug: string;
  reason: string;
  affected: { path: string; pageType: string; slug: string }[];
  markedReview: boolean;
};

/**
 * When product facts change, mark dependent content as refresh-needed.
 * Deterministic resolver — no event bus.
 *
 * Catalogue seeds (comparison/alternatives/best) are not mutated on disk here;
 * callers use the returned affected list. Approved reviews in the editorial
 * store are flagged when present.
 */
export function markDependentPagesRefreshNeeded(
  productSlug: string,
  reason: string,
): RefreshMarkResult {
  const affected = resolveAffectedPages(productSlug);
  let markedReview = false;

  const review = loadReview(productSlug);
  if (review) {
    saveReview({
      ...review,
      refreshNeeded: true,
      refreshReason: reason,
    });
    markedReview = true;
  }

  return {
    productSlug,
    reason,
    affected,
    markedReview,
  };
}

/**
 * List seed entities that would need editorial refresh (read-only report).
 */
export function listStaleSeedDependencies(productSlug: string): {
  comparisons: string[];
  alternatives: string[];
  best: string[];
} {
  return {
    comparisons: getAllComparisonsUnfiltered()
      .filter((c) => c.productSlugs.includes(productSlug))
      .map((c) => c.slug),
    alternatives: getAllAlternativesUnfiltered()
      .filter(
        (a) =>
          a.sourceSlug === productSlug ||
          a.alternatives.some((e) => e.targetSlug === productSlug),
      )
      .map((a) => a.slug),
    best: getAllBestPagesUnfiltered()
      .filter(
        (b) =>
          b.eligibleProductSlugs.includes(productSlug) ||
          b.recommendations.some((r) => r.productSlug === productSlug),
      )
      .map((b) => b.slug),
  };
}
