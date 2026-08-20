"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Download,
  HelpCircle,
  Printer,
  X,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requirementLabel } from "@/data/config/plan-selector/requirements";
import { formatMoney } from "@/domain";
import { cn } from "@/lib/cn";
import type {
  CoverageSymbol,
  PlanSelectorAnalysis,
} from "@/services/plan-selector";
import { track } from "@/analytics";

type Props = {
  analysis: PlanSelectorAnalysis;
  onDownload: () => void | Promise<void>;
  onRestart: () => void;
};

const SYMBOL_LABEL: Record<CoverageSymbol, string> = {
  included: "Included",
  limited: "Limited",
  "add-on": "Add-on",
  "not-included": "Not available",
  unknown: "Unknown",
};

function SymbolCell({ symbol }: { symbol: CoverageSymbol }) {
  const label = SYMBOL_LABEL[symbol];
  if (symbol === "included") {
    return (
      <span title={label} className="text-[var(--sg-color-success)]">
        <Check className="inline size-4" aria-label={label} />
      </span>
    );
  }
  if (symbol === "not-included") {
    return (
      <span title={label} className="text-[var(--sg-color-danger)]">
        <X className="inline size-4" aria-label={label} />
      </span>
    );
  }
  if (symbol === "limited") {
    return (
      <span title={label} aria-label={label} className="font-semibold">
        △
      </span>
    );
  }
  if (symbol === "add-on") {
    return (
      <span title={label} aria-label={label} className="font-semibold">
        +
      </span>
    );
  }
  return (
    <span title={label} aria-label={label} className="font-semibold">
      ?
    </span>
  );
}

