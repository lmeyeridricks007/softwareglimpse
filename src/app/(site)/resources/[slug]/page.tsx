import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResources } from "@/data";
import {
  ResourceArtifactPreview,
  ResourceEvidenceRules,
  ResourceFaq,
  ResourceFinalCta,
  ResourceHelpsYouDo,
  ResourceHowToTimeline,
  ResourceMetaStrip,
  ResourceOverviewLite,
  ResourceQuickNav,
  ResourceRelationships,
  ResourceValueBar,
  ResourceWhatsInside,
  ResourceWorkedExampleBlock,
} from "@/components/resources/resource-depth-sections";
import { ResourceDetailHero } from "@/components/resources/resource-hero";
import { ResourceSidebar } from "@/components/resources/resource-sidebar";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { buildResourceHubModel } from "@/services/resource-hub";
import { buildResourceLinkPlan } from "@/services/internal-linking";
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
  return getResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const model = buildResourceHubModel(slug);
  if (!model) {
    return buildPageMetadata({
      title: "Resource not found",
      description: "This resource does not exist.",
      path: `/resources/${slug}/`,
      indexable: false,
    });
  }

  const { resource } = model;
  return buildPageMetadata({
    title: resource.seo.title || model.displayTitle,
    description:
      resource.seo.description ||
      model.tagline ||
      resource.shortDescription ||
      `${resource.name} on SoftwareGlimpse.`,
    path: resource.seo.canonicalPath || `/resources/${resource.slug}/`,
    indexable: resource.seo.indexable === true,
  });
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const model = buildResourceHubModel(slug);
  if (!model) notFound();

  const { resource } = model;
  const categoryName =
    model.categorySlug === "crm" ? "CRM" : model.categorySlug;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources/" },
    {
      name: categoryName,
      path: `/resources/?category=${model.categorySlug}`,
    },
    {
      name: resource.name,
      path: `/resources/${resource.slug}/`,
    },
  ];

  const path = resource.seo.canonicalPath || `/resources/${resource.slug}/`;
  const faqLd = model.faq.length ? faqPageJsonLd(model.faq) : null;
  const reviewedLabel = model.glance.lastReviewedAt
    ? formatUpdated(model.glance.lastReviewedAt)
    : null;
  const metaLine = [
    "Free to use",
    "No email required",
    reviewedLabel ? `Updated ${reviewedLabel}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

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

      <ResourceDetailHero
        className="mt-2"
        title={model.displayTitle}
        tagline={model.tagline}
        explanation={model.heroExplanation}
        badgeLabel={model.badgeLabel}
        toolkitLabel={model.toolkitLabel}
        categoryLabel={`${categoryName} resources`}
        categoryHref="/resources/"
        primaryCta={model.primaryCta}
        secondaryCta={model.secondaryCta}
        previewHref={model.artifactSections.length ? model.previewHref : null}
        metaLine={metaLine}
        heroVisual={model.heroVisual}
      />

      <ResourceMetaStrip model={model} className="mt-6" />
      <ResourceValueBar model={model} className="mt-4" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <div className="min-w-0 space-y-10">
          <ResourceQuickNav items={model.navItems} />

          {model.whatsInside.length === 0 ? (
            <ResourceOverviewLite
              overview={model.overview}
              whoThisIsFor={model.whoThisIsFor}
            />
          ) : null}

          <ResourceWhatsInside
            cards={model.whatsInside}
            visual={model.needsVisual}
          />

          <ResourceHelpsYouDo outcomes={model.outcomes} />

          <ResourceHowToTimeline
            steps={model.workflowSteps}
            artifactLabel={artifactNoun(model)}
            visual={model.workflowVisual}
          />

          <ResourceArtifactPreview
            sections={model.artifactSections}
            downloadHref={model.primaryCta.href}
            artifactLabel={artifactNoun(model)}
            variant={
              model.resource.slug === "crm-business-case-template"
                ? "business-case"
                : model.resource.slug === "crm-comparison-worksheet"
                  ? "decision-matrix"
                  : model.resource.slug === "crm-field-mapping-template"
                    ? "field-mapping"
                    : model.resource.slug === "crm-vendor-scorecard"
                      ? "scorecard"
                      : model.resource.slug === "crm-rfp-template"
                        ? "rfp"
                        : "checklist"
            }
          />

          <ResourceWorkedExampleBlock
            structured={model.workedExampleStructured}
            fallback={model.workedExample}
          />

          <ResourceEvidenceRules rules={model.evidenceRules} />

          <ResourceRelationships
            useBefore={model.useBefore}
            useWith={model.useWith}
            useNext={model.useNext}
          />

          <ResourceFaq items={model.faq} />

          <ResourceFinalCta model={model} />

          <InternalLinkingModules
            plan={buildResourceLinkPlan({
              resourceSlug: model.resource.slug,
              resourceName: model.resource.name,
              relatedGuideSlugs: model.guides.map((g) =>
                g.href.replace(/^\/guides\//, "").replace(/\/$/, ""),
              ),
            })}
            omit={["relatedGuides"]}
            showParentInline
          />
        </div>

        <ResourceSidebar
          className="lg:sticky lg:top-24"
          downloads={model.downloadFiles.map((f) => ({
            href: f.href,
            label: f.label,
            format: f.format,
          }))}
          journey={model.journey}
          tools={model.tools}
          guides={model.guides}
          lastReviewedAt={model.glance.lastReviewedAt}
        />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}

function formatUpdated(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function artifactNoun(model: NonNullable<ReturnType<typeof buildResourceHubModel>>): string {
  switch (model.resource.kind) {
    case "scorecard":
      return "scorecard";
    case "worksheet":
      return model.resource.resourceType === "MATRIX" ? "matrix" : "worksheet";
    case "planner":
      return "plan";
    case "template":
      return "template";
    default:
      return "checklist";
  }
}
