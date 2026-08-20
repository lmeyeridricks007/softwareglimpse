import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AudienceDetailPage } from "@/components/for/audience-detail-page";
import {
  buildAudienceHubModel,
  listAudienceHubSlugs,
} from "@/services/audience-hub";
import { buildPageMetadata } from "@/seo/metadata";
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
  return listAudienceHubSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = buildAudienceHubModel(slug);
  if (!model) {
    return buildPageMetadata({
      title: "Business type not found",
      description: "This business type page does not exist.",
      path: `/for/${slug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title:
      model.audience.seo.title ||
      model.displayTitle ||
      `CRM for ${model.audience.name}`,
    description:
      model.audience.seo.description ||
      model.tagline ||
      model.overview,
    path: model.path,
    indexable: model.audience.seo.indexable === true,
  });
}

export default async function ForAudienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = buildAudienceHubModel(slug);
  if (!model) notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "For", path: "/for/" },
    { name: model.badgeLabel, path: model.path },
  ];

  const faqLd =
    model.faq.length > 0 ? faqPageJsonLd(model.faq) : null;

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: model.displayTitle,
            description: model.tagline,
            path: model.path,
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <AudienceDetailPage model={model} />
    </>
  );
}
