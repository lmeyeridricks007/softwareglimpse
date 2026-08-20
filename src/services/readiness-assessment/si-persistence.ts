/**
 * Sales Intelligence readiness persistence — same session shape, SI storage key.
 */

import {
  SI_READINESS_STORAGE_KEY,
  CrmReadinessSessionSchema,
  createEmptySiReadinessSession,
  type CrmReadinessSession,
  type ReadinessAnswerValue,
} from "@/domain";
import {
  setAnswer as setCrmAnswer,
  touchCrmReadinessSession,
  completeAssessment,
} from "./persistence";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadSiReadinessSession(): CrmReadinessSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(SI_READINESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmReadinessSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveSiReadinessSession(session: CrmReadinessSession): void {
  if (!canUseStorage()) return;
  try {
    const next = CrmReadinessSessionSchema.parse({
      ...session,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(SI_READINESS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function resetSiReadinessSession(): CrmReadinessSession {
  const empty = createEmptySiReadinessSession();
  if (canUseStorage()) {
    try {
      localStorage.removeItem(SI_READINESS_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return empty;
}

export function touchSiReadinessSession(
  session: CrmReadinessSession,
  patch: Partial<CrmReadinessSession>,
): CrmReadinessSession {
  return touchCrmReadinessSession(session, patch);
}

export function setSiAnswer(
  session: CrmReadinessSession,
  questionId: string,
  value: ReadinessAnswerValue,
  source: "user" | "decision-profile" | "requirements" | "imported" = "user",
): CrmReadinessSession {
  return setCrmAnswer(session, questionId, value, source);
}

export function startSiReassessment(
  session: CrmReadinessSession,
): CrmReadinessSession {
  const now = new Date().toISOString();
  return {
    ...createEmptySiReadinessSession(now),
    id: session.id,
    previousResult: session.lastResult ?? session.previousResult,
    context: session.context,
    wizardStep: "context",
  };
}

export {
  completeAssessment,
  SI_READINESS_STORAGE_KEY,
  createEmptySiReadinessSession,
};
