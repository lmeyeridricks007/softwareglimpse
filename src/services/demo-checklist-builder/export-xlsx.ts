/**
 * CRM Demo Checklist Excel workbook — practical evaluation sheets (SheetJS).
 */

import type { CrmDemoChecklistSession, VendorDemoEvaluation } from "@/domain";
import {
  DEMO_ITEM_PRIORITY_LABELS,
  resolveDemoDurationMinutes,
} from "./constants";
import { computeRequirementsCoverage } from "./coverage";
import { analyzeDemoQuality } from "./quality";
import {
  countDemoTasks,
  countMustHaveChecks,
  estimateAgendaMinutes,
  includedScenarios,
} from "./time";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function resultFor(
  evaluation: VendorDemoEvaluation | undefined,
  itemId: string,
) {
  return evaluation?.results.find((r) => r.itemId === itemId);
}

export async function downloadDemoChecklistExcel(
  session: CrmDemoChecklistSession,
  options: { filename?: string; vendorId?: string } = {},
): Promise<void> {
  const XLSX = await import("xlsx");
  const draft = session.draft;
  const quality = analyzeDemoQuality(draft);
  const coverage = computeRequirementsCoverage(draft);
  const duration = resolveDemoDurationMinutes(draft.setup);
  const evaluation =
    draft.vendorEvaluations.find((v) => v.vendorId === options.vendorId) ??
    draft.vendorEvaluations.find((v) => v.vendorId === draft.activeVendorId) ??
    draft.vendorEvaluations[0];

  const wb = XLSX.utils.book_new();

  const readme = [
    ["CRM Demo Checklist Workbook"],
    ["Project", draft.setup.projectName || "Untitled"],
    ["Duration (min)", duration],
    ["Estimated agenda (min)", estimateAgendaMinutes(draft)],
    ["Scenarios", includedScenarios(draft).length],
    ["Demo tasks", countDemoTasks(draft)],
    ["Must-have checks", countMustHaveChecks(draft)],
    ["Quality status", quality.status],
    ["Requirements coverage %", coverage.overallPct],
    ["Must-have coverage %", quality.mustHaveCoveragePct],
    [],
    ["Rules"],
    ["1", "Use the same core demo script for every vendor."],
    ["2", "Requirements drive the demo — not vendor marketing features."],
    ["3", "A feature claim is not evidence."],
    ["4", "Vendor stated ≠ demonstrated."],
    ["5", "Must-have failures must remain visible outside averages."],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(readme),
    "README",
  );

  const agendaRows = [
    ["Order", "Label", "Minutes", "Kind", "Included"],
    ...[...draft.agenda]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((b) => [
        b.sortOrder + 1,
        b.label,
        b.minutes,
        b.kind,
        b.included ? "yes" : "no",
      ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(agendaRows),
    "Demo Agenda",
  );

  const checklistHeader = [
    "ID",
    "Scenario",
    "Category",
    "Requirement ID",
    "Priority",
    "Vendor Task",
    "Success Criteria",
    "Evidence Required",
    "Estimated Time",
    "Vendor",
    "Result",
    "Score",
    "Evidence Status",
    "Notes",
    "Follow-up",
    "Documentation URL",
  ];

  const checklistRows: Array<Array<string | number>> = [checklistHeader];
  for (const scenario of includedScenarios(draft)) {
    const res = resultFor(evaluation, scenario.id);
    checklistRows.push([
      scenario.id,
      scenario.name,
      scenario.categoryId,
      scenario.requirementIds.join("; "),
      DEMO_ITEM_PRIORITY_LABELS[scenario.priority],
      scenario.vendorTasks.join(" | "),
      scenario.successCriteria.join(" | "),
      scenario.evidenceRequired.join(" | "),
      scenario.estimatedMinutes,
      evaluation?.vendorLabel ?? "",
      res?.result ?? "",
      res?.score ?? "",
      res?.evidenceStatus ?? "",
      res?.evaluatorNotes ?? "",
      res?.followUpRequired ? "yes" : "",
      res?.documentationUrl ?? "",
    ]);
  }
  for (const task of draft.adminTasks.filter((t) => t.included)) {
    const res = resultFor(evaluation, task.id);
    checklistRows.push([
      task.id,
      task.label,
      task.category,
      "",
      DEMO_ITEM_PRIORITY_LABELS[task.priority],
      task.vendorTask,
      task.successCriteria,
      task.evidenceRequired,
      task.estimatedMinutes,
      evaluation?.vendorLabel ?? "",
      res?.result ?? "",
      res?.score ?? "",
      res?.evidenceStatus ?? "",
      res?.evaluatorNotes ?? "",
      res?.followUpRequired ? "yes" : "",
      res?.documentationUrl ?? "",
    ]);
  }
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(checklistRows),
    "Demo Checklist",
  );

  const vendorRows: Array<Array<string | number>> = [
    [
      "Vendor",
      "Item ID",
      "Result",
      "Score",
      "Evidence Status",
      "Must-have Gate",
      "Follow-up",
      "Notes",
    ],
  ];
  for (const vendor of draft.vendorEvaluations) {
    for (const r of vendor.results) {
      vendorRows.push([
        vendor.vendorLabel || vendor.vendorId,
        r.itemId,
        r.result ?? "",
        r.score ?? "",
        r.evidenceStatus,
        r.mustHaveGate ?? "",
        r.followUpRequired ? "yes" : "",
        r.evaluatorNotes,
      ]);
    }
  }
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(vendorRows),
    "Vendor Results",
  );

  const coverageRows = [
    ["Priority", "Covered", "Total", "Pct"],
    ...coverage.buckets.map((b) => [b.priority, b.covered, b.total, b.pct]),
    [],
    ["Uncovered requirement", "Priority", "Decision"],
    ...coverage.uncovered.map((u) => [
      u.requirementId,
      u.priority,
      u.decision ?? "",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(coverageRows),
    "Requirements Coverage",
  );

  const followUps: Array<Array<string>> = [
    ["Vendor", "Item ID", "Notes", "Documentation URL"],
  ];
  for (const vendor of draft.vendorEvaluations) {
    for (const r of vendor.results.filter((x) => x.followUpRequired)) {
      followUps.push([
        vendor.vendorLabel || vendor.vendorId,
        r.itemId,
        r.evaluatorNotes,
        r.documentationUrl,
      ]);
    }
  }
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(followUps),
    "Follow-ups",
  );

  const scores: number[] = [];
  for (const r of evaluation?.results ?? []) {
    if (typeof r.score === "number") scores.push(r.score);
  }
  const avg =
    scores.length === 0
      ? ""
      : Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10;
  const mustFails = (evaluation?.results ?? []).filter(
    (r) => r.mustHaveGate === "fail",
  ).length;
  const notVerified = (evaluation?.results ?? []).filter(
    (r) => r.evidenceStatus === "not-verified",
  ).length;

  const summary = [
    ["Metric", "Value"],
    ["Average score", avg],
    ["Must-have failures", mustFails],
    ["Not verified count", notVerified],
    ["Scenario count", includedScenarios(draft).length],
    ["Requirement coverage %", coverage.overallPct],
    ["Follow-up count", followUps.length - 1],
    ["Quality status", quality.status],
    [],
    ["Note", "Do not treat average score as a winner without checking gates and evidence quality."],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(summary),
    "Summary",
  );

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    options.filename ?? `crm-demo-checklist-${Date.now().toString(36)}.xlsx`,
  );
}
