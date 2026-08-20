/**
 * CRM RFP Template — PDF workbook (vendor-facing procurement response pack).
 * Blank fill-in fields only; SAMPLE requirement rows are labelled for replacement.
 * Not a Pass/Fail checklist. Delivery method model: Native / Configuration / Custom /
 * Partner / Roadmap / Not supported. No invented buyer stats, TCO figures, or current CRM.
 * Excel is the primary response workbook; this PDF is the printable brief.
 */

import type { jsPDF } from "jspdf";
import {
  RFP_DELIVERY_METHODS,
  RFP_PILLAR_REQUIREMENTS,
  RFP_SAMPLE_EXTRA_REQUIREMENTS,
  type RfpRequirementRow,
} from "@/data/resource-hub/crm-rfp-requirements";

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
const PURPLE_BG: RGB = [245, 243, 255];
const PURPLE: RGB = [124, 58, 237];
const SLATE_BG: RGB = [241, 245, 249];

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
  doc.text("SoftwareGlimpse  ·  CRM RFP Template", m, h - 16);
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
  doc.text("CRM RFP Template", w - m, y, { align: "right" });
  y += 18;
  doc.setFillColor(...PRIMARY);
  doc.rect(m, y, 28, 3, "F");
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...PRIMARY);
  doc.text(sectionNum, m, y);
  doc.setFontSize(16);
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
  doc.setFontSize(6);
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

