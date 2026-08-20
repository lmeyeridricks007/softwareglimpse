import type { Metadata } from "next";
import {
  getChildCategoriesIncludingSupported,
  getPrimarySoftwareByCategory,
  getTopLevelCategories,
} from "@/data";
import { CategoryCard } from "@/components/category/category-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Categories",
  description: "Browse software categories on SoftwareGlimpse.",
  path: "/categories/",
  indexable: true,
});

export default function CategoriesIndexPage() {
  const categories = getTopLevelCategories();

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories/" },
        ]}
      />
      <PageHero
        title="Categories"
        description="Primary software categories. Subcategories are part of the knowledge graph and become hubs only when they provide decision value."
      />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const primary = getPrimarySoftwareByCategory(category.slug);
          const children = getChildCategoriesIncludingSupported(category.slug);

          return (
            <li key={category.id}>
              <CategoryCard
                name={category.name}
                slug={category.slug}
                href={`/categories/${category.path.join("/")}/`}
                description={category.shortDescription}
                productCount={primary.length}
                popularNames={primary.slice(0, 3).map((p) => p.name)}
                featured={category.slug === "crm"}
              />
              {children.length > 0 ? (
                <p className="mt-1.5 px-1 text-xs text-[var(--sg-color-text-muted)]">
                  {children.length} subcategor
                  {children.length === 1 ? "y" : "ies"} in taxonomy
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
