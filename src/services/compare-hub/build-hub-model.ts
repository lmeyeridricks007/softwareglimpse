import type { Category, Comparison, Software } from "@/domain";
import { canonicalizeComparisonSlug } from "@/domain";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  getComparisons,
  getSoftware,
  getTopLevelCategories,
  getUseCases,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { COMPANY_ROUTES } from "@/services/site-foundation";

export type CompareHubProduct = {
  slug: string;
  name: string;
  href: string;
  categorySlug?: string;
  categoryLabel?: string;
  shortDescription?: string;
  logo?: { src: string; alt: string } | null;
  bestFor?: string;
};

export type CompareHubCard = {
  slug: string;
  href: string;
  title: string;
  summary?: string;
  categorySlug?: string;
  categoryLabel?: string;
  updatedLabel?: string;
  productA: CompareHubProduct;
  productB: CompareHubProduct;
  bestForA?: string;
  bestForB?: string;
};

export type CompareHubCategory = {
  slug: string;
  name: string;
  href: string;
  description?: string;
  comparisonCount: number;
  comingSoon: boolean;
  popularProducts: CompareHubProduct[];
};

export type CompareHubPreviewRow = {
  label: string;
  left: string;
  right: string;
};

export type CompareHubTool = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export type CompareHubGuide = {
  slug: string;
  href: string;
  title: string;
  summary?: string;
  categoryLabel?: string;
};

export type CompareHubFaq = { question: string; answer: string };

export type CompareHubModel = {
  indexable: boolean;
  published: CompareHubCard[];
  featured: CompareHubCard[];
  recentlyUpdated: CompareHubCard[];
  categories: CompareHubCategory[];
  filterCategories: Array<{ slug: string; name: string }>;
  selectorProducts: CompareHubProduct[];
  heroPreview: {
    example: boolean;
    title: string;
    href?: string;
    productA: CompareHubProduct;
    productB: CompareHubProduct;
    rows: CompareHubPreviewRow[];
  } | null;
  productSuggestions: Array<{
    product: CompareHubProduct;
    compareWith: CompareHubProduct[];
  }>;
  useCases: Array<{ id: string; title: string; href: string; description?: string }>;
  tools: CompareHubTool[];
  guides: CompareHubGuide[];
  reviews: CompareHubProduct[];
  directory: Array<{
    categoryLabel: string;
    categorySlug: string;
    items: Array<{ title: string; href: string }>;
  }>;
  faq: CompareHubFaq[];
  methodologyHref: string;
  howWeReviewHref: string;
};

