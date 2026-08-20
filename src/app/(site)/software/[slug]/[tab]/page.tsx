import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getSoftware, getSoftwareBySlug } from "@/data";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { TrustStrip } from "@/components/trust/trust-strip";
import { SoftwareProductHub } from "@/components/software/hub/software-product-hub";
import { isEntityIndexable } from "@/domain/quality-gates";
import { resolveAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import { canPlaceCta } from "@/services/editorial/cta-rules";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";
import {
  getSoftwareHubTab,
  isSoftwareHubTabSlug,
  SOFTWARE_HUB_TAB_SLUGS,
  softwareHubPath,
} from "@/services/software-review/hub-tabs";
import { buildPageMetadata, buildPageMetadataFromDecision } from "@/seo/metadata";
import { indexabilityForProductTab } from "@/seo/indexability";
import { JsonLdScript, breadcrumbJsonLd, faqPageJsonLd } from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string; tab: string }>;
};

export function generateStaticParams() {
  const products = getSoftware();
  return products.flatMap((product) =>
    SOFTWARE_HUB_TAB_SLUGS.map((tab) => ({
      slug: product.slug,
      tab,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, tab: tabSlug } = await params;
  if (!isSoftwareHubTabSlug(tabSlug)) {
    return buildPageMetadata({
      title: "Not found",
      description: "Unknown product section.",
      path: `/software/${slug}/${tabSlug}/`,
      indexable: false,
    });
  }

  const software = getSoftwareBySlug(slug);
  if (!software) {
    return buildPageMetadata({
      title: "Software not found",
      description: "This software profile does not exist.",
      path: `/software/${slug}/${tabSlug}/`,
      indexable: false,
    });
  }

  const tab = getSoftwareHubTab(tabSlug);
  const { isEnabled: previewEnabled } = await draftMode();
  const model = buildSoftwareReviewModel(software);
  const review = model.review;
  const productIndexable =
    !previewEnabled &&
    isEntityIndexable({ kind: "software", entity: software }) &&
    (!review || (review.seo.indexable && review.editorialStatus === "approved"));

  // Section tabs are UX routes — noindex,follow to avoid near-duplicate documents.
  const tabDecision = indexabilityForProductTab(productIndexable);

  return buildPageMetadataFromDecision({
    title: `${software.name} ${tab.label}`,
    description:
      review?.seo.description ||
      software.seo.description ||
      model.tagline ||
      tab.description.replace(/this product/gi, software.name),
    path: softwareHubPath(software.slug, tab.id),
    decision: tabDecision,
    pageType: "product-tab",
  });
}

export default async function SoftwareHubTabPage({ params }: Props) {
  const { slug, tab: tabSlug } = await params;
  if (!isSoftwareHubTabSlug(tabSlug)) notFound();

  const software = getSoftwareBySlug(slug);
  if (!software) notFound();

  const tab = getSoftwareHubTab(tabSlug);
  const { isEnabled: previewEnabled } = await draftMode();
  const model = buildSoftwareReviewModel(software);
  const affiliateLink = resolveAffiliateLink(software, { location: "hero" });
  const showHeaderCta = Boolean(
    canPlaceCta("software-review", "header", 0) && affiliateLink,
  );
  const researchIncomplete = model.publicationState === "researching";

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    ...(model.primaryCategory
      ? [
          {
            name: model.primaryCategory.name,
            path: `/categories/${model.primaryCategory.path.join("/")}/`,
          },
        ]
      : [{ name: "Software", path: "/software/" }]),
    {
      name: `${software.name} Review`,
      path: `/software/${software.slug}/`,
    },
    {
      name: tab.label,
      path: softwareHubPath(software.slug, tab.id),
    },
  ];

  const faqLd =
    tab.id === "faq" && model.faq.length ? faqPageJsonLd(model.faq) : null;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <SoftwareProductHub
        model={model}
        initialTab={tab.id}
        affiliateLink={affiliateLink}
        showHeaderCta={showHeaderCta}
        previewEnabled={previewEnabled}
        researchIncomplete={researchIncomplete}
      />

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" hideWhenDisabled />
        <TrustStrip />
      </section>
    </>
  );
}
