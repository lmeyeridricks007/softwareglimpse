"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { withSingleArrow } from "@/components/category/hub-icons";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatMoney, fromMajor, type CurrencyCode } from "@/domain";

export type TeamCostPlan = {
  slug: string;
  name: string;
  amountPerSeatMonthly: number | null;
  contactSales?: boolean;
};

type Props = {
  productName: string;
  plans: TeamCostPlan[];
  calculatorHref?: string | null;
  currency?: CurrencyCode;
  className?: string;
};

export function SoftwareTeamCostEstimator({
  productName,
  plans,
  calculatorHref,
  currency = "USD",
  className,
}: Props) {
  const selectablePlans = plans.filter(
    (plan) => plan.contactSales || plan.amountPerSeatMonthly != null,
  );

  const defaultSlug =
    selectablePlans.find((p) => !p.contactSales)?.slug ??
    selectablePlans[0]?.slug ??
    "";

  const [seats, setSeats] = useState(5);
  const [planSlug, setPlanSlug] = useState(defaultSlug);

  const selected = selectablePlans.find((p) => p.slug === planSlug);

  const estimate = useMemo(() => {
    if (!selected) return null;
    if (selected.contactSales) {
      return { monthly: null, annual: null, custom: true as const };
    }
    if (selected.amountPerSeatMonthly == null) return null;
    const monthly = selected.amountPerSeatMonthly * seats;
    return {
      monthly,
      annual: monthly * 12,
      custom: false as const,
    };
  }, [selected?.slug, selected?.contactSales, selected?.amountPerSeatMonthly, seats]);

  if (selectablePlans.length === 0) return null;

  return (
    <Card className={cn(className)}>
      <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
        Estimate team cost
      </h3>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Rough monthly and annual cost for {productName} based on list pricing.
        Confirm rates on the vendor site before buying.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-text)]">Seats</span>
          <input
            type="number"
            min={1}
            max={500}
            value={seats}
            onChange={(e) =>
              setSeats(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
            }
            className="mt-1.5 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)]"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-text)]">Plan</span>
          <select
            value={planSlug}
            onChange={(e) => setPlanSlug(e.target.value)}
            className="mt-1.5 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)]"
          >
            {selectablePlans.map((plan) => (
              <option key={plan.slug} value={plan.slug}>
                {plan.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface-muted)] px-4 py-3">
        {estimate?.custom ? (
          <p className="text-sm font-medium text-[var(--sg-color-text)]">
            Custom pricing — contact sales for a quote.
          </p>
        ) : estimate ? (
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">Monthly</dt>
              <dd className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--sg-color-text)]">
                {formatMoney(fromMajor(estimate.monthly!, currency))}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">Annual</dt>
              <dd className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--sg-color-text)]">
                {formatMoney(fromMajor(estimate.annual!, currency))}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>

      {calculatorHref ? (
        <Link
          href={calculatorHref}
          className="mt-4 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          {withSingleArrow(`Open ${productName} cost calculator`)}
        </Link>
      ) : null}
    </Card>
  );
}
