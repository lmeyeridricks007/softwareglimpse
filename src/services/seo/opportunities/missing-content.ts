import { seoThresholds } from "@/data/config/seo/thresholds";
import {
  canonicalizeComparisonSlug,
  SeoOpportunitySchema,
} from "@/domain";
import { classifyQuery } from "../classify-query";
import {
  opportunityIdForAlternatives,
  opportunityIdForComparison,
  opportunityIdForMissing,
  opportunityIdForPricing,
  opportunityIdForUseCase,
} from "../opportunity-ids";
import { scoreOpportunity } from "../score-opportunity";
import {
  findRegistryEntry,
  isLiveRegistryEntry,
  type OpportunityDetector,
} from "./types";
import { resolveAlternativeSlugs } from "@/services/graph/resolve-relationships";

/**
 * Gaps vs registry: comparison / alternatives / pricing / best / use-case.
 * Shells that are not published+indexable count as missing for SEO purposes.
 */
export const detectMissingContent: OpportunityDetector = (ctx) => {
  const out = [];

  for (const q of ctx.queryAggs) {
    if (q.impressions < seoThresholds.minImpressions) continue;
    const classified = classifyQuery(q.query);

    if (
      classified.intent === "comparison" &&
      classified.productSlugs.length >= 2
    ) {
      const [a, b] = classified.productSlugs;
      const slug = canonicalizeComparisonSlug([a, b]);
      const entry = findRegistryEntry(ctx.registry, "comparison", slug);
      if (!isLiveRegistryEntry(entry)) {
        const scored = scoreOpportunity({
          type: "comparison-opportunity",
          impressions: q.impressions,
          position: q.position,
          intent: "comparison",
          commercialBoost: Math.max(
            ctx.commercialBoostByProduct?.[a] ?? 0,
            ctx.commercialBoostByProduct?.[b] ?? 0,
          ),
          effort: "large",
          reasons: [
            `Query "${q.query}" has demand but no published indexable comparison for ${slug}`,
          ],
        });
        out.push(
          SeoOpportunitySchema.parse({
            id: opportunityIdForComparison([a, b]),
            type: "comparison-opportunity",
            status: "detected",
            query: q.query,
            productSlugs: [a, b].sort(),
            categorySlugs: classified.categorySlugs,
            evidence: {
              impressions: q.impressions,
              clicks: q.clicks,
              ctr: q.ctr,
              position: q.position,
              pages: [],
              notes: entry
                ? [`Shell exists (${entry.metadata.status}, indexable=${entry.seoIndexable})`]
                : ["No comparison entry in registry"],
            },
            ...scored,
            recommendedActions: [
              {
                type: "create-content",
                description: `Create comparison page for ${slug}`,
                effort: "large",
                risk: "medium",
              },
              {
                type: "queue-research",
                description: "Queue research before publishing comparison",
                effort: "medium",
                risk: "low",
              },
            ],
            prerequisites: [
              "Research facts for both products",
              "Editorial assessment — do not auto-publish",
            ],
            detectedAt: ctx.nowIso,
          }),
        );
      }
    }

    if (
      classified.intent === "alternatives" &&
      classified.productSlugs.length === 1
    ) {
      const product = classified.productSlugs[0];
      const entry = findRegistryEntry(ctx.registry, "alternatives", product);
      const altCount = resolveAlternativeSlugs(product).length;
      if (!isLiveRegistryEntry(entry) && altCount >= 2) {
        const scored = scoreOpportunity({
          type: "alternatives-opportunity",
          impressions: q.impressions,
          position: q.position,
          intent: "alternatives",
          commercialBoost: ctx.commercialBoostByProduct?.[product] ?? 0,
          effort: "large",
          reasons: [
            `Alternatives demand for ${product} with ${altCount} relationship targets but no live alternatives page`,
          ],
        });
        out.push(
          SeoOpportunitySchema.parse({
            id: opportunityIdForAlternatives(product),
            type: "alternatives-opportunity",
            status: "detected",
            query: q.query,
            productSlugs: [product],
            evidence: {
              impressions: q.impressions,
              clicks: q.clicks,
              position: q.position,
              pages: [],
              notes: [`alternative relationship count=${altCount}`],
            },
            ...scored,
            recommendedActions: [
              {
                type: "create-content",
                description: `Create alternatives page for ${product}`,
                effort: "large",
                risk: "medium",
              },
            ],
            prerequisites: ["Do not auto-publish from this opportunity"],
            detectedAt: ctx.nowIso,
          }),
        );
      }
    }

    if (
      classified.intent === "pricing" &&
      classified.productSlugs.length === 1
    ) {
      const product = classified.productSlugs[0];
      const entry = findRegistryEntry(ctx.registry, "pricing", product);
      if (!isLiveRegistryEntry(entry)) {
        const scored = scoreOpportunity({
          type: "pricing-opportunity",
          impressions: q.impressions,
          position: q.position,
          intent: "pricing",
          commercialBoost: ctx.commercialBoostByProduct?.[product] ?? 0,
          effort: "medium",
          reasons: [
            `Pricing query "${q.query}" without a published indexable pricing page for ${product}`,
          ],
        });
        out.push(
          SeoOpportunitySchema.parse({
            id: opportunityIdForPricing(product),
            type: "pricing-opportunity",
            status: "detected",
            query: q.query,
            productSlugs: [product],
            evidence: {
              impressions: q.impressions,
              clicks: q.clicks,
              position: q.position,
              pages: [],
              notes: [],
            },
            ...scored,
            recommendedActions: [
              {
                type: "create-content",
                description: `Create pricing page for ${product}`,
                effort: "medium",
                risk: "medium",
              },
            ],
            prerequisites: ["Verified pricing research required"],
            detectedAt: ctx.nowIso,
          }),
        );
      }
    }

    if (
      classified.intent === "best" &&
      classified.categorySlugs.length >= 1
    ) {
      const category = classified.categorySlugs[0];
      // Convention: best pages often use `{category}-software`
      const candidates = [
        `${category}-software`,
        category,
        ...ctx.registry
          .filter((e) => e.type === "best")
          .map((e) => e.slug),
      ];
      const live = candidates.some((slug) =>
        isLiveRegistryEntry(findRegistryEntry(ctx.registry, "best", slug)),
      );
      if (!live) {
        const scored = scoreOpportunity({
          type: "missing-content",
          impressions: q.impressions,
          position: q.position,
          intent: "best",
          effort: "large",
          reasons: [
            `Best-of demand for category ${category} without a live best page`,
          ],
        });
        out.push(
          SeoOpportunitySchema.parse({
            id: opportunityIdForMissing("missing-content", `best:${category}`),
            type: "missing-content",
            status: "detected",
            query: q.query,
            categorySlugs: [category],
            evidence: {
              impressions: q.impressions,
              clicks: q.clicks,
              position: q.position,
              pages: [],
              notes: [],
            },
            ...scored,
            recommendedActions: [
              {
                type: "create-content",
                description: `Create best page for ${category}`,
                effort: "large",
                risk: "high",
              },
            ],
            prerequisites: ["Editorial rankings must be approved — no auto-publish"],
            detectedAt: ctx.nowIso,
          }),
        );
      }
    }

    if (
      (classified.intent === "problem" || classified.businessTypeSlugs.length > 0) &&
      classified.categorySlugs.length >= 1
    ) {
      const key =
        classified.businessTypeSlugs[0] ??
        classified.audienceSlugs[0] ??
        classified.categorySlugs[0];
      const scored = scoreOpportunity({
        type: "use-case-opportunity",
        impressions: q.impressions,
        position: q.position,
        intent: classified.intent,
        effort: "large",
        reasons: [
          `Use-case / audience shaped demand for "${q.query}" may need dedicated coverage`,
        ],
      });
      out.push(
        SeoOpportunitySchema.parse({
          id: opportunityIdForUseCase(key),
          type: "use-case-opportunity",
          status: "detected",
          query: q.query,
          categorySlugs: classified.categorySlugs,
          productSlugs: classified.productSlugs,
          evidence: {
            impressions: q.impressions,
            clicks: q.clicks,
            position: q.position,
            pages: [],
            notes: [],
          },
          ...scored,
          recommendedActions: [
            {
              type: "queue-research",
              description: "Evaluate use-case / audience page brief",
              effort: "medium",
              risk: "low",
            },
          ],
          prerequisites: ["Do not auto-create public pages"],
          detectedAt: ctx.nowIso,
        }),
      );
    }
  }

  return out;
};
