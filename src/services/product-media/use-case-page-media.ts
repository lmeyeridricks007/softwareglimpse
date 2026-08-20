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

export type UseCasePageMediaContext = {
  useCaseSlug: string;
  /** Industry nest slug when on /industries/.../use-cases/... */
  industrySlug?: string | null;
  productSlug?: string;
  capabilityIds?: string[];
  requirementIds?: string[];
  featureIds?: string[];
  /** Canonical workflow step ids from UseCaseHubProfile.workflowSteps. */
  workflowStepIds?: string[];
  /** Extra use-case aliases (hub ↔ graph slug mapping). */
  useCaseAliases?: string[];
};

export type WorkflowStepCoverageStatus =
  | "demonstrated"
  | "partial"
  | "not-shown";

export type WorkflowStepCoverage = {
  stepId: string;
  label: string;
  status: WorkflowStepCoverageStatus;
};

export type UseCaseRelatedLink = {
  slug: string;
  label: string;
  href: string | null;
};

export type UseCaseSeeInActionCard = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string } | null;
  media: ProductMedia;
  whatThisShows: string[];
  whatToNotice: string[];
  whatNotEstablished: string[];
  workflowCoverage: WorkflowStepCoverage[];
  relatedFeatures: UseCaseRelatedLink[];
  relatedRequirements: UseCaseRelatedLink[];
  relatedCapabilities: UseCaseRelatedLink[];
  focusLabel: string | null;
  verifiedAt: string | null;
  sourceOrganization: string;
};

