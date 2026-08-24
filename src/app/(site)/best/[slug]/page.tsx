import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAlternativesPages,
  getBestPageBySlug,
  getBestPages,
  getComparisons,
  getCategories,
  getSoftwareBySlug,
  getUseCases,
} from "@/data";
import {
  getGuidesByProduct,
} from "@/data/repositories/guides";
import { loadAssessment, loadReview, getMethodologyBySlug } from "@/data/editorial/store";
import {
  BestMethodologySummary,
  BestSoftwareAlternatives,
  BestSoftwareByNeed,
  BestSoftwareBuyingFramework,
  BestSoftwareComparisons,
  BestSoftwareDecision,
  BestSoftwareDecisionExplore,
  BestSoftwareFaq,
  BestSoftwareFeatureMatrix,
  BestSoftwareFinderCta,
  BestSoftwareGlanceTable,
  BestSoftwareGuideGroups,
  BestSoftwareHero,
  BestSoftwarePricingInteractive,
  BestSoftwareProductHubs,
  BestSoftwareProductSection,
  BestSoftwareQuickAnswer,
  BestSoftwareResearchTransparency,
  BestSoftwareTopPicks,
  BestSoftwareTradeoffs,
  BestSoftwareTrust,
} from "@/components/best/guide";
import { CategoryQuickNav } from "@/components/category/category-quick-nav";
import { PageContainer } from "@/components/layout/page-container";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { cn } from "@/lib/cn";
import type { Software } from "@/domain";
import { isEntityIndexable } from "@/domain/quality-gates";
import { firstPublicCopy } from "@/services/category-hub/public-copy";
import {
  approvedCriterionScores,
  buildBestPageModel,
  enrichmentFeatureCell,
  enrichmentFeatureName,
  enrichmentPricingDetail,
  enrichmentPricingTeaser,
  enrichmentScreenshot,
  findBestPageLeaks,
  researchTransparencyForProducts,
} from "@/services/best-page";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildPricingSnapshot } from "@/services/pricing/server";
import { loadEnrichment } from "@/data/research/store";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { buildBestLinkPlan } from "@/services/internal-linking";
import { InternalLinkingModules } from "@/components/internal-linking";
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

function approvedScore(software: Software): {
  score: number | null;
  approved: boolean;
} {
  const assessment = loadAssessment(software.slug);
  const review = loadReview(software.slug);
  const score = review?.overallScore ?? assessment?.overallScore;
  const approved =
    assessment?.status === "approved" &&
    review?.editorialStatus === "approved" &&
    typeof score === "number";
  return { score: approved ? score! : null, approved };
}

function resolveMethodology(categorySlug?: string) {
  if (categorySlug === "crm") {
    return (
      getMethodologyBySlug("crm-editorial") ??
      getMethodologyBySlug("crm-software-v1")
    );
  }
  if (!categorySlug) return null;
  return (
    getMethodologyBySlug(`${categorySlug}-editorial`) ??
    getMethodologyBySlug(`${categorySlug}-software-v1`) ??
    null
  );
}

