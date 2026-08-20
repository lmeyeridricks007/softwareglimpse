import { seoThresholds } from "@/data/config/seo/thresholds";
import { SeoOpportunitySchema, parseContentId } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { getSoftwareRelationshipLinks } from "@/services/relationships/software-links";
import { opportunityIdForInternalLink } from "../opportunity-ids";
import { scoreOpportunity } from "../score-opportunity";
import { resolveSearchUrl } from "../url-resolver";
import type { OpportunityDetector } from "./types";

/**
 * High-performing source → related underperforming target without an existing link.
 * Uses relationship resolvers when available; keeps matching simple.
 */
export const detectInternalLinkOpportunities: OpportunityDetector = (ctx) => {
  const out = [];
  const pages = ctx.pageAggs
    .map((p) => ({ ...p, resolution: resolveSearchUrl(p.page) }))
    .filter((p) => p.resolution.contentId);

  const strong = pages.filter(
    (p) =>
      p.impressions >= seoThresholds.minImpressions &&
      p.clicks >= 10,
  );
  const weak = pages.filter(
    (p) =>
      p.impressions >= seoThresholds.minImpressions / 2 &&
      p.ctr < 0.02,
  );

  for (const source of strong) {
    const sourceId = source.resolution.contentId!;
    let parsed;
    try {
      parsed = parseContentId(sourceId);
    } catch {
      continue;
    }
    if (parsed.type !== "software") continue;
    const software = getSoftwareBySlug(parsed.slug);
    if (!software) continue;

    const existingHrefs = new Set(
      getSoftwareRelationshipLinks(software).map((l) => l.href),
    );

    for (const target of weak) {
      if (target.page === source.page) continue;
      const targetId = target.resolution.contentId!;
      const targetPath = target.resolution.normalizedPath;
      if (existingHrefs.has(targetPath)) continue;

      // Related if same category leaf or target is competitor/alternative path.
      let related = false;
      try {
        const t = parseContentId(targetId);
        if (
          t.type === "software" &&
          (software.competitorSlugs.includes(t.slug) ||
            software.alternativeSlugs.includes(t.slug) ||
            software.comparableSlugs.includes(t.slug))
        ) {
          related = true;
        }
        if (
          t.type === "category" &&
          (t.slug === software.primaryCategorySlug ||
            software.subcategorySlugs.includes(t.slug))
        ) {
          related = true;
        }
        if (t.type === "best" || t.type === "alternatives" || t.type === "pricing") {
          related = t.slug === software.slug || t.slug.includes(software.primaryCategorySlug);
        }
      } catch {
        related = false;
      }
      if (!related) continue;

      const scored = scoreOpportunity({
        type: "internal-link-opportunity",
        impressions: source.impressions,
        position: source.position,
        effort: "small",
        reasons: [
          `Strong page ${source.resolution.normalizedPath} could link to underperforming ${targetPath}`,
        ],
      });

      out.push(
        SeoOpportunitySchema.parse({
          id: opportunityIdForInternalLink(sourceId, targetId),
          type: "internal-link-opportunity",
          status: "detected",
          contentId: sourceId,
          productSlugs: [parsed.slug],
          evidence: {
            impressions: source.impressions,
            clicks: source.clicks,
            pages: [source.resolution.normalizedPath, targetPath],
            notes: [
              `sourceCtr=${source.ctr.toFixed(3)}`,
              `targetCtr=${target.ctr.toFixed(3)}`,
            ],
          },
          ...scored,
          recommendedActions: [
            {
              type: "add-internal-link",
              description: `Add contextual link from ${source.resolution.normalizedPath} to ${targetPath}`,
              effort: "small",
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
