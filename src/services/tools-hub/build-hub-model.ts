/**
 * Tools hub (/tools/) — assemble public model from the tools registry + live engines.
 * Previews use real recommendCrm / recommendSalesIntelligence / compareProductCosts when data exists.
 * Optional categorySlug scopes hero, featured tools, intents, and previews (nav Tools → Category).
 */

import { getCategoryBySlug, getSoftwareBySlug } from "@/data";
import {
  TOOLS_REGISTRY,
  type ToolDefinition,
  type ToolStatus,
  type ToolType,
} from "@/data/config/tools/registry";
import {
  CATEGORY_TOOL_META,
  isNewToolCategorySlug,
} from "@/data/config/tools/category-tool-meta";
import { crmFinderConfig } from "@/data/config/recommendation/crm-finder-v1";
import { siFinderConfig } from "@/data/config/recommendation/si-finder-v1";
import {
  getCrmFinderSnapshots,
  getSiFinderSnapshots,
} from "@/data/recommendation/load-snapshots";
import { formatMoney } from "@/domain/money";
import {
  crmRequirementsFromCalculatorInput,
  type CrmFinderAnswers,
} from "@/domain";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import {
  normalizeCrmFinderAnswers,
  normalizeSiFinderAnswers,
  recommendCrm,
  recommendSalesIntelligence,
} from "@/services/recommendation";
import { compareProductCosts } from "@/services/pricing/compare";
import {
  listCrmPricingSnapshots,
  listPricingSnapshotsForCategory,
  listSalesIntelligencePricingSnapshots,
} from "@/services/pricing/server";

export type ToolsHubOptions = {
  /** When set, hub hero/featured/intents focus on this category. */
  categorySlug?: string | null;
};

export type ToolsHubMatch = {
  slug: string;
  name: string;
  matchScore: number;
  logoSrc?: string | null;
};

export type ToolsHubDecisionPreview = {
  /** True when scores come from recommendCrm. */
  isLiveSample: boolean;
  caption: string;
  requirements: Array<{ label: string; value: string }>;
  matches: ToolsHubMatch[];
};

export type ToolsHubCalculatorPreview = {
  isLiveSample: boolean;
  teamSize: number;
  billing: "monthly" | "annual";
  /** Formatted only when a calculated estimate exists. */
  estimatedLabel: string | null;
  productName?: string;
};

export type ToolsHubStackSlot = {
  categoryLabel: string;
  value: string | null;
  placeholder: string;
};

export type ToolsHubIntent = {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: ToolDefinition["icon"];
  tone: "blue" | "emerald" | "violet" | "sky";
};

export type ToolsHubToolCard = ToolDefinition & {
  isInteractive: boolean;
  statusLabel: string;
  /** Primary badge label (active hub category when scoped). */
  categoryLabel: string | null;
  /** All category names for multi-category tools (e.g. Stack Builder). */
  categoryLabels: string[];
  previewKind:
    | "finder"
    | "calculator"
    | "stack"
    | "builder"
    | "scorecard"
    | "implementation"
    | "migration"
    | "generic-soon";
};

export type ToolsHubCategoryGroup = {
  categorySlug: string;
  categoryName: string;
  href: string;
  toolCount: number;
  tools: Array<{ id: string; name: string; href: string | null; status: ToolStatus }>;
};

export type ToolsHubDirectoryGroup = {
  type: ToolType | "planning";
  label: string;
  tools: Array<{
    id: string;
    name: string;
    href: string | null;
    status: ToolStatus;
    statusLabel: string;
  }>;
};

