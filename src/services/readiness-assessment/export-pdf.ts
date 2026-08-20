/**
 * CRM Readiness Assessment PDF — consulting-style diagnostic report.
 * Client-side jsPDF (dynamic import).
 */

import type { CrmReadinessSession, ReadinessActionPhase } from "@/domain";
import { READINESS_DIMENSIONS } from "./catalog";
import {
  DIMENSION_LEVEL_LABELS,
  READINESS_LEVEL_LABELS,
  scoreBandLabel,
} from "./score";
import { type ReadinessAction } from "./findings";
import { readinessExportBasename } from "./export-shared";
import {
  prepareReadinessExportReport,
  type ReadinessExportOptions,
} from "./localize-catalog";

const PHASES: Array<{ id: ReadinessActionPhase; label: string }> = [
  { id: "do-now", label: "Do now (0–4 weeks)" },
  { id: "before-demos", label: "Before vendor demos" },
  { id: "before-contract", label: "Before contract" },
  { id: "before-go-live", label: "Before go-live" },
];

type RGB = [number, number, number];

const COLORS = {
  navy: [15, 23, 42] as RGB,
  primary: [37, 99, 235] as RGB,
  primarySoft: [239, 246, 255] as RGB,
  muted: [100, 116, 139] as RGB,
  body: [51, 65, 85] as RGB,
  soft: [248, 250, 252] as RGB,
  line: [226, 232, 240] as RGB,
  white: [255, 255, 255] as RGB,
  success: [22, 163, 74] as RGB,
  successSoft: [220, 252, 231] as RGB,
  warning: [217, 119, 6] as RGB,
  warningSoft: [254, 243, 199] as RGB,
  danger: [220, 38, 38] as RGB,
  dangerSoft: [254, 226, 226] as RGB,
};

function levelAccent(
  level: string,
): { fill: RGB; soft: RGB; label: string } {
  if (
    level === "strongly-prepared" ||
    level === "ready-for-selection" ||
    level === "ready-for-structured-discovery"
  ) {
    return {
      fill: COLORS.success,
      soft: COLORS.successSoft,
      label: READINESS_LEVEL_LABELS[level as keyof typeof READINESS_LEVEL_LABELS],
    };
  }
  if (level === "preparation-required") {
    return {
      fill: COLORS.warning,
      soft: COLORS.warningSoft,
      label: READINESS_LEVEL_LABELS[level as keyof typeof READINESS_LEVEL_LABELS],
    };
  }
  return {
    fill: COLORS.danger,
    soft: COLORS.dangerSoft,
    label: READINESS_LEVEL_LABELS[
      level as keyof typeof READINESS_LEVEL_LABELS
    ] ?? level,
  };
}

function scoreFill(score: number): RGB {
  if (score >= 80) return COLORS.success;
  if (score >= 65) return [52, 211, 153];
  if (score >= 45) return COLORS.warning;
  return COLORS.danger;
}

