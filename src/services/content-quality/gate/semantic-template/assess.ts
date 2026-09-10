import type { Comparison, GuidePage } from "@/domain/schemas";
import {
  isFactoryProductPackGuide,
  isProductExplainerGuide,
} from "@/services/seo/guides-index-worthiness/classify";
import { classifyEnrichmentGuideType } from "@/services/seo/guide-enrichment/taxonomy";
import {
  ALL_SECTIONS,
  comparisonStripTokens,
  extractComparisonAnalysisSections,
  extractGuideAnalysisSections,
  guideStripTokens,
} from "./extract";
import {
  combinedSimilarity,
  countCanonicalUniqueSignals,
  detectUniqueAnalysisSignals,
  normalizeEditorialText,
  phraseFingerprint,
} from "./normalize";
import {
  RECURRING_PHRASE_SIBLING_MIN,
  SEMANTIC_SIMILARITY_ELEVATED,
  SEMANTIC_SIMILARITY_HIGH,
  SEMANTIC_TEMPLATE_VERSION,
  SIBLING_COMPARE_LIMIT,
  SIBLING_COMPARE_MAX,
  SIBLING_COMPARE_MIN,
  type SectionSimilarity,
  type SemanticTemplateAssessment,
  type TemplateRiskSignal,
  type UniqueAnalysisSignal,
} from "./types";

function clampSiblingLimit(limit?: number): number {
  if (limit == null) return SIBLING_COMPARE_LIMIT;
  return Math.max(
    SIBLING_COMPARE_MIN,
    Math.min(SIBLING_COMPARE_MAX, Math.round(limit)),
  );
}

function rawAnalysisTextFromSections(
  sections: ReturnType<typeof extractGuideAnalysisSections>,
): string {
  return ALL_SECTIONS.map((id) => sections[id] ?? "").join("\n");
}

function scoreSectionsAgainstPeers(
  selfSections: ReturnType<typeof extractGuideAnalysisSections>,
  selfStrip: string[],
  peers: Array<{
    slug: string;
    sections: ReturnType<typeof extractGuideAnalysisSections>;
    strip: string[];
  }>,
): SectionSimilarity[] {
  const out: SectionSimilarity[] = [];
  for (const section of ALL_SECTIONS) {
    const selfRaw = selfSections[section] ?? "";
    const selfNorm = normalizeEditorialText(selfRaw, selfStrip);
    if (selfNorm.length < 40) {
      out.push({
        section,
        maxSimilarity: 0,
        meanTopSimilarity: 0,
        nearestSiblingSlug: null,
      });
      continue;
    }

    const scored: Array<{ slug: string; sim: number }> = [];
    for (const peer of peers) {
      const peerRaw = peer.sections[section] ?? "";
      const peerNorm = normalizeEditorialText(peerRaw, peer.strip);
      if (peerNorm.length < 40) continue;
      scored.push({
        slug: peer.slug,
        sim: combinedSimilarity(selfNorm, peerNorm),
      });
    }
    scored.sort((a, b) => b.sim - a.sim);
    const top = scored.slice(0, 5);
    const maxSimilarity = top[0]?.sim ?? 0;
    const meanTopSimilarity =
      top.length > 0
        ? top.reduce((s, x) => s + x.sim, 0) / top.length
        : 0;
    out.push({
      section,
      maxSimilarity: Number(maxSimilarity.toFixed(4)),
      meanTopSimilarity: Number(meanTopSimilarity.toFixed(4)),
      nearestSiblingSlug: top[0]?.slug ?? null,
    });
  }
  return out;
}

type PeerPayload = Array<{
  slug: string;
  sections: ReturnType<typeof extractGuideAnalysisSections>;
  strip: string[];
}>;

