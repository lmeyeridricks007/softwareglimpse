import type { Metadata } from "next";
import { DynamicSiVendorScorecardApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { getPublishedSiComparisonSlugs } from "@/data/recommendation/load-snapshots";
import { listSalesIntelligencePricingSnapshots } from "@/services/pricing/server";
import {
  buildSiScorecardResearchCatalog,
  listSiScorecardProductOptions,
} from "@/services/vendor-scorecard/server";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "Sales Intelligence Vendor Scorecard | Compare SI Vendors";
const DESCRIPTION =
  "Compare shortlisted sales intelligence vendors against coverage, accuracy, enrichment, CRM sync, credits, compliance and your own evaluation — without affiliate ranking bias.";

const FAQ = [
  {
    question: "What does this scorecard evaluate?",
    answer:
      "Buyer-weighted criteria such as contact data coverage, verification/accuracy, enrichment depth, CRM sync quality, credit transparency, compliance, ease of use, outreach (when relevant), and integrations. Research cells only use approved editorial assessments — unknowns stay unknown.",
  },
  {
    question: "Does affiliate status affect scores?",
    answer:
      "No. Affiliate relationships never change scorecard math, shortlist order, or must-have gates.",
  },
  {
    question: "Can I reuse my SI requirements profile?",
    answer:
      "Yes. The scorecard loads your local SI Decision Profile (sg-si-decision-profile-v1) when present, including must-haves and shortlist seeds.",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-vendor-scorecard/",
  indexable: true,
});

export default function SiVendorScorecardPage() {
  const research = buildSiScorecardResearchCatalog();
  const productOptions = listSiScorecardProductOptions();
  const pricingSnapshots = listSalesIntelligencePricingSnapshots();
  const publishedComparisonSlugs = getPublishedSiComparisonSlugs();
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "Sales Intelligence Vendor Scorecard",
      path: "/tools/sales-intelligence-vendor-scorecard/",
    },
  ];

  const faqLd = faqPageJsonLd(
    FAQ.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/sales-intelligence-vendor-scorecard/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <Section padding="md" background="tint" container="wide">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Sales intelligence vendor scorecard
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            Compare sales intelligence vendors against what matters to you
          </h1>
          <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Weight coverage, accuracy, enrichment, CRM sync, credits and
            compliance — then keep your demo evaluation separate from
            SoftwareGlimpse research.
          </p>
        </header>
      </Section>

      <Section
        id="scorecard-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-24 lg:pb-12"
      >
        <DynamicSiVendorScorecardApp
          research={research}
          productOptions={productOptions}
          pricingSnapshots={pricingSnapshots}
          publishedComparisonSlugs={publishedComparisonSlugs}
        />
      </Section>

      <Section padding="md" background="surface" container="wide">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          FAQ
        </h2>
        <dl className="mt-6 space-y-6">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-semibold text-[var(--sg-color-navy)]">
                {item.question}
              </dt>
              <dd className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
