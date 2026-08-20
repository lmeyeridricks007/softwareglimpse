import type { Metadata } from "next";
import { Suspense } from "react";
import { DynamicSiRequirementsBuilderApp } from "@/components/tools/dynamic-tool-apps";
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
  "Sales Intelligence Requirements Builder | Create Your SI Requirements";
const DESCRIPTION =
  "Build a structured sales intelligence requirements profile based on your outbound motion, data coverage needs, CRM sync, compliance posture and budget.";

const FAQ = [
  {
    question: "What are sales intelligence requirements?",
    answer:
      "Sales intelligence requirements are buyer needs — what your team must be able to do with prospect data and outbound tooling — not product feature checklists. Examples include verified emails, regional coverage, CRM two-way sync, or credit transparency.",
  },
  {
    question: "How do I create a sales intelligence requirements list?",
    answer:
      "Start with business context and use cases (prospecting, enrichment, list building, outreach), review recommended capabilities, prioritize requirements, confirm implied features, then add integrations, compliance and budget constraints.",
  },
  {
    question:
      "What's the difference between a capability, requirement and feature?",
    answer:
      "A use case describes the job to be done. A capability is an SI area (like contact data or CRM sync). A requirement is a buyer need within that area. A feature is concrete product functionality that helps satisfy the requirement.",
  },
  {
    question: "How many requirements should be must-have?",
    answer:
      "Keep must-haves to the requirements that would disqualify a product if missing. The builder warns when you mark a very large set as must-have so shortlists stay realistic.",
  },
  {
    question: "Can I use this profile in the Sales Intelligence Finder?",
    answer:
      "Yes. When you continue to Find matching tools, the profile is written to the SI decision profile and Finder-compatible answers so you are not asked the same questions again.",
  },
  {
    question:
      "Does SoftwareGlimpse recommend products based on affiliate relationships?",
    answer:
      "No. The Requirements Builder does not recommend products at all. Affiliate status has zero influence on this tool.",
  },
  {
    question: "Can I export my requirements?",
    answer:
      "Yes. From the results step you can download a PDF file, download an Excel spreadsheet for vendor evaluations, copy a plain-text summary, or export JSON.",
  },
  {
    question: "Do my answers leave my device?",
    answer:
      "No. Your requirements profile is stored in localStorage on this device under a Sales Intelligence-specific key, separate from CRM profiles. We do not send the full profile to analytics.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-requirements-builder/",
  indexable: true,
});

export default function SiRequirementsBuilderPage() {
  const guides = listPublishedLearningGuides("sales-intelligence")
    .filter((g) =>
      [
        "sales-intelligence-requirements-guide",
        "sales-intelligence-evaluation-guide",
        "how-to-choose-sales-intelligence",
        "what-is-sales-intelligence",
      ].includes(g.slug),
    )
    .slice(0, 4)
    .map((g) => ({ href: g.path, label: g.title }));

  const relatedGuides =
    guides.length > 0
      ? guides
      : [
          {
            href: "/guides/sales-intelligence-requirements-guide/",
            label: "Sales Intelligence Requirements Guide",
          },
          {
            href: "/categories/sales-intelligence/",
            label: "Sales Intelligence category",
          },
        ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "Sales Intelligence Requirements Builder",
      path: "/tools/sales-intelligence-requirements-builder/",
    },
  ];

  return (
    <PageContainer size="wide" className="py-2 pb-24 lg:pb-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/sales-intelligence-requirements-builder/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          faqPageJsonLd(FAQ),
        ].filter((item): item is NonNullable<typeof item> => item != null)}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Build your sales intelligence requirements
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
        <DynamicSiRequirementsBuilderApp
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
