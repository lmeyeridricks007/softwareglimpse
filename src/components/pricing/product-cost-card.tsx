"use client";

import Link from "next/link";
import { Check, TriangleAlert } from "lucide-react";
import { formatMoney, type ProductCostEstimate } from "@/domain";
import { track } from "@/analytics";
import type { FeatureCoverageSummary } from "@/services/pricing";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { PricingBreakdown } from "./pricing-breakdown";
import { PricingConfidenceBadge } from "./pricing-confidence-badge";
import { PricingFreshness } from "./pricing-freshness";
import { cn } from "@/lib/cn";

type Props = {
  estimate: ProductCostEstimate;
  fixture?: boolean;
  logo?: { src: string; alt: string };
  coverage?: FeatureCoverageSummary | null;
  isLowestCost?: boolean;
  hasFreePlan?: boolean;
  hasFreeTrial?: boolean;
  className?: string;
};

function deriveBadges(opts: {
  estimate: ProductCostEstimate;
  isLowestCost?: boolean;
  hasFreePlan?: boolean;
  hasFreeTrial?: boolean;
}): Array<{ label: string; variant: "success" | "primary" | "warning" | "neutral" }> {
  const { estimate, isLowestCost, hasFreePlan, hasFreeTrial } = opts;
  const badges: Array<{
    label: string;
    variant: "success" | "primary" | "warning" | "neutral";
  }> = [];

  if (isLowestCost && (estimate.status === "calculated" || estimate.status === "partial")) {
    badges.push({ label: "Lowest cost", variant: "success" });
  }
  if (estimate.monthlyCashCost) {
    badges.push({ label: "Monthly billing", variant: "primary" });
  } else if (estimate.annualCost && estimate.monthlyEquivalent) {
    badges.push({ label: "Annual billing", variant: "primary" });
  }
  if (hasFreePlan) badges.push({ label: "Free plan", variant: "neutral" });
  if (hasFreeTrial) badges.push({ label: "Free trial", variant: "neutral" });
  if (estimate.status === "partial") {
    badges.push({ label: "Partial estimate", variant: "warning" });
  }
  if (estimate.status === "custom-quote") {
    badges.push({ label: "Custom pricing", variant: "warning" });
  }
  if (estimate.status === "insufficient-data" || estimate.status === "no-suitable-plan") {
    badges.push({ label: "Pricing incomplete", variant: "warning" });
  }
  if (estimate.confidence === "high") {
    badges.push({ label: "High confidence", variant: "success" });
  } else if (estimate.confidence === "medium") {
    badges.push({ label: "Medium confidence", variant: "warning" });
  }

  return badges.slice(0, 4);
}

/**
 * Compact decision card for a single CRM cost estimate.
 */