function drawWrappedRow(
  doc: Doc,
  cols: Array<{ text: string; x: number; w: number; bold?: boolean }>,
  y: number,
  totalW: number,
  m: number,
  alt: boolean,
  minH = 22,
  maxLines = 3,
): number {
  const cellLines = cols.map((c) =>
    wrapCell(doc, c.text, c.w - 6, 6.5, c.bold ? "bold" : "normal").slice(0, maxLines),
  );
  const rowH = Math.max(minH, Math.max(...cellLines.map((l) => l.length)) * 8 + 8);
  doc.setFillColor(...(alt ? SURFACE : WHITE));
  doc.setDrawColor(...BORDER);
  doc.rect(m, y, totalW, rowH, "FD");
  cols.forEach((c, i) => {
    doc.setFont("helvetica", c.bold ? "bold" : "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...NAVY);
    doc.text(cellLines[i], c.x + 3, y + 10);
  });
  return y + rowH;
}

function sampleTag(doc: Doc, x: number, y: number) {
  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...AMBER);
  doc.roundedRect(x, y, 38, 12, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(...AMBER);
  doc.text("SAMPLE", x + 19, y + 8.5, { align: "center" });
}

function deliveryBadge(
  doc: Doc,
  x: number,
  y: number,
  label: string,
  fill: RGB,
  ink: RGB,
  badgeW: number,
) {
  doc.setFillColor(...fill);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(x, y, badgeW, 22, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...ink);
  doc.text(label, x + badgeW / 2, y + 14, { align: "center" });
}

const FUNCTIONAL_SAMPLE: RfpRequirementRow[] = [
  ...RFP_PILLAR_REQUIREMENTS,
  ...RFP_SAMPLE_EXTRA_REQUIREMENTS.filter((r) => r.id.startsWith("REQ-CRM-")),
];

const TECH_SAMPLE: RfpRequirementRow[] = RFP_SAMPLE_EXTRA_REQUIREMENTS.filter((r) =>
  r.id.startsWith("REQ-TECH-"),
);

const SEC_SAMPLE: RfpRequirementRow[] = RFP_SAMPLE_EXTRA_REQUIREMENTS.filter((r) =>
  r.id.startsWith("REQ-SEC-"),
);

const MIG_SAMPLE: RfpRequirementRow[] = RFP_SAMPLE_EXTRA_REQUIREMENTS.filter((r) =>
  r.id.startsWith("REQ-MIG-"),
);

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
  doc.setFontSize(22);
  doc.setTextColor(...NAVY);
  doc.text("CRM REQUEST FOR PROPOSAL", m, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("Structured vendor response template for CRM selection", m, y);
  y += 14;

  doc.setFillColor(...MINT);
  doc.setDrawColor(...GREEN);
  doc.roundedRect(m, y, maxW, 28, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...GREEN);
  const banner =
    "RFP WORKBOOK · Vendor-facing · Not a Pass/Fail checklist · Updated 15 Aug 2026 · Excel is the response workbook";
  const bannerLines = doc.splitTextToSize(banner, maxW - 20) as string[];
  doc.text(bannerLines, m + 10, y + (bannerLines.length === 1 ? 17 : 12));
  y += 36;

  const metaH = 96;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, metaH, 5, 5, "FD");
  labelLine(doc, "Buyer / organisation:", m + 12, y + 16, maxW * 0.48);
  labelLine(doc, "RFP reference:", m + maxW * 0.52, y + 16, maxW * 0.46);
  labelLine(doc, "Project name:", m + 12, y + 36, maxW * 0.48);
  labelLine(doc, "Issue date:", m + maxW * 0.52, y + 36, maxW * 0.46);
  labelLine(doc, "Primary contact:", m + 12, y + 56, maxW * 0.48);
  labelLine(doc, "Contact email:", m + maxW * 0.52, y + 56, maxW * 0.46);
  labelLine(doc, "Vendor invited:", m + 12, y + 76, maxW * 0.9);
  y += metaH + 12;

  sectionLabel(doc, "RFP at a glance (leave blank — fill from Excel)", m, y);
  y += 8;
  const counters = [
    "Must-have rows",
    "Should-have rows",
    "Vendors invited",
    "Response due",
  ];
  const cW = (maxW - 15) / 4;
  counters.forEach((label, i) => {
    kpiCardBlank(doc, m + i * (cW + 5), y, cW, 44, label);
  });
  y += 56;

  sectionLabel(doc, "Purpose", m, y);
  y += 6;
  y = noteBox(
    doc,
    m,
    y,
    maxW,
    "Issue one comparable package to every shortlisted CRM vendor. Require written answers in the response table (Excel is the primary response workbook). Score returned answers on your Vendor Scorecard — do not compare sales decks.",
    BLUE_BG,
    36,
  );

  sectionLabel(doc, "Vendor response deadline", m, y);
  y += 6;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 36, 4, 4, "FD");
  labelLine(doc, "Questions deadline:", m + 12, y + 14, maxW * 0.48);
  labelLine(doc, "Response due date:", m + maxW * 0.52, y + 14, maxW * 0.46);
  labelLine(doc, "Demo window:", m + 12, y + 28, maxW * 0.9);
  y += 46;

  sectionLabel(doc, "Selection workflow", m, y);
  y += 8;
  const steps = [
    "Requirements",
    "RFP",
    "Responses",
    "Demo",
    "Scorecard",
    "Decision",
  ];
  const sW = (maxW - 40) / steps.length;
  steps.forEach((s, i) => {
    const x = m + i * (sW + 8);
    doc.setFillColor(...(i === 1 ? PRIMARY : CARD_DARK));
    doc.roundedRect(x, y, sW, 28, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(...WHITE);
    doc.text(s, x + sW / 2, y + 17, { align: "center" });
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
    "Excel is the primary response workbook. Complete buyer context and freeze requirements before issuing. Leave glance counters and commercial tables blank until your project data is known — do not invent seat counts, TCO, or a current CRM.",
    MINT,
    40,
  );
}

/* ─── Page 2: Instructions to vendors ─── */

function page2Instructions(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "01", "Instructions to vendors");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Follow these rules so every vendor response can be compared side by side.",
    m,
    y,
  );
  y += 16;

  sectionLabel(doc, "How to respond", m, y);
  y += 8;
  const rules = [
    {
      t: "Use the Excel response workbook",
      d: "Complete every required sheet. Decks are appendix only — they do not replace the table.",
    },
    {
      t: "Answer every requirement row",
      d: "Provide a short vendor response, a Delivery method, the edition / add-on, and evidence (docs, trial path, or named module).",
    },
    {
      t: "One delivery method per row",
      d: "Pick Native, Configuration, Custom, Partner, Roadmap, or Not supported. Roadmap on a MUST HAVE is treated as a gap.",
    },
    {
      t: "Cite verifiable evidence",
      d: "Name the edition and how a non-admin verifies the capability in a trial or sandbox.",
    },
    {
      t: "Shared clarifications",
      d: "Material clarifications are shared with every invited vendor. Ask by the published questions deadline.",
    },
    {
      t: "Identical package",
      d: "All vendors receive the same brief, dates, and response format. Do not rely on private side conversations.",
    },
  ];
  rules.forEach((r, i) => {
    doc.setFillColor(...(i % 2 === 0 ? SURFACE : WHITE));
    doc.setDrawColor(...BORDER);
    doc.roundedRect(m, y, maxW, 36, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(`${i + 1}. ${r.t}`, m + 10, y + 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    const dLines = doc.splitTextToSize(r.d, maxW - 20) as string[];
    doc.text(dLines, m + 10, y + 26);
    y += 40;
  });

  y += 4;
  sectionLabel(doc, "Delivery method legend", m, y);
  y += 8;
  const methods: Array<{ label: string; fill: RGB; ink: RGB }> = [
    { label: "Native", fill: GREEN_BG, ink: GREEN },
    { label: "Configuration", fill: BLUE_BG, ink: PRIMARY },
    { label: "Custom", fill: AMBER_BG, ink: AMBER },
    { label: "Partner", fill: PURPLE_BG, ink: PURPLE },
    { label: "Roadmap", fill: SLATE_BG, ink: MUTED },
    { label: "Not supported", fill: RED_BG, ink: RED },
  ];
  const bW = (maxW - 25) / 6;
  methods.forEach((item, i) => {
    deliveryBadge(doc, m + i * (bW + 5), y, item.label, item.fill, item.ink, bW);
  });
  y += 30;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  const legendNote = doc.splitTextToSize(
    `Allowed values align with the Excel workbook: ${RFP_DELIVERY_METHODS.filter((v) => v !== "N/A").join(" · ")}. Use N/A only when the row is out of scope for your product.`,
    maxW,
  ) as string[];
  doc.text(legendNote, m, y);
  y += legendNote.length * 10 + 10;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "This is a vendor response template — not a Pass/Fail checklist. Buyers evaluate completeness and gaps after submission; vendors should not self-score Pass / Partial / Fail.",
    AMBER_BG,
    36,
  );
}