export function PlanSelectorResults({
  analysis,
  onDownload,
  onRestart,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const rec = analysis.recommendedPlan;
  const plans = analysis.planLadder.map((e) => e.plan);
  const features = [
    ...new Set(analysis.coverageMatrix.map((c) => c.featureSlug)),
  ];

  async function handleDownload() {
    track({ name: "crm_plan_report_downloaded" });
    setDownloading(true);
    try {
      await onDownload();
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Your CRM plan recommendation
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)] sm:text-3xl">
          {analysis.productName}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={downloading}
            onClick={() => void handleDownload()}
          >
            <Download className="size-4" aria-hidden />
            Download recommendation
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="size-4" aria-hidden />
            Print
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onRestart}>
            Start over
          </Button>
        </div>
      </header>

      {rec && analysis.kind === "recommended" ? (
        <Card className="border-[var(--sg-color-success)]/40 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-success)]">
            Recommended plan
          </p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--sg-color-navy)]">
            {rec.name}
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            {analysis.explanation}
          </p>
          {analysis.pricingNow ? (
            <div className="mt-4">
              <p className="text-2xl font-semibold text-[var(--sg-color-navy)]">
                {formatMoney(analysis.pricingNow.monthlyEquivalent, {
                  maximumFractionDigits: 0,
                })}
                <span className="text-base font-normal text-[var(--sg-color-text-muted)]">
                  {" "}
                  / month est.
                </span>
              </p>
              <p className="text-sm text-[var(--sg-color-text-muted)]">
                {formatMoney(analysis.pricingNow.annualCost, {
                  maximumFractionDigits: 0,
                })}{" "}
                / year · list pricing assumptions apply
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[var(--sg-color-warning)]">
              Exact pricing depends on configuration — contact vendor / custom
              pricing.
            </p>
          )}
          <ul className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
            <li className="rounded-full bg-[var(--sg-color-success)]/10 px-3 py-1 text-[var(--sg-color-success)]">
              ✓ Meets all must-haves
            </li>
            <li className="rounded-full bg-[var(--sg-color-success)]/10 px-3 py-1 text-[var(--sg-color-success)]">
              ✓ Best-fit plan
            </li>
            <li className="rounded-full bg-[var(--sg-color-success)]/10 px-3 py-1 text-[var(--sg-color-success)]">
              ✓ Lowest qualifying tier
            </li>
          </ul>
        </Card>
      ) : (
        <Card className="border-[var(--sg-color-warning)]/40 p-6">
          <p className="font-semibold text-[var(--sg-color-navy)]">
            {analysis.kind === "no-suitable-plan"
              ? "No verified plan satisfies all requirements"
              : analysis.kind === "custom-quote"
                ? "Custom pricing required"
                : "Coverage needs verification"}
          </p>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            {analysis.explanation}
          </p>
        </Card>
      )}

      {/* Plan ladder */}
      <section aria-labelledby="ladder-heading">
        <h3
          id="ladder-heading"
          className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
        >
          Plan ladder
        </h3>
        <ol className="mt-4 space-y-3">
          {analysis.planLadder.map((entry) => (
            <li
              key={entry.plan.slug}
              className={cn(
                "rounded-[var(--sg-radius-xl)] border px-4 py-3",
                entry.status === "recommended"
                  ? "border-[var(--sg-color-success)] bg-[var(--sg-color-success)]/5"
                  : "border-[var(--sg-color-border)]",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold text-[var(--sg-color-navy)]">
                  {entry.plan.name}
                  {entry.status === "recommended" ? (
                    <span className="ml-2 text-xs font-semibold text-[var(--sg-color-success)]">
                      ✓ RECOMMENDED
                    </span>
                  ) : null}
                </p>
                {entry.cost && !entry.cost.warnings.includes("contact-sales-or-empty-rules") ? (
                  <p className="text-sm text-[var(--sg-color-text-muted)]">
                    {formatMoney(entry.cost.monthlyEquivalent, {
                      maximumFractionDigits: 0,
                    })}
                    /mo est.
                  </p>
                ) : entry.status === "custom" ? (
                  <p className="text-sm text-[var(--sg-color-text-muted)]">
                    Contact sales
                  </p>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {entry.summary}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Why this plan */}
      {rec && analysis.kind === "recommended" ? (
        <section aria-labelledby="why-heading" className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h3
              id="why-heading"
              className="font-semibold text-[var(--sg-color-navy)]"
            >
              Why {rec.name} is the right fit
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
              {analysis.mustHaveSlugs.slice(0, 6).map((slug) => (
                <li key={slug} className="flex gap-2">
                  <Check
                    className="size-4 shrink-0 text-[var(--sg-color-success)]"
                    aria-hidden
                  />
                  {requirementLabel(slug)} supported
                </li>
              ))}
              <li className="flex gap-2">
                <Check
                  className="size-4 shrink-0 text-[var(--sg-color-success)]"
                  aria-hidden
                />
                Supports your expected team size
              </li>
            </ul>
          </Card>
          {analysis.previousFailedPlan ? (
            <Card>
              <h3 className="font-semibold text-[var(--sg-color-navy)]">
                What forced the upgrade from{" "}
                {analysis.previousFailedPlan.name}?
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
                {analysis.planLadder
                  .find((e) => e.plan.slug === analysis.previousFailedPlan!.slug)
                  ?.missingMustHaves.map((slug) => (
                    <li key={slug} className="flex gap-2">
                      <X
                        className="size-4 shrink-0 text-[var(--sg-color-danger)]"
                        aria-hidden
                      />
                      {requirementLabel(slug)}
                    </li>
                  ))}
                {analysis.planLadder
                  .find((e) => e.plan.slug === analysis.previousFailedPlan!.slug)
                  ?.limitFailures.map((msg) => (
                    <li key={msg} className="flex gap-2">
                      <X
                        className="size-4 shrink-0 text-[var(--sg-color-danger)]"
                        aria-hidden
                      />
                      {msg}
                    </li>
                  ))}
              </ul>
            </Card>
          ) : null}
        </section>
      ) : null}

      {/* Drivers */}
      {analysis.requirementDrivers.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            What is driving your plan?
          </h3>
          <ol className="mt-3 space-y-3">
            {analysis.requirementDrivers.map((d, i) => (
              <li key={d.featureSlug} className="text-sm">
                <span className="font-semibold text-[var(--sg-color-navy)]">
                  {i + 1}. {d.label}
                </span>
                <p className="text-[var(--sg-color-text-muted)]">
                  Forces upgrade from {d.fromPlanName ?? "lower plan"} →{" "}
                  {d.toPlanName}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      {/* Coverage matrix */}
      {features.length > 0 && plans.length > 0 ? (
        <section aria-labelledby="matrix-heading">
          <h3
            id="matrix-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Must-have coverage
          </h3>
          <div className="mt-3 overflow-x-auto rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)]">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <caption className="sr-only">
                Requirement coverage by plan
              </caption>
              <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide">
                <tr>
                  <th scope="col" className="px-3 py-2">
                    Requirement
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.slug}
                      scope="col"
                      className={cn(
                        "px-3 py-2",
                        rec?.slug === p.slug && "bg-[var(--sg-color-success)]/10",
                      )}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((featureSlug) => (
                  <tr
                    key={featureSlug}
                    className="border-t border-[var(--sg-color-border)]"
                  >
                    <th
                      scope="row"
                      className="px-3 py-2 font-medium text-[var(--sg-color-navy)]"
                    >
                      {requirementLabel(featureSlug)}
                    </th>
                    {plans.map((p) => {
                      const cell = analysis.coverageMatrix.find(
                        (c) =>
                          c.featureSlug === featureSlug &&
                          c.planSlug === p.slug,
                      );
                      return (
                        <td
                          key={p.slug}
                          className={cn(
                            "px-3 py-2 text-center",
                            rec?.slug === p.slug &&
                              "bg-[var(--sg-color-success)]/5",
                          )}
                          title={cell?.notes}
                        >
                          <SymbolCell symbol={cell?.symbol ?? "unknown"} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
            ✓ Included · △ Limited · + Add-on · ✕ Not available · ? Unknown
          </p>
        </section>
      ) : null}

      {/* Upgrade / downgrade */}
      <div className="grid gap-6 lg:grid-cols-2">
        {analysis.nextPlan ? (
          <Card>
            <div
              onFocus={() =>
                track({
                  name: "crm_plan_upgrade_viewed",
                  properties: { plan: analysis.nextPlan!.slug },
                })
              }
            >
            <h3 className="font-semibold text-[var(--sg-color-navy)]">
              Should you upgrade to {analysis.nextPlan.name}?
            </h3>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {analysis.upgradeBenefits.length === 0
                ? "Probably not yet — none of your nice-to-haves require this tier based on verified coverage."
                : "It would add capabilities you marked as nice-to-have:"}
            </p>
            {analysis.upgradeBenefits.length > 0 ? (
              <ul className="mt-2 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
                {analysis.upgradeBenefits.map((b) => (
                  <li key={b}>+ {b}</li>
                ))}
              </ul>
            ) : null}
            {analysis.pricingNow &&
            analysis.planLadder.find((e) => e.plan.slug === analysis.nextPlan!.slug)
              ?.cost ? (
              <UpgradeDelta analysis={analysis} />
            ) : null}
            </div>
          </Card>
        ) : null}

        {analysis.previousFailedPlan ? (
          <Card>
            <h3 className="font-semibold text-[var(--sg-color-navy)]">
              Could you use the cheaper plan?
            </h3>
            <p className="mt-2 text-sm font-medium text-[var(--sg-color-navy)]">
              {analysis.previousFailedPlan.name}
            </p>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              No — unless you can live without:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
              {analysis.planLadder
                .find((e) => e.plan.slug === analysis.previousFailedPlan!.slug)
                ?.missingMustHaves.map((slug) => (
                  <li key={slug}>· {requirementLabel(slug)}</li>
                ))}
            </ul>
          </Card>
        ) : null}
      </div>

      {/* Overbuying */}
      {analysis.unusedCapabilitiesOnNext.length > 0 && analysis.nextPlan ? (
        <Card>
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            Capabilities you&apos;re probably not paying for (on{" "}
            {analysis.nextPlan.name})
          </h3>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Relative to your answers, these are not must-haves:
          </p>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {analysis.unusedCapabilitiesOnNext.slice(0, 8).map((c) => (
              <li
                key={c}
                className="rounded-full bg-[var(--sg-color-surface-muted)] px-3 py-1"
              >
                {c}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* Cost growth */}
      {analysis.pricingNow && analysis.pricingGrowth ? (
        <Card>
          <div
            onMouseEnter={() => track({ name: "crm_plan_cost_viewed" })}
          >
          <h3 className="font-semibold text-[var(--sg-color-navy)]">
            Cost at growth
          </h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">Today</dt>
              <dd className="text-lg font-semibold text-[var(--sg-color-navy)]">
                {formatMoney(analysis.pricingNow.monthlyEquivalent, {
                  maximumFractionDigits: 0,
                })}
                /mo
              </dd>
            </div>
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">
                12-month scenario
              </dt>
              <dd className="text-lg font-semibold text-[var(--sg-color-navy)]">
                {formatMoney(analysis.pricingGrowth.monthlyEquivalent, {
                  maximumFractionDigits: 0,
                })}
                /mo
              </dd>
            </div>
            <div>
              <dt className="text-[var(--sg-color-text-muted)]">Difference</dt>
              <dd className="text-lg font-semibold text-[var(--sg-color-navy)]">
                +
                {formatMoney(
                  {
                    amountMinor:
                      analysis.pricingGrowth.monthlyEquivalent.amountMinor -
                      analysis.pricingNow.monthlyEquivalent.amountMinor,
                    currency: analysis.pricingNow.monthlyEquivalent.currency,
                  },
                  { maximumFractionDigits: 0 },
                )}
                /mo
              </dd>
            </div>
          </dl>
          {analysis.growthMayNeedReconsideration ? (
            <p className="mt-3 text-sm text-[var(--sg-color-warning)]">
              At your 12-month seat count, reconsider this plan because{" "}
              {analysis.growthReconsiderationReason}
            </p>
          ) : null}
          </div>
        </Card>
      ) : null}

      {/* Confidence / provenance */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-[var(--sg-color-navy)]">
              Confidence: {analysis.confidence.toUpperCase()}
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-[var(--sg-color-text-muted)]">
              {analysis.confidenceReasons.map((r) => (
                <li key={r}>· {r}</li>
              ))}
            </ul>
          </div>
          <HelpCircle
            className="size-5 text-[var(--sg-color-text-muted)]"
            aria-hidden
          />
        </div>
        {analysis.verifiedAt ? (
          <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
            Plan information last checked:{" "}
            {new Date(analysis.verifiedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        ) : null}
        {analysis.unknowns.length > 0 ? (
          <p className="mt-2 text-sm text-[var(--sg-color-warning)]">
            {analysis.unknowns.length} item(s) require verification:{" "}
            {analysis.unknowns.map(requirementLabel).join(", ")}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-[var(--sg-color-text-muted)]">
          Sources: official vendor pricing / plan comparison / documentation
          captured in SoftwareGlimpse research (source ids:{" "}
          {analysis.sourceIds.slice(0, 4).join(", ") || "see product page"}).
        </p>
        <p className="mt-2">
          <Link
            href={`/pricing/${analysis.productSlug}/`}
            className="text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            onClick={() =>
              track({
                name: "crm_plan_external_pricing_clicked",
                properties: { slug: analysis.productSlug },
              })
            }
          >
            View pricing guide
          </Link>
          {" · "}
          <Link
            href={`/software/${analysis.productSlug}/`}
            className="text-sm text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            onClick={() =>
              track({
                name: "crm_plan_vendor_review_clicked",
                properties: { slug: analysis.productSlug },
              })
            }
          >
            Vendor review
          </Link>
        </p>
      </Card>

      {/* Next steps */}
      <section aria-labelledby="next-heading">
        <h3
          id="next-heading"
          className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
        >
          What should you do next?
        </h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              href: "/tools/crm-finder/",
              title: "Compare with another CRM",
              body: "CRM Finder",
            },
            {
              href: "/tools/crm-cost-calculator/",
              title: "Estimate total ownership cost",
              body: "CRM Cost Calculator",
            },
            {
              href: "/tools/crm-roi-calculator/",
              title: "Calculate business value",
              body: "CRM ROI Calculator",
            },
            {
              href: "/tools/crm-rfp-builder/",
              title: "Prepare vendor questions",
              body: "CRM RFP Builder",
            },
            {
              href: "/tools/crm-demo-checklist-builder/",
              title: "Prepare your demo",
              body: "Demo Checklist Builder",
            },
            {
              href: "/tools/crm-readiness-assessment/",
              title: "Check implementation readiness",
              body: "Readiness Assessment",
            },
          ].map((item) => (
            <li key={item.href}>
              <ButtonLink
                href={item.href}
                variant="outline"
                className="h-auto w-full flex-col items-start gap-1 px-4 py-3 text-left whitespace-normal"
              >
                <span className="font-semibold text-[var(--sg-color-navy)]">
                  {item.title}
                </span>
                <span className="text-xs font-normal text-[var(--sg-color-text-muted)]">
                  {item.body}
                </span>
              </ButtonLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function UpgradeDelta({ analysis }: { analysis: PlanSelectorAnalysis }) {
  const nextCost = analysis.planLadder.find(
    (e) => e.plan.slug === analysis.nextPlan!.slug,
  )?.cost;
  if (!nextCost || !analysis.pricingNow) return null;
  const monthly =
    nextCost.monthlyEquivalent.amountMinor -
    analysis.pricingNow.monthlyEquivalent.amountMinor;
  if (monthly <= 0) return null;
  return (
    <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
      Estimated difference: +
      {formatMoney(
        {
          amountMinor: monthly,
          currency: analysis.pricingNow.monthlyEquivalent.currency,
        },
        { maximumFractionDigits: 0 },
      )}
      /month · +
      {formatMoney(
        {
          amountMinor: monthly * 12,
          currency: analysis.pricingNow.monthlyEquivalent.currency,
        },
        { maximumFractionDigits: 0 },
      )}
      /year
    </p>
  );
}
