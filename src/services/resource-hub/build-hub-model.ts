import type {
  BuyingStage,
  Resource,
  ResourceHubProfile,
  ResourceType,
} from "@/domain";
import {
  getAllResourcesUnfiltered,
  getResources,
} from "@/data";
import { getResourceHubProfile } from "@/data/resource-hub";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { buildResourceDownloadFiles } from "@/services/resource-hub/export-documents";
import { resolveForPublicRoute } from "@/services/publishing/route-resolution";

export type ResourceHubNavItem = {
  id: string;
  label: string;
};

export type ResourceJourneyNode = {
  slug: string;
  name: string;
  href: string;
  current: boolean;
};

export type ResourceHubModel = {
  resource: Resource;
  profile: ResourceHubProfile | null;
  displayTitle: string;
  badgeLabel: string;
  toolkitLabel: string | null;
  tagline: string;
  heroExplanation: string | null;
  overview: string;
  whoThisIsFor: string | null;
  whatMattersIntro: string;
  howToUse: string | null;
  workedExample: string | null;
  workedExampleSecondary: string | null;
  workedExampleStructured: ResourceHubProfile["workedExampleStructured"];
  glance: {
    primaryGoal: string | null;
    typicalTeam: string | null;
    commonPriorities: string[];
    kindLabel: string;
    stageLabel: string;
    resourceType: ResourceType | null;
    buyingStage: BuyingStage | null;
    jobToBeDone: string | null;
    bestFor: string[];
    timeToComplete: string | null;
    formatsLabel: string;
    lastReviewedAt: string | null;
  };
  whatsInside: NonNullable<ResourceHubProfile["whatsInside"]>;
  evidenceRules: ResourceHubProfile["evidenceRules"];
  challenges: ResourceHubProfile["challenges"];
  outcomes: ResourceHubProfile["outcomes"];
  priorities: ResourceHubProfile["priorities"];
  workflowSteps: ResourceHubProfile["workflowSteps"];
  artifactSections: ResourceHubProfile["artifactSections"];
  downloadFiles: ResourceHubProfile["downloadFiles"];
  faq: ResourceHubProfile["faq"];
  heroVisual: ResourceHubProfile["heroVisual"];
  needsVisual: ResourceHubProfile["needsVisual"];
  workflowVisual: ResourceHubProfile["workflowVisual"];
  relatedResources: Array<{
    slug: string;
    name: string;
    shortDescription: string | null;
    href: string;
    kind: Resource["kind"];
  }>;
  journey: ResourceJourneyNode[];
  useBefore: ResourceJourneyNode[];
  useWith: ResourceJourneyNode[];
  useNext: ResourceJourneyNode[];
  guides: Array<{ href: string; title: string }>;
  tools: Array<{ href: string; label: string }>;
  finderHref: string;
  calculatorHref: string;
  compareHref: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  previewHref: string | null;
  navItems: ResourceHubNavItem[];
  categorySlug: string;
};

const KIND_LABELS: Record<Resource["kind"], string> = {
  checklist: "Checklist",
  template: "Template",
  scorecard: "Scorecard",
  worksheet: "Worksheet",
  planner: "Training plan",
};

const STAGE_LABELS: Record<Resource["stage"], string> = {
  choose: "Choose",
  implement: "Implement",
  compare: "Compare",
  security: "Security",
  optimize: "Optimize",
};

const BUYING_STAGE_LABELS: Record<BuyingStage, string> = {
  DISCOVER: "Discover",
  DEFINE: "Define",
  SHORTLIST: "Shortlist",
  EVALUATE: "Evaluate",
  VALIDATE: "Validate",
  DECIDE: "Decide",
  BUY: "Buy",
  IMPLEMENT: "Implement",
  OPTIMIZE: "Optimize",
  REVIEW: "Review",
};

const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  CHECKLIST: "Checklist",
  SCORECARD: "Scorecard",
  WORKSHEET: "Worksheet",
  TEMPLATE: "Template",
  MATRIX: "Matrix",
  QUESTION_LIST: "Question list",
  PLANNING_PACK: "Planning pack",
  AUDIT_TEMPLATE: "Audit template",
  MIGRATION_TEMPLATE: "Migration template",
  IMPLEMENTATION_TEMPLATE: "Implementation template",
  RFP_TEMPLATE: "RFP template",
  DECISION_TEMPLATE: "Decision template",
  CALCULATOR_EXPORT: "Calculator export",
};

