import type { CrmDemoChecklistSession } from "@/domain";
import { DEMO_ITEM_PRIORITY_LABELS, DEMO_TYPE_LABELS, resolveDemoDurationMinutes } from "./constants";
import { includedScenarios } from "./time";

export function buildDemoMarkdown(
  session: CrmDemoChecklistSession,
  options: { vendorName?: string } = {},
): string {
  const { draft } = session;
  const duration = resolveDemoDurationMinutes(draft.setup);
  const lines: string[] = [];

  lines.push(`# CRM Vendor Demo Checklist`);
  lines.push("");
  lines.push(`**Project:** ${draft.setup.projectName || "Untitled"}`);
  if (options.vendorName) lines.push(`**Vendor:** ${options.vendorName}`);
  lines.push(`**Demo type:** ${DEMO_TYPE_LABELS[draft.setup.demoType]}`);
  lines.push(`**Duration:** ${duration} minutes`);
  if (draft.setup.demoOwner) lines.push(`**Demo owner:** ${draft.setup.demoOwner}`);
  lines.push("");

  lines.push(`## Demo guidelines`);
  lines.push("");
  lines.push(draft.demoGuidelines.trim() || "_No guidelines set._");
  lines.push("");

  if (draft.agenda.length) {
    lines.push(`## Agenda`);
    lines.push("");
    for (const block of [...draft.agenda]
      .filter((b) => b.included)
      .sort((a, b) => a.sortOrder - b.sortOrder)) {
      lines.push(
        `${String(block.sortOrder + 1).padStart(2, "0")} — ${block.label} (${block.minutes} min)`,
      );
    }
    lines.push("");
  }

  lines.push(`## Scenarios`);
  lines.push("");
  for (const [index, scenario] of includedScenarios(draft).entries()) {
    lines.push(
      `### ${String(index + 1).padStart(2, "0")} — ${scenario.name}`,
    );
    lines.push("");
    lines.push(`**Persona:** ${scenario.persona || "—"}`);
    lines.push(
      `**Priority:** ${DEMO_ITEM_PRIORITY_LABELS[scenario.priority]} · **Time:** ${scenario.estimatedMinutes} min`,
    );
    if (scenario.businessContext) {
      lines.push("");
      lines.push(`**Business context:** ${scenario.businessContext}`);
    }
    if (scenario.startingState) {
      lines.push("");
      lines.push(`**Starting state:** ${scenario.startingState}`);
    }
    lines.push("");
    lines.push(`**Ask the vendor to:**`);
    for (const [i, task] of scenario.vendorTasks.entries()) {
      lines.push(`${i + 1}. ${task}`);
    }
    lines.push("");
    lines.push(`**Success criteria:**`);
    for (const c of scenario.successCriteria) lines.push(`- [ ] ${c}`);
    lines.push("");
    lines.push(`**Evidence to capture:**`);
    for (const e of scenario.evidenceRequired) lines.push(`- [ ] ${e}`);
    if (scenario.moderatorScript.trim()) {
      lines.push("");
      lines.push(`**Moderator script:**`);
      lines.push("");
      lines.push(scenario.moderatorScript.trim());
    }
    lines.push("");
  }

  const admin = draft.adminTasks.filter((t) => t.included);
  if (admin.length) {
    lines.push(`## Reporting, administration & AI`);
    lines.push("");
    for (const task of admin) {
      lines.push(`### ${task.label}`);
      lines.push("");
      lines.push(task.vendorTask);
      lines.push("");
      lines.push(`**Success:** ${task.successCriteria}`);
      lines.push(`**Evidence:** ${task.evidenceRequired}`);
      lines.push("");
    }
  }

  const commercial = draft.commercialQuestions.filter((q) => q.included);
  if (commercial.length) {
    lines.push(`## Ask, don't demo (commercial & implementation)`);
    lines.push("");
    for (const q of commercial) {
      lines.push(`- **${q.topic}:** ${q.question}`);
    }
    lines.push("");
  }

  lines.push(`---`);
  lines.push(
    `_Generated with SoftwareGlimpse CRM Demo Checklist Builder. Edit before sending to vendors._`,
  );

  return lines.join("\n");
}

export function downloadDemoMarkdown(
  session: CrmDemoChecklistSession,
  options: { vendorName?: string; filename?: string } = {},
): void {
  const md = buildDemoMarkdown(session, options);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    options.filename ??
    `crm-demo-checklist-${(session.draft.setup.projectName || "plan")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "plan"}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
