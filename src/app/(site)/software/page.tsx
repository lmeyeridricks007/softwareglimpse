import type { Metadata } from "next";
import Link from "next/link";
import {
  getSoftware,
  getSoftwareByCategory,
  getTopLevelCategories,
} from "@/data";
import { SoftwareCard } from "@/components/software/software-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { PageHero } from "@/components/ui/page-hero";
import { buildPageMetadata } from "@/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Software",
  description: "Browse the SoftwareGlimpse software catalogue.",
  path: "/software/",
  indexable: true,
});

export default function SoftwareIndexPage() {
  const categories = getTopLevelCategories();
  const grouped = categories
    .map((category) => ({
      category,
      software: getSoftwareByCategory(category.slug),
    }))
    .filter((group) => group.software.length > 0);

  const uncategorizedCount =
    getSoftware().length -
    new Set(grouped.flatMap((group) => group.software.map((item) => item.slug)))
      .size;

  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Software", path: "/software/" },
        ]}
      />
      <PageHero
        title="Software"
        description="Canonical product entities grouped by primary category. Filtering by business size, use case, and integrations will arrive later — this index stays server-rendered and SEO-friendly."
      />

      <nav aria-label="Category jump links" className="mb-8 flex flex-wrap gap-2">
        {grouped.map(({ category }) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-1.5 text-sm"
          >
            {category.name}
          </a>
        ))}
      </nav>

      <div className="space-y-12">
        {grouped.map(({ category, software }) => (
          <section key={category.id} id={category.slug} aria-labelledby={`${category.slug}-heading`}>
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2
                id={`${category.slug}-heading`}
                className="font-[family-name:var(--font-display)] text-2xl font-semibold"
              >
                {category.name}
              </h2>
              <Link
                href={`/categories/${category.path.join("/")}/`}
                className="text-sm text-[var(--color-fg-muted)] underline-offset-2 hover:underline"
              >
                View category
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {software.map((item) => (
                <SoftwareCard key={item.id} software={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {uncategorizedCount > 0 ? (
        <p className="mt-8 text-sm text-[var(--color-fg-muted)]">
          Note: some products appear in multiple categories via secondary
          membership.
        </p>
      ) : null}
    </>
  );
}
