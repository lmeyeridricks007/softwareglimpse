/**
 * Stable Content Asset Intelligence IDs.
 * Format: CAI-{ENTITY}-{KIND}-{HASH}
 * Linked CQ / map ids recorded alongside in snapshots — not embedded in the ID.
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

export function slugToken(raw: string, max = 36): string {
  const cleaned = raw
    .replace(/^https?:\/\//, "")
    .replace(/^\/|\/$/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
  return (cleaned || "PAGE").slice(0, max);
}

export type AssetOpportunityKind =
  | "VIDEO"
  | "SCREENSHOT"
  | "DIAGRAM"
  | "ORIGINAL"
  | "REUSE"
  | "STALE"
  | "SOURCE"
  | "TEMPLATE"
  | "USAGE"
  | "OTHER";

export function stableAssetOpportunityId(input: {
  pageRoute: string;
  kind: AssetOpportunityKind;
  assetTitle: string;
  section?: string;
}): string {
  const entity = slugToken(input.pageRoute);
  const hash = stableHash(
    `${input.pageRoute}|${input.kind}|${input.section ?? ""}|${input.assetTitle.slice(0, 120)}`,
  );
  return `CAI-${entity}-${input.kind}-${hash}`;
}

export function kindFromBatch(batch: string): AssetOpportunityKind {
  switch (batch) {
    case "official-videos-to-embed":
      return "VIDEO";
    case "screenshots-to-add":
      return "SCREENSHOT";
    case "original-diagrams-to-create":
      return "DIAGRAM";
    case "original-workflow-visuals-to-create":
      return "ORIGINAL";
    case "existing-research-media-to-reuse":
      return "REUSE";
    case "stale-media-to-replace":
      return "STALE";
    case "official-docs-to-link":
      return "SOURCE";
    case "template-fix":
      return "TEMPLATE";
    default:
      return "OTHER";
  }
}