export function generateStaticParams() {
  return getBestPages().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getBestPageBySlug(slug);
  if (!page) {
    return buildPageMetadata({
      title: "Guide not found",
      description: "This best-software guide does not exist.",
      path: `/best/${slug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: page.seo.title || page.title,
    description:
      firstPublicCopy(
        [page.seo.description, page.heroSubtitle, page.summary],
        page.title,
      ) ?? page.title,
    path: page.seo.canonicalPath || `/best/${page.slug}/`,
    indexable: isEntityIndexable({ kind: "best", entity: page }),
  });
}

function SectionShell({
  id,
  className,
  children,
  muted,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 py-8 sm:py-10",
        muted &&
          "rounded-[var(--sg-radius-xl)] bg-[var(--sg-color-surface-muted)] px-4 sm:px-6",
        className,
      )}
    >
      {children}
    </section>
  );
}

export default async function BestDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getBestPageBySlug(slug);
  if (!page) notFound();

  const category = page.categorySlug
    ? getCategories({ includeUnpublished: true }).find(
        (c) => c.slug === page.categorySlug,
      )
    : undefined;

  const methodology = resolveMethodology(page.categorySlug);

  const learningGuides = page.categorySlug
    ? listPublishedLearningGuides(page.categorySlug)
    : [];

  const productGuides = page.eligibleProductSlugs.flatMap((productSlug) =>
    getGuidesByProduct(productSlug)
      .filter((g) => g.metadata.status === "published")
      .map((g) => ({
        productSlug,
        href: g.seo.canonicalPath || `/guides/${g.slug}/`,
        title: g.title,
      })),
  );

  const model = buildBestPageModel({
    page,
    category: category
      ? {
          name: category.name,
          path: category.path,
          shortName: category.name.replace(/\s+Software$/i, ""),
        }
      : null,
    softwareBySlug: (productSlug) => getSoftwareBySlug(productSlug),
    methodology: methodology
      ? {
          description: methodology.description,
          criteria: methodology.criteria,
        }
      : null,
    approvedScore,
    pricingTeaser: enrichmentPricingTeaser,
    pricingDetail: enrichmentPricingDetail,
    featureCell: enrichmentFeatureCell,
    featureName: enrichmentFeatureName,
    criterionScores: approvedCriterionScores,
    productScreenshot: enrichmentScreenshot,
    researchTransparency: researchTransparencyForProducts(
      page.eligibleProductSlugs,
    ),
    productGuides,
    comparisons: getComparisons().map((c) => ({
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      productSlugs: c.productSlugs,
    })),
    alternatives: getAlternativesPages().map((a) => ({
      slug: a.slug,
      title: a.title,
      sourceSlug: a.sourceSlug,
    })),
    guides: learningGuides.map((g) => ({
      path: g.path,
      title: g.title,
      featured:
        g.slug.includes("how-to-choose") || g.path.includes("how-to-choose"),
    })),
    useCases: getUseCases().map((u) => ({
      slug: u.slug,
      name: u.name,
      shortDescription: u.shortDescription,
    })),
    methodologyHref: COMPANY_ROUTES.methodology,
    howWeReviewHref: COMPANY_ROUTES.howWeReview,
    affiliateDisclosureHref: LEGAL_ROUTES.affiliateDisclosure,
    editorialIndependenceHref: LEGAL_ROUTES.editorialIndependence,
    contactCorrectionHref: `${COMPANY_ROUTES.contact}?reason=correction`,
  });

  const publicBlob = JSON.stringify({
    hero: model.hero,
    quickAnswer: model.quickAnswer,
    products: model.products,
    faq: model.faq,
  });
  const leaks = findBestPageLeaks(publicBlob);
  if (leaks.length > 0 && process.env.NODE_ENV !== "production") {
    console.warn(
      `[best:${page.slug}] public content gate warnings:`,
      leaks.join(", "),
    );
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Best Software", path: "/best/" },
    { name: page.title, path: model.path },
  ];

  const jsonLd: Array<NonNullable<ReturnType<typeof webPageJsonLd>>> = [
    webPageJsonLd({
      name: page.title,
      description: model.hero.subtitle,
      path: model.path,
    }),
    breadcrumbJsonLd(breadcrumbItems),
  ];
  const faqLd = model.faq.length > 0 ? faqPageJsonLd(model.faq) : null;
  if (faqLd) jsonLd.push(faqLd);

  const indexable = isEntityIndexable({ kind: "best", entity: page });

  const linkPlan = buildBestLinkPlan({
    bestSlug: page.slug,
    categorySlug: page.categorySlug,
    title: page.title,
    productSlugs: page.eligibleProductSlugs,
    relatedComparisonSlugs: page.relatedComparisonSlugs,
  });

  const glanceItems = model.quickAnswer
    ? [...model.quickAnswer.featured, ...model.quickAnswer.compact].slice(0, 5)
    : model.products.slice(0, 5);

  const pricingSnapshots =
    model.pricing?.interactiveProductSlugs.map((productSlug) => {
      const software = getSoftwareBySlug(productSlug);
      if (!software) return null;
      return buildPricingSnapshot({
        software,
        enrichment: loadEnrichment(productSlug),
      });
    }).filter(Boolean) ?? [];

  const productsByPriority: Record<
    string,
    Array<(typeof model.products)[number]["product"]>
  > = {};
  for (const path of model.decisionExplore?.paths ?? []) {
    productsByPriority[path.priority] = [
      path.product,
      ...model.products
        .filter((p) => p.product.slug !== path.product.slug)
        .slice(0, 2)
        .map((p) => p.product),
    ];
  }

  const mockupNav = [
    { id: "at-a-glance", label: "Overview", icon: "overview" },
    ...(model.comparison
      ? [{ id: "compare", label: "Compare", icon: "comparisons" }]
      : []),
    ...(model.productDeepDives.length
      ? [{ id: "recommendations", label: "Recommendations", icon: "star" }]
      : []),
    ...(model.byNeed.length
      ? [{ id: "by-need", label: "By need", icon: "use-cases" }]
      : []),
    ...(model.pricing
      ? [{ id: "pricing", label: "Pricing", icon: "pricing" }]
      : []),
    ...(model.featureMatrix
      ? [{ id: "features", label: "Features", icon: "features" }]
      : []),
    ...(model.decision || model.decisionExplore
      ? [{ id: "which", label: "Which to choose", icon: "choose" }]
      : []),
    ...(model.buyingFramework
      ? [{ id: "how-to-choose", label: "How to choose", icon: "choose" }]
      : []),
    ...(model.methodology
      ? [{ id: "methodology", label: "Methodology", icon: "methodology" }]
      : []),
    ...(model.faq.length ? [{ id: "faq", label: "FAQ", icon: "faq" }] : []),
  ];

  return (
    <>
      {indexable ? <JsonLdScript data={jsonLd} /> : null}
      <PageContainer size="wide" className="py-8 sm:py-10">
        <Breadcrumbs items={breadcrumbItems} />

        <BestSoftwareHero hero={model.hero} className="mt-2" />

        {mockupNav.length > 0 ? (
          <CategoryQuickNav items={mockupNav} className="mt-6" />
        ) : null}

        <div className="mt-1">
          {model.quickAnswer ? (
            <SectionShell id="at-a-glance">
              <BestSoftwareQuickAnswer
                heading={model.quickAnswer.heading}
                intro={model.quickAnswer.intro}
                items={glanceItems}
              />
            </SectionShell>
          ) : null}

          {model.comparison ? (
            <SectionShell id="compare" muted>
              <BestSoftwareGlanceTable
                heading={model.comparison.heading}
                columns={model.comparison.columns}
                rows={model.comparison.rows}
                compareAllHref="/compare/"
                compareAllLabel={`Compare ${model.categoryShortName} software`}
              />
            </SectionShell>
          ) : null}

          {model.productDeepDives.length > 0 ? (
            <SectionShell id="recommendations">
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
                {model.listMode === "ranked"
                  ? `Our top ${model.categoryShortName} picks`
                  : `Editor’s ${model.categoryShortName} picks by job`}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-[var(--sg-color-text-muted)]">
                {model.listMode === "ranked"
                  ? "Evidence-backed write-ups for the ranked shortlist. Scores come from approved assessments; fit badges reflect approved editorial awards."
                  : "Evidence-backed write-ups by job cluster — not a single #1 ranking. Scores come from approved assessments; labels are cluster awards. A higher overall score does not outrank a different job."}
              </p>
              <div className="mt-8 space-y-8">
                {model.productDeepDives.map((item) => (
                  <BestSoftwareProductSection
                    key={item.product.slug}
                    item={item}
                  />
                ))}
              </div>
            </SectionShell>
          ) : null}

          {model.topPicks.length > 0 ? (
            <SectionShell id="top-picks" muted>
              <BestSoftwareTopPicks items={model.topPicks} />
            </SectionShell>
          ) : null}

          {model.byNeed.length > 0 ? (
            <SectionShell id="by-need" muted={!model.topPicks.length}>
              <BestSoftwareByNeed items={model.byNeed} />
            </SectionShell>
          ) : null}

          {model.pricing ? (
            <SectionShell id="pricing">
              <BestSoftwarePricingInteractive
                pricing={model.pricing}
                snapshots={pricingSnapshots as NonNullable<typeof pricingSnapshots[number]>[]}
              />
            </SectionShell>
          ) : null}

          {model.featureMatrix ? (
            <SectionShell id="features" muted>
              <BestSoftwareFeatureMatrix
                heading={model.featureMatrix.heading}
                products={model.featureMatrix.products}
                rows={model.featureMatrix.rows}
              />
            </SectionShell>
          ) : null}

          {model.tradeOffs.length > 0 ? (
            <SectionShell id="trade-offs">
              <BestSoftwareTradeoffs items={model.tradeOffs} />
            </SectionShell>
          ) : null}

          {model.decision ? (
            <SectionShell id="which" muted>
              <BestSoftwareDecision decision={model.decision} />
            </SectionShell>
          ) : model.decisionExplore ? (
            <SectionShell id="which" muted>
              <BestSoftwareDecisionExplore
                explore={model.decisionExplore}
                productsByPriority={productsByPriority}
              />
            </SectionShell>
          ) : null}

          {model.finderCta ? (
            <div className="py-4">
              <BestSoftwareFinderCta
                cta={model.finderCta}
                previewProducts={glanceItems.map((i) => i.product)}
              />
            </div>
          ) : null}

          {model.buyingFramework ? (
            <SectionShell id="how-to-choose">
              <BestSoftwareBuyingFramework framework={model.buyingFramework} />
            </SectionShell>
          ) : null}

          {model.comparisons.length > 0 ? (
            <SectionShell id="comparisons" muted>
              <BestSoftwareComparisons
                title={`Popular ${model.categoryShortName} comparisons`}
                items={model.comparisons}
              />
            </SectionShell>
          ) : null}

          {model.guideGroups.length > 0 ? (
            <SectionShell id="guides">
              <BestSoftwareGuideGroups
                groups={model.guideGroups}
                exploreAllHref={
                  category
                    ? `/guides/?category=${category.slug}`
                    : "/guides/"
                }
              />
            </SectionShell>
          ) : null}

          {model.productHubs.length > 0 ? (
            <SectionShell id="product-hubs" muted>
              <BestSoftwareProductHubs hubs={model.productHubs} />
            </SectionShell>
          ) : null}

          {model.methodology ? (
            <SectionShell id="methodology">
              <BestMethodologySummary methodology={model.methodology} />
              {model.researchTransparency ? (
                <BestSoftwareResearchTransparency
                  data={model.researchTransparency}
                  className="mt-6"
                />
              ) : null}
            </SectionShell>
          ) : null}

          {model.alternatives.length > 0 ? (
            <SectionShell id="alternatives" muted>
              <BestSoftwareAlternatives
                title={`Popular ${model.categoryShortName} alternatives`}
                items={model.alternatives}
              />
            </SectionShell>
          ) : null}

          <SectionShell id="faq" className="pb-2">
            <div className="grid gap-5 lg:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)] lg:items-start">
              <BestSoftwareTrust trust={model.trust} dark />
              {model.faq.length > 0 ? (
                <div className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 sm:p-5">
                  <BestSoftwareFaq items={model.faq} />
                </div>
              ) : null}
            </div>
          </SectionShell>

          <InternalLinkingModules
            plan={linkPlan}
            omit={["relatedProducts", "relatedComparisons", "relatedGuides"]}
            showParentInline
            className="mt-8"
          />

          <NewsletterCard
            source="article-end"
            hideWhenDisabled
            className="mt-4"
          />
        </div>
      </PageContainer>
    </>
  );
}
