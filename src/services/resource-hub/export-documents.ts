/**
 * Static visual PDF + Excel exports for CRM resource hubs.
 * Used by scripts/generate-resource-downloads.ts to write public/resources/*.{pdf,xlsx}.
 */

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Resource, ResourceHubProfile } from "@/domain";
import { getAllResourcesUnfiltered } from "@/data";
import { getResourceHubProfile } from "@/data/resource-hub";
import { buildCrmBusinessCasePdfBuffer } from "@/services/resource-hub/exports/crm-business-case-pdf";
import { buildCrmBusinessCaseXlsxBuffer } from "@/services/resource-hub/exports/crm-business-case-xlsx";
import { buildCrmDecisionMatrixPdfBuffer } from "@/services/resource-hub/exports/crm-decision-matrix-pdf";
import { buildCrmDecisionMatrixXlsxBuffer } from "@/services/resource-hub/exports/crm-decision-matrix-xlsx";
import { buildCrmFieldMappingPdfBuffer } from "@/services/resource-hub/exports/crm-field-mapping-pdf";
import { buildCrmFieldMappingXlsxBuffer } from "@/services/resource-hub/exports/crm-field-mapping-xlsx";
import { buildCrmVendorScorecardPdfBuffer } from "@/services/resource-hub/exports/crm-vendor-scorecard-pdf";
import { buildCrmVendorScorecardXlsxBuffer } from "@/services/resource-hub/exports/crm-vendor-scorecard-xlsx";
import { buildCrmRfpPdfBuffer } from "@/services/resource-hub/exports/crm-rfp-pdf";
import { buildCrmRfpXlsxBuffer } from "@/services/resource-hub/exports/crm-rfp-xlsx";

const BUSINESS_CASE_SLUG = "crm-business-case-template";
const DECISION_MATRIX_SLUG = "crm-comparison-worksheet";
const FIELD_MAPPING_SLUG = "crm-field-mapping-template";
const VENDOR_SCORECARD_SLUG = "crm-vendor-scorecard";
const RFP_SLUG = "crm-rfp-template";

type Depth = NonNullable<ReturnType<typeof getResourceHubProfile>>;

function generatedDateLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function kindLabel(kind: Resource["kind"]): string {
  switch (kind) {
    case "checklist":
      return "Checklist";
    case "template":
      return "Template";
    case "scorecard":
      return "Scorecard";
    case "worksheet":
      return "Worksheet";
    case "planner":
      return "Training plan";
    default:
      return "Resource";
  }
}

const SECTION_RGB: Record<string, [number, number, number]> = {
  green: [16, 185, 129],
  teal: [20, 184, 166],
  blue: [37, 99, 235],
  indigo: [99, 102, 241],
  purple: [147, 51, 234],
  cyan: [6, 182, 212],
  slate: [71, 85, 105],
  amber: [217, 119, 6],
  rose: [225, 29, 72],
  navy: [15, 23, 42],
};

