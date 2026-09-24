import { cache } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getAllComparisonsUnfiltered,
  getComparisonBySlug,
  getSoftwareBySlug,
} from "@/data";
import { SoftwareCta } from "@/components/affiliate/software-cta";
import { ComparisonDecisionPage } from "@/components/comparison/decision/comparison-decision-page";
import {
  EditorialDisclosures,
  EditorialProvenance,
  EditorialTrustBlock,
} from "@/components/editorial";
import { TrustStrip } from "@/components/trust/trust-strip";
import {
  canonicalizeComparisonSlug,
  isCanonicalComparisonSlug,
  parseComparisonSlug,
} from "@/domain/comparison-slug";
import { isEntityIndexable } from "@/domain/quality-gates";
import { canPlaceCta } from "@/services/editorial/cta-rules";
import { buildComparisonTrustMetadata } from "@/services/editorial/comparison-trust";
import { buildComparisonPageModel } from "@/services/comparison-page/build-page-model";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";
import { buildComparisonLinkPlan } from "@/services/internal-linking";
import { InternalLinkingModules } from "@/components/internal-linking";
import { buildEstateBreadcrumbs } from "@/services/seo/knowledge-graph";

type Props = {
  params: Promise<{ slug: string }>;
};

const loadComparisonWithEnrichment = cache(async function loadComparisonWithEnrichment(slug: string) {
  const comparison = getComparisonBySlug(slug);
  if (!comparison) return null;
  const [{ loadCompareEnrichmentOverlay }, { mergeComparisonWithOverlay }] =
    await Promise.all([
      import("@/services/seo/compare-enrichment/overlay-store"),
      import("@/services/seo/compare-enrichment/overlay-merge"),
    ]);
  return mergeComparisonWithOverlay(
    comparison,
    loadCompareEnrichmentOverlay(comparison.slug),
  );
});

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const item of getAllComparisonsUnfiltered()) {
    if (!isEntityIndexable({ kind: "comparison", entity: item })) continue;
    if (!isCanonicalComparisonSlug(item.slug)) continue;
    params.push({ slug: item.slug });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await loadComparisonWithEnrichment(slug);
  if (!comparison) {
    return buildPageMetadata({
      title: "Comparison not found",
      description: "This comparison does not exist.",
      path: `/compare/${slug}/`,
      indexable: false,
    });
  }

  const model = buildComparisonPageModel(comparison);
  const title = model?.decision.seoTitle || comparison.seo.title || comparison.title;
  const description =
    model?.decision.seoDescription ||
    comparison.seo.description ||
    `${comparison.title} on SoftwareGlimpse.`;

  return buildPageMetadata({
    title,
    description,
    path: comparison.seo.canonicalPath || `/compare/${comparison.slug}/`,
    indexable: isEntityIndexable({ kind: "comparison", entity: comparison }),
  });
}

export default async function ComparisonDetailPage({ params }: Props) {
  const { slug } = await params;

  if (!isCanonicalComparisonSlug(slug)) {
    const parsed = parseComparisonSlug(slug);
    if (parsed) {
      permanentRedirect(
        `/compare/${canonicalizeComparisonSlug([parsed.left, parsed.right])}/`,
      );
    }
  }

  const comparison = await loadComparisonWithEnrichment(slug);
  if (!comparison) notFound();

  const model = buildComparisonPageModel(comparison);
  if (!model) notFound();

  const productA = getSoftwareBySlug(model.productA.slug);
  const productB = getSoftwareBySlug(model.productB.slug);

  const comparisonTrust = buildComparisonTrustMetadata({
    productA,
    productB,
    lastUpdated: model.lastUpdated ?? comparison.metadata.updatedAt,
    methodologyVersion: model.methodologyVersion,
  });

  const showCtaA = canPlaceCta("comparison", "mid", 0);
  const showCtaB = canPlaceCta("comparison", "final", 0);

  const linkPlan = buildComparisonLinkPlan({
    comparisonSlug: model.slug,
    title: model.title,
    productSlugs: [model.productA.slug, model.productB.slug],
    categorySlug: productA?.primaryCategorySlug ?? productB?.primaryCategorySlug,
  });

  const breadcrumbItems = buildEstateBreadcrumbs(`/compare/${model.slug}/`).map(
    (item, index, all) =>
      index === all.length - 1
        ? { ...item, name: model.decision.h1 }
        : item,
  );

  const faqLd = faqPageJsonLd(model.faq);

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: model.decision.seoTitle || model.title,
            description: model.decision.seoDescription,
            path: `/compare/${model.slug}/`,
            dateModified:
              model.lastUpdated ??
              comparison.metadata.updatedAt ??
              comparison.metadata.publishedAt,
          }),
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />

      <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 pt-8 sm:px-6">
        <EditorialTrustBlock trust={comparisonTrust} variant="comparison" />
      </div>

      <ComparisonDecisionPage
        model={model}
        visitCtaA={
          showCtaA ? (
            <SoftwareCta
              productId={model.productA.slug}
              context="comparison"
              intent="VISIT"
              variant="button"
              label={model.productA.visitLabel}
              showDisclosure={false}
              className="[&_a]:w-full"
            />
          ) : undefined
        }
        visitCtaB={
          showCtaB ? (
            <SoftwareCta
              productId={model.productB.slug}
              context="comparison"
              intent="VISIT"
              variant="button"
              label={model.productB.visitLabel}
              showDisclosure={false}
              className="[&_a]:w-full [&_a]:border [&_a]:border-[var(--sg-color-border-strong)] [&_a]:bg-[var(--sg-color-surface)] [&_a]:text-[var(--sg-color-text)] [&_a]:hover:border-[var(--sg-color-primary)] [&_a]:hover:bg-[var(--sg-color-surface)] [&_a]:hover:text-[var(--sg-color-primary)]"
            />
          ) : undefined
        }
      />

      {(productA?.affiliate?.disclosureRequired ||
        productB?.affiliate?.disclosureRequired) &&
      (showCtaA || showCtaB) ? (
        <p className="mx-auto mt-6 w-full max-w-[var(--sg-container-wide)] px-4 text-xs text-[var(--sg-color-text-muted)] sm:px-6">
          Some visit links may be affiliate links — we may earn a commission at
          no extra cost to you. Comparison outcomes are never based on
          commission.
        </p>
      ) : null}

      <div className="mx-auto w-full max-w-[var(--sg-container-wide)] px-4 sm:px-6">
        <EditorialDisclosures
          showAffiliate={Boolean(
            productA?.affiliate?.disclosureRequired ||
              productB?.affiliate?.disclosureRequired,
          )}
          methodologyVersion={model.methodologyVersion}
          fixtureBased={model.provisional}
          aiUsed={model.criteria.length > 0}
        />
        <EditorialProvenance
          sources={[
            ...(productA?.sources ?? []),
            ...(productB?.sources ?? []),
          ].slice(0, 8)}
          pricingVerifiedAt={comparisonTrust.pricingVerifiedAt}
          dataCheckedAt={
            comparisonTrust.researchDate ?? comparisonTrust.lastUpdated
          }
          methodologyLabel={
            model.methodologyVersion
              ? `Methodology v${model.methodologyVersion}`
              : "Editorial methodology"
          }
        />
      </div>

      <div className="mx-auto mt-10 w-full max-w-[var(--sg-container-wide)] px-4 sm:px-6">
        <InternalLinkingModules
          plan={linkPlan}
          omit={["relatedProducts", "relatedComparisons"]}
          showParentInline
        />
      </div>

      <section className="mt-16 border-t border-[var(--sg-color-border)] pt-12">
        <TrustStrip />
      </section>
    </>
  );
}
