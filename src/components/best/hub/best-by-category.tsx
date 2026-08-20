import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/stack";
import { SectionHeader } from "@/components/home/section-header";
import { CategoryCard } from "@/components/category/category-card";
import type { BestHubModel, BestHubPageCard } from "@/services/best-hub";
import { cn } from "@/lib/cn";

export function BestCategoryCard({
  page,
  featured = false,
  className,
}: {
  page: BestHubPageCard;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link href={page.href} className={cn("group block h-full", className)}>
      <Card
        variant="interactive"
        className={cn("flex h-full flex-col", featured ? "p-6" : "p-5")}
      >
        <CategoryIcon
          categoryId={page.categorySlug}
          size={featured ? "lg" : "lg"}
        />
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          {page.categoryName}
        </p>
        <h3
          className={cn(
            "mt-1 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]",
            featured && "text-lg",
          )}
        >
          {page.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
          {page.buyingContext}
        </p>
        {page.topProducts.length > 0 ? (
          <ul className="mt-4 flex items-center gap-2">
            {page.topProducts.slice(0, 4).map((p) => (
              <li key={p.slug}>
                <ProductLogo name={p.name} logo={p.logo} size="sm" />
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)]">
          {page.productCount} products covered
          {page.updatedLabel ? (
            <span className="font-normal text-[var(--sg-color-text-muted)]">
              {" "}
              · Updated {page.updatedLabel}
            </span>
          ) : null}
        </p>
        <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
          Explore
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </p>
      </Card>
    </Link>
  );
}

type Props = {
  model: BestHubModel;
  className?: string;
};

/**
 * Published Best pages + category discovery cards with colored CategoryIcons.
 */
export function BestByCategory({ model, className }: Props) {
  const { pages, categoryCards, relatedCategories, featured } = model;

  const showBestGrid = pages.length > 1 || categoryCards.length > 0;
  // Prefer a mockup-like row: CRM (featured already) + other hubs with icons
  const discoveryCategories = relatedCategories
    .filter((c) => c.slug !== featured?.categorySlug)
    .slice(0, 5);

  if (pages.length === 0 && discoveryCategories.length === 0) return null;

  // When only one Best page exists, show it + related category hubs in one row
  const singleBest = pages.length === 1 && pages[0] ? pages[0] : null;

  return (
    <Section
      padding="md"
      background="muted"
      container="wide"
      className={className}
    >
      <SectionHeader
        title="Best software by category"
        description="Methodology-led shortlists and category hubs we actively cover."
        action={
          <Link
            href="/categories/"
            className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            View all categories →
          </Link>
        }
      />

      {singleBest ? (
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BestCategoryCard page={singleBest} featured />
          {discoveryCategories.slice(0, 3).map((c) => (
            <CategoryCard
              key={c.slug}
              slug={c.slug}
              name={c.name}
              href={c.href}
              description={c.description}
              productCount={c.productCount > 0 ? c.productCount : undefined}
              popularNames={c.popularNames}
              featured
            />
          ))}
        </div>
      ) : null}

      {!singleBest && showBestGrid ? (
        <Grid cols={3} gap={4}>
          {(categoryCards.length > 0 ? categoryCards : pages).map((page) => (
            <BestCategoryCard key={page.id} page={page} />
          ))}
        </Grid>
      ) : null}

      {!singleBest && !showBestGrid && discoveryCategories.length > 0 ? (
        <Grid cols={4} gap={4}>
          {discoveryCategories.map((c) => (
            <CategoryCard
              key={c.slug}
              slug={c.slug}
              name={c.name}
              href={c.href}
              description={c.description}
              productCount={c.productCount > 0 ? c.productCount : undefined}
              popularNames={c.popularNames}
              featured={c.productCount > 0}
            />
          ))}
        </Grid>
      ) : null}

      {!singleBest && showBestGrid && discoveryCategories.length > 0 ? (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-[var(--sg-color-text-muted)]">
            More categories
          </p>
          <Grid cols={4} gap={3}>
            {discoveryCategories.slice(0, 4).map((c) => (
              <CategoryCard
                key={c.slug}
                slug={c.slug}
                name={c.name}
                href={c.href}
                description={c.description}
              />
            ))}
          </Grid>
        </div>
      ) : null}
    </Section>
  );
}
