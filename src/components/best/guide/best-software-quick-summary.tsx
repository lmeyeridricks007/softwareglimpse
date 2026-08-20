import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import type { BestPageHeroModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  items: BestPageHeroModel["shortlist"];
  compareHref: string;
  compareLabel: string;
  className?: string;
};

export function BestSoftwareQuickSummary({
  title,
  items,
  compareHref,
  compareLabel,
  className,
}: Props) {
  if (items.length === 0) return null;

  return (
    <Card
      className={cn(
        "h-fit border-[var(--sg-color-border)] p-5 shadow-[var(--sg-shadow-md)] sm:p-6",
        className,
      )}
      aria-labelledby="best-quick-summary-heading"
    >
      <h2
        id="best-quick-summary-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--sg-color-text-muted)]"
      >
        {title}
      </h2>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li
            key={item.product.slug}
            className="flex items-start gap-3 border-b border-[var(--sg-color-border)] pb-4 last:border-0 last:pb-0"
          >
            {item.rank != null ? (
              <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-navy)] text-[11px] font-semibold text-white">
                {item.rank}
              </span>
            ) : null}
            <ProductLogo
              name={item.product.name}
              logo={item.product.logo}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={item.product.href}
                  className="font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                >
                  {item.product.name}
                </Link>
                {item.bestFor ? (
                  <Badge variant="editorial-choice" className="text-[10px]">
                    {item.bestFor}
                  </Badge>
                ) : null}
              </div>
              {item.scoreApproved && item.score != null ? (
                <div className="mt-1">
                  <Rating score={item.score} showNumeric />
                </div>
              ) : null}
              {item.summary ? (
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-[var(--sg-color-text-muted)]">
                  {item.summary}
                </p>
              ) : null}
              {item.pricingTeaser ? (
                <p className="mt-1 text-xs font-medium text-[var(--sg-color-text)]">
                  From {item.pricingTeaser}
                </p>
              ) : null}
              <Link
                href={item.product.href}
                className="mt-1.5 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Read review →
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <Link
        href={compareHref}
        className="mt-5 inline-flex text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
      >
        {compareLabel} ↓
      </Link>
    </Card>
  );
}
