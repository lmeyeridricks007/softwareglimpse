import type { Software } from "@/domain";
import { isEntityIndexable } from "@/domain/quality-gates";
import { isPubliclyAvailable } from "@/domain/publishing";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCategories,
  getChildCategoriesIncludingSupported,
} from "@/data";
import {
  getGuidesByProduct,
} from "@/data/repositories/guides";
import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
  categoryShortName,
  hasDedicatedCategoryTools,
} from "@/data/config/tools/category-tool-meta";
import {
  resolveAlternativeSlugs,
  resolveCompetitorSlugs,
} from "@/services/graph/resolve-relationships";
import {
  INTERNAL_LINK_LIMITS,
  LINK_TYPE_PRIORITY,
  type LinkPageType,
} from "./link-limits";

export type RelatedLink = {
  href: string;
  label: string;
  pageType: LinkPageType;
  relationship:
    | "belongsToCategory"
    | "belongsToSubcategory"
    | "hasAlternative"
    | "competesWith"
    | "sameCategory"
    | "relatedTool"
    | "bestGuide"
    | "educationalGuide"
    | "alternativesPage"
    | "comparisonPage"
    | "compareHub"
    | "pricingPage"
    | "audiencePage";
  priority: number;
  published: boolean;
};

export type SoftwareLinkGroups = {
  categories: RelatedLink[];
  software: RelatedLink[];
  comparisons: RelatedLink[];
  alternatives: RelatedLink[];
  guides: RelatedLink[];
  tools: RelatedLink[];
  all: RelatedLink[];
};

/**
 * Relationship-driven internal links for a software entity.
 * Only includes publishable destinations; respects centralized limits.
 */
export function getSoftwareRelationshipLinks(
  software: Software,
): RelatedLink[] {
  return getSoftwareLinkGroups(software).all;
}

export function publicAlternativesHref(productSlug: string): string | null {
  const page = getAllAlternativesUnfiltered().find(
    (item) => item.sourceSlug === productSlug || item.slug === productSlug,
  );
  if (!page || page.alternatives.length < 2) return null;
  if (!isPubliclyAvailable(page.metadata)) return null;
  if (!isEntityIndexable({ kind: "alternatives", entity: page })) return null;
  return `/alternatives/${page.slug}/`;
}

