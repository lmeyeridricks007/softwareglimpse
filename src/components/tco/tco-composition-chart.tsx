"use client";

import {
  formatMoney,
  type TCOCostCategory,
  type TCOProductResult,
} from "@/domain";
import { TcoSourceBadge } from "./tco-source-badge";
import {
  TCO_CATEGORY_BAR,
  TCO_CATEGORY_LABELS,
  TCO_CATEGORY_ORDER,
} from "./tco-category-styles";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

type LogoMap = Record<string, { src: string; alt: string } | undefined>;

type Props = {
  products: TCOProductResult[];
  focusProductId?: string;
  logos?: LogoMap;
  className?: string;
};

/** Stacked composition bars with legend and detail table — results-ready. */
export function TcoCompositionChart({
  products,
  focusProductId,
  logos,
  className,
}: Props) {
  return (
    <div className={cn("space-y-5", className)}>
      {products.map((p) => {
        const currency = p.currency as "EUR";
        const known = p.knownTcoMinor;
        const focused = focusProductId === p.productId;
        const rows = TCO_CATEGORY_ORDER.map((cat) => {
          const row = p.categoryTotals.find((c) => c.category === cat);
          if (!row || row.amountMinor <= 0) return null;
          return { cat, row };
        }).filter(Boolean) as Array<{
          cat: TCOCostCategory;
          row: NonNullable<(typeof p.categoryTotals)[number]>;
        }>;

        return (
          <article
            key={p.productId}
            className={cn(
              "rounded-[var(--sg-radius-xl)] border bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6",
              focused
                ? "border-[var(--sg-color-primary)]/40 ring-1 ring-[var(--sg-color-primary)]/20"
                : "border-[var(--sg-color-border)]",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <ProductLogo
                  name={p.productName}
                  logo={logos?.[p.productId]}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--sg-color-navy)]">
                    {p.productName}
                  </p>
                  {p.qualifyingPlanName ? (
                    <p className="text-xs text-[var(--sg-color-text-muted)]">
                      {p.qualifyingPlanName}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                  Known TCO
                </p>
                <p className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                  {formatMoney({ amountMinor: known, currency })}
                </p>
              </div>
            </div>

            <div
              className="mt-5 flex h-5 w-full overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
              role="img"
              aria-label={`${p.productName} cost composition`}
            >
              {rows.map(({ cat, row }) => {
                const pct = known > 0 ? (row.amountMinor / known) * 100 : 0;
                return (
                  <span
                    key={cat}
                    className={cn("h-full transition-all", TCO_CATEGORY_BAR[cat])}
                    style={{ width: `${Math.max(pct, pct > 0 ? 0.8 : 0)}%` }}
                    title={`${TCO_CATEGORY_LABELS[cat]}: ${Math.round(pct)}%`}
                  />
                );
              })}
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {rows.map(({ cat, row }) => {
                const pct =
                  known > 0
                    ? Math.round((row.amountMinor / known) * 100)
                    : 0;
                return (
                  <li
                    key={cat}
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--sg-color-text-muted)]"
                  >
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        TCO_CATEGORY_BAR[cat],
                      )}
                      aria-hidden
                    />
                    <span className="font-medium text-[var(--sg-color-text)]">
                      {TCO_CATEGORY_LABELS[cat]}
                    </span>
                    <span className="tabular-nums">{pct}%</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[22rem] text-left text-sm">
                <caption className="sr-only">
                  {p.productName} cost composition table
                </caption>
                <thead>
                  <tr className="border-b border-[var(--sg-color-border)] text-[10px] uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                    <th scope="col" className="pb-2 pr-3 font-semibold">
                      Category
                    </th>
                    <th scope="col" className="pb-2 px-2 font-semibold">
                      Amount
                    </th>
                    <th scope="col" className="pb-2 px-2 font-semibold">
                      Share
                    </th>
                    <th scope="col" className="pb-2 pl-2 font-semibold">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ cat, row }) => (
                    <tr
                      key={cat}
                      className="border-b border-[var(--sg-color-border)]/60 last:border-0"
                    >
                      <th
                        scope="row"
                        className="py-2.5 pr-3 font-medium text-[var(--sg-color-text)]"
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              TCO_CATEGORY_BAR[cat],
                            )}
                            aria-hidden
                          />
                          {TCO_CATEGORY_LABELS[cat]}
                        </span>
                      </th>
                      <td className="px-2 py-2.5 tabular-nums">
                        {formatMoney({
                          amountMinor: row.amountMinor,
                          currency,
                        })}
                      </td>
                      <td className="px-2 py-2.5 tabular-nums text-[var(--sg-color-text-muted)]">
                        {known > 0
                          ? `${Math.round((row.amountMinor / known) * 100)}%`
                          : "—"}
                      </td>
                      <td className="py-2.5 pl-2">
                        <TcoSourceBadge sourceType={row.sourceType} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {focused ? (
              <Badge variant="neutral" className="mt-4">
                Focused in sidebar
              </Badge>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
