import type { CrmMigrationPlan } from "@/domain";
import { complexityLevelLabel } from "./complexity";
import {
  fieldMappingProgress,
  openMigrationRiskCount,
  totalRecordEstimate,
  userMappingProgress,
} from "./persistence";
import { buildMigrationDashboard } from "./summary";

function targetLabel(plan: CrmMigrationPlan): string {
  return (
    plan.targetProductName ??
    (plan.vendorNeutral ? "Vendor-neutral" : "Not selected")
  );
}

function generatedDateLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Visual PDF report of the migration plan (planning summary — not an ETL runbook).
 */
export async function downloadMigrationPlanPdf(
  plan: CrmMigrationPlan,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const navy: [number, number, number] = [15, 23, 42];
  const muted: [number, number, number] = [100, 116, 139];
  const primary: [number, number, number] = [37, 99, 235];
  const success: [number, number, number] = [22, 163, 74];
  const warning: [number, number, number] = [217, 119, 6];
  const danger: [number, number, number] = [220, 38, 38];
  const surface: [number, number, number] = [248, 250, 252];
  const border: [number, number, number] = [226, 232, 240];

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeWrapped = (
    text: string,
    options: {
      fontSize?: number;
      style?: "normal" | "bold";
      color?: [number, number, number];
      gapAfter?: number;
      x?: number;
      width?: number;
    } = {},
  ) => {
    const fontSize = options.fontSize ?? 10;
    const style = options.style ?? "normal";
    const color = options.color ?? navy;
    const gapAfter = options.gapAfter ?? 6;
    const x = options.x ?? margin;
    const width = options.width ?? maxWidth;
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, width) as string[];
    ensureSpace(lines.length * (fontSize + 3) + gapAfter);
    doc.text(lines, x, y);
    y += lines.length * (fontSize + 3) + gapAfter;
  };

  const sectionTitle = (title: string) => {
    ensureSpace(36);
    y += 8;
    doc.setFillColor(...primary);
    doc.roundedRect(margin, y, 4, 14, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(title, margin + 12, y + 11);
    y += 26;
  };

  const dashboard = buildMigrationDashboard(plan);
  const progress = fieldMappingProgress(plan);
  const users = userMappingProgress(plan);
  const records = totalRecordEstimate(plan);
  const generated = generatedDateLabel();

  // Hero band
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(margin, y, maxWidth, 72, 8, 8, "F");
  doc.setDrawColor(...primary);
  doc.setLineWidth(1.5);
  doc.roundedRect(margin, y, maxWidth, 72, 8, 8, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...primary);
  doc.text("SOFTWAREGLIMPSE  ·  CRM MIGRATION PLAN", margin + 16, y + 18);

  doc.setFontSize(18);
  doc.setTextColor(...navy);
  const title =
    dashboard.targetLabel === "Not selected" ||
    dashboard.targetLabel === "Vendor-neutral"
      ? "Vendor-neutral migration plan"
      : `Migration → ${dashboard.targetLabel}`;
  doc.text(title, margin + 16, y + 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(
    `Generated ${generated}  ·  Planning report only — does not move CRM data`,
    margin + 16,
    y + 58,
  );
  y += 88;

  // Metric cards (2×3)
  const metrics: Array<{ label: string; value: string }> = [
    { label: "Sources", value: String(dashboard.sourceCount) },
    { label: "Objects", value: String(dashboard.objectCount) },
    {
      label: "Est. records",
      value: records == null ? "—" : `~${records.toLocaleString()}`,
    },
    {
      label: "Complexity",
      value: dashboard.complexityLabel ?? "—",
    },
    {
      label: "Fields mapped",
      value:
        progress.percentMapped == null
          ? "—"
          : `${progress.mapped}/${progress.total} (${progress.percentMapped}%)`,
    },
    {
      label: "Open risks",
      value: String(openMigrationRiskCount(plan)),
    },
  ];

  const cardGap = 10;
  const cardW = (maxWidth - cardGap * 2) / 3;
  const cardH = 48;
  ensureSpace(cardH * 2 + cardGap + 12);

  metrics.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = margin + col * (cardW + cardGap);
    const cy = y + row * (cardH + cardGap);
    doc.setFillColor(...surface);
    doc.setDrawColor(...border);
    doc.setLineWidth(0.8);
    doc.roundedRect(cx, cy, cardW, cardH, 6, 6, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(m.label.toUpperCase(), cx + 10, cy + 16);
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    const valueLines = doc.splitTextToSize(m.value, cardW - 20) as string[];
    doc.text(valueLines[0] ?? m.value, cx + 10, cy + 34);
  });
  y += cardH * 2 + cardGap + 18;

  // Migration flow
  sectionTitle("Migration flow");
  ensureSpace(56);
  const sourceName =
    plan.sourceSystems.length === 0
      ? "No sources"
      : plan.sourceSystems.length === 1
        ? plan.sourceSystems[0]!.name
        : `${plan.sourceSystems.length} sources`;
  const flowNodes = [
    sourceName,
    "Map & clean",
    "Validate",
    targetLabel(plan),
  ];
  const nodeW = (maxWidth - 36) / 4;
  const nodeH = 36;
  flowNodes.forEach((label, i) => {
    const nx = margin + i * (nodeW + 12);
    doc.setFillColor(i === flowNodes.length - 1 ? 239 : 248, i === 3 ? 246 : 250, i === 3 ? 255 : 252);
    doc.setDrawColor(...(i === flowNodes.length - 1 ? primary : border));
    doc.setLineWidth(1);
    doc.roundedRect(nx, y, nodeW, nodeH, 6, 6, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...navy);
    const lines = doc.splitTextToSize(label, nodeW - 12) as string[];
    doc.text(lines[0] ?? label, nx + 6, y + 22);
    if (i < flowNodes.length - 1) {
      doc.setDrawColor(...primary);
      doc.setLineWidth(1.2);
      const ax = nx + nodeW + 2;
      doc.line(ax, y + nodeH / 2, ax + 8, y + nodeH / 2);
    }
  });
  y += nodeH + 14;
  writeWrapped(
    "Conceptual path only — SoftwareGlimpse does not execute import/export.",
    { fontSize: 8, color: muted, gapAfter: 4 },
  );

  // Field mapping progress bar
  sectionTitle("Field mapping progress");
  const segments: Array<{
    count: number;
    label: string;
    color: [number, number, number];
  }> = [
    { count: progress.mapped, label: "Mapped", color: success },
    { count: progress.needsReview, label: "Needs review", color: warning },
    { count: progress.suggested, label: "Suggested", color: primary },
    { count: progress.noTarget, label: "No target", color: danger },
    { count: progress.excluded, label: "Excluded", color: muted },
  ];
  const barH = 14;
  ensureSpace(40);
  doc.setFillColor(...border);
  doc.roundedRect(margin, y, maxWidth, barH, 4, 4, "F");
  let xCursor = margin;
  const totalSeg = Math.max(1, progress.total);
  for (const seg of segments) {
    if (seg.count <= 0) continue;
    const w = (seg.count / totalSeg) * maxWidth;
    doc.setFillColor(...seg.color);
    doc.rect(xCursor, y, Math.max(w, 0), barH, "F");
    xCursor += w;
  }
  y += barH + 10;
  writeWrapped(
    segments
      .filter((s) => s.count > 0)
      .map((s) => `${s.label}: ${s.count}`)
      .join("   ·   ") || "No fields inventoried yet",
    { fontSize: 8, color: muted, gapAfter: 4 },
  );
  writeWrapped(
    `Users mapped: ${users.mapped}/${users.total}   ·   Pipelines: ${dashboard.pipelinesMapped}/${dashboard.pipelinesTotal}   ·   Test: ${plan.testMigration.status}`,
    { fontSize: 9, color: navy, gapAfter: 6 },
  );

  // Object volume bars
  if (plan.objects.length > 0) {
    sectionTitle("Object inventory (by volume)");
    const maxRec = Math.max(
      1,
      ...plan.objects.map((o) => o.recordCount ?? 0),
    );
    for (const o of plan.objects.slice(0, 12)) {
      ensureSpace(22);
      const label = `${o.sourceObjectLabel}${o.targetObjectLabel ? ` → ${o.targetObjectLabel}` : ""}`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...navy);
      doc.text(label.slice(0, 48), margin, y + 8);
      const barX = margin + 220;
      const barMax = maxWidth - 220;
      doc.setFillColor(...border);
      doc.roundedRect(barX, y, barMax, 10, 3, 3, "F");
      const fill =
        o.recordCount == null ? 0 : (o.recordCount / maxRec) * barMax;
      doc.setFillColor(...primary);
      doc.roundedRect(barX, y, Math.max(fill, 0), 10, 3, 3, "F");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      const countLabel =
        o.recordCount == null ? "unknown" : o.recordCount.toLocaleString();
      doc.text(countLabel, pageWidth - margin, y + 8, { align: "right" });
      y += 18;
    }
    if (plan.objects.length > 12) {
      writeWrapped(`+ ${plan.objects.length - 12} more objects`, {
        fontSize: 8,
        color: muted,
      });
    }
  }

  // Risks
  sectionTitle("Risks & blockers");
  const openRisks = plan.risks.filter((r) => r.status !== "resolved");
  if (openRisks.length === 0) {
    writeWrapped("No open risks recorded.", { fontSize: 10, color: muted });
  } else {
    const severityColor = (
      s: string,
    ): [number, number, number] => {
      if (s === "blocker" || s === "high") return danger;
      if (s === "medium") return warning;
      return muted;
    };
    for (const r of openRisks.slice(0, 10)) {
      ensureSpace(48);
      const sc = severityColor(r.severity);
      doc.setFillColor(sc[0], sc[1], sc[2]);
      doc.roundedRect(margin, y, 52, 14, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text(r.severity.toUpperCase(), margin + 26, y + 10, {
        align: "center",
      });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...navy);
      doc.text(r.title.slice(0, 70), margin + 60, y + 10);
      y += 18;
      writeWrapped(r.reason, { fontSize: 8, color: muted, gapAfter: 2 });
      writeWrapped(`Action: ${r.recommendedAction}`, {
        fontSize: 8,
        color: navy,
        gapAfter: 10,
      });
    }
    if (openRisks.length > 10) {
      writeWrapped(`+ ${openRisks.length - 10} more open risks`, {
        fontSize: 8,
        color: muted,
      });
    }
  }

  // Readiness
  if (plan.readinessGaps.length > 0) {
    sectionTitle("Readiness");
    const ready = plan.readinessGaps.filter((g) => g.state === "ready").length;
    const work = plan.readinessGaps.filter((g) => g.state === "needs-work").length;
    const blocked = plan.readinessGaps.filter((g) => g.state === "blocked").length;
    writeWrapped(
      `Ready: ${ready}   ·   Needs work: ${work}   ·   Blocked: ${blocked}`,
      { fontSize: 10, gapAfter: 8 },
    );
    for (const g of plan.readinessGaps.slice(0, 8)) {
      writeWrapped(`[${g.state}] ${g.title}`, {
        fontSize: 9,
        color: g.state === "blocked" ? danger : navy,
        gapAfter: 2,
      });
      writeWrapped(g.detail, { fontSize: 8, color: muted, gapAfter: 6 });
    }
  }

  // Cutover timeline
  if (plan.cutoverSteps.length > 0) {
    sectionTitle("Cutover sequence (planning defaults)");
    for (const c of plan.cutoverSteps) {
      ensureSpace(28);
      doc.setFillColor(...surface);
      doc.setDrawColor(...border);
      doc.roundedRect(margin, y, 70, 20, 4, 4, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...primary);
      doc.text(c.relativeDay, margin + 35, y + 13, { align: "center" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...navy);
      doc.text(`${c.title}  [${c.status}]`, margin + 80, y + 13);
      y += 26;
    }
  }

  // Complexity drivers
  if (plan.complexity) {
    sectionTitle("Complexity drivers");
    writeWrapped(
      `Assessed level: ${complexityLevelLabel(plan.complexity.level)}`,
      { fontSize: 10, style: "bold", gapAfter: 6 },
    );
    for (const d of plan.complexity.drivers.slice(0, 8)) {
      writeWrapped(`• ${d.label}`, { fontSize: 9, gapAfter: 3 });
    }
  }

  // Sources / targets snapshot
  sectionTitle("Sources");
  if (plan.sourceSystems.length === 0) {
    writeWrapped("None inventoried.", { fontSize: 9, color: muted });
  } else {
    for (const s of plan.sourceSystems) {
      writeWrapped(
        `• ${s.name} (${s.type}) — export: ${s.exportAvailable}, API: ${s.apiAvailable}${s.dataOwner ? `, owner: ${s.dataOwner}` : ""}`,
        { fontSize: 9, gapAfter: 3 },
      );
    }
  }

  ensureSpace(50);
  y += 12;
  doc.setDrawColor(...border);
  doc.setLineWidth(0.6);
  doc.line(margin, y, pageWidth - margin, y);
  y += 14;
  writeWrapped(
    "Generated by SoftwareGlimpse CRM Migration Planner. Affiliate relationships do not influence this plan. This document is a planning aid — it does not execute migration.",
    { fontSize: 8, color: muted, gapAfter: 0 },
  );

  const safeTarget = targetLabel(plan)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  doc.save(`crm-migration-plan-${safeTarget || "plan"}.pdf`);
}

