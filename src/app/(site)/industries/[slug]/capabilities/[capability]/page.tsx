import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CapabilityGlance } from "@/components/industries/capability/capability-glance";
import { CapabilityHero } from "@/components/industries/capability/capability-hero";
import { CapabilityEssentialAdvanced, CapabilityRequirements } from "@/components/industries/capability/capability-requirements";
import { CapabilityRequirementEvidenceSection } from "@/components/industries/capability/capability-requirement-evidence";
import {
  CapabilityProductCards,
  CapabilityRequirementMatrix,
  CapabilityScorecard,
} from "@/components/industries/capability/capability-scorecard";
import { CapabilityDeepDives } from "@/components/industries/capability/capability-assessment-drawer";
import { CapabilityScreenshots } from "@/components/industries/capability/capability-screenshots";
import { CapabilitySeeInAction } from "@/components/capabilities/capability-media-sections";
import { CapabilityWorkflowComparison } from "@/components/capabilities/capability-workflow-comparison";
import { DynamicEvidenceExplorer } from "@/components/evidence/dynamic-evidence-explorer";
import { buildCapabilityEvidenceExplorer } from "@/services/evidence-explorer";
import {
  CapabilityComparisons,
  CapabilityFaq,
  CapabilityFinalCta,
  CapabilityFinderBanner,
  CapabilityImplementation,
  CapabilityMethodology,
  CapabilityOutcomes,
  CapabilityQuickNav,
  CapabilityRelated,
  CapabilityTradeoffs,
  CapabilityUseCaseFit,
  CapabilityVendorQuestions,
} from "@/components/industries/capability/capability-sections";
import { CapabilityWhyMatters } from "@/components/industries/capability/capability-why-matters";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { listIndustryCapabilityParams } from "@/data/industry-capability";
import {
  getIndustryCapabilityPage,
} from "@/services/industry-capability";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string; capability: string }>;
};

