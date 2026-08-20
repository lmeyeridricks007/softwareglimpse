/**
 * CRM Vendor Scorecard — PDF workbook (evaluation scoring with evidence confidence).
 * Blank fill-in fields only; EXAMPLE / SAMPLE rows are labelled for replacement.
 * Not a Pass/Fail checklist dump. No invented vendor winners or research rankings.
 * Differentiates from Decision Matrix (TCO / risk / final selection).
 */

import type { jsPDF } from "jspdf";

type RGB = [number, number, number];

const NAVY: RGB = [15, 23, 42];
const PRIMARY: RGB = [37, 99, 235];
const MUTED: RGB = [100, 116, 139];
const BORDER: RGB = [226, 232, 240];
const SURFACE: RGB = [248, 250, 252];
const WHITE: RGB = [255, 255, 255];
const CARD_DARK: RGB = [30, 58, 138];
const AMBER_BG: RGB = [255, 251, 235];
const BLUE_BG: RGB = [239, 246, 255];
const MINT: RGB = [236, 253, 245];
const GREEN: RGB = [22, 163, 74];
const AMBER: RGB = [217, 119, 6];
const RED: RGB = [220, 38, 38];
const GREEN_BG: RGB = [240, 253, 244];
const RED_BG: RGB = [254, 242, 242];

type Doc = InstanceType<typeof jsPDF>;

function pageSize(doc: Doc) {
  return {
    w: doc.internal.pageSize.getWidth(),
    h: doc.internal.pageSize.getHeight(),
    m: 40,
  };
}

function footer(doc: Doc, page: number, total: number) {
  const { w, h, m } = pageSize(doc);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.5);
  doc.line(m, h - 28, w - m, h - 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("SoftwareGlimpse  ·  CRM Vendor Scorecard", m, h - 16);
  doc.text(`Page ${page} of ${total}`, w - m, h - 16, { align: "right" });
}

function pageHeader(doc: Doc, sectionNum: string, title: string) {
  const { w, m } = pageSize(doc);
  let y = m;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("SoftwareGlimpse", m, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("CRM Vendor Scorecard", w - m, y, { align: "right" });
  y += 18;
  doc.setFillColor(...PRIMARY);
  doc.rect(m, y, 28, 3, "F");
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...PRIMARY);
  doc.text(sectionNum, m, y);
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text(title, m + 52, y);
  return y + 14;
}

function labelLine(doc: Doc, label: string, x: number, y: number, lineW: number) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(label, x, y);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.7);
  doc.line(x + doc.getTextWidth(label) + 6, y + 1, x + lineW, y + 1);
}

function writingBox(
  doc: Doc,
  x: number,
  y: number,
  boxW: number,
  boxH: number,
  prompt?: string,
) {
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(x, y, boxW, boxH, 4, 4, "FD");
  if (prompt) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(prompt, boxW - 16) as string[];
    doc.text(lines, x + 8, y + 14);
  }
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  for (let ly = y + 28; ly < y + boxH - 8; ly += 14) {
    doc.line(x + 8, ly, x + boxW - 8, ly);
  }
}

function sectionLabel(doc: Doc, text: string, x: number, y: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...PRIMARY);
  doc.text(text.toUpperCase(), x, y);
}

function noteBox(
  doc: Doc,
  x: number,
  y: number,
  boxW: number,
  text: string,
  fill: RGB = AMBER_BG,
  minH = 28,
) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const lines = doc.splitTextToSize(text, boxW - 14) as string[];
  const boxH = Math.max(minH, lines.length * 9 + 14);
  doc.setFillColor(...fill);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(x, y, boxW, boxH, 3, 3, "FD");
  doc.setTextColor(...MUTED);
  doc.text(lines, x + 7, y + 12);
  return y + boxH + 6;
}

function tableHeader(
  doc: Doc,
  cols: Array<{ label: string; x: number; w: number }>,
  y: number,
  rowH = 16,
) {
  const { m } = pageSize(doc);
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  doc.setFillColor(...NAVY);
  doc.rect(m, y, totalW, rowH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...WHITE);
  for (const c of cols) {
    const lines = doc.splitTextToSize(c.label, c.w - 4) as string[];
    doc.text(lines[0] ?? c.label, c.x + 3, y + 11);
  }
  return y + rowH;
}

