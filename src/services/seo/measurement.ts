import {
  SeoActionOutcomeSchema,
  SeoExperimentSchema,
  type DateRange,
  type SearchPerformanceRow,
  type SeoActionOutcome,
  type SeoExperiment,
} from "@/domain";
import { saveExperiment } from "@/data/seo/store";
import {
  aggregatePage,
  comparePeriods,
  type AggregatedMetrics,
} from "./aggregate";
import { resolveSearchUrl } from "./url-resolver";

function emptyMetrics(): AggregatedMetrics {
  return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

function metricsForContent(
  rows: SearchPerformanceRow[],
  contentId: string | undefined,
): AggregatedMetrics {
  if (!contentId) {
    const all = aggregatePage(rows);
    if (!all.length) return emptyMetrics();
    return all.reduce(
      (acc, p) => ({
        clicks: acc.clicks + p.clicks,
        impressions: acc.impressions + p.impressions,
        ctr: 0,
        position: acc.position + p.position * p.impressions,
      }),
      emptyMetrics(),
    );
  }
  const matching = rows.filter((r) => {
    if (!r.page) return false;
    return resolveSearchUrl(r.page).contentId === contentId;
  });
  const pages = aggregatePage(matching);
  if (!pages.length) return emptyMetrics();
  const clicks = pages.reduce((s, p) => s + p.clicks, 0);
  const impressions = pages.reduce((s, p) => s + p.impressions, 0);
  const position =
    impressions > 0
      ? pages.reduce((s, p) => s + p.position * p.impressions, 0) / impressions
      : 0;
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position,
  };
}

export function createExperiment(input: {
  opportunityId: string;
  contentId?: SeoExperiment["contentId"];
  hypothesis: string;
  baselineRange: DateRange;
  nowIso?: string;
}): SeoExperiment {
  const experiment = SeoExperimentSchema.parse({
    id: `seo-experiment:${input.opportunityId}`,
    opportunityId: input.opportunityId,
    contentId: input.contentId,
    hypothesis: input.hypothesis,
    baselineRange: input.baselineRange,
    status: "planned",
    createdAt: input.nowIso ?? new Date().toISOString(),
    notes: ["Measurement stub — wire to live snapshots later"],
  });
  saveExperiment(experiment);
  return experiment;
}

/**
 * Evaluate baseline vs after windows.
 * Returns insufficient-data when either window lacks meaningful volume.
 */
export function evaluateExperiment(input: {
  experiment: SeoExperiment;
  baselineRows: SearchPerformanceRow[];
  afterRows: SearchPerformanceRow[];
  afterRange: DateRange;
  minImpressions?: number;
  nowIso?: string;
}): SeoActionOutcome {
  const minImpressions = input.minImpressions ?? 50;
  const baseline = metricsForContent(
    input.baselineRows,
    input.experiment.contentId,
  );
  const after = metricsForContent(input.afterRows, input.experiment.contentId);
  const delta = comparePeriods(after, baseline);

  if (
    baseline.impressions < minImpressions ||
    after.impressions < minImpressions
  ) {
    return SeoActionOutcomeSchema.parse({
      experimentId: input.experiment.id,
      opportunityId: input.experiment.opportunityId,
      result: "insufficient-data",
      clicksDeltaPct: delta.clicksDeltaPct ?? undefined,
      impressionsDeltaPct: delta.impressionsDeltaPct ?? undefined,
      ctrDeltaPct: delta.ctrDeltaPct ?? undefined,
      positionDelta: delta.positionDelta ?? undefined,
      evaluatedAt: input.nowIso ?? new Date().toISOString(),
      notes: ["Insufficient impressions in baseline or after window"],
    });
  }

  const clicksDelta = delta.clicksDeltaPct ?? 0;
  const ctrDelta = delta.ctrDeltaPct ?? 0;
  let result: SeoActionOutcome["result"] = "neutral";
  if (clicksDelta >= 15 || ctrDelta >= 15) result = "positive";
  else if (clicksDelta <= -15 || ctrDelta <= -15) result = "negative";

  return SeoActionOutcomeSchema.parse({
    experimentId: input.experiment.id,
    opportunityId: input.experiment.opportunityId,
    result,
    clicksDeltaPct: delta.clicksDeltaPct ?? undefined,
    impressionsDeltaPct: delta.impressionsDeltaPct ?? undefined,
    ctrDeltaPct: delta.ctrDeltaPct ?? undefined,
    positionDelta: delta.positionDelta ?? undefined,
    evaluatedAt: input.nowIso ?? new Date().toISOString(),
    notes: [],
  });
}
