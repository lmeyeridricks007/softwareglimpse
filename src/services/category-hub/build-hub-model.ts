import type {
  BestPage,
  Capability,
  Category,
  CategoryHubExplorePath,
  CategoryHubGlance,
  CategoryHubProfile,
  CategoryHubType,
  Comparison,
  CurrencyCode,
  Industry,
  Software,
  UseCase,
} from "@/domain";
import { formatMoney, fromMajor } from "@/domain";
import { isPubliclyAvailable } from "@/domain/publishing";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  getAllAudiencesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllIndustriesUnfiltered,
  getCapabilities,
  getChildCategoriesIncludingSupported,
  getPrimarySoftwareByCategory,
  getResources,
  getSoftwareByCategory,
  getSoftwareBySlug,
  getUseCases,
} from "@/data";
import { categoryDecisionFinderHref } from "@/data/config/tools/category-tool-meta";
import { getRoutableTools } from "@/data/config/tools/registry";
import {
  getGuidesByCategory,
} from "@/data/repositories/guides";
import {
  loadAssessment,
  loadReview,
} from "@/data/editorial/store";
import { getCategoryHubProfile } from "@/data/category-hub";
import { getCategoryDefinitionSeed } from "@/data/category-onboarding/seed";
import { loadActivatedCategory } from "@/data/category-onboarding/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";
import {
  getFeatureDetailProfile,
  resolveFeatureDetailHref,
} from "@/data/feature-detail";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { firstPublicCopy, publicCopy } from "./public-copy";

export type CategoryHubNavItem = {
  id: string;
  label: string;
  icon?: string;
  href?: string;
};

export type CategoryHubProductCard = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  positioning: string | null;
  bestFor: string | null;
  strengths: string[];
  pricingTeaser: string | null;
  pricingVerifiedAt: string | null;
  /** Approved assessment overall score (0–10) when available. */
  overallScore: number | null;
  /** Latest review / assessment / verification timestamp (ISO). */
  updatedAt: string | null;
  /** True when product is an approved Best-page recommendation. */
  isBestPick: boolean;
  reviewHref: string;
  compareHref: string;
};

export type CategoryHubBestPreviewItem = {
  rank: number;
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  bestFor: string | null;
  badge: string | null;
};

export type CategoryHubModel = {
  category: Category;
  profile: CategoryHubProfile | null;
  displayName: string;
  tagline: string;
  definition: string;
  shortLabel: string;
  /** Resolved for every category — profile overrides when present. */
  explorePaths: CategoryHubExplorePath[];
  decisionCriteria: string[];
  popularNeeds: string[];
  chooseGuideHref: string | null;
  types: CategoryHubType[];
  glance: CategoryHubGlance | null;
  finderHref: string | null;
  finderExample: CategoryHubProfile["finderExample"] | null;
  buyingFramework: CategoryHubProfile["buyingFramework"];
  buyingGuideHref: string | null;
  pricingModel: CategoryHubProfile["pricingModel"] | null;
  faq: CategoryHubProfile["faq"];
  primaryProducts: Software[];
  productCards: CategoryHubProductCard[];
  logoStrip: Array<{
    slug: string;
    name: string;
    logo?: { src: string; alt: string } | null;
  }>;
  rankingsApproved: boolean;
  bestPreview: CategoryHubBestPreviewItem[];
  bestPage: BestPage | null;
  bestHref: string | null;
  /** Full catalogue index for this category (all primary products). */
  catalogueHref: string;
  comparisons: Array<{
    href: string;
    title: string;
    products: Array<{
      name: string;
      slug: string;
      logo?: { src: string; alt: string } | null;
      bestFor: string | null;
    }>;
    criteria: string[];
  }>;
  useCases: Array<{
    slug: string;
    name: string;
    description: string | null;
    href: string;
    productCount: number;
  }>;
  capabilities: Array<{
    slug: string;
    name: string;
    description: string | null;
    href: string;
  }>;
  resources: Array<{
    slug: string;
    name: string;
    description: string | null;
    href: string;
    kind: string;
    stage: string;
  }>;
  industries: Array<{
    slug: string;
    name: string;
    description: string | null;
    href: string;
  }>;
  businessTypes: Array<{
    slug: string;
    name: string;
    description: string | null;
    href: string;
  }>;
  guides: Array<{
    href: string;
    title: string;
    summary: string | null;
    topicType: string;
  }>;
  features: Array<{
    slug: string;
    name: string;
    description: string;
    href?: string;
  }>;
  methodologyCriteria: string[];
  methodologyHref: string;
  stats: Array<{
    label: string;
    href?: string;
    icon?: "products" | "updated" | "independent" | "methodology";
  }>;
  reviews: Array<{
    href: string;
    name: string;
    logo?: { src: string; alt: string } | null;
    bestFor: string | null;
    dateLabel?: string;
    categoryLabel: string;
  }>;
  verifiedStartingPrices: Array<{
    slug: string;
    name: string;
    teaser: string;
    verifiedAt: string | null;
  }>;
  featureMatrix: {
    products: Array<{ slug: string; name: string }>;
    rows: Array<{
      featureSlug: string;
      featureName: string;
      cells: Array<"yes" | "no" | "unknown">;
    }>;
  } | null;
  navItems: CategoryHubNavItem[];
  lastUpdated: string | null;
  decisionTools: Array<{
    slug: string;
    name: string;
    description: string;
    href: string;
  }>;
};