/** Map hub / industry use-case slugs to ResearchMedia useCaseIds. */
export function useCaseMediaAliases(useCaseSlug: string): string[] {
  const map: Record<string, string[]> = {
    "lead-management": [
      "lead-management",
      "high-volume-lead-management",
      "sales-automation",
    ],
    "high-volume-lead-management": [
      "high-volume-lead-management",
      "lead-management",
    ],
    "sales-forecasting": ["sales-forecasting", "forecasting", "reporting"],
    "complex-sales-pipeline": [
      "complex-sales-pipeline",
      "complex-sales-processes",
      "pipeline-management",
    ],
    "complex-sales-processes": [
      "complex-sales-processes",
      "complex-sales-pipeline",
      "pipeline-management",
    ],
    "advisory-relationship-management": [
      "advisory-relationship-management",
      "relationship-management",
      "account-management",
      "client-relationship-management",
    ],
    "relationship-management": [
      "relationship-management",
      "account-management",
      "advisory-relationship-management",
    ],
    "account-management": [
      "account-management",
      "relationship-management",
    ],
    "sales-follow-up": [
      "sales-follow-up",
      "lead-management",
      "pipeline-management",
    ],
  };
  return map[useCaseSlug] ?? [useCaseSlug];
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

function labelFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function matchesUseCaseIds(
  media: ProductMedia,
  ctx: UseCasePageMediaContext,
): boolean {
  const ids = new Set([
    ctx.useCaseSlug,
    ...(ctx.useCaseAliases ?? useCaseMediaAliases(ctx.useCaseSlug)),
  ]);
  return media.useCaseIds.some((id) => ids.has(id));
}

/**
 * Deterministic display relevance for Use Case pages.
 * Never feeds product scoring / ranking.
 *
 * Priority:
 * 1. Exact UseCase + Product (+ Industry)
 * 2. Workflow-step / requirement under Use Case
 * 3. Capability / feature strongly relevant to workflow
 * 4. Generic product overview (last resort / low)
 */
export function scoreUseCasePageMedia(
  media: ProductMedia,
  ctx: UseCasePageMediaContext,
): number {
  const m = enrichMediaFromSourceUrl(media);
  let score = 0;

  const exactUseCase = matchesUseCaseIds(m, ctx);
  if (exactUseCase) score += 24;
  if (ctx.productSlug && m.productSlug === ctx.productSlug) score += 12;

  if (
    ctx.industrySlug &&
    m.industryIds.includes(ctx.industrySlug) &&
    exactUseCase
  ) {
    score += 12;
  } else if (ctx.industrySlug && m.industryIds.includes(ctx.industrySlug)) {
    // Do not treat generic industry-tagged media as industry-specific demo
    // unless also use-case related.
    score += exactUseCase ? 6 : 2;
  }

  const steps = ctx.workflowStepIds ?? [];
  if (steps.some((id) => m.workflowStageIds.includes(id))) score += 14;

  const reqs = ctx.requirementIds ?? [];
  if (reqs.some((id) => m.requirementIds.includes(id))) score += 10;

  const caps = ctx.capabilityIds ?? [];
  if (caps.some((id) => m.capabilityIds.includes(id))) score += 8;

  const features = ctx.featureIds ?? [];
  if (features.some((id) => m.featureIds.includes(id))) score += 7;

  if (m.evidenceClaimKinds.includes("workflow-demo")) score += 6;
  if (m.type === "official-tutorial") score += 4;
  if (m.type === "official-webinar") score += 2;
  if (m.whatThisShows.length > 0 || m.whatToNotice.length > 0) score += 2;

  // Prefer workflow demos over generic tours when use-case tagged.
  if (exactUseCase && m.workflowStageIds.length >= 2) score += 4;
  if (exactUseCase && m.featureIds.length >= 2) score += 2;

  if (isLikelyBrandPromo(m)) {
    score -= exactUseCase ? 8 : 16;
  }

  // Generic overview without use-case / workflow / requirement relationship.
  if (
    !exactUseCase &&
    !steps.some((id) => m.workflowStageIds.includes(id)) &&
    !reqs.some((id) => m.requirementIds.includes(id)) &&
    !caps.some((id) => m.capabilityIds.includes(id)) &&
    !features.some((id) => m.featureIds.includes(id))
  ) {
    score -= 10;
  }

  return score;
}

function hasUseCaseRelationship(
  media: ProductMedia,
  ctx: UseCasePageMediaContext,
): boolean {
  const m = enrichMediaFromSourceUrl(media);
  if (matchesUseCaseIds(m, ctx)) return true;

  // Explicitly tagged to other use cases — do not leak via shared features alone.
  if (m.useCaseIds.length > 0 && !matchesUseCaseIds(m, ctx)) {
    const steps = ctx.workflowStepIds ?? [];
    if (steps.some((id) => m.workflowStageIds.includes(id))) return true;
    return false;
  }

  const steps = ctx.workflowStepIds ?? [];
  if (steps.some((id) => m.workflowStageIds.includes(id))) return true;
  const reqs = ctx.requirementIds ?? [];
  if (reqs.some((id) => m.requirementIds.includes(id))) return true;
  const caps = ctx.capabilityIds ?? [];
  if (caps.some((id) => m.capabilityIds.includes(id))) return true;
  const features = ctx.featureIds ?? [];
  if (features.some((id) => m.featureIds.includes(id))) return true;
  return false;
}

function hasStrongUseCaseDemoRelationship(
  media: ProductMedia,
  ctx: UseCasePageMediaContext,
): boolean {
  const m = enrichMediaFromSourceUrl(media);
  if (matchesUseCaseIds(m, ctx)) return true;
  const steps = ctx.workflowStepIds ?? [];
  if (steps.some((id) => m.workflowStageIds.includes(id))) return true;
  const reqs = ctx.requirementIds ?? [];
  if (reqs.some((id) => m.requirementIds.includes(id))) return true;
  return false;
}

export function selectUseCasePageVideos(
  mediaPool: ProductMedia[],
  ctx: UseCasePageMediaContext,
  options?: {
    limit?: number;
    allowBrandPromoFallback?: boolean;
    /** When true (default for see-in-action), require useCase / workflow / requirement match. */
    requireStrongMatch?: boolean;
  },
): ProductMedia[] {
  const limit = options?.limit ?? 3;
  const allowPromo = options?.allowBrandPromoFallback ?? false;
  const requireStrong = options?.requireStrongMatch ?? false;

  const eligible = mediaPool
    .map(enrichMediaFromSourceUrl)
    .filter((m) => isVideoPublicEligible(m).eligible)
    .filter((m) => isMediaActivePublicDisplay(m))
    .filter((m) =>
      requireStrong
        ? hasStrongUseCaseDemoRelationship(m, ctx)
        : hasUseCaseRelationship(m, ctx) || allowPromo,
    )
    .filter((m) => {
      if (!isLikelyBrandPromo(m)) return true;
      return allowPromo && matchesUseCaseIds(m, ctx);
    });

  const ranked = eligible
    .map((m) => ({ m, score: scoreUseCasePageMedia(m, ctx) }))
    // Exact use-case / workflow / requirement relevance — exclude weak generics.
    .filter((x) => x.score >= (requireStrong ? 18 : 1))
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
 * Map ResearchMedia workflowStageIds + whatThisShows onto page workflow steps.
 * Status is display-only — never product support.
 */
export function buildWorkflowCoverageForMedia(
  media: ProductMedia,
  steps: Array<{ id: string; label: string }>,
): WorkflowStepCoverage[] {
  const m = enrichMediaFromSourceUrl(media);
  const stageSet = new Set(m.workflowStageIds.map((s) => s.toLowerCase()));
  const shows = mediaWhatThisShows(m).join(" ").toLowerCase();

  return steps.map((step) => {
    const id = step.id.toLowerCase();
    const label = step.label.toLowerCase();
    if (stageSet.has(id) || stageSet.has(label.replace(/\s+/g, "-"))) {
      return { stepId: step.id, label: step.label, status: "demonstrated" };
    }
    // Light text hint — only when stage ids absent for this step.
    const keywords = [id, label, ...label.split(/\s+/)].filter(
      (k) => k.length > 3,
    );
    const hit = keywords.some((k) => shows.includes(k));
    if (hit) {
      return { stepId: step.id, label: step.label, status: "partial" };
    }
    return { stepId: step.id, label: step.label, status: "not-shown" };
  });
}

function resolveWhatToNotice(media: ProductMedia): string[] {
  if (media.whatToNotice.length > 0) return media.whatToNotice;
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
 * Pick 1–3 product workflow demos for "See this workflow in action".
 * One best video per product; skip products without eligible media.
 */
export function selectUseCaseSeeInActionCards(input: {
  mediaPool: ProductMedia[];
  products: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  workflowSteps: Array<{ id: string; label: string }>;
  ctx: Omit<UseCasePageMediaContext, "productSlug">;
  limit?: number;
}): UseCaseSeeInActionCard[] {
  const limit = input.limit ?? 3;
  const cards: Array<UseCaseSeeInActionCard & { score: number }> = [];

  for (const product of input.products) {
    const productMedia = input.mediaPool.filter(
      (m) => m.productSlug === product.slug,
    );
    const selected = selectUseCasePageVideos(
      productMedia,
      { ...input.ctx, productSlug: product.slug },
      { limit: 1, allowBrandPromoFallback: false, requireStrongMatch: true },
    );
    const media = selected[0];
    if (!media) continue;

    cards.push({
      productSlug: product.slug,
      productName: product.name,
      logo: product.logo,
      media,
      whatThisShows: mediaWhatThisShows(media),
      whatToNotice: resolveWhatToNotice(media),
      whatNotEstablished: mediaLimitations(media),
      workflowCoverage: buildWorkflowCoverageForMedia(
        media,
        input.workflowSteps,
      ),
      relatedFeatures: media.featureIds.slice(0, 6).map((slug) => ({
        slug,
        label: featureLabel(slug),
        href: resolveFeatureDetailHref(slug),
      })),
      relatedRequirements: media.requirementIds.slice(0, 6).map((slug) => ({
        slug,
        label: labelFromSlug(slug),
        href: resolveRequirementDetailHref(slug),
      })),
      relatedCapabilities: media.capabilityIds.slice(0, 6).map((slug) => ({
        slug,
        label: labelFromSlug(slug),
        href: `/capabilities/${slug}/`,
      })),
      focusLabel: focusFromMedia(media, product.name),
      verifiedAt: media.verifiedAt?.slice(0, 10) ?? null,
      sourceOrganization:
        media.sourceOrganization?.trim() ||
        media.channelName?.trim() ||
        `Official ${product.name}`,
      score: scoreUseCasePageMedia(media, {
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

export function selectUseCaseDeepDiveVideo(
  mediaPool: ProductMedia[],
  ctx: UseCasePageMediaContext & { productSlug: string },
  options?: { requireStrongMatch?: boolean },
): ProductMedia | null {
  const productMedia = mediaPool.filter((m) => m.productSlug === ctx.productSlug);
  return (
    selectUseCasePageVideos(productMedia, ctx, {
      limit: 1,
      allowBrandPromoFallback: false,
      requireStrongMatch: options?.requireStrongMatch ?? true,
    })[0] ?? null
  );
}

/** Paired comparison — top 2 distinct product approaches. */
export function selectUseCaseApproachPairs(
  cards: UseCaseSeeInActionCard[],
): UseCaseSeeInActionCard[] {
  return cards.slice(0, 2);
}
