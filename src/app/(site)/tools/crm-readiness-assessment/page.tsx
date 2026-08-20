import type { Metadata } from "next";
import {
  CrmReadinessAssessmentEducation,
  CrmReadinessAssessmentFaq,
  CrmReadinessAssessmentHero,
  CRM_READINESS_FAQ_ITEMS,
} from "@/components/readiness-assessment/landing";
import { DynamicCrmReadinessAssessmentApp } from "@/components/tools/dynamic-tool-apps";
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

const TITLE = "CRM Readiness Assessment | SoftwareGlimpse";
const DESCRIPTION =
  "Assess whether your organization is ready to select and implement a CRM. Get selection vs implementation scores, gaps, risks and a prioritized action plan.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-readiness-assessment/",
  indexable: true,
});

export default function CrmReadinessAssessmentPage() {
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "CRM Readiness Assessment",
      path: "/tools/crm-readiness-assessment/",
    },
  ];

  const faqLd = faqPageJsonLd(
    CRM_READINESS_FAQ_ITEMS.map((item) => ({
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
            path: "/tools/crm-readiness-assessment/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          softwareApplicationJsonLd({
            name: "CRM Readiness Assessment",
            description: DESCRIPTION,
            path: "/tools/crm-readiness-assessment/",
            applicationCategory: "BusinessApplication",
          }),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <Section padding="md" background="tint" container="wide">
        <CrmReadinessAssessmentHero />
      </Section>

      <Section
        id="readiness-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-28 lg:pb-12"
      >
        <DynamicCrmReadinessAssessmentApp />
      </Section>

      <CrmReadinessAssessmentEducation />
      <CrmReadinessAssessmentFaq />

      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
