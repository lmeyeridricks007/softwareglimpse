import type { Metadata } from "next";
import {
  BestByCategory,
  BestByNeed,
  BestCategoryFilter,
  BestDecisionCTA,
  BestDecisionJourney,
  BestMeaningExplainer,
  BestMethodologyPreview,
  BestResearchUpdateFeed,
  BestSoftwareHero,
  BestUseCaseDiscovery,
  BuyingGuideGrid,
  DecisionToolGrid,
  FeaturedBestGuide,
  PopularComparisonsSection,
} from "@/components/best/hub";
import { TrustWhySection } from "@/components/home/trust-why-section";
import { Section } from "@/components/layout/section";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildBestHubModel } from "@/services/best-hub";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
  type JsonLd,
} from "@/seo/structured-data";
import { canonicalUrl } from "@/lib/urls";

const TITLE = "Best Software";
const DESCRIPTION =
  "Research-backed software recommendations organized by category and business need — independent methodology, not affiliate rankings.";

export function generateMetadata(): Metadata {
  const model = buildBestHubModel();
  return buildPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/best/",
    indexable: model.indexable,
  });
}

function collectionJsonLd(pages: Array<{ title: string; href: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl("/best/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: pages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.title,
        url: canonicalUrl(page.href),
      })),
    },
  };
}

export default function BestIndexPage() {
  const model = buildBestHubModel();
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Best Software", path: "/best/" },
  ];

  const bestHrefByCategory = Object.fromEntries(
    model.pages.map((p) => [p.categorySlug, p.href]),
  );

  const trustMetrics = [
    {
      value: `${model.stats.productsResearched}+`,
      label: "Products covered",
    },
    {
      value: `${model.stats.bestPageCount}`,
      label: model.stats.bestPageCount === 1 ? "Best guide" : "Best guides",
    },
    {
      value: `${model.stats.categoryCount}`,
      label: "Categories covered",
    },
    {
      value: `${model.guides.length}`,
      label: "Buying guides",
    },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/best/",
          }),
          ...(model.pages.length > 0
            ? [
                collectionJsonLd(
                  model.pages.map((p) => ({ title: p.title, href: p.href })),
                ),
              ]
            : []),
        ]}
      />

      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>

      <BestSoftwareHero model={model} />

      <BestCategoryFilter
        categories={model.filterCategories}
        bestHrefByCategory={bestHrefByCategory}
      />

      {model.featured ? (
        <FeaturedBestGuide
          featured={model.featured}
          finderHref={model.finder.exists ? model.finder.href : null}
          finderLabel={model.finder.label}
        />
      ) : null}

      <BestByCategory model={model} />

      <BestByNeed needs={model.needs} />

      <BestDecisionCTA
        paths={model.decisionPaths}
        finderHref={model.finder.exists ? model.finder.href : null}
        finderLabel={model.finder.label}
      />

      <BestUseCaseDiscovery useCases={model.useCases} />

      <BestMethodologyPreview />

      <BestMeaningExplainer approvedBestFor={model.approvedBestFor} />

      {model.decisionJourney ? (
        <BestDecisionJourney journey={model.decisionJourney} />
      ) : null}

      <PopularComparisonsSection comparisons={model.comparisons} />

      <DecisionToolGrid tools={model.tools} />

      <BuyingGuideGrid guides={model.guides} />

      <BestResearchUpdateFeed items={model.recentUpdates} />

      <Section padding="md" background="muted" container="wide">
        <TrustWhySection metrics={trustMetrics} />
      </Section>

      {newsletterEnabled ? (
        <Section padding="md" background="default" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}