function emptyRows(
  doc: Doc,
  cols: Array<{ x: number; w: number }>,
  y: number,
  count: number,
  rowH = 22,
) {
  const { m } = pageSize(doc);
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  for (let i = 0; i < count; i++) {
    const fill = i % 2 === 0 ? WHITE : SURFACE;
    doc.setFillColor(...fill);
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    y += rowH;
  }
  return y;
}

function kpiCardBlank(
  doc: Doc,
  x: number,
  y: number,
  cardW: number,
  cardH: number,
  label: string,
) {
  doc.setFillColor(...BLUE_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(x, y, cardW, cardH, 5, 5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text(label.toUpperCase(), x + 8, y + 14);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.7);
  doc.line(x + 8, y + cardH - 14, x + cardW - 8, y + cardH - 14);
}

function checkbox(doc: Doc, x: number, y: number, label: string) {
  doc.setDrawColor(...MUTED);
  doc.setLineWidth(0.7);
  doc.rect(x, y - 6, 8, 8, "S");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  doc.text(label, x + 12, y);
}

function wrapCell(
  doc: Doc,
  text: string,
  maxW: number,
  fontSize = 6.5,
  style: "normal" | "bold" = "normal",
): string[] {
  doc.setFont("helvetica", style);
  doc.setFontSize(fontSize);
  return doc.splitTextToSize(text, Math.max(10, maxW)) as string[];
}

/* ─── Page 1: Cover ─── */

function page1Cover(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = m;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY);
  doc.text("SoftwareGlimpse", m, y);
  y += 22;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...NAVY);
  doc.text("CRM Vendor Scorecard", m, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  const sub =
    "Score shortlisted CRMs against weighted requirements with evidence confidence and must-have gates.";
  const subLines = doc.splitTextToSize(sub, maxW) as string[];
  doc.text(subLines, m, y);
  y += subLines.length * 12 + 10;

  doc.setFillColor(...MINT);
  doc.setDrawColor(...GREEN);
  doc.roundedRect(m, y, maxW, 26, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...GREEN);
  doc.text(
    "SCORECARD WORKBOOK  ·  Not a Pass/Fail checklist  ·  Updated 15 Aug 2026  ·  Excel is the scoring engine",
    m + 10,
    y + 16,
  );
  y += 34;

  const metaH = 88;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, metaH, 5, 5, "FD");
  labelLine(doc, "Project:", m + 12, y + 16, maxW * 0.48);
  labelLine(doc, "Evaluator / Team:", m + maxW * 0.52, y + 16, maxW * 0.46);
  labelLine(doc, "Date:", m + 12, y + 36, maxW * 0.48);
  labelLine(doc, "Version:", m + maxW * 0.52, y + 36, maxW * 0.46);
  labelLine(doc, "Weight freeze date:", m + 12, y + 56, maxW * 0.9);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Freeze weights before the first scoring session. Record any later changes and who approved them.",
    m + 12,
    y + 76,
  );
  y += metaH + 12;

  sectionLabel(doc, "At a glance (leave blank until Excel is filled)", m, y);
  y += 8;
  const counters = [
    "Vendors evaluated",
    "Criteria count",
    "Must-have count",
    "Total weight %",
  ];
  const cW = (maxW - 15) / 4;
  counters.forEach((label, i) => {
    kpiCardBlank(doc, m + i * (cW + 5), y, cW, 44, label);
  });
  y += 54;

  sectionLabel(doc, "Ranking snapshot (blank — fill after scoring)", m, y);
  y += 8;
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D"];
  const vW = (maxW - 15) / 4;
  vendors.forEach((v, i) => {
    const x = m + i * (vW + 5);
    doc.setFillColor(...SURFACE);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, vW, 72, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(v, x + 8, y + 14);
    labelLine(doc, "Name:", x + 8, y + 30, vW - 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text("Score: ____ / 100", x + 8, y + 46);
    doc.text("Rank: ____", x + 8, y + 62);
  });
  y += 84;

  sectionLabel(doc, "Confidence legend", m, y);
  y += 8;
  const legend: Array<{ label: string; desc: string; fill: RGB; ink: RGB }> = [
    { label: "HIGH", desc: "Demo / trial / reference evidence", fill: GREEN_BG, ink: GREEN },
    { label: "MEDIUM", desc: "Partial evidence or single source", fill: AMBER_BG, ink: AMBER },
    { label: "LOW", desc: "Opinion or thin notes only", fill: RED_BG, ink: RED },
    { label: "UNKNOWN", desc: "Not yet evaluated", fill: SURFACE, ink: MUTED },
  ];
  const lW = (maxW - 15) / 4;
  legend.forEach((item, i) => {
    const x = m + i * (lW + 5);
    doc.setFillColor(...item.fill);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, lW, 40, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...item.ink);
    doc.text(item.label, x + 6, y + 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    const dLines = doc.splitTextToSize(item.desc, lW - 12) as string[];
    doc.text(dLines, x + 6, y + 26);
  });
  y += 50;

  sectionLabel(doc, "Scoring process", m, y);
  y += 8;
  const steps = [
    "Import criteria",
    "Freeze weights",
    "Score 1–5",
    "Apply gates",
    "Totals",
    "Decide",
    "Archive",
  ];
  const sW = (maxW - 48) / steps.length;
  steps.forEach((s, i) => {
    const x = m + i * (sW + 8);
    doc.setFillColor(...(i === steps.length - 1 ? PRIMARY : CARD_DARK));
    doc.roundedRect(x, y, sW, 28, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...WHITE);
    const lines = doc.splitTextToSize(s, sW - 6) as string[];
    doc.text(lines, x + sW / 2, y + (lines.length === 1 ? 17 : 12), {
      align: "center",
    });
    if (i < steps.length - 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...PRIMARY);
      doc.text("→", x + sW + 2, y + 18);
    }
  });
  y += 40;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Pair with the interactive tool at softwareglimpse.com/tools/crm-vendor-scorecard/ — Excel remains the scoring engine; this PDF is the printable workbook. Do not invent vendor winners or research rankings.",
    MINT,
    36,
  );
}

