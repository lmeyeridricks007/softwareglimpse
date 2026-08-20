import type { Metadata } from "next";
import { getResources } from "@/data";
import { getResourceHubProfile } from "@/data/resource-hub";
import { ResourceExploreGrid } from "@/components/resources/resource-explore-grid";
import { ResourceHubHero } from "@/components/resources/resource-hero";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

const TITLE = "CRM templates, checklists & worksheets";
const DESCRIPTION =
  "Practical resources for choosing, implementing and improving CRM software — downloadable Excel and PDF artifacts, not long articles.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/resources/",
  indexable: true,
});

export default function ResourcesIndexPage() {
  const resources = getResources().filter((r) =>
    r.categorySlugs.includes("crm"),
  );
  const covers: Record<string, { src: string; alt?: string }> = {};
  for (const resource of resources) {
    const visual = getResourceHubProfile(resource.slug)?.heroVisual;
    if (visual) covers[resource.slug] = visual;
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/resources/",
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <ResourceHubHero
        className="mt-2"
        title={TITLE}
        description={DESCRIPTION}
      />

      <div className="mt-10">
        <ResourceExploreGrid resources={resources} covers={covers} />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
