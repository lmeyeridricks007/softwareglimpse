/**
 * CRM Decision Matrix — PDF workbook (multi-vendor decision, not a checklist).
 * Blank editable fields only; no invented vendor scores, TCO, or evidence.
 * SAMPLE teaching weights are labelled for replacement.
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
  doc.text("SoftwareGlimpse  ·  CRM Decision Matrix", m, h - 16);
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
  doc.text("CRM Decision Matrix", w - m, y, { align: "right" });
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

function noteBox(doc: Doc, x: number, y: number, boxW: number, text: string, fill: RGB = AMBER_BG) {
  doc.setFillColor(...fill);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(x, y, boxW, 28, 3, 3, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  const lines = doc.splitTextToSize(text, boxW - 14) as string[];
  doc.text(lines, x + 7, y + 12);
  return y + 34;
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
  doc.setFontSize(7);
  doc.setTextColor(...WHITE);
  for (const c of cols) {
    doc.text(c.label, c.x + 3, y + 11);
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

/* ─── Page 1: Decision Overview ─── */

function page1Overview(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = m;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY);
  doc.text("SoftwareGlimpse", m, y);
  y += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...NAVY);
  doc.text("CRM Decision Matrix", m, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const sub =
    "Compare finalists with must-have gates, weighted criteria, evidence confidence, commercial cost, and implementation risk — then recommend.";
  const subLines = doc.splitTextToSize(sub, maxW) as string[];
  doc.text(subLines, m, y);
  y += subLines.length * 13 + 12;

  const metaH = 72;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, metaH, 5, 5, "FD");
  labelLine(doc, "Project:", m + 12, y + 18, maxW * 0.48);
  labelLine(doc, "Owner:", m + maxW * 0.52, y + 18, maxW * 0.46);
  labelLine(doc, "Team:", m + 12, y + 38, maxW * 0.48);
  labelLine(doc, "Date:", m + maxW * 0.52, y + 38, maxW * 0.46);
  labelLine(doc, "Decision deadline:", m + 12, y + 58, maxW * 0.9);
  y += metaH + 14;

  sectionLabel(doc, "Shortlist", m, y);
  y += 8;
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D", "Status quo"];
  const vW = (maxW - 16) / 5;
  vendors.forEach((v, i) => {
    const x = m + i * (vW + 4);
    doc.setFillColor(...SURFACE);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, vW, 42, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(v, x + 6, y + 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text("Name:", x + 6, y + 28);
    doc.setDrawColor(...BORDER);
    doc.line(x + 32, y + 28, x + vW - 6, y + 28);
  });
  y += 54;

  sectionLabel(doc, "Decision snapshot", m, y);
  y += 8;
  const snap = [
    "Leading vendor",
    "Weighted score",
    "Gates",
    "3-year TCO",
    "Confidence",
    "Status",
  ];
  const cW = (maxW - 10) / 3;
  const cH = 48;
  snap.forEach((label, i) => {
    const x = m + (i % 3) * (cW + 5);
    const yy = y + Math.floor(i / 3) * (cH + 6);
    kpiCardBlank(doc, x, yy, cW, cH, label);
  });
  y += 2 * (cH + 6) + 10;

  sectionLabel(doc, "Decision funnel", m, y);
  y += 10;
  const steps = ["QUALIFY", "SCORE", "COMPARE COST", "ASSESS RISK", "RECOMMEND"];
  const sW = (maxW - 32) / steps.length;
  steps.forEach((s, i) => {
    const x = m + i * (sW + 8);
    doc.setFillColor(...(i === 4 ? PRIMARY : CARD_DARK));
    doc.roundedRect(x, y, sW, 28, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);
    doc.text(s, x + sW / 2, y + 18, { align: "center" });
    if (i < steps.length - 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...PRIMARY);
      doc.text("→", x + sW + 2, y + 18);
    }
  });
  y += 42;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Leave snapshot fields blank until gates, scores, cost, and risk are completed. Never invent figures.",
    m,
    y,
  );
}

/* ─── Page 2: Decision Framework ─── */

