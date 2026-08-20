import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCategories,
  getSoftwareByCategory,
} from "@/data";
import { listFeaturePillarProfiles } from "@/data/feature-detail";
import { FeatureExploreGrid } from "@/components/features/feature-explore-grid";
import { UseCaseHubHero } from "@/components/use-cases/use-case-hero";
import {
  UseCaseResearchCallout,
  UseCaseSidebar,
} from "@/components/use-cases/use-case-sidebar";
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

const TITLE = "CRM Software Features";
const DESCRIPTION =
  "Evidence-backed CRM feature comparisons — multiple pipelines, email sync, lead scoring, SSO, forecasting, and more — with support, plan availability, and implementation depth.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/features/",
  indexable: true,
});

export default function FeaturesIndexPage() {
  const profiles = listFeaturePillarProfiles();
  const crmSoftware = getSoftwareByCategory("crm");
  const category = getCategories({ includeUnpublished: true }).find(
    (c) => c.slug === "crm",
  );

  const featured = profiles.find((p) => p.slug === "multiple-pipelines") ?? profiles[0];

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

  const guides = listPublishedLearningGuides("crm");
  const resources = [
    ...guides.slice(0, 2).map((g) => ({ href: g.path, label: g.title })),
    ...buildCrmHubResourceLinks({ excludeHrefs: ["/features/"] }),
  ]
    .filter((item, index, arr) => {
      const key = item.href.split("?")[0]!;
      return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
    })
    .slice(0, 8);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/features/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <UseCaseHubHero
        className="mt-2"
        title={TITLE}
        description={DESCRIPTION}
        stats={[
          {
            label: `${profiles.length} CRM features`,
            icon: "use-cases",
          },
          {
            label: `${crmSoftware.length} CRM products in catalogue`,
            icon: "products",
            href: category
              ? `/categories/${category.path.join("/")}/`
              : "/categories/crm/",
          },
          {
            label: "Affiliate-independent comparisons",
            icon: "independent",
          },
          {
            label: "Research-backed methodology",
            icon: "methodology",
            href: COMPANY_ROUTES.methodology,
          },
        ]}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <div className="min-w-0 space-y-12">
          <UseCaseResearchCallout />

          <FeatureExploreGrid
            title="Explore CRM features"
            items={profiles.map((p) => ({
              slug: p.slug,
              title: p.name,
              description: p.tagline ?? p.definition,
              href: `/features/${p.slug}/`,
              typeLabel: p.featureTypeLabel ?? p.featureType,
            }))}
          />

          <p className="max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Features are concrete product capabilities you can compare across
            vendors. For broader evaluation themes, browse{" "}
            <Link
              href="/capabilities/"
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM capabilities
            </Link>
            ; for jobs-to-be-done, see{" "}
            <Link
              href="/use-cases/"
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM use cases
            </Link>
            .
          </p>
        </div>

        <UseCaseSidebar
          className="lg:sticky lg:top-24"
          featured={
            featured
              ? {
                  title: featured.name,
                  description:
                    featured.tagline ||
                    featured.definition ||
                    "A core CRM feature buyers compare across products.",
                  href: `/features/${featured.slug}/`,
                  bestFor: featured.typicalBuyerNeed ?? "Sales and RevOps teams",
                  keyBenefit:
                    featured.commonLimitation ??
                    "Evidence-backed support and plan differences",
                  topProducts: [],
                  provisional: true,
                }
              : undefined
          }
          comparisons={comparisons}
          resources={resources}
        />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
