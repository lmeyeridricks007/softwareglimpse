import type { Capability, CapabilityHubProfile } from "@/domain";
import {
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCapabilities,
  getSoftwareBySlug,
  getUseCases,
} from "@/data";
import { getCapabilityHubProfile } from "@/data/capability-hub";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildCrmHubResourceLinks } from "@/services/hub-linking/crm-hub-links";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import { loadEnrichment } from "@/data/research/store";
import type { ProductMedia } from "@/domain";
import {
  capabilityMediaAliases,
  selectCapabilityApproachPairs,
  selectCapabilityPageVideos,
  selectCapabilitySeeInActionCards,
} from "@/services/product-media/capability-page-media";
import { buildCapabilityWorkflowComparison } from "@/services/capability-workflow-comparison";
import type { CapabilityWorkflowComparisonModel } from "@/services/capability-workflow-comparison";

export type CapabilityHubNavItem = {
  id: string;
  label: string;
};

export type CapabilityHubModel = {
  capability: Capability;
  profile: CapabilityHubProfile | null;
  displayTitle: string;
  badgeLabel: string;
  tagline: string;
  overview: string;
  whoThisIsFor: string | null;
  whatMattersIntro: string;
  workedExample: string | null;
  workedExampleSecondary: string | null;
  glance: {
    primaryGoal: string | null;
    typicalTeam: string | null;
    commonPriorities: string[];
    taggedProductCount: number;
  };
  challenges: CapabilityHubProfile["challenges"];
  outcomes: CapabilityHubProfile["outcomes"];
  capabilityNeeds: CapabilityHubProfile["capabilityNeeds"];
  workflowSteps: CapabilityHubProfile["workflowSteps"];
  priorities: CapabilityHubProfile["priorities"];
  scenarios: CapabilityHubProfile["scenarios"];
  buyingFramework: CapabilityHubProfile["buyingFramework"];
  buyingGuideHref: string | null;
  faq: CapabilityHubProfile["faq"];
  heroVisual: CapabilityHubProfile["heroVisual"];
  needsVisual: CapabilityHubProfile["needsVisual"];
  workflowVisual: CapabilityHubProfile["workflowVisual"];
  products: Array<{
    slug: string;
    name: string;
    software: NonNullable<ReturnType<typeof getSoftwareBySlug>>;
  }>;
  relatedCapabilities: Array<{
    slug: string;
    name: string;
    shortDescription: string | null;
    href: string;
  }>;
  relatedUseCases: Array<{
    slug: string;
    name: string;
    shortDescription: string | null;
    href: string;
  }>;
  relatedRequirements: Array<{ slug: string; href: string; label: string }>;
  relatedFeatures: Array<{ slug: string; href: string; label: string }>;
  comparisons: Array<{
    href: string;
    title: string;
    products: Array<{ name: string; logo?: { src: string; alt: string } | null }>;
  }>;
  guides: Array<{ href: string; title: string }>;
  resources: Array<{ href: string; label: string }>;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  catalogueHref: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  navItems: CapabilityHubNavItem[];
  categorySlug: string;
  seeInAction: import("@/services/product-media").CapabilitySeeInActionCard[];
  approachPairs: import("@/services/product-media").CapabilitySeeInActionCard[];
  videos: import("@/domain").ProductMedia[];
  approachInterpretation: string | null;
  workflowComparison: CapabilityWorkflowComparisonModel | null;
};

/** Map capability → adjacent use cases for catalogue explore when no explicit UC list. */
const CAPABILITY_USE_CASE_FALLBACK: Record<string, string[]> = {
  "contact-management": ["contact-management", "relationship-management"],
  "relationship-management": ["relationship-management", "account-management"],
  "lead-management": ["lead-management", "inbound-sales", "high-volume-lead-management"],
  "pipeline-management": ["pipeline-management", "complex-sales-processes"],
  "deal-management": ["pipeline-management", "sales-forecasting"],
  "workflow-automation": ["sales-automation", "customer-follow-up"],
  email: ["email-outreach", "sales-engagement"],
  "sales-engagement": ["sales-engagement", "outbound-sales"],
  reporting: ["reporting", "sales-forecasting"],
  forecasting: ["sales-forecasting", "reporting"],
  customization: ["pipeline-management", "contact-management"],
  integrations: ["sales-automation", "contact-management"],
  administration: ["pipeline-management"],
  security: ["relationship-management"],
  mobile: ["field-sales"],
  "ai-assistance": ["sales-automation", "reporting"],
};

