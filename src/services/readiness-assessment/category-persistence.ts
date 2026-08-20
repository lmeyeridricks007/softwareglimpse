import {
  CrmReadinessSessionSchema,
  createEmptyReadinessSession,
  readinessStorageKey,
  type CrmReadinessSession,
} from "@/domain";
import {
  completeAssessment,
  setAnswer,
  startReassessment,
  touchCrmReadinessSession,
} from "./persistence";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadCategoryReadinessSession(
  categorySlug: string,
): CrmReadinessSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(readinessStorageKey(categorySlug));
    if (!raw) return null;
    const parsed = CrmReadinessSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCategoryReadinessSession(
  categorySlug: string,
  session: CrmReadinessSession,
): void {
  if (!canUseStorage()) return;
  try {
    const next = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(readinessStorageKey(categorySlug), JSON.stringify(next));
  } catch {
    // Quota / private mode — fail soft
  }
}

export function resetCategoryReadinessSession(
  categorySlug: string,
): CrmReadinessSession {
  const empty = createEmptyReadinessSession(categorySlug);
  if (canUseStorage()) {
    try {
      localStorage.removeItem(readinessStorageKey(categorySlug));
    } catch {
      /* ignore */
    }
  }
  return empty;
}

export {
  completeAssessment,
  setAnswer,
  startReassessment,
  touchCrmReadinessSession as touchCategoryReadinessSession,
};
