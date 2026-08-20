import type { CrmDecisionProfile, VendorScorecardState } from "@/domain";
import type { ProductScorecardResult } from "./engine";
import { OVERALL_FIT_DISPLAY, RESEARCH_LABEL_DISPLAY } from "./labels";
import { recommendationSentence } from "./summaries";

export function scorecardToPlainText(input: {
  profile: CrmDecisionProfile | null;
  state: VendorScorecardState;
  results: ProductScorecardResult[];
  includeNotes: boolean;
}): string {
  const lines: string[] = [];
  lines.push("SoftwareGlimpse CRM Vendor Scorecard");
  lines.push("====================================");
  lines.push("");

  if (input.profile) {
    lines.push("Business context");
    lines.push(
      `- Industry: ${input.profile.businessContext.industrySlug ?? "—"}`,
    );
    lines.push(
      `- Users: ${input.profile.businessContext.crmUserCount ?? "—"}`,
    );
    lines.push(
      `- Company size: ${input.profile.businessContext.companySizeSlug ?? "—"}`,
    );
    lines.push("");
  }

  lines.push(`Products: ${input.state.productIds.join(", ") || "none"}`);
  lines.push("");
  lines.push("Criteria & weights");
  for (const c of input.state.criteria) {
    if (c.importance === "ignore") continue;
    const pct =
      c.normalizedWeight != null
        ? `${Math.round(c.normalizedWeight * 100)}%`
        : c.importance;
    lines.push(`- ${c.label}: ${pct} (${c.importance})`);
  }
  lines.push("");

  for (const result of input.results) {
    lines.push(`${result.productName}`);
    lines.push(`- Overall: ${OVERALL_FIT_DISPLAY[result.overallFit]}`);
    lines.push(
      `- Must-haves: ${result.mustHaveSummary.satisfied} satisfied, ${result.mustHaveSummary.failed} failed, ${result.mustHaveSummary.unknown} unknown`,
    );
    if (result.weightedResearchScore != null) {
      lines.push(`- Research weighted fit: ${result.weightedResearchScore}/10`);
    }
    if (result.userAverage != null) {
      lines.push(`- Your evaluation: ${result.userAverage.toFixed(1)}/5`);
    }
    for (const cell of result.cells) {
      const num =
        cell.numericScore != null ? ` (${cell.numericScore}/10)` : "";
      lines.push(
        `  · ${cell.label}: ${RESEARCH_LABEL_DISPLAY[cell.qualitative]}${num}`,
      );
    }
    if (input.includeNotes) {
      const notes = input.state.productAssessments.find(
        (a) => a.productId === result.productSlug,
      )?.notes;
      if (notes) {
        lines.push(`- Notes: ${notes}`);
      }
    }
    lines.push("");
  }

  const leader = input.results[0] ?? null;
  const rec = recommendationSentence(leader);
  if (rec) {
    lines.push(rec);
    lines.push("");
  }

  lines.push(
    "Affiliate relationships do not influence SoftwareGlimpse research scores.",
  );
  lines.push(
    "Your evaluation remains separate from SoftwareGlimpse research unless you explicitly combine them.",
  );
  return lines.join("\n");
}

export function scorecardToCsv(input: {
  results: ProductScorecardResult[];
}): string {
  const headers = [
    "product",
    "overall_fit",
    "must_have_satisfied",
    "must_have_failed",
    "must_have_unknown",
    "research_score",
    "user_average",
    "combined_score",
  ];
  const rows = input.results.map((r) =>
    [
      r.productName,
      r.overallFit,
      r.mustHaveSummary.satisfied,
      r.mustHaveSummary.failed,
      r.mustHaveSummary.unknown,
      r.weightedResearchScore ?? "",
      r.userAverage ?? "",
      r.combinedScore ?? "",
    ].join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}
