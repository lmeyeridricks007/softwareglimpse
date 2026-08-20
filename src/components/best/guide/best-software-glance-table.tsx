"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import type {
  BestPageComparisonColumn,
  BestPageComparisonRow,
} from "@/services/best-page";
import { cn } from "@/lib/cn";

const COL_LABELS: Record<Exclude<BestPageComparisonColumn, "product">, string> =
  {
    bestFor: "Best for / fit",
    focus: "Focus",
    startingPrice: "Starting price",
    freePlan: "Free plan",
    keyStrength: "Key strength",
    keyLimitation: "Key limitation",
    pipeline: "Pipeline",
    automation: "Automation",
    email: "Email",
    reporting: "Reporting",
    easeOfUse: "Ease of use",
    rating: "Our score",
    review: "Review",
    compare: "Compare",
  };

type Props = {
  heading: string;
  columns: BestPageComparisonColumn[];
  rows: BestPageComparisonRow[];
  compareAllHref?: string;
  compareAllLabel?: string;
  scoreTooltip?: string;
  className?: string;
};

/** Product-as-rows glance table with sticky CRM column + compare selection. */
export function BestSoftwareGlanceTable({
  heading,
  columns,
  rows,
  compareAllHref = "/compare/",
  compareAllLabel = "Compare software",
  scoreTooltip = "Approved editorial scores use our category methodology (0–10). Scores appear only when assessment and review are approved.",
  className,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const criteria = columns.filter((c) => c !== "product");

  const compareHref = useMemo(() => {
    if (selected.length < 2) return compareAllHref;
    return `/compare/?products=${selected.join(",")}`;
  }, [selected, compareAllHref]);

  function toggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 4) return prev;
      return [...prev, slug];
    });
  }

  if (rows.length === 0) return null;

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            {heading}
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Select up to four CRMs to compare. Unknown free-plan cells mean
            coverage is incomplete — not “No”.
          </p>
        </div>
        <ButtonLink
          href={compareHref}
          variant={selected.length >= 2 ? "primary" : "outline"}
          size="sm"
        >
          {selected.length >= 2
            ? `Compare selected (${selected.length}) →`
            : compareAllLabel}
        </ButtonLink>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] shadow-[var(--sg-shadow-sm)]">
        <table className="min-w-[52rem] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="sticky left-0 z-10 bg-[var(--sg-color-surface-muted)] px-4 py-3 text-left font-semibold text-[var(--sg-color-text)]">
                CRM
              </th>
              {criteria.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-3 py-3 text-left font-semibold text-[var(--sg-color-text)]"
                  title={col === "rating" ? scoreTooltip : undefined}
                >
                  {COL_LABELS[col]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.product.slug}
                className="border-t border-[var(--sg-color-border)]"
              >
                <th className="sticky left-0 z-10 bg-[var(--sg-color-surface)] px-4 py-3 text-left font-medium">
                  <Link
                    href={row.product.href}
                    className="inline-flex items-center gap-2 hover:text-[var(--sg-color-primary)]"
                  >
                    <ProductLogo
                      name={row.product.name}
                      logo={row.product.logo}
                      size="sm"
                    />
                    <span>{row.product.name}</span>
                  </Link>
                </th>
                {criteria.map((col) => (
                  <td
                    key={`${row.product.slug}-${col}`}
                    className="px-3 py-3 text-[var(--sg-color-text)]"
                  >
                    <CellValue
                      col={col}
                      row={row}
                      selected={selected.includes(row.product.slug)}
                      onToggle={() => toggle(row.product.slug)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected.length >= 2 ? (
        <div className="sticky bottom-3 z-20 mt-4 flex justify-center sm:hidden">
          <ButtonLink href={compareHref} size="sm">
            Compare selected ({selected.length}) →
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

function CellValue({
  col,
  row,
  selected,
  onToggle,
}: {
  col: Exclude<BestPageComparisonColumn, "product">;
  row: BestPageComparisonRow;
  selected: boolean;
  onToggle: () => void;
}) {
  switch (col) {
    case "bestFor":
      return (
        <span className="line-clamp-2 text-xs leading-snug">
          {row.bestFor ?? "—"}
        </span>
      );
    case "focus":
      return (
        <span className="line-clamp-2 text-xs leading-snug">
          {row.focus ?? "—"}
        </span>
      );
    case "startingPrice":
      return <>{row.startingPrice ?? "See pricing"}</>;
    case "freePlan":
      return (
        <span
          className={cn(
            row.freePlan == null && "text-[var(--sg-color-text-muted)]",
          )}
          title={
            row.freePlan == null
              ? "Coverage incomplete for free-plan status"
              : undefined
          }
        >
          {row.freePlan ?? "Coverage incomplete"}
        </span>
      );
    case "keyStrength":
      return (
        <span className="line-clamp-2 text-xs text-[var(--sg-color-success)]">
          {row.keyStrength ?? "—"}
        </span>
      );
    case "keyLimitation":
      return (
        <span className="line-clamp-2 text-xs text-amber-700">
          {row.keyLimitation ?? "—"}
        </span>
      );
    case "rating":
      return row.rating != null ? (
        <span className="inline-flex items-center gap-1">
          <Rating score={row.rating} showNumeric />
          <span className="text-xs text-[var(--sg-color-text-muted)]">/10</span>
        </span>
      ) : (
        <span className="text-[var(--sg-color-text-muted)]">—</span>
      );
    case "review":
      return (
        <Link
          href={row.reviewHref}
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Review
        </Link>
      );
    case "compare":
      return (
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="size-4 rounded border-[var(--sg-color-border)]"
          />
          <span className="sr-only">Compare {row.product.name}</span>
        </label>
      );
    default:
      return <>—</>;
  }
}
