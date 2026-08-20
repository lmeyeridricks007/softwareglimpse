/**
 * CRM Business Case Template — PDF workbook (approval-ready, not a checklist).
 * Blank editable fields only; no invented ROI, pricing, or vendor claims.
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
const MINT: RGB = [236, 253, 245];
const AMBER_BG: RGB = [255, 251, 235];
const BLUE_BG: RGB = [239, 246, 255];

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
  doc.text("SoftwareGlimpse  ·  CRM Business Case Template", m, h - 16);
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
  doc.text("CRM Business Case", w - m, y, { align: "right" });
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
  // Guide lines
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

function badge(
  doc: Doc,
  text: string,
  x: number,
  y: number,
  fill: RGB,
  ink: RGB = NAVY,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  const tw = doc.getTextWidth(text) + 8;
  doc.setFillColor(...fill);
  doc.roundedRect(x, y - 7, tw, 10, 2, 2, "F");
  doc.setTextColor(...ink);
  doc.text(text, x + 4, y);
  return tw;
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

function kpiCard(
  doc: Doc,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  placeholder: string,
  fill: RGB = BLUE_BG,
) {
  doc.setFillColor(...fill);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(x, y, w, h, 5, 5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(label.toUpperCase(), x + 8, y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...NAVY);
  doc.text(placeholder, x + 8, y + 36);
}

function drawConfidenceLegend(doc: Doc, y: number) {
  const { m, w } = pageSize(doc);
  const maxW = w - m * 2;
  doc.setFillColor(...AMBER_BG);
  doc.roundedRect(m, y, maxW, 52, 4, 4, "F");
  sectionLabel(doc, "Assumption confidence", m + 8, y + 14);
  const items: Array<{ t: string; d: string; f: RGB }> = [
    { t: "VERIFIED", d: "Supported by known evidence", f: [209, 250, 229] },
    { t: "ESTIMATED", d: "Reasoned internal estimate", f: [219, 234, 254] },
    { t: "SCENARIO", d: "Hypothetical modelling assumption", f: [254, 243, 199] },
    { t: "UNKNOWN", d: "Still requires validation", f: [241, 245, 249] },
  ];
  let x = m + 8;
  doc.setFontSize(6.5);
  for (const it of items) {
    const bw = badge(doc, it.t, x, y + 30, it.f);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(it.d, x + bw + 4, y + 30);
    x += bw + doc.getTextWidth(it.d) + 16;
  }
  return y + 60;
}

function page1Cover(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = m;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY);
  doc.text("SoftwareGlimpse", m, y);
  y += 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(...NAVY);
  doc.text("CRM Business Case", m, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text("Build the case. Get approval. Drive results.", m, y);
  y += 22;

  const metaH = 78;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, metaH, 5, 5, "FD");
  const left = [
    "Project / Initiative:",
    "Business owner:",
    "Executive sponsor:",
  ];
  const right = ["Prepared by:", "Date:", "Target decision date:"];
  left.forEach((l, i) => labelLine(doc, l, m + 12, y + 18 + i * 20, maxW * 0.48));
  right.forEach((l, i) =>
    labelLine(doc, l, m + maxW * 0.52, y + 18 + i * 20, maxW * 0.46),
  );
  y += metaH + 16;

  sectionLabel(doc, "The decision", m, y);
  y += 8;
  writingBox(
    doc,
    m,
    y,
    maxW,
    72,
    'We are requesting approval to… (state the decision in one clear sentence, then add 2–4 supporting lines)',
  );
  y += 84;

  // Executive summary card
  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 168, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("EXECUTIVE SUMMARY", m + 14, y + 18);

  const fields = [
    ["Current problem", "e.g. siloed data, manual work, poor visibility — edit with your facts"],
    ["Recommended option", "e.g. Implement / replace CRM (Option C) — after options analysis"],
    ["Investment required", "Year 1 total from TCO sheet — do not invent"],
    ["Expected annual benefit", "From benefits model — label confidence"],
    ["Estimated payback", "Months — only if cash flows are populated"],
    ["Decision required by", "Target date for sponsor decision"],
  ];
  let fy = y + 32;
  fields.forEach(([label, hint]) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(191, 219, 254);
    doc.text(label.toUpperCase(), m + 14, fy);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(m + 14, fy + 10, m + maxW - 14, fy + 10);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(147, 197, 253);
    doc.text(hint, m + 14, fy + 8);
    fy += 22;
  });

  y += 180;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Fill blanks with your organisation’s evidence. Leave unknown fields blank — never manufacture ROI or vendor uplift.",
    m,
    y,
  );
}

function page2Problem(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "01", "Why change?");

  sectionLabel(doc, "Business problem", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    56,
    "Describe the business problem in 2–4 sentences. Who is hurt, what fails, and why it matters now.",
  );
  y += 68;

  sectionLabel(doc, "Current process", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    48,
    "How are leads, customers, opportunities and activities managed today?",
  );
  y += 60;

  sectionLabel(doc, "Current systems", m, y);
  y += 8;
  const sysCols = [
    { label: "SYSTEM / TOOL", x: m, w: 90 },
    { label: "PURPOSE", x: m + 90, w: 90 },
    { label: "USERS", x: m + 180, w: 55 },
    { label: "ANNUAL COST", x: m + 235, w: 70 },
    { label: "PRIMARY LIMITATION", x: m + 305, w: 120 },
    { label: "ACTION", x: m + 425, w: 90 },
  ];
  y = tableHeader(doc, sysCols, y);
  y = emptyRows(doc, sysCols, y, 4, 20);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Action = Replace / Integrate / Retain. Leave cost blank if unknown.",
    m,
    y + 10,
  );
  y += 20;

  sectionLabel(doc, "Current pain points", m, y);
  y += 8;
  const painCols = [
    { label: "PROBLEM", x: m, w: 120 },
    { label: "WHO AFFECTED?", x: m + 120, w: 85 },
    { label: "FREQUENCY", x: m + 205, w: 70 },
    { label: "BUSINESS IMPACT", x: m + 275, w: 130 },
    { label: "EVIDENCE / SOURCE", x: m + 405, w: 110 },
  ];
  y = tableHeader(doc, painCols, y);
  y = emptyRows(doc, painCols, y, 5, 20);

  y += 12;
  doc.setFillColor(...BLUE_BG);
  doc.roundedRect(m, y, maxW, 48, 4, 4, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  doc.text("Guidance only (do not treat as claims about your company):", m + 8, y + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    "Duplicate customer data · Manual sales reporting · Poor pipeline visibility · Missed follow-ups · Spreadsheet forecasting · Disconnected email/activity history · Low CRM adoption · Manual lead routing",
    m + 8,
    y + 28,
    { maxWidth: maxW - 16 },
  );
}

function page3Baseline(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "02", "What does the current state cost?");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Separate directly measured values, estimates, and unquantified costs. Mark confidence on every row.",
    m,
    y,
  );
  y += 14;

  const cols = [
    { label: "METRIC", x: m, w: 175 },
    { label: "CURRENT VALUE", x: m + 175, w: 100 },
    { label: "SOURCE", x: m + 275, w: 140 },
    { label: "CONFIDENCE", x: m + 415, w: 100 },
  ];
  y = tableHeader(doc, cols, y);

  const metrics = [
    "Salespeople",
    "Average loaded hourly cost",
    "Hours/week — manual admin",
    "Hours/week — preparing reports",
    "Leads / month",
    "Lead response time",
    "Conversion rate",
    "Average deal value",
    "Win rate",
    "Sales cycle length",
    "Forecast accuracy",
    "CRM / tool costs (annual)",
    "Duplicate software costs",
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  metrics.forEach((metric, i) => {
    const rowH = 18;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(metric, m + 4, y + 12);
    doc.setTextColor(...MUTED);
    doc.text("V / E / S / U", m + 420, y + 12);
    y += rowH;
  });

  y += 14;
  sectionLabel(doc, "Current annual cost estimate", m, y);
  y += 8;
  const costRows = [
    "Manual administration cost",
    "Reporting cost",
    "Existing software cost",
    "Lost productivity estimate",
    "Other measurable cost",
  ];
  costRows.forEach((r) => {
    doc.setFillColor(...SURFACE);
    doc.roundedRect(m, y, maxW, 20, 3, 3, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(r, m + 8, y + 13);
    doc.setDrawColor(...BORDER);
    doc.line(m + 220, y + 13, m + maxW - 8, y + 13);
    y += 24;
  });

  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 36, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("TOTAL ESTIMATED CURRENT ANNUAL COST", m + 12, y + 22);
  doc.text("_______________", m + maxW - 12, y + 22, { align: "right" });
}

function page4Outcomes(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "03", "What does success look like?");

  const cols = [
    { label: "OUTCOME", x: m, w: 120 },
    { label: "BASELINE", x: m + 120, w: 75 },
    { label: "TARGET", x: m + 195, w: 70 },
    { label: "MEASUREMENT", x: m + 265, w: 100 },
    { label: "OWNER", x: m + 365, w: 70 },
    { label: "DATE", x: m + 435, w: 80 },
  ];
  y = tableHeader(doc, cols, y);

  const examples = [
    "Reduce manual CRM administration",
    "Improve lead response time",
    "Improve pipeline visibility",
    "Increase CRM adoption",
    "Improve forecast accuracy",
    "Reduce duplicate tools",
    "Improve activity capture",
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  examples.forEach((ex, i) => {
    const rowH = 22;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(ex, m + 3, y + 14);
    y += rowH;
  });
  y = emptyRows(doc, cols, y, 2, 22);

  y += 14;
  sectionLabel(doc, "Non-financial benefits", m, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("Rate strategic value: High / Medium / Low — prompts only, not claims.", m, y);
  y += 10;

  const nfCols = [
    { label: "BENEFIT AREA", x: m, w: 200 },
    { label: "NOTES (HOW IT MATTERS HERE)", x: m + 200, w: 220 },
    { label: "STRATEGIC VALUE", x: m + 420, w: 95 },
  ];
  y = tableHeader(doc, nfCols, y);
  const areas = [
    "Customer experience",
    "Management visibility",
    "Data quality",
    "Process consistency",
    "Compliance / governance",
    "Employee experience",
    "Scalability",
  ];
  const nfW = nfCols.reduce((s, c) => s + c.w, 0);
  areas.forEach((a, i) => {
    const rowH = 20;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, nfW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(a, m + 4, y + 13);
    doc.setTextColor(...MUTED);
    doc.text("H / M / L", m + 430, y + 13);
    y += rowH;
  });
}

function page5Options(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "04", "What are our options?");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Prevent “we want Vendor X” as the whole case. Compare do-nothing, improve-existing, CRM, and an alternative.",
    m,
    y,
  );
  y += 14;

  const cardW = (maxW - 18) / 4;
  const options = [
    { t: "A · Do nothing", sub: "Status quo", rec: false },
    { t: "B · Improve existing", sub: "Process / system", rec: false },
    { t: "C · Implement CRM", sub: "Replace or expand", rec: true },
    { t: "D · Alternative", sub: "Other architecture", rec: false },
  ];
  options.forEach((o, i) => {
    const x = m + i * (cardW + 6);
    doc.setFillColor(...(o.rec ? PRIMARY : SURFACE));
    doc.setDrawColor(...(o.rec ? PRIMARY : BORDER));
    doc.roundedRect(x, y, cardW, 44, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...(o.rec ? WHITE : NAVY));
    doc.text(o.t, x + 8, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...(o.rec ? ([191, 219, 254] as RGB) : MUTED));
    doc.text(o.sub, x + 8, y + 30);
    if (o.rec) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.text("RECOMMENDED*", x + 8, y + 40);
    }
  });
  y += 56;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "*Mark recommended after analysis — Option C is a common path, not a default claim.",
    m,
    y,
  );
  y += 12;

  const rows = [
    "Description",
    "One-time cost",
    "Annual cost",
    "Expected benefit",
    "Time to value",
    "Risk",
    "Strategic fit",
  ];
  const colW = (maxW - 100) / 4;
  doc.setFillColor(...NAVY);
  doc.rect(m, y, maxW, 16, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...WHITE);
  doc.text("CRITERION", m + 4, y + 11);
  ["A", "B", "C", "D"].forEach((l, i) => {
    doc.text(`OPTION ${l}`, m + 100 + i * colW + 4, y + 11);
  });
  y += 16;
  rows.forEach((r, i) => {
    const rowH = 28;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, maxW, rowH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text(r, m + 4, y + 17);
    for (let c = 0; c < 4; c++) {
      doc.setDrawColor(...BORDER);
      doc.line(m + 100 + c * colW, y, m + 100 + c * colW, y + rowH);
    }
    y += rowH;
  });

  y += 12;
  sectionLabel(doc, "Why the recommended option?", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    70,
    "Explain the choice using cost, benefit, risk, and strategic fit — not brand preference alone.",
  );
}

function page6Tco(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "05", "What will the CRM really cost?");

  sectionLabel(doc, "Year 1 investment (one-time + first year)", m, y);
  y += 8;
  const y1 = [
    "Software licences",
    "Required add-ons",
    "Implementation partner",
    "Internal implementation effort",
    "Data migration",
    "Integrations",
    "Training",
    "Change management",
    "Customisation",
    "Security / compliance work",
    "Contingency",
  ];
  const half = Math.ceil(y1.length / 2);
  const colW = (maxW - 10) / 2;
  y1.forEach((item, i) => {
    const col = i < half ? 0 : 1;
    const row = i < half ? i : i - half;
    const x = m + col * (colW + 10);
    const yy = y + row * 20;
    doc.setFillColor(...SURFACE);
    doc.roundedRect(x, yy, colW, 18, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(item, x + 6, yy + 12);
    doc.setDrawColor(...BORDER);
    doc.line(x + colW * 0.55, yy + 12, x + colW - 6, yy + 12);
    badge(doc, "?", x + colW * 0.48, yy + 12, [241, 245, 249], MUTED);
  });
  y += half * 20 + 12;

  sectionLabel(doc, "Year 2+ recurring annual costs", m, y);
  y += 8;
  const rec = [
    "Licences",
    "Add-ons",
    "Administration",
    "Support",
    "Integration / platform costs",
    "Ongoing training",
    "Other",
  ];
  rec.forEach((item, i) => {
    const x = m + (i % 2) * (colW + 10);
    const yy = y + Math.floor(i / 2) * 20;
    doc.setFillColor(...SURFACE);
    doc.roundedRect(x, yy, colW, 18, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(item, x + 6, yy + 12);
    doc.setDrawColor(...BORDER);
    doc.line(x + colW * 0.55, yy + 12, x + colW - 6, yy + 12);
  });
  y += Math.ceil(rec.length / 2) * 20 + 14;

  const kW = (maxW - 16) / 3;
  kpiCard(doc, m, y, kW, 52, "Year 1 investment", "___________", BLUE_BG);
  kpiCard(doc, m + kW + 8, y, kW, 52, "Annual recurring", "___________", MINT);
  kpiCard(doc, m + 2 * (kW + 8), y, kW, 52, "3-year TCO", "___________", AMBER_BG);
  y += 64;

  sectionLabel(doc, "Assumptions", m, y);
  y += 8;
  const assumptions = [
    "Number of users",
    "Plan / tier",
    "Billing cycle",
    "Growth in seats",
    "Implementation duration",
    "Contingency %",
  ];
  assumptions.forEach((a, i) => {
    const x = m + (i % 3) * ((maxW - 16) / 3 + 8);
    const yy = y + Math.floor(i / 3) * 22;
    labelLine(doc, `${a}:`, x, yy, (maxW - 16) / 3);
  });
  y += 52;
  drawConfidenceLegend(doc, y);
}

function page7Benefits(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "06", "What value could the CRM create?");

  sectionLabel(doc, "Productivity savings", m, y);
  y += 6;
  doc.setFillColor(...BLUE_BG);
  doc.roundedRect(m, y, maxW, 54, 4, 4, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text(
    "Users  ×  Hours saved / week  ×  Loaded hourly cost  ×  Working weeks  =  Annual productivity value",
    m + 10,
    y + 18,
  );
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    "Label hours saved as SCENARIO unless verified by time study. Do not imply the CRM automatically creates this value.",
    m + 10,
    y + 36,
  );
  y += 66;

  const prodCols = [
    { label: "INPUT", x: m, w: 200 },
    { label: "VALUE", x: m + 200, w: 120 },
    { label: "CONFIDENCE", x: m + 320, w: 90 },
    { label: "NOTES", x: m + 410, w: 105 },
  ];
  y = tableHeader(doc, prodCols, y);
  ["Users", "Hours saved / week", "Loaded hourly cost", "Working weeks / year"].forEach(
    (r, i) => {
      const rowH = 18;
      doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
      doc.setDrawColor(...BORDER);
      doc.rect(m, y, maxW, rowH, "FD");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...NAVY);
      doc.text(r, m + 4, y + 12);
      y += rowH;
    },
  );
  y += 12;

  sectionLabel(doc, "Revenue improvement (scenario assumptions)", m, y);
  y += 6;
  const revCols = [
    { label: "LEVER", x: m, w: 180 },
    { label: "ASSUMPTION", x: m + 180, w: 140 },
    { label: "EST. ANNUAL IMPACT", x: m + 320, w: 100 },
    { label: "CONFIDENCE", x: m + 420, w: 95 },
  ];
  y = tableHeader(doc, revCols, y);
  [
    "Lead conversion improvement",
    "Win-rate improvement",
    "Sales-cycle improvement",
    "Recovered opportunities",
  ].forEach((r, i) => {
    const rowH = 18;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, maxW, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(r, m + 4, y + 12);
    badge(doc, "SCENARIO", m + 425, y + 12, [254, 243, 199]);
    y += rowH;
  });
  y += 12;

  sectionLabel(doc, "Cost avoidance", m, y);
  y += 6;
  ["Tools retired", "Manual processes removed", "External services reduced", "Other savings"].forEach(
    (r) => {
      doc.setFillColor(...SURFACE);
      doc.roundedRect(m, y, maxW, 18, 2, 2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...NAVY);
      doc.text(r, m + 6, y + 12);
      doc.setDrawColor(...BORDER);
      doc.line(m + 200, y + 12, m + maxW - 8, y + 12);
      y += 22;
    },
  );

  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 40, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("TOTAL ANNUAL MEASURABLE BENEFIT", m + 12, y + 17);
  doc.text("_______________", m + maxW - 12, y + 17, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(191, 219, 254);
  doc.text(
    "+ Unquantified strategic benefits (list on outcomes page) — do not force into ROI.",
    m + 12,
    y + 32,
  );
}

function page8Financial(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "07", "Is the investment financially justified?");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Populate from Excel model only when inputs exist. Never manufacture ROI.",
    m,
    y,
  );
  y += 12;

  const cards: Array<[string, string]> = [
    ["Year 1 investment", "___________"],
    ["Annual recurring", "___________"],
    ["Est. annual benefit", "___________"],
    ["3-year TCO", "___________"],
    ["3-year benefit", "___________"],
    ["Net 3-year value", "___________"],
    ["Payback (months)", "___________"],
    ["ROI %", "___________"],
  ];
  const cW = (maxW - 24) / 4;
  cards.forEach((c, i) => {
    const x = m + (i % 4) * (cW + 8);
    const yy = y + Math.floor(i / 4) * 58;
    kpiCard(doc, x, yy, cW, 50, c[0], c[1], i < 4 ? BLUE_BG : MINT);
  });
  y += 128;

  sectionLabel(doc, "3-year financial summary", m, y);
  y += 8;
  const cols = [
    { label: "YEAR", x: m, w: 70 },
    { label: "COSTS", x: m + 70, w: 100 },
    { label: "BENEFITS", x: m + 170, w: 100 },
    { label: "NET CASH IMPACT", x: m + 270, w: 120 },
    { label: "CUMULATIVE IMPACT", x: m + 390, w: 125 },
  ];
  y = tableHeader(doc, cols, y);
  ["Year 1", "Year 2", "Year 3"].forEach((yr, i) => {
    const rowH = 22;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, maxW, rowH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(yr, m + 6, y + 14);
    y += rowH;
  });
  y += 14;

  // Simple break-even timeline visual
  sectionLabel(doc, "Break-even timeline (sketch when values exist)", m, y);
  y += 8;
  doc.setFillColor(...SURFACE);
  doc.roundedRect(m, y, maxW, 90, 5, 5, "F");
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(1.2);
  const chartX = m + 30;
  const chartY = y + 50;
  const chartW = maxW - 60;
  doc.line(chartX, chartY, chartX + chartW, chartY); // axis
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("0", chartX, chartY + 12);
  doc.text("6 mo", chartX + chartW * 0.25, chartY + 12);
  doc.text("12 mo", chartX + chartW * 0.5, chartY + 12);
  doc.text("24 mo", chartX + chartW * 0.75, chartY + 12);
  doc.text("36 mo", chartX + chartW, chartY + 12, { align: "right" });
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(chartX, chartY - 30, chartX + chartW, chartY - 30);
  doc.setLineDashPattern([], 0);
  doc.text("Cumulative net (plot your cash flows)", chartX, y + 18);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Mark break-even where cumulative crosses zero — only after model is populated.",
    chartX,
    y + 30,
  );
  y += 102;
  drawConfidenceLegend(doc, y);
}

function page9Risks(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "08", "What could prevent the benefits?");

  const cols = [
    { label: "RISK", x: m, w: 140 },
    { label: "LIKELIHOOD", x: m + 140, w: 70 },
    { label: "IMPACT", x: m + 210, w: 60 },
    { label: "MITIGATION", x: m + 270, w: 160 },
    { label: "OWNER", x: m + 430, w: 85 },
  ];
  y = tableHeader(doc, cols, y);
  const prompts = [
    "Poor user adoption",
    "Data migration problems",
    "Integration complexity",
    "Scope creep",
    "Implementation delays",
    "Underestimated administration",
    "Unexpected licence growth",
    "Weak process ownership",
    "Data-quality problems",
  ];
  const totalW = cols.reduce((s, c) => s + c.w, 0);
  prompts.forEach((p, i) => {
    const rowH = 20;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, totalW, rowH, "FD");
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(p, m + 4, y + 13);
    y += rowH;
  });
  y = emptyRows(doc, cols, y, 2, 20);

  y += 14;
  sectionLabel(doc, "Key dependencies (prompts — tick when secured)", m, y);
  y += 10;
  const deps = [
    "Executive sponsorship",
    "Process owners",
    "Data readiness",
    "Integration capacity",
    "Training capacity",
    "Procurement",
    "Security / privacy review",
  ];
  deps.forEach((d, i) => {
    const x = m + (i % 4) * ((maxW - 18) / 4 + 6);
    const yy = y + Math.floor(i / 4) * 28;
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(1);
    doc.rect(x, yy, 10, 10, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(d, x + 16, yy + 9);
  });
}

function page10Roadmap(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "09", "How will we realise the value?");

  const stages = [
    "Approval",
    "Vendor / Contract",
    "Design",
    "Configuration",
    "Migration",
    "Training",
    "Go-live",
    "Adoption",
    "Benefits review",
  ];
  const sW = (maxW - (stages.length - 1) * 4) / stages.length;
  stages.forEach((s, i) => {
    const x = m + i * (sW + 4);
    doc.setFillColor(...(i === 0 ? PRIMARY : SURFACE));
    doc.roundedRect(x, y, sW, 36, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...(i === 0 ? WHITE : NAVY));
    const lines = doc.splitTextToSize(s, sW - 6) as string[];
    doc.text(lines, x + 3, y + 14);
    if (i < stages.length - 1) {
      doc.setFillColor(...PRIMARY);
      doc.circle(x + sW + 2, y + 18, 1.5, "F");
    }
  });
  y += 50;

  const cols = [
    { label: "MILESTONE", x: m, w: 160 },
    { label: "TARGET DATE", x: m + 160, w: 90 },
    { label: "OWNER", x: m + 250, w: 100 },
    { label: "SUCCESS GATE", x: m + 350, w: 165 },
  ];
  y = tableHeader(doc, cols, y);
  y = emptyRows(doc, cols, y, 8, 20);

  y += 14;
  sectionLabel(doc, "Value realisation checkpoints", m, y);
  y += 8;
  const checks = [
    ["30-day", "Early adoption & data hygiene signals"],
    ["90-day", "Process rituals running from CRM"],
    ["6-month", "Measurable ops / pipeline improvements"],
    ["12-month", "Benefits review vs business case"],
  ];
  const cW = (maxW - 18) / 4;
  checks.forEach((c, i) => {
    const x = m + i * (cW + 6);
    doc.setFillColor(...BLUE_BG);
    doc.roundedRect(x, y, cW, 70, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...PRIMARY);
    doc.text(c[0], x + 8, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(c[1], x + 8, y + 30, { maxWidth: cW - 16 });
    doc.setDrawColor(...BORDER);
    doc.line(x + 8, y + 48, x + cW - 8, y + 48);
    doc.line(x + 8, y + 60, x + cW - 8, y + 60);
  });
}

function page11Recommendation(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "10", "Recommendation");

  const blocks: Array<[string, number]> = [
    ["We recommend", 40],
    ["Why", 36],
    ["Why now", 36],
    ["Why this option", 36],
    ["What happens if we do nothing", 40],
  ];
  blocks.forEach(([label, h]) => {
    sectionLabel(doc, label, m, y);
    y += 5;
    writingBox(doc, m, y, maxW, h);
    y += h + 10;
  });

  sectionLabel(doc, "Final investment summary", m, y);
  y += 8;
  const summary = [
    "One-time / Year 1",
    "Recurring annual",
    "3-year TCO",
    "Expected measurable benefit (annual)",
    "Expected payback",
    "Overall confidence",
  ];
  summary.forEach((s, i) => {
    const x = m + (i % 2) * ((maxW - 10) / 2 + 10);
    const yy = y + Math.floor(i / 2) * 22;
    doc.setFillColor(...SURFACE);
    doc.roundedRect(x, yy, (maxW - 10) / 2, 18, 2, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(s, x + 6, yy + 12);
    doc.setDrawColor(...BORDER);
    doc.line(x + 160, yy + 12, x + (maxW - 10) / 2 - 6, yy + 12);
  });
}

function page12DecisionAndAssumptions(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "11", "Decision & assumptions");

  sectionLabel(doc, "Decision requested", m, y);
  y += 5;
  writingBox(doc, m, y, maxW, 40, "Formal ask for the sponsor / finance / procurement.");
  y += 52;

  sectionLabel(doc, "Decision", m, y);
  y += 8;
  const opts = [
    "APPROVED",
    "APPROVED WITH CONDITIONS",
    "MORE INFORMATION REQUIRED",
    "NOT APPROVED",
  ];
  opts.forEach((o, i) => {
    const x = m + (i % 2) * ((maxW - 10) / 2 + 10);
    const yy = y + Math.floor(i / 2) * 22;
    doc.setDrawColor(...PRIMARY);
    doc.rect(x, yy, 11, 11, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(o, x + 18, yy + 9);
  });
  y += 52;

  sectionLabel(doc, "Conditions / comments", m, y);
  y += 5;
  writingBox(doc, m, y, maxW, 36);
  y += 48;

  labelLine(doc, "Executive sponsor:", m, y, maxW * 0.48);
  labelLine(doc, "Finance / procurement:", m + maxW * 0.52, y, maxW * 0.46);
  y += 18;
  labelLine(doc, "Decision date:", m, y, maxW * 0.48);
  y += 22;

  sectionLabel(doc, "Assumptions register", m, y);
  y += 8;
  const cols = [
    { label: "ID", x: m, w: 28 },
    { label: "ASSUMPTION", x: m + 28, w: 130 },
    { label: "VALUE", x: m + 158, w: 70 },
    { label: "TYPE", x: m + 228, w: 55 },
    { label: "SOURCE", x: m + 283, w: 70 },
    { label: "OWNER", x: m + 353, w: 55 },
    { label: "CONF.", x: m + 408, w: 50 },
    { label: "VALIDATE?", x: m + 458, w: 57 },
  ];
  y = tableHeader(doc, cols, y);
  y = emptyRows(doc, cols, y, 6, 18);

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    "Type examples: cost, benefit, timing, volume. Confidence: Verified / Estimated / Scenario / Unknown.",
    m,
    y,
  );
}

export async function buildCrmBusinessCasePdfBuffer(): Promise<Buffer> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  page1Cover(doc);
  doc.addPage();
  page2Problem(doc);
  doc.addPage();
  page3Baseline(doc);
  doc.addPage();
  page4Outcomes(doc);
  doc.addPage();
  page5Options(doc);
  doc.addPage();
  page6Tco(doc);
  doc.addPage();
  page7Benefits(doc);
  doc.addPage();
  page8Financial(doc);
  doc.addPage();
  page9Risks(doc);
  doc.addPage();
  page10Roadmap(doc);
  doc.addPage();
  page11Recommendation(doc);
  doc.addPage();
  page12DecisionAndAssumptions(doc);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    footer(doc, i, total);
  }

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