type SheetRow = Array<string | number | boolean | null | undefined>;

function sheetFromRows(rows: SheetRow[]) {
  return rows.map((row) => row.map((cell) => (cell == null ? "" : cell)));
}

/** Build a multi-sheet Excel workbook for the migration plan (does not write to disk). */
export async function buildMigrationPlanWorkbook(plan: CrmMigrationPlan) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const progress = fieldMappingProgress(plan);
  const users = userMappingProgress(plan);
  const records = totalRecordEstimate(plan);

  const append = (name: string, rows: SheetRow[]) => {
    const ws = XLSX.utils.aoa_to_sheet(sheetFromRows(rows));
    const cols = Math.max(...rows.map((r) => r.length), 1);
    ws["!cols"] = Array.from({ length: cols }, () => ({ wch: 18 }));
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  };

  append("Summary", [
    ["Key", "Value"],
    ["Generated", generatedDateLabel()],
    ["Target CRM", targetLabel(plan)],
    ["Target plan", plan.targetPlanLabel ?? ""],
    ["Vendor-neutral", plan.vendorNeutral ? "yes" : "no"],
    ["Sources", plan.sourceSystems.length],
    ["Objects", plan.objects.length],
    ["Est. records", records ?? ""],
    ["Fields mapped", `${progress.mapped}/${progress.total}`],
    [
      "Field mapping %",
      progress.percentMapped == null ? "" : progress.percentMapped,
    ],
    ["Users mapped", `${users.mapped}/${users.total}`],
    ["Complexity", plan.complexity?.level ?? ""],
    ["Open risks", openMigrationRiskCount(plan)],
    ["Test status", plan.testMigration.status],
    ["Target go-live", plan.targetGoLive ?? ""],
    [
      "Note",
      "Planning workbook only — SoftwareGlimpse does not execute migration",
    ],
  ]);

  append("Sources", [
    ["id", "name", "type", "export", "api", "format", "owner", "notes"],
    ...plan.sourceSystems.map((s) => [
      s.id,
      s.name,
      s.type,
      s.exportAvailable,
      s.apiAvailable,
      s.formatKnown,
      s.dataOwner ?? "",
      s.notes ?? "",
    ]),
  ]);

  append("Objects", [
    [
      "id",
      "source_system_id",
      "source_object",
      "target_object",
      "records",
      "priority",
      "history",
      "status",
      "notes",
    ],
    ...plan.objects.map((o) => [
      o.id,
      o.sourceSystemId,
      o.sourceObjectLabel,
      o.targetObjectLabel ?? "",
      o.recordCount ?? "",
      o.priority,
      o.historyDepth,
      o.status,
      o.notes ?? "",
    ]),
  ]);

  append("Field Mapping", [
    [
      "id",
      "source_system_id",
      "source_object",
      "source_field",
      "source_type",
      "example_value",
      "target_object",
      "target_field",
      "target_type",
      "transformation",
      "required",
      "status",
      "notes",
    ],
    ...plan.fieldMappings.map((m) => [
      m.id,
      m.sourceSystemId,
      m.sourceObject,
      m.sourceField,
      m.sourceType ?? "",
      m.exampleValue ?? "",
      m.targetObject ?? "",
      m.targetField ?? "",
      m.targetType ?? "",
      m.transformation,
      m.required ? "yes" : "no",
      m.status,
      m.notes ?? "",
    ]),
  ]);

  append("Value Mapping", [
    ["id", "field_mapping_id", "source_value", "target_value", "status"],
    ...plan.valueMappings.map((v) => [
      v.id,
      v.fieldMappingId,
      v.sourceValue,
      v.targetValue ?? "",
      v.status,
    ]),
  ]);

  append("Users", [
    [
      "id",
      "source_user",
      "email",
      "active",
      "target_user",
      "role",
      "status",
      "notes",
    ],
    ...plan.userMappings.map((u) => [
      u.id,
      u.sourceUser,
      u.email ?? "",
      u.active,
      u.targetUser ?? "",
      u.role ?? "",
      u.status,
      u.notes ?? "",
    ]),
  ]);

  const pipelineRows: SheetRow[] = [
    [
      "pipeline_id",
      "source_pipeline",
      "source_stage",
      "target_pipeline",
      "target_stage",
      "warnings",
    ],
  ];
  for (const p of plan.pipelineMappings) {
    for (const st of p.stageMaps) {
      pipelineRows.push([
        p.id,
        p.sourcePipelineName,
        st.sourceStage,
        p.targetPipelineName ?? "",
        st.targetStage ?? "",
        (st.warnings ?? []).join("; "),
      ]);
    }
    if (p.stageMaps.length === 0) {
      pipelineRows.push([
        p.id,
        p.sourcePipelineName,
        "",
        p.targetPipelineName ?? "",
        "",
        "",
      ]);
    }
  }
  append("Pipelines", pipelineRows);

  append("Cleaning", [
    ["id", "label", "category", "status", "owner", "notes"],
    ...plan.cleaningTasks.map((t) => [
      t.id,
      t.label,
      t.category,
      t.status,
      t.owner ?? "",
      t.notes ?? "",
    ]),
  ]);

  append("Test Migration", [
    ["plan_status", plan.testMigration.status],
    ["sandbox", plan.testMigration.sandboxAvailability],
    ["sample_notes", plan.testMigration.sampleNotes ?? ""],
    [],
    ["id", "label", "status"],
    ...plan.testMigration.steps.map((s) => [s.id, s.label, s.status]),
  ]);

  append("Validation", [
    [
      "id",
      "object",
      "kind",
      "source_count",
      "imported_count",
      "sample",
      "status",
      "notes",
    ],
    ...plan.validationChecks.map((v) => [
      v.id,
      v.objectLabel,
      v.checkKind,
      v.sourceCount ?? "",
      v.importedCount ?? "",
      v.validatedSampleCount ?? "",
      v.status,
      v.notes ?? "",
    ]),
  ]);

  append("Risks", [
    ["id", "title", "severity", "status", "reason", "recommended_action"],
    ...plan.risks.map((r) => [
      r.id,
      r.title,
      r.severity,
      r.status,
      r.reason,
      r.recommendedAction,
    ]),
  ]);

  append("Cutover", [
    ["id", "relative_day", "title", "status", "description"],
    ...plan.cutoverSteps.map((c) => [
      c.id,
      c.relativeDay,
      c.title,
      c.status,
      c.description ?? "",
    ]),
  ]);

  append("Rollback", [
    ["key", "value"],
    ["retain_source_access", plan.rollback.retainSourceAccess ? "yes" : "no"],
    [
      "preserve_original_export",
      plan.rollback.preserveOriginalExport ? "yes" : "no",
    ],
    [
      "do_not_delete_source_data",
      plan.rollback.doNotDeleteSourceData ? "yes" : "no",
    ],
    ["go_live_approver", plan.rollback.goLiveApprover ?? ""],
    ["notes", plan.rollback.notes ?? ""],
  ]);

  if (plan.complexity) {
    append("Complexity", [
      ["level", plan.complexity.level],
      [],
      ["driver_id", "label", "weight"],
      ...plan.complexity.drivers.map((d) => [d.id, d.label, d.weight ?? ""]),
    ]);
  }

  if (plan.readinessGaps.length > 0) {
    append("Readiness", [
      ["id", "kind", "title", "detail", "state", "resolved"],
      ...plan.readinessGaps.map((g) => [
        g.id,
        g.kind,
        g.title,
        g.detail,
        g.state,
        g.resolved ? "yes" : "no",
      ]),
    ]);
  }

  return wb;
}

/**
 * Real Excel (.xlsx) workbook with one sheet per planning area.
 */
export async function downloadMigrationPlanExcel(
  plan: CrmMigrationPlan,
): Promise<void> {
  const XLSX = await import("xlsx");
  const wb = await buildMigrationPlanWorkbook(plan);
  const safeTarget = targetLabel(plan)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  XLSX.writeFile(wb, `crm-migration-plan-${safeTarget || "plan"}.xlsx`);
}
