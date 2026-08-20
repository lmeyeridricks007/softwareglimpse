/**
 * Stable recommendation IDs for content intelligence.
 * Format examples:
 *   CQ-SOFTWARE-HUBSPOT-EVIDENCE-A3F1
 *   CG-TOOLS-CRM-ROI-CALCULATOR-B2C9
 *
 * IDs are derived from route/title + type/decision + problem signature —
 * not from sort order — so unrelated IDs do not churn between runs.
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

const IMPROVEMENT_TYPE_TOKEN: Record<string, string> = {
  "EXPAND CONTENT": "EXPAND",
  RESTRUCTURE: "RESTRUCTURE",
  "ADD ORIGINAL ANALYSIS": "ANALYSIS",
  "ADD EVIDENCE": "EVIDENCE",
  "REFRESH RESEARCH": "RESEARCH",
  "ADD COMPARISON": "COMPARE",
  "ADD TABLE": "TABLE",
  "ADD VISUAL": "VISUAL",
  "ADD SCREENSHOT": "SCREENSHOT",
  "ADD VIDEO": "VIDEO",
  "ADD TOOL CTA": "TOOLCTA",
  "ADD RESOURCE": "RESOURCE",
  "ADD CHECKLIST": "CHECKLIST",
  "ADD INTERNAL LINKS": "LINKS",
  "IMPROVE NEXT STEP": "NEXTSTEP",
  "MERGE CONTENT": "MERGE",
  "SPLIT CONTENT": "SPLIT",
  "REMOVE / REDIRECT": "REDIRECT",
  "RESEARCH REQUIRED": "RESEARCH",
};

export function improvementTypeToken(type: string): string {
  return (
    IMPROVEMENT_TYPE_TOKEN[type] ||
    type.replace(/[^A-Z0-9]+/gi, "").toUpperCase().slice(0, 12) ||
    "IMPROVE"
  );
}

/** Stable quality-improvement recommendation ID (CQ-…). */
export function stableImprovementId(
  route: string,
  primaryType: string,
  problem: string,
): string {
  const entity = slugToken(route);
  const kind = improvementTypeToken(primaryType);
  const hash = stableHash(`${route}|${primaryType}|${problem.slice(0, 160)}`);
  return `CQ-${entity}-${kind}-${hash}`;
}

/** Stable content-gap / new-opportunity ID (CG-…). */
export function stableGapId(
  title: string,
  route: string,
  decision: string,
): string {
  const entity = slugToken(route || title, 40);
  const hash = stableHash(`${title}|${route}|${decision}`);
  return `CG-${entity}-${hash}`;
}

/** Stable action ID for master NEXT-N recommendations. */
export function stableActionId(
  action: string,
  target: string,
  sourceId?: string,
): string {
  if (sourceId && /^(CQ|CG)-/.test(sourceId)) return sourceId;
  const entity = slugToken(target, 40);
  const kind = action.replace(/[^A-Z0-9]+/gi, "").toUpperCase().slice(0, 12) || "ACT";
  const hash = stableHash(`${action}|${target}|${sourceId ?? ""}`);
  return `CI-${entity}-${kind}-${hash}`;
}
