import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUseCases } from "@/data";
import { SoftwareCard } from "@/components/software/software-card";
import {
  UseCaseBuyingSteps,
  UseCaseCapabilityNeeds,
  UseCaseChallenges,
  UseCaseFaq,
  UseCaseGlanceStrip,
  UseCaseHowCrmHelps,
  UseCaseOverview,
  UseCaseQuickNav,
  UseCaseScenarios,
  UseCaseWhatMatters,
  UseCaseWorkflow,
} from "@/components/use-cases/use-case-depth-sections";
import { UseCaseDetailHero } from "@/components/use-cases/use-case-hero";
import {
  UseCaseRequirementsBuilderCta,
  UseCaseSeeInAction,
  UseCaseWorkflowComparison,
} from "@/components/use-cases/use-case-media-sections";
import { UseCaseWorkflowProductCompare } from "@/components/use-cases/use-case-workflow-product-compare";
import {
  useCaseCategoryProductLabel,
  useCaseCategoryRequirementsLabel,
} from "@/components/use-cases/use-case-depth-sections";
import { UseCaseSidebar } from "@/components/use-cases/use-case-sidebar";
import { DynamicEvidenceExplorer } from "@/components/evidence/dynamic-evidence-explorer";
import { InternalLinkingModules } from "@/components/internal-linking";
import { IndustryFinalCta } from "@/components/industries/industry-final-cta";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { buildUseCaseEvidenceExplorer } from "@/services/evidence-explorer";
import { buildUseCaseLinkPlan } from "@/services/internal-linking";
import { buildUseCaseHubModel } from "@/services/use-case-hub";
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
  return getUseCases().map((uc) => ({ slug: uc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = buildUseCaseHubModel(slug);
  if (!model) {
    return buildPageMetadata({
      title: "Use case not found",
      description: "This use case does not exist.",
      path: `/use-cases/${slug}/`,
      indexable: false,
    });
  }

  const useCase = model.useCase;
  const productLabel = useCaseCategoryProductLabel(model.categorySlug);
  return buildPageMetadata({
    title: useCase.seo.title || model.displayTitle,
    description:
      useCase.seo.description ||
      model.tagline ||
      useCase.shortDescription ||
      `${useCase.name} ${productLabel} use case on SoftwareGlimpse.`,
    path: useCase.seo.canonicalPath || `/use-cases/${useCase.slug}/`,
    indexable: useCase.seo.indexable === true,
  });
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = buildUseCaseHubModel(slug);
  if (!model) notFound();

  const { useCase } = model;
  const useCaseLinkPlan = buildUseCaseLinkPlan({
    useCaseSlug: useCase.slug,
    useCaseName: useCase.name,
    capabilityHrefs: model.capabilityNeeds
      .filter((n) => n.href)
      .map((n) => ({ href: n.href!, label: n.title })),
    relatedUseCases: model.relatedUseCases,
    productSlugs: model.products.map((p) => p.slug),
    comparisonHrefs: model.comparisons.map((c) => ({
      href: c.href,
      title: c.title,
    })),
  });
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Use Cases", path: "/use-cases/" },
    {
      name: useCase.name,
      path: `/use-cases/${useCase.slug}/`,
    },
  ];

  const path = useCase.seo.canonicalPath || `/use-cases/${useCase.slug}/`;
  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;

  const pairCompareHref =
    model.approachPairs.length >= 2
      ? `/compare/${model.approachPairs[0]!.productSlug}-vs-${model.approachPairs[1]!.productSlug}/`
      : model.compareHref;

  const productLabel = useCaseCategoryProductLabel(model.categorySlug);
  const reqLabel = useCaseCategoryRequirementsLabel(model.categorySlug);
  const useCasesHubLabel =
    model.categorySlug === "crm"
      ? "CRM use cases"
      : model.categorySlug === "email-marketing"
        ? "Email marketing use cases"
        : model.categorySlug === "sales-intelligence"
          ? "Sales intelligence use cases"
          : model.categorySlug === "business-communications"
            ? "Business communications use cases"
            : model.categorySlug === "project-management"
              ? "Project management use cases"
              : model.categorySlug === "hr"
                ? "HR use cases"
              : model.categorySlug === "marketing"
              ? "Marketing use cases"
              : "Use cases";

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

      <UseCaseDetailHero
        className="mt-2"
        title={model.displayTitle}
        description={model.tagline}
        categoryLabel={useCasesHubLabel}
        categoryHref="/use-cases/"
        primaryCta={model.primaryCta}
        secondaryCta={model.secondaryCta}
        seeWorkflowHref={model.seeWorkflowHref}
        heroVisual={model.heroVisual}
      />

      <UseCaseGlanceStrip model={model} className="mt-6" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <div className="min-w-0 space-y-10">
          <UseCaseQuickNav items={model.navItems} />

          <div className="space-y-14">
            <UseCaseOverview
              overview={model.overview}
              whoThisIsFor={model.whoThisIsFor}
              workedExample={model.workedExample}
              workedExampleSecondary={model.workedExampleSecondary}
              focusAreas={model.glance.commonPriorities}
              needsVisual={model.needsVisual}
              useCaseLabel={model.badgeLabel}
              categorySlug={model.categorySlug}
            />

            <UseCaseChallenges
              items={model.challenges}
              useCaseLabel={model.badgeLabel}
              categorySlug={model.categorySlug}
            />

            <UseCaseHowCrmHelps
              items={model.challenges}
              outcomes={model.outcomes}
              useCaseLabel={model.badgeLabel}
              categorySlug={model.categorySlug}
            />

            <UseCaseWhatMatters
              title={`What matters for ${model.badgeLabel.toLowerCase()}`}
              intro={model.whatMattersIntro}
              items={model.priorities}
            />

            <UseCaseCapabilityNeeds
              items={model.capabilityNeeds}
              useCaseLabel={model.badgeLabel}
            />

            <UseCaseWorkflow
              steps={model.workflowSteps}
              workflowVisual={model.workflowVisual}
              useCaseLabel={model.badgeLabel}
              workflowExperience={model.workflowExperience}
            />

            <UseCaseSeeInAction
              useCaseLabel={model.badgeLabel}
              cards={model.seeInAction}
              evidenceHref="#use-case-evidence"
              categorySlug={model.categorySlug}
            />

            {model.workflowProductCompare ? (
              <UseCaseWorkflowProductCompare
                model={model.workflowProductCompare}
              />
            ) : (
              <UseCaseWorkflowComparison
                useCaseLabel={model.badgeLabel}
                cards={model.approachPairs}
                compareHref={pairCompareHref}
                categorySlug={model.categorySlug}
              />
            )}

            <UseCaseRequirementsBuilderCta
              useCaseLabel={model.badgeLabel}
              useCaseSlug={useCase.slug}
              checklist={model.requirementsChecklist}
              requirementsHref={model.requirementsHref}
              finderHref={model.finderHref}
              implementationHref={model.implementationHref}
              categorySlug={model.categorySlug}
            />

            <UseCaseScenarios items={model.scenarios} />

            <UseCaseBuyingSteps
              steps={model.buyingFramework}
              guideHref={model.buyingGuideHref}
              categorySlug={model.categorySlug}
            />

            <section id="software" aria-labelledby="uc-products-heading" className="scroll-mt-28">
              <h2
                id="uc-products-heading"
                className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
              >
                {productLabel === "CRM"
                  ? "CRM software to explore"
                  : `${productLabel.charAt(0).toUpperCase()}${productLabel.slice(1)} to explore`}
              </h2>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Catalogue products that list {useCase.name.toLowerCase()} as a
                supported use case. Inclusion here is not a ranking. Official
                demo counts never change ranking.
              </p>
              {model.products.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {model.products.map((item) => {
                    const demo = model.seeInAction.find(
                      (c) => c.productSlug === item.slug,
                    );
                    return (
                      <div key={item.slug} className="space-y-2">
                        <SoftwareCard software={item.software} />
                        {demo ? (
                          <a
                            href="#see-in-action"
                            className="inline-flex text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                          >
                            ▶ See workflow
                          </a>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-4 text-sm text-[var(--sg-color-text-muted)]">
                  No catalogue products are tagged for this use case yet.
                </p>
              )}
            </section>

            {model.videos.length > 0 ||
            model.visualEvidence.screenshotCount > 0 ||
            model.workflowSteps.some(
              (s) => (s.requirements?.length ?? 0) > 0,
            ) ? (
              <DynamicEvidenceExplorer
                model={buildUseCaseEvidenceExplorer({
                  useCaseName: useCase.name,
                  useCaseSlug: useCase.slug,
                  products: model.products.map((p) => ({
                    slug: p.slug,
                    name: p.name,
                    logo: p.software.logo,
                  })),
                  screenshots: [],
                  videos: model.videos,
                  workflowSteps: model.workflowSteps.map((s) => ({
                    id: s.id,
                    name: s.label,
                    requirements: s.requirements?.map((r) => ({
                      id: r.id,
                      label: r.label,
                    })),
                    features: s.features?.map((f) => ({
                      id: f.id,
                      label: f.label,
                    })),
                  })),
                  filterDimensions: [
                    ...model.capabilityNeeds
                      .filter((n) => n.href)
                      .map((n) => ({
                        id: `capability:${n.href!.match(/\/capabilities\/([^/]+)/)?.[1] ?? n.id}`,
                        name: n.title,
                      })),
                  ],
                })}
                sectionId="use-case-evidence"
              />
            ) : null}

            <UseCaseFaq items={model.faq} />

            {model.relatedUseCases.length > 0 ? (
              <section aria-labelledby="uc-related-heading">
                <h2
                  id="uc-related-heading"
                  className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-text)]"
                >
                  Related use cases
                </h2>
                <ul className="mt-3 space-y-2">
                  {model.relatedUseCases.map((uc) => (
                    <li key={uc.slug}>
                      <Link
                        href={uc.href}
                        className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
                      >
                        {uc.name}
                      </Link>
                      {uc.shortDescription ? (
                        <p className="text-sm text-[var(--sg-color-text-muted)]">
                          {uc.shortDescription}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <InternalLinkingModules
              plan={useCaseLinkPlan}
              omit={["relatedUseCases", "parentHub"]}
              showParentInline={false}
            />
            <IndustryFinalCta
              title={`Ready to shortlist ${reqLabel === "CRM" ? "CRM" : reqLabel + " software"} for ${useCase.name.toLowerCase()}?`}
              description="Use Finder for a fit-based shortlist, compare products, or build a requirements checklist before demos."
              finderHref={model.finderHref}
              compareHref={model.compareHref}
              requirementsHref={model.requirementsHref}
            />
          </div>
        </div>

        <UseCaseSidebar
          comparisons={model.comparisons}
          resources={model.resources}
          visualEvidence={{
            officialDemoCount: model.visualEvidence.officialDemoCount,
            screenshotCount: model.visualEvidence.screenshotCount,
            evidenceHref:
              model.videos.length > 0 ||
              model.visualEvidence.screenshotCount > 0
                ? "#use-case-evidence"
                : model.seeWorkflowHref ?? undefined,
          }}
        />
      </div>

      <TrustStrip className="mt-14" />
      <NewsletterCard className="mt-10" />
    </>
  );
}
