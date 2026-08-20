import { getCategoryDefinitionSeed } from "@/data/category-onboarding/seed";
import {
  CATEGORY_TOOL_META,
  categoryBestHref,
  categoryHubHref,
  categoryToolHref,
  integrationOptionsFor,
  type NewToolCategorySlug,
} from "@/data/config/tools/category-tool-meta";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import type { FinderOption } from "@/components/finder/crm-finder-questions";

function toOptions(
  rows: Array<{ slug: string; name: string }>,
  limit?: number,
): FinderOption[] {
  const unique = new Map<string, FinderOption>();
  for (const row of rows) {
    if (!row.slug || unique.has(row.slug)) continue;
    unique.set(row.slug, { value: row.slug, label: row.name });
  }
  const options = [...unique.values()];
  return typeof limit === "number" ? options.slice(0, limit) : options;
}

export function buildCategoryFinderClientKit(
  slug: NewToolCategorySlug,
): CategoryFinderClientKit {
  const meta = CATEGORY_TOOL_META[slug];
  const definition = getCategoryDefinitionSeed(slug);
  const useCases = definition?.useCases ?? [];
  const features = definition?.features ?? [];

  const finderFeatures = features.filter((f) => f.finderRelevant);
  const capabilitySource =
    finderFeatures.length > 0
      ? finderFeatures
      : features.filter(
          (f) => f.importance === "core" || f.importance === "important",
        );

  return {
    categorySlug: slug,
    storageKey: `sg-${slug}-finder-v1`,
    title: `${meta.shortName} Finder`,
    productNoun: meta.productNoun,
    productNounPlural: meta.productNounPlural,
    shortName: meta.shortName,
    softwarePhrase: meta.softwarePhrase,
    estimatedMinutes: "2–3 minutes",
    finderHref: categoryToolHref(slug, "finder"),
    costHref: categoryToolHref(slug, "cost-calculator"),
    planSelectorHref: categoryToolHref(slug, "plan-selector"),
    requirementsHref: categoryToolHref(slug, "requirements-builder"),
    scorecardHref: categoryToolHref(slug, "vendor-scorecard"),
    rfpHref: categoryToolHref(slug, "rfp-builder"),
    demoHref: categoryToolHref(slug, "demo-checklist-builder"),
    readinessHref: categoryToolHref(slug, "readiness-assessment"),
    bestHref: categoryBestHref(slug),
    categoryHref: categoryHubHref(slug),
    useCaseOptions: toOptions(
      useCases.map((uc) => ({ slug: uc.slug, name: uc.name })),
      12,
    ),
    capabilityOptions: toOptions(
      capabilitySource.map((f) => ({ slug: f.slug, name: f.name })),
      16,
    ),
    integrationOptions: integrationOptionsFor(slug),
    matchCriteria: [
      { id: "business", label: "Business size" },
      { id: "team", label: "Team size" },
      { id: "goals", label: "Primary job" },
      { id: "features", label: "Capabilities" },
      { id: "integrations", label: "Integrations" },
      { id: "budget", label: "Budget" },
      { id: "setup", label: "Setup preference" },
    ],
    methodologyCriteria: (definition?.comparisonCriteria ?? [])
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, 10)
      .map((c) => ({
        slug: c.featureSlug ?? c.slug,
        label: c.name,
        defaultImportance:
          c.decisionImportance === "high"
            ? ("high" as const)
            : c.decisionImportance === "low"
              ? ("low" as const)
              : ("medium" as const),
      })),
  };
}
