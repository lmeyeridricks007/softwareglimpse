import { expectedCtrForPosition } from "@/data/config/seo/ctr-baselines";
import { seoThresholds } from "@/data/config/seo/thresholds";
import { SeoOpportunitySchema } from "@/domain";
import { classifyQuery } from "../classify-query";
import {
  opportunityIdForCtr,
  opportunityIdForNoClick,
} from "../opportunity-ids";
import { scoreOpportunity } from "../score-opportunity";
import { resolveSearchUrl } from "../url-resolver";
import type { OpportunityDetector } from "./types";

export const detectLowCtr: OpportunityDetector = (ctx) => {
  const out = [];

  for (const pq of ctx.pageQueryAggs) {
    if (pq.impressions < seoThresholds.minImpressions) continue;
    const expected = expectedCtrForPosition(pq.position);
    if (expected == null) continue;

    const resolution = resolveSearchUrl(pq.page);
    if (!resolution.contentId) continue;
    const classified = classifyQuery(pq.query);

    // High impression, zero clicks
    if (
      pq.clicks === 0 &&
      pq.impressions >= seoThresholds.minImpressionsNoClick
    ) {
      const scored = scoreOpportunity({
        type: "high-impression-no-click",
        impressions: pq.impressions,
        position: pq.position,
        intent: classified.intent,
        effort: "small",
        reasons: [
          `${pq.impressions} impressions with 0 clicks at position ${pq.position.toFixed(1)}`,
        ],
      });
      out.push(
        SeoOpportunitySchema.parse({
          id: opportunityIdForNoClick(resolution.contentId, pq.query),
          type: "high-impression-no-click",
          status: "detected",
          contentId: resolution.contentId,
          query: pq.query,
          productSlugs: classified.productSlugs,
          categorySlugs: classified.categorySlugs,
          evidence: {
            impressions: pq.impressions,
            clicks: 0,
            ctr: 0,
            position: pq.position,
            pages: [resolution.normalizedPath],
            notes: [],
          },
          ...scored,
          recommendedActions: [
            {
              type: "improve-title",
              description: "Rewrite title/meta to match intent and improve CTR",
              effort: "small",
              risk: "low",
            },
          ],
          prerequisites: [],
          detectedAt: ctx.nowIso,
        }),
      );
      continue;
    }

    const ratio = expected > 0 ? pq.ctr / expected : 1;
    const gap = expected - pq.ctr;
    if (
      ratio > seoThresholds.lowCtrRatio &&
      gap < seoThresholds.lowCtrGapAbs
    ) {
      continue;
    }
    if (pq.ctr >= expected) continue;

    const scored = scoreOpportunity({
      type: "high-impression-low-ctr",
      impressions: pq.impressions,
      position: pq.position,
      intent: classified.intent,
      commercialBoost: classified.productSlugs
        .map((s) => ctx.commercialBoostByProduct?.[s] ?? 0)
        .reduce((a, b) => Math.max(a, b), 0),
      effort: "small",
      reasons: [
        `CTR ${(pq.ctr * 100).toFixed(1)}% below expected ~${(expected * 100).toFixed(1)}% at position ${pq.position.toFixed(1)}`,
      ],
    });

    out.push(
      SeoOpportunitySchema.parse({
        id: opportunityIdForCtr(resolution.contentId),
        type: "high-impression-low-ctr",
        status: "detected",
        contentId: resolution.contentId,
        query: pq.query,
        productSlugs: classified.productSlugs,
        categorySlugs: classified.categorySlugs,
        evidence: {
          impressions: pq.impressions,
          clicks: pq.clicks,
          ctr: pq.ctr,
          position: pq.position,
          pages: [resolution.normalizedPath],
          notes: [`Expected CTR mid ≈ ${expected}`],
        },
        ...scored,
        recommendedActions: [
          {
            type: "improve-title",
            description: "Improve title for higher CTR at current position",
            effort: "small",
            risk: "low",
          },
          {
            type: "improve-meta",
            description: "Improve meta description to match query intent",
            effort: "small",
            risk: "low",
          },
        ],
        prerequisites: [],
        detectedAt: ctx.nowIso,
      }),
    );
  }

  return out;
};
