import type { ProductMedia, SupportingTopicType } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import {
  enrichMediaFromSourceUrl,
  isVideoPublicEligible,
  selectProductVideos,
} from "@/services/product-media";
import {
  isLikelyBrandPromo,
  selectImplementationContextVideos,
} from "@/services/product-media/context-tab-media";
import { listCrmProductGuideSlugs } from "@/services/product-guides/context";
import { resolveCrmProductGuideKind } from "@/services/product-guides/media";

export type CategoryGuideExampleVideo = {
  productSlug: string;
  productName: string;
  productHref: string;
  video: ProductMedia;
  mode: "implementation" | "overview";
};

export type CategoryGuideMediaBundle = {
  topicType: SupportingTopicType;
  heading: string;
  body: string;
  examples: CategoryGuideExampleVideo[];
};

const IMPLEMENTATIONISH = new Set<SupportingTopicType>([
  "implementation",
  "setup",
  "migration",
]);

const OVERVIEWISH = new Set<SupportingTopicType>([
  "selection",
  "buying-guide",
  "pricing-education",
  "comparison-education",
  "fundamental",
  "how-it-works",
  "strategy",
  "checklist",
]);

function copyForTopic(topicType: SupportingTopicType): {
  heading: string;
  body: string;
} {
  if (IMPLEMENTATIONISH.has(topicType)) {
    return {
      heading: "Example official vendor setup videos",
      body: "These are verified vendor tutorials and product demos from the CRM catalogue — examples of how vendors present setup and workflows. They are not SoftwareGlimpse rankings, and they do not replace the independent guidance on this page.",
    };
  }
  return {
    heading: "Example official CRM product videos",
    body: "Verified vendor product videos from the CRM catalogue for context while you read. They are examples only — not a ranked shortlist — and they do not replace SoftwareGlimpse recommendations on this page.",
  };
}

function scoreExample(
  media: ProductMedia,
  preferImplementation: boolean,
): number {
  let score = 0;
  if (preferImplementation) {
    if (media.placements.includes("implementation")) score += 10;
    if (media.type === "official-tutorial") score += 8;
    if (media.evidenceClaimKinds.includes("setup-tutorial")) score += 6;
    if (media.placements.includes("overview")) score += 2;
  } else {
    if (media.placements.includes("overview")) score += 8;
    if (media.placements.includes("features")) score += 3;
    if (media.type === "official-tutorial") score += 2;
  }
  if (isLikelyBrandPromo(media)) score -= 4;
  return score;
}

/**
 * Category CRM guides (how-to-choose, crm-implementation, …) — not product guides.
 * Surfaces a small set of verified catalogue videos as examples.
 */
export function buildCategoryGuideMediaBundle(input: {
  slug: string;
  productSlugs: string[];
  topicType: SupportingTopicType;
  categorySlugs: string[];
  limit?: number;
}): CategoryGuideMediaBundle | null {
  if (!input.categorySlugs.includes("crm")) return null;
  if (
    resolveCrmProductGuideKind({
      slug: input.slug,
      productSlugs: input.productSlugs,
      topicType: input.topicType,
    })
  ) {
    return null;
  }

  const preferImplementation = IMPLEMENTATIONISH.has(input.topicType);
  if (!preferImplementation && !OVERVIEWISH.has(input.topicType)) {
    return null;
  }

  const limit = input.limit ?? 2;
  const examples: CategoryGuideExampleVideo[] = [];
  const usedVideoIds = new Set<string>();

  for (const productSlug of listCrmProductGuideSlugs()) {
    const enrichment = loadEnrichment(productSlug);
    if (!enrichment?.media?.length) continue;
    const soft = getSoftwareBySlug(productSlug, { includeUnpublished: true });
    if (!soft) continue;

    const overviewIds = selectProductVideos(enrichment.media, {
      placement: "overview",
      preferSpecific: false,
      limit: 2,
    })
      .filter((m) => m.placements.includes("overview"))
      .map((m) => m.id);

    let video: ProductMedia | null = null;
    let mode: "implementation" | "overview" = "overview";

    if (preferImplementation) {
      const impl = selectImplementationContextVideos({
        media: enrichment.media,
        overviewVideoIds: overviewIds,
        limit: 1,
        allowOverviewFallback: true,
      });
      video = impl[0] ?? null;
      if (video) {
        mode =
          video.placements.includes("implementation") ||
          video.type === "official-tutorial" ||
          video.evidenceClaimKinds.includes("setup-tutorial")
            ? "implementation"
            : "overview";
      }
    } else {
      const overview = selectProductVideos(enrichment.media, {
        placement: "overview",
        preferSpecific: false,
        limit: 3,
      }).find((m) => m.placements.includes("overview"));
      video = overview ?? null;
      mode = "overview";
    }

    if (!video || usedVideoIds.has(video.id)) continue;
    const enriched = enrichMediaFromSourceUrl(video);
    if (!isVideoPublicEligible(enriched).eligible) continue;

    examples.push({
      productSlug,
      productName: soft.name,
      productHref: `/software/${productSlug}/`,
      video: enriched,
      mode,
    });
    usedVideoIds.add(video.id);
  }

  examples.sort(
    (a, b) =>
      scoreExample(b.video, preferImplementation) -
        scoreExample(a.video, preferImplementation) ||
      a.productName.localeCompare(b.productName),
  );

  const selected = examples.slice(0, limit);
  if (selected.length === 0) return null;

  const copy = copyForTopic(input.topicType);
  return {
    topicType: input.topicType,
    heading: copy.heading,
    body: copy.body,
    examples: selected,
  };
}
