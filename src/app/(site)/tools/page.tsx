import type { Metadata } from "next";
import {
  FeaturedToolsSection,
  ToolCategorySection,
  ToolExploreSection,
  ToolIntentGrid,
  ToolMethodologyStrip,
  ToolProcess,
  ToolResearchPaths,
  ToolsHero,
  ToolsPageViewTracker,
  ToolTrustSection,
} from "@/components/tools/hub";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildToolsHubModel } from "@/services/tools-hub";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
  type JsonLd,
} from "@/seo/structured-data";
import { canonicalUrl } from "@/lib/urls";

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

function resolveCategorySlug(
  raw: string | undefined,
  validSlugs: string[],
): string | null {
  if (!raw) return null;
  return validSlugs.includes(raw) ? raw : null;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const base = buildToolsHubModel();
  const categorySlug = resolveCategorySlug(
    params.category,
    base.categoryGroups.map((g) => g.categorySlug),
  );
  const model = buildToolsHubModel({ categorySlug });
  const title = model.activeCategory
    ? `${model.activeCategory.name} Tools & Calculators`
    : "Free Software Selection Tools & Calculators";
  const description = model.activeCategory
    ? `Interactive ${model.activeCategory.name.toLowerCase()} finders, cost calculators and planning tools — affiliate-independent, based on the same research as our reviews.`
    : "Use free software finders, cost calculators and planning tools to compare business software, estimate costs and find products that fit your needs.";

  return buildPageMetadata({
    title,
    description,
    path: categorySlug
      ? `/tools/?category=${encodeURIComponent(categorySlug)}`
      : "/tools/",
    indexable: model.indexable,
  });
}

function toolsItemListJsonLd(
  tools: Array<{ name: string; href: string | null }>,
): JsonLd {
  const available = tools.filter((t) => t.href);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SoftwareGlimpse decision tools",
    itemListElement: available.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: canonicalUrl(tool.href!),
    })),
  };
}

export default async function ToolsIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const base = buildToolsHubModel();
  const allCategoryOptions = base.categoryGroups.map((g) => ({
    slug: g.categorySlug,
    name: g.categoryName,
  }));
  const categorySlug = resolveCategorySlug(
    params.category,
    allCategoryOptions.map((c) => c.slug),
  );
  const model = buildToolsHubModel({ categorySlug });
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    ...(model.activeCategory
      ? [
          {
            name: model.activeCategory.name,
            path: `/tools/?category=${encodeURIComponent(model.activeCategory.slug)}`,
          },
        ]
      : []),
  ];

  const pageTitle = model.activeCategory
    ? `${model.activeCategory.name} tools`
    : "Free Software Selection Tools & Calculators";
  const pageDescription = model.hero.description;

  const initialCategory = categorySlug ?? "all";
  const listedTools = categorySlug
    ? model.allTools.filter((t) => t.categorySlugs.includes(categorySlug))
    : model.allTools;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          webPageJsonLd({
            name: pageTitle,
            description: pageDescription,
            path: categorySlug
              ? `/tools/?category=${encodeURIComponent(categorySlug)}`
              : "/tools/",
          }),
          toolsItemListJsonLd(
            listedTools.map((t) => ({ name: t.name, href: t.href })),
          ),
        ]}
      />
      <ToolsPageViewTracker />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <ToolsHero model={model} />

      <ToolIntentGrid intents={model.intents} />

      <FeaturedToolsSection model={model} />

      {!model.activeCategory ? (
        <ToolCategorySection groups={model.categoryGroups} />
      ) : null}

      <ToolProcess />

      <ToolTrustSection />

      <ToolResearchPaths paths={model.researchPaths} />

      <ToolExploreSection
        tools={
          categorySlug
            ? model.allTools.filter((t) =>
                t.categorySlugs.includes(categorySlug),
              )
            : model.allTools
        }
        directory={model.directory}
        categoryOptions={allCategoryOptions}
        primaryFinder={model.primaryFinder}
        browseSoftwareHref={model.browseSoftwareHref}
        noAccountRequired={model.noAccountRequired}
        initialCategory={initialCategory}
      />

      <ToolMethodologyStrip links={model.trustLinks} />

      {newsletterEnabled ? (
        <Section id="newsletter" padding="md" background="tint" container="wide">
          <NewsletterCard source="category" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
