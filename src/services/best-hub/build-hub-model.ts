/**
 * Best Software hub (/best/) — data assembly from published catalogue entities.
 * Never surfaces editorial workflow language or unpublished Best pages.
 */

import {
  getBestPages,
  getComparisons,
  getSoftwareByCategory,
  getSoftwareBySlug,
  getTopLevelCategories,
  getUseCases,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import type { BestPage, Category, Comparison, GuidePage, Software } from "@/domain";
import {
  firstPublicCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";
import {
  estimateGuideReadingMinutes,
  readingPartsFromGuide,
} from "@/components/guides/guide-reading-time";

export type BestHubProductRef = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
};

export type BestHubPageCard = {
  id: string;
  slug: string;
  title: string;
  href: string;
  categorySlug: string;
  categoryName: string;
  categoryPath: string[];
  buyingContext: string;
  productCount: number;
  topProducts: BestHubProductRef[];
  updatedLabel: string;
  popularNeeds: string[];
  relatedToolPaths: string[];
  hasApprovedRecommendations: boolean;
};

export type BestHubNeedCard = {
  id: string;
  title: string;
  description: string;
  categorySlugs: string[];
  categoryNames: string[];
  href: string;
  cta: string;
};

export type BestHubDecisionPath = {
  id: string;
  title: string;
  categoryHint: string;
  href: string;
};

export type BestHubComparisonTeaser = {
  slug: string;
  href: string;
  title: string;
  left: BestHubProductRef;
  right: BestHubProductRef;
  summary: string;
};

export type BestHubTool = {
  id: string;
  href: string;
  title: string;
  description: string;
};

export type BestHubGuideCard = {
  slug: string;
  href: string;
  title: string;
  summary: string | null;
  categoryLabel: string;
  topicType: string;
  readingMinutes: number;
  updatedLabel: string;
};

export type BestHubUpdateItem = {
  href: string;
  title: string;
  categorySlug: string;
  changeLabel: string;
  dateLabel: string;
};

export type BestHubApprovedBestFor = {
  product: BestHubProductRef;
  bestFor: string;
};

export type BestHubModel = {
  pages: BestHubPageCard[];
  featured: BestHubPageCard | null;
  /** Additional Best pages after featured (for by-category grid). */
  categoryCards: BestHubPageCard[];
  filterCategories: Array<{
    slug: string;
    name: string;
    href: string;
    hasBestPage: boolean;
  }>;
  /** Category hubs with products — discovery when Best coverage is thin. */
  relatedCategories: Array<{
    slug: string;
    name: string;
    href: string;
    description: string;
    productCount: number;
    popularNames: string[];
  }>;
  needs: BestHubNeedCard[];
  useCases: Array<{
    slug: string;
    name: string;
    description: string;
    href: string;
    categorySlug: string;
    categoryNames: string[];
  }>;
  decisionPaths: BestHubDecisionPath[];
  comparisons: BestHubComparisonTeaser[];
  tools: BestHubTool[];
  guides: BestHubGuideCard[];
  recentUpdates: BestHubUpdateItem[];
  /** Approved "Best for" scenarios only — empty when none approved. */
  approvedBestFor: BestHubApprovedBestFor[];
  finder: {
    href: string;
    label: string;
    exists: boolean;
  };
  decisionJourney: {
    bestHref: string;
    bestTitle: string;
    shortlist: BestHubProductRef[];
    finderHref: string;
    compareHref: string;
  } | null;
  indexable: boolean;
  stats: {
    bestPageCount: number;
    productsResearched: number;
    categoryCount: number;
  };
};

function formatDateLabel(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function publicBuyingContext(
  page: BestPage,
  category: Category | undefined,
): string {
  const categoryLabel = category?.name ?? "software";
  return (
    firstPublicCopy(
      [page.summary, category?.shortDescription],
      `Compare ${categoryLabel} platforms using the same methodology — fit for your team, not affiliate rankings.`,
    ) ??
    `Compare ${categoryLabel} platforms using the same methodology — fit for your team, not affiliate rankings.`
  );
}

function popularNeedsForPage(
  page: BestPage,
  useCases: ReturnType<typeof getUseCases>,
): string[] {
  // Hub display preference for CRM matches buying-guide mockup language.
  if (page.categorySlug === "crm") {
    return [
      "Pipeline management",
      "Small business",
      "Sales automation",
      "Lead management",
    ];
  }

  const fromUseCases = page.useCaseSlugs
    .map((slug) => useCases.find((u) => u.slug === slug)?.name)
    .filter((n): n is string => Boolean(n));

  const fromRecs = page.useCaseRecommendations
    .map((r) => useCases.find((u) => u.slug === r.useCaseSlug)?.name)
    .filter((n): n is string => Boolean(n));

  return [...new Set([...fromUseCases, ...fromRecs])].slice(0, 4);
}

function toProductRef(software: Software | undefined): BestHubProductRef | null {
  if (!software) return null;
  return {
    slug: software.slug,
    name: software.name,
    logo: software.logo,
  };
}

function buildPageCard(
  page: BestPage,
  categories: Category[],
  useCases: ReturnType<typeof getUseCases>,
): BestHubPageCard {
  const category = categories.find((c) => c.slug === page.categorySlug);
  const categorySlug = page.categorySlug ?? "software";
  const products = (page.eligibleProductSlugs ?? [])
    .map((slug) => toProductRef(getSoftwareBySlug(slug)))
    .filter((p): p is BestHubProductRef => Boolean(p));

  const updatedIso =
    page.metadata.updatedAt ?? page.metadata.publishedAt ?? undefined;

  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    href: `/best/${page.slug}/`,
    categorySlug,
    categoryName: category?.name ?? categorySlug,
    categoryPath: category?.path ?? [categorySlug],
    buyingContext: publicBuyingContext(page, category),
    productCount: page.eligibleProductSlugs?.length ?? products.length,
    topProducts: products.slice(0, 5),
    updatedLabel: formatDateLabel(updatedIso),
    popularNeeds: popularNeedsForPage(page, useCases),
    relatedToolPaths: page.relatedToolPaths ?? [],
    hasApprovedRecommendations:
      page.recommendations.some((r) => r.approved) ||
      page.useCaseRecommendations.some((r) => r.approved && r.rationale),
  };
}

/** Prefer maturity: approved ranked or cluster awards → more products → newer update. */
function approvedPickCount(page: BestPage): number {
  return (
    page.recommendations.filter((r) => r.approved).length +
    page.useCaseRecommendations.filter((r) => r.approved && r.rationale).length
  );
}

function sortBestPagesByMaturity(pages: BestPage[]): BestPage[] {
  return [...pages].sort((a, b) => {
    const aApproved = approvedPickCount(a);
    const bApproved = approvedPickCount(b);
    if (bApproved !== aApproved) return bApproved - aApproved;

    const aCount = a.eligibleProductSlugs?.length ?? 0;
    const bCount = b.eligibleProductSlugs?.length ?? 0;
    if (bCount !== aCount) return bCount - aCount;

    const aDate = a.metadata.updatedAt ?? a.metadata.publishedAt ?? "";
    const bDate = b.metadata.updatedAt ?? b.metadata.publishedAt ?? "";
    return bDate.localeCompare(aDate);
  });
}

function buildNeedCards(
  categories: Category[],
  useCases: ReturnType<typeof getUseCases>,
  bestByCategory: Map<string, BestHubPageCard>,
): BestHubNeedCard[] {
  const categoryName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? slug;

  const needs: BestHubNeedCard[] = [
    {
      id: "grow-sales",
      title: "Grow sales",
      description:
        "Pipeline, engagement, and sales workflows for teams that need clearer deal visibility.",
      categorySlugs: ["crm", "sales-intelligence"],
      categoryNames: [],
      href: bestByCategory.get("crm")?.href ?? "/categories/crm/",
      cta: bestByCategory.has("crm")
        ? "Find sales software →"
        : "Explore CRM →",
    },
    {
      id: "manage-leads",
      title: "Manage leads",
      description:
        "Capture, qualify, and route leads before they become pipeline deals.",
      categorySlugs: ["crm", "sales-intelligence"],
      categoryNames: [],
      href:
        useCases.find((u) => u.slug === "lead-management") != null
          ? "/use-cases/lead-management/"
          : "/categories/crm/",
      cta: "Explore lead tools →",
    },
    {
      id: "manage-projects",
      title: "Manage projects",
      description:
        "Plan work, track ownership, and keep delivery visible across teams.",
      categorySlugs: ["project-management"],
      categoryNames: [],
      href: "/categories/project-management/",
      cta: "Explore project tools →",
    },
    {
      id: "support-customers",
      title: "Support customers",
      description:
        "Help desk, live chat, and service workflows for responsive support teams.",
      categorySlugs: ["customer-service"],
      categoryNames: [],
      href: "/categories/customer-service/",
      cta: "Explore support tools →",
    },
    {
      id: "automate-marketing",
      title: "Automate marketing",
      description:
        "Email, campaigns, and growth tooling when outreach needs a system.",
      categorySlugs: ["marketing"],
      categoryNames: [],
      href: "/categories/marketing/",
      cta: "Explore marketing tools →",
    },
    {
      id: "manage-employees",
      title: "Manage employees",
      description:
        "HR, workforce, and training software for growing people operations.",
      categorySlugs: ["hr"],
      categoryNames: [],
      href: "/categories/hr/",
      cta: "Explore HR tools →",
    },
    {
      id: "communicate",
      title: "Communicate with customers",
      description:
        "Business phone, messaging, and communication platforms for customer contact.",
      categorySlugs: ["business-communications"],
      categoryNames: [],
      href: "/categories/business-communications/",
      cta: "Explore communications →",
    },
    {
      id: "improve-productivity",
      title: "Improve productivity",
      description:
        "Tools that reduce admin load so teams spend more time on customer work.",
      categorySlugs: ["project-management", "crm"],
      categoryNames: [],
      href: "/categories/",
      cta: "Browse categories →",
    },
  ];

  const publishedCategorySlugs = new Set(categories.map((c) => c.slug));

  return needs
    .filter((need) =>
      need.categorySlugs.some((slug) => publishedCategorySlugs.has(slug)),
    )
    .map((need) => ({
      ...need,
      categoryNames: need.categorySlugs
        .filter((slug) => publishedCategorySlugs.has(slug))
        .map(categoryName),
    }));
}

function buildDecisionPaths(
  categories: Category[],
  bestByCategory: Map<string, BestHubPageCard>,
): BestHubDecisionPath[] {
  const paths: BestHubDecisionPath[] = [
    {
      id: "sales",
      title: "Manage Sales",
      categoryHint: "CRM / Sales",
      href: bestByCategory.get("crm")?.href ?? "/categories/crm/",
    },
    {
      id: "projects",
      title: "Manage Projects",
      categoryHint: "Project Management",
      href: "/categories/project-management/",
    },
    {
      id: "support",
      title: "Better Customer Support",
      categoryHint: "Customer Service",
      href: "/categories/customer-service/",
    },
    {
      id: "marketing",
      title: "Automate Marketing",
      categoryHint: "Marketing",
      href: "/categories/marketing/",
    },
    {
      id: "hr",
      title: "Manage Employees",
      categoryHint: "HR",
      href: "/categories/hr/",
    },
  ];

  const published = new Set(categories.map((c) => c.slug));
  const slugFromHint: Record<string, string> = {
    sales: "crm",
    projects: "project-management",
    support: "customer-service",
    marketing: "marketing",
    hr: "hr",
  };

  return paths.filter((p) => {
    const slug = slugFromHint[p.id];
    return !slug || published.has(slug) || bestByCategory.has(slug);
  });
}

function comparisonSummary(cmp: Comparison, left: Software, right: Software): string {
  const leftScenario = cmp.bestFor.find((b) => b.productSlug === left.slug)
    ?.scenarios[0];
  const rightScenario = cmp.bestFor.find((b) => b.productSlug === right.slug)
    ?.scenarios[0];
  const safeLeft = publicCopy(leftScenario);
  const safeRight = publicCopy(rightScenario);
  if (safeLeft && safeRight) {
    return `${safeLeft} vs ${safeRight.toLowerCase()}`;
  }
  return `Side-by-side comparison of ${left.name} and ${right.name}.`;
}

function buildTools(featured: BestHubPageCard | null): BestHubTool[] {
  const tools: BestHubTool[] = [
    {
      id: "crm-finder",
      href: "/tools/crm-finder/",
      title: "CRM Finder",
      description:
        "Answer a few questions and get fit-based CRM recommendations.",
    },
    {
      id: "crm-cost",
      href: "/tools/crm-cost-calculator/",
      title: "CRM Cost Calculator",
      description:
        "Estimate CRM subscription costs from researched public pricing.",
    },
  ];

  // Only advertise comparison index when we have at least one public comparison
  // (handled by caller via comparisons.length); still list as a tool when useful.
  tools.push({
    id: "compare",
    href: "/compare/",
    title: "Compare software",
    description: "Browse side-by-side product comparisons on shared criteria.",
  });

  // Prefer tools linked from the featured Best page when present
  if (featured) {
    const allowed = new Set(
      featured.relatedToolPaths.filter(
        (p) =>
          p === "/tools/crm-finder/" ||
          p === "/tools/crm-cost-calculator/" ||
          p === "/compare/",
      ),
    );
    if (allowed.size > 0) {
      return tools.filter((t) => {
        const href = t.href;
        return (
          allowed.has(href as "/tools/crm-finder/" | "/tools/crm-cost-calculator/" | "/compare/") ||
          href === "/compare/" ||
          t.id === "crm-finder" ||
          t.id === "crm-cost"
        );
      });
    }
  }

  return tools;
}

function buildGuides(
  guides: GuidePage[],
  categories: Category[],
): BestHubGuideCard[] {
  return guides.map((g) => {
    const categorySlug = g.categorySlugs[0];
    const category = categories.find((c) => c.slug === categorySlug);
    const updatedIso = g.metadata.updatedAt ?? g.metadata.publishedAt;
    return {
      slug: g.slug,
      href: `/guides/${g.slug}/`,
      title: g.title,
      summary: publicCopy(g.summary),
      categoryLabel: category?.name ?? "Software",
      topicType: g.topicType ?? "fundamental",
      readingMinutes: estimateGuideReadingMinutes(readingPartsFromGuide(g)),
      updatedLabel: formatDateLabel(updatedIso),
    };
  });
}

function buildApprovedBestFor(page: BestPage | undefined): BestHubApprovedBestFor[] {
  if (!page) return [];
  return page.recommendations
    .filter((r) => r.approved)
    .map((r) => {
      const product = toProductRef(getSoftwareBySlug(r.productSlug));
      const bestFor = publicCopy(r.scenarios?.[0] ?? r.recommendationLabel);
      if (!product || !bestFor) return null;
      return { product, bestFor };
    })
    .filter((x): x is BestHubApprovedBestFor => Boolean(x))
    .slice(0, 4);
}

export function getPublishedBestPages(): BestPage[] {
  return getBestPages();
}

export function getFeaturedBestPages(limit = 1): BestPage[] {
  return sortBestPagesByMaturity(getPublishedBestPages()).slice(0, limit);
}

export function getBestPagesByCategory(): Map<string, BestPage[]> {
  const map = new Map<string, BestPage[]>();
  for (const page of getPublishedBestPages()) {
    const categorySlug = page.categorySlug;
    if (!categorySlug) continue;
    const list = map.get(categorySlug) ?? [];
    list.push(page);
    map.set(categorySlug, list);
  }
  return map;
}

export function getRecentlyUpdatedBestPages(limit = 5): BestPage[] {
  return [...getPublishedBestPages()]
    .sort((a, b) => {
      const aDate = a.metadata.updatedAt ?? a.metadata.publishedAt ?? "";
      const bDate = b.metadata.updatedAt ?? b.metadata.publishedAt ?? "";
      return bDate.localeCompare(aDate);
    })
    .slice(0, limit);
}

export function getPopularComparisonsForBestHub(limit = 6): Comparison[] {
  // Publicly available comparisons only (same gate as catalogue listings).
  return getComparisons()
    .filter((c) => c.productSlugs.length >= 2)
    .sort((a, b) => {
      // Prefer comparisons tied to published Best pages
      const aBest = a.categorySlug;
      const bBest = b.categorySlug;
      const bestCats = new Set(getPublishedBestPages().map((p) => p.categorySlug));
      const aScore = bestCats.has(aBest) ? 1 : 0;
      const bScore = bestCats.has(bBest) ? 1 : 0;
      if (bScore !== aScore) return bScore - aScore;
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit);
}

export function buildBestHubModel(): BestHubModel {
  const categories = getTopLevelCategories();
  const useCases = getUseCases();
  const rawPages = sortBestPagesByMaturity(getPublishedBestPages());
  const pages = rawPages.map((p) => buildPageCard(p, categories, useCases));
  const featured = pages[0] ?? null;
  const categoryCards =
    pages.length > 1 ? pages.slice(featured ? 1 : 0) : pages.length === 1 ? [] : [];

  const bestByCategory = new Map<string, BestHubPageCard>();
  for (const card of pages) {
    if (!bestByCategory.has(card.categorySlug)) {
      bestByCategory.set(card.categorySlug, card);
    }
  }

  const filterCategories = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    href: `/categories/${c.path.join("/")}/`,
    hasBestPage: bestByCategory.has(c.slug),
  }));

  const relatedCategories = categories
    .map((c) => {
      const products = getSoftwareByCategory(c.slug);
      return {
        slug: c.slug,
        name: c.name,
        href: `/categories/${c.path.join("/")}/`,
        description:
          publicCopy(c.shortDescription) ??
          `Explore ${c.name} software on SoftwareGlimpse.`,
        productCount: products.length,
        popularNames: products.slice(0, 3).map((p) => p.name),
      };
    })
    .filter((c) => c.productCount > 0 || bestByCategory.has(c.slug))
    .sort((a, b) => b.productCount - a.productCount);

  const comparisonEntities = getPopularComparisonsForBestHub(6);
  const comparisons: BestHubComparisonTeaser[] = comparisonEntities
    .map((cmp) => {
      const left = getSoftwareBySlug(cmp.productSlugs[0]!);
      const right = getSoftwareBySlug(cmp.productSlugs[1]!);
      if (!left || !right) return null;
      const leftRef = toProductRef(left)!;
      const rightRef = toProductRef(right)!;
      return {
        slug: cmp.slug,
        href: `/compare/${cmp.slug}/`,
        title: cmp.title,
        left: leftRef,
        right: rightRef,
        summary: comparisonSummary(cmp, left, right),
      };
    })
    .filter((x): x is BestHubComparisonTeaser => Boolean(x));

  const finderExists = true; // CRM Finder is live
  const finderHref = "/tools/crm-finder/";
  const finderLabel = "Find My CRM";

  const featuredRaw = rawPages[0];
  const relatedCompareSlug = featuredRaw?.relatedComparisonSlugs?.find((slug) =>
    comparisonEntities.some((c) => c.slug === slug),
  );
  const decisionJourney =
    featured && featured.categorySlug === "crm" && finderExists
      ? {
          bestHref: featured.href,
          bestTitle: featured.title,
          shortlist: featured.topProducts.slice(0, 3),
          finderHref,
          compareHref: relatedCompareSlug
            ? `/compare/${relatedCompareSlug}/`
            : (comparisons[0]?.href ?? "/compare/"),
        }
      : null;

  const useCaseCards = useCases
    .filter((uc) =>
      uc.categorySlugs.some(
        (slug) =>
          bestByCategory.has(slug) ||
          slug === "crm" ||
          slug === "sales-intelligence",
      ),
    )
    .slice(0, 8)
    .map((uc) => {
      const primarySlug =
        uc.categorySlugs.find((s) => bestByCategory.has(s)) ??
        uc.categorySlugs[0] ??
        "crm";
      return {
        slug: uc.slug,
        name: uc.name,
        description:
          publicCopy(uc.shortDescription) ??
          `Software for ${uc.name.toLowerCase()}.`,
        href: `/use-cases/${uc.slug}/`,
        categorySlug: primarySlug,
        categoryNames: uc.categorySlugs
          .map((s) => categories.find((c) => c.slug === s)?.name)
          .filter((n): n is string => Boolean(n)),
      };
    });

  const recentUpdates = getRecentlyUpdatedBestPages(5).map((page) => {
    const card = pages.find((p) => p.id === page.id)!;
    return {
      href: card.href,
      title: card.title,
      categorySlug: card.categorySlug,
      changeLabel: "Research updated",
      dateLabel: card.updatedLabel || "Recently",
    };
  });

  const productsResearched = new Set(
    rawPages.flatMap((p) => p.eligibleProductSlugs ?? []),
  ).size;

  return {
    pages,
    featured,
    categoryCards,
    filterCategories,
    relatedCategories,
    needs: buildNeedCards(categories, useCases, bestByCategory),
    useCases: useCaseCards,
    decisionPaths: buildDecisionPaths(categories, bestByCategory),
    comparisons,
    tools: buildTools(featured),
    guides: buildGuides(getGuides(), categories),
    recentUpdates,
    approvedBestFor: buildApprovedBestFor(featuredRaw),
    finder: {
      href: finderHref,
      label: finderLabel,
      exists: finderExists,
    },
    decisionJourney,
    indexable: rawPages.some((item) =>
      isEntityIndexable({ kind: "best", entity: item }),
    ),
    stats: {
      bestPageCount: pages.length,
      productsResearched,
      categoryCount: categories.length,
    },
  };
}
