import { seoThresholds } from "@/data/config/seo/thresholds";
import { SeoOpportunitySchema } from "@/domain";
import { classifyQuery } from "../classify-query";
import { opportunityIdForStrikingDistance } from "../opportunity-ids";
import { scoreOpportunity } from "../score-opportunity";
import { resolveSearchUrl } from "../url-resolver";
import type { OpportunityDetector } from "./types";

export const detectStrikingDistance: OpportunityDetector = (ctx) => {
  const out = [];
  const { min, max } = seoThresholds.strikingDistance;

  for (const pq of ctx.pageQueryAggs) {
    if (pq.impressions < seoThresholds.minImpressions) continue;
    if (pq.position < min || pq.position > max) continue;

    const resolution = resolveSearchUrl(pq.page);
    if (!resolution.contentId) continue;

    const classified = classifyQuery(pq.query);
    const scored = scoreOpportunity({
      type: "striking-distance",
      impressions: pq.impressions,
      position: pq.position,
      intent: classified.intent,
      commercialBoost: classified.productSlugs
        .map((s) => ctx.commercialBoostByProduct?.[s] ?? 0)
        .reduce((a, b) => Math.max(a, b), 0),
      effort: "medium",
      reasons: [
        `Query "${pq.query}" sits at position ${pq.position.toFixed(1)} (striking distance ${min}–${max}) with ${pq.impressions} impressions`,
      ],
    });

    out.push(
      SeoOpportunitySchema.parse({
        id: opportunityIdForStrikingDistance(resolution.contentId, pq.query),
        type: "striking-distance",
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
          notes: ["Synthetic-capable detector; fixtures labeled separately"],
        },
        ...scored,
        recommendedActions: [
          {
            type: "strengthen-section",
            description: `Strengthen on-page coverage for "${pq.query}" to improve from position ${pq.position.toFixed(1)}`,
            effort: "medium",
            risk: "low",
          },
          {
            type: "improve-title",
            description: "Tighten title/H1 alignment with the query intent",
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
