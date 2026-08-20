import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { CategoryHubBestPreviewItem } from "@/services/category-hub";

type Props = {
  title: string;
  subtitle?: string;
  items: CategoryHubBestPreviewItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
  /** When rankings are not approved, show catalogue products without numbers. */
  unranked?: boolean;
  unrankedItems?: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
    bestFor: string | null;
  }>;
  className?: string;
};

export function CategoryBestPreview({
  title,
  subtitle,
  items,
  viewAllHref,
  viewAllLabel,
  unranked,
  unrankedItems = [],
  className,
}: Props) {
  const showRanked = !unranked && items.length > 0;
  const showUnranked = unranked && unrankedItems.length > 0;
  if (!showRanked && !showUnranked) return null;

  return (
    <section
      id="best"
      aria-labelledby="best-preview-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="best-preview-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow(viewAllLabel ?? "See full guide")}
          </Link>
        ) : null}
      </div>

      {showRanked ? (
        <ol className="mt-5 space-y-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Card className="flex items-center gap-4 p-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-primary)] text-sm font-semibold text-white">
                  #{item.rank}
                </span>
                <ProductLogo name={item.name} logo={item.logo} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--sg-color-text)]">
                    {item.name}
                  </p>
                  {item.bestFor ? (
                    <p className="text-sm text-[var(--sg-color-text-muted)]">
                      Best for {item.bestFor}
                    </p>
                  ) : null}
                </div>
                <Link
                  href={`/software/${item.slug}/`}
                  className="shrink-0 text-sm font-medium text-[var(--sg-color-primary)]"
                >
                  {withSingleArrow("Review")}
                </Link>
              </Card>
            </li>
          ))}
        </ol>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {unrankedItems.map((item) => (
            <li key={item.slug}>
              <Link href={`/software/${item.slug}/`} className="group block">
                <Card variant="interactive" className="flex items-center gap-3 p-4">
                  <ProductLogo name={item.name} logo={item.logo} size="md" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                      {item.name}
                    </p>
                    {item.bestFor ? (
                      <p className="line-clamp-2 text-sm text-[var(--sg-color-text-muted)]">
                        {item.bestFor}
                      </p>
                    ) : null}
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
