import type {
  CriterionImportance,
  DecisionProfile,
  ScorecardCriterion,
} from "@/domain";
import { normalizeCriterionWeights } from "@/domain/schemas/vendor-scorecard";

export type CategoryMethodologyCriterion = {
  slug: string;
  label: string;
  defaultImportance: CriterionImportance;
};

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Scorecard criteria from a category methodology list + optional decision profile.
 * Does not invent product scores.
 */
export function generateCategoryCriteriaFromProfile(
  profile: DecisionProfile | null,
  methodology: CategoryMethodologyCriterion[],
): ScorecardCriterion[] {
  const defaults = methodology.map((c) => ({
    id: `meth-${c.slug}`,
    type: "methodology" as const,
    sourceId: c.slug,
    label: c.label,
    importance: c.defaultImportance,
  }));

  if (!profile || methodology.length === 0) {
    return normalizeCriterionWeights(defaults);
  }

  const byCriterion = new Map<
    string,
    { label: string; importance: CriterionImportance }
  >();

  for (const feature of profile.features) {
    const meta = methodology.find((c) => c.slug === feature.id);
    const slug = meta?.slug ?? feature.id;
    const label = meta?.label ?? humanize(slug);
    const importance: CriterionImportance =
      feature.priority === "must-have"
        ? "critical"
        : feature.priority === "important"
          ? "high"
          : "medium";
    byCriterion.set(slug, { label, importance });
  }

  if (byCriterion.size < 3) {
    for (const def of methodology) {
      if (!byCriterion.has(def.slug)) {
        byCriterion.set(def.slug, {
          label: def.label,
          importance: def.defaultImportance,
        });
      }
    }
  }

  byCriterion.set("value-for-money", {
    label: "Cost / value",
    importance:
      profile.budget.band === "under-15" || profile.budget.band === "15-30"
        ? "high"
        : "medium",
  });

  const criteria: ScorecardCriterion[] = [...byCriterion.entries()].map(
    ([slug, row]) => ({
      id: `meth-${slug}`,
      type: slug === "value-for-money" ? ("cost" as const) : ("methodology" as const),
      sourceId: slug,
      label: row.label,
      importance: row.importance,
    }),
  );

  const order = new Map(methodology.map((c, i) => [c.slug, i]));
  criteria.sort(
    (a, b) =>
      (order.get(a.sourceId ?? "") ?? 99) - (order.get(b.sourceId ?? "") ?? 99),
  );

  return normalizeCriterionWeights(criteria);
}
