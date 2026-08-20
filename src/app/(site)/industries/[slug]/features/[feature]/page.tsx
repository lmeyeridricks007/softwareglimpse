import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FeatureDetailPage } from "@/components/features/feature-detail-page";
import { listIndustryFeatureParams } from "@/data/feature-detail";
import { getFeatureDetailPage } from "@/services/feature-detail";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string; feature: string }>;
};

export function generateStaticParams() {
  return listIndustryFeatureParams().map((item) => ({
    slug: item.industrySlug,
    feature: item.featureSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: industrySlug, feature: featureSlug } = await params;
  const model = getFeatureDetailPage(featureSlug, industrySlug);
  if (!model) {
    return buildPageMetadata({
      title: "Feature not found",
      description: "This industry feature page does not exist.",
      path: `/industries/${industrySlug}/features/${featureSlug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: model.displayTitle,
    description: model.tagline.slice(0, 320),
    path: `/industries/${industrySlug}/features/${featureSlug}/`,
    indexable: false,
  });
}

export default async function IndustryFeatureRoute({ params }: Props) {
  const { slug: industrySlug, feature: featureSlug } = await params;
  const model = getFeatureDetailPage(featureSlug, industrySlug);
  if (!model) notFound();

  const path = `/industries/${industrySlug}/features/${featureSlug}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    {
      name: model.industry?.name ?? industrySlug,
      path: `/industries/${industrySlug}/`,
    },
    { name: "Features", path: `/features/` },
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