export function buildCapabilityHubModel(
  slug: string,
): CapabilityHubModel | null {
  const capability = getCapabilities().find((c) => c.slug === slug);
  if (!capability) return null;

  const profile = getCapabilityHubProfile(slug, capability.categorySlugs[0]);
  const categorySlug =
    profile?.categorySlug ?? capability.categorySlugs[0] ?? "crm";

  const exploreUseCaseSlugs =
    profile?.relatedUseCaseSlugs?.length
      ? profile.relatedUseCaseSlugs
      : (CAPABILITY_USE_CASE_FALLBACK[slug] ?? []);

  const products = getAllSoftwareUnfiltered()
    .filter((s) =>
      exploreUseCaseSlugs.some((uc) => s.useCaseSlugs.includes(uc)),
    )
    .slice(0, 9)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      software: s,
    }));

  const relatedCapabilities = (profile?.relatedCapabilitySlugs ?? [])
    .map((s) => getCapabilities().find((c) => c.slug === s))
    .filter(Boolean)
    .map((c) => ({
      slug: c!.slug,
      name: c!.name,
      shortDescription: c!.shortDescription ?? null,
      href: `/capabilities/${c!.slug}/`,
    }));

  const relatedUseCases = (profile?.relatedUseCaseSlugs ?? [])
    .map((s) => getUseCases().find((uc) => uc.slug === s))
    .filter(Boolean)
    .map((uc) => ({
      slug: uc!.slug,
      name: uc!.name,
      shortDescription: uc!.shortDescription ?? null,
      href: `/use-cases/${uc!.slug}/`,
    }));

  const relatedRequirements = (profile?.relatedRequirementSlugs ?? []).map(
    (s) => ({
      slug: s,
      href: `/requirements/${s}/`,
      label: s.replace(/-/g, " "),
    }),
  );

  const relatedFeatures = (profile?.relatedFeatureSlugs ?? []).map((s) => ({
    slug: s,
    href: `/features/${s}/`,
    label: s.replace(/-/g, " "),
  }));

  const comparisons = getAllComparisonsUnfiltered()
    .filter(
      (c) =>
        c.categorySlug === categorySlug &&
        c.productSlugs.some((ps) => products.some((p) => p.slug === ps)),
    )
    .slice(0, 4)
    .map((comparison) => {
      const comps = comparison.productSlugs
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
        products: comps,
      };
    });

  const learningGuides = listPublishedLearningGuides(categorySlug);
  const featuredGuides = (profile?.featuredGuideHrefs ?? []).map((href) => {
    const fromPublished = learningGuides.find((g) => g.path === href);
    return {
      href,
      title:
        fromPublished?.title ??
        href.replace(/^\/guides\//, "").replace(/\/$/, "").replace(/-/g, " "),
    };
  });
  const guides =
    featuredGuides.length > 0
      ? featuredGuides
      : learningGuides.slice(0, 4).map((g) => ({ href: g.path, title: g.title }));

  const finderHref = profile?.finderHref ?? "/tools/crm-finder/";
  const calculatorHref =
    profile?.calculatorHref ?? "/tools/crm-cost-calculator/";
  const compareHref = profile?.compareHref ?? "/compare/";
  const catalogueHref =
    profile?.catalogueHref ?? `/categories/${categorySlug}/`;

  const journeyResources =
    categorySlug === "crm"
      ? buildCrmHubResourceLinks({
          excludeHrefs: [`/capabilities/${capability.slug}/`],
        })
      : [];

  const resources = [
    ...guides.slice(0, 3).map((g) => ({ href: g.href, label: g.title })),
    ...journeyResources,
    { href: "/capabilities/", label: "All CRM capabilities" },
    { href: COMPANY_ROUTES.methodology, label: "Editorial methodology" },
  ].filter((item, index, arr) => {
    const key = item.href.split("?")[0]!;
    return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
  });

  const displayTitle =
    profile?.displayTitle ?? `${capability.name} CRM capability`;
  const badgeLabel = profile?.badgeLabel ?? capability.name;
  const tagline =
    profile?.tagline ??
    capability.shortDescription ??
    `Evaluate ${capability.name.toLowerCase()} as a CRM capability — what it must do, not vendor slogans.`;
  const overview =
    profile?.overview ??
    capability.description ??
    capability.shortDescription ??
    `Explore the ${capability.name.toLowerCase()} CRM capability.`;
  const whatMattersIntro =
    profile?.whatMattersIntro ??
    `Judge ${capability.name.toLowerCase()} by weekly operating needs — not feature marketing.`;

  const mediaPool: ProductMedia[] = [];
  for (const p of products) {
    const enrichment = loadEnrichment(p.slug);
    if (enrichment?.media?.length) mediaPool.push(...enrichment.media);
  }
  const mediaCtx = {
    capabilitySlug: slug,
    capabilityAliases: capabilityMediaAliases(slug),
    requirementIds: profile?.relatedRequirementSlugs ?? [],
    featureIds: profile?.relatedFeatureSlugs ?? [],
    useCaseIds: profile?.relatedUseCaseSlugs ?? exploreUseCaseSlugs,
  };
  const seeInAction = selectCapabilitySeeInActionCards({
    mediaPool,
    products: products.map((p) => ({
      slug: p.slug,
      name: p.name,
      logo: p.software.logo,
    })),
    ctx: mediaCtx,
    limit: 4,
  });
  const approachPairs = selectCapabilityApproachPairs(seeInAction);
  const videos = selectCapabilityPageVideos(mediaPool, mediaCtx, {
    limit: 12,
    allowBrandPromoFallback: false,
  });
  const approachInterpretation =
    approachPairs.length >= 2
      ? `${approachPairs[0]!.productName} and ${approachPairs[1]!.productName} show different workflow emphases for ${capability.name.toLowerCase()} in official demos — not a ranking. Video availability never changes capability teaching.`
      : null;

  const workflowComparison = buildCapabilityWorkflowComparison({
    capabilityId: slug,
    capabilityName: capability.name,
    productIds: [
      ...seeInAction.map((c) => c.productSlug),
      ...products.map((p) => p.slug),
    ].filter((s, i, arr) => arr.indexOf(s) === i),
    workflowSteps: (profile?.workflowSteps ?? []).map((s) => ({
      id: s.id,
      label: s.label,
      detail: s.detail,
    })),
    mediaPool,
    mediaCtx,
    relatedFeatureSlugs: profile?.relatedFeatureSlugs ?? [],
    relatedCapabilityHrefs: (profile?.relatedCapabilitySlugs ?? [])
      .slice(0, 2)
      .map((s) => ({
        href: `/capabilities/${s}/`,
        label: `Explore ${s.replace(/-/g, " ")} →`,
      })),
    evidenceHref: "#capability-evidence",
    limitProducts: 2,
  });

  const navItems: CapabilityHubNavItem[] = [
    { id: "overview", label: "Overview" },
    ...(profile?.challenges?.length
      ? [{ id: "challenges", label: "Challenges" }]
      : []),
    ...(profile?.challenges?.length || profile?.outcomes?.length
      ? [{ id: "how-crm-helps", label: "How CRM helps" }]
      : []),
    ...(profile?.priorities?.length
      ? [{ id: "what-matters", label: "What matters" }]
      : []),
    ...(profile?.capabilityNeeds?.length
      ? [{ id: "needs", label: "Must-haves" }]
      : []),
    ...(profile?.workflowSteps?.length
      ? [{ id: "workflow", label: "Workflow" }]
      : []),
    ...(seeInAction.length > 0
      ? [{ id: "see-in-action", label: "See in action" }]
      : []),
    ...(workflowComparison
      ? [{ id: "approach-differences", label: "Approaches" }]
      : []),
    ...(profile?.buyingFramework?.length
      ? [{ id: "how-to-choose", label: "How to evaluate" }]
      : []),
    { id: "software", label: "CRM software" },
    ...(seeInAction.length > 0
      ? [{ id: "capability-evidence", label: "Evidence" }]
      : []),
    ...(profile?.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "next-steps", label: "Tools & guides" },
  ];

  return {
    capability,
    profile,
    displayTitle,
    badgeLabel,
    tagline,
    overview,
    whoThisIsFor: profile?.whoThisIsFor ?? null,
    whatMattersIntro,
    workedExample: profile?.workedExample ?? null,
    workedExampleSecondary: profile?.workedExampleSecondary ?? null,
    glance: {
      primaryGoal: profile?.glance?.primaryGoal ?? null,
      typicalTeam: profile?.glance?.typicalTeam ?? null,
      commonPriorities: profile?.glance?.commonPriorities ?? [],
      taggedProductCount: products.length,
    },
    challenges: profile?.challenges ?? [],
    outcomes: profile?.outcomes ?? [],
    capabilityNeeds: profile?.capabilityNeeds ?? [],
    workflowSteps: profile?.workflowSteps ?? [],
    priorities: profile?.priorities ?? [],
    scenarios: profile?.scenarios ?? [],
    buyingFramework: profile?.buyingFramework ?? [],
    buyingGuideHref: profile?.buyingGuideHref ?? "/guides/how-to-choose-crm/",
    faq: profile?.faq ?? [],
    heroVisual: profile?.heroVisual,
    needsVisual: profile?.needsVisual,
    workflowVisual: profile?.workflowVisual,
    products,
    relatedCapabilities,
    relatedUseCases,
    relatedRequirements,
    relatedFeatures,
    comparisons,
    guides,
    resources,
    finderHref,
    calculatorHref,
    compareHref,
    catalogueHref,
    primaryCta: profile?.primaryCta ?? {
      href: finderHref,
      label: "Find My CRM",
    },
    secondaryCta: profile?.secondaryCta ?? {
      href: compareHref,
      label: "Compare CRM Software",
    },
    navItems,
    categorySlug,
    seeInAction,
    approachPairs,
    videos,
    approachInterpretation,
    workflowComparison,
  };
}
