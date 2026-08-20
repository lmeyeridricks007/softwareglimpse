import type { CrmDemoChecklistDraft, CrmDecisionProfile } from "@/domain";
import {
  loadCrmDecisionProfile,
  loadSiDecisionProfile,
} from "@/services/decision-profile/persistence";
import { VAGUE_TASK_PATTERNS, resolveDemoDurationMinutes } from "./constants";
import { estimateAgendaMinutes, includedScenarios } from "./time";

export type DemoQualityIssue = {
  id: string;
  severity: "error" | "warning" | "info";
  kind:
    | "missing-persona"
    | "missing-success"
    | "missing-evidence"
    | "vague-task"
    | "uncovered-must-have"
    | "time-overrun"
    | "required-integration-untested"
    | "ai-without-verification"
    | "low-priority-time"
    | "commercial-in-demo"
    | "missing-name";
  message: string;
  suggestion?: string;
  relatedId?: string;
};

export type DemoQualityReport = {
  status: "good" | "needs-work" | "incomplete";
  issues: DemoQualityIssue[];
  mustHaveCoveragePct: number;
  requirementsCoveragePct: number;
  evidenceCoveragePct: number;
  estimatedMinutes: number;
  availableMinutes: number;
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function detectVagueTask(text: string): string | null {
  for (const entry of VAGUE_TASK_PATTERNS) {
    if (entry.pattern.test(text)) return entry.reason;
  }
  return null;
}

export function analyzeDemoQuality(
  draft: CrmDemoChecklistDraft,
  profile?: CrmDecisionProfile | null,
): DemoQualityReport {
  const source = profile ?? loadCrmDecisionProfile() ?? loadSiDecisionProfile();
  const issues: DemoQualityIssue[] = [];
  const scenarios = includedScenarios(draft);
  const availableMinutes = resolveDemoDurationMinutes(draft.setup);
  const estimatedMinutes = estimateAgendaMinutes(draft);

  for (const scenario of scenarios) {
    if (!scenario.name.trim()) {
      issues.push({
        id: `name-${scenario.id}`,
        severity: "error",
        kind: "missing-name",
        message: "A scenario is missing a name.",
        relatedId: scenario.id,
      });
    }
    if (!scenario.persona.trim()) {
      issues.push({
        id: `persona-${scenario.id}`,
        severity: "warning",
        kind: "missing-persona",
        message: `"${scenario.name || "Untitled scenario"}" is missing a persona.`,
        relatedId: scenario.id,
      });
    }
    if (scenario.successCriteria.length === 0) {
      issues.push({
        id: `success-${scenario.id}`,
        severity: "error",
        kind: "missing-success",
        message: `"${scenario.name || "Untitled scenario"}" has no success criteria.`,
        relatedId: scenario.id,
        suggestion: "Add observable pass/fail criteria before the demo.",
      });
    }
    if (scenario.evidenceRequired.length === 0) {
      issues.push({
        id: `evidence-${scenario.id}`,
        severity: "warning",
        kind: "missing-evidence",
        message: `"${scenario.name || "Untitled scenario"}" has no evidence requirement.`,
        relatedId: scenario.id,
      });
    }
    for (const task of scenario.vendorTasks) {
      const vague = detectVagueTask(task);
      if (vague) {
        issues.push({
          id: `vague-${scenario.id}-${normalize(task).slice(0, 24)}`,
          severity: "warning",
          kind: "vague-task",
          message: `"${scenario.name}": ${vague}`,
          relatedId: scenario.id,
          suggestion: task,
        });
      }
    }
  }

  const coveredReqIds = new Set(
    scenarios.flatMap((s) => s.requirementIds),
  );
  const mustHaveReqs =
    source?.requirements.filter((r) => r.priority === "must-have") ?? [];
  for (const req of mustHaveReqs) {
    const decision = draft.coverageDecisions.find(
      (d) => d.requirementId === req.id,
    );
    if (
      !coveredReqIds.has(req.id) &&
      decision?.decision !== "written-verification" &&
      decision?.decision !== "exclude"
    ) {
      issues.push({
        id: `must-${req.id}`,
        severity: "error",
        kind: "uncovered-must-have",
        message: `Must-have requirement ${req.id} has no demo test.`,
        relatedId: req.id,
        suggestion: "Add to demo, accept written verification, or exclude deliberately.",
      });
    }
  }

  if (estimatedMinutes > availableMinutes) {
    issues.push({
      id: "time-overrun",
      severity: "warning",
      kind: "time-overrun",
      message: `Your checklist requires approximately ${estimatedMinutes} minutes (available: ${availableMinutes}).`,
      suggestion:
        "Remove optional checks, move commercial questions to written follow-up, or reduce low-priority scenarios.",
    });
  }

  for (const integ of draft.integrations) {
    if (integ.required && !integ.demoRequested) {
      issues.push({
        id: `integ-${integ.id}`,
        severity: "warning",
        kind: "required-integration-untested",
        message: `Required integration "${integ.integration}" is not marked for demo.`,
        relatedId: integ.id,
      });
    }
  }

  const aiArea = draft.evaluationAreas.find(
    (a) => a.id === "ai-capabilities" && a.priority === "must-test",
  );
  const aiTasks = draft.adminTasks.filter(
    (t) => t.category === "ai" && t.included,
  );
  if (aiArea && aiTasks.length === 0) {
    issues.push({
      id: "ai-missing",
      severity: "warning",
      kind: "ai-without-verification",
      message: "AI is marked must-test but no AI verification tasks are included.",
      suggestion: "Add concrete AI workflow tests (summarize, draft, risk, etc.).",
    });
  }

  const optionalMinutes = scenarios
    .filter((s) => s.priority === "optional")
    .reduce((sum, s) => sum + s.estimatedMinutes, 0);
  if (optionalMinutes > availableMinutes * 0.35) {
    issues.push({
      id: "optional-heavy",
      severity: "info",
      kind: "low-priority-time",
      message: `Optional scenarios consume ${optionalMinutes} minutes of demo time.`,
      suggestion: "Consider moving optional items to a second session or written follow-up.",
    });
  }

  const commercialInAgenda = draft.agenda.some(
    (b) => b.included && b.kind === "commercial" && b.minutes > 15,
  );
  if (commercialInAgenda) {
    issues.push({
      id: "commercial-heavy",
      severity: "info",
      kind: "commercial-in-demo",
      message: "Commercial questions are consuming significant live demo time.",
      suggestion: "Prefer written follow-up for pricing, SLAs and contract terms.",
    });
  }

  const mustCovered = mustHaveReqs.filter(
    (r) =>
      coveredReqIds.has(r.id) ||
      draft.coverageDecisions.some(
        (d) =>
          d.requirementId === r.id &&
          (d.decision === "written-verification" || d.decision === "exclude"),
      ),
  ).length;
  const mustHaveCoveragePct =
    mustHaveReqs.length === 0
      ? 100
      : Math.round((mustCovered / mustHaveReqs.length) * 100);

  const allReqs =
    source?.requirements.filter((r) => r.priority !== "not-needed") ?? [];
  const allCovered = allReqs.filter(
    (r) =>
      coveredReqIds.has(r.id) ||
      draft.coverageDecisions.some(
        (d) =>
          d.requirementId === r.id &&
          (d.decision === "written-verification" || d.decision === "exclude"),
      ),
  ).length;
  const requirementsCoveragePct =
    allReqs.length === 0
      ? 100
      : Math.round((allCovered / allReqs.length) * 100);

  const withEvidence = scenarios.filter((s) => s.evidenceRequired.length > 0);
  const evidenceCoveragePct =
    scenarios.length === 0
      ? 100
      : Math.round((withEvidence.length / scenarios.length) * 100);

  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  let status: DemoQualityReport["status"] = "good";
  if (errors > 0 || mustHaveCoveragePct < 100) status = "incomplete";
  else if (warnings > 0 || estimatedMinutes > availableMinutes) {
    status = "needs-work";
  }

  return {
    status,
    issues,
    mustHaveCoveragePct,
    requirementsCoveragePct,
    evidenceCoveragePct,
    estimatedMinutes,
    availableMinutes,
  };
}
