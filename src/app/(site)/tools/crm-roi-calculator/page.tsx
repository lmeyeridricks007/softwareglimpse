import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CrmRoiFaq,
  CrmRoiMethodology,
  CRM_ROI_FAQ_ITEMS,
} from "@/components/roi";
import { DynamicCrmRoiCalculatorApp } from "@/components/tools/dynamic-tool-apps";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM ROI Calculator | Estimate Return on CRM Investment";
const DESCRIPTION =
  "Estimate CRM ROI using your own costs, productivity assumptions and expected business outcomes — without pretending uncertain benefits are guaranteed.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-roi-calculator/",
  indexable: true,
});

export default function CrmRoiCalculatorPage() {
  const guides = listPublishedLearningGuides("crm");
  const resourceLinks = [
    ...guides
      .filter((g) =>
        /roi|business case|pricing|implementation|cost|choose|tco/i.test(
          `${g.title} ${g.path}`,
        ),
      )
      .slice(0, 6)
      .map((g) => ({ href: g.path, label: g.title })),
    { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
    { href: "/tools/crm-tco-calculator/", label: "CRM TCO Calculator" },
    {
      href: "/resources/crm-business-case-template/",
      label: "CRM Business Case Template",
    },
    { href: "/tools/crm-requirements-builder/", label: "CRM Requirements Builder" },
    { href: "/tools/crm-finder/", label: "CRM Finder" },
    { href: "/tools/crm-vendor-scorecard/", label: "CRM Vendor Scorecard" },
    {
      href: "/tools/crm-implementation-planner/",
      label: "CRM Implementation Planner",
    },
    { href: "/tools/crm-migration-planner/", label: "CRM Migration Planner" },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM ROI Calculator", path: "/tools/crm-roi-calculator/" },
  ];

  const faqLd = faqPageJsonLd(
    CRM_ROI_FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  const trustItems = [
    "Free to use",
    "No signup required",
    "Your assumptions stay explicit",
    "No invented vendor ROI claims",
  ];

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-roi-calculator/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          CRM ROI Calculator
        </h1>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">{DESCRIPTION}</p>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Model the financial case for CRM over 1–3 years, compare costs with
          measurable benefits, test conservative/base/optimistic scenarios, and
          export the results into your CRM business case.
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--sg-color-text)]">
          {trustItems.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <span className="text-[var(--sg-color-success)]" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </header>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading ROI calculator…
          </p>
        }
      >
        <DynamicCrmRoiCalculatorApp
          resourceLinks={resourceLinks}
          title="CRM ROI Calculator"
          description={DESCRIPTION}
          titleElement="none"
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <CrmRoiMethodology />
        <CrmRoiFaq />

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="roi-next-cta"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Next step
          </p>
          <h2
            id="roi-next-cta"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Turn ROI numbers into an approval-ready case
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Export your analysis, then open the CRM Business Case template with
            costs, benefits and assumption confidence already framed.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/resources/crm-business-case-template/">
              CRM Business Case Template
            </ButtonLink>
            <ButtonLink href="/tools/crm-cost-calculator/" variant="secondary">
              Estimate CRM Costs
            </ButtonLink>
            <ButtonLink href="/tools/crm-tco-calculator/" variant="ghost">
              Calculate CRM TCO
            </ButtonLink>
          </div>
        </section>

        <TrustStrip />
        <NewsletterCard />

        <nav aria-label="Related CRM tools and guides">
          <h2 className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Related
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {resourceLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[var(--sg-color-primary)] underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </PageContainer>
  );
}
