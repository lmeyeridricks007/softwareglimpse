/**
 * Strip internal editorial / workflow language from public-facing strings.
 */

const INTERNAL_PATTERNS: RegExp[] = [
  /\bprovisional\b/i,
  /\bcandidate\b/i,
  /\bfixture\b/i,
  /\bfixtures\b/i,
  /\bfixture-demo\b/i,
  /\bevidenced in fixtures?\b/i,
  /\beditorial assessment\b/i,
  /\bstructured research available\b/i,
  /\bscore pending\b/i,
  /\bpending approval\b/i,
  /\bnot an? approved\b/i,
  /\bresearch fixtures?\b/i,
  /\bPOC\b/,
  /\bhands-on review\b/i,
  /\bnoindex until\b/i,
  /\buntil editorial approval\b/i,
  /\beditorial approval\b/i,
  /\bcandidate recommendations?\b/i,
  /\bnot approved rankings?\b/i,
  /\bnewsletter coming soon\b/i,
  /\bmethodology v\d/i,
  /\bfact-[a-z0-9._-]+/i,
  /\bsupporting facts?\b/i,
  /\bresearch status:\s*\w+/i,
  /\bauto scores?\b/i,
  /\brequires human review\b/i,
  /\bnot a finished\b/i,
  /\bcluster leaders?\b/i,
  /\bpriority-\d/i,
  /\blandscape award/i,
  /\bwave-\d/i,
  /\bnot steal\b/i,
  /\bkeeps the \w+ award\b/i,
  /\bfalse peer/i,
  /\bundifferentiated (?:ranked )?list\b/i,
  /\(\d\.\d\)/,
];

export function isInternalEditorialCopy(text: string | null | undefined): boolean {
  if (!text?.trim()) return true;
  return INTERNAL_PATTERNS.some((re) => re.test(text));
}

export function publicCopy(
  text: string | null | undefined,
  fallback?: string,
): string | null {
  if (!text?.trim()) return fallback ?? null;
  if (isInternalEditorialCopy(text)) return fallback ?? null;
  return text.trim();
}

/** Prefer the first public-safe string from candidates. */
export function firstPublicCopy(
  candidates: Array<string | null | undefined>,
  fallback?: string,
): string | null {
  for (const c of candidates) {
    const ok = publicCopy(c);
    if (ok) return ok;
  }
  return fallback ?? null;
}