/* ─── Page 2: Criteria & Weight Model ─── */

function page2CriteriaWeights(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "01", "Criteria & weight model");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 22, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("SAMPLE CATEGORY WEIGHTS — REPLACE WITH YOUR OWN", m + 8, y + 14);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Teaching defaults sum to 100%. Replace categories and weights from your requirements — do not invent mid-demo.",
    m,
    y,
  );
  y += 14;

  const cols = [
    { label: "CATEGORY", x: m, w: 130 },
    { label: "PURPOSE (SHORT)", x: m + 130, w: 230 },
    { label: "WEIGHT %", x: m + 360, w: 60 },
    { label: "OWNER", x: m + 420, w: 95 },
  ];
  y = tableHeader(doc, cols, y);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  const samples: Array<{ cat: string; purpose: string; wt: number }> = [
    { cat: "Core CRM", purpose: "Contacts, accounts, activities", wt: 20 },
    { cat: "Sales Execution", purpose: "Pipeline, forecasting, deal flow", wt: 20 },
    { cat: "Usability", purpose: "Adoption and day-to-day fit", wt: 15 },
    { cat: "Platform", purpose: "Integrations, admin, security", wt: 15 },
    { cat: "Reporting", purpose: "Dashboards and management views", wt: 15 },
    { cat: "Commercial", purpose: "Pricing fit and contract terms", wt: 15 },
  ];

  samples.forEach((row, i) => {
    const rowH = 22;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(row.cat, m + 4, y + 14);
    doc.setTextColor(...MUTED);
    doc.text(row.purpose, m + 134, y + 14);
    doc.setTextColor(...NAVY);
    doc.text(`${row.wt}%`, m + 370, y + 14);
    doc.setDrawColor(...BORDER);
    doc.line(m + 424, y + 15, m + 510, y + 15);
    y += rowH;
  });

  doc.setFillColor(...CARD_DARK);
  doc.rect(m, y, totalW, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  doc.text("TOTAL (must equal 100%)", m + 4, y + 14);
  doc.text("100%", m + 370, y + 14);
  y += 34;

  sectionLabel(doc, "Sample weight distribution", m, y);
  y += 10;
  samples.forEach((row) => {
    const barMax = maxW - 160;
    const barW = (row.wt / 100) * barMax;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(row.cat, m, y + 8);
    doc.setFillColor(...PRIMARY);
    doc.rect(m + 110, y, Math.max(barW, 2), 10, "F");
    doc.setTextColor(...NAVY);
    doc.text(`${row.wt}%`, m + 116 + barW, y + 8);
    y += 16;
  });

  y += 8;
  sectionLabel(doc, "Weighting principles", m, y);
  y += 8;
  const principles = [
    "Category (and criterion) weights must sum to 100%.",
    "Freeze weights before the first scoring session.",
    "Criteria come from documented requirements — do not invent mid-demo.",
    "Record owner and freeze date on the cover; archive weight changes.",
  ];
  principles.forEach((p) => {
    doc.setFillColor(...BLUE_BG);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(m, y, maxW, 24, 3, 3, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(`•  ${p}`, m + 10, y + 15);
    y += 28;
  });

  y += 4;
  noteBox(
    doc,
    m,
    y,
    maxW,
    "SAMPLE rows above are teaching placeholders. Replace every weight before scoring. Excel enforces totals; this page is the printable model.",
    MINT,
  );
}

/* ─── Page 3: Scoring Legend & Scorers ─── */

function page3ScoringLegend(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "02", "Scoring legend & scorers");

  sectionLabel(doc, "1–5 score scale", m, y);
  y += 8;

  const scale: Array<{ n: string; title: string; desc: string; fill: RGB }> = [
    { n: "1", title: "Poor fit", desc: "Does not meet the requirement in a meaningful way.", fill: RED_BG },
    { n: "2", title: "Weak", desc: "Partial capability with major gaps or workarounds.", fill: AMBER_BG },
    { n: "3", title: "Adequate", desc: "Meets the requirement with acceptable trade-offs.", fill: SURFACE },
    { n: "4", title: "Strong", desc: "Solid fit with clear evidence from demo / trial.", fill: BLUE_BG },
    { n: "5", title: "Excellent", desc: "Exceeds needs; evidence is strong and consistent.", fill: GREEN_BG },
  ];
  scale.forEach((s) => {
    doc.setFillColor(...s.fill);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(m, y, maxW, 32, 3, 3, "FD");
    doc.setFillColor(...PRIMARY);
    doc.circle(m + 18, y + 16, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...WHITE);
    doc.text(s.n, m + 18, y + 19, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text(s.title, m + 38, y + 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(s.desc, m + 38, y + 25);
    y += 36;
  });

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...AMBER);
  doc.setLineWidth(1);
  doc.roundedRect(m, y, maxW, 36, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("N/E = Not enough evidence", m + 10, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Do not silently treat N/E as 0. Exclude from weighted totals until resolved, or mark Unknown and schedule follow-up.",
    m + 10,
    y + 28,
    { maxWidth: maxW - 20 },
  );
  y += 48;

  sectionLabel(doc, "Confidence definitions", m, y);
  y += 8;
  const confCols = [
    { label: "LEVEL", x: m, w: 80 },
    { label: "MEANING", x: m + 80, w: 435 },
  ];
  y = tableHeader(doc, confCols, y);
  const confRows = [
    { level: "HIGH", meaning: "Demo, trial, RFP reply, or reference backs the score." },
    { level: "MEDIUM", meaning: "Partial evidence or single unverified source." },
    { level: "LOW", meaning: "Opinion, marketing claims, or thin notes only." },
    { level: "UNKNOWN", meaning: "Criterion not yet evaluated for this vendor." },
  ];
  const confTw = confCols.reduce((s, c) => s + c.w, 0);
  confRows.forEach((row, i) => {
    const rowH = 18;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, confTw, rowH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(row.level, m + 4, y + 12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(row.meaning, m + 84, y + 12);
    y += rowH;
  });
  y += 14;

  sectionLabel(doc, "Scorer setup (blank)", m, y);
  y += 8;
  const scorerCols = [
    { label: "NAME", x: m, w: 120 },
    { label: "ROLE", x: m + 120, w: 110 },
    { label: "CATEGORIES OWNED", x: m + 230, w: 160 },
    { label: "SESSIONS", x: m + 390, w: 60 },
    { label: "SIGN-OFF", x: m + 450, w: 65 },
  ];
  y = tableHeader(doc, scorerCols, y);
  y = emptyRows(doc, scorerCols, y, 5, 20);

  y += 12;
  noteBox(
    doc,
    m,
    y,
    maxW,
    "Assign category ownership before demos. Each score should cite evidence (demo note, RFP ID, trial log). Excel is the scoring engine — keep this sheet aligned with workbook columns.",
    BLUE_BG,
  );
}

/* ─── Page 4: Vendor Scoring Matrix ─── */

function page4ScoringMatrix(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "03", "Vendor scoring matrix");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 22, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  doc.text(
    "EXAMPLE STRUCTURE — criterion names are teaching labels; vendor score cells are blank for your evaluation",
    m + 8,
    y + 14,
  );
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Enter 1–5 or N/E per vendor. Leave blank until evidence exists. Weighted totals compute in Excel.",
    m,
    y,
  );
  y += 12;

  const cols = [
    { label: "CRITERION", x: m, w: 95 },
    { label: "CATEGORY", x: m + 95, w: 58 },
    { label: "MUST?", x: m + 153, w: 32 },
    { label: "WT %", x: m + 185, w: 32 },
    { label: "A", x: m + 217, w: 36 },
    { label: "B", x: m + 253, w: 36 },
    { label: "C", x: m + 289, w: 36 },
    { label: "D", x: m + 325, w: 36 },
    { label: "CONF.", x: m + 361, w: 48 },
    { label: "EVIDENCE REF", x: m + 409, w: 106 },
  ];
  y = tableHeader(doc, cols, y, 18);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  const examples: Array<{
    criterion: string;
    category: string;
    must: string;
    wt: string;
  }> = [
    { criterion: "EXAMPLE · Pipeline management", category: "Sales Exec", must: "Y", wt: "" },
    { criterion: "EXAMPLE · Contact & account hub", category: "Core CRM", must: "Y", wt: "" },
    { criterion: "EXAMPLE · Workflow automation", category: "Sales Exec", must: "N", wt: "" },
    { criterion: "EXAMPLE · Reporting / forecasts", category: "Reporting", must: "N", wt: "" },
    { criterion: "EXAMPLE · Usability / adoption", category: "Usability", must: "N", wt: "" },
    { criterion: "EXAMPLE · Integrations / API", category: "Platform", must: "Y", wt: "" },
    { criterion: "EXAMPLE · Admin & security", category: "Platform", must: "Y", wt: "" },
    { criterion: "EXAMPLE · Commercial fit", category: "Commercial", must: "N", wt: "" },
  ];

  examples.forEach((row, i) => {
    const nameLines = wrapCell(doc, row.criterion, cols[0].w - 6, 6);
    const rowH = Math.max(22, nameLines.length * 8 + 8);
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...NAVY);
    doc.text(nameLines, m + 3, y + 10);
    doc.setFontSize(6.5);
    doc.text(row.category, m + 98, y + 13);
    doc.text(row.must, m + 160, y + 13);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    // Weight blank
    doc.line(m + 188, y + rowH - 6, m + 214, y + rowH - 6);
    // Vendor score blanks A–D
    for (let v = 0; v < 4; v++) {
      const vx = m + 220 + v * 36;
      doc.line(vx, y + rowH - 6, vx + 28, y + rowH - 6);
    }
    // Confidence blank
    doc.line(m + 364, y + rowH - 6, m + 404, y + rowH - 6);
    // Evidence ref blank
    doc.line(m + 412, y + rowH - 6, m + 510, y + rowH - 6);
    y += rowH;
  });

  // Blank rows for real criteria
  for (let i = 0; i < 4; i++) {
    const rowH = 20;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.4);
    let xCursor = m;
    for (const c of cols) {
      if (c.label !== "CRITERION" && c.label !== "CATEGORY" && c.label !== "MUST?") {
        doc.line(xCursor + 3, y + 14, xCursor + c.w - 3, y + 14);
      } else {
        doc.line(xCursor + 3, y + 14, xCursor + c.w - 3, y + 14);
      }
      xCursor += c.w;
    }
    y += rowH;
  }

  y += 8;
  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 48, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  doc.text("WEIGHTED TOTAL  / 100  (compute in Excel — leave blank here)", m + 10, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const labs = ["A: _______", "B: _______", "C: _______", "D: _______"];
  labs.forEach((l, i) => {
    doc.text(l, m + 10 + i * 120, y + 36);
  });
  y += 58;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Formula note: Weighted score ≈ Σ (score × weight%) with N/E excluded until resolved. Excel is the scoring engine — do not invent totals or vendor rankings on this page.",
    MINT,
  );
}

