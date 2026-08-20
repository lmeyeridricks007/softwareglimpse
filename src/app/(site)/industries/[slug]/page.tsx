import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndustries, getIndustryBySlug } from "@/data";
import { HubDecisionLinks } from "@/components/hub/hub-decision-links";
import { IndustryCapabilityMatrix } from "@/components/industries/industry-capability-matrix";
import { IndustryCompareTable } from "@/components/industries/industry-compare-table";
import { IndustryComparisonsSection } from "@/components/industries/industry-comparisons-section";
import { IndustryCostPreview } from "@/components/industries/industry-cost-preview";
import {
  IndustryCapabilityNeeds,
  IndustryChallenges,
  IndustryHowCrmHelps,
  IndustryOverview,
} from "@/components/industries/industry-depth-sections";
import { IndustryWorkflow } from "@/components/industries/industry-workflow";
import { IndustryFinalCta } from "@/components/industries/industry-final-cta";
import { IndustryFinderModule } from "@/components/industries/industry-finder-module";
import { IndustryGlanceStrip } from "@/components/industries/industry-glance-strip";
import { IndustryHowToChoose } from "@/components/industries/industry-how-to-choose";
import { IndustryHubHero } from "@/components/industries/industry-hub-hero";
import { IndustryImplementation } from "@/components/industries/industry-implementation";
import { IndustryProductExplorer } from "@/components/industries/industry-product-explorer";
import { IndustryProductFitSection } from "@/components/industries/industry-product-fit";
import { IndustryRelatedSection } from "@/components/industries/industry-related-section";
import { IndustryResearchPanel } from "@/components/industries/industry-research-panel";
import { IndustrySecuritySection } from "@/components/industries/industry-security-section";
import {
  IndustryFaqSection,
  IndustryGuidesSection,
  IndustryQuickNav,
} from "@/components/industries/industry-shared-sections";
import { IndustryUseCases } from "@/components/industries/industry-use-cases";
import { IndustryVendorQuestions } from "@/components/industries/industry-vendor-questions";
import { IndustryWhatMatters } from "@/components/industries/industry-what-matters";
import {
  IndustryEvidenceSection,
  IndustryScreenshotWorkflowFallback,
  IndustrySeeCrmInIndustry,
  IndustryWorkflowVideoCompare,
} from "@/components/industries/industry-media-sections";
import { ProductIndustryAssessmentSection } from "@/components/industries/product-industry-assessment";
import { IndustryCustomerStoriesSection } from "@/components/industries/industry-customer-stories";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { buildIndustryHubModel } from "@/services/industry-hub";
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
  return getIndustries({ includeUnpublished: true }).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug, { includeUnpublished: true });
  if (!industry) {
    return buildPageMetadata({
      title: "Industry not found",
      description: "This industry hub does not exist.",
      path: `/industries/${slug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: industry.seo.title || `${industry.name} CRM software`,
    description:
      industry.seo.description ||
      industry.shortDescription ||
      industry.description ||
      `CRM software context for ${industry.name}.`,
    path: industry.seo.canonicalPath || `/industries/${industry.slug}/`,
    indexable: industry.seo.indexable === true,
  });
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug, { includeUnpublished: true });
  if (!industry) {
    console.error(`[industries] Unknown industry slug: ${slug}`);
    notFound();
  }

  let model;
  try {
    model = buildIndustryHubModel(industry);
  } catch (error) {
    console.error(`[industries] Failed to build hub model for ${slug}:`, error);
    throw error;
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    {
      name: industry.name,
      path: `/industries/${industry.slug}/`,
    },
  ];

  const path = industry.seo.canonicalPath || `/industries/${industry.slug}/`;
  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;
  const indexable = industry.seo.indexable === true;

  return (
    <>
      {indexable ? (
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
      ) : null}
      <Breadcrumbs items={breadcrumbItems} />

      <IndustryHubHero
        className="mt-2"
        badgeLabel={model.badgeLabel}
        title={model.displayTitle}
        tagline={model.tagline}
        confidenceMessage={model.confidenceMessage}
        primaryCta={{ href: model.finderHref, label: "Find My CRM" }}
        secondaryCta={{
          href: model.compareHref,
          label: "Compare CRM Software",
        }}
        textLink={{
          href: model.catalogueHref,
          label: "Browse all CRM software",
        }}
        priorities={model.priorities}
        prioritiesHref={model.finderHref}
        heroVisual={model.heroVisual}
        seeWorkflowHref={
          model.seeInIndustryCards.length > 0 ||
          model.screenshotFallback.length > 0
            ? "#see-in-industry"
            : undefined
        }
        seeWorkflowLabel={`See CRM workflows for ${model.badgeLabel.toLowerCase()}`}
      />

      <IndustryGlanceStrip
        className="mt-6"
        industryLabel={model.badgeLabel}
        primaryGoal={model.glance.primaryGoal}
        commonPriorities={model.glance.commonPriorities}
        teamTypes={model.glance.teamTypes}
        researchedProductCount={model.glance.researchedProductCount}
        lastReviewedAt={model.glance.lastReviewedAt}
      />

      <IndustryQuickNav items={model.navItems} />

      <div className="mt-10 space-y-14">
        <IndustryOverview
          overview={model.overview}
          whoThisIsFor={model.whoThisIsFor}
          workedExample={model.workedExample}
          workedExampleSecondary={model.workedExampleSecondary}
          focusAreas={model.glance.commonPriorities}
          needsVisual={model.needsVisual}
          industryLabel={model.badgeLabel}
        />

        <IndustryChallenges
          items={model.challenges}
          industryLabel={model.badgeLabel}
        />

        <IndustryHowCrmHelps
          items={model.challenges}
          outcomes={model.outcomes}
          industryLabel={model.badgeLabel}
        />

        <IndustryWhatMatters
          title={`What matters when choosing CRM for ${industry.name.toLowerCase()}?`}
          intro={model.whatMattersIntro}
          items={model.priorities}
        />

        <IndustryCapabilityNeeds
          items={model.capabilityNeeds}
          industryLabel={model.badgeLabel}
        />

        <IndustryWorkflow
          model={model.workflowExperience}
          steps={model.workflowSteps}
          workflowVisual={model.workflowVisual}
          industryLabel={model.badgeLabel}
        />

        <IndustryUseCases
          items={model.useCases}
          seeWorkflowHref={
            model.seeInIndustryCards.length > 0 ? "#see-in-industry" : undefined
          }
        />

        <IndustryProductFitSection
          industryLabel={model.badgeLabel}
          items={model.productFitCards}
        />

        <IndustryProductExplorer
          items={model.productCards}
          viewAllHref={model.catalogueHref}
        />

        <IndustrySeeCrmInIndustry
          industryLabel={model.badgeLabel}
          industrySlug={model.industry.slug}
          cards={model.seeInIndustryCards}
          methodologyNote={model.methodologyNote}
          requirementsHref={`/tools/crm-requirements-builder/?industry=${model.industry.slug}&start=1`}
          finderHref={model.finderHref}
        />

        <IndustryScreenshotWorkflowFallback
          industryLabel={model.badgeLabel}
          shots={model.screenshotFallback}
        />

        <ProductIndustryAssessmentSection
          industryLabel={model.badgeLabel}
          assessments={model.productIndustryAssessments}
        />

        <IndustryWorkflowVideoCompare
          industryLabel={model.badgeLabel}
          compare={model.workflowCompare}
        />

        <IndustryCompareTable rows={model.compareRows} />

        <IndustryFinderModule
          industryLabel={industry.name}
          finderHref={model.finderHref}
        />

        {model.capabilityMatrix ? (
          <IndustryCapabilityMatrix
            products={model.capabilityMatrix.products}
            groups={model.capabilityMatrix.groups}
          />
        ) : null}

        <IndustryCostPreview
          industryLabel={industry.name}
          preview={model.costPreview}
          calculatorHref={model.calculatorHref}
          comparePricingHref={model.compareHref}
        />

        <IndustryHowToChoose
          title={`How to choose CRM software for ${industry.name.toLowerCase()}`}
          steps={model.buyingFramework}
          guideHref={model.buyingGuideHref}
        />

        <IndustryVendorQuestions items={model.evaluationQuestions} />

        <IndustrySecuritySection
          dimensions={model.securityDimensions}
          disclaimer={model.securityDisclaimer}
        />

        <IndustryImplementation items={model.implementationConsiderations} />

        <IndustryCustomerStoriesSection stories={model.customerStories} />

        <IndustryComparisonsSection items={model.comparisons} />

        <IndustryGuidesSection
          title="CRM buying guides"
          items={model.guides}
          featuredHref={model.buyingGuideHref ?? undefined}
        />

        <IndustryResearchPanel
          researchedProductCount={model.researchPanel.researchedProductCount}
          lastRefresh={model.researchPanel.lastRefresh}
          evidenceCoverageLabel={model.researchPanel.evidenceCoverageLabel}
          methodologyHref={model.methodologyHref}
        />

        <IndustryEvidenceSection model={model.evidenceExplorer} />

        <IndustryFaqSection items={model.faq} />

        <IndustryRelatedSection items={model.relatedIndustries} />

        <HubDecisionLinks
          title="Tools, guides & related CRM pages"
          description={`Continue from ${industry.name.toLowerCase()} CRM research with decision tools and related hubs. Affiliate relationships never change recommendations.`}
          context={{
            industrySlug: model.industry.slug,
            excludeHrefs: [`/industries/${model.industry.slug}/`],
          }}
        />

        <IndustryFinalCta
          finderHref={model.finderHref}
          compareHref={model.compareHref}
          requirementsHref={`/tools/crm-requirements-builder/?industry=${model.industry.slug}&start=1`}
        />

        <NewsletterCard source="article-end" hideWhenDisabled />
        <TrustStrip />
      </div>
    </>
  );
}
