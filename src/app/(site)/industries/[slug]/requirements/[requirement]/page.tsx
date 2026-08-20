import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequirementDetailPage } from "@/components/requirements/requirement-detail-page";
import { listIndustryRequirementParams } from "@/data/requirement-detail";
import { getRequirementDetailPage } from "@/services/requirement-detail";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string; requirement: string }>;
};

export function generateStaticParams() {
  return listIndustryRequirementParams().map((item) => ({
    slug: item.industrySlug,
    requirement: item.requirementSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: industrySlug, requirement: requirementSlug } = await params;
  const model = getRequirementDetailPage(requirementSlug, industrySlug);
  if (!model) {
    return buildPageMetadata({
      title: "Requirement not found",
      description: "This industry requirement page does not exist.",
      path: `/industries/${industrySlug}/requirements/${requirementSlug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: model.displayTitle,
    description: model.tagline.slice(0, 320),
    path: `/industries/${industrySlug}/requirements/${requirementSlug}/`,
    indexable: false,
  });
}

export default async function IndustryRequirementRoute({ params }: Props) {
  const { slug: industrySlug, requirement: requirementSlug } = await params;
  const model = getRequirementDetailPage(requirementSlug, industrySlug);
  if (!model) notFound();

  const path = `/industries/${industrySlug}/requirements/${requirementSlug}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    {
      name: model.industry?.name ?? industrySlug,
      path: `/industries/${industrySlug}/`,
    },
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
