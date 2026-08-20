import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ComparisonHubItem = {
  href: string;
  title: string;
  products: Array<{
    name: string;
    slug: string;
    logo?: { src: string; alt: string } | null;
    bestFor: string | null;
  }>;
  criteria: string[];
};

type Props = {
  title: string;
  items: ComparisonHubItem[];
  builderHref?: string;
  builderLabel?: string;
  className?: string;
};

export function CategoryComparisons({
  title,
  items,
  builderHref = "/compare/",
  builderLabel = "Choose two platforms to compare",
  className,
}: Props) {
  const featured = items.length === 1 ? items[0]! : null;
  const grid = items.length >= 2 ? items : [];

  return (
    <section
      id="compare"
      aria-labelledby="comparisons-heading"
      className={cn("scroll-mt-28", className)}
    >
      <h2
        id="comparisons-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="mt-5 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          Published comparisons for this category are still growing. Pick any
          two products to compare on shared criteria.
        </p>
      ) : null}

      {featured ? (
        <Card className="mt-5 p-5 sm:p-6">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
            {featured.products.slice(0, 2).map((p, i) => (
              <div
                key={p.slug}
                className={cn(
                  "flex flex-col items-center text-center",
                  i === 1 && "sm:order-3",
                )}
              >
                <ProductLogo name={p.name} logo={p.logo} size="lg" />
                <p className="mt-3 text-lg font-semibold">{p.name}</p>
                {p.bestFor ? (
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    Best for: {p.bestFor}
                  </p>
                ) : null}
              </div>
            ))}
            <div className="flex flex-col items-center sm:order-2">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--sg-color-primary-soft)] text-sm font-bold text-[var(--sg-color-primary)]">
                VS
              </span>
            </div>
          </div>
          {featured.criteria.length > 0 ? (
            <div className="mt-6 border-t border-[var(--sg-color-border)] pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Compare
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {featured.criteria.map((c) => (
                  <li
                    key={c}
                    className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-2.5 py-1 text-xs font-medium capitalize"
                  >
                    {c.replace(/-/g, " ")}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-6 text-center">
            <ButtonLink href={featured.href} size="lg">
              Compare {featured.title}
            </ButtonLink>
          </div>
        </Card>
      ) : null}

      {grid.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="group block h-full">
                <Card
                  variant="interactive"
                  className="flex h-full flex-col p-4"
                >
                  <div className="flex items-center gap-2">
                    {item.products.slice(0, 2).map((p, i) => (
                      <span key={p.slug} className="inline-flex items-center gap-2">
                        {i > 0 ? (
                          <span className="text-xs font-semibold text-[var(--sg-color-text-muted)]">
                            vs
                          </span>
                        ) : null}
                        <ProductLogo name={p.name} logo={p.logo} size="sm" />
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {item.title}
                  </p>
                  <span className="mt-auto pt-3 text-sm font-medium text-[var(--sg-color-primary)]">
                    {withSingleArrow("Compare")}
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {builderHref ? (
        <div className="mt-6 rounded-[var(--sg-radius-lg)] border border-dashed border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] px-4 py-5 text-center">
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Can&apos;t find the comparison you need?
          </p>
          <ButtonLink href={builderHref} variant="outline" className="mt-3">
            {builderLabel}
          </ButtonLink>
        </div>
      ) : null}
    </section>
  );
}

/** @deprecated Prefer CategoryComparisons */
export { CategoryComparisons as PopularComparisons };
