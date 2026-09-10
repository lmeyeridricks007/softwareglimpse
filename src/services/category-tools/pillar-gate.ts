/**
 * Category decision tools must not be indexed (or featured) without a
 * publicly available category pillar. Scheduled hubs with no live product set
 * stay fenced — do not invent /categories/{slug}/ for them.
 */

import { getAllCategoriesUnfiltered } from "@/data";
import {
  getSitemapPublicationContext,
  isContentVisible,
} from "@/domain/publication-context";
import { NEW_TOOL_CATEGORY_SLUGS } from "@/data/config/tools/category-tool-meta";

/** Legacy dedicated routes — always treated as having a published pillar. */
const ALWAYS_PUBLISHED_TOOL_PILLARS = new Set([
  "crm",
  "sales-intelligence",
]);

/**
 * True when the category hub is publicly listable (same gate as getCategories()).
 * False for missing / future-scheduled / draft pillars → fence sibling tools.
 */
export function categoryHasPublishedPillar(
  categorySlug: string,
  now: Date = new Date(),
): boolean {
  if (ALWAYS_PUBLISHED_TOOL_PILLARS.has(categorySlug)) return true;

  const category = getAllCategoriesUnfiltered().find(
    (item) => item.slug === categorySlug,
  );
  if (!category) return false;

  return isContentVisible(
    {
      status: category.metadata.status,
      publishedAt: category.metadata.publishedAt,
      scheduledAt: category.metadata.scheduledAt,
    },
    getSitemapPublicationContext(now),
    now,
  );
}

/** Shared decision-tool packs currently lacking a public category pillar. */
export function orphanCategoryToolSlugs(now: Date = new Date()): string[] {
  return NEW_TOOL_CATEGORY_SLUGS.filter(
    (slug) => !categoryHasPublishedPillar(slug, now),
  );
}
