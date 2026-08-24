import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import {
  getComparisons,
  getSoftware,
  getBestPages,
  getIndustries,
  getSoftwareByCategory,
  getSoftwareBySlug,
  getTopLevelCategories,
  getUseCases,
} from "@/data";
import { getEducationalGuides } from "@/data/repositories/guides-educational";
import { loadAssessment } from "@/data/editorial/store";
import { CategoryCard } from "@/components/category/category-card";
import { ComparisonTeaserCard } from "@/components/home/comparison-teaser-card";
import { DecisionPathSection } from "@/components/home/decision-path-section";
import { BestSoftwareCard } from "@/components/home/best-software-card";
import { FinderCtaSection } from "@/components/home/finder-cta-section";
import { GuideCard } from "@/components/home/guide-card";
import { HomepageDecisionPanel } from "@/components/home/homepage-decision-panel";
import { ResearchUpdateFeed } from "@/components/home/research-update-feed";
import { SectionHeader } from "@/components/home/section-header";
import { TrustWhySection } from "@/components/home/trust-why-section";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/stack";
import { NewsletterCard } from "@/components/newsletter/newsletter-card";
import { SoftwareCard } from "@/components/software/software-card";
import { TrustIndicators } from "@/components/trust/trust-strip";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/forms";
import {
  estimateGuideReadingMinutes,
  readingPartsFromGuide,
} from "@/components/guides/guide-reading-time";
import { siteFoundationConfig } from "@/data/config/site/foundation";
import { buildPageMetadata } from "@/seo/metadata";
import {
  JsonLdScript,
  organizationJsonLd,
  websiteJsonLd,
} from "@/seo/structured-data";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { resolveVisitCta } from "@/services/affiliate/resolve-visit-cta";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_NAME,
  description: SITE_TAGLINE,
  path: "/",
  indexable: true,
  pageType: "home",
});

function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function categoryLabelFor(
  slug: string,
  categories: Array<{ slug: string; name: string }>,
): string {
  return categories.find((c) => c.slug === slug)?.name ?? "Software";
}

function publicBestBuyingContext(categoryLabel: string): string {
  return `Find ${categoryLabel} software that fits specific team needs — evaluated with the same category methodology, not affiliate rankings.`;
}

