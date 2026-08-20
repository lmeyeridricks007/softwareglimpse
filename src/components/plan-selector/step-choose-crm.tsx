"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatMoney, fromMajor } from "@/domain";
import type { VendorPlanSupport } from "@/services/plan-selector";
import type { CurrencyCode } from "@/domain/schemas/primitives";

type Props = {
  vendors: VendorPlanSupport[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  productNoun?: string;
  finderHref?: string;
  finderLabel?: string;
  rfpHref?: string | null;
  rfpLabel?: string;
};

export function StepChooseCrm({
  vendors,
  selectedSlug,
  onSelect,
  productNoun = "CRM",
  finderHref = "/tools/crm-finder/",
  finderLabel = "CRM Finder",
  rfpHref = "/tools/crm-rfp-builder/",
  rfpLabel = "Prep vendor questions",
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vendors;
    return vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.productSlug.toLowerCase().includes(q),
    );
  }, [vendors, query]);

  const supported = filtered.filter((v) => v.status === "supported");
  const partial = filtered.filter((v) => v.status === "partial");
  const unsupported = filtered.filter((v) => v.status === "unsupported");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          Which {productNoun} are you considering?
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Only products with verified plan matrices are fully selectable. Credit
          packs and quote-only pricing stay out of the ladder — we do not invent
          tiers.
        </p>
      </div>

      <label className="relative block">
        <span className="sr-only">Search {productNoun}s</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--sg-color-text-muted)]"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${productNoun}…`}
          className="h-11 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] pr-3 pl-10 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-color-primary)]"
        />
      </label>

      <VendorGrid
        title="Ready for plan selection"
        vendors={supported}
        selectedSlug={selectedSlug}
        onSelect={onSelect}
      />
      {partial.length > 0 ? (
        <VendorGrid
          title="Partial coverage"
          vendors={partial}
          selectedSlug={selectedSlug}
          onSelect={onSelect}
          note="You can proceed, but some plan prices or feature gates still need verification."
        />
      ) : null}
      {unsupported.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Contact vendor / pricing notes
          </h3>
          <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
            These products publish custom, credit-pack, or sales-led pricing
            rather than a usable public seat ladder. Ask the vendor for a quote
            — we never invent credit dollar totals.
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {unsupported.slice(0, 12).map((v) => (
              <li key={v.productSlug}>
                <Card>
                  <div className="flex items-start gap-3">
                    <ProductLogo name={v.name} logo={v.logo} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[var(--sg-color-navy)]">
                        {v.name}
                      </p>
                      <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                        {v.reason ??
                          "Contact the vendor for a plan and seat quote."}
                      </p>
                      <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        <a
                          href={`/software/${v.productSlug}/`}
                          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          Product hub
                        </a>
                        <a
                          href={`/pricing/${v.productSlug}/`}
                          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          Pricing notes
                        </a>
                        {rfpHref ? (
                          <a
                            href={rfpHref}
                            className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                          >
                            {rfpLabel}
                          </a>
                        ) : null}
                        <a
                          href={finderHref}
                          className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                        >
                          {finderLabel}
                        </a>
                      </p>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function VendorGrid({
  title,
  vendors,
  selectedSlug,
  onSelect,
  note,
}: {
  title: string;
  vendors: VendorPlanSupport[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  note?: string;
}) {
  if (vendors.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--sg-color-navy)]">
        {title}
      </h3>
      {note ? (
        <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">{note}</p>
      ) : null}
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {vendors.map((v) => {
          const selected = selectedSlug === v.productSlug;
          const priceLabel =
            v.startingPriceMonthly != null && v.currency
              ? `From ${formatMoney(
                  fromMajor(
                    v.startingPriceMonthly,
                    v.currency as CurrencyCode,
                  ),
                  { maximumFractionDigits: 0 },
                )}/user/mo`
              : null;
          return (
            <li key={v.productSlug}>
              <button
                type="button"
                onClick={() => onSelect(v.productSlug)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-[var(--sg-radius-xl)] border bg-[var(--sg-color-surface)] p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sg-color-primary)]",
                  selected
                    ? "border-[var(--sg-color-primary)] ring-2 ring-[var(--sg-color-primary-soft)]"
                    : "border-[var(--sg-color-border)] hover:border-[var(--sg-color-primary)]/50",
                )}
                aria-pressed={selected}
              >
                <ProductLogo name={v.name} logo={v.logo} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--sg-color-navy)]">
                    {v.name}
                  </p>
                  <p className="text-xs text-[var(--sg-color-text-muted)]">
                    {v.planCount} {v.planCount === 1 ? "plan" : "plans"}
                    {v.status === "supported" && v.calculablePlanCount === 1
                      ? " · single public tier"
                      : ""}
                    {priceLabel ? ` · ${priceLabel}` : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={selected ? "primary" : "outline"}
                  tabIndex={-1}
                >
                  {selected ? "Selected" : "Select"}
                </Button>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
