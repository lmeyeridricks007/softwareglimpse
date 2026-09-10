import {
  combinedSimilarity,
  normalizeEditorialText,
  phraseFingerprint,
} from "./normalize";
import {
  DEFAULT_FAMILY_SHARED_RATIO,
  SEMANTIC_TEMPLATE_VERSION,
  type FamilyQaSharedPattern,
  type FamilyQaSummary,
  type SemanticTemplateAssessment,
} from "./types";

type BatchMember = {
  slug: string;
  stripTokens: string[];
  sections: {
    decision_thesis?: string;
    recommendation?: string;
    intro?: string;
    conclusion?: string;
    pros_cons?: string;
  };
  assessment: SemanticTemplateAssessment;
};

function clusterByFingerprint(
  members: BatchMember[],
  section: keyof BatchMember["sections"],
  kind: FamilyQaSharedPattern["kind"],
  threshold: number,
): FamilyQaSharedPattern[] {
  const entries: Array<{ slug: string; fp: string; norm: string }> = [];
  for (const m of members) {
    const raw = m.sections[section] ?? "";
    const norm = normalizeEditorialText(raw, m.stripTokens);
    const fp = phraseFingerprint(norm);
    if (!fp) continue;
    entries.push({ slug: m.slug, fp, norm });
  }
  if (entries.length < 2) return [];

  const used = new Set<string>();
  const out: FamilyQaSharedPattern[] = [];

  for (const seed of entries) {
    if (used.has(seed.slug)) continue;
    const group = [seed];
    for (const other of entries) {
      if (other.slug === seed.slug || used.has(other.slug)) continue;
      if (combinedSimilarity(seed.norm, other.norm) >= 0.8) {
        group.push(other);
      }
    }
    if (group.length < 2) continue;
    const share = group.length / members.length;
    if (share < threshold) continue;
    for (const g of group) used.add(g.slug);
    out.push({
      kind,
      fingerprint: seed.fp,
      share: Number(share.toFixed(3)),
      slugs: group.map((g) => g.slug),
    });
  }
  return out;
}

/**
 * Phase 5 — Family QA for an enrichment batch.
 * Flags when more than `sharedRatioThreshold` of pages share the same thesis,
 * recommendation structure, or paragraph skeleton.
 */
export function assessEnrichmentBatchFamilyQa(
  members: BatchMember[],
  opts: {
    pageType: "guide" | "comparison";
    sharedRatioThreshold?: number;
  },
): FamilyQaSummary {
  const threshold = opts.sharedRatioThreshold ?? DEFAULT_FAMILY_SHARED_RATIO;
  const sharedPatterns: FamilyQaSharedPattern[] = [
    ...clusterByFingerprint(members, "decision_thesis", "thesis", threshold),
    ...clusterByFingerprint(
      members,
      "recommendation",
      "recommendation",
      threshold,
    ),
    ...clusterByFingerprint(members, "pros_cons", "pros_cons", threshold),
    ...clusterByFingerprint(members, "intro", "paragraph_skeleton", threshold),
    ...clusterByFingerprint(
      members,
      "conclusion",
      "paragraph_skeleton",
      threshold,
    ),
  ];

  const flagged = sharedPatterns.length > 0;
  const notes: string[] = [];
  if (flagged) {
    notes.push(
      `Family QA flagged: ≥${Math.round(threshold * 100)}% of batch pages share thesis/recommendation/skeleton patterns`,
    );
    for (const p of sharedPatterns) {
      notes.push(
        `${p.kind}: ${(p.share * 100).toFixed(0)}% share (${p.slugs.length} pages) — “${p.fingerprint.slice(0, 70)}…”`,
      );
    }
  } else {
    notes.push(
      `Family QA clear: no thesis/recommendation/skeleton shared by ≥${Math.round(threshold * 100)}% of batch`,
    );
  }

  return {
    version: SEMANTIC_TEMPLATE_VERSION,
    generatedAt: new Date().toISOString(),
    batchSize: members.length,
    pageType: opts.pageType,
    sharedRatioThreshold: threshold,
    flagged,
    sharedPatterns,
    pageAssessments: members.map((m) => ({
      slug: m.slug,
      maxSemanticSimilarity: m.assessment.maxSemanticSimilarity,
      riskLevel: m.assessment.riskLevel,
      riskSignals: m.assessment.riskSignals,
      uniqueAnalysisSignals: m.assessment.uniqueAnalysisSignals,
      blocksAutoPromotion: m.assessment.blocksAutoPromotion,
    })),
    notes,
  };
}
