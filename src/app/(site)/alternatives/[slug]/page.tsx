import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllAlternativesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getSoftwareBySlug,
} from "@/data";
import { loadAssessment, loadReview, getMethodologyBySlug } from "@/data/editorial/store";
import { SoftwareCta } from "@/components/affiliate/software-cta";
import { AlternativesHero } from "@/components/alternatives/alternatives-hero";
import { AlternativesHowToChoose } from "@/components/alternatives/alternatives-how-to-choose";
import { AlternativesMethodologyNote } from "@/components/alternatives/alternatives-methodology-note";
import { AlternativesSidebar } from "@/components/alternatives/alternatives-sidebar";
import { AlternativesTable } from "@/components/alternatives/alternatives-table";
import {
  AlternativeCard,
  EditorialDisclosures,
} from "@/components/editorial";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ResearchStatusBanner } from "@/components/ui/research-status-banner";
import { ButtonLink } from "@/components/ui/button";
import {
  formatMoney,
  fromMajor,
  type CurrencyCode,
  type Software,
} from "@/domain";
import { isEntityIndexable } from "@/domain/quality-gates";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type Props = {
  params: Promise<{ slug: string }>;
};

function approvedScore(software: Software): {
  score: number | null;
  approved: boolean;
} {
  const assessment = loadAssessment(software.slug);
  const review = loadReview(software.slug);
  const score = review?.overallScore ?? assessment?.overallScore;
  const approved =
    assessment?.status === "approved" &&
    review?.editorialStatus === "approved" &&
    typeof score === "number";
  return { score: approved ? score! : null, approved };
}

function pricingTeaser(software: Software): string | null {
  const pricing = software.pricing;
  if (!pricing || pricing.startingPriceMonthly == null) return null;
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  return `${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/user/mo`;
}

function resolveSoftware(slug: string): Software | undefined {
  return (
    getSoftwareBySlug(slug) ??
    getAllSoftwareUnfiltered().find((item) => item.slug === slug)
  );
}

function comparisonHref(a: string, b: string): string | undefined {
  const forward = `${a}-vs-${b}`;
  const reverse = `${b}-vs-${a}`;
  const found = getAllComparisonsUnfiltered().find(
    (c) => c.slug === forward || c.slug === reverse,
  );
  return found ? `/compare/${found.slug}/` : undefined;
}

export function generateStaticParams() {
  return getAllAlternativesUnfiltered().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAllAlternativesUnfiltered().find((item) => item.slug === slug);
  if (!page) {
    return buildPageMetadata({
      title: "Alternatives not found",
      description: "This alternatives page does not exist.",
      path: `/alternatives/${slug}/`,
      indexable: false,
    });
  }

  return buildPageMetadata({
    title: page.seo.title || page.title,
    description: page.seo.description || page.summary || page.title,
    path: page.seo.canonicalPath || `/alternatives/${page.slug}/`,
    indexable: isEntityIndexable({ kind: "alternatives", entity: page }),
  });
}

