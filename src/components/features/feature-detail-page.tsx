import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import {
  FeatureContextFlow,
  FeatureDefinition,
  FeatureGlanceStrip,
  FeatureHero,
  FeatureNeedSection,
} from "@/components/features/feature-hero";
import {
  FeatureDepthChallenges,
  FeatureDepthOutcomes,
  FeatureDepthOverview,
  FeatureDepthWorkflow,
} from "@/components/features/feature-depth-sections";
import {
  FeatureComparisonMatrix,
  FeaturePlanAvailability,
  FeatureProductSupport,
} from "@/components/features/feature-support";
import {
  FeatureComparisons,
  FeatureDeepDives,
  FeatureExamples,
  FeatureFaq,
  FeatureFinalCta,
  FeatureFinderBanner,
  FeatureHowItWorks,
  FeatureImplementation,
  FeatureIndustryRelevance,
  FeatureMethodology,
  FeatureQuickNav,
  FeatureRelated,
  FeatureScreenshots,
  FeatureSidebar,
  FeatureTradeoffs,
  FeatureUseCaseRelevance,
  FeatureVendorQuestions,
} from "@/components/features/feature-sections";
import { FeatureSeeInAction } from "@/components/features/feature-media-sections";
import { DynamicEvidenceExplorer } from "@/components/evidence/dynamic-evidence-explorer";
import { InternalLinkingModules } from "@/components/internal-linking";
import { HubPageTwinSiblings } from "@/components/hub/hub-page-twin-siblings";
import { buildFeatureEvidenceExplorer } from "@/services/evidence-explorer";
import type { FeatureDetailModel } from "@/services/feature-detail";
import { buildFeatureLinkPlan } from "@/services/internal-linking";
import { Card } from "@/components/ui/card";

/**
 * Reusable Feature Detail page template.
 * Hero is full-width; TOC/tools sit beside body content only.
 * All product claims come from the evidence-backed page model.
 */
