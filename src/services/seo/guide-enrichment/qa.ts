import type { GuidePage } from "@/domain/schemas";
import type { EnrichmentQaFinding, EnrichmentQaResult } from "./types";
import { hasGenericFiller, uniqueValueGap } from "./unique-value";
import { classifyEnrichmentGuideType } from "./taxonomy";
import { checkExplainerReviewCannibalization } from "./cannibalization";
import { assessGuideSemanticTemplateRisk } from "@/services/content-quality/gate/semantic-template";

function extractParagraphs(guide: GuidePage): string[] {
  const paras: string[] = [];
  for (const s of guide.sections ?? []) {
    for (const p of s.body.split(/\n{2,}/)) {
      const t = p.replace(/\s+/g, " ").trim();
      if (t.length > 40) paras.push(t.toLowerCase());
    }
  }
  for (const b of guide.blocks ?? []) {
    if (!b || typeof b !== "object") continue;
    const body = "body" in b && typeof b.body === "string" ? b.body : "";
    for (const p of body.split(/\n{2,}/)) {
      const t = p.replace(/\s+/g, " ").trim();
      if (t.length > 40) paras.push(t.toLowerCase());
    }
  }
  return paras;
}

function jaccard(a: string, b: string): number {
  const ta = new Set(a.split(/\s+/).filter((w) => w.length > 3));
  const tb = new Set(b.split(/\s+/).filter((w) => w.length > 3));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter += 1;
  return inter / (ta.size + tb.size - inter);
}

const STAT_WITHOUT_SOURCE =
  /\b(\d{1,3}%|\d+\s*(?:x|times)|\$\d[\d,]*(?:\.\d+)?)\b/i;

/**
 * Detect duplication, filler, and unsupported stats before promotion.
 */
export function runEnrichmentQa(
  guide: GuidePage,
  peerGuides: GuidePage[] = [],
): EnrichmentQaResult {
  const findings: EnrichmentQaFinding[] = [];
  const paras = extractParagraphs(guide);

  const seen = new Map<string, number>();
  for (const p of paras) {
    seen.set(p, (seen.get(p) ?? 0) + 1);
  }
  for (const [p, n] of seen) {
    if (n >= 2) {
      findings.push({
        code: "repeated_paragraph",
        severity: "block",
        detail: `Repeated paragraph (${n}×): ${p.slice(0, 80)}…`,
      });
    }
  }

  if (paras.length >= 2) {
    const intro = paras[0]!;
    const conclusion = paras[paras.length - 1]!;
    for (const peer of peerGuides.slice(0, 40)) {
      if (peer.slug === guide.slug) continue;
      const peerParas = extractParagraphs(peer);
      if (!peerParas.length) continue;
      if (jaccard(intro, peerParas[0]!) >= 0.85) {
        findings.push({
          code: "near_duplicate_intro",
          severity: "block",
          detail: `Intro near-duplicate of /guides/${peer.slug}/`,
        });
      }
      const peerEnd = peerParas[peerParas.length - 1]!;
      if (jaccard(conclusion, peerEnd) >= 0.85) {
        findings.push({
          code: "near_identical_conclusion",
          severity: "block",
          detail: `Conclusion near-duplicate of /guides/${peer.slug}/`,
        });
      }
    }
  }

  if (hasGenericFiller(guide)) {
    findings.push({
      code: "generic_ai_filler",
      severity: "block",
      detail: "Generic AI filler phrases detected",
    });
  }

  const titleWords = guide.title.toLowerCase().split(/\s+/);
  const body = paras.join(" ");
  let stuffed = 0;
  for (const w of titleWords) {
    if (w.length < 5) continue;
    const re = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const count = body.match(re)?.length ?? 0;
    if (count > 25) stuffed += 1;
  }
  if (stuffed >= 2) {
    findings.push({
      code: "keyword_stuffing",
      severity: "warn",
      detail: "Possible keyword stuffing against title terms",
    });
  }

  const type = classifyEnrichmentGuideType(guide);
  const gap = uniqueValueGap(guide, type);
  if (!gap.sufficient) {
    findings.push({
      code: "insufficient_unique_value",
      severity: "block",
      detail: `Missing unique value: ${gap.missing.join(", ") || "below minimum"}`,
    });
  }

  const cannibal = checkExplainerReviewCannibalization(guide);
  if (!cannibal.ok) {
    findings.push({
      code: "review_intent_cannibalization",
      severity: "block",
      detail: cannibal.detail.join("; "),
    });
  } else if (cannibal.detail.length > 0) {
    findings.push({
      code: "review_intent_cannibalization",
      severity: "warn",
      detail: cannibal.detail.join("; "),
    });
  }

  const semantic = assessGuideSemanticTemplateRisk(guide, peerGuides);
  if (semantic.blocksAutoPromotion) {
    findings.push({
      code: "semantic_template_risk",
      severity: "block",
      detail: `${semantic.promotionReason} (max similarity ${semantic.maxSemanticSimilarity}; signals: ${semantic.uniqueAnalysisSignals.join(", ") || "none"}; risk: ${semantic.riskSignals.join(", ")})`,
    });
    for (const signal of semantic.riskSignals) {
      if (
        signal === "SEMANTIC_TEMPLATE_RISK" ||
        signal === "INSUFFICIENT_PAGE_SPECIFIC_ANALYSIS" ||
        signal.startsWith("REPEATED_")
      ) {
        findings.push({
          code:
            signal === "SEMANTIC_TEMPLATE_RISK"
              ? "semantic_template_risk"
              : (signal as EnrichmentQaFinding["code"]),
          severity: "block",
          detail: semantic.reasons.find((r) => r.includes(signal)) ?? signal,
        });
      }
    }
  } else if (semantic.riskLevel === "elevated") {
    findings.push({
      code: "semantic_template_risk",
      severity: "warn",
      detail: `Elevated sibling similarity ${semantic.maxSemanticSimilarity} — strengthen page-specific analysis before promotion`,
    });
  }

  // Soft check: statistics without nearby source language
  if (
    STAT_WITHOUT_SOURCE.test(body) &&
    !/source|researched|verified|SoftwareGlimpse/i.test(body)
  ) {
    findings.push({
      code: "unsupported_statistic",
      severity: "warn",
      detail: "Numeric/statistic claim without nearby source provenance",
    });
  }

  const blocked = findings.some((f) => f.severity === "block");
  return { ok: !blocked, findings };
}
