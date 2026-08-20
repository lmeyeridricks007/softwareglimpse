import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCapabilities,
  getCategories,
  getSoftwareByCategory,
} from "@/data";
import { CapabilityExploreGrid } from "@/components/capabilities/capability-explore-grid";
import { CapabilityHubHero } from "@/components/capabilities/capability-hero";
import {
  CapabilityResearchCallout,
  CapabilitySidebar,
} from "@/components/capabilities/capability-sidebar";
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

const TITLE = "CRM Software Capabilities";
const DESCRIPTION =
  "Explore CRM capabilities — contact, pipeline, automation, reporting, security, and more — so you evaluate what the software must do before you shortlist vendors.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/capabilities/",
  indexable: true,
});

export default function CapabilitiesIndexPage() {
  const crmCapabilities = getCapabilities().filter((c) =>
    c.categorySlugs.includes("crm"),
  );
  const crmSoftware = getSoftwareByCategory("crm");
  const category = getCategories({ includeUnpublished: true }).find(
    (c) => c.slug === "crm",
  );

  const featured =
    crmCapabilities.find((c) => c.slug === "pipeline-management") ??
    crmCapabilities[0];

  const featuredProducts = getAllSoftwareUnfiltered()
    .filter((s) => s.useCaseSlugs.includes("pipeline-management"))
    .slice(0, 3)
    .map((s) => s.name);

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
    ...buildCrmHubResourceLinks({ excludeHrefs: ["/capabilities/"] }),
  ]
    .filter((item, index, arr) => {
      const key = item.href.split("?")[0]!;
      return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
    })
    .slice(0, 8);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Capabilities", path: "/capabilities/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/capabilities/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <CapabilityHubHero
        className="mt-2"
        title={TITLE}
        description={DESCRIPTION}
        stats={[
          {
            label: `${crmCapabilities.length} CRM capabilities`,
            icon: "capabilities",
          },
          {
            label: `${crmSoftware.length} CRM products in catalogue`,
            icon: "products",
            href: category
              ? `/categories/${category.path.join("/")}/`
              : "/categories/crm/",
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
          <CapabilityResearchCallout />

          <CapabilityExploreGrid
            title="Explore CRM capabilities"
            items={crmCapabilities.map((c) => ({
              slug: c.slug,
              title: c.name,
              description: c.shortDescription ?? c.description,
              href: `/capabilities/${c.slug}/`,
            }))}
          />

          <p className="max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
            Capabilities describe what CRM software can do. For job-to-be-done
            pages, browse{" "}
            <Link
              href="/use-cases/"
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              CRM use cases
            </Link>
            .
          </p>
        </div>

        <CapabilitySidebar
          className="lg:sticky lg:top-24"
          featured={
            featured
              ? {
                  title: featured.name,
                  description:
                    featured.shortDescription ||
                    featured.description ||
                    "A core CRM capability for sales teams.",
                  href: `/capabilities/${featured.slug}/`,
                  bestFor: "Sales and RevOps teams",
                  keyBenefit: "Shared operating capability buyers can evaluate",
                  topProducts: featuredProducts,
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
