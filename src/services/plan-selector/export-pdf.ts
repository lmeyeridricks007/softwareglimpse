/**
 * CRM Plan Selector recommendation PDF — client-side jsPDF (dynamic import).
 */

import { requirementLabel } from "@/data/config/plan-selector/requirements";
import type { CrmPlanSelectorAnswers } from "@/domain";
import { formatMoney } from "@/domain";
import type { PlanSelectorAnalysis } from "./analyze";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPlanSelectorPdf(
  analysis: PlanSelectorAnalysis,
  answers: CrmPlanSelectorAnswers,
  options: { filename?: string } = {},
): Promise<void> {
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
  const success: [number, number, number] = [22, 163, 74];
  const danger: [number, number, number] = [220, 38, 38];
  const softBlue: [number, number, number] = [239, 246, 255];
  const softGreen: [number, number, number] = [240, 253, 244];

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const h2 = (text: string) => {
    ensure(36);
    y += 10;
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
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...bodyColor);
    const lines = doc.splitTextToSize(value, maxW - 170) as string[];
    doc.text(lines, margin + 170, y);
    y += Math.max(14, lines.length * 12);
  };

  const bullet = (text: string, color: [number, number, number] = bodyColor) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(`•  ${text}`, maxW) as string[];
    ensure(lines.length * 13 + 2);
    doc.text(lines, margin, y);
    y += lines.length * 13 + 2;
  };

  // ── Cover band ──────────────────────────────────────────────
  doc.setFillColor(...softBlue);
  doc.rect(0, 0, pageW, 132, "F");
  y = 52;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primary);
  doc.text("SOFTWAREGLIMPSE  ·  CRM PLAN SELECTOR", margin, y);
  y += 26;
  doc.setFontSize(22);
  doc.setTextColor(...navy);
  doc.text("Your CRM plan recommendation", margin, y);
  y += 24;
  doc.setFontSize(16);
  doc.text(analysis.productName, margin, y);
  y = 152;

  mutedLine(
    "Lowest qualifying plan based on your must-haves and published vendor plan data. SoftwareGlimpse does not invent prices, features, or match percentages.",
  );

  // ── Recommended plan card ───────────────────────────────────
  ensure(110);
  const cardH =
    analysis.kind === "recommended" && analysis.recommendedPlan ? 96 : 72;
  doc.setFillColor(...softGreen);
  doc.setDrawColor(...success);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, y, maxW, cardH, 8, 8, "FD");

  let cy = y + 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...success);
  doc.text(
    analysis.kind === "recommended" ? "RECOMMENDED PLAN" : "RESULT",
    margin + 16,
    cy,
  );
  cy += 22;
  doc.setFontSize(20);
  doc.setTextColor(...navy);
  const headline =
    analysis.recommendedPlan?.name ??
    (analysis.kind === "no-suitable-plan"
      ? "No verified plan qualifies"
      : analysis.kind === "custom-quote"
        ? "Custom pricing required"
        : "Needs verification");
  doc.text(headline, margin + 16, cy);
  cy += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...muted);
  const explLines = doc.splitTextToSize(analysis.explanation, maxW - 32) as string[];
  doc.text(explLines.slice(0, 2), margin + 16, cy);
  y += cardH + 16;

  if (analysis.pricingNow) {
    kv(
      "Estimated monthly",
      formatMoney(analysis.pricingNow.monthlyEquivalent, {
        maximumFractionDigits: 0,
      }),
    );
    kv(
      "Estimated annual",
      formatMoney(analysis.pricingNow.annualCost, {
        maximumFractionDigits: 0,
      }),
    );
    mutedLine("List pricing assumptions — confirm current rates with the vendor.");
  } else if (analysis.kind === "recommended" || analysis.kind === "custom-quote") {
    mutedLine(
      "Exact pricing depends on configuration / contact vendor — no invented total.",
    );
  }

  kv("Confidence", analysis.confidence.toUpperCase());
  for (const reason of analysis.confidenceReasons.slice(0, 4)) {
    bullet(reason, muted);
  }

  // ── Team assumptions ────────────────────────────────────────
  h2("Team assumptions");
  kv("CRM users (now)", String(answers.crmUsers));
  if (answers.usersIn12Months != null) {
    kv("CRM users (12 months)", String(answers.usersIn12Months));
  }
  kv("Billing preference", answers.billingPreference);
  kv("Preference", answers.preference.replace(/-/g, " "));

  // ── Must-haves ──────────────────────────────────────────────
  h2("Must-have requirements");
  if (analysis.mustHaveSlugs.length === 0) {
    body("(none selected)");
  } else {
    for (const slug of analysis.mustHaveSlugs) {
      bullet(requirementLabel(slug));
    }
  }

  if (analysis.niceToHaveSlugs.length > 0) {
    h2("Nice-to-have requirements");
    for (const slug of analysis.niceToHaveSlugs) {
      bullet(requirementLabel(slug));
    }
  }

  // ── Plan ladder ─────────────────────────────────────────────
  h2("Plan ladder");
  for (const entry of analysis.planLadder) {
    ensure(28);
    const mark =
      entry.status === "recommended"
        ? "✓"
        : entry.status === "failed"
          ? "✕"
          : entry.status === "upgrade"
            ? "↑"
            : "·";
    const color =
      entry.status === "recommended"
        ? success
        : entry.status === "failed"
          ? danger
          : bodyColor;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...color);
    doc.text(`${mark}  ${entry.plan.name}`, margin, y);
    y += 13;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    const sum = doc.splitTextToSize(entry.summary, maxW - 12) as string[];
    doc.text(sum, margin + 12, y);
    y += sum.length * 11 + 6;
  }

  // ── Drivers ─────────────────────────────────────────────────
  if (analysis.requirementDrivers.length > 0) {
    h2("What is driving your plan");
    analysis.requirementDrivers.forEach((d, i) => {
      bullet(
        `${i + 1}. ${d.label} — forces upgrade from ${d.fromPlanName ?? "lower plan"} → ${d.toPlanName}`,
      );
    });
  }

  if (analysis.previousFailedPlan) {
    h2(`Could you use ${analysis.previousFailedPlan.name}?`);
    body("Not unless you can live without:");
    const failed = analysis.planLadder.find(
      (e) => e.plan.slug === analysis.previousFailedPlan!.slug,
    );
    for (const slug of failed?.missingMustHaves ?? []) {
      bullet(requirementLabel(slug), danger);
    }
    for (const msg of failed?.limitFailures ?? []) {
      bullet(msg, danger);
    }
  }

  if (analysis.nextPlan) {
    h2(`Should you upgrade to ${analysis.nextPlan.name}?`);
    if (analysis.upgradeBenefits.length === 0) {
      body(
        "Probably not yet — none of your nice-to-haves require this tier based on verified coverage.",
      );
    } else {
      body("It would add nice-to-have capabilities:");
      for (const b of analysis.upgradeBenefits) {
        bullet(`+ ${b}`);
      }
    }
  }

  // ── Cost at growth ──────────────────────────────────────────
  if (analysis.pricingNow && analysis.pricingGrowth) {
    h2("Cost at growth");
    kv(
      "Today",
      `${formatMoney(analysis.pricingNow.monthlyEquivalent, { maximumFractionDigits: 0 })} / mo`,
    );
    kv(
      "12-month scenario",
      `${formatMoney(analysis.pricingGrowth.monthlyEquivalent, { maximumFractionDigits: 0 })} / mo`,
    );
    const delta =
      analysis.pricingGrowth.monthlyEquivalent.amountMinor -
      analysis.pricingNow.monthlyEquivalent.amountMinor;
    kv(
      "Difference",
      `+${formatMoney(
        {
          amountMinor: delta,
          currency: analysis.pricingNow.monthlyEquivalent.currency,
        },
        { maximumFractionDigits: 0 },
      )} / mo`,
    );
    if (analysis.growthMayNeedReconsideration) {
      mutedLine(
        `Growth note: ${analysis.growthReconsiderationReason ?? "Seat growth may require reconsidering this plan."}`,
      );
    }
  }

  // ── Unknowns ────────────────────────────────────────────────
  if (analysis.unknowns.length > 0) {
    h2("Unknowns requiring vendor confirmation");
    for (const u of analysis.unknowns) {
      bullet(requirementLabel(u));
    }
  }

  // ── Provenance ──────────────────────────────────────────────
  h2("Provenance");
  if (analysis.verifiedAt) {
    kv(
      "Plan info last checked",
      new Date(analysis.verifiedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    );
  }
  mutedLine(
    `Research source ids: ${analysis.sourceIds.slice(0, 6).join(", ") || "see product pricing page"}.`,
  );
  mutedLine(
    "Confirm current list vs promotional pricing, seat minimums, add-ons, and usage limits with the vendor before purchasing.",
  );

  // ── Next questions ──────────────────────────────────────────
  h2("Next-step questions for the vendor");
  bullet("Confirm current list vs promotional pricing for my seat count.");
  bullet("Confirm which edition includes each must-have above.");
  bullet("Ask about seat minimums, light seats, and required add-ons.");
  bullet("Clarify usage limits that could force an upgrade as we grow.");

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
      `SoftwareGlimpse CRM Plan Selector  ·  ${analysis.productName}  ·  Page ${i} of ${pageCount}`,
      margin,
      pageH - 24,
    );
  }

  const filename =
    options.filename ??
    `crm-plan-${analysis.productSlug}-recommendation.pdf`;
  const blob = doc.output("blob");
  downloadBlob(blob, filename);
}
