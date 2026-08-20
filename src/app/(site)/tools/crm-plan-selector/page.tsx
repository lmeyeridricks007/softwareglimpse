import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CrmPlanSelectorEducation,
  CrmPlanSelectorFaq,
  CrmPlanSelectorHero,
  CRM_PLAN_SELECTOR_FAQ,
} from "@/components/plan-selector/landing";
import { DynamicCrmPlanSelectorApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { listCrmPricingSnapshots } from "@/services/pricing/server";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Plan Selector — Which plan do you actually need?";
const DESCRIPTION =
  "Choose a CRM and find the lowest plan that meets your must-have requirements. See upgrade drivers, seat costs, and unknowns — without invented match scores.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-plan-selector/",
  indexable: true,
});

export default function CrmPlanSelectorPage() {
  const snapshots = listCrmPricingSnapshots();
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: "CRM Plan Selector", path: "/tools/crm-plan-selector/" },
  ];

  const faqLd = faqPageJsonLd(
    CRM_PLAN_SELECTOR_FAQ.map((item) => ({
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
            path: "/tools/crm-plan-selector/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <Section padding="md" background="tint" container="wide">
        <CrmPlanSelectorHero />
      </Section>

      <Section
        id="plan-selector-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-28 lg:pb-12"
      >
        <Suspense
          fallback={
            <p className="text-sm text-[var(--sg-color-text-muted)]">
              Loading plan selector…
            </p>
          }
        >
          <DynamicCrmPlanSelectorApp snapshots={snapshots} />
        </Suspense>
      </Section>

      <CrmPlanSelectorEducation />
      <CrmPlanSelectorFaq />

      <Section padding="md" background="muted" container="wide">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
          Related CRM tools & guides
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {[
            { href: "/best/crm-software/", label: "Best CRM software" },
            { href: "/tools/crm-finder/", label: "CRM Finder" },
            { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
            { href: "/tools/crm-roi-calculator/", label: "CRM ROI Calculator" },
            {
              href: "/tools/crm-requirements-builder/",
              label: "Requirements Builder",
            },
            { href: "/pricing/", label: "CRM pricing guides" },
            { href: "/compare/", label: "CRM comparisons" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
