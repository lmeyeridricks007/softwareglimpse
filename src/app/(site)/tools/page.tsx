import type { Metadata } from "next";
import { Suspense } from "react";
import { ToolsHubFromQuery } from "@/components/tools/hub/tools-hub-from-query";
import type { ToolsCategoryVariant } from "@/components/tools/hub/tools-hub-from-query";
import { ToolsHubView } from "@/components/tools/hub/tools-hub-view";
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

const TITLE = "Free Software Selection Tools & Calculators";
const DESCRIPTION =
  "Use free software finders, cost calculators and planning tools to compare business software, estimate costs and find products that fit your needs.";

export function generateMetadata(): Metadata {
  const model = buildToolsHubModel();
  return buildPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/tools/",
    indexable: model.indexable,
  });
}

function toolsItemListJsonLd(
  tools: Array<{ name: string; href: string | null }>,
): JsonLd {
  const available = tools.filter((tool) => tool.href);
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

export default function ToolsIndexPage() {
  const base = buildToolsHubModel();
  const categoryOptions = base.categoryGroups.map((group) => ({
    slug: group.categorySlug,
    name: group.categoryName,
  }));
  const variants: Record<string, ToolsCategoryVariant> = {};
  for (const option of categoryOptions) {
    const scoped = buildToolsHubModel({ categorySlug: option.slug });
    variants[option.slug] = {
      hero: scoped.hero,
      activeCategory: scoped.activeCategory,
      intents: scoped.intents,
      featuredTools: scoped.featuredTools,
      comingSoonTools: scoped.comingSoonTools,
      researchPaths: scoped.researchPaths,
      directory: scoped.directory,
      primaryFinder: scoped.primaryFinder,
      decisionPreview: scoped.decisionPreview,
      calculatorPreview: scoped.calculatorPreview,
      stackSlots: scoped.stackSlots,
    };
  }
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/tools/",
          }),
          toolsItemListJsonLd(
            base.allTools.map((tool) => ({ name: tool.name, href: tool.href })),
          ),
        ]}
      />
      <Suspense
        fallback={
          <ToolsHubView
            model={base}
            categoryOptions={categoryOptions}
            newsletterEnabled={newsletterEnabled}
            categorySlug={null}
          />
        }
      >
        <ToolsHubFromQuery
          base={base}
          variants={variants}
          categoryOptions={categoryOptions}
          newsletterEnabled={newsletterEnabled}
        />
      </Suspense>
    </>
  );
}
