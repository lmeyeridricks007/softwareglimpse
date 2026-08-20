import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllCategoriesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
} from "@/data";
import {
  getAllGuidesUnfiltered,
} from "@/data/repositories/guides";
import {
  ContentRegistryEntrySchema,
  type ContentRegistryEntry,
} from "@/domain";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import {
  alternativesContentId,
  bestContentId,
  categoryContentId,
  comparisonContentId,
  guideContentId,
  pathForContent,
  pricingContentId,
  softwareContentId,
  toolContentId,
} from "./ids";
import { filterSitemapEntries } from "./resolver";

const TOOL_ENTRIES: {
  slug: string;
  title: string;
  seoIndexable?: boolean;
}[] = [
  { slug: "crm-finder", title: "CRM Finder" },
  { slug: "crm-cost-calculator", title: "CRM Cost Calculator" },
  {
    slug: "software-stack-builder",
    title: "Software Stack Builder",
    seoIndexable: false,
  },
];

/**
 * Enumerate catalogue + pricing + tools into ContentRegistryEntry[].
 * Used by status CLI and sitemap helpers.
 * Does not mutate live seeds.
 */
export function buildContentRegistry(opts?: {
  includeUnpublishedPricing?: boolean;
}): ContentRegistryEntry[] {
  const entries: ContentRegistryEntry[] = [];

  for (const software of getAllSoftwareUnfiltered()) {
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: softwareContentId(software.slug),
        type: "software",
        slug: software.slug,
        path: pathForContent("software", software.slug),
        title: software.name,
        metadata: {
          status: software.metadata.status,
          publishedAt: software.metadata.publishedAt,
          scheduledAt: software.metadata.scheduledAt,
          updatedAt: software.metadata.updatedAt,
          nextReviewAt: software.metadata.nextReviewAt,
          researchStatus: software.metadata.researchStatus,
        },
        seoIndexable: software.seo.indexable,
        firstPublishedAt: software.metadata.publishedAt,
        lastPublishedAt: software.metadata.publishedAt,
        lastUpdatedAt: software.metadata.updatedAt,
        nextReviewAt: software.metadata.nextReviewAt,
      }),
    );
  }

  for (const category of getAllCategoriesUnfiltered()) {
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: categoryContentId(category.slug),
        type: "category",
        slug: category.slug,
        path: pathForContent("category", category.slug),
        title: category.name,
        metadata: {
          status: category.metadata.status,
          publishedAt: category.metadata.publishedAt,
          scheduledAt: category.metadata.scheduledAt,
          updatedAt: category.metadata.updatedAt,
          nextReviewAt: category.metadata.nextReviewAt,
          researchStatus: category.metadata.researchStatus,
        },
        seoIndexable: category.seo.indexable,
        nextReviewAt: category.metadata.nextReviewAt,
      }),
    );
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: comparisonContentId(comparison.slug),
        type: "comparison",
        slug: comparison.slug,
        path: pathForContent("comparison", comparison.slug),
        title: comparison.title,
        metadata: {
          status: comparison.metadata.status,
          publishedAt: comparison.metadata.publishedAt,
          scheduledAt: comparison.metadata.scheduledAt,
          updatedAt: comparison.metadata.updatedAt,
          nextReviewAt: comparison.metadata.nextReviewAt,
          researchStatus: comparison.metadata.researchStatus,
        },
        seoIndexable: comparison.seo.indexable,
        nextReviewAt: comparison.metadata.nextReviewAt,
      }),
    );
  }

  for (const alt of getAllAlternativesUnfiltered()) {
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: alternativesContentId(alt.slug),
        type: "alternatives",
        slug: alt.slug,
        path: pathForContent("alternatives", alt.slug),
        title: alt.title,
        metadata: {
          status: alt.metadata.status,
          publishedAt: alt.metadata.publishedAt,
          scheduledAt: alt.metadata.scheduledAt,
          updatedAt: alt.metadata.updatedAt,
          nextReviewAt: alt.metadata.nextReviewAt,
          researchStatus: alt.metadata.researchStatus,
        },
        seoIndexable: alt.seo.indexable,
        nextReviewAt: alt.metadata.nextReviewAt,
      }),
    );
  }

  for (const best of getAllBestPagesUnfiltered()) {
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: bestContentId(best.slug),
        type: "best",
        slug: best.slug,
        path: pathForContent("best", best.slug),
        title: best.title,
        metadata: {
          status: best.metadata.status,
          publishedAt: best.metadata.publishedAt,
          scheduledAt: best.metadata.scheduledAt,
          updatedAt: best.metadata.updatedAt,
          nextReviewAt: best.metadata.nextReviewAt,
          researchStatus: best.metadata.researchStatus,
        },
        seoIndexable: best.seo.indexable,
        nextReviewAt: best.metadata.nextReviewAt,
      }),
    );
  }

  const snapshots = listCrmPricingSnapshots({
    includeUnpublished: opts?.includeUnpublishedPricing,
  });
  for (const snapshot of snapshots) {
    const software = getAllSoftwareUnfiltered().find(
      (s) => s.slug === snapshot.productSlug,
    );
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: pricingContentId(snapshot.productSlug),
        type: "pricing",
        slug: snapshot.productSlug,
        path: pathForContent("pricing", snapshot.productSlug),
        title: `${snapshot.name} Pricing`,
        metadata: {
          status: software?.metadata.status ?? "draft",
          publishedAt: software?.metadata.publishedAt,
          scheduledAt: software?.metadata.scheduledAt,
          updatedAt: software?.metadata.updatedAt,
          nextReviewAt: software?.metadata.nextReviewAt,
          researchStatus: software?.metadata.researchStatus,
        },
        seoIndexable: software?.seo.indexable ?? false,
        nextReviewAt: software?.metadata.nextReviewAt,
      }),
    );
  }

  for (const tool of TOOL_ENTRIES) {
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: toolContentId(tool.slug),
        type: "tool",
        slug: tool.slug,
        path: pathForContent("tool", tool.slug),
        title: tool.title,
        metadata: {
          status: "published",
          researchStatus: "complete",
        },
        seoIndexable: tool.seoIndexable ?? true,
      }),
    );
  }

  for (const guide of getAllGuidesUnfiltered()) {
    entries.push(
      ContentRegistryEntrySchema.parse({
        contentId: guideContentId(guide.slug),
        type: "guide",
        slug: guide.slug,
        path: pathForContent("guide", guide.slug),
        title: guide.title,
        metadata: {
          status: guide.metadata.status,
          publishedAt: guide.metadata.publishedAt,
          scheduledAt: guide.metadata.scheduledAt,
          updatedAt: guide.metadata.updatedAt,
          nextReviewAt: guide.metadata.nextReviewAt,
          researchStatus: guide.metadata.researchStatus,
        },
        seoIndexable: guide.seo.indexable,
        nextReviewAt: guide.metadata.nextReviewAt,
      }),
    );
  }

  return entries;
}

/** Sitemap / listing filter: only publicly visible + indexable entries. */
export function filterRegistryForSitemap(
  entries: ContentRegistryEntry[],
  now: Date = new Date(),
): ContentRegistryEntry[] {
  return filterSitemapEntries(entries, now);
}
