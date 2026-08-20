import type { Metadata } from "next";
import {
  CrmVendorScorecardFaq,
  CrmVendorScorecardHero,
  CrmVendorScorecardMethodology,
  CRM_SCORECARD_FAQ_ITEMS,
} from "@/components/vendor-scorecard/landing";
import { DynamicCrmVendorScorecardApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { getPublishedCrmComparisonSlugs } from "@/data/recommendation/load-snapshots";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import {
  buildCrmScorecardResearchCatalog,
  listCrmScorecardProductOptions,
} from "@/services/vendor-scorecard/server";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Vendor Scorecard | Compare CRM Vendors";
const DESCRIPTION =
  "Compare shortlisted CRM vendors against your own requirements using evidence-backed product research, weighted priorities and your demo or trial evaluation.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-vendor-scorecard/",
  indexable: true,
});

export default function CrmVendorScorecardPage() {
  const research = buildCrmScorecardResearchCatalog();
  const productOptions = listCrmScorecardProductOptions();
  const pricingSnapshots = listCrmPricingSnapshots();
  const publishedComparisonSlugs = getPublishedCrmComparisonSlugs();
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM Vendor Scorecard", path: "/tools/crm-vendor-scorecard/" },
  ];

  const faqLd = faqPageJsonLd(
    CRM_SCORECARD_FAQ_ITEMS.map((item) => ({
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
            path: "/tools/crm-vendor-scorecard/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <CrmVendorScorecardHero />

      <Section
        id="scorecard-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-24 lg:pb-12"
      >
        <div className="mb-6 max-w-2xl rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-4 shadow-[var(--sg-shadow-sm)] sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            CRM Vendor Scorecard
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Compare your shortlisted CRM vendors using your requirements, our
            research, and your own evaluation.
          </p>
        </div>
        <DynamicCrmVendorScorecardApp
          research={research}
          productOptions={productOptions}
          pricingSnapshots={pricingSnapshots}
          publishedComparisonSlugs={publishedComparisonSlugs}
        />
      </Section>

      <CrmVendorScorecardMethodology />
      <CrmVendorScorecardFaq />

      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