function page2Framework(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "01", "Decision framework");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Work top-down. A failed must-have gate ends the path for that vendor — do not average it away.",
    m,
    y,
  );
  y += 16;

  const flow = [
    { t: "Must-have gates", d: "Pass / Fail / Unknown — disqualify on Fail" },
    { t: "Weighted fit", d: "Score 1–5 × weight; sum to /100" },
    { t: "Commercial", d: "Licence, implementation, 3-year TCO" },
    { t: "Implementation & risk", d: "Delivery, adoption, dependency risk" },
    { t: "Evidence confidence", d: "% confident scores are evidence-backed" },
    { t: "Recommendation", d: "Choice + trade-offs + open conditions" },
  ];
  flow.forEach((f, i) => {
    doc.setFillColor(...(i % 2 === 0 ? BLUE_BG : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.roundedRect(m, y, maxW, 36, 4, 4, "FD");
    doc.setFillColor(...PRIMARY);
    doc.circle(m + 18, y + 18, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...WHITE);
    doc.text(String(i + 1), m + 18, y + 21, { align: "center" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text(f.t, m + 38, y + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(f.d, m + 38, y + 28);
    if (i < flow.length - 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...PRIMARY);
      doc.text("↓", m + 14, y + 44);
    }
    y += 44;
  });

  y += 4;
  sectionLabel(doc, "Decision rules", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    118,
    "Document your team’s rules here. Suggested prompts:\n• A failed mandatory gate disqualifies that vendor — no averaging.\n• Unknowns on must-haves must be resolved before approval.\n• Criteria weights must sum to 100%.\n• Scores require evidence (demo, RFP, reference, trial) — not opinion alone.\n• Record any weight changes and who approved them.",
  );
}

/* ─── Page 3: Must-have Gates ─── */

function page3Gates(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "02", "Must-have gates");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const gateIntro =
    "Mark each vendor Pass / Fail / Unknown. Failed mandatory requirements cannot be averaged away by a high weighted score.";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const introLines = doc.splitTextToSize(gateIntro, maxW) as string[];
  doc.text(introLines, m, y);
  y += introLines.length * 11 + 10;

  const cols = [
    { label: "MUST-HAVE", x: m, w: 120 },
    { label: "VENDOR A", x: m + 120, w: 79 },
    { label: "VENDOR B", x: m + 199, w: 79 },
    { label: "VENDOR C", x: m + 278, w: 79 },
    { label: "VENDOR D", x: m + 357, w: 79 },
    { label: "STATUS QUO", x: m + 436, w: 79 },
  ];
  y = tableHeader(doc, cols, y, 18);
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  const mark = "[ ] P  [ ] F  [ ] U";
  for (let i = 0; i < 8; i++) {
    const rowH = 28;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    doc.line(m + 6, y + 20, m + 114, y + 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    for (let c = 1; c < cols.length; c++) {
      doc.text(mark, cols[c].x + 4, y + 17);
    }
    y += rowH;
  }

  y += 12;
  sectionLabel(doc, "Gate summary", m, y);
  y += 8;
  const sumLabels = ["Vendors passed all", "Failed any gate", "Unknown remaining", "Ready to score"];
  const sW = (maxW - 15) / 4;
  sumLabels.forEach((label, i) => {
    const x = m + i * (sW + 5);
    kpiCardBlank(doc, x, y, sW, 46, label);
  });
  y += 58;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Note: A vendor that fails a mandatory gate is out — do not carry them into weighted scoring as if the gap were optional.",
  );
}

/* ─── Page 4: Weights ─── */

function page4Weights(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "03", "Criteria weights");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 22, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("SAMPLE WEIGHTS — REPLACE WITH YOUR OWN", m + 8, y + 14);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Teaching defaults sum to 100%. Replace categories, reasons, and weights to match your decision.",
    m,
    y,
  );
  y += 14;

  const cols = [
    { label: "CRITERION", x: m, w: 130 },
    { label: "WHY (SHORT)", x: m + 130, w: 220 },
    { label: "WEIGHT %", x: m + 350, w: 70 },
    { label: "OWNER", x: m + 420, w: 95 },
  ];
  y = tableHeader(doc, cols, y);

  const samples: Array<{ c: string; why: string; w: number }> = [
    { c: "Pipeline & deal mgmt", why: "Core selling motion", w: 15 },
    { c: "Automation & workflows", why: "Reduce manual work", w: 12 },
    { c: "Reporting & forecasts", why: "Management visibility", w: 12 },
    { c: "Usability & adoption", why: "Usage drives value", w: 15 },
    { c: "Integrations", why: "Fit with stack", w: 12 },
    { c: "Mobile / field access", why: "Where work happens", w: 8 },
    { c: "Security & admin", why: "Governance must-pass", w: 10 },
    { c: "Support & partner", why: "Implementation risk", w: 8 },
    { c: "Total cost of ownership", why: "Affordable over 3 yrs", w: 8 },
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  samples.forEach((row, i) => {
    const rowH = 20;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(row.c, m + 4, y + 13);
    doc.setTextColor(...MUTED);
    doc.text(row.why, m + 134, y + 13);
    doc.setTextColor(...NAVY);
    doc.text(`${row.w}%`, m + 360, y + 13);
    doc.setDrawColor(...BORDER);
    doc.line(m + 424, y + 14, m + 510, y + 14);
    y += rowH;
  });

  doc.setFillColor(...CARD_DARK);
  doc.rect(m, y, totalW, 22, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  doc.text("TOTAL", m + 4, y + 14);
  doc.text("100%", m + 360, y + 14);
  y += 34;

  sectionLabel(doc, "Weight distribution (sample)", m, y);
  y += 10;
  samples.forEach((row) => {
    const barMax = maxW - 160;
    const barW = (row.w / 100) * barMax;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(row.c, m, y + 7);
    doc.setFillColor(...PRIMARY);
    doc.rect(m + 130, y, Math.max(barW, 2), 10, "F");
    doc.setTextColor(...NAVY);
    doc.text(`${row.w}%`, m + 136 + barW, y + 8);
    y += 14;
  });

  y += 6;
  noteBox(
    doc,
    m,
    y,
    maxW,
    "Replace every sample weight before scoring. Weights must always total 100%. Document who owns each criterion.",
    MINT,
  );
}

/* ─── Page 5: Vendor Scoring Matrix ─── */

function page5Scoring(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "04", "Vendor scoring matrix");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Enter score 1–5 per vendor (or N/E if not evaluated). Leave blank until evidence exists. Excel computes weighted totals.",
    m,
    y,
  );
  y += 14;

  const cols = [
    { label: "CRITERION", x: m, w: 145 },
    { label: "WT %", x: m + 145, w: 40 },
    { label: "A (1–5)", x: m + 185, w: 70 },
    { label: "B (1–5)", x: m + 255, w: 70 },
    { label: "C (1–5)", x: m + 325, w: 70 },
    { label: "D (1–5)", x: m + 395, w: 70 },
    { label: "NOTES", x: m + 465, w: 50 },
  ];
  y = tableHeader(doc, cols, y);

  const criteria = [
    "Pipeline & deal management",
    "Automation & workflows",
    "Reporting & forecasting",
    "Usability & adoption",
    "Integrations / API",
    "Mobile / field access",
    "Security & administration",
    "Support & partner ecosystem",
    "Implementation complexity",
    "Data migration readiness",
    "Total cost fit",
    "Strategic roadmap fit",
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  criteria.forEach((c, i) => {
    const rowH = 22;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(c, m + 4, y + 14);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.5);
    doc.line(m + 150, y + 15, m + 180, y + 15);
    for (let v = 0; v < 4; v++) {
      const vx = m + 195 + v * 70;
      doc.line(vx, y + 15, vx + 50, y + 15);
    }
    y += rowH;
  });

  y += 8;
  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 40, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...WHITE);
  doc.text("RAW WEIGHTED SCORE  (fill after calculation)", m + 10, y + 16);
  const labs = ["A: _______", "B: _______", "C: _______", "D: _______"];
  labs.forEach((l, i) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(l, m + 10 + i * 120, y + 32);
  });
  y += 52;

  doc.setFillColor(...BLUE_BG);
  doc.roundedRect(m, y, maxW, 44, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  doc.text("Legend", m + 8, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    "1 = Poor fit · 2 = Weak · 3 = Adequate · 4 = Strong · 5 = Excellent  |  N/E = Not evaluated (exclude from weighted average until resolved)",
    m + 8,
    y + 28,
    { maxWidth: maxW - 16 },
  );
}