export default async function AlternativesDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = getAllAlternativesUnfiltered().find((item) => item.slug === slug);
  if (!page) notFound();

  const source = resolveSoftware(page.sourceSlug);
  if (!source) notFound();

  const researched = page.metadata.researchStatus === "complete";
  const provisional = page.editorialStatus !== "approved";
  const sourceScore = approvedScore(source);

  const methodology =
    getMethodologyBySlug("crm-editorial") ??
    getMethodologyBySlug("crm-software-v1");

  const updatedLabel = (
    page.metadata.updatedAt ||
    page.metadata.publishedAt ||
    ""
  ).slice(0, 10);

  const altCount = page.alternatives.length;
  const displayTitle =
    page.seo.title ||
    (provisional
      ? `${altCount} ${source.name} Alternatives`
      : `${altCount} Best ${source.name} Alternatives`);

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Alternatives", path: "/alternatives/" },
    {
      name: `${source.name} Alternatives`,
      path: `/alternatives/${page.slug}/`,
    },
  ];

  const tableRows = page.alternatives
    .map((entry, index) => {
      const target = resolveSoftware(entry.targetSlug);
      if (!target) return null;
      const score = approvedScore(target);
      const structured = Boolean(
        entry.reason &&
          entry.betterWhen.length &&
          entry.worseWhen.length &&
          entry.keyTradeoff,
      );
      const rank = index + 1;
      return {
        rank,
        name: target.name,
        slug: target.slug,
        logo: target.logo,
        description:
          entry.reason ||
          target.shortDescription ||
          target.description ||
          null,
        bestFor:
          entry.targetAudience ||
          entry.betterWhen[0] ||
          target.bestFor[0] ||
          null,
        pricingTeaser: pricingTeaser(target),
        score: score.score,
        scoreApproved: score.approved,
        badge:
          rank === 1 && page.editorialStatus === "approved"
            ? "Best overall"
            : rank === 1 && structured
              ? "Top candidate"
              : null,
        provisional: !structured || provisional,
        visitCta: (
          <SoftwareCta
            productId={target.slug}
            context="alternatives"
            intent="VISIT"
            variant="button"
            label="Visit website"
            showDisclosure={false}
            className="[&_a]:inline-flex [&_a]:h-10 [&_a]:items-center [&_a]:justify-center [&_a]:gap-1 [&_a]:px-4 [&_a]:text-sm"
          />
        ),
      };
    })
    .filter(Boolean);

  const leadEntry = page.alternatives.find(
    (entry) =>
      entry.reason &&
      entry.betterWhen.length &&
      entry.worseWhen.length &&
      entry.keyTradeoff,
  );
  const leadProduct = leadEntry
    ? resolveSoftware(leadEntry.targetSlug)
    : tableRows[0]
      ? resolveSoftware(tableRows[0]!.slug)
      : undefined;
  const leadScore = leadProduct ? approvedScore(leadProduct) : null;

  const whyItems = [
    ...new Set([
      ...source.cons.slice(0, 3),
      ...page.alternatives.flatMap((a) => a.betterWhen).slice(0, 4),
    ]),
  ].slice(0, 4);

  if (whyItems.length === 0) {
    whyItems.push(
      `Compare fit if ${source.name} no longer matches your workflow`,
      "Check pricing and seat models against your team size",
      "Evaluate must-have features with the same criteria across tools",
    );
  }

  const relatedComparisons = getAllComparisonsUnfiltered()
    .filter(
      (c) =>
        c.productSlugs.includes(page.sourceSlug) ||
        page.alternatives.some((a) => c.productSlugs.includes(a.targetSlug)),
    )
    .slice(0, 5)
    .map((comparison) => {
      const products = comparison.productSlugs
        .map((s) => resolveSoftware(s))
        .filter(Boolean)
        .map((p) => ({ name: p!.name, logo: p!.logo }));
      return {
        href: `/compare/${comparison.slug}/`,
        title: comparison.title,
        products,
      };
    });

  const categorySlug = source.primaryCategorySlug;
  const guides = [
    ...listPublishedLearningGuides(categorySlug).map((g) => ({
      href: g.path,
      label: g.title,
    })),
    ...(categorySlug === "crm"
      ? [
          {
            href: "/best/crm-software/",
            label: "Best CRM Software",
            description: "Editorial shortlist and methodology",
          },
          {
            href: "/tools/crm-finder/",
            label: "CRM Finder",
            description: "Shortlist from your answers",
          },
        ]
      : []),
  ].slice(0, 5);

  const path = page.seo.canonicalPath || `/alternatives/${page.slug}/`;
  const compareAllHref =
    categorySlug === "crm" ? "/compare/" : relatedComparisons[0]?.href;

  const detailedEntries = page.alternatives.filter(
    (entry) =>
      entry.reason ||
      entry.betterWhen.length > 0 ||
      entry.worseWhen.length > 0 ||
      entry.keyTradeoff,
  );

  return (
    <>
      <JsonLdScript
        data={[
          webPageJsonLd({
            name: displayTitle,
            description: page.seo.description || page.summary || page.title,
            path,
          }),
          breadcrumbJsonLd(breadcrumbItems),
        ]}
      />
      <Breadcrumbs items={breadcrumbItems} />

      {!researched ? (
        <ResearchStatusBanner message="Alternative relationships may include provisional structured reasons. Full editorial approval is required before this page can be indexable." />
      ) : null}

      <AlternativesHero
        className="mt-2"
        title={displayTitle}
        summary={
          page.summary ||
          `Compare ${source.name} with alternatives — features, pricing signals, and tradeoffs. Affiliate relationships never set the order.`
        }
        provisional={provisional}
        updatedLabel={updatedLabel || undefined}
        stats={[
          {
            label: `${altCount} alternative${altCount === 1 ? "" : "s"} listed`,
            icon: "products",
          },
          {
            label: "Affiliate-independent analysis",
            icon: "independent",
            href: LEGAL_ROUTES.editorialIndependence,
          },
          {
            label: methodology
              ? `Methodology v${methodology.version}`
              : "Research-backed methodology",
            icon: "methodology",
            href: COMPANY_ROUTES.methodology,
          },
          ...(updatedLabel
            ? [
                {
                  label: `Last updated ${updatedLabel}`,
                  icon: "updated" as const,
                },
              ]
            : []),
        ]}
        source={{
          name: source.name,
          slug: source.slug,
          logo: source.logo,
          summary:
            source.shortDescription || source.description || undefined,
          score: sourceScore.score,
          scoreApproved: sourceScore.approved,
        }}
        bestAlternative={
          leadProduct
            ? {
                name: leadProduct.name,
                slug: leadProduct.slug,
                logo: leadProduct.logo,
                summary:
                  leadEntry?.reason ||
                  leadProduct.shortDescription ||
                  undefined,
                score: leadScore?.score ?? null,
                scoreApproved: Boolean(leadScore?.approved),
                label: provisional
                  ? "Provisional top alternative"
                  : "Best overall alternative",
                compareHref: comparisonHref(source.slug, leadProduct.slug),
                visitCta: (
                  <SoftwareCta
                    productId={leadProduct.slug}
                    context="alternatives"
                    intent="VISIT"
                    variant="button"
                    label={`View ${leadProduct.name}`}
                    showDisclosure={false}
                  />
                ),
              }
            : undefined
        }
      />

      <AlternativesMethodologyNote
        className="mt-8"
        criterionCount={methodology?.criteria.length}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start">
        <div className="min-w-0 space-y-10">
          <AlternativesTable
            title={`Best ${source.name} alternatives`}
            rows={
              tableRows as NonNullable<(typeof tableRows)[number]>[]
            }
            compareAllHref={compareAllHref}
          />

          {detailedEntries.length > 0 ? (
            <section aria-labelledby="alt-details-heading">
              <h2
                id="alt-details-heading"
                className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
              >
                Alternative details
              </h2>
              <div className="mt-4">
                {detailedEntries.map((entry) => {
                  const target = resolveSoftware(entry.targetSlug);
                  const structured = Boolean(
                    entry.reason &&
                      entry.betterWhen.length &&
                      entry.worseWhen.length &&
                      entry.keyTradeoff,
                  );
                  return (
                    <AlternativeCard
                      key={entry.targetSlug}
                      name={target?.name || entry.targetSlug}
                      href={target ? `/software/${target.slug}/` : undefined}
                      reason={entry.reason}
                      betterWhen={entry.betterWhen}
                      worseWhen={entry.worseWhen}
                      keyTradeoff={entry.keyTradeoff}
                      provisional={!structured || provisional}
                    />
                  );
                })}
              </div>
            </section>
          ) : null}

          {page.editorialRecommendation ? (
            <section className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] p-5">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--sg-color-text)]">
                Editorial note
              </h2>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                {page.editorialRecommendation}
              </p>
            </section>
          ) : null}

          {categorySlug === "crm" ? (
            <section className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
                Prefer a tailored shortlist?
              </h2>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Use the CRM Finder for a fit-based shortlist, or estimate seat
                costs from public pricing.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href="/tools/crm-finder/">Open CRM Finder</ButtonLink>
                <ButtonLink
                  href="/tools/crm-cost-calculator/"
                  variant="outline"
                >
                  CRM Cost Calculator
                </ButtonLink>
              </div>
            </section>
          ) : null}
        </div>

        <AlternativesSidebar
          className="lg:sticky lg:top-24"
          sourceName={source.name}
          whyItems={whyItems}
          finder={
            categorySlug === "crm"
              ? {
                  href: "/tools/crm-finder/",
                  title: "Not sure which CRM is right?",
                  body: "Answer a few questions for a deterministic shortlist — affiliate status never changes the order.",
                  ctaLabel: "Try CRM Finder",
                }
              : undefined
          }
          comparisons={relatedComparisons}
          guides={guides}
        />
      </div>

      <AlternativesHowToChoose
        className="mt-14"
        title={`How to choose a ${source.name} alternative`}
      />

      <EditorialDisclosures
        showAffiliate
        methodologyVersion={methodology?.version}
        fixtureBased={provisional}
        aiUsed={page.alternatives.some((entry) => Boolean(entry.reason))}
      />

      <p className="mt-6 text-sm text-[var(--sg-color-text-muted)]">
        <Link
          href={COMPANY_ROUTES.methodology}
          className="underline underline-offset-2"
        >
          Editorial methodology
        </Link>
        {" · "}
        <Link
          href={LEGAL_ROUTES.affiliateDisclosure}
          className="underline underline-offset-2"
        >
          Affiliate disclosure
        </Link>
      </p>

      <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
        <NewsletterCard source="article-end" />
        <TrustStrip />
      </section>
    </>
  );
}
