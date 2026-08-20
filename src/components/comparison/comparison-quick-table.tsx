import type { ReactNode } from "react";
import { ProductLogo } from "@/components/software/product-logo";
import { Rating } from "@/components/ui/rating";
import { cn } from "@/lib/cn";

export type QuickCompareColumn = {
  key: string;
  label: string;
};

export type QuickCompareRow = {
  name: string;
  logo?: { src: string; alt: string } | null;
  cells: Record<string, ReactNode>;
  score?: number | null;
  scoreApproved?: boolean;
};

type Props = {
  columns: QuickCompareColumn[];
  rows: QuickCompareRow[];
  className?: string;
};

export function ComparisonQuickTable({ columns, rows, className }: Props) {
  if (rows.length === 0 || columns.length === 0) return null;

  return (
    <section
      id="overview"
      aria-labelledby="quick-compare-heading"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] p-5 sm:p-6",
        className,
      )}
    >
      <h2
        id="quick-compare-heading"
        className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
      >
        Quick comparison
      </h2>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <caption className="sr-only">High-level comparison snapshot</caption>
          <thead>
            <tr className="border-b border-[var(--sg-color-border)]">
              <th scope="col" className="py-3 pr-4 font-medium text-[var(--sg-color-text)]">
                Product
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className="py-3 pr-4 font-medium text-[var(--sg-color-text)] last:pr-0"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                className="border-b border-[var(--sg-color-border)]/80 align-top last:border-0"
              >
                <th scope="row" className="py-4 pr-4">
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--sg-color-text)]">
                    <ProductLogo name={row.name} logo={row.logo} size="sm" />
                    {row.name}
                  </span>
                  {row.scoreApproved && row.score != null ? (
                    <span className="mt-1 block">
                      <Rating score={row.score} showNumeric />
                    </span>
                  ) : null}
                </th>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="py-4 pr-4 text-[var(--sg-color-text-muted)] last:pr-0"
                  >
                    {row.cells[col.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