function detectRecurringPatterns(
  selfSections: ReturnType<typeof extractGuideAnalysisSections>,
  selfStrip: string[],
  peers: PeerPayload,
): { patterns: string[]; signals: TemplateRiskSignal[] } {
  const patterns: string[] = [];
  const signals: TemplateRiskSignal[] = [];

  const checks: Array<{
    section: keyof typeof selfSections;
    signal: TemplateRiskSignal;
  }> = [
    { section: "intro", signal: "REPEATED_INTRO_PATTERN" },
    { section: "conclusion", signal: "REPEATED_CONCLUSION_PATTERN" },
    { section: "decision_thesis", signal: "REPEATED_VERDICT_PATTERN" },
    { section: "recommendation", signal: "REPEATED_VERDICT_PATTERN" },
    { section: "pros_cons", signal: "REPEATED_PROS_CONS_PATTERN" },
  ];

  for (const { section, signal } of checks) {
    const selfNorm = normalizeEditorialText(
      selfSections[section] ?? "",
      selfStrip,
    );
    const fp = phraseFingerprint(selfNorm);
    if (!fp) continue;
    let hits = 0;
    for (const peer of peers) {
      const peerNorm = normalizeEditorialText(
        peer.sections[section] ?? "",
        peer.strip,
      );
      if (!phraseFingerprint(peerNorm)) continue;
      if (combinedSimilarity(selfNorm, peerNorm) >= 0.82) hits += 1;
    }
    if (hits >= RECURRING_PHRASE_SIBLING_MIN) {
      patterns.push(
        `${section}: near-identical structure across ${hits} siblings (e.g. “${fp.slice(0, 60)}…”)`,
      );
      if (!signals.includes(signal)) signals.push(signal);
    }
  }
  return { patterns, signals };
}

function finalizeAssessment(input: {
  path: string;
  slug: string;
  guideTypeOrRelationship: string | null;
  categorySlug: string | null;
  templateFamily: string | null;
  siblingSlugs: string[];
  sectionSimilarities: SectionSimilarity[];
  recurringPatterns: string[];
  recurringSignals: TemplateRiskSignal[];
  uniqueAnalysisSignals: UniqueAnalysisSignal[];
  minUniqueSignals: number;
}): SemanticTemplateAssessment {
  const active = input.sectionSimilarities.filter(
    (s) => s.maxSimilarity > 0 || s.meanTopSimilarity > 0,
  );
  const maxSemanticSimilarity =
    active.length > 0
      ? Math.max(...active.map((s) => s.maxSimilarity))
      : 0;
  const meanSemanticSimilarity =
    active.length > 0
      ? active.reduce((s, x) => s + x.meanTopSimilarity, 0) / active.length
      : 0;

  const reasons: string[] = [];
  const riskSignals: TemplateRiskSignal[] = [...input.recurringSignals];
  let riskLevel: SemanticTemplateAssessment["riskLevel"] = "none";

  if (
    maxSemanticSimilarity >= SEMANTIC_SIMILARITY_HIGH ||
    input.recurringPatterns.length > 0
  ) {
    riskLevel = "high";
    if (!riskSignals.includes("SEMANTIC_TEMPLATE_RISK")) {
      riskSignals.push("SEMANTIC_TEMPLATE_RISK");
    }
    reasons.push(
      `SEMANTIC_TEMPLATE_RISK: max sibling similarity ${maxSemanticSimilarity.toFixed(2)} (names/prices stripped)`,
    );
    for (const p of input.recurringPatterns) reasons.push(p);
  } else if (maxSemanticSimilarity >= SEMANTIC_SIMILARITY_ELEVATED) {
    riskLevel = "elevated";
    reasons.push(
      `Elevated semantic similarity ${maxSemanticSimilarity.toFixed(2)} vs sibling cluster`,
    );
  }

  const canonicalCount = countCanonicalUniqueSignals(
    input.uniqueAnalysisSignals,
  );
  if (canonicalCount < input.minUniqueSignals) {
    riskSignals.push("INSUFFICIENT_PAGE_SPECIFIC_ANALYSIS");
    reasons.push(
      `INSUFFICIENT_PAGE_SPECIFIC_ANALYSIS (${canonicalCount}/${input.minUniqueSignals}): need specific buyer fit, poor-fit buyer, price threshold, workflow advantage, limitation, migration concern, implementation complexity, competitor difference, plan tradeoff, and/or use-case advantage — not variable substitution`,
    );
  }

  const blocksAutoPromotion =
    riskLevel === "high" ||
    (riskLevel === "elevated" && canonicalCount < input.minUniqueSignals) ||
    (canonicalCount < input.minUniqueSignals &&
      input.siblingSlugs.length >= 5 &&
      meanSemanticSimilarity >= 0.4);

  let promotionReason: string;
  if (blocksAutoPromotion) {
    promotionReason =
      riskLevel === "high" || riskSignals.includes("SEMANTIC_TEMPLATE_RISK")
        ? "Blocked: SEMANTIC_TEMPLATE_RISK — analysis interchangeable with siblings after stripping product/price/table tokens; remains IMPROVE / MANUAL_REVIEW"
        : "Blocked: INSUFFICIENT_PAGE_SPECIFIC_ANALYSIS while sibling cluster is template-like; editorial MANUAL_REVIEW required";
  } else if (riskLevel === "elevated") {
    promotionReason =
      "Cleared elevated similarity with sufficient unique-analysis signals";
  } else {
    promotionReason =
      "Cleared semantic template check — sibling analysis sufficiently distinct";
  }

  return {
    version: SEMANTIC_TEMPLATE_VERSION,
    path: input.path,
    slug: input.slug,
    siblingCluster: {
      size: input.siblingSlugs.length,
      guideTypeOrRelationship: input.guideTypeOrRelationship,
      categorySlug: input.categorySlug,
      templateFamily: input.templateFamily,
      siblingSlugs: input.siblingSlugs.slice(0, SIBLING_COMPARE_MAX),
    },
    sectionSimilarities: input.sectionSimilarities,
    maxSemanticSimilarity: Number(maxSemanticSimilarity.toFixed(4)),
    meanSemanticSimilarity: Number(meanSemanticSimilarity.toFixed(4)),
    recurringPatterns: input.recurringPatterns,
    riskSignals: [...new Set(riskSignals)],
    uniqueAnalysisSignals: input.uniqueAnalysisSignals,
    riskLevel,
    blocksAutoPromotion,
    reasons,
    promotionReason,
  };
}

