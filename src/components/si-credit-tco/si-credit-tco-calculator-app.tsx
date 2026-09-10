/**
 * Sales Intelligence Credit TCO Calculator.
 * Persistence: localStorage `sg-si-credit-tco-v1`
 * All dollar inputs are buyer/quote assumptions — never researched ZoomInfo list prices.
 */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/analytics";
import type { SiCreditTcoInputs } from "@/domain/schemas/si-credit-tco";
import { formatMoney, fromMajor } from "@/domain/money";
import {
  CALCULATOR_VALUE_PROPS,
  FinderPageHero,
} from "@/components/finder/finder-page-hero";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/forms";
import {
  computeSiCreditTco,
  createEmptySiCreditTcoInputs,
  loadSiCreditTcoInputs,
  resetSiCreditTcoInputs,
  saveSiCreditTcoInputs,
} from "@/services/si-credit-tco";

type Props = {
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
  titleElement?: "h1" | "h2" | "none";
};

function parseOptionalMajor(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function parseNonNegInt(raw: string, fallback: number): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.floor(n);
}

function moneyOrDash(minor: number | null): string {
  if (minor === null) return "Unknown";
  return formatMoney({ amountMinor: minor, currency: "USD" });
}

const CREDIT_TCO_VALUE_PROPS = [
  {
    ...CALCULATOR_VALUE_PROPS[0]!,
    title: "100% free",
    body: "No signup — paste your quote numbers.",
  },
  {
    ...CALCULATOR_VALUE_PROPS[1]!,
    title: "Your quote inputs",
    body: "We never invent ZoomInfo or other unpublished list prices.",
  },
  {
    ...CALCULATOR_VALUE_PROPS[2]!,
    title: "Credits + seats",
    body: "Model standard, overage, and mobile credits separately.",
  },
];

