"use client";

import { formatMoney } from "@/domain";
import type { TCOCostCategory, TCOProductResult } from "@/domain";
import { TcoSourceBadge } from "./tco-source-badge";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductLogo } from "@/components/software/product-logo";
import { cn } from "@/lib/cn";
import { deriveCostDrivers } from "@/services/tco";

const CATEGORY_ORDER: TCOCostCategory[] = [
  "software",
  "implementation",
  "migration",
  "integrations",
  "training",
  "administration",
  "support",
  "addon",
  "custom",
];

const LABELS: Record<TCOCostCategory, string> = {
  software: "Software",
  implementation: "Implementation",
  migration: "Migration",
  integrations: "Integrations",
  training: "Training",
  administration: "Admin",
  support: "Support",
  addon: "Add-ons",
  custom: "Other",
};

type Props = {
  product: TCOProductResult | null;
  horizonYears: number;
  logo?: { src: string; alt: string };
  onViewResults?: () => void;
  className?: string;
};

export function TcoSidebar({
  product,
  horizonYears,
  logo,
  onViewResults,
  className,
}: Props) {
  if (!product) {
    return (
      <Card className={cn(className)} aria-labelledby="tco-sidebar-heading">
        <h2
          id="tco-sidebar-heading"
          className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
        >
          Your TCO
        </h2>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Select CRM products to see a live known-cost summary. Unknown costs
          stay unknown until you add an estimate.
        </p>
      </Card>
    );
  }

  const hasUnknowns = product.unknownItems.length > 0;
  const drivers = deriveCostDrivers(product, 3);
  const currency = product.currency as "EUR";

  return (
    <Card className={cn(className)} aria-labelledby="tco-sidebar-heading">
      <div className="flex items-center justify-between gap-2">
        <h2
          id="tco-sidebar-heading"
          className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
        >
          Your TCO · {horizonYears} years
        </h2>
        <Badge variant="success">Live</Badge>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <ProductLogo name={product.productName} logo={logo} size="sm" />
        <p className="truncate text-sm font-semibold text-[var(--sg-color-text)]">
          {product.productName}
        </p>
      </div>

      <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        {hasUnknowns ? "Known TCO" : "Estimated TCO"}
      </p>
      <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
        {formatMoney({ amountMinor: product.knownTcoMinor, currency })}
      </p>
      {hasUnknowns ? (
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
          {product.unknownItems.length} cost categor
          {product.unknownItems.length === 1 ? "y remains" : "ies remain"}{" "}
          unknown — not included above.
        </p>
      ) : null}

      <dl className="mt-4 space-y-2 border-t border-[var(--sg-color-border)] pt-3 text-sm">
        {CATEGORY_ORDER.map((cat) => {
          const row = product.categoryTotals.find((c) => c.category === cat);
          if (!row || row.amountMinor <= 0) {
            const unknown = product.unknownItems.find((u) => u.category === cat);
            if (!unknown) return null;
            return (
              <div key={cat} className="flex items-center justify-between gap-2">
                <dt className="text-[var(--sg-color-text-muted)]">
                  {LABELS[cat]}
                </dt>
                <dd className="flex items-center gap-2">
                  <span className="text-[var(--sg-color-text-muted)]">—</span>
                  <TcoSourceBadge sourceType="unknown" />
                </dd>
              </div>
            );
          }
          const share =
            product.knownTcoMinor > 0
              ? Math.round((row.amountMinor / product.knownTcoMinor) * 100)
              : 0;
          return (
            <div key={cat} className="flex items-center justify-between gap-2">
              <dt className="text-[var(--sg-color-text-muted)]">
                {LABELS[cat]}
                <span className="ml-1 text-[10px] tabular-nums">({share}%)</span>
              </dt>
              <dd className="flex items-center gap-2">
                <span className="tabular-nums font-medium text-[var(--sg-color-text)]">
                  {formatMoney({ amountMinor: row.amountMinor, currency })}
                </span>
                <TcoSourceBadge sourceType={row.sourceType} />
              </dd>
            </div>
          );
        })}
      </dl>

      {drivers.length > 0 ? (
        <div className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)]/50 px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            What drives your TCO?
          </p>
          <ol className="mt-2.5 space-y-2.5">
            {drivers.map((d) => (
              <li key={d.category}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-[var(--sg-color-text)]">
                    {d.rank}. {d.label}
                  </span>
                  <span className="shrink-0 tabular-nums text-[var(--sg-color-text-muted)]">
                    {Math.round(d.share * 100)}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--sg-color-surface)]">
                  <div
                    className="h-full rounded-full bg-[var(--sg-color-primary)]"
                    style={{ width: `${Math.round(d.share * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <dl className="mt-4 space-y-1 text-xs text-[var(--sg-color-text-muted)]">
        <div className="flex justify-between gap-2">
          <dt>{horizonYears}-year TCO / user</dt>
          <dd className="tabular-nums font-medium text-[var(--sg-color-text)]">
            {formatMoney({
              amountMinor: product.perUser.knownTcoMinor,
              currency,
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Avg. monthly TCO / user</dt>
          <dd className="tabular-nums font-medium text-[var(--sg-color-text)]">
            {formatMoney({
              amountMinor: product.perUser.avgMonthlyMinor,
              currency,
            })}
          </dd>
        </div>
      </dl>

      {onViewResults ? (
        <Button className="mt-5 w-full" onClick={onViewResults}>
          View results
        </Button>
      ) : null}
    </Card>
  );
}

type MobileProps = {
  knownTcoMinor: number;
  currency: string;
  horizonYears: number;
  unknownCount: number;
  onViewBreakdown: () => void;
};

export function TcoMobileBar({
  knownTcoMinor,
  currency,
  horizonYears,
  unknownCount,
  onViewBreakdown,
}: MobileProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-3 shadow-[var(--sg-shadow-md)] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Known {horizonYears}-year TCO
          </p>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
            {formatMoney({
              amountMinor: knownTcoMinor,
              currency: currency as "EUR",
            })}
          </p>
          {unknownCount > 0 ? (
            <p className="text-[10px] text-[var(--sg-color-text-muted)]">
              {unknownCount} unknown
            </p>
          ) : null}
        </div>
        <Button size="sm" onClick={onViewBreakdown}>
          View breakdown
        </Button>
      </div>
    </div>
  );
}
