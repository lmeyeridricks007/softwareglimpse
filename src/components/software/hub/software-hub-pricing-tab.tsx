"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AffiliateCta } from "@/components/affiliate/affiliate-cta";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "@/components/outbound/external-link";
import {
  SoftwareHubFinderCta,
} from "@/components/software/hub/software-hub-sidebar";
import { SoftwareTeamCostEstimator } from "@/components/software/software-team-cost-estimator";
import type { CurrencyCode } from "@/domain";
import { resolvePlanDisplayPrice } from "@/services/pricing";
import type { ResolvedAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import { resolveProductOfficialLinks } from "@/services/outbound/resolve-product-links";
import type { SoftwareReviewModel } from "@/services/software-review";
import { softwareHubPath } from "@/services/software-review/hub-tabs";
import { cn } from "@/lib/cn";

type Props = {
  model: SoftwareReviewModel;
  affiliateLink?: ResolvedAffiliateLink | null;
};

export function SoftwareHubPricingTab({ model, affiliateLink }: Props) {
  const software = model.software;
  const pricing = model.pricing;
  const [annual, setAnnual] = useState(true);
  const officialLinks = resolveProductOfficialLinks(software);
  const pricingSourceUrl = officialLinks.pricing;

  const plans = pricing?.plans ?? [];
  const currency = (pricing?.currency ?? "USD") as CurrencyCode;
  const highlightSlug =
    model.highlightedPlanSlug ??
    model.deepReview.planRecommendations.find((p) =>
      p.planSlug.includes("growth"),
    )?.planSlug ??
    plans[1]?.slug;

  const teamCostPlans = plans.map((plan) => {
    const priced = resolvePlanDisplayPrice(plan, currency, true);
    return {
      slug: plan.slug,
      name: plan.name,
      amountPerSeatMonthly: priced.amount,
      contactSales: plan.contactSales,
    };
  });

  const everyPlanIncludes = useMemo(() => {
    const support = model.enrichment?.featureSupport ?? [];
    return support
      .filter(
        (f) =>
          f.availability === "supported" &&
          (f.planSlugs.length === 0 ||
            plans.every((p) => f.planSlugs.includes(p.slug))),
      )
      .map((f) => {
        const name = model.features.find((x) => x.slug === f.featureSlug)?.name;
        return name ?? f.featureSlug.replace(/-/g, " ");
      })
      .slice(0, 8);
  }, [model.enrichment?.featureSupport, model.features, plans]);

  const addOns = useMemo(() => {
    return (model.enrichment?.featureSupport ?? [])
      .filter((f) => f.availability === "add-on")
      .map((f) => {
        const name = model.features.find((x) => x.slug === f.featureSlug)?.name;
        return {
          slug: f.featureSlug,
          name: name ?? f.featureSlug.replace(/-/g, " "),
          notes: f.notes ?? null,
        };
      });
  }, [model.enrichment?.featureSupport, model.features]);

  if (!pricing || plans.length === 0) {
    return (
      <Card className="p-6 text-sm text-[var(--sg-color-text-muted)]">
        Structured pricing coverage is not available for {software.name} yet.
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0 space-y-10">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
              {software.name} plans & pricing
            </h2>
            <label className="inline-flex items-center gap-2 text-sm text-[var(--sg-color-text-muted)]">
              <span>Show annual prices</span>
              <button
                type="button"
                role="switch"
                aria-checked={annual}
                onClick={() => setAnnual((v) => !v)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors",
                  annual
                    ? "bg-[var(--sg-color-primary)]"
                    : "bg-[var(--sg-color-border-strong)]",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                    annual ? "left-5" : "left-0.5",
                  )}
                />
              </button>
            </label>
          </div>
          {model.pricingNotes ? (
            <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
              {model.pricingNotes}
            </p>
          ) : null}
          {pricingSourceUrl ? (
            <p className="mt-2 text-sm">
              <ExternalLink href={pricingSourceUrl} type="pricing-source">
                {software.name} pricing documentation
              </ExternalLink>
              {software.pricingVerifiedAt ? (
                <span className="ml-2 text-xs text-[var(--sg-color-text-muted)]">
                  Verified {software.pricingVerifiedAt.slice(0, 10)}
                </span>
              ) : null}
            </p>
          ) : null}

          <div
            className={cn(
              "mt-6 grid gap-4",
              plans.length >= 4
                ? "sm:grid-cols-2 xl:grid-cols-4"
                : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {plans.map((plan, index) => {
              const priced = resolvePlanDisplayPrice(plan, currency, annual);
              const highlighted = plan.slug === highlightSlug;
              const prev = plans[index - 1];
              const rec = model.deepReview.planRecommendations.find(
                (p) => p.planSlug === plan.slug,
              );
              return (
                <Card
                  key={plan.slug}
                  className={cn(
                    "relative flex h-full flex-col p-5",
                    highlighted &&
                      "border-[var(--sg-color-primary)] ring-1 ring-[var(--sg-color-primary)]/30",
                  )}
                >
                  {highlighted ? (
                    <Badge
                      variant="primary"
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2"
                    >
                      Most popular
                    </Badge>
                  ) : null}
                  <h3 className="text-lg font-semibold text-[var(--sg-color-text)]">
                    {plan.name}
                  </h3>
                  <div className="mt-3">
                    <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-[var(--sg-color-text)]">
                      {priced.contact ? "Custom" : priced.priceLabel}
                    </p>
                    <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                      {priced.unitLabel}
                    </p>
                  </div>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
                    {prev ? (
                      <li className="font-medium text-[var(--sg-color-text)]">
                        Everything in {prev.name}, plus:
                      </li>
                    ) : null}
                    {(rec?.bestFor ?? rec?.chooseIf ?? [])
                      .slice(0, 5)
                      .map((line) => (
                        <li key={line} className="flex gap-2">
                          <span
                            className="text-[var(--sg-color-success)]"
                            aria-hidden
                          >
                            ✓
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    {!rec && plan.description ? (
                      <li>{plan.description}</li>
                    ) : null}
                  </ul>
                  <div className="mt-5">
                    {affiliateLink ? (
                      <AffiliateCta
                        link={affiliateLink}
                        label={
                          pricing.hasFreeTrial
                            ? "Try free for 14 days"
                            : `Visit ${software.name}`
                        }
                        className="w-full justify-center"
                        showDisclosure={false}
                      />
                    ) : software.website ? (
                      <ButtonLink
                        href={software.website}
                        variant={highlighted ? "primary" : "outline"}
                        className="w-full"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit {software.name}
                      </ButtonLink>
                    ) : null}
                    <Link
                      href={softwareHubPath(software.slug, "features")}
                      className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      See all features →
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {model.planSelectorHref ? (
          <Card className="border-[var(--sg-color-primary)]/25 bg-[var(--sg-color-primary-soft)]/30 p-5">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
              Which {software.name} plan do you need?
            </h2>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              Answer a few questions and find the lowest plan that meets your
              must-have requirements.
            </p>
            <ButtonLink
              href={model.planSelectorHref}
              className="mt-4"
              size="md"
            >
              Find my {software.name} plan →
            </ButtonLink>
          </Card>
        ) : null}

        <SoftwareTeamCostEstimator
          productName={software.name}
          plans={teamCostPlans}
          calculatorHref={model.costCalculatorHref}
          currency={currency}
        />

        {model.pricingCompareColumns.length > 1 ? (
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
              {software.name} pricing compared
            </h2>
            <div className="mt-4 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--sg-color-surface-muted)] text-[var(--sg-color-text-muted)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Metric</th>
                    {model.pricingCompareColumns.map((col) => (
                      <th key={col.slug} className="px-4 py-3 font-medium">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {model.pricingCompareRows.map((row) => (
                    <tr
                      key={row.label}
                      className="border-t border-[var(--sg-color-border)]"
                    >
                      <th className="px-4 py-3 font-medium text-[var(--sg-color-text)]">
                        {row.label}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={`${row.label}-${i}`}
                          className="px-4 py-3 text-[var(--sg-color-text-muted)]"
                        >
                          {value ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href={softwareHubPath(software.slug, "comparisons")}
              className="mt-3 inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              See full comparison →
            </Link>
          </section>
        ) : null}
      </div>

      <aside className="space-y-5">
        {everyPlanIncludes.length > 0 ? (
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
              What&apos;s included in every plan
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[var(--sg-color-text-muted)]">
              {everyPlanIncludes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--sg-color-success)]" aria-hidden>
                    ✓
                  </span>
                  <span className="capitalize">{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {addOns.length > 0 ? (
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-[var(--sg-color-text)]">
              Need more?
            </h2>
            <ul className="mt-3 space-y-3 text-sm">
              {addOns.map((addon) => (
                <li key={addon.slug}>
                  <p className="font-medium text-[var(--sg-color-text)]">
                    {addon.name}
                  </p>
                  <p className="text-[var(--sg-color-text-muted)]">
                    {addon.notes ?? "Available as an add-on on some plans."}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        ) : null}

        {model.finderHref ? (
          <SoftwareHubFinderCta
            title="Not sure which plan is right?"
            href={model.finderHref}
            ctaLabel={model.finderLabel}
          />
        ) : null}

        {model.pricingPageHref?.startsWith("/pricing/") ? (
          <ButtonLink
            href={model.pricingPageHref}
            variant="outline"
            className="w-full"
          >
            View full cost breakdown
          </ButtonLink>
        ) : null}
      </aside>
    </div>
  );
}
