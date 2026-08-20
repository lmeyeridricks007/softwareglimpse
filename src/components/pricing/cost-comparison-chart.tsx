"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatMoney, type ProductCostEstimate } from "@/domain";
import {
  deriveCostRangeSummary,
  listCalculableEstimates,
} from "@/services/pricing";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";

type LogoMap = Record<string, { src: string; alt: string } | undefined>;

type Props = {
  estimates: ProductCostEstimate[];
  logos?: LogoMap;
  highlightSlug?: string;
  productNoun?: string;
  className?: string;
};

type Period = "monthly" | "annual";

/**
 * Horizontal bar chart of product costs.
 */
export function CostComparisonChart({
  estimates,
  logos,
  highlightSlug,
  productNoun = "CRM",
  className,
}: Props) {
  const [period, setPeriod] = useState<Period>("monthly");
  const range = deriveCostRangeSummary(estimates);
  const rows = useMemo(() => {
    const calculable = listCalculableEstimates(estimates);
    const currency = range?.currency;
    if (!currency) return [];
    return calculable
      .filter((e) => e.currency === currency)
      .map((e) => {
        const money =
          period === "annual" ? e.annualCost : e.monthlyEquivalent;
        return { estimate: e, money };
      })
      .filter((r) => r.money != null)
      .sort(
        (a, b) =>
          (a.money?.amountMinor ?? 0) - (b.money?.amountMinor ?? 0),
      );
  }, [estimates, period, range?.currency]);

  if (!range) return null;

  if (rows.length === 0) {
    return (
      <section
        className={cn(
          "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)]/60 p-5 sm:p-8",
          className,
        )}
      >
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          How {productNoun} costs compare
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          {period === "annual"
            ? "Annual cash costs are not published for the current calculable set. Switch to monthly equivalent."
            : "No calculable costs to chart for this configuration."}
        </p>
      </section>
    );
  }

  const max = Math.max(...rows.map((r) => r.money!.amountMinor), 1);
  const lowestSlug = rows[0]?.estimate.productSlug;

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)]/60 p-5 sm:p-8",
        className,
      )}
      aria-labelledby="cost-chart-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="cost-chart-heading"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
          >
            How {productNoun} costs compare
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Verified {period === "monthly" ? "monthly equivalent" : "annual cash"}{" "}
            for matching plans — not FX-converted across currencies.
          </p>
        </div>
        <div
          className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-0.5"
          role="group"
          aria-label="Cost period"
        >
          {(["monthly", "annual"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
              className={cn(
                "rounded-[var(--sg-radius-sm)] px-3 py-1.5 text-sm font-medium capitalize",
                period === value
                  ? "bg-[var(--sg-color-primary)] text-[var(--sg-color-primary-fg)]"
                  : "text-[var(--sg-color-text-muted)] hover:text-[var(--sg-color-text)]",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 space-y-3 overflow-x-auto">
        {rows.map(({ estimate, money }) => {
          const width = Math.max(6, (money!.amountMinor / max) * 100);
          const isLowest = estimate.productSlug === lowestSlug;
          const isHighlight = estimate.productSlug === highlightSlug;
          return (
            <li key={estimate.productSlug} className="min-w-[18rem]">
              <div className="flex items-center gap-3">
                <ProductLogo
                  name={estimate.productName}
                  logo={logos?.[estimate.productSlug]}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/software/${estimate.productSlug}/`}
                        className="truncate text-sm font-semibold text-[var(--sg-color-text)] underline-offset-2 hover:underline"
                      >
                        {estimate.productName}
                      </Link>
                      {estimate.recommendedPlan ? (
                        <span className="ml-2 text-xs text-[var(--sg-color-text-muted)]">
                          {estimate.recommendedPlan.name}
                        </span>
                      ) : null}
                      {isLowest ? (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
                          Lowest
                        </span>
                      ) : null}
                      {isHighlight && !isLowest ? (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                          Highlighted
                        </span>
                      ) : null}
                    </div>
                    <span className="tabular-nums text-sm font-semibold text-[var(--sg-color-text)]">
                      {formatMoney(money!)}
                      <span className="font-normal text-[var(--sg-color-text-muted)]">
                        {period === "monthly" ? "/mo" : "/yr"}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--sg-color-surface)]">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width]",
                        isLowest
                          ? "bg-[var(--sg-color-success)]"
                          : isHighlight
                            ? "bg-[var(--sg-color-primary)]"
                            : "bg-[var(--sg-color-primary)]/70",
                      )}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <table className="sr-only">
        <caption>{productNoun} cost comparison ({period})</caption>
        <thead>
          <tr>
            <th>Product</th>
            <th>Plan</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ estimate, money }) => (
            <tr key={`a11y-${estimate.productSlug}`}>
              <td>{estimate.productName}</td>
              <td>{estimate.recommendedPlan?.name ?? "—"}</td>
              <td>{formatMoney(money!)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
