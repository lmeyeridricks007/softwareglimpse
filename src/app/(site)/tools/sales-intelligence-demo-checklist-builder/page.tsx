import type { Metadata } from "next";
import { DynamicSiDemoChecklistBuilderApp } from "@/components/tools/dynamic-tool-apps";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { PageContainer } from "@/components/layout/page-container";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE =
  "Sales Intelligence Demo Checklist Builder | Scripted Vendor Demos";
const DESCRIPTION =
  "Build a reusable sales intelligence demo agenda — coverage tests, verification samples, CRM writeback, credit burn, compliance and rep trial loops — same script for every vendor.";

const PATH = "/tools/sales-intelligence-demo-checklist-builder/";

const FAQ = [
  {
    question: "How is this different from a CRM demo checklist?",
    answer:
      "Scenarios focus on data coverage, verification, enrichment, CRM sync, credit transparency and compliance — not pipeline stages or forecasting dashboards.",
  },
  {
    question: "Do I send the same checklist to every SI vendor?",
    answer:
      "Yes. Keep one shared script; only scores and evidence differ per vendor so comparisons stay fair.",
  },
  {
    question: "Does this invent vendor capabilities?",
    answer:
      "No. Templates are buyer-authored draft tasks. Evidence stays unknown until you record what was demonstrated.",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  indexable: true,
});

export default function SiDemoChecklistBuilderPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "SI Demo Checklist Builder", path: PATH },
  ];

  const faq = FAQ.map((item) => ({
    question: item.question,
    answer: item.answer,
  }));

  return (
    <PageContainer size="wide" className="py-2 pb-24 lg:pb-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: PATH,
          }),
          breadcrumbJsonLd(breadcrumbItems),
          softwareApplicationJsonLd({
            name: "Sales Intelligence Demo Checklist Builder",
            path: PATH,
            description: DESCRIPTION,
            applicationCategory: "BusinessApplication",
          }),
          faqPageJsonLd(faq),
        ].filter((item): item is NonNullable<typeof item> => item != null)}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--sg-color-navy)] sm:text-4xl">
          Sales Intelligence Demo Checklist Builder
        </h1>
        <p className="mt-3 text-base text-[var(--sg-color-text-muted)] sm:text-lg">
          Create a structured, repeatable demo agenda so every sales
          intelligence vendor runs the same coverage, verification, sync and
          credit tests — with evidence rules your team can reuse.
        </p>
      </header>

      <div className="mt-8" id="demo-checklist-workspace">
        <DynamicSiDemoChecklistBuilderApp titleElement="none" />
      </div>

      <section className="mt-16 space-y-6 border-t border-[var(--sg-color-border)] pt-12">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
          FAQ
        </h2>
        <dl className="space-y-6">
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
      </section>

      <div className="mt-16 space-y-8">
        <TrustStrip />
        <NewsletterCard />
      </div>
    </PageContainer>
  );
}
