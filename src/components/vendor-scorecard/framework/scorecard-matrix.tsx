"use client";

import { cn } from "@/lib/cn";
import type { CriterionCellResult, ProductScorecardResult } from "@/services/vendor-scorecard";
import { ResearchAssessmentCell } from "./research-cell";

type ProductCol = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
};

export function ScorecardMatrix({
  products,
  results,
  onWhy,
  className,
}: {
  products: ProductCol[];
  results: ProductScorecardResult[];
  onWhy: (productSlug: string, cell: CriterionCellResult) => void;
  className?: string;
}) {
  const criteria =
    results[0]?.cells.map((c) => ({
      id: c.criterionId,
      label: c.label,
      weight: c.weight,
    })) ?? [];

  if (products.length === 0 || criteria.length === 0) {
    return (
      <p className="text-sm text-[var(--sg-color-text-muted)]">
        Add 2–5 products and criteria to see the live scorecard.
      </p>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full border-collapse text-left text-sm">
        <thead className="sticky top-0 z-10 bg-[var(--sg-color-surface)]">
          <tr className="border-b border-[var(--sg-color-border)]">
            <th
              scope="col"
              className="sticky left-0 z-20 bg-[var(--sg-color-surface)] px-3 py-3 font-semibold text-[var(--sg-color-navy)]"
            >
              Criterion
            </th>
            <th scope="col" className="px-3 py-3 font-semibold text-[var(--sg-color-text-muted)]">
              Weight
            </th>
            {products.map((p) => (
              <th
                key={p.slug}
                scope="col"
                className="min-w-[8.5rem] px-3 py-3 font-semibold text-[var(--sg-color-navy)]"
              >
                <span className="inline-flex items-center gap-2">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo.src}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 rounded object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                  {p.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {criteria.map((crit) => (
            <tr
              key={crit.id}
              className="border-b border-[var(--sg-color-border)] align-top"
            >
              <th
                scope="row"
                className="sticky left-0 bg-[var(--sg-color-surface)] px-3 py-3 font-medium text-[var(--sg-color-text)]"
              >
                {crit.label}
              </th>
              <td className="px-3 py-3 text-[var(--sg-color-text-muted)]">
                <div className="flex items-center gap-2">
                  <span>{Math.round(crit.weight * 100)}%</span>
                  <span
                    className="h-1.5 w-12 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
                    aria-hidden
                  >
                    <span
                      className="block h-full rounded-full bg-[var(--sg-color-primary)]"
                      style={{ width: `${Math.round(crit.weight * 100)}%` }}
                    />
                  </span>
                </div>
              </td>
              {products.map((p) => {
                const result = results.find((r) => r.productSlug === p.slug);
                const cell = result?.cells.find((c) => c.criterionId === crit.id);
                if (!cell) {
                  return (
                    <td key={p.slug} className="px-3 py-3 text-[var(--sg-color-text-muted)]">
                      —
                    </td>
                  );
                }
                return (
                  <td key={p.slug} className="px-3 py-3">
                    <ResearchAssessmentCell
                      qualitative={cell.qualitative}
                      numericScore={cell.numericScore}
                      onWhy={() => onWhy(p.slug, cell)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--sg-color-text-muted)]">
        <li>Strong</li>
        <li>Good</li>
        <li>Partial / plan dependent</li>
        <li>Unknown / Verify</li>
        <li>Does not meet</li>
      </ul>
    </div>
  );
}

/** Mobile: criterion cards instead of wide tables. */
export function ScorecardMatrixMobile({
  products,
  results,
  onWhy,
}: {
  products: ProductCol[];
  results: ProductScorecardResult[];
  onWhy: (productSlug: string, cell: CriterionCellResult) => void;
}) {
  const criteria = results[0]?.cells ?? [];
  return (
    <div className="space-y-4 lg:hidden">
      {criteria.map((crit) => (
        <div
          key={crit.criterionId}
          className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)]"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-semibold text-[var(--sg-color-navy)]">{crit.label}</h3>
            <span className="text-xs text-[var(--sg-color-text-muted)]">
              {Math.round(crit.weight * 100)}%
            </span>
          </div>
          <ul className="mt-3 space-y-3">
            {products.map((p) => {
              const result = results.find((r) => r.productSlug === p.slug);
              const cell = result?.cells.find(
                (c) => c.criterionId === crit.criterionId,
              );
              if (!cell) return null;
              return (
                <li key={p.slug} className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium">{p.name}</span>
                  <ResearchAssessmentCell
                    qualitative={cell.qualitative}
                    numericScore={cell.numericScore}
                    onWhy={() => onWhy(p.slug, cell)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
