import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { ResearchBarChart } from "@/components/research/research-bar-chart";
import { ResearchCitationBlock } from "@/components/research/research-citation-block";
import { ResearchMethodologySection } from "@/components/research/research-methodology-section";
import { ResearchStatGrid } from "@/components/research/research-stat-grid";
import { getSiteUrl } from "@/lib/site";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  articleJsonLd,
  breadcrumbJsonLd,
  datasetJsonLd,
} from "@/seo/structured-data";
import {
  buildCrmPricingResearchReport,
  CRM_PRICING_REPORT,
} from "@/services/research-reports";
import {
  COMPANY_ROUTES,
  getFounderAuthor,
} from "@/services/site-foundation";
import { InternalLinkingModules } from "@/components/internal-linking";
import { buildInjectionOnlyLinkPlan } from "@/services/internal-linking";

const report = buildCrmPricingResearchReport();
const founder = getFounderAuthor();

const DESCRIPTION = `Original SoftwareGlimpse analysis of ${report.sample.usdProductsWithPlans} USD CRM products with researched list pricing — medians, free-plan share, annual billing discounts, and distribution. Catalog-derived, not invented market averages.`;

export const metadata: Metadata = buildPageMetadata({
  title: CRM_PRICING_REPORT.title,
  description: DESCRIPTION.slice(0, 320),
  path: CRM_PRICING_REPORT.path,
  indexable: true,
  pageType: "resource",
});