/* ─── Page 3: Company & project context ─── */

function page3Context(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "02", "Company & project context");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Buyer completes before issue. Leave fields blank in this PDF until known — do not invent company facts.",
    m,
    y,
  );
  y += 14;

  sectionLabel(doc, "Organisation overview", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    56,
    "What you sell, go-to-market motion, and the CRM job (owned pipeline, logged activity, usable forecast…):",
  );
  y += 64;

  sectionLabel(doc, "Current state (optional)", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    48,
    "Current tools / CRM (if any), known pain points, and why you are buying now:",
  );
  y += 56;

  sectionLabel(doc, "Project drivers", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    48,
    "Business drivers, constraints, and success definition for phase one:",
  );
  y += 56;

  sectionLabel(doc, "Key contacts", m, y);
  y += 6;
  const contactCols = [
    { label: "ROLE", x: m, w: 120 },
    { label: "NAME", x: m + 120, w: 140 },
    { label: "EMAIL", x: m + 260, w: 160 },
    { label: "NOTES", x: m + 420, w: 95 },
  ];
  y = tableHeader(doc, contactCols, y);
  const roles = ["Executive sponsor", "Ops / CRM owner", "IT / Security", "Procurement"];
  const totalW = contactCols.reduce((s, c) => s + c.w, 0);
  roles.forEach((role, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: role, x: m, w: 120, bold: true },
        { text: "", x: m + 120, w: 140 },
        { text: "", x: m + 260, w: 160 },
        { text: "", x: m + 420, w: 95 },
      ],
      y,
      totalW,
      m,
      i % 2 === 1,
      20,
      1,
    );
  });
  y += 12;

  y = noteBox(
    doc,
    m,
    y,
    maxW,
    "CONFIDENTIALITY — This RFP and any vendor response may contain confidential commercial and operational information. Recipients must not share outside parties required to prepare a response. Buyers: remove any internal-only pages (final page) before sending to vendors.",
    AMBER_BG,
    44,
  );
}

/* ─── Page 4: Business objectives + scope ─── */

function page4ObjectivesScope(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "03", "Business objectives & scope");

  sectionLabel(doc, "Business objectives", m, y);
  y += 6;
  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 18, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...AMBER);
  doc.text("SAMPLE rows below — replace with your signed objectives before issue", m + 8, y + 12);
  y += 24;

  const objCols = [
    { label: "ID", x: m, w: 50 },
    { label: "OBJECTIVE", x: m + 50, w: 220 },
    { label: "SUCCESS MEASURE", x: m + 270, w: 150 },
    { label: "PRIORITY", x: m + 420, w: 95 },
  ];
  y = tableHeader(doc, objCols, y);
  const totalObj = objCols.reduce((s, c) => s + c.w, 0);
  const sampleObjs = [
    {
      id: "OBJ-01",
      obj: "SAMPLE — Single source of truth for accounts, contacts, and open deals",
      measure: "SAMPLE — ______% of sellers updating weekly",
      pri: "MUST",
    },
    {
      id: "OBJ-02",
      obj: "SAMPLE — Management forecast from CRM without spreadsheet rebuild",
      measure: "SAMPLE — Forecast board used in ______ review",
      pri: "MUST",
    },
    {
      id: "OBJ-03",
      obj: "",
      measure: "",
      pri: "",
    },
    {
      id: "OBJ-04",
      obj: "",
      measure: "",
      pri: "",
    },
  ];
  sampleObjs.forEach((row, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: row.id, x: m, w: 50, bold: true },
        { text: row.obj, x: m + 50, w: 220 },
        { text: row.measure, x: m + 270, w: 150 },
        { text: row.pri, x: m + 420, w: 95 },
      ],
      y,
      totalObj,
      m,
      i % 2 === 1,
      24,
      2,
    );
  });
  y += 12;

  const halfW = maxW / 2 - 4;
  sectionLabel(doc, "In scope (phase one)", m, y);
  sectionLabel(doc, "Out of scope / later", m + halfW + 8, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    halfW,
    72,
    "Objects, teams, regions, and capabilities in day-one scope:",
  );
  writingBox(
    doc,
    m + halfW + 8,
    y,
    halfW,
    72,
    "Explicit exclusions and phase-two candidates:",
  );
  y += 84;

  sectionLabel(doc, "Delivery phases", m, y);
  y += 6;
  const phaseCols = [
    { label: "PHASE", x: m, w: 70 },
    { label: "FOCUS", x: m + 70, w: 220 },
    { label: "TARGET WINDOW", x: m + 290, w: 110 },
    { label: "NOTES", x: m + 400, w: 115 },
  ];
  y = tableHeader(doc, phaseCols, y);
  const phases = [
    { phase: "Discover", focus: "Requirements freeze + RFP issue", window: "", notes: "" },
    { phase: "Select", focus: "Responses → demo → scorecard", window: "", notes: "" },
    { phase: "Implement", focus: "Configure, migrate, train, go-live", window: "", notes: "" },
    { phase: "Adopt", focus: "Hypercare + optimisation", window: "", notes: "" },
  ];
  const totalPh = phaseCols.reduce((s, c) => s + c.w, 0);
  phases.forEach((row, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: row.phase, x: m, w: 70, bold: true },
        { text: row.focus, x: m + 70, w: 220 },
        { text: row.window, x: m + 290, w: 110 },
        { text: row.notes, x: m + 400, w: 115 },
      ],
      y,
      totalPh,
      m,
      i % 2 === 1,
      20,
      1,
    );
  });
}

