/**
 * CRM Field Mapping Template — PDF workbook (source→target mapping, not a checklist).
 * Blank fill-in fields only; EXAMPLE rows are labelled ILLUSTRATIVE (Pipedrive→HubSpot teaching).
 * No invented readiness scores, percentages, or Pass/Partial/Fail checklist chrome.
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
  doc.text("SoftwareGlimpse  ·  CRM Field Mapping Template", m, h - 16);
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
  doc.text("CRM Field Mapping Template", w - m, y, { align: "right" });
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

function drawWrappedRow(
  doc: Doc,
  cols: Array<{ text: string; x: number; w: number; bold?: boolean }>,
  y: number,
  totalW: number,
  m: number,
  alt: boolean,
  minH = 22,
): number {
  const cellLines = cols.map((c) =>
    wrapCell(doc, c.text, c.w - 6, 6.5, c.bold ? "bold" : "normal").slice(0, 3),
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

/* ─── Page 1: Cover / Project Setup ─── */

function page1Cover(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = m;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...PRIMARY);
  doc.text("SoftwareGlimpse", m, y);
  y += 26;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...NAVY);
  doc.text("CRM Field Mapping Template", m, y);
  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const sub = "Map source CRM data to your target system before migration.";
  doc.text(sub, m, y);
  y += 14;

  // Visible version stamp — confirms this is the mapping workbook (not the old checklist PDF)
  doc.setFillColor(...MINT);
  doc.setDrawColor(...GREEN);
  doc.roundedRect(m, y, maxW, 28, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...GREEN);
  doc.text(
    "MAPPING WORKBOOK  ·  Not a Pass/Fail checklist  ·  Updated 15 Aug 2026  ·  Excel is the primary working file",
    m + 10,
    y + 17,
  );
  y += 36;

  const metaH = 108;
  doc.setFillColor(...SURFACE);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, metaH, 5, 5, "FD");
  labelLine(doc, "Source CRM:", m + 12, y + 18, maxW * 0.48);
  labelLine(doc, "Target CRM:", m + maxW * 0.52, y + 18, maxW * 0.46);
  labelLine(doc, "Migration owner:", m + 12, y + 38, maxW * 0.48);
  labelLine(doc, "Business owner:", m + maxW * 0.52, y + 38, maxW * 0.46);
  labelLine(doc, "Implementation partner:", m + 12, y + 58, maxW * 0.48);
  labelLine(doc, "Migration date:", m + maxW * 0.52, y + 58, maxW * 0.46);
  labelLine(doc, "Last updated:", m + 12, y + 78, maxW * 0.9);
  y += metaH + 14;

  sectionLabel(doc, "Mapping flow", m, y);
  y += 10;
  const steps = [
    "SOURCE CRM",
    "OBJECT MAPPING",
    "FIELD MAPPING",
    "TRANSFORMS",
    "VALIDATION",
    "TARGET CRM",
  ];
  const sW = (maxW - 40) / steps.length;
  steps.forEach((s, i) => {
    const x = m + i * (sW + 8);
    doc.setFillColor(...(i === 5 ? PRIMARY : CARD_DARK));
    doc.roundedRect(x, y, sW, 32, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(...WHITE);
    const lines = doc.splitTextToSize(s, sW - 6) as string[];
    doc.text(lines, x + sW / 2, y + (lines.length === 1 ? 19 : 14), {
      align: "center",
    });
    if (i < steps.length - 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...PRIMARY);
      doc.text("→", x + sW + 2, y + 20);
    }
  });
  y += 48;

  sectionLabel(doc, "Summary counters (fill from Excel — leave blank until then)", m, y);
  y += 8;
  const counters = [
    "Objects mapped",
    "Fields mapped",
    "Transformations",
    "Unmapped required",
    "Open issues",
    "Mapping readiness",
  ];
  const cW = (maxW - 10) / 3;
  const cH = 48;
  counters.forEach((label, i) => {
    const x = m + (i % 3) * (cW + 5);
    const yy = y + Math.floor(i / 3) * (cH + 6);
    kpiCardBlank(doc, x, yy, cW, cH, label);
  });
  y += 2 * (cH + 6) + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  const readyNote =
    "Mapping readiness (circle one when Excel is complete):  NOT READY  ·  AT RISK  ·  TEST READY  ·  PRODUCTION READY";
  const readyLines = doc.splitTextToSize(readyNote, maxW) as string[];
  doc.text(readyLines, m, y);
  y += readyLines.length * 11 + 10;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Do not invent readiness scores or percentages. Leave summary counters blank until your workbook is filled. EXAMPLE rows later are ILLUSTRATIVE (Pipedrive → HubSpot teaching) — not SoftwareGlimpse research.",
    MINT,
  );
}

