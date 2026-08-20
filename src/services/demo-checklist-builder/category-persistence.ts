import {
  CrmDemoChecklistSessionSchema,
  createEmptyCrmDemoChecklistSession,
  demoChecklistStorageKey,
  type CrmDemoChecklistDraft,
  type CrmDemoChecklistSession,
} from "@/domain";
import { getCategoryContentPack } from "@/data/config/tools/category-content-packs";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import { newDemoId } from "./constants";
import { touchCrmDemoChecklistSession } from "./persistence";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function createCategoryDemoDraft(
  kit: CategoryFinderClientKit,
): CrmDemoChecklistDraft {
  const pack = getCategoryContentPack(kit.categorySlug)?.demo;

  const evaluationAreas = (pack?.evaluationAreas ?? []).map((area) => ({
    id: area.id,
    label: area.label,
    priority: "should-test" as const,
    custom: false,
  }));

  const scenarios = (pack?.scenarios ?? []).map((template, index) => ({
    id: newDemoId("SCN"),
    name: template.name,
    businessContext: template.businessContext,
    persona: template.persona,
    categoryId: template.categoryId,
    startingState: template.startingState,
    vendorTasks: [...template.vendorTasks],
    expectedOutcome: template.expectedOutcome,
    successCriteria: [...template.successCriteria],
    evidenceRequired: [...template.evidenceRequired],
    requirementIds: [],
    priority: template.priority,
    estimatedMinutes: template.estimatedMinutes,
    moderatorScript: template.moderatorScript,
    notes: "",
    templateId: template.id,
    sortOrder: index,
    included: true,
  }));

  const integrations = (pack?.integrationChecks ?? []).map((item) => ({
    id: item.id,
    integration: item.integration,
    required: item.required ?? false,
    delivery: "unknown" as const,
    demoRequested: true,
    testTask: item.testTask,
    evidenceRequired: "Live demonstration or explicit limitation statement",
    notes: "",
  }));

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
    evaluationAreas:
      evaluationAreas.length > 0
        ? evaluationAreas
        : [
            {
              id: "core",
              label: `${kit.shortName} core workflows`,
              priority: "should-test" as const,
              custom: false,
            },
          ],
    scenarios,
    questions: [
      ...(pack?.functionalQuestions ?? []).map((q) => ({
        id: q.id,
        group: "functional" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
      ...(pack?.adminQuestions ?? []).map((q) => ({
        id: q.id,
        group: "administration" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
      ...(pack?.dataQuestions ?? []).map((q) => ({
        id: q.id,
        group: "data" as const,
        question: q.question,
        included: true,
        askDontDemo: false,
        notes: "",
      })),
    ],
    integrations,
    adminTasks: (pack?.adminTasks ?? []).map((task) => ({
      ...task,
      included: true,
    })),
    commercialQuestions: (pack?.commercialQuestions ?? []).map((q) => ({
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
    demoGuidelines: pack?.guidelines ?? `DEMO GUIDELINES — ${kit.shortName.toUpperCase()}

Please use the scenarios provided. Prefer a standard product environment.
If a requested capability cannot be demonstrated, state that rather than substituting a different workflow.
The buyer owns the demo agenda.`,
    importedRequirementIds: [],
    coverageDecisions: [],
    vendorEvaluations: [],
    activeVendorId: undefined,
  };
}

export function createSeededCategoryDemoSession(
  kit: CategoryFinderClientKit,
  now: string = new Date().toISOString(),
): CrmDemoChecklistSession {
  const empty = createEmptyCrmDemoChecklistSession(now);
  return {
    ...empty,
    draft: createCategoryDemoDraft(kit),
  };
}

export function loadCategoryDemoSession(
  categorySlug: string,
): CrmDemoChecklistSession | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(demoChecklistStorageKey(categorySlug));
    if (!raw) return null;
    const parsed = CrmDemoChecklistSessionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveCategoryDemoSession(
  categorySlug: string,
  session: CrmDemoChecklistSession,
): void {
  if (!canUseStorage()) return;
  try {
    const next = CrmDemoChecklistSessionSchema.parse({
      ...session,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      demoChecklistStorageKey(categorySlug),
      JSON.stringify(next),
    );
  } catch {
    // Quota / private mode — fail soft
  }
}

export function resetCategoryDemoSession(
  kit: CategoryFinderClientKit,
): CrmDemoChecklistSession {
  const next = createSeededCategoryDemoSession(kit);
  if (canUseStorage()) {
    localStorage.setItem(
      demoChecklistStorageKey(kit.categorySlug),
      JSON.stringify(next),
    );
  }
  return next;
}

export { touchCrmDemoChecklistSession as touchCategoryDemoSession };
