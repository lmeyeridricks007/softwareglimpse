/**
 * CRM Demo Checklist / Agenda / Vendor Brief PDFs — client-side jsPDF.
 */

import type {
  CrmDemoChecklistDraft,
  CrmDemoChecklistSession,
  DemoAgendaBlock,
} from "@/domain";
import {
  DEMO_ATTENDEE_LABELS,
  DEMO_ITEM_PRIORITY_LABELS,
  DEMO_TYPE_LABELS,
  resolveDemoDurationMinutes,
} from "./constants";
import { includedScenarios, rebuildAgendaFromDraft } from "./time";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatClock(totalMinutes: number): string {
  const safe = Math.max(0, Math.floor(totalMinutes));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function agendaBlocksForExport(draft: CrmDemoChecklistDraft): DemoAgendaBlock[] {
  const existing = [...draft.agenda]
    .filter((b) => b.included)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  if (existing.length > 0) return existing;
  return rebuildAgendaFromDraft(draft).filter((b) => b.included);
}

const AGENDA_RULES = [
  "Follow the timed agenda — the buyer owns the demo flow.",
  "Use a standard product environment where possible (not a one-off showcase tenant).",
  "Clearly identify anything that needs configuration, customization, another product, an add-on module, or a higher plan.",
  "If a requested capability cannot be demonstrated, say so — do not substitute an unrelated feature tour.",
  "Use the same core script for every vendor on the shortlist.",
];

type PdfColors = {
  navy: [number, number, number];
  primary: [number, number, number];
  muted: [number, number, number];
  body: [number, number, number];
  soft: [number, number, number];
  line: [number, number, number];
};

/**
 * Dedicated timed agenda PDF — usable as a meeting run-of-show.
 * Not a truncated checklist.
 */
export async function downloadDemoAgendaPdf(
  session: CrmDemoChecklistSession,
  options: { vendorName?: string; filename?: string } = {},
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const colors: PdfColors = {
    navy: [15, 35, 70],
    primary: [37, 99, 235],
    muted: [100, 116, 139],
    body: [40, 40, 50],
    soft: [248, 250, 252],
    line: [226, 232, 240],
  };

  const draft = session.draft;
  const duration = resolveDemoDurationMinutes(draft.setup);
  const blocks = agendaBlocksForExport(draft);
  const totalMinutes = blocks.reduce((sum, b) => sum + b.minutes, 0);
  const attendees = draft.setup.attendeeRoles
    .map((role) => DEMO_ATTENDEE_LABELS[role])
    .join(", ");

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
      drawFooter();
    }
  };

  const drawFooter = () => {
    const page = doc.getNumberOfPages();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(
      "SoftwareGlimpse · Buyer-owned CRM demo agenda · Same script for every vendor",
      margin,
      pageH - 24,
    );
    doc.text(String(page), pageW - margin, pageH - 24, { align: "right" });
  };

  // Header band
  doc.setFillColor(...colors.navy);
  doc.rect(0, 0, pageW, 92, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("CRM Vendor Demo Agenda", margin, 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(191, 219, 254);
  doc.text(
    `${duration}-minute run-of-show · Keep every vendor on the same script`,
    margin,
    62,
  );
  y = 116;

  // Meta card
  const metaTop = y;
  doc.setFillColor(...colors.soft);
  doc.setDrawColor(...colors.line);
  doc.roundedRect(margin, metaTop, maxW, 88, 6, 6, "FD");

  const metaLeft = margin + 14;
  const metaMid = margin + maxW / 2 + 8;
  let metaY = metaTop + 22;

  const metaPair = (
    x: number,
    label: string,
    value: string,
    rowY: number,
  ) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(label.toUpperCase(), x, rowY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.navy);
    const lines = doc.splitTextToSize(value || "—", maxW / 2 - 28) as string[];
    doc.text(lines[0] ?? "—", x, rowY + 14);
  };

  metaPair(metaLeft, "Project", draft.setup.projectName || "Untitled project", metaY);
  metaPair(
    metaMid,
    "Demo type",
    DEMO_TYPE_LABELS[draft.setup.demoType],
    metaY,
  );
  metaY += 36;
  metaPair(
    metaLeft,
    "Demo owner",
    draft.setup.demoOwner || "________________",
    metaY,
  );
  metaPair(
    metaMid,
    options.vendorName ? "Vendor" : "Date",
    options.vendorName || "________________",
    metaY,
  );
  y = metaTop + 104;

  // Duration summary strip
  ensure(36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...colors.navy);
  doc.text("Timed agenda", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const fitLabel =
    totalMinutes > duration
      ? `${totalMinutes} min planned · exceeds ${duration} min allotment`
      : `${totalMinutes} / ${duration} min`;
  doc.setTextColor(
    ...(totalMinutes > duration
      ? ([180, 83, 9] as [number, number, number])
      : colors.muted),
  );
  doc.text(fitLabel, pageW - margin, y, { align: "right" });
  y += 10;
  doc.setDrawColor(...colors.line);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 16;

  if (attendees) {
    ensure(28);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.muted);
    doc.text(`Expected attendees: ${attendees}`, margin, y);
    y += 18;
  }

  if (blocks.length === 0) {
    ensure(40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.body);
    doc.text(
      "No agenda blocks yet. Rebuild the agenda in the Demo Checklist Builder, then export again.",
      margin,
      y,
    );
    y += 24;
  } else {
    // Column headers
    ensure(22);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text("CLOCK", margin, y);
    doc.text("BLOCK", margin + 78, y);
    doc.text("MIN", pageW - margin - 28, y, { align: "right" });
    y += 8;
    doc.setDrawColor(...colors.line);
    doc.line(margin, y, pageW - margin, y);
    y += 12;

    let elapsed = 0;
    for (const [index, block] of blocks.entries()) {
      const scenario = block.scenarioId
        ? draft.scenarios.find((s) => s.id === block.scenarioId)
        : undefined;
      const startLabel = formatClock(elapsed);
      const endLabel = formatClock(elapsed + block.minutes);
      const detailParts: string[] = [];
      if (scenario?.persona) detailParts.push(scenario.persona);
      if (scenario?.priority) {
        detailParts.push(DEMO_ITEM_PRIORITY_LABELS[scenario.priority]);
      }
      if (!scenario && block.kind) {
        detailParts.push(
          block.kind === "intro"
            ? "Opening"
            : block.kind === "wrap"
              ? "Close"
              : block.kind === "questions"
                ? "Q&A"
                : block.kind.replace(/-/g, " "),
        );
      }
      const detail = detailParts.join(" · ");
      const objective =
        scenario?.businessContext?.trim() ||
        (block.kind === "intro"
          ? "Confirm attendees, demo rules and timeboxes."
          : block.kind === "questions"
            ? "Capture open questions and follow-ups."
            : "");

      const titleLines = doc.splitTextToSize(
        block.label || "Agenda block",
        maxW - 120,
      ) as string[];
      const objectiveLines = objective
        ? (doc.splitTextToSize(objective, maxW - 120) as string[])
        : [];
      const rowHeight =
        18 +
        titleLines.length * 12 +
        (detail ? 12 : 0) +
        objectiveLines.length * 11 +
        10;

      ensure(rowHeight);

      if (index % 2 === 0) {
        doc.setFillColor(...colors.soft);
        doc.roundedRect(margin - 4, y - 10, maxW + 8, rowHeight - 2, 4, 4, "F");
      }

      // Clock range
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...colors.primary);
      doc.text(startLabel, margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...colors.muted);
      doc.text(`– ${endLabel}`, margin, y + 11);

      // Number + title
      const num = String(index + 1).padStart(2, "0");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.navy);
      doc.text(num, margin + 78, y);
      doc.text(titleLines, margin + 100, y);

      // Minutes
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.navy);
      doc.text(`${block.minutes}`, pageW - margin, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...colors.muted);
      doc.text("min", pageW - margin, y + 10, { align: "right" });

      let cursor = y + titleLines.length * 12 + 2;
      if (detail) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.muted);
        doc.text(detail, margin + 100, cursor);
        cursor += 12;
      }
      if (objectiveLines.length) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.body);
        doc.text(objectiveLines.slice(0, 2), margin + 100, cursor);
        cursor += Math.min(objectiveLines.length, 2) * 11;
      }

      y = Math.max(y + rowHeight - 4, cursor + 8);
      elapsed += block.minutes;
    }

    // Total bar
    ensure(36);
    y += 4;
    doc.setFillColor(...colors.navy);
    doc.roundedRect(margin, y, maxW, 28, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Total planned time", margin + 12, y + 18);
    doc.text(
      `${totalMinutes} min${totalMinutes !== duration ? `  (allotted ${duration})` : ""}`,
      pageW - margin - 12,
      y + 18,
      { align: "right" },
    );
    y += 44;
  }

  // Compact rules — not the full guidelines wall
  ensure(120);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...colors.navy);
  doc.text("Demo rules", margin, y);
  y += 16;
  for (const rule of AGENDA_RULES) {
    const lines = doc.splitTextToSize(rule, maxW - 16) as string[];
    ensure(lines.length * 12 + 8);
    doc.setFillColor(...colors.primary);
    doc.circle(margin + 3, y - 3, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.body);
    doc.text(lines, margin + 14, y);
    y += lines.length * 12 + 6;
  }

  if (draft.setup.notes.trim()) {
    ensure(48);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...colors.navy);
    doc.text("Notes for this session", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.body);
    const noteLines = doc.splitTextToSize(draft.setup.notes.trim(), maxW) as string[];
    ensure(noteLines.length * 12 + 8);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 12 + 8;
  }

  drawFooter();

  const slug =
    (draft.setup.projectName || "agenda")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "agenda";
  downloadBlob(
    doc.output("blob"),
    options.filename ?? `crm-demo-agenda-${slug}.pdf`,
  );
}

