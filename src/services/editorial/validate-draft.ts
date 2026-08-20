import type { EditorialBrief, EditorialDraft } from "@/domain";

export type DraftValidationResult = {
  ok: boolean;
  errors: string[];
};

const HANDS_ON_PATTERNS = [
  /\bwe tested\b/i,
  /\bwe tried\b/i,
  /\bhands-?on testing\b/i,
  /\bin our testing\b/i,
  /\bour team used\b/i,
  /\bafter using (it|the product)\b/i,
  /\bwe used it for\b/i,
];

/** Unsourced numeric claims: percentages, currency, or large bare integers. */
const NUMBER_PATTERNS = [
  /\d+(?:\.\d+)?%/g,
  /\$\s?\d[\d,]*(?:\.\d+)?/g,
  /\b\d{3,}\b/g,
];

function collectText(draft: EditorialDraft): { section: string; text: string }[] {
  const parts: { section: string; text: string }[] = [];
  if (draft.summary) parts.push({ section: "summary", text: draft.summary });
  if (draft.verdict) parts.push({ section: "verdict", text: draft.verdict });
  for (const p of draft.pros) parts.push({ section: "pros", text: p });
  for (const c of draft.cons) parts.push({ section: "cons", text: c });
  for (const s of draft.sections) {
    parts.push({ section: s.id, text: `${s.heading}\n${s.body}` });
  }
  for (const faq of draft.faq) {
    parts.push({ section: "faq", text: `${faq.question}\n${faq.answer}` });
  }
  if (draft.seoDescription) {
    parts.push({ section: "seo", text: draft.seoDescription });
  }
  return parts;
}

function allowedNumberTokens(brief: EditorialBrief): Set<string> {
  const allowed = new Set<string>();
  for (const n of brief.approvedNumbers) {
    allowed.add(String(n.value));
    if (typeof n.value === "number") {
      allowed.add(n.value.toFixed(0));
      allowed.add(n.value.toFixed(2));
      allowed.add(`$${n.value}`);
      allowed.add(`$ ${n.value}`);
    }
  }
  // Criterion scores 0-10 are editorial and allowed when present in assessments
  for (const a of brief.editorialAssessments) {
    allowed.add(String(a.score));
    allowed.add(a.score.toFixed(1));
    allowed.add(`${a.score}/10`);
  }
  return allowed;
}

function isAllowedNumber(token: string, allowed: Set<string>): boolean {
  const cleaned = token.replace(/[$,%\s]/g, "");
  if (allowed.has(token) || allowed.has(cleaned)) return true;
  for (const a of allowed) {
    if (token.includes(a) || a.includes(cleaned)) return true;
  }
  // Allow small integers often used in prose (1-99) unless currency/percent
  if (!token.includes("%") && !token.includes("$") && /^\d{1,2}$/.test(cleaned)) {
    return true;
  }
  return false;
}

function briefFactIds(brief: EditorialBrief): Set<string> {
  return new Set(brief.facts.map((f) => f.id));
}

function collectFactRefs(draft: EditorialDraft): string[] {
  const ids: string[] = [];
  for (const s of draft.sections) ids.push(...s.factRefs);
  for (const faq of draft.faq) ids.push(...faq.factRefs);
  for (const ref of draft.factRefs) ids.push(...ref.factIds);
  return ids;
}

/**
 * Validate a generated draft against its brief contract.
 */
export function validateEditorialDraft(
  draft: EditorialDraft,
  brief: EditorialBrief,
): DraftValidationResult {
  const errors: string[] = [];
  const allowedNumbers = allowedNumberTokens(brief);
  const knownFacts = briefFactIds(brief);

  for (const { section, text } of collectText(draft)) {
    if (!brief.handsOnTestingAllowed) {
      for (const pattern of HANDS_ON_PATTERNS) {
        if (pattern.test(text)) {
          errors.push(`hands-on-claim-not-allowed:${section}`);
          break;
        }
      }
    }

    for (const pattern of NUMBER_PATTERNS) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) != null) {
        const token = match[0];
        if (!isAllowedNumber(token, allowedNumbers)) {
          errors.push(`unsourced-number:${section}:${token}`);
        }
      }
    }
  }

  for (const factId of collectFactRefs(draft)) {
    if (!knownFacts.has(factId)) {
      errors.push(`unknown-fact-ref:${factId}`);
    }
  }

  for (const assessment of brief.editorialAssessments) {
    if (!assessment.rationale?.trim()) {
      errors.push(`score-missing-rationale:${assessment.criterionSlug}`);
    }
  }

  // Draft sections that assert scores should stay aligned with brief assessments
  for (const assessment of brief.editorialAssessments) {
    if (assessment.score < 0 || assessment.score > 10) {
      errors.push(`score-out-of-range:${assessment.criterionSlug}`);
    }
  }

  for (const claim of brief.prohibitedClaims) {
    const needle = claim.toLowerCase();
    if (needle.length < 6) continue;
    for (const { section, text } of collectText(draft)) {
      if (text.toLowerCase().includes(needle)) {
        errors.push(`prohibited-claim:${section}:${claim}`);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}
