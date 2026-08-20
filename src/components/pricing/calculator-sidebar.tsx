import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { formatMoney, type ProductCostEstimate } from "@/domain";
import {
  deriveCostRangeSummary,
  positionInRangeLabel,
} from "@/services/pricing";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CostRange } from "./cost-range";
import { cn } from "@/lib/cn";

type EstimateCardProps = {
  estimates: ProductCostEstimate[];
  users: number;
  requiredCapabilityCount: number;
  billingLabel: string;
  logos?: Record<string, { src: string; alt: string } | undefined>;
  onViewResults?: () => void;
  onCompare?: () => void;
  compareLabel?: string;
  compareHref?: string;
  className?: string;
};

/**
 * Sticky live estimate summary from product costs only.
 */
export function CalculatorEstimateCard({
  estimates,
  users,
  requiredCapabilityCount,
  billingLabel,
  logos,
  onViewResults,
  compareLabel = "Compare matching products",
  compareHref = "/compare/",
  className,
}: EstimateCardProps) {
  const range = deriveCostRangeSummary(estimates);
  const lowest = range?.lowest;

  return (
    <Card className={cn(className)} aria-labelledby="estimate-heading">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="estimate-heading"
          className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
        >
          Your current estimate
        </h2>
        {lowest ? <Badge variant="success">Live</Badge> : null}
      </div>

      {!lowest || !range ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Enter seats to preview verified list prices. Estimates appear when
          public pricing covers your requirements.
        </p>
      ) : (
        <>
          <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
            {formatMoney(lowest.monthlyEquivalent)}
            <span className="text-base font-normal text-[var(--sg-color-text-muted)]">
              {" "}
              / month
            </span>
          </p>
          {lowest.annualCost ? (
            <p className="mt-1 text-sm tabular-nums text-[var(--sg-color-text-muted)]">
              {formatMoney(lowest.annualCost)} / year
            </p>
          ) : null}

          <dl className="mt-4 space-y-1 border-t border-[var(--sg-color-border)] pt-3 text-xs text-[var(--sg-color-text-muted)]">
            <div className="flex justify-between gap-2">
              <dt>Based on</dt>
              <dd className="font-medium text-[var(--sg-color-text)]">
                {users} users
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Capabilities</dt>
              <dd className="font-medium text-[var(--sg-color-text)]">
                {requiredCapabilityCount} required
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>Billing</dt>
              <dd className="font-medium capitalize text-[var(--sg-color-text)]">
                {billingLabel}
              </dd>
            </div>
          </dl>

          <div className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Best-priced matching option
            </p>
            <div className="mt-2 flex items-center gap-2">
              <ProductLogo
                name={lowest.productName}
                logo={logos?.[lowest.productSlug]}
                size="sm"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
                  {lowest.productName}
                  {lowest.recommendedPlan
                    ? ` ${lowest.recommendedPlan.name}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Market range (catalogue)
            </p>
            <p className="mt-1 text-[10px] text-[var(--sg-color-text-muted)]">
              Mid-range is the catalogue midpoint — not a statistical market
              average.
            </p>
            <CostRange
              className="mt-3"
              low={range.lowest.monthlyEquivalent}
              high={range.highest.monthlyEquivalent}
              current={lowest.monthlyEquivalent}
              markers={[
                {
                  label: "Lowest",
                  money: range.lowest.monthlyEquivalent,
                  tone: "success",
                },
                {
                  label: "Mid",
                  money: range.midpoint.monthlyEquivalent,
                  tone: "primary",
                },
                {
                  label: "Highest",
                  money: range.highest.monthlyEquivalent,
                  tone: "muted",
                },
              ]}
              caption={positionInRangeLabel(
                lowest.monthlyEquivalent.amountMinor,
                range,
              )}
            />
          </div>
        </>
      )}

      <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
        Estimates from verified public pricing before tax. Implementation,
        training, and migration are not invented when vendors do not publish
        them.
      </p>

      {onViewResults ? (
        <button
          type="button"
          onClick={onViewResults}
          disabled={!lowest}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)] text-sm font-medium text-[var(--sg-color-primary)] hover:bg-[var(--sg-color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          View detailed breakdown
          <ArrowRight className="size-4" aria-hidden />
        </button>
      ) : null}

      <Link
        href={compareHref}
        className="mt-2 inline-flex h-10 w-full items-center justify-center gap-1 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
      >
        {compareLabel}
      </Link>
    </Card>
  );
}

export function CalculatorGuidesCard({
  items,
  className,
}: {
  items: Array<{ href: string; label: string }>;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <Card className={cn(className)} aria-labelledby="calc-guides-heading">
      <h2
        id="calc-guides-heading"
        className="text-sm font-semibold text-[var(--sg-color-text)]"
      >
        Popular guides
      </h2>
      <ul className="mt-3 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-2 rounded-[var(--sg-radius-md)] px-1 py-2 text-sm text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-primary)]"
            >
              <span>{item.label}</span>
              <ChevronRight className="size-4 shrink-0" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Compact sticky bar for mobile. */
export function MobileEstimateBar({
  estimates,
  onViewResults,
  resultsHref = "#cost-calculator-results",
}: {
  estimates: ProductCostEstimate[];
  onViewResults?: () => void;
  resultsHref?: string;
}) {
  const range = deriveCostRangeSummary(estimates);
  if (!range) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 px-4 py-3 shadow-[var(--sg-shadow-md)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <p className="text-sm text-[var(--sg-color-text-muted)]">
          Estimated:{" "}
          <span className="font-semibold tabular-nums text-[var(--sg-color-navy)]">
            {formatMoney(range.lowest.monthlyEquivalent)}/mo
          </span>
        </p>
        {onViewResults ? (
          <button
            type="button"
            onClick={onViewResults}
            className="inline-flex h-10 items-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 text-sm font-medium text-[var(--sg-color-primary-fg)]"
          >
            View results
          </button>
        ) : (
          <a
            href={resultsHref}
            className="inline-flex h-10 items-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary)] px-4 text-sm font-medium text-[var(--sg-color-primary-fg)]"
          >
            View results
          </a>
        )}
      </div>
    </div>
  );
}