/* ─── Page 2: How to Use ─── */

function page2HowTo(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "01", "How to use");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(
    "Work top-down. Freeze object scope before deep field mapping. Do not invent Pass results without sample evidence.",
    m,
    y,
  );
  y += 16;

  const flow = [
    {
      t: "Inventory source objects",
      d: "List objects, approximate volumes, owners, and whether each is in scope for this wave.",
    },
    {
      t: "Map target objects",
      d: "Decide Full / Partial / Do not migrate / Excluded for each source object.",
    },
    {
      t: "Map fields",
      d: "Source field → target field with type, mapping type, required flag, and owner.",
    },
    {
      t: "Define transformations",
      d: "Document transforms, value maps, lookups, defaults, and do-not-migrate rules.",
    },
    {
      t: "Validate sample records",
      d: "Run sample source values through rules; confirm expected target outputs.",
    },
    {
      t: "Sign off mapping",
      d: "Business, CRM, migration, and data owners approve before pilot import.",
    },
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
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    const dLines = doc.splitTextToSize(f.d, maxW - 50) as string[];
    doc.text(dLines, m + 38, y + 28);
    y += 42;
  });

  y += 4;
  sectionLabel(doc, "Before you begin — required inputs", m, y);
  y += 8;
  const inputs = [
    "Source object inventory (export or API catalogue)",
    "Target CRM required fields (admin / import docs)",
    "Sample export rows for each in-scope object",
    "Owner directory for user lookups",
    "Picklist / stage / status value lists (source and target)",
    "Named migration owner and freeze date",
  ];
  inputs.forEach((item) => {
    checkbox(doc, m + 4, y + 2, item);
    y += 16;
  });

  y += 8;
  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...AMBER);
  doc.setLineWidth(1);
  doc.roundedRect(m, y, maxW, 52, 4, 4, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text("WARNING", m + 10, y + 16);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  const warn =
    "Do not start bulk migration testing until all required target fields have an approved mapping or explicit remediation decision.";
  const warnLines = doc.splitTextToSize(warn, maxW - 20) as string[];
  doc.text(warnLines, m + 10, y + 32);
}

/* ─── Page 3: Object Mapping ─── */

function page3Objects(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "02", "Object mapping");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 22, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...NAVY);
  doc.text(
    "EXAMPLE / ILLUSTRATIVE — Pipedrive → HubSpot teaching scenario (not SoftwareGlimpse research)",
    m + 8,
    y + 14,
  );
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Map each source object to a target object and migration scope. Leave Approx. Records and Owner blank until you have real counts.",
    m,
    y,
  );
  y += 14;

  const cols = [
    { label: "SOURCE OBJECT", x: m, w: 72 },
    { label: "TARGET OBJECT", x: m + 72, w: 72 },
    { label: "MIGRATION SCOPE", x: m + 144, w: 78 },
    { label: "APPROX. RECORDS", x: m + 222, w: 70 },
    { label: "OWNER", x: m + 292, w: 55 },
    { label: "STATUS", x: m + 347, w: 58 },
    { label: "NOTES", x: m + 405, w: 110 },
  ];
  y = tableHeader(doc, cols, y, 18);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  const examples: Array<{
    src: string;
    tgt: string;
    scope: string;
    status: string;
    notes: string;
  }> = [
    {
      src: "Person",
      tgt: "Contact",
      scope: "Full",
      status: "Mapped",
      notes: "EXAMPLE — primary people object",
    },
    {
      src: "Organization",
      tgt: "Company",
      scope: "Full",
      status: "Mapped",
      notes: "EXAMPLE — company match on name/domain",
    },
    {
      src: "Deal",
      tgt: "Deal",
      scope: "Full",
      status: "Mapped",
      notes: "EXAMPLE — open + closed pipeline",
    },
    {
      src: "Activity",
      tgt: "Activity",
      scope: "Full",
      status: "Needs decision",
      notes: "EXAMPLE — wave-one vs archive",
    },
    {
      src: "Legacy Note",
      tgt: "—",
      scope: "Do not migrate / Excluded",
      status: "Excluded",
      notes: "EXAMPLE — free-text noise; exclude",
    },
  ];

  examples.forEach((row, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: row.src, x: cols[0].x, w: cols[0].w, bold: true },
        { text: row.tgt, x: cols[1].x, w: cols[1].w },
        { text: row.scope, x: cols[2].x, w: cols[2].w },
        { text: "____", x: cols[3].x, w: cols[3].w },
        { text: "____", x: cols[4].x, w: cols[4].w },
        { text: row.status, x: cols[5].x, w: cols[5].w },
        { text: row.notes, x: cols[6].x, w: cols[6].w },
      ],
      y,
      totalW,
      m,
      i % 2 === 1,
      24,
    );
  });

  y += 6;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Blank rows for your project:", m, y);
  y += 8;
  y = emptyRows(doc, cols, y, 4, 22);

  y += 14;
  sectionLabel(doc, "Object summary (blank counts — fill from your sheet)", m, y);
  y += 8;
  const sumLabels = ["Mapped", "Needs decision", "Excluded", "Blocked"];
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
    "EXAMPLE rows teach the pattern. Replace scopes, statuses, and notes with your source→target decisions. Never invent record counts.",
    MINT,
  );
}

