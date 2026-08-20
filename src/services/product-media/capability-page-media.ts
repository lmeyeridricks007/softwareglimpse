import type { ProductMedia } from "@/domain";
import { mediaLimitations, mediaWhatThisShows } from "@/domain";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
} from "@/services/product-media";
import { isLikelyBrandPromo } from "@/services/product-media/context-tab-media";
import { isMediaActivePublicDisplay } from "@/services/product-media/governance";
import { resolveFeatureDetailHref } from "@/data/feature-detail";
import { resolveRequirementDetailHref } from "@/data/requirement-detail";
import { canonicalFeaturesSeed } from "@/data/seed/features";

export type CapabilityPageMediaContext = {
  capabilitySlug: string;
  /** Industry nest slug when on /industries/.../capabilities/... */
  industrySlug?: string | null;
  productSlug?: string;
  /** Related requirement slugs under this capability. */
  requirementIds?: string[];
  /** Related feature slugs under this capability. */
  featureIds?: string[];
  useCaseIds?: string[];
  /** Extra capability aliases (e.g. security-administration → security). */
  capabilityAliases?: string[];
};

export type CapabilityRelatedLink = {
  slug: string;
  label: string;
  href: string | null;
};

export type CapabilitySeeInActionCard = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  media: ProductMedia;
  whatThisShows: string[];
  /** Editorial observations — prefer whatToNotice, else derived. */
  whatToNotice: string[];
  whatNotEstablished: string[];
  relatedFeatures: CapabilityRelatedLink[];
  relatedRequirements: CapabilityRelatedLink[];
  relatedUseCases: CapabilityRelatedLink[];
  focusLabel: string | null;
  verifiedAt: string | null;
  sourceOrganization: string;
};

/** Map industry / composite capability slugs to ResearchMedia capabilityIds. */
export function capabilityMediaAliases(capabilitySlug: string): string[] {
  const map: Record<string, string[]> = {
    "security-administration": [
      "security-administration",
      "security",
      "administration",
    ],
    "reporting-forecasting": ["reporting-forecasting", "reporting", "forecasting"],
    reporting: ["reporting", "forecasting"],
  };
  return map[capabilitySlug] ?? [capabilitySlug];
}

function featureLabel(slug: string): string {
  return (
    canonicalFeaturesSeed.find((f) => f.slug === slug)?.name ??
    slug
      .split("-")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ")
  );
}

function matchesCapabilityIds(
  media: ProductMedia,
  ctx: CapabilityPageMediaContext,
): boolean {
  const ids = new Set([
    ctx.capabilitySlug,
    ...(ctx.capabilityAliases ?? capabilityMediaAliases(ctx.capabilitySlug)),
  ]);
  return media.capabilityIds.some((id) => ids.has(id));
}

/**
 * Deterministic relevance for Capability pages (display ranking only).
 * Never feeds ProductCapabilityAssessment / fit scores.
 *
 * Priority:
 * 1. Exact Capability + Product (+ industry)
 * 2. Requirement / Feature under Capability
 * 3. Workflow demo tied to Capability
 * 4. Generic product overview (low / fallback)
 */
export function scoreCapabilityPageMedia(
  media: ProductMedia,
  ctx: CapabilityPageMediaContext,
): number {
  const m = enrichMediaFromSourceUrl(media);
  let score = 0;

  const exactCapability = matchesCapabilityIds(m, ctx);
  if (exactCapability) score += 22;
  if (ctx.productSlug && m.productSlug === ctx.productSlug) score += 12;

  if (
    ctx.industrySlug &&
    m.industryIds.includes(ctx.industrySlug) &&
    exactCapability
  ) {
    score += 10;
  } else if (ctx.industrySlug && m.industryIds.includes(ctx.industrySlug)) {
    score += 4;
  }

  const features = ctx.featureIds ?? [];
  if (features.some((id) => m.featureIds.includes(id))) score += 10;

  const reqs = ctx.requirementIds ?? [];
  if (reqs.some((id) => m.requirementIds.includes(id))) score += 10;

  const useCases = ctx.useCaseIds ?? [];
  if (useCases.some((id) => m.useCaseIds.includes(id))) score += 6;

  if (m.evidenceClaimKinds.includes("workflow-demo")) score += 5;
  if (m.type === "official-tutorial") score += 4;
  if (m.type === "official-webinar") score += 2;
  if (m.whatThisShows.length > 0 || m.whatToNotice.length > 0) score += 2;

  // Prefer end-to-end workflow demos over narrow feature clips on capability pages.
  if (exactCapability && m.featureIds.length >= 2) score += 3;
  if (exactCapability && m.requirementIds.length >= 1) score += 2;

  if (isLikelyBrandPromo(m)) {
    score -= exactCapability ? 6 : 14;
  }

  // Generic overview without capability/feature/requirement relationship.
  if (
    !exactCapability &&
    !features.some((id) => m.featureIds.includes(id)) &&
    !reqs.some((id) => m.requirementIds.includes(id))
  ) {
    score -= 8;
  }

  return score;
}