/**
 * Vendor-facing preparation brief — send before the demo so the SE/AE
 * can stage data and rehearse the exact workflows (not a feature tour).
 */
export async function downloadDemoVendorBriefPdf(
  session: CrmDemoChecklistSession,
  options: { vendorName?: string; filename?: string } = {},
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const colors: PdfColors = {
    navy: [15, 35, 70],
    primary: [37, 99, 235],
    muted: [100, 116, 139],
    body: [40, 40, 50],
    soft: [248, 250, 252],
    line: [226, 232, 240],
  };

  const draft = session.draft;
  const duration = resolveDemoDurationMinutes(draft.setup);
  const blocks = agendaBlocksForExport(draft);
  const scenarios = includedScenarios(draft);
  const integrations = draft.integrations.filter((i) => i.demoRequested);
  const adminTasks = draft.adminTasks.filter((t) => t.included);
  const commercial = draft.commercialQuestions.filter((q) => q.included);
  const attendees = draft.setup.attendeeRoles
    .map((role) => DEMO_ATTENDEE_LABELS[role])
    .join(", ");

  const ensure = (need: number) => {
    if (y + need > pageH - margin - 10) {
      doc.addPage();
      y = margin;
      drawFooter();
    }
  };

  const drawFooter = () => {
    const page = doc.getNumberOfPages();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(
      "SoftwareGlimpse · Vendor demo brief · Prepare the workflows below — do not substitute a feature tour",
      margin,
      pageH - 24,
    );
    doc.text(String(page), pageW - margin, pageH - 24, { align: "right" });
  };

  const sectionTitle = (text: string) => {
    ensure(36);
    y += 4;
    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin, y - 10, 4, 14, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...colors.navy);
    doc.text(text, margin + 12, y);
    y += 18;
  };

  const body = (text: string, size = 9.5) => {
    if (!text.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...colors.body);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    ensure(lines.length * 12 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 12 + 4;
  };

  const bullet = (text: string) => {
    const lines = doc.splitTextToSize(text, maxW - 14) as string[];
    ensure(lines.length * 11 + 6);
    doc.setFillColor(...colors.primary);
    doc.circle(margin + 3, y - 3, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.body);
    doc.text(lines, margin + 14, y);
    y += lines.length * 11 + 5;
  };

  // Header
  doc.setFillColor(...colors.navy);
  doc.rect(0, 0, pageW, 100, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text("CRM Vendor Demo Brief", margin, 38);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(191, 219, 254);
  doc.text(
    "Preparation pack for your live product demo",
    margin,
    58,
  );
  doc.text(
    "Please rehearse the workflows below. The buyer owns the agenda.",
    margin,
    74,
  );
  y = 124;

  // Meta card
  const metaTop = y;
  doc.setFillColor(...colors.soft);
  doc.setDrawColor(...colors.line);
  doc.roundedRect(margin, metaTop, maxW, 108, 6, 6, "FD");

  const metaPair = (
    x: number,
    label: string,
    value: string,
    rowY: number,
    width = maxW / 2 - 28,
  ) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(label.toUpperCase(), x, rowY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.navy);
    const lines = doc.splitTextToSize(value || "—", width) as string[];
    doc.text(lines[0] ?? "—", x, rowY + 14);
  };

  const metaLeft = margin + 14;
  const metaMid = margin + maxW / 2 + 8;
  let metaY = metaTop + 20;
  metaPair(metaLeft, "Project", draft.setup.projectName || "Untitled project", metaY);
  metaPair(
    metaMid,
    "Vendor",
    options.vendorName || "________________",
    metaY,
  );
  metaY += 34;
  metaPair(metaLeft, "Demo type", DEMO_TYPE_LABELS[draft.setup.demoType], metaY);
  metaPair(metaMid, "Duration", `${duration} minutes`, metaY);
  metaY += 34;
  metaPair(
    metaLeft,
    "Buyer contact",
    draft.setup.demoOwner || "________________",
    metaY,
  );
  metaPair(metaMid, "Demo date", "________________", metaY);
  y = metaTop + 124;

  if (attendees) {
    ensure(22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.muted);
    doc.text(`Expected buyer attendees: ${attendees}`, margin, y);
    y += 16;
  }

  // Purpose
  sectionTitle("Purpose of this brief");
  body(
    "This pack tells you exactly what to demonstrate so we can compare CRM vendors fairly. Please do not run a generic product tour. Prepare sample data and configuration that support the scenarios below.",
  );

  sectionTitle("Environment expectations");
  bullet(
    "Use a standard product environment that reflects what a customer would receive on the quoted edition.",
  );
  bullet(
    "Stage realistic sample data (leads, accounts, opportunities, activities) before the call.",
  );
  bullet(
    "Have an admin-capable user available for configuration, reporting and permission demos.",
  );
  bullet(
    "Be ready to state plan packaging, modules, configuration effort and limitations live.",
  );

  sectionTitle("Demo rules");
  for (const rule of AGENDA_RULES) bullet(rule);

  // Agenda overview
  sectionTitle("Timed agenda overview");
  if (blocks.length === 0) {
    body("Agenda will be confirmed before the session.");
  } else {
    ensure(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text("CLOCK", margin, y);
    doc.text("BLOCK", margin + 72, y);
    doc.text("MIN", pageW - margin, y, { align: "right" });
    y += 6;
    doc.setDrawColor(...colors.line);
    doc.line(margin, y, pageW - margin, y);
    y += 12;

    let elapsed = 0;
    for (const [index, block] of blocks.entries()) {
      ensure(18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...colors.primary);
      doc.text(formatClock(elapsed), margin, y);
      doc.setTextColor(...colors.navy);
      doc.text(
        `${String(index + 1).padStart(2, "0")}  ${block.label}`,
        margin + 72,
        y,
      );
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.muted);
      doc.text(`${block.minutes}`, pageW - margin, y, { align: "right" });
      y += 14;
      elapsed += block.minutes;
    }
    ensure(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...colors.navy);
    doc.text(
      `Total planned: ${elapsed} min (allotted ${duration} min)`,
      margin,
      y,
    );
    y += 14;
  }

  // Scenario preparation — the core value
  sectionTitle("Scenarios to prepare");
  body(
    "For each scenario, rehearse the exact steps. We will ask you to demonstrate observable behaviour — not slides.",
    9,
  );
  y += 4;

  for (const [index, scenario] of scenarios.entries()) {
    const tasks = scenario.vendorTasks.filter((t) => t.trim());
    const success = scenario.successCriteria.filter((c) => c.trim());

    ensure(70);
    doc.setDrawColor(...colors.line);
    doc.setLineWidth(0.8);
    doc.line(margin, y, pageW - margin, y);
    y += 14;

    // Number + title
    doc.setFillColor(...colors.primary);
    doc.roundedRect(margin, y - 11, 28, 18, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(String(index + 1).padStart(2, "0"), margin + 14, y + 2, {
      align: "center",
    });

    const titleLines = doc.splitTextToSize(
      scenario.name || "Untitled scenario",
      maxW - 44,
    ) as string[];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...colors.navy);
    doc.text(titleLines, margin + 38, y);
    y += Math.max(14, titleLines.length * 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(
      [
        scenario.persona || "Persona TBD",
        DEMO_ITEM_PRIORITY_LABELS[scenario.priority],
        `${scenario.estimatedMinutes} min`,
      ].join("  ·  "),
      margin + 38,
      y,
    );
    y += 16;

    const labeledBlock = (label: string, value: string) => {
      if (!value.trim()) return;
      ensure(28);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...colors.muted);
      doc.text(label.toUpperCase(), margin, y);
      y += 11;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.body);
      const lines = doc.splitTextToSize(value.trim(), maxW) as string[];
      ensure(lines.length * 11 + 6);
      doc.text(lines, margin, y);
      y += lines.length * 11 + 8;
    };

    labeledBlock("Business question", scenario.businessContext);
    labeledBlock("Starting state to prepare", scenario.startingState);

    if (tasks.length) {
      ensure(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...colors.muted);
      doc.text("PLEASE DEMONSTRATE", margin, y);
      y += 12;
      for (const [ti, task] of tasks.entries()) {
        const lines = doc.splitTextToSize(
          `${ti + 1}. ${task}`,
          maxW,
        ) as string[];
        ensure(lines.length * 11 + 4);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.body);
        doc.text(lines, margin, y);
        y += lines.length * 11 + 3;
      }
      y += 6;
    }

    if (success.length) {
      ensure(24);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...colors.muted);
      doc.text("WE WILL CONSIDER IT SUCCESSFUL WHEN", margin, y);
      y += 12;
      for (const criterion of success) {
        const lines = doc.splitTextToSize(`• ${criterion}`, maxW) as string[];
        ensure(lines.length * 11 + 4);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.body);
        doc.text(lines, margin, y);
        y += lines.length * 11 + 3;
      }
      y += 8;
    }
  }

  // Integrations
  if (integrations.length) {
    sectionTitle("Integrations & data to prepare");
    body(
      "Be ready to demonstrate these connections (or clearly state limits / marketplace / API alternatives).",
      9,
    );
    for (const integ of integrations) {
      ensure(36);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.navy);
      doc.text(
        `${integ.integration}${integ.required ? "  (required)" : ""}`,
        margin,
        y,
      );
      y += 12;
      if (integ.testTask.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.body);
        const lines = doc.splitTextToSize(integ.testTask, maxW) as string[];
        ensure(lines.length * 11 + 6);
        doc.text(lines, margin, y);
        y += lines.length * 11 + 8;
      }
    }
  }

  // Admin / reporting / AI
  if (adminTasks.length) {
    sectionTitle("Reporting, administration & AI to prepare");
    for (const task of adminTasks) {
      ensure(40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.navy);
      doc.text(
        `${task.label}  ·  ${task.estimatedMinutes} min  ·  ${DEMO_ITEM_PRIORITY_LABELS[task.priority]}`,
        margin,
        y,
      );
      y += 12;
      if (task.vendorTask.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.body);
        const lines = doc.splitTextToSize(
          `Demonstrate: ${task.vendorTask}`,
          maxW,
        ) as string[];
        ensure(lines.length * 11 + 4);
        doc.text(lines, margin, y);
        y += lines.length * 11 + 4;
      }
      if (task.successCriteria.trim()) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...colors.muted);
        const lines = doc.splitTextToSize(
          `Success: ${task.successCriteria}`,
          maxW,
        ) as string[];
        ensure(lines.length * 10 + 8);
        doc.text(lines, margin, y);
        y += lines.length * 10 + 10;
      }
    }
  }

  // Commercial — ask don't demo
  if (commercial.length) {
    sectionTitle("Written follow-up (not live demo time)");
    body(
      "Commercial and implementation topics will be handled as written follow-up unless we explicitly reserve time. Please do not consume the demo with pricing slides.",
      9,
    );
    for (const q of commercial.slice(0, 8)) {
      bullet(`${q.topic}: ${q.question}`);
    }
    if (commercial.length > 8) {
      body(
        `+ ${commercial.length - 8} additional written questions will be shared separately.`,
        8,
      );
    }
  }

  sectionTitle("After the demo");
  bullet(
    "We will score each scenario with separate evidence status (demonstrated vs vendor-stated).",
  );
  bullet(
    "Must-have gaps remain visible and are not averaged away.",
  );
  bullet(
    "Please send any documentation URLs referenced during the session as follow-up.",
  );

  y += 8;
  ensure(28);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...colors.muted);
  doc.text(
    "Thank you — we look forward to a focused, comparable product demonstration.",
    margin,
    y,
  );

  drawFooter();

  const slug =
    (options.vendorName || draft.setup.projectName || "vendor")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "vendor";
  downloadBlob(
    doc.output("blob"),
    options.filename ?? `crm-vendor-demo-brief-${slug}.pdf`,
  );
}