export type ToolsHubResearchPath = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export type ToolsHubModel = {
  indexable: boolean;
  /** Active category when hub is opened via Tools → Category. */
  activeCategory: { slug: string; name: string } | null;
  hero: {
    eyebrow: string;
    titleLead: string;
    titleAccent: string;
    description: string;
    exploreLabel: string;
  };
  primaryFinder: {
    href: string;
    label: string;
    exists: boolean;
  };
  browseSoftwareHref: string;
  decisionPreview: ToolsHubDecisionPreview;
  calculatorPreview: ToolsHubCalculatorPreview;
  stackSlots: ToolsHubStackSlot[];
  intents: ToolsHubIntent[];
  featuredTools: ToolsHubToolCard[];
  comingSoonTools: ToolsHubToolCard[];
  allTools: ToolsHubToolCard[];
  categoryGroups: ToolsHubCategoryGroup[];
  directory: ToolsHubDirectoryGroup[];
  researchPaths: ToolsHubResearchPath[];
  trustLinks: Array<{ label: string; href: string }>;
  noAccountRequired: boolean;
};

const SAMPLE_CRM_FINDER_ANSWERS: CrmFinderAnswers = {
  companySizeSlug: "small-business",
  crmUsers: 25,
  primaryUseCaseSlug: "pipeline-management",
  budgetBand: "30-60",
  budgetMode: "per-user-month",
  easePreference: "easy-setup",
};

const SAMPLE_SI_FINDER_ANSWERS: CrmFinderAnswers = {
  companySizeSlug: "small-business",
  crmUsers: 10,
  primaryUseCaseSlug: "prospecting",
  budgetBand: "30-60",
  budgetMode: "per-user-month",
  easePreference: "easy-setup",
};

function toolMatchesCategory(
  tool: ToolDefinition,
  categorySlug: string,
): boolean {
  return tool.categorySlugs.includes(categorySlug);
}

function statusLabel(status: ToolStatus): string {
  switch (status) {
    case "available":
      return "Available";
    case "partial":
      return "Available";
    case "coming-soon":
      return "Coming soon";
  }
}

function isInteractive(tool: ToolDefinition): boolean {
  return (
    Boolean(tool.href) &&
    (tool.status === "available" || tool.status === "partial")
  );
}

function previewKind(
  tool: ToolDefinition,
): ToolsHubToolCard["previewKind"] {
  if (tool.status === "coming-soon") {
    if (tool.type === "calculator") return "generic-soon";
    if (tool.type === "finder" && tool.categorySlugs.length === 0)
      return "generic-soon";
  }
  if (tool.type === "finder") return "finder";
  if (tool.type === "calculator") return "calculator";
  if (tool.type === "stack-builder") return "stack";
  if (tool.type === "builder") return "builder";
  if (tool.type === "scorecard") return "scorecard";
  if (tool.slug === "crm-implementation-planner") return "implementation";
  if (tool.slug === "crm-migration-planner") return "migration";
  if (tool.type === "planner") return "implementation";
  return "generic-soon";
}

function categoryNamesFor(tool: ToolDefinition): string[] {
  return tool.categorySlugs
    .map((slug) => getCategoryBySlug(slug)?.name)
    .filter((name): name is string => Boolean(name));
}

function toCard(
  tool: ToolDefinition,
  preferCategorySlug?: string | null,
): ToolsHubToolCard {
  const names = categoryNamesFor(tool);
  const preferredName =
    preferCategorySlug && tool.categorySlugs.includes(preferCategorySlug)
      ? (getCategoryBySlug(preferCategorySlug)?.name ?? null)
      : null;
  // On a category-scoped hub, only surface that category — avoid "CRM" on SI pages.
  const categoryLabels = preferredName ? [preferredName] : names;
  return {
    ...tool,
    isInteractive: isInteractive(tool),
    statusLabel: statusLabel(tool.status),
    categoryLabel: preferredName ?? names[0] ?? null,
    categoryLabels,
    previewKind: previewKind(tool),
  };
}

