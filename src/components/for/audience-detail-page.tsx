import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { AudienceDetailHero } from "@/components/for/audience-hero";
import { businessTypePlural } from "@/components/for/business-type-labels";
import {
  AudienceBuyingSteps,
  AudienceCapabilityNeeds,
  AudienceChallenges,
  AudienceFaq,
  AudienceFinalCta,
  AudienceFitSignals,
  AudienceGlanceStrip,
  AudienceHowCrmHelps,
  AudienceOverview,
  AudienceQuickNav,
  AudienceRelated,
  AudienceScenarios,
  AudienceSidebar,
  AudienceSoftware,
  AudienceWhatMatters,
  AudienceWorkflow,
} from "@/components/for/audience-sections";
import { HubDecisionLinks } from "@/components/hub/hub-decision-links";
import type { AudienceHubModel } from "@/services/audience-hub";

export function AudienceDetailPage({ model }: { model: AudienceHubModel }) {
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "For", path: "/for/" },
    { name: model.badgeLabel, path: model.path },
  ];
  const slug = model.audience.slug;
  const label = model.audience.name;
  const plural = businessTypePlural(slug, label);

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <AudienceDetailHero
        className="mt-2"
        badgeLabel={model.badgeLabel}
        title={model.displayTitle}
        tagline={model.tagline}
        primaryCta={model.primaryCta}
        secondaryCta={model.secondaryCta}
        textLink={{ href: "/for/", label: "All business types" }}
        visualKind={model.visualKind}
      />

      <AudienceGlanceStrip model={model} className="mt-6" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start">
        <div className="min-w-0 space-y-8">
          <AudienceQuickNav items={model.navItems} />

          <div className="space-y-14">
            <AudienceOverview
              overview={model.overview}
              whoThisIsFor={model.whoThisIsFor}
              workedExample={model.workedExample}
              workedExampleSecondary={model.workedExampleSecondary}
              focusAreas={model.glance.commonPriorities}
              needsVisual={model.needsVisual}
              slug={slug}
              label={label}
              visualKind={model.visualKind}
            />

            <AudienceChallenges
              items={model.challenges}
              slug={slug}
              label={label}
            />

            <AudienceHowCrmHelps
              items={model.challenges}
              outcomes={model.outcomes}
              slug={slug}
              label={label}
            />

            <AudienceWhatMatters
              title={`What matters for ${plural}`}
              intro={model.whatMattersIntro}
              items={model.priorities}
            />

            <AudienceCapabilityNeeds
              items={model.capabilityNeeds}
              slug={slug}
              label={label}
            />

            <AudienceWorkflow
              steps={model.workflowSteps}
              workflowVisual={model.workflowVisual}
              audienceName={label}
              slug={slug}
              visualKind={model.visualKind}
            />

            <AudienceFitSignals items={model.fitSignals} />

            <AudienceScenarios items={model.scenarios} />

            <AudienceSoftware
              products={model.products}
              slug={slug}
              label={label}
            />

            <AudienceBuyingSteps
              steps={model.buyingFramework}
              guideHref={model.buyingGuideHref}
            />

            <AudienceFaq items={model.faq} />

            <AudienceRelated
              audiences={model.relatedAudiences}
              useCases={model.relatedUseCases}
            />

            <HubDecisionLinks
              title="Tools, guides & related CRM pages"
              description={`Next steps for ${plural} evaluating CRM — decision tools and pages. Affiliate relationships never change recommendations.`}
              context={{
                excludeHrefs: [`/for/${slug}/`],
              }}
            />

            <AudienceFinalCta
              title={`Ready to shortlist CRM for ${plural}?`}
              description="Use Finder for a fit-based shortlist, compare catalogue products, or build a requirements checklist before demos. Affiliate relationships never change order."
              primaryCta={model.primaryCta}
              compareHref={model.compareHref}
            />
          </div>
        </div>

        <AudienceSidebar
          className="lg:sticky lg:top-24"
          comparisons={model.comparisons}
          guides={model.guides}
          resources={model.resources}
          finderHref={model.finderHref}
        />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
