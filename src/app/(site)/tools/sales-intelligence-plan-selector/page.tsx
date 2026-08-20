import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  SiPlanSelectorEducation,
  SiPlanSelectorFaq,
  SiPlanSelectorHero,
  SI_PLAN_SELECTOR_FAQ,
} from "@/components/plan-selector/landing";
import { DynamicSiPlanSelectorApp } from "@/components/tools/dynamic-tool-apps";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { listSalesIntelligencePricingSnapshots } from "@/services/pricing/server";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE =
  "Sales Intelligence Plan Selector — Which plan do you actually need?";
const DESCRIPTION =
  "Choose a sales intelligence product with a verified seat plan matrix. Credit packs stay quote-required — we never invent credit dollar totals or force CRM seat ladders onto usage pricing.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/sales-intelligence-plan-selector/",
  indexable: true,
});

export default function SalesIntelligencePlanSelectorPage() {
  const snapshots = listSalesIntelligencePricingSnapshots();
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "Sales Intelligence Plan Selector",
      path: "/tools/sales-intelligence-plan-selector/",
    },
  ];

  const faqLd = faqPageJsonLd(
    SI_PLAN_SELECTOR_FAQ.map((item) => ({
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
            path: "/tools/sales-intelligence-plan-selector/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <Section padding="md" background="tint" container="wide">
        <SiPlanSelectorHero />
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
          <DynamicSiPlanSelectorApp snapshots={snapshots} />
        </Suspense>
      </Section>

      <SiPlanSelectorEducation />
      <SiPlanSelectorFaq />

      <Section padding="md" background="muted" container="wide">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]">
          Related sales intelligence tools & guides
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {[
            {
              href: "/best/sales-intelligence-software/",
              label: "Best sales intelligence software",
            },
            {
              href: "/tools/sales-intelligence-finder/",
              label: "SI Finder",
            },
            {
              href: "/tools/sales-intelligence-cost-calculator/",
              label: "SI Cost Calculator",
            },
            { href: "/pricing/", label: "Pricing guides" },
            { href: "/categories/sales-intelligence/", label: "Category hub" },
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
