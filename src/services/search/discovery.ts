import {
  getResources,
  getTopLevelCategories,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { CURATED_TRY_QUERIES } from "./curated-queries";
import type { DiscoveryHubModel } from "./types";

/**
 * No-query /search discovery hub — curated, not fabricated popularity.
 */
export function buildDiscoveryHub(): DiscoveryHubModel {
  const categories = getTopLevelCategories().slice(0, 8);
  const tools = TOOLS_REGISTRY.filter(
    (t) => t.status === "available" && t.href && (t.featured || t.popular),
  ).slice(0, 4);

  const guides = getGuides()
    .filter((g) => g.seo.indexable === true)
    .slice(0, 3);

  const resources = getResources().slice(0, 3);

  return {
    browse: [
      {
        label: "Software",
        href: "/software/",
        description: "Product reviews",
      },
      {
        label: "Best Software",
        href: "/best/",
        description: "Editorially ranked shortlists",
      },
      {
        label: "Comparisons",
        href: "/compare/",
        description: "Side-by-side product matchups",
      },
      {
        label: "Tools",
        href: "/tools/",
        description: "Finders, calculators and planners",
      },
      {
        label: "Guides",
        href: "/guides/",
        description: "Buying and implementation guides",
      },
      {
        label: "Resources",
        href: "/resources/",
        description: "Checklists and templates",
      },
    ],
    popularCategories: categories.map((c) => ({
      name: c.name,
      href: `/categories/${c.path.join("/")}/`,
    })),
    popularTools: tools.map((t) => ({
      name: t.name,
      href: t.href!,
      summary: t.shortDescription,
    })),
    featuredGuides: guides.map((g) => ({
      title: g.title,
      href: `/guides/${g.slug}/`,
      summary: g.summary || "",
    })),
    featuredResources: resources.map((r) => ({
      title: r.name,
      href: `/resources/${r.slug}/`,
      summary: r.shortDescription || "",
    })),
    tryQueries: [...CURATED_TRY_QUERIES],
  };
}
