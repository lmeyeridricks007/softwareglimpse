/**
 * Best-page public content gate.
 * Internal editorial/workflow language must never reach production HTML.
 */

import {
  isInternalEditorialCopy,
  publicCopy,
} from "@/services/category-hub/public-copy";

/** Forbidden substrings / concepts on public Best pages (case-insensitive). */
export const BEST_PAGE_LEAK_PATTERNS: RegExp[] = [
  /\bprovisional\b/i,
  /\bcandidate\b/i,
  /\bpending approval\b/i,
  /\bscore pending\b/i,
  /\bfixture evidence\b/i,
  /\bfixture\b/i,
  /\bnot an? approved\b/i,
  /\bnoindex until\b/i,
  /\beditorial approval\b/i,
  /\buntil editorial approval\b/i,
  /\bnewsletter coming soon\b/i,
  /\bmethodology v\d/i,
  /\bScores pending\b/,
  /\bresearch fixtures?\b/i,
  /\bPOC\b/,
];

export function containsBestPageLeak(text: string | null | undefined): boolean {
  if (!text?.trim()) return false;
  if (isInternalEditorialCopy(text)) return true;
  return BEST_PAGE_LEAK_PATTERNS.some((re) => re.test(text));
}

export function assertNoBestPageLeaks(
  blob: string,
  context = "best-page",
): void {
  for (const pattern of BEST_PAGE_LEAK_PATTERNS) {
    if (pattern.test(blob)) {
      throw new Error(
        `[${context}] Publication quality gate failed: matched ${pattern}`,
      );
    }
  }
}

/** Collect leak hits for reporting (non-throwing). */
export function findBestPageLeaks(blob: string): string[] {
  const hits: string[] = [];
  for (const pattern of BEST_PAGE_LEAK_PATTERNS) {
    const m = blob.match(pattern);
    if (m) hits.push(m[0]);
  }
  return hits;
}

/** Sanitize a string for public Best-page rendering. */
export function bestPublicCopy(
  text: string | null | undefined,
  fallback?: string,
): string | null {
  const cleaned = publicCopy(text, fallback);
  if (!cleaned) return null;
  if (containsBestPageLeak(cleaned)) return fallback ?? null;
  return cleaned;
}
