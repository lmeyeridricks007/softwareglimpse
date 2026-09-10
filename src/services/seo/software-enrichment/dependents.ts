import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getSoftwareBySlug,
} from "@/data";
import { getGuides } from "@/data/repositories/guides";
import type { DependentPageRef } from "./types";

/**
 * Downstream pages that depend on this software entity.
 */
export function listSoftwareDependents(slug: string): DependentPageRef[] {
  const out: DependentPageRef[] = [];

  for (const g of getGuides({ includeUnpublished: true })) {
    if ((g.productSlugs ?? []).includes(slug)) {
      out.push({
        kind: "guide",
        slug: g.slug,
        path: `/guides/${g.slug}/`,
      });
    }
  }

  for (const c of getAllComparisonsUnfiltered()) {
    if (c.productSlugs.includes(slug)) {
      out.push({
        kind: "comparison",
        slug: c.slug,
        path: `/compare/${c.slug}/`,
      });
    }
  }

  out.push({
    kind: "alternatives",
    slug,
    path: `/alternatives/${slug}/`,
  });

  out.push({
    kind: "pricing",
    slug,
    path: `/software/${slug}/pricing/`,
  });

  for (const best of getAllBestPagesUnfiltered()) {
    const hit =
      best.recommendations.some((r) => r.productSlug === slug) ||
      (best.useCaseRecommendations ?? []).some((r) => r.productSlug === slug);
    if (hit) {
      out.push({
        kind: "best",
        slug: best.slug,
        path: `/best/${best.slug}/`,
      });
    }
  }

  // Soft tool dependency — finder/cost calculator may reference category
  const soft = getSoftwareBySlug(slug);
  if (soft?.primaryCategorySlug) {
    out.push({
      kind: "tools",
      slug: `${soft.primaryCategorySlug}-cost-calculator`,
      path: `/tools/${soft.primaryCategorySlug}-cost-calculator/`,
    });
  }

  return out;
}

export function dependentCounts(slug: string): {
  total: number;
  guides: number;
  comparisons: number;
  best: number;
} {
  const deps = listSoftwareDependents(slug);
  return {
    total: deps.length,
    guides: deps.filter((d) => d.kind === "guide").length,
    comparisons: deps.filter((d) => d.kind === "comparison").length,
    best: deps.filter((d) => d.kind === "best").length,
  };
}