function guideTemplateFamily(guide: GuidePage): string {
  if (isFactoryProductPackGuide(guide)) return "factory_product_pack";
  if (isProductExplainerGuide(guide)) return "product_explainer";
  const type = classifyEnrichmentGuideType(guide);
  return type.toLowerCase();
}

/**
 * Select nearest siblings: same enrichment type + category + template family.
 */
export function selectGuideSiblings(
  guide: GuidePage,
  peers: GuidePage[],
  limit = SIBLING_COMPARE_LIMIT,
): GuidePage[] {
  const capped = clampSiblingLimit(limit);
  const type = classifyEnrichmentGuideType(guide);
  const family = guideTemplateFamily(guide);
  const category = guide.categorySlugs?.[0] ?? null;

  const scored = peers
    .filter((p) => p.slug !== guide.slug)
    .map((p) => {
      let score = 0;
      if (classifyEnrichmentGuideType(p) === type) score += 4;
      if (guideTemplateFamily(p) === family) score += 3;
      if (category && (p.categorySlugs ?? []).includes(category)) {
        score += 3;
      }
      const sharedProducts = (guide.productSlugs ?? []).filter((s) =>
        (p.productSlugs ?? []).includes(s),
      ).length;
      if (sharedProducts === 0 && score >= 4) score += 1;
      if (sharedProducts > 0) score += 0.5;
      return { p, score };
    })
    .filter((x) => x.score >= 4)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, capped).map((x) => x.p);
}

