import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getComparisonBySlug,
  getComparisons,
  getSoftwareBySlug,
} from "@/data";
import { SoftwareCta } from "@/components/affiliate/software-cta";
import {
  ComparisonEvidenceTab,
  ComparisonFaqTab,
  ComparisonFeaturesTab,
  ComparisonOverviewTab,
  ComparisonPageClient,
  ComparisonPricingTab,
  ComparisonProsConsTab,
  ComparisonScorecardTab,
  ComparisonScreenshotsTab,
  ComparisonSidebarGlance,
  ComparisonVerdictHero,
} from "@/components/comparison/page";
import { EditorialDisclosures } from "@/components/editorial";
import { TrustStrip } from "@/components/trust/trust-strip";
import {
  canonicalizeComparisonSlug,
  isCanonicalComparisonSlug,
  parseComparisonSlug,
} from "@/domain/comparison-slug";
import { isEntityIndexable } from "@/domain/quality-gates";
import { canPlaceCta } from "@/services/editorial/cta-rules";
import {
  buildComparisonPageModel,
} from "@/services/comparison-page/build-page-model";
import {
  isComparisonPageTabId,
  type ComparisonPageTabId,
} from "@/services/comparison-page/tabs";
import { buildPageMetadata } from "@/seo/metadata";
import { JsonLdScript, breadcrumbJsonLd, webPageJsonLd } from "@/seo/structured-data";
import { buildComparisonLinkPlan } from "@/services/internal-linking";
import { InternalLinkingModules } from "@/components/internal-linking";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const item of getComparisons()) {
    params.push({ slug: item.slug });
    const parts = item.slug.split("-vs-");
    if (parts.length === 2) {
      params.push({ slug: `${parts[1]}-vs-${parts[0]}` });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);
  if (!comparison) {
    return buildPageMetadata({
      title: "Comparison not found",
      description: "This comparison does not exist.",
      path: `/compare/${slug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: comparison.seo.title || comparison.title,
    description:
      comparison.seo.description ||
      `${comparison.title} on SoftwareGlimpse.`,
    path: comparison.seo.canonicalPath || `/compare/${comparison.slug}/`,
    indexable: isEntityIndexable({ kind: "comparison", entity: comparison }),
  });
}

export default async function ComparisonDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { tab: tabParam } = await searchParams;

  if (!isCanonicalComparisonSlug(slug)) {
    const parsed = parseComparisonSlug(slug);
    if (parsed) {
      permanentRedirect(
        `/compare/${canonicalizeComparisonSlug([parsed.left, parsed.right])}/`,
      );
    }
  }

  const comparison = getComparisonBySlug(slug);
  if (!comparison) notFound();

  const model = buildComparisonPageModel(comparison);
  if (!model) notFound();

  const productA = getSoftwareBySlug(model.productA.slug);
  const productB = getSoftwareBySlug(model.productB.slug);

  const initialTab: ComparisonPageTabId =
    tabParam &&
    isComparisonPageTabId(tabParam) &&
    model.availableTabs.includes(tabParam)
      ? tabParam
      : "overview";

  const showCtaA = canPlaceCta("comparison", "mid", 0);
  const showCtaB = canPlaceCta("comparison", "final", 0);

  const linkPlan = buildComparisonLinkPlan({
    comparisonSlug: model.slug,
    title: model.title,
    productSlugs: [model.productA.slug, model.productB.slug],
    categorySlug: productA?.primaryCategorySlug ?? productB?.primaryCategorySlug,
  });

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Comparisons", path: "/compare/" },
    { name: model.title, path: `/compare/${model.slug}/` },
  ];

  const panels: Partial<
    Record<
      ComparisonPageTabId,
      React.ReactNode
    >
  > = {};
  if (initialTab === "overview") {
    panels.overview = <ComparisonOverviewTab model={model} />;
  } else if (initialTab === "scorecard") {
    panels.scorecard = <ComparisonScorecardTab model={model} />;
  } else if (initialTab === "features") {
    panels.features = <ComparisonFeaturesTab model={model} />;
  } else if (initialTab === "pricing") {
    panels.pricing = <ComparisonPricingTab model={model} />;
  } else if (initialTab === "pros-cons") {
    panels["pros-cons"] = <ComparisonProsConsTab model={model} />;
  } else if (initialTab === "screenshots") {
    panels.screenshots = <ComparisonScreenshotsTab model={model} />;
  } else if (initialTab === "evidence") {
    panels.evidence = <ComparisonEvidenceTab model={model} />;
  } else if (initialTab === "faq") {
    panels.faq = <ComparisonFaqTab model={model} />;
  }

  const hero = (
    <ComparisonVerdictHero
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
  );

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: model.title,
            description:
              comparison.seo.description ||
              `${model.title} on SoftwareGlimpse.`,
            path: `/compare/${model.slug}/`,
            dateModified:
              model.lastUpdated ??
              comparison.metadata.updatedAt ??
              comparison.metadata.publishedAt,
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />

      <ComparisonPageClient
        chrome={{
          slug: model.slug,
          title: model.title,
          subtitle: model.subtitle,
          lastUpdated: model.lastUpdated ?? null,
          evidenceSourceCount: model.evidenceSourceCount,
          screenshotCount: model.screenshotCount,
          howWeReviewHref: model.howWeReviewHref,
          provisional: model.provisional,
          researched: model.researched,
          availableTabs: model.availableTabs,
          productAName: model.productA.name,
          productBName: model.productB.name,
        }}
        initialTab={initialTab}
        panels={panels}
        hero={hero}
        sidebar={
          <ComparisonSidebarGlance
            glance={{
              overallLabel: model.overallLabel,
              productA: {
                name: model.productA.name,
                logo: model.productA.logo,
              },
              productB: {
                name: model.productB.name,
                logo: model.productB.logo,
              },
              winsACount: model.winsA.length,
              winsBCount: model.winsB.length,
              tiesCount: model.ties.length,
              finderHref: model.finderHref,
              finderLabel: model.finderLabel,
              availableTabs: model.availableTabs,
              guides: model.guides,
            }}
          />
        }
      />

      {(productA?.affiliate?.disclosureRequired ||
        productB?.affiliate?.disclosureRequired) &&
      (showCtaA || showCtaB) ? (
        <p className="mt-6 text-xs text-[var(--sg-color-text-muted)]">
          Some visit links may be affiliate links — we may earn a commission at
          no extra cost to you. Comparison outcomes are never based on
          commission.
        </p>
      ) : null}

      <EditorialDisclosures
        showAffiliate={Boolean(
          productA?.affiliate?.disclosureRequired ||
            productB?.affiliate?.disclosureRequired,
        )}
        methodologyVersion={model.methodologyVersion}
        fixtureBased={model.provisional}
        aiUsed={model.criteria.length > 0}
      />

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
