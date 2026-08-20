import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CrmTcoFaq,
  CrmTcoMethodology,
  CRM_TCO_FAQ_ITEMS,
} from "@/components/tco";
import { DynamicCrmTcoCalculatorApp } from "@/components/tools/dynamic-tool-apps";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { listCrmScorecardProductOptions } from "@/services/vendor-scorecard/server";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM TCO Calculator | Calculate Total CRM Ownership Cost";
const DESCRIPTION =
  "Estimate the total cost of CRM ownership, including software, implementation, migration, integrations, training, administration and support.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-tco-calculator/",
  indexable: true,
});

export default function CrmTcoCalculatorPage() {
  const snapshots = listCrmPricingSnapshots();
  const productOptions = listCrmScorecardProductOptions().map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
  }));

  const guides = listPublishedLearningGuides("crm");
  const resourceLinks = [
    ...guides
      .filter((g) =>
        /pricing|implementation|migration|cost|choose|tco/i.test(
          `${g.title} ${g.path}`,
        ),
      )
      .slice(0, 6)
      .map((g) => ({ href: g.path, label: g.title })),
    { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
    { href: "/tools/crm-vendor-scorecard/", label: "CRM Vendor Scorecard" },
    { href: "/tools/crm-finder/", label: "CRM Software Finder" },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM TCO Calculator", path: "/tools/crm-tco-calculator/" },
  ];

  const faqLd = faqPageJsonLd(
    CRM_TCO_FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-tco-calculator/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Calculate the true cost of CRM ownership
        </h1>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">{DESCRIPTION}</p>
      </header>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading TCO calculator…
          </p>
        }
      >
        <DynamicCrmTcoCalculatorApp
          snapshots={snapshots}
          productOptions={productOptions}
          resourceLinks={resourceLinks}
          title="Calculate the true cost of CRM ownership"
          description={DESCRIPTION}
          titleElement="none"
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <CrmTcoMethodology />
        <CrmTcoFaq />

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="tco-next-cta"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            TCO is one criterion
          </p>
          <h2
            id="tco-next-cta"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Cost is only part of the CRM decision
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Use the Vendor Scorecard to weigh fit, features and evidence alongside
            ownership cost — affiliate status never changes the outcome.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/tools/crm-vendor-scorecard/?from=tco" size="lg">
              Open Vendor Scorecard
            </ButtonLink>
            <ButtonLink
              href="/tools/crm-cost-calculator/?from=tco"
              variant="outline"
              size="lg"
            >
              View software-only pricing
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
        Software licence costs use verified public pricing. Implementation,
        migration and consultancy stay unknown unless you supply an estimate.{" "}
        <strong className="font-medium text-[var(--sg-color-text)]">
          Affiliate relationships do not affect costs or ordering.
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
