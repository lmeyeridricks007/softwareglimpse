#!/usr/bin/env npx tsx
/**
 * Remove link-injection edges already present in natural (builder) plans.
 * Fixes DUPLICATE_NAV / duplicate href at the data source.
 *
 *   npx tsx scripts/seo/prune-redundant-link-injections.ts
 *   npx tsx scripts/seo/prune-redundant-link-injections.ts --dry-run
 */
import {
  buildCategoryLinkPlan,
  buildComparisonLinkPlan,
  buildGuideLinkPlan,
  buildSoftwareLinkPlan,
} from "@/services/internal-linking/builders";
import { flattenPlanLinks } from "@/services/internal-linking/select";
import { getGuides } from "@/data/repositories/guides";
import { identityPath, normalizePath } from "@/seo/canonical";
import {
  dedupeInjectionEdges,
  pruneRedundantLinkInjections,
} from "@/services/seo/improve-linking/injection-store";
import { loadLinkInjections } from "@/services/internal-linking/link-injections";

const dryRun = process.argv.includes("--dry-run");

function naturalHas(fromPath: string, toPath: string): boolean {
  const prev = process.env.SG_SKIP_LINK_INJECTIONS;
  process.env.SG_SKIP_LINK_INJECTIONS = "1";
  try {
    const from = identityPath(fromPath);
    const to = normalizePath(toPath);
    if (from.startsWith("/guides/")) {
      const slug = from.replace(/^\/guides\/|\/$/g, "");
      const guide = getGuides({ includeUnpublished: true }).find(
        (g) => g.slug === slug,
      );
      if (!guide) return false;
      return flattenPlanLinks(buildGuideLinkPlan(guide)).some(
        (l) => l.href === to,
      );
    }
    if (from.startsWith("/software/")) {
      const slug = from.replace(/^\/software\/|\/$/g, "");
      const plan = buildSoftwareLinkPlan(slug);
      return Boolean(plan && flattenPlanLinks(plan).some((l) => l.href === to));
    }
    if (from.startsWith("/categories/")) {
      const slug = from.replace(/^\/categories\/|\/$/g, "");
      const plan = buildCategoryLinkPlan(slug);
      return Boolean(plan && flattenPlanLinks(plan).some((l) => l.href === to));
    }
    if (from.startsWith("/compare/")) {
      const slug = from.replace(/^\/compare\/|\/$/g, "");
      return flattenPlanLinks(
        buildComparisonLinkPlan({
          comparisonSlug: slug,
          title: slug,
          productSlugs: slug.split("-vs-").filter(Boolean),
        }),
      ).some((l) => l.href === to);
    }
    return false;
  } finally {
    if (prev === undefined) delete process.env.SG_SKIP_LINK_INJECTIONS;
    else process.env.SG_SKIP_LINK_INJECTIONS = prev;
  }
}

function main() {
  const before = loadLinkInjections().edges.length;
  const deduped = dedupeInjectionEdges(loadLinkInjections().edges);

  if (dryRun) {
    let redundant = 0;
    for (const e of deduped) {
      if (naturalHas(e.fromPath, e.toPath)) redundant += 1;
    }
    console.log(
      JSON.stringify(
        {
          dryRun: true,
          edgesBefore: before,
          afterPairDedupe: deduped.length,
          redundantVsNaturalPlan: redundant,
          wouldKeep: deduped.length - redundant,
        },
        null,
        2,
      ),
    );
    return;
  }

  const result = pruneRedundantLinkInjections(naturalHas);
  console.log(JSON.stringify(result, null, 2));
}

main();