function money(n: number | null): string {
  if (n == null) return "—";
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

export default function CrmPricingResearchPage() {
  const stats = [
    {
      label: "CRM products analyzed",
      value: String(report.sample.primaryCrmProducts),
      hint: "Primary CRM category catalogue",
      sampleSize: report.sample.primaryCrmProducts,
    },
    {
      label: "Median starting price",
      value: `${money(report.metrics.medianStartingPriceMonthlyUsd)}/mo`,
      hint: "USD startingPriceMonthly",
      sampleSize: report.sample.usdWithStartingPrice,
    },
    {
      label: "Median entry seat price",
      value: `${money(report.metrics.medianEntryMonthlySeatUsd)}/user/mo`,
      hint: "Cheapest paid monthly seat rule",
      sampleSize: report.sample.productsWithMonthlySeatRule,
    },
    ...(report.metrics.freePlanSharePct != null
      ? [
          {
            label: "Offer a free plan",
            value: `${report.metrics.freePlanSharePct}%`,
            hint: "USD products with plans",
            sampleSize: report.sample.usdProductsWithPlans,
          },
        ]
      : []),
    ...(report.metrics.freeTrialSharePct != null
      ? [
          {
            label: "Offer a free trial",
            value: `${report.metrics.freeTrialSharePct}%`,
            hint: "USD products with plans",
            sampleSize: report.sample.usdProductsWithPlans,
          },
        ]
      : []),
    ...(report.metrics.medianAnnualDiscountPct != null
      ? [
          {
            label: "Median annual billing discount",
            value: `${report.metrics.medianAnnualDiscountPct}%`,
            hint: "Products with month+year seat pairs",
            sampleSize: report.sample.productsWithAnnualDiscountPair,
          },
        ]
      : []),
  ];

  const distributionData = report.startingPriceDistribution
    .filter((b) => b.count > 0)
    .map((b) => ({
      id: b.id,
      label: b.label,
      value: b.count,
      displayValue: String(b.count),
    }));

  const freeVsPaid = [
    {
      id: "free",
      label: "Has free plan",
      value: report.sample.productsWithFreePlan,
      displayValue: String(report.sample.productsWithFreePlan),
    },
    {
      id: "paid-only",
      label: "No free plan",
      value:
        report.sample.usdProductsWithPlans - report.sample.productsWithFreePlan,
      displayValue: String(
        report.sample.usdProductsWithPlans - report.sample.productsWithFreePlan,
      ),
    },
  ];

  const absoluteUrl = `${getSiteUrl()}${CRM_PRICING_REPORT.path}`;
  const csvPath = `${CRM_PRICING_REPORT.path}download/`;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Research", path: "/research/" },
            { name: CRM_PRICING_REPORT.shortTitle, path: CRM_PRICING_REPORT.path },
          ]),
          articleJsonLd({
            headline: CRM_PRICING_REPORT.title,
            description: DESCRIPTION,
            path: CRM_PRICING_REPORT.path,
            datePublished: report.observationDate,
            dateModified: report.observationDate,
            authorName: founder?.name,
            authorPath: founder ? COMPANY_ROUTES.myStory : undefined,
          }),
          datasetJsonLd({
            name: CRM_PRICING_REPORT.title,
            description: DESCRIPTION,
            path: CRM_PRICING_REPORT.path,
            datePublished: report.observationDate,
            dateModified: report.observationDate,
            creatorName: "SoftwareGlimpse",
            distributionUrl: csvPath,
            measurementTechnique:
              "Catalog list-price extraction from vendor research enrichment",
            variableMeasured: [
              "startingPriceMonthly",
              "entryMonthlySeat",
              "hasFreePlan",
              "hasFreeTrial",
              "annualDiscountPct",
            ],
          }),
        ]}
      />

      <Section padding="md" background="surface" container="narrow">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
          Pricing intelligence
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--sg-color-navy)] sm:text-4xl">
          {CRM_PRICING_REPORT.title}
        </h1>
        <p className="mt-4 text-[var(--sg-color-text-muted)]">
          Original analysis of SoftwareGlimpse CRM catalogue list prices.
          Statistics are calculated from stored research enrichment — not survey
          panels, not invented market averages.
        </p>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Dataset <code className="text-xs">{report.dataset}</code> · Sample{" "}
          {report.sample.usdProductsWithPlans} USD CRM products with plans ·
          Observation date {report.observationDate}
          {founder ? (
            <>
              {" "}
              · Editor{" "}
              <Link
                href={COMPANY_ROUTES.myStory}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {founder.name}
              </Link>
            </>
          ) : null}
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href={csvPath}
            className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-2 font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)]"
          >
            Download CSV
          </Link>
          <Link
            href="/tools/crm-cost-calculator/"
            className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            CRM Cost Calculator
          </Link>
          <Link
            href="/research/crm-pricing-history/"
            className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Starting price history
          </Link>
        </div>
      </Section>

      <Section padding="md" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Key findings
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Each figure shows its sample size. Metrics without enough structured
          rows are omitted.
        </p>
        <ResearchStatGrid className="mt-6" stats={stats} />
      </Section>

      <Section padding="md" background="surface" container="narrow">
        <div className="space-y-8">
          <ResearchBarChart
            title="Starting price distribution (USD / month)"
            description="Count of primary CRM products by published startingPriceMonthly."
            data={distributionData}
            source="SoftwareGlimpse CRM catalogue enrichment"
            sampleSize={report.sample.usdWithStartingPrice}
            observationDate={report.observationDate}
          />
          <ResearchBarChart
            title="Free plan availability"
            description="USD CRM products with researched plans."
            data={freeVsPaid}
            source="SoftwareGlimpse CRM catalogue enrichment"
            sampleSize={report.sample.usdProductsWithPlans}
            observationDate={report.observationDate}
          />
        </div>
      </Section>

      <Section padding="md" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          What the numbers mean for buyers
        </h2>
        <div className="mt-4 space-y-4 text-[var(--sg-color-text-muted)]">
          <p>
            Among {report.sample.usdWithStartingPrice} USD CRM products with a
            published starting list price, the median starting price is{" "}
            <strong className="text-[var(--sg-color-text)]">
              {money(report.metrics.medianStartingPriceMonthlyUsd)}/month
            </strong>
            {report.metrics.startingPriceMinUsd != null &&
            report.metrics.startingPriceMaxUsd != null
              ? ` (range ${money(report.metrics.startingPriceMinUsd)}–${money(report.metrics.startingPriceMaxUsd)})`
              : null}
            .
          </p>
          {report.metrics.medianEntryMonthlySeatUsd != null ? (
            <p>
              Where monthly per-seat rules exist (n=
              {report.sample.productsWithMonthlySeatRule}), the median cheapest
              paid seat is{" "}
              <strong className="text-[var(--sg-color-text)]">
                {money(report.metrics.medianEntryMonthlySeatUsd)}/user/month
              </strong>{" "}
              billed monthly.
            </p>
          ) : null}
          {report.metrics.freePlanSharePct != null ? (
            <p>
              {report.metrics.freePlanSharePct}% of USD CRM products in this
              sample advertise a free plan. That does not mean the free tier
              covers your required features — check plan limits on each product
              page.
            </p>
          ) : null}
          {report.metrics.medianAnnualDiscountPct != null ? (
            <p>
              For the{" "}
              {report.sample.productsWithAnnualDiscountPair} products with both
              monthly and annual per-seat list prices on the same plan, the
              median list-price discount for annual billing is{" "}
              <strong className="text-[var(--sg-color-text)]">
                {report.metrics.medianAnnualDiscountPct}%
              </strong>
              .
            </p>
          ) : null}
        </div>

        <div className="mt-8 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Starting / mo</th>
                <th className="px-4 py-3">Entry seat / mo</th>
                <th className="px-4 py-3">Free</th>
                <th className="px-4 py-3">Annual disc.</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr
                  key={row.productSlug}
                  className="border-t border-[var(--sg-color-border)]"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/software/${row.productSlug}/`}
                      className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                    >
                      {row.productName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.startingPriceMonthly == null
                      ? "—"
                      : money(row.startingPriceMonthly)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.entryMonthlySeat == null
                      ? "—"
                      : money(row.entryMonthlySeat)}
                  </td>
                  <td className="px-4 py-3">
                    {row.hasFreePlan ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {row.annualDiscountPct == null
                      ? "—"
                      : `${row.annualDiscountPct}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section padding="md" background="surface" container="narrow">
        <ResearchMethodologySection>
          <div className="space-y-4 text-sm text-[var(--sg-color-text-muted)]">
            <div>
              <h3 className="font-medium text-[var(--sg-color-text)]">
                Data collection
              </h3>
              <p className="mt-1">
                Vendor list pricing is stored in SoftwareGlimpse research
                enrichment records during product research, with source
                provenance and verification timestamps where available.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--sg-color-text)]">
                Sample definition
              </h3>
              <p className="mt-1">
                Primary CRM products in the live catalogue (
                {report.sample.primaryCrmProducts}). Price statistics use the
                USD subset with structured plans (
                {report.sample.usdProductsWithPlans}).
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--sg-color-text)]">
                Calculation logic
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {report.calculationLogic.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-[var(--sg-color-text)]">
                Limitations
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {report.limitations.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <p>
              Methodology version {report.methodologyVersion}. Last updated{" "}
              {report.observationDate}. Editorial process:{" "}
              <Link
                href={COMPANY_ROUTES.howWeReview}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                How we review
              </Link>
              .
            </p>
          </div>
        </ResearchMethodologySection>

        <ResearchCitationBlock
          className="mt-8"
          reportName={CRM_PRICING_REPORT.title}
          year={CRM_PRICING_REPORT.year}
          url={absoluteUrl}
        />
      </Section>

      <Section padding="md" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Related decision pages
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link
              href="/best/crm-software/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Best CRM software
            </Link>
          </li>
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
              href="/tools/crm-cost-calculator/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM Cost Calculator
            </Link>
          </li>
          <li>
            <Link
              href="/tools/crm-finder/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM Finder
            </Link>
          </li>
          <li>
            <Link
              href="/research/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              All research
            </Link>
          </li>
        </ul>
      </Section>

      <Section padding="md" background="surface" container="wide">
        <InternalLinkingModules
          plan={buildInjectionOnlyLinkPlan("/research/crm-pricing/", "hub")}
          showParentInline={false}
        />
      </Section>
    </>
  );
}