export async function downloadDemoChecklistPdf(
  session: CrmDemoChecklistSession,
  options: {
    vendorName?: string;
    filename?: string;
    agendaOnly?: boolean;
    vendorBrief?: boolean;
  } = {},
): Promise<void> {
  if (options.agendaOnly) {
    await downloadDemoAgendaPdf(session, {
      vendorName: options.vendorName,
      filename: options.filename,
    });
    return;
  }
  if (options.vendorBrief) {
    await downloadDemoVendorBriefPdf(session, {
      vendorName: options.vendorName,
      filename: options.filename,
    });
    return;
  }

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const navy: [number, number, number] = [15, 35, 70];
  const primary: [number, number, number] = [37, 99, 235];
  const muted: [number, number, number] = [100, 116, 139];
  const bodyColor: [number, number, number] = [40, 40, 50];

  const draft = session.draft;
  const duration = resolveDemoDurationMinutes(draft.setup);

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const h1 = (text: string) => {
    ensure(40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...navy);
    doc.text(text, margin, y);
    y += 26;
  };

  const h2 = (text: string) => {
    ensure(32);
    y += 6;
    doc.setFillColor(...primary);
    doc.roundedRect(margin, y - 10, 4, 14, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(text, margin + 12, y);
    y += 20;
  };

  const body = (text: string) => {
    if (!text.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...bodyColor);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    ensure(lines.length * 13 + 6);
    doc.text(lines, margin, y);
    y += lines.length * 13 + 6;
  };

  const mutedLine = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    ensure(lines.length * 12 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 12 + 4;
  };

  const kv = (label: string, value: string) => {
    if (!value.trim()) return;
    ensure(16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(label, margin, y);
    doc.setTextColor(...bodyColor);
    doc.text(value, margin + 120, y);
    y += 14;
  };

  const checkboxRow = (label: string) => {
    ensure(18);
    doc.setDrawColor(...muted);
    doc.rect(margin, y - 8, 10, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...bodyColor);
    const lines = doc.splitTextToSize(label, maxW - 18) as string[];
    doc.text(lines, margin + 16, y);
    y += Math.max(16, lines.length * 12);
  };

  h1("CRM Vendor Demo Checklist");
  mutedLine("SoftwareGlimpse evaluation workbook");
  y += 4;
  kv("Project", draft.setup.projectName || "Untitled");
  if (options.vendorName) kv("Vendor", options.vendorName);
  kv("Demo type", DEMO_TYPE_LABELS[draft.setup.demoType]);
  kv("Duration", `${duration} minutes`);
  kv("Evaluator", draft.setup.demoOwner || "________________");
  kv("Date", "________________");
  y += 8;

  h2("Demo guidelines");
  body(draft.demoGuidelines || AGENDA_RULES.join("\n"));

  const agenda = agendaBlocksForExport(draft);
  if (agenda.length) {
    h2("Agenda");
    let elapsed = 0;
    for (const [index, block] of agenda.entries()) {
      ensure(16);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...navy);
      doc.text(
        `${formatClock(elapsed)}  ${String(index + 1).padStart(2, "0")} — ${block.label}`,
        margin,
        y,
      );
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.text(`${block.minutes} min`, pageW - margin, y, { align: "right" });
      y += 14;
      elapsed += block.minutes;
    }
  }

  for (const [index, scenario] of includedScenarios(draft).entries()) {
    h2(
      `${String(index + 1).padStart(2, "0")} — ${scenario.name.toUpperCase()}`,
    );
    mutedLine(
      `${scenario.persona || "Persona TBD"} · ${DEMO_ITEM_PRIORITY_LABELS[scenario.priority]} · ${scenario.estimatedMinutes} min`,
    );
    if (scenario.businessContext) {
      body(`Objective: ${scenario.businessContext}`);
    }
    if (scenario.startingState) {
      body(`Starting state: ${scenario.startingState}`);
    }
    body("Ask vendor to:");
    for (const [i, task] of scenario.vendorTasks.entries()) {
      body(`${i + 1}. ${task}`);
    }
    body("Success");
    checkboxRow("Completed");
    checkboxRow("Completed with limitation");
    checkboxRow("Unable");
    checkboxRow("Not demonstrated");
    for (const c of scenario.successCriteria) checkboxRow(c);

    body("Score:  0   1   2   3   4   5");
    body(
      "Evidence status: Verified in demo / Vendor stated / Docs / Follow-up / Not verified",
    );
    body("Evidence: _______________________________________________");
    body("Notes: __________________________________________________");
  }

  const admin = draft.adminTasks.filter((t) => t.included);
  if (admin.length) {
    h2("Reporting, administration & AI");
    for (const task of admin) {
      body(`${task.label}: ${task.vendorTask}`);
      checkboxRow("Completed");
      checkboxRow("Completed with limitation");
      checkboxRow("Unable / Not demonstrated");
      body(`Success: ${task.successCriteria}`);
      body(`Evidence: ${task.evidenceRequired}`);
      y += 4;
    }
  }

  const commercialQs = draft.commercialQuestions.filter((q) => q.included);
  if (commercialQs.length) {
    h2("Ask, don't demo");
    for (const q of commercialQs) {
      body(`${q.topic}: ${q.question}`);
      body("Response: ____________________________________________");
    }
  }

  mutedLine(
    "Generated with SoftwareGlimpse. Same core demo script should be used for every vendor.",
  );

  downloadBlob(
    doc.output("blob"),
    options.filename ??
      `crm-demo-checklist-${Date.now().toString(36)}.pdf`,
  );
}
