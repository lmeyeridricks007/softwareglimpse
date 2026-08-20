import type { Metadata } from "next";
import { DynamicSiReadinessAssessmentApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "Sales Intelligence Readiness Assessment | SoftwareGlimpse";
const DESCRIPTION =
  "Diagnose whether your team is ready to select and adopt sales intelligence — ICP clarity, CRM SoR, data ownership, compliance, credits, enrich vs list-buy, outbound maturity and success metrics.";

const FAQ = [
  {
    question: "What does SI readiness measure?",
    answer:
      "Selection vs implementation readiness across ICP clarity, CRM system-of-record readiness, data ownership, compliance ownership, volume/credit planning, enrichment vs list-buy decision, outbound process maturity and success metrics.",
  },
  {
    question: "Is this a CRM readiness quiz?",
    answer:
      "No. Dimensions target sales intelligence buying — not CRM pipeline implementation. Scoring is deterministic, not a marketing percentage.",
  },
  {
    question: "Does affiliate status affect results?",
    answer:
      "No. Affiliate relationships have zero influence on scores or recommended next tools.",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-readiness-assessment/",
  indexable: true,
});

export default function SiReadinessAssessmentPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "SI Readiness Assessment",
      path: "/tools/sales-intelligence-readiness-assessment/",
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
            path: "/tools/sales-intelligence-readiness-assessment/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          softwareApplicationJsonLd({
            name: "Sales Intelligence Readiness Assessment",
            description: DESCRIPTION,
            path: "/tools/sales-intelligence-readiness-assessment/",
            applicationCategory: "BusinessApplication",
          }),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <Section padding="md" background="tint" container="wide">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Sales intelligence diagnostic
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            Sales Intelligence Readiness Assessment
          </h1>
          <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            Check whether ICP, CRM sync readiness, ownership, compliance and
            credit planning are strong enough before you talk to vendors.
          </p>
        </header>
      </Section>

      <Section
        id="readiness-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-28 lg:pb-12"
      >
        <DynamicSiReadinessAssessmentApp />
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
