import type { Metadata } from "next";
import { FinderPageHero } from "@/components/finder/finder-page-hero";
import { SiFinderFaq, SI_FINDER_FAQ_ITEMS } from "@/components/finder/landing/si-finder-faq";
import { DynamicSiFinderApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getAllSoftwareUnfiltered } from "@/data";
import {
  getPublishedSiComparisonSlugs,
  getSiFinderSnapshots,
} from "@/data/recommendation/load-snapshots";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildPageMetadata } from "@/seo/metadata";
import { buildVisitCtaMap } from "@/services/affiliate/resolve-visit-cta";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "Sales Intelligence Finder";
const DESCRIPTION =
  "Answer a few questions and get sales intelligence recommendations matched to your prospecting job, capabilities and budget. Affiliate relationships never change Finder rankings.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-finder/",
  indexable: true,
});

export default function SalesIntelligenceFinderPage() {
  const snapshots = getSiFinderSnapshots();
  const publishedComparisonSlugs = getPublishedSiComparisonSlugs();
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
    {
      name: "Sales Intelligence Finder",
      path: "/tools/sales-intelligence-finder/",
    },
  ];

  const faqLd = faqPageJsonLd(
    SI_FINDER_FAQ_ITEMS.map((item) => ({
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
            path: "/tools/sales-intelligence-finder/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <Section padding="md" background="surface" container="wide">
        <FinderPageHero
          title="Sales Intelligence Finder"
          description="Answer a few questions about your outbound motion and get a shortlist of sales intelligence tools matched to prospecting, enrichment, outreach and budget — without affiliate ranking bias."
          badge="Free · No signup"
        />
      </Section>

      <Section
        id="finder-experience"
        padding="md"
        background="tint"
        container="wide"
        className="relative"
      >
        <div className="mb-6 max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            Find your sales intelligence stack
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Answer each step to build a personalized shortlist from
            SoftwareGlimpse sales intelligence research.
          </p>
        </div>
        <DynamicSiFinderApp
          snapshots={snapshots}
          publishedComparisonSlugs={publishedComparisonSlugs}
          logos={logos}
          visitCtas={visitCtas}
        />
      </Section>

      <SiFinderFaq />

      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
