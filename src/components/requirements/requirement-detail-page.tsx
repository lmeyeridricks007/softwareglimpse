import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { DynamicEvidenceExplorer } from "@/components/evidence/dynamic-evidence-explorer";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import {
  RequirementAcceptanceNeeds,
  RequirementChallenges,
  RequirementEvalWorkflow,
  RequirementHowItHelps,
  RequirementOverview,
} from "@/components/requirements/requirement-depth-sections";
import {
  RequirementFitModel,
  RequirementGlanceStrip,
  RequirementHero,
  RequirementNeedSection,
  RequirementShortAnswer,
  RequirementWhy,
} from "@/components/requirements/requirement-hero";
import {
  RequirementCriteria,
  RequirementFeatures,
  RequirementMatrix,
  RequirementProductFit,
  RequirementScorecard,
} from "@/components/requirements/requirement-support";
import {
  RequirementComparisons,
  RequirementDeepDives,
  RequirementFaq,
  RequirementFinalCta,
  RequirementFinderBanner,
  RequirementIndustry,
  RequirementMethodology,
  RequirementQuickNav,
  RequirementRelated,
  RequirementScenarios,
  RequirementScreenshots,
  RequirementSidebar,
  RequirementTradeoffs,
  RequirementUseCases,
  RequirementVendorQuestions,
} from "@/components/requirements/requirement-sections";
import {
  RequirementCompareAgainst,
  RequirementSeeWhatSupportLooksLike,
  RequirementSideBySideVideos,
  RequirementVerificationGaps,
} from "@/components/requirements/requirement-media-sections";
import { RequirementDemoTest } from "@/components/requirements/requirement-demo-test";
import { buildRequirementEvidenceExplorer } from "@/services/evidence-explorer";
import { buildRequirementLinkPlan } from "@/services/internal-linking";
import { InternalLinkingModules } from "@/components/internal-linking";
import type { RequirementDetailModel } from "@/services/requirement-detail";

/**
 * Reusable Requirement Detail page template.
 * Hero is full-width; TOC/tools sit beside body content only.
 */
