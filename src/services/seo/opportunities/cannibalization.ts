import { seoThresholds } from "@/data/config/seo/thresholds";
import { SeoOpportunitySchema, parseContentId } from "@/domain";
import { classifyQuery } from "../classify-query";
import { opportunityIdForCannibalization } from "../opportunity-ids";
import { scoreOpportunity } from "../score-opportunity";
import { resolveSearchUrl } from "../url-resolver";
import type { OpportunityDetector } from "./types";

type CannibalStrength = "healthy" | "possible" | "strong";

function pageTypeFromPath(path: string): string {
  const seg = path.replace(/^\/|\/$/g, "").split("/")[0] ?? "unknown";
  return seg;
}

function classifyCannibalization(
  intent: string,
  pageTypes: string[],
): CannibalStrength {
  const unique = [...new Set(pageTypes)];
  if (unique.length < 2) return "healthy";

  // Intent-aligned primary + supporting hub can be healthy.
  if (
    intent === "best" &&
    unique.includes("best") &&
    unique.includes("categories") &&
    unique.length === 2
  ) {
    return "possible";
  }

  if (unique.filter((t) => t === "software").length >= 2) return "strong";
  if (unique.includes("best") && unique.includes("categories")) return "possible";
  if (unique.length >= 2) return "possible";
  return "healthy";
}

export const detectCannibalization: OpportunityDetector = (ctx) => {
  const out = [];
  const byQuery = new Map<string, typeof ctx.pageQueryAggs>();

  for (const pq of ctx.pageQueryAggs) {
    if (pq.impressions < seoThresholds.cannibalizationMinImpressionOverlap) {
      continue;
    }
    const list = byQuery.get(pq.query) ?? [];
    list.push(pq);
    byQuery.set(pq.query, list);
  }

  for (const [query, rows] of byQuery) {
    if (rows.length < 2) continue;
    const paths = rows.map((r) => resolveSearchUrl(r.page));
    const pageTypes = paths.map((p) => pageTypeFromPath(p.normalizedPath));
    const classified = classifyQuery(query);
    const strength = classifyCannibalization(classified.intent, pageTypes);
    if (strength === "healthy") continue;

    const impressions = rows.reduce((s, r) => s + r.impressions, 0);
    const scored = scoreOpportunity({
      type: "cannibalization",
      impressions,
      position: Math.min(...rows.map((r) => r.position)),
      intent: classified.intent,
      effort: "medium",
      reasons: [
        `Query "${query}" ranks on ${rows.length} pages (${strength} cannibalization)`,
      ],
    });

    const contentIds = paths
      .map((p) => p.contentId)
      .filter((id): id is NonNullable<typeof id> => Boolean(id));

    out.push(
      SeoOpportunitySchema.parse({
        id: opportunityIdForCannibalization(query),
        type: "cannibalization",
        status: "detected",
        contentId: contentIds[0],
        query,
        productSlugs: classified.productSlugs,
        categorySlugs: classified.categorySlugs,
        evidence: {
          impressions,
          pages: paths.map((p) => p.normalizedPath),
          notes: [
            `strength=${strength}`,
            ...rows.map(
              (r) =>
                `${resolveSearchUrl(r.page).normalizedPath}: ${r.impressions} impr`,
            ),
          ],
        },
        ...scored,
        recommendedActions: [
          {
            type: "investigate-cannibalization",
            description: "Decide canonical target and differentiate supporting pages",
            effort: "medium",
            risk: "medium",
          },
          {
            type: "review-canonical",
            description: "Confirm canonical + internal linking hierarchy",
            effort: "small",
            risk: "low",
          },
        ],
        prerequisites: contentIds.map((id) => {
          try {
            const parsed = parseContentId(id);
            return `Review ${parsed.type}:${parsed.slug}`;
          } catch {
            return `Review ${id}`;
          }
        }),
        detectedAt: ctx.nowIso,
      }),
    );
  }

  return out;
};