/* ─── Page 4: Field Mapping Matrix ─── */

function page4Fields(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "03", "Field mapping matrix");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 20, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...NAVY);
  doc.text(
    "EXAMPLE / ILLUSTRATIVE rows — Pipedrive → HubSpot teaching (replace with your fields)",
    m + 8,
    y + 13,
  );
  y += 28;

  const cols = [
    { label: "SRC OBJ", x: m, w: 38 },
    { label: "SRC FIELD", x: m + 38, w: 52 },
    { label: "TYPE", x: m + 90, w: 32 },
    { label: "→ TGT OBJ", x: m + 122, w: 42 },
    { label: "TGT FIELD", x: m + 164, w: 48 },
    { label: "TYPE", x: m + 212, w: 28 },
    { label: "MAP TYPE", x: m + 240, w: 52 },
    { label: "TRANSFORMATION", x: m + 292, w: 90 },
    { label: "REQ?", x: m + 382, w: 28 },
    { label: "OWNER", x: m + 410, w: 40 },
    { label: "STATUS", x: m + 450, w: 65 },
  ];
  y = tableHeader(doc, cols, y, 16);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  const rows: Array<{
    so: string;
    sf: string;
    st: string;
    to: string;
    tf: string;
    tt: string;
    mt: string;
    tr: string;
    req: string;
    own: string;
    stt: string;
  }> = [
    {
      so: "Person",
      sf: "email",
      st: "text",
      to: "Contact",
      tf: "email",
      tt: "email",
      mt: "Direct",
      tr: "trim + lowercase",
      req: "Y",
      own: "____",
      stt: "EXAMPLE",
    },
    {
      so: "Person",
      sf: "name",
      st: "text",
      to: "Contact",
      tf: "firstname / lastname",
      tt: "text",
      mt: "Transform",
      tr: "split on first space",
      req: "Y",
      own: "____",
      stt: "EXAMPLE",
    },
    {
      so: "Org",
      sf: "address",
      st: "text",
      to: "Company",
      tf: "address",
      tt: "text",
      mt: "Rename",
      tr: "same value; field rename",
      req: "N",
      own: "____",
      stt: "EXAMPLE",
    },
    {
      so: "Deal",
      sf: "status",
      st: "enum",
      to: "Deal",
      tf: "dealstage",
      tt: "enum",
      mt: "Value Mapping",
      tr: "see picklist sheet",
      req: "Y",
      own: "____",
      stt: "EXAMPLE",
    },
    {
      so: "Deal",
      sf: "owner_id",
      st: "id",
      to: "Deal",
      tf: "hubspot_owner_id",
      tt: "id",
      mt: "Lookup",
      tr: "user email → owner",
      req: "Y",
      own: "____",
      stt: "EXAMPLE",
    },
    {
      so: "Deal",
      sf: "value",
      st: "num",
      to: "Deal",
      tf: "amount",
      tt: "num",
      mt: "Transform",
      tr: "parse; strip currency",
      req: "Y",
      own: "____",
      stt: "EXAMPLE",
    },
    {
      so: "Person",
      sf: "ssn_like",
      st: "text",
      to: "—",
      tf: "—",
      tt: "—",
      mt: "Do not migrate",
      tr: "exclude; security",
      req: "N",
      own: "____",
      stt: "EXAMPLE",
    },
    {
      so: "Activity",
      sf: "subject",
      st: "text",
      to: "Activity",
      tf: "hs_task_subject",
      tt: "text",
      mt: "Direct",
      tr: "trim",
      req: "N",
      own: "____",
      stt: "EXAMPLE",
    },
  ];

  rows.forEach((r, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: r.so, x: cols[0].x, w: cols[0].w, bold: true },
        { text: r.sf, x: cols[1].x, w: cols[1].w },
        { text: r.st, x: cols[2].x, w: cols[2].w },
        { text: r.to, x: cols[3].x, w: cols[3].w },
        { text: r.tf, x: cols[4].x, w: cols[4].w },
        { text: r.tt, x: cols[5].x, w: cols[5].w },
        { text: r.mt, x: cols[6].x, w: cols[6].w },
        { text: r.tr, x: cols[7].x, w: cols[7].w },
        { text: r.req, x: cols[8].x, w: cols[8].w },
        { text: r.own, x: cols[9].x, w: cols[9].w },
        { text: r.stt, x: cols[10].x, w: cols[10].w },
      ],
      y,
      totalW,
      m,
      i % 2 === 1,
      20,
    );
  });

  y += 10;
  sectionLabel(doc, "Mapping type legend", m, y);
  y += 8;
  const badges: Array<{ label: string; fill: RGB; ink: RGB }> = [
    { label: "Direct", fill: GREEN_BG, ink: GREEN },
    { label: "Rename", fill: BLUE_BG, ink: PRIMARY },
    { label: "Transform", fill: AMBER_BG, ink: AMBER },
    { label: "Value Mapping", fill: BLUE_BG, ink: CARD_DARK },
    { label: "Lookup", fill: MINT, ink: GREEN },
    { label: "Do not migrate", fill: RED_BG, ink: RED },
    { label: "Default", fill: SURFACE, ink: MUTED },
    { label: "Blank + fill in CRM", fill: SURFACE, ink: MUTED },
  ];
  const badgeW = (maxW - 21) / 4;
  badges.forEach((b, i) => {
    const x = m + (i % 4) * (badgeW + 7);
    const yy = y + Math.floor(i / 4) * 22;
    doc.setFillColor(...b.fill);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, yy, badgeW, 18, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...b.ink);
    doc.text(b.label, x + badgeW / 2, yy + 12, { align: "center" });
  });
  y += 52;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Core sheet: replace EXAMPLE rows with your dictionary. Owner and Status stay blank until assigned. Required (Req?) must be set for every target field needed on day one.",
  );
}

