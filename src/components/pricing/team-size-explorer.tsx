"use client";

import { useMemo, useState } from "react";
import {
  crmRequirementsFromCalculatorInput,
  formatMoney,
  type BillingPreference,
  type CurrencyCode,
} from "@/domain";
import {
  compareProductCosts,
  type PricingSnapshot,
} from "@/services/pricing";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";

const SEAT_PRESETS = [5, 10, 25, 50, 100] as const;

type Props = {
  snapshots: PricingSnapshot[];
  requiredFeatureSlugs: string[];
  billingPreference: BillingPreference;
  preferredSlugs?: string[];
  currentUsers: number;
  productNoun?: string;
  className?: string;
};

type SeriesPoint = {
  seats: number;
  amountMinor: number | null;
  currency?: CurrencyCode;
  planSlug?: string;
  planName?: string;
};

type Series = {
  productSlug: string;
  productName: string;
  logo?: { src: string; alt: string };
  points: SeriesPoint[];
  planChanges: Array<{ seats: number; from: string; to: string }>;
};

const SERIES_COLORS = [
  "var(--sg-color-primary)",
  "var(--sg-color-success)",
  "var(--sg-color-navy)",
  "var(--sg-color-warning)",
];

function compactMoney(amountMinor: number, currency: CurrencyCode) {
  const major = amountMinor / 100;
  if (major >= 1000) {
    const k = major / 1000;
    const rounded = k >= 10 ? Math.round(k) : Math.round(k * 10) / 10;
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "";
    return symbol ? `${symbol}${rounded}k` : `${rounded}k ${currency}`;
  }
  return formatMoney({ amountMinor, currency });
}

/**
 * Recalculates costs at preset team sizes using the existing pricing engine.
 * Does not extrapolate when a seat count cannot be calculated.
 */