function formatUpdated(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toProduct(
  software: Software,
  categories: Category[],
): CompareHubProduct {
  const categorySlug = software.primaryCategorySlug;
  const category = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : undefined;
  return {
    slug: software.slug,
    name: software.name,
    href: `/software/${software.slug}/`,
    categorySlug,
    categoryLabel: category?.name,
    shortDescription: software.shortDescription,
    logo: software.logo,
    bestFor: software.bestFor?.[0],
  };
}

function toCard(
  comparison: Comparison,
  productsBySlug: Map<string, CompareHubProduct>,
  categories: Category[],
): CompareHubCard | null {
  const [slugA, slugB] = comparison.productSlugs;
  const productA = slugA ? productsBySlug.get(slugA) : undefined;
  const productB = slugB ? productsBySlug.get(slugB) : undefined;
  if (!productA || !productB) return null;

  const bestForA = comparison.bestFor.find((b) => b.productSlug === productA.slug)
    ?.scenarios?.[0];
  const bestForB = comparison.bestFor.find((b) => b.productSlug === productB.slug)
    ?.scenarios?.[0];

  const category = comparison.categorySlug
    ? categories.find((c) => c.slug === comparison.categorySlug)
    : undefined;

  const updated =
    comparison.metadata.updatedAt ||
    comparison.metadata.publishedAt ||
    undefined;

  return {
    slug: comparison.slug,
    href: `/compare/${comparison.slug}/`,
    title: comparison.title,
    summary: comparison.summary,
    categorySlug: comparison.categorySlug,
    categoryLabel: category?.name,
    updatedLabel: formatUpdated(updated),
    productA,
    productB,
    bestForA: bestForA ?? productA.bestFor,
    bestForB: bestForB ?? productB.bestFor,
  };
}

function buildHeroPreview(
  published: CompareHubCard[],
  productsBySlug: Map<string, CompareHubProduct>,
): CompareHubModel["heroPreview"] {
  const featured = published[0];
  if (featured) {
    return {
      example: false,
      title: featured.title,
      href: featured.href,
      productA: featured.productA,
      productB: featured.productB,
      rows: [
        {
          label: "Best for",
          left: featured.bestForA ?? "See comparison",
          right: featured.bestForB ?? "See comparison",
        },
        {
          label: "Category",
          left: featured.categoryLabel ?? "—",
          right: featured.categoryLabel ?? "—",
        },
      ],
    };
  }

  const pipedrive = productsBySlug.get("pipedrive");
  const freshsales = productsBySlug.get("freshsales");
  if (!pipedrive || !freshsales) return null;

  // Example preview uses only catalogue fields — never invented feature winners.
  return {
    example: true,
    title: "Pipedrive vs Freshsales",
    productA: pipedrive,
    productB: freshsales,
    rows: [
      {
        label: "Category",
        left: pipedrive.categoryLabel ?? "—",
        right: freshsales.categoryLabel ?? "—",
      },
      {
        label: "Positioning",
        left: truncate(pipedrive.shortDescription, 42) ?? "See product page",
        right: truncate(freshsales.shortDescription, 42) ?? "See product page",
      },
      {
        label: "Best for",
        left: pipedrive.bestFor ?? "See product research",
        right: freshsales.bestFor ?? "See product research",
      },
    ],
  };
}

function truncate(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined;
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Public comparison hub model — published/indexable comparisons only in discovery.
 * Never invents popularity, scores, or editorial conclusions.
 */
export function buildCompareHubModel(): CompareHubModel {
  const categories = getTopLevelCategories();
  const software = getSoftware();
  const productsBySlug = new Map(
    software.map((s) => [s.slug, toProduct(s, categories)]),
  );

  const publishedEntities = getComparisons().filter((c) =>
    isEntityIndexable({ kind: "comparison", entity: c }),
  );

  const published = publishedEntities
    .map((c) => toCard(c, productsBySlug, categories))
    .filter((c): c is CompareHubCard => Boolean(c))
    .sort((a, b) => (b.updatedLabel ?? "").localeCompare(a.updatedLabel ?? ""));

  const featured = published.slice(0, 6);
  const recentlyUpdated = published.slice(0, 5);

  const categoryCards: CompareHubCategory[] = categories.map((cat) => {
    const catComparisons = published.filter((c) => c.categorySlug === cat.slug);
    const popularProducts = software
      .filter((s) => s.primaryCategorySlug === cat.slug)
      .slice(0, 3)
      .map((s) => productsBySlug.get(s.slug)!)
      .filter(Boolean);
    return {
      slug: cat.slug,
      name: cat.name,
      href:
        catComparisons.length > 0
          ? `/compare/?category=${encodeURIComponent(cat.slug)}#published-comparisons`
          : `/categories/${cat.path.join("/")}/`,
      description: cat.shortDescription ?? cat.description,
      comparisonCount: catComparisons.length,
      comingSoon: catComparisons.length === 0,
      popularProducts,
    };
  });

  // Prefer categories that have products (coverage), publish counts when real.
  const categoriesWithCoverage = categoryCards.filter(
    (c) => c.comparisonCount > 0 || c.popularProducts.length > 0,
  );

  const selectorProducts = [...productsBySlug.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const productSuggestions = selectorProducts
    .filter((p) => p.categorySlug === "crm")
    .slice(0, 1)
    .map((product) => {
      const soft = software.find((s) => s.slug === product.slug);
      const relatedSlugs = [
        ...(soft?.comparableSlugs ?? []),
        ...(soft?.competitorSlugs ?? []),
        ...(soft?.alternativeSlugs ?? []),
      ];
      const related = relatedSlugs
        .map((slug) => productsBySlug.get(slug))
        .filter((p): p is CompareHubProduct => Boolean(p))
        .filter(
          (p, i, arr) =>
            p.slug !== product.slug &&
            arr.findIndex((x) => x.slug === p.slug) === i,
        )
        .slice(0, 5);
      const peers = selectorProducts
        .filter(
          (p) =>
            p.slug !== product.slug &&
            p.categorySlug === product.categorySlug,
        )
        .slice(0, 5);
      const withPublished = (related.length > 0 ? related : peers).filter((p) =>
        published.some(
          (c) =>
            (c.productA.slug === product.slug && c.productB.slug === p.slug) ||
            (c.productB.slug === product.slug && c.productA.slug === p.slug),
        ),
      );
      return {
        product,
        compareWith:
          withPublished.length > 0
            ? withPublished
            : related.length > 0
              ? related
              : peers,
      };
    });

  const useCases = getUseCases()
    .filter((u) => u.categorySlugs.includes("crm") || u.categorySlugs.length === 0)
    .slice(0, 6)
    .map((u) => ({
      id: u.id,
      title: u.name,
      href: `/use-cases/${u.slug}/`,
      description: u.shortDescription ?? u.description,
    }));

  const tools: CompareHubTool[] = [
    {
      id: "crm-finder",
      title: "CRM Finder",
      description:
        "Get a personalized shortlist based on your requirements.",
      href: "/tools/crm-finder/",
    },
    {
      id: "crm-cost",
      title: "CRM Cost Calculator",
      description: "Estimate team costs across researched list prices.",
      href: "/tools/crm-cost-calculator/",
    },
    {
      id: "stack-builder",
      title: "Software Stack Builder",
      description: "Plan your wider software stack as coverage expands.",
      href: "/tools/software-stack-builder/",
    },
  ];

  const guides: CompareHubGuide[] = getGuides()
    .slice(0, 4)
    .map((g) => {
      const cat = g.categorySlugs[0]
        ? categories.find((c) => c.slug === g.categorySlugs[0])
        : undefined;
      return {
        slug: g.slug,
        href: `/guides/${g.slug}/`,
        title: g.title,
        summary: g.summary,
        categoryLabel: cat?.name,
      };
    });

  // Also surface Best CRM if present as a resource card via guides section extras
  const reviews = selectorProducts
    .filter((p) => p.categorySlug === "crm")
    .slice(0, 4);

  const directory = categoriesWithCoverage
    .filter((c) => c.comparisonCount > 0)
    .map((c) => ({
      categoryLabel: c.name,
      categorySlug: c.slug,
      items: published
        .filter((p) => p.categorySlug === c.slug)
        .map((p) => ({ title: p.title, href: p.href })),
    }));

  const faq: CompareHubFaq[] = [
    {
      question: "How does SoftwareGlimpse compare software?",
      answer:
        "We map products to the same category-specific criteria, then evaluate features, pricing and trade-offs side by side using structured research — not vendor marketing copy.",
    },
    {
      question: "Are comparisons influenced by affiliate relationships?",
      answer:
        "No. Affiliate status never changes comparison ordering, winners, or conclusions. Visit links may be affiliate links when disclosed.",
    },
    {
      question: "Where does comparison data come from?",
      answer:
        "Product, pricing and feature evidence is gathered from researched sources and normalized to shared category criteria. Unknown capabilities stay unknown.",
    },
    {
      question: "Can I compare more than two products?",
      answer:
        "Head-to-head pages compare two products today. Use category shortlists, Best Software guides, or CRM Finder when you need a broader set.",
    },
    {
      question: "How often are comparisons updated?",
      answer:
        "Published comparisons are refreshed when underlying research changes. Each page shows its last updated date when available.",
    },
    {
      question: "What happens if a feature is unknown?",
      answer:
        "We show unknown instead of assuming support. That keeps comparisons honest when evidence is incomplete.",
    },
    {
      question: "Can I compare software from different categories?",
      answer:
        "Comparisons work best within the same category so criteria stay meaningful. Cross-category pairs may not have enough shared criteria for a complete comparison.",
    },
    {
      question: "How are pricing differences handled?",
      answer:
        "When researched list prices exist, we show dated pricing context. Marketing “from $X” claims alone are not treated as verified totals.",
    },
  ];

  return {
    indexable: published.length > 0,
    published,
    featured,
    recentlyUpdated,
    categories: categoriesWithCoverage,
    filterCategories: categoriesWithCoverage
      .filter((c) => c.comparisonCount > 0)
      .map((c) => ({ slug: c.slug, name: c.name })),
    selectorProducts,
    heroPreview: buildHeroPreview(published, productsBySlug),
    productSuggestions,
    useCases,
    tools,
    guides,
    reviews,
    directory,
    faq,
    methodologyHref: COMPANY_ROUTES.methodology,
    howWeReviewHref: COMPANY_ROUTES.howWeReview,
  };
}

/** Resolve a pair to a published comparison href, or a build fallback path. */
export function resolveComparisonDestination(
  slugA: string,
  slugB: string,
): { href: string; kind: "published" | "build" } {
  const slug = canonicalizeComparisonSlug([slugA, slugB]);
  const published = getComparisons().find(
    (c) =>
      c.slug === slug && isEntityIndexable({ kind: "comparison", entity: c }),
  );
  if (published) {
    return { href: `/compare/${published.slug}/`, kind: "published" };
  }
  return {
    href: `/compare/build/?a=${encodeURIComponent(slugA)}&b=${encodeURIComponent(slugB)}`,
    kind: "build",
  };
}
