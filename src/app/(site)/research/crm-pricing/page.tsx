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
  listCrmPricingChartSpecs,
} from "@/services/research-reports";
import {
  COMPANY_ROUTES,
  LEGAL_ROUTES,
  getFounderAuthor,
} from "@/services/site-foundation";
import { InternalLinkingModules } from "@/components/internal-linking";
import { buildInjectionOnlyLinkPlan } from "@/services/internal-linking";

const report = buildCrmPricingResearchReport();
const founder = getFounderAuthor();

const DESCRIPTION = `Original SoftwareGlimpse analysis of ${report.sample.usdProductsWithPlans} USD CRM products with researched list pricing — medians, means, free-plan share, annual billing discounts, and pricing transparency. Catalog-derived, not invented market averages.`;

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

function segmentLabel(segment: string): string {
  if (segment === "small-business") return "Small business";
  if (segment === "mid-market") return "Mid-market";
  if (segment === "enterprise") return "Enterprise";
  if (segment === "micro") return "Micro";
  return segment;
}

export default function CrmPricingResearchPage() {
  const executive = report.executiveFindingIds
    .map((id) => report.statistics.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => s != null);
  const highStartingOutliers = report.outliers.filter(
    (item) =>
      item.metric === "startingPriceMonthly" && item.direction === "high",
  );

  const stats = [
    {
      label: "CRM products analyzed",
      value: String(report.sample.primaryCrmProducts),
      hint: "Primary CRM category catalogue",
      sampleSize: report.sample.primaryCrmProducts,
    },
    {
      label: "USD products with plans",
      value: String(report.sample.usdProductsWithPlans),
      hint: "Price statistics use this subset",
      sampleSize: report.sample.usdProductsWithPlans,
    },
    {
      label: "Median starting price",
      value: `${money(report.metrics.medianStartingPriceMonthlyUsd)}/mo`,
      hint: "USD startingPriceMonthly",
      sampleSize: report.sample.usdWithStartingPrice,
    },
    {
      label: "Mean starting price",
      value: `${money(report.metrics.meanStartingPriceMonthlyUsd)}/mo`,
      hint: "Same sample as the median",
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
    ...(report.metrics.contactSalesPlanSharePct != null
      ? [
          {
            label: "List a contact-sales plan",
            value: `${report.metrics.contactSalesPlanSharePct}%`,
            hint: "USD products with plans",
            sampleSize: report.sample.usdProductsWithPlans,
          },
        ]
      : []),
    ...(report.metrics.publicPricedPlanSharePct != null
      ? [
          {
            label: "Public priced plan",
            value: `${report.metrics.publicPricedPlanSharePct}%`,
            hint: "At least one non-quote plan with rules",
            sampleSize: report.sample.usdProductsWithPlans,
          },
        ]
      : []),
  ];

  const distributionData = report.startingPriceDistribution.map((b) => ({
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

  const annualDiscountData = report.annualDiscountDistribution.map((b) => ({
    id: b.id,
    label: b.label,
    value: b.count,
    displayValue: String(b.count),
  }));

  const transparencyData = [
    {
      id: "public",
      label: "Public priced plan",
      value: report.sample.productsWithPublicPricedPlan,
      displayValue: String(report.sample.productsWithPublicPricedPlan),
    },
    {
      id: "contact",
      label: "Contact-sales plan",
      value: report.sample.productsWithContactSalesPlan,
      displayValue: String(report.sample.productsWithContactSalesPlan),
    },
    {
      id: "no-start",
      label: "No starting price",
      value:
        report.sample.usdProductsWithPlans - report.sample.usdWithStartingPrice,
      displayValue: String(
        report.sample.usdProductsWithPlans - report.sample.usdWithStartingPrice,
      ),
    },
  ];

  const absoluteUrl = `${getSiteUrl()}${CRM_PRICING_REPORT.path}`;
  const csvPath = `${CRM_PRICING_REPORT.path}download/`;
  const jsonPath = `${CRM_PRICING_REPORT.path}download/?format=json`;
  const charts = listCrmPricingChartSpecs(report);

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
            datePublished: report.publishedAt,
            dateModified: report.lastUpdated,
            authorName: founder?.name,
            authorPath: founder ? COMPANY_ROUTES.myStory : undefined,
          }),
          datasetJsonLd({
            name: CRM_PRICING_REPORT.title,
            description: DESCRIPTION,
            path: CRM_PRICING_REPORT.path,
            datePublished: report.publishedAt,
            dateModified: report.lastUpdated,
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
              "hasContactSalesPlan",
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
        <p className="mt-4 text-[var(--sg-color-text)]">
          The median published starting list price among{" "}
          {report.sample.usdWithStartingPrice} USD CRM products is{" "}
          <strong>
            {money(report.metrics.medianStartingPriceMonthlyUsd)}/month
          </strong>
          . The mean is{" "}
          {money(report.metrics.meanStartingPriceMonthlyUsd)}/month
          {highStartingOutliers.length > 0
            ? ` — ${highStartingOutliers.map((item) => item.productName).join(" and ")} sit at the high end of the same sample`
            : ""}
          . Quote the median as a typical catalogue entry; the mean is not a
          typical buyer invoice.
        </p>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">
          Figures are calculated from stored vendor list prices in the
          SoftwareGlimpse CRM catalogue ({report.sample.primaryCrmProducts}{" "}
          primary CRM products; {report.sample.usdProductsWithPlans} USD with
          plans). Not a survey panel, not a market census, not negotiated
          invoices.
        </p>
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          Dataset <code className="text-xs">{report.dataset}</code> ·{" "}
          {report.sample.primaryCrmProducts} primary CRM products ·{" "}
          {report.sample.usdProductsWithPlans} USD products with plans (
          {report.sample.eurProductsWithPlans} EUR excluded from USD figures) ·{" "}
          {report.sample.usdPlanCount} USD plans · Vendor pricing observed{" "}
          {report.observationWindow.start}–{report.observationWindow.end} ·
          Report last updated {report.lastUpdated}
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
            href={jsonPath}
            className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 py-2 font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)]"
          >
            Download JSON
          </Link>
          <a
            href="#cite-this-research"
            className="inline-flex rounded-[var(--sg-radius-md)] border border-[var(--sg-color-primary)] px-3 py-2 font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            Cite this research
          </a>
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

        <nav className="mt-6 text-sm text-[var(--sg-color-text-muted)]" aria-label="Report sections">
          <p className="font-medium text-[var(--sg-color-text)]">On this page</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            <li><a className="underline-offset-2 hover:underline" href="#executive-findings">Executive findings</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#key-findings">Key findings</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#charts">Charts</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#outliers">Outliers</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#annual-discounts">Annual discounts</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#free-vs-paid">Free vs paid</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#transparency">Transparency</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#buyers">For buyers</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#research-methodology-heading">Methodology</a></li>
            <li><a className="underline-offset-2 hover:underline" href="#dataset">Dataset</a></li>
          </ul>
        </nav>
      </Section>

      <Section padding="md" container="narrow">
        <ResearchCitationBlock
          prominent
          organization={report.citation.organization}
          reportName={report.citation.title}
          year={CRM_PRICING_REPORT.year}
          publishedDate={report.publishedAt}
          updatedDate={report.lastUpdated}
          url={absoluteUrl}
        />
      </Section>

      <Section padding="md" background="surface" container="narrow" id="executive-findings">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Executive findings
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Each finding is calculated from {report.dataset}. Sample size,
          calculation, date, and limitations sit on every statistic.
        </p>
        <ol className="mt-6 space-y-4">
          {executive.map((finding, index) => (
            <li
              key={finding.id}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                {index + 1}. {finding.label}
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums text-[var(--sg-color-navy)]">
                {finding.valueDisplay}
              </p>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                n={finding.sampleSize} · {finding.date} · {finding.calculation}
              </p>
              {finding.limitations[0] ? (
                <p className="mt-1 text-xs text-[var(--sg-color-text-muted)]">
                  Limitation: {finding.limitations[0]}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      <Section padding="md" container="narrow" id="key-findings">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Key findings
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Headline figures. Metrics without enough structured rows are omitted
          (minimum n={5} for medians and means).
        </p>
        <ResearchStatGrid className="mt-6" stats={stats} />
      </Section>

      <Section padding="md" background="surface" container="narrow" id="charts">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Charts
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Shareable SVGs are generated from the same calculations as this page.
          Captions include dataset, sample size, and date. They do not invent
          scores or vendor logos.
        </p>
        <ul className="mt-3 flex flex-wrap gap-3 text-sm">
          {charts.map((chart) => (
            <li key={chart.id}>
              <Link
                href={`${CRM_PRICING_REPORT.path}charts/${chart.id}/`}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Download {chart.title} (SVG)
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 space-y-8">
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
          <ResearchBarChart
            title="Annual billing discount distribution"
            description="Product-level largest month/year seat-pair discount."
            data={annualDiscountData}
            source="SoftwareGlimpse CRM catalogue enrichment"
            sampleSize={report.sample.productsWithAnnualDiscountPair}
            observationDate={report.observationDate}
          />
          <ResearchBarChart
            title="Pricing transparency"
            description="Counts can overlap: a product may have both a public plan and a contact-sales tier."
            data={transparencyData}
            source="SoftwareGlimpse CRM catalogue enrichment"
            sampleSize={report.sample.usdProductsWithPlans}
            observationDate={report.observationDate}
          />
        </div>
      </Section>

      <Section padding="md" container="narrow" id="outliers">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Interesting outliers
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Extremes in the stored fields — not a ranking, not a recommendation.
        </p>
        <ul className="mt-6 space-y-3">
          {report.outliers.map((item) => (
            <li
              key={`${item.productSlug}-${item.metric}-${item.direction}`}
              className="rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-4 py-3 text-sm"
            >
              <Link
                href={`/software/${item.productSlug}/`}
                className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {item.productName}
              </Link>
              <span className="text-[var(--sg-color-text-muted)]">
                {" "}
                — {item.metric} {item.direction === "high" ? "high" : "low"}:{" "}
                <span className="tabular-nums text-[var(--sg-color-text)]">
                  {item.unit === "%"
                    ? `${item.value}%`
                    : `${money(item.value)}/mo`}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
          Mean starting price ({money(report.metrics.meanStartingPriceMonthlyUsd)}
          /mo) sits above the median (
          {money(report.metrics.medianStartingPriceMonthlyUsd)}/mo) because of
          high list-price outliers. Quote both; the mean is not a typical buyer
          price.
        </p>
      </Section>

      <Section padding="md" background="surface" container="narrow" id="distribution">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Pricing distribution
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Among {report.sample.usdWithStartingPrice} USD products with
          startingPriceMonthly, the 25th–75th percentile is{" "}
          {money(report.metrics.startingPriceP25Usd)}–
          {money(report.metrics.startingPriceP75Usd)}/mo. Paid-only median
          (excluding stored $0) is{" "}
          {money(report.metrics.paidMedianStartingPriceMonthlyUsd)}/mo (n=
          {report.sample.usdPaidStartingPrice}).
        </p>
        {report.segmentStarting.length > 0 ? (
          <div className="mt-6 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
                <tr>
                  <th className="px-4 py-3">Tagged segment</th>
                  <th className="px-4 py-3">n</th>
                  <th className="px-4 py-3">Median starting</th>
                  <th className="px-4 py-3">Mean starting</th>
                </tr>
              </thead>
              <tbody>
                {report.segmentStarting.map((row) => (
                  <tr
                    key={row.segment}
                    className="border-t border-[var(--sg-color-border)]"
                  >
                    <td className="px-4 py-3">{segmentLabel(row.segment)}</td>
                    <td className="px-4 py-3 tabular-nums">{row.sampleSize}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {row.medianUsd == null ? "—" : `${money(row.medianUsd)}/mo`}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {row.meanUsd == null ? "—" : `${money(row.meanUsd)}/mo`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="mt-3 text-xs text-[var(--sg-color-text-muted)]">
          Segments are overlapping editorial <code>businessSizeSlugs</code>, not
          mutually exclusive markets. A product can appear in more than one
          row. Medians require n≥5.
        </p>
      </Section>

      <Section padding="md" container="narrow" id="annual-discounts">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Annual discount analysis
        </h2>
        {report.metrics.medianAnnualDiscountPct != null ? (
          <div className="mt-4 space-y-4 text-[var(--sg-color-text-muted)]">
            <p>
              {report.sample.productsWithAnnualDiscountPair} USD products have
              both monthly and annual per-seat list prices on the same plan.
              Median list-price discount for annual billing is{" "}
              <strong className="text-[var(--sg-color-text)]">
                {report.metrics.medianAnnualDiscountPct}%
              </strong>
              {report.metrics.meanAnnualDiscountPct != null
                ? ` (mean ${report.metrics.meanAnnualDiscountPct}%)`
                : null}
              {report.metrics.minAnnualDiscountPct != null &&
              report.metrics.maxAnnualDiscountPct != null
                ? `. Range ${report.metrics.minAnnualDiscountPct}%–${report.metrics.maxAnnualDiscountPct}%.`
                : "."}
            </p>
            <p>
              {report.sample.usdProductsWithPlans -
                report.sample.productsWithAnnualDiscountPair}{" "}
              USD products are excluded from this median because they lack a
              month+year seat pair (annual-only packaging, monthly-only, flat
              fees, or contact-sales).
            </p>
          </div>
        ) : (
          <p className="mt-4 text-[var(--sg-color-text-muted)]">
            Fewer than 5 products have a month+year seat pair, so an annual
            discount median is not published.
          </p>
        )}
      </Section>

      <Section padding="md" background="surface" container="narrow" id="free-vs-paid">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Free vs paid
        </h2>
        <div className="mt-4 space-y-4 text-[var(--sg-color-text-muted)]">
          {report.metrics.freePlanSharePct != null ? (
            <p>
              {report.metrics.freePlanSharePct}% of USD CRM products in this
              sample advertise a free plan ({report.sample.productsWithFreePlan}{" "}
              of {report.sample.usdProductsWithPlans}). Only{" "}
              {report.metrics.freePlanWithZeroStartingCount} of those free-plan
              products have startingPriceMonthly stored as $0. The rest have a
              free tier in packaging while research records a paid entry price.
            </p>
          ) : null}
          {report.metrics.freeTrialSharePct != null ? (
            <p>
              {report.metrics.freeTrialSharePct}% advertise a free trial (n=
              {report.sample.usdProductsWithPlans}). Trial length is not
              uniformly structured enough for a product-level median in this
              vintage.
            </p>
          ) : null}
        </div>
      </Section>

      <Section padding="md" container="narrow" id="transparency">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Pricing transparency
        </h2>
        <div className="mt-4 space-y-4 text-[var(--sg-color-text-muted)]">
          {report.metrics.publicPricedPlanSharePct != null ? (
            <p>
              {report.metrics.publicPricedPlanSharePct}% of USD products have at
              least one public priced plan (
              {report.sample.productsWithPublicPricedPlan} of{" "}
              {report.sample.usdProductsWithPlans}).{" "}
              {report.metrics.contactSalesPlanSharePct}% list a contact-sales
              plan. {report.sample.productsContactSalesOnly} are
              contact-sales-only (no public priced plan).{" "}
              {report.metrics.missingStartingPriceSharePct}% have no numeric
              startingPriceMonthly.
            </p>
          ) : null}
          {report.metrics.medianPaidSeatTierStepRatio != null ? (
            <p>
              Where two or more paid monthly seat tiers exist (
              {report.sample.productsWithTwoPlusPaidSeatTiers} products,{" "}
              {report.sample.adjacentPaidSeatSteps} adjacent steps), the median
              next-tier list price is{" "}
              <strong className="text-[var(--sg-color-text)]">
                {report.metrics.medianPaidSeatTierStepRatio}×
              </strong>{" "}
              the previous cheapest seat.
            </p>
          ) : null}
          <p>
            Historical starting-price pairs:{" "}
            {report.history.productsWithTwoPlusStartingObservations} products with
            ≥2 observations · increases {report.history.increases} · decreases{" "}
            {report.history.decreases} · unchanged re-observations{" "}
            {report.history.unchangedReobservations}. That is not a 2026
            inflation rate. See{" "}
            <Link
              href="/research/crm-pricing-history/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              the history dataset
            </Link>
            .
          </p>
          <p>
            AI feature pricing is not published. This set has{" "}
            {report.ai.capabilityRows} AI capability rows across{" "}
            {report.ai.productsWithCapabilityRows} products;{" "}
            {report.ai.higherPlanOnlyRows} rows are marked higher-plan-only (
            {report.ai.productsWithHigherPlanOnlyCapability} products). Priced
            addon rules: {report.ai.pricedAddonRules}. Capability flags are not
            SKU prices.
          </p>
        </div>
      </Section>

      <Section padding="md" background="surface" container="narrow" id="buyers">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          What buyers should understand
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
            . The mean is{" "}
            {money(report.metrics.meanStartingPriceMonthlyUsd)}/month — use the
            median for a typical catalogue entry, not the mean.
          </p>
          {report.metrics.medianEntryMonthlySeatUsd != null ? (
            <p>
              Where monthly per-seat rules exist (n=
              {report.sample.productsWithMonthlySeatRule}), the median cheapest
              paid seat is{" "}
              <strong className="text-[var(--sg-color-text)]">
                {money(report.metrics.medianEntryMonthlySeatUsd)}/user/month
              </strong>{" "}
              billed monthly. Starting price and seat price are not the same
              field: some vendors quote a platform or bundled minimum as
              startingPriceMonthly.
            </p>
          ) : null}
          <p>
            Annual billing can cut list price, but only when we can see both
            cadences. Do not assume a 25% discount on vendors that only publish
            one cadence. Contact-sales tiers are common in this set; a missing
            starting price usually means custom packaging, not a free product.
          </p>
          <p>
            Recompute a team scenario on the{" "}
            <Link
              href="/tools/crm-cost-calculator/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM Cost Calculator
            </Link>
            . List prices here are not invoices.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[var(--sg-color-surface-muted)] text-xs uppercase tracking-wide text-[var(--sg-color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Starting / mo</th>
                <th className="px-4 py-3">Entry seat / mo</th>
                <th className="px-4 py-3">Free</th>
                <th className="px-4 py-3">Trial</th>
                <th className="px-4 py-3">Contact sales</th>
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
                  <td className="px-4 py-3">
                    {row.hasFreeTrial ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {row.hasContactSalesPlan ? "Yes" : "No"}
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
                Research date
              </h3>
              <p className="mt-1">
                Vendor pricing observation window{" "}
                {report.observationWindow.start} to{" "}
                {report.observationWindow.end} (latest checked-at used as
                observation date {report.observationDate}). Editorial methodology{" "}
                {report.methodologyVersion} published {report.publishedAt}. Last
                updated {report.lastUpdated}.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--sg-color-text)]">
                Dataset size
              </h3>
              <p className="mt-1">
                {report.sample.primaryCrmProducts} published primary CRM products;
                all {report.sample.productsWithPlans} have plan objects. USD
                statistics use {report.sample.usdProductsWithPlans} products /{" "}
                {report.sample.usdPlanCount} plans. {report.sample.eurProductsWithPlans}{" "}
                EUR products are counted in the catalogue and excluded from USD
                medians.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-[var(--sg-color-text)]">
                Data collection
              </h3>
              <p className="mt-1">
                Vendor list pricing is stored in SoftwareGlimpse research
                enrichment records during product research, with source
                provenance and verification timestamps where available. No
                statistic on this page claims hands-on product use.
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
            <div>
              <h3 className="font-medium text-[var(--sg-color-text)]">
                Publication context
              </h3>
              <p className="mt-1">
                SoftwareGlimpse is a commercial software research and
                buying-intelligence publication. Some product pages include
                affiliate links; commissions are not an input to these
                list-price statistics, the public CSV/JSON, or the charts.{" "}
                <Link
                  href={LEGAL_ROUTES.affiliateDisclosure}
                  className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                >
                  Affiliate disclosure
                </Link>
                .
              </p>
            </div>
            <p>
              Methodology version {report.methodologyVersion}. Last updated{" "}
              {report.lastUpdated}. Editorial process:{" "}
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
      </Section>

      <Section padding="md" container="narrow" id="dataset">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Dataset download and citation
        </h2>
        <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
          Public rows contain catalogue list-price fields only — no affiliate
          metadata, no internal notes. Machine-readable index:{" "}
          <Link href="/llms.txt" className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline">
            llms.txt
          </Link>
          .
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            CSV:{" "}
            <Link href={csvPath} className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline">
              {csvPath}
            </Link>
          </li>
          <li>
            JSON:{" "}
            <Link href={jsonPath} className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline">
              {jsonPath}
            </Link>
          </li>
          <li>
            Dataset id: <code>{report.dataset}</code>
          </li>
        </ul>
        <ResearchCitationBlock
          className="mt-8"
          organization={report.citation.organization}
          reportName={report.citation.title}
          year={CRM_PRICING_REPORT.year}
          publishedDate={report.publishedAt}
          updatedDate={report.lastUpdated}
          url={absoluteUrl}
        />
      </Section>

      <Section padding="md" background="surface" container="narrow">
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]">
          Related research and tools
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link
              href="/research/crm-pricing-history/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM starting price history
            </Link>
          </li>
          <li>
            <Link
              href="/tools/crm-cost-calculator/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM Cost Calculator
            </Link>{" "}
            <span className="text-[var(--sg-color-text-muted)]">
              (recompute a team scenario from the same list prices)
            </span>
          </li>
          <li>
            <Link
              href="/categories/crm/"
              className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM category hub
            </Link>{" "}
            <span className="text-[var(--sg-color-text-muted)]">
              (universe definition)
            </span>
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

      <Section padding="md" container="wide">
        <InternalLinkingModules
          plan={buildInjectionOnlyLinkPlan("/research/crm-pricing/", "hub")}
          showParentInline={false}
        />
      </Section>
    </>
  );
}
