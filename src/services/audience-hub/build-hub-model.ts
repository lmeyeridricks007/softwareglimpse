import type { AudienceHubProfile, AudiencePage, Software } from "@/domain";
import {
  getAllAudiencesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getAudienceBySlug,
  getPrimarySoftwareByCategory,
  getSoftwareBySlug,
  getUseCases,
} from "@/data";
import { getAudienceHubProfile, listAudienceHubProfiles } from "@/data/audience-hub";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildCrmHubResourceLinks } from "@/services/hub-linking/crm-hub-links";
import { COMPANY_ROUTES } from "@/services/site-foundation";

export type AudienceHubNavItem = {
  id: string;
  label: string;
};

export type AudienceHubProductCard = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  bestFor: string | null;
  reviewHref: string;
  pricingHref: string;
};

export type AudienceHubModel = {
  audience: AudiencePage;
  profile: AudienceHubProfile;
  displayTitle: string;
  badgeLabel: string;
  tagline: string;
  overview: string;
  whoThisIsFor: string | null;
  whatMattersIntro: string;
  workedExample: string | null;
  workedExampleSecondary: string | null;
  path: string;
  categorySlug: string;
  glance: {
    primaryGoal: string | null;
    typicalTeam: string | null;
    commonPriorities: string[];
    taggedProductCount: number;
  };
  challenges: AudienceHubProfile["challenges"];
  outcomes: AudienceHubProfile["outcomes"];
  capabilityNeeds: AudienceHubProfile["capabilityNeeds"];
  workflowSteps: AudienceHubProfile["workflowSteps"];
  needsVisual: AudienceHubProfile["needsVisual"];
  workflowVisual: AudienceHubProfile["workflowVisual"];
  priorities: AudienceHubProfile["priorities"];
  scenarios: AudienceHubProfile["scenarios"];
  fitSignals: AudienceHubProfile["fitSignals"];
  buyingFramework: AudienceHubProfile["buyingFramework"];
  buyingGuideHref: string;
  faq: AudienceHubProfile["faq"];
  products: AudienceHubProductCard[];
  relatedAudiences: Array<{
    slug: string;
    name: string;
    href: string;
    description: string | null;
  }>;
  relatedUseCases: Array<{
    slug: string;
    name: string;
    href: string;
    description: string | null;
  }>;
  comparisons: Array<{
    href: string;
    title: string;
    products: Array<{ name: string; logo?: Software["logo"] }>;
  }>;
  guides: Array<{ href: string; label: string }>;
  resources: Array<{ href: string; label: string }>;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  bestHref: string;
  methodologyHref: string;
  visualKind: AudienceHubProfile["visualKind"];
  navItems: AudienceHubNavItem[];
};

function matchesAudience(
  software: Software,
  profile: AudienceHubProfile,
  audience: AudiencePage,
): boolean {
  const sizeSlugs =
    profile.matchBusinessSizeSlugs.length > 0
      ? profile.matchBusinessSizeSlugs
      : audience.businessSizeSlugs;
  const typeSlugs =
    profile.matchBusinessTypeSlugs.length > 0
      ? profile.matchBusinessTypeSlugs
      : audience.businessTypeSlugs;
  const teamSlugs =
    profile.matchTeamTypeSlugs.length > 0
      ? profile.matchTeamTypeSlugs
      : audience.teamTypeSlugs;

  const sizeHit =
    sizeSlugs.length === 0 ||
    sizeSlugs.some((s) => software.businessSizeSlugs.includes(s));
  // businessType / teamType are not always on Software — size is primary catalogue tag.
  void typeSlugs;
  void teamSlugs;
  return sizeHit && software.primaryCategorySlug === "crm";
}

