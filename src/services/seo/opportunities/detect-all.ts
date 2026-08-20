import type { ContentRegistryEntry, SearchPerformanceRow, SeoOpportunity } from "@/domain";
import {
  aggregatePage,
  aggregatePageQuery,
  aggregateQuery,
} from "../aggregate";
import { detectCannibalization } from "./cannibalization";
import { detectDecayGrowth } from "./decay-growth";
import { detectInternalLinkOpportunities } from "./internal-links";
import { detectLowCtr } from "./low-ctr";
import { detectMissingContent } from "./missing-content";
import { detectQueryPageMismatch } from "./query-page-mismatch";
import { detectStrikingDistance } from "./striking-distance";
import type { OpportunityContext } from "./types";

const DETECTORS = [
  detectStrikingDistance,
  detectLowCtr,
  detectMissingContent,
  detectCannibalization,
  detectDecayGrowth,
  detectQueryPageMismatch,
  detectInternalLinkOpportunities,
] as const;

export type DetectAllOptions = {
  currentRows: SearchPerformanceRow[];
  previousRows?: SearchPerformanceRow[];
  registry: ContentRegistryEntry[];
  nowIso?: string;
  commercialBoostByProduct?: Record<string, number>;
};

/**
 * Run all detectors and dedupe by stable opportunity id (first wins, merge evidence notes).
 */
export function detectAllOpportunities(
  opts: DetectAllOptions,
): SeoOpportunity[] {
  const nowIso = opts.nowIso ?? new Date().toISOString();
  const ctx: OpportunityContext = {
    currentRows: opts.currentRows,
    previousRows: opts.previousRows,
    pageAggs: aggregatePage(opts.currentRows),
    queryAggs: aggregateQuery(opts.currentRows),
    pageQueryAggs: aggregatePageQuery(opts.currentRows),
    registry: opts.registry,
    nowIso,
    commercialBoostByProduct: opts.commercialBoostByProduct,
  };

  const merged = new Map<string, SeoOpportunity>();
  for (const detect of DETECTORS) {
    for (const opp of detect(ctx)) {
      const existing = merged.get(opp.id);
      if (!existing) {
        merged.set(opp.id, opp);
        continue;
      }
      // Keep higher priority; append unique reasons.
      const winner =
        opp.priorityScore > existing.priorityScore ? opp : existing;
      const loser =
        opp.priorityScore > existing.priorityScore ? existing : opp;
      merged.set(opp.id, {
        ...winner,
        reasons: [...new Set([...winner.reasons, ...loser.reasons])],
        lastDetectedAt: nowIso,
      });
    }
  }

  return [...merged.values()].sort(
    (a, b) => b.priorityScore - a.priorityScore,
  );
}

export {
  detectStrikingDistance,
  detectLowCtr,
  detectMissingContent,
  detectCannibalization,
  detectDecayGrowth,
  detectQueryPageMismatch,
  detectInternalLinkOpportunities,
};