function buildCrmDecisionPreview(): ToolsHubDecisionPreview {
  const requirements = [
    { label: "Team size", value: "11–50" },
    { label: "Primary goal", value: "Sales" },
    { label: "Budget", value: "€50/user" },
    { label: "Priority", value: "Automation" },
  ];

  try {
    const snapshots = getCrmFinderSnapshots();
    if (snapshots.length === 0) {
      return {
        isLiveSample: false,
        caption: "Illustrative CRM Finder preview",
        requirements,
        matches: [],
      };
    }
    const criteria = normalizeCrmFinderAnswers(
      SAMPLE_CRM_FINDER_ANSWERS,
      crmFinderConfig,
    );
    const { results } = recommendCrm(criteria, snapshots, crmFinderConfig);
    const matches = results.slice(0, 3).map((r) => {
      const software = getSoftwareBySlug(r.productSlug);
      return {
        slug: r.productSlug,
        name: r.name,
        matchScore: Math.round(r.matchScore),
        logoSrc: software?.logo?.src ?? null,
      };
    });

    if (matches.length === 0) {
      return {
        isLiveSample: false,
        caption: "Illustrative CRM Finder preview",
        requirements,
        matches: [],
      };
    }

    return {
      isLiveSample: true,
      caption: "Sample CRM Finder result for a mid-size sales team",
      requirements,
      matches,
    };
  } catch {
    return {
      isLiveSample: false,
      caption: "Illustrative CRM Finder preview",
      requirements,
      matches: [],
    };
  }
}

function buildSiDecisionPreview(): ToolsHubDecisionPreview {
  const requirements = [
    { label: "Team size", value: "6–15" },
    { label: "Primary job", value: "Prospecting" },
    { label: "Budget", value: "€50/user" },
    { label: "Must-have", value: "CRM sync" },
  ];

  try {
    const snapshots = getSiFinderSnapshots();
    if (snapshots.length === 0) {
      return {
        isLiveSample: false,
        caption: "Illustrative Sales Intelligence Finder preview",
        requirements,
        matches: [],
      };
    }
    const criteria = normalizeSiFinderAnswers(
      SAMPLE_SI_FINDER_ANSWERS,
      siFinderConfig,
    );
    const { results } = recommendSalesIntelligence(
      criteria,
      snapshots,
      siFinderConfig,
    );
    const matches = results.slice(0, 3).map((r) => {
      const software = getSoftwareBySlug(r.productSlug);
      return {
        slug: r.productSlug,
        name: r.name,
        matchScore: Math.round(r.matchScore),
        logoSrc: software?.logo?.src ?? null,
      };
    });

    if (matches.length === 0) {
      return {
        isLiveSample: false,
        caption: "Illustrative Sales Intelligence Finder preview",
        requirements,
        matches: [],
      };
    }

    return {
      isLiveSample: true,
      caption:
        "Sample Sales Intelligence Finder result for a prospecting team",
      requirements,
      matches,
    };
  } catch {
    return {
      isLiveSample: false,
      caption: "Illustrative Sales Intelligence Finder preview",
      requirements,
      matches: [],
    };
  }
}

function buildDecisionPreview(
  categorySlug: string | null,
): ToolsHubDecisionPreview {
  if (categorySlug === "sales-intelligence") {
    return buildSiDecisionPreview();
  }
  if (!categorySlug || categorySlug === "crm") {
    return buildCrmDecisionPreview();
  }
  const name = getCategoryBySlug(categorySlug)?.name ?? "software";
  return {
    isLiveSample: false,
    caption: `Illustrative ${name} Finder preview`,
    requirements: [
      { label: "Team size", value: "11–50" },
      { label: "Primary job", value: "Core workflow" },
      { label: "Budget", value: "€50/user" },
      { label: "Priority", value: "Must-haves" },
    ],
    matches: [],
  };
}

