import type { Metadata } from "next";
import { DynamicCrmAdoptionHealthApp } from "@/components/tools/dynamic-tool-apps";
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

const TITLE = "CRM Adoption / Health Assessment | SoftwareGlimpse";
const DESCRIPTION =
  "Diagnose whether people actually work in your live CRM and whether the system is healthy enough to trust — without inventing a vendor ranking.";

const FAQ = [
  {
    question: "Is this a product ranking?",
    answer:
      "No. It scores your answers about how the CRM is used and governed. Affiliate relationships never set the result.",
  },
  {
    question: "When should I use this instead of the Readiness Assessment?",
    answer:
      "Use Readiness before you buy. Use this after go-live when adoption, data trust, or unowned automation is the problem.",
  },
  {
    question: "Do you store my answers?",
    answer:
      "Answers stay in this browser under sg-crm-adoption-health-v1. They are not sent to analytics.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-adoption-health-assessment/",
  indexable: true,
});

export default function CrmAdoptionHealthAssessmentPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "CRM Adoption / Health Assessment",
      path: "/tools/crm-adoption-health-assessment/",
    },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-adoption-health-assessment/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          softwareApplicationJsonLd({
            name: "CRM Adoption / Health Assessment",
            description: DESCRIPTION,
            path: "/tools/crm-adoption-health-assessment/",
            applicationCategory: "BusinessApplication",
          }),
          ...(faqPageJsonLd(FAQ) ? [faqPageJsonLd(FAQ)!] : []),
        ]}
      />
      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>
      <Section padding="md" background="tint" container="wide">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sg-color-primary)]">
          Post-purchase diagnostic
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold text-[var(--sg-color-navy)]">
          CRM Adoption / Health Assessment
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--sg-color-text-muted)]">
          {DESCRIPTION}
        </p>
      </Section>
      <Section padding="lg" background="surface" container="wide">
        <DynamicCrmAdoptionHealthApp />
      </Section>
      <Section padding="md" background="tint" container="narrow">
        <h2 className="font-semibold text-[var(--sg-color-navy)]">FAQ</h2>
        <dl className="mt-4 space-y-4">
          {FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-medium text-[var(--sg-color-navy)]">
                {item.question}
              </dt>
              <dd className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      {newsletterEnabled ? (
        <Section padding="md" background="surface" container="narrow">
          <NewsletterCard />
        </Section>
      ) : null}
    </>
  );
}