export function ProductCostCard({
  estimate,
  fixture,
  logo,
  coverage,
  isLowestCost,
  hasFreePlan,
  hasFreeTrial,
  className,
}: Props) {
  const hasMoney =
    estimate.status === "calculated" || estimate.status === "partial";
  const badges = deriveBadges({
    estimate,
    isLowestCost,
    hasFreePlan,
    hasFreeTrial,
  });

  const seatComponent = estimate.components.find((c) => c.kind === "seat");
  const baseComponent = estimate.components.find((c) => c.kind === "base");
  const addonComponents = estimate.components.filter((c) => c.kind === "addon");

  return (
    <article
      className={cn(
        "rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)] sm:p-5",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ProductLogo name={estimate.productName} logo={logo} size="md" />
          <div className="min-w-0">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
              {estimate.productName}
            </h3>
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              {estimate.recommendedPlan?.name ??
                (hasMoney ? "Selected plan" : "No calculable plan")}
            </p>
          </div>
        </div>
        <PricingConfidenceBadge confidence={estimate.confidence} compact />
      </header>

      {badges.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <li key={b.label}>
              <Badge variant={b.variant}>{b.label}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {hasMoney ? (
        <div className="mt-4">
          {estimate.monthlyEquivalent ? (
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
              {formatMoney(estimate.monthlyEquivalent)}
              <span className="text-sm font-normal text-[var(--sg-color-text-muted)]">
                {" "}
                / month
              </span>
            </p>
          ) : null}
          {estimate.annualCost ? (
            <p className="mt-0.5 text-sm tabular-nums text-[var(--sg-color-text-muted)]">
              {formatMoney(estimate.annualCost)} / year
              {!estimate.monthlyCashCost && estimate.monthlyEquivalent
                ? " cash (annual billing)"
                : ""}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-warning)]/30 bg-[var(--sg-color-warning-soft)]/50 px-3 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-warning)]">
            Price not calculable
          </p>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            {estimate.explanation ||
              (estimate.status === "custom-quote"
                ? "Public pricing information is insufficient to calculate this configuration — contact the vendor for a quote."
                : estimate.status === "no-suitable-plan"
                  ? "No catalogue plan covers the required capabilities for this product."
                  : "Public pricing information is insufficient to calculate this configuration.")}
          </p>
        </div>
      )}

      {hasMoney && estimate.components.length > 0 ? (
        <div className="mt-4 border-t border-[var(--sg-color-border)] pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Why this price
          </p>
          <ul className="mt-2 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
            {seatComponent ? (
              <li className="flex justify-between gap-2">
                <span>{seatComponent.label}</span>
                <span className="tabular-nums font-medium text-[var(--sg-color-text)]">
                  {formatMoney(seatComponent.money)}
                </span>
              </li>
            ) : null}
            {baseComponent ? (
              <li className="flex justify-between gap-2">
                <span>{baseComponent.label}</span>
                <span className="tabular-nums font-medium text-[var(--sg-color-text)]">
                  {formatMoney(baseComponent.money)}
                </span>
              </li>
            ) : null}
            {addonComponents.length > 0 ? (
              addonComponents.map((a) => (
                <li key={a.id} className="flex justify-between gap-2">
                  <span>{a.label}</span>
                  <span className="tabular-nums font-medium text-[var(--sg-color-text)]">
                    {formatMoney(a.money)}
                  </span>
                </li>
              ))
            ) : seatComponent || baseComponent ? (
              <li>Required add-ons: none in catalogue rules</li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <div className="mt-4 border-t border-[var(--sg-color-border)] pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
          What to know
        </p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {coverage ? (
            <li className="flex gap-2 text-[var(--sg-color-text-muted)]">
              <Check
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              Matches {coverage.matched} of {coverage.total} required capabilities
              {coverage.unknown > 0
                ? ` (${coverage.unknown} unknown in research)`
                : ""}
            </li>
          ) : null}
          {estimate.monthlyCashCost ? (
            <li className="flex gap-2 text-[var(--sg-color-text-muted)]">
              <Check
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              Monthly billing available in verified pricing
            </li>
          ) : null}
          {hasFreeTrial ? (
            <li className="flex gap-2 text-[var(--sg-color-text-muted)]">
              <Check
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-success)]"
                aria-hidden
              />
              Free trial (does not change ongoing calculated cost)
            </li>
          ) : null}
          {estimate.warnings.slice(0, 2).map((w) => (
            <li
              key={w}
              className="flex gap-2 text-[var(--sg-color-text-muted)]"
            >
              <TriangleAlert
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
                aria-hidden
              />
              {w}
            </li>
          ))}
          {estimate.assumptions.slice(0, 1).map((a) => (
            <li
              key={a}
              className="flex gap-2 text-[var(--sg-color-text-muted)]"
            >
              <TriangleAlert
                className="mt-0.5 size-4 shrink-0 text-[var(--sg-color-warning)]"
                aria-hidden
              />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {hasMoney ? (
        <PricingBreakdown
          className="mt-4 border-t border-[var(--sg-color-border)] pt-3"
          components={estimate.components}
          total={estimate.monthlyEquivalent}
          title="Cost breakdown"
        />
      ) : null}

      <PricingFreshness
        className="mt-4 text-xs text-[var(--sg-color-text-muted)]"
        verifiedAt={estimate.pricingVerifiedAt}
        fixture={fixture}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/software/${estimate.productSlug}/`}
          onClick={() =>
            track({
              name: "crm_cost_product_clicked",
              properties: {
                slug: estimate.productSlug,
                location: "result-card",
              },
            })
          }
          className="inline-flex min-h-10 items-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-3.5 text-sm font-medium text-[var(--sg-color-primary-fg)]"
        >
          View product
        </Link>
        {estimate.status !== "insufficient-data" ? (
          <Link
            href={`/pricing/${estimate.productSlug}/`}
            className="inline-flex min-h-10 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3.5 text-sm font-medium"
          >
            View pricing
          </Link>
        ) : (
          <Link
            href={`/pricing/${estimate.productSlug}/`}
            className="inline-flex min-h-10 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3.5 text-sm font-medium"
          >
            View pricing details
          </Link>
        )}
        <Link
          href="/compare/"
          className="inline-flex min-h-10 items-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3.5 text-sm font-medium"
        >
          Compare
        </Link>
      </div>
    </article>
  );
}

/** Back-compat alias. */
export function CostResultCard(
  props: Omit<
    Props,
    "logo" | "coverage" | "isLowestCost" | "hasFreePlan" | "hasFreeTrial"
  > & {
    showBothBilling?: boolean;
  },
) {
  const { showBothBilling, ...rest } = props;
  void showBothBilling;
  return <ProductCostCard {...rest} />;
}
