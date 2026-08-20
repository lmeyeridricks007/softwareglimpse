/**
 * Sales Intelligence RFP / Vendor Brief persistence.
 * Reuses CRM session schema + engines; SI content pack for defaults.
 */

import {
  SI_RFP_STORAGE_KEY,
  CrmRfpSessionSchema,
  createEmptyCrmRfpSession,
  type CrmRfpDraft,
  type CrmRfpSession,
  type RfpWizardStep,
} from "@/domain";
import {
  DEFAULT_RESPONSE_RULES,
  DEFAULT_SUPPORT_TOPICS,
  DEFAULT_TIMELINE_PHASES,
  newRfpId,
} from "./constants";
import {
  SI_DEFAULT_IMPLEMENTATION_QUESTIONS,
  SI_DEFAULT_SECURITY_LIBRARY,
} from "./si-constants";
import { touchCrmRfpSession } from "./persistence";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function createDefaultSiRfpDraft(): CrmRfpDraft {
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
      questions: SI_DEFAULT_IMPLEMENTATION_QUESTIONS.map((q) => ({
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
    securityQuestions: SI_DEFAULT_SECURITY_LIBRARY.map((q) => ({
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

export function createSeededSiRfpSession(
  now: string = new Date().toISOString(),
): CrmRfpSession {
  const empty = createEmptyCrmRfpSession(now);
  return {
    ...empty,
    draft: createDefaultSiRfpDraft(),
  };
}

export function loadSiRfpSession(): CrmRfpSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(SI_RFP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmRfpSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveSiRfpSession(session: CrmRfpSession): void {
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
    localStorage.setItem(SI_RFP_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function resetSiRfpSession(): CrmRfpSession {
  const next = createSeededSiRfpSession();
  if (canUseStorage()) {
    localStorage.setItem(SI_RFP_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function touchSiRfpSession(
  session: CrmRfpSession,
  patch: Partial<CrmRfpSession> & { draft?: Partial<CrmRfpDraft> },
): CrmRfpSession {
  return touchCrmRfpSession(session, patch);
}

export function setSiWizardStep(
  session: CrmRfpSession,
  wizardStepId: RfpWizardStep,
): CrmRfpSession {
  return touchSiRfpSession(session, { wizardStepId });
}

export { SI_RFP_STORAGE_KEY };
