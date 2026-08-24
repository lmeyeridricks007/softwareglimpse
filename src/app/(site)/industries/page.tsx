import type { Metadata } from "next";
import {
  getComparisons,
  getIndustries,
  getSoftwareByCategory,
  getSoftwareBySlug,
} from "@/data";
import { IndustryExploreGrid } from "@/components/industries/industry-explore-grid";
import { IndustryHubHero } from "@/components/industries/industry-hero";
import {
  IndustryBenefits,
  IndustryMissingBanner,
  IndustryResearchCallout,
  IndustrySidebar,
} from "@/components/industries/industry-sidebar";
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

const TITLE = "CRM Software By Industry";
const DESCRIPTION =
  "Browse CRM software by industry context. Compare capabilities using CRM evidence — affiliate status never sets recommendations.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/industries/",
  indexable: false,
});

export default function IndustriesIndexPage() {
  const industries = getIndustries({ includeUnpublished: true });
  const crmCount = getSoftwareByCategory("crm").length;

  const guides = [
    ...listPublishedLearningGuides("crm").slice(0, 2).map((g) => ({
      href: g.path,
      label: g.title,
    })),
    ...buildCrmHubResourceLinks({ excludeHrefs: ["/industries/"] }),
  ]
    .filter((item, index, arr) => {
      const key = item.href.split("?")[0]!;
      return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
    })
    .slice(0, 8);

  const comparisons = getComparisons()
    .filter((c) => c.categorySlug === "crm")
    .slice(0, 4)
    .map((comparison) => {
      const products = comparison.productSlugs
        .map((s) => getSoftwareBySlug(s))
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
    { name: "Industries", path: "/industries/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/industries/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <IndustryHubHero
        className="mt-2"
        title={TITLE}
        description={DESCRIPTION}
        stats={[
          {
            label: `${industries.length} industries listed`,
            icon: "industries",
          },
          {
            label: `${crmCount} CRM products in catalogue`,
            icon: "products",
            href: "/categories/crm/",
          },
          {
            label: "Affiliate-independent guidance",
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
          <IndustryResearchCallout />

          <IndustryExploreGrid
            title="Explore CRM software by industry"
            items={industries.map((industry) => ({
              slug: industry.slug,
              title: industry.name,
              description: industry.shortDescription ?? industry.description,
              href: `/industries/${industry.slug}/`,
            }))}
          />

          <IndustryMissingBanner />

          <IndustryBenefits />
        </div>

        <IndustrySidebar
          className="lg:sticky lg:top-24"
          guides={guides}
          comparisons={comparisons}
        />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
