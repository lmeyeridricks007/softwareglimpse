"use client";

import {
  formatMoney,
  type TCOCostCategory,
  type TCOProductResult,
} from "@/domain";
import {
  TCO_CATEGORY_BAR,
  TCO_CATEGORY_LABELS,
  TCO_CATEGORY_ORDER,
} from "./tco-category-styles";
import { cn } from "@/lib/cn";

type Props = {
  product: TCOProductResult;
  className?: string;
};

export function TcoYearlyTable({ product, className }: Props) {
  const currency = product.currency as "EUR";
  const years = product.yearly;
  const maxYearTotal = Math.max(...years.map((y) => y.knownTotalMinor), 1);

  const activeCats = TCO_CATEGORY_ORDER.filter((cat) =>
    years.some((y) => (y.byCategory[cat] ?? 0) > 0),
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]",
        className,
      )}
    >
      <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)]/50 px-5 py-4 sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          Year-by-year known cost
        </p>
        <div className="mt-4 flex items-end gap-3 sm:gap-4">
          {years.map((y) => {
            const height = Math.max(
              8,
              Math.round((y.knownTotalMinor / maxYearTotal) * 96),
            );
            return (
              <div
                key={y.year}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <p className="text-[10px] font-medium tabular-nums text-[var(--sg-color-text-muted)]">
                  {formatMoney({
                    amountMinor: y.knownTotalMinor,
                    currency,
                  })}
                </p>
                <div
                  className="flex w-full max-w-[3.5rem] flex-col justify-end overflow-hidden rounded-t-md bg-[var(--sg-color-surface-muted)]"
                  style={{ height: 96 }}
                  aria-hidden
                >
                  <div
                    className="w-full rounded-t-md bg-[var(--sg-color-primary)]"
                    style={{ height }}
                  />
                </div>
                <p className="text-xs font-semibold text-[var(--sg-color-navy)]">
                  Y{y.year}
                </p>
                <p className="text-[10px] tabular-nums text-[var(--sg-color-text-muted)]">
                  {y.users} users
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto px-2 py-2 sm:px-4 sm:py-3">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <caption className="sr-only">
            {product.productName} year-by-year known TCO
          </caption>
          <thead>
            <tr className="border-b border-[var(--sg-color-border)] text-[10px] uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              <th scope="col" className="py-2.5 pr-3 pl-2 font-semibold">
                Category
              </th>
              {years.map((y) => (
                <th
                  key={y.year}
                  scope="col"
                  className="px-2 py-2.5 font-semibold tabular-nums"
                >
                  Year {y.year}
                </th>
              ))}
              <th scope="col" className="px-2 py-2.5 pr-2 font-semibold">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {activeCats.map((cat) => {
              const amounts = years.map((y) => y.byCategory[cat] ?? 0);
              const total = amounts.reduce((a, b) => a + b, 0);
              return (
                <tr
                  key={cat}
                  className="border-b border-[var(--sg-color-border)]/60"
                >
                  <th
                    scope="row"
                    className="py-2.5 pr-3 pl-2 font-medium text-[var(--sg-color-text)]"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          TCO_CATEGORY_BAR[cat as TCOCostCategory],
                        )}
                        aria-hidden
                      />
                      {TCO_CATEGORY_LABELS[cat]}
                    </span>
                  </th>
                  {amounts.map((a, i) => (
                    <td
                      key={i}
                      className="px-2 py-2.5 tabular-nums text-[var(--sg-color-text-muted)]"
                    >
                      {a > 0
                        ? formatMoney({ amountMinor: a, currency })
                        : "—"}
                    </td>
                  ))}
                  <td className="px-2 py-2.5 pr-2 tabular-nums font-medium">
                    {formatMoney({ amountMinor: total, currency })}
                  </td>
                </tr>
              );
            })}
            <tr className="bg-[var(--sg-color-surface-muted)]/40 font-semibold text-[var(--sg-color-navy)]">
              <th scope="row" className="py-3 pr-3 pl-2">
                Total known cost
              </th>
              {years.map((y) => (
                <td key={y.year} className="px-2 py-3 tabular-nums">
                  {formatMoney({
                    amountMinor: y.knownTotalMinor,
                    currency,
                  })}
                </td>
              ))}
              <td className="px-2 py-3 pr-2 tabular-nums">
                {formatMoney({
                  amountMinor: product.knownTcoMinor,
                  currency,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
