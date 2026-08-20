import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FinderPageHero } from "@/components/finder/finder-page-hero";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { TrustStrip } from "@/components/trust/trust-strip";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { PageContainer } from "@/components/layout/page-container";
import { PricingMethodology } from "@/components/pricing/pricing-methodology";
import { WhyPricesDiffer } from "@/components/pricing/why-prices-differ";
import {
  DynamicCategoryCostCalculatorApp,
  DynamicCategoryDemoChecklistBuilderApp,
  DynamicCategoryFinderApp,
  DynamicCategoryPlanSelectorApp,
  DynamicCategoryReadinessAssessmentApp,
  DynamicCategoryRequirementsBuilderApp,
  DynamicCategoryRfpBuilderApp,
  DynamicCategoryVendorScorecardApp,
} from "@/components/tools/dynamic-tool-apps";
import { getAllSoftwareUnfiltered } from "@/data";
import {
  CATEGORY_TOOL_KINDS,
  CATEGORY_TOOL_META,
  NEW_TOOL_CATEGORY_SLUGS,
  parseCategoryToolSlug,
  type CategoryToolKind,
  type NewToolCategorySlug,
} from "@/data/config/tools/category-tool-meta";
import {
  getFinderSnapshotsForCategory,
  getPublishedComparisonSlugsForCategory,
} from "@/data/recommendation/load-snapshots";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { isCalculablePlan } from "@/services/pricing";
import { listPricingSnapshotsForCategory } from "@/services/pricing/server";
import { buildVisitCtaMap } from "@/services/affiliate/resolve-visit-cta";
import { buildCategoryFinderClientKit } from "@/services/category-tools/build-finder-kit";
import {
  buildCategoryScorecardResearchCatalog,
  listCategoryScorecardProductOptions,
} from "@/services/vendor-scorecard/server";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
  webPageJsonLd,
} from "@/seo/structured-data";

type PageProps = {
  params: Promise<{ toolSlug: string }>;
};

export function generateStaticParams() {
  return NEW_TOOL_CATEGORY_SLUGS.flatMap((categorySlug) =>
    CATEGORY_TOOL_KINDS.map((kind) => ({
      toolSlug: `${categorySlug}-${kind}`,
    })),
  );
}

function article(noun: string): string {
  return /^[aeiou]/i.test(noun) ? "an" : "a";
}

function copyFor(
  slug: NewToolCategorySlug,
  kind: CategoryToolKind,
): { title: string; description: string; path: string } {
  const meta = CATEGORY_TOOL_META[slug];
  const path = `/tools/${slug}-${kind}/`;
  const a = article(meta.productNoun);
  switch (kind) {
    case "finder":
      return {
        title: `${meta.shortName} Finder`,
        description: `Answer a few questions and get ${meta.productNoun} recommendations matched to your requirements. Affiliate relationships never change Finder rankings.`,
        path,
      };
    case "cost-calculator":
      return {
        title: `${meta.shortName} Cost Calculator`,
        description: `Estimate ${meta.softwarePhrase} costs from verified public pricing. Unknown, usage-based and custom quotes stay unknown — we never invent totals.`,
        path,
      };
    case "plan-selector":
      return {
        title: `${meta.shortName} Plan Selector`,
        description: `Already shortlisted ${a} ${meta.productNoun} product? Find the lowest plan that meets your must-haves where a verified plan matrix exists.`,
        path,
      };
    case "requirements-builder":
      return {
        title: `${meta.shortName} Requirements Builder`,
        description: `Turn a vague ${meta.productNoun} need into a structured, prioritized requirements profile — without product rankings or affiliate influence.`,
        path,
      };
    case "vendor-scorecard":
      return {
        title: `${meta.shortName} Vendor Scorecard`,
        description: `Evaluate shortlisted ${meta.productNoun} vendors against your requirements with evidence-backed research — without affiliate ranking bias.`,
        path,
      };
    case "rfp-builder":
      return {
        title: `${meta.shortName} RFP / Vendor Brief Builder`,
        description: `Package ${meta.productNoun} scope, integrations, security questions and trial criteria into a comparable vendor pack — without inventing requirements.`,
        path,
      };
    case "demo-checklist-builder":
      return {
        title: `${meta.shortName} Demo Checklist Builder`,
        description: `Build a reusable ${meta.productNoun} demo agenda with the same script for every vendor and separate scoring.`,
        path,
      };
    case "readiness-assessment":
      return {
        title: `${meta.shortName} Readiness Assessment`,
        description: `Diagnose selection vs implementation readiness before you buy ${a} ${meta.productNoun} platform.`,
        path,
      };
  }
}

