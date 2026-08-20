import type { Metadata } from "next";
import { Suspense } from "react";
import { DynamicCrmRequirementsBuilderApp } from "@/components/tools/dynamic-tool-apps";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { PageContainer } from "@/components/layout/page-container";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE =
  "CRM Requirements Builder | Create Your CRM Requirements";
const DESCRIPTION =
  "Build a structured CRM requirements profile based on your business, use cases, must-have features, integrations, security needs and budget.";

const FAQ = [
  {
    question: "What are CRM requirements?",
    answer:
      "CRM requirements are buyer needs — what your team must be able to do — not product feature checklists. Examples include supporting separate sales processes, restricting access by team, or integrating with email.",
  },
  {
    question: "How do I create a CRM requirements list?",
    answer:
      "Start with business context and use cases, review recommended capabilities, prioritize requirements, confirm implied features, then add integrations, security and budget constraints. Export or reuse the profile in other SoftwareGlimpse tools.",
  },
  {
    question:
      "What's the difference between a capability, requirement and feature?",
    answer:
      "A use case describes the job to be done. A capability is a CRM area (like pipeline management). A requirement is a buyer need within that area. A feature is concrete product functionality that helps satisfy the requirement.",
  },
  {
    question: "How many CRM requirements should be must-have?",
    answer:
      "Keep must-haves to the requirements that would disqualify a product if missing. The builder warns when you mark a very large set as must-have so shortlists stay realistic.",
  },
  {
    question: "Can I use this profile in the CRM Finder?",
    answer:
      "Yes. When you continue to Find matching CRMs, the profile is written to the shared local decision profile and Finder-compatible answers so you are not asked the same questions again.",
  },
  {
    question:
      "Does SoftwareGlimpse recommend products based on affiliate relationships?",
    answer:
      "No. The Requirements Builder does not recommend products at all. Affiliate status has zero influence on this tool, and Finder rankings also exclude affiliate status.",
  },
  {
    question: "Can I export my requirements?",
    answer:
      "Yes. From the results step you can download a PDF file, download an Excel spreadsheet for vendor evaluations, copy a plain-text summary, or export JSON.",
  },
  {
    question: "Do my answers leave my device?",
    answer:
      "No. Your requirements profile is stored in localStorage on this device. We do not send the full profile to analytics.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-requirements-builder/",
  indexable: true,
});

export default function CrmRequirementsBuilderPage() {
  const guides = listPublishedLearningGuides("crm")
    .filter((g) =>
      [
        "how-to-choose-crm",
        "what-is-crm",
        "how-crm-works",
        "types-of-crm",
      ].includes(g.slug),
    )
    .slice(0, 4)
    .map((g) => ({ href: g.path, label: g.title }));

  // Ensure how-to-choose / what-is are present when published
  const relatedGuides =
    guides.length > 0
      ? guides
      : [
          { href: "/guides/how-to-choose-crm/", label: "How to Choose CRM Software" },
          { href: "/guides/what-is-crm/", label: "What Is CRM Software?" },
        ].filter(Boolean);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "CRM Requirements Builder",
      path: "/tools/crm-requirements-builder/",
    },
  ];

  return (
    <PageContainer size="wide" className="py-2 pb-24 lg:pb-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-requirements-builder/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          faqPageJsonLd(FAQ),
        ].filter((item): item is NonNullable<typeof item> => item != null)}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Build your CRM requirements
        </h1>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">{DESCRIPTION}</p>
      </header>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading requirements builder…
          </p>
        }
      >
        <DynamicCrmRequirementsBuilderApp
          relatedGuides={relatedGuides}
          faqItems={FAQ}
          titleElement="none"
        />
      </Suspense>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" hideWhenDisabled />
        <TrustStrip />
      </section>
    </PageContainer>
  );
}
