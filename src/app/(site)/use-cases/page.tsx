import type { Metadata } from "next";
import {
  Building2,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Store,
} from "lucide-react";
import {
  getAllAudiencesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCategories,
  getSoftwareByCategory,
  getUseCases,
} from "@/data";
import {
  UseCaseAudienceRow,
  UseCaseExploreGrid,
} from "@/components/use-cases/use-case-explore-grid";
import { UseCaseHubHero } from "@/components/use-cases/use-case-hero";
import {
  UseCaseMethodSteps,
  UseCaseQuizBanner,
} from "@/components/use-cases/use-case-method";
import {
  UseCaseResearchCallout,
  UseCaseSidebar,
} from "@/components/use-cases/use-case-sidebar";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { isPubliclyAvailable } from "@/domain/publishing";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildCrmHubResourceLinks } from "@/services/hub-linking/crm-hub-links";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM Software Use Cases";
const DESCRIPTION =
  "Explore CRM use cases to match workflows — pipeline, leads, automation, reporting, and more — using catalogue evidence, not invented buyer stories.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/use-cases/",
  indexable: true,
});

export default function UseCasesIndexPage() {
  const crmUseCases = getUseCases().filter((uc) =>
    uc.categorySlugs.includes("crm"),
  );
  const crmSoftware = getSoftwareByCategory("crm");
  const category = getCategories({ includeUnpublished: true }).find(
    (c) => c.slug === "crm",
  );
  const bestCrm = getAllBestPagesUnfiltered().find(
    (p) => p.categorySlug === "crm" && isPubliclyAvailable(p.metadata),
  );
  const featuredRec = bestCrm?.useCaseRecommendations.find(
    (r) => r.useCaseSlug === "pipeline-management",
  );
  const featuredUc =
    crmUseCases.find((u) => u.slug === "pipeline-management") ??
    crmUseCases[0];

  const featuredProducts = getAllSoftwareUnfiltered()
    .filter((s) => s.useCaseSlugs.includes(featuredUc?.slug ?? ""))
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
    ...buildCrmHubResourceLinks({ excludeHrefs: ["/use-cases/"] }),
  ]
    .filter((item, index, arr) => {
      const key = item.href.split("?")[0]!;
      return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
    })
    .slice(0, 8);

  const audiences = getAllAudiencesUnfiltered();
  const audienceItems = [
    ...audiences.map((a) => ({
      slug: a.slug,
      label: a.name,
      href: a.seo.canonicalPath || `/for/${a.slug}/`,
      available: true as boolean,
      icon:
        a.slug === "small-business"
          ? Store
          : a.slug === "startups"
            ? Laptop
            : a.slug === "agencies"
              ? Building2
              : a.slug === "nonprofits"
                ? HeartHandshake
                : a.slug === "enterprise"
                  ? Building2
                  : GraduationCap,
    })),
  ].slice(0, 8);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Use Cases", path: "/use-cases/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/use-cases/",
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
            label: `${crmUseCases.length} CRM use cases`,
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
          <UseCaseResearchCallout />

          <UseCaseExploreGrid
            title="Explore CRM use cases"
            items={crmUseCases.map((uc) => ({
              slug: uc.slug,
              title: uc.name,
              description: uc.shortDescription ?? uc.description,
              href: `/use-cases/${uc.slug}/`,
            }))}
          />

          <UseCaseAudienceRow
            title="Use cases by audience"
            items={audienceItems}
          />

          <UseCaseQuizBanner />

          <UseCaseMethodSteps />
        </div>

        <UseCaseSidebar
          className="lg:sticky lg:top-24"
          featured={
            featuredUc
              ? {
                  title: featuredUc.name,
                  description:
                    featuredUc.shortDescription ||
                    featuredUc.description ||
                    "A core CRM workflow for sales teams.",
                  href: `/use-cases/${featuredUc.slug}/`,
                  bestFor:
                    featuredRec?.label?.replace(/^Provisional —\s*/i, "") ||
                    "Sales teams",
                  keyBenefit:
                    featuredRec?.rationale?.split(".")[0] ||
                    "Shared deal visibility and stage discipline",
                  topProducts: featuredProducts,
                  provisional: featuredRec ? !featuredRec.approved : true,
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