/* ─── Page 5: Must-have Gate Results ─── */

function page5MustHaveGates(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "04", "Must-have gate results");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const intro =
    "Gates use PASS / FAIL / UNKNOWN only — not Partial. A failed must-have disqualifies that vendor regardless of weighted total.";
  const introLines = doc.splitTextToSize(intro, maxW) as string[];
  doc.text(introLines, m, y);
  y += introLines.length * 11 + 10;

  doc.setFillColor(...RED_BG);
  doc.setDrawColor(...RED);
  doc.setLineWidth(0.8);
  doc.roundedRect(m, y, maxW, 28, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...RED);
  doc.text(
    "RULE: Failed must-have → vendor is out. Do not average the gap away with a high weighted score.",
    m + 10,
    y + 17,
  );
  y += 38;

  const cols = [
    { label: "MUST-HAVE REQUIREMENT", x: m, w: 150 },
    { label: "A", x: m + 150, w: 70 },
    { label: "B", x: m + 220, w: 70 },
    { label: "C", x: m + 290, w: 70 },
    { label: "D", x: m + 360, w: 70 },
    { label: "NOTES / EVIDENCE", x: m + 430, w: 85 },
  ];
  y = tableHeader(doc, cols, y, 18);
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  const gateMark = "[ ] P  [ ] F  [ ] U";

  // EXAMPLE teaching rows
  const examples = [
    "EXAMPLE · SSO / SAML required",
    "EXAMPLE · Native email sync",
  ];
  examples.forEach((ex, i) => {
    const rowH = 28;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...NAVY);
    const nameLines = wrapCell(doc, ex, 144, 6);
    doc.text(nameLines, m + 4, y + 10);
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    for (let c = 1; c <= 4; c++) {
      doc.text(gateMark, cols[c].x + 3, y + 17);
    }
    doc.setDrawColor(...BORDER);
    doc.line(m + 434, y + 20, m + 510, y + 20);
    y += rowH;
  });

  // Blank gate rows
  for (let i = 0; i < 8; i++) {
    const rowH = 26;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    doc.line(m + 6, y + 18, m + 144, y + 18);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    for (let c = 1; c <= 4; c++) {
      doc.text(gateMark, cols[c].x + 3, y + 16);
    }
    doc.line(m + 434, y + 18, m + 510, y + 18);
    y += rowH;
  }

  y += 12;
  sectionLabel(doc, "Gate summary (blank)", m, y);
  y += 8;
  const sumLabels = [
    "Vendors passed all",
    "Failed any gate",
    "Unknown remaining",
    "Ready for totals",
  ];
  const sW = (maxW - 15) / 4;
  sumLabels.forEach((label, i) => {
    kpiCardBlank(doc, m + i * (sW + 5), y, sW, 46, label);
  });
  y += 58;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "EXAMPLE rows illustrate table structure only. Mark real gates from your requirements. Resolve UNKNOWN before final recommendation. Partial is not a valid gate result on this scorecard.",
    MINT,
  );
}