function pricingTeaser(software: Software): string | null {
  const pricing = software.pricing;
  if (!pricing || pricing.startingPriceMonthly == null) return null;
  if (!software.pricingVerifiedAt) return null;
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  return `From ${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/user/mo`;
}

function positioningFromSoftware(software: Software): string | null {
  const useCase = software.useCaseSlugs[0];
  if (!useCase) return null;
  const labels: Record<string, string> = {
    "pipeline-management": "Pipeline",
    "lead-management": "Lead gen",
    "sales-automation": "Automation",
    "relationship-management": "Relationships",
    "contact-management": "Contacts",
    "sales-engagement": "Engagement",
    "email-outreach": "Outreach",
  };
  return labels[useCase] ?? null;
}

function productStrengths(software: Software): string[] {
  const fromPros = software.pros
    .map((p) => publicCopy(p))
    .filter(Boolean) as string[];
  if (fromPros.length > 0) return fromPros.slice(0, 3);

  const assessment = loadAssessment(software.slug);
  return ((assessment?.strengths ?? [])
    .map((s) => publicCopy(s))
    .filter(Boolean) as string[]).slice(0, 3);
}

function productBestFor(software: Software): string | null {
  return firstPublicCopy([
    software.bestFor[0],
    loadAssessment(software.slug)?.bestFor?.[0],
    software.shortDescription,
  ]);
}

function shortCategoryLabel(category: Category, profileShortName?: string): string {
  if (profileShortName) return profileShortName;
  // Prefer the part before an ampersand / comma for CTAs and nav density.
  const clipped = category.name.split(/\s*[&,/]\s*/)[0]?.trim();
  if (clipped && clipped.length >= 2 && clipped.length < category.name.length) {
    return clipped;
  }
  return category.name;
}

const DEFAULT_DECISION_CRITERIA = [
  "Core workflow fit",
  "Ease of adoption",
  "Must-have features",
  "Integrations",
  "Reporting & visibility",
  "Total cost",
] as const;

const DEFAULT_BUYING_STEPS = [
  {
    step: 1,
    title: "Define the job to be done",
    description: "What must improve in the next 90 days?",
  },
  {
    step: 2,
    title: "List must-have features",
    description: "Only capabilities your team will use weekly.",
  },
  {
    step: 3,
    title: "Check integrations",
    description: "Tools your team already depends on.",
  },
  {
    step: 4,
    title: "Estimate total cost",
    description: "Seats, plan tiers, and required add-ons.",
  },
  {
    step: 5,
    title: "Evaluate usability",
    description: "Can non-admins complete daily work?",
  },
  {
    step: 6,
    title: "Trial with real work",
    description: "Test your actual workflows — not a vendor demo.",
  },
  {
    step: 7,
    title: "Plan for growth",
    description: "Permissions, reporting, and scale headroom.",
  },
] as const;

