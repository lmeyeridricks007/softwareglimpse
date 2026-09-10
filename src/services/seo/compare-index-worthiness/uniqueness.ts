import type { Comparison } from "@/domain/schemas";

const BOILERPLATE_PATTERNS: RegExp[] = [
  /current research shows comparable support on/i,
  /have the same researched availability/i,
  /does not yet differentiate this criterion/i,
  /no universal winner/i,
  /choose by job-cluster fit/i,
  /researched side-by-side comparison of/i,
  /using .+ comparison criteria/i,
];

/**
 * Estimate how much of the page’s substantive text is pair-specific vs template.
 * Not a plagiarism score — flags mesh pages where reasons/verdicts are generic.
 */
export function estimateUniqueContentRatio(comparison: Comparison): {
  ratio: number;
  wordCount: number;
  boilerplateOutcomeShare: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  const chunks: string[] = [];

  if (comparison.verdict?.trim()) chunks.push(comparison.verdict.trim());
  if (comparison.summary?.trim()) chunks.push(comparison.summary.trim());
  if (comparison.pricingNotes?.trim()) chunks.push(comparison.pricingNotes.trim());

  for (const bf of comparison.bestFor ?? []) {
    for (const s of bf.scenarios ?? []) {
      if (s.trim()) chunks.push(s.trim());
    }
  }
  for (const sc of comparison.scenarioRecommendations ?? []) {
    if (sc.scenario?.trim()) chunks.push(sc.scenario.trim());
    if (sc.rationale?.trim()) chunks.push(sc.rationale.trim());
  }

  const outcomes = comparison.outcomes ?? [];
  let boilerOutcomes = 0;
  for (const o of outcomes) {
    const reason = o.reason?.trim() ?? "";
    if (!reason) continue;
    chunks.push(reason);
    if (BOILERPLATE_PATTERNS.some((re) => re.test(reason))) {
      boilerOutcomes += 1;
    }
  }

  const joined = chunks.join(" ");
  const words = joined.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const boilerplateOutcomeShare =
    outcomes.length > 0 ? boilerOutcomes / outcomes.length : 0;

  if (wordCount === 0) {
    return {
      ratio: 0,
      wordCount: 0,
      boilerplateOutcomeShare,
      reasons: ["No substantive text"],
    };
  }

  let boilerplateChars = 0;
  let totalChars = 0;
  for (const chunk of chunks) {
    totalChars += chunk.length;
    if (BOILERPLATE_PATTERNS.some((re) => re.test(chunk))) {
      boilerplateChars += chunk.length;
    }
  }

  // Pair-name specificity bonus: verdict/summary mention both product tokens
  const [a, b] = comparison.productSlugs;
  const lower = joined.toLowerCase();
  const namesBoth =
    Boolean(a && lower.includes(a.replace(/-/g, " "))) ||
    Boolean(a && lower.includes(a));
  const namesB =
    Boolean(b && lower.includes(b.replace(/-/g, " "))) ||
    Boolean(b && lower.includes(b));
  const nameSpecificity = namesBoth && namesB ? 0.08 : 0;

  const rawUnique = 1 - boilerplateChars / Math.max(totalChars, 1);
  const ratio = Math.max(
    0,
    Math.min(1, rawUnique * (1 - boilerplateOutcomeShare * 0.35) + nameSpecificity),
  );

  if (boilerplateOutcomeShare >= 0.5) {
    reasons.push(
      `High boilerplate outcome share (${(boilerplateOutcomeShare * 100).toFixed(0)}%)`,
    );
  }
  if (ratio < 0.4) {
    reasons.push(`Low unique-content ratio (${ratio.toFixed(2)})`);
  }

  return { ratio, wordCount, boilerplateOutcomeShare, reasons };
}

export function titleQualityFor(
  title: string | undefined,
  productA: string,
  productB: string,
): "strong" | "adequate" | "weak" | "missing" {
  if (!title?.trim()) return "missing";
  const t = title.trim();
  if (t.length < 20) return "weak";
  const lower = t.toLowerCase();
  const hasVs = /\bvs\.?\b/i.test(t);
  const mentionsA =
    lower.includes(productA) || lower.includes(productA.replace(/-/g, " "));
  const mentionsB =
    lower.includes(productB) || lower.includes(productB.replace(/-/g, " "));
  if (hasVs && mentionsA && mentionsB && t.length <= 70) return "strong";
  if (hasVs && (mentionsA || mentionsB)) return "adequate";
  return "weak";
}
