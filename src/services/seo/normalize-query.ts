/**
 * Light query normalization for classification / clustering.
 */
export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s.+-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
