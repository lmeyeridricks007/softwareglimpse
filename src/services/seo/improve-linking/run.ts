import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { planBatchLinking } from "./plan";
import { applyBatchLinkingPlans } from "./apply";
import {
  buildBatchLinkingMetrics,
  snapshotKnowledgeGraphLinking,
  type GraphSnapshot,
} from "./metrics";
import { prioritizePagesForLinking } from "./prioritize";
import {
  IMPROVE_LINKING_VERSION,
  type BatchLinkingReport,
  type BatchPageRef,
} from "./types";

export type RunImproveBatchLinkingOptions = {
  batchId: string;
  pages: BatchPageRef[];
  cwd?: string;
  write?: boolean;
  dryRun?: boolean;
  light?: boolean;
  /** Skip expensive before/after KG snapshots. */
  skipGraphSnapshots?: boolean;
  qualityPromotions?: number;
  /** When false, keep input order (default: lane-prioritize). */
  prioritizeByLane?: boolean;
  /** Default 3 — FR-009 uses 2–6 contextual inbounds. */
  minPerPage?: number;
  maxPerPage?: number;
};

/**
 * Integrate knowledge-graph linking into an improve batch:
 * plan → apply → optional graph re-run metrics.
 * Pages are ordered Lane A → B → C so proven-demand URLs get links first.
 */
export function runImproveBatchLinking(
  options: RunImproveBatchLinkingOptions,
): BatchLinkingReport {
  const cwd = options.cwd ?? process.cwd();
  const light = options.light === true;

  let before: GraphSnapshot | null = null;
  if (!options.skipGraphSnapshots && !light) {
    before = snapshotKnowledgeGraphLinking({ light: false });
  }

  const orderedPages =
    options.prioritizeByLane === false
      ? options.pages
      : prioritizePagesForLinking(options.pages);

  const plans = planBatchLinking(orderedPages, {
    light,
    minPerPage: options.minPerPage,
    maxPerPage: options.maxPerPage,
  });
  const skippedWeak = plans.filter((p) => !p.eligibility.eligible).length;
  const applied = applyBatchLinkingPlans(plans, {
    batchId: options.batchId,
    dryRun: options.dryRun === true,
  });

  let after: GraphSnapshot | null = null;
  if (!options.skipGraphSnapshots && !light && !options.dryRun) {
    after = snapshotKnowledgeGraphLinking({ light: false });
  }

  const metrics = buildBatchLinkingMetrics({
    batchId: options.batchId,
    before,
    after,
    plans,
    applied,
    appliedCount: new Set(applied.map((a) => a.toPath)).size,
    qualityPromotions: options.qualityPromotions ?? 0,
    skippedWeak,
  });

  const pageLanes =
    options.prioritizeByLane === false
      ? []
      : (orderedPages as ReturnType<typeof prioritizePagesForLinking>).map(
          (p) => ({
            path: p.path,
            lane: p.lane,
            overallScore: p.overallScore,
            gscDemandScore: p.gscDemandScore,
            strategicScore: p.strategicScore,
            qualityGapScore: p.qualityGapScore,
            commercialScore: p.commercialScore,
            authorityScore: p.authorityScore,
            strategicOverride: p.strategicOverride,
            reason: p.reason,
          }),
        );

  const report: BatchLinkingReport = {
    version: IMPROVE_LINKING_VERSION,
    batchId: options.batchId,
    generatedAt: new Date().toISOString(),
    plans,
    applied,
    metrics,
    pageLanes,
  };

  if (options.write !== false) {
    const outDir = path.join(cwd, "data/seo/batches");
    mkdirSync(outDir, { recursive: true });
    writeFileSync(
      path.join(outDir, `${options.batchId}-linking.json`),
      `${JSON.stringify(report, null, 2)}\n`,
      "utf8",
    );
  }

  return report;
}