export function FeatureDetailPage({ model }: { model: FeatureDetailModel }) {
  const path = model.industry
    ? `/industries/${model.industry.slug}/features/${model.featureSlug}/`
    : `/features/${model.featureSlug}/`;

  const featureLinkPlan = buildFeatureLinkPlan({
    featureSlug: model.featureSlug,
    featureName: model.featureName,
    capabilityHref: model.capabilityHref,
    capabilityName: model.profile.primaryCapabilityName ?? null,
    relatedFeatures: model.relatedFeatures,
    relatedCapabilities: model.relatedCapabilities,
    relatedRequirementSlugs: (model.profile.requirementMappings ?? [])
      .map((r) => r.requirementSlug)
      .filter((s): s is string => Boolean(s)),
    useCaseSlugs: (model.useCaseRelevance ?? [])
      .map((u) => {
        const m = u.href?.match(/\/use-cases\/([^/]+)/);
        return m?.[1] ?? u.id;
      })
      .filter(Boolean),
    comparisons: model.comparisons,
    productSlugs: model.productCards.map((p) => p.slug),
  });

  const breadcrumbItems = model.industry
    ? [
        { name: "Home", path: "/" },
        { name: "Industries", path: "/industries/" },
        {
          name: model.industry.name,
          path: `/industries/${model.industry.slug}/`,
        },
        { name: "Features", path: `/features/` },
        { name: model.featureName, path },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Features", path: "/features/" },
        ...(model.profile.primaryCapabilityName
          ? [
              {
                name: model.profile.primaryCapabilityName,
                path: model.capabilityHref ?? model.categoryHref,
              },
            ]
          : []),
        { name: model.featureName, path },
      ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <FeatureHero model={model} className="mt-2" />
      <FeatureGlanceStrip glance={model.glance} className="mt-6" />

      {!model.industry ? (
        <HubPageTwinSiblings path={path} className="mt-6" />
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start">
        <div className="min-w-0 space-y-8">
          <FeatureQuickNav items={model.navItems} />

          <div className="space-y-14">
            {model.industryContext?.importanceSummary ? (
              <Card className="border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 p-5">
                <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
                  Why this matters in {model.industry?.name}
                </p>
                <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                  {model.industryContext.importanceSummary}
                </p>
              </Card>
            ) : null}

            {model.profile.overview ? (
              <FeatureDepthOverview
                overview={model.profile.overview}
                whoThisIsFor={model.profile.whoThisIsFor}
                whatMattersIntro={model.profile.whatMattersIntro}
                needsVisual={model.profile.needsVisual}
                featureLabel={model.featureName}
              />
            ) : null}

            <FeatureDefinition
              name={model.featureName}
              definition={model.profile.definition}
              notTheSameAs={model.profile.notTheSameAs}
            />

            <FeatureDepthChallenges items={model.profile.challenges} />
            <FeatureDepthOutcomes items={model.profile.outcomes} />

            <FeatureDepthWorkflow
              steps={model.profile.workflowSteps}
              workflowVisual={model.profile.workflowVisual}
              featureLabel={model.featureName}
            />

            {!model.profile.workflowVisual ? (
              <FeatureHowItWorks
                featureName={model.featureName}
                visualKind={model.visualKind}
                caption={model.howItWorksCaption}
              />
            ) : null}

            <FeatureExamples
              featureName={model.featureName}
              items={model.workedExamples}
            />

            <FeatureNeedSection
              needIf={model.profile.needGuidance?.needIf ?? []}
              mayNotNeedIf={model.profile.needGuidance?.mayNotNeedIf ?? []}
              finderHref={model.finderHref}
            />

            <FeatureContextFlow model={model} />

            <FeatureSeeInAction
              featureName={model.featureName}
              cards={model.seeInAction}
            />

            <FeatureProductSupport
              title={`Which CRM products support ${model.featureName.toLowerCase()}?`}
              items={model.productCards}
            />

            <FeatureComparisonMatrix
              featureName={model.featureName}
              products={model.productRows.slice(0, 5)}
              dimensions={model.profile.evaluationDimensions}
            />

            <FeaturePlanAvailability
              rows={model.planRows}
              calculatorHref={model.calculatorHref}
            />

            <FeatureImplementation
              themes={model.profile.implementationThemes}
              products={model.productCards}
              seeInAction={model.seeInAction}
            />

            <DynamicEvidenceExplorer
              model={buildFeatureEvidenceExplorer(model)}
              sectionId="feature-evidence"
            />

            <FeatureScreenshots
              featureName={model.featureName}
              items={model.screenshots}
            />

            <FeatureDeepDives
              featureName={model.featureName}
              items={model.productCards.slice(0, 5)}
            />
            <FeatureTradeoffs
              items={model.profile.tradeoffs}
              industryTradeoffs={model.industryContext?.tradeoffs}
            />

            <FeatureUseCaseRelevance items={model.useCaseRelevance} />

            {!model.industry ? (
              <FeatureIndustryRelevance items={model.industryRelevance} />
            ) : null}

            <FeatureVendorQuestions
              featureName={model.featureName}
              items={model.profile.vendorQuestions}
            />

            <FeatureRelated
              features={model.relatedFeatures}
              capabilities={model.relatedCapabilities}
            />

            <FeatureComparisons items={model.comparisons} />

            {!model.industry ? (
              <InternalLinkingModules
                plan={featureLinkPlan}
                omit={[
                  "relatedFeatures",
                  "relatedCapabilities",
                  "relatedComparisons",
                  "parentHub",
                ]}
                showParentInline={false}
              />
            ) : null}

            <FeatureFinderBanner
              featureName={model.featureName}
              finderHref={model.finderHref}
            />

            <FeatureMethodology
              featureName={model.featureName}
              research={model.research}
              decisionFlow={model.decisionFlow}
              methodologyHref={model.methodologyHref}
            />

            <FeatureFaq items={model.profile.faq} />

            <FeatureFinalCta
              title={`Need a CRM with ${model.featureName.toLowerCase()}?`}
              description={`Compare catalogue CRM products based on this feature plus your other requirements, team size and budget.`}
              finderHref={model.finderHref}
              compareHref={model.compareHref}
            />

            <NewsletterCard source="article-end" hideWhenDisabled />
            <TrustStrip />
          </div>
        </div>

        <FeatureSidebar model={model} />
      </div>
    </>
  );
}