export function RequirementDetailPage({
  model,
}: {
  model: RequirementDetailModel;
}) {
  const path = model.industry
    ? `/industries/${model.industry.slug}/requirements/${model.requirementSlug}/`
    : `/requirements/${model.requirementSlug}/`;

  const requirementLinkPlan = buildRequirementLinkPlan({
    requirementSlug: model.requirementSlug,
    requirementName: model.requirementName,
    capabilitySlugs: [
      ...(model.profile.primaryCapabilitySlug
        ? [model.profile.primaryCapabilitySlug]
        : []),
      ...model.relatedCapabilities.map((c) => c.slug),
    ],
    featureSlugs: model.profile.featureLinks.map((f) => f.featureSlug),
    useCaseSlugs: model.useCaseLinks
      .map((u) => {
        const m = u.href?.match(/\/use-cases\/([^/]+)/);
        return m?.[1] ?? u.id;
      })
      .filter(Boolean),
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
        { name: "Requirements", path: "/requirements/" },
        { name: model.requirementName, path },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Requirements", path: "/requirements/" },
        ...(model.profile.primaryCapabilityName
          ? [
              {
                name: model.profile.primaryCapabilityName,
                path: model.capabilityHref ?? model.categoryHref,
              },
            ]
          : []),
        { name: model.requirementName, path },
      ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <RequirementHero model={model} className="mt-2" />
      <RequirementGlanceStrip glance={model.glance} className="mt-6" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start">
        <div className="min-w-0 space-y-8">
          <RequirementQuickNav items={model.navItems} />

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
              <>
                <RequirementOverview
                  overview={model.profile.overview}
                  whoThisIsFor={model.profile.whoThisIsFor}
                  workedExample={model.profile.workedExample}
                  workedExampleSecondary={model.profile.workedExampleSecondary}
                  needsVisual={model.profile.needsVisual}
                  requirementLabel={model.requirementName}
                />

                <RequirementChallenges
                  items={model.profile.challenges}
                  requirementLabel={model.requirementName}
                />

                <RequirementHowItHelps
                  items={model.profile.challenges}
                  outcomes={model.profile.outcomes}
                  requirementLabel={model.requirementName}
                />

                <RequirementAcceptanceNeeds
                  items={model.profile.acceptanceNeeds}
                  requirementLabel={model.requirementName}
                />

                <RequirementEvalWorkflow
                  steps={model.profile.workflowSteps}
                  workflowVisual={model.profile.workflowVisual}
                  requirementLabel={model.requirementName}
                />
              </>
            ) : null}

            <RequirementShortAnswer
              shortAnswer={model.shortAnswer}
              picks={model.summaryPicks}
            />

            <RequirementNeedSection
              needIf={model.profile.needGuidance?.needIf ?? []}
              mayNotNeedIf={model.profile.needGuidance?.mayNotNeedIf ?? []}
              finderHref={model.finderHref}
            />

            <RequirementWhy items={model.profile.whyItMatters} />

            <RequirementFitModel model={model} />

            <RequirementCriteria items={model.profile.evaluationCriteria} />

            <RequirementFeatures
              core={model.coreFeatures}
              supporting={model.supportingFeatures}
            />

            <RequirementSeeWhatSupportLooksLike
              requirementName={model.requirementName}
              cards={model.seeSupportCards}
            />

            <RequirementProductFit
              title="Which CRMs satisfy this requirement?"
              items={model.productCards}
            />

            <RequirementScorecard
              rows={model.productRows.slice(0, 8)}
              criteria={model.profile.evaluationCriteria}
              evidenceByKey={model.scorecardEvidence}
            />

            <RequirementCompareAgainst
              rows={model.productCards}
              criteria={model.profile.evaluationCriteria}
              compareHref={
                model.productCards.length >= 2
                  ? `/compare/build/?a=${encodeURIComponent(model.productCards[0]!.slug)}&b=${encodeURIComponent(model.productCards[1]!.slug)}`
                  : model.compareHref
              }
              videoCriteriaLabels={model.videoCriteriaLabels}
            />

            {model.sideBySide ? (
              <RequirementSideBySideVideos
                left={model.sideBySide.left}
                right={model.sideBySide.right}
                interpretation={model.sideBySide.interpretation}
              />
            ) : null}

            <RequirementMatrix
              products={model.productRows.slice(0, 5)}
              features={model.matrixFeatures}
            />

            <RequirementDeepDives
              requirementName={model.requirementName}
              items={model.productCards.slice(0, 5)}
              mediaByProduct={model.deepDiveMediaByProduct}
            />

            <RequirementVerificationGaps gaps={model.verificationGaps} />

            <section
              id="plans"
              className="scroll-mt-28 rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-tint)] p-6 shadow-[var(--sg-shadow-sm)]"
            >
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
                What plan do you need to satisfy this requirement?
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
                Plan names come from feature entitlements on the
                features that support this requirement. Pricing estimates appear
                only when verified — otherwise use the Cost Calculator.
              </p>
              <div className="mt-5 overflow-x-auto rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
                <table className="min-w-[560px] w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-[var(--sg-color-surface-muted)]">
                      <th className="px-4 py-3 text-left font-semibold">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Minimum qualifying plan
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Core coverage
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.productCards.map((p) => (
                      <tr
                        key={p.slug}
                        className="border-t border-[var(--sg-color-border)]"
                      >
                        <td className="px-4 py-3 font-medium">{p.name}</td>
                        <td className="px-4 py-3">
                          {p.minimumPlan ?? "Not verified"}
                        </td>
                        <td className="px-4 py-3">
                          {p.coreSatisfied}/{p.coreTotal || "—"}
                        </td>
                        <td className="px-4 py-3">{p.evidenceConfidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <a
                href={model.calculatorHref}
                className="mt-4 inline-block text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                Calculate this requirement for my team →
              </a>
            </section>

            <RequirementScreenshots
              requirementName={model.requirementName}
              items={model.screenshots}
            />

            <RequirementDemoTest
              requirementName={model.requirementName}
              demoTest={model.demoTest}
              products={model.productCards.map((p) => ({
                slug: p.slug,
                name: p.name,
                logo: p.logo,
              }))}
              officialExample={model.seeSupportCards[0] ?? null}
              demoChecklistHref={model.demoChecklistHref}
            />

            <RequirementScenarios items={model.scenarios} />

            <RequirementTradeoffs
              items={model.profile.tradeoffs}
              industryTradeoffs={model.industryContext?.tradeoffs}
            />

            <RequirementUseCases items={model.useCaseLinks} />

            {!model.industry ? (
              <RequirementIndustry items={model.profile.industryContexts} />
            ) : null}

            <RequirementVendorQuestions items={model.profile.vendorQuestions} />

            <RequirementRelated
              requirements={model.relatedRequirements}
              capabilities={model.relatedCapabilities}
              features={model.relatedFeatures}
            />

            <RequirementComparisons items={model.comparisons} />

            {!model.industry ? (
              <InternalLinkingModules
                plan={requirementLinkPlan}
                omit={[
                  "relatedRequirements",
                  "relatedCapabilities",
                  "relatedFeatures",
                  "relatedComparisons",
                  "parentHub",
                ]}
                showParentInline={false}
              />
            ) : null}

            <RequirementFinderBanner
              requirementName={model.requirementName}
              finderHref={model.finderHref}
            />

            {(model.videos.length > 0 ||
              model.screenshots.length > 0 ||
              model.research.evidenceItemCount > 0) && (
              <DynamicEvidenceExplorer
                model={buildRequirementEvidenceExplorer({
                  requirementName: model.requirementName,
                  requirementSlug: model.requirementSlug,
                  products: model.productRows.map((p) => ({
                    slug: p.slug,
                    name: p.name,
                    logo: p.logo,
                  })),
                  criteria: model.profile.evaluationCriteria.map((c) => ({
                    id: c.id,
                    name: c.name,
                    featureSlugs: c.featureSlugs,
                  })),
                  features: model.profile.featureLinks.map((f) => ({
                    id: f.featureSlug,
                    name: f.name,
                  })),
                  screenshots: model.screenshots,
                  videos: model.videos,
                })}
                sectionId="requirement-evidence"
              />
            )}

            <RequirementMethodology
              research={model.research}
              decisionFlow={model.decisionFlow}
              methodologyHref={model.methodologyHref}
              methodologyNote={model.methodologyNote}
            />

            <div className="flex flex-wrap gap-3">
              <ButtonLink href={model.requirementsBuilderHref} variant="outline">
                Add to my requirements
              </ButtonLink>
              <ButtonLink href={model.finderHref} variant="outline">
                Find CRMs that satisfy this requirement
              </ButtonLink>
              <ButtonLink href={model.calculatorHref} variant="outline">
                Calculate what satisfying this requirement costs →
              </ButtonLink>
              <ButtonLink
                href={model.implementationPlannerHref}
                variant="outline"
              >
                Plan implementation tasks →
              </ButtonLink>
            </div>

            <div id="faq" className="scroll-mt-28">
              <RequirementFaq items={model.profile.faq} />
            </div>

            <RequirementFinalCta
              title={`Need a CRM that can ${model.requirementName.toLowerCase()}?`}
              description="Compare catalogue CRM products based on this requirement plus your other needs, team size and budget."
              finderHref={model.finderHref}
              compareHref={model.compareHref}
            />

            <NewsletterCard source="article-end" hideWhenDisabled />
            <TrustStrip />
          </div>
        </div>

        <RequirementSidebar model={model} />
      </div>
    </>
  );
}