function buildCalculatorPreview(
  categorySlug: string | null,
): ToolsHubCalculatorPreview {
  const teamSize = categorySlug === "sales-intelligence" ? 10 : 25;
  const billing = "monthly" as const;
  try {
    const snapshots =
      categorySlug === "sales-intelligence"
        ? listSalesIntelligencePricingSnapshots()
        : categorySlug && categorySlug !== "crm"
          ? listPricingSnapshotsForCategory(categorySlug)
          : listCrmPricingSnapshots();
    if (snapshots.length === 0) {
      return {
        isLiveSample: false,
        teamSize,
        billing,
        estimatedLabel: null,
      };
    }
    const requirements = crmRequirementsFromCalculatorInput({
      crmUsers: teamSize,
      billingPreference: billing,
    });
    const comparison = compareProductCosts(snapshots, requirements, {
      sortMode: "lowest-cost",
    });
    const calculated = comparison.results.find(
      (r) => r.status === "calculated" && r.monthlyEquivalent,
    );
    if (!calculated?.monthlyEquivalent) {
      return {
        isLiveSample: false,
        teamSize,
        billing,
        estimatedLabel: null,
      };
    }
    return {
      isLiveSample: true,
      teamSize,
      billing,
      estimatedLabel: `${formatMoney(calculated.monthlyEquivalent, {
        maximumFractionDigits: 0,
      })} / month`,
      productName: calculated.productName,
    };
  } catch {
    return {
      isLiveSample: false,
      teamSize,
      billing,
      estimatedLabel: null,
    };
  }
}

function buildIntents(
  categorySlug: string | null,
  primaryFinderHref: string,
): ToolsHubIntent[] {
  const calculator = categorySlug
    ? TOOLS_REGISTRY.find((t) => t.id === `${categorySlug}-cost-calculator`) ??
      (categorySlug === "crm"
        ? TOOLS_REGISTRY.find((t) => t.id === "crm-cost-calculator")
        : null)
    : TOOLS_REGISTRY.find((t) => t.id === "crm-cost-calculator");
  const stack = TOOLS_REGISTRY.find((t) => t.id === "software-stack-builder");
  const compareHref =
    categorySlug != null
      ? `/compare/?category=${encodeURIComponent(categorySlug)}#published-comparisons`
      : "/compare/";
  const noun =
    categorySlug === "sales-intelligence"
      ? "sales intelligence"
      : categorySlug === "crm"
        ? "CRM"
        : getCategoryBySlug(categorySlug ?? "")?.name ?? "software";

  return [
    {
      id: "find",
      title: `Find ${noun}`,
      description:
        categorySlug === "sales-intelligence"
          ? "Answer a few questions and get prospecting and enrichment tools matched to your outbound job."
          : "Answer a few questions and get software recommendations matched to your requirements.",
      cta: categorySlug === "sales-intelligence" ? "Find SI tools" : "Find software",
      href: primaryFinderHref,
      icon: "sparkles",
      tone: "blue",
    },
    {
      id: "estimate",
      title: "Estimate costs",
      description:
        categorySlug === "sales-intelligence"
          ? "Estimate seat costs where verified — credits and custom quotes stay quote-required."
          : "Calculate what different software options could cost your team.",
      cta: "Calculate costs",
      href:
        calculator?.href ??
        (categorySlug
          ? `/tools/${categorySlug}-cost-calculator/`
          : "/tools/crm-cost-calculator/"),
      icon: "calculator",
      tone: "emerald",
    },
    {
      id: "compare",
      title: "Compare software",
      description:
        "Compare products side-by-side across features, pricing and fit.",
      cta: "Compare software",
      href: compareHref,
      icon: "compare",
      tone: "violet",
    },
    {
      id: "stack",
      title: "Build my stack",
      description:
        "Plan the combination of tools your business actually needs.",
      cta: "Build my stack",
      href: stack?.href ?? "/tools/software-stack-builder/",
      icon: "stack",
      tone: "sky",
    },
  ];
}