/* ─── Page 5: Users & operating model ─── */

function page5Users(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "04", "Users & operating model");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Seat bands drive comparable quotes. Leave counts blank until known — SAMPLE structure only.",
    m,
    y,
  );
  y += 14;

  sectionLabel(doc, "User groups", m, y);
  y += 6;
  sampleTag(doc, m, y);
  y += 18;

  const userCols = [
    { label: "USER GROUP", x: m, w: 110 },
    { label: "PRIMARY JOBS", x: m + 110, w: 180 },
    { label: "SEAT BAND", x: m + 290, w: 70 },
    { label: "ACCESS LEVEL", x: m + 360, w: 80 },
    { label: "NOTES", x: m + 440, w: 75 },
  ];
  y = tableHeader(doc, userCols, y);
  const totalU = userCols.reduce((s, c) => s + c.w, 0);
  const users = [
    {
      g: "SAMPLE — Sellers",
      jobs: "Own pipeline, log activity, advance deals",
      seats: "",
      access: "Full CRM",
      notes: "",
    },
    {
      g: "SAMPLE — Managers",
      jobs: "Forecast, coach, approve discounts",
      seats: "",
      access: "Team + reports",
      notes: "",
    },
    {
      g: "SAMPLE — Ops / Admin",
      jobs: "Configure fields, users, integrations",
      seats: "",
      access: "Admin",
      notes: "",
    },
    {
      g: "SAMPLE — View-only",
      jobs: "Read pipeline / account context",
      seats: "",
      access: "Read-only",
      notes: "",
    },
    { g: "", jobs: "", seats: "", access: "", notes: "" },
    { g: "", jobs: "", seats: "", access: "", notes: "" },
  ];
  users.forEach((row, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: row.g, x: m, w: 110, bold: true },
        { text: row.jobs, x: m + 110, w: 180 },
        { text: row.seats, x: m + 290, w: 70 },
        { text: row.access, x: m + 360, w: 80 },
        { text: row.notes, x: m + 440, w: 75 },
      ],
      y,
      totalU,
      m,
      i % 2 === 1,
      22,
      2,
    );
  });
  y += 12;

  sectionLabel(doc, "Regions & languages", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    44,
    "Regions in scope, languages required, and any local compliance notes:",
  );
  y += 52;

  sectionLabel(doc, "Growth assumptions (blank)", m, y);
  y += 6;
  const growthCols = [
    { label: "HORIZON", x: m, w: 100 },
    { label: "USERS (BAND)", x: m + 100, w: 120 },
    { label: "RECORDS / VOLUME", x: m + 220, w: 160 },
    { label: "NOTES", x: m + 380, w: 135 },
  ];
  y = tableHeader(doc, growthCols, y);
  emptyRows(doc, growthCols, y, 3, 22);
  y += 3 * 22 + 12;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Do not invent seat counts or growth percentages in this PDF. Vendors price to the bands you publish in Excel.",
    MINT,
    28,
  );
}

/* ─── Pages 6–7: Functional requirements ─── */

function drawRequirementTable(
  doc: Doc,
  rows: RfpRequirementRow[],
  startY: number,
): number {
  const { m } = pageSize(doc);
  const cols = [
    { label: "ID", x: m, w: 58 },
    { label: "CATEGORY", x: m + 58, w: 72 },
    { label: "REQUIREMENT", x: m + 130, w: 150 },
    { label: "PRIORITY", x: m + 280, w: 48 },
    { label: "VENDOR RESPONSE", x: m + 328, w: 55 },
    { label: "DELIVERY", x: m + 383, w: 48 },
    { label: "EDITION", x: m + 431, w: 40 },
    { label: "EVIDENCE", x: m + 471, w: 44 },
  ];
  let y = tableHeader(doc, cols, startY, 18);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  rows.forEach((row, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: row.id, x: m, w: 58, bold: true },
        { text: row.category, x: m + 58, w: 72 },
        { text: `SAMPLE — ${row.requirement}`, x: m + 130, w: 150 },
        { text: row.priority, x: m + 280, w: 48 },
        { text: "", x: m + 328, w: 55 },
        { text: "", x: m + 383, w: 48 },
        { text: "", x: m + 431, w: 40 },
        { text: "", x: m + 471, w: 44 },
      ],
      y,
      totalW,
      m,
      i % 2 === 1,
      28,
      3,
    );
  });
  return y;
}

