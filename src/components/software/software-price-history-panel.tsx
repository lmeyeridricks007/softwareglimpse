import Link from "next/link";
import type { ProductPriceHistorySummary } from "@/services/pricing-history";

type Props = {
  summary: ProductPriceHistorySummary;
  productName: string;
};

function money(n: number | null, currency: string): string {
  if (n == null) return "Contact sales";
  const prefix = currency === "USD" ? "$" : `${currency} `;
  return `${prefix}${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

function pct(n: number | null): string {
  if (n == null) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}%`;
}

/**
 * Product price history — only renders when ≥2 observations exist for a series.
 */
export function SoftwarePriceHistoryPanel({ summary, productName }: Props) {
  if (!summary.hasMeaningfulHistory) return null;

  const rows = summary.series.filter((s) => s.observationCount >= 2 && s.change);

  if (rows.length === 0) return null;

  return (
    <section
      className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-5"
      aria-labelledby="price-history-heading"
    >
      <h3
        id="price-history-heading"
        className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]"
      >
        Price history
      </h3>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Verified list-price observations for {productName}. Current catalogue
        pricing is separate from this timeline.
      </p>

      <ul className="mt-4 space-y-3">
        {rows.map((row) => {
          const change = row.change!;
          return (
            <li
              key={row.seriesKey}
              className="grid gap-1 border-t border-[var(--sg-color-border)] pt-3 text-sm first:border-t-0 first:pt-0 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-medium text-[var(--sg-color-text)]">
                  {row.planName ?? "Starting price"}{" "}
                  <span className="font-normal text-[var(--sg-color-text-muted)]">
                    ({row.billingBasis}, {row.billingPeriod})
                  </span>
                </p>
                <p className="mt-1 text-[var(--sg-color-text-muted)]">
                  Current {money(change.newPrice, change.currency)} · Previous{" "}
                  {money(change.previousPrice, change.currency)} · Observed{" "}
                  {change.changeDate}
                </p>
              </div>
              <p
                className={
                  change.absoluteChange != null && change.absoluteChange > 0
                    ? "font-semibold text-[var(--sg-color-danger, #b42318)]"
                    : change.absoluteChange != null && change.absoluteChange < 0
                      ? "font-semibold text-[var(--sg-color-success, #067647)]"
                      : "font-semibold text-[var(--sg-color-text-muted)]"
                }
              >
                {pct(change.percentageChange)}
              </p>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs text-[var(--sg-color-text-muted)]">
        Source: SoftwareGlimpse price observations ·{" "}
        <Link
          href="/research/crm-pricing-history/"
          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
        >
          Category research
        </Link>
      </p>
    </section>
  );
}
