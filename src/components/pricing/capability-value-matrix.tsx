"use client";

import Link from "next/link";
import { formatMoney, type ProductCostEstimate } from "@/domain";
import {
  listCalculableEstimates,
  summarizeFeatureCoverage,
  type PricingSnapshot,
} from "@/services/pricing";
import { ProductLogo } from "@/components/software/product-logo";
import { PricingConfidenceBadge } from "./pricing-confidence-badge";
import { cn } from "@/lib/cn";

type Props = {
  estimates: ProductCostEstimate[];
  snapshots: PricingSnapshot[];
  requiredFeatureSlugs: string[];
  className?: string;
};

/**
 * Compact “what you get for the money” matrix.
 * Omits capability-match column when catalogue evidence is unavailable.
 */
export function CapabilityValueMatrix({
  estimates,
  snapshots,
  requiredFeatureSlugs,
  className,
}: Props) {
  const rows = listCalculableEstimates(estimates);
  if (rows.length === 0) return null;

  const snapBySlug = new Map(snapshots.map((s) => [s.productSlug, s]));
  const coverageBySlug = new Map(
    rows.map((row) => {
      const snap = snapBySlug.get(row.productSlug);
      return [
        row.productSlug,
        summarizeFeatureCoverage(
          snap?.featureSupport ?? [],
          requiredFeatureSlugs,
        ),
      ] as const;
    }),
  );
  const showCoverage =
    requiredFeatureSlugs.length > 0 &&
    [...coverageBySlug.values()].some((c) => c != null);

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 sm:p-8",
        className,
      )}
      aria-labelledby="value-matrix-heading"
    >
      <h2
        id="value-matrix-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        What do you get for the money?
      </h2>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Plan, cost, and research confidence for calculable options
        {showCoverage ? ", plus required-capability coverage from catalogue evidence" : ""}.
      </p>

      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)]">
              <th scope="col" className="py-2 pr-3 font-medium">
                Product
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Plan
              </th>
              <th scope="col" className="py-2 pr-3 font-medium">
                Monthly cost
              </th>
              {showCoverage ? (
                <th scope="col" className="py-2 pr-3 font-medium">
                  Req. matched
                </th>
              ) : null}
              <th scope="col" className="py-2 pr-3 font-medium">
                Billing
              </th>
              <th scope="col" className="py-2 font-medium">
                Confidence
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const snap = snapBySlug.get(row.productSlug);
              const coverage = coverageBySlug.get(row.productSlug);
              return (
                <tr
                  key={row.productSlug}
                  className="border-b border-[var(--sg-color-border)]"
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
                  <td className="py-3 pr-3 tabular-nums font-medium">
                    {formatMoney(row.monthlyEquivalent)}
                  </td>
                  {showCoverage ? (
                    <td className="py-3 pr-3 tabular-nums">
                      {coverage
                        ? `${coverage.matched} / ${coverage.total}`
                        : "—"}
                    </td>
                  ) : null}
                  <td className="py-3 pr-3 text-[var(--sg-color-text-muted)]">
                    {row.monthlyCashCost
                      ? "Monthly"
                      : row.annualCost
                        ? "Annual"
                        : "—"}
                  </td>
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
          const coverage = coverageBySlug.get(row.productSlug);
          return (
            <li
              key={row.productSlug}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] p-4"
            >
              <div className="flex items-center gap-2 font-semibold">
                <ProductLogo
                  name={row.productName}
                  logo={snap?.logo}
                  size="sm"
                />
                {row.productName}
              </div>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {row.recommendedPlan?.name ?? "—"} ·{" "}
                {formatMoney(row.monthlyEquivalent)}/mo
                {showCoverage && coverage
                  ? ` · ${coverage.matched}/${coverage.total} req.`
                  : ""}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