function defaultFaq(shortLabel: string): CategoryHubProfile["faq"] {
  return [
    {
      question: `What is ${shortLabel} software?`,
      answer: `${shortLabel} software helps teams run and improve core workflows in this category. The right tool matches your process, team size, and integrations — not a generic feature checklist.`,
    },
    {
      question: `Who needs ${shortLabel} software?`,
      answer: `Teams that outgrow spreadsheets, email threads, or disconnected tools for this workflow benefit most — especially when collaboration, visibility, and follow-through matter.`,
    },
    {
      question: `How do I choose ${shortLabel} software?`,
      answer: `Start from your process and must-have features, then check integrations, total cost, usability, and growth needs. Use Finder and comparisons to shortlist options from catalogue products.`,
    },
    {
      question: `How much does ${shortLabel} software cost?`,
      answer: `Pricing usually depends on seats, plan tiers, and add-ons. Prefer verified list prices and calculators when available — we do not invent market averages.`,
    },
  ];
}

function defaultPopularNeeds(shortLabel: string, categorySlug: string): string[] {
  const bySlug: Record<string, string[]> = {
    "project-management": [
      "Task tracking",
      "Team collaboration",
      "Simple boards",
      "Reporting",
    ],
    hr: ["Hiring", "Onboarding", "Workforce scheduling", "Training"],
    ai: ["Writing & content", "Automation", "Analysis", "Team productivity"],
    marketing: ["Campaigns", "Automation", "Analytics", "Lead nurturing"],
    "email-marketing": [
      "Newsletters",
      "Automation",
      "Segmentation",
      "Deliverability",
    ],
    "customer-service": [
      "Ticketing",
      "Shared inbox",
      "Knowledge base",
      "Live chat",
    ],
    "business-communications": [
      "Team messaging",
      "Calls",
      "Meetings",
      "Customer comms",
    ],
    ecommerce: ["Storefront", "Orders", "Inventory", "Checkout"],
    "it-development": ["Deployment", "Monitoring", "Collaboration", "CI/CD"],
    "sales-intelligence": [
      "Prospecting",
      "Contact data",
      "Enrichment",
      "Outreach",
    ],
  };
  return (
    bySlug[categorySlug] ?? [
      `Small teams`,
      `${shortLabel} basics`,
      "Easy setup",
      "Integrations",
    ]
  );
}

function compareHrefForProduct(slug: string, comparisons: Comparison[]): string {
  const hit = comparisons.find((c) => c.productSlugs.includes(slug));
  return hit ? `/compare/${hit.slug}/` : "/compare/";
}

function defaultExplorePaths(input: {
  shortLabel: string;
  bestHref: string | null;
  guides: Array<{ href: string }>;
  categorySlug: string;
}): CategoryHubExplorePath[] {
  const paths: CategoryHubExplorePath[] = [];

  if (input.bestHref) {
    paths.push({
      id: "best",
      title: `Best ${input.shortLabel}`,
      description: `See shortlists and how we evaluate ${input.shortLabel}.`,
      href: input.bestHref,
      ctaLabel: `View Best ${input.shortLabel}`,
      tone: "gold",
      icon: "star",
    });
  }

  const finderHref = categoryDecisionFinderHref(input.categorySlug);
  paths.push({
    id: "finder",
    title: `Find My ${input.shortLabel}`,
    description: "Answer a few questions for fit-based recommendations.",
    href: finderHref,
    ctaLabel: "Start Finder",
    tone: "green",
    icon: "target",
  });

  paths.push({
    id: "compare",
    title: `Compare ${input.shortLabel}`,
    description: `Compare ${input.shortLabel} products side by side on shared criteria.`,
    href: "/compare/",
    ctaLabel: `Compare ${input.shortLabel}`,
    tone: "violet",
    icon: "compare",
  });

  if (input.categorySlug === "crm") {
    paths.push({
      id: "calculator",
      title: `${input.shortLabel} Cost Calculator`,
      description: "Estimate subscription cost from verified list prices.",
      href: "/tools/crm-cost-calculator/",
      ctaLabel: "Calculate",
      tone: "blue",
      icon: "calculator",
    });
  }

  if (input.guides[0]) {
    paths.push({
      id: "guides",
      title: `${input.shortLabel} Guides`,
      description: `Learn how to choose and use ${input.shortLabel}.`,
      href: input.guides[0].href,
      ctaLabel: `Learn about ${input.shortLabel}`,
      tone: "pink",
      icon: "book",
    });
  }

  return paths;
}

