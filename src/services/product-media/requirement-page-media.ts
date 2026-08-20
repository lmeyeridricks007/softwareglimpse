import type { ProductMedia } from "@/domain";
import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isLikelyBrandPromo } from "@/services/product-media/context-tab-media";
import { isMediaActivePublicDisplay } from "@/services/product-media/governance";

export type RequirementPageMediaContext = {
  requirementSlug: string;
  productSlug?: string;
  industrySlug?: string | null;
  capabilitySlug?: string | null;
  /** Required + strongly-supporting feature slugs. */
  coreFeatureSlugs?: string[];
  /** Supporting / optional feature slugs. */
  supportingFeatureSlugs?: string[];
  criterionIds?: string[];
  useCaseSlugs?: string[];
  /**
   * When true (see-in-action), require a strong requirement/feature match —
   * never attach generic product tours just because they share a product.
   */
  requireStrongMatch?: boolean;
};

export type RequirementSeeSupportCard = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  media: ProductMedia;
  title: string;
  sourceOrganization: string;
  whatThisShows: string[];
  whatNotEstablished: string[];
  /** Criterion ids/labels this video may support (partial requirement evidence). */
  criteriaSupported: Array<{ id: string; name: string }>;
  /** Features visibly tagged on the media that relate to this requirement. */
  featuresDemonstrated: Array<{
    slug: string;
    name: string;
    href: string | null;
    shown: boolean;
  }>;
  verifiedAt: string | null;
  relevanceNote: string | null;
  relatedUseCase: { slug: string; name: string; href: string } | null;
};

/**
 * Relevance for Requirement Detail — display only; never affects fit scores.
 *
 * Priority:
 * 1. exact Requirement + Product (+ Industry)
 * 2. exact Requirement + Product
 * 3. required Features under Requirement
 * 4. strongly-supporting Features
 * 5. Capability workflow
 * 6. Use Case workflow
 * 7. generic product overview (low)
 */
export function scoreRequirementPageMedia(
  media: ProductMedia,
  ctx: RequirementPageMediaContext,
): number {
  const m = enrichMediaFromSourceUrl(media);
  let score = 0;

  const exactReq = m.requirementIds.includes(ctx.requirementSlug);
  const exactProduct =
    Boolean(ctx.productSlug) && m.productSlug === ctx.productSlug;
  const exactIndustry =
    Boolean(ctx.industrySlug) &&
    m.industryIds.includes(ctx.industrySlug!);

  if (exactReq && exactProduct && exactIndustry) score += 40;
  else if (exactReq && exactProduct) score += 32;
  else if (exactReq) score += 22;

  const core = ctx.coreFeatureSlugs ?? [];
  const supporting = ctx.supportingFeatureSlugs ?? [];
  if (core.some((f) => m.featureIds.includes(f))) score += 18;
  else if (supporting.some((f) => m.featureIds.includes(f))) score += 12;

  if (ctx.capabilitySlug && m.capabilityIds.includes(ctx.capabilitySlug)) {
    score += 8;
  }

  const useCases = ctx.useCaseSlugs ?? [];
  if (useCases.some((u) => m.useCaseIds.includes(u))) score += 6;

  const criteria = new Set(ctx.criterionIds ?? []);
  const criterionHits = (m.requirementCriterionIds ?? []).filter((id) =>
    criteria.has(id),
  );
  score += criterionHits.length * 5;

  if (m.type === "official-tutorial") score += 4;
  if (m.type === "official-webinar") score += 2;
  if (m.evidenceClaimKinds.includes("workflow-demo")) score += 3;
  if (m.whatThisShows.length > 0 || m.whatToNotice.length > 0) score += 2;

  if (isLikelyBrandPromo(m)) score -= 14;
  if (!exactReq && !core.some((f) => m.featureIds.includes(f))) {
    // Generic product video — last resort only
    score -= 6;
  }

  return score;
}

