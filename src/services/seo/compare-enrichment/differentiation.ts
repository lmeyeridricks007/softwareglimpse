import type { Comparison } from "@/domain/schemas";
import { estimateUniqueContentRatio } from "@/services/seo/compare-index-worthiness/uniqueness";
import type { CompareEnrichmentQaFinding } from "./types";

/**
 * Pre-promotion differentiation check vs peer comparisons.
 * Rejects name-swapped boilerplate; does not invent uniqueness.
 */
export function checkComparisonDifferentiation(
  comparison: Comparison,
  peers: Comparison[],
): { ok: boolean; findings: CompareEnrichmentQaFinding[] } {
  const findings: CompareEnrichmentQaFinding[] = [];
  const uniq = estimateUniqueContentRatio(comparison);

  if (uniq.ratio < 0.35) {
    findings.push({
      code: "insufficient_differentiation",
      severity: "block",
      detail: `Unique content ratio ${uniq.ratio} below 0.35`,
    });
  }

  const intro = (comparison.summary || "").toLowerCase().slice(0, 280);
  const verdict = (comparison.verdict || "").toLowerCase();

  let introHits = 0;
  let verdictHits = 0;
  for (const peer of peers) {
    if (peer.slug === comparison.slug) continue;
    if (
      intro.length > 60 &&
      (peer.summary || "").toLowerCase().slice(0, 280) === intro
    ) {
      introHits += 1;
    }
    if (
      verdict.length > 60 &&
      (peer.verdict || "").toLowerCase() === verdict
    ) {
      verdictHits += 1;
    }
  }

  if (introHits > 0) {
    findings.push({
      code: "near_duplicate_page",
      severity: "block",
      detail: `Intro duplicates ${introHits} peer comparison(s)`,
    });
  }
  if (verdictHits > 0) {
    findings.push({
      code: "near_duplicate_page",
      severity: "block",
      detail: `Verdict duplicates ${verdictHits} peer comparison(s)`,
    });
  }

  const hasProductSpecific =
    Boolean(comparison.bestFor?.some((bf) => bf.scenarios.length > 0)) ||
    (comparison.scenarioRecommendations?.length ?? 0) > 0 ||
    Boolean(comparison.pricingNotes?.trim());

  if (!hasProductSpecific) {
    findings.push({
      code: "insufficient_differentiation",
      severity: "block",
      detail: "Missing product-specific scenarios or pricing notes",
    });
  }

  return {
    ok: !findings.some((f) => f.severity === "block"),
    findings,
  };
}
