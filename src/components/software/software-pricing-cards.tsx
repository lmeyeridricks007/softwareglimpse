"use client";

import { useMemo, useState } from "react";
import type { ResolvedAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import { AffiliateCta } from "@/components/affiliate/affiliate-cta";
import type { CurrencyCode, Pricing } from "@/domain";
import { formatMoney, fromMajor } from "@/domain";
import { resolvePlanDisplayPrice } from "@/services/pricing";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  pricing: Pricing;
  productName: string;
  affiliateLink?: ResolvedAffiliateLink | null;
  pricingPageHref?: string | null;
  intro?: React.ReactNode;
  notesSlot?: React.ReactNode;
  teamCostSlot?: React.ReactNode;
  className?: string;
};

function hasAnnualAndMonthlyRules(pricing: Pricing): boolean {
  return (pricing.plans ?? []).some((plan) => {
    const intervals = new Set(
      plan.rules.flatMap((rule) =>
        "interval" in rule && typeof rule.interval === "string"
          ? [rule.interval]
          : [],
      ),
    );
    return intervals.has("year") && intervals.has("month");
  });
}

export function SoftwarePricingCards({
  pricing,
  productName,
  affiliateLink,
  pricingPageHref,
  intro,
  notesSlot,
  teamCostSlot,
  className,
}: Props) {
  const plans = pricing.plans ?? [];
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  const hasPlans = plans.length > 0;
  const showBillingToggle = useMemo(
    () => hasAnnualAndMonthlyRules(pricing),
    [pricing],
  );
  const [annual, setAnnual] = useState(true);

  if (!hasPlans && pricing.startingPriceMonthly == null && !pricing.notes) {
    return null;
  }

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="pricing-heading"
          className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
        >
          Pricing
        </h2>
        {showBillingToggle ? (
          <label className="inline-flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)]">
            <span>{annual ? "Billed annually" : "Billed monthly"}</span>
            <button
              type="button"
              role="switch"
              aria-checked={annual}
              aria-label="Toggle annual versus monthly list prices"
              onClick={() => setAnnual((v) => !v)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                annual
                  ? "bg-[var(--sg-color-primary)]"
                  : "bg-[var(--sg-color-border-strong)]",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                  annual ? "left-5" : "left-0.5",
                )}
              />
            </button>
          </label>
        ) : null}
      </div>
      {intro ? (
        <div className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          {intro}
        </div>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
          {pricing.notes ||
            `Pricing model: ${pricing.model}${
              pricing.startingPriceMonthly != null
                ? ` · From ${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/unit`
                : ""
            }`}
        </p>
      )}

      {hasPlans ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => {
            const priced = resolvePlanDisplayPrice(plan, currency, annual);
            const { price, unit } = {
              price: priced.priceLabel,
              unit: priced.unitLabel,
            };
            const highlighted = Boolean(plan.highlighted);
            const ctaLabel =
              priced.ctaLabel ??
              (affiliateLink ? `Try ${productName}` : "Pricing details");
            return (
              <li key={plan.id || plan.slug}>
                <Card
                  variant={highlighted ? "highlighted" : "default"}
                  className={cn(
                    "flex h-full flex-col",
                    highlighted && "border-[var(--sg-color-primary)]",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-[var(--sg-color-text)]">
                      {plan.name}
                    </h3>
                    {highlighted ? (
                      <Badge variant="primary">Most popular</Badge>
                    ) : null}
                  </div>
                  <p className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums leading-tight text-[var(--sg-color-text)]">
                    {price}
                  </p>
                  <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                    {unit}
                  </p>
                  {plan.description ? (
                    <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
                      {plan.description}
                    </p>
                  ) : null}
                  {plan.limits && Object.keys(plan.limits).length > 0 ? (
                    <ul className="mt-4 flex-1 space-y-1.5 text-sm text-[var(--sg-color-text-muted)]">
                      {Object.entries(plan.limits)
                        .slice(0, 5)
                        .map(([key, value]) => (
                          <li key={key}>
                            <span className="text-[var(--sg-color-text)]">
                              {key.replace(/-/g, " ")}:
                            </span>{" "}
                            {String(value)}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <div className="mt-5">
                    {affiliateLink ? (
                      <AffiliateCta
                        label={ctaLabel}
                        link={affiliateLink}
                        showDisclosure={false}
                        className={cn(
                          "w-full",
                          !highlighted &&
                            "border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:bg-[var(--sg-color-surface)] hover:text-[var(--sg-color-primary)]",
                        )}
                      />
                    ) : pricingPageHref ? (
                      <ButtonLink
                        href={pricingPageHref}
                        variant="outline"
                        className="w-full"
                      >
                        {ctaLabel}
                      </ButtonLink>
                    ) : null}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : null}

      {teamCostSlot ? <div className="mt-6">{teamCostSlot}</div> : null}
      {notesSlot}
    </section>
  );
}
