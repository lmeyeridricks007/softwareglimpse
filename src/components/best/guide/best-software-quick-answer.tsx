import Link from "next/link";
import { Check } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BestPageRecommendationModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  heading: string;
  intro: string;
  items: BestPageRecommendationModel[];
  seeAllHref?: string;
  seeAllLabel?: string;
  compareHref?: string;
  className?: string;
};

/** Job or ranked shortlist cards in a dense horizontal row. */
export function BestSoftwareQuickAnswer({
  heading,
  intro,
  items,
  seeAllHref,
  seeAllLabel,
  compareHref = "#compare",
  className,
}: Props) {
  const cards = items.slice(0, 5);

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            {heading}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--sg-color-text-muted)] sm:text-base">
            {intro}
          </p>
        </div>
        <Link
          href={compareHref}
          className="shrink-0 text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          View full comparison →
        </Link>
      </div>

      <div className="mt-6 -mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
        <ul className="flex gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
          {cards.map((item) => (
            <li
              key={item.product.slug}
              className="w-[14.5rem] shrink-0 sm:w-auto"
            >
              <GlanceCard item={item} rank={item.rank} />
            </li>
          ))}
        </ul>
      </div>

      {seeAllHref ? (
        <div className="mt-5 text-center">
          <ButtonLink href={seeAllHref} variant="outline" size="sm">
            {seeAllLabel ?? "See all platforms"}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

function GlanceCard({
  item,
  rank,
}: {
  item: BestPageRecommendationModel;
  rank?: number;
}) {
  const label = item.badge ?? item.positioningLabel;

  return (
    <Card className="flex h-full flex-col gap-0 p-3.5 shadow-[var(--sg-shadow-sm)]">
      <div className="flex items-center gap-2.5">
        {rank != null ? (
          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-navy)] text-[11px] font-semibold text-white">
            {rank}
          </span>
        ) : null}
        <ProductLogo name={item.product.name} logo={item.product.logo} size="sm" />
        <p className="min-w-0 truncate text-sm font-semibold text-[var(--sg-color-text)]">
          {item.product.name}
        </p>
      </div>

      {label ? (
        <Badge variant="primary" className="mt-2.5 w-fit max-w-full truncate text-[10px]">
          {label}
        </Badge>
      ) : null}

      <p className="mt-2 line-clamp-2 text-xs leading-snug text-[var(--sg-color-text-muted)]">
        {item.summary}
      </p>

      {item.strengths.length > 0 ? (
        <ul className="mt-2.5 space-y-1">
          {item.strengths.slice(0, 3).map((s) => (
            <li
              key={s}
              className="flex items-start gap-1.5 text-[11px] leading-snug text-[var(--sg-color-text)]"
            >
              <Check
                className="mt-0.5 size-3 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              <span className="line-clamp-1">{s}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-auto pt-2.5 text-[11px] font-medium text-[var(--sg-color-text)]">
        {item.pricingTeaser ? `From ${item.pricingTeaser}` : "See pricing"}
      </p>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-[var(--sg-color-border)] pt-2">
        <Link
          href={item.product.href}
          className="text-[11px] font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Read review
        </Link>
        <Link
          href={`/compare/?products=${item.product.slug}`}
          className="text-[11px] font-medium text-[var(--sg-color-text-muted)] underline-offset-2 hover:underline"
        >
          Compare
        </Link>
      </div>
    </Card>
  );
}
