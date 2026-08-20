import {
  getBestPageBySlug,
  getComparisonBySlug,
  getResourceBySlug,
  getSoftwareBySlug,
} from "@/data";
import {
  getGuideBySlug,
} from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { normalizeRoute, routeToSlug } from "./types";

export type ResolvedPage = {
  input: string;
  route: string;
  slug: string;
  contentId: string | null;
  title: string | null;
  pageType: string | null;
  existsInCatalog: boolean;
  indexableHint: boolean | null;
  indexableReason: string;
  publishedHint: boolean | null;
  relatedToolIds: string[];
};

function segment(route: string, i: number): string | null {
  const parts = route.replace(/^\//, "").replace(/\/$/, "").split("/");
  return parts[i] ?? null;
}

/**
 * Resolve a route or content id to a catalog-backed page descriptor.
 */
export function resolvePageInput(input: string): ResolvedPage {
  const route = normalizeRoute(input);
  const slug = routeToSlug(route);
  const kind = segment(route, 0);
  const id = segment(route, 1);

  let title: string | null = null;
  let pageType: string | null = kind;
  let contentId: string | null = null;
  let existsInCatalog = false;
  let indexableHint: boolean | null = null;
  let indexableReason = "No catalog entity matched — indexability not verified from entity gates";
  let publishedHint: boolean | null = null;
  const relatedToolIds: string[] = [];

  if (kind === "software" && id) {
    const soft = getSoftwareBySlug(id, { includeUnpublished: true });
    if (soft) {
      existsInCatalog = true;
      title = soft.name;
      pageType = "product";
      contentId = soft.id;
      publishedHint = soft.metadata?.status === "published";
      indexableHint = soft.seo?.indexable !== false && publishedHint === true;
      indexableReason = indexableHint
        ? "Software entity present and treated as indexable when published"
        : "Software entity present but may be non-indexable / unpublished";
    }
  } else if (kind === "guides" && id) {
    const guide = getGuideBySlug(id, { includeUnpublished: true });
    if (guide) {
      existsInCatalog = true;
      title = guide.title;
      pageType = "guide";
      contentId = guide.id;
      publishedHint = guide.metadata?.status === "published";
      indexableHint = guide.seo?.indexable !== false && publishedHint === true;
      indexableReason = indexableHint
        ? "Guide entity present and treated as indexable when published"
        : "Guide entity present but may be non-indexable / unpublished";
    }
  } else if (kind === "resources" && id) {
    const res = getResourceBySlug(id, { includeUnpublished: true });
    if (res) {
      existsInCatalog = true;
      title = res.title;
      pageType = "resource";
      contentId = res.id;
      publishedHint = res.metadata?.status === "published";
      indexableHint = res.seo?.indexable !== false && publishedHint === true;
      indexableReason = indexableHint
        ? "Resource entity present and treated as indexable when published"
        : "Resource entity present but may be non-indexable / unpublished";
    }
  } else if (kind === "best" && id) {
    const best = getBestPageBySlug(id, { includeUnpublished: true });
    if (best) {
      existsInCatalog = true;
      title = best.title;
      pageType = "best";
      contentId = best.id;
      publishedHint = best.metadata?.status === "published";
      indexableHint = best.seo?.indexable !== false && publishedHint === true;
      indexableReason = indexableHint
        ? "Best-of page present and treated as indexable when published"
        : "Best-of page present but may be non-indexable / unpublished";
    }
  } else if (kind === "compare" && id) {
    const cmp = getComparisonBySlug(id, { includeUnpublished: true });
    if (cmp) {
      existsInCatalog = true;
      title = cmp.title;
      pageType = "comparison";
      contentId = cmp.id;
      publishedHint = cmp.metadata?.status === "published";
      indexableHint = cmp.seo?.indexable !== false && publishedHint === true;
      indexableReason = indexableHint
        ? "Comparison present and treated as indexable when published"
        : "Comparison present but may be non-indexable / unpublished";
    }
  } else if (kind === "tools" && id) {
    const tool = TOOLS_REGISTRY.find(
      (t) => t.slug === id || t.href === route || t.href === route.replace(/\/$/, ""),
    );
    if (tool) {
      existsInCatalog = true;
      title = tool.name;
      pageType = "tool";
      contentId = tool.id;
      publishedHint = tool.status === "available";
      indexableHint = tool.status === "available";
      indexableReason = indexableHint
        ? "Tool registry marks tool available"
        : "Tool registry entry present but not available";
      relatedToolIds.push(tool.slug);
    }
  }

  // Related tools by href heuristics
  for (const t of TOOLS_REGISTRY) {
    if (t.href === route) relatedToolIds.push(t.slug);
  }

  return {
    input,
    route,
    slug,
    contentId,
    title,
    pageType,
    existsInCatalog,
    indexableHint,
    indexableReason,
    publishedHint,
    relatedToolIds: [...new Set(relatedToolIds)],
  };
}
