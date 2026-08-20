import {
  ADOPTION_QUESTIONS,
  CRM_ADOPTION_HEALTH_STORAGE_KEY,
  CRM_ADOPTION_HEALTH_VERSION,
  type AdoptionAnswer,
} from "./catalog";

export type AdoptionHealthSession = {
  version: typeof CRM_ADOPTION_HEALTH_VERSION;
  answers: Partial<Record<string, AdoptionAnswer>>;
  updatedAt: string;
};

function emptySession(): AdoptionHealthSession {
  return {
    version: CRM_ADOPTION_HEALTH_VERSION,
    answers: {},
    updatedAt: new Date().toISOString(),
  };
}

export function loadAdoptionHealthSession(): AdoptionHealthSession {
  if (typeof window === "undefined") return emptySession();
  try {
    const raw = window.localStorage.getItem(CRM_ADOPTION_HEALTH_STORAGE_KEY);
    if (!raw) return emptySession();
    const parsed = JSON.parse(raw) as AdoptionHealthSession;
    if (parsed.version !== CRM_ADOPTION_HEALTH_VERSION) return emptySession();
    return {
      version: CRM_ADOPTION_HEALTH_VERSION,
      answers: parsed.answers ?? {},
      updatedAt: parsed.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return emptySession();
  }
}

export function saveAdoptionHealthSession(
  session: AdoptionHealthSession,
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    CRM_ADOPTION_HEALTH_STORAGE_KEY,
    JSON.stringify({ ...session, updatedAt: new Date().toISOString() }),
  );
}

export function resetAdoptionHealthSession(): AdoptionHealthSession {
  const next = emptySession();
  saveAdoptionHealthSession(next);
  return next;
}

export function unansweredCount(
  answers: Partial<Record<string, AdoptionAnswer>>,
): number {
  return ADOPTION_QUESTIONS.filter((q) => !answers[q.id]).length;
}