function buildResearchPaths(categorySlug: string | null): ToolsHubResearchPath[] {
  if (categorySlug === "sales-intelligence") {
    return [
      {
        id: "reviews",
        eyebrow: "Reviews",
        title: "Sales intelligence reviews",
        description:
          "Understand data coverage, credits, CRM sync and outbound fit.",
        href: "/categories/sales-intelligence/",
        cta: "Browse SI products",
      },
      {
        id: "compare",
        eyebrow: "Compare",
        title: "SI comparisons",
        description: "Put shortlisted sales intelligence tools side-by-side.",
        href: "/compare/?category=sales-intelligence#published-comparisons",
        cta: "Compare SI tools",
      },
      {
        id: "best",
        eyebrow: "Best software",
        title: "Best sales intelligence",
        description: "See category rankings and methodology.",
        href: "/best/sales-intelligence-software/",
        cta: "Best SI software",
      },
      {
        id: "guides",
        eyebrow: "Guides",
        title: "How to choose SI",
        description:
          "Primary job, coverage tests, credits, and CRM sync checklist.",
        href: "/guides/how-to-choose-sales-intelligence/",
        cta: "Read the guide",
      },
    ];
  }

  if (categorySlug === "crm") {
    return [
      {
        id: "reviews",
        eyebrow: "Reviews",
        title: "CRM reviews",
        description:
          "Understand strengths, weaknesses, pricing and use cases.",
        href: "/categories/crm/",
        cta: "Browse CRM products",
      },
      {
        id: "compare",
        eyebrow: "Compare",
        title: "CRM comparisons",
        description: "Put shortlisted CRMs side-by-side.",
        href: "/compare/?category=crm#published-comparisons",
        cta: "Compare CRMs",
      },
      {
        id: "best",
        eyebrow: "Best software",
        title: "Best CRM software",
        description: "See category rankings and methodology.",
        href: "/best/crm-software/",
        cta: "Best CRM",
      },
      {
        id: "resources",
        eyebrow: "Resources",
        title: "CRM checklists & templates",
        description:
          "Download evaluation, implementation, and migration artifacts.",
        href: "/resources/",
        cta: "Browse resources",
      },
    ];
  }

  if (categorySlug && isNewToolCategorySlug(categorySlug)) {
    const meta = CATEGORY_TOOL_META[categorySlug];
    const name = getCategoryBySlug(categorySlug)?.name ?? meta.shortName;
    return [
      {
        id: "reviews",
        eyebrow: "Reviews",
        title: `${name} reviews`,
        description: `Understand strengths, weaknesses, pricing and ${meta.jobSummary}.`,
        href: `/categories/${categorySlug}/`,
        cta: `Browse ${meta.shortName} products`,
      },
      {
        id: "compare",
        eyebrow: "Compare",
        title: `${meta.shortName} comparisons`,
        description: `Put shortlisted ${meta.softwarePhrase} side-by-side.`,
        href: `/compare/?category=${encodeURIComponent(categorySlug)}#published-comparisons`,
        cta: `Compare ${meta.shortName}`,
      },
      {
        id: "best",
        eyebrow: "Best software",
        title: `Best ${meta.softwarePhrase}`,
        description: "See category rankings and methodology.",
        href: `/best/${meta.bestSlug}/`,
        cta: `Best ${meta.shortName}`,
      },
      {
        id: "guides",
        eyebrow: "Guides",
        title: `How to choose ${meta.shortName}`,
        description: `Primary job, must-haves, and evaluation checklist for ${meta.softwarePhrase}.`,
        href: `/categories/${categorySlug}/`,
        cta: "Open category hub",
      },
    ];
  }

  return [
    {
      id: "reviews",
      eyebrow: "Reviews",
      title: "Software reviews",
      description:
        "Understand strengths, weaknesses, pricing and use cases.",
      href: "/software/",
      cta: "Browse reviews",
    },
    {
      id: "compare",
      eyebrow: "Compare",
      title: "Side-by-side comparisons",
      description: "Put shortlisted software side-by-side.",
      href: "/compare/",
      cta: "Compare software",
    },
    {
      id: "best",
      eyebrow: "Best software",
      title: "Category rankings",
      description: "See our category rankings and methodology.",
      href: "/best/",
      cta: "Best software",
    },
    {
      id: "resources",
      eyebrow: "Resources",
      title: "CRM checklists & templates",
      description:
        "Download evaluation, implementation, and migration artifacts.",
      href: "/resources/",
      cta: "Browse resources",
    },
  ];
}