export function getSoftwareLinkGroups(software: Software): SoftwareLinkGroups {
  const categories: RelatedLink[] = [];
  const softwareLinks: RelatedLink[] = [];
  const comparisons: RelatedLink[] = [];
  const alternatives: RelatedLink[] = [];
  const guides: RelatedLink[] = [];
  const tools: RelatedLink[] = [];

  const allCategories = getCategories({ includeUnpublished: true });
  const primary = allCategories.find(
    (c) => c.slug === software.primaryCategorySlug,
  );
  if (primary && isPubliclyAvailable(primary.metadata)) {
    categories.push(
      link({
        href: `/categories/${primary.path.join("/")}/`,
        label: primary.name,
        pageType: "category",
        relationship: "belongsToCategory",
        published: true,
        priorityBoost: 20,
      }),
    );
  }

  for (const slug of software.subcategorySlugs) {
    const sub = allCategories.find((c) => c.slug === slug);
    if (sub && isPubliclyAvailable(sub.metadata)) {
      categories.push(
        link({
          href: `/categories/${sub.path.join("/")}/`,
          label: sub.name,
          pageType: "category",
          relationship: "belongsToSubcategory",
          published: true,
        }),
      );
    }
  }

  const competitorSlugs = resolveCompetitorSlugs(software.slug);
  const alternativeSlugs = resolveAlternativeSlugs(software.slug);
  const catalog = getAllSoftwareUnfiltered();

  for (const slug of [...new Set([...competitorSlugs, ...alternativeSlugs])]) {
    const rel = competitorSlugs.includes(slug) ? "competesWith" : "hasAlternative";
    const target = catalog.find((item) => item.slug === slug);
    softwareLinks.push(
      link({
        href: `/software/${slug}/`,
        label: target?.name || slug,
        pageType: "software",
        relationship: rel,
        published: true,
        priorityBoost: rel === "competesWith" ? 10 : 5,
      }),
    );
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    if (!comparison.productSlugs.includes(software.slug)) continue;
    const published = isPubliclyAvailable(comparison.metadata);
    const indexable = isEntityIndexable({
      kind: "comparison",
      entity: comparison,
    });
    if (!published && !indexable) {
      // Still allow linking to researching comparison pages? Prompt: only if publishable.
      // Comparisons are researching/not public → exclude.
      continue;
    }
    if (!published) continue;
    comparisons.push(
      link({
        href: `/compare/${comparison.slug}/`,
        label: comparison.title,
        pageType: "comparison",
        relationship: "comparisonPage",
        published: true,
        priorityBoost: 15,
      }),
    );
  }

  const altPage = getAllAlternativesUnfiltered().find(
    (p) => p.sourceSlug === software.slug,
  );
  const altHref = altPage ? publicAlternativesHref(software.slug) : null;
  if (altPage && altHref) {
    alternatives.push(
      link({
        href: altHref,
        label: altPage.title,
        pageType: "alternatives",
        relationship: "alternativesPage",
        published: true,
        priorityBoost: 15,
      }),
    );
  }

  for (const best of getAllBestPagesUnfiltered()) {
    const relevant =
      best.categorySlug === software.primaryCategorySlug ||
      best.eligibleProductSlugs.includes(software.slug);
    if (!relevant) continue;
    if (!isPubliclyAvailable(best.metadata)) continue;
    guides.push(
      link({
        href: `/best/${best.slug}/`,
        label: best.title,
        pageType: "best",
        relationship: "bestGuide",
        published: true,
        priorityBoost: 12,
      }),
    );
  }

  for (const guide of getGuidesByProduct(software.slug)) {
    if (!isPubliclyAvailable(guide.metadata)) continue;
    guides.push(
      link({
        href: `/guides/${guide.slug}/`,
        label: guide.title,
        pageType: "guide",
        relationship: "educationalGuide",
        published: true,
        priorityBoost: guide.productSlugs.includes(software.slug) ? 14 : 10,
      }),
    );
  }

  // Category-specific decision tools only — never soft software-finder.
  if (hasDedicatedCategoryTools(software.primaryCategorySlug)) {
    const short = categoryShortName(software.primaryCategorySlug);
    const finderHref = categoryDecisionFinderHref(software.primaryCategorySlug);
    const costHref = categoryDecisionCostHref(software.primaryCategorySlug);
    if (finderHref) {
      tools.push(
        link({
          href: finderHref,
          label: `${short} finder`,
          pageType: "tool",
          relationship: "relatedTool",
          published: true,
          priorityBoost: 10,
        }),
      );
    }
    if (costHref) {
      tools.push(
        link({
          href: costHref,
          label: `${short} cost calculator`,
          pageType: "tool",
          relationship: "relatedTool",
          published: true,
          priorityBoost: 8,
        }),
      );
    }
  }

  const trimmed = {
    categories: take(sortLinks(categories), INTERNAL_LINK_LIMITS.relatedCategories),
    software: take(sortLinks(softwareLinks), INTERNAL_LINK_LIMITS.relatedSoftware),
    comparisons: take(sortLinks(comparisons), INTERNAL_LINK_LIMITS.relatedComparisons),
    alternatives: take(sortLinks(alternatives), INTERNAL_LINK_LIMITS.alternatives),
    guides: take(sortLinks(guides), INTERNAL_LINK_LIMITS.relatedGuides),
    tools: take(sortLinks(dedupeLinks(tools)), INTERNAL_LINK_LIMITS.relatedTools),
  };

  return {
    ...trimmed,
    all: dedupeLinks([
      ...trimmed.categories,
      ...trimmed.software,
      ...trimmed.comparisons,
      ...trimmed.alternatives,
      ...trimmed.guides,
      ...trimmed.tools,
    ]),
  };
}

export function getCategoryBrowseNeeds(parentSlug: string): {
  name: string;
  href?: string;
  published: boolean;
}[] {
  return getChildCategoriesIncludingSupported(parentSlug).map((child) => {
    const published = isPubliclyAvailable(child.metadata);
    return {
      name: child.name,
      href: published ? `/categories/${child.path.join("/")}/` : undefined,
      published,
    };
  });
}

function link(input: {
  href: string;
  label: string;
  pageType: LinkPageType;
  relationship: RelatedLink["relationship"];
  published: boolean;
  priorityBoost?: number;
}): RelatedLink {
  return {
    href: input.href,
    label: input.label,
    pageType: input.pageType,
    relationship: input.relationship,
    published: input.published,
    priority: LINK_TYPE_PRIORITY[input.pageType] + (input.priorityBoost ?? 0),
  };
}

function sortLinks(links: RelatedLink[]): RelatedLink[] {
  return [...links].sort((a, b) => b.priority - a.priority || a.label.localeCompare(b.label));
}

function take<T>(items: T[], limit: number): T[] {
  return items.slice(0, limit);
}

function dedupeLinks(links: RelatedLink[]): RelatedLink[] {
  const seen = new Set<string>();
  return links.filter((item) => {
    const key = `${item.relationship}:${item.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
