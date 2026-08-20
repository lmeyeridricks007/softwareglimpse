import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type CategoryReviewCardItem = {
  href: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  dateLabel?: string;
  bestFor?: string | null;
  categoryLabel?: string;
  score?: number | null;
  scoreApproved?: boolean;
  snippet?: string;
};

type Props = {
  title: string;
  items: CategoryReviewCardItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function CategoryReviewsRow({
  title,
  items,
  viewAllHref,
  viewAllLabel,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <section
      id="reviews"
      aria-labelledby="category-reviews-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="category-reviews-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          {title}
        </h2>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow(viewAllLabel ?? "View all software")}
          </Link>
        ) : null}
      </div>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <li key={item.href}>
            <Card className="flex h-full flex-col p-4">
              <div className="flex items-center gap-2">
                <ProductLogo name={item.name} logo={item.logo} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--sg-color-text)]">
                    {item.name}
                  </p>
                  {item.categoryLabel ? (
                    <p className="text-xs text-[var(--sg-color-text-muted)]">
                      {item.categoryLabel}
                    </p>
                  ) : null}
                </div>
              </div>
              {item.bestFor ? (
                <p className="mt-3 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  <span className="font-medium text-[var(--sg-color-text)]">
                    Best for:{" "}
                  </span>
                  {item.bestFor}
                </p>
              ) : item.snippet ? (
                <p className="mt-3 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {item.snippet}
                </p>
              ) : (
                <div className="flex-1" />
              )}
              {item.dateLabel ? (
                <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
                  Updated {item.dateLabel}
                </p>
              ) : null}
              <Link
                href={item.href}
                className="mt-4 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {withSingleArrow("Read review")}
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
