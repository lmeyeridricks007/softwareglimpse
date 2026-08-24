import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
  getSoftwareBySlug,
} from "@/data";
import { getEducationalGuideBySlug } from "@/data/repositories/guides-educational";
import {
  isPublishedStatus,
  type ContentType,
  type GuideContentBlock,
  type GuidePage,
} from "@/domain";
import { GuideArticleNav } from "@/components/guides/guide-article-nav";
import { GuideBody } from "@/components/guides/guide-body";
import {
  GuideBlocksRenderer,
  tocFromGuideBlocks,
} from "@/components/guides/guide-blocks-renderer";
import { GuideFaq } from "@/components/guides/guide-faq";
import { GuideFeedback } from "@/components/guides/guide-feedback";
import { GuideHero } from "@/components/guides/guide-hero";
import { GuideNextStepsCta } from "@/components/guides/guide-next-steps-cta";
import {
  estimateGuideReadingMinutes,
  readingPartsFromGuide,
} from "@/components/guides/guide-reading-time";
import { GuideProductMediaSection } from "@/components/guides/guide-product-media";
import { GuideCategoryMediaSection } from "@/components/guides/guide-category-media";
import { GuideSidebar } from "@/components/guides/guide-sidebar";
import { QuickAnswerVisual } from "@/components/guides/guide-visuals";
import { GUIDE_LAYOUT } from "@/components/guides/guide-template";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { isEntityIndexable } from "@/domain/quality-gates";
import { buildCategoryGuideMediaBundle } from "@/services/guides/category-guide-media";
import { buildProductGuideMediaBundle } from "@/services/product-guides/media";
import { pathForContent } from "@/services/publishing/ids";
import {
  COMPANY_ROUTES,
  getAuthorById,
  getFounderAuthor,
} from "@/services/site-foundation";
import { buildGuideLinkPlan } from "@/services/internal-linking";
import { InternalLinkingModules } from "@/components/internal-linking";
import {
  categoryDecisionFinderHref,
  categoryFinderCtaLabel,
  categoryShortName,
  hasDedicatedCategoryTools,
} from "@/data/config/tools/category-tool-meta";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
};

type GuideListOptions = {
  includeUnpublished?: boolean;
  now?: Date;
};

/** Prefer educational seed; only load product-guide builders when needed. */
async function resolveGuide(
  slug: string,
  options?: GuideListOptions,
): Promise<GuidePage | undefined> {
  const educational = getEducationalGuideBySlug(slug, options);
  if (educational) return educational;
  const { getGuideBySlug } = await import("@/data/repositories/guides");
  return getGuideBySlug(slug, options);
}

const PATH_TYPES = new Set<ContentType>([
  "category",
  "software",
  "best",
  "tool",
  "comparison",
  "alternatives",
  "pricing",
  "guide",
  "use-case",
]);

function resolvePublishedAnchor(contentId: string): {
  path: string;
  published: boolean;
  kind: ContentType | null;
} | null {
  const parts = contentId.split(":");
  if (parts.length < 3 || parts[0] !== "content") return null;
  const type = parts[1] as ContentType;
  const slug = parts.slice(2).join(":");
  if (!PATH_TYPES.has(type)) return null;
  const path = pathForContent(type, slug);

  if (type === "tool") {
    return { path, published: true, kind: type };
  }
  if (type === "category") {
    const cat = getCategoryBySlug(slug);
    return {
      path,
      published: Boolean(cat),
      kind: type,
    };
  }
  if (type === "software") {
    const soft = getSoftwareBySlug(slug);
    return {
      path,
      published: Boolean(soft),
      kind: type,
    };
  }
  return { path, published: isPublishedStatus("published"), kind: type };
}

function formatUpdatedLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const { getGuides } = await import("@/data/repositories/guides");
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: previewEnabled } = await draftMode();
  const guide = await resolveGuide(slug, {
    includeUnpublished: previewEnabled,
  });
  if (!guide) {
    return buildPageMetadata({
      title: "Guide not found",
      description: "This guide does not exist.",
      path: `/guides/${slug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: guide.seo.title || guide.title,
    description: guide.seo.description || guide.summary || guide.title,
    path: guide.seo.canonicalPath || `/guides/${guide.slug}/`,
    indexable:
      !previewEnabled && isEntityIndexable({ kind: "guide", entity: guide }),
  });
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const { isEnabled: previewEnabled } = await draftMode();
  const guide = await resolveGuide(slug, {
    includeUnpublished: previewEnabled,
  });
  if (!guide) notFound();

  const useBlocks = guide.blocks.length > 0;
  /** Guides share the same template chrome; CTAs resolve by primary category. */
  const primaryCategorySlug = guide.categorySlugs[0];
  const hasCategoryTools =
    Boolean(primaryCategorySlug) &&
    hasDedicatedCategoryTools(primaryCategorySlug!);
  const categoryFinderHref = primaryCategorySlug
    ? categoryDecisionFinderHref(primaryCategorySlug)
    : null;
  const categoryLabel = primaryCategorySlug
    ? categoryShortName(primaryCategorySlug)
    : "software";
  const relatedDecisionGuide = (
    await Promise.all(
      guide.relatedGuideSlugs.map((s) => resolveGuide(s)),
    )
  ).find(
      (g) =>
        g &&
        (g.topicType === "selection" || g.topicType === "buying-guide"),
    );

  const category = guide.categorySlugs[0]
    ? getCategories({ includeUnpublished: true }).find(
        (c) => c.slug === guide.categorySlugs[0],
      )
    : undefined;

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides/" },
    ...(category
      ? [
          {
            name: category.name,
            path: `/categories/${category.path.join("/")}/`,
          },
        ]
      : []),
    {
      name: guide.title,
      path: `/guides/${guide.slug}/`,
    },
  ];

  const linkPlan = buildGuideLinkPlan(guide);

  const relatedArticles = linkPlan.relatedGuides.map((l) => ({
    href: l.href,
    label: l.label,
    description: l.description,
  }));

  const previousGuide =
    linkPlan.relatedGuides[1] != null
      ? {
          slug: linkPlan.relatedGuides[1]!.href.replace(/^\/guides\/|\/$/g, ""),
          title: linkPlan.relatedGuides[1]!.label,
          href: linkPlan.relatedGuides[1]!.href,
        }
      : null;
  const nextGuide = linkPlan.recommendedNextStep[0]
    ? {
        title: linkPlan.recommendedNextStep[0].label,
        href: linkPlan.recommendedNextStep[0].href,
      }
    : linkPlan.relatedGuides[0]
      ? {
          title: linkPlan.relatedGuides[0].label,
          href: linkPlan.relatedGuides[0].href,
        }
      : null;

  const next = guide.nextAction
    ? resolvePublishedAnchor(guide.nextAction.contentId)
    : linkPlan.recommendedNextStep[0]
      ? {
          path: linkPlan.recommendedNextStep[0].href,
          published: true,
          kind: "tool" as const,
        }
      : null;

  const author =
    (guide.metadata.author ? getAuthorById(guide.metadata.author) : null) ??
    getFounderAuthor();

  const readingMinutes = estimateGuideReadingMinutes(
    readingPartsFromGuide(guide),
  );
  const indexable =
    !previewEnabled && isEntityIndexable({ kind: "guide", entity: guide });

  const updatedIso =
    guide.metadata.reviewedAt ||
    guide.metadata.updatedAt ||
    guide.metadata.publishedAt ||
    "";

  const factChecked =
    guide.metadata.researchStatus === "complete" &&
    Boolean(guide.metadata.reviewedAt);

  const keyPoints = guide.checklist
    .filter((c) => c.description)
    .map((c) => ({ title: c.label, body: c.description! }));

  const primaryProduct = guide.productSlugs[0]
    ? getSoftwareBySlug(guide.productSlugs[0], { includeUnpublished: true })
    : null;
  const productMedia = buildProductGuideMediaBundle({
    slug: guide.slug,
    productSlugs: guide.productSlugs,
    topicType: guide.topicType,
    productName: primaryProduct?.name,
  });
  const categoryMedia = productMedia
    ? null
    : buildCategoryGuideMediaBundle({
        slug: guide.slug,
        productSlugs: guide.productSlugs,
        topicType: guide.topicType,
        categorySlugs: guide.categorySlugs,
      });

  const toc = useBlocks
    ? tocFromGuideBlocks(guide.blocks)
    : [
        ...guide.sections.map((s) => ({
          id: s.id,
          label: s.heading.replace(/^\d+\.\s*/, ""),
        })),
        ...(keyPoints.length > 0
          ? [{ id: "key-concepts", label: "Key concepts" }]
          : []),
        ...(next?.published ? [{ id: "next-steps", label: "Next steps" }] : []),
        ...(guide.faq.length > 0
          ? [{ id: "faq", label: "Frequently asked questions" }]
          : []),
      ];
  if (productMedia) {
    toc.splice(
      Math.min(1, toc.length),
      0,
      { id: "product-media", label: productMedia.sectionTitle },
    );
  } else if (categoryMedia) {
    // After teaching body — before FAQ if present, otherwise at end
    const faqIdx = toc.findIndex((t) => t.id === "faq");
    const entry = {
      id: "example-vendor-videos",
      label: "Example vendor videos",
    };
    if (faqIdx >= 0) toc.splice(faqIdx, 0, entry);
    else toc.push(entry);
  }

  const tools =
    hasCategoryTools && linkPlan.tryDecisionTool.length > 0
      ? linkPlan.tryDecisionTool.map((l) => ({
          href: l.href,
          label: l.label,
          description: l.description ?? "Decision tool grounded in research.",
          kind: l.href.includes("finder")
            ? ("finder" as const)
            : l.href.includes("cost") || l.href.includes("tco")
              ? ("calculator" as const)
              : ("other" as const),
        }))
      : [];

  const nextIsFinder =
    next?.kind === "tool" && Boolean(next.path.includes("finder"));

  const productSlugsNeeded = new Set<string>([
    ...guide.productSlugs,
    ...guide.blocks.flatMap((b) => {
      if (b.type === "product-shortlist" || b.type === "scorecard") {
        return b.productSlugs;
      }
      return [];
    }),
  ]);

  const productsBySlug = new Map(
    [...productSlugsNeeded].flatMap((s) => {
      const software = getSoftwareBySlug(s, { includeUnpublished: true });
      if (!software) return [];
      return [
        [
          s,
          {
            slug: software.slug,
            name: software.name,
            href: `/software/${software.slug}/`,
            shortDescription: software.shortDescription,
            logo: software.logo,
          },
        ] as const,
      ];
    }),
  );

  const frameworkSteps =
    guide.blocks.find((b) => b.type === "decision-framework")?.type ===
    "decision-framework"
      ? (
          guide.blocks.find((b) => b.type === "decision-framework") as Extract<
            GuideContentBlock,
            { type: "decision-framework" }
          >
        ).steps.map((s) => ({ id: s.id, label: s.label }))
      : [
          { id: "step-needs", label: "Needs" },
          { id: "step-features", label: "Features" },
          { id: "step-integrations", label: "Integrations" },
          { id: "step-cost", label: "Cost" },
          { id: "step-usability", label: "Usability" },
          { id: "step-growth", label: "Growth" },
        ];

  const quickAnswerBlock = guide.blocks.find((b) => b.type === "direct-answer");
  /** Quick Answer always lives in the hero when present — omit from body. */
  const omitBlockIds = quickAnswerBlock
    ? new Set([quickAnswerBlock.id])
    : undefined;

  /** Example vendor videos sit after teaching blocks, before FAQ / related / CTA. */
  const mediaCutIdx = guide.blocks.findIndex((b) =>
    b.type === "faq" ||
    b.type === "related-content" ||
    b.type === "interactive-cta",
  );
  const blocksBeforeMedia =
    useBlocks && mediaCutIdx >= 0
      ? guide.blocks.slice(0, mediaCutIdx)
      : guide.blocks;
  const blocksAfterMedia =
    useBlocks && mediaCutIdx >= 0 ? guide.blocks.slice(mediaCutIdx) : [];

  return (
    <>
      {indexable ? (
        <JsonLdScript
          data={[
            webPageJsonLd({
              name: guide.title,
              description: guide.seo.description || guide.summary || guide.title,
              path: guide.seo.canonicalPath || `/guides/${guide.slug}/`,
            }),
            breadcrumbJsonLd(breadcrumbItems),
          ]}
        />
      ) : null}
      <Breadcrumbs items={breadcrumbItems} />

      {previewEnabled ? (
        <div
          role="status"
          className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm"
        >
          Preview mode is on — this response is noindex.{" "}
          <Link
            href={`/api/preview/disable?slug=/guides/${guide.slug}/`}
            className="font-medium underline-offset-2 hover:underline"
          >
            Exit preview
          </Link>
        </div>
      ) : null}

      <GuideHero
        className="mt-2"
        title={guide.title}
        summary={guide.summary}
        category={
          category
            ? {
                name: /\bsoftware\b/i.test(category.name)
                  ? category.name
                  : `${category.name} Software`,
                href: `/categories/${category.path.join("/")}/`,
              }
            : undefined
        }
        readingMinutes={readingMinutes}
        author={
          author
            ? {
                name: author.name,
                href: COMPANY_ROUTES.myStory,
                role: author.role,
              }
            : {
                name: "SoftwareGlimpse Team",
                href: COMPANY_ROUTES.about,
              }
        }
        updatedLabel={updatedIso ? formatUpdatedLabel(updatedIso) : undefined}
        factChecked={factChecked}
        heroVisual={guide.heroVisual}
        visual={
          guide.heroVisual
            ? "default"
            : primaryCategorySlug === "crm"
              ? "framework"
              : "default"
        }
        frameworkSteps={frameworkSteps}
        primaryCta={
          categoryFinderHref
            ? {
                href: categoryFinderHref,
                label: `${categoryFinderCtaLabel(primaryCategorySlug!)} (2 min)`,
              }
            : undefined
        }
        secondaryCta={
          hasCategoryTools
            ? guide.topicType === "selection" ||
              guide.topicType === "buying-guide"
              ? { href: "#demo-checklist", label: "Download checklist" }
              : relatedDecisionGuide
                ? {
                    href: `/guides/${relatedDecisionGuide.slug}/`,
                    label: `How to choose ${categoryLabel}`,
                  }
                : primaryCategorySlug === "crm"
                  ? {
                      href: "/guides/how-to-choose-crm/",
                      label: "How to choose a CRM",
                    }
                  : undefined
            : undefined
        }
        belowCta={
          quickAnswerBlock?.type === "direct-answer" ? (
            <QuickAnswerVisual
              compact
              id={quickAnswerBlock.id}
              title={quickAnswerBlock.title ?? "Quick answer"}
              body={quickAnswerBlock.body}
              factors={quickAnswerBlock.bullets}
              showFactorStrip={
                guide.topicType === "selection" ||
                guide.topicType === "buying-guide"
              }
            />
          ) : undefined
        }
      />

      <div className={GUIDE_LAYOUT.body}>
        <div className={`min-w-0 ${GUIDE_LAYOUT.sectionGap}`}>
          {productMedia ? (
            <GuideProductMediaSection bundle={productMedia} />
          ) : null}
          {useBlocks ? (
            <>
              <GuideBlocksRenderer
                blocks={blocksBeforeMedia}
                productsBySlug={productsBySlug}
                guideSlug={guide.slug}
                omitBlockIds={omitBlockIds}
              />
              {categoryMedia ? (
                <GuideCategoryMediaSection bundle={categoryMedia} />
              ) : null}
              {blocksAfterMedia.length > 0 ? (
                <GuideBlocksRenderer
                  blocks={blocksAfterMedia}
                  productsBySlug={productsBySlug}
                  guideSlug={guide.slug}
                  omitBlockIds={omitBlockIds}
                />
              ) : null}
            </>
          ) : (
            <>
              <GuideBody
                sections={guide.sections}
                keyPoints={keyPoints}
                checklist={keyPoints.length > 0 ? [] : guide.checklist}
              />
              {categoryMedia ? (
                <GuideCategoryMediaSection bundle={categoryMedia} />
              ) : null}
              {next?.published && guide.nextAction ? (
                <div id="next-steps" className="scroll-mt-28">
                  <GuideNextStepsCta
                    variant={nextIsFinder ? "finder" : "generic"}
                    title={
                      nextIsFinder
                        ? "Not sure which CRM is right for you?"
                        : guide.nextAction.label
                    }
                    body={
                      nextIsFinder
                        ? "Answer a few questions and we’ll recommend CRMs that fit — affiliate status never changes the order."
                        : "Continue with a related SoftwareGlimpse page grounded in the same research."
                    }
                    href={next.path}
                    ctaLabel={
                      nextIsFinder
                        ? "Try the CRM Finder →"
                        : `${guide.nextAction.label} →`
                    }
                  />
                </div>
              ) : null}
              <GuideFaq items={guide.faq} />
            </>
          )}

          <GuideFeedback slug={guide.slug} />

          <GuideArticleNav
            previous={
              previousGuide
                ? {
                    href: previousGuide.href,
                    title: previousGuide.title,
                  }
                : null
            }
            next={
              nextGuide
                ? {
                    href: nextGuide.href,
                    title: nextGuide.title,
                  }
                : null
            }
          />

          <InternalLinkingModules
            plan={linkPlan}
            omit={["relatedGuides", "tryDecisionTool"]}
            showParentInline
          />
        </div>

        <GuideSidebar
          className={GUIDE_LAYOUT.sidebarSticky}
          toc={toc}
          relatedArticles={relatedArticles}
          tools={tools}
          resourcesHref={hasCategoryTools ? "/resources/" : null}
        />
      </div>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
