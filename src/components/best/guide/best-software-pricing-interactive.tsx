"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductLogo } from "@/components/software/product-logo";
import { ButtonLink } from "@/components/ui/button";
import {
  calculateProductCost,
  type PricingSnapshot,
} from "@/services/pricing";
import { crmRequirementsFromCalculatorInput } from "@/domain";
import { formatMoney } from "@/domain";
import type { BestPageModel } from "@/services/best-page";
import { cn } from "@/lib/cn";

type Props = {
  pricing: NonNullable<BestPageModel["pricing"]>;
  /** Server-built snapshots for interactive estimate rows. */
  snapshots: PricingSnapshot[];
  className?: string;
};

export function BestSoftwarePricingInteractive({
  pricing,
  snapshots,
  className,
}: Props) {
  const [users, setUsers] = useState(10);
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  const estimates = useMemo(() => {
    const requirements = crmRequirementsFromCalculatorInput({
      crmUsers: users,
      billingPreference: billing,
      requiredFeatureSlugs: [],
    });
    return snapshots.map((snap) =>
      calculateProductCost(snap, requirements),
    );
  }, [snapshots, users, billing]);

  return (
    <div className={cn(className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            {pricing.heading}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
            {pricing.intro}
          </p>
          {pricing.lastChecked ? (
            <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
              Last pricing check: {pricing.lastChecked}
            </p>
          ) : null}
        </div>
        {pricing.calculatorHref ? (
          <ButtonLink href={pricing.calculatorHref} variant="outline" size="sm">
            Calculate your CRM cost →
          </ButtonLink>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium text-[var(--sg-color-text)]">
            Team size
          </span>
          <input
            type="range"
            min={1}
            max={50}
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-32 accent-[var(--sg-color-primary)]"
          />
          <span className="tabular-nums font-semibold">{users} users</span>
        </label>
        <div className="flex rounded-full border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-0.5">
          {(["monthly", "annual"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setBilling(mode)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize",
                billing === mode
                  ? "bg-[var(--sg-color-primary)] text-white"
                  : "text-[var(--sg-color-text-muted)]",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        <table className="min-w-[40rem] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--sg-color-surface-muted)]">
              <th className="px-4 py-3 text-left font-semibold">CRM</th>
              <th className="px-4 py-3 text-left font-semibold">Entry / list</th>
              <th className="px-4 py-3 text-left font-semibold">Free plan</th>
              <th className="px-4 py-3 text-left font-semibold">Free trial</th>
              <th className="px-4 py-3 text-left font-semibold">
                Est. for {users} users
              </th>
            </tr>
          </thead>
          <tbody>
            {pricing.rows.map((row) => {
              const estimate = estimates.find(
                (e) => e.productSlug === row.product.slug,
              );
              return (
                <tr
                  key={row.product.slug}
                  className="border-t border-[var(--sg-color-border)]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={row.product.href}
                      className="inline-flex items-center gap-2 font-medium hover:text-[var(--sg-color-primary)]"
                    >
                      <ProductLogo
                        name={row.product.name}
                        logo={row.product.logo}
                        size="sm"
                      />
                      {row.product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {row.startingPrice ?? "See pricing"}
                  </td>
                  <td className="px-4 py-3">
                    {row.freePlan ?? (
                      <span className="text-[var(--sg-color-text-muted)]">
                        Coverage incomplete
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.freeTrial ?? (
                      <span className="text-[var(--sg-color-text-muted)]">
                        —
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <EstimateCell estimate={estimate} billing={billing} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Estimates use verified list prices and the shared cost engine.
        Flat plans stay flat (not multiplied by team size); seat plans scale
        with the slider. Custom-quote and incomplete pricing stay explicit.
      </p>
    </div>
  );
}

function EstimateCell({
  estimate,
  billing,
}: {
  estimate: ReturnType<typeof calculateProductCost> | undefined;
  billing: "monthly" | "annual";
}) {
  if (!estimate) {
    return <span className="text-[var(--sg-color-text-muted)]">Unavailable</span>;
  }
  if (estimate.status === "custom-quote") {
    return <span>Custom quote</span>;
  }
  if (
    estimate.status === "insufficient-data" ||
    estimate.status === "no-suitable-plan"
  ) {
    return (
      <span className="text-[var(--sg-color-text-muted)]">
        Pricing unavailable
      </span>
    );
  }
  const money =
    billing === "annual"
      ? estimate.annualCost
      : estimate.monthlyEquivalent ?? estimate.monthlyCashCost;
  if (!money) {
    return (
      <span className="text-[var(--sg-color-text-muted)]">See calculator</span>
    );
  }
  return (
    <span className="tabular-nums font-medium">
      {formatMoney(money)}
      <span className="ml-1 text-xs font-normal text-[var(--sg-color-text-muted)]">
        {billing === "annual" ? "/yr" : "/mo equiv."}
      </span>
    </span>
  );
}
