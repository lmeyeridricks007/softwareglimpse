import type { ProductMedia, ProductScreenshot } from "@/domain";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
  selectProductVideos,
} from "@/services/product-media";

/** Prefer workflow/tutorial media over brand-overview promos on Use Cases. */
export function isLikelyBrandPromo(media: ProductMedia): boolean {
  if (media.type === "official-tutorial" || media.type === "official-webinar") {
    return false;
  }
  if (media.evidenceClaimKinds.includes("setup-tutorial")) return false;
  if (media.useCaseIds.length > 0) return false;
  const placements = media.placements;
  return (
    placements.includes("overview") &&
    (placements.length <= 2 ||
      (!placements.includes("implementation") &&
        !placements.includes("features")))
  );
}

function scoreUseCaseVideo(media: ProductMedia, useCaseSlug: string): number {
  let score = 0;
  if (media.useCaseIds.includes(useCaseSlug)) score += 12;
  if (media.featureIds.includes(useCaseSlug)) score += 8;
  if (media.type === "official-tutorial") score += 4;
  if (media.type === "official-webinar") score += 2;
  if (media.evidenceClaimKinds.includes("workflow-demo")) score += 3;
  if (media.evidenceClaimKinds.includes("setup-tutorial")) score += 2;
  if (isLikelyBrandPromo(media)) score -= 10;
  return score;
}

function screenshotMatchesUseCase(
  shot: ProductScreenshot,
  useCaseSlug: string,
): boolean {
  if (shot.useCaseIds?.includes(useCaseSlug)) return true;
  const id = (shot.id ?? "").toLowerCase();
  const annotation = (shot.annotation ?? "").toLowerCase();
  return (
    id.includes(`usecase-${useCaseSlug}`) ||
    id.includes(`-workflow-usecase-${useCaseSlug}`) ||
    annotation.includes(`use-case:${useCaseSlug}`) ||
    annotation.includes(`usecase:${useCaseSlug}`)
  );
}

export type UseCaseMediaBundle = {
  useCaseSlug: string;
  video: ProductMedia | null;
  /** SoftwareGlimpse original workflow diagram when no/alongside video. */
  diagram: ProductScreenshot | null;
};

/**
 * Resolve one workflow-oriented official video per use case, plus an optional
 * SoftwareGlimpse original workflow diagram from enrichment screenshots.
 */
export function buildUseCaseTabMediaMap(input: {
  media: ProductMedia[] | undefined;
  screenshots?: ProductScreenshot[];
  useCaseSlugs: string[];
  overviewVideoIds?: string[];
  maxVideos?: number;
}): Map<string, UseCaseMediaBundle> {
  const maxVideos = input.maxVideos ?? 3;
  const overviewIds = new Set(input.overviewVideoIds ?? []);
  const map = new Map<string, UseCaseMediaBundle>();
  const usedIds = new Set<string>();
  let assigned = 0;

  const eligible = (input.media ?? [])
    .map(enrichMediaFromSourceUrl)
    .filter((m) => isVideoPublicEligible(m).eligible);

  const screenshots = input.screenshots ?? [];

  for (const slug of input.useCaseSlugs) {
    const diagram =
      screenshots.find(
        (s) =>
          (s.kind === "original-diagram" ||
            (s.annotation ?? "")
              .toLowerCase()
              .includes("softwareglimpse original")) &&
          screenshotMatchesUseCase(s, slug),
      ) ?? null;

    if (assigned >= maxVideos) {
      map.set(slug, { useCaseSlug: slug, video: null, diagram });
      continue;
    }

    const candidates = eligible
      .filter((m) => {
        if (usedIds.has(m.id)) return false;
        const linked =
          m.useCaseIds.includes(slug) || m.featureIds.includes(slug);
        if (!linked) return false;
        if (overviewIds.has(m.id)) {
          return (
            m.useCaseIds.includes(slug) &&
            !isLikelyBrandPromo(m) &&
            (m.type === "official-tutorial" ||
              m.evidenceClaimKinds.includes("workflow-demo"))
          );
        }
        return !isLikelyBrandPromo(m) || m.useCaseIds.includes(slug);
      })
      .sort((a, b) => scoreUseCaseVideo(b, slug) - scoreUseCaseVideo(a, slug));

    const video = candidates[0] ?? null;
    if (video) {
      usedIds.add(video.id);
      assigned += 1;
    }
    map.set(slug, { useCaseSlug: slug, video, diagram });
  }

  return map;
}

