import type { Metadata } from "next";
import Link from "next/link";
import {
  CompareFinalCta,
  CompareHero,
  ComparePageViewTracker,
  ComparisonBuilder,
  ComparisonCategoryGrid,
  ComparisonDirectory,
  ComparisonFaq,
  ComparisonGuideGrid,
  ComparisonGrid,
  ComparisonMethodology,
  ComparisonToolCta,
  ProductComparisonSuggestions,
  RecentlyUpdatedComparisons,
} from "@/components/comparison/hub";
import { ProductLogo } from "@/components/software/product-logo";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildCompareHubModel } from "@/services/compare-hub";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
  type JsonLd,
} from "@/seo/structured-data";
import { canonicalUrl } from "@/lib/urls";

const TITLE = "Compare Business Software Side by Side";
const DESCRIPTION =
  "Compare business software across features, pricing and buyer fit. Explore software comparisons or build your own side-by-side comparison.";

export function generateMetadata(): Metadata {
  const model = buildCompareHubModel();
  return buildPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/compare/",
    indexable: model.indexable,
  });
}

function collectionJsonLd(
  items: Array<{ title: string; href: string }>,
): JsonLd {
  return {
    "@context": "schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl("/compare/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        url: canonicalUrl(item.href),
      })),
    },
  };
}

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function CompareIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const model = buildCompareHubModel();
  const initialCategory =
    params.category &&
    model.filterCategories.some((c) => c.slug === params.category)
      ? params.category
      : null;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/compare/" },
  ];

  const publishedSlugs = model.published.map((c) => c.slug);

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/compare/",
          }),
          ...(model.published.length > 0
            ? [
                collectionJsonLd(
                  model.published.map((c) => ({
                    title: c.title,
                    href: c.href,
                  })),
                ),
              ]
            : []),
        ]}
      />
      <ComparePageViewTracker />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <CompareHero preview={model.heroPreview} />

      {/* Builder band */}
      <Section padding="md" background="tint" container="wide">
        <ComparisonBuilder
          products={model.selectorProducts}
          publishedSlugs={publishedSlugs}
          initialCategory={initialCategory}
        />
      </Section>

      {/* Browse by category — above published comparisons */}
      <Section padding="md" background="muted" container="wide">
        <ComparisonCategoryGrid categories={model.categories} />
      </Section>

      {/* Published comparisons */}
      <Section padding="md" background="surface" container="wide">
        <ComparisonGrid
          comparisons={model.published}
          filterCategories={model.filterCategories}
          initialCategory={initialCategory}
        />
      </Section>

      {/* Product-first + reviews */}
      <Section padding="md" background="muted" container="wide">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <ProductComparisonSuggestions
            products={model.selectorProducts}
            suggestions={model.productSuggestions}
            publishedSlugs={publishedSlugs}
          />
          {model.reviews.length > 0 ? (
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
                Research each product in depth
              </h2>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                Compare → review → decide using the same research model.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {model.reviews.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.href}
                      className="group flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3.5 transition hover:border-[var(--sg-color-primary)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <ProductLogo
                          name={p.name}
                          logo={p.logo}
                          size="sm"
                          className="!size-8"
                        />
                        <p className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                          {p.name}
                        </p>
                      </div>
                      {p.shortDescription ? (
                        <p className="mt-2 line-clamp-2 flex-1 text-xs text-[var(--sg-color-text-muted)]">
                          {p.shortDescription}
                        </p>
                      ) : (
                        <span className="flex-1" />
                      )}
                      <p className="mt-2 text-sm font-semibold text-[var(--sg-color-primary)]">
                        Read review →
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {model.useCases.length > 0 ? (
        <Section padding="sm" background="surface" container="wide">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            Compare by what matters
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {model.useCases.map((u) => (
              <li key={u.id}>
                <Link
                  href={u.href}
                  className="block rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 transition hover:border-[var(--sg-color-primary)]"
                >
                  <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                    {u.title}
                  </p>
                  {u.description ? (
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--sg-color-text-muted)]">
                      {u.description}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Methodology + recent + tools */}
      <Section padding="md" background="tint" container="wide">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(14rem,0.7fr)_minmax(14rem,0.7fr)] lg:gap-8">
          <ComparisonMethodology
            methodologyHref={model.methodologyHref}
            howWeReviewHref={model.howWeReviewHref}
            compact
          />
          {model.recentlyUpdated.length > 0 ? (
            <RecentlyUpdatedComparisons items={model.recentlyUpdated} />
          ) : (
            <div className="rounded-[var(--sg-radius-xl)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/70 p-4">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
                Recently updated
              </h2>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Updated comparisons will appear here once published.
              </p>
            </div>
          )}
          <ComparisonToolCta tools={model.tools} variant="stack" />
        </div>
      </Section>

      {/* Guides + FAQ */}
      <Section padding="md" background="surface" container="wide">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <ComparisonGuideGrid guides={model.guides} />
          <ComparisonFaq items={model.faq} />
        </div>
      </Section>

      {model.directory.length > 0 ? (
        <Section padding="md" background="muted" container="wide">
          <ComparisonDirectory directory={model.directory} />
        </Section>
      ) : null}

      <CompareFinalCta />
    </>
  );
}
