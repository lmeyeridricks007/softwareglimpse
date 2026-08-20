import { seoThresholds } from "@/data/config/seo/thresholds";
import { SeoOpportunitySchema } from "@/domain";
import { classifyQuery } from "../classify-query";
import { opportunityIdForMismatch } from "../opportunity-ids";
import { scoreOpportunity } from "../score-opportunity";
import { resolveSearchUrl } from "../url-resolver";
import {
  findRegistryEntry,
  isLiveRegistryEntry,
  type OpportunityDetector,
} from "./types";

/**
 * Pricing (and similar) queries landing on software pages when a better
 * dedicated page exists or should exist.
 */
export const detectQueryPageMismatch: OpportunityDetector = (ctx) => {
  const out = [];

  for (const pq of ctx.pageQueryAggs) {
    if (pq.impressions < seoThresholds.minImpressions) continue;
    const classified = classifyQuery(pq.query);
    const resolution = resolveSearchUrl(pq.page);
    if (!resolution.contentId) continue;

    const path = resolution.normalizedPath;

    if (
      classified.intent === "pricing" &&
      classified.productSlugs.length === 1 &&
      path.startsWith("/software/")
    ) {
      const product = classified.productSlugs[0];
      const pricingEntry = findRegistryEntry(ctx.registry, "pricing", product);
      const scored = scoreOpportunity({
        type: "query-page-mismatch",
        impressions: pq.impressions,
        position: pq.position,
        intent: "pricing",
        commercialBoost: ctx.commercialBoostByProduct?.[product] ?? 0,
        effort: isLiveRegistryEntry(pricingEntry) ? "small" : "medium",
        reasons: [
          isLiveRegistryEntry(pricingEntry)
            ? `Pricing query "${pq.query}" lands on software page while /pricing/${product}/ exists`
            : `Pricing query "${pq.query}" lands on software page; dedicated pricing page missing or not live`,
        ],
      });

      out.push(
        SeoOpportunitySchema.parse({
          id: opportunityIdForMismatch(pq.query, resolution.contentId),
          type: "query-page-mismatch",
          status: "detected",
          contentId: resolution.contentId,
          query: pq.query,
          productSlugs: [product],
          evidence: {
            impressions: pq.impressions,
            clicks: pq.clicks,
            ctr: pq.ctr,
            position: pq.position,
            pages: [path],
            notes: pricingEntry
              ? [`pricing registry status=${pricingEntry.metadata.status}`]
              : ["no pricing registry entry"],
          },
          ...scored,
          recommendedActions: [
            {
              type: isLiveRegistryEntry(pricingEntry)
                ? "add-internal-link"
                : "create-content",
              description: isLiveRegistryEntry(pricingEntry)
                ? `Point pricing intent toward /pricing/${product}/`
                : `Create pricing page and retarget internal links`,
              effort: isLiveRegistryEntry(pricingEntry) ? "small" : "medium",
              risk: "low",
            },
          ],
          prerequisites: [],
          detectedAt: ctx.nowIso,
        }),
      );
    }

    if (
      classified.intent === "comparison" &&
      classified.productSlugs.length >= 2 &&
      path.startsWith("/software/")
    ) {
      const scored = scoreOpportunity({
        type: "query-page-mismatch",
        impressions: pq.impressions,
        position: pq.position,
        intent: "comparison",
        effort: "medium",
        reasons: [
          `Comparison query "${pq.query}" lands on a software review URL`,
        ],
      });
      out.push(
        SeoOpportunitySchema.parse({
          id: opportunityIdForMismatch(pq.query, resolution.contentId),
          type: "query-page-mismatch",
          status: "detected",
          contentId: resolution.contentId,
          query: pq.query,
          productSlugs: classified.productSlugs,
          evidence: {
            impressions: pq.impressions,
            clicks: pq.clicks,
            position: pq.position,
            pages: [path],
            notes: [],
          },
          ...scored,
          recommendedActions: [
            {
              type: "create-content",
              description: "Prefer a dedicated comparison URL for this intent",
              effort: "large",
              risk: "medium",
            },
          ],
          prerequisites: ["Do not auto-publish"],
          detectedAt: ctx.nowIso,
        }),
      );
    }
  }

  return out;
};
