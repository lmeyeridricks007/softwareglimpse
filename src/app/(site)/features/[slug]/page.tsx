import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureDetailPage } from "@/components/features/feature-detail-page";
import { listFeatureDetailParams } from "@/data/feature-detail";
import { getFeatureDetailPage } from "@/services/feature-detail";
import { buildPageMetadata, buildPageMetadataFromDecision } from "@/seo/metadata";
import { indexabilityForFeaturePage } from "@/seo/indexability";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return listFeatureDetailParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = getFeatureDetailPage(slug);
  if (!model) {
    return buildPageMetadata({
      title: "Feature not found",
      description: "This feature page does not exist.",
      path: `/features/${slug}/`,
      indexable: false,
    });
  }

  return buildPageMetadataFromDecision({
    title: `CRM ${model.featureName}: Feature Comparison`,
    description: model.tagline.slice(0, 320),
    path: `/features/${slug}/`,
    decision: indexabilityForFeaturePage({
      hasModel: true,
      hasOverview: Boolean(model.profile.overview),
      hasTagline: Boolean(model.tagline?.trim()),
    }),
    pageType: "feature",
  });
}

export default async function FeatureDetailRoute({ params }: Props) {
  const { slug } = await params;
  const model = getFeatureDetailPage(slug);
  if (!model) notFound();

  const path = `/features/${slug}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features/" },
    { name: model.featureName, path },
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
      <FeatureDetailPage model={model} />
    </>
  );
}