export async function downloadReadinessPdf(
  session: CrmReadinessSession,
  options: ReadinessExportOptions = {},
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const report = prepareReadinessExportReport(session, options);
  const productLabel = options.nounCopy?.shortName ?? "CRM";
  const assessmentTitle = `${productLabel} Readiness Assessment`;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxW = pageW - margin * 2;
  const footerY = pageH - 28;
  let y = margin;

  const ensure = (need: number) => {
    if (y + need > footerY - 12) {
      doc.addPage();
      drawPageChrome();
      y = margin + 8;
    }
  };

  const drawPageChrome = () => {
    const page = doc.getNumberOfPages();
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY - 10, pageW - margin, footerY - 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(
      `SoftwareGlimpse · ${assessmentTitle} · crm-readiness-v1`,
      margin,
      footerY,
    );
    doc.text(`Page ${page}`, pageW - margin, footerY, { align: "right" });
  };

  const h2 = (text: string) => {
    ensure(36);
    y += 8;
    doc.setFillColor(...COLORS.primary);
    doc.roundedRect(margin, y - 11, 4, 16, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...COLORS.navy);
    doc.text(text, margin + 12, y);
    y += 22;
  };

  const body = (text: string, opts?: { size?: number; color?: RGB }) => {
    if (!text.trim()) return;
    const size = opts?.size ?? 10;
    const color = opts?.color ?? COLORS.body;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    ensure(lines.length * (size + 3) + 4);
    doc.text(lines, margin, y);
    y += lines.length * (size + 3) + 4;
  };

  const scoreCard = (
    x: number,
    top: number,
    w: number,
    title: string,
    score: number,
    hint: string,
    accent: RGB,
  ) => {
    doc.setFillColor(...COLORS.white);
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(1);
    doc.roundedRect(x, top, w, 92, 8, 8, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.text(title, x + 14, top + 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...COLORS.navy);
    doc.text(String(score), x + 14, top + 52);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.muted);
    doc.text("/ 100", x + 14 + doc.getTextWidth(String(score)) + 6, top + 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const badgeLabel = scoreBandLabel(score);
    const badgeW = Math.max(64, doc.getTextWidth(badgeLabel) + 16);
    doc.setFillColor(...accent);
    doc.roundedRect(x + w - badgeW - 14, top + 16, badgeW, 18, 9, 9, "F");
    doc.setTextColor(...COLORS.white);
    doc.text(badgeLabel, x + w - 14 - badgeW / 2, top + 28, {
      align: "center",
    });
    doc.setFillColor(...COLORS.soft);
    doc.roundedRect(x + 14, top + 64, w - 28, 8, 4, 4, "F");
    doc.setFillColor(...accent);
    doc.roundedRect(
      x + 14,
      top + 64,
      Math.max(4, ((w - 28) * score) / 100),
      8,
      4,
      4,
      "F",
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    const hintLines = doc.splitTextToSize(hint, w - 28) as string[];
    doc.text(hintLines[0] ?? "", x + 14, top + 84);
  };

  // ── PAGE 1: Cover ────────────────────────────────────────────────
  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, pageW, 118, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(147, 197, 253);
  doc.text("SoftwareGlimpse", margin, 36);
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.white);
  doc.text(assessmentTitle, margin, 64);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(191, 219, 254);
  doc.text(
    "Selection readiness vs implementation readiness — diagnostic report",
    margin,
    86,
  );
  y = 140;

  // Meta strip
  doc.setFillColor(...COLORS.soft);
  doc.setDrawColor(...COLORS.line);
  doc.roundedRect(margin, y, maxW, 72, 8, 8, "FD");
  const metaTop = y + 18;
  const colW = maxW / 2;
  const metaPairs: Array<[string, string]> = [
    ["Project", session.context.projectName || "Untitled project"],
    ["Organization", session.context.organization || "—"],
    [
      "Assessed by",
      session.context.assessedBy || "—",
    ],
    [
      "Date completed",
      (session.completedAt || new Date().toISOString()).slice(0, 10),
    ],
    ["Company size", session.context.companySize || "—"],
    ["Industry", session.context.industry || "—"],
  ];
  metaPairs.forEach((pair, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const mx = margin + 14 + col * colW;
    const my = metaTop + row * 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(`${pair[0]}:`, mx, my);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...COLORS.navy);
    doc.text(pair[1].slice(0, 42), mx + 72, my);
  });
  y += 88;

  // Overall status banner
  const accent = levelAccent(report.assessment.overallLevel);
  doc.setFillColor(...accent.soft);
  doc.setDrawColor(...accent.fill);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, y, maxW, 56, 8, 8, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...accent.fill);
  doc.text("OVERALL STATUS", margin + 16, y + 18);
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.navy);
  doc.text(accent.label, margin + 16, y + 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    `${report.strengthCount} strengths  ·  ${report.gapCount} gaps  ·  ${report.criticalBlockerCount} critical`,
    pageW - margin - 16,
    y + 32,
    { align: "right" },
  );
  y += 72;

  // Dual score cards
  const cardW = (maxW - 14) / 2;
  scoreCard(
    margin,
    y,
    cardW,
    "Selection readiness",
    report.assessment.selectionScore,
    `Ready to evaluate and choose ${options.nounCopy?.softwarePhrase ?? "CRM software"}?`,
    COLORS.primary,
  );
  scoreCard(
    margin + cardW + 14,
    y,
    cardW,
    "Implementation readiness",
    report.assessment.implementationScore,
    "Could you successfully implement if selected?",
    scoreFill(report.assessment.implementationScore),
  );
  y += 110;

  h2("Executive summary");
  doc.setFillColor(...COLORS.primarySoft);
  const summaryLines = doc.splitTextToSize(
    report.executiveSummary,
    maxW - 28,
  ) as string[];
  const boxH = summaryLines.length * 13 + 24;
  ensure(boxH + 8);
  doc.roundedRect(margin, y, maxW, boxH, 8, 8, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.navy);
  doc.text(summaryLines, margin + 14, y + 18);
  y += boxH + 12;

  // Vendor decision
  h2(`Are you ready to talk to ${productLabel} vendors?`);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.navy);
  ensure(40);
  doc.text(report.vendorDecision.label, margin, y);
  y += 16;
  body(report.vendorDecision.summary);
  if (report.vendorDecision.conditions.length) {
    for (const c of report.vendorDecision.conditions) {
      body(`• ${c}`);
    }
  }

  drawPageChrome();

  // ── PAGE 2: Profile ──────────────────────────────────────────────
  doc.addPage();
  drawPageChrome();
  y = margin + 8;
  h2("Readiness profile by dimension");
  body(
    "Scores are deterministic for assessment version crm-readiness-v1. Horizontal bars are the primary reading; use them in project meetings.",
    { size: 9, color: COLORS.muted },
  );
  y += 4;

  const dimensionDefs = options.catalog?.dimensions ?? READINESS_DIMENSIONS;
  for (const dim of dimensionDefs) {
    const row = report.assessment.dimensions.find(
      (d) => d.dimensionId === dim.id,
    );
    if (!row) continue;
    ensure(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.navy);
    doc.text(dim.title, margin, y);

    const barX = margin + 168;
    const barW = maxW - 250;
    doc.setFillColor(...COLORS.soft);
    doc.roundedRect(barX, y - 8, barW, 10, 3, 3, "F");
    doc.setFillColor(...scoreFill(row.score));
    doc.roundedRect(
      barX,
      y - 8,
      Math.max(3, (barW * row.score) / 100),
      10,
      3,
      3,
      "F",
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.navy);
    doc.text(String(row.score), barX + barW + 10, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.text(DIMENSION_LEVEL_LABELS[row.level], barX + barW + 32, y);
    y += 22;
  }

  // ── PAGE 3: Findings ─────────────────────────────────────────────
  doc.addPage();
  drawPageChrome();
  y = margin + 8;
  h2("What's already in good shape");
  const strengths = report.findings.filter((f) => f.type === "strength");
  if (!strengths.length) {
    body("No strong dimensions recorded in this assessment.");
  } else {
    for (const f of strengths.slice(0, 8)) {
      ensure(36);
      doc.setFillColor(...COLORS.successSoft);
      doc.roundedRect(margin, y - 4, maxW, 30, 6, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.success);
      doc.text("✓", margin + 10, y + 12);
      doc.setTextColor(...COLORS.navy);
      doc.text(f.title, margin + 26, y + 12);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      const el = doc.splitTextToSize(f.explanation, maxW - 40) as string[];
      doc.text(el[0] ?? "", margin + 26, y + 24);
      y += 38;
    }
  }

  h2("Critical blockers & key risks");
  const blockers = report.findings.filter(
    (f) => f.type === "blocker" || f.type === "risk" || (f.type === "gap" && f.severity === "high"),
  );
  if (!blockers.length) {
    body("No critical blockers identified.");
  } else {
    for (const f of blockers.slice(0, 8)) {
      const isCritical = f.severity === "critical" || f.type === "blocker";
      const banner = isCritical ? COLORS.dangerSoft : COLORS.warningSoft;
      const tag = isCritical ? COLORS.danger : COLORS.warning;
      const linesWhy = doc.splitTextToSize(f.explanation, maxW - 28) as string[];
      const linesRec = doc.splitTextToSize(
        `Recommended: ${f.recommendation}`,
        maxW - 28,
      ) as string[];
      const boxH = 28 + linesWhy.length * 11 + linesRec.length * 11 + 10;
      ensure(boxH + 8);
      doc.setFillColor(...banner);
      doc.roundedRect(margin, y, maxW, boxH, 6, 6, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...tag);
      doc.text(f.severity.toUpperCase(), margin + 12, y + 14);
      doc.setFontSize(11);
      doc.setTextColor(...COLORS.navy);
      doc.text(f.title, margin + 12, y + 30);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.body);
      doc.text(linesWhy, margin + 12, y + 46);
      doc.setTextColor(...COLORS.muted);
      doc.text(linesRec, margin + 12, y + 46 + linesWhy.length * 11 + 4);
      y += boxH + 10;
    }
  }

  // ── PAGE 4+: Action plan ─────────────────────────────────────────
  doc.addPage();
  drawPageChrome();
  y = margin + 8;
  h2("Prioritized action plan");
  body(
    `Ordered by phase. Use this as the working agenda for the ${productLabel} project team.`,
    { size: 9, color: COLORS.muted },
  );

  for (const phase of PHASES) {
    const items = report.actions.filter((a) => a.phase === phase.id);
    if (!items.length) continue;
    ensure(28);
    doc.setFillColor(...COLORS.navy);
    doc.roundedRect(margin, y, maxW, 22, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.white);
    doc.text(phase.label, margin + 12, y + 15);
    y += 30;

    items.forEach((a: ReadinessAction, i: number) => {
      const whyLines = doc.splitTextToSize(a.reason, maxW - 24) as string[];
      const h = 42 + whyLines.length * 11;
      ensure(h);
      doc.setDrawColor(...COLORS.line);
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, y, maxW, h - 4, 4, 4, "S");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const priColor =
        a.priority === "critical"
          ? COLORS.danger
          : a.priority === "high"
            ? COLORS.warning
            : COLORS.primary;
      doc.setTextColor(...priColor);
      doc.text(a.priority.toUpperCase(), margin + 10, y + 14);
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.navy);
      doc.text(`${i + 1}. ${a.title}`, margin + 70, y + 14);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      doc.text(
        `Effort: ${a.effort}  ·  Owner: ${a.ownerHint}`,
        margin + 10,
        y + 28,
      );
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.body);
      doc.text(whyLines, margin + 10, y + 42);
      y += h;
    });
  }

  // ── Risk register ────────────────────────────────────────────────
  ensure(80);
  h2("Risk register");

  // Table header
  ensure(24);
  doc.setFillColor(...COLORS.soft);
  doc.rect(margin, y - 4, maxW, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  const cols = [
    { label: "Risk", x: margin + 6, w: 150 },
    { label: "Severity", x: margin + 156, w: 55 },
    { label: "Phase", x: margin + 214, w: 90 },
    { label: "Mitigation", x: margin + 308, w: maxW - 314 },
  ];
  cols.forEach((c) => doc.text(c.label, c.x, y + 8));
  y += 20;

  for (const r of report.risks.slice(0, 12)) {
    const riskLines = doc.splitTextToSize(r.risk, cols[0]!.w - 4) as string[];
    const mitLines = doc.splitTextToSize(r.mitigation, cols[3]!.w - 4) as string[];
    const rowH = Math.max(riskLines.length, mitLines.length) * 11 + 10;
    ensure(rowH + 4);
    doc.setDrawColor(...COLORS.line);
    doc.setLineWidth(0.4);
    doc.line(margin, y + rowH - 2, pageW - margin, y + rowH - 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.navy);
    doc.text(riskLines, cols[0]!.x, y + 8);
    doc.setTextColor(
      ...(r.severity === "critical"
        ? COLORS.danger
        : r.severity === "high"
          ? COLORS.warning
          : COLORS.body),
    );
    doc.text(r.severity, cols[1]!.x, y + 8);
    doc.setTextColor(...COLORS.body);
    const phaseLines = doc.splitTextToSize(r.phase, cols[2]!.w - 4) as string[];
    doc.text(phaseLines, cols[2]!.x, y + 8);
    doc.text(mitLines, cols[3]!.x, y + 8);
    y += rowH;
  }

  // ── Next tools ───────────────────────────────────────────────────
  ensure(100);
  h2("Recommended next steps on SoftwareGlimpse");
  for (const t of report.tools.slice(0, 6)) {
    ensure(36);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...COLORS.navy);
    doc.text(t.locked ? `${t.title} (later)` : t.title, margin, y);
    y += 12;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    const lines = doc.splitTextToSize(
      t.locked ? t.lockReason ?? t.reason : t.reason,
      maxW,
    ) as string[];
    doc.text(lines, margin, y);
    y += lines.length * 11 + 8;
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(8);
    doc.text(t.href.replace(/^\//, "softwareglimpse.com/"), margin, y);
    y += 16;
  }

  ensure(48);
  y += 8;
  doc.setFillColor(...COLORS.soft);
  doc.roundedRect(margin, y, maxW, 44, 6, 6, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  const disc = doc.splitTextToSize(
    "Disclaimer: This report is decision-support only. Scores are deterministic for crm-readiness-v1 and do not guarantee implementation success. SoftwareGlimpse does not provide legal, security, privacy or procurement advice.",
    maxW - 24,
  ) as string[];
  doc.text(disc, margin + 12, y + 16);

  drawPageChrome();
  doc.save(`${readinessExportBasename(session, productLabel)}.pdf`);
}

export async function downloadActionPlanPdf(
  session: CrmReadinessSession,
  options: ReadinessExportOptions = {},
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const report = prepareReadinessExportReport(session, options);
  const productLabel = options.nounCopy?.shortName ?? "CRM";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensure = (need: number) => {
    if (y + need > pageH - 40) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, pageW, 72, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.white);
  doc.text(`${productLabel} Readiness — Action Plan`, margin, 44);
  y = 96;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.muted);
  doc.text(
    session.context.projectName || "Untitled project",
    margin,
    y,
  );
  y += 24;

  for (const phase of PHASES) {
    const items = report.actions.filter((a) => a.phase === phase.id);
    if (!items.length) continue;
    ensure(28);
    doc.setFillColor(...COLORS.primarySoft);
    doc.roundedRect(margin, y, maxW, 22, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.navy);
    doc.text(phase.label, margin + 10, y + 15);
    y += 34;
    items.forEach((a, i) => {
      ensure(48);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...COLORS.navy);
      doc.text(`${i + 1}. [${a.priority}] ${a.title}`, margin, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.body);
      const lines = doc.splitTextToSize(
        `${a.reason} · Effort: ${a.effort} · Owner: ${a.ownerHint}`,
        maxW,
      ) as string[];
      doc.text(lines, margin, y);
      y += lines.length * 12 + 12;
    });
  }

  doc.save(`${readinessExportBasename(session, productLabel)}-action-plan.pdf`);
}