export function TeamSizeExplorer({
  snapshots,
  requiredFeatureSlugs,
  billingPreference,
  preferredSlugs = [],
  currentUsers,
  productNoun = "CRM",
  className,
}: Props) {
  const initialSeats = SEAT_PRESETS.includes(
    currentUsers as (typeof SEAT_PRESETS)[number],
  )
    ? currentUsers
    : SEAT_PRESETS.reduce((best, n) =>
        Math.abs(n - currentUsers) < Math.abs(best - currentUsers) ? n : best,
      );
  const [focusSeats, setFocusSeats] = useState(initialSeats);

  const series = useMemo(() => {
    const bySeats = SEAT_PRESETS.map((seats) => {
      const requirements = crmRequirementsFromCalculatorInput({
        crmUsers: seats,
        requiredFeatureSlugs,
        billingPreference,
      });
      return {
        seats,
        results: compareProductCosts(snapshots, requirements, {
          sortMode: "lowest-cost",
        }).results,
      };
    });

    const slugOrder =
      preferredSlugs.length > 0
        ? preferredSlugs
        : (bySeats[0]?.results
            .filter(
              (r) =>
                (r.status === "calculated" || r.status === "partial") &&
                r.monthlyEquivalent,
            )
            .map((r) => r.productSlug) ?? []);

    const limited = slugOrder.slice(0, 4);
    const built: Series[] = [];

    for (const slug of limited) {
      const snap = snapshots.find((s) => s.productSlug === slug);
      const points: SeriesPoint[] = [];

      for (const bucket of bySeats) {
        const row = bucket.results.find((r) => r.productSlug === slug);
        const calculable =
          row &&
          (row.status === "calculated" || row.status === "partial") &&
          row.monthlyEquivalent
            ? row
            : null;
        points.push({
          seats: bucket.seats,
          amountMinor: calculable?.monthlyEquivalent?.amountMinor ?? null,
          currency: calculable?.monthlyEquivalent?.currency,
          planSlug: calculable?.recommendedPlan?.slug,
          planName: calculable?.recommendedPlan?.name,
        });
      }

      const planChanges: Series["planChanges"] = [];
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]!;
        const cur = points[i]!;
        if (
          prev.planSlug &&
          cur.planSlug &&
          prev.planSlug !== cur.planSlug &&
          prev.planName &&
          cur.planName
        ) {
          planChanges.push({
            seats: cur.seats,
            from: prev.planName,
            to: cur.planName,
          });
        }
      }

      if (points.some((p) => p.amountMinor != null)) {
        built.push({
          productSlug: slug,
          productName:
            snap?.name ??
            bySeats[0]?.results.find((r) => r.productSlug === slug)
              ?.productName ??
            slug,
          logo: snap?.logo,
          points,
          planChanges,
        });
      }
    }

    return built;
  }, [snapshots, requiredFeatureSlugs, billingPreference, preferredSlugs]);

  const focusBySlug = useMemo(() => {
    const requirements = crmRequirementsFromCalculatorInput({
      crmUsers: focusSeats,
      requiredFeatureSlugs,
      billingPreference,
    });
    const results = compareProductCosts(snapshots, requirements, {
      sortMode: "lowest-cost",
    }).results;
    return new Map(results.map((r) => [r.productSlug, r]));
  }, [focusSeats, requiredFeatureSlugs, billingPreference, snapshots]);

  const focusRows = useMemo(() => {
    return series
      .map((s, index) => {
        const point = s.points.find((p) => p.seats === focusSeats);
        const focusRow = focusBySlug.get(s.productSlug);
        const money = focusRow?.monthlyEquivalent;
        return {
          series: s,
          index,
          point,
          money,
          amountMinor: money?.amountMinor ?? null,
        };
      })
      .sort((a, b) => {
        if (a.amountMinor == null && b.amountMinor == null) return 0;
        if (a.amountMinor == null) return 1;
        if (b.amountMinor == null) return -1;
        return a.amountMinor - b.amountMinor;
      });
  }, [series, focusSeats, focusBySlug]);

  if (series.length === 0) return null;

  const maxFocus = Math.max(
    ...focusRows.map((r) => r.amountMinor).filter((n): n is number => n != null),
    1,
  );

  return (
    <section
      className={cn(
        "rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 sm:p-8",
        className,
      )}
      aria-labelledby="team-size-heading"
    >
      <h2
        id="team-size-heading"
        className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]"
      >
        See how costs change as your team grows
      </h2>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Pick a team size to compare monthly equivalents. Values are recalculated
        with the same pricing engine — blank cells mean public pricing could not
        calculate that seat count.
      </p>

      <div
        className="mt-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Team size"
      >
        {SEAT_PRESETS.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={focusSeats === n}
            onClick={() => setFocusSeats(n)}
            className={cn(
              "rounded-[var(--sg-radius-md)] border px-3 py-2 text-sm font-medium",
              focusSeats === n
                ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]"
                : "border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)]",
            )}
          >
            {n} users
          </button>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Monthly cost at {focusSeats} users
        </p>
        <ul className="mt-4 space-y-3">
          {focusRows.map(({ series: s, index, point, money, amountMinor }) => {
            const width =
              amountMinor != null
                ? Math.max(8, (amountMinor / maxFocus) * 100)
                : 0;
            return (
              <li key={s.productSlug}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        background: SERIES_COLORS[index % SERIES_COLORS.length],
                      }}
                      aria-hidden
                    />
                    <ProductLogo name={s.productName} logo={s.logo} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
                        {s.productName}
                      </p>
                      {point?.planName ? (
                        <p className="truncate text-xs text-[var(--sg-color-text-muted)]">
                          {point.planName}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <p className="tabular-nums text-sm font-semibold text-[var(--sg-color-navy)]">
                    {money ? (
                      <>
                        {formatMoney(money)}
                        <span className="font-normal text-[var(--sg-color-text-muted)]">
                          /mo
                        </span>
                      </>
                    ) : (
                      <span className="font-normal text-[var(--sg-color-text-muted)]">
                        Not calculable
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                  {amountMinor != null ? (
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${width}%`,
                        background: SERIES_COLORS[index % SERIES_COLORS.length],
                      }}
                    />
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 overflow-x-auto">
        <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
          Cost by team size
        </p>
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          Each column is an independent calculation for that seat count — not a
          continuous scale.
        </p>
        <table className="mt-4 w-full min-w-[32rem] border-collapse text-left text-sm">
          <caption className="sr-only">
            Monthly {productNoun} cost by product at {SEAT_PRESETS.join(", ")}{" "}
            users
          </caption>
          <thead>
            <tr className="border-b border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)]">
              <th scope="col" className="py-2 pr-3 font-medium">
                Product
              </th>
              {SEAT_PRESETS.map((n) => (
                <th
                  key={n}
                  scope="col"
                  className={cn(
                    "px-2 py-2 text-center font-medium",
                    n === focusSeats && "text-[var(--sg-color-primary)]",
                  )}
                >
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series.map((s, index) => (
              <tr
                key={s.productSlug}
                className="border-b border-[var(--sg-color-border)]"
              >
                <th scope="row" className="py-3 pr-3 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{
                        background: SERIES_COLORS[index % SERIES_COLORS.length],
                      }}
                      aria-hidden
                    />
                    <ProductLogo name={s.productName} logo={s.logo} size="sm" />
                    <span className="truncate">{s.productName}</span>
                  </span>
                </th>
                {s.points.map((p) => (
                  <td
                    key={`${s.productSlug}-${p.seats}`}
                    className={cn(
                      "px-2 py-3 text-center tabular-nums",
                      p.seats === focusSeats &&
                        "rounded-[var(--sg-radius-sm)] bg-[var(--sg-color-primary-soft)]/60 font-semibold text-[var(--sg-color-navy)]",
                    )}
                  >
                    {p.amountMinor != null && p.currency
                      ? compactMoney(p.amountMinor, p.currency)
                      : "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {series.some((s) => s.planChanges.length > 0) ? (
        <ul className="mt-4 space-y-1 text-xs text-[var(--sg-color-warning)]">
          {series.flatMap((s) =>
            s.planChanges.map((change) => (
              <li key={`${s.productSlug}-${change.seats}`}>
                {s.productName}: plan changes at {change.seats} users (
                {change.from} → {change.to})
              </li>
            )),
          )}
        </ul>
      ) : null}
    </section>
  );
}