function buildHero(
  categorySlug: string | null,
  categoryName: string | null,
): ToolsHubModel["hero"] {
  if (categorySlug === "sales-intelligence") {
    return {
      eyebrow: "Sales intelligence tools",
      titleLead: "Choose sales intelligence",
      titleAccent: "with clearer evidence.",
      description:
        "Finders, requirements builders, scorecards and cost tools built for contact data, enrichment and outbound — not CRM substitutes.",
      exploreLabel: "Explore SI tools",
    };
  }
  if (categorySlug === "crm") {
    return {
      eyebrow: "CRM decision tools",
      titleLead: "Find the right CRM.",
      titleAccent: "Without the guesswork.",
      description:
        "Use finders, cost calculators and planning tools matched to how your sales team actually works.",
      exploreLabel: "Explore CRM tools",
    };
  }
  if (categorySlug && categoryName) {
    return {
      eyebrow: `${categoryName} tools`,
      titleLead: `Tools for ${categoryName}.`,
      titleAccent: "Matched to this category.",
      description: `Interactive finders, calculators and planners scoped to ${categoryName}.`,
      exploreLabel: `Explore ${categoryName} tools`,
    };
  }
  return {
    eyebrow: "Software decision tools",
    titleLead: "Find the right software.",
    titleAccent: "Without the guesswork.",
    description:
      "Use our interactive tools to compare software, estimate costs, build your software stack and get recommendations based on what your business actually needs.",
    exploreLabel: "Explore All Tools",
  };
}

function buildCategoryGroups(
  tools: ToolDefinition[],
): ToolsHubCategoryGroup[] {
  const byCategory = new Map<string, ToolDefinition[]>();
  for (const tool of tools) {
    if (!isInteractive(tool)) continue;
    for (const slug of tool.categorySlugs) {
      const list = byCategory.get(slug) ?? [];
      list.push(tool);
      byCategory.set(slug, list);
    }
  }

  return [...byCategory.entries()]
    .map(([categorySlug, categoryTools]) => {
      const category = getCategoryBySlug(categorySlug);
      if (!category) return null;
      return {
        categorySlug,
        categoryName: category.name,
        href: `/categories/${categorySlug}/`,
        toolCount: categoryTools.length,
        tools: categoryTools.map((t) => ({
          id: t.id,
          name: t.name,
          href: t.href,
          status: t.status,
        })),
      };
    })
    .filter((g): g is ToolsHubCategoryGroup => Boolean(g))
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName));
}

function buildDirectory(tools: ToolDefinition[]): ToolsHubDirectoryGroup[] {
  const groups: Array<{
    type: ToolsHubDirectoryGroup["type"];
    label: string;
    match: (t: ToolDefinition) => boolean;
  }> = [
    { type: "finder", label: "Finders", match: (t) => t.type === "finder" },
    {
      type: "calculator",
      label: "Calculators",
      match: (t) => t.type === "calculator",
    },
    {
      type: "planning",
      label: "Planning",
      match: (t) => t.type === "stack-builder",
    },
  ];

  return groups
    .map((g) => ({
      type: g.type,
      label: g.label,
      tools: tools.filter(g.match).map((t) => ({
        id: t.id,
        name: t.name,
        href: isInteractive(t) ? t.href : t.href,
        status: t.status,
        statusLabel: statusLabel(t.status),
      })),
    }))
    .filter((g) => g.tools.length > 0);
}