/* ─── Page 6: Criterion Deep Dive ─── */

function page6CriterionDeepDive(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "05", "Criterion deep dive");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 22, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  doc.text(
    "EXAMPLE TEMPLATE — Pipeline management (replace with your criterion)",
    m + 8,
    y + 14,
  );
  y += 32;

  const metaH = 56;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, metaH, 5, 5, "FD");
  labelLine(doc, "Criterion:", m + 12, y + 16, maxW * 0.55);
  labelLine(doc, "Category:", m + maxW * 0.58, y + 16, maxW * 0.4);
  labelLine(doc, "Weight %:", m + 12, y + 36, maxW * 0.28);
  labelLine(doc, "Must-have? Y / N:", m + maxW * 0.32, y + 36, maxW * 0.3);
  labelLine(doc, "Owner:", m + maxW * 0.65, y + 36, maxW * 0.33);
  y += metaH + 12;

  sectionLabel(doc, "What “good” looks like (guidelines — blank)", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    56,
    "EXAMPLE prompt: Stages configurable · forecast roll-up · deal history · mobile update path…",
  );
  y += 66;

  sectionLabel(doc, "Score anchors (1 / 3 / 5 — blank)", m, y);
  y += 6;
  const anchors = [
    { label: "1 — Poor", prompt: "Describe failure mode…" },
    { label: "3 — Adequate", prompt: "Describe acceptable baseline…" },
    { label: "5 — Excellent", prompt: "Describe best-in-class evidence…" },
  ];
  const aW = (maxW - 10) / 3;
  anchors.forEach((a, i) => {
    const x = m + i * (aW + 5);
    doc.setFillColor(...SURFACE);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, aW, 52, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...PRIMARY);
    doc.text(a.label, x + 8, y + 14);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(a.prompt, aW - 16) as string[];
    doc.text(lines, x + 8, y + 28);
  });
  y += 62;

  sectionLabel(doc, "Per-vendor evidence (blank)", m, y);
  y += 8;
  const vCols = [
    { label: "VENDOR", x: m, w: 55 },
    { label: "SCORE (1–5 / N/E)", x: m + 55, w: 70 },
    { label: "CONFIDENCE", x: m + 125, w: 70 },
    { label: "EVIDENCE / NOTES", x: m + 195, w: 320 },
  ];
  y = tableHeader(doc, vCols, y, 18);
  const totalW = vCols.reduce((s, c) => s + c.w, 0);
  ["A", "B", "C", "D"].forEach((v, i) => {
    const rowH = 36;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text(v, m + 18, y + 22);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    doc.line(m + 60, y + 22, m + 118, y + 22);
    doc.line(m + 130, y + 22, m + 188, y + 22);
    doc.line(m + 200, y + 18, m + 508, y + 18);
    doc.line(m + 200, y + 30, m + 508, y + 30);
    y += rowH;
  });

  y += 12;
  sectionLabel(doc, "Open questions for this criterion", m, y);
  y += 6;
  writingBox(doc, m, y, maxW, 48, "Questions to resolve before locking the score…");
  y += 58;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Duplicate this page structure in Excel or print extras per critical criterion. Keep scores and confidence aligned with the matrix on page 4.",
    BLUE_BG,
  );
}

