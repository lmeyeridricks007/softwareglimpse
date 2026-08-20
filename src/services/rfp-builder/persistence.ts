import {
  CRM_RFP_STORAGE_KEY,
  CrmRfpSessionSchema,
  createEmptyCrmRfpSession,
  type CrmRfpDraft,
  type CrmRfpSession,
  type RfpWizardStep,
} from "@/domain";
import {
  DEFAULT_IMPLEMENTATION_QUESTIONS,
  DEFAULT_RESPONSE_RULES,
  DEFAULT_SECURITY_LIBRARY,
  DEFAULT_SUPPORT_TOPICS,
  DEFAULT_TIMELINE_PHASES,
  newRfpId,
} from "./constants";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function createDefaultDraft(): CrmRfpDraft {
  return {
    project: {
      projectName: "",
      organization: "",
      owner: "",
      executiveSponsor: "",
      primaryVendorContact: "",
      issueDate: "",
      responseDeadline: "",
      decisionDate: "",
      goLiveDate: "",
      currentCrm: "",
      geography: "",
      currency: "EUR",
      vendorsExpected: undefined,
    },
    businessContext: {
      currentSituation: "",
      businessProblem: "",
      changeTriggers: [],
      desiredFutureState: "",
      successOutcomes: "",
    },
    objectives: [],
    scope: [],
    users: { groups: [] },
    requirements: [],
    integrations: [],
    migration: { objects: [], constraints: "" },
    implementation: {
      questions: DEFAULT_IMPLEMENTATION_QUESTIONS.map((q) => ({
        ...q,
        requested: true,
        notes: "",
      })),
      preferredGoLive: "",
      timelinePhases: DEFAULT_TIMELINE_PHASES.map((phase) => ({
        id: newRfpId("TL"),
        phase,
        durationRequested: true,
        dependenciesRequested: true,
        customerResourcesRequested: true,
      })),
      customRequirements: "",
    },
    securityQuestions: DEFAULT_SECURITY_LIBRARY.map((q) => ({
      ...q,
      required: false,
      evidenceRequested: false,
      comments: "",
    })),
    supportQuestions: DEFAULT_SUPPORT_TOPICS.map((q) => ({
      ...q,
      requested: false,
      notes: "",
    })),
    pricingAssumptions: {
      requiredAddOns: "",
      regions: "",
      supportTier: "",
      implementationScope: "",
      currency: "EUR",
      taxTreatment: "exclude",
    },
    responseRules: {
      rules: [...DEFAULT_RESPONSE_RULES],
      responseDeadline: "",
      questionsDeadline: "",
      contactPerson: "",
      contactEmail: "",
      submissionMethod: "",
      clarificationCallWindow: "",
    },
    clarifications: [],
    vendorTracker: [],
    vendorPackageNames: [],
  };
}

export function createSeededCrmRfpSession(
  now: string = new Date().toISOString(),
): CrmRfpSession {
  const empty = createEmptyCrmRfpSession(now);
  return {
    ...empty,
    draft: createDefaultDraft(),
  };
}

export function loadCrmRfpSession(): CrmRfpSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(CRM_RFP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmRfpSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCrmRfpSession(session: CrmRfpSession): void {
  if (!canUseStorage()) return;
  try {
    const next = CrmRfpSessionSchema.parse({
      ...session,
      updatedAt: new Date().toISOString(),
      versionMeta: {
        ...session.versionMeta,
        lastModifiedAt: new Date().toISOString(),
      },
    });
    localStorage.setItem(CRM_RFP_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures — UI still works in-memory.
  }
}

export function resetCrmRfpSession(): CrmRfpSession {
  const next = createSeededCrmRfpSession();
  if (canUseStorage()) {
    localStorage.setItem(CRM_RFP_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function touchCrmRfpSession(
  session: CrmRfpSession,
  patch: Partial<CrmRfpSession> & { draft?: Partial<CrmRfpDraft> },
): CrmRfpSession {
  const now = new Date().toISOString();
  return CrmRfpSessionSchema.parse({
    ...session,
    ...patch,
    draft: patch.draft
      ? { ...session.draft, ...patch.draft }
      : session.draft,
    updatedAt: now,
    versionMeta: {
      ...session.versionMeta,
      ...(patch.versionMeta ?? {}),
      lastModifiedAt: now,
    },
  });
}

export function setWizardStep(
  session: CrmRfpSession,
  wizardStepId: RfpWizardStep,
): CrmRfpSession {
  return touchCrmRfpSession(session, { wizardStepId });
}

export { CRM_RFP_STORAGE_KEY };
