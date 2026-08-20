"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMoney, fromMajor, type CurrencyCode } from "@/domain";
import { cn } from "@/lib/cn";
import type { ComparisonPageModel } from "@/services/comparison-page/types";

type Props = {
  model: ComparisonPageModel;
};

function PricingCard({
  name,
  logo,
  href,
  card,
  accent,
}: {
  name: string;
  logo?: { src: string; alt: string } | null;
  href: string;
  card: ComparisonPageModel["pricing"]["cardA"];
  accent: "a" | "b";
}) {
  const hasContent =
    card.starting ||
    card.freePlan ||
    card.trial ||
    card.plans.length > 0;
  if (!hasContent) return null;

  const freeAvailable = Boolean(
    card.freePlan?.toLowerCase().includes("available"),
  );

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden p-0",
        accent === "a"
          ? "ring-1 ring-[var(--sg-color-primary)]/20"
          : "ring-1 ring-[var(--sg-color-danger)]/15",
      )}
    >
      <div
        className={cn(
          "border-b border-[var(--sg-color-border)] px-5 py-4",
          accent === "a"
            ? "bg-[var(--sg-color-primary-soft)]/50"
            : "bg-[var(--sg-color-danger-soft)]/35",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ProductLogo name={name} logo={logo} size="md" />
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-[var(--sg-color-text)]">
                {name}
              </h3>
              {card.starting ? (
                <p className="mt-0.5 text-sm text-[var(--sg-color-text-muted)]">
                  Starting from{" "}
                  <span className="font-semibold text-[var(--sg-color-text)]">
                    {card.starting}
                  </span>
                </p>
              ) : (
                <p className="mt-0.5 text-sm text-[var(--sg-color-text-muted)]">
                  Starting price not evidenced
                </p>
              )}
            </div>
          </div>
          {card.freePlan ? (
            <Badge variant={freeAvailable ? "success" : "neutral"}>
              {card.freePlan}
            </Badge>
          ) : null}
        </div>
        {card.trial ? (
          <p className="mt-3 text-xs font-medium text-[var(--sg-color-primary)]">
            {card.trial}
          </p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-5 py-4">
        {card.plans.length > 0 ? (
          <ul className="space-y-3">
            {card.plans.map((plan) => (
              <li
                key={plan.name}
                className={cn(
                  "rounded-[var(--sg-radius-md)] border px-3 py-2.5",
                  plan.highlighted
                    ? "border-[var(--sg-color-primary)]/40 bg-[var(--sg-color-primary-soft)]/40"
                    : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]",
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-[var(--sg-color-text)]">
                    {plan.name}
                    {plan.highlighted ? (
                      <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
                        Popular
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      plan.isFree || plan.priceLabel.startsWith("$0")
                        ? "text-[var(--sg-color-success)]"
                        : "text-[var(--sg-color-primary)]",
                    )}
                  >
                    {plan.priceLabel}
                  </span>
                </div>
                {plan.highlights.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {plan.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-1.5 text-xs text-[var(--sg-color-text-muted)]"
                      >
                        <Check
                          className="mt-0.5 size-3 shrink-0 text-[var(--sg-color-success)]"
                          aria-hidden
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href={href}
          className="mt-5 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          View full {name} pricing →
        </Link>
      </div>
    </Card>
  );
}

function TeamCostEstimator({ model }: { model: ComparisonPageModel }) {
  const unitA = model.pricing.unitA;
  const unitB = model.pricing.unitB;
  if (!unitA && !unitB) return null;

  const [seats, setSeats] = useState(model.pricing.defaultSeats || 15);

  const estimate = useMemo(() => {
    const monthly = (unit?: {
      perUserMonthly: number;
      currency: CurrencyCode;
    }) => {
      if (!unit) return null;
      return formatMoney(fromMajor(unit.perUserMonthly * seats, unit.currency));
    };
    const a = unitA ? unitA.perUserMonthly * seats : null;
    const b = unitB ? unitB.perUserMonthly * seats : null;
    let diffLabel: string | null = null;
    if (a != null && b != null && unitA) {
      const diff = a - b;
      const abs = formatMoney(fromMajor(Math.abs(diff), unitA.currency));
      if (Math.abs(diff) < 0.01) diffLabel = "Similar estimated cost";
      else if (diff > 0) {
        diffLabel = `+${abs}/mo — ${model.productA.name} costs more`;
      } else {
        diffLabel = `+${abs}/mo — ${model.productB.name} costs more`;
      }
    }
    return {
      a: monthly(unitA),
      b: monthly(unitB),
      diffLabel,
    };
  }, [seats, unitA, unitB, model.productA.name, model.productB.name]);

  return (
    <Card className="overflow-hidden p-0 ring-1 ring-[var(--sg-color-primary)]/15">
      <div className="border-b border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] px-5 py-4">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
          Estimate your team cost
        </h3>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Monthly estimate from verified per-seat list pricing. Confirm on the
          vendor site before purchasing.
        </p>
      </div>

      <div className="px-5 py-5">
        <label className="block text-sm">
          <span className="font-medium text-[var(--sg-color-text)]">
            Number of users
          </span>
          <div className="mt-1.5 flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
              onClick={() => setSeats((s) => Math.max(1, s - 1))}
              aria-label="Decrease seats"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={500}
              value={seats}
              onChange={(e) =>
                setSeats(Math.max(1, Number.parseInt(e.target.value, 10) || 1))
              }
              className="w-24 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 text-center text-base font-semibold tabular-nums text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)]"
            />
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)] shadow-[var(--sg-shadow-sm)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
              onClick={() => setSeats((s) => Math.min(500, s + 1))}
              aria-label="Increase seats"
            >
              +
            </button>
          </div>
        </label>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {unitA ? (
            <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/45 px-4 py-3">
              <div className="flex items-center gap-2">
                <ProductLogo
                  name={model.productA.name}
                  logo={model.productA.logo}
                  size="sm"
                />
                <p className="text-sm font-medium text-[var(--sg-color-text)]">
                  {model.productA.name}
                  {unitA.planName ? (
                    <span className="font-normal text-[var(--sg-color-text-muted)]">
                      {" "}
                      · {unitA.planName}
                    </span>
                  ) : null}
                </p>
              </div>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-primary)]">
                {estimate.a}
                <span className="ml-1 text-sm font-medium text-[var(--sg-color-text-muted)]">
                  /mo
                </span>
              </p>
            </div>
          ) : null}
          {unitB ? (
            <div className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-danger)]/20 bg-[var(--sg-color-danger-soft)]/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <ProductLogo
                  name={model.productB.name}
                  logo={model.productB.logo}
                  size="sm"
                />
                <p className="text-sm font-medium text-[var(--sg-color-text)]">
                  {model.productB.name}
                  {unitB.planName ? (
                    <span className="font-normal text-[var(--sg-color-text-muted)]">
                      {" "}
                      · {unitB.planName}
                    </span>
                  ) : null}
                </p>
              </div>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-text)]">
                {estimate.b}
                <span className="ml-1 text-sm font-medium text-[var(--sg-color-text-muted)]">
                  /mo
                </span>
              </p>
            </div>
          ) : null}
        </div>

        {estimate.diffLabel ? (
          <p
            className={cn(
              "mt-4 rounded-[var(--sg-radius-md)] px-3 py-2 text-sm font-medium",
              estimate.diffLabel.includes("Similar")
                ? "bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text)]"
                : "bg-[var(--sg-color-warning-soft)] text-[var(--sg-color-warning)]",
            )}
          >
            {estimate.diffLabel}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ButtonLink href={model.costCalculatorHref} variant="outline">
            {model.categorySlug === "hr" ? "HR pricing guide →" : "Open cost calculator →"}
          </ButtonLink>
          <p className="text-xs text-[var(--sg-color-text-muted)]">
            Verified monthly unit prices
            {model.pricing.verifiedAt
              ? ` · ${model.pricing.verifiedAt}`
              : ""}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function ComparisonPricingTab({ model }: Props) {
  const pricing = model.pricing;

  return (
    <div className="space-y-8">
      <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/15 bg-[var(--sg-color-surface-tint)] px-5 py-5 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          {model.productA.name} vs {model.productB.name} pricing
        </h2>
        {pricing.notes ? (
          <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
            {pricing.notes}
          </p>
        ) : (
          <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
            Compare plans, free tiers, and estimated team cost from verified
            list pricing.
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 shadow-[var(--sg-shadow-sm)]">
            <ProductLogo
              name={model.productA.name}
              logo={model.productA.logo}
              size="sm"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {model.productA.name}
              </p>
              <p className="text-base font-semibold text-[var(--sg-color-primary)]">
                {pricing.cardA.starting
                  ? `From ${pricing.cardA.starting}`
                  : "See plans"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 shadow-[var(--sg-shadow-sm)]">
            <ProductLogo
              name={model.productB.name}
              logo={model.productB.logo}
              size="sm"
            />
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {model.productB.name}
              </p>
              <p className="text-base font-semibold text-[var(--sg-color-text)]">
                {pricing.cardB.starting
                  ? `From ${pricing.cardB.starting}`
                  : "See plans"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <PricingCard
          name={model.productA.name}
          logo={model.productA.logo}
          href={model.productA.href}
          card={pricing.cardA}
          accent="a"
        />
        <PricingCard
          name={model.productB.name}
          logo={model.productB.logo}
          href={model.productB.href}
          card={pricing.cardB}
          accent="b"
        />
      </div>

      <TeamCostEstimator model={model} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Prices in USD",
            body: "Shown per user / month from verified list pricing.",
          },
          {
            title: "Plans can change",
            body: "Confirm live vendor rates before purchasing.",
          },
          {
            title: "Add-ons may apply",
            body: "Calling, SMS, or usage fees can add cost.",
          },
          {
            title: "Independence",
            body: "Affiliate status never changes pricing outcomes.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-3 shadow-[var(--sg-shadow-sm)]"
          >
            <div className="flex items-start gap-2">
              <Info
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-primary)]"
                aria-hidden
              />
              <div>
                <p className="text-sm font-semibold text-[var(--sg-color-text)]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
