import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSoftware, getSoftwareBySlug } from "@/data";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { TrustStrip } from "@/components/trust/trust-strip";
import { SoftwareProductHub } from "@/components/software/hub/software-product-hub";
import { isEntityIndexable } from "@/domain/quality-gates";
import { resolveAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import { canPlaceCta } from "@/services/editorial/cta-rules";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";
import { buildSoftwareLinkPlan } from "@/services/internal-linking";
import { InternalLinkingModules } from "@/components/internal-linking";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  personJsonLd,
  softwareApplicationJsonLd,
  videoObjectJsonLd,
} from "@/seo/structured-data";
import { getFounderAuthor, COMPANY_ROUTES } from "@/services/site-foundation";
import { buildEstateBreadcrumbs } from "@/services/seo/knowledge-graph";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getSoftware().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const software = getSoftwareBySlug(slug);
  if (!software) {
    return buildPageMetadata({
      title: "Software not found",
      description: "This software profile does not exist.",
      path: `/software/${slug}/`,
      indexable: false,
    });
  }

  const model = buildSoftwareReviewModel(software);
  const review = model.review;
  const indexable =
    isEntityIndexable({ kind: "software", entity: software }) &&
    (!review || (review.seo.indexable && review.editorialStatus === "approved"));

  return buildPageMetadata({
    title: review?.seo.title || software.seo.title || software.name,
    description:
      review?.seo.description ||
      software.seo.description ||
      model.tagline ||
      `${software.name} software profile on SoftwareGlimpse.`,
    path:
      review?.seo.canonicalPath ||
      software.seo.canonicalPath ||
      `/software/${software.slug}/`,
    indexable,
  });
}

export default async function SoftwareOverviewPage({ params }: Props) {
  const { slug } = await params;
  const software = getSoftwareBySlug(slug);
  if (!software) notFound();

  const model = buildSoftwareReviewModel(software);
  const affiliateLink = resolveAffiliateLink(software, { location: "hero" });
  const showHeaderCta = Boolean(
    canPlaceCta("software-review", "header", 0) && affiliateLink,
  );

  const breadcrumbItems = buildEstateBreadcrumbs(`/software/${software.slug}/`).map(
    (item, index, all) =>
      index === all.length - 1
        ? { ...item, name: `${software.name} Review` }
        : item,
  );

  const researchIncomplete = model.publicationState === "researching";
  const softwareLinkPlan = buildSoftwareLinkPlan(software.slug);
  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;
  const overviewVideo = model.overviewVideos[0];
  const startingPrice = model.pricing?.startingPriceMonthly;
  const priceCurrency = model.pricing?.currency ?? "USD";
  const priceAsOf =
    model.pricingVerifiedAt ??
    model.research.pricingChecked ??
    model.lastUpdated;
  const videoLd =
    overviewVideo &&
    videoObjectJsonLd({
      name: overviewVideo.title,
      description:
        overviewVideo.demonstratesCaption ?? overviewVideo.description,
      thumbnailUrl: overviewVideo.thumbnailUrl,
      uploadDate: overviewVideo.publishedAt,
      durationSeconds: overviewVideo.durationSeconds,
      contentUrl: overviewVideo.sourceUrl,
      embedUrl: overviewVideo.embedUrl,
    });
  const founder = getFounderAuthor();
  const authorLd = founder
    ? personJsonLd({
        name: founder.name,
        path: COMPANY_ROUTES.myStory,
        jobTitle: founder.role,
        description: founder.shortBio,
      })
    : null;
  const articleLd =
    model.review || model.assessment
      ? articleJsonLd({
          headline:
            model.review?.h1 ||
            model.review?.title ||
            `${software.name} Review`,
          description:
            model.review?.summary ||
            model.tagline ||
            `${software.name} software profile on SoftwareGlimpse.`,
          path: `/software/${software.slug}/`,
          datePublished: software.metadata.publishedAt,
          dateModified:
            model.lastUpdated ??
            software.metadata.updatedAt ??
            software.metadata.publishedAt,
          authorName: founder?.name,
          authorPath: founder ? COMPANY_ROUTES.myStory : undefined,
        })
      : null;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          softwareApplicationJsonLd({
            name: software.name,
            path: `/software/${software.slug}/`,
            description: model.tagline ?? undefined,
            url: software.website,
            applicationCategory: model.primaryCategory?.name,
            dateModified:
              model.lastUpdated ??
              software.metadata.updatedAt ??
              software.metadata.publishedAt,
            priceOffer:
              startingPrice != null &&
              Number.isFinite(startingPrice) &&
              priceAsOf
                ? {
                    price: startingPrice,
                    currency: priceCurrency,
                    priceAsOf,
                    description: model.pricingNotes ?? undefined,
                  }
                : null,
          }),
          ...(articleLd ? [articleLd] : []),
          ...(faqLd ? [faqLd] : []),
          ...(videoLd ? [videoLd] : []),
          ...(authorLd ? [authorLd] : []),
        ]}
      />

      <SoftwareProductHub
        model={model}
        initialTab="overview"
        affiliateLink={affiliateLink}
        showHeaderCta={showHeaderCta}
        previewEnabled={false}
        researchIncomplete={researchIncomplete}
      />

      {softwareLinkPlan ? (
        <div className="mx-auto mt-10 w-full max-w-[var(--sg-container-wide)] px-4 sm:px-6">
          <InternalLinkingModules
            plan={softwareLinkPlan}
            omit={[
              "relatedProducts",
              "relatedComparisons",
              "relatedGuides",
              "relatedUseCases",
            ]}
            showParentInline
          />
        </div>
      ) : null}

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" hideWhenDisabled />
        <TrustStrip />
      </section>
    </>
  );
}
