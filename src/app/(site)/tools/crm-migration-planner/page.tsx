import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CrmMigrationFaq,
  CrmMigrationMethodology,
  CRM_MIGRATION_FAQ_ITEMS,
} from "@/components/migration-planner";
import { DynamicCrmMigrationPlannerApp } from "@/components/tools/dynamic-tool-apps";
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
  "CRM Migration Planner | Plan Your CRM Data Migration";
const DESCRIPTION =
  "Plan a CRM migration with source inventory, field mapping, user and pipeline mapping, data-cleaning tasks, test migration, validation and cutover planning.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/tools/crm-migration-planner/",
  indexable: true,
});

export default function CrmMigrationPlannerPage() {
  const productOptions = listCrmScorecardProductOptions().map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
  }));

  const guides = listPublishedLearningGuides("crm");
  const resourceLinks = [
    ...guides
      .filter((g) =>
        /migration|implementation|data|field|go-live|clean/i.test(
          `${g.title} ${g.path}`,
        ),
      )
      .slice(0, 8)
      .map((g) => ({ href: g.path, label: g.title })),
    { href: "/tools/crm-implementation-planner/", label: "CRM Implementation Planner" },
    { href: "/tools/crm-tco-calculator/", label: "CRM TCO Calculator" },
    { href: "/tools/crm-vendor-scorecard/", label: "CRM Vendor Scorecard" },
  ];

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    {
      name: "CRM Migration Planner",
      path: "/tools/crm-migration-planner/",
    },
  ];

  const faqLd = faqPageJsonLd(
    CRM_MIGRATION_FAQ_ITEMS.map((item) => ({
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
            path: "/tools/crm-migration-planner/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-8 max-w-3xl">
        <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
          Plan your CRM data migration
        </h1>
        <p className="mt-3 text-[var(--sg-color-text-muted)]">{DESCRIPTION}</p>
      </header>

      <Suspense
        fallback={
          <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
            Loading migration planner…
          </p>
        }
      >
        <DynamicCrmMigrationPlannerApp
          productOptions={productOptions}
          resourceLinks={resourceLinks}
          titleElement="none"
        />
      </Suspense>

      <div className="mt-14 space-y-12">
        <CrmMigrationMethodology />
        <CrmMigrationFaq />

        <section
          className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
          aria-labelledby="migration-next-cta"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            Migration is one workstream
          </p>
          <h2
            id="migration-next-cta"
            className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
          >
            Feed migration into your implementation plan
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
            Update the Implementation Planner with migration tasks and risks, or
            pass effort assumptions into TCO — affiliate status never changes
            guidance.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink
              href="/tools/crm-implementation-planner/?from=migration"
              size="lg"
            >
              Open Implementation Planner
            </ButtonLink>
            <ButtonLink
              href="/tools/crm-tco-calculator/?from=migration"
              variant="outline"
              size="lg"
            >
              Update TCO assumptions
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
        This planner structures migration work; it does not move CRM data.{" "}
        <strong className="font-medium text-[var(--sg-color-text)]">
          Affiliate relationships do not affect migration guidance.
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