/**
 * Prefer indexable destinations for primary explore CTAs.
 * Soft-published / gated pages remain reachable from deeper links.
 */
function sanitizeExplorePaths(
  paths: CategoryHubExplorePath[],
  input: {
    bestIndexable: boolean;
    indexableGuideHref: string | null;
    finderHref: string;
  },
): CategoryHubExplorePath[] {
  const hasFinder = paths.some(
    (p) => p.id === "finder" || p.href === input.finderHref,
  );

  return paths.flatMap((path) => {
    if (path.id === "guides" && input.indexableGuideHref) {
      return [{ ...path, href: input.indexableGuideHref }];
    }
    if (path.id === "best" && !input.bestIndexable) {
      // Drop noindex Best CTA when Finder (or equivalent) is already present.
      if (hasFinder) return [];
      return [
        {
          ...path,
          id: "shortlist",
          title: path.title.replace(/^Best\s+/i, "Shortlist "),
          description:
            "Get a fit-based shortlist from requirements — not affiliate rankings.",
          href: input.finderHref,
          ctaLabel: "Start Finder",
          tone: path.tone ?? "green",
          icon: "target",
        },
      ];
    }
    return [path];
  });
}

function defaultTypesFromChildren(
  categorySlug: string,
  shortLabel: string,
): CategoryHubType[] {
  return getChildCategoriesIncludingSupported(categorySlug)
    .slice(0, 6)
    .map((child) => ({
      id: child.slug,
      name: child.name,
      description:
        child.shortDescription ??
        `${child.name} options within ${shortLabel}.`,
      icon: "layers",
      href: isPubliclyAvailable(child.metadata)
        ? `/categories/${child.path.join("/")}/`
        : undefined,
      ctaLabel: isPubliclyAvailable(child.metadata)
        ? `Explore ${child.name}`
        : undefined,
    }));
}

function defaultTypesFromScope(
  includes: Array<{ id: string; label: string }>,
  shortLabel: string,
): CategoryHubType[] {
  return includes.slice(0, 6).map((item) => ({
    id: item.id,
    name: item.label,
    description: `${item.label} within the ${shortLabel} category.`,
    icon: "layers",
  }));
}

