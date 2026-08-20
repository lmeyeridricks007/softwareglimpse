/**
 * Client-side PDF + Excel exports for CRM ROI analysis.
 * Libraries are dynamically imported so they stay out of the initial tool bundle.
 */

import { formatMoney, type CurrencyCode, type RoiInputs } from "@/domain";
import type { RoiComputeResult } from "./compute";
import { formatPaybackMonths, formatRoiPercent } from "./format";

type RGB = [number, number, number];

const NAVY: RGB = [15, 23, 42];
const PRIMARY: RGB = [37, 99, 235];
const MUTED: RGB = [100, 116, 139];
const BORDER: RGB = [226, 232, 240];
const SURFACE: RGB = [248, 250, 252];
const WHITE: RGB = [255, 255, 255];
const SUCCESS: RGB = [22, 163, 74];
const SUCCESS_BG: RGB = [236, 253, 245];
const WARNING: RGB = [217, 119, 6];
const WARNING_BG: RGB = [255, 251, 235];
const DANGER: RGB = [220, 38, 38];
const DANGER_BG: RGB = [254, 242, 242];
const VIOLET: RGB = [124, 58, 237];
const BLUE_BG: RGB = [239, 246, 255];

function money(
  minor: number | null | undefined,
  currency: CurrencyCode,
): string {
  if (minor == null) return "—";
  return formatMoney(
    { amountMinor: minor, currency },
    { maximumFractionDigits: 0 },
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generatedLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status: RoiComputeResult["status"]): {
  label: string;
  fill: RGB;
  ink: RGB;
} {
  if (status === "complete") {
    return { label: "COMPLETE", fill: SUCCESS_BG, ink: SUCCESS };
  }
  if (status === "provisional") {
    return { label: "PROVISIONAL", fill: WARNING_BG, ink: WARNING };
  }
  if (status === "negative") {
    return { label: "NEGATIVE CASE", fill: DANGER_BG, ink: DANGER };
  }
  return { label: "INCOMPLETE", fill: WARNING_BG, ink: WARNING };
}

function categoryLabel(category: string): string {
  if (category === "productivity") return "Productivity";
  if (category === "cost-avoidance") return "Cost avoidance";
  if (category === "revenue-scenario") return "Revenue scenario";
  return "Other";
}

/** Executive multi-page PDF — SoftwareGlimpse visual language. */
export async function downloadRoiPdf(
  inputs: RoiInputs,
  result: RoiComputeResult,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentW = pageW - margin * 2;
  let y = margin;
  const currency = inputs.currency as CurrencyCode;
  const generated = generatedLabel();
  const scenarioLabel =
    result.scenario.charAt(0).toUpperCase() + result.scenario.slice(1);

  const ensure = (need: number) => {
    if (y + need > pageH - 44) {
      doc.addPage();
      y = margin;
      drawPageChrome();
    }
  };

  const drawPageChrome = () => {
    // Top thin brand bar
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, pageW, 4, "F");
  };

  const footerAll = () => {
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.6);
      doc.line(margin, pageH - 28, pageW - margin, pageH - 28);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...MUTED);
      doc.text(
        "SoftwareGlimpse  ·  CRM ROI Analysis  ·  No invented vendor ROI claims",
        margin,
        pageH - 16,
      );
      doc.text(`Page ${i} of ${total}`, pageW - margin, pageH - 16, {
        align: "right",
      });
    }
  };

  const sectionTitle = (title: string) => {
    ensure(32);
    y += 6;
    doc.setFillColor(...PRIMARY);
    doc.roundedRect(margin, y, 4, 14, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(title, margin + 12, y + 11);
    y += 26;
  };

  const body = (
    text: string,
    opts?: { size?: number; color?: RGB; gap?: number; bold?: boolean },
  ) => {
    const size = opts?.size ?? 9.5;
    const color = opts?.color ?? NAVY;
    const gap = opts?.gap ?? 8;
    doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentW) as string[];
    ensure(lines.length * (size + 3) + gap);
    doc.text(lines, margin, y);
    y += lines.length * (size + 3) + gap;
  };

  const kpiCards = (
    items: Array<{ label: string; value: string; hint?: string }>,
    cols = 4,
  ) => {
    const gap = 10;
    const cardW = (contentW - gap * (cols - 1)) / cols;
    const cardH = 58;
    const rows = Math.ceil(items.length / cols);
    ensure(rows * (cardH + gap) + 4);
    items.forEach((item, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = margin + col * (cardW + gap);
      const cy = y + row * (cardH + gap);
      doc.setFillColor(...SURFACE);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.8);
      doc.roundedRect(cx, cy, cardW, cardH, 7, 7, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(item.label.toUpperCase(), cx + 10, cy + 16);
      doc.setFontSize(13);
      doc.setTextColor(...NAVY);
      const valueLines = doc.splitTextToSize(item.value, cardW - 18) as string[];
      doc.text(valueLines[0] ?? item.value, cx + 10, cy + 36);
      if (item.hint) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...MUTED);
        doc.text(item.hint, cx + 10, cy + 50);
      }
    });
    y += rows * (cardH + gap) + 8;
  };

  const table = (
    headers: string[],
    rows: string[][],
    colWeights: number[],
  ) => {
    const totalWeight = colWeights.reduce((a, b) => a + b, 0);
    const widths = colWeights.map((w) => (contentW * w) / totalWeight);
    const rowH = 18;
    ensure(rowH + 8);
    // Header
    doc.setFillColor(...NAVY);
    doc.rect(margin, y, contentW, rowH, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE);
    let x = margin;
    headers.forEach((h, i) => {
      doc.text(h, x + 5, y + 12);
      x += widths[i]!;
    });
    y += rowH;

    rows.forEach((row, ri) => {
      ensure(rowH);
      if (ri % 2 === 0) {
        doc.setFillColor(...SURFACE);
        doc.rect(margin, y, contentW, rowH, "F");
      }
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.4);
      doc.line(margin, y + rowH, margin + contentW, y + rowH);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...NAVY);
      x = margin;
      row.forEach((cell, i) => {
        const lines = doc.splitTextToSize(cell, widths[i]! - 8) as string[];
        doc.text(lines[0] ?? cell, x + 5, y + 12);
        x += widths[i]!;
      });
      y += rowH;
    });
    y += 10;
  };

  // ─────────────────────────────────────────────
  // PAGE 1 — Cover / executive summary
  // ─────────────────────────────────────────────
  drawPageChrome();

  // Hero band
  doc.setFillColor(...BLUE_BG);
  doc.roundedRect(margin, y, contentW, 92, 10, 10, "F");
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(1.4);
  doc.roundedRect(margin, y, contentW, 92, 10, 10, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("SOFTWAREGLIMPSE  ·  CRM ROI ANALYSIS", margin + 18, y + 22);

  doc.setFontSize(20);
  doc.setTextColor(...NAVY);
  doc.text(inputs.analysisName || "CRM ROI Analysis", margin + 18, y + 46);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(
    `${scenarioLabel} scenario  ·  ${result.horizonYears}-year horizon  ·  ${currency}  ·  Generated ${generated}`,
    margin + 18,
    y + 66,
  );

  const st = statusStyle(result.status);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  const badgeW = doc.getTextWidth(st.label) + 14;
  doc.setFillColor(...st.fill);
  doc.roundedRect(margin + contentW - badgeW - 16, y + 16, badgeW, 14, 3, 3, "F");
  doc.setTextColor(...st.ink);
  doc.text(st.label, margin + contentW - badgeW - 9, y + 26);

  y += 110;

  if (result.statusReason) {
    ensure(42);
    const bg =
      result.status === "negative"
        ? DANGER_BG
        : result.status === "complete"
          ? SUCCESS_BG
          : WARNING_BG;
    doc.setFillColor(...bg);
    doc.roundedRect(margin, y, contentW, 36, 6, 6, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...NAVY);
    const reasonLines = doc.splitTextToSize(
      result.statusReason,
      contentW - 20,
    ) as string[];
    doc.text(reasonLines.slice(0, 2), margin + 10, y + 14);
    y += 48;
  }

  sectionTitle("Executive KPIs");
  kpiCards([
    {
      label: "3-year net value",
      value: money(result.netThreeYearValueMinor, currency),
    },
    {
      label: "3-year ROI",
      value: formatRoiPercent(result.roiPercent),
    },
    {
      label: "Payback",
      value: formatPaybackMonths(
        result.paybackMonths,
        result.paybackApproximate,
      ),
    },
    {
      label: "Benefit confidence",
      value:
        result.assessment.benefitConfidence.charAt(0).toUpperCase() +
        result.assessment.benefitConfidence.slice(1),
    },
  ]);

  kpiCards(
    [
      {
        label: "Year 1 investment",
        value: money(result.year1InvestmentMinor, currency),
        hint: "One-time + Y1 software",
      },
      {
        label: "Annual recurring",
        value: money(result.annualRecurringMinor, currency),
        hint: "From year 2",
      },
      {
        label: "Annual benefit",
        value: money(result.annualBenefitMinor, currency),
        hint: "Measurable value",
      },
      {
        label: `${result.horizonYears}-year TCO`,
        value: money(result.threeYearTcoMinor, currency),
        hint: "Known costs only",
      },
    ],
    4,
  );

  sectionTitle("Interpretation");
  body(result.assessment.interpretation, { size: 10, gap: 6 });
  body(
    `Payback: ${result.assessment.paybackBand}  ·  Revenue dependence: ${result.assessment.revenueDependence}  ·  Cost completeness: ${result.assessment.costCompleteness}`,
    { size: 8.5, color: MUTED, gap: 4 },
  );
  body(
    "Methodology: 3-year ROI = (3-year benefits − 3-year costs) ÷ 3-year costs × 100. Unknown costs are never treated as zero. Scenario benefits stay labeled separately from verified and estimated value.",
    { size: 8, color: MUTED, gap: 10 },
  );

  // ─────────────────────────────────────────────
  // PAGE 2 — Costs
  // ─────────────────────────────────────────────
  doc.addPage();
  y = margin;
  drawPageChrome();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("02  ·  COSTS", margin, y);
  y += 18;
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text("CRM investment & ownership costs", margin, y);
  y += 16;
  body(
    "Licence and ownership figures come from your inputs (or Cost Calculator import). Blank material costs stay unknown — they are not counted as €0.",
    { size: 9, color: MUTED, gap: 12 },
  );

  sectionTitle("Cost summary");
  kpiCards(
    [
      {
        label: "Year 1 investment",
        value: money(result.year1InvestmentMinor, currency),
      },
      {
        label: "Annual recurring",
        value: money(result.annualRecurringMinor, currency),
      },
      {
        label: `${result.horizonYears}-year TCO`,
        value: money(result.threeYearTcoMinor, currency),
      },
    ],
    3,
  );

  const costRows: string[][] = [
    ["Licences (annual)", money(inputs.investment.licencesMinor, currency)],
    ["Add-ons", money(inputs.investment.addOnsMinor, currency)],
    [
      "Implementation partner",
      money(inputs.investment.implementationPartnerMinor, currency),
    ],
    ["Migration", money(inputs.investment.migrationMinor, currency)],
    ["Integrations", money(inputs.investment.integrationsMinor, currency)],
    ["Training", money(inputs.investment.trainingMinor, currency)],
    [
      "Change management",
      money(inputs.investment.changeManagementMinor, currency),
    ],
    ["Customization", money(inputs.investment.customizationMinor, currency)],
    ["Other one-time", money(inputs.investment.otherOneTimeMinor, currency)],
    [
      "CRM administration (annual)",
      money(inputs.investment.crmAdministrationMinor, currency),
    ],
    [
      "Premium support (annual)",
      money(inputs.investment.premiumSupportMinor, currency),
    ],
    [
      "Integration / platform (annual)",
      money(inputs.investment.integrationPlatformMinor, currency),
    ],
    [
      "Ongoing training (annual)",
      money(inputs.investment.ongoingTrainingMinor, currency),
    ],
  ].filter(([, amount]) => amount !== "—");

  if (costRows.length > 0) {
    sectionTitle("Entered cost lines");
    table(["Cost item", "Amount"], costRows, [2.4, 1]);
  }

  if (result.unknowns.length > 0) {
    sectionTitle("Unknown costs (excluded from totals)");
    for (const u of result.unknowns) {
      body(`•  ${u.label}${u.material ? "  —  material" : ""}`, {
        size: 9,
        gap: 3,
      });
    }
    y += 6;
  }

  if (inputs.investment.importedProductName) {
    body(
      `Imported from: ${inputs.investment.importedProductName} (${inputs.investment.source})`,
      { size: 8.5, color: MUTED },
    );
  }

  // ─────────────────────────────────────────────
  // PAGE 3 — Benefits
  // ─────────────────────────────────────────────
  doc.addPage();
  y = margin;
  drawPageChrome();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("03  ·  BENEFITS", margin, y);
  y += 18;
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text("Measurable benefits & quality mix", margin, y);
  y += 16;
  body(
    `Productivity realization factor: ${Math.round(result.realizationFactor * 100)}%. Saved time is not automatically treated as cash.`,
    { size: 9, color: MUTED, gap: 12 },
  );

  sectionTitle("Benefit by category");
  const catRows = result.benefitByCategory
    .filter((c) => c.annualMinor > 0)
    .map((c) => [
      categoryLabel(c.category),
      money(c.annualMinor, currency),
      `${c.sharePercent}%`,
    ]);
  if (catRows.length) {
    table(["Category", "Annual amount", "Share"], catRows, [2, 1.2, 0.8]);
  } else {
    body("No measurable benefits entered for this scenario.", {
      size: 9,
      color: MUTED,
    });
  }

  // Simple share bars
  const maxCat = Math.max(
    ...result.benefitByCategory.map((c) => c.annualMinor),
    1,
  );
  for (const c of result.benefitByCategory.filter((x) => x.annualMinor > 0)) {
    ensure(28);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(
      `${categoryLabel(c.category)}  ·  ${money(c.annualMinor, currency)} (${c.sharePercent}%)`,
      margin,
      y,
    );
    y += 6;
    doc.setFillColor(...BORDER);
    doc.roundedRect(margin, y, contentW, 8, 3, 3, "F");
    const fill =
      c.category === "revenue-scenario"
        ? VIOLET
        : c.category === "productivity"
          ? SUCCESS
          : PRIMARY;
    doc.setFillColor(...fill);
    doc.roundedRect(
      margin,
      y,
      Math.max(4, (c.annualMinor / maxCat) * contentW),
      8,
      3,
      3,
      "F",
    );
    y += 18;
  }

  sectionTitle("Benefit lines");
  const lineRows = result.benefitLines
    .filter((l) => l.included && l.annualMinor > 0)
    .map((l) => [
      l.label,
      l.assumptionType,
      l.confidence,
      money(l.annualMinor, currency),
    ]);
  if (lineRows.length) {
    table(["Benefit", "Type", "Confidence", "Annual"], lineRows, [
      2.2, 0.9, 0.9, 1,
    ]);
  }

  sectionTitle("How well-supported is this ROI?");
  const typeRows = result.benefitByType
    .filter((t) => t.annualMinor > 0)
    .map((t) => [
      t.assumptionType,
      money(t.annualMinor, currency),
      `${t.sharePercent}%`,
    ]);
  if (typeRows.length) {
    table(["Assumption type", "Annual amount", "Share"], typeRows, [
      1.6, 1.2, 0.8,
    ]);
  }
  body(result.assessment.interpretation, { size: 9, color: MUTED });

  // ─────────────────────────────────────────────
  // PAGE 4 — Cash flow
  // ─────────────────────────────────────────────
  doc.addPage();
  y = margin;
  drawPageChrome();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("04  ·  CASH FLOW", margin, y);
  y += 18;
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text("Multi-year cash flow & break-even", margin, y);
  y += 16;

  sectionTitle("Cash flow by year");
  table(
    ["Period", "Costs", "Benefits", "Net", "Cumulative"],
    result.cashFlow.map((r) => [
      r.label,
      money(r.costsMinor, currency),
      money(r.benefitsMinor, currency),
      money(r.netMinor, currency),
      money(r.cumulativeMinor, currency),
    ]),
    [1.4, 1, 1, 1, 1.1],
  );

  if (result.breakEvenMonth != null) {
    ensure(40);
    doc.setFillColor(...SUCCESS_BG);
    doc.roundedRect(margin, y, contentW, 32, 6, 6, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...SUCCESS);
    doc.text(
      `Break-even at approximately month ${result.breakEvenMonth}`,
      margin + 12,
      y + 20,
    );
    y += 44;
  }

  sectionTitle("What needs to be true to break even?");
  if (result.breakEven.hoursSavedPerUserWeek != null) {
    body(
      `About ${result.breakEven.hoursSavedPerUserWeek} hours saved per paid user per week (at current realization), or`,
      { size: 9.5, gap: 4 },
    );
  }
  if (result.breakEven.annualMeasurableBenefitMinor != null) {
    body(
      `Approximately ${money(result.breakEven.annualMeasurableBenefitMinor, currency)} annual measurable benefit.`,
      { size: 9.5, gap: 8 },
    );
  }
  for (const n of result.breakEven.narrative.slice(0, 2)) {
    body(n, { size: 8.5, color: MUTED, gap: 4 });
  }

  // ─────────────────────────────────────────────
  // PAGE 5 — Scenarios + sensitivity
  // ─────────────────────────────────────────────
  doc.addPage();
  y = margin;
  drawPageChrome();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("05  ·  SCENARIOS", margin, y);
  y += 18;
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text("Scenario comparison & sensitivity", margin, y);
  y += 16;
  body(
    "Conservative / Base / Upside use your scenario-specific inputs — not invented multipliers.",
    { size: 9, color: MUTED, gap: 12 },
  );

  sectionTitle("Side-by-side scenarios");
  const cardGap = 10;
  const scenW = (contentW - cardGap * 2) / 3;
  ensure(96);
  result.scenarios.forEach((s, i) => {
    const cx = margin + i * (scenW + cardGap);
    const active = s.key === result.scenario;
    doc.setFillColor(...(active ? BLUE_BG : SURFACE));
    doc.setDrawColor(...(active ? PRIMARY : BORDER));
    doc.setLineWidth(active ? 1.4 : 0.8);
    doc.roundedRect(cx, y, scenW, 88, 8, 8, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(s.label.toUpperCase(), cx + 12, y + 18);
    doc.setFontSize(18);
    doc.setTextColor(...NAVY);
    doc.text(formatRoiPercent(s.roiPercent), cx + 12, y + 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      `${formatPaybackMonths(s.paybackMonths)} payback`,
      cx + 12,
      y + 60,
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...NAVY);
    doc.text(`${money(s.netThreeYearValueMinor, currency)} net`, cx + 12, y + 76);
  });
  y += 104;

  sectionTitle("What drives the result?");
  if (result.sensitivity.length === 0) {
    body("Add more assumptions to unlock sensitivity drivers.", {
      size: 9,
      color: MUTED,
    });
  } else {
    table(
      ["Driver", "Description", "Δ ROI"],
      result.sensitivity.slice(0, 5).map((p) => [
        p.label,
        p.description,
        p.deltaRoiPp != null ? `${Math.round(p.deltaRoiPp)} pp` : "—",
      ]),
      [1.2, 2.6, 0.7],
    );
    if (result.sensitivity[0]) {
      body(
        `ROI is most sensitive to ${result.sensitivity[0].label.toLowerCase()}.`,
        { size: 9, color: MUTED },
      );
    }
  }

  // ─────────────────────────────────────────────
  // PAGE 6 — Assumptions + next steps
  // ─────────────────────────────────────────────
  doc.addPage();
  y = margin;
  drawPageChrome();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("06  ·  ASSUMPTIONS", margin, y);
  y += 18;
  doc.setFontSize(18);
  doc.setTextColor(...NAVY);
  doc.text("Assumption register & next steps", margin, y);
  y += 16;
  body(
    "Every material assumption is labeled verified, estimated, scenario, or unknown — with confidence. This is not a fake probability score.",
    { size: 9, color: MUTED, gap: 12 },
  );

  sectionTitle("Assumption register");
  table(
    ["Assumption", "Value", "Type", "Confidence", "In ROI?"],
    result.assumptions.map((a) => [
      a.label,
      a.valueLabel,
      a.assumptionType,
      a.confidence,
      a.included ? "Yes" : "No",
    ]),
    [1.8, 1.5, 0.9, 0.9, 0.7],
  );

  if (result.overlapWarnings.length > 0) {
    sectionTitle("Warnings");
    for (const w of result.overlapWarnings) {
      body(`•  ${w}`, { size: 9, gap: 4 });
    }
    y += 6;
  }

  sectionTitle("Business case assessment");
  kpiCards(
    [
      { label: "Payback", value: result.assessment.paybackBand },
      {
        label: "Benefit confidence",
        value: result.assessment.benefitConfidence,
      },
      {
        label: "Revenue dependence",
        value: result.assessment.revenueDependence,
      },
      {
        label: "Cost completeness",
        value: result.assessment.costCompleteness,
      },
    ],
    4,
  );
  body(result.assessment.interpretation, { size: 9.5, gap: 12 });

  sectionTitle("Recommended next steps");
  const nextSteps = [
    "Review assumptions with finance and RevOps — especially realization factor and any scenario benefits.",
    "Transfer confirmed figures into the CRM Business Case template.",
    "Compare CRM costs / TCO if investment inputs are still incomplete.",
    "Do not treat scenario revenue uplifts as guaranteed outcomes.",
  ];
  for (const step of nextSteps) {
    body(`•  ${step}`, { size: 9.5, gap: 5 });
  }

  y += 10;
  ensure(50);
  doc.setFillColor(...BLUE_BG);
  doc.roundedRect(margin, y, contentW, 44, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...PRIMARY);
  doc.text("SoftwareGlimpse", margin + 14, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Independent CRM research tools. Affiliate status never invents ROI claims or benefit benchmarks.",
    margin + 14,
    y + 34,
  );

  footerAll();

  const slug = (inputs.analysisName || "crm-roi")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  doc.save(`crm-roi-${slug || "analysis"}.pdf`);
}

/** Formula-oriented workbook (inputs + calculated sheets). */
export async function downloadRoiExcel(
  inputs: RoiInputs,
  result: RoiComputeResult,
): Promise<void> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const readme = [
    ["SoftwareGlimpse CRM ROI Calculator"],
    [
      "This workbook mirrors your on-device model. Calculated cells are values exported from the engine.",
    ],
    ["Assumption types: verified | estimated | scenario | unknown"],
    ["Do not treat scenario benefits as guaranteed outcomes."],
    ["Currency", inputs.currency],
    ["Horizon years", inputs.horizonYears],
    ["Active scenario", inputs.activeScenario],
    ["Status", result.status],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(readme),
    "00_READ_ME",
  );

  const inputsSheet = [
    ["Field", "Value"],
    ["Analysis name", inputs.analysisName],
    ["CRM users", inputs.currentState.crmUsers],
    ["Sales reps", inputs.currentState.salesReps],
    ["Managers", inputs.currentState.managers],
    ["Ops/admin", inputs.currentState.opsAdminUsers],
    ["Working weeks", inputs.currentState.workingWeeksPerYear],
    ["Realization factor", inputs.productivity.realizationFactor],
    ["Allow provisional", inputs.allowProvisional ? "yes" : "no"],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(inputsSheet),
    "01_INPUTS",
  );

  const current = [
    ["Role", "Users", "Loaded hourly (minor)", "Current hrs/week"],
    [
      "Sales reps",
      inputs.currentState.salesReps,
      inputs.currentState.hourlyCosts.salesRepMinor ?? "",
      Object.values(inputs.currentState.processHours.salesRep).reduce(
        (a, b) => a + b,
        0,
      ),
    ],
    [
      "Managers",
      inputs.currentState.managers,
      inputs.currentState.hourlyCosts.managerMinor ?? "",
      Object.values(inputs.currentState.processHours.manager).reduce(
        (a, b) => a + b,
        0,
      ),
    ],
    [
      "Ops/admin",
      inputs.currentState.opsAdminUsers,
      inputs.currentState.hourlyCosts.opsAdminMinor ?? "",
      Object.values(inputs.currentState.processHours.opsAdmin).reduce(
        (a, b) => a + b,
        0,
      ),
    ],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(current),
    "02_CURRENT_STATE",
  );

  const costs = [
    ["Cost item", "Amount minor", "Notes"],
    ["Licences", inputs.investment.licencesMinor ?? "UNKNOWN", ""],
    ["Add-ons", inputs.investment.addOnsMinor ?? "", ""],
    [
      "Implementation",
      inputs.investment.implementationPartnerMinor ?? "UNKNOWN",
      "",
    ],
    ["Migration", inputs.investment.migrationMinor ?? "", ""],
    ["Integrations", inputs.investment.integrationsMinor ?? "", ""],
    ["Training", inputs.investment.trainingMinor ?? "", ""],
    ["CRM admin (annual)", inputs.investment.crmAdministrationMinor ?? "", ""],
    ["Premium support", inputs.investment.premiumSupportMinor ?? "", ""],
    ["Year 1 investment (calc)", result.year1InvestmentMinor ?? "UNKNOWN", ""],
    ["Annual recurring (calc)", result.annualRecurringMinor ?? "UNKNOWN", ""],
    ["3-year TCO (calc)", result.threeYearTcoMinor ?? "UNKNOWN", ""],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(costs),
    "03_CRM_COSTS",
  );

  const prod = [
    ["Metric", "Value"],
    [
      "Gross productivity (pre-realization)",
      result.productivityGrossAnnualMinor,
    ],
    ["Realized productivity", result.productivityRealizedAnnualMinor],
    ["Realization factor", result.realizationFactor],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(prod),
    "04_PRODUCTIVITY",
  );

  const avoidance = [
    ["Label", "Annual minor", "Type", "Confidence", "Included"],
    ...result.benefitLines
      .filter((l) => l.category === "cost-avoidance")
      .map((l) => [
        l.label,
        l.annualMinor,
        l.assumptionType,
        l.confidence,
        l.included ? "yes" : "no",
      ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(avoidance),
    "05_COST_AVOIDANCE",
  );

  const revenue = [
    ["Label", "Annual minor", "Value basis", "Type", "Confidence"],
    ...result.benefitLines
      .filter((l) => l.category === "revenue-scenario")
      .map((l) => [
        l.label,
        l.annualMinor,
        l.valueBasis ?? "",
        l.assumptionType,
        l.confidence,
      ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(revenue),
    "06_REVENUE_SCENARIOS",
  );

  const assumptions = [
    ["Assumption", "Value", "Type", "Confidence", "Included"],
    ...result.assumptions.map((a) => [
      a.label,
      a.valueLabel,
      a.assumptionType,
      a.confidence,
      a.included ? "yes" : "no",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(assumptions),
    "07_ASSUMPTIONS",
  );

  const cash = [
    ["Year", "Costs", "Benefits", "Net", "Cumulative"],
    ...result.cashFlow.map((r) => [
      r.label,
      r.costsMinor,
      r.benefitsMinor,
      r.netMinor,
      r.cumulativeMinor,
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(cash),
    "08_CASH_FLOW",
  );

  const results = [
    ["Metric", "Value"],
    ["Annual benefit", result.annualBenefitMinor],
    ["Net annual benefit", result.netAnnualBenefitMinor ?? ""],
    ["3-year benefit", result.threeYearBenefitMinor],
    ["Net 3-year value", result.netThreeYearValueMinor ?? ""],
    ["ROI %", result.roiPercent ?? ""],
    ["Payback months", result.paybackMonths ?? ""],
    ["Status", result.status],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(results),
    "09_RESULTS",
  );

  const sens = [
    ["Driver", "Description", "Base ROI", "Alt ROI", "Delta pp"],
    ...result.sensitivity.map((s) => [
      s.label,
      s.description,
      s.baseRoiPercent ?? "",
      s.altRoiPercent ?? "",
      s.deltaRoiPp ?? "",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(sens),
    "10_SENSITIVITY",
  );

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `crm-roi-${inputs.analysisName.replace(/[^\w]+/g, "-").toLowerCase()}.xlsx`,
  );
}
