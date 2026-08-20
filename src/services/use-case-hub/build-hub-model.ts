import type {
  ProductMedia,
  UseCase,
  UseCaseHubProfile,
} from "@/domain";
import {
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getSoftwareBySlug,
  getUseCases,
} from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { getUseCaseHubProfile } from "@/data/use-case-hub";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildCrmHubResourceLinks } from "@/services/hub-linking/crm-hub-links";
import { COMPANY_ROUTES } from "@/services/site-foundation";
import {
  selectUseCaseApproachPairs,
  selectUseCasePageVideos,
  selectUseCaseSeeInActionCards,
  scoreUseCasePageMedia,
  useCaseMediaAliases,
  type UseCaseSeeInActionCard,
} from "@/services/product-media/use-case-page-media";
import {
  buildWorkflowExperienceModel,
  type WorkflowExperienceModel,
} from "@/services/workflow-experience";
import {
  buildUseCaseWorkflowProductCompare,
  type UseCaseWorkflowProductCompareModel,
} from "@/services/use-case-workflow-comparison";

export type UseCaseHubNavItem = {
  id: string;
  label: string;
};

export type UseCaseHubModel = {
  useCase: UseCase;
  profile: UseCaseHubProfile | null;
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
  challenges: UseCaseHubProfile["challenges"];
  outcomes: UseCaseHubProfile["outcomes"];
  capabilityNeeds: UseCaseHubProfile["capabilityNeeds"];
  workflowSteps: UseCaseHubProfile["workflowSteps"];
  /** Expandable workflow experience (category-agnostic model). */
  workflowExperience: WorkflowExperienceModel | null;
  priorities: UseCaseHubProfile["priorities"];
  scenarios: UseCaseHubProfile["scenarios"];
  buyingFramework: UseCaseHubProfile["buyingFramework"];
  buyingGuideHref: string | null;
  faq: UseCaseHubProfile["faq"];
  heroVisual: UseCaseHubProfile["heroVisual"];
  needsVisual: UseCaseHubProfile["needsVisual"];
  workflowVisual: UseCaseHubProfile["workflowVisual"];
  products: Array<{
    slug: string;
    name: string;
    software: NonNullable<ReturnType<typeof getSoftwareBySlug>>;
  }>;
  /** Official workflow demos — display only; never ranking. */
  seeInAction: UseCaseSeeInActionCard[];
  approachPairs: UseCaseSeeInActionCard[];
  /** Interactive product×workflow comparison (assessment-backed). */
  workflowProductCompare: UseCaseWorkflowProductCompareModel | null;
  videos: ProductMedia[];
  visualEvidence: {
    officialDemoCount: number;
    screenshotCount: number;
  };
  requirementsChecklist: string[];
  requirementsHref: string;
  implementationHref: string;
  relatedUseCases: Array<{
    slug: string;
    name: string;
    shortDescription: string | null;
    href: string;
  }>;
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
  seeWorkflowHref: string | null;
  navItems: UseCaseHubNavItem[];
  categorySlug: string;
};

