import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { getCrmPricingHistory } from "@/data/research/pricing-history";
import {
  analyzeCategoryPriceChanges,
  listCrmStartingPriceHistory,
} from "@/services/pricing-history";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";
import {
  buildCrmPricingResearchReport,
  CRM_PRICING_REPORT,
} from "@/services/research-reports";
import { COMPANY_ROUTES } from "@/services/site-foundation";

const TITLE = "SoftwareGlimpse Research";
const DESCRIPTION =
  "Original software buying intelligence from SoftwareGlimpse catalogue data — pricing benchmarks, category analysis, and transparent methodology. Not a generic blog.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/research/",
  indexable: true,
  pageType: "resource",
});

export default function ResearchHubPage() {
  const crmReport = buildCrmPricingResearchReport();
  const history = getCrmPricingHistory();
  const historyRows = listCrmStartingPriceHistory();
  const crmChanges = analyzeCategoryPriceChanges("crm");

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research/" },
          ]),
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/research/",
            dateModified: crmReport.observationDate,
          }),
        ]}
      />

      <Section padding="md" background="surface" container="narrow">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Research
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--sg-color-navy)] sm:text-4xl">
          SoftwareGlimpse Research
        </h1>
        <p className="mt-4 text-[var(--sg-color-text-muted)]">
          Citation-worthy analysis derived from our structured product and
          pricing catalogue. Every published statistic records dataset, sample
          size, observation date, and calculation logic — we do not invent
          market averages.
        </p>
      </Section>

      <Section padding="md" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Latest research
        </h2>
        <ul className="mt-6 space-y-4">
          <li className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              Flagship report
            </p>
            <Link
              href={CRM_PRICING_REPORT.path}
              className="mt-2 block font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)] underline-offset-2 hover:underline"
            >
              {CRM_PRICING_REPORT.title}
            </Link>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {crmReport.sample.usdProductsWithPlans} USD CRM products · median
              starting price{" "}
              {crmReport.metrics.medianStartingPriceMonthlyUsd != null
                ? `$${crmReport.metrics.medianStartingPriceMonthlyUsd}/mo`
                : "—"}{" "}
              · observed {crmReport.observationDate}
            </p>
          </li>
        </ul>
      </Section>

      <Section padding="md" background="surface" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Pricing intelligence
        </h2>
        <ul className="mt-6 space-y-4">
          <li className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-4">
            <Link
              href={CRM_PRICING_REPORT.path}
              className="font-semibold text-[var(--sg-color-navy)] underline-offset-2 hover:underline"
            >
              CRM pricing benchmarks
            </Link>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Medians, free-plan share, annual discounts, distribution table +
              CSV.
            </p>
          </li>
          <li className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-4">
            <Link
              href="/research/crm-pricing-history/"
              className="font-semibold text-[var(--sg-color-navy)] underline-offset-2 hover:underline"
            >
              CRM starting price history
            </Link>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              {history.description} {historyRows.length} observations in store
              ({history.snapshots.length} legacy crm.json seeds). Products with
              ≥2 starting-price points: {crmChanges.sampleProductsWithHistory} ·
              increases {crmChanges.increases.length} · decreases{" "}
              {crmChanges.decreases.length}.
            </p>
          </li>
        </ul>
      </Section>

      <Section padding="md" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Software categories
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Research currently focuses on CRM, where catalogue pricing enrichment
          is dense enough for legitimate statistics. Other categories will be
          added when sample completeness supports them.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link
              href="/categories/crm/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM category hub
            </Link>
          </li>
          <li>
            <Link
              href="/best/crm-software/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Best CRM software
            </Link>
          </li>
        </ul>
      </Section>

      <Section padding="md" background="surface" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Data & methodology
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Each report documents dataset ID, sample definition, calculation
          logic, limitations, and last updated date. Site-wide editorial
          standards:
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link
              href={COMPANY_ROUTES.howWeReview}
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              How we review software
            </Link>
          </li>
          <li>
            <Link
              href={COMPANY_ROUTES.methodology}
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Editorial methodology
            </Link>
          </li>
          <li>
            <Link
              href="/research/crm-pricing/#research-methodology-heading"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM pricing report methodology
            </Link>
          </li>
        </ul>
      </Section>

      <Section padding="md" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Reports
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link
              href={CRM_PRICING_REPORT.path}
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {CRM_PRICING_REPORT.title}
            </Link>
          </li>
          <li>
            <Link
              href="/research/crm-pricing-history/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM starting price history dataset
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
