import {
  CRM_READINESS_STORAGE_KEY,
  CrmReadinessSessionSchema,
  createEmptyCrmReadinessSession,
  type CrmReadinessSession,
  type ReadinessAnswer,
  type ReadinessAnswerValue,
  type ReadinessSnapshot,
  type ReadinessWizardStep,
} from "@/domain";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadCrmReadinessSession(): CrmReadinessSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(CRM_READINESS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmReadinessSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCrmReadinessSession(session: CrmReadinessSession): void {
  if (!canUseStorage()) return;
  try {
    const next = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CRM_READINESS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota / private mode — fail soft
  }
}

export function resetCrmReadinessSession(): CrmReadinessSession {
  const empty = createEmptyCrmReadinessSession();
  if (canUseStorage()) {
    try {
      localStorage.removeItem(CRM_READINESS_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return empty;
}

export function touchCrmReadinessSession(
  session: CrmReadinessSession,
  patch: Partial<CrmReadinessSession>,
): CrmReadinessSession {
  return {
    ...session,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
}

export function setAnswer(
  session: CrmReadinessSession,
  questionId: string,
  value: ReadinessAnswerValue,
  source: ReadinessAnswer["source"] = "user",
): CrmReadinessSession {
  const now = new Date().toISOString();
  return {
    ...session,
    answers: {
      ...session.answers,
      [questionId]: {
        questionId,
        value,
        source,
        updatedAt: now,
      },
    },
    updatedAt: now,
  };
}

export function setWizardStep(
  session: CrmReadinessSession,
  wizardStep: ReadinessWizardStep,
): CrmReadinessSession {
  return touchCrmReadinessSession(session, { wizardStep });
}

export function completeAssessment(
  session: CrmReadinessSession,
  snapshot: ReadinessSnapshot,
): CrmReadinessSession {
  const now = new Date().toISOString();
  return {
    ...session,
    status: "completed",
    wizardStep: "results",
    completedAt: now,
    updatedAt: now,
    previousResult: session.lastResult,
    lastResult: snapshot,
  };
}

export function startReassessment(
  session: CrmReadinessSession,
): CrmReadinessSession {
  const now = new Date().toISOString();
  return {
    ...createEmptyCrmReadinessSession(now),
    id: session.id,
    previousResult: session.lastResult ?? session.previousResult,
    context: session.context,
    wizardStep: "context",
  };
}
