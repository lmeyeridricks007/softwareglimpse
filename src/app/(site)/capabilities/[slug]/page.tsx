import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCapabilities } from "@/data";
import {
  CapabilityBuyingSteps,
  CapabilityChallenges,
  CapabilityFaq,
  CapabilityGlanceStrip,
  CapabilityHowCrmHelps,
  CapabilityNeedsSection,
  CapabilityOverview,
  CapabilityQuickNav,
  CapabilityScenarios,
  CapabilityWhatMatters,
  CapabilityWorkflow,
} from "@/components/capabilities/capability-depth-sections";
import { CapabilityDetailHero } from "@/components/capabilities/capability-hero";
import { CapabilitySidebar } from "@/components/capabilities/capability-sidebar";
import {
  CapabilitySeeInAction,
  CapabilityWorkflowMediaBridge,
} from "@/components/capabilities/capability-media-sections";
import { CapabilityWorkflowComparison } from "@/components/capabilities/capability-workflow-comparison";
import { DynamicEvidenceExplorer } from "@/components/evidence/dynamic-evidence-explorer";
import { buildCapabilityEvidenceExplorer } from "@/services/evidence-explorer";
import { HubDecisionLinks } from "@/components/hub/hub-decision-links";
import { IndustryFinalCta } from "@/components/industries/industry-final-cta";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { SoftwareCard } from "@/components/software/software-card";
import { TrustStrip } from "@/components/trust/trust-strip";
import { buildCapabilityHubModel } from "@/services/capability-hub";
import { buildCapabilityLinkPlan } from "@/services/internal-linking";
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

export function generateStaticParams() {
  return getCapabilities().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = buildCapabilityHubModel(slug);
  if (!model) {
    return buildPageMetadata({
      title: "Capability not found",
      description: "This capability does not exist.",
      path: `/capabilities/${slug}/`,
      indexable: false,
    });
  }

  const { capability } = model;
  return buildPageMetadata({
    title: capability.seo.title || model.displayTitle,
    description:
      capability.seo.description ||
      model.tagline ||
      capability.shortDescription ||
      `${capability.name} CRM capability on SoftwareGlimpse.`,
    path: capability.seo.canonicalPath || `/capabilities/${capability.slug}/`,
    indexable: capability.seo.indexable === true,
  });
}

