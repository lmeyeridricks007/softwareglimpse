/**
 * Sales Intelligence Demo Checklist persistence.
 * Reuses CRM session schema + engines; separate localStorage key + SI seed content.
 */

import {
  SI_DEMO_CHECKLIST_STORAGE_KEY,
  CrmDemoChecklistSessionSchema,
  createEmptyCrmDemoChecklistSession,
  type CrmDemoChecklistDraft,
  type CrmDemoChecklistSession,
  type DemoWizardStep,
} from "@/domain";
import { DEMO_WIZARD_STEPS, newDemoId } from "./constants";
import {
  SI_DEFAULT_ADMIN_QUESTIONS,
  SI_DEFAULT_ADMIN_TASKS,
  SI_DEFAULT_COMMERCIAL_QUESTIONS,
  SI_DEFAULT_DATA_QUESTIONS,
  SI_DEFAULT_DEMO_GUIDELINES,
  SI_DEFAULT_EVALUATION_AREAS,
  SI_DEFAULT_FUNCTIONAL_QUESTIONS,
  SI_DEFAULT_INTEGRATION_CHECKS,
} from "./si-constants";
import { SI_DEMO_SCENARIO_TEMPLATES } from "./si-scenario-library";
import { touchCrmDemoChecklistSession } from "./persistence";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function createDefaultSiDemoDraft(): CrmDemoChecklistDraft {
  return {
    setup: {
      projectName: "",
      initiative: "",
      evaluationTeam: "",
      demoOwner: "",
      expectedVendors: undefined,
      durationOption: "90",
      customDurationMinutes: undefined,
      demoType: "shortlist",
      attendeeRoles: [],
      targetDecisionDate: "",
      notes: "",
    },
    evaluationAreas: SI_DEFAULT_EVALUATION_AREAS.map((area) => ({
      id: area.id,
      label: area.label,
      priority: "should-test" as const,
      custom: false,
    })),
    scenarios: SI_DEMO_SCENARIO_TEMPLATES.map((tmpl, index) => ({
      id: newDemoId("SCN"),
      name: tmpl.name,
      businessContext: tmpl.businessContext,
      persona: tmpl.persona,
      categoryId: tmpl.categoryId,
      startingState: tmpl.startingState,
      vendorTasks: [...tmpl.vendorTasks],
      expectedOutcome: tmpl.expectedOutcome,
      successCriteria: [...tmpl.successCriteria],
      evidenceRequired: [...tmpl.evidenceRequired],
      requirementIds: [],
      priority: tmpl.priority,
      estimatedMinutes: tmpl.estimatedMinutes,
      moderatorScript: tmpl.moderatorScript,
      notes: "",
      templateId: tmpl.id,
      sortOrder: index,
      included: true,
    })),
    questions: [
      ...SI_DEFAULT_FUNCTIONAL_QUESTIONS.map((q) => ({
        id: q.id,
        group: "functional" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
      ...SI_DEFAULT_ADMIN_QUESTIONS.map((q) => ({
        id: q.id,
        group: "administration" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
      ...SI_DEFAULT_DATA_QUESTIONS.map((q) => ({
        id: q.id,
        group: "data" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
    ],
    integrations: SI_DEFAULT_INTEGRATION_CHECKS.map((item) => ({
      id: item.id,
      integration: item.integration,
      required: false,
      delivery: "unknown" as const,
      demoRequested: true,
      testTask: item.testTask,
      evidenceRequired: "Live demonstration or explicit limitation statement",
      notes: "",
    })),
    adminTasks: SI_DEFAULT_ADMIN_TASKS.map((task) => ({
      ...task,
      included: true,
    })),
    commercialQuestions: SI_DEFAULT_COMMERCIAL_QUESTIONS.map((q) => ({
      id: q.id,
      topic: q.topic,
      question: q.question,
      included: true,
      notes: "",
    })),
    scoringRules: {
      methodology: "0-5",
      requireEvidenceStatus: true,
      separateVendorStated: true,
      mustHaveGatesEnabled: true,
      notes: "",
    },
    agenda: [],
    demoGuidelines: SI_DEFAULT_DEMO_GUIDELINES,
    importedRequirementIds: [],
    coverageDecisions: [],
    vendorEvaluations: [],
    activeVendorId: undefined,
  };
}

export function createSeededSiDemoChecklistSession(
  now: string = new Date().toISOString(),
): CrmDemoChecklistSession {
  const empty = createEmptyCrmDemoChecklistSession(now);
  return {
    ...empty,
    draft: createDefaultSiDemoDraft(),
  };
}

export function loadSiDemoChecklistSession(): CrmDemoChecklistSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(SI_DEMO_CHECKLIST_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmDemoChecklistSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveSiDemoChecklistSession(
  session: CrmDemoChecklistSession,
): void {
  if (!canUseStorage()) return;
  try {
    const next = CrmDemoChecklistSessionSchema.parse({
      ...session,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(SI_DEMO_CHECKLIST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function resetSiDemoChecklistSession(): CrmDemoChecklistSession {
  const next = createSeededSiDemoChecklistSession();
  if (canUseStorage()) {
    localStorage.setItem(SI_DEMO_CHECKLIST_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function touchSiDemoChecklistSession(
  session: CrmDemoChecklistSession,
  patch: Partial<CrmDemoChecklistSession> & {
    draft?: Partial<CrmDemoChecklistDraft>;
  },
): CrmDemoChecklistSession {
  return touchCrmDemoChecklistSession(session, patch);
}

export function setSiDemoWizardStep(
  session: CrmDemoChecklistSession,
  wizardStepId: DemoWizardStep,
): CrmDemoChecklistSession {
  const index = DEMO_WIZARD_STEPS.indexOf(
    wizardStepId === "results" ? "review" : wizardStepId,
  );
  return touchSiDemoChecklistSession(session, {
    wizardStepId,
    maxReachableStepIndex: Math.max(
      session.maxReachableStepIndex,
      Math.max(0, index),
    ),
  });
}

export { SI_DEMO_CHECKLIST_STORAGE_KEY };
