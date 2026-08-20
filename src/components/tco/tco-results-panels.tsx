"use client";

import { TrendingUp } from "lucide-react";
import {
  formatMoney,
  type TCOProductResult,
} from "@/domain";
import type { SensitivityDelta, TCOCostDriver } from "@/services/tco";
import { TCO_CATEGORY_BAR } from "./tco-category-styles";
import { ProductLogo } from "@/components/software/product-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type CurrencyCode = "EUR" | "USD" | "GBP";

type LogoMap = Record<string, { src: string; alt: string } | undefined>;

export function TcoProductSummaryCards({
  products,
  focusProductId,
  horizonYears,
  logos,
  onFocus,
}: {
  products: TCOProductResult[];
  focusProductId?: string;
  horizonYears: number;
  logos?: LogoMap;
  onFocus: (id: string) => void;
}) {
  const maxKnown = Math.max(...products.map((p) => p.knownTcoMinor), 1);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => {
        const currency = p.currency as CurrencyCode;
        const focused = focusProductId === p.productId;
        const barWidth = Math.round((p.knownTcoMinor / maxKnown) * 100);
        const software =
          p.categoryTotals.find((c) => c.category === "software")
            ?.amountMinor ?? 0;
        const implementationMigration =
          (p.categoryTotals.find((c) => c.category === "implementation")
            ?.amountMinor ?? 0) +
          (p.categoryTotals.find((c) => c.category === "migration")
            ?.amountMinor ?? 0);
        const operationalCats = new Set([
          "integrations",
          "training",
          "administration",
          "support",
          "custom",
          "addon",
        ]);
        const operational = p.categoryTotals
          .filter((c) => operationalCats.has(c.category))
          .reduce((sum, c) => sum + c.amountMinor, 0);

        return (
          <button
            key={p.productId}
            type="button"
            onClick={() => onFocus(p.productId)}
            className={cn(
              "group rounded-[var(--sg-radius-xl)] border bg-[var(--sg-color-surface)] p-5 text-left shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]/35 hover:shadow-[var(--sg-shadow-md)]",
              focused
                ? "border-[var(--sg-color-primary)] ring-2 ring-[var(--sg-color-primary)]/25"
                : "border-[var(--sg-color-border)]",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5">
                <ProductLogo
                  name={p.productName}
                  logo={logos?.[p.productId]}
                  size="sm"
                />
                <h3 className="truncate font-semibold text-[var(--sg-color-navy)]">
                  {p.productName}
                </h3>
              </div>
              {focused ? <Badge variant="success">Focus</Badge> : null}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              Known {horizonYears}-year TCO
            </p>
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)] sm:text-3xl">
              {formatMoney({ amountMinor: p.knownTcoMinor, currency })}
            </p>

            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]"
              aria-hidden
            >
              <div
                className="h-full rounded-full bg-[var(--sg-color-primary)] transition-all"
                style={{ width: `${barWidth}%` }}
              />
            </div>

            <dl className="mt-4 space-y-2 border-t border-[var(--sg-color-border)]/70 pt-3 text-sm">
              {(
                [
                  ["Software", software],
                  ["Implementation / migration", implementationMigration],
                  ["Ongoing operational", operational],
                ] as const
              ).map(([label, amount]) => (
                <div
                  key={label}
                  className="flex items-baseline justify-between gap-3"
                >
                  <dt className="text-[var(--sg-color-text-muted)]">{label}</dt>
                  <dd className="tabular-nums font-semibold text-[var(--sg-color-navy)]">
                    {formatMoney({ amountMinor: amount, currency })}
                  </dd>
                </div>
              ))}
            </dl>

            {p.unknownItems.length > 0 ? (
              <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
                {p.unknownItems.length} cost
                {p.unknownItems.length === 1 ? "" : "s"} not included yet
              </p>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function TcoCostDriversPanel({
  drivers,
  currency,
  productName,
}: {
  drivers: TCOCostDriver[];
  currency: CurrencyCode;
  productName: string;
}) {
  if (drivers.length === 0) return null;
  const maxShare = Math.max(...drivers.map((d) => d.share), 0.01);

  return (
    <section
      aria-labelledby="drivers-heading"
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3
            id="drivers-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Largest cost drivers
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Where {productName} ownership spend concentrates in your known TCO.
          </p>
        </div>
      </div>

      <ol className="mt-5 space-y-4">
        {drivers.map((d) => {
          const pct = Math.round(d.share * 100);
          const width = Math.round((d.share / maxShare) * 100);
          return (
            <li key={d.category}>
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--sg-color-surface-muted)] text-[10px] font-bold text-[var(--sg-color-navy)]">
                    {d.rank}
                  </span>
                  <span className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
                    {d.label}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-[var(--sg-color-navy)]">
                    {formatMoney({ amountMinor: d.amountMinor, currency })}
                  </p>
                  <p className="text-[10px] font-medium tabular-nums text-[var(--sg-color-text-muted)]">
                    {pct}% of known TCO
                  </p>
                </div>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    TCO_CATEGORY_BAR[d.category],
                  )}
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function TcoSensitivityPanel({
  items,
  horizonYears,
  currency,
}: {
  items: SensitivityDelta[];
  horizonYears: number;
  currency: CurrencyCode;
}) {
  if (items.length === 0) return null;
  const maxAbs = Math.max(
    ...items.map((s) => Math.abs(s.deltaKnownTcoMinor)),
    1,
  );

  return (
    <section
      aria-labelledby="sens-heading"
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary)]">
          <TrendingUp className="size-4" aria-hidden />
        </span>
        <div>
          <h3
            id="sens-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            What affects TCO most?
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Deterministic deltas from your inputs — not market forecasts.
          </p>
        </div>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {items.map((s) => {
          const positive = s.deltaKnownTcoMinor >= 0;
          const width = Math.round(
            (Math.abs(s.deltaKnownTcoMinor) / maxAbs) * 100,
          );
          return (
            <li
              key={s.id}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)]/40 p-4"
            >
              <p className="text-sm font-medium text-[var(--sg-color-text)]">
                {s.description}
              </p>
              <p
                className={cn(
                  "mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums",
                  positive
                    ? "text-[var(--sg-color-navy)]"
                    : "text-[var(--sg-color-success)]",
                )}
              >
                {positive ? "+" : "−"}
                {formatMoney({
                  amountMinor: Math.abs(s.deltaKnownTcoMinor),
                  currency,
                })}
              </p>
              <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                {horizonYears}-year known TCO impact
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
                <div
                  className={cn(
                    "h-full rounded-full",
                    positive
                      ? "bg-[var(--sg-color-primary)]"
                      : "bg-[var(--sg-color-success)]",
                  )}
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function TcoAssumptionsPanel({
  assumptions,
  onEdit,
}: {
  assumptions: Array<{ id: string; label: string; value: string }>;
  onEdit: () => void;
}) {
  return (
    <section
      aria-labelledby="assumptions-heading"
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3
            id="assumptions-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Calculation assumptions
          </h3>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Inputs used for this scenario. Change any step to recalculate.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit assumptions
        </Button>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {assumptions.map((a) => (
          <div
            key={a.id}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]/80 bg-[var(--sg-color-surface-muted)]/40 px-4 py-3"
          >
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {a.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--sg-color-navy)]">
              {a.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function TcoLicenceGapPanel({
  product,
}: {
  product: TCOProductResult;
}) {
  if (product.perUser.softwareMonthlyMinor == null) return null;
  const currency = product.currency as CurrencyCode;
  const licence = product.perUser.softwareMonthlyMinor;
  const trueCost = product.perUser.avgMonthlyMinor;
  const gap = Math.max(0, trueCost - licence);
  const max = Math.max(licence, trueCost, 1);

  return (
    <section
      aria-labelledby="licence-vs-heading"
      className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/25 bg-gradient-to-br from-[var(--sg-color-primary-soft)]/50 to-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] sm:p-6"
    >
      <h3
        id="licence-vs-heading"
        className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
      >
        Licence price isn&apos;t the whole cost
      </h3>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Based on your inputs for {product.productName} — not a market average.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {(
          [
            {
              label: "Licence / user / month",
              amount: licence,
              bar: "bg-[var(--sg-color-success)]",
            },
            {
              label: "True known TCO / user / month",
              amount: trueCost,
              bar: "bg-[var(--sg-color-primary)]",
            },
            {
              label: "Additional ownership cost",
              amount: gap,
              bar: "bg-amber-500",
            },
          ] as const
        ).map((item) => (
          <div
            key={item.label}
            className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]/60 bg-[var(--sg-color-surface)]/80 p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              {item.label}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
              {formatMoney({ amountMinor: item.amount, currency })}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface-muted)]">
              <div
                className={cn("h-full rounded-full", item.bar)}
                style={{
                  width: `${Math.round((item.amount / max) * 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
