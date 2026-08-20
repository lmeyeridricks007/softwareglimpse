import {
  SiteHeaderClient,
  type NavItem,
} from "@/components/navigation/site-header-client";
import {
  getCategories,
  getTopLevelCategories,
} from "@/data/repositories/categories";
import {
  navBestSlugByCategory,
  navComparisonCategorySlugs,
} from "@/data/seed/nav";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";

function categorySubLinks(
  categories: Array<{ slug: string; name: string; path: string[] }>,
  hrefFor: (cat: { slug: string; name: string; path: string[] }) => string,
) {
  return categories.map((c) => ({
    href: hrefFor(c),
    label: c.name,
  }));
}

/** Best Software menu: every category with a published Best page, including nested email marketing. */
function bestSoftwareNavLinks() {
  const categories = getCategories();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));
  return categories
    .filter((c) => navBestSlugByCategory[c.slug])
    .sort((a, b) => {
      const parentA = a.parentSlug ? bySlug.get(a.parentSlug) : undefined;
      const parentB = b.parentSlug ? bySlug.get(b.parentSlug) : undefined;
      const orderA = parentA ? parentA.sortOrder + a.sortOrder / 100 : a.sortOrder;
      const orderB = parentB ? parentB.sortOrder + b.sortOrder / 100 : b.sortOrder;
      return orderA - orderB || a.name.localeCompare(b.name);
    })
    .map((c) => ({
      href: `/best/${navBestSlugByCategory[c.slug]}/`,
      label: c.name,
    }));
}

export function SiteHeader() {
  const categories = getTopLevelCategories();
  const comparisonCategorySlugs = navComparisonCategorySlugs;
  const guideCategorySlugs = new Set(categories.map((c) => c.slug));
  const toolCategorySlugs = new Set(
    TOOLS_REGISTRY.flatMap((t) => t.categorySlugs),
  );
  const navItems: NavItem[] = [
    {
      href: "/categories/",
      label: "Categories",
      children: categorySubLinks(
        categories,
        (c) => `/categories/${c.path.join("/")}/`,
      ),
      allLabel: "All categories",
    },
    {
      href: "/best/",
      label: "Best Software",
      children: bestSoftwareNavLinks(),
      allLabel: "All best software",
    },
    {
      href: "/compare/",
      label: "Comparisons",
      children: categorySubLinks(categories, (c) =>
        comparisonCategorySlugs.has(c.slug)
          ? `/compare/?category=${encodeURIComponent(c.slug)}#published-comparisons`
          : `/categories/${c.path.join("/")}/`,
      ),
      allLabel: "All comparisons",
    },
    {
      href: "/tools/",
      label: "Tools",
      children: categorySubLinks(categories, (c) =>
        toolCategorySlugs.has(c.slug)
          ? `/tools/?category=${encodeURIComponent(c.slug)}`
          : `/categories/${c.path.join("/")}/`,
      ),
      allLabel: "All tools",
    },
    {
      href: "/guides/",
      label: "Guides",
      children: categorySubLinks(categories, (c) =>
        guideCategorySlugs.has(c.slug)
          ? `/guides/?category=${encodeURIComponent(c.slug)}#latest-guides`
          : `/categories/${c.path.join("/")}/`,
      ),
      allLabel: "All guides",
    },
  ];

  return <SiteHeaderClient navItems={navItems} />;
}