export function selectComparisonSiblings(
  comparison: Comparison,
  peers: Comparison[],
  limit = SIBLING_COMPARE_LIMIT,
): Comparison[] {
  const capped = clampSiblingLimit(limit);
  const category = comparison.categorySlug ?? null;
  const scored = peers
    .filter((p) => p.slug !== comparison.slug)
    .map((p) => {
      let score = 0;
      if (category && p.categorySlug === category) score += 5;
      const shared = comparison.productSlugs.filter((s) =>
        p.productSlugs.includes(s),
      ).length;
      if (shared === 1) score += 2;
      if (shared === 0 && category && p.categorySlug === category) score += 1;
      return { p, score };
    })
    .filter((x) => x.score >= 5)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, capped).map((x) => x.p);
}

export function assessGuideSemanticTemplateRisk(
  guide: GuidePage,
  peers: GuidePage[] = [],
  opts?: { siblingLimit?: number },
): SemanticTemplateAssessment {
  const siblings = selectGuideSiblings(guide, peers, opts?.siblingLimit);
  const selfSections = extractGuideAnalysisSections(guide);
  const selfStrip = guideStripTokens(guide);
  const peerPayload = siblings.map((p) => ({
    slug: p.slug,
    sections: extractGuideAnalysisSections(p),
    strip: guideStripTokens(p),
  }));

  const sectionSimilarities = scoreSectionsAgainstPeers(
    selfSections,
    selfStrip,
    peerPayload,
  );
  const recurring = detectRecurringPatterns(
    selfSections,
    selfStrip,
    peerPayload,
  );
  const rawText = [
    guide.title,
    guide.summary ?? "",
    rawAnalysisTextFromSections(selfSections),
  ].join("\n");
  const uniqueAnalysisSignals = detectUniqueAnalysisSignals(rawText);
  const templateHeavy =
    isFactoryProductPackGuide(guide) || isProductExplainerGuide(guide);

  return finalizeAssessment({
    path: `/guides/${guide.slug}/`,
    slug: guide.slug,
    guideTypeOrRelationship: classifyEnrichmentGuideType(guide),
    categorySlug: guide.categorySlugs?.[0] ?? null,
    templateFamily: guideTemplateFamily(guide),
    siblingSlugs: siblings.map((s) => s.slug),
    sectionSimilarities,
    recurringPatterns: recurring.patterns,
    recurringSignals: recurring.signals,
    uniqueAnalysisSignals,
    minUniqueSignals: templateHeavy ? 2 : siblings.length >= 8 ? 2 : 1,
  });
}

export function assessComparisonSemanticTemplateRisk(
  comparison: Comparison,
  peers: Comparison[] = [],
  opts?: { siblingLimit?: number },
): SemanticTemplateAssessment {
  const siblings = selectComparisonSiblings(
    comparison,
    peers,
    opts?.siblingLimit,
  );
  const selfSections = extractComparisonAnalysisSections(comparison);
  const selfStrip = comparisonStripTokens(comparison);
  const peerPayload = siblings.map((p) => ({
    slug: p.slug,
    sections: extractComparisonAnalysisSections(p),
    strip: comparisonStripTokens(p),
  }));

  const sectionSimilarities = scoreSectionsAgainstPeers(
    selfSections,
    selfStrip,
    peerPayload,
  );
  const recurring = detectRecurringPatterns(
    selfSections,
    selfStrip,
    peerPayload,
  );
  const rawText = [
    comparison.title,
    comparison.summary ?? "",
    comparison.verdict ?? "",
    rawAnalysisTextFromSections(selfSections),
  ].join("\n");
  const uniqueAnalysisSignals = detectUniqueAnalysisSignals(rawText);

  return finalizeAssessment({
    path: `/compare/${comparison.slug}/`,
    slug: comparison.slug,
    guideTypeOrRelationship: "comparison",
    categorySlug: comparison.categorySlug ?? null,
    templateFamily: "comparison",
    siblingSlugs: siblings.map((s) => s.slug),
    sectionSimilarities,
    recurringPatterns: recurring.patterns,
    recurringSignals: recurring.signals,
    uniqueAnalysisSignals,
    minUniqueSignals: siblings.length >= 8 ? 2 : 1,
  });
}
