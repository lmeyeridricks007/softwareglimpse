/**
 * Prioritize EXISTING linkable assets for outreach drafts.
 * Does not invent referring domains or count prospects as earned links.
 */
import type { ScoredLinkableAsset } from "./types";

export type AssetOutreachPriority = "HIGH" | "MEDIUM" | "LOW";

export type AssetOutreachOpportunity = {
  priority: AssetOutreachPriority;
  assetPath: string;
  assetName: string;
  kind: string;
  cluster: string | null;
  assetScore: number;
  topicalRelevance: number;
  likelihood: number;
  theme:
    | "crm_pricing_research"
    | "pricing_history"
    | "calculator"
    | "tool"
    | "high_value_guide"
    | "other";
  whyPrioritized: string;
  draftPitchAngle: string;
  targetProspectTypes: string[];
  /** Explicit: not an earned link. */
  status: "DRAFT_ONLY";
};

function themeFor(asset: ScoredLinkableAsset): AssetOutreachOpportunity["theme"] {
  const p = asset.path;
  if (p.includes("/research/crm-pricing-history")) return "pricing_history";
  if (p.includes("/research/crm-pricing")) return "crm_pricing_research";
  if (p.includes("calculator") || p.includes("-cost-") || p.includes("tco")) {
    return "calculator";
  }
  if (asset.kind === "tool" || p.startsWith("/tools/")) return "tool";
  if (
    asset.kind === "guide" ||
    p.startsWith("/guides/") ||
    p.includes("how-to-choose") ||
    p.includes("what-is-")
  ) {
    return "high_value_guide";
  }
  return "other";
}

function topicalRelevance(theme: AssetOutreachOpportunity["theme"], asset: ScoredLinkableAsset): number {
  const base = asset.dimensions.seoRelevance;
  switch (theme) {
    case "crm_pricing_research":
    case "pricing_history":
      return Math.min(100, Math.round(base * 0.35 + asset.dimensions.citationValue * 0.65));
    case "calculator":
    case "tool":
      return Math.min(100, Math.round(base * 0.45 + asset.dimensions.uniqueness * 0.55));
    case "high_value_guide":
      return Math.min(100, Math.round(base * 0.55 + asset.dimensions.journalistUsefulness * 0.45));
    default:
      return base;
  }
}

function likelihood(theme: AssetOutreachOpportunity["theme"], asset: ScoredLinkableAsset): number {
  // Editorial likelihood for citation — not a guarantee of a link.
  const cite = asset.dimensions.citationValue;
  const journo = asset.dimensions.journalistUsefulness;
  const fresh = asset.dimensions.freshness;
  const blend = cite * 0.4 + journo * 0.35 + fresh * 0.25;
  if (theme === "crm_pricing_research" || theme === "pricing_history") {
    return Math.min(100, Math.round(blend + 8));
  }
  if (theme === "calculator" || theme === "tool") {
    return Math.min(100, Math.round(blend + 4));
  }
  return Math.round(blend);
}

function priorityFrom(
  topical: number,
  like: number,
  theme: AssetOutreachOpportunity["theme"],
  asset: ScoredLinkableAsset,
): AssetOutreachPriority {
  const score = topical * 0.55 + like * 0.45;
  const crmCluster = (asset.cluster ?? "").includes("crm") || asset.path.includes("crm");
  const coreResearch =
    theme === "crm_pricing_research" || theme === "pricing_history";
  const coreCrmTool =
    (theme === "calculator" || theme === "tool") && crmCluster;
  const coreGuide =
    theme === "high_value_guide" &&
    (asset.path.includes("how-to-choose-crm") ||
      asset.path.includes("what-is-crm") ||
      asset.path.includes("crm-"));

  if (coreResearch) return "HIGH";
  if (coreCrmTool && score >= 72) return "HIGH";
  if (coreGuide && score >= 68) return "HIGH";
  if (
    (theme === "calculator" || theme === "tool" || theme === "high_value_guide") &&
    score >= 70
  ) {
    return "MEDIUM";
  }
  if (score >= 62) return "MEDIUM";
  return "LOW";
}

