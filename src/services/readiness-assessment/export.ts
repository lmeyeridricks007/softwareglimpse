/**
 * CRM Readiness Assessment — export façade + Excel / JSON.
 * PDF implementation lives in export-pdf.ts.
 */

import type { CrmReadinessSession } from "@/domain";
import { READINESS_DIMENSIONS } from "./catalog";
import {
  DIMENSION_LEVEL_LABELS,
  READINESS_LEVEL_LABELS,
} from "./score";
import {
  type ReadinessFinding,
  type ReadinessRiskRow,
} from "./findings";
import {
  downloadBlob,
  readinessExportBasename,
} from "./export-shared";
import {
  prepareReadinessExportReport,
  type ReadinessExportOptions,
} from "./localize-catalog";

export type { ReadinessExportOptions } from "./localize-catalog";
export { readinessExportBasename } from "./export-shared";
export {
  downloadReadinessPdf,
  downloadActionPlanPdf,
  downloadRiskRegisterPdf,
} from "./export-pdf";

export function downloadReadinessJson(
  session: CrmReadinessSession,
  options: ReadinessExportOptions = {},
): void {
  const report = prepareReadinessExportReport(session, options);
  const payload = {
    exportedAt: new Date().toISOString(),
    assessmentVersion: session.assessmentVersion,
    context: session.context,
    answers: session.answers,
    result: report.assessment,
    findings: report.findings,
    actions: report.actions,
    risks: report.risks,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  downloadBlob(
    blob,
    `${readinessExportBasename(session, options.nounCopy?.shortName)}.json`,
  );
}

export async function downloadReadinessExcel(
  session: CrmReadinessSession,
  options: ReadinessExportOptions = {},
): Promise<void> {
  const XLSX = await import("xlsx");
  const report = prepareReadinessExportReport(session, options);
  const dimensionDefs = options.catalog?.dimensions ?? READINESS_DIMENSIONS;

  const summary = [
    ["Field", "Value"],
    ["Project", session.context.projectName || ""],
    ["Organization", session.context.organization || ""],
    ["Assessed by", session.context.assessedBy || ""],
    ["Completed", session.completedAt || ""],
    ["Assessment version", session.assessmentVersion],
    [
      "Overall status",
      READINESS_LEVEL_LABELS[report.assessment.overallLevel],
    ],
    ["Selection readiness", report.assessment.selectionScore],
    ["Implementation readiness", report.assessment.implementationScore],
    ["Critical blockers", report.criticalBlockerCount],
    ["Significant gaps", report.gapCount],
    ["Executive summary", report.executiveSummary],
  ];

  const dimensions = [
    ["Dimension", "Score", "Level", "Answered", "Questions", "Uncertain"],
    ...report.assessment.dimensions.map((d) => {
      const def = dimensionDefs.find((x) => x.id === d.dimensionId);
      return [
        def?.title ?? d.dimensionId,
        d.score,
        DIMENSION_LEVEL_LABELS[d.level],
        d.answeredCount,
        d.questionCount,
        d.uncertainCount,
      ];
    }),
  ];

  const answers = [
    ["Question ID", "Value", "Source", "Updated"],
    ...Object.values(session.answers).map((a) => [
      a.questionId,
      Array.isArray(a.value) ? a.value.join("; ") : String(a.value ?? ""),
      a.source,
      a.updatedAt,
    ]),
  ];

  const actions = [
    ["Priority", "Phase", "Action", "Why", "Effort", "Owner hint"],
    ...report.actions.map((a) => [
      a.priority,
      a.phase,
      a.title,
      a.reason,
      a.effort,
      a.ownerHint,
    ]),
  ];

  const risks = [
    ["Risk", "Severity", "Phase", "Why", "Impact", "Mitigation", "When"],
    ...report.risks.map((r: ReadinessRiskRow) => [
      r.risk,
      r.severity,
      r.phase,
      r.why,
      r.impact,
      r.mitigation,
      r.when,
    ]),
  ];

  const findings = [
    ["Type", "Severity", "Dimension", "Title", "Explanation", "Recommendation"],
    ...report.findings.map((f: ReadinessFinding) => [
      f.type,
      f.severity,
      f.dimensionId,
      f.title,
      f.explanation,
      f.recommendation,
    ]),
  ];

  const systems = session.answers["dt-sources"]?.value;
  const integrations = session.answers["ig-systems"]?.value;
  const inventory = [
    ["Inventory", "Items"],
    [
      "Data sources",
      Array.isArray(systems) ? systems.join("; ") : String(systems ?? ""),
    ],
    [
      "Integrations",
      Array.isArray(integrations)
        ? integrations.join("; ")
        : String(integrations ?? ""),
    ],
    [
      "Stakeholders represented",
      Array.isArray(session.answers["st-represented"]?.value)
        ? (session.answers["st-represented"]!.value as string[]).join("; ")
        : "",
    ],
  ];

  const wb = XLSX.utils.book_new();
  const sheets: Array<[string, (string | number)[][]]> = [
    ["Summary", summary],
    ["Dimension Scores", dimensions],
    ["Assessment Answers", answers],
    ["Action Plan", actions],
    ["Risk Register", risks],
    ["Findings", findings],
    ["Systems Inventory", inventory],
  ];
  for (const [name, aoa] of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  }
  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${readinessExportBasename(session, options.nounCopy?.shortName)}.xlsx`,
  );
}
