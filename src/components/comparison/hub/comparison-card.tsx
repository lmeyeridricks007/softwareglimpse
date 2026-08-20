"use client";

import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { Card } from "@/components/ui/card";
import type { CompareHubCard } from "@/services/compare-hub";
import { track } from "@/analytics/events";
import { cn } from "@/lib/cn";

type Props = {
  comparison: CompareHubCard;
  className?: string;
};

export function ComparisonCard({ comparison, className }: Props) {
  return (
    <Link
      href={comparison.href}
      className={cn("group block h-full", className)}
      onClick={() =>
        track({
          name: "comparison_card_clicked",
          properties: { slug: comparison.slug },
        })
      }
    >
      <Card variant="interactive" className="flex h-full flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold">
            <ProductLogo
              name={comparison.productA.name}
              logo={comparison.productA.logo}
              size="sm"
              className="!size-6"
            />
            <span className="truncate">{comparison.productA.name}</span>
          </span>
          <span className="text-[10px] font-bold uppercase text-[var(--sg-color-text-muted)]">
            vs
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold">
            <ProductLogo
              name={comparison.productB.name}
              logo={comparison.productB.logo}
              size="sm"
              className="!size-6"
            />
            <span className="truncate">{comparison.productB.name}</span>
          </span>
        </div>
        <h3 className="mt-2.5 text-sm font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
          {comparison.title}
        </h3>
        {comparison.summary ? (
          <p className="mt-1.5 line-clamp-2 flex-1 text-xs text-[var(--sg-color-text-muted)]">
            {comparison.summary}
          </p>
        ) : (
          <span className="flex-1" />
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          {comparison.categoryLabel ? (
            <span className="rounded-[var(--sg-radius-pill)] bg-[var(--sg-color-primary-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--sg-color-primary)]">
              {comparison.categoryLabel}
            </span>
          ) : (
            <span />
          )}
          <span className="text-sm font-semibold text-[var(--sg-color-primary)]">
            Compare →
          </span>
        </div>
        {comparison.updatedLabel ? (
          <p className="mt-1.5 text-[11px] text-[var(--sg-color-text-muted)]">
            Updated {comparison.updatedLabel}
          </p>
        ) : null}
      </Card>
    </Link>
  );
}
