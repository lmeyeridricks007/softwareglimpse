import { seoThresholds } from "@/data/config/seo/thresholds";
import { SeoOpportunitySchema } from "@/domain";
import {
  aggregatePage,
  comparePeriods,
} from "../aggregate";
import {
  opportunityIdForDecay,
  opportunityIdForGrowth,
} from "../opportunity-ids";
import { scoreOpportunity } from "../score-opportunity";
import { resolveSearchUrl } from "../url-resolver";
import type { OpportunityDetector } from "./types";

export const detectDecayGrowth: OpportunityDetector = (ctx) => {
  if (!ctx.previousRows?.length) return [];
  const out = [];
  const currentPages = aggregatePage(ctx.currentRows);
  const previousPages = aggregatePage(ctx.previousRows);
  const prevByPath = new Map(
    previousPages.map((p) => [resolveSearchUrl(p.page).normalizedPath, p]),
  );

  for (const cur of currentPages) {
    const resolution = resolveSearchUrl(cur.page);
    if (!resolution.contentId) continue;
    const prev = prevByPath.get(resolution.normalizedPath);
    if (!prev) continue;

    const delta = comparePeriods(cur, prev);

    if (
      prev.clicks >= seoThresholds.minClicksForDecay &&
      delta.clicksDeltaPct != null &&
      delta.clicksDeltaPct <= -seoThresholds.decayClickDropPct
    ) {
      const scored = scoreOpportunity({
        type: "content-decay",
        impressions: cur.impressions,
        position: cur.position,
        effort: "medium",
        reasons: [
          `Clicks dropped ${Math.abs(delta.clicksDeltaPct).toFixed(0)}% vs prior period on ${resolution.normalizedPath}`,
        ],
      });
      out.push(
        SeoOpportunitySchema.parse({
          id: opportunityIdForDecay(resolution.contentId),
          type: "content-decay",
          status: "detected",
          contentId: resolution.contentId,
          evidence: {
            impressions: cur.impressions,
            clicks: cur.clicks,
            ctr: cur.ctr,
            position: cur.position,
            priorImpressions: prev.impressions,
            priorClicks: prev.clicks,
            priorPosition: prev.position,
            pages: [resolution.normalizedPath],
            notes: [`clicksDeltaPct=${delta.clicksDeltaPct.toFixed(1)}`],
          },
          ...scored,
          recommendedActions: [
            {
              type: "refresh-content",
              description: "Refresh decaying page with current research",
              effort: "medium",
              risk: "low",
            },
          ],
          prerequisites: [],
          detectedAt: ctx.nowIso,
        }),
      );
    }

    if (
      delta.impressionsDeltaPct != null &&
      delta.impressionsDeltaPct >= seoThresholds.growthImpressionPct &&
      cur.impressions >= seoThresholds.minImpressions
    ) {
      const scored = scoreOpportunity({
        type: "growth",
        impressions: cur.impressions,
        position: cur.position,
        effort: "small",
        reasons: [
          `Impressions grew ${delta.impressionsDeltaPct.toFixed(0)}% — reinforce winning page`,
        ],
      });
      out.push(
        SeoOpportunitySchema.parse({
          id: opportunityIdForGrowth(resolution.contentId),
          type: "growth",
          status: "detected",
          contentId: resolution.contentId,
          evidence: {
            impressions: cur.impressions,
            clicks: cur.clicks,
            position: cur.position,
            priorImpressions: prev.impressions,
            priorClicks: prev.clicks,
            priorPosition: prev.position,
            pages: [resolution.normalizedPath],
            notes: [
              `impressionsDeltaPct=${delta.impressionsDeltaPct.toFixed(1)}`,
            ],
          },
          ...scored,
          recommendedActions: [
            {
              type: "strengthen-section",
              description: "Expand supporting sections while demand is rising",
              effort: "medium",
              risk: "low",
            },
          ],
          prerequisites: [],
          detectedAt: ctx.nowIso,
        }),
      );
    }
  }

  return out;
};