function hasStrongRequirementMatch(
  media: ProductMedia,
  ctx: RequirementPageMediaContext,
): boolean {
  const m = enrichMediaFromSourceUrl(media);
  if (m.requirementIds.includes(ctx.requirementSlug)) return true;
  const core = ctx.coreFeatureSlugs ?? [];
  if (core.some((f) => m.featureIds.includes(f))) return true;
  const criteria = new Set(ctx.criterionIds ?? []);
  if ((m.requirementCriterionIds ?? []).some((id) => criteria.has(id))) {
    return true;
  }
  return false;
}

export function selectRequirementPageVideos(
  pool: ProductMedia[],
  ctx: RequirementPageMediaContext,
  options?: { limit?: number },
): ProductMedia[] {
  const limit = options?.limit ?? 3;
  const requireStrong = ctx.requireStrongMatch !== false;

  const ranked = pool
    .map((media) => {
      const enriched = enrichMediaFromSourceUrl(media);
      if (!isMediaActivePublicDisplay(enriched)) return null;
      if (!isVideoPublicEligible(enriched).eligible) return null;
      if (requireStrong && !hasStrongRequirementMatch(enriched, ctx)) {
        return null;
      }
      const score = scoreRequirementPageMedia(enriched, ctx);
      if (score <= 0) return null;
      return { media: enriched, score };
    })
    .filter((x): x is { media: ProductMedia; score: number } => x != null)
    .sort((a, b) => b.score - a.score || a.media.id.localeCompare(b.media.id));

  const seen = new Set<string>();
  const out: ProductMedia[] = [];
  for (const { media } of ranked) {
    if (seen.has(media.id)) continue;
    seen.add(media.id);
    out.push(media);
    if (out.length >= limit) break;
  }
  return out;
}

function featureHref(slug: string, pageSlug?: string | null): string | null {
  const page = pageSlug ?? slug;
  return `/features/${page}/`;
}

/**
 * Build “See what support looks like” cards (max 2–3 products).
 * One best video per product; screenshots handled separately as fallback.
 */
export function selectRequirementSeeSupportCards(input: {
  mediaPool: ProductMedia[];
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  ctx: Omit<RequirementPageMediaContext, "productSlug">;
  criteria: Array<{ id: string; name: string }>;
  features: Array<{
    slug: string;
    name: string;
    pageSlug?: string | null;
    relationship: string;
  }>;
  useCaseLinks?: Array<{ id: string; title: string; href?: string }>;
  limit?: number;
}): RequirementSeeSupportCard[] {
  const limit = input.limit ?? 3;
  const cards: RequirementSeeSupportCard[] = [];

  for (const product of input.products) {
    const productMedia = input.mediaPool.filter(
      (m) => m.productSlug === product.slug,
    );
    const selected = selectRequirementPageVideos(
      productMedia,
      { ...input.ctx, productSlug: product.slug, requireStrongMatch: true },
      { limit: 1 },
    );
    const media = selected[0];
    if (!media) continue;

    const criterionIds = new Set(media.requirementCriterionIds ?? []);
    const criteriaSupported = input.criteria.filter((c) =>
      criterionIds.has(c.id),
    );

    const featureMeta = input.features;
    const featuresDemonstrated = featureMeta.map((f) => ({
      slug: f.slug,
      name: f.name,
      href: featureHref(f.slug, f.pageSlug),
      shown: media.featureIds.includes(f.slug),
    }));

    const relatedUseCaseId = media.useCaseIds.find((u) =>
      (input.useCaseLinks ?? []).some((l) => l.id === u || l.href?.includes(u)),
    );
    const useCaseLink = relatedUseCaseId
      ? (input.useCaseLinks ?? []).find(
          (l) =>
            l.id === relatedUseCaseId ||
            l.href?.includes(relatedUseCaseId),
        )
      : null;

    const industrySpecific =
      Boolean(input.ctx.industrySlug) &&
      media.industryIds.includes(input.ctx.industrySlug!);

    cards.push({
      productSlug: product.slug,
      productName: product.name,
      logo: product.logo,
      media,
      title: media.demonstratesCaption?.trim() || media.title,
      sourceOrganization:
        media.sourceOrganization?.trim() ||
        media.channelName?.trim() ||
        `Official ${product.name}`,
      whatThisShows: mediaWhatThisShows(media),
      whatNotEstablished: mediaLimitations(media),
      criteriaSupported,
      featuresDemonstrated,
      verifiedAt: media.verifiedAt?.slice(0, 10) ?? null,
      relevanceNote: industrySpecific
        ? null
        : input.ctx.industrySlug
          ? `Official ${product.name} demonstration — not industry-specific`
          : null,
      relatedUseCase: useCaseLink?.href
        ? {
            slug: relatedUseCaseId!,
            name: useCaseLink.title,
            href: useCaseLink.href,
          }
        : null,
    });

    if (cards.length >= limit) break;
  }

  return cards;
}