function page6Functional(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "05", "Functional requirements (1/2)");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  const intro = doc.splitTextToSize(
    "SAMPLE rows from the SoftwareGlimpse requirements module (CRM-REQ-001…). Replace with your signed must-haves before issue. Vendor response, Delivery method, Edition, and Evidence stay blank for the vendor.",
    maxW,
  ) as string[];
  doc.text(intro, m, y);
  y += intro.length * 10 + 8;

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 18, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...AMBER);
  doc.text(
    "SAMPLE — teaching rows only · Delivery: Native / Configuration / Custom / Partner / Roadmap / Not supported",
    m + 8,
    y + 12,
  );
  y += 24;

  drawRequirementTable(doc, FUNCTIONAL_SAMPLE.slice(0, 6), y);
}

function page7Functional(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "05", "Functional requirements (2/2)");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("Continuation of SAMPLE functional rows. Blank rows at bottom for your additions.", m, y);
  y += 14;

  y = drawRequirementTable(doc, FUNCTIONAL_SAMPLE.slice(6), y);
  y += 10;

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Blank rows for buyer-added requirements (not samples):", m, y);
  y += 6;
  const blankCols = [
    { x: m, w: 58 },
    { x: m + 58, w: 72 },
    { x: m + 130, w: 150 },
    { x: m + 280, w: 48 },
    { x: m + 328, w: 55 },
    { x: m + 383, w: 48 },
    { x: m + 431, w: 40 },
    { x: m + 471, w: 44 },
  ];
  emptyRows(doc, blankCols, y, 3, 24);
}

/* ─── Page 8: Technical & integrations ─── */

function page8Technical(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "06", "Technical & integrations");

  sectionLabel(doc, "Technical requirements (SAMPLE)", m, y);
  y += 6;
  y = drawRequirementTable(doc, TECH_SAMPLE, y);
  y += 12;

  sectionLabel(doc, "System integration matrix (blank systems)", m, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "List systems you need connected. Leave vendor cells blank for response in Excel.",
    m,
    y,
  );
  y += 12;

  const intCols = [
    { label: "SYSTEM", x: m, w: 100 },
    { label: "PURPOSE", x: m + 100, w: 120 },
    { label: "DIRECTION", x: m + 220, w: 60 },
    { label: "MUST?", x: m + 280, w: 40 },
    { label: "VENDOR APPROACH", x: m + 320, w: 90 },
    { label: "EDITION / ADD-ON", x: m + 410, w: 105 },
  ];
  y = tableHeader(doc, intCols, y);
  const totalI = intCols.reduce((s, c) => s + c.w, 0);
  const systems = [
    { sys: "", purpose: "Email / calendar", dir: "Bi-di", must: "" },
    { sys: "", purpose: "Marketing automation", dir: "", must: "" },
    { sys: "", purpose: "Billing / ERP", dir: "", must: "" },
    { sys: "", purpose: "Support / ticketing", dir: "", must: "" },
    { sys: "", purpose: "Data warehouse / BI", dir: "", must: "" },
    { sys: "", purpose: "", dir: "", must: "" },
  ];
  systems.forEach((row, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: row.sys, x: m, w: 100 },
        { text: row.purpose, x: m + 100, w: 120 },
        { text: row.dir, x: m + 220, w: 60 },
        { text: row.must, x: m + 280, w: 40 },
        { text: "", x: m + 320, w: 90 },
        { text: "", x: m + 410, w: 105 },
      ],
      y,
      totalI,
      m,
      i % 2 === 1,
      22,
      1,
    );
  });
  y += 12;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Marketplace listings alone are not evidence. Ask vendors to name the connector, edition gate, and who maintains it.",
    BLUE_BG,
    28,
  );
}

/* ─── Page 9: Data migration + security ─── */

function page9MigrationSecurity(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "07", "Data migration & security");

  sectionLabel(doc, "Migration objects (blank)", m, y);
  y += 6;
  const migCols = [
    { label: "OBJECT", x: m, w: 90 },
    { label: "IN SCOPE?", x: m + 90, w: 55 },
    { label: "APPROX. VOLUME", x: m + 145, w: 70 },
    { label: "HISTORY DEPTH", x: m + 215, w: 70 },
    { label: "VENDOR APPROACH", x: m + 285, w: 115 },
    { label: "LIMITATIONS", x: m + 400, w: 115 },
  ];
  y = tableHeader(doc, migCols, y);
  const objects = ["Contacts", "Accounts / companies", "Deals / opportunities", "Activities", "Custom objects", ""];
  const totalM = migCols.reduce((s, c) => s + c.w, 0);
  objects.forEach((obj, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: obj, x: m, w: 90, bold: !!obj },
        { text: "", x: m + 90, w: 55 },
        { text: "", x: m + 145, w: 70 },
        { text: "", x: m + 215, w: 70 },
        { text: "", x: m + 285, w: 115 },
        { text: "", x: m + 400, w: 115 },
      ],
      y,
      totalM,
      m,
      i % 2 === 1,
      20,
      1,
    );
  });
  y += 10;

  sectionLabel(doc, "Migration requirement (SAMPLE)", m, y);
  y += 6;
  y = drawRequirementTable(doc, MIG_SAMPLE, y);
  y += 10;

  sectionLabel(doc, "Security & privacy questions (SAMPLE)", m, y);
  y += 6;
  y = drawRequirementTable(doc, SEC_SAMPLE, y);
  y += 10;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Detailed diligence belongs on your Security Checklist. Here: ask only what blocks shortlist or contract. Leave vendor response cells blank for Excel.",
    AMBER_BG,
    32,
  );
}

