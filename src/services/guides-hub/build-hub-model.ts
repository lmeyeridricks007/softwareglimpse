import type { Category, GuidePage } from "@/domain";
import {
  estimateGuideReadingMinutes,
  readingPartsFromGuide,
} from "@/components/guides/guide-reading-time";
import {
  getTopLevelCategories,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { siteFoundationConfig } from "@/data/config/site/foundation-client";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/** Hub filter buckets for the Latest guides grid (not taxonomy categories). */
export const GUIDES_HUB_TOPIC_FILTERS = [
  { slug: "learn", label: "Learn" },
  { slug: "choosing", label: "Choosing" },
  { slug: "implementation", label: "Implementation" },
  { slug: "optimization", label: "Optimization" },
  { slug: "products", label: "Products" },
  { slug: "industry", label: "Industry" },
] as const;

export type GuidesHubTopicFilterSlug =
  (typeof GUIDES_HUB_TOPIC_FILTERS)[number]["slug"];

export type GuidesHubGuideCard = {
  slug: string;
  href: string;
  title: string;
  summary?: string;
  categorySlug?: string;
  categoryLabel?: string;
  topicType: string;
  journeyStage: string;
  /** Editorial cluster for hub filters (Learn / Choosing / …). */
  topicFilter: GuidesHubTopicFilterSlug;
  topicFilterLabel: string;
  readingMinutes: number;
  updatedLabel?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  learnPoints: string[];
  /** Unique per-guide cover — prefer over topic-type placeholder art. */
  image?: { src: string; alt: string } | null;
};

export type GuidesHubTopic = {
  slug: string;
  name: string;
  href: string;
  description?: string;
  guideCount: number;
  comingSoon: boolean;
  guides: Array<{ title: string; href: string }>;
};

export type GuidesHubStartHere = {
  categoryLabel: string;
  categoryHref: string;
  guides: GuidesHubGuideCard[];
};

export type GuidesHubJourneyStep = {
  step: string;
  title: string;
  description: string;
  href?: string;
  ctaLabel?: string;
};

export type GuidesHubTool = {
  id: string;
  title: string;
  description: string;
  href: string;
  preview: "finder" | "calculator" | "stack";
};

export type GuidesHubModel = {
  guides: GuidesHubGuideCard[];
  topics: GuidesHubTopic[];
  filterCategories: Array<{ slug: string; name: string }>;
  /** Topic clusters that currently have ≥1 published guide. */
  filterTopics: Array<{ slug: GuidesHubTopicFilterSlug; name: string; count: number }>;
  startHere: GuidesHubStartHere | null;
  featured: GuidesHubGuideCard | null;
  basics: GuidesHubGuideCard[];
  journey: GuidesHubJourneyStep[];
  tools: GuidesHubTool[];
  newsletterEnabled: boolean;
  methodologyHref: string;
  howWeReviewHref: string;
};

export function classifyGuideTopicFilter(
  guide: Pick<GuidePage, "slug" | "productSlugs" | "topicType" | "journeyStage">,
): GuidesHubTopicFilterSlug {
  if ((guide.productSlugs?.length ?? 0) > 0) return "products";
  if (
    guide.slug.startsWith("financial-services-") ||
    guide.slug.includes("-industry-") ||
    /^(healthcare|real-estate|education|nonprofit)-crm/.test(guide.slug)
  ) {
    return "industry";
  }
  if (
    guide.journeyStage === "optimize" ||
    guide.journeyStage === "switch" ||
    guide.topicType === "strategy" ||
    guide.topicType === "troubleshooting"
  ) {
    return "optimization";
  }
  if (
    guide.journeyStage === "implement" ||
    guide.topicType === "implementation" ||
    guide.topicType === "migration" ||
    guide.topicType === "setup"
  ) {
    return "implementation";
  }
  if (
    guide.journeyStage === "choose" ||
    guide.journeyStage === "evaluate" ||
    guide.topicType === "selection" ||
    guide.topicType === "buying-guide" ||
    guide.topicType === "pricing-education"
  ) {
    return "choosing";
  }
  return "learn";
}

function topicFilterLabel(slug: GuidesHubTopicFilterSlug): string {
  return (
    GUIDES_HUB_TOPIC_FILTERS.find((t) => t.slug === slug)?.label ?? slug
  );
}

function difficultyFor(guide: GuidePage): GuidesHubGuideCard["difficulty"] {
  if (guide.topicType === "fundamental" || guide.journeyStage === "learn") {
    return "Beginner";
  }
  if (
    guide.topicType === "selection" ||
    guide.topicType === "buying-guide" ||
    guide.journeyStage === "choose" ||
    guide.journeyStage === "evaluate"
  ) {
    return "Intermediate";
  }
  if (
    guide.topicType === "implementation" ||
    guide.topicType === "migration" ||
    guide.journeyStage === "implement"
  ) {
    return "Advanced";
  }
  return undefined;
}

function learnPointsFromGuide(guide: GuidePage): string[] {
  const fromChecklist = guide.checklist
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((c) => c.label)
    .filter(Boolean)
    .slice(0, 3);
  if (fromChecklist.length >= 2) return fromChecklist;

  const fromSections = (guide.sections ?? [])
    .map((s) => s.heading)
    .filter(Boolean)
    .slice(0, 3);
  if (fromSections.length >= 2) return fromSections;

  const fromBlocks: string[] = [];
  for (const block of guide.blocks ?? []) {
    if (!block || typeof block !== "object") continue;
    const b = block as { title?: string; heading?: string; type?: string };
    const label = b.title ?? b.heading;
    if (label && b.type !== "hero") fromBlocks.push(label);
    if (fromBlocks.length >= 3) break;
  }
  return fromBlocks.slice(0, 3);
}

function formatUpdatedLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function toCard(
  guide: GuidePage,
  categories: Category[],
): GuidesHubGuideCard {
  const categorySlug = guide.categorySlugs[0];
  const category = categorySlug
    ? categories.find((c) => c.slug === categorySlug)
    : undefined;
  const updated =
    guide.metadata.updatedAt || guide.metadata.publishedAt || undefined;
  const topicFilter = classifyGuideTopicFilter(guide);
  return {
    slug: guide.slug,
    href: `/guides/${guide.slug}/`,
    title: guide.title,
    summary: guide.summary,
    categorySlug,
    categoryLabel: category?.name,
    topicType: guide.topicType,
    journeyStage: guide.journeyStage,
    topicFilter,
    topicFilterLabel: topicFilterLabel(topicFilter),
    readingMinutes: estimateGuideReadingMinutes(readingPartsFromGuide(guide)),
    updatedLabel: updated ? formatUpdatedLabel(updated) : undefined,
    difficulty: difficultyFor(guide),
    learnPoints: learnPointsFromGuide(guide),
    image: guide.heroVisual
      ? { src: guide.heroVisual.src, alt: guide.heroVisual.alt }
      : null,
  };
}

function pickFeatured(cards: GuidesHubGuideCard[]): GuidesHubGuideCard | null {
  if (cards.length === 0) return null;
  const preferred = cards.filter((c) =>
    ["selection", "buying-guide"].includes(c.topicType),
  );
  const pool = preferred.length > 0 ? preferred : cards;
  return [...pool].sort((a, b) => b.readingMinutes - a.readingMinutes)[0] ?? null;
}

function buildStartHere(
  cards: GuidesHubGuideCard[],
  topics: GuidesHubTopic[],
): GuidesHubStartHere | null {
  const withGuides = topics.filter((t) => t.guideCount > 0);
  const topic = withGuides[0];
  if (!topic) return null;
  const guides = cards
    .filter((c) => c.categorySlug === topic.slug)
    .slice(0, 2);
  if (guides.length === 0) return null;
  return {
    categoryLabel: topic.name,
    categoryHref: `/guides/?category=${encodeURIComponent(topic.slug)}#latest-guides`,
    guides,
  };
}

function buildJourney(cards: GuidesHubGuideCard[]): GuidesHubJourneyStep[] {
  const byStage = (stage: string) =>
    cards.find((c) => c.journeyStage === stage) ??
    cards.find((c) =>
      stage === "learn"
        ? c.topicType === "fundamental"
        : stage === "choose"
          ? c.topicType === "selection" || c.topicType === "buying-guide"
          : false,
    );

  const learn = byStage("learn");
  const evaluate = byStage("evaluate") ?? byStage("choose");
  const choose = byStage("choose") ?? evaluate;

  return [
    {
      step: "01",
      title: "Understand",
      description:
        "Learn what the software category does and whether you need it.",
      href: learn?.href,
      ctaLabel: learn ? "Start learning" : undefined,
    },
    {
      step: "02",
      title: "Evaluate",
      description:
        "Understand features, requirements and common trade-offs.",
      href: evaluate?.href ?? "/guides/",
      ctaLabel: evaluate ? "Read evaluation guide" : undefined,
    },
    {
      step: "03",
      title: "Compare",
      description: "Compare products, pricing and fit.",
      href: "/compare/",
      ctaLabel: "Compare software",
    },
    {
      step: "04",
      title: "Choose",
      description: "Build a shortlist and make a decision.",
      href: choose?.href ?? "/best/",
      ctaLabel: choose ? "Read buying guide" : "Explore Best Software",
    },
  ];
}

/**
 * Data-driven Guides landing model — published guides + top-level categories only.
 * Never invents articles or guide counts.
 */
export function buildGuidesHubModel(): GuidesHubModel {
  const categories = getTopLevelCategories();
  const guides = getGuides();
  const cards = guides.map((g) => toCard(g, categories));

  const topics: GuidesHubTopic[] = categories.map((cat) => {
    const catGuides = cards.filter((c) => c.categorySlug === cat.slug);
    return {
      slug: cat.slug,
      name: cat.name,
      href:
        catGuides.length > 0
          ? `/guides/?category=${encodeURIComponent(cat.slug)}#latest-guides`
          : `/categories/${cat.path.join("/")}/`,
      description: cat.shortDescription ?? cat.description,
      guideCount: catGuides.length,
      comingSoon: catGuides.length === 0,
      guides: catGuides.slice(0, 3).map((g) => ({
        title: g.title,
        href: g.href,
      })),
    };
  });

  // Filter chips for all top-level categories in the taxonomy (empty → coming soon).
  const filterCategories = topics.map((t) => ({ slug: t.slug, name: t.name }));

  const filterTopics = GUIDES_HUB_TOPIC_FILTERS.map((t) => ({
    slug: t.slug,
    name: t.label,
    count: cards.filter((c) => c.topicFilter === t.slug).length,
  })).filter((t) => t.count > 0);

  const featured = pickFeatured(cards);
  // Prefer beginner/fundamental, then fill with remaining published guides.
  const beginnerish = cards.filter(
    (c) =>
      c.difficulty === "Beginner" ||
      c.topicType === "fundamental" ||
      c.journeyStage === "learn",
  );
  const basicsFinal = [
    ...beginnerish,
    ...cards.filter((c) => !beginnerish.some((b) => b.slug === c.slug)),
  ].slice(0, 4);

  const tools: GuidesHubTool[] = [
    {
      id: "crm-finder",
      title: "CRM Finder",
      description:
        "Answer a few questions for a fit-based CRM shortlist.",
      href: "/tools/crm-finder/",
      preview: "finder",
    },
    {
      id: "crm-requirements-builder",
      title: "CRM Requirements Builder",
      description:
        "Turn a vague CRM need into a structured, prioritized requirements profile.",
      href: "/tools/crm-requirements-builder/",
      preview: "finder",
    },
    {
      id: "crm-vendor-scorecard",
      title: "CRM Vendor Scorecard",
      description:
        "Evaluate shortlisted CRM vendors against your requirements with evidence-backed research.",
      href: "/tools/crm-vendor-scorecard/",
      preview: "stack",
    },
    {
      id: "crm-cost",
      title: "CRM Cost Calculator",
      description: "Estimate subscription cost from researched list prices.",
      href: "/tools/crm-cost-calculator/",
      preview: "calculator",
    },
    {
      id: "crm-tco-calculator",
      title: "CRM TCO Calculator",
      description:
        "Estimate total CRM ownership cost — software plus implementation, migration, training and admin.",
      href: "/tools/crm-tco-calculator/",
      preview: "calculator",
    },
    {
      id: "stack-builder",
      title: "Software Stack Builder",
      description: "Map tools across your stack as coverage expands.",
      href: "/tools/software-stack-builder/",
      preview: "stack",
    },
  ];

  return {
    guides: cards,
    topics,
    filterCategories,
    filterTopics,
    startHere: buildStartHere(cards, topics),
    featured,
    basics: basicsFinal,
    journey: buildJourney(cards),
    tools,
    newsletterEnabled: siteFoundationConfig.newsletter.enabled,
    methodologyHref: COMPANY_ROUTES.methodology,
    howWeReviewHref: COMPANY_ROUTES.howWeReview,
  };
}
