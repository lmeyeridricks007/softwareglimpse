/** Stable AUT- opportunity IDs — not sort-order dependent. */

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
    .replace(/^www\./, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
  return (cleaned || "OPP").slice(0, max);
}

/**
 * Format: AUT-{TYPE_TOKEN}-{DOMAIN_TOKEN}-{HASH}
 * Example: AUT-TOOL-CIT-G2-COM-A3F1
 */
export function stableAuthorityOpportunityId(parts: {
  type: string;
  domain: string;
  url?: string;
  targetPage?: string;
}): string {
  const typeToken = slugToken(parts.type.replace(/_/g, "-"), 12);
  const domainToken = slugToken(parts.domain, 16);
  const signature = [
    parts.type,
    parts.domain.toLowerCase(),
    parts.url ?? "",
    parts.targetPage ?? "",
  ].join("|");
  return `AUT-${typeToken}-${domainToken}-${stableHash(signature)}`;
}

export function stableLinkableAssetId(kind: string, pathOrSlug: string): string {
  return `LA-${slugToken(kind, 10)}-${slugToken(pathOrSlug, 36)}-${stableHash(
    `${kind}|${pathOrSlug}`,
  )}`;
}

export function stableAngleId(opportunityId: string, angleTitle: string): string {
  return `ANG-${slugToken(opportunityId, 40)}-${stableHash(angleTitle)}`;
}

export function stableContentGapId(title: string): string {
  return `ALG-${slugToken(title, 36)}-${stableHash(title)}`;
}
