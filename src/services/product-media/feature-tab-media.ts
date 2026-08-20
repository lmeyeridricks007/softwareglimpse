import type { ProductMedia, ProductScreenshot } from "@/domain";
import { selectProductVideos } from "@/services/product-media";

/**
 * Differentiating CRM features that benefit most from official demos.
 * Products only show video when ResearchMedia is linked — this list is priority, not a force-set.
 */
export const FEATURE_TAB_VIDEO_PRIORITY_SLUGS = [
  "workflow-automation",
  "automation-workflows",
  "sales-automation",
  "pipeline-management",
  "custom-pipelines",
  "deal-management",
  "lead-management",
  "lead-scoring",
  "reporting",
  "forecasting",
  "analytics",
  "calling",
  "sequences",
  "sales-sequences",
  "ai-assistance",
  "ai-content-generation",
  "custom-fields",
  "contact-management",
] as const;

export const FEATURE_TAB_MAX_VIDEOS = 4;

export type FeatureTabMediaBundle = {
  featureSlug: string;
  videos: ProductMedia[];
  screenshots: ProductScreenshot[];
  /** True when this feature gets the prominent analysis + media layout. */
  prominent: boolean;
};

function priorityRank(featureSlug: string): number {
  const idx = FEATURE_TAB_VIDEO_PRIORITY_SLUGS.indexOf(
    featureSlug as (typeof FEATURE_TAB_VIDEO_PRIORITY_SLUGS)[number],
  );
  return idx === -1 ? 1000 : idx;
}

function screenshotMatchesFeature(
  shot: ProductScreenshot,
  featureSlug: string,
  featureName: string,
): boolean {
  if (shot.featureIds?.includes(featureSlug)) return true;
  const hay = [shot.id, shot.caption, shot.annotation, shot.alt]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const terms = [
    featureSlug.replace(/-/g, " "),
    featureSlug,
    ...featureName.toLowerCase().split(/\s+/).filter((t) => t.length > 3),
  ];
  return terms.some((t) => hay.includes(t.toLowerCase()));
}

/**
 * Resolve ResearchMedia + screenshots for Features-tab sections.
 * Caps prominent video placements to FEATURE_TAB_MAX_VIDEOS (default 4).
 * Does not invent media — only uses enrichment relationships.
 */
export function buildFeatureTabMediaMap(input: {
  media: ProductMedia[] | undefined;
  screenshots: ProductScreenshot[];
  features: Array<{ slug: string; name: string }>;
  maxVideos?: number;
}): Map<string, FeatureTabMediaBundle> {
  const maxVideos = input.maxVideos ?? FEATURE_TAB_MAX_VIDEOS;
  const map = new Map<string, FeatureTabMediaBundle>();

  const candidates = input.features
    .map((feature) => {
      const videos = selectProductVideos(input.media, {
        featureSlug: feature.slug,
        placement: "features",
        preferSpecific: true,
        limit: 2,
      }).filter((v) => v.featureIds.includes(feature.slug));
      const screenshots = input.screenshots
        .filter((s) =>
          screenshotMatchesFeature(s, feature.slug, feature.name),
        )
        .slice(0, 3);
      return { feature, videos, screenshots };
    })
    .filter((c) => c.videos.length > 0 || c.screenshots.length > 0);

  // Assign video budget preferentially to priority differentiating features
  const withVideo = candidates
    .filter((c) => c.videos.length > 0)
    .sort((a, b) => {
      const rankDiff =
        priorityRank(a.feature.slug) - priorityRank(b.feature.slug);
      if (rankDiff !== 0) return rankDiff;
      return b.videos.length - a.videos.length;
    });

  const allowedVideoFeatureSlugs = new Set<string>();
  let used = 0;
  for (const item of withVideo) {
    if (used >= maxVideos) break;
    // Prefer priority list, but allow any feature with explicit media if budget remains
    const isPriority = priorityRank(item.feature.slug) < 1000;
    if (!isPriority && used >= Math.min(2, maxVideos)) {
      // Keep remaining budget for priority features only when non-priority would fill early
      continue;
    }
    allowedVideoFeatureSlugs.add(item.feature.slug);
    used += 1;
  }

  // If budget unused, fill with remaining video-linked features
  if (used < maxVideos) {
    for (const item of withVideo) {
      if (used >= maxVideos) break;
      if (allowedVideoFeatureSlugs.has(item.feature.slug)) continue;
      allowedVideoFeatureSlugs.add(item.feature.slug);
      used += 1;
    }
  }

  const usedVideoIds = new Set<string>();

  for (const item of candidates) {
    const allowVideo = allowedVideoFeatureSlugs.has(item.feature.slug);
    const videos = allowVideo
      ? item.videos.filter((v) => {
          if (usedVideoIds.has(v.id)) return false;
          usedVideoIds.add(v.id);
          return true;
        })
      : [];
    map.set(item.feature.slug, {
      featureSlug: item.feature.slug,
      videos,
      screenshots: item.screenshots,
      prominent: videos.length > 0,
    });
  }

  return map;
}

export function availabilityAssessmentLabel(availability: string): string {
  switch (availability) {
    case "supported":
      return "Strong";
    case "limited":
      return "Limited";
    case "higher-plan-only":
      return "Plan-dependent";
    case "add-on":
      return "Add-on";
    case "not-supported":
      return "Not supported";
    default:
      return "Not fully evidenced";
  }
}
