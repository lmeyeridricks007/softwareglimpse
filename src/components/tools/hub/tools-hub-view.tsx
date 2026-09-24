import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
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
import type { ToolsHubModel } from "@/services/tools-hub";

type Props = {
  model: ToolsHubModel;
  categoryOptions: Array<{ slug: string; name: string }>;
  newsletterEnabled: boolean;
  categorySlug: string | null;
};

export function ToolsHubView({
  model,
  categoryOptions,
  newsletterEnabled,
  categorySlug,
}: Props) {
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

  const listedTools = categorySlug
    ? model.allTools.filter((tool) => tool.categorySlugs.includes(categorySlug))
    : model.allTools;

  return (
    <>
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
        tools={listedTools}
        directory={model.directory}
        categoryOptions={categoryOptions}
        primaryFinder={model.primaryFinder}
        browseSoftwareHref={model.browseSoftwareHref}
        noAccountRequired={model.noAccountRequired}
        initialCategory={categorySlug ?? "all"}
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