function faqsFor(
  slug: NewToolCategorySlug,
  kind: CategoryToolKind,
): Array<{ question: string; answer: string }> {
  const meta = CATEGORY_TOOL_META[slug];
  const noun = meta.softwarePhrase;
  const items: Array<{ question: string; answer: string }> = [
    {
      question: `Does affiliate status change ${meta.shortName} tool results?`,
      answer:
        "No. Affiliate relationships never change rankings, scores, cost estimates, or recommended next steps.",
    },
    {
      question: "Will this invent prices, scores, or vendor capabilities?",
      answer: `No. Unknown pricing, unpublished capabilities, and unverified claims stay unknown. You author requirements; ${noun} research cells only use approved editorial assessments.`,
    },
    {
      question: "Where is my work saved?",
      answer: `On this device in localStorage under a ${meta.shortName}-specific key. We do not send the full profile to analytics.`,
    },
  ];
  if (kind === "finder") {
    items.push({
      question: "How are recommendations scored?",
      answer: `The Finder matches your answers to published ${noun} research — primary job, capabilities, team size, integrations, setup preference, and budget where public pricing is verified.`,
    });
  } else if (kind === "cost-calculator") {
    items.push({
      question: `Does this calculate every ${meta.shortName} cost?`,
      answer:
        "No. Verified seat and subscription list prices are totaled when published. Usage, overages, and custom quotes stay unknown / quote-required — we never invent dollar totals. Thin coverage in a category is shown as unknown, not guessed.",
    });
  } else if (kind === "plan-selector") {
    items.push(
      {
        question: `Why can’t I select every ${meta.shortName} product?`,
        answer:
          "Plan selection needs a verified public seat ladder plus a feature→plan matrix. Usage-priced and quote-only products stay linked to pricing notes instead of a fake ladder.",
      },
      {
        question: "Do you estimate usage or credit costs?",
        answer:
          "No. We never invent usage, credit, or overage dollar totals. Those stay unknown until the vendor quotes you.",
      },
    );
  } else if (kind === "requirements-builder") {
    items.push({
      question: "Can I export a PDF or spreadsheet?",
      answer:
        "Yes. Download a PDF report, Excel spreadsheet, JSON file, or copy a plain-text summary from the results step. Exports stay on this device.",
    });
  } else if (kind === "readiness-assessment") {
    items.push({
      question: "Is this a different scoring model than CRM?",
      answer: `No. Selection vs implementation scoring is the same method. Questions and findings are worded for ${noun}, not CRM pipeline implementation.`,
    });
  } else if (kind === "rfp-builder" || kind === "demo-checklist-builder") {
    items.push({
      question: "Where do the checklists come from?",
      answer: `They are buyer-authored ${meta.shortName} templates (scope, scenarios, security questions) using published use-case and capability slugs. They are not vendor capability claims.`,
    });
  } else {
    items.push({
      question: "Can I reuse my requirements profile?",
      answer: `Yes. When a local ${meta.shortName} Decision Profile exists, related tools can import it as an editable draft.`,
    });
  }
  return items;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { toolSlug } = await params;
  const parsed = parseCategoryToolSlug(toolSlug);
  if (!parsed) {
    return buildPageMetadata({
      title: "Tool not found",
      description: "This SoftwareGlimpse tool does not exist.",
      path: `/tools/${toolSlug}/`,
      indexable: false,
    });
  }
  const text = copyFor(parsed.categorySlug, parsed.kind);
  let indexable = true;
  if (parsed.kind === "cost-calculator" || parsed.kind === "plan-selector") {
    const snapshots = listPricingSnapshotsForCategory(parsed.categorySlug);
    const calculable = snapshots.filter((snapshot) =>
      (snapshot.pricing?.plans ?? []).some(isCalculablePlan),
    ).length;
    if (parsed.kind === "cost-calculator") indexable = calculable >= 3;
  }
  return buildPageMetadata({
    title: text.title,
    description: text.description,
    path: text.path,
    indexable,
  });
}

