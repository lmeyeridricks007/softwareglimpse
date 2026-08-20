"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatMoney, type ProductCostEstimate } from "@/domain";
import {
  listCalculableEstimates,
  summarizeFeatureCoverage,
  type PricingSnapshot,
} from "@/services/pricing";
import { ProductLogo } from "@/components/software/product-logo";
import { PricingConfidenceBadge } from "./pricing-confidence-badge";
import { cn } from "@/lib/cn";

type SortKey = "monthly" | "annual" | "product" | "confidence";

type Props = {
  estimates: ProductCostEstimate[];
  snapshots?: PricingSnapshot[];
  requiredFeatureSlugs?: string[];
  users: number;
  productNoun?: string;
  className?: string;
};

const CONFIDENCE_RANK = { high: 0, medium: 1, low: 2 } as const;

/**
 * Sortable side-by-side cost table with logos and confidence.
 */
export function CostComparisonTable({
  estimates,
  snapshots = [],
  requiredFeatureSlugs = [],
  users,
  productNoun = "CRM",
  className,
}: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("monthly");
  const snapBySlug = useMemo(() => {
    const map = new Map(snapshots.map((s) => [s.productSlug, s]));
    return map;
  }, [snapshots]);

  const rows = useMemo(() => {
    const calculable = listCalculableEstimates(estimates);
    return [...calculable].sort((a, b) => {
      if (sortKey === "product") {
        return a.productName.localeCompare(b.productName);
      }
      if (sortKey === "confidence") {
        return (
          CONFIDENCE_RANK[a.confidence] - CONFIDENCE_RANK[b.confidence] ||
          a.productName.localeCompare(b.productName)
        );
      }
      if (sortKey === "annual") {
        return (
          (a.annualCost?.amountMinor ?? Number.POSITIVE_INFINITY) -
            (b.annualCost?.amountMinor ?? Number.POSITIVE_INFINITY) ||
          a.productName.localeCompare(b.productName)
        );
      }
      return (
        (a.monthlyEquivalent?.amountMinor ?? Number.POSITIVE_INFINITY) -
          (b.monthlyEquivalent?.amountMinor ?? Number.POSITIVE_INFINITY) ||
        a.productName.localeCompare(b.productName)
      );
    });
  }, [estimates, sortKey]);

  if (rows.length === 0) return null;

  const currencies = [...new Set(rows.map((r) => r.currency).filter(Boolean))];
  const lowestMonthly = Math.min(
    ...rows.map((r) => r.monthlyEquivalent.amountMinor),
  );
  const annualAmounts = rows
    .map((r) => r.annualCost?.amountMinor)
    .filter((n): n is number => typeof n === "number");
  const lowestAnnual =
    annualAmounts.length > 0 ? Math.min(...annualAmounts) : null;
  const showCoverage = requiredFeatureSlugs.length > 0;

  return (
    <section className={cn(className)} aria-labelledby="side-by-side-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="side-by-side-heading"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
          >
            Side-by-side costs
          </h2>
          {currencies.length > 1 ? (
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Multiple currencies present ({currencies.join(", ")}). Do not
              compare absolute amounts across currencies.
            </p>
          ) : null}
        </div>
        <label className="text-sm text-[var(--sg-color-text-muted)]">
          Sort by{" "}
          <select
            className="ml-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-2 py-1.5 text-sm text-[var(--sg-color-text)]"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="monthly">Monthly cost</option>
            <option value="annual">Annual cost</option>
            <option value="product">Product</option>
            <option value="confidence">Confidence</option>
          </select>
        </label>
      </div>

      <div className="mt-4 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Estimated {productNoun} costs by product
          </caption>
          <thead>
            <tr className="border-b border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)]">
              <th scope="col" className="py-2 pr-3 font-medium">
                Product
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Plan
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Monthly
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Annual
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Per user
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Billing
              </th>
              {showCoverage ? (
                <th scope="col" className="py-2 pr-3 font-medium">
                  Req. matched
                </th>
              ) : null}
              <th scope="col" className="py-2 font-medium">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const snap = snapBySlug.get(row.productSlug);
              const coverage = showCoverage
                ? summarizeFeatureCoverage(
                    snap?.featureSupport ?? [],
                    requiredFeatureSlugs,
                  )
                : null;
              const perUserMinor =
                users > 0
                  ? Math.round(row.monthlyEquivalent.amountMinor / users)
                  : null;

              return (
                <tr
                  key={row.productSlug}
                  className="border-b border-[var(--sg-color-border)] hover:bg-[var(--sg-color-surface-muted)]/60"
                >
                  <th scope="row" className="py-3 pr-3 font-medium">
                    <Link
                      href={`/software/${row.productSlug}/`}
                      className="inline-flex items-center gap-2 underline-offset-2 hover:underline"
                    >
                      <ProductLogo
                        name={row.productName}
                        logo={snap?.logo}
                        size="sm"
                      />
                      {row.productName}
                    </Link>
                  </th>
                  <td className="py-3 pr-3">
                    {row.recommendedPlan?.name ?? "—"}
                  </td>
                  <td
                    className={cn(
                      "py-3 pr-3 tabular-nums",
                      row.monthlyEquivalent.amountMinor === lowestMonthly &&
                        "font-semibold text-[var(--sg-color-success)]",
                    )}
                  >
                    {formatMoney(row.monthlyEquivalent)}
                  </td>
                  <td
                    className={cn(
                      "py-3 pr-3 tabular-nums",
                      lowestAnnual != null &&
                        row.annualCost?.amountMinor === lowestAnnual &&
                        "font-semibold text-[var(--sg-color-success)]",
                    )}
                  >
                    {row.annualCost ? formatMoney(row.annualCost) : "—"}
                  </td>
                  <td className="py-3 pr-3 tabular-nums text-[var(--sg-color-text-muted)]">
                    {perUserMinor != null
                      ? formatMoney({
                          amountMinor: perUserMinor,
                          currency: row.monthlyEquivalent.currency,
                        })
                      : "—"}
                  </td>
                  <td className="py-3 pr-3 text-[var(--sg-color-text-muted)]">
                    {row.monthlyCashCost
                      ? "Monthly"
                      : row.annualCost
                        ? "Annual"
                        : "—"}
                  </td>
                  {showCoverage ? (
                    <td className="py-3 pr-3 tabular-nums">
                      {coverage
                        ? `${coverage.matched} / ${coverage.total}`
                        : "—"}
                    </td>
                  ) : null}
                  <td className="py-3">
                    <PricingConfidenceBadge
                      confidence={row.confidence}
                      compact
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="mt-4 grid gap-3 md:hidden">
        {rows.map((row) => {
          const snap = snapBySlug.get(row.productSlug);
          return (
            <li key={row.productSlug}>
              <Link
                href={`/software/${row.productSlug}/`}
                className="block rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4"
              >
                <div className="flex items-center gap-2">
                  <ProductLogo
                    name={row.productName}
                    logo={snap?.logo}
                    size="sm"
                  />
                  <span className="font-semibold text-[var(--sg-color-text)]">
                    {row.productName}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-[var(--sg-color-text-muted)]">
                      Plan
                    </dt>
                    <dd>{row.recommendedPlan?.name ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--sg-color-text-muted)]">
                      Monthly
                    </dt>
                    <dd className="tabular-nums font-medium">
                      {formatMoney(row.monthlyEquivalent)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--sg-color-text-muted)]">
                      Annual
                    </dt>
                    <dd className="tabular-nums">
                      {row.annualCost ? formatMoney(row.annualCost) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--sg-color-text-muted)]">
                      Confidence
                    </dt>
                    <dd className="capitalize">{row.confidence}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
        Per user is monthly equivalent ÷ {users} seats for comparison — not a
        separate vendor line item unless listed in the product card breakdown.
      </p>
    </section>
  );
}
