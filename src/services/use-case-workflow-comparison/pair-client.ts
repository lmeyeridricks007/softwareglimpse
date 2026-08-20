/**
 * Client-safe helpers for use-case workflow product compare.
 * Do not import build-model / research stores from client components.
 */
export type {
  UseCaseWorkflowProductCompareModel,
  WorkflowCompareMedia,
  WorkflowCompareProduct,
  WorkflowPairAnalysis,
} from "./types";
export { pairAnalysisKey } from "./types";

import type {
  UseCaseWorkflowProductCompareModel,
  WorkflowCompareProduct,
  WorkflowPairAnalysis,
} from "./types";
import { pairAnalysisKey } from "./types";

/**
 * Prefer products with enrichment/feature research — never video counts.
 * When present, favor common CRM anchors so defaults are useful (still research-based).
 */
export function selectDefaultComparePair(
  products: WorkflowCompareProduct[],
): [string | null, string | null] {
  const preferredOrder = [
    "hubspot",
    "pipedrive",
    "salesforce",
    "zoho-crm",
    "freshsales",
    "close",
    "copper",
  ];
  const researched = products.filter((p) => p.researched);
  const pool = researched.length >= 2 ? researched : products;
  if (pool.length < 2) {
    return [pool[0]?.slug ?? null, pool[1]?.slug ?? null];
  }

  const preferred = preferredOrder
    .map((slug) => pool.find((p) => p.slug === slug))
    .filter((p): p is WorkflowCompareProduct => Boolean(p));

  if (preferred.length >= 2) {
    return [preferred[0]!.slug, preferred[1]!.slug];
  }

  const scored = [...pool].sort((a, b) => {
    const knownA = Object.values(a.stepSupport).filter(
      (s) => s !== "unknown",
    ).length;
    const knownB = Object.values(b.stepSupport).filter(
      (s) => s !== "unknown",
    ).length;
    const prefA = preferredOrder.indexOf(a.slug);
    const prefB = preferredOrder.indexOf(b.slug);
    const prefScoreA = prefA === -1 ? 99 : prefA;
    const prefScoreB = prefB === -1 ? 99 : prefB;
    return (
      prefScoreA - prefScoreB ||
      knownB - knownA ||
      a.name.localeCompare(b.name)
    );
  });
  return [scored[0]!.slug, scored[1]!.slug];
}

/** Lookup server-precomputed pair analysis (O(1), no Node I/O). */
export function lookupPairAnalysis(
  model: UseCaseWorkflowProductCompareModel,
  leftSlug: string,
  rightSlug: string,
): WorkflowPairAnalysis | null {
  if (!leftSlug || !rightSlug || leftSlug === rightSlug) return null;
  return model.pairAnalyses[pairAnalysisKey(leftSlug, rightSlug)] ?? null;
}

/** @deprecated Prefer lookupPairAnalysis — kept for call-site clarity. */
export function buildPairAnalysis(
  model: UseCaseWorkflowProductCompareModel,
  leftSlug: string,
  rightSlug: string,
): WorkflowPairAnalysis | null {
  return lookupPairAnalysis(model, leftSlug, rightSlug);
}
