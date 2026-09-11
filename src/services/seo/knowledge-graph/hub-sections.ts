import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getCategoryBySlug,
  getIndustries,
  getSoftware,
  getUseCases,
} from "@/data";
import { getGuides } from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  categoryDecisionCostHref,
  categoryDecisionFinderHref,
  categoryShortName,
} from "@/data/config/tools/category-tool-meta";
import { authorityScoreForPath } from "./authority";
import type { HubSection, HubSectionLink } from "./types";

function link(
  href: string,
  label: string,
  description: string | undefined,
  indexable: boolean,
): HubSectionLink {
  return {
    href,
    label,
    description,
    authorityScore: authorityScoreForPath(href),
    indexable,
  };
}

/**
 * Organized hub sections — not a dump of every related URL.
 * Caps keep crawl/nav weight light while surfacing high-authority destinations.
 */
export function buildCategoryHubSections(categorySlug: string): HubSection[] {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return [];
  const short = categoryShortName(categorySlug);
  const sections: HubSection[] = [];

  const start: HubSectionLink[] = [];
  const choose = getGuides().find(
    (g) =>
      g.categorySlugs.includes(categorySlug) &&
      (g.slug.includes("how-to-choose") || g.topicType === "buying-guide") &&
      isEntityIndexable({ kind: "guide", entity: g }),
  );
  if (choose) {
    start.push(
      link(
        `/guides/${choose.slug}/`,
        choose.title,
        "Start with selection criteria",
        true,
      ),
    );
  }
  const finder = categoryDecisionFinderHref(categorySlug);
  if (finder) {
    start.push(
      link(finder, `${short} Finder`, "Shortlist from your answers", true),
    );
  }
  const best = getAllBestPagesUnfiltered().find(
    (b) =>
      b.categorySlug === categorySlug &&
      isEntityIndexable({ kind: "best", entity: b }),
  );
  if (best) {
    start.push(
      link(`/best/${best.slug}/`, best.title, "Evaluation shortlist", true),
    );
  }
  if (start.length) {
    sections.push({
      id: "start_here",
      title: "Start here",
      links: start
        .sort((a, b) => b.authorityScore - a.authorityScore)
        .slice(0, 4),
    });
  }

  const guides = getGuides()
    .filter(
      (g) =>
        g.categorySlugs.includes(categorySlug) &&
        isEntityIndexable({ kind: "guide", entity: g }),
    )
    .map((g) =>
      link(`/guides/${g.slug}/`, g.title, undefined, true),
    )
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 6);
  if (guides.length) {
    sections.push({
      id: "most_useful_guides",
      title: "Most useful guides",
      links: guides,
    });
  }

  const products = getSoftware()
    .filter(
      (s) =>
        s.primaryCategorySlug === categorySlug &&
        isEntityIndexable({ kind: "software", entity: s }),
    )
    .map((s) =>
      link(`/software/${s.slug}/`, s.name, s.bestFor?.[0], true),
    )
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 8);
  if (products.length) {
    sections.push({
      id: "popular_software",
      title: `Popular ${short} software`,
      links: products,
    });
  }

  const comparisons = getAllComparisonsUnfiltered()
    .filter(
      (c) =>
        c.categorySlug === categorySlug &&
        isEntityIndexable({ kind: "comparison", entity: c }),
    )
    .map((c) => link(`/compare/${c.slug}/`, c.title, undefined, true))
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 6);
  if (comparisons.length) {
    sections.push({
      id: "comparisons",
      title: "Comparisons",
      links: comparisons,
    });
  }

  const pricingLinks: HubSectionLink[] = [];
  const cost = categoryDecisionCostHref(categorySlug);
  if (cost) {
    pricingLinks.push(
      link(cost, `${short} Cost Calculator`, "Model team cost", true),
    );
  }
  if (categorySlug === "crm") {
    pricingLinks.push(
      link(
        "/research/crm-pricing/",
        "CRM Pricing Benchmarks 2026",
        "Catalogue-derived pricing research",
        true,
      ),
    );
  }
  if (pricingLinks.length) {
    sections.push({ id: "pricing", title: "Pricing", links: pricingLinks });
  }

  const useCases = getUseCases()
    .filter((u) => u.categorySlugs?.includes(categorySlug) && u.seo?.indexable)
    .map((u) => link(`/use-cases/${u.slug}/`, u.name, undefined, true))
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 6);
  if (useCases.length) {
    sections.push({ id: "use_cases", title: "Use cases", links: useCases });
  }

  const industries = getIndustries()
    .filter((i) => i.seo?.indexable === true)
    .map((i) => link(`/industries/${i.slug}/`, i.name, undefined, true))
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 6);
  if (industries.length && categorySlug === "crm") {
    sections.push({
      id: "industry_guidance",
      title: "Industry guidance",
      links: industries,
    });
  }

  const tools: HubSectionLink[] = [];
  if (finder) {
    tools.push(link(finder, `${short} Finder`, undefined, true));
  }
  if (cost) {
    tools.push(link(cost, `${short} Cost Calculator`, undefined, true));
  }
  if (tools.length) {
    sections.push({ id: "tools", title: "Tools", links: tools.slice(0, 4) });
  }

  if (categorySlug === "crm") {
    sections.push({
      id: "research",
      title: "Research",
      links: [
        link(
          "/research/crm-pricing/",
          "CRM Pricing Benchmarks 2026",
          "Original catalogue analysis",
          true,
        ),
        link(
          "/research/crm-pricing-history/",
          "CRM pricing history",
          "Observation trail",
          true,
        ),
      ],
    });
  }

  // Phase 5: capped IMPROVE/noindex pages that still help buyers (not a crawl dump)
  const improveUseful = getGuides({ includeUnpublished: true })
    .filter(
      (g) =>
        g.categorySlugs.includes(categorySlug) &&
        !isEntityIndexable({ kind: "guide", entity: g }) &&
        (g.slug.startsWith("what-is-") ||
          g.slug.includes("how-to-choose") ||
          g.topicType === "feature-explainer" ||
          g.topicType === "buying-guide"),
    )
    .map((g) =>
      link(
        `/guides/${g.slug}/`,
        g.title,
        "Useful while we strengthen this page",
        false,
      ),
    )
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 3);
  if (improveUseful.length) {
    sections.push({
      id: "most_useful_guides",
      title: "Also useful",
      links: improveUseful,
    });
  }

  return sections;
}
