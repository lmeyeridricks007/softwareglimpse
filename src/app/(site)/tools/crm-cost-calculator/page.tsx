import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DynamicCrmCostCalculatorApp } from "@/components/tools/dynamic-tool-apps";
import { PricingMethodology } from "@/components/pricing/pricing-methodology";
import { WhyPricesDiffer } from "@/components/pricing/why-prices-differ";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { PageContainer } from "@/components/layout/page-container";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Cost Calculator";
const DESCRIPTION =
  "Calculate the total cost of CRM software for your business. Compare verified plan pricing across tools — affiliate relationships never change the numbers.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-cost-calculator/",
  indexable: true,
});

export default function CrmCostCalculatorPage() {
  const snapshots = listCrmPricingSnapshots();
  const resourceLinks = [
    ...listPublishedLearningGuides("crm").slice(0, 4).map((g) => ({
      href: g.path,
      label: g.title,
    })),
    { href: "/best/crm-software/", label: "Best CRM software" },
    { href: "/tools/crm-finder/", label: "CRM Software Finder" },
    { href: "/pricing/", label: "Product pricing pages" },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM Cost Calculator", path: "/tools/crm-cost-calculator/" },
  ];

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-cost-calculator/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading calculator…
          </p>
        }
      >
        <DynamicCrmCostCalculatorApp
          snapshots={snapshots}
          resourceLinks={resourceLinks}
          title={TITLE}
          description={DESCRIPTION}
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <WhyPricesDiffer />
        <PricingMethodology />

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="finder-cta-heading"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Ready to find the right CRM?
          </p>
          <h2
            id="finder-cta-heading"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Cost is only one part of the decision
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Answer a few questions and we’ll compare CRM products based on your
            team, requirements, integrations and budget.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/tools/crm-finder/" size="lg">
              Find My CRM
            </ButtonLink>
            <ButtonLink href="/compare/" variant="outline" size="lg">
              Compare CRM software
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