export function SiCreditTcoCalculatorApp({
  resourceLinks = [],
  title = "Sales Intelligence Credit TCO Calculator",
  description = "Model monthly and annual sales intelligence TCO from seats, credits, overage, and mobile credits using your quote inputs.",
  titleElement = "none",
}: Props) {
  const [inputs, setInputs] = useState<SiCreditTcoInputs>(() =>
    createEmptySiCreditTcoInputs(),
  );
  const [hydrated, setHydrated] = useState(false);
  const startedRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const stored = loadSiCreditTcoInputs() ?? createEmptySiCreditTcoInputs();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage
    setInputs(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveSiCreditTcoInputs(inputs);
  }, [inputs, hydrated]);

  useEffect(() => {
    if (!hydrated || startedRef.current) return;
    startedRef.current = true;
    track({ name: "si_credit_tco_started" });
  }, [hydrated]);

  const result = useMemo(() => computeSiCreditTco(inputs), [inputs]);

  useEffect(() => {
    if (!hydrated || completedRef.current) return;
    if (result.knownMonthlyMinor <= 0 && !result.allLinesKnown) return;
    completedRef.current = true;
    track({
      name: "si_credit_tco_completed",
      properties: {
        known_monthly_minor: result.knownMonthlyMinor,
        unknown_lines: result.unknownLineIds.length,
      },
    });
  }, [hydrated, result]);

  function patch(partial: Partial<SiCreditTcoInputs>) {
    setInputs((prev) => ({ ...prev, ...partial }));
  }

  return (
    <div className="mt-8">
      <FinderPageHero
        title={title}
        description={description}
        titleElement={titleElement}
        valueProps={CREDIT_TCO_VALUE_PROPS}
      />

      <p
        className="mt-6 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]"
        role="note"
      >
        <strong className="font-medium text-[var(--sg-color-text)]">
          Quote-input model.
        </strong>{" "}
        Volume defaults are placeholders. Dollar fields stay empty until you
        enter a published seat price or vendor quote. ZoomInfo Sales packages
        have no inventable public list prices here — leave seat/credit{" "}
        <span className="whitespace-nowrap">$</span> blank until you have a
        quote. Optional Apollo seat floors ($49 / $99) may be typed in when
        they match your plan — still labeled as your assumption.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section
          className="space-y-6 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 sm:p-6"
          aria-labelledby="si-credit-tco-inputs"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2
              id="si-credit-tco-inputs"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
            >
              Scenario inputs
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setInputs(resetSiCreditTcoInputs())}
            >
              Reset
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Seats"
              htmlFor="si-tco-seats"
              hint="Buying pod size (volume only)."
            >
              <Input
                id="si-tco-seats"
                type="number"
                min={0}
                inputMode="numeric"
                value={inputs.seats}
                onChange={(e) =>
                  patch({ seats: parseNonNegInt(e.target.value, 0) })
                }
              />
            </Field>
            <Field
              label="Seat price / month (USD)"
              htmlFor="si-tco-seat-price"
              hint="Leave blank when quote-only (e.g. ZoomInfo)."
            >
              <Input
                id="si-tco-seat-price"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                placeholder="Quote or list $"
                value={inputs.seatPricePerMonth ?? ""}
                onChange={(e) =>
                  patch({
                    seatPricePerMonth: parseOptionalMajor(e.target.value),
                  })
                }
              />
            </Field>

            <Field
              label="Credits / month"
              htmlFor="si-tco-credits"
              hint="Planned standard unlocks / exports / enrichments."
            >
              <Input
                id="si-tco-credits"
                type="number"
                min={0}
                inputMode="numeric"
                value={inputs.creditsPerMonth}
                onChange={(e) =>
                  patch({
                    creditsPerMonth: parseNonNegInt(e.target.value, 0),
                  })
                }
              />
            </Field>
            <Field
              label="Credit unit price (USD)"
              htmlFor="si-tco-credit-price"
              hint="Effective $/credit from your pack or quote."
            >
              <Input
                id="si-tco-credit-price"
                type="number"
                min={0}
                step="0.001"
                inputMode="decimal"
                placeholder="From quote"
                value={inputs.creditUnitPrice ?? ""}
                onChange={(e) =>
                  patch({
                    creditUnitPrice: parseOptionalMajor(e.target.value),
                  })
                }
              />
            </Field>

            <Field
              label="Overage credits"
              htmlFor="si-tco-overage"
              hint="Expected burn above the included allowance."
            >
              <Input
                id="si-tco-overage"
                type="number"
                min={0}
                inputMode="numeric"
                value={inputs.overageCredits}
                onChange={(e) =>
                  patch({
                    overageCredits: parseNonNegInt(e.target.value, 0),
                  })
                }
              />
            </Field>
            <Field
              label="Overage unit price (USD)"
              htmlFor="si-tco-overage-price"
              hint="Top-up / overage rate from the contract."
            >
              <Input
                id="si-tco-overage-price"
                type="number"
                min={0}
                step="0.001"
                inputMode="decimal"
                placeholder="From quote"
                value={inputs.overageUnitPrice ?? ""}
                onChange={(e) =>
                  patch({
                    overageUnitPrice: parseOptionalMajor(e.target.value),
                  })
                }
              />
            </Field>

            <Field
              label="Mobile credits"
              htmlFor="si-tco-mobile"
              hint="Phone / mobile reveals (often a separate or premium pool)."
            >
              <Input
                id="si-tco-mobile"
                type="number"
                min={0}
                inputMode="numeric"
                value={inputs.mobileCredits}
                onChange={(e) =>
                  patch({
                    mobileCredits: parseNonNegInt(e.target.value, 0),
                  })
                }
              />
            </Field>
            <Field
              label="Mobile unit price (USD)"
              htmlFor="si-tco-mobile-price"
              hint="Leave blank if mobiles share the standard credit price."
            >
              <Input
                id="si-tco-mobile-price"
                type="number"
                min={0}
                step="0.001"
                inputMode="decimal"
                placeholder="From quote"
                value={inputs.mobileUnitPrice ?? ""}
                onChange={(e) =>
                  patch({
                    mobileUnitPrice: parseOptionalMajor(e.target.value),
                  })
                }
              />
            </Field>

            <Field
              label="Annual commit discount (%)"
              htmlFor="si-tco-annual-discount"
              hint="Applied to annual TCO only when your quote includes it."
            >
              <Input
                id="si-tco-annual-discount"
                type="number"
                min={0}
                max={100}
                step="1"
                inputMode="decimal"
                value={inputs.annualDiscountPercent}
                onChange={(e) =>
                  patch({
                    annualDiscountPercent: Math.min(
                      100,
                      parseNonNegInt(e.target.value, 0),
                    ),
                  })
                }
              />
            </Field>
          </div>
        </section>

        <section
          className="space-y-5 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/30 p-5 sm:p-6"
          aria-labelledby="si-credit-tco-results"
          aria-live="polite"
        >
          <h2
            id="si-credit-tco-results"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Known TCO
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface)] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Monthly
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
                {formatMoney({
                  amountMinor: result.knownMonthlyMinor,
                  currency: "USD",
                })}
              </p>
            </div>
            <div className="rounded-[var(--sg-radius-md)] bg-[var(--sg-color-surface)] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                Annual
                {result.annualDiscountPercent > 0
                  ? ` (−${result.annualDiscountPercent}%)`
                  : ""}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]">
                {formatMoney({
                  amountMinor: result.knownAnnualMinor,
                  currency: "USD",
                })}
              </p>
            </div>
          </div>

          <ul className="divide-y divide-[var(--sg-color-border)] rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
            {result.lines.map((line) => (
              <li
                key={line.id}
                className="flex flex-wrap items-start justify-between gap-2 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-[var(--sg-color-text)]">
                    {line.label}
                  </p>
                  <p className="text-[var(--sg-color-text-muted)]">
                    {line.quantity.toLocaleString("en-US")}
                    {line.unitPrice !== null
                      ? ` × ${formatMoney(fromMajor(line.unitPrice, "USD"))}`
                      : " · unit $ unknown"}
                  </p>
                  {line.note ? (
                    <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                      {line.note}
                    </p>
                  ) : null}
                </div>
                <p
                  className={
                    line.known
                      ? "font-medium text-[var(--sg-color-navy)]"
                      : "font-medium text-[var(--sg-color-text-muted)]"
                  }
                >
                  {moneyOrDash(line.monthlyMinor)}
                  <span className="sr-only"> per month</span>
                </p>
              </li>
            ))}
          </ul>

          {!result.allLinesKnown ? (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              Unknown lines are excluded from known TCO — not treated as $0.
              Fill quote fields to complete the model.
            </p>
          ) : (
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              All modeled lines have prices. Re-check volumes against a 90-day
              campaign before you commit.
            </p>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/tools/sales-intelligence-cost-calculator/"
              className="inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border-strong)] bg-[var(--sg-color-surface)] px-4 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
            >
              Seat list-price calculator
            </Link>
            <Link
              href="/guides/sales-intelligence-credits-explained/"
              className="inline-flex h-10 items-center justify-center rounded-[var(--sg-radius-md)] px-4 text-sm font-medium text-[var(--sg-color-primary)] hover:underline"
            >
              Credits explained
            </Link>
          </div>
        </section>
      </div>

      {resourceLinks.length > 0 ? (
        <nav
          className="mt-10"
          aria-label="Related sales intelligence resources"
        >
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {resourceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[var(--sg-color-primary)] hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