/* ─── Page 5: Value & Picklist Mapping ─── */

function page5Values(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "04", "Value & picklist mapping");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 20, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...NAVY);
  doc.text(
    "EXAMPLE / ILLUSTRATIVE — teach value maps; replace with your picklists",
    m + 8,
    y + 13,
  );
  y += 28;

  sectionLabel(doc, "lead_status (EXAMPLE)", m, y);
  y += 8;
  const cols = [
    { label: "SOURCE VALUE", x: m, w: 110 },
    { label: "TARGET VALUE", x: m + 110, w: 110 },
    { label: "ACTION", x: m + 220, w: 90 },
    { label: "OWNER", x: m + 310, w: 80 },
    { label: "NOTES", x: m + 390, w: 125 },
  ];
  y = tableHeader(doc, cols, y);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  const leadRows = [
    ["New", "New", "Map", "____", "EXAMPLE — 1:1"],
    ["Working", "In Progress", "Map", "____", "EXAMPLE — rename"],
    ["Qualified", "Qualified", "Map", "____", "EXAMPLE — 1:1"],
    ["Unqualified", "Unqualified", "Map", "____", "EXAMPLE — 1:1"],
    ["(blank)", "New", "Default?", "____", "EXAMPLE — confirm with marketing"],
  ];
  leadRows.forEach((r, i) => {
    y = drawWrappedRow(
      doc,
      r.map((text, ci) => ({
        text,
        x: cols[ci].x,
        w: cols[ci].w,
        bold: ci === 0,
      })),
      y,
      totalW,
      m,
      i % 2 === 1,
      18,
    );
  });

  y += 12;
  sectionLabel(doc, "customer_tier (EXAMPLE)", m, y);
  y += 8;
  y = tableHeader(doc, cols, y);
  const tierRows = [
    ["Enterprise", "Enterprise", "Map", "____", "EXAMPLE"],
    ["Mid-Market", "Mid-Market", "Map", "____", "EXAMPLE"],
    ["SMB", "SMB", "Map", "____", "EXAMPLE"],
    ["Legacy Gold", "Enterprise", "Map", "____", "EXAMPLE — consolidate"],
    ["Unknown", "Other", "Map / review", "____", "EXAMPLE — unknown handling"],
  ];
  tierRows.forEach((r, i) => {
    y = drawWrappedRow(
      doc,
      r.map((text, ci) => ({
        text,
        x: cols[ci].x,
        w: cols[ci].w,
        bold: ci === 0,
      })),
      y,
      totalW,
      m,
      i % 2 === 1,
      18,
    );
  });

  y += 14;
  sectionLabel(doc, "Unknown value handling", m, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Choose how unmapped source values are treated during import. Tick one primary policy; note exceptions.",
    m,
    y,
  );
  y += 14;

  const policies = [
    "Reject row (fail import for that record)",
    "Apply approved default value: ____________________",
    "Send to remediation queue / holding list",
    "Map to Other / Unspecified",
    "Flag for manual review before load",
  ];
  policies.forEach((p) => {
    checkbox(doc, m + 4, y + 2, p);
    y += 18;
  });

  y += 8;
  writingBox(
    doc,
    m,
    y,
    maxW,
    56,
    "Policy notes / exceptions (field-specific overrides, fail thresholds, owners):",
  );
}

