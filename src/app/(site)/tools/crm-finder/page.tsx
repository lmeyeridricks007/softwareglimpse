import type { Metadata } from "next";
import {
  CrmFinderCalculatorCta,
  CrmFinderFaq,
  CRM_FINDER_FAQ_ITEMS,
  CrmFinderFinalCta,
  CrmFinderHero,
  CrmFinderHowItWorks,
  CrmFinderMethodology,
  CrmFinderResearchSections,
  CrmFinderResultsInclude,
} from "@/components/finder/landing";
import { DynamicCrmFinderApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getAllSoftwareUnfiltered } from "@/data";
import {
  getCrmFinderSnapshots,
  getPublishedCrmComparisonSlugs,
} from "@/data/recommendation/load-snapshots";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildCrmFinderLandingModel } from "@/services/crm-finder-landing/build-landing-model";
import { buildCrmFinderSamplePreview } from "@/services/crm-finder-landing/sample-preview";
import { buildPageMetadata } from "@/seo/metadata";
import { buildVisitCtaMap } from "@/services/affiliate/resolve-visit-cta";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Software Finder";
const DESCRIPTION =
  "Answer a few questions and get CRM recommendations matched to your team, requirements and budget. Affiliate relationships never change Finder rankings.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-finder/",
  indexable: true,
});

export default function CrmFinderPage() {
  const snapshots = getCrmFinderSnapshots();
  const publishedComparisonSlugs = getPublishedCrmComparisonSlugs();
  const landing = buildCrmFinderLandingModel();
  const samplePreview = buildCrmFinderSamplePreview();
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const software = getAllSoftwareUnfiltered();
  const logos = Object.fromEntries(
    software.filter((s) => s.logo).map((s) => [s.slug, s.logo]),
  );
  const visitCtas = buildVisitCtaMap(
    snapshots.map((s) => s.slug),
    "finder",
  );

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM Software Finder", path: "/tools/crm-finder/" },
  ];

  const faqLd = faqPageJsonLd(
    CRM_FINDER_FAQ_ITEMS.map((item) => ({
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
            path: "/tools/crm-finder/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <CrmFinderHero samplePreview={samplePreview} />

      <Section
        id="finder-experience"
        padding="md"
        background="tint"
        container="wide"
        className="relative"
      >
        <div className="mb-6 max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            CRM Finder
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Answer each step to build a personalized shortlist from SoftwareGlimpse
            CRM research.
          </p>
        </div>
        <DynamicCrmFinderApp
          snapshots={snapshots}
          publishedComparisonSlugs={publishedComparisonSlugs}
          logos={logos}
          visitCtas={visitCtas}
        />
      </Section>

      <CrmFinderHowItWorks />

      <CrmFinderResultsInclude />

      <CrmFinderMethodology model={landing} />

      <CrmFinderResearchSections model={landing} />

      <CrmFinderCalculatorCta calculatorHref={landing.calculatorHref} />

      <CrmFinderFaq />

      <CrmFinderFinalCta calculatorHref={landing.calculatorHref} />

      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
