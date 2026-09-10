import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
} from "@/data/config/tools/category-tool-meta";
import type { JourneyTemplate } from "./types";

/**
 * Named buyer journeys across the estate.
 * Paths may be templates with `{category}` / `{product}` placeholders.
 */
export function listJourneyTemplates(): JourneyTemplate[] {
  return [
    {
      id: "guide-to-decision",
      name: "Guide → shortlist → review → compare → price → tool",
      description:
        "Educational guide into category shortlist, product review, comparison, pricing, and finder/calculator.",
      steps: [
        { role: "guide", path: null, label: "Buying / how-to guide" },
        { role: "category", path: "/categories/{category}/", label: "Category hub" },
        {
          role: "shortlist",
          path: "/best/{category}-software/",
          label: "Best / shortlist",
          optional: true,
        },
        { role: "review", path: "/software/{product}/", label: "Product review" },
        {
          role: "comparison",
          path: "/compare/{product}-vs-{peer}/",
          label: "Comparison",
          optional: true,
        },
        {
          role: "pricing",
          path: "/software/{product}/pricing/",
          label: "Pricing",
          optional: true,
        },
        {
          role: "tool",
          path: null,
          label: "Finder / cost calculator",
        },
      ],
    },
    {
      id: "product-explainer",
      name: "Product explainer → review → comparisons → alternatives",
      description:
        "what-is / explainer pages deepen into the product hub, then peer comparisons and alternatives.",
      steps: [
        {
          role: "explainer",
          path: "/guides/what-is-{product}/",
          label: "Product explainer",
        },
        { role: "review", path: "/software/{product}/", label: "Product review" },
        {
          role: "comparison",
          path: "/compare/",
          label: "Related comparisons",
        },
        {
          role: "alternatives",
          path: "/alternatives/{product}/",
          label: "Alternatives",
          optional: true,
        },
      ],
    },
    {
      id: "research-to-tool",
      name: "Research → category → products → decision tool",
      description:
        "Original research into category context, product evidence, then an interactive decision tool.",
      steps: [
        {
          role: "research",
          path: "/research/crm-pricing/",
          label: "Research report",
        },
        { role: "category", path: "/categories/crm/", label: "Category hub" },
        { role: "products", path: "/software/", label: "Product reviews" },
        {
          role: "tool",
          path: "/tools/crm-finder/",
          label: "CRM Finder / calculator",
        },
      ],
    },
  ];
}

/** Resolve concrete next-step hrefs for a category from journey templates. */
export function resolveCategoryJourneyPaths(categorySlug: string): {
  finder: string | null;
  cost: string | null;
  categoryHub: string;
  research: string | null;
} {
  return {
    finder: categoryDecisionFinderHref(categorySlug),
    cost: categoryDecisionCostHref(categorySlug),
    categoryHub: `/categories/${categorySlug}/`,
    research: categorySlug === "crm" ? "/research/crm-pricing/" : null,
  };
}
