import type { Metadata } from "next";
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
} from "@/components/guides/hub";
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

const TITLE = "Software Buying Guides";
const DESCRIPTION =
  "Practical guides for choosing, comparing, buying and getting more from business software — backed by SoftwareGlimpse structured recommendations.";

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

type PageProps = {
  searchParams: Promise<{ category?: string; q?: string; topic?: string }>;
};

export default async function GuidesIndexPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const model = buildGuidesHubModel();
  const initialCategory =
    params.category &&
    model.filterCategories.some((c) => c.slug === params.category)
      ? params.category
      : null;
  const initialTopic =
    params.topic &&
    model.filterTopics.some((t) => t.slug === params.topic)
      ? (params.topic as (typeof model.filterTopics)[number]["slug"])
      : null;

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
                  model.guides.map((g) => ({ title: g.title, href: g.href })),
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

      {/* white */}
      <Section padding="md" background="surface" container="wide">
        <GuidesLatestGrid
          guides={model.guides}
          filterCategories={model.filterCategories}
          filterTopics={model.filterTopics}
          initialCategory={initialCategory}
          initialTopic={initialTopic}
          initialQuery={typeof params.q === "string" ? params.q : ""}
        />
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
