import { canonicalUrl, normalizePath } from "@/seo/canonical";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumbs(
  items: BreadcrumbItem[],
): { name: string; item: string }[] {
  return items.map((item) => ({
    name: item.name,
    item: canonicalUrl(normalizePath(item.path)),
  }));
}