/* ─── Page 6: Category Comparison ─── */

function page6Categories(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "05", "Category comparison");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Blank score bars only — calculate category views from your matrix inputs. Do not invent category winners.",
    m,
    y,
  );
  y += 16;

  const cats = [
    "Pipeline",
    "Automation",
    "Reporting",
    "Usability",
    "Integrations",
    "Value",
  ];
  const vendors = ["A", "B", "C", "D"];

  cats.forEach((cat) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(cat, m, y + 8);
    y += 14;
    vendors.forEach((v) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(`Vendor ${v}`, m + 8, y + 7);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.6);
      // Underscore bar template
      doc.text(
        "_______________________________________________",
        m + 55,
        y + 7,
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text("___ / 5", m + maxW - 40, y + 7);
      y += 14;
    });
    y += 6;
  });

  y += 4;
  sectionLabel(doc, "Best by category", m, y);
  y += 8;
  cats.forEach((cat, i) => {
    const x = m + (i % 2) * ((maxW - 10) / 2 + 10);
    const yy = y + Math.floor(i / 2) * 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    labelLine(doc, `${cat}:`, x, yy, (maxW - 10) / 2);
  });
  y += 3 * 20 + 8;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Note: Category “best” lines must come from scored matrix inputs only — never pre-fill vendor names or scores.",
  );
}