export function buildAudienceHubModel(slug: string): AudienceHubModel | null {
  const audience = getAudienceBySlug(slug, { includeUnpublished: true });
  if (!audience) return null;

  const profile = getAudienceHubProfile(slug);
  if (!profile) return null;

  const categorySlug = profile.categorySlug || "crm";
  const path = audience.seo.canonicalPath || `/for/${audience.slug}/`;

  const primary = getPrimarySoftwareByCategory(categorySlug);
  const tagged = primary
    .filter((s) => matchesAudience(s, profile, audience))
    .slice(0, 9);

  const products: AudienceHubProductCard[] = tagged.map((s) => ({
    slug: s.slug,
    name: s.name,
    logo: s.logo ?? null,
    bestFor: s.bestFor[0] ?? null,
    reviewHref: `/software/${s.slug}/`,
    pricingHref: `/pricing/${s.slug}/`,
  }));

  const relatedAudiences = (
    profile.relatedAudienceSlugs.length > 0
      ? profile.relatedAudienceSlugs
      : listAudienceHubProfiles()
          .map((p) => p.audienceSlug)
          .filter((s) => s !== slug)
          .slice(0, 3)
  )
    .map((relatedSlug) => {
      const a = getAllAudiencesUnfiltered().find((x) => x.slug === relatedSlug);
      if (!a) return null;
      return {
        slug: a.slug,
        name: a.name,
        href: a.seo.canonicalPath || `/for/${a.slug}/`,
        description: a.shortDescription ?? null,
      };
    })
    .filter(Boolean) as AudienceHubModel["relatedAudiences"];

  const relatedUseCases = (
    profile.relatedUseCaseSlugs.length > 0
      ? profile.relatedUseCaseSlugs
      : audience.useCaseSlugs
  )
    .map((ucSlug) => {
      const uc = getUseCases().find((u) => u.slug === ucSlug);
      if (!uc) return null;
      return {
        slug: uc.slug,
        name: uc.name,
        href: `/use-cases/${uc.slug}/`,
        description: uc.shortDescription ?? null,
      };
    })
    .filter(Boolean) as AudienceHubModel["relatedUseCases"];

  const productSlugSet = new Set(tagged.map((p) => p.slug));
  const comparisons = getAllComparisonsUnfiltered()
    .filter(
      (c) =>
        c.categorySlug === categorySlug &&
        c.productSlugs.some((ps) => productSlugSet.has(ps)),
    )
    .slice(0, 4)
    .map((comparison) => {
      const productsForCompare = comparison.productSlugs
        .map(
          (s) =>
            getSoftwareBySlug(s) ??
            getAllSoftwareUnfiltered().find((x) => x.slug === s),
        )
        .filter(Boolean)
        .map((p) => ({ name: p!.name, logo: p!.logo }));
      return {
        href: `/compare/${comparison.slug}/`,
        title: comparison.title,
        products: productsForCompare,
      };
    });

  const publishedGuides = listPublishedLearningGuides(categorySlug);
  const guides =
    profile.featuredGuideHrefs.length > 0
      ? profile.featuredGuideHrefs.map((href) => {
          const fromPublished = publishedGuides.find((g) => g.path === href);
          return {
            href,
            label:
              fromPublished?.title ??
              href.replace(/^\/guides\//, "").replace(/\/$/, ""),
          };
        })
      : publishedGuides.slice(0, 4).map((g) => ({
          href: g.path,
          label: g.title,
        }));

  const finderHref = profile.finderHref ?? "/tools/crm-finder/";
  const calculatorHref =
    profile.calculatorHref ?? "/tools/crm-cost-calculator/";
  const compareHref = profile.compareHref ?? "/compare/";
  const bestHref = profile.bestHref ?? "/best/crm-software/";

  const primaryCta = profile.primaryCta ?? {
    href: finderHref,
    label: "Find My CRM",
  };
  const secondaryCta = profile.secondaryCta ?? {
    href: profile.buyingGuideHref ?? "/guides/how-to-choose-crm/",
    label: "How to choose",
  };

  const resources = [
    ...buildCrmHubResourceLinks({
      excludeHrefs: [`/for/${audience.slug}/`, "/for/"],
    }),
    { href: "/for/", label: "All business types" },
    { href: COMPANY_ROUTES.methodology, label: "Editorial methodology" },
  ].filter((item, index, arr) => {
    const key = item.href.split("?")[0]!;
    return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
  });

  return {
    audience,
    profile,
    displayTitle:
      profile.displayTitle ?? `CRM for ${audience.name}`,
    badgeLabel: profile.badgeLabel ?? audience.name,
    tagline:
      profile.tagline ??
      audience.shortDescription ??
      `CRM guidance for ${audience.name.toLowerCase()}.`,
    overview:
      profile.overview ??
      audience.description ??
      audience.shortDescription ??
      "",
    whoThisIsFor: profile.whoThisIsFor ?? null,
    whatMattersIntro:
      profile.whatMattersIntro ??
      "Focus on fit signals for teams like yours — not generic feature popularity.",
    workedExample: profile.workedExample ?? null,
    workedExampleSecondary: profile.workedExampleSecondary ?? null,
    path,
    categorySlug,
    glance: {
      primaryGoal: profile.glance?.primaryGoal ?? null,
      typicalTeam: profile.glance?.typicalTeam ?? null,
      commonPriorities: profile.glance?.commonPriorities ?? [],
      taggedProductCount: tagged.length,
    },
    challenges: profile.challenges,
    outcomes: profile.outcomes,
    capabilityNeeds: profile.capabilityNeeds,
    workflowSteps: profile.workflowSteps,
    needsVisual: profile.needsVisual,
    workflowVisual: profile.workflowVisual,
    priorities: profile.priorities,
    scenarios: profile.scenarios,
    fitSignals: profile.fitSignals,
    buyingFramework: profile.buyingFramework,
    buyingGuideHref:
      profile.buyingGuideHref ?? "/guides/how-to-choose-crm/",
    faq: profile.faq,
    products,
    relatedAudiences,
    relatedUseCases,
    comparisons,
    guides,
    resources,
    primaryCta,
    secondaryCta,
    finderHref,
    calculatorHref,
    compareHref,
    bestHref,
    methodologyHref: COMPANY_ROUTES.methodology,
    visualKind: profile.visualKind,
    navItems: [
      { id: "overview", label: "Overview" },
      { id: "challenges", label: "Challenges" },
      { id: "how-crm-helps", label: "How CRM helps" },
      { id: "what-matters", label: "What matters" },
      { id: "needs", label: "Must-haves" },
      { id: "workflow", label: "Workflow" },
      { id: "fit", label: "Fit signals" },
      { id: "scenarios", label: "Scenarios" },
      { id: "software", label: "Software" },
      { id: "choose", label: "How to choose" },
      { id: "faq", label: "FAQ" },
    ],
  };
}

export function listAudienceHubSlugs(): string[] {
  return listAudienceHubProfiles().map((p) => p.audienceSlug);
}