export async function buildResourcePdfBuffer(
  resource: Resource,
  profile: Depth,
): Promise<Buffer> {
  if (resource.slug === BUSINESS_CASE_SLUG) {
    return buildCrmBusinessCasePdfBuffer();
  }
  if (resource.slug === DECISION_MATRIX_SLUG) {
    return buildCrmDecisionMatrixPdfBuffer();
  }
  if (resource.slug === FIELD_MAPPING_SLUG) {
    return buildCrmFieldMappingPdfBuffer();
  }
  if (resource.slug === VENDOR_SCORECARD_SLUG) {
    return buildCrmVendorScorecardPdfBuffer();
  }
  if (resource.slug === RFP_SLUG) {
    return buildCrmRfpPdfBuffer();
  }

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const navy: [number, number, number] = [15, 23, 42];
  const muted: [number, number, number] = [100, 116, 139];
  const primary: [number, number, number] = [37, 99, 235];
  const surface: [number, number, number] = [248, 250, 252];
  const border: [number, number, number] = [226, 232, 240];
  const mint: [number, number, number] = [236, 253, 245];
  const amber: [number, number, number] = [255, 251, 235];

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
    }
  };

  const drawFooter = () => {
    const page = doc.getNumberOfPages();
    const total = doc.getNumberOfPages();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("softwareglimpse.com/resources", margin, pageHeight - 18);
    doc.text(`Page ${page} of ${total}`, pageWidth - margin, pageHeight - 18, {
      align: "right",
    });
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

  const displayTitle = profile.displayTitle ?? resource.name;
  const tagline =
    profile.tagline ??
    resource.shortDescription ??
    `${kindLabel(resource.kind)} for CRM buyers and implementers.`;
  const generated = generatedDateLabel();

  // Brand + title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primary);
  doc.text("SoftwareGlimpse", margin, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(`Updated: ${generated}`, pageWidth - margin, y + 10, {
    align: "right",
  });
  y += 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...navy);
  const titleLines = doc.splitTextToSize(displayTitle, maxWidth * 0.62) as string[];
  doc.text(titleLines, margin, y);
  const titleBottom = y + titleLines.length * 22;

  // Meta box
  const vendorMode = isVendorComparisonResource(resource);
  const boxX = margin + maxWidth * 0.64;
  const boxW = maxWidth * 0.36;
  doc.setDrawColor(...border);
  doc.setFillColor(...surface);
  doc.roundedRect(boxX, y - 12, boxW, 70, 4, 4, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  const fields = vendorMode
    ? [
        "Vendor being evaluated: _______________",
        "Evaluator / Team: _______________",
        "Date of evaluation: _______________",
      ]
    : [
        "Project / CRM: _______________",
        "Owner / Team: _______________",
        "Date: _______________",
      ];
  fields.forEach((f, i) => {
    doc.text(f, boxX + 8, y + 6 + i * 16);
  });
  y = Math.max(titleBottom, y + 66) + 8;

  writeWrapped(tagline, { fontSize: 10, color: muted, gapAfter: 12 });

  // How to use — wrapped grid (avoids horizontal label collisions)
  if (profile.workflowSteps?.length) {
    const steps = profile.workflowSteps.slice(0, 6);
    const cols = steps.length <= 3 ? steps.length : 3;
    const rows = Math.ceil(steps.length / cols);
    const cellW = maxWidth / cols;
    const cellH = 36;
    ensureSpace(18 + rows * cellH);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primary);
    doc.text(
      vendorMode ? "HOW TO USE THIS CHECKLIST" : "HOW TO USE THIS RESOURCE",
      margin,
      y,
    );
    y += 14;
    steps.forEach((step, i) => {
      const colIdx = i % cols;
      const rowIdx = Math.floor(i / cols);
      const sx = margin + colIdx * cellW;
      const sy = y + rowIdx * cellH;
      doc.setFillColor(...primary);
      doc.circle(sx + 8, sy + 8, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(String(i + 1), sx + 8, sy + 11, { align: "center" });
      doc.setTextColor(...navy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const labelLines = doc.splitTextToSize(step.label, cellW - 28) as string[];
      doc.text(labelLines.slice(0, 2), sx + 20, sy + 7);
    });
    y += rows * cellH + 6;
  }

  // Key (ASCII only — Helvetica cannot render many Unicode glyphs)
  ensureSpace(36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...navy);
  doc.text(
    "Key:  [ ] Pass   [ ] Partial   [ ] Fail   [ ] Not tested   |   * = Must-have",
    margin,
    y,
  );
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...muted);
  doc.text(
    "Evidence: screenshots, recordings, official docs, written confirmation, or test results.",
    margin,
    y + 12,
  );
  y += 28;

  // Table columns — widths sum to maxWidth; positions derived (no overlap).
  const colGap = 6;
  const colW = {
    num: 24,
    item: 152,
    why: 138,
    req: 26,
    evidence: 82,
    result: 0, // filled below
  };
  colW.result =
    maxWidth -
    (colW.num + colW.item + colW.why + colW.req + colW.evidence + colGap * 5);
  const col = {
    num: margin,
    numW: colW.num,
    item: margin + colW.num + colGap,
    itemW: colW.item,
    why: margin + colW.num + colGap + colW.item + colGap,
    whyW: colW.why,
    req: margin + colW.num + colGap + colW.item + colGap + colW.why + colGap,
    reqW: colW.req,
    evidence:
      margin +
      colW.num +
      colGap +
      colW.item +
      colGap +
      colW.why +
      colGap +
      colW.req +
      colGap,
    evidenceW: colW.evidence,
    result:
      margin +
      colW.num +
      colGap +
      colW.item +
      colGap +
      colW.why +
      colGap +
      colW.req +
      colGap +
      colW.evidence +
      colGap,
    resultW: colW.result,
  };

  /** Wrap using the same font that will render the text (avoids bold overflow). */
  const wrapForDraw = (
    text: string,
    width: number,
    style: "normal" | "bold",
    fontSize: number,
  ): string[] => {
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    return doc.splitTextToSize(text, Math.max(12, width)) as string[];
  };

  const drawTableHeader = () => {
    ensureSpace(24);
    doc.setFillColor(...navy);
    doc.rect(margin, y, maxWidth, 18, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text("#", col.num + 4, y + 12);
    doc.text("CHECK ITEM", col.item, y + 12);
    doc.text("WHY IT MATTERS", col.why, y + 12);
    doc.text("REQ", col.req, y + 12);
    doc.text("EVIDENCE", col.evidence, y + 12);
    doc.text("RESULT", col.result, y + 12);
    y += 20;
  };

  /** Prefer 1.1-style ids; never dump long slug ids into the narrow # column. */
  const displayRowNumber = (
    itemId: string,
    sectionIndex: number,
    itemIndex: number,
  ): string => {
    if (/^\d+(\.\d+)?$/.test(itemId.trim())) return itemId.trim();
    return `${sectionIndex + 1}.${itemIndex + 1}`;
  };

  const drawResultOptions = (rx: number, ry: number) => {
    const opts = [
      { label: "Pass", x: 0, dy: 0 },
      { label: "Partial", x: 42, dy: 0 },
      { label: "Fail", x: 0, dy: 11 },
      { label: "N/T", x: 42, dy: 11 },
    ];
    doc.setDrawColor(...muted);
    doc.setLineWidth(0.6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(...muted);
    for (const opt of opts) {
      const cx = rx + opt.x;
      const cy = ry + opt.dy;
      doc.circle(cx + 3, cy + 2, 2.5, "S");
      doc.text(opt.label, cx + 8, cy + 4);
    }
  };

  drawTableHeader();

  (profile.artifactSections ?? []).forEach((section, sectionIndex) => {
    ensureSpace(28);
    const accent =
      SECTION_RGB[section.accent ?? ""] ??
      ([37, 99, 235] as [number, number, number]);
    doc.setFillColor(...accent);
    doc.rect(margin, y, maxWidth, 16, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    const sectionTitle = wrapForDraw(
      section.title.toUpperCase(),
      maxWidth - 12,
      "bold",
      8,
    );
    doc.text(sectionTitle[0] ?? section.title, margin + 6, y + 11);
    y += 18;

    section.items.forEach((item, itemIndex) => {
      const why = item.whyItMatters ?? item.detail ?? "";
      const itemLines = wrapForDraw(item.label, col.itemW - 2, "bold", 7).slice(
        0,
        5,
      );
      const whyLines = wrapForDraw(why, col.whyW - 2, "normal", 7).slice(0, 5);
      const rowH = Math.max(
        30,
        Math.max(itemLines.length, whyLines.length) * 9 + 12,
      );
      if (y + rowH > pageHeight - margin - 40) {
        doc.addPage();
        y = margin;
        drawTableHeader();
      }

      doc.setDrawColor(...border);
      doc.setFillColor(
        itemIndex % 2 === 0 ? 255 : 248,
        itemIndex % 2 === 0 ? 255 : 250,
        itemIndex % 2 === 0 ? 255 : 252,
      );
      doc.rect(margin, y, maxWidth, rowH, "FD");

      // Light column rules so cells stay visually separated
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      for (const x of [col.item - colGap / 2, col.why - colGap / 2, col.req - colGap / 2, col.evidence - colGap / 2, col.result - colGap / 2]) {
        doc.line(x, y, x, y + rowH);
      }

      const rowNum = displayRowNumber(item.id, sectionIndex, itemIndex);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...muted);
      doc.text(rowNum, col.num + 3, y + 12);

      doc.setTextColor(...navy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.text(itemLines, col.item, y + 12);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(...muted);
      doc.text(whyLines, col.why, y + 12);

      doc.setTextColor(...navy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(
        item.required === true ? "*" : item.required === false ? "-" : ".",
        col.req + 8,
        y + 13,
      );

      doc.setDrawColor(...border);
      doc.setLineWidth(0.8);
      doc.rect(col.evidence, y + 5, col.evidenceW, rowH - 10, "S");

      drawResultOptions(col.result, y + 8);
      y += rowH;
    });
  });

  // Guidance boxes
  ensureSpace(90);
  y += 10;
  const guidanceBoxW = (maxWidth - 16) / 3;
  const boxes: Array<{
    title: string;
    body: string;
    fill: [number, number, number];
  }> = vendorMode
    ? [
        {
          title: "Scoring guidance",
          body: "Pass = fully meets. Partial = works with limits. Fail = does not meet. Not tested = no proof yet.",
          fill: amber,
        },
        {
          title: "Evidence matters",
          body: "Only mark a result when proof exists. Otherwise use Not tested — sales slides alone do not count.",
          fill: [239, 246, 255],
        },
        {
          title: "One script. Every vendor.",
          body: "Use the same scenarios and test steps for every product so comparisons stay fair.",
          fill: mint,
        },
      ]
    : [
        {
          title: "Completion guidance",
          body: "Pass = done with evidence. Partial = in progress. Fail = blocked. Not tested = deferred on purpose.",
          fill: amber,
        },
        {
          title: "Evidence matters",
          body: "Note owners, dates, and proof in Evidence / Notes so handoffs stay clear.",
          fill: [239, 246, 255],
        },
        {
          title: "Work top to bottom",
          body: "Finish must-have (*) rows before nice-to-haves. Do not invent a Pass without proof.",
          fill: mint,
        },
      ];
  boxes.forEach((b, i) => {
    const bx = margin + i * (guidanceBoxW + 8);
    doc.setFillColor(...b.fill);
    doc.roundedRect(bx, y, guidanceBoxW, 70, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...navy);
    doc.text(b.title, bx + 8, y + 14);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    const lines = doc.splitTextToSize(b.body, guidanceBoxW - 16) as string[];
    doc.text(lines, bx + 8, y + 28);
  });

  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter();
  }

  const arrayBuffer = doc.output("arraybuffer") as ArrayBuffer;
  return Buffer.from(arrayBuffer);
}

function isVendorComparisonResource(resource: Resource): boolean {
  const stage = resource.buyingStage;
  if (stage === "EVALUATE" || stage === "VALIDATE" || stage === "DECIDE") {
    return (
      resource.kind === "checklist" ||
      resource.kind === "scorecard" ||
      resource.kind === "worksheet" ||
      resource.resourceType === "RFP_TEMPLATE" ||
      resource.resourceType === "MATRIX" ||
      resource.resourceType === "SCORECARD" ||
      resource.resourceType === "CHECKLIST"
    );
  }
  return (
    resource.slug.includes("evaluation") ||
    resource.slug.includes("scorecard") ||
    resource.slug.includes("demo") ||
    resource.slug.includes("rfp") ||
    resource.slug.includes("comparison")
  );
}

export async function buildResourceXlsxBuffer(
  resource: Resource,
  profile: Depth,
): Promise<Buffer> {
  if (resource.slug === BUSINESS_CASE_SLUG) {
    return buildCrmBusinessCaseXlsxBuffer();
  }
  if (resource.slug === DECISION_MATRIX_SLUG) {
    return buildCrmDecisionMatrixXlsxBuffer();
  }
  if (resource.slug === FIELD_MAPPING_SLUG) {
    return buildCrmFieldMappingXlsxBuffer();
  }
  if (resource.slug === VENDOR_SCORECARD_SLUG) {
    return buildCrmVendorScorecardXlsxBuffer();
  }
  if (resource.slug === RFP_SLUG) {
    return buildCrmRfpXlsxBuffer();
  }

  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const generated = generatedDateLabel();
  const vendorMode = isVendorComparisonResource(resource);

  const howTo = vendorMode
    ? [
        "1. Run the same scenarios for every CRM (where this artifact compares vendors).",
        "2. Capture evidence (screenshots, docs, written answers).",
        "3. Mark Result as Pass, Partial, Fail, or Not tested.",
        "4. Transfer outcomes to the Vendor Scorecard when scoring is separate.",
      ]
    : [
        "1. Work top to bottom through each section.",
        "2. Fill Required / Test columns with your owners and dates.",
        "3. Mark Result when the row is done (or Not tested if deferred).",
        "4. Capture evidence or notes so handoffs stay clear.",
      ];

  const metaFields = vendorMode
    ? [
        ["Vendor being evaluated", ""],
        ["Evaluator / Team", ""],
        ["Date of evaluation", ""],
      ]
    : [
        ["Project / CRM instance", ""],
        ["Owner / Team", ""],
        ["Date", ""],
      ];

  const instructions: string[][] = [
    ["SoftwareGlimpse", profile.displayTitle ?? resource.name],
    ["Updated", generated],
    ["Job to be done", resource.jobToBeDone ?? ""],
    ["Buying stage", resource.buyingStage ?? resource.stage],
    ["Resource type", resource.resourceType ?? resource.kind],
    [],
    ["How to use"],
    howTo,
    [],
    ["Result key"],
    ["Pass", "Fully meets / complete with evidence"],
    ["Partial", "Meets with limits or incomplete"],
    ["Fail", "Does not meet a required check"],
    ["Not tested", "No evidence yet — do not invent a Pass"],
    [],
    ...metaFields,
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(instructions),
    "Instructions",
  );

  const baseHeader = [
    "#",
    "Section",
    "Check item",
    "Why it matters",
    "Required?",
    "Test / Scenario",
    "Evidence captured",
    "Result",
    "Notes / Follow-up",
  ];
  const vendorHeader = [
    "Vendor A Result",
    "Vendor A Notes",
    "Vendor B Result",
    "Vendor B Notes",
    "Vendor C Result",
    "Vendor C Notes",
  ];
  const checklistRows: (string | number)[][] = [
    vendorMode ? [...baseHeader, ...vendorHeader] : [...baseHeader, "Owner", "Due"],
  ];

  for (const section of profile.artifactSections ?? []) {
    for (const item of section.items) {
      const base = [
        item.id,
        section.title,
        item.label,
        item.whyItMatters ?? item.detail ?? "",
        item.required === true
          ? "Must-have"
          : item.required === false
            ? "Nice-to-have"
            : "",
        item.testScenario ?? item.doneWhen ?? "",
        "",
        "Not tested",
        "",
      ];
      checklistRows.push(
        vendorMode
          ? [...base, "", "", "", "", "", ""]
          : [...base, item.owner ?? "", ""],
      );
    }
  }

  const checklistSheet = XLSX.utils.aoa_to_sheet(checklistRows);
  checklistSheet["!cols"] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 40 },
    { wch: 36 },
    { wch: 12 },
    { wch: 44 },
    { wch: 28 },
    { wch: 12 },
    { wch: 24 },
    ...(vendorMode
      ? [
          { wch: 14 },
          { wch: 22 },
          { wch: 14 },
          { wch: 22 },
          { wch: 14 },
          { wch: 22 },
        ]
      : [{ wch: 18 }, { wch: 12 }]),
  ];
  XLSX.utils.book_append_sheet(wb, checklistSheet, "Checklist");

  const summaryRows: (string | number)[][] = [
    ["Metric", "Value"],
    ["Total rows", checklistRows.length - 1],
    [
      "Must-have rows",
      checklistRows.filter((r) => r[4] === "Must-have").length,
    ],
    ["Pass", ""],
    ["Partial", ""],
    ["Fail", ""],
    ["Not tested", ""],
    ["Must-have fails (gate)", ""],
    [
      vendorMode
        ? "Ready to score on Vendor Scorecard?"
        : "Ready for next workflow step?",
      "",
    ],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(summaryRows),
    "Scoring Summary",
  );

  if (vendorMode) {
    const compareRows: (string | number)[][] = [
      [
        "#",
        "Check item",
        "Required?",
        "Vendor A",
        "Vendor B",
        "Vendor C",
        "Winner / note",
      ],
    ];
    for (const section of profile.artifactSections ?? []) {
      for (const item of section.items) {
        compareRows.push([
          item.id,
          item.label,
          item.required === true ? "Must-have" : "Nice-to-have",
          "",
          "",
          "",
          "",
        ]);
      }
    }
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet(compareRows),
      "Vendor Comparison",
    );

    const memoRows = [
      ["Decision memo (optional transfer)"],
      ["Recommended vendor", ""],
      ["Why (evidence-based)", ""],
      ["Residual risks", ""],
      ["Must-have fails / edition gates", ""],
      ["Next 30-day actions", ""],
      ["Link to Vendor Scorecard", ""],
    ];
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet(memoRows),
      "Decision Memo",
    );
  }

  const out = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return Buffer.from(out);
}