function draftAngle(theme: AssetOutreachOpportunity["theme"], asset: ScoredLinkableAsset): string {
  switch (theme) {
    case "crm_pricing_research":
      return "Pitch as a citeable CRM pricing benchmark (sample size + methodology) — not a vendor ranking.";
    case "pricing_history":
      return "Offer verified CRM starting-price history for journalists tracking list-price movement.";
    case "calculator":
      return "Offer a free calculator readers can run without an account — utility citation.";
    case "tool":
      return "Offer an interactive finder/scorecard as a practical resource-page inclusion.";
    case "high_value_guide":
      return "Suggest a deep-link citation from buying guides that already discuss evaluation criteria.";
    default:
      return asset.promotionAngles[0] ?? "Share as a helpful SoftwareGlimpse citation.";
  }
}

function prospectTypes(theme: AssetOutreachOpportunity["theme"]): string[] {
  switch (theme) {
    case "crm_pricing_research":
    case "pricing_history":
      return ["JOURNALIST", "DATA_CITATION", "SAAS_PUBLICATION", "NEWSLETTER"];
    case "calculator":
    case "tool":
      return ["RESOURCE_PAGE", "SAAS_PUBLICATION", "BLOG", "NEWSLETTER"];
    case "high_value_guide":
      return ["RESOURCE_PAGE", "CONSULTANT", "BLOG", "ACADEMIC"];
    default:
      return ["RESOURCE_PAGE", "BLOG"];
  }
}

/**
 * Build prioritized outreach opportunity list for existing assets.
 * Priority = topical relevance × editorial likelihood. Draft only.
 */
export function buildAssetOutreachPriorities(
  assets: ScoredLinkableAsset[],
  limit = 40,
): AssetOutreachOpportunity[] {
  const preferredThemes = new Set([
    "crm_pricing_research",
    "pricing_history",
    "calculator",
    "tool",
    "high_value_guide",
  ]);

  const scored = assets
    .map((asset) => {
      const theme = themeFor(asset);
      const topical = topicalRelevance(theme, asset);
      const like = likelihood(theme, asset);
      const priority = priorityFrom(topical, like, theme, asset);
      return {
        priority,
        assetPath: asset.path,
        assetName: asset.name,
        kind: asset.kind,
        cluster: asset.cluster,
        assetScore: asset.assetScore,
        topicalRelevance: topical,
        likelihood: like,
        theme,
        whyPrioritized: preferredThemes.has(theme)
          ? `${theme.replace(/_/g, " ")} — citation ${asset.dimensions.citationValue}, journalist ${asset.dimensions.journalistUsefulness}, freshness ${asset.dimensions.freshness}`
          : `Secondary asset (score ${asset.assetScore}) — lower outreach priority`,
        draftPitchAngle: draftAngle(theme, asset),
        targetProspectTypes: prospectTypes(theme),
        status: "DRAFT_ONLY" as const,
      };
    })
    .filter((o) => preferredThemes.has(o.theme));

  // Cap MEDIUM non-CRM tools so the list stays actionable; demote overflow to LOW.
  const crmPath = (p: string) => p.includes("crm") || p.includes("/research/");
  let mediumNonCrm = 0;
  for (const o of scored) {
    if (o.priority !== "MEDIUM") continue;
    if (crmPath(o.assetPath) || o.theme === "high_value_guide") continue;
    mediumNonCrm += 1;
    if (mediumNonCrm > 12) o.priority = "LOW";
  }

  const rank: Record<AssetOutreachPriority, number> = {
    HIGH: 0,
    MEDIUM: 1,
    LOW: 2,
  };

  scored.sort((a, b) => {
    const pr = rank[a.priority] - rank[b.priority];
    if (pr !== 0) return pr;
    const themeBoost =
      (preferredThemes.has(a.theme) ? 0 : 1) - (preferredThemes.has(b.theme) ? 0 : 1);
    if (themeBoost !== 0) return themeBoost;
    return (
      b.topicalRelevance + b.likelihood - (a.topicalRelevance + a.likelihood) ||
      b.assetScore - a.assetScore
    );
  });

  return scored.slice(0, limit);
}
