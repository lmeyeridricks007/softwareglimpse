import type { ProductMedia } from "@/domain";
import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isLikelyBrandPromo } from "@/services/product-media/context-tab-media";
import { isMediaActivePublicDisplay } from "@/services/product-media/governance";

export type FeaturePageMediaContext = {
  featureSlug: string;
  /** Page URL slug when different from catalogue (e.g. multiple-pipelines). */
  pageFeatureSlug?: string;
  productSlug?: string;
  capabilitySlug?: string | null;
  relatedFeatureSlugs?: string[];
  relatedRequirementSlugs?: string[];
  evaluationDimensionIds?: string[];
};

export type FeatureSeeInActionCard = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  media: ProductMedia;
  whatThisShows: string[];
  whatNotEstablished: string[];
  demonstratedDimensionLabels: string[];
  verifiedAt: string | null;
  sourceOrganization: string;
};

/**
 * Relevance ranking for Feature Detail pages.
 * Prefer exact Feature (+ Product) over capability / related / overview.
 */
export function scoreFeaturePageMedia(
  media: ProductMedia,
  ctx: FeaturePageMediaContext,
): number {
  const m = enrichMediaFromSourceUrl(media);
  let score = 0;

  const exactFeature = m.featureIds.includes(ctx.featureSlug);
  const pageAlias =
    Boolean(ctx.pageFeatureSlug) &&
    ctx.pageFeatureSlug !== ctx.featureSlug &&
    m.featureIds.includes(ctx.pageFeatureSlug!);

  if (exactFeature || pageAlias) score += 20;
  if (ctx.productSlug && m.productSlug === ctx.productSlug) score += 12;

  if (ctx.capabilitySlug && m.capabilityIds.includes(ctx.capabilitySlug)) {
    score += 8;
  }

  const related = ctx.relatedFeatureSlugs ?? [];
  if (related.some((id) => m.featureIds.includes(id))) score += 6;

  const reqs = ctx.relatedRequirementSlugs ?? [];
  if (reqs.some((id) => m.requirementIds.includes(id))) score += 5;

  if (m.demonstratedDimensionIds.length > 0) {
    const dims = new Set(ctx.evaluationDimensionIds ?? []);
    const overlap = m.demonstratedDimensionIds.filter((d) => dims.has(d));
    score += overlap.length * 3;
  }

  if (m.type === "official-tutorial") score += 4;
  if (m.type === "official-webinar") score += 2;
  if (m.evidenceClaimKinds.includes("workflow-demo")) score += 3;
  if (m.evidenceClaimKinds.includes("feature-existence")) score += 1;
  if (m.whatThisShows.length > 0 || m.whatToNotice.length > 0) score += 2;

  if (isLikelyBrandPromo(m)) score -= 12;
  if (!exactFeature && !pageAlias && isLikelyBrandPromo(m)) score -= 8;

  return score;
}

function hasFeatureRelationship(
  media: ProductMedia,
  ctx: FeaturePageMediaContext,
): boolean {
  const m = enrichMediaFromSourceUrl(media);
  if (m.featureIds.includes(ctx.featureSlug)) return true;
  if (ctx.pageFeatureSlug && m.featureIds.includes(ctx.pageFeatureSlug)) {
    return true;
  }
  if (ctx.capabilitySlug && m.capabilityIds.includes(ctx.capabilitySlug)) {
    return true;
  }
  const related = ctx.relatedFeatureSlugs ?? [];
  if (related.some((id) => m.featureIds.includes(id))) return true;
  const reqs = ctx.relatedRequirementSlugs ?? [];
  if (reqs.some((id) => m.requirementIds.includes(id))) return true;
  return false;
}

/**
 * Eligible official media for a Feature Detail page.
 * Requires feature/capability/requirement relationship — not product-only.
 */
export function selectFeaturePageVideos(
  mediaPool: ProductMedia[],
  ctx: FeaturePageMediaContext,
  options?: { limit?: number; allowBrandPromoFallback?: boolean },
): ProductMedia[] {
  const limit = options?.limit ?? 4;
  const allowPromo = options?.allowBrandPromoFallback ?? false;

  const eligible = mediaPool
    .map(enrichMediaFromSourceUrl)
    .filter((m) => isVideoPublicEligible(m).eligible)
    .filter((m) => isMediaActivePublicDisplay(m))
    .filter((m) => hasFeatureRelationship(m, ctx))
    .filter((m) => {
      if (!isLikelyBrandPromo(m)) return true;
      return (
        allowPromo &&
        (m.featureIds.includes(ctx.featureSlug) ||
          Boolean(
            ctx.pageFeatureSlug &&
              m.featureIds.includes(ctx.pageFeatureSlug),
          ))
      );
    });

  const ranked = eligible
    .map((m) => ({ m, score: scoreFeaturePageMedia(m, ctx) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.m.title.localeCompare(b.m.title));

  const seen = new Set<string>();
  const out: ProductMedia[] = [];
  for (const { m } of ranked) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Pick up to `limit` product video cards for "See [feature] in action".
 * One best video per product; skip products without eligible media (no blank cards).
 */
export function selectFeatureSeeInActionCards(input: {
  mediaPool: ProductMedia[];
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  ctx: Omit<FeaturePageMediaContext, "productSlug">;
  dimensionLabelById: Map<string, string>;
  limit?: number;
}): FeatureSeeInActionCard[] {
  const limit = input.limit ?? 4;
  const cards: Array<FeatureSeeInActionCard & { score: number }> = [];

  for (const product of input.products) {
    const productMedia = input.mediaPool.filter(
      (m) => m.productSlug === product.slug,
    );
    const selected = selectFeaturePageVideos(
      productMedia,
      { ...input.ctx, productSlug: product.slug },
      { limit: 1, allowBrandPromoFallback: false },
    );
    const media = selected[0];
    if (!media) continue;

    const dims = media.demonstratedDimensionIds
      .map((id) => input.dimensionLabelById.get(id))
      .filter((l): l is string => Boolean(l));

    cards.push({
      productSlug: product.slug,
      productName: product.name,
      logo: product.logo,
      media,
      whatThisShows: mediaWhatThisShows(media),
      whatNotEstablished: mediaLimitations(media),
      demonstratedDimensionLabels: dims,
      verifiedAt: media.verifiedAt?.slice(0, 10) ?? null,
      sourceOrganization:
        media.sourceOrganization?.trim() ||
        media.channelName?.trim() ||
        `Official ${product.name}`,
      score: scoreFeaturePageMedia(media, {
        ...input.ctx,
        productSlug: product.slug,
      }),
    });
  }

  return cards
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _s, ...card }) => card);
}

/** Best single video for a product deep dive on this feature. */
export function selectFeatureDeepDiveVideo(
  mediaPool: ProductMedia[],
  ctx: FeaturePageMediaContext & { productSlug: string },
): ProductMedia | null {
  return (
    selectFeaturePageVideos(mediaPool, ctx, {
      limit: 1,
      allowBrandPromoFallback: false,
    })[0] ?? null
  );
}
