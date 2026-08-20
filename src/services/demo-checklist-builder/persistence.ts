import {
  CRM_DEMO_CHECKLIST_STORAGE_KEY,
  CrmDemoChecklistSessionSchema,
  createEmptyCrmDemoChecklistSession,
  type CrmDemoChecklistDraft,
  type CrmDemoChecklistSession,
  type DemoWizardStep,
} from "@/domain";
import {
  DEFAULT_ADMIN_QUESTIONS,
  DEFAULT_ADMIN_TASKS,
  DEFAULT_COMMERCIAL_QUESTIONS,
  DEFAULT_DATA_QUESTIONS,
  DEFAULT_DEMO_GUIDELINES,
  DEFAULT_EVALUATION_AREAS,
  DEFAULT_FUNCTIONAL_QUESTIONS,
  DEFAULT_INTEGRATION_CHECKS,
  DEMO_WIZARD_STEPS,
  newDemoId,
} from "./constants";
import { DEMO_SCENARIO_TEMPLATES } from "./scenario-library";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function createDefaultDemoDraft(): CrmDemoChecklistDraft {
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
    evaluationAreas: DEFAULT_EVALUATION_AREAS.map((area) => ({
      id: area.id,
      label: area.label,
      priority: "should-test" as const,
      custom: false,
    })),
    scenarios: DEMO_SCENARIO_TEMPLATES.map((tmpl, index) => ({
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
      ...DEFAULT_FUNCTIONAL_QUESTIONS.map((q) => ({
        id: q.id,
        group: "functional" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
      ...DEFAULT_ADMIN_QUESTIONS.map((q) => ({
        id: q.id,
        group: "administration" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
      ...DEFAULT_DATA_QUESTIONS.map((q) => ({
        id: q.id,
        group: "data" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
    ],
    integrations: DEFAULT_INTEGRATION_CHECKS.map((item) => ({
      id: item.id,
      integration: item.integration,
      required: false,
      delivery: "unknown" as const,
      demoRequested: true,
      testTask: item.testTask,
      evidenceRequired: "Live demonstration or explicit limitation statement",
      notes: "",
    })),
    adminTasks: DEFAULT_ADMIN_TASKS.map((task) => ({
      ...task,
      included: true,
    })),
    commercialQuestions: DEFAULT_COMMERCIAL_QUESTIONS.map((q) => ({
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
    demoGuidelines: DEFAULT_DEMO_GUIDELINES,
    importedRequirementIds: [],
    coverageDecisions: [],
    vendorEvaluations: [],
    activeVendorId: undefined,
  };
}

export function createSeededCrmDemoChecklistSession(
  now: string = new Date().toISOString(),
): CrmDemoChecklistSession {
  const empty = createEmptyCrmDemoChecklistSession(now);
  return {
    ...empty,
    draft: createDefaultDemoDraft(),
  };
}

export function loadCrmDemoChecklistSession(): CrmDemoChecklistSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(CRM_DEMO_CHECKLIST_STORAGE_KEY);
    if (!raw) return null;
    const parsed = CrmDemoChecklistSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCrmDemoChecklistSession(
  session: CrmDemoChecklistSession,
): void {
  if (!canUseStorage()) return;
  try {
    const next = CrmDemoChecklistSessionSchema.parse({
      ...session,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(CRM_DEMO_CHECKLIST_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private mode failures — UI still works in-memory.
  }
}

export function resetCrmDemoChecklistSession(): CrmDemoChecklistSession {
  const next = createSeededCrmDemoChecklistSession();
  if (canUseStorage()) {
    localStorage.setItem(CRM_DEMO_CHECKLIST_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function touchCrmDemoChecklistSession(
  session: CrmDemoChecklistSession,
  patch: Partial<CrmDemoChecklistSession> & {
    draft?: Partial<CrmDemoChecklistDraft>;
  },
): CrmDemoChecklistSession {
  const now = new Date().toISOString();
  return CrmDemoChecklistSessionSchema.parse({
    ...session,
    ...patch,
    draft: patch.draft
      ? { ...session.draft, ...patch.draft }
      : session.draft,
    updatedAt: now,
  });
}

export function setDemoWizardStep(
  session: CrmDemoChecklistSession,
  wizardStepId: DemoWizardStep,
): CrmDemoChecklistSession {
  const index = DEMO_WIZARD_STEPS.indexOf(
    wizardStepId === "results" ? "review" : wizardStepId,
  );
  return touchCrmDemoChecklistSession(session, {
    wizardStepId,
    maxReachableStepIndex: Math.max(
      session.maxReachableStepIndex,
      Math.max(0, index),
    ),
  });
}

export { CRM_DEMO_CHECKLIST_STORAGE_KEY };