/* ─── Page 7: Cost & Commercial ─── */

function page7Cost(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "06", "Cost & commercial");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Enter known costs only. Leave cells blank until quotes or internal estimates exist.",
    m,
    y,
  );
  y += 14;

  const costCols = [
    { label: "COST LINE", x: m, w: 115 },
    { label: "VENDOR A", x: m + 115, w: 100 },
    { label: "VENDOR B", x: m + 215, w: 100 },
    { label: "VENDOR C", x: m + 315, w: 100 },
    { label: "VENDOR D", x: m + 415, w: 100 },
  ];
  y = tableHeader(doc, costCols, y, 18);

  // Sub-header for Year 1 / Annual / 3-yr
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  const tw = costCols.reduce((s, c) => s + c.w, 0);
  doc.rect(m, y, tw, 16, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...MUTED);
  doc.text("Enter Year 1 / Annual / 3-year TCO in each vendor column", m + 118, y + 11);
  y += 16;

  const lines = [
    "Licence / subscription",
    "Add-ons / modules",
    "Implementation",
    "Migration",
    "Integration",
    "Training",
    "Internal effort",
    "Other",
    "YEAR 1 TOTAL",
    "ANNUAL RUN-RATE",
    "3-YEAR TCO",
  ];
  lines.forEach((line, i) => {
    const rowH = 18;
    const isTotal = i >= 8;
    doc.setFillColor(...(isTotal ? BLUE_BG : i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, tw, rowH, "FD");
    doc.setFont("helvetica", isTotal ? "bold" : "normal");
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text(line, m + 4, y + 12);
    for (let v = 0; v < 4; v++) {
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.5);
      const vx = m + 120 + v * 100;
      doc.line(vx, y + 13, vx + 90, y + 13);
    }
    y += rowH;
  });

  y += 14;
  sectionLabel(doc, "Cost vs fit (quadrant)", m, y);
  y += 8;

  const qx = m + 40;
  const qy = y;
  const qSize = 160;
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(1);
  doc.rect(qx, qy, qSize, qSize, "S");
  doc.line(qx + qSize / 2, qy, qx + qSize / 2, qy + qSize);
  doc.line(qx, qy + qSize / 2, qx + qSize, qy + qSize / 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text("Higher fit →", qx + qSize / 2, qy + qSize + 12, { align: "center" });
  doc.text("Higher cost →", qx - 8, qy + qSize / 2, {
    align: "center",
    angle: 90,
  });
  doc.setFontSize(6);
  doc.text("High fit / low cost", qx + 6, qy + 12);
  doc.text("High fit / high cost", qx + qSize / 2 + 6, qy + 12);
  doc.text("Low fit / low cost", qx + 6, qy + qSize - 8);
  doc.text("Low fit / high cost", qx + qSize / 2 + 6, qy + qSize - 8);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  const qNote =
    "Axes labelled only — do not plot vendors until Year 1, annual, and 3-year TCO lines above are populated from real quotes or approved estimates.";
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  const qLines = doc.splitTextToSize(qNote, maxW - qSize - 60) as string[];
  doc.text(qLines, qx + qSize + 20, qy + 40);
}

/* ─── Page 8: Risk & Confidence ─── */

function page8Risk(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "07", "Risk & confidence");

  sectionLabel(doc, "Evidence confidence by vendor", m, y);
  y += 8;
  const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D"];
  const vW = (maxW - 15) / 4;
  vendors.forEach((v, i) => {
    const x = m + i * (vW + 5);
    doc.setFillColor(...SURFACE);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, vW, 50, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(v, x + 8, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("Confidence %:", x + 8, y + 34);
    doc.setDrawColor(...BORDER);
    doc.line(x + 70, y + 34, x + vW - 8, y + 34);
  });
  y += 66;

  sectionLabel(doc, "Open questions", m, y);
  y += 8;
  const qCols = [
    { label: "#", x: m, w: 28 },
    { label: "QUESTION", x: m + 28, w: 200 },
    { label: "VENDOR(S)", x: m + 228, w: 80 },
    { label: "OWNER", x: m + 308, w: 80 },
    { label: "DUE", x: m + 388, w: 60 },
    { label: "STATUS", x: m + 448, w: 67 },
  ];
  y = tableHeader(doc, qCols, y);
  y = emptyRows(doc, qCols, y, 6, 20);

  y += 14;
  sectionLabel(doc, "Key risks", m, y);
  y += 8;
  const rCols = [
    { label: "RISK", x: m, w: 160 },
    { label: "VENDOR", x: m + 160, w: 70 },
    { label: "LIKELIHOOD", x: m + 230, w: 70 },
    { label: "IMPACT", x: m + 300, w: 60 },
    { label: "MITIGATION", x: m + 360, w: 155 },
  ];
  y = tableHeader(doc, rCols, y);
  y = emptyRows(doc, rCols, y, 6, 20);

  y += 12;
  noteBox(
    doc,
    m,
    y,
    maxW,
    "Confidence reflects how evidence-backed your scores are — not a vendor marketing claim. Resolve open questions before final approval.",
  );
}