/* ─── Page 6: Transforms & Data Quality ─── */

function page6Transforms(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "05", "Transforms & data quality");

  doc.setFillColor(...AMBER_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(m, y, maxW, 20, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...NAVY);
  doc.text(
    "EXAMPLE rules TR-001..TR-004 — illustrative only; rewrite for your stack",
    m + 8,
    y + 13,
  );
  y += 28;

  const cols = [
    { label: "ID", x: m, w: 42 },
    { label: "FIELD(S)", x: m + 42, w: 80 },
    { label: "RULE", x: m + 122, w: 200 },
    { label: "SAMPLE IN → OUT", x: m + 322, w: 120 },
    { label: "OWNER", x: m + 442, w: 73 },
  ];
  y = tableHeader(doc, cols, y, 18);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  const rules = [
    {
      id: "TR-001",
      fields: "phone",
      rule: "EXAMPLE — E.164 normalize; drop non-digits; fail if < 8 digits after clean",
      sample: "+1 (415) 555-0199 → +14155550199",
    },
    {
      id: "TR-002",
      fields: "country",
      rule: "EXAMPLE — ISO-2 map (United States→US); else remediation queue",
      sample: "United States → US",
    },
    {
      id: "TR-003",
      fields: "revenue / amount",
      rule: "EXAMPLE — parse number; strip $, commas; blank open deals need fill-in rule",
      sample: "$12,500 → 12500",
    },
    {
      id: "TR-004",
      fields: "full name",
      rule: "EXAMPLE — split on first space → firstname / lastname; blank last → review",
      sample: "Pat Lee → Pat | Lee",
    },
  ];

  rules.forEach((r, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: r.id, x: cols[0].x, w: cols[0].w, bold: true },
        { text: r.fields, x: cols[1].x, w: cols[1].w },
        { text: r.rule, x: cols[2].x, w: cols[2].w },
        { text: r.sample, x: cols[3].x, w: cols[3].w },
        { text: "____", x: cols[4].x, w: cols[4].w },
      ],
      y,
      totalW,
      m,
      i % 2 === 1,
      32,
    );
  });

  y += 8;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Add your transform IDs below:", m, y);
  y += 8;
  y = emptyRows(doc, cols, y, 4, 22);

  y += 14;
  sectionLabel(doc, "Data quality notes", m, y);
  y += 6;
  writingBox(
    doc,
    m,
    y,
    maxW,
    100,
    "Capture quality gates that block pilot: duplicate emails, ownerless open deals, invalid dates, unmapped stages, currency symbols, orphan account links…\n\nFail thresholds (fill when known): ________%  ·  Quarantine owner: ________",
  );
  y += 112;

  noteBox(
    doc,
    m,
    y,
    maxW,
    "Transforms are config. Every required target field needs a written rule, approved default, or explicit blank-with-owner — never hope.",
    MINT,
  );
}

