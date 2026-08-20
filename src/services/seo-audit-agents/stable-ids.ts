/**
 * Stable SEO audit issue IDs.
 * Examples: SEO-CANONICAL-HOME-A3F1, SEO-ORPHAN-GUIDES-WHAT-IS-CRM-B2C9, PERF-LCP-HERO-007A
 *
 * IDs are derived from kind + route/signature — not sort order — so unrelated
 * IDs do not churn between runs.
 */

function djb2(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return h >>> 0;
}

export function stableHash(input: string, len = 4): string {
  return djb2(input)
    .toString(16)
    .toUpperCase()
    .padStart(len, "0")
    .slice(0, len);
}

export function slugToken(raw: string, max = 28): string {
  const cleaned = raw
    .replace(/^https?:\/\//, "")
    .replace(/^\/|\/$/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
  return (cleaned || "SITE").slice(0, max);
}

export type StableIdPrefix = "SEO" | "PERF" | "MEDIA" | "OUT";

/**
 * Build a stable finding ID.
 * @param prefix SEO | PERF | MEDIA | OUT
 * @param kind e.g. CANONICAL, ORPHAN, LCP, AFFILIATE
 * @param subject route, entity, or problem key
 * @param signature optional extra fingerprint (problem text)
 */
export function stableSeoIssueId(
  prefix: StableIdPrefix,
  kind: string,
  subject: string,
  signature = "",
): string {
  const kindTok = kind
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 16);
  const subj = slugToken(subject);
  const hash = stableHash(`${prefix}|${kindTok}|${subject}|${signature.slice(0, 160)}`);
  return `${prefix}-${kindTok}-${subj}-${hash}`;
}