/* ─── Page 10: Implementation + training + support ─── */

function page10Implementation(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "08", "Implementation, training & support");

  sectionLabel(doc, "Proposed timeline (blank)", m, y);
  y += 6;
  const tlCols = [
    { label: "MILESTONE", x: m, w: 140 },
    { label: "TARGET DATE", x: m + 140, w: 90 },
    { label: "OWNER", x: m + 230, w: 100 },
    { label: "VENDOR DEPENDENCY", x: m + 330, w: 185 },
  ];
  y = tableHeader(doc, tlCols, y);
  const milestones = [
    "Kick-off",
    "Design / config freeze",
    "Pilot / UAT",
    "Training complete",
    "Go-live",
    "Hypercare end",
  ];
  const totalTl = tlCols.reduce((s, c) => s + c.w, 0);
  milestones.forEach((ms, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: ms, x: m, w: 140, bold: true },
        { text: "", x: m + 140, w: 90 },
        { text: "", x: m + 230, w: 100 },
        { text: "", x: m + 330, w: 185 },
      ],
      y,
      totalTl,
      m,
      i % 2 === 1,
      20,
      1,
    );
  });
  y += 12;

  sectionLabel(doc, "Training plan asks", m, y);
  y += 6;
  const trainCols = [
    { label: "AUDIENCE", x: m, w: 100 },
    { label: "FORMAT", x: m + 100, w: 90 },
    { label: "INCLUDED?", x: m + 190, w: 55 },
    { label: "VENDOR RESPONSE", x: m + 245, w: 140 },
    { label: "COST (IF ANY)", x: m + 385, w: 130 },
  ];
  y = tableHeader(doc, trainCols, y);
  const audiences = ["Admins", "Managers", "End users", "Train-the-trainer"];
  const totalTr = trainCols.reduce((s, c) => s + c.w, 0);
  audiences.forEach((a, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: a, x: m, w: 100, bold: true },
        { text: "", x: m + 100, w: 90 },
        { text: "", x: m + 190, w: 55 },
        { text: "", x: m + 245, w: 140 },
        { text: "", x: m + 385, w: 130 },
      ],
      y,
      totalTr,
      m,
      i % 2 === 1,
      20,
      1,
    );
  });
  y += 12;

  sectionLabel(doc, "Support model", m, y);
  y += 6;
  const supCols = [
    { label: "TOPIC", x: m, w: 140 },
    { label: "BUYER QUESTION", x: m + 140, w: 200 },
    { label: "VENDOR RESPONSE", x: m + 340, w: 175 },
  ];
  y = tableHeader(doc, supCols, y);
  const support = [
    { t: "Support hours / SLA", q: "Business hours, channels, response targets?" },
    { t: "Named CSM / partner", q: "Who owns escalation after go-live?" },
    { t: "Success / admin hours", q: "Included hours vs billable?" },
    { t: "Community / docs", q: "Self-serve resources available?" },
  ];
  const totalS = supCols.reduce((s, c) => s + c.w, 0);
  support.forEach((row, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: row.t, x: m, w: 140, bold: true },
        { text: row.q, x: m + 140, w: 200 },
        { text: "", x: m + 340, w: 175 },
      ],
      y,
      totalS,
      m,
      i % 2 === 1,
      22,
      2,
    );
  });
}

/* ─── Page 11: Commercial & pricing ─── */

