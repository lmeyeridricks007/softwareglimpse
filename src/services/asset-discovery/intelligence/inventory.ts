import { getAllSoftwareUnfiltered } from "@/data";
import {
  getAllGuidesUnfiltered,
  getGuides,
} from "@/data/repositories/guides";
import { loadEnrichment } from "@/data/research/store";
import type { ProductMedia } from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import { enrichMediaFromSourceUrl } from "@/services/product-media";
import { parseVideoSourceUrl } from "@/services/product-media";

export type ResearchMediaInventory = {
  productCount: number;
  mediaCount: number;
  activeOfficialCount: number;
  pipelineCount: number;
  unavailableCount: number;
  embeddingDisabledCount: number;
  providerIds: string[];
  sourceUrls: string[];
  byProduct: Array<{
    productSlug: string;
    mediaCount: number;
    activeOfficial: number;
  }>;
};

const ACTIVE = new Set(["active", "published", "embedding-disabled"]);

export function inventorySoftwarePages(opts?: {
  includeUnpublished?: boolean;
}): Array<{ slug: string; name: string; route: string }> {
  return getAllSoftwareUnfiltered()
    .filter((p) =>
      opts?.includeUnpublished ? true : isPubliclyAvailable(p.metadata),
    )
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      route: `/software/${p.slug}/`,
    }));
}

export function inventoryGuides(opts?: {
  includeUnpublished?: boolean;
}): Array<{ slug: string; title: string; route: string }> {
  const guides = opts?.includeUnpublished
    ? getAllGuidesUnfiltered()
    : getGuides({ includeUnpublished: false });
  return guides.map((g) => ({
    slug: g.slug,
    title: g.title,
    route: `/guides/${g.slug}/`,
  }));
}

export function inventoryResearchMedia(opts?: {
  productSlugs?: string[];
}): ResearchMediaInventory {
  const products = getAllSoftwareUnfiltered().filter((p) => {
    if (opts?.productSlugs?.length) {
      return opts.productSlugs.includes(p.slug);
    }
    return isPubliclyAvailable(p.metadata);
  });

  const providerIds: string[] = [];
  const sourceUrls: string[] = [];
  const byProduct: ResearchMediaInventory["byProduct"] = [];
  let mediaCount = 0;
  let activeOfficialCount = 0;
  let pipelineCount = 0;
  let unavailableCount = 0;
  let embeddingDisabledCount = 0;

  for (const product of products) {
    const enrichment = loadEnrichment(product.slug);
    const media = (enrichment?.media ?? []) as ProductMedia[];
    let activeOfficial = 0;
    for (const raw of media) {
      const m = enrichMediaFromSourceUrl(raw);
      mediaCount += 1;
      sourceUrls.push(m.sourceUrl);
      const pid = m.providerId ?? m.videoId;
      if (pid) providerIds.push(pid);
      if (m.status === "unavailable" || m.status === "rejected") {
        unavailableCount += 1;
      } else if (m.status === "embedding-disabled") {
        embeddingDisabledCount += 1;
        if (m.officialSource) activeOfficial += 1;
      } else if (ACTIVE.has(m.status) && m.officialSource) {
        activeOfficialCount += 1;
        activeOfficial += 1;
      } else if (
        m.status === "discovered" ||
        m.status === "verified" ||
        m.status === "classified" ||
        m.status === "needs-review" ||
        m.status === "draft" ||
        m.status === "candidate"
      ) {
        pipelineCount += 1;
      }
    }
    byProduct.push({
      productSlug: product.slug,
      mediaCount: media.length,
      activeOfficial,
    });
  }

  return {
    productCount: products.length,
    mediaCount,
    activeOfficialCount,
    pipelineCount,
    unavailableCount,
    embeddingDisabledCount,
    providerIds: [...new Set(providerIds)],
    sourceUrls: [...new Set(sourceUrls)],
    byProduct,
  };
}

export function extractProviderIdFromUrl(url: string): string | undefined {
  return parseVideoSourceUrl(url)?.videoId;
}