export default async function CapabilityDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = buildCapabilityHubModel(slug);
  if (!model) notFound();

  const { capability } = model;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Capabilities", path: "/capabilities/" },
    {
      name: capability.name,
      path: `/capabilities/${capability.slug}/`,
    },
  ];

  const path =
    capability.seo.canonicalPath || `/capabilities/${capability.slug}/`;
  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;

  return (
    <>
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
      <Breadcrumbs items={breadcrumbItems} />

      <CapabilityDetailHero
        className="mt-2"
        title={model.displayTitle}
        description={model.tagline}
        categoryLabel="CRM capabilities"
        categoryHref="/capabilities/"
        primaryCta={model.primaryCta}
        secondaryCta={model.secondaryCta}
        heroVisual={model.heroVisual}
      />

      <CapabilityGlanceStrip model={model} className="mt-6" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <div className="min-w-0 space-y-10">
          <CapabilityQuickNav items={model.navItems} />

          <div className="space-y-14">
            <CapabilityOverview
              overview={model.overview}
              whoThisIsFor={model.whoThisIsFor}
              workedExample={model.workedExample}
              workedExampleSecondary={model.workedExampleSecondary}
              focusAreas={model.glance.commonPriorities}
              capabilityLabel={model.badgeLabel}
            />

            <CapabilityChallenges
              items={model.challenges}
              capabilityLabel={model.badgeLabel}
            />

            <CapabilityHowCrmHelps
              items={model.challenges}
              outcomes={model.outcomes}
              capabilityLabel={model.badgeLabel}
            />

            <CapabilityWhatMatters
              title={`What matters for ${model.badgeLabel.toLowerCase()}`}
              intro={model.whatMattersIntro}
              items={model.priorities}
            />

            <CapabilityNeedsSection
              items={model.capabilityNeeds}
              capabilityLabel={model.badgeLabel}
              needsVisual={model.needsVisual}
            />

            <CapabilityWorkflow
              steps={model.workflowSteps}
              workflowVisual={model.workflowVisual}
              capabilityLabel={model.badgeLabel}
            />
            <CapabilityWorkflowMediaBridge
              capabilityName={model.badgeLabel}
              cards={model.seeInAction}
            />

            <CapabilitySeeInAction
              capabilityName={model.badgeLabel}
              cards={model.seeInAction}
            />

            {model.workflowComparison ? (
              <CapabilityWorkflowComparison model={model.workflowComparison} />
            ) : null}

            <CapabilityScenarios items={model.scenarios} />

            <CapabilityBuyingSteps
              steps={model.buyingFramework}
              guideHref={model.buyingGuideHref}
            />

            {(model.relatedUseCases.length > 0 ||
              model.relatedRequirements.length > 0 ||
              model.relatedFeatures.length > 0) && (
              <section aria-labelledby="cap-related-entities-heading">
                <h2
                  id="cap-related-entities-heading"
                  className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]"
                >
                  Related use cases, requirements & features
                </h2>
                <div className="mt-4 grid gap-6 sm:grid-cols-3">
                  {model.relatedUseCases.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
                        Use cases
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {model.relatedUseCases.map((uc) => (
                          <li key={uc.slug}>
                            <Link
                              href={uc.href}
                              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                            >
                              {uc.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {model.relatedRequirements.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
                        Requirements
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {model.relatedRequirements.map((r) => (
                          <li key={r.slug}>
                            <Link
                              href={r.href}
                              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline capitalize"
                            >
                              {r.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {model.relatedFeatures.length > 0 ? (
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--sg-color-text)]">
                        Features
                      </h3>
                      <ul className="mt-2 space-y-2">
                        {model.relatedFeatures.map((f) => (
                          <li key={f.slug}>
                            <Link
                              href={f.href}
                              className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline capitalize"
                            >
                              {f.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </section>
            )}

            <section
              id="software"
              aria-labelledby="cap-products-heading"
              className="scroll-mt-28"
            >
              <h2
                id="cap-products-heading"
                className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
              >
                CRM software to explore
              </h2>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Catalogue products tagged to related use cases for{" "}
                {capability.name.toLowerCase()}. Inclusion here is not a
                ranking.
              </p>
              {model.products.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {model.products.map((item) => (
                    <SoftwareCard key={item.slug} software={item.software} />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
                  No catalogue products are tagged for adjacent use cases yet.
                </p>
              )}
            </section>

            <DynamicEvidenceExplorer
              model={buildCapabilityEvidenceExplorer({
                capabilityName: model.badgeLabel,
                capabilitySlug: capability.slug,
                products: model.products.map((p) => ({
                  slug: p.slug,
                  name: p.name,
                  logo: p.software.logo,
                })),
                screenshots: [],
                videos: model.videos,
                filterDimensions: [
                  ...model.relatedFeatures.map((f) => ({
                    id: `feature:${f.slug}`,
                    name: f.label,
                  })),
                  ...model.relatedRequirements.map((r) => ({
                    id: `requirement:${r.slug}`,
                    name: r.label,
                  })),
                ],
              })}
              sectionId="capability-evidence"
            />

            <CapabilityFaq items={model.faq} />

            {model.relatedCapabilities.length > 0 ? (
              <section aria-labelledby="cap-related-heading">
                <h2
                  id="cap-related-heading"
                  className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]"
                >
                  Related capabilities
                </h2>
                <ul className="mt-3 space-y-2">
                  {model.relatedCapabilities.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={c.href}
                        className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        {c.name}
                      </Link>
                      {c.shortDescription ? (
                        <p className="text-sm text-[var(--sg-color-text-muted)]">
                          {c.shortDescription}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {model.categorySlug === "crm" ? (
              <>
                <HubDecisionLinks
                  title="Tools, guides & related CRM pages"
                  description={`Next steps after evaluating ${capability.name.toLowerCase()} — decision tools and pages. Affiliate relationships never change recommendations.`}
                  context={{
                    excludeHrefs: [`/capabilities/${capability.slug}/`],
                  }}
                />
                <IndustryFinalCta
                  title={`Ready to shortlist CRM for ${capability.name.toLowerCase()}?`}
                  description="Use Finder for a fit-based shortlist, compare products, or build a requirements checklist before demos."
                  finderHref={model.finderHref}
                  compareHref={model.compareHref}
                  requirementsHref="/tools/crm-requirements-builder/?start=1"
                />
              </>
            ) : null}

            <InternalLinkingModules
              plan={buildCapabilityLinkPlan({
                capabilitySlug: capability.slug,
                capabilityName: capability.name,
                useCaseSlugs: model.relatedUseCases?.map((u) => u.slug),
                featureSlugs: model.relatedFeatures?.map((f) => f.slug),
                requirementSlugs: model.relatedRequirements?.map((r) => r.slug),
              })}
              omit={["relatedCapabilities", "relatedFeatures", "relatedUseCases", "relatedRequirements"]}
              showParentInline
            />
          </div>
        </div>

        <CapabilitySidebar
          className="lg:sticky lg:top-24"
          comparisons={model.comparisons}
          resources={model.resources}
          officialVideoCount={model.videos.length}
          seeInActionHref={
            model.seeInAction.length > 0 ? "#see-in-action" : null
          }
        />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
