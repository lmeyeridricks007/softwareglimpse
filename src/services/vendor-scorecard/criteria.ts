import type {
  CriterionImportance,
  CrmDecisionProfile,
  ScorecardCriterion,
} from "@/domain";
import {
  IMPORTANCE_WEIGHT,
  normalizeCriterionWeights,
} from "@/domain/schemas/vendor-scorecard";

/**
 * Map CRM methodology / capability slugs used in scorecards.
 * Research cells resolve via ProductEditorialAssessment.criterionAssessments.
 */
export const CRM_METHODOLOGY_CRITERIA = [
  {
    slug: "pipeline-management",
    label: "Pipeline management",
    defaultImportance: "critical" as CriterionImportance,
  },
  {
    slug: "sales-automation",
    label: "Workflow automation",
    defaultImportance: "high" as CriterionImportance,
  },
  {
    slug: "reporting",
    label: "Reporting & analytics",
    defaultImportance: "high" as CriterionImportance,
  },
  {
    slug: "integrations",
    label: "Integrations",
    defaultImportance: "medium" as CriterionImportance,
  },
  {
    slug: "ease-of-use",
    label: "Ease of use",
    defaultImportance: "medium" as CriterionImportance,
  },
  {
    slug: "customization",
    label: "Customization",
    defaultImportance: "medium" as CriterionImportance,
  },
  {
    slug: "administration-overhead",
    label: "Security & administration",
    defaultImportance: "high" as CriterionImportance,
  },
  {
    slug: "value-for-money",
    label: "Cost / value",
    defaultImportance: "medium" as CriterionImportance,
  },
] as const;

/** Capability / use-case slug → methodology criterion slug. */
export const CAPABILITY_TO_CRITERION: Record<string, string> = {
  "pipeline-management": "pipeline-management",
  "deal-management": "pipeline-management",
  "contact-management": "ease-of-use",
  "relationship-management": "ease-of-use",
  "sales-automation": "sales-automation",
  "workflow-automation": "sales-automation",
  reporting: "reporting",
  forecasting: "reporting",
  analytics: "reporting",
  integrations: "integrations",
  "email-capabilities": "email-capabilities",
  "email-sync": "email-capabilities",
  customization: "customization",
  "custom-fields": "customization",
  "custom-pipelines": "pipeline-management",
  administration: "administration-overhead",
  security: "administration-overhead",
  scalability: "scalability",
  "ease-of-use": "ease-of-use",
};

const CAPABILITY_PRIORITY_TO_IMPORTANCE: Record<string, CriterionImportance> = {
  critical: "critical",
  high: "high",
  important: "medium",
  optional: "low",
};

const REQUIREMENT_PRIORITY_TO_IMPORTANCE: Record<string, CriterionImportance> =
  {
    "must-have": "critical",
    important: "high",
    "nice-to-have": "low",
    "not-needed": "ignore",
  };

function bumpImportance(
  a: CriterionImportance,
  b: CriterionImportance,
): CriterionImportance {
  return IMPORTANCE_WEIGHT[a] >= IMPORTANCE_WEIGHT[b] ? a : b;
}

/**
 * Generate scorecard criteria from a decision profile (or defaults).
 * Does not invent product scores — only structures what to evaluate.
 */
export function generateCriteriaFromProfile(
  profile: CrmDecisionProfile | null,
): ScorecardCriterion[] {
  if (!profile) {
    return normalizeCriterionWeights(
      CRM_METHODOLOGY_CRITERIA.map((c) => ({
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
    const criterionSlug = CAPABILITY_TO_CRITERION[cap.id] ?? cap.id;
    const meta = CRM_METHODOLOGY_CRITERIA.find((c) => c.slug === criterionSlug);
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

  // Derive soft weights from requirement priorities → related capabilities
  // when capabilities are sparse.
  if (byCriterion.size < 3) {
    for (const def of CRM_METHODOLOGY_CRITERIA) {
      if (!byCriterion.has(def.slug)) {
        byCriterion.set(def.slug, {
          label: def.label,
          importance: def.defaultImportance,
        });
      }
    }
  }

  // Raise importance when many must-have features cluster under a criterion
  const mustHaveCount = profile.features.filter(
    (f) => f.priority === "must-have",
  ).length;
  const importantCount = profile.features.filter(
    (f) => f.priority === "important",
  ).length;
  if (mustHaveCount >= 3) {
    for (const [slug, row] of byCriterion) {
      if (slug === "pipeline-management" || slug === "sales-automation") {
        byCriterion.set(slug, {
          ...row,
          importance: bumpImportance(row.importance, "critical"),
        });
      }
    }
  }
  if (importantCount >= 4) {
    const reporting = byCriterion.get("reporting");
    if (reporting) {
      byCriterion.set("reporting", {
        ...reporting,
        importance: bumpImportance(reporting.importance, "high"),
      });
    }
  }

  // Cost criterion from budget preference
  const costImportance: CriterionImportance =
    profile.budget.band != null
      ? profile.budget.band === "under-15" || profile.budget.band === "15-30"
        ? "high"
        : "medium"
      : "medium";
  byCriterion.set("value-for-money", {
    label: "Cost / value",
    importance: costImportance,
  });

  // Implementation preferences
  if (
    profile.implementation.complexity ||
    profile.implementation.adminComplexity ||
    profile.implementation.migrationComplexity
  ) {
    const implImportance =
      profile.implementation.complexity === "easy-setup" ||
      profile.implementation.adminComplexity === "simple"
        ? "high"
        : "medium";
    byCriterion.set("ease-of-use", {
      label: "Ease of use",
      importance: bumpImportance(
        byCriterion.get("ease-of-use")?.importance ?? "medium",
        implImportance,
      ),
    });
    byCriterion.set("administration-overhead", {
      label: "Security & administration",
      importance: bumpImportance(
        byCriterion.get("administration-overhead")?.importance ?? "medium",
        implImportance,
      ),
    });
  }

  // Soft signal from requirements priorities (display only — still methodology-backed)
  for (const req of profile.requirements) {
    if (req.priority === "not-needed") continue;
    const importance = REQUIREMENT_PRIORITY_TO_IMPORTANCE[req.priority];
    // Requirements don't invent new methodology rows; they can only bump existing.
    void importance;
  }

  const criteria: ScorecardCriterion[] = [...byCriterion.entries()].map(
    ([slug, row]) => ({
      id: `meth-${slug}`,
      type: slug === "value-for-money" ? ("cost" as const) : ("methodology" as const),
      sourceId: slug,
      label: row.label,
      importance: row.importance,
    }),
  );

  // Stable display order matching methodology defaults
  const order = new Map<string, number>(
    CRM_METHODOLOGY_CRITERIA.map((c, i) => [c.slug, i]),
  );
  criteria.sort(
    (a, b) =>
      (order.get(a.sourceId ?? "") ?? 99) - (order.get(b.sourceId ?? "") ?? 99),
  );

  return normalizeCriterionWeights(criteria);
}

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function applyImportance(
  criteria: ScorecardCriterion[],
  criterionId: string,
  importance: CriterionImportance,
): ScorecardCriterion[] {
  return normalizeCriterionWeights(
    criteria.map((c) =>
      c.id === criterionId ? { ...c, importance } : c,
    ),
  );
}