export function buildUseCaseHubModel(slug: string): UseCaseHubModel | null {
  const useCase = getUseCases().find((uc) => uc.slug === slug);
  if (!useCase) return null;

  const profile = getUseCaseHubProfile(slug, useCase.categorySlugs[0]);
  const categorySlug = profile?.categorySlug ?? useCase.categorySlugs[0] ?? "crm";

  const products = getAllSoftwareUnfiltered()
    .filter((s) => s.useCaseSlugs.includes(useCase.slug))
    .slice(0, 9)
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      software: s,
    }));

  const relatedSlugs =
    profile?.relatedUseCaseSlugs?.length
      ? profile.relatedUseCaseSlugs
      : getUseCases()
          .filter(
            (uc) =>
              uc.slug !== useCase.slug &&
              uc.categorySlugs.some((c) => useCase.categorySlugs.includes(c)),
          )
          .slice(0, 4)
          .map((uc) => uc.slug);

  const relatedUseCases = relatedSlugs
    .map((s) => getUseCases().find((uc) => uc.slug === s))
    .filter(Boolean)
    .map((uc) => ({
      slug: uc!.slug,
      name: uc!.name,
      shortDescription: uc!.shortDescription ?? null,
      href: `/use-cases/${uc!.slug}/`,
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
  const catalogueHref = profile?.catalogueHref ?? `/categories/${categorySlug}/`;
  const requirementsHref = `/tools/crm-requirements-builder/?start=1&useCase=${encodeURIComponent(useCase.slug)}`;
  const implementationHref = `/tools/crm-implementation-planner/?useCase=${encodeURIComponent(useCase.slug)}`;

  const journeyResources =
    categorySlug === "crm"
      ? buildCrmHubResourceLinks({
          useCaseSlug: useCase.slug,
          excludeHrefs: [`/use-cases/${useCase.slug}/`],
        })
      : [];

  const resources = [
    ...guides.slice(0, 3).map((g) => ({ href: g.href, label: g.title })),
    ...journeyResources,
    { href: "/use-cases/", label: categorySlug === "crm" ? "All CRM use cases" : "All use cases" },
    { href: COMPANY_ROUTES.methodology, label: "Editorial methodology" },
  ].filter((item, index, arr) => {
    const key = item.href.split("?")[0]!;
    return arr.findIndex((x) => x.href.split("?")[0] === key) === index;
  });

  const displayTitle =
    profile?.displayTitle ?? `${useCase.name} CRM use case`;
  const badgeLabel = profile?.badgeLabel ?? useCase.name;
  const tagline =
    profile?.tagline ??
    useCase.shortDescription ??
    `Match CRM workflows for ${useCase.name.toLowerCase()} using researched capabilities — not invented buyer stories.`;
  const overview =
    profile?.overview ??
    useCase.description ??
    useCase.shortDescription ??
    `Explore how CRM supports ${useCase.name.toLowerCase()}.`;
  const whatMattersIntro =
    profile?.whatMattersIntro ??
    `Evaluate ${useCase.name.toLowerCase()} by the operating loop your team will keep updated — not by feature marketing.`;

  const workflowSteps = profile?.workflowSteps ?? [];
  const capabilityNeeds = profile?.capabilityNeeds ?? [];

  const mediaPool: ProductMedia[] = [];
  let screenshotCount = 0;
  const screenshotsForCompare: Array<{
    productSlug: string;
    src: string;
    alt: string;
    caption?: string;
    source?: string;
  }> = [];
  const productSlugsForMedia = [
    ...new Set([
      ...products.map((p) => p.slug),
      "hubspot",
      "pipedrive",
      "salesforce",
    ]),
  ];
  for (const productSlug of productSlugsForMedia) {
    const enrichment = loadEnrichment(productSlug);
    if (enrichment?.media?.length) mediaPool.push(...enrichment.media);
    if (enrichment?.screenshots?.length) {
      screenshotCount += enrichment.screenshots.length;
      for (const shot of enrichment.screenshots.slice(0, 3)) {
        screenshotsForCompare.push({
          productSlug,
          src: shot.src,
          alt: shot.alt,
          caption: shot.caption,
          source: shot.source,
        });
      }
    }
  }

  const mediaCtx = {
    useCaseSlug: useCase.slug,
    useCaseAliases: useCaseMediaAliases(useCase.slug),
    workflowStepIds: workflowSteps.map((s) => s.id),
    capabilityIds: capabilityNeeds
      .map((n) => n.href?.match(/\/capabilities\/([^/]+)/)?.[1])
      .filter((x): x is string => Boolean(x)),
    featureIds: [
      useCase.slug,
      ...(useCase.slug === "lead-management"
        ? ["lead-management", "workflow-automation", "deal-management"]
        : []),
    ],
  };

  // Prefer catalogue-tagged products; also include researched products with
  // use-case-relevant media so demos are not dropped when tagging lags.
  const seeInActionProductMap = new Map(
    products.map((p) => [
      p.slug,
      { slug: p.slug, name: p.name, logo: p.software.logo },
    ]),
  );
  for (const media of mediaPool) {
    if (seeInActionProductMap.has(media.productSlug)) continue;
    const soft = getSoftwareBySlug(media.productSlug);
    if (!soft) continue;
    const ctx = { ...mediaCtx, productSlug: media.productSlug };
    if (scoreUseCasePageMedia(media, ctx) <= 0) continue;
    seeInActionProductMap.set(media.productSlug, {
      slug: soft.slug,
      name: soft.name,
      logo: soft.logo,
    });
  }

  // Ensure common researched CRMs are available for comparison defaults.
  for (const slug of ["hubspot", "pipedrive", "salesforce", "zoho-crm"]) {
    if (seeInActionProductMap.has(slug)) continue;
    const soft = getSoftwareBySlug(slug);
    if (!soft) continue;
    if (!soft.useCaseSlugs.includes(useCase.slug) && !loadEnrichment(slug)) {
      continue;
    }
    seeInActionProductMap.set(slug, {
      slug: soft.slug,
      name: soft.name,
      logo: soft.logo,
    });
  }

  // Workflow compare should not be limited to sparse catalogue tags. Include
  // researched products whose featureSupport overlaps this use case's steps.
  const stepFeatureIds = new Set(
    workflowSteps.flatMap((s) => (s.features ?? []).map((f) => f.id)),
  );
  if (stepFeatureIds.size > 0) {
    for (const soft of getAllSoftwareUnfiltered()) {
      if (seeInActionProductMap.has(soft.slug)) continue;
      const enrichment = loadEnrichment(soft.slug);
      if (!enrichment?.featureSupport?.length) continue;
      const overlap = enrichment.featureSupport.filter((f) =>
        stepFeatureIds.has(f.featureSlug),
      ).length;
      if (overlap < 2) continue;
      seeInActionProductMap.set(soft.slug, {
        slug: soft.slug,
        name: soft.name,
        logo: soft.logo,
      });
    }
  }

  const preferredCompareOrder = [
    "hubspot",
    "pipedrive",
    "salesforce",
    "zoho-crm",
    "freshsales",
    "close",
    "copper",
    "attio",
  ];
  const taggedSlugs = new Set(products.map((p) => p.slug));
  const compareProducts = [...seeInActionProductMap.values()].sort((a, b) => {
    const taggedA = taggedSlugs.has(a.slug) ? 0 : 1;
    const taggedB = taggedSlugs.has(b.slug) ? 0 : 1;
    if (taggedA !== taggedB) return taggedA - taggedB;
    const prefA = preferredCompareOrder.indexOf(a.slug);
    const prefB = preferredCompareOrder.indexOf(b.slug);
    const scoreA = prefA === -1 ? 99 : prefA;
    const scoreB = prefB === -1 ? 99 : prefB;
    if (scoreA !== scoreB) return scoreA - scoreB;
    return a.name.localeCompare(b.name);
  });
  /** Cap keeps the overlay usable; researched overlap already filtered the pool. */
  const workflowCompareLimit = 16;
  const workflowCompareProducts = compareProducts.slice(0, workflowCompareLimit);

  const seeInAction = selectUseCaseSeeInActionCards({
    mediaPool,
    products: compareProducts,
    workflowSteps: workflowSteps.map((s) => ({ id: s.id, label: s.label })),
    ctx: mediaCtx,
    limit: 3,
  });
  const approachPairs = selectUseCaseApproachPairs(seeInAction);
  const videos = selectUseCasePageVideos(mediaPool, mediaCtx, {
    limit: 6,
    requireStrongMatch: true,
  });

  const workflowExperience =
    workflowSteps.length > 0
      ? buildWorkflowExperienceModel({
          title: `${badgeLabel} workflow`,
          supporting:
            "Understand what needs to happen before comparing how products implement each step. Support overlays use structured research — never video inference.",
          steps: workflowSteps.map((s) => ({
            id: s.id,
            label: s.label,
            detail: s.detail,
            goal: s.goal,
            capabilities: s.capabilities,
            requirements: s.requirements,
            features: s.features,
          })),
          products: workflowCompareProducts,
          mediaPool: [
            ...seeInAction.map((c) => c.media),
            ...videos,
          ].filter(
            (m, i, arr) => arr.findIndex((x) => x.id === m.id) === i,
          ),
          productsHref: "#software",
          evidenceHref:
            videos.length > 0 || seeInAction.length > 0
              ? "#use-case-evidence"
              : "#see-in-action",
          visual: profile?.workflowVisual,
        })
      : null;

  const workflowProductCompare =
    workflowSteps.length > 0
      ? buildUseCaseWorkflowProductCompare({
          useCaseSlug: useCase.slug,
          useCaseLabel: badgeLabel,
          steps: workflowSteps.map((s) => ({
            id: s.id,
            label: s.label,
            features: s.features,
            requirements: s.requirements,
          })),
          products: workflowCompareProducts,
          mediaPool,
          screenshots: screenshotsForCompare,
          mediaCtx,
        })
      : null;

  const requirementsChecklist =
    workflowSteps.length > 0
      ? workflowSteps.map((s) => s.detail)
      : capabilityNeeds.slice(0, 6).map((n) => n.title);

  const navItems: UseCaseHubNavItem[] = [
    { id: "overview", label: "Overview" },
    ...(profile?.challenges?.length
      ? [{ id: "challenges", label: "Challenges" }]
      : []),
    ...(profile?.challenges?.length || profile?.outcomes?.length
      ? [
          {
            id: "how-crm-helps",
            label:
              categorySlug === "email-marketing"
                ? "How email marketing helps"
                : categorySlug === "sales-intelligence"
                  ? "How SI helps"
                  : categorySlug === "business-communications"
                    ? "How business communications helps"
                    : categorySlug === "project-management"
                      ? "How project management helps"
                      : categorySlug === "hr"
                        ? "How HR software helps"
                      : "How CRM helps",
          },
        ]
      : []),
    ...(profile?.priorities?.length
      ? [{ id: "what-matters", label: "What matters" }]
      : []),
    ...(capabilityNeeds.length
      ? [{ id: "needs", label: "Must-haves" }]
      : []),
    ...(workflowSteps.length
      ? [{ id: "workflow", label: "Workflow" }]
      : []),
    ...(seeInAction.length > 0
      ? [{ id: "see-in-action", label: "See in action" }]
      : []),
    ...(approachPairs.length >= 2
      ? [{ id: "compare-approaches", label: "Compare demos" }]
      : []),
    ...(workflowProductCompare
      ? [{ id: "compare-workflow", label: "Compare products" }]
      : []),
    { id: "build-requirements", label: "Requirements" },
    ...(profile?.buyingFramework?.length
      ? [{ id: "how-to-choose", label: "How to choose" }]
      : []),
    { id: "software", label: categorySlug === "crm" ? "CRM software" : "Software" },
    ...(videos.length > 0 || screenshotCount > 0
      ? [{ id: "use-case-evidence", label: "Evidence" }]
      : []),
    ...(profile?.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
    { id: "next-steps", label: "Tools & guides" },
  ];

  return {
    useCase,
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
    capabilityNeeds,
    workflowSteps,
    workflowExperience,
    priorities: profile?.priorities ?? [],
    scenarios: profile?.scenarios ?? [],
    buyingFramework: profile?.buyingFramework ?? [],
    buyingGuideHref: profile?.buyingGuideHref ?? "/guides/how-to-choose-crm/",
    faq: profile?.faq ?? [],
    heroVisual: profile?.heroVisual,
    needsVisual: profile?.needsVisual,
    workflowVisual: profile?.workflowVisual,
    products,
    seeInAction,
    approachPairs,
    workflowProductCompare,
    videos,
    visualEvidence: {
      officialDemoCount: seeInAction.length,
      screenshotCount,
    },
    requirementsChecklist,
    requirementsHref,
    implementationHref,
    relatedUseCases,
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
    seeWorkflowHref: seeInAction.length > 0 ? "#see-in-action" : null,
    navItems,
    categorySlug,
  };
}
