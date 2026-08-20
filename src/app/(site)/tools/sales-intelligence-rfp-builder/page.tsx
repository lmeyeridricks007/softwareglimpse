import type { Metadata } from "next";
import { DynamicSiRfpBuilderApp } from "@/components/tools/dynamic-tool-apps";
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

const TITLE =
  "Sales Intelligence RFP Builder & Vendor Brief | SoftwareGlimpse";
const DESCRIPTION =
  "Create a structured sales intelligence vendor brief or formal RFP covering coverage regions, enrichment, CRM integrations, credits/export, DPA and trial success criteria.";

const FAQ = [
  {
    question: "What scope areas does the SI RFP cover?",
    answer:
      "Data coverage regions, enrichment fields, optional intent, CRM integrations, credits/export rights, security/DPA, SLAs and trial success criteria — plus outreach only when applicable.",
  },
  {
    question: "Will this invent requirements or vendor claims?",
    answer:
      "No. You author requirements and questions. Exports never invent certifications, pricing or capabilities.",
  },
  {
    question: "Can I import my SI Decision Profile?",
    answer:
      "Yes. When a local SI profile exists, you can import requirements and integrations as editable draft rows.",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-rfp-builder/",
  indexable: true,
});

export default function SiRfpBuilderPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "SI RFP Builder",
      path: "/tools/sales-intelligence-rfp-builder/",
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
            path: "/tools/sales-intelligence-rfp-builder/",
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
            Sales intelligence procurement
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            Sales Intelligence RFP / Vendor Brief Builder
          </h1>
          <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Package coverage, enrichment, CRM sync, credits and compliance
            questions so every shortlisted vendor answers the same brief.
          </p>
        </header>
      </Section>

      <Section
        id="rfp-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-28 lg:pb-12"
      >
        <DynamicSiRfpBuilderApp />
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
