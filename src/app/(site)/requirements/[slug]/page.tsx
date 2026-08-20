import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequirementDetailPage } from "@/components/requirements/requirement-detail-page";
import {
  CRM_REQUIREMENT_PILLAR_SLUGS,
  listRequirementDetailParams,
} from "@/data/requirement-detail";
import { getRequirementDetailPage } from "@/services/requirement-detail";
import { buildPageMetadata, buildPageMetadataFromDecision } from "@/seo/metadata";
import { indexabilityForRequirementPage } from "@/seo/indexability";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
};

const PILLAR = new Set<string>(CRM_REQUIREMENT_PILLAR_SLUGS);

export function generateStaticParams() {
  return listRequirementDetailParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = getRequirementDetailPage(slug);
  if (!model) {
    return buildPageMetadata({
      title: "Requirement not found",
      description: "This requirement page does not exist.",
      path: `/requirements/${slug}/`,
      indexable: false,
    });
  }

  const decision = indexabilityForRequirementPage({
    isPillar: PILLAR.has(slug),
    hasOverview: Boolean(model.profile.overview),
    hasHero: Boolean(model.profile.heroVisual?.src),
  });

  return buildPageMetadataFromDecision({
    title: `CRM for ${model.requirementName}: Requirements & Product Comparison`,
    description: model.tagline.slice(0, 320),
    path: `/requirements/${slug}/`,
    decision,
    pageType: "requirement",
  });
}

export default async function RequirementDetailRoute({ params }: Props) {
  const { slug } = await params;
  const model = getRequirementDetailPage(slug);
  if (!model) notFound();

  const path = `/requirements/${slug}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Requirements", path: "/requirements/" },
    { name: model.requirementName, path },
  ];
  const faqLd = model.profile.faq.length
    ? faqPageJsonLd(model.profile.faq)
    : null;

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: model.displayTitle,
            description: model.tagline,
            path,
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <RequirementDetailPage model={model} />
    </>
  );
}