export function generateStaticParams() {
  return listIndustryCapabilityParams().map((item) => ({
    slug: item.industrySlug,
    capability: item.capabilitySlug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: industrySlug, capability: capabilitySlug } = await params;
  const model = getIndustryCapabilityPage(industrySlug, capabilitySlug);
  if (!model) {
    return buildPageMetadata({
      title: "Capability not found",
      description: "This industry capability page does not exist.",
      path: `/industries/${industrySlug}/capabilities/${capabilitySlug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: `CRM ${model.capabilityName} for ${model.industry.name}`,
    description: model.tagline.slice(0, 320),
    path: `/industries/${industrySlug}/capabilities/${capabilitySlug}/`,
    indexable: false,
  });
}

export default async function IndustryCapabilityPage({ params }: Props) {
  const { slug: industrySlug, capability: capabilitySlug } = await params;
  const model = getIndustryCapabilityPage(industrySlug, capabilitySlug);
  if (!model) notFound();

  const path = `/industries/${industrySlug}/capabilities/${capabilitySlug}/`;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries/" },
    { name: model.industry.name, path: model.industryHref },
    { name: "Capabilities", path: `${model.industryHref}#capabilities` },
    { name: model.capabilityName, path },
  ];

  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;

  const availableKeys = new Set(model.matrixFeatureSlugs.map((f) => f.slug));
  const scorecardColumns = (
    model.capabilitySlug === "pipeline-management"
      ? [
          { key: "custom-pipelines", label: "Stages / pipelines" },
          { key: "deal-management", label: "Ownership" },
          { key: "workflow-automation", label: "Workflow support" },
          { key: "forecasting", label: "Forecasting" },
          { key: "reporting", label: "Reporting" },
        ]
      : [
          { key: "workflow-automation", label: "Workflow automation" },
          { key: "sales-automation", label: "Sales automation" },
          { key: "email-sequences", label: "Sequences" },
          { key: "reporting", label: "Reporting" },
        ]
  ).filter((c) => availableKeys.has(c.key));

  const resolvedColumns =
    scorecardColumns.length > 0
      ? scorecardColumns
      : model.matrixFeatureSlugs.slice(0, 5).map((f) => ({
          key: f.slug,
          label: f.name,
        }));

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

      <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <CapabilityHero
          eyebrow={model.eyebrow}
          title={model.displayTitle}
          tagline={model.tagline}
          capabilityName={model.capabilityName}
          evaluationDimensions={model.evaluationDimensions}
          primaryCta={{ href: model.compareHref, label: "Compare CRM software" }}
          secondaryCta={{ href: model.finderHref, label: "Find My CRM" }}
          textLink={{
            href: model.industryHref,
            label: `Back to ${model.industry.name} CRM`,
          }}
          researchCoverage={{
            productCount: model.research.productCount,
            evidenceItemCount: model.research.evidenceItemCount,
            lastUpdated: model.research.lastUpdated,
          }}
          seeInActionHref={
            model.seeInAction.length > 0 ? "#see-in-action" : null
          }
        />
        <CapabilityGlance
          className="lg:sticky lg:top-24"
          industryName={model.industry.name}
          importanceLabel={model.glance.importanceLabel}
          coreObjective={model.glance.coreObjective}
          importantRequirementLabels={model.glance.importantRequirementLabels}
          relatedCapabilityLabels={model.glance.relatedCapabilityLabels}
          researchedProductCount={model.glance.researchedProductCount}
          lastReviewedAt={model.glance.lastReviewedAt}
          officialVideoCount={model.research.officialVideoCount}
          screenshotCount={model.screenshots.length}
        />
      </div>

      <CapabilityQuickNav items={model.navItems} />

      <div className="mt-10 space-y-14">
        <CapabilityWhyMatters
          title={`Why ${model.capabilityName.toLowerCase()} matters for ${model.industry.name.toLowerCase()}`}
          paragraphs={model.whyItMatters}
          risks={model.weakProcessRisks}
        />

        <CapabilityRequirements
          title={`What to look for in ${model.capabilityName.toLowerCase()}`}
          requirements={model.requirements}
        />

        <CapabilityEssentialAdvanced
          essential={model.essentialRequirements}
          advanced={model.advancedRequirements}
        />

        {model.requirementEvidence ? (
          <CapabilityRequirementEvidenceSection
            model={model.requirementEvidence}
          />
        ) : null}

        <CapabilityScorecard
          capabilityName={model.capabilityName}
          rows={model.productRows}
          scorecardColumns={resolvedColumns}
          screenshotsHref={
            model.seeInAction.length > 0 || model.screenshots.length > 0
              ? "#capability-evidence"
              : "#screenshots"
          }
          whyRequirementLabels={model.requirements
            .slice(0, 6)
            .map((r) => r.name)}
          whyFeatureLabels={model.matrixFeatureSlugs
            .slice(0, 6)
            .map((f) => f.name)}
          requirementEvidenceByProduct={Object.fromEntries(
            model.productRows.map((p) => [
              p.slug,
              (model.requirementEvidence?.rows ?? [])
                .map((req) => {
                  const pe = req.products.find((x) => x.productSlug === p.slug);
                  if (!pe) return null;
                  if (
                    pe.officialVideoCount === 0 &&
                    pe.screenshotCount === 0 &&
                    pe.documentationCount === 0
                  ) {
                    return null;
                  }
                  return {
                    requirementName: req.requirementName,
                    documentationCount: pe.documentationCount,
                    screenshotCount: pe.screenshotCount,
                    officialVideoCount: pe.officialVideoCount,
                    videoTitles: pe.items
                      .filter((i) => i.kind === "official-video")
                      .map((i) => i.title),
                  };
                })
                .filter(Boolean) as Array<{
                requirementName: string;
                documentationCount: number;
                screenshotCount: number;
                officialVideoCount: number;
                videoTitles: string[];
              }>,
            ]),
          )}
        />

        <CapabilityProductCards
          capabilityName={model.capabilityName}
          items={model.productCards}
          finderHref={model.finderHref}
        />

        <CapabilityRequirementMatrix
          products={model.productRows.slice(0, 5)}
          features={model.matrixFeatureSlugs}
        />

        <CapabilitySeeInAction
          capabilityName={model.capabilityName}
          cards={model.seeInAction}
        />

        {model.workflowComparison ? (
          <CapabilityWorkflowComparison model={model.workflowComparison} />
        ) : null}

        <CapabilityDeepDives
          capabilityName={model.capabilityName}
          items={model.productCards}
        />

        <CapabilityScreenshots
          capabilityName={model.capabilityName}
          items={model.screenshots}
        />

        <DynamicEvidenceExplorer
          model={buildCapabilityEvidenceExplorer({
            capabilityName: model.capabilityName,
            capabilitySlug: model.capabilitySlug,
            products: model.productRows.map((p) => ({
              slug: p.slug,
              name: p.name,
              logo: p.logo,
            })),
            screenshots: model.screenshots,
            videos: model.videos,
            filterDimensions: [
              ...model.matrixFeatureSlugs.map((f) => ({
                id: `feature:${f.slug}`,
                name: f.name,
              })),
              ...model.requirements
                .filter((r) => r.requirementSlug)
                .map((r) => ({
                  id: `requirement:${r.requirementSlug!}`,
                  name: r.name,
                })),
            ],
          })}
          sectionId="capability-evidence"
        />

        <CapabilityOutcomes items={model.outcomes} />

        <CapabilityTradeoffs items={model.tradeoffs} />

        <CapabilityUseCaseFit
          title={`Which ${model.industry.name.toLowerCase()} use cases need this capability most?`}
          items={model.useCaseFits}
        />

        <CapabilityVendorQuestions
          title={`Questions to ask vendors about ${model.capabilityName.toLowerCase()}`}
          items={model.vendorQuestions}
        />

        <CapabilityImplementation
          title={`Before implementing ${model.capabilityName.toLowerCase()}`}
          items={model.implementation}
        />

        <CapabilityRelated items={model.relatedCapabilities} />

        {["pipeline-management", "workflow-automation", "contact-management", "reporting", "integrations"].includes(
          model.capabilitySlug,
        ) || model.capabilitySlug === "security-administration" ? (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            See the category-wide capability hub:{" "}
            <a
              href={
                model.capabilitySlug === "security-administration"
                  ? "/capabilities/security/"
                  : `/capabilities/${model.capabilitySlug}/`
              }
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              {model.capabilitySlug === "security-administration"
                ? "Security (and Administration)"
                : model.capabilityName}{" "}
              CRM capability
            </a>
            .
          </p>
        ) : null}

        <CapabilityComparisons
          title={`Compare products for ${model.capabilityName.toLowerCase()}`}
          items={model.comparisons}
        />

        <CapabilityFinderBanner
          capabilityName={model.capabilityName}
          finderHref={model.finderHref}
        />

        <CapabilityMethodology
          capabilityName={model.capabilityName}
          research={model.research}
          methodologyHref={model.methodologyHref}
          calculatorHref={model.calculatorHref}
        />

        <CapabilityFaq items={model.faq} />

        <CapabilityFinalCta
          title="Ready to compare CRM software?"
          description={`Choose products based on the ${model.capabilityName.toLowerCase()} capabilities your team actually needs.`}
          finderHref={model.finderHref}
          compareHref={model.compareHref}
        />

        <NewsletterCard source="article-end" hideWhenDisabled />
        <TrustStrip />
      </div>
    </>
  );
}