function page11Commercial(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "09", "Commercial & pricing");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "All amount cells blank. Vendors complete in Excel using your seat bands — do not invent list prices or TCO.",
    m,
    y,
  );
  y += 14;

  const drawBlankCommercial = (title: string, headers: string[], rowLabels: string[]) => {
    sectionLabel(doc, title, m, y);
    y += 6;
    const colW = Math.floor(maxW / headers.length);
    const cols = headers.map((label, i) => ({
      label,
      x: m + i * colW,
      w: i === headers.length - 1 ? maxW - i * colW : colW,
    }));
    y = tableHeader(doc, cols, y);
    const totalW = cols.reduce((s, c) => s + c.w, 0);
    rowLabels.forEach((label, i) => {
      const cells = cols.map((c, ci) => ({
        text: ci === 0 ? label : "",
        x: c.x,
        w: c.w,
        bold: ci === 0,
      }));
      y = drawWrappedRow(doc, cells, y, totalW, m, i % 2 === 1, 20, 1);
    });
    y += 10;
  };

  drawBlankCommercial(
    "Software licences",
    ["LINE ITEM", "EDITION", "SEATS", "UNIT PRICE", "ANNUAL"],
    ["Seller seats", "Manager seats", "View-only / light", "Admin / extra", ""],
  );

  drawBlankCommercial(
    "Add-ons & usage",
    ["ADD-ON", "INCLUDED?", "LIMIT", "OVERAGE", "ANNUAL"],
    ["Automation / workflows", "Storage", "API / sync", "AI / credits", ""],
  );

  drawBlankCommercial(
    "Implementation & services",
    ["SERVICE", "INCLUDED?", "DAYS / HOURS", "FEE", "NOTES"],
    ["Implementation package", "Data migration", "Training", "Custom development", ""],
  );

  drawBlankCommercial(
    "Recurring support / success",
    ["ITEM", "TIER", "INCLUDED", "ANNUAL FEE", "NOTES"],
    ["Standard support", "Premium support", "Success / CSM", "", ""],
  );

  sectionLabel(doc, "3-year TCO summary (blank)", m, y);
  y += 6;
  const tcoCols = [
    { label: "YEAR", x: m, w: 60 },
    { label: "SOFTWARE", x: m + 60, w: 90 },
    { label: "ADD-ONS", x: m + 150, w: 80 },
    { label: "SERVICES", x: m + 230, w: 80 },
    { label: "SUPPORT", x: m + 310, w: 80 },
    { label: "TOTAL", x: m + 390, w: 125 },
  ];
  y = tableHeader(doc, tcoCols, y);
  const years = ["Year 1", "Year 2", "Year 3", "3-year total"];
  const totalT = tcoCols.reduce((s, c) => s + c.w, 0);
  years.forEach((yr, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: yr, x: m, w: 60, bold: true },
        { text: "", x: m + 60, w: 90 },
        { text: "", x: m + 150, w: 80 },
        { text: "", x: m + 230, w: 80 },
        { text: "", x: m + 310, w: 80 },
        { text: "", x: m + 390, w: 125 },
      ],
      y,
      totalT,
      m,
      i % 2 === 1,
      18,
      1,
    );
  });
  y += 8;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Currency: ________   Payment terms: ________   Quote validity: ________   No invented totals — roll up from Excel after quotes return.",
    MINT,
    28,
  );
}

/* ─── Page 12: Vendor profile + roadmap + assumptions ─── */

function page12VendorProfile(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "10", "Vendor profile, roadmap & risks");

  sectionLabel(doc, "Vendor profile", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    52,
    "Company overview, relevant CRM customer segment, implementation model (direct / partner), and named response owner:",
  );
  y += 60;

  sectionLabel(doc, "Product roadmap (relevant to this RFP)", m, y);
  y += 6;
  const roadCols = [
    { label: "CAPABILITY", x: m, w: 150 },
    { label: "STATUS", x: m + 150, w: 80 },
    { label: "TARGET WINDOW", x: m + 230, w: 90 },
    { label: "IMPACT ON MUST-HAVES", x: m + 320, w: 195 },
  ];
  y = tableHeader(doc, roadCols, y);
  emptyRows(doc, roadCols, y, 4, 22);
  y += 4 * 22 + 12;

  sectionLabel(doc, "Assumptions", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    44,
    "State assumptions about buyer environment, data quality, seats, and scope:",
  );
  y += 52;

  sectionLabel(doc, "Exceptions", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    44,
    "List requirement IDs you cannot meet as stated, and the proposed alternative:",
  );
  y += 52;

  sectionLabel(doc, "Risks & mitigations", m, y);
  y += 6;
  const riskCols = [
    { label: "RISK", x: m, w: 180 },
    { label: "LIKELIHOOD", x: m + 180, w: 70 },
    { label: "IMPACT", x: m + 250, w: 70 },
    { label: "MITIGATION", x: m + 320, w: 195 },
  ];
  y = tableHeader(doc, riskCols, y);
  emptyRows(doc, riskCols, y, 4, 22);
}

/* ─── Page 13: Vendor declaration ─── */

function page13Declaration(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "11", "Vendor declaration & submission");

  sectionLabel(doc, "Response summary (blank)", m, y);
  y += 6;
  const sumCols = [
    { label: "METRIC", x: m, w: 200 },
    { label: "COUNT / VALUE", x: m + 200, w: 120 },
    { label: "NOTES", x: m + 320, w: 195 },
  ];
  y = tableHeader(doc, sumCols, y);
  const metrics = [
    "Must-have rows answered",
    "Must-haves marked Not supported",
    "Must-haves marked Roadmap",
    "Custom / Partner rows",
    "Exceptions listed",
    "Quoted edition(s)",
  ];
  const totalSum = sumCols.reduce((s, c) => s + c.w, 0);
  metrics.forEach((metric, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: metric, x: m, w: 200, bold: true },
        { text: "", x: m + 200, w: 120 },
        { text: "", x: m + 320, w: 195 },
      ],
      y,
      totalSum,
      m,
      i % 2 === 1,
      20,
      1,
    );
  });
  y += 14;

  sectionLabel(doc, "Submission checklist", m, y);
  y += 10;
  checkbox(doc, m + 4, y, "Excel response workbook completed");
  checkbox(doc, m + 250, y, "All must-have rows answered");
  y += 16;
  checkbox(doc, m + 4, y, "Delivery method set on every row");
  checkbox(doc, m + 250, y, "Edition / add-on named where gated");
  y += 16;
  checkbox(doc, m + 4, y, "Commercial tables completed");
  checkbox(doc, m + 250, y, "Assumptions & exceptions attached");
  y += 16;
  checkbox(doc, m + 4, y, "Evidence links / doc references included");
  checkbox(doc, m + 250, y, "Appendix decks labelled as appendix only");
  y += 22;

  sectionLabel(doc, "Vendor declaration", m, y);
  y += 6;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 100, 5, 5, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  const decl = doc.splitTextToSize(
    "I confirm that the information in this response is accurate to the best of my knowledge, that Delivery method and edition claims reflect the quoted configuration, and that roadmap items are clearly labelled as Roadmap (not day-one capability).",
    maxW - 24,
  ) as string[];
  doc.text(decl, m + 12, y + 16);
  labelLine(doc, "Authorised signatory:", m + 12, y + 48, maxW * 0.55);
  labelLine(doc, "Title:", m + maxW * 0.58, y + 48, maxW * 0.4);
  labelLine(doc, "Company:", m + 12, y + 68, maxW * 0.55);
  labelLine(doc, "Date:", m + maxW * 0.58, y + 68, maxW * 0.4);
  labelLine(doc, "Signature:", m + 12, y + 88, maxW * 0.9);
  y += 112;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Submit via the channel named on the cover by the response due date. Late or incomplete packages may be excluded from scoring without further notice.",
    BLUE_BG,
    32,
  );
}

