import type { Comparison } from "@/domain/schemas";
import {
  hasIndexableRelationship,
  resolveComparisonRelationship,
  type SoftLookup,
} from "@/services/seo/compare-index-worthiness/relationship";
import { estimateUniqueContentRatio } from "@/services/seo/compare-index-worthiness/uniqueness";
import { canonicalizeComparisonSlug } from "@/domain/comparison-slug";
import { assessComparisonSemanticTemplateRisk } from "@/services/content-quality/gate/semantic-template";
import { hasFakeFeatureDifference } from "./capability-table";
import type {
  CapabilityCompareRow,
  CompareEnrichmentQaFinding,
  CompareEnrichmentQaResult,
  EvidencePairSummary,
} from "./types";

function normalizeText(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

function nearDuplicateVerdict(a: Comparison, b: Comparison): boolean {
  const va = normalizeText(a.verdict || "");
  const vb = normalizeText(b.verdict || "");
  if (!va || !vb || va.length < 40 || vb.length < 40) return false;
  if (va === vb) return true;
  const [a1, a2] = a.productSlugs;
  const [b1, b2] = b.productSlugs;
  const strip = (text: string, slugs: string[]) => {
    let t = text;
    for (const s of slugs) {
      t = t.replaceAll(s.replace(/-/g, " "), " ");
      t = t.replaceAll(s, " ");
    }
    return normalizeText(t);
  };
  const sa = strip(va, [a1!, a2!]);
  const sb = strip(vb, [b1!, b2!]);
  return sa.length > 30 && sa === sb;
}

export type CompareQaContext = {
  capabilityRows?: CapabilityCompareRow[];
  evidence?: EvidencePairSummary | null;
};

/**
 * Automated QA before promotion (pure — no node:fs).
 */
export function runCompareEnrichmentQa(
  comparison: Comparison,
  soft: SoftLookup,
  peers: Comparison[] = [],
  ctx: CompareQaContext = {},
): CompareEnrichmentQaResult {
  const findings: CompareEnrichmentQaFinding[] = [];
  const [slugA, slugB] = comparison.productSlugs;
  const a = soft.get(slugA ?? "");
  const b = soft.get(slugB ?? "");

  if (!a || !b) {
    findings.push({
      code: "broken_product_link",
      severity: "block",
      detail: "One or both product slugs missing from catalogue",
    });
  }

  const rel = resolveComparisonRelationship(comparison, soft);
  if (
    rel.kind === "cross_category_undeclared" ||
    rel.kind === "missing_product"
  ) {
    findings.push({
      code: "nonsensical_comparison",
      severity: "block",
      detail: `Relationship ${rel.kind} — insufficient buyer comparability`,
    });
  }

  const expectedCanonical = `/compare/${canonicalizeComparisonSlug(comparison.productSlugs)}/`;
  const canonical =
    comparison.seo.canonicalPath || `/compare/${comparison.slug}/`;
  if (canonical !== expectedCanonical) {
    findings.push({
      code: "missing_canonical",
      severity: "block",
      detail: `Canonical ${canonical} ≠ ${expectedCanonical}`,
    });
  }

  if (
    comparison.overallWinnerKind === "product-a" &&
    comparison.overallWinnerSlug &&
    comparison.overallWinnerSlug !== slugA
  ) {
    findings.push({
      code: "contradictory_winners",
      severity: "block",
      detail: "overallWinnerKind product-a but overallWinnerSlug mismatch",
    });
  }
  if (
    comparison.overallWinnerKind === "product-b" &&
    comparison.overallWinnerSlug &&
    comparison.overallWinnerSlug !== slugB
  ) {
    findings.push({
      code: "contradictory_winners",
      severity: "block",
      detail: "overallWinnerKind product-b but overallWinnerSlug mismatch",
    });
  }

  if (ctx.capabilityRows && hasFakeFeatureDifference(ctx.capabilityRows)) {
    findings.push({
      code: "fake_feature_difference",
      severity: "block",
      detail: "Unsupported claimed where other side is unknown",
    });
  }

  const verdict = comparison.verdict || "";
  if (
    /\b(we (hands[- ]on )?tested both|both (products )?were hands[- ]on tested|hands[- ]on tested both)\b/i.test(
      verdict,
    ) &&
    ctx.evidence &&
    !ctx.evidence.handsOnA &&
    !ctx.evidence.handsOnB
  ) {
    findings.push({
      code: "unsupported_claim",
      severity: "block",
      detail: "Verdict implies hands-on testing without evidence",
    });
  }

  const pricingAgeDays = (() => {
    const dates = [
      a?.pricingVerifiedAt,
      b?.pricingVerifiedAt,
      a?.pricing?.verifiedAt,
      b?.pricing?.verifiedAt,
    ]
      .filter(Boolean)
      .map((d) => Date.parse(d!));
    if (dates.length === 0) return null;
    const newest = Math.max(...dates);
    return Math.floor((Date.now() - newest) / (1000 * 60 * 60 * 24));
  })();
  if (pricingAgeDays != null && pricingAgeDays > 365) {
    findings.push({
      code: "stale_pricing",
      severity: "warn",
      detail: `Newest pricing verification is ${pricingAgeDays} days old`,
    });
  }

  const uniq = estimateUniqueContentRatio(comparison);
  if (uniq.ratio < 0.28 || uniq.boilerplateOutcomeShare >= 0.7) {
    findings.push({
      code: "insufficient_differentiation",
      severity: "block",
      detail: `Unique ratio ${uniq.ratio} / boilerplate ${uniq.boilerplateOutcomeShare}`,
    });
  }

  if (!comparison.verdict?.trim()) {
    findings.push({
      code: "empty_decision_section",
      severity: "warn",
      detail: "Missing verdict",
    });
  }

  const sameCategoryPeers = peers.filter(
    (p) =>
      p.slug !== comparison.slug &&
      p.categorySlug &&
      p.categorySlug === comparison.categorySlug,
  );
  for (const peer of sameCategoryPeers.slice(0, 40)) {
    if (nearDuplicateVerdict(comparison, peer)) {
      findings.push({
        code: "near_duplicate_page",
        severity: "block",
        detail: `Near-duplicate verdict vs /compare/${peer.slug}/`,
      });
      break;
    }
  }

  const semantic = assessComparisonSemanticTemplateRisk(comparison, peers);
  if (semantic.blocksAutoPromotion) {
    findings.push({
      code: "semantic_template_risk",
      severity: "block",
      detail: `${semantic.promotionReason} [${semantic.riskSignals.join(", ")}]`,
    });
  }

  if (
    !hasIndexableRelationship(rel.kind) &&
    rel.kind === "same_category_only"
  ) {
    findings.push({
      code: "nonsensical_comparison",
      severity: "warn",
      detail:
        "Same-category pair still lacks data-backed comparability for index promotion",
    });
  }

  const blocked = findings.some((f) => f.severity === "block");
  return { ok: !blocked, findings };
}
