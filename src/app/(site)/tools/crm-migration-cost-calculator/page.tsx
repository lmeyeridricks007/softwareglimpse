import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CrmMigrationCostFaq,
  CrmMigrationCostMethodology,
  CRM_MIGRATION_COST_FAQ_ITEMS,
} from "@/components/migration-cost";
import { DynamicCrmMigrationCostCalculatorApp } from "@/components/tools/dynamic-tool-apps";
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
  webApplicationJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Migration Cost Calculator | SoftwareGlimpse";
const DESCRIPTION =
  "Estimate CRM migration costs across data preparation, mapping, integrations, internal effort, testing, cutover and external services.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-migration-cost-calculator/",
  indexable: true,
});

export default function CrmMigrationCostCalculatorPage() {
  const guides = listPublishedLearningGuides("crm");
  const resourceLinks = [
    ...guides
      .filter((g) =>
        /migration|field mapping|implementation cost|data clean|go-live|tco|total cost/i.test(
          `${g.title} ${g.path}`,
        ),
      )
      .slice(0, 6)
      .map((g) => ({ href: g.path, label: g.title })),
    {
      href: "/resources/crm-field-mapping-template/",
      label: "CRM Field Mapping Template",
    },
    {
      href: "/tools/crm-readiness-assessment/",
      label: "CRM Readiness Assessment",
    },
    { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
    { href: "/tools/crm-tco-calculator/", label: "CRM TCO Calculator" },
    { href: "/tools/crm-roi-calculator/", label: "CRM ROI Calculator" },
    {
      href: "/resources/crm-business-case-template/",
      label: "CRM Business Case Template",
    },
    {
      href: "/tools/crm-requirements-builder/",
      label: "CRM Requirements Builder",
    },
    { href: "/tools/crm-rfp-builder/", label: "CRM RFP Builder" },
    {
      href: "/tools/crm-implementation-planner/",
      label: "CRM Implementation Planner",
    },
    { href: "/tools/crm-migration-planner/", label: "CRM Migration Planner" },
    { href: "/best/crm/", label: "Best CRM Software" },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "CRM Migration Cost Calculator",
      path: "/tools/crm-migration-cost-calculator/",
    },
  ];

  const faqLd = faqPageJsonLd(
    CRM_MIGRATION_COST_FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  const trustItems = [
    "Uses your migration scope",
    "Internal + external cost model",
    "Complexity made explicit",
    "No invented vendor pricing",
  ];

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-migration-cost-calculator/",
          }),
          webApplicationJsonLd({
            name: "CRM Migration Cost Calculator",
            description: DESCRIPTION,
            path: "/tools/crm-migration-cost-calculator/",
            applicationCategory: "BusinessApplication",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          CRM Migration Cost Calculator
        </h1>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">
          Estimate what it may cost to move your CRM data, workflows and
          integrations — including internal effort, external services and
          migration risk.
        </p>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Model the cost of migrating from spreadsheets or an existing CRM into
          a new platform. See which parts of the migration drive cost, test
          different scenarios, and export the estimate into your CRM business
          case.
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
            Loading migration cost calculator…
          </p>
        }
      >
        <DynamicCrmMigrationCostCalculatorApp
          resourceLinks={resourceLinks}
          title="CRM Migration Cost Calculator"
          description={DESCRIPTION}
          titleElement="none"
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <CrmMigrationCostMethodology />
        <CrmMigrationCostFaq />

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="mc-next-cta"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Next step
          </p>
          <h2
            id="mc-next-cta"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Turn the estimate into an approval-ready plan
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Export your model, then open the CRM Business Case or TCO calculator
            with migration costs already framed — after you confirm the handoff.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/resources/crm-business-case-template/">
              CRM Business Case Template
            </ButtonLink>
            <ButtonLink
              href="/tools/crm-tco-calculator/"
              variant="secondary"
            >
              Calculate CRM TCO
            </ButtonLink>
            <ButtonLink
              href="/tools/crm-migration-planner/"
              variant="ghost"
            >
              CRM Migration Planner
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
