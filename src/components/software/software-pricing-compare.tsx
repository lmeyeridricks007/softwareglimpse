import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export type PricingCompareColumn = {
  name: string;
  isSubject: boolean;
};

export type PricingCompareRow = {
  label: string;
  values: Array<string | null>;
};

type Props = {
  columns: PricingCompareColumn[];
  rows: PricingCompareRow[];
  compareHref?: string | null;
  className?: string;
};

export function SoftwarePricingCompare({
  columns,
  rows,
  compareHref,
  className,
}: Props) {
  if (columns.length === 0 || rows.length === 0) return null;

  return (
    <section
      aria-labelledby="pricing-compare-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="pricing-compare-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Pricing comparison
        </h2>
        {compareHref ? (
          <Link
            href={compareHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow("Full comparison")}
          </Link>
        ) : null}
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
        <table className="min-w-full divide-y divide-[var(--sg-color-border)] text-sm">
          <thead className="bg-[var(--sg-color-surface-muted)]">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]"
              >
                &nbsp;
              </th>
              {columns.map((col) => (
                <th
                  key={col.name}
                  scope="col"
                  className={cn(
                    "px-4 py-3 text-left font-semibold",
                    col.isSubject
                      ? "text-[var(--sg-color-primary)]"
                      : "text-[var(--sg-color-text)]",
                  )}
                >
                  {col.name}
                  {col.isSubject ? (
                    <span className="ml-1.5 text-xs font-normal text-[var(--sg-color-text-muted)]">
                      (this review)
                    </span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
            {rows.map((row) => (
              <tr key={row.label}>
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-medium text-[var(--sg-color-text)]"
                >
                  {row.label}
                </th>
                {row.values.map((value, index) => (
                  <td
                    key={`${row.label}-${index}`}
                    className="px-4 py-3 text-[var(--sg-color-text-muted)]"
                  >
                    {value ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compareHref ? (
        <div className="mt-5">
          <ButtonLink href={compareHref} variant="outline">
            Compare side by side
          </ButtonLink>
        </div>
      ) : null}
    </section>
  );
}
