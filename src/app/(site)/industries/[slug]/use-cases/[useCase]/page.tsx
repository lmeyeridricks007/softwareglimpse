import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryUseCasePage } from "@/components/industries/use-case/industry-use-case-page";
import { listIndustryUseCaseParams } from "@/data/industry-use-case";
import { getIndustryUseCasePage } from "@/services/industry-use-case";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string; useCase: string }>;
};

export function generateStaticParams() {
  return listIndustryUseCaseParams().map((item) => ({
    slug: item.industrySlug,
    useCase: item.useCaseSlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: industrySlug, useCase: useCaseSlug } = await params;
  const model = getIndustryUseCasePage(industrySlug, useCaseSlug);
  if (!model) {
    return buildPageMetadata({
      title: "Use case not found",
      description: "This industry use-case page does not exist.",
      path: `/industries/${industrySlug}/use-cases/${useCaseSlug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: model.displayTitle,
    description: model.tagline.slice(0, 320),
    path: `/industries/${industrySlug}/use-cases/${useCaseSlug}/`,
    indexable: false,
  });
}

export default async function IndustryUseCaseRoute({ params }: Props) {
  const { slug: industrySlug, useCase: useCaseSlug } = await params;
  const model = getIndustryUseCasePage(industrySlug, useCaseSlug);
  if (!model) notFound();

  const path = `/industries/${industrySlug}/use-cases/${useCaseSlug}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    { name: model.industry.name, path: model.industryHref },
    { name: "Use cases", path: `${model.industryHref}#use-cases` },
    { name: model.useCaseName, path },
  ];
  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;

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
      <IndustryUseCasePage model={model} />
    </>
  );
}