/* ─── Page 9: Decision Summary ─── */

function page9Summary(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "08", "Decision summary");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Rank finalists after gates, scores, cost, and risk. The weighted score informs the choice — it is not the decision.",
    m,
    y,
  );
  y += 16;

  const ranks = ["#1", "#2", "#3"];
  const fields = [
    "Vendor:",
    "Weighted fit:",
    "Gates:",
    "Confidence:",
    "3-year TCO:",
    "Key advantage:",
    "Key concern:",
  ];

  ranks.forEach((rank, i) => {
    const cardH = 148;
    doc.setFillColor(...(i === 0 ? BLUE_BG : SURFACE));
    doc.setDrawColor(...(i === 0 ? PRIMARY : BORDER));
    doc.setLineWidth(i === 0 ? 1.2 : 0.7);
    doc.roundedRect(m, y, maxW, cardH, 5, 5, "FD");
    doc.setFillColor(...(i === 0 ? PRIMARY : CARD_DARK));
    doc.roundedRect(m + 8, y + 8, 36, 22, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...WHITE);
    doc.text(rank, m + 26, y + 23, { align: "center" });

    fields.forEach((f, fi) => {
      const col = fi < 4 ? 0 : 1;
      const row = fi < 4 ? fi : fi - 4;
      const x = m + 56 + col * (maxW / 2 - 20);
      const yy = y + 28 + row * 28;
      labelLine(doc, f, x, yy, col === 0 ? maxW / 2 - 40 : maxW / 2 - 50);
    });
    y += cardH + 10;
  });

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Note: Score is not the decision. Document why #1 beats #2 when scores are close, gates differ, or cost/risk dominates.",
  );
}

/* ─── Page 10: Recommendation ─── */

function page10Recommendation(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "09", "Recommendation");

  sectionLabel(doc, "We recommend", m, y);
  y += 5;
  writingBox(doc, m, y, maxW, 40, "State the recommended vendor / option in one clear sentence.");
  y += 52;

  sectionLabel(doc, "Why", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    48,
    "Gates cleared · strongest evidence-backed fit · acceptable cost · manageable risk — cite your completed sheets only.",
  );
  y += 60;

  sectionLabel(doc, "Trade-off we accept", m, y);
  y += 5;
  writingBox(doc, m, y, maxW, 36, "What you give up by choosing this option.");
  y += 48;

  sectionLabel(doc, "Why not the runner-up", m, y);
  y += 5;
  writingBox(doc, m, y, maxW, 36, "Specific gate, score, cost, or risk reason — not preference.");
  y += 48;

  sectionLabel(doc, "Open conditions before commit", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    40,
    "Security review · commercial negotiation · reference checks · pilot success criteria…",
  );
  y += 54;

  labelLine(doc, "Prepared by:", m, y, maxW * 0.48);
  labelLine(doc, "Date:", m + maxW * 0.52, y, maxW * 0.46);
  y += 18;
  labelLine(doc, "Decision owner:", m, y, maxW * 0.48);
  labelLine(doc, "Signature:", m + maxW * 0.52, y, maxW * 0.46);
  y += 22;

  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 52, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("NEXT STEP", m + 14, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const next =
    "Build the CRM Business Case for the recommended option — investment, benefits, payback, risks, and formal approval ask.";
  const nextLines = doc.splitTextToSize(next, maxW - 28) as string[];
  doc.text(nextLines, m + 14, y + 34);
}

/* ─── Export ─── */

export async function buildCrmDecisionMatrixPdfBuffer(): Promise<Buffer> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  page1Overview(doc);
  doc.addPage();
  page2Framework(doc);
  doc.addPage();
  page3Gates(doc);
  doc.addPage();
  page4Weights(doc);
  doc.addPage();
  page5Scoring(doc);
  doc.addPage();
  page6Categories(doc);
  doc.addPage();
  page7Cost(doc);
  doc.addPage();
  page8Risk(doc);
  doc.addPage();
  page9Summary(doc);
  doc.addPage();
  page10Recommendation(doc);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    footer(doc, i, total);
  }

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