const DEFAULT_CRM_JOURNEY = [
  "crm-requirements-template",
  "crm-evaluation-checklist",
  "crm-vendor-scorecard",
  "crm-business-case-template",
  "crm-implementation-checklist",
];

function resolveNodes(
  slugs: string[],
  currentSlug: string,
): ResourceJourneyNode[] {
  return slugs
    .map((s) => getAllResourcesUnfiltered().find((r) => r.slug === s))
    .filter(Boolean)
    .map((r) => ({
      slug: r!.slug,
      name: r!.shortTitle ?? r!.name,
      href: `/resources/${r!.slug}/`,
      current: r!.slug === currentSlug,
    }));
}

function formatsLabel(
  files: ResourceHubProfile["downloadFiles"],
): string {
  const formats = [...new Set(files.map((f) => f.format.toUpperCase()))];
  if (formats.length === 0) return "Excel + PDF";
  return formats.join(" + ");
}

export function buildResourceHubModel(slug: string): ResourceHubModel | null {
  const raw = getAllResourcesUnfiltered().find((r) => r.slug === slug);
  const resource = resolveForPublicRoute(raw);
  if (!resource) return null;

  const profile = getResourceHubProfile(slug);
  const categorySlug =
    profile?.categorySlug ?? resource.categorySlugs[0] ?? "crm";

  const visibleResources = getResources();
  const relatedSlugs =
    profile?.relatedResourceSlugs?.length
      ? profile.relatedResourceSlugs
      : visibleResources
          .filter(
            (r) =>
              r.slug !== resource.slug &&
              (r.stage === resource.stage ||
                r.categorySlugs.some((c) => resource.categorySlugs.includes(c))),
          )
          .slice(0, 4)
          .map((r) => r.slug);

  const relatedResources = relatedSlugs
    .map((s) => visibleResources.find((r) => r.slug === s))
    .filter(Boolean)
    .map((r) => ({
      slug: r!.slug,
      name: r!.name,
      shortDescription: r!.shortDescription ?? null,
      href: `/resources/${r!.slug}/`,
      kind: r!.kind,
    }));

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
      ? featuredGuides.slice(0, 4)
      : learningGuides.slice(0, 4).map((g) => ({ href: g.path, title: g.title }));

  const tools =
    profile?.relatedToolHrefs?.length
      ? profile.relatedToolHrefs.slice(0, 4)
      : [
          { href: "/tools/crm-finder/", label: "CRM Software Finder" },
          {
            href: "/tools/crm-requirements-builder/?start=1",
            label: "Requirements Builder",
          },
        ];

  const finderHref = profile?.finderHref ?? "/tools/crm-finder/";
  const calculatorHref =
    profile?.calculatorHref ?? "/tools/crm-cost-calculator/";
  const compareHref = profile?.compareHref ?? "/compare/";

  const displayTitle = profile?.displayTitle ?? resource.name;
  const badgeLabel =
    profile?.badgeLabel ??
    (resource.resourceType
      ? RESOURCE_TYPE_LABELS[resource.resourceType]
      : KIND_LABELS[resource.kind]);
  const tagline =
    profile?.tagline ??
    resource.shortDescription ??
    `Downloadable ${resource.name.toLowerCase()} for CRM buyers and implementers.`;
  const overview =
    profile?.overview ??
    resource.description ??
    resource.shortDescription ??
    `Use this ${resource.kind} during the ${resource.stage} stage of CRM selection or rollout.`;
  const whatMattersIntro =
    profile?.whatMattersIntro ??
    `Treat this ${resource.kind} as a gate artifact — fill it before advancing demos, contracts, or go-live.`;

  const downloadFiles = buildResourceDownloadFiles(
    resource.slug,
    profile?.downloadFiles ?? [],
  );

  const journeySlugs =
    profile?.journeySlugs?.length
      ? profile.journeySlugs
      : categorySlug === "crm"
        ? DEFAULT_CRM_JOURNEY
        : [];
  const journey = resolveNodes(journeySlugs, resource.slug);

  const useBefore = resolveNodes(profile?.useBefore ?? [], resource.slug);
  const useWith = resolveNodes(profile?.useWith ?? [], resource.slug);
  const useNext = resolveNodes(
    profile?.useNext?.length
      ? profile.useNext
      : relatedSlugs.filter((s) => s !== resource.slug).slice(0, 2),
    resource.slug,
  );

  const buyingStage = resource.buyingStage ?? null;
  const stageLabel = buyingStage
    ? BUYING_STAGE_LABELS[buyingStage]
    : STAGE_LABELS[resource.stage];

  const navItems: ResourceHubNavItem[] = [
    { id: "overview", label: "Overview" },
    ...(profile?.whatsInside?.length
      ? [{ id: "whats-inside", label: "What's inside" }]
      : []),
    ...(profile?.outcomes?.length
      ? [{ id: "helps-you-do", label: "Helps you do" }]
      : []),
    ...(profile?.workflowSteps?.length
      ? [{ id: "how-to-use", label: "How to use" }]
      : []),
    ...(profile?.artifactSections?.length
      ? [{ id: "preview", label: "Preview" }]
      : []),
    ...(profile?.workedExampleStructured || profile?.workedExample
      ? [{ id: "worked-example", label: "Example" }]
      : []),
    ...(profile?.evidenceRules
      ? [{ id: "evidence", label: "Evidence" }]
      : []),
    ...(profile?.faq?.length ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  const xlsx = downloadFiles.find((f) => f.format === "xlsx");
  const pdf = downloadFiles.find((f) => f.format === "pdf");

  return {
    resource,
    profile,
    displayTitle,
    badgeLabel,
    toolkitLabel: profile?.toolkitLabel ?? null,
    tagline,
    heroExplanation: profile?.heroExplanation ?? null,
    overview,
    whoThisIsFor: profile?.whoThisIsFor ?? null,
    whatMattersIntro,
    howToUse: profile?.howToUse ?? null,
    workedExample: profile?.workedExample ?? null,
    workedExampleSecondary: profile?.workedExampleSecondary ?? null,
    workedExampleStructured: profile?.workedExampleStructured,
    glance: {
      primaryGoal: profile?.glance?.primaryGoal ?? null,
      typicalTeam: profile?.glance?.typicalTeam ?? null,
      commonPriorities: profile?.glance?.commonPriorities ?? [],
      kindLabel: badgeLabel,
      stageLabel,
      resourceType: resource.resourceType ?? null,
      buyingStage,
      jobToBeDone: resource.jobToBeDone ?? null,
      bestFor: resource.bestFor?.length
        ? resource.bestFor
        : profile?.glance?.typicalTeam
          ? [profile.glance.typicalTeam]
          : [],
      timeToComplete: resource.timeToComplete ?? null,
      formatsLabel: formatsLabel(downloadFiles),
      lastReviewedAt:
        profile?.lastReviewedAt ??
        resource.metadata.reviewedAt?.slice(0, 10) ??
        null,
    },
    whatsInside: profile?.whatsInside ?? [],
    evidenceRules: profile?.evidenceRules,
    challenges: profile?.challenges ?? [],
    outcomes: profile?.outcomes ?? [],
    priorities: profile?.priorities ?? [],
    workflowSteps: profile?.workflowSteps ?? [],
    artifactSections: profile?.artifactSections ?? [],
    downloadFiles,
    faq: profile?.faq ?? [],
    heroVisual: profile?.heroVisual,
    needsVisual: profile?.needsVisual,
    workflowVisual: profile?.workflowVisual,
    relatedResources,
    journey,
    useBefore,
    useWith,
    useNext,
    guides,
    tools,
    finderHref,
    calculatorHref,
    compareHref,
    primaryCta: profile?.primaryCta ?? {
      href: xlsx?.href ?? `/resources/${resource.slug}.xlsx`,
      label: xlsx?.label ?? "Download Excel",
    },
    secondaryCta: profile?.secondaryCta ?? {
      href: pdf?.href ?? `/resources/${resource.slug}.pdf`,
      label: pdf?.label ?? "Download PDF",
    },
    previewHref: "#preview",
    navItems,
    categorySlug,
  };
}