function hasCapabilityRelationship(
  media: ProductMedia,
  ctx: CapabilityPageMediaContext,
): boolean {
  const m = enrichMediaFromSourceUrl(media);
  if (matchesCapabilityIds(m, ctx)) return true;

  // Media explicitly tagged to other capabilities should not leak via shared features.
  if (m.capabilityIds.length > 0 && !matchesCapabilityIds(m, ctx)) {
    return false;
  }

  const features = ctx.featureIds ?? [];
  if (features.some((id) => m.featureIds.includes(id))) return true;
  const reqs = ctx.requirementIds ?? [];
  if (reqs.some((id) => m.requirementIds.includes(id))) return true;
  const useCases = ctx.useCaseIds ?? [];
  if (useCases.some((id) => m.useCaseIds.includes(id))) return true;
  return false;
}

export function selectCapabilityPageVideos(
  mediaPool: ProductMedia[],
  ctx: CapabilityPageMediaContext,
  options?: { limit?: number; allowBrandPromoFallback?: boolean },
): ProductMedia[] {
  const limit = options?.limit ?? 4;
  const allowPromo = options?.allowBrandPromoFallback ?? false;

  const eligible = mediaPool
    .map(enrichMediaFromSourceUrl)
    .filter((m) => isVideoPublicEligible(m).eligible)
    .filter((m) => isMediaActivePublicDisplay(m))
    .filter((m) => hasCapabilityRelationship(m, ctx) || allowPromo)
    .filter((m) => {
      if (!isLikelyBrandPromo(m)) return true;
      return allowPromo && matchesCapabilityIds(m, ctx);
    });

  const ranked = eligible
    .map((m) => ({ m, score: scoreCapabilityPageMedia(m, ctx) }))
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

function resolveWhatToNotice(media: ProductMedia): string[] {
  if (media.whatToNotice.length > 0) return media.whatToNotice;
  // Prefer editorialCommentary split only when whatToNotice empty — keep short.
  if (media.editorialCommentary?.trim()) {
    return [media.editorialCommentary.trim()];
  }
  return [];
}

function focusFromMedia(media: ProductMedia, productName: string): string | null {
  if (media.demonstratesCaption?.trim()) return media.demonstratesCaption.trim();
  const shows = mediaWhatThisShows(media)[0];
  if (shows) return shows;
  return `${productName} workflow demonstration`;
}

/**
 * Pick 2–4 product workflow demos for "See [capability] in action".
 * One best video per product; skip products without eligible media.
 */
export function selectCapabilitySeeInActionCards(input: {
  mediaPool: ProductMedia[];
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  ctx: Omit<CapabilityPageMediaContext, "productSlug">;
  limit?: number;
}): CapabilitySeeInActionCard[] {
  const limit = input.limit ?? 4;
  const cards: Array<CapabilitySeeInActionCard & { score: number }> = [];

  for (const product of input.products) {
    const productMedia = input.mediaPool.filter(
      (m) => m.productSlug === product.slug,
    );
    const selected = selectCapabilityPageVideos(
      productMedia,
      { ...input.ctx, productSlug: product.slug },
      { limit: 1, allowBrandPromoFallback: false },
    );
    const media = selected[0];
    if (!media) continue;

    const relatedFeatures = media.featureIds.slice(0, 6).map((slug) => ({
      slug,
      label: featureLabel(slug),
      href: resolveFeatureDetailHref(slug),
    }));

    const relatedRequirements = media.requirementIds.slice(0, 6).map((slug) => ({
      slug,
      label: slug
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" "),
      href: resolveRequirementDetailHref(slug),
    }));

    const relatedUseCases = media.useCaseIds.slice(0, 4).map((slug) => ({
      slug,
      label: slug
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" "),
      href: `/use-cases/${slug}/`,
    }));

    cards.push({
      productSlug: product.slug,
      productName: product.name,
      logo: product.logo,
      media,
      whatThisShows: mediaWhatThisShows(media),
      whatToNotice: resolveWhatToNotice(media),
      whatNotEstablished: mediaLimitations(media),
      relatedFeatures,
      relatedRequirements,
      relatedUseCases,
      focusLabel: focusFromMedia(media, product.name),
      verifiedAt: media.verifiedAt?.slice(0, 10) ?? null,
      sourceOrganization:
        media.sourceOrganization?.trim() ||
        media.channelName?.trim() ||
        `Official ${product.name}`,
      score: scoreCapabilityPageMedia(media, {
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

export function selectCapabilityDeepDiveVideo(
  mediaPool: ProductMedia[],
  ctx: CapabilityPageMediaContext & { productSlug: string },
): ProductMedia | null {
  const productMedia = mediaPool.filter((m) => m.productSlug === ctx.productSlug);
  return (
    selectCapabilityPageVideos(productMedia, ctx, {
      limit: 1,
      allowBrandPromoFallback: false,
    })[0] ?? null
  );
}

/** Paired comparison modules — top 2 distinct product approaches. */
export function selectCapabilityApproachPairs(
  cards: CapabilitySeeInActionCard[],
): CapabilitySeeInActionCard[] {
  return cards.slice(0, 2);
}
