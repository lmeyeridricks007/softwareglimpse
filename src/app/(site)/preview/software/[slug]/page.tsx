import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getSoftwareBySlug } from "@/data";
import { SoftwareProductHub } from "@/components/software/hub/software-product-hub";
import { resolveAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import { canPlaceCta } from "@/services/editorial/cta-rules";
import { buildSoftwareReviewModel } from "@/services/software-review/build-review-model";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Software preview",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ slug: string }> };

export default async function PreviewSoftwarePage({ params }: Props) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) notFound();

  const { slug } = await params;
  const software = getSoftwareBySlug(slug, { includeUnpublished: true });
  if (!software) notFound();

  const model = buildSoftwareReviewModel(software);
  const affiliateLink = resolveAffiliateLink(software, { location: "hero" });
  const showHeaderCta = Boolean(
    canPlaceCta("software-review", "header", 0) && affiliateLink,
  );

  return (
    <SoftwareProductHub
      model={model}
      initialTab="overview"
      affiliateLink={affiliateLink}
      showHeaderCta={showHeaderCta}
      previewEnabled
      researchIncomplete={model.publicationState === "researching"}
    />
  );
}
