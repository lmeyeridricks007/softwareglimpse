import type { FactConflict, ResearchFact, ResearchSource } from "@/domain";
import { getSourcePriority } from "@/domain/schemas/research-source";
import { nowIso } from "./utils";

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

/**
 * Detects conflicting values for the same field across facts.
 * Does not silently pick a winner — opens a conflict for review,
 * optionally suggesting a preferred fact via source priority.
 */
export function detectConflicts(
  facts: ResearchFact[],
  sources: ResearchSource[],
): FactConflict[] {
  const byField = new Map<string, ResearchFact[]>();
  for (const fact of facts) {
    if (fact.status === "rejected") continue;
    const list = byField.get(fact.field) ?? [];
    list.push(fact);
    byField.set(fact.field, list);
  }

  const conflicts: FactConflict[] = [];
  for (const [field, group] of byField) {
    const unique = new Map<string, ResearchFact>();
    for (const fact of group) {
      unique.set(stableStringify(fact.value), fact);
    }
    if (unique.size <= 1) continue;

    const preferred = preferBySourcePriority([...unique.values()], sources);
    conflicts.push({
      id: `conflict-${group[0].productSlug}-${field}`,
      productSlug: group[0].productSlug,
      field,
      factIds: group.map((f) => f.id),
      status: preferred ? "open" : "open",
      preferredFactId: preferred?.id,
      notes: preferred
        ? `Suggested by source priority: ${preferred.id}. Manual review still required.`
        : "Conflicting values require review.",
      detectedAt: nowIso(),
    });
  }

  return conflicts;
}

export function preferBySourcePriority(
  facts: ResearchFact[],
  sources: ResearchSource[],
): ResearchFact | undefined {
  const scored = facts.map((fact) => {
    const sourceScores = fact.sourceIds.map((id) => {
      const source = sources.find((s) => s.id === id);
      if (!source) return 999;
      return getSourcePriority(source.sourceType);
    });
    const best = Math.min(...sourceScores);
    return { fact, best };
  });

  scored.sort((a, b) => a.best - b.best);
  if (scored.length < 2) return scored[0]?.fact;

  // If top priority is fixture and another isn't, prefer non-fixture
  const nonFixture = scored.find((s) => !s.fact.isFixture);
  if (scored[0].fact.isFixture && nonFixture) return nonFixture.fact;

  // Tie on priority → no silent winner
  if (scored[0].best === scored[1].best) return undefined;
  return scored[0].fact;
}

export function markConflictedFacts(
  facts: ResearchFact[],
  conflicts: FactConflict[],
): ResearchFact[] {
  const conflicted = new Set(conflicts.flatMap((c) => c.factIds));
  return facts.map((fact) =>
    conflicted.has(fact.id) ? { ...fact, status: "conflict" as const } : fact,
  );
}
