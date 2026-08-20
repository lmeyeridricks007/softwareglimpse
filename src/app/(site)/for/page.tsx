import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import {
  getAllAudiencesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getSoftwareByCategory,
} from "@/data";
import { getAudienceHubProfile } from "@/data/audience-hub";
import { AudienceHubHero } from "@/components/for/audience-hero";
import { AudienceExploreGrid } from "@/components/for/audience-sections";
import { IndustrySidebar } from "@/components/industries/industry-sidebar";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildCrmHubResourceLinks } from "@/services/hub-linking/crm-hub-links";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Software by Business Type";
const DESCRIPTION =
  "Browse CRM guidance by business type — small business, startups, agencies, remote sales teams, and more. Fit-first, affiliate-independent.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/for/",
  indexable: true,
});

export default function ForIndexPage() {
  const audiences = getAllAudiencesUnfiltered()
    .map((audience) => {
      const profile = getAudienceHubProfile(audience.slug);
      return {
        audience,
        profile,
        sortOrder: profile?.sortOrder ?? 99,
      };
    })
    .filter((row) => row.profile)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const crmCount = getSoftwareByCategory("crm").length;

  const guides = [
    ...listPublishedLearningGuides("crm").slice(0, 2).map((g) => ({
      href: g.path,
      label: g.title,
    })),
    ...buildCrmHubResourceLinks({ excludeHrefs: ["/for/"] }),
  ]
    .filter((item, index, arr) => {
      const key = item.href.split("?")[0]!;
      return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
    })
    .slice(0, 8);

  const comparisons = getAllComparisonsUnfiltered()
    .filter((c) => c.categorySlug === "crm")
    .slice(0, 4)
    .map((comparison) => {
      const products = comparison.productSlugs
        .map((s) => getAllSoftwareUnfiltered().find((x) => x.slug === s))
        .filter(Boolean)
        .map((p) => ({ name: p!.name, logo: p!.logo }));
      return {
        href: `/compare/${comparison.slug}/`,
        title: comparison.title,
        products,
      };
    });

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "For", path: "/for/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/for/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <AudienceHubHero
        className="mt-2"
        title={TITLE}
        description={DESCRIPTION}
        stats={[
          { label: `${audiences.length} business types` },
          {
            label: `${crmCount} CRM products in catalogue`,
            href: "/categories/crm/",
          },
          { label: "Affiliate-independent guidance" },
          {
            label: "Research-backed methodology",
            href: COMPANY_ROUTES.methodology,
          },
        ]}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <div className="min-w-0 space-y-12">
          <aside className="flex flex-col gap-3 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Lightbulb
                className="mt-0.5 size-5 shrink-0 text-[var(--sg-color-primary)]"
                aria-hidden
              />
              <p className="text-sm text-[var(--sg-color-text-muted)]">
                <span className="font-medium text-[var(--sg-color-text)]">
                  Business type ≠ industry.
                </span>{" "}
                These pages cover company and team shape. For vertical
                workflows, use industry hubs. Catalogue tags here are not
                rankings.
              </p>
            </div>
            <Link
              href="/tools/crm-finder/"
              className="shrink-0 text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Find My CRM →
            </Link>
          </aside>

          <AudienceExploreGrid
            title="Explore CRM by business type"
            items={audiences.map(({ audience, profile }) => ({
              slug: audience.slug,
              title: profile?.displayTitle ?? `CRM for ${audience.name}`,
              description:
                audience.shortDescription ?? profile?.tagline ?? null,
              href: audience.seo.canonicalPath || `/for/${audience.slug}/`,
            }))}
          />

          <p className="max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Business type is about company and team shape (size, stage, operating
            model). For vertical workflows, browse{" "}
            <Link
              href="/industries/"
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM by industry
            </Link>
            .
          </p>
        </div>

        <IndustrySidebar
          className="lg:sticky lg:top-24"
          comparisons={comparisons}
          guides={guides}
        />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
