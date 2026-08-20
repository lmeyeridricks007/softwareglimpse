import type {
  CriterionImportance,
  DecisionProfile,
  ScorecardCriterion,
} from "@/domain";
import {
  IMPORTANCE_WEIGHT,
  normalizeCriterionWeights,
} from "@/domain/schemas/vendor-scorecard";

/**
 * Sales Intelligence scorecard criteria.
 * Prefer editorial methodology slugs where research cells can resolve;
 * additional SI-specific slugs stay evidence-empty until assessed.
 */
export const SI_METHODOLOGY_CRITERIA = [
  {
    slug: "contact-data",
    label: "Contact data coverage",
    defaultImportance: "critical" as CriterionImportance,
  },
  {
    slug: "data-accuracy",
    label: "Data accuracy / verification",
    defaultImportance: "critical" as CriterionImportance,
  },
  {
    slug: "data-enrichment",
    label: "Enrichment depth",
    defaultImportance: "high" as CriterionImportance,
  },
  {
    slug: "crm-sync",
    label: "CRM sync quality",
    defaultImportance: "high" as CriterionImportance,
  },
  {
    slug: "credit-transparency",
    label: "Credit / pricing transparency",
    defaultImportance: "high" as CriterionImportance,
  },
  {
    slug: "compliance",
    label: "Compliance",
    defaultImportance: "high" as CriterionImportance,
  },
  {
    slug: "ease-of-use",
    label: "Ease of use",
    defaultImportance: "medium" as CriterionImportance,
  },
  {
    slug: "email-outreach",
    label: "Outreach / engagement",
    defaultImportance: "medium" as CriterionImportance,
  },
  {
    slug: "integrations",
    label: "Integrations",
    defaultImportance: "medium" as CriterionImportance,
  },
] as const;

/** SI capability / use-case slug → scorecard criterion slug. */
export const SI_CAPABILITY_TO_CRITERION: Record<string, string> = {
  "contact-data": "contact-data",
  enrichment: "data-enrichment",
  "data-enrichment": "data-enrichment",
  "intent-signals": "data-enrichment",
  "crm-sync": "crm-sync",
  "outreach-execution": "email-outreach",
  prospecting: "contact-data",
  integrations: "integrations",
  "ease-of-use": "ease-of-use",
  compliance: "compliance",
  "credit-transparency": "credit-transparency",
  "data-accuracy": "data-accuracy",
  "value-for-money": "credit-transparency",
};

const CAPABILITY_PRIORITY_TO_IMPORTANCE: Record<string, CriterionImportance> = {
  critical: "critical",
  high: "high",
  important: "medium",
  optional: "low",
};

function bumpImportance(
  a: CriterionImportance,
  b: CriterionImportance,
): CriterionImportance {
  return IMPORTANCE_WEIGHT[a] >= IMPORTANCE_WEIGHT[b] ? a : b;
}

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Generate SI scorecard criteria from a decision profile (or SI defaults).
 * Does not invent product scores — only structures what to evaluate.
 */
export function generateSiCriteriaFromProfile(
  profile: DecisionProfile | null,
): ScorecardCriterion[] {
  if (!profile || profile.categorySlug !== "sales-intelligence") {
    return normalizeCriterionWeights(
      SI_METHODOLOGY_CRITERIA.map((c) => ({
        id: `meth-${c.slug}`,
        type: "methodology" as const,
        sourceId: c.slug,
        label: c.label,
        importance: c.defaultImportance,
      })),
    );
  }

  const byCriterion = new Map<
    string,
    { label: string; importance: CriterionImportance }
  >();

  for (const cap of profile.capabilities) {
    const criterionSlug = SI_CAPABILITY_TO_CRITERION[cap.id] ?? cap.id;
    const meta = SI_METHODOLOGY_CRITERIA.find((c) => c.slug === criterionSlug);
    const label = meta?.label ?? humanize(criterionSlug);
    const importance =
      CAPABILITY_PRIORITY_TO_IMPORTANCE[cap.priority] ?? "medium";
    const existing = byCriterion.get(criterionSlug);
    if (!existing) {
      byCriterion.set(criterionSlug, { label, importance });
    } else {
      byCriterion.set(criterionSlug, {
        label: existing.label,
        importance: bumpImportance(existing.importance, importance),
      });
    }
  }

  if (byCriterion.size < 3) {
    for (const def of SI_METHODOLOGY_CRITERIA) {
      if (!byCriterion.has(def.slug)) {
        byCriterion.set(def.slug, {
          label: def.label,
          importance: def.defaultImportance,
        });
      }
    }
  }

  const costImportance: CriterionImportance =
    profile.budget.band != null
      ? profile.budget.band === "under-15" || profile.budget.band === "15-30"
        ? "high"
        : "medium"
      : "high";
  byCriterion.set("credit-transparency", {
    label: "Credit / pricing transparency",
    importance: costImportance,
  });

  if (
    profile.implementation.complexity ||
    profile.implementation.adminComplexity
  ) {
    byCriterion.set("ease-of-use", {
      label: "Ease of use",
      importance: bumpImportance(
        byCriterion.get("ease-of-use")?.importance ?? "medium",
        "high",
      ),
    });
  }

  const criteria: ScorecardCriterion[] = [...byCriterion.entries()].map(
    ([slug, row]) => ({
      id: `meth-${slug}`,
      type:
        slug === "credit-transparency" ? ("cost" as const) : ("methodology" as const),
      sourceId: slug,
      label: row.label,
      importance: row.importance,
    }),
  );

  const order = new Map<string, number>(
    SI_METHODOLOGY_CRITERIA.map((c, i) => [c.slug, i]),
  );
  criteria.sort(
    (a, b) =>
      (order.get(a.sourceId ?? "") ?? 99) - (order.get(b.sourceId ?? "") ?? 99),
  );

  return normalizeCriterionWeights(criteria);
}
