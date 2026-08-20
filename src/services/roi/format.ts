import type { RoiHandoffPayload, RoiInputs } from "@/domain";
import type { RoiComputeResult } from "./compute";
import { computeRoi } from "./compute";

export function buildHandoffPayload(
  inputs: RoiInputs,
  result: RoiComputeResult,
): RoiHandoffPayload {
  return {
    version: 1,
    analysisName: inputs.analysisName,
    currency: inputs.currency,
    horizonYears: inputs.horizonYears,
    scenario: result.scenario,
    year1InvestmentMinor: result.year1InvestmentMinor,
    annualRecurringMinor: result.annualRecurringMinor,
    threeYearTcoMinor: result.threeYearTcoMinor,
    annualBenefitMinor: result.annualBenefitMinor,
    netAnnualBenefitMinor: result.netAnnualBenefitMinor,
    threeYearBenefitMinor: result.threeYearBenefitMinor,
    netThreeYearValueMinor: result.netThreeYearValueMinor,
    roiPercent: result.roiPercent,
    paybackMonths: result.paybackMonths,
    benefitBreakdown: result.benefitByCategory.map((c) => ({
      category: c.category,
      annualMinor: c.annualMinor,
      sharePercent: c.sharePercent,
      assumptionType:
        result.benefitLines.find((l) => l.category === c.category)
          ?.assumptionType ?? "estimated",
    })),
    assumptions: result.assumptions.map((a) => ({
      id: a.id,
      label: a.label,
      valueLabel: a.valueLabel,
      assumptionType: a.assumptionType,
      confidence: a.confidence,
      included: a.included,
    })),
    status: result.status,
    createdAt: new Date().toISOString(),
  };
}

export function formatRoiPercent(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  return `${Math.round(value)}%`;
}

export function formatPaybackMonths(value: number | null, approximate?: boolean): string {
  if (value == null) return "—";
  if (value === 0) return "Immediate";
  const label = value === 1 ? "1 month" : `${value} months`;
  return approximate ? `~${label}` : label;
}

/** Build a plain-text executive summary for clipboard / print. */
export function roiToPlainText(inputs: RoiInputs, result?: RoiComputeResult): string {
  const r = result ?? computeRoi(inputs);
  const lines = [
    `CRM ROI Analysis — ${inputs.analysisName}`,
    `Scenario: ${r.scenario} · Horizon: ${r.horizonYears} years · Currency: ${r.currency}`,
    `Status: ${r.status}`,
    r.statusReason ? `Note: ${r.statusReason}` : null,
    "",
    `Year 1 investment: ${r.year1InvestmentMinor ?? "unknown"}`,
    `Annual recurring: ${r.annualRecurringMinor ?? "unknown"}`,
    `Annual measurable benefit: ${r.annualBenefitMinor}`,
    `3-year TCO: ${r.threeYearTcoMinor ?? "unknown"}`,
    `3-year benefit: ${r.threeYearBenefitMinor}`,
    `Net 3-year value: ${r.netThreeYearValueMinor ?? "unknown"}`,
    `ROI: ${formatRoiPercent(r.roiPercent)}`,
    `Payback: ${formatPaybackMonths(r.paybackMonths, r.paybackApproximate)}`,
    "",
    "Benefit breakdown:",
    ...r.benefitByCategory
      .filter((c) => c.annualMinor > 0)
      .map((c) => `  - ${c.category}: ${c.annualMinor} (${c.sharePercent}%)`),
    "",
    "Assumptions:",
    ...r.assumptions.map(
      (a) =>
        `  - [${a.assumptionType}/${a.confidence}] ${a.label}: ${a.valueLabel}${a.included ? "" : " (excluded)"}`,
    ),
    "",
    r.assessment.interpretation,
  ];
  return lines.filter((l) => l != null).join("\n");
}