/* ─── Page 7: Results Dashboard ─── */

function page7ResultsDashboard(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "06", "Results dashboard");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Blank score bars and totals only — fill after Excel computes weighted scores. Do not invent vendor winners.",
    m,
    y,
  );
  y += 16;

  sectionLabel(doc, "Weighted scores (fill-in)", m, y);
  y += 10;
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D"];
  vendors.forEach((v) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(v, m, y + 8);
    labelLine(doc, "Name:", m + 70, y + 8, 160);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(1);
    doc.setFillColor(...SURFACE);
    doc.roundedRect(m + 240, y, maxW - 300, 14, 2, 2, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text("____ / 100", m + maxW - 50, y + 10);
    y += 24;
  });

  y += 6;
  sectionLabel(doc, "Rank order (blank)", m, y);
  y += 8;
  const ranks = ["#1", "#2", "#3", "#4"];
  const rW = (maxW - 15) / 4;
  ranks.forEach((r, i) => {
    const x = m + i * (rW + 5);
    doc.setFillColor(...(i === 0 ? BLUE_BG : SURFACE));
    doc.setDrawColor(...(i === 0 ? PRIMARY : BORDER));
    doc.setLineWidth(i === 0 ? 1.1 : 0.7);
    doc.roundedRect(x, y, rW, 56, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...PRIMARY);
    doc.text(r, x + 10, y + 20);
    labelLine(doc, "Vendor:", x + 10, y + 36, rW - 20);
    labelLine(doc, "Score:", x + 10, y + 48, rW - 20);
  });
  y += 68;

  sectionLabel(doc, "Confidence summary (blank)", m, y);
  y += 8;
  const confLabels = ["High %", "Medium %", "Low %", "Unknown %"];
  const cW = (maxW - 15) / 4;
  confLabels.forEach((label, i) => {
    kpiCardBlank(doc, m + i * (cW + 5), y, cW, 44, label);
  });
  y += 56;

  sectionLabel(doc, "Gate outcome vs score", m, y);
  y += 8;
  const gCols = [
    { label: "VENDOR", x: m, w: 100 },
    { label: "GATES", x: m + 100, w: 120 },
    { label: "WEIGHTED /100", x: m + 220, w: 100 },
    { label: "CONFIDENCE", x: m + 320, w: 90 },
    { label: "STATUS", x: m + 410, w: 105 },
  ];
  y = tableHeader(doc, gCols, y);
  y = emptyRows(doc, gCols, y, 4, 22);

  y += 14;
  sectionLabel(doc, "Next steps", m, y);
  y += 8;
  const nextSteps = [
    "Validate assumptions and resolve N/E / UNKNOWN items.",
    "Hand off survivors to the CRM Decision Matrix for TCO, risk, sensitivity, and final recommendation.",
    "Archive this scorecard with evidence refs and weight freeze date.",
  ];
  nextSteps.forEach((s, i) => {
    doc.setFillColor(...(i % 2 === 0 ? BLUE_BG : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.roundedRect(m, y, maxW, 28, 3, 3, "FD");
    doc.setFillColor(...PRIMARY);
    doc.circle(m + 16, y + 14, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);
    doc.text(String(i + 1), m + 16, y + 17, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    const lines = doc.splitTextToSize(s, maxW - 40) as string[];
    doc.text(lines, m + 32, y + 12);
    y += 32;
  });

  y += 4;
  noteBox(
    doc,
    m,
    y,
    maxW,
    "Decision Matrix resource: /resources/crm-comparison-worksheet/ — use after scoring for commercial cost, implementation risk, and formal choice. Scorecard ≠ final selection.",
    MINT,
  );
}

/* ─── Page 8: Decision & Sign-off ─── */

function page8DecisionSignOff(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "07", "Decision & sign-off");

  sectionLabel(doc, "Working recommendation (blank — not a prefilled winner)", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    40,
    "State the leading vendor / option from your scored shortlist — or “no decision yet”. Leave blank until scoring is complete.",
  );
  y += 50;

  sectionLabel(doc, "Key reasons (from scorecard evidence)", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    48,
    "Must-haves cleared · strongest evidence-backed weighted fit · confidence profile — cite matrix and gates only.",
  );
  y += 58;

  sectionLabel(doc, "Residual risks / open conditions", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    44,
    "Unknowns, thin confidence areas, commercial or security follow-ups…",
  );
  y += 54;

  sectionLabel(doc, "Status", m, y);
  y += 10;
  const statuses = [
    "Proceed",
    "Proceed with conditions",
    "Re-evaluate",
    "Archive",
  ];
  statuses.forEach((s, i) => {
    checkbox(doc, m + 4 + (i % 2) * (maxW / 2), y + Math.floor(i / 2) * 18, s);
  });
  y += 44;

  sectionLabel(doc, "Sign-off", m, y);
  y += 8;
  const sCols = [
    { label: "ROLE", x: m, w: 120 },
    { label: "NAME", x: m + 120, w: 130 },
    { label: "DATE", x: m + 250, w: 80 },
    { label: "SIGNATURE", x: m + 330, w: 185 },
  ];
  y = tableHeader(doc, sCols, y);
  const roles = [
    "Evaluation lead",
    "Sales / RevOps",
    "IT / Security",
    "Finance",
    "Executive sponsor",
  ];
  const totalW = sCols.reduce((s, c) => s + c.w, 0);
  roles.forEach((role, i) => {
    const rowH = 22;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(role, m + 4, y + 14);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.4);
    doc.line(m + 124, y + 15, m + 244, y + 15);
    doc.line(m + 254, y + 15, m + 324, y + 15);
    doc.line(m + 334, y + 15, m + 508, y + 15);
    y += rowH;
  });

  y += 14;
  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 72, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("NEXT: DECISION MATRIX  →  BUSINESS CASE", m + 14, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(191, 219, 254);
  const next =
    "Scorecard = how vendors scored during evaluation (weights, 1–5, evidence confidence, must-have gates). Decision Matrix (/resources/crm-comparison-worksheet/) = final selection with TCO, risk, and sensitivity. Then build the CRM Business Case for approval.";
  const nextLines = doc.splitTextToSize(next, maxW - 28) as string[];
  doc.text(nextLines, m + 14, y + 36);
  y += 82;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Interactive companion: softwareglimpse.com/tools/crm-vendor-scorecard/  ·  Excel remains the scoring engine. Archive this workbook with the frozen weight model.",
    MINT,
  );
}

/* ─── Export ─── */

export async function buildCrmVendorScorecardPdfBuffer(): Promise<Buffer> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  page1Cover(doc);
  doc.addPage();
  page2CriteriaWeights(doc);
  doc.addPage();
  page3ScoringLegend(doc);
  doc.addPage();
  page4ScoringMatrix(doc);
  doc.addPage();
  page5MustHaveGates(doc);
  doc.addPage();
  page6CriterionDeepDive(doc);
  doc.addPage();
  page7ResultsDashboard(doc);
  doc.addPage();
  page8DecisionSignOff(doc);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    footer(doc, i, total);
  }

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
