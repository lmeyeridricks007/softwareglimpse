import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryByPath,
  getSoftwareBySlug,
} from "@/data";
import { CategoryAtAGlance } from "@/components/category/category-at-a-glance";
import { CategoryBestPreview } from "@/components/category/category-best-preview";
import { CategoryBuyingFramework } from "@/components/category/category-buying-framework";
import { CategoryComparisons } from "@/components/category/category-comparisons";
import { CategoryExplorePaths } from "@/components/category/category-explore-paths";
import { CategoryFAQ } from "@/components/category/category-faq";
import { CategoryFeatureMatrix } from "@/components/category/category-feature-matrix";
import { CategoryFeatures } from "@/components/category/category-features";
import { CategoryFinderCTA } from "@/components/category/category-finder-cta";
import { CategoryDecisionTools } from "@/components/category/category-decision-tools";
import { CategoryGuides } from "@/components/category/category-guides";
import { CategoryHero } from "@/components/category/category-hero";
import { CategoryIndustries } from "@/components/category/category-industries";
import { CategoryBusinessTypes } from "@/components/category/category-business-types";
import { CategoryCapabilities } from "@/components/category/category-capabilities";
import { CategoryResources } from "@/components/category/category-resources";
import { CategoryLogoStrip } from "@/components/category/category-logo-strip";
import { CategoryMethodology } from "@/components/category/category-methodology";
import { CategoryPricingPreview } from "@/components/category/category-pricing-preview";
import { CategoryProductGrid } from "@/components/category/category-product-grid";
import { CategoryQuickNav } from "@/components/category/category-quick-nav";
import { CategoryReviewsRow } from "@/components/category/category-reviews-row";
import { CategoryTypes } from "@/components/category/category-types";
import { CategoryUseCases } from "@/components/category/category-use-cases";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { isEntityIndexable } from "@/domain/quality-gates";
import type { Category } from "@/domain";
import { buildCategoryHubModel } from "@/services/category-hub";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.path }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryByPath(slug);
  if (!category) {
    return buildPageMetadata({
      title: "Category not found",
      description: "This category does not exist.",
      path: `/categories/${slug.join("/")}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: category.seo.title || category.name,
    description:
      category.seo.description ||
      category.shortDescription ||
      `${category.name} software category.`,
    path:
      category.seo.canonicalPath ||
      `/categories/${category.path.join("/")}/`,
    indexable: isEntityIndexable({ kind: "category", entity: category }),
  });
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryByPath(slug);
  if (!category) notFound();

  return <CategoryHubPage category={category} />;
}

function CategoryHubPage({ category }: { category: Category }) {
  const model = buildCategoryHubModel(category);
  const { shortLabel } = model;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Software Categories", path: "/categories/" },
    {
      name: category.name,
      path: `/categories/${category.path.join("/")}/`,
    },
  ];

  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;

  const finderMatches =
    model.finderExample?.matchSlugs
      .map((slug) => getSoftwareBySlug(slug))
      .filter(Boolean)
      .map((p) => ({
        name: p!.name,
        logo: p!.logo,
      })) ?? [];

  const navItems = model.navItems.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
  }));

  const primaryCta = model.finderHref
    ? {
        href: model.finderHref,
        label: `Find My ${shortLabel}`,
      }
    : undefined;

  const secondaryCta = {
    href: "/compare/",
    label: `Compare ${shortLabel} Software`,
  };

  const textLink = model.bestHref
    ? {
        href: model.bestHref,
        label: `See Best ${shortLabel} Software`,
      }
    : model.productCards[0]
      ? {
          href: `#software`,
          label: `See ${shortLabel} software`,
        }
      : undefined;

  return (
    <>
      <JsonLdScript
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          ...(faqLd ? [faqLd] : []),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      <CategoryHero
        name={model.displayName}
        categoryId={model.profile?.iconSlug ?? category.slug}
        tagline={model.tagline}
        definition={model.definition}
        stats={model.stats}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        textLink={textLink}
        decisionSnapshot={{
          categoryLabel: shortLabel,
          criteria: model.decisionCriteria,
          popularNeeds: model.popularNeeds,
          chooseHref: model.chooseGuideHref ?? undefined,
          chooseLabel: `See how to choose ${shortLabel}`,
        }}
        methodologyHref={model.methodologyHref}
        className="mt-2"
      />

      <CategoryQuickNav items={navItems} />

      <div className="mt-10 space-y-14">
        {model.explorePaths.length > 0 ? (
          <CategoryExplorePaths
            title={`Choose how you want to explore ${shortLabel}`}
            items={model.explorePaths}
          />
        ) : null}

        {model.glance ? (
          <CategoryAtAGlance
            title={`${shortLabel} at a glance`}
            whatItDoes={model.glance.whatItDoes}
            bestFor={model.glance.bestFor}
            typicalFeatures={model.glance.typicalFeatures}
          />
        ) : null}

        {model.logoStrip.length > 0 ? (
          <CategoryLogoStrip
            title={`Popular ${shortLabel} platforms`}
            items={model.logoStrip}
          />
        ) : null}

        {model.types.length > 0 ? (
          <CategoryTypes
            title={`Which type of ${shortLabel} do you need?`}
            items={model.types}
          />
        ) : null}

        <CategoryProductGrid
          title={`${shortLabel} software to explore`}
          items={model.productCards}
          viewAllHref={model.bestHref ?? model.catalogueHref}
          viewAllLabel={
            model.bestHref
              ? `View ${shortLabel} evaluation guide`
              : `View all ${shortLabel} software`
          }
        />

        {model.rankingsApproved ? (
          <CategoryBestPreview
            title={`Best ${shortLabel} software`}
            subtitle="Our current shortlist"
            items={model.bestPreview}
            viewAllHref={model.bestHref ?? undefined}
            viewAllLabel={`See all Best ${shortLabel} Software`}
          />
        ) : model.productCards.length > 0 ? (
          <CategoryBestPreview
            title={`${shortLabel} software worth comparing`}
            subtitle="Catalogue products — rankings publish only after editorial approval."
            items={[]}
            unranked
            unrankedItems={model.productCards.slice(0, 6).map((p) => ({
              slug: p.slug,
              name: p.name,
              logo: p.logo,
              bestFor: p.bestFor,
            }))}
            viewAllHref={model.bestHref ?? undefined}
            viewAllLabel={
              model.bestHref
                ? `See how we evaluate ${shortLabel}`
                : undefined
            }
          />
        ) : null}

        {model.finderHref ? (
          <CategoryFinderCTA
            title={`Not sure which ${shortLabel} fits?`}
            description={`Find your ${shortLabel} in about 2 minutes. Tell us about team size, budget, process, features, and integrations — we'll match catalogue products. Affiliate status never changes order.`}
            href={model.finderHref}
            ctaLabel={`Find My ${shortLabel}`}
            requirements={model.finderExample?.requirements}
            matches={finderMatches}
            disclaimer={model.finderExample?.disclaimer}
          />
        ) : null}

        <CategoryDecisionTools
          title={`${shortLabel} decision tools`}
          items={model.decisionTools}
        />

        <CategoryUseCases
          title={`${shortLabel} by business need`}
          items={model.useCases}
        />

        <CategoryCapabilities
          title={`${shortLabel} by capability`}
          items={model.capabilities}
        />

        <CategoryBusinessTypes
          title={`${shortLabel} by business type`}
          items={model.businessTypes}
        />

        <CategoryIndustries
          title={`${shortLabel} by industry`}
          items={model.industries}
        />

        {model.resources.length > 0 ? (
          <CategoryResources
            title={`${shortLabel} checklists & templates`}
            items={model.resources}
          />
        ) : null}

        <CategoryComparisons
          title={`Popular ${shortLabel} comparisons`}
          items={model.comparisons}
          builderHref="/compare/"
          builderLabel={`Choose two ${shortLabel} platforms`}
        />

        {model.pricingModel ? (
          <CategoryPricingPreview
            title={`What does ${shortLabel} software cost?`}
            summary={model.pricingModel.summary}
            seatExamples={model.pricingModel.seatExamples}
            startingPrices={model.verifiedStartingPrices}
            calculatorHref={model.pricingModel.calculatorHref}
            guideHref={model.pricingModel.guideHref}
          />
        ) : null}

        <CategoryFeatures
          title={`Key ${shortLabel} features`}
          items={model.features}
        />

        {model.featureMatrix ? (
          <CategoryFeatureMatrix
            title={`${shortLabel} feature comparison`}
            products={model.featureMatrix.products}
            rows={model.featureMatrix.rows}
          />
        ) : null}

        {model.buyingFramework.length > 0 ? (
          <CategoryBuyingFramework
            title={`How to choose ${shortLabel}`}
            steps={model.buyingFramework}
            guideHref={model.buyingGuideHref ?? undefined}
            guideLabel={`Read the complete ${shortLabel} buying guide`}
          />
        ) : null}

        <CategoryReviewsRow
          title={`Latest ${shortLabel} reviews`}
          items={model.reviews}
          viewAllHref={model.catalogueHref}
          viewAllLabel={`View all ${shortLabel} software`}
        />

        <CategoryGuides
          title={`${shortLabel} guides`}
          items={model.guides}
          featuredHref={model.buyingGuideHref ?? undefined}
          resourcesHref={
            model.resources.length > 0 ? "/resources/" : undefined
          }
        />

        <CategoryMethodology
          title={`How we evaluate ${shortLabel} software`}
          description={`We evaluate ${shortLabel} products using criteria relevant to ${shortLabel} buyers. Affiliate relationships never influence scores.`}
          criteria={model.methodologyCriteria}
          href={model.methodologyHref}
        />

        {model.faq.length > 0 ? <CategoryFAQ items={model.faq} /> : null}
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="category" hideWhenDisabled />
        <TrustStrip />
      </section>
    </>
  );
}