/* ─── Page 7: Validation & Readiness ─── */

function page7Validation(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "06", "Validation & readiness");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Fill metrics only after sample validation. Leave blanks — do not invent percentages or readiness scores.",
    m,
    y,
  );
  y += 14;

  sectionLabel(doc, "Validation metrics (blank fill-ins)", m, y);
  y += 8;
  const metrics = [
    "Sample records tested",
    "Fields validated",
    "Transform pass rate",
    "Required fields covered",
    "Unmapped required remaining",
    "Open defects",
  ];
  const mW = (maxW - 10) / 3;
  metrics.forEach((label, i) => {
    const x = m + (i % 3) * (mW + 5);
    const yy = y + Math.floor(i / 3) * 52;
    kpiCardBlank(doc, x, yy, mW, 46, label);
  });
  y += 2 * 52 + 8;

  sectionLabel(doc, "Readiness states", m, y);
  y += 8;
  const states = [
    { name: "NOT READY", desc: "Required maps incomplete or untested" },
    { name: "AT RISK", desc: "Gaps remain; pilot blocked until remediated" },
    { name: "TEST READY", desc: "Required maps approved for pilot import" },
    { name: "PRODUCTION READY", desc: "Pilot passed; freeze signed for cutover" },
  ];
  const stW = (maxW - 15) / 4;
  states.forEach((s, i) => {
    const x = m + i * (stW + 5);
    doc.setFillColor(...SURFACE);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, stW, 56, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(...PRIMARY);
    doc.text(s.name, x + 6, y + 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(s.desc, stW - 12) as string[];
    doc.text(lines, x + 6, y + 30);
  });
  y += 68;

  sectionLabel(doc, "Validation checks", m, y);
  y += 8;
  const vCols = [
    { label: "CHECK", x: m, w: 280 },
    { label: "OWNER", x: m + 280, w: 90 },
    { label: "STATUS", x: m + 370, w: 145 },
  ];
  y = tableHeader(doc, vCols, y);
  const tw = vCols.reduce((s, c) => s + c.w, 0);
  const checks = [
    "Required target fields have approved mapping or remediation",
    "Stage / status value map complete (no silent invent)",
    "Owner lookup tested on sample users",
    "Date / amount transforms validated on sample rows",
    "Do-not-migrate fields confirmed excluded",
    "Sample expected outputs match target preview",
    "Cross-object links (account / contact / deal) verified",
    "Freeze version ID assigned for pilot",
  ];
  checks.forEach((c, i) => {
    const rowH = 22;
    doc.setFillColor(...(i % 2 === 0 ? WHITE : SURFACE));
    doc.setDrawColor(...BORDER);
    doc.rect(m, y, tw, rowH, "FD");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    const lines = doc.splitTextToSize(c, 272) as string[];
    doc.text(lines[0] ?? c, m + 4, y + 14);
    doc.setDrawColor(...BORDER);
    doc.line(m + 286, y + 15, m + 360, y + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...MUTED);
    doc.text("[ ] Open  [ ] Pass  [ ] Fail  [ ] N/A", m + 374, y + 14);
    y += rowH;
  });

  y += 10;
  noteBox(
    doc,
    m,
    y,
    maxW,
    "Status key: Open / Pass / Fail / N/A — mark blank until evidenced. Do not use invented Pass rates as readiness truth.",
  );
}

/* ─── Page 8: Decisions, Issues & Sign-off ─── */