export async function downloadRiskRegisterPdf(
  session: CrmReadinessSession,
  options: ReadinessExportOptions = {},
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const report = prepareReadinessExportReport(session, options);
  const productLabel = options.nounCopy?.shortName ?? "CRM";
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 44;
  const maxW = pageW - margin * 2;
  let y = margin;

  const ensure = (need: number) => {
    if (y + need > pageH - 40) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, pageW, 72, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...COLORS.white);
  doc.text(`${productLabel} Readiness — Risk Register`, margin, 44);
  y = 96;

  for (const r of report.risks) {
    const why = doc.splitTextToSize(`Why: ${r.why}`, maxW - 24) as string[];
    const impact = doc.splitTextToSize(`Impact: ${r.impact}`, maxW - 24) as string[];
    const mit = doc.splitTextToSize(
      `Mitigation: ${r.mitigation}`,
      maxW - 24,
    ) as string[];
    const boxH = 36 + (why.length + impact.length + mit.length) * 11 + 16;
    ensure(boxH + 8);
    const soft =
      r.severity === "critical"
        ? COLORS.dangerSoft
        : r.severity === "high"
          ? COLORS.warningSoft
          : COLORS.soft;
    doc.setFillColor(...soft);
    doc.roundedRect(margin, y, maxW, boxH, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(
      ...(r.severity === "critical"
        ? COLORS.danger
        : r.severity === "high"
          ? COLORS.warning
          : COLORS.muted),
    );
    doc.text(`${r.severity.toUpperCase()} · ${r.phase}`, margin + 12, y + 16);
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.navy);
    doc.text(r.risk, margin + 12, y + 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.body);
    let ty = y + 48;
    doc.text(why, margin + 12, ty);
    ty += why.length * 11 + 2;
    doc.text(impact, margin + 12, ty);
    ty += impact.length * 11 + 2;
    doc.setTextColor(...COLORS.muted);
    doc.text(mit, margin + 12, ty);
    y += boxH + 10;
  }

  doc.save(`${readinessExportBasename(session, productLabel)}-risk-register.pdf`);
}