/* ─── Page 14: Internal evaluation (do not send) ─── */

function page14Internal(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = m;

  doc.setFillColor(...RED_BG);
  doc.setDrawColor(...RED);
  doc.roundedRect(m, y, maxW, 36, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...RED);
  doc.text("INTERNAL — DO NOT SEND TO VENDOR", m + 12, y + 15);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Buyer evaluation only. Remove this page before issuing the RFP package.",
    m + 12,
    y + 28,
  );
  y += 48;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("SoftwareGlimpse", m, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("CRM RFP Template", w - m, y, { align: "right" });
  y += 16;
  doc.setFillColor(...PRIMARY);
  doc.rect(m, y, 28, 3, "F");
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...NAVY);
  doc.text("Buyer evaluation checklist", m, y);
  y += 18;

  sectionLabel(doc, "Completeness check", m, y);
  y += 10;
  checkbox(doc, m + 4, y, "All required sections returned");
  checkbox(doc, m + 240, y, "Must-have rows fully answered");
  y += 14;
  checkbox(doc, m + 4, y, "Delivery methods present");
  checkbox(doc, m + 240, y, "Edition gates named");
  y += 14;
  checkbox(doc, m + 4, y, "Commercial tables usable");
  checkbox(doc, m + 240, y, "Exceptions / assumptions clear");
  y += 18;

  sectionLabel(doc, "Gap review", m, y);
  y += 5;
  writingBox(
    doc,
    m,
    y,
    maxW,
    52,
    "Must-have gaps, Roadmap-as-day-one claims, missing evidence, commercial red flags:",
  );
  y += 60;

  sectionLabel(doc, "Next step (tick one)", m, y);
  y += 10;
  checkbox(doc, m + 4, y, "Reject");
  checkbox(doc, m + 90, y, "Clarification");
  checkbox(doc, m + 200, y, "Demo");
  checkbox(doc, m + 280, y, "POC");
  checkbox(doc, m + 350, y, "Scorecard");
  y += 20;

  writingBox(
    doc,
    m,
    y,
    maxW,
    40,
    "Rationale / owners / dates for the next step:",
  );
  y += 50;

  sectionLabel(doc, "Handoff links", m, y);
  y += 8;
  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW / 2 - 4, 56, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("Vendor Scorecard", m + 12, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(191, 219, 254);
  doc.text(
    doc.splitTextToSize(
      "Map written answers onto weighted criteria with evidence confidence.",
      maxW / 2 - 28,
    ) as string[],
    m + 12,
    y + 32,
  );

  doc.setFillColor(...PRIMARY);
  doc.roundedRect(m + maxW / 2 + 4, y, maxW / 2 - 4, 56, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("Decision Matrix", m + maxW / 2 + 16, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(191, 219, 254);
  doc.text(
    doc.splitTextToSize(
      "Final TCO / risk / selection after scorecard and demos.",
      maxW / 2 - 28,
    ) as string[],
    m + maxW / 2 + 16,
    y + 32,
  );
  y += 68;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Related: /resources/crm-vendor-scorecard/ · /resources/crm-decision-matrix/ · Excel remains the response workbook for comparable answers.",
    MINT,
    32,
  );
}

/* ─── Export ─── */

export async function buildCrmRfpPdfBuffer(): Promise<Buffer> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  page1Cover(doc);
  doc.addPage();
  page2Instructions(doc);
  doc.addPage();
  page3Context(doc);
  doc.addPage();
  page4ObjectivesScope(doc);
  doc.addPage();
  page5Users(doc);
  doc.addPage();
  page6Functional(doc);
  doc.addPage();
  page7Functional(doc);
  doc.addPage();
  page8Technical(doc);
  doc.addPage();
  page9MigrationSecurity(doc);
  doc.addPage();
  page10Implementation(doc);
  doc.addPage();
  page11Commercial(doc);
  doc.addPage();
  page12VendorProfile(doc);
  doc.addPage();
  page13Declaration(doc);
  doc.addPage();
  page14Internal(doc);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    footer(doc, i, total);
  }

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