/**
 * Official video may attach to a criterion cell only when:
 * 1. requirementCriterionIds explicitly includes the criterion, OR
 * 2. media has no criterion tags AND overlaps criterion featureIds AND
 *    is tagged to this requirement (or its core features).
 *
 * If criterion tags exist and omit this criterion → never show (e.g. do not
 * show an Independent-stages video under Access control).
 */
export function mediaMatchesRequirementCriterion(
  media: ProductMedia,
  input: {
    requirementSlug: string;
    criterionId: string;
    criterionFeatureSlugs: string[];
  },
): boolean {
  const m = enrichMediaFromSourceUrl(media);
  if (m.productSlug == null) return false;

  const tagged = m.requirementCriterionIds ?? [];
  if (tagged.length > 0) {
    return tagged.includes(input.criterionId);
  }

  const featureHit = input.criterionFeatureSlugs.some((f) =>
    m.featureIds.includes(f),
  );
  if (!featureHit) return false;

  // Untagged media: require requirement link when present; otherwise feature overlap only
  if (m.requirementIds.length > 0) {
    return m.requirementIds.includes(input.requirementSlug);
  }
  return true;
}

/**
 * Cell-scoped video: requirement + criterion + product.
 * Tagged criteria win; never leak unrelated videos into other criteria.
 */
export function selectCriterionScopedVideos(input: {
  mediaPool: ProductMedia[];
  requirementSlug: string;
  criterionId: string;
  productSlug: string;
  criterionFeatureSlugs: string[];
  limit?: number;
}): ProductMedia[] {
  const limit = input.limit ?? 2;
  const ranked = input.mediaPool
    .filter((m) => m.productSlug === input.productSlug)
    .map((m) => enrichMediaFromSourceUrl(m))
    .filter((m) => isMediaActivePublicDisplay(m))
    .filter((m) => isVideoPublicEligible(m).eligible)
    .filter((m) =>
      mediaMatchesRequirementCriterion(m, {
        requirementSlug: input.requirementSlug,
        criterionId: input.criterionId,
        criterionFeatureSlugs: input.criterionFeatureSlugs,
      }),
    );

  ranked.sort((a, b) => {
    const aTag = (a.requirementCriterionIds ?? []).includes(input.criterionId)
      ? 1
      : 0;
    const bTag = (b.requirementCriterionIds ?? []).includes(input.criterionId)
      ? 1
      : 0;
    return bTag - aTag || a.id.localeCompare(b.id);
  });

  const seen = new Set<string>();
  const out: ProductMedia[] = [];
  for (const m of ranked) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
    if (out.length >= limit) break;
  }
  return out;
}

/** @deprecated Prefer selectCriterionScopedVideos — same behavior. */
export function selectCriterionEvidenceVideos(
  input: Parameters<typeof selectCriterionScopedVideos>[0],
): ProductMedia[] {
  return selectCriterionScopedVideos(input);
}