export function buildCategoryHubModel(category: Category): CategoryHubModel {
  const profile = getCategoryHubProfile(category.slug);
  const definition =
    loadActivatedCategory(category.slug)?.definition ??
    getCategoryDefinitionSeed(category.slug);

  const shortLabel = shortCategoryLabel(category, profile?.shortName);
  // Subcategory hubs (e.g. sales-crm) tag products via subcategorySlugs while
  // primaryCategorySlug stays on the parent (crm). Include adjacent membership
  // so those hubs are not empty grids.
  const catalogueProducts = category.parentSlug
    ? getSoftwareByCategory(category.slug, { membership: "all" })
    : getPrimarySoftwareByCategory(category.slug);
  const primaryProducts = [...catalogueProducts].sort(
    (a, b) => {
      const assessmentA = loadAssessment(a.slug);
      const assessmentB = loadAssessment(b.slug);
      const scoreA =
        assessmentA?.status === "approved" ? (assessmentA.overallScore ?? 0) : 0;
      const scoreB =
        assessmentB?.status === "approved" ? (assessmentB.overallScore ?? 0) : 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.name.localeCompare(b.name);
    },
  );

  const allCategoryComparisons = getAllComparisonsUnfiltered().filter(
    (item) =>
      item.categorySlug === category.slug &&
      (isPubliclyAvailable(item.metadata) ||
        item.outcomes.length > 0 ||
        item.metadata.researchStatus !== "none"),
  );

  const bestPages = getAllBestPagesUnfiltered().filter(
    (item) => item.categorySlug === category.slug,
  );
  const bestPage =
    bestPages.find((p) => isPubliclyAvailable(p.metadata)) ??
    bestPages[0] ??
    null;
  const rankingsApproved =
    bestPage?.editorialStatus === "approved" &&
    bestPage.recommendations.some((r) => r.approved);

  const displayName =
    profile?.displayName ?? `${shortLabel} Software`;

  const tagline =
    profile?.tagline ??
    category.shortDescription ??
    `Find ${shortLabel.toLowerCase()} software that fits your team and workflow.`;

  const definitionText =
    profile?.definition ??
    category.description ??
    definition?.scope.definition ??
    (category.shortDescription &&
    category.shortDescription.trim() !== tagline.trim()
      ? category.shortDescription
      : `${shortLabel} software helps teams choose tools that fit their process, team size, and budget — without relying on affiliate rankings.`);

  // Full primary catalogue — do not hard-cap; buyers need every researched
  // product discoverable from the category hub (Best page remains the ranked shortlist).
  // The UI paginates / filters this list client-side.
  const bestPickSlugs = new Set(
    (bestPage?.recommendations ?? [])
      .filter((r) => r.approved)
      .map((r) => r.productSlug),
  );

  const productCards: CategoryHubProductCard[] = primaryProducts.map(
    (product) => {
      const assessment = loadAssessment(product.slug);
      const review = loadReview(product.slug);
      const overallScore =
        assessment?.status === "approved"
          ? (assessment.overallScore ?? null)
          : null;
      const updatedAt =
        review?.lastUpdatedAt ??
        assessment?.updatedAt ??
        product.lastVerifiedAt ??
        product.metadata.updatedAt ??
        null;
      return {
        slug: product.slug,
        name: product.name,
        logo: product.logo,
        positioning: positioningFromSoftware(product),
        bestFor: productBestFor(product),
        strengths: productStrengths(product),
        pricingTeaser: pricingTeaser(product),
        pricingVerifiedAt: product.pricingVerifiedAt ?? null,
        overallScore,
        updatedAt,
        isBestPick: bestPickSlugs.has(product.slug),
        reviewHref: `/software/${product.slug}/`,
        compareHref: compareHrefForProduct(product.slug, allCategoryComparisons),
      };
    },
  );

  // Logo strip stays a compact “popular” preview (top by assessment score).
  const logoStrip = primaryProducts.slice(0, 16).map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
  }));

  const bestPreview: CategoryHubBestPreviewItem[] = rankingsApproved
    ? (bestPage?.recommendations ?? [])
        .filter((r) => r.approved)
        .slice(0, 3)
        .map((rec, index) => {
          const product = getSoftwareBySlug(rec.productSlug);
          return {
            rank: rec.rank ?? index + 1,
            slug: rec.productSlug,
            name: product?.name ?? rec.productSlug,
            logo: product?.logo,
            bestFor: firstPublicCopy([
              rec.scenarios[0],
              product?.bestFor[0],
              publicCopy(rec.rationale),
            ]),
            badge: publicCopy(rec.badge ?? rec.recommendationLabel),
          };
        })
    : [];

  const comparisons = allCategoryComparisons.slice(0, 6).map((comparison) => {
    const products = comparison.productSlugs.map((slug) => {
      const product = getSoftwareBySlug(slug);
      return {
        name: product?.name ?? slug,
        slug,
        logo: product?.logo,
        bestFor: product ? productBestFor(product) : null,
      };
    });
    return {
      href: `/compare/${comparison.slug}/`,
      title: comparison.title,
      products,
      criteria: comparison.criterionSlugs.slice(0, 5),
    };
  });

  const useCases = getUseCases()
    .filter((uc: UseCase) => uc.categorySlugs.includes(category.slug))
    .map((uc) => ({
      slug: uc.slug,
      name: `${shortLabel} for ${uc.name.toLowerCase()}`,
      description: uc.shortDescription ?? null,
      href: `/use-cases/${uc.slug}/`,
      productCount: primaryProducts.filter((p) =>
        p.useCaseSlugs.includes(uc.slug),
      ).length,
    }));

  const capabilities = getCapabilities()
    .filter((cap: Capability) => cap.categorySlugs.includes(category.slug))
    .map((cap) => ({
      slug: cap.slug,
      name: cap.name,
      description: cap.shortDescription ?? null,
      href: `/capabilities/${cap.slug}/`,
    }));

  const resources =
    category.slug === "crm"
      ? getResources()
          .filter((r) => r.categorySlugs.includes("crm"))
          .map((r) => ({
            slug: r.slug,
            name: r.name,
            description: r.shortDescription ?? null,
            href: r.seo.canonicalPath || `/resources/${r.slug}/`,
            kind: r.kind,
            stage: r.stage,
          }))
      : [];

  const industries = getAllIndustriesUnfiltered()
    .filter((ind: Industry) => isPubliclyAvailable(ind.metadata))
    .sort((a, b) => {
      // Prefer editorially approved (indexable) hubs so new verticals surface on the CRM hub.
      const aIdx = a.seo.indexable === true ? 0 : 1;
      const bIdx = b.seo.indexable === true ? 0 : 1;
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 12)
    .map((ind) => ({
      slug: ind.slug,
      name: `${shortLabel} for ${ind.name}`,
      description: ind.shortDescription ?? null,
      href: `/industries/${ind.slug}/`,
    }));

  const businessTypes = getAllAudiencesUnfiltered()
    .map((audience) => ({
      slug: audience.slug,
      name: `${shortLabel} for ${audience.name}`,
      description: audience.shortDescription ?? null,
      href: audience.seo.canonicalPath || `/for/${audience.slug}/`,
      sortHint:
        audience.slug === "small-business"
          ? 0
          : audience.slug === "startups"
            ? 1
            : audience.slug === "sales-teams"
              ? 2
              : audience.slug === "agencies"
                ? 3
                : 10,
    }))
    .sort((a, b) => a.sortHint - b.sortHint)
    .slice(0, 8)
    .map(({ slug, name, description, href }) => ({
      slug,
      name,
      description,
      href,
    }));

  const guides = getGuidesByCategory(category.slug)
    .filter((g) => isPubliclyAvailable(g.metadata))
    .map((g) => ({
      href: `/guides/${g.slug}/`,
      title: g.title,
      summary: publicCopy(g.summary),
      topicType: g.topicType,
      indexable: isEntityIndexable({ kind: "guide", entity: g }),
    }));

  const indexableGuideHref =
    guides.find((g) => g.indexable)?.href ??
    guides.find(
      (g) => g.topicType === "selection" || g.topicType === "buying-guide",
    )?.href ??
    guides[0]?.href ??
    null;

  const featuredSlugs = profile?.featuredFeatureSlugs?.length
    ? profile.featuredFeatureSlugs
    : (definition?.features ?? []).slice(0, 8).map((f) => f.slug);

  const features = featuredSlugs
    .map((slug) => {
      const fromDef = definition?.features.find((f) => f.slug === slug);
      const fromSeed = canonicalFeaturesSeed.find((f) => f.slug === slug);
      const featureProfile = getFeatureDetailProfile(slug);
      const name =
        featureProfile?.name ?? fromDef?.name ?? fromSeed?.name ?? null;
      if (!name) return null;
      const description =
        publicCopy(fromDef?.description) ??
        featureProfile?.tagline ??
        `${name} for ${shortLabel} buyers.`;
      const featureHref = resolveFeatureDetailHref(slug);
      const matchingUc = getUseCases().find((u) => u.slug === slug);
      return {
        slug: featureProfile?.slug ?? slug,
        name,
        description,
        href:
          featureHref ??
          (matchingUc ? `/use-cases/${matchingUc.slug}/` : undefined),
      };
    })
    .filter(Boolean) as CategoryHubModel["features"];

  const methodologyFromDefinition =
    definition?.editorialMethodology.criteria
      ?.slice()
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map((c) => c.name) ?? [];

  const methodologyCriteria =
    methodologyFromDefinition.length > 0
      ? methodologyFromDefinition
      : profile?.decisionCriteria?.length
        ? profile.decisionCriteria
        : [...DEFAULT_DECISION_CRITERIA];

  const decisionCriteria =
    profile?.decisionCriteria?.length
      ? profile.decisionCriteria
      : methodologyCriteria.slice(0, 6);

  const popularNeeds =
    profile?.popularNeeds?.length
      ? profile.popularNeeds
      : useCases.length > 0
        ? useCases
            .slice(0, 4)
            .map((uc) => uc.name.replace(`${shortLabel} for `, ""))
        : defaultPopularNeeds(shortLabel, category.slug);

  const chooseGuideHref =
    profile?.chooseGuideHref ??
    indexableGuideHref ??
    guides.find((g) => g.topicType === "selection" || g.topicType === "buying-guide")
      ?.href ??
    guides[0]?.href ??
    null;

  const bestHref = bestPage ? `/best/${bestPage.slug}/` : null;
  const catalogueHref = `/software/#${category.slug}`;
  const bestIndexable = Boolean(
    bestPage && isEntityIndexable({ kind: "best", entity: bestPage }),
  );
  const finderHref =
    profile?.finderHref ?? categoryDecisionFinderHref(category.slug);

  const rawExplorePaths =
    profile?.explorePaths?.length
      ? profile.explorePaths
      : defaultExplorePaths({
          shortLabel,
          bestHref,
          guides,
          categorySlug: category.slug,
        });

  const explorePaths = sanitizeExplorePaths(rawExplorePaths, {
    bestIndexable,
    indexableGuideHref: chooseGuideHref,
    finderHref,
  });

  const childTypes = defaultTypesFromChildren(category.slug, shortLabel);
  const scopeTypes = definition?.scope.includes?.length
    ? defaultTypesFromScope(definition.scope.includes, shortLabel)
    : [];
  const types =
    profile?.types?.length
      ? profile.types
      : childTypes.length > 0
        ? childTypes
        : scopeTypes;

  const glance: CategoryHubGlance | null = profile?.glance
    ? profile.glance
    : {
        whatItDoes:
          features.length > 0
            ? features.slice(0, 5).map((f) => f.name)
            : [
                `Centralizes ${shortLabel.toLowerCase()} work in one place`,
                "Improves visibility across the team",
                "Reduces manual follow-up and busywork",
                "Supports reporting on progress and outcomes",
              ],
        bestFor:
          popularNeeds.length > 0
            ? popularNeeds.slice(0, 5)
            : ["Growing teams", "Operators", "Managers", "Collaborative workflows"],
        typicalFeatures:
          features.length > 0
            ? features.slice(0, 8).map((f) => f.name)
            : [
                "Core workflow tools",
                "Collaboration",
                "Automation",
                "Integrations",
                "Reporting",
              ],
      };

  const finderExample = profile?.finderExample
    ? profile.finderExample
    : {
        requirements:
          popularNeeds.length > 0
            ? popularNeeds.slice(0, 4)
            : ["Small team", "Easy setup", "Core features", "Fair pricing"],
        matchSlugs: primaryProducts.slice(0, 3).map((p) => p.slug),
        disclaimer: "Example illustration — not a live Finder match.",
      };

  const buyingFramework =
    profile?.buyingFramework?.length
      ? profile.buyingFramework
      : DEFAULT_BUYING_STEPS.map((s) => ({ ...s }));
  const buyingGuideHref = profile?.buyingGuideHref ?? chooseGuideHref;
  const pricingModel = profile?.pricingModel ?? {
    summary: `${shortLabel} pricing usually depends on seats, plan tiers, and add-ons. Prefer verified list prices when available — we do not invent market averages.`,
    seatExamples: [],
    calculatorHref:
      category.slug === "crm" ? "/tools/crm-cost-calculator/" : undefined,
    guideHref: chooseGuideHref ?? undefined,
  };
  const faq = profile?.faq?.length ? profile.faq : defaultFaq(shortLabel);

  const lastUpdatedCandidates = [
    profile?.lastReviewedAt,
    category.metadata.updatedAt,
    category.metadata.publishedAt,
    ...primaryProducts.map((s) => s.lastVerifiedAt),
  ].filter(Boolean) as string[];
  const lastUpdated = lastUpdatedCandidates.sort().at(-1) ?? null;

  const stats: CategoryHubModel["stats"] = [
    {
      label: `${primaryProducts.length} ${shortLabel} ${
        primaryProducts.length === 1 ? "product" : "products"
      } covered`,
      icon: "products",
    },
    ...(lastUpdated
      ? [
          {
            label: `Updated ${lastUpdated.slice(0, 10)}`,
            icon: "updated" as const,
          },
        ]
      : []),
    {
      label: "Independent editorial process",
      icon: "independent",
      href: LEGAL_ROUTES.editorialIndependence,
    },
  ];

  const reviews = primaryProducts
    .map((s) => {
      const review = loadReview(s.slug);
      const assessment = loadAssessment(s.slug);
      const updatedAt =
        review?.lastUpdatedAt ??
        assessment?.updatedAt ??
        s.lastVerifiedAt ??
        null;
      return {
        href: `/software/${s.slug}/`,
        name: s.name,
        logo: s.logo,
        bestFor: productBestFor(s),
        dateLabel: updatedAt ? updatedAt.slice(0, 10) : undefined,
        categoryLabel: shortLabel,
        _sort: updatedAt ?? "",
      };
    })
    .filter((r) => r.bestFor || r.dateLabel)
    .sort((a, b) => b._sort.localeCompare(a._sort))
    .slice(0, 4)
    .map(({ _sort: _, ...rest }) => rest);

  const verifiedStartingPrices = primaryProducts
    .map((s) => {
      const teaser = pricingTeaser(s);
      if (!teaser) return null;
      return {
        slug: s.slug,
        name: s.name,
        teaser,
        verifiedAt: s.pricingVerifiedAt ?? null,
      };
    })
    .filter(Boolean) as CategoryHubModel["verifiedStartingPrices"];

  const matrixSlugs = profile?.matrixFeatureSlugs ?? [];
  const matrixProducts = primaryProducts.slice(0, 4);
  let featureMatrix: CategoryHubModel["featureMatrix"] = null;
  if (matrixSlugs.length > 0 && matrixProducts.length >= 2) {
    const rows = matrixSlugs.map((featureSlug) => {
      const featureName =
        canonicalFeaturesSeed.find((f) => f.slug === featureSlug)?.name ??
        featureSlug;
      const cells = matrixProducts.map((product) => {
        const rating = product.featureRatings.find(
          (r) => r.featureSlug === featureSlug,
        );
        if (!rating || rating.available == null) return "unknown" as const;
        return rating.available ? ("yes" as const) : ("no" as const);
      });
      return { featureSlug, featureName, cells };
    });
    const complete = rows.every((row) =>
      row.cells.every((c) => c !== "unknown"),
    );
    if (complete) {
      featureMatrix = {
        products: matrixProducts.map((p) => ({
          slug: p.slug,
          name: p.name,
        })),
        rows,
      };
    }
  }

  // Same section chrome on every category hub (CRM parity). Sections render
  // empty states when catalogue content is thin so anchors always resolve.
  const navItems: CategoryHubNavItem[] = [
    { id: "overview", label: "Overview", icon: "overview" },
    { id: "explore", label: "Explore", icon: "explore" },
    { id: "software", label: "Software", icon: "star" },
    ...(rankingsApproved
      ? [
          {
            id: "best",
            label: `Best ${shortLabel}`,
            icon: "star" as const,
            href: bestHref ?? undefined,
          },
        ]
      : []),
    { id: "compare", label: "Compare", icon: "comparisons" },
    { id: "use-cases", label: "Use Cases", icon: "use-cases" },
    { id: "capabilities", label: "Capabilities", icon: "capabilities" },
    { id: "business-types", label: "Business Types", icon: "users" },
    { id: "industries", label: "Industries", icon: "industries" },
    ...(resources.length > 0
      ? [{ id: "resources", label: "Resources", icon: "checklist" as const }]
      : []),
    { id: "pricing", label: "Pricing", icon: "pricing" },
    { id: "guides", label: "Guides", icon: "features" },
    {
      id: "tools",
      label: "Tools",
      icon: "puzzle",
      href: finderHref,
    },
    { id: "faq", label: "FAQ", icon: "faq" },
  ];

  return {
    category,
    profile,
    displayName,
    tagline,
    definition: definitionText,
    shortLabel,
    explorePaths,
    decisionCriteria,
    popularNeeds,
    chooseGuideHref,
    types,
    glance,
    finderHref,
    finderExample,
    buyingFramework,
    buyingGuideHref,
    pricingModel,
    faq,
    primaryProducts,
    productCards,
    logoStrip,
    rankingsApproved,
    bestPreview,
    bestPage,
    bestHref,
    catalogueHref,
    comparisons,
    useCases,
    capabilities,
    resources,
    industries,
    businessTypes,
    guides,
    features,
    methodologyCriteria,
    methodologyHref: profile?.methodologyHref ?? COMPANY_ROUTES.methodology,
    stats,
    reviews,
    verifiedStartingPrices,
    featureMatrix,
    navItems,
    lastUpdated,
    decisionTools: getRoutableTools(category.slug)
      .filter((tool): tool is typeof tool & { href: string } => Boolean(tool.href))
      .map((tool) => ({
        slug: tool.slug,
        name: tool.name,
        description: tool.shortDescription,
        href: tool.href,
      })),
  };
}
