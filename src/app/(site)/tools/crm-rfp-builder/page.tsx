import type { Metadata } from "next";
import {
  CrmRfpBuilderEducation,
  CrmRfpBuilderFaq,
  CrmRfpBuilderHero,
  CRM_RFP_FAQ_ITEMS,
} from "@/components/rfp-builder/landing";
import { DynamicCrmRfpBuilderApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM RFP Builder & Vendor Brief Template | SoftwareGlimpse";
const DESCRIPTION =
  "Create a structured CRM vendor brief or formal RFP using your requirements, integrations, security needs and pricing assumptions.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-rfp-builder/",
  indexable: true,
});

export default function CrmRfpBuilderPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM RFP Builder", path: "/tools/crm-rfp-builder/" },
  ];

  const faqLd = faqPageJsonLd(
    CRM_RFP_FAQ_ITEMS.map((item) => ({
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
            path: "/tools/crm-rfp-builder/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <Section padding="md" background="tint" container="wide">
        <CrmRfpBuilderHero />
      </Section>

      <Section
        id="rfp-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-28 lg:pb-12"
      >
        <div className="mb-6 max-w-2xl rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-4 shadow-[var(--sg-shadow-sm)] sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            Build your CRM vendor package
          </h2>
          <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
            Choose Vendor Brief or Formal RFP, import requirements when
            available, then export a comparable pack for every shortlisted
            vendor.
          </p>
        </div>
        <DynamicCrmRfpBuilderApp />
      </Section>

      <CrmRfpBuilderEducation />
      <CrmRfpBuilderFaq />

      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
