import type { Metadata } from "next";
import { Suspense } from "react";
import {
  GuidesBasics,
  GuidesBuyingJourney,
  GuidesCategoryDirectory,
  GuidesFeatured,
  GuidesFinalDecisionCta,
  GuidesHero,
  GuidesLatestGrid,
  GuidesMethodology,
  GuidesNewsletterCta,
  GuidesResearchPathways,
  GuidesToolsCta,
  GuidesTopicGrid,
  GuidesTopicalClusters,
} from "@/components/guides/hub";
import { GuidesLatestFromQuery } from "@/components/guides/hub/guides-latest-from-query";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildGuidesHubModel } from "@/services/guides-hub";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
  type JsonLd,
} from "@/seo/structured-data";
import { canonicalUrl } from "@/lib/urls";

const TITLE = "Software Buying Guides: Choose, Compare, Decide";
const DESCRIPTION =
  "Practical guides for choosing, comparing, and buying business software — structured recommendations by job fit, not affiliate rankings. Free to read, no account required.";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/guides/",
    indexable: true,
    pageType: "hub",
  });
}

function collectionJsonLd(
  guides: Array<{ title: string; href: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: canonicalUrl("/guides/"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: guides.map((guide, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: guide.title,
        url: canonicalUrl(guide.href),
      })),
    },
  };
}

export default function GuidesIndexPage() {
  const model = buildGuidesHubModel();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides/" },
  ];

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          webPageJsonLd({
            name: TITLE,
            description: DESCRIPTION,
            path: "/guides/",
          }),
          ...(model.guides.length > 0
            ? [
                collectionJsonLd(
                  [
                    ...model.topicalClusters.flatMap((c) =>
                      c.cornerstone.map((g) => ({
                        title: g.title,
                        href: g.href,
                      })),
                    ),
                    ...model.basics.map((g) => ({
                      title: g.title,
                      href: g.href,
                    })),
                  ]
                    .filter(
                      (g, i, arr) =>
                        arr.findIndex((x) => x.href === g.href) === i,
                    )
                    .slice(0, 40),
                ),
              ]
            : []),
        ]}
      />

      {/* white */}
      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="mt-4">
          <GuidesHero startHere={model.startHere} />
        </div>
      </Section>

      {/* light */}
      <Section padding="md" background="muted" container="wide">
        <GuidesTopicGrid topics={model.topics} />
      </Section>

      {/* featured tint band */}
      {model.featured ? (
        <Section padding="md" background="surface" container="wide">
          <GuidesFeatured guide={model.featured} />
        </Section>
      ) : null}

      {/* white */}
      {model.basics.length > 0 ? (
        <Section padding="md" background="surface" container="wide">
          <GuidesBasics guides={model.basics} />
        </Section>
      ) : null}

      {/* light */}
      <Section padding="md" background="muted" container="wide">
        <GuidesBuyingJourney steps={model.journey} />
      </Section>

      {model.topicalClusters.length > 0 ? (
        <GuidesTopicalClusters clusters={model.topicalClusters} />
      ) : null}

      {/* white — discovery grid is search-worthy guides only */}
      <Section padding="md" background="surface" container="wide">
        <Suspense
          fallback={
            <GuidesLatestGrid
              guides={model.guides}
              filterCategories={model.filterCategories}
              filterTopics={model.filterTopics}
            />
          }
        >
          <GuidesLatestFromQuery
            guides={model.guides}
            filterCategories={model.filterCategories}
            filterTopics={model.filterTopics}
          />
        </Suspense>
      </Section>

      {/* tint */}
      <GuidesResearchPathways />

      {/* tint tools split */}
      <GuidesToolsCta tools={model.tools} />

      {/* muted directory */}
      <GuidesCategoryDirectory topics={model.topics} />

      {/* white methodology */}
      <GuidesMethodology
        methodologyHref={model.methodologyHref}
        howWeReviewHref={model.howWeReviewHref}
      />

      <GuidesNewsletterCta enabled={model.newsletterEnabled} />

      <GuidesFinalDecisionCta />
    </>
  );
}
