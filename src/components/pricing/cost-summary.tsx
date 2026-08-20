import { formatMoney, type ProductCostEstimate } from "@/domain";
import {
  deriveCostRangeSummary,
  type CostRangeSummary,
} from "@/services/pricing";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Props = {
  estimates: ProductCostEstimate[];
  users: number;
  requiredCapabilityCount: number;
  /** e.g. "CRM" or "sales intelligence" — defaults to CRM for back-compat. */
  productNoun?: string;
  productNounPlural?: string;
  className?: string;
};

function KpiCard({
  label,
  estimate,
  tone,
}: {
  label: string;
  estimate: CostRangeSummary["lowest"];
  tone: "success" | "primary" | "muted";
}) {
  const border =
    tone === "success"
      ? "border-[var(--sg-color-success)]/30 bg-[var(--sg-color-success-soft)]/40"
      : tone === "primary"
        ? "border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/50"
        : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]";

  return (
    <div
      className={cn(
        "rounded-[var(--sg-radius-lg)] border p-4 shadow-[var(--sg-shadow-sm)]",
        border,
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
        {formatMoney(estimate.monthlyEquivalent)}
        <span className="text-sm font-normal text-[var(--sg-color-text-muted)]">
          /mo
        </span>
      </p>
      <p className="mt-1 text-sm text-[var(--sg-color-text)]">
        {estimate.productName}
        {estimate.recommendedPlan ? (
          <span className="text-[var(--sg-color-text-muted)]">
            {" "}
            · {estimate.recommendedPlan.name}
          </span>
        ) : null}
      </p>
    </div>
  );
}

/**
 * Results header: range + three KPI cards from calculations.
 */
export function CostSummary({
  estimates,
  users,
  requiredCapabilityCount,
  productNoun = "CRM",
  productNounPlural = "CRM products",
  className,
}: Props) {
  const range = deriveCostRangeSummary(estimates);
  if (!range) {
    return (
      <Card className={cn("p-5 sm:p-8", className)}>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Your {productNoun} cost estimate
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          No calculable list prices matched this configuration yet. Adjust seats
          or requirements, or review products marked as not publicly priced.
        </p>
      </Card>
    );
  }

  const verifiedDates = range.sorted
    .map((e) => e.pricingVerifiedAt)
    .filter((d): d is string => Boolean(d))
    .sort();
  const latestVerified = verifiedDates[verifiedDates.length - 1];
  const verifiedLabel = latestVerified
    ? new Date(latestVerified).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-8",
        className,
      )}
      aria-labelledby="cost-summary-heading"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
        Your {productNoun} cost estimate
      </p>
      <h2
        id="cost-summary-heading"
        className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
      >
        For a {users}-person team
      </h2>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-navy)] sm:text-4xl">
        {formatMoney(range.lowest.monthlyEquivalent)}
        <span className="mx-2 text-[var(--sg-color-text-muted)]">–</span>
        {formatMoney(range.highest.monthlyEquivalent)}
        <span className="ml-2 text-base font-normal text-[var(--sg-color-text-muted)]">
          / month
        </span>
      </p>
      <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
        Based on {range.sorted.length} catalogue {productNounPlural} with
        calculable public pricing
        {range.currency ? ` · ${range.currency}` : ""}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <KpiCard
          label="Lowest calculated"
          estimate={range.lowest}
          tone="success"
        />
        <KpiCard
          label="Mid-range (catalogue midpoint)"
          estimate={range.midpoint}
          tone="primary"
        />
        <KpiCard
          label="Highest calculated"
          estimate={range.highest}
          tone="muted"
        />
      </div>

      {range.interquartile ? (
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          Most calculable options in this set fall between{" "}
          <span className="font-medium text-[var(--sg-color-text)]">
            {formatMoney(range.interquartile.low)}
          </span>{" "}
          and{" "}
          <span className="font-medium text-[var(--sg-color-text)]">
            {formatMoney(range.interquartile.high)}
          </span>{" "}
          per month (25th–75th of results — not a market average).
        </p>
      ) : null}

      <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--sg-color-border)] pt-4 text-xs text-[var(--sg-color-text-muted)]">
        {verifiedLabel ? (
          <div>
            <dt className="inline">Pricing checked: </dt>
            <dd className="inline font-medium text-[var(--sg-color-text)]">
              {verifiedLabel}
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="inline">Currency: </dt>
          <dd className="inline font-medium text-[var(--sg-color-text)]">
            {range.currency}
          </dd>
        </div>
        <div>
          <dt className="inline">Requirements: </dt>
          <dd className="inline font-medium text-[var(--sg-color-text)]">
            {requiredCapabilityCount}
          </dd>
        </div>
      </dl>
    </section>
  );
}
