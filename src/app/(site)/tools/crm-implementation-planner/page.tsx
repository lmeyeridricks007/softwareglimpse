import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CrmImplementationFaq,
  CrmImplementationMethodology,
  CRM_IMPLEMENTATION_FAQ_ITEMS,
} from "@/components/implementation-planner";
import { DynamicCrmImplementationPlannerApp } from "@/components/tools/dynamic-tool-apps";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { listCrmScorecardProductOptions } from "@/services/vendor-scorecard/server";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE =
  "CRM Implementation Planner | Build Your CRM Rollout Plan";
const DESCRIPTION =
  "Create a structured CRM implementation plan with phases, migration, configuration, integrations, testing, training and go-live tasks based on your requirements.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-implementation-planner/",
  indexable: true,
});

export default function CrmImplementationPlannerPage() {
  const productOptions = listCrmScorecardProductOptions().map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
  }));

  const guides = listPublishedLearningGuides("crm");
  const resourceLinks = [
    ...guides
      .filter((g) =>
        /implement|migrat|train|adopt|go-live|data quality|choose|requirement/i.test(
          `${g.title} ${g.path}`,
        ),
      )
      .slice(0, 6)
      .map((g) => ({ href: g.path, label: g.title })),
    { href: "/tools/crm-requirements-builder/", label: "CRM Requirements Builder" },
    { href: "/tools/crm-vendor-scorecard/", label: "CRM Vendor Scorecard" },
    { href: "/tools/crm-tco-calculator/", label: "CRM TCO Calculator" },
    {
      href: "/tools/crm-migration-planner/",
      label: "CRM Migration Planner",
    },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "CRM Implementation Planner",
      path: "/tools/crm-implementation-planner/",
    },
  ];

  const faqLd = faqPageJsonLd(
    CRM_IMPLEMENTATION_FAQ_ITEMS.map((item) => ({
      question: item.question,
      answer: item.answer,
    })),
  );

  return (
    <PageContainer size="wide" className="py-2">
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/crm-implementation-planner/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Build your CRM implementation plan
        </h1>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">{DESCRIPTION}</p>
      </header>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading implementation planner…
          </p>
        }
      >
        <DynamicCrmImplementationPlannerApp
          productOptions={productOptions}
          resourceLinks={resourceLinks}
          title="Build your CRM implementation plan"
          description={DESCRIPTION}
          titleElement="none"
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <CrmImplementationMethodology />
        <CrmImplementationFaq />

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="impl-next-cta"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            After the plan
          </p>
          <h2
            id="impl-next-cta"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Align cost and vendor evidence with your rollout
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Use TCO for ownership assumptions and the Vendor Scorecard for
            unresolved must-haves — affiliate status never changes either tool.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink
              href="/tools/crm-tco-calculator/?from=implementation"
              size="lg"
            >
              Update TCO assumptions
            </ButtonLink>
            <ButtonLink
              href="/tools/crm-vendor-scorecard/?from=implementation"
              variant="outline"
              size="lg"
            >
              Open Vendor Scorecard
            </ButtonLink>
          </div>
        </section>

        <section aria-labelledby="related-heading">
          <h2
            id="related-heading"
            className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-navy)]"
          >
            Related resources
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {resourceLinks.map((item) => (
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
        </section>
      </div>

      <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
        Timeline durations are planning assumptions derived from your scope —
        not vendor-certified estimates.{" "}
        <strong className="font-medium text-[var(--sg-color-text)]">
          Affiliate relationships do not affect the implementation plan.
        </strong>{" "}
        <Link
          href="/company/editorial-methodology/"
          className="underline underline-offset-2"
        >
          How we evaluate
        </Link>
      </p>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" hideWhenDisabled />
        <TrustStrip />
      </section>
    </PageContainer>
  );
}
