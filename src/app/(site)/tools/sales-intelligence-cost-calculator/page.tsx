import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DynamicSiCostCalculatorApp } from "@/components/tools/dynamic-tool-apps";
import { PricingMethodology } from "@/components/pricing/pricing-methodology";
import { WhyPricesDiffer } from "@/components/pricing/why-prices-differ";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { listSalesIntelligencePricingSnapshots } from "@/services/pricing/server";
import { isCalculablePlan } from "@/services/pricing";
import { SI_COST_CALCULATOR_CONFIG } from "@/components/pricing/cost-calculator-config";
import { PageContainer } from "@/components/layout/page-container";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "Sales Intelligence Cost Calculator";
const DESCRIPTION =
  "Estimate seat-based sales intelligence costs from verified public pricing. Credit packs and custom quotes stay unknown — we never invent credit dollar totals. Affiliate relationships never change the numbers.";

function siPricingIsThin(
  snapshots: ReturnType<typeof listSalesIntelligencePricingSnapshots>,
): boolean {
  const calculable = snapshots.filter((s) =>
    (s.pricing?.plans ?? []).some(isCalculablePlan),
  ).length;
  return calculable < 3;
}

const snapshots = listSalesIntelligencePricingSnapshots();
const thinCoverage = siPricingIsThin(snapshots);

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-cost-calculator/",
  indexable: !thinCoverage,
});

export default function SalesIntelligenceCostCalculatorPage() {
  const resourceLinks = [
    ...listPublishedLearningGuides("sales-intelligence")
      .slice(0, 4)
      .map((g) => ({
        href: g.path,
        label: g.title,
      })),
    {
      href: "/best/sales-intelligence-software/",
      label: "Best sales intelligence software",
    },
    {
      href: "/tools/sales-intelligence-finder/",
      label: "Sales Intelligence Finder",
    },
    {
      href: "/tools/sales-intelligence-plan-selector/",
      label: "SI Plan Selector",
    },
    { href: "/pricing/", label: "Product pricing pages" },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "Sales Intelligence Cost Calculator",
      path: "/tools/sales-intelligence-cost-calculator/",
    },
  ];

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/sales-intelligence-cost-calculator/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <p
        className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]"
        role="note"
      >
        <strong className="font-medium text-[var(--sg-color-text)]">
          Partial pricing coverage.
        </strong>{" "}
        Seat and subscription list prices are estimated when verified. Credit
        packs, contact credits, and custom quotes remain unknown / quote-required
        — we never invent credit dollar totals.
      </p>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading calculator…
          </p>
        }
      >
        <DynamicSiCostCalculatorApp
          snapshots={snapshots}
          resourceLinks={resourceLinks}
          title={TITLE}
          description={DESCRIPTION}
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-6 py-8 sm:px-8"
          aria-labelledby="credits-honesty-heading"
        >
          <h2
            id="credits-honesty-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            About credits and usage pricing
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Many sales intelligence products charge for contact credits,
            enrichment credits, or export packs in addition to seats. This
            calculator only totals{" "}
            <strong className="font-medium text-[var(--sg-color-text)]">
              verified seat / subscription list pricing
            </strong>
            . Credit burn, overages, and quote-only tiers are marked unknown —
            we do not invent dollar totals for credits.
          </p>
        </section>

        <WhyPricesDiffer productNoun={SI_COST_CALCULATOR_CONFIG.productNoun} />
        <PricingMethodology productNoun={SI_COST_CALCULATOR_CONFIG.productNoun} />

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="finder-cta-heading"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Ready to shortlist tools?
          </p>
          <h2
            id="finder-cta-heading"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Cost is only one part of the decision
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Answer a few questions and we’ll compare sales intelligence products
            based on your outbound job, coverage needs and budget.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/tools/sales-intelligence-finder/" size="lg">
              Find My Tool
            </ButtonLink>
            <ButtonLink
              href="/tools/sales-intelligence-plan-selector/"
              variant="outline"
              size="lg"
            >
              Plan selector
            </ButtonLink>
          </div>
        </section>

        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Related resources
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {resourceLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
        Estimates use verified public pricing captured in SoftwareGlimpse
        research — not negotiated quotes.{" "}
        <strong className="font-medium text-[var(--sg-color-text)]">
          Affiliate relationships do not affect costs or sort order.
        </strong>{" "}
        <Link
          href="/company/editorial-methodology/"
          className="underline underline-offset-2"
        >
          How we evaluate
        </Link>
      </p>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" hideWhenDisabled />
        <TrustStrip />
      </section>
    </PageContainer>
  );
}