export default function HomePage() {
  const categories = getTopLevelCategories();
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
  const software = getSoftware().filter(
    (s) => s.productLifecycle === "active",
  );
  const bestPages = getBestPages();
  // Educational guides only — avoid generating every product-guide pack on home.
  const guides = getEducationalGuides();
  const useCases = getUseCases();
  const industries = getIndustries();
  const comparisons = getComparisons().filter(
    (c) => c.categorySlug === "crm" && c.productSlugs.length >= 2,
  );

  const featured =
    getSoftwareBySlug("pipedrive") ??
    getSoftwareBySlug("freshsales") ??
    software[0];
  const featuredAssessment = featured ? loadAssessment(featured.slug) : null;

  const popularCategorySlugs = [
    "crm",
    "sales-intelligence",
    "marketing",
    "project-management",
  ];
  const popularPills = categories.filter((c) =>
    popularCategorySlugs.includes(c.slug),
  );

  const categoriesWithCounts = categories
    .map((c) => {
      const products = getSoftwareByCategory(c.slug);
      return {
        category: c,
        count: products.length,
        popularNames: products.slice(0, 3).map((p) => p.name),
      };
    })
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.category.sortOrder - b.category.sortOrder;
    });
  const priorityCategories = categoriesWithCounts.filter((c) => c.count > 0);
  const secondaryCategories = categoriesWithCounts.filter((c) => c.count === 0);

  const featuredReviews = [
    "attio",
    "hubspot",
    "zoho-crm",
    "pipedrive",
    "salesforce",
    "copper",
  ]
    .map((slug) => getSoftwareBySlug(slug))
    .filter(Boolean)
    .slice(0, 4);
  const reviewCards =
    featuredReviews.length >= 3
      ? featuredReviews
      : software.slice(0, 4);

  const recentlyTouched = software
    .map((s) => {
      const a = loadAssessment(s.slug);
      const updatedAt =
        a?.updatedAt ?? a?.reviewedAt ?? s.metadata.updatedAt ?? null;
      return { software: s, updatedAt, assessment: a };
    })
    .filter((x) => x.updatedAt)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0, 5);

  const decisionPaths = [
    {
      id: "find",
      title: "Find your match",
      description: "Tell us what you need and get a fit-based shortlist.",
      href: "/tools/crm-finder/",
      cta: "Find my software →",
      icon: "finder" as const,
    },
    {
      id: "compare",
      title: "Compare software",
      description: "See products side by side on the same criteria.",
      href: "/compare/",
      cta: "Compare now →",
      icon: "compare" as const,
    },
    {
      id: "browse",
      title: "Browse categories",
      description: "Explore software by category hubs we actively cover.",
      href: "/categories/",
      cta: "Browse all categories →",
      icon: "browse" as const,
    },
    {
      id: "calculate",
      title: "Calculate costs",
      description: "Estimate seat costs from catalogue CRM pricing.",
      href: "/tools/crm-cost-calculator/",
      cta: "Try calculators →",
      icon: "calculate" as const,
    },
    {
      id: "stack",
      title: "Build your stack",
      description: "Sketch a CRM-centered software stack for your team.",
      href: "/tools/software-stack-builder/",
      cta: "Build your stack →",
      icon: "stack" as const,
    },
  ];

  const trustMetrics = [
    { value: `${software.length}+`, label: "Software covered" },
    {
      value: `${categoriesWithCounts.filter((c) => c.count > 0).length}`,
      label: "Categories with products",
    },
    { value: `${software.length}`, label: "Product profiles" },
    { value: `${guides.length}`, label: "Buying guides" },
  ];

  const newsletterEnabled = siteFoundationConfig.newsletter.enabled;

  return (
    <>
      <JsonLdScript data={[organizationJsonLd(), websiteJsonLd()]} />

      {/* HERO */}
      <Section
        padding="md"
        background="surface"
        container="wide"
        className="relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgb(37_99_235/0.10),transparent_55%),radial-gradient(ellipse_at_90%_20%,rgb(59_130_246/0.08),transparent_45%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgb(148_163_184/0.35)_1px,transparent_1px)] [background-size:22px_22px]"
          aria-hidden
        />

        <div className="relative grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="flex flex-col">
            <h1 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-display)] font-bold leading-[var(--sg-leading-tight)] tracking-tight text-[var(--sg-color-navy)]">
              Find the right software.{" "}
              <span className="text-[var(--sg-color-primary)]">
                Make smarter decisions.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-[length:var(--sg-text-body-lg)] text-[var(--sg-color-text-muted)]">
              Independent reviews, clear comparisons, and fit-based tools to help
              you choose business software — starting with CRM and sales.
              Affiliate commissions never set rankings.
            </p>

            <form
              action="/search/"
              method="get"
              className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"
              role="search"
            >
              <label htmlFor="home-search" className="sr-only">
                Search software
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--sg-color-text-muted)]"
                  aria-hidden
                />
                <Input
                  id="home-search"
                  name="q"
                  type="search"
                  placeholder="Search CRM, sales tools, categories…"
                  className="h-12 pl-10 shadow-[var(--sg-shadow-sm)]"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" className="sm:px-6">
                Search
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {popularPills.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.path.join("/")}/`}
                  className="rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-sm text-[var(--sg-color-text-muted)] shadow-sm hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
                >
                  {c.name}
                </Link>
              ))}
              <ButtonLink
                href="/tools/crm-finder/"
                variant="outline"
                size="sm"
                className="border-[var(--sg-color-primary)] text-[var(--sg-color-primary)]"
              >
                Find My CRM
              </ButtonLink>
            </div>

            <TrustIndicators className="mt-7" />
          </div>

          {featured ? (
            (() => {
              const visit = resolveVisitCta(featured.slug, "other");
              return (
            <HomepageDecisionPanel
              product={{
                slug: featured.slug,
                name: featured.name,
                categoryLabel: categoryLabelFor(
                  featured.primaryCategorySlug,
                  categories,
                ),
                bestFor:
                  featuredAssessment?.bestFor?.[0] ??
                  featured.bestFor?.[0] ??
                  "SMB sales teams focused on pipeline visibility",
                strengths: (
                  featuredAssessment?.strengths?.slice(0, 3) ??
                  featured.pros?.slice(0, 3) ?? [
                    "Visual pipeline and deal management",
                    "Custom pipelines for growing sales teams",
                    "Activity-oriented selling workflows",
                  ]
                ).map((s) =>
                  s
                    .replace(/\s+in research fixtures\.?$/i, "")
                    .replace(/\s+called out in research fixtures\.?$/i, ""),
                ),
                logo: featured.logo,
                reviewHref: `/software/${featured.slug}/`,
                visitHref: visit?.href,
                visitIsAffiliate: visit?.isAffiliate,
              }}
            />
              );
            })()
          ) : null}
        </div>
      </Section>

      {/* TRUST / PROOF STRIP */}
      <Section padding="sm" background="tint" container="wide">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustMetrics.map((m) => (
            <li
              key={m.label}
              className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-4 shadow-[var(--sg-shadow-sm)]"
            >
              <p className="text-xl font-bold text-[var(--sg-color-primary)]">
                {m.value}
              </p>
              <p className="mt-0.5 text-sm text-[var(--sg-color-text-muted)]">
                {m.label}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* HOW DO YOU WANT TO CHOOSE */}
      <Section padding="md" background="surface" container="wide">
        <SectionHeader
          title="How do you want to find software?"
          description="Pick a path — search, compare, browse, calculate, or build a stack."
        />
        <DecisionPathSection paths={decisionPaths} />
      </Section>

      {/* CATEGORIES */}
      <Section id="categories" padding="md" background="muted" container="wide">
        <SectionHeader
          title="Browse software categories"
          description="Start with the categories we actively research — denser hubs first."
          action={
            <Link
              href="/categories/"
              className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              View all categories
            </Link>
          }
        />
        {priorityCategories.length > 0 ? (
          <Grid cols={3} gap={4}>
            {priorityCategories.map(({ category: c, count, popularNames }) => (
              <CategoryCard
                key={c.id}
                featured
                slug={c.slug}
                name={c.name}
                href={`/categories/${c.path.join("/")}/`}
                description={c.shortDescription}
                productCount={count}
                popularNames={popularNames}
              />
            ))}
          </Grid>
        ) : null}
        {secondaryCategories.length > 0 ? (
          <div className="mt-6">
            <p className="mb-3 text-sm font-medium text-[var(--sg-color-text-muted)]">
              More categories
            </p>
            <Grid cols={4} gap={3}>
              {secondaryCategories.map(({ category: c }) => (
                <CategoryCard
                  key={c.id}
                  slug={c.slug}
                  name={c.name}
                  href={`/categories/${c.path.join("/")}/`}
                  description={c.shortDescription}
                />
              ))}
            </Grid>
          </div>
        ) : null}
      </Section>

      {/* FEATURED REVIEWS */}
      <Section padding="md" background="surface" container="wide">
        <SectionHeader
          title="Featured software reviews"
          description="Explore software we recommend across the categories we cover."
          action={
            <Link
              href="/software/"
              className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Browse all software
            </Link>
          }
        />
        <Grid cols={4} gap={4}>
          {reviewCards.map((s) => {
            if (!s) return null;
            const a = loadAssessment(s.slug);
            const approved = a?.status === "approved";
            const visit = resolveVisitCta(s.slug, "other");
            return (
              <SoftwareCard
                key={s.id}
                software={s}
                categoryLabel={categoryLabelFor(
                  s.primaryCategorySlug,
                  categories,
                )}
                rating={approved ? a?.overallScore : null}
                ratingApproved={approved}
                bestFor={a?.bestFor?.[0] ?? s.bestFor?.[0]}
                ctaHref={visit?.href}
                ctaIsAffiliate={visit?.isAffiliate}
                ctaLabel={`Visit ${s.name}`}
              />
            );
          })}
        </Grid>
      </Section>

      {/* POPULAR COMPARISONS */}
      {comparisons.length > 0 ? (
        <Section padding="md" background="tint" container="wide">
          <SectionHeader
            title="Popular comparisons"
            description="Side-by-side CRM comparisons using the same criteria for both products."
            action={
              <Link
                href="/compare/"
                className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                All comparisons
              </Link>
            }
          />
          <Grid cols={3} gap={4}>
            {comparisons.slice(0, 6).map((cmp) => {
              const left = getSoftwareBySlug(cmp.productSlugs[0]!);
              const right = getSoftwareBySlug(cmp.productSlugs[1]!);
              if (!left || !right) return null;
              const leftScenario = cmp.bestFor.find(
                (b) => b.productSlug === left.slug,
              )?.scenarios[0];
              const rightScenario = cmp.bestFor.find(
                (b) => b.productSlug === right.slug,
              )?.scenarios[0];
              const summary =
                leftScenario && rightScenario
                  ? `${leftScenario} vs ${rightScenario.toLowerCase()}`
                  : cmp.title;
              return (
                <ComparisonTeaserCard
                  key={cmp.id}
                  href={`/compare/${cmp.slug}/`}
                  leftName={left.name}
                  rightName={right.name}
                  leftLogo={left.logo}
                  rightLogo={right.logo}
                  summary={summary}
                />
              );
            })}
          </Grid>
        </Section>
      ) : null}

      {/* BEST SOFTWARE */}
      <Section padding="md" background="surface" container="wide">
        <SectionHeader
          title="Best software"
          description="Find the strongest software for specific needs — methodology-led shortlists."
          action={
            <Link
              href="/best/"
              className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Explore best lists
            </Link>
          }
        />
        {bestPages.length === 1 && bestPages[0] ? (
          (() => {
            const page = bestPages[0]!;
            const catSlug = page.categorySlug ?? "crm";
            return (
              <BestSoftwareCard
                title={page.title}
                href={`/best/${page.slug}/`}
                categorySlug={catSlug}
                categoryLabel={categoryLabelFor(catSlug, categories)}
                buyingContext={publicBestBuyingContext(
                  categoryLabelFor(catSlug, categories),
                )}
                evaluatedCount={page.eligibleProductSlugs?.length}
                fitScenarios={[
                  "Small teams",
                  "Sales-led businesses",
                  "Simple pipeline management",
                ]}
                topProducts={(page.eligibleProductSlugs ?? [])
                  .slice(0, 3)
                  .map((slug) => getSoftwareBySlug(slug))
                  .filter(Boolean)
                  .map((p) => ({ name: p!.name, logo: p!.logo }))}
              />
            );
          })()
        ) : bestPages.length > 1 ? (
          <Grid cols={2} gap={4}>
            {bestPages.map((page) => {
              const catSlug = page.categorySlug ?? "crm";
              return (
                <BestSoftwareCard
                  key={page.id}
                  title={page.title}
                  href={`/best/${page.slug}/`}
                  categorySlug={catSlug}
                  categoryLabel={categoryLabelFor(catSlug, categories)}
                  buyingContext={publicBestBuyingContext(
                    categoryLabelFor(catSlug, categories),
                  )}
                  evaluatedCount={page.eligibleProductSlugs?.length}
                  topProducts={(page.eligibleProductSlugs ?? [])
                    .slice(0, 3)
                    .map((slug) => getSoftwareBySlug(slug))
                    .filter(Boolean)
                    .map((p) => ({ name: p!.name, logo: p!.logo }))}
                />
              );
            })}
          </Grid>
        ) : (
          <p className="text-sm text-[var(--sg-color-text-muted)]">
            Best software lists will appear here as category research is
            published.{" "}
            <Link
              href="/categories/"
              className="font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
            >
              Browse categories
            </Link>
          </p>
        )}
      </Section>

      {/* BROWSE BY NEED */}
      {useCases.length > 0 ? (
        <Section padding="md" background="muted" container="wide">
          <SectionHeader
            title="Browse by need"
            description="Not sure which category fits? Start from the job you need software to do."
            action={
              <Link
                href="/use-cases/"
                className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                All use cases
              </Link>
            }
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.slice(0, 6).map((uc) => (
              <li key={uc.id}>
                <Link
                  href={`/use-cases/${uc.slug}/`}
                  className="group flex h-full flex-col rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-4 shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)]/40 hover:shadow-[var(--sg-shadow-md)]"
                >
                  <span className="font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {uc.name}
                  </span>
                  {uc.shortDescription ? (
                    <span className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
                      {uc.shortDescription}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* INDUSTRIES */}
      {industries.length > 0 ? (
        <Section padding="md" background="surface" container="wide">
          <SectionHeader
            title="Software by industry"
            description="Browse CRM context by industry when you buy for a specific market."
            action={
              <Link
                href="/industries/"
                className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                All industries
              </Link>
            }
          />
          <ul className="flex flex-wrap gap-2">
            {industries.slice(0, 8).map((ind) => (
              <li key={ind.id}>
                <Link
                  href={`/industries/${ind.slug}/`}
                  className="inline-flex rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-3.5 py-2 text-sm font-medium text-[var(--sg-color-text)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
                >
                  {ind.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* GUIDES */}
      {guides.length > 0 ? (
        <Section padding="md" background="tint" container="wide">
          <SectionHeader
            title="Software buying guides"
            description="Learn how to choose software before you shortlist — research-backed supporting guides."
            action={
              <Link
                href="/guides/"
                className="text-sm font-semibold text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
              >
                All guides
              </Link>
            }
          />
          <Grid cols={2} gap={4} className="lg:grid-cols-2">
            {guides.slice(0, 4).map((guide) => {
              const cat = guide.categorySlugs[0]
                ? categoryBySlug.get(guide.categorySlugs[0])
                : undefined;
              const minutes = estimateGuideReadingMinutes(
                readingPartsFromGuide(guide),
              );
              const updated =
                guide.metadata.reviewedAt ||
                guide.metadata.updatedAt ||
                guide.metadata.publishedAt;
              return (
                <GuideCard
                  key={guide.id}
                  href={`/guides/${guide.slug}/`}
                  title={guide.title}
                  summary={guide.summary}
                  categoryLabel={cat?.name}
                  topicType={guide.topicType}
                  readingMinutes={minutes}
                  updatedLabel={updated ? formatDateLabel(updated) : undefined}
                />
              );
            })}
          </Grid>
        </Section>
      ) : null}

      {/* FINDER CTA */}
      <Section padding="md" background="navy" container="wide">
        <FinderCtaSection
          exampleProduct={
            featured
              ? {
                  name: featured.name,
                  logo: featured.logo,
                  reasons: [
                    "Small sales team",
                    "Pipeline visibility",
                    "Growing SMB workflows",
                  ],
                }
              : null
          }
        />
      </Section>

      {/* RECENTLY UPDATED + NEWSLETTER */}
      <Section padding="md" background="muted" container="wide">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <ResearchUpdateFeed
            items={recentlyTouched.map(({ software: s, updatedAt, assessment }) => ({
              href: `/software/${s.slug}/`,
              name: s.name,
              logo: s.logo,
              changeLabel:
                assessment?.status === "approved"
                  ? "Review updated"
                  : "Recommendations updated",
              dateLabel: formatDateLabel(String(updatedAt)),
            }))}
          />
          {newsletterEnabled ? (
            <NewsletterCard hideWhenDisabled source="article-inline" />
          ) : (
            <div className="rounded-[var(--sg-radius-lg)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)]">
              <h3 className="font-semibold text-[var(--sg-color-text)]">
                Keep researching with us
              </h3>
              <p className="mt-2 text-sm text-[var(--sg-color-text-muted)]">
                Explore guides, comparisons, and CRM Finder while we prepare
                SoftwareGlimpse Updates.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href="/guides/" variant="outline" size="sm">
                  Browse guides
                </ButtonLink>
                <ButtonLink href="/tools/crm-finder/" size="sm">
                  Try CRM Finder
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* WHY TRUST */}
      <Section padding="md" background="surface" container="wide" bordered>
        <TrustWhySection />
      </Section>
    </>
  );
}