export default async function CategoryToolPage({ params }: PageProps) {
  const { toolSlug } = await params;
  const parsed = parseCategoryToolSlug(toolSlug);
  if (!parsed) notFound();

  const { categorySlug, kind } = parsed;
  const kit = buildCategoryFinderClientKit(categorySlug);
  const text = copyFor(categorySlug, kind);
  const faq = faqsFor(categorySlug, kind);
  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools/" },
    { name: text.title, path: text.path },
  ];
  const faqLd = faqPageJsonLd(faq);

  const relatedGuides = listPublishedLearningGuides(categorySlug)
    .slice(0, 4)
    .map((guide) => ({ href: guide.path, label: guide.title }));

  const jsonLd = [
    webPageJsonLd({
      name: text.title,
      description: text.description,
      path: text.path,
    }),
    breadcrumbJsonLd(breadcrumbItems),
    ...(faqLd ? [faqLd] : []),
    softwareApplicationJsonLd({
      name: text.title,
      path: text.path,
      description: text.description,
      applicationCategory: "BusinessApplication",
    }),
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (kind === "finder") {
    const snapshots = getFinderSnapshotsForCategory(categorySlug);
    const publishedComparisonSlugs =
      getPublishedComparisonSlugsForCategory(categorySlug);
    const software = getAllSoftwareUnfiltered();
    const logos = Object.fromEntries(
      software.filter((item) => item.logo).map((item) => [item.slug, item.logo]),
    );
    const visitCtas = buildVisitCtaMap(
      snapshots.map((snapshot) => snapshot.slug),
      "finder",
    );
    return (
      <>
        <JsonLdScript data={jsonLd} />
        <Section padding="sm" background="surface" container="wide">
          <Breadcrumbs items={breadcrumbItems} />
        </Section>
        <Section padding="md" background="surface" container="wide">
          <FinderPageHero
            title={kit.title}
            description={text.description}
            badge="Free · No signup"
          />
        </Section>
        <Section
          id="finder-experience"
          padding="md"
          background="tint"
          container="wide"
          className="relative"
        >
          <div className="mb-6 max-w-2xl">
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
              Find your {kit.softwarePhrase}
            </h2>
            <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              Answer each step to build a personalized shortlist from
              SoftwareGlimpse {kit.productNoun} research.
            </p>
          </div>
          <DynamicCategoryFinderApp
            kit={kit}
            snapshots={snapshots}
            publishedComparisonSlugs={publishedComparisonSlugs}
            logos={logos}
            visitCtas={visitCtas}
          />
        </Section>
        <FaqSection items={faq} />
        {newsletterEnabled ? (
          <Section padding="md" background="muted" container="wide">
            <NewsletterCard source="article-end" hideWhenDisabled />
          </Section>
        ) : null}
      </>
    );
  }

  if (kind === "cost-calculator") {
    const snapshots = listPricingSnapshotsForCategory(categorySlug);
    const resourceLinks = [
      ...relatedGuides,
      { href: kit.bestHref, label: `Best ${kit.softwarePhrase}` },
      { href: kit.finderHref, label: kit.title },
      { href: kit.planSelectorHref, label: `${kit.shortName} Plan Selector` },
      { href: "/pricing/", label: "Product pricing pages" },
    ];
    return (
      <PageContainer size="wide" className="py-2">
        <JsonLdScript data={jsonLd} />
        <Breadcrumbs items={breadcrumbItems} />
        <p
          className="mt-4 rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-4 py-3 text-sm text-[var(--sg-color-text-muted)]"
          role="note"
        >
          <strong className="font-medium text-[var(--sg-color-text)]">
            Verified list prices only.
          </strong>{" "}
          Seat and subscription list prices are estimated when verified. Usage,
          overages, and custom quotes remain unknown / quote-required — we never
          invent dollar totals.
        </p>
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
              Loading calculator…
            </p>
          }
        >
          <DynamicCategoryCostCalculatorApp
            kit={kit}
            snapshots={snapshots}
            resourceLinks={resourceLinks}
            title={text.title}
            description={text.description}
          />
        </Suspense>
        <div className="mt-14 space-y-12">
          <WhyPricesDiffer productNoun={kit.productNoun} />
          <PricingMethodology productNoun={kit.productNoun} />
          <section
            className="rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-primary)]/20 bg-[var(--sg-color-primary-soft)]/40 px-6 py-10 text-center sm:px-10"
            aria-labelledby="finder-cta-heading"
          >
            <h2
              id="finder-cta-heading"
              className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--sg-color-navy)]"
            >
              Cost is only one part of the decision
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--sg-color-text-muted)]">
              Answer a few questions and we’ll compare {kit.softwarePhrase} based
              on your job, capabilities and budget.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href={kit.finderHref} size="lg">
                Find My Tool
              </ButtonLink>
              <ButtonLink href={kit.planSelectorHref} variant="outline" size="lg">
                Plan selector
              </ButtonLink>
            </div>
          </section>
        </div>
        <FaqSection items={faq} className="mt-16" />
        <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
          <NewsletterCard source="article-end" hideWhenDisabled />
          <TrustStrip />
        </section>
      </PageContainer>
    );
  }

  if (kind === "plan-selector") {
    const snapshots = listPricingSnapshotsForCategory(categorySlug);
    return (
      <>
        <JsonLdScript data={jsonLd} />
        <Section padding="sm" background="surface" container="wide">
          <Breadcrumbs items={breadcrumbItems} />
        </Section>
        <Section padding="md" background="tint" container="wide">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              {kit.shortName} plan selector
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
              {text.title}
            </h1>
            <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
              {text.description}
            </p>
          </header>
        </Section>
        <Section
          id="plan-selector-workspace"
          padding="md"
          background="tint"
          container="wide"
          className="relative pb-28 lg:pb-12"
        >
          <Suspense
            fallback={
              <p className="text-sm text-[var(--sg-color-text-muted)]">
                Loading plan selector…
              </p>
            }
          >
            <DynamicCategoryPlanSelectorApp kit={kit} snapshots={snapshots} />
          </Suspense>
        </Section>
        <Section padding="md" background="surface" container="wide">
          <div className="mx-auto max-w-3xl space-y-10">
            <div id="how-it-works">
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
                How the {kit.shortName} Plan Selector works
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                You pick a product that has a verified seat plan matrix, set team
                size and must-haves, then we recommend the lowest qualifying
                published tier. Products without that matrix stay out of the
                ladder with links to pricing notes — we never invent a match
                score or a fake plan grid.
              </p>
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
                Why usage pricing stays quote-required
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--sg-color-text-muted)]">
                Many {kit.softwarePhrase} products sell usage, overages, or
                custom quotes. Mapping those onto a seat ladder invents
                economics we cannot verify, so they stay unknown until the
                vendor quotes you.
              </p>
            </div>
          </div>
        </Section>
        <FaqSection items={faq} />
        {newsletterEnabled ? (
          <Section padding="md" background="muted" container="wide">
            <NewsletterCard source="article-end" hideWhenDisabled />
          </Section>
        ) : null}
      </>
    );
  }

  if (kind === "requirements-builder") {
    return (
      <PageContainer size="wide" className="py-2 pb-24 lg:pb-2">
        <JsonLdScript data={jsonLd} />
        <Breadcrumbs items={breadcrumbItems} />
        <header className="mt-8 max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            Build your {kit.softwarePhrase} requirements
          </h1>
          <p className="mt-3 text-[var(--sg-color-text-muted)]">
            {text.description}
          </p>
        </header>
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]">
              Loading requirements builder…
            </p>
          }
        >
          <div id="how-it-works">
            <DynamicCategoryRequirementsBuilderApp kit={kit} />
          </div>
        </Suspense>
        <FaqSection items={faq} className="mt-16" />
        <section className="mt-16 space-y-10 border-t border-[var(--sg-color-border)] pt-12">
          <NewsletterCard source="article-end" hideWhenDisabled />
          <TrustStrip />
        </section>
      </PageContainer>
    );
  }

  if (kind === "vendor-scorecard") {
    const research = buildCategoryScorecardResearchCatalog(
      categorySlug,
      "1.0.0",
    );
    const productOptions = listCategoryScorecardProductOptions(
      categorySlug,
      "1.0.0",
    );
    const pricingSnapshots = listPricingSnapshotsForCategory(categorySlug);
    const publishedComparisonSlugs =
      getPublishedComparisonSlugsForCategory(categorySlug);
    return (
      <>
        <JsonLdScript data={jsonLd} />
        <Section padding="sm" background="surface" container="wide">
          <Breadcrumbs items={breadcrumbItems} />
        </Section>
        <Section padding="md" background="tint" container="wide">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              {kit.shortName} vendor scorecard
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
              Compare {kit.softwarePhrase} against what matters to you
            </h1>
            <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
              Weight your criteria, keep demo scores separate from SoftwareGlimpse
              research, and never let affiliate status change the math.
            </p>
          </header>
        </Section>
        <Section
          id="scorecard-workspace"
          padding="md"
          background="tint"
          container="wide"
          className="relative pb-24 lg:pb-12"
        >
          <DynamicCategoryVendorScorecardApp
            kit={kit}
            research={research}
            productOptions={productOptions}
            pricingSnapshots={pricingSnapshots}
            publishedComparisonSlugs={publishedComparisonSlugs}
          />
        </Section>
        <FaqSection items={faq} />
        {newsletterEnabled ? (
          <Section padding="md" background="muted" container="wide">
            <NewsletterCard source="article-end" hideWhenDisabled />
          </Section>
        ) : null}
      </>
    );
  }

  if (kind === "rfp-builder") {
    return (
      <>
        <JsonLdScript data={jsonLd} />
        <Section padding="sm" background="surface" container="wide">
          <Breadcrumbs items={breadcrumbItems} />
        </Section>
        <Section padding="md" background="tint" container="wide">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
              {kit.shortName} procurement
            </p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
              {text.title}
            </h1>
            <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
              {text.description}
            </p>
          </header>
        </Section>
        <Section
          id="rfp-workspace"
          padding="md"
          background="tint"
          container="wide"
          className="relative pb-28 lg:pb-12"
        >
          <DynamicCategoryRfpBuilderApp kit={kit} />
        </Section>
        <FaqSection items={faq} />
        {newsletterEnabled ? (
          <Section padding="md" background="muted" container="wide">
            <NewsletterCard source="article-end" hideWhenDisabled />
          </Section>
        ) : null}
      </>
    );
  }

  if (kind === "demo-checklist-builder") {
    return (
      <PageContainer size="wide" className="py-2 pb-24 lg:pb-2">
        <JsonLdScript data={jsonLd} />
        <Breadcrumbs items={breadcrumbItems} />
        <header className="mt-8 max-w-3xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--sg-color-navy)] sm:text-4xl">
            {text.title}
          </h1>
          <p className="mt-3 text-base text-[var(--sg-color-text-muted)] sm:text-lg">
            {text.description}
          </p>
        </header>
        <div className="mt-8" id="demo-checklist-workspace">
          <DynamicCategoryDemoChecklistBuilderApp kit={kit} titleElement="none" />
        </div>
        <FaqSection items={faq} className="mt-16" />
        <div className="mt-16 space-y-8">
          <TrustStrip />
          <NewsletterCard />
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      <JsonLdScript data={jsonLd} />
      <Section padding="sm" background="surface" container="wide">
        <Breadcrumbs items={breadcrumbItems} />
      </Section>
      <Section padding="md" background="tint" container="wide">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-primary)]">
            {kit.shortName} diagnostic
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-[length:var(--sg-text-h1)] font-semibold tracking-tight text-[var(--sg-color-navy)]">
            {text.title}
          </h1>
          <p className="mt-3 text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
            {text.description}
          </p>
        </header>
      </Section>
      <Section
        id="readiness-workspace"
        padding="md"
        background="tint"
        container="wide"
        className="relative pb-28 lg:pb-12"
      >
        <DynamicCategoryReadinessAssessmentApp kit={kit} />
      </Section>
      <FaqSection items={faq} />
      {newsletterEnabled ? (
        <Section padding="md" background="muted" container="wide">
          <NewsletterCard source="article-end" hideWhenDisabled />
        </Section>
      ) : null}
    </>
  );
}

function FaqSection({
  items,
  className,
}: {
  items: Array<{ question: string; answer: string }>;
  className?: string;
}) {
  return (
    <Section padding="md" background="surface" container="wide" className={className}>
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--sg-color-navy)]">
        FAQ
      </h2>
      <dl className="mt-6 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-semibold text-[var(--sg-color-navy)]">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
