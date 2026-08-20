import type {
  CrmDemoChecklistDraft,
  DemoAgendaBlock,
  DemoScenario,
} from "@/domain";
import { newDemoId, resolveDemoDurationMinutes } from "./constants";

export function includedScenarios(draft: CrmDemoChecklistDraft): DemoScenario[] {
  return [...draft.scenarios]
    .filter((s) => s.included)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function countDemoTasks(draft: CrmDemoChecklistDraft): number {
  const scenarioTasks = includedScenarios(draft).reduce(
    (sum, s) => sum + s.vendorTasks.filter((t) => t.trim()).length,
    0,
  );
  const adminTasks = draft.adminTasks.filter((t) => t.included).length;
  const integTasks = draft.integrations.filter((i) => i.demoRequested).length;
  return scenarioTasks + adminTasks + integTasks;
}

export function countMustHaveChecks(draft: CrmDemoChecklistDraft): number {
  const scenarios = includedScenarios(draft).filter(
    (s) => s.priority === "must-have",
  ).length;
  const admin = draft.adminTasks.filter(
    (t) => t.included && t.priority === "must-have",
  ).length;
  return scenarios + admin;
}

export function estimateScenarioMinutes(draft: CrmDemoChecklistDraft): number {
  return includedScenarios(draft).reduce(
    (sum, s) => sum + s.estimatedMinutes,
    0,
  );
}

export function estimateAdminMinutes(draft: CrmDemoChecklistDraft): number {
  return draft.adminTasks
    .filter((t) => t.included)
    .reduce((sum, t) => sum + t.estimatedMinutes, 0);
}

export function estimateIntegrationMinutes(
  draft: CrmDemoChecklistDraft,
): number {
  return draft.integrations.filter((i) => i.demoRequested).length * 4;
}

/** Prefer explicit agenda totals when present; otherwise derive from content. */
export function estimateAgendaMinutes(draft: CrmDemoChecklistDraft): number {
  const agendaBlocks = draft.agenda.filter((b) => b.included);
  if (agendaBlocks.length > 0) {
    return agendaBlocks.reduce((sum, b) => sum + b.minutes, 0);
  }
  return (
    5 + // intro
    estimateScenarioMinutes(draft) +
    estimateAdminMinutes(draft) +
    estimateIntegrationMinutes(draft) +
    7 // questions / wrap
  );
}

export type TimeBreakdown = {
  label: string;
  minutes: number;
  kind: DemoAgendaBlock["kind"];
};

export function buildTimeBreakdown(draft: CrmDemoChecklistDraft): TimeBreakdown[] {
  if (draft.agenda.filter((b) => b.included).length > 0) {
    const byKind = new Map<string, number>();
    for (const block of draft.agenda.filter((b) => b.included)) {
      const key = block.kind;
      byKind.set(key, (byKind.get(key) ?? 0) + block.minutes);
    }
    const labels: Record<string, string> = {
      intro: "Intro & wrap-up",
      wrap: "Intro & wrap-up",
      scenario: "Core workflows",
      reporting: "Reporting & admin",
      admin: "Reporting & admin",
      integrations: "Integrations & AI",
      ai: "Integrations & AI",
      commercial: "Commercial Q&A",
      questions: "Questions",
      custom: "Other",
    };
    const merged = new Map<string, number>();
    for (const [kind, minutes] of byKind) {
      const label = labels[kind] ?? kind;
      merged.set(label, (merged.get(label) ?? 0) + minutes);
    }
    return [...merged.entries()].map(([label, minutes]) => ({
      label,
      minutes,
      kind: "custom" as const,
    }));
  }

  return [
    { label: "Intro & wrap-up", minutes: 5, kind: "intro" as const },
    {
      label: "Core workflows",
      minutes: estimateScenarioMinutes(draft),
      kind: "scenario" as const,
    },
    {
      label: "Reporting & admin",
      minutes: draft.adminTasks
        .filter((t) => t.included && t.category !== "ai")
        .reduce((s, t) => s + t.estimatedMinutes, 0),
      kind: "reporting" as const,
    },
    {
      label: "Integrations & AI",
      minutes:
        estimateIntegrationMinutes(draft) +
        draft.adminTasks
          .filter((t) => t.included && t.category === "ai")
          .reduce((s, t) => s + t.estimatedMinutes, 0),
      kind: "integrations" as const,
    },
    {
      label: "Questions",
      minutes: 7,
      kind: "questions" as const,
    },
  ].filter((row) => row.minutes > 0);
}

export function rebuildAgendaFromDraft(
  draft: CrmDemoChecklistDraft,
): DemoAgendaBlock[] {
  const blocks: DemoAgendaBlock[] = [
    {
      id: newDemoId("AG"),
      label: "Introduction & rules",
      minutes: 5,
      kind: "intro",
      sortOrder: 0,
      included: true,
    },
  ];

  let order = 1;
  for (const scenario of includedScenarios(draft)) {
    blocks.push({
      id: newDemoId("AG"),
      label: scenario.name || "Scenario",
      minutes: scenario.estimatedMinutes,
      kind: "scenario",
      scenarioId: scenario.id,
      sortOrder: order++,
      included: true,
    });
  }

  const reporting = draft.adminTasks.filter(
    (t) => t.included && t.category === "reporting",
  );
  if (reporting.length) {
    blocks.push({
      id: newDemoId("AG"),
      label: "Reporting",
      minutes: reporting.reduce((s, t) => s + t.estimatedMinutes, 0),
      kind: "reporting",
      sortOrder: order++,
      included: true,
    });
  }

  const admin = draft.adminTasks.filter(
    (t) => t.included && t.category === "administration",
  );
  if (admin.length) {
    blocks.push({
      id: newDemoId("AG"),
      label: "Administration",
      minutes: admin.reduce((s, t) => s + t.estimatedMinutes, 0),
      kind: "admin",
      sortOrder: order++,
      included: true,
    });
  }

  const integMinutes = estimateIntegrationMinutes(draft);
  if (integMinutes > 0) {
    blocks.push({
      id: newDemoId("AG"),
      label: "Integrations",
      minutes: Math.min(integMinutes, 12),
      kind: "integrations",
      sortOrder: order++,
      included: true,
    });
  }

  const ai = draft.adminTasks.filter((t) => t.included && t.category === "ai");
  if (ai.length) {
    blocks.push({
      id: newDemoId("AG"),
      label: "AI capabilities",
      minutes: ai.reduce((s, t) => s + t.estimatedMinutes, 0),
      kind: "ai",
      sortOrder: order++,
      included: true,
    });
  }

  blocks.push({
    id: newDemoId("AG"),
    label: "Questions",
    minutes: 7,
    kind: "questions",
    sortOrder: order++,
    included: true,
  });

  // Fit to available duration by shrinking optional scenario blocks last.
  const available = resolveDemoDurationMinutes(draft.setup);
  let total = blocks.reduce((s, b) => s + b.minutes, 0);
  if (total > available) {
    const optionalScenarioIds = new Set(
      includedScenarios(draft)
        .filter((s) => s.priority === "optional")
        .map((s) => s.id),
    );
    for (const block of [...blocks].reverse()) {
      if (total <= available) break;
      if (
        block.kind === "scenario" &&
        block.scenarioId &&
        optionalScenarioIds.has(block.scenarioId)
      ) {
        const trim = Math.min(block.minutes - 3, total - available);
        if (trim > 0) {
          block.minutes -= trim;
          total -= trim;
        }
      }
    }
  }

  return blocks;
}

export function moveAgendaBlock(
  agenda: DemoAgendaBlock[],
  fromIndex: number,
  toIndex: number,
): DemoAgendaBlock[] {
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= agenda.length ||
    toIndex >= agenda.length
  ) {
    return agenda;
  }
  const next = [...agenda].sort((a, b) => a.sortOrder - b.sortOrder);
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next.map((block, index) => ({ ...block, sortOrder: index }));
}

export function reorderScenarios(
  scenarios: DemoScenario[],
  fromIndex: number,
  toIndex: number,
): DemoScenario[] {
  const sorted = [...scenarios].sort((a, b) => a.sortOrder - b.sortOrder);
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= sorted.length ||
    toIndex >= sorted.length
  ) {
    return scenarios;
  }
  const [item] = sorted.splice(fromIndex, 1);
  sorted.splice(toIndex, 0, item);
  const orderMap = new Map(sorted.map((s, i) => [s.id, i]));
  return scenarios.map((s) => ({
    ...s,
    sortOrder: orderMap.get(s.id) ?? s.sortOrder,
  }));
}