export async function generateAllResourceDownloads(
  outDir: string,
): Promise<{ slug: string; pdf: string; xlsx: string }[]> {
  const results: { slug: string; pdf: string; xlsx: string }[] = [];
  for (const resource of getAllResourcesUnfiltered()) {
    const profile = getResourceHubProfile(resource.slug);
    if (!profile) {
      throw new Error(`Missing depth profile for ${resource.slug}`);
    }
    const pdfPath = join(outDir, `${resource.slug}.pdf`);
    const xlsxPath = join(outDir, `${resource.slug}.xlsx`);
    const pdf = await buildResourcePdfBuffer(resource, profile);
    const xlsx = await buildResourceXlsxBuffer(resource, profile);
    writeFileSync(pdfPath, pdf);
    writeFileSync(xlsxPath, xlsx);
    results.push({
      slug: resource.slug,
      pdf: pdfPath,
      xlsx: xlsxPath,
    });
  }
  return results;
}

/** Canonical download set for a resource page (Excel + visual PDF first). */
export function buildResourceDownloadFiles(
  slug: string,
  existing: ResourceHubProfile["downloadFiles"] = [],
): ResourceHubProfile["downloadFiles"] {
  const isBusinessCase = slug === BUSINESS_CASE_SLUG;
  const isDecisionMatrix = slug === DECISION_MATRIX_SLUG;
  const isFieldMapping = slug === FIELD_MAPPING_SLUG;
  const isVendorScorecard = slug === VENDOR_SCORECARD_SLUG;
  const isRfp = slug === RFP_SLUG;
  const core: ResourceHubProfile["downloadFiles"] = isBusinessCase
    ? [
        {
          href: `/resources/${slug}.pdf`,
          label: "Download Business Case PDF",
          format: "pdf",
        },
        {
          href: `/resources/${slug}.xlsx`,
          label: "Build the Financial Model in Excel",
          format: "xlsx",
        },
      ]
    : isDecisionMatrix
      ? [
          {
            href: `/resources/${slug}.xlsx`,
            label: "Download Decision Matrix Excel",
            format: "xlsx",
          },
          {
            href: `/resources/${slug}.pdf`,
            label: "Download Decision Summary PDF",
            format: "pdf",
          },
        ]
      : isFieldMapping
        ? [
            {
              href: `/resources/${slug}.xlsx`,
              label: "Download Excel Template",
              format: "xlsx",
            },
            {
              href: `/resources/${slug}.pdf`,
              label: "View PDF Guide",
              format: "pdf",
            },
          ]
        : isVendorScorecard
          ? [
              {
                href: `/resources/${slug}.xlsx`,
                label: "Download Scorecard Excel",
                format: "xlsx",
              },
              {
                href: `/resources/${slug}.pdf`,
                label: "Download Scorecard PDF",
                format: "pdf",
              },
            ]
          : isRfp
            ? [
                {
                  href: `/resources/${slug}.xlsx`,
                  label: "Download RFP Excel",
                  format: "xlsx",
                },
                {
                  href: `/resources/${slug}.pdf`,
                  label: "Download RFP PDF",
                  format: "pdf",
                },
              ]
        : [
            {
              href: `/resources/${slug}.xlsx`,
              label: "Download Excel",
              format: "xlsx",
            },
            {
              href: `/resources/${slug}.pdf`,
              label: "Download PDF",
              format: "pdf",
            },
          ];
  const seen = new Set(core.map((c) => c.href));
  for (const e of existing) {
    if (e.format !== "md" && e.format !== "csv") continue;
    if (seen.has(e.href)) continue;
    core.push({
      href: e.href,
      label: e.label,
      format: e.format,
    });
    seen.add(e.href);
  }
  return core;
}
