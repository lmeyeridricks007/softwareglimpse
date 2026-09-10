import type { BreadcrumbItem } from "@/seo/breadcrumbs";
import { getCategoryBySlug, getSoftwareBySlug } from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import { normalizePath } from "@/seo/canonical";

/**
 * Meaningful breadcrumb hierarchy for common estate paths.
 * Used for BreadcrumbList alignment — never invents fake parents.
 */
export function buildEstateBreadcrumbs(pagePath: string): BreadcrumbItem[] {
  const p = normalizePath(pagePath);
  const items: BreadcrumbItem[] = [{ name: "Home", path: "/" }];

  const soft = p.match(/^\/software\/([^/]+)\/(?:([^/]+)\/)?$/);
  if (soft?.[1]) {
    const product = getSoftwareBySlug(soft[1]);
    items.push({ name: "Software", path: "/software/" });
    if (product?.primaryCategorySlug) {
      const cat = getCategoryBySlug(product.primaryCategorySlug);
      if (cat) {
        items.push({
          name: cat.name,
          path: `/categories/${cat.path.join("/")}/`,
        });
      }
    }
    items.push({
      name: product?.name ?? soft[1],
      path: `/software/${soft[1]}/`,
    });
    if (soft[2]) {
      items.push({
        name: soft[2].replace(/-/g, " "),
        path: p,
      });
    }
    return items;
  }

  const guide = p.match(/^\/guides\/([^/]+)\/$/);
  if (guide?.[1]) {
    items.push({ name: "Guides", path: "/guides/" });
    const g = getGuideBySlug(guide[1], { includeUnpublished: true });
    if (g?.categorySlugs[0]) {
      const cat = getCategoryBySlug(g.categorySlugs[0]);
      if (cat) {
        items.push({
          name: cat.name,
          path: `/categories/${cat.path.join("/")}/`,
        });
      }
    }
    items.push({ name: g?.title ?? guide[1], path: p });
    return items;
  }

  const compare = p.match(/^\/compare\/([^/]+)\/$/);
  if (compare?.[1]) {
    items.push({ name: "Comparisons", path: "/compare/" });
    items.push({ name: compare[1].replace(/-/g, " "), path: p });
    return items;
  }

  const cat = p.match(/^\/categories\/(.+)\/$/);
  if (cat?.[1]) {
    items.push({ name: "Categories", path: "/categories/" });
    const category = getCategoryBySlug(cat[1].split("/")[0] ?? cat[1]);
    items.push({
      name: category?.name ?? cat[1],
      path: p,
    });
    return items;
  }

  const best = p.match(/^\/best\/([^/]+)\/$/);
  if (best?.[1]) {
    items.push({ name: "Best software", path: "/best/" });
    items.push({ name: best[1].replace(/-/g, " "), path: p });
    return items;
  }

  const alt = p.match(/^\/alternatives\/([^/]+)\/$/);
  if (alt?.[1]) {
    items.push({ name: "Alternatives", path: "/alternatives/" });
    const product = getSoftwareBySlug(alt[1]);
    if (product?.primaryCategorySlug) {
      const cat = getCategoryBySlug(product.primaryCategorySlug);
      if (cat) {
        items.push({
          name: cat.name,
          path: `/categories/${cat.path.join("/")}/`,
        });
      }
      items.push({
        name: product.name,
        path: `/software/${product.slug}/`,
      });
    }
    items.push({
      name: product ? `${product.name} alternatives` : alt[1].replace(/-/g, " "),
      path: p,
    });
    return items;
  }

  const research = p.match(/^\/research\/([^/]+)\/$/);
  if (research?.[1]) {
    items.push({ name: "Research", path: "/research/" });
    items.push({ name: research[1].replace(/-/g, " "), path: p });
    return items;
  }

  const tools = p.match(/^\/tools\/([^/]+)\/$/);
  if (tools?.[1]) {
    items.push({ name: "Tools", path: "/tools/" });
    items.push({ name: tools[1].replace(/-/g, " "), path: p });
    return items;
  }

  items.push({ name: p, path: p });
  return items;
}
