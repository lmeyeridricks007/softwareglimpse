import type { Metadata } from "next";
import { DynamicCrmDemoChecklistBuilderApp } from "@/components/tools/dynamic-tool-apps";
import {
  DEMO_CHECKLIST_FAQ,
  DemoChecklistLandingSections,
} from "@/components/demo-checklist-builder/landing-sections";
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

const TITLE = "CRM Demo Checklist Builder | Scripted Vendor Demo Agenda";
const DESCRIPTION =
  "Build a reusable CRM demo checklist and agenda so every shortlisted vendor demonstrates the same workflows, with evidence rules and scorecard handoff.";

const PATH = "/tools/crm-demo-checklist-builder/";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  indexable: true,
});

export default function CrmDemoChecklistBuilderPage() {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM Demo Checklist Builder", path: PATH },
  ];

  const faq = DEMO_CHECKLIST_FAQ.map((item) => ({
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
            name: "CRM Demo Checklist Builder",
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
          CRM Demo Checklist Builder
        </h1>
        <p className="mt-3 text-base text-[var(--sg-color-text-muted)] sm:text-lg">
          Create a structured, repeatable demo agenda so every CRM vendor
          demonstrates the same workflows — with success criteria, evidence rules
          and exports your evaluation team can reuse.
        </p>
      </header>

      <div className="mt-8" id="demo-checklist-workspace">
        <DynamicCrmDemoChecklistBuilderApp titleElement="none" />
      </div>

      <DemoChecklistLandingSections />

      <div className="mt-16 space-y-8">
        <TrustStrip />
        <NewsletterCard />
      </div>
    </PageContainer>
  );
}
