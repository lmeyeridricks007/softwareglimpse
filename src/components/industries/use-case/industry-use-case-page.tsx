import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import {
  CapabilityPriorityProfile,
  UseCaseGlanceStrip,
  UseCaseHero,
  UseCaseNeeds,
} from "@/components/industries/use-case/use-case-hero";
import {
  UseCaseProductCards,
  UseCaseRequirementMatrix,
  UseCaseRequirements,
  UseCaseScorecard,
  UseCaseShortAnswer,
} from "@/components/industries/use-case/use-case-decision";
import { UseCaseScreenshots } from "@/components/industries/use-case/use-case-screenshots";
import { UseCaseSeeInAction } from "@/components/use-cases/use-case-media-sections";
import {
  UseCaseComparisons,
  UseCaseDeepDives,
  UseCaseFaq,
  UseCaseFinalCta,
  UseCaseFinderBanner,
  UseCaseHowItWorks,
  UseCaseImplementation,
  UseCaseMethodology,
  UseCasePricingCta,
  UseCaseQuickNav,
  UseCaseRelatedCapabilities,
  UseCaseRelatedUseCases,
  UseCaseScenarios,
  UseCaseSidebar,
  UseCaseTradeoffs,
  UseCaseVendorQuestions,
  UseCaseWhyDiffer,
} from "@/components/industries/use-case/use-case-sections";
import type { IndustryUseCaseModel } from "@/services/industry-use-case";

/**
 * Reusable Industry × Use Case decision page template.
 * Hero is full-width; TOC/tools sit beside body content only.
 */
export function IndustryUseCasePage({ model }: { model: IndustryUseCaseModel }) {
  const path = `/industries/${model.industry.slug}/use-cases/${model.useCaseSlug}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    { name: model.industry.name, path: model.industryHref },
    { name: "Use cases", path: `${model.industryHref}#use-cases` },
    { name: model.useCaseName, path },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <UseCaseHero
        className="mt-2"
        eyebrow={model.eyebrow}
        title={model.displayTitle}
        tagline={model.tagline}
        useCaseName={model.useCaseName}
        useCaseSlug={model.useCaseSlug}
        capabilities={model.capabilities}
        hasNumericWeights={model.hasNumericWeights}
        primaryCta={{
          href: model.compareHref,
          label: "Compare CRM options",
        }}
        secondaryCta={{ href: model.finderHref, label: "Find My CRM" }}
        textLink={{
          href: model.industryHref,
          label: `${model.industry.name} CRM`,
        }}
        researchCoverage={{
          productCount: model.research.productCount,
          requirementCount: model.research.requirementCount,
          evidenceItemCount: model.research.evidenceItemCount,
          lastUpdated: model.research.lastUpdated,
        }}
      />

      <UseCaseGlanceStrip glance={model.glance} className="mt-6" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start">
        <div className="min-w-0 space-y-8">
          <UseCaseQuickNav items={model.navItems} />

          <div className="space-y-14">
            <UseCaseShortAnswer
              picks={model.summaryPicks}
              decisionNuance={model.decisionNuance}
            />

            <UseCaseHowItWorks
              useCaseName={model.useCaseName}
              useCaseSlug={model.useCaseSlug}
              industryName={model.industry.name}
            />

            <UseCaseNeeds
              title={`What ${model.useCaseName.toLowerCase()} teams need from CRM`}
              capabilities={model.capabilities}
            />

            <CapabilityPriorityProfile
              capabilities={model.capabilities}
              hasNumericWeights={model.hasNumericWeights}
            />

            <UseCaseRequirements
              title={`Key CRM requirements for ${model.useCaseName.toLowerCase()}`}
              groups={model.requirementsByCapability}
              mustHave={model.mustHaveRequirements}
              niceToHave={model.niceToHaveRequirements}
              finderHref={model.finderHref}
            />

            <UseCaseProductCards
              title={`CRM options for ${model.useCaseName.toLowerCase()}`}
              items={model.productCards}
              useCaseName={model.useCaseName}
            />

            <UseCaseWhyDiffer items={model.whyDiffer} />

            <UseCaseScorecard
              rows={model.productRows}
              columns={model.scorecardColumns}
              hasNumericScores={model.hasNumericScores}
            />

            <UseCaseRequirementMatrix
              products={model.productRows.slice(0, 5)}
              features={model.matrixFeatureSlugs}
            />

            <UseCaseDeepDives
              title={`How each CRM fits ${model.useCaseName.toLowerCase()}`}
              items={model.deepDives}
              useCaseName={model.useCaseName}
            />

            <UseCaseScreenshots
              useCaseName={model.useCaseName}
              items={model.screenshots}
            />

            {model.seeInAction.length > 0 ? (
              <UseCaseSeeInAction
                useCaseLabel={model.useCaseName}
                cards={model.seeInAction}
                evidenceHref={
                  model.screenshots.length > 0 ? "#screenshots" : undefined
                }
              />
            ) : null}

            <UseCaseScenarios
              title={`Worked examples for ${model.useCaseName.toLowerCase()}`}
              items={model.scenarios}
              finderHref={model.finderHref}
            />

            <UseCasePricingCta
              calculatorHref={model.calculatorHref}
              useCaseName={model.useCaseName}
            />

            <UseCaseTradeoffs items={model.tradeoffs} />

            <UseCaseImplementation items={model.implementation} />

            <UseCaseVendorQuestions items={model.vendorQuestions} />

            <UseCaseRelatedCapabilities items={model.relatedCapabilities} />

            <UseCaseRelatedUseCases
              title={`Other ${model.industry.name.toLowerCase()} CRM use cases`}
              items={model.relatedUseCases}
            />

            <UseCaseComparisons items={model.comparisons} />

            <UseCaseFinderBanner
              useCaseName={model.useCaseName}
              finderHref={model.finderHref}
            />

            <UseCaseMethodology
              useCaseName={model.useCaseName}
              research={model.research}
              decisionFlow={model.decisionFlow}
              methodologyHref={model.methodologyHref}
            />

            <UseCaseFaq items={model.faq} />

            <UseCaseFinalCta
              title="Find the CRM that fits your team"
              description={`Start with our ${model.industry.name.toLowerCase()} ${model.useCaseName.toLowerCase()} requirements and personalize for your team size, budget, workflow, and integrations.`}
              finderHref={model.finderHref}
              compareHref={model.compareHref}
              requirementsHref={`/tools/crm-requirements-builder/?industry=${model.industry.slug}&useCase=${model.useCaseSlug}&start=1`}
            />

            <NewsletterCard source="article-end" hideWhenDisabled />
            <TrustStrip />
          </div>
        </div>

        <UseCaseSidebar
          navItems={model.navItems}
          finderHref={model.finderHref}
          calculatorHref={model.calculatorHref}
          compareHref={model.compareHref}
          relatedCapabilities={model.relatedCapabilities}
        />
      </div>
    </>
  );
}