export function buildToolsHubModel(
  options: ToolsHubOptions = {},
): ToolsHubModel {
  const requested = options.categorySlug?.trim() || null;
  const category =
    requested && getCategoryBySlug(requested) ? getCategoryBySlug(requested) : null;
  const categorySlug = category?.slug ?? null;
  const categoryName = category?.name ?? null;

  const scopedDefs = categorySlug
    ? TOOLS_REGISTRY.filter((t) => toolMatchesCategory(t, categorySlug))
    : TOOLS_REGISTRY;
  const cards = TOOLS_REGISTRY.map((t) => toCard(t, categorySlug));
  const scopedCards = categorySlug
    ? cards.filter((t) => toolMatchesCategory(t, categorySlug))
    : cards;

  const featuredTools = (
    categorySlug ? scopedCards : cards
  ).filter((t) =>
    categorySlug
      ? t.featured
      : t.featured &&
        (t.categorySlugs.length !== 1 ||
          t.categorySlugs[0] === "crm" ||
          t.categorySlugs[0] === "sales-intelligence"),
  );
  const comingSoonTools = (
    categorySlug ? scopedCards : cards
  ).filter((t) => t.status === "coming-soon");

  const primary =
    (categorySlug
      ? TOOLS_REGISTRY.find(
          (t) =>
            t.type === "finder" &&
            t.status === "available" &&
            t.href &&
            t.categorySlugs.length === 1 &&
            toolMatchesCategory(t, categorySlug),
        ) ??
        TOOLS_REGISTRY.find(
          (t) =>
            t.type === "finder" &&
            t.status === "available" &&
            t.href &&
            toolMatchesCategory(t, categorySlug),
        )
      : null) ??
    TOOLS_REGISTRY.find((t) => t.id === "crm-finder" && t.href) ??
    TOOLS_REGISTRY.find((t) => t.type === "finder" && t.status === "available");

  const primaryFinder = {
    href: primary?.href ?? "/tools/crm-finder/",
    label: primary?.primaryCta ?? "Find My CRM",
    exists: Boolean(primary?.href),
  };

  const decisionPreview = buildDecisionPreview(categorySlug);
  const sampleLeadName = decisionPreview.matches[0]?.name ?? null;

  const categoryGroups = buildCategoryGroups(TOOLS_REGISTRY);
  const scopedCategoryGroups = categorySlug
    ? categoryGroups.filter((g) => g.categorySlug === categorySlug)
    : categoryGroups;

  return {
    indexable: true,
    activeCategory: categorySlug
      ? { slug: categorySlug, name: categoryName ?? categorySlug }
      : null,
    hero: buildHero(categorySlug, categoryName),
    primaryFinder,
    browseSoftwareHref: categorySlug
      ? `/categories/${categorySlug}/`
      : "/software/",
    decisionPreview,
    calculatorPreview: buildCalculatorPreview(categorySlug),
    stackSlots: [
      {
        categoryLabel: "CRM",
        value: categorySlug === "crm" ? sampleLeadName : null,
        placeholder: "+ Add",
      },
      {
        categoryLabel: "Sales intelligence",
        value:
          categorySlug === "sales-intelligence" ? sampleLeadName : null,
        placeholder: "+ Add",
      },
      {
        categoryLabel: "Email marketing",
        value: null,
        placeholder: "+ Add",
      },
      {
        categoryLabel: "Project management",
        value: null,
        placeholder: "+ Add",
      },
      {
        categoryLabel: "Customer support",
        value: null,
        placeholder: "+ Add",
      },
    ],
    intents: buildIntents(categorySlug, primaryFinder.href),
    featuredTools,
    comingSoonTools,
    allTools: cards,
    categoryGroups: scopedCategoryGroups,
    directory: buildDirectory(categorySlug ? scopedDefs : TOOLS_REGISTRY),
    researchPaths: buildResearchPaths(categorySlug),
    trustLinks: [
      { label: "How we review", href: COMPANY_ROUTES.howWeReview },
      { label: "Our methodology", href: COMPANY_ROUTES.methodology },
      {
        label: "Affiliate disclosure",
        href: LEGAL_ROUTES.affiliateDisclosure,
      },
    ],
    noAccountRequired: true,
  };
}