/**
 * Overview videos that should not also appear as setup/implementation context.
 * Dual-tagged records (overview + implementation) stay eligible for Guides.
 */
function overviewOnlyExcludeIds(
  media: ProductMedia[] | undefined,
  overviewVideoIds: string[] | undefined,
): string[] {
  const byId = new Map((media ?? []).map((m) => [m.id, m]));
  return (overviewVideoIds ?? []).filter((id) => {
    const item = byId.get(id);
    if (!item) return true;
    if (item.placements.includes("implementation")) return false;
    if (
      item.type === "official-tutorial" ||
      item.evidenceClaimKinds.includes("setup-tutorial")
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Setup / implementation / migration tutorials for Guides tab.
 * Prefers official-tutorial / implementation placement; excludes pure Overview
 * brand promos. Falls back to a non-promo overview demo when no setup media exists.
 */
export function selectImplementationContextVideos(input: {
  media: ProductMedia[] | undefined;
  overviewVideoIds?: string[];
  limit?: number;
  /** When true (default), allow a published overview demo if no setup tutorial. */
  allowOverviewFallback?: boolean;
}): ProductMedia[] {
  const excludeOverviewOnly = overviewOnlyExcludeIds(
    input.media,
    input.overviewVideoIds,
  );
  const limit = input.limit ?? 2;
  const allowFallback = input.allowOverviewFallback !== false;

  const fromPlacement = selectProductVideos(input.media, {
    placement: "implementation",
    preferSpecific: true,
    limit: limit + 2,
    excludeIds: excludeOverviewOnly,
  }).filter((m) => !isLikelyBrandPromo(m));

  if (fromPlacement.length >= limit) {
    return fromPlacement.slice(0, limit);
  }

  const extras = selectProductVideos(input.media, {
    preferSpecific: true,
    limit: limit + 2,
    excludeIds: [...excludeOverviewOnly, ...fromPlacement.map((v) => v.id)],
  }).filter(
    (m) =>
      (m.type === "official-tutorial" ||
        m.evidenceClaimKinds.includes("setup-tutorial")) &&
      !isLikelyBrandPromo(m),
  );

  const primary = [...fromPlacement, ...extras].slice(0, limit);
  if (primary.length > 0 || !allowFallback) {
    return primary;
  }

  const overviewFallback = selectProductVideos(input.media, {
    placement: "overview",
    preferSpecific: false,
    limit: limit + 2,
  }).filter((m) => m.placements.includes("overview"));

  return overviewFallback.slice(0, limit);
}

export type ImplementationRelatedLinks = {
  implementationGuide: { href: string; title: string } | null;
  setupGuide: { href: string; title: string } | null;
  migrationGuide: { href: string; title: string } | null;
  requirementHref: string | null;
};

export function resolveImplementationRelatedLinks(input: {
  guides: Array<{ href: string; title: string; topicType: string }>;
  requirementSlug?: string | null;
}): ImplementationRelatedLinks {
  const find = (topic: string) =>
    input.guides.find((g) => g.topicType === topic) ?? null;

  const implementation = find("implementation");
  const setup = find("setup");
  const migration = find("migration");

  return {
    implementationGuide: implementation
      ? { href: implementation.href, title: implementation.title }
      : null,
    setupGuide: setup ? { href: setup.href, title: setup.title } : null,
    migrationGuide: migration
      ? { href: migration.href, title: migration.title }
      : null,
    requirementHref: input.requirementSlug
      ? `/requirements/${input.requirementSlug}/`
      : null,
  };
}