function page8SignOff(doc: Doc) {
  const { w, m } = pageSize(doc);
  const maxW = w - m * 2;
  let y = pageHeader(doc, "07", "Decisions, issues & sign-off");

  sectionLabel(doc, "Decision / issue log", m, y);
  y += 8;
  const cols = [
    { label: "ID", x: m, w: 36 },
    { label: "TYPE", x: m + 36, w: 55 },
    { label: "DESCRIPTION", x: m + 91, w: 180 },
    { label: "DECISION / ACTION", x: m + 271, w: 130 },
    { label: "OWNER", x: m + 401, w: 55 },
    { label: "STATUS", x: m + 456, w: 59 },
  ];
  y = tableHeader(doc, cols, y);
  const totalW = cols.reduce((s, c) => s + c.w, 0);

  const examples = [
    {
      id: "D-01",
      type: "Decision",
      desc: "EXAMPLE — Activity history: wave one open-deal linked only",
      action: "EXAMPLE — Archive remainder; revisit wave two",
      status: "Open",
    },
    {
      id: "I-01",
      type: "Issue",
      desc: "EXAMPLE — Legacy note object has no clean target",
      action: "EXAMPLE — Exclude; export PDF archive if needed",
      status: "Resolved",
    },
  ];
  examples.forEach((r, i) => {
    y = drawWrappedRow(
      doc,
      [
        { text: r.id, x: cols[0].x, w: cols[0].w, bold: true },
        { text: r.type, x: cols[1].x, w: cols[1].w },
        { text: r.desc, x: cols[2].x, w: cols[2].w },
        { text: r.action, x: cols[3].x, w: cols[3].w },
        { text: "____", x: cols[4].x, w: cols[4].w },
        { text: r.status, x: cols[5].x, w: cols[5].w },
      ],
      y,
      totalW,
      m,
      i % 2 === 1,
      28,
    );
  });
  y += 4;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text("Blank rows for your project (not examples):", m, y);
  y += 6;
  y = emptyRows(doc, cols, y, 4, 20);

  y += 12;
  sectionLabel(doc, "Sign-off", m, y);
  y += 8;
  const signers = [
    "Business owner",
    "CRM owner",
    "Migration lead",
    "Data owner",
  ];
  const sgW = (maxW - 15) / 4;
  signers.forEach((s, i) => {
    const x = m + i * (sgW + 5);
    doc.setFillColor(...SURFACE);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, sgW, 58, 4, 4, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...NAVY);
    doc.text(s, x + 8, y + 14);
    labelLine(doc, "Name:", x + 8, y + 30, sgW - 16);
    labelLine(doc, "Date:", x + 8, y + 46, sgW - 16);
  });
  y += 70;

  sectionLabel(doc, "Mapping status", m, y);
  y += 10;
  checkbox(doc, m + 4, y, "Approved for test");
  checkbox(doc, m + 140, y, "Approved with exceptions");
  checkbox(doc, m + 310, y, "Not approved");
  y += 18;

  sectionLabel(doc, "Remaining blockers", m, y);
  y += 5;
  writingBox(doc, m, y, maxW, 48, "List blockers that keep status Not approved or Approved with exceptions:");
  y += 60;

  doc.setFillColor(...CARD_DARK);
  doc.roundedRect(m, y, maxW, 52, 5, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...WHITE);
  doc.text("NEXT STEP", m + 14, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254);
  const next =
    "Use the CRM Migration Checklist and Data Migration Template to run pilot import, dual-run, and cutover with this frozen mapping.";
  const nextLines = doc.splitTextToSize(next, maxW - 28) as string[];
  doc.text(nextLines, m + 14, y + 34);
}

/* ─── Export ─── */

export async function buildCrmFieldMappingPdfBuffer(): Promise<Buffer> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  page1Cover(doc);
  doc.addPage();
  page2HowTo(doc);
  doc.addPage();
  page3Objects(doc);
  doc.addPage();
  page4Fields(doc);
  doc.addPage();
  page5Values(doc);
  doc.addPage();
  page6Transforms(doc);
  doc.addPage();
  page7Validation(doc);
  doc.addPage();
  page8SignOff(doc);

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    footer(doc, i, total);
  }

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}
