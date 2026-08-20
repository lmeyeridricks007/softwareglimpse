/**
 * Lightweight typo / fuzzy helpers for entity titles.
 * Conservative — never aggressive autocorrect.
 */

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]!;
  }
  return prev[b.length]!;
}

export function fuzzyRatio(a: string, b: string): number {
  const left = a.toLowerCase().trim();
  const right = b.toLowerCase().trim();
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  const maxLen = Math.max(left.length, right.length);
  return 1 - distance / maxLen;
}

/** Allow 1 edit for short names, 2 for longer — only when close. */
export function isCloseTypo(query: string, candidate: string): boolean {
  const q = query.toLowerCase().trim();
  const c = candidate.toLowerCase().trim();
  if (!q || q.length < 4) return false;
  const distance = levenshtein(q, c);
  const maxDistance = q.length <= 6 ? 1 : 2;
  return distance > 0 && distance <= maxDistance && fuzzyRatio(q, c) >= 0.78;
}
