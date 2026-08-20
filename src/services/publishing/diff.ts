/**
 * Basic structural diff between two version JSON summaries
 * (keys / sections / scores).
 */

export type VersionSummary = {
  sections?: string[];
  scores?: Record<string, number | string>;
  [key: string]: unknown;
};

export type StructuralDiff = {
  addedKeys: string[];
  removedKeys: string[];
  changedKeys: string[];
  sectionsAdded: string[];
  sectionsRemoved: string[];
  scoresChanged: string[];
};

export function diffVersionSummaries(
  before: VersionSummary | null | undefined,
  after: VersionSummary | null | undefined,
): StructuralDiff {
  const a = before ?? {};
  const b = after ?? {};
  const keysA = new Set(Object.keys(a));
  const keysB = new Set(Object.keys(b));

  const addedKeys = [...keysB].filter((k) => !keysA.has(k));
  const removedKeys = [...keysA].filter((k) => !keysB.has(k));
  const changedKeys: string[] = [];
  for (const key of keysA) {
    if (!keysB.has(key)) continue;
    if (key === "sections" || key === "scores") continue;
    if (JSON.stringify(a[key]) !== JSON.stringify(b[key])) {
      changedKeys.push(key);
    }
  }

  const sectionsA = new Set(
    Array.isArray(a.sections) ? a.sections.map(String) : [],
  );
  const sectionsB = new Set(
    Array.isArray(b.sections) ? b.sections.map(String) : [],
  );
  const sectionsAdded = [...sectionsB].filter((s) => !sectionsA.has(s));
  const sectionsRemoved = [...sectionsA].filter((s) => !sectionsB.has(s));

  const scoresA = (a.scores ?? {}) as Record<string, unknown>;
  const scoresB = (b.scores ?? {}) as Record<string, unknown>;
  const scoreKeys = new Set([...Object.keys(scoresA), ...Object.keys(scoresB)]);
  const scoresChanged: string[] = [];
  for (const key of scoreKeys) {
    if (JSON.stringify(scoresA[key]) !== JSON.stringify(scoresB[key])) {
      scoresChanged.push(key);
    }
  }

  return {
    addedKeys,
    removedKeys,
    changedKeys,
    sectionsAdded,
    sectionsRemoved,
    scoresChanged,
  };
}
