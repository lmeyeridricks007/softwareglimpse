import { opportunityBandForScore } from "../bands";
import {
  AUTHORITY_CAVEAT,
  feasibilityLabel,
  scoreQueryOpportunity,
} from "./score";
import type { RankingOppInputs } from "./load-inputs";
import type {
  ClusterOpportunity,
  RankingOpportunitiesReport,
  RankingOpportunity,
} from "./types";

const CLUSTER_META: Record<string, { label: string; match?: RegExp }> = {
  "crm-buying": { label: "CRM buying" },
  "crm-evaluation": { label: "CRM evaluation" },
  "crm-implementation": { label: "CRM implementation" },
  "crm-migration": { label: "CRM migration" },
  "crm-features": { label: "CRM features" },
  "crm-industries": { label: "CRM industries" },
  "hubspot-cluster": { label: "HubSpot cluster" },
  "pipedrive-cluster": { label: "Pipedrive cluster" },
  "crm-general": { label: "CRM general" },
};

function buildClusters(opps: RankingOpportunity[]): ClusterOpportunity[] {
  const by = new Map<string, RankingOpportunity[]>();
  for (const o of opps) {
    for (const id of o.clusterIds) {
      const list = by.get(id) ?? [];
      list.push(o);
      by.set(id, list);
    }
  }

  const clusters: ClusterOpportunity[] = [];
  for (const [id, list] of by) {
    const avgScore = Math.round(
      list.reduce((s, o) => s + o.opportunityScore, 0) / list.length,
    );
    const pages = new Set(
      list.map((o) => o.targetPage).filter(Boolean) as string[],
    );
    const strengths = [
      ...new Set(list.flatMap((o) => o.strengths).slice(0, 8)),
    ].slice(0, 4);
    const weaknesses = [
      ...new Set(list.flatMap((o) => o.weaknesses).slice(0, 8)),
    ].slice(0, 4);
    const best = [...list].sort(
      (a, b) => b.opportunityScore - a.opportunityScore,
    )[0];
    clusters.push({
      id,
      label: CLUSTER_META[id]?.label ?? id,
      queries: list.map((o) => o.query),
      avgScore,
      feasibility: feasibilityLabel(opportunityBandForScore(avgScore)),
      pageCount: pages.size,
      strengths,
      weaknesses,
      recommendedAction:
        best?.recommendedAction ??
        "Prioritize highest-scoring queries in this cluster",
      authorityCaveat: AUTHORITY_CAVEAT,
    });
  }

  return clusters.sort((a, b) => b.avgScore - a.avgScore);
}

export function analyzeRankingOpportunities(
  inputs: RankingOppInputs,
  generatedAt: string,
): RankingOpportunitiesReport {
  // Score the full CRM catalogue seed set (all associated pages).
  // SERP/benchmark competitor signals apply when present; otherwise scores
  // still run from CQ / technical / linking proxies.
  const seeds = inputs.seeds;

  const opportunities = seeds.map((s) => scoreQueryOpportunity(s, inputs));
  opportunities.sort((a, b) => b.opportunityScore - a.opportunityScore);

  const topStrongest = opportunities
    .filter((o) => !o.avoid)
    .slice(0, 25);
  const topHardest = [...opportunities]
    .sort((a, b) => a.opportunityScore - b.opportunityScore)
    .slice(0, 25);

  const closestToBreakthrough = opportunities
    .filter(
      (o) =>
        o.targetPage &&
        (o.feasibility === "GOOD OPPORTUNITY" ||
          o.feasibility === "MODERATE") &&
        o.opportunityScore >= 52 &&
        o.opportunityScore < 80,
    )
    .slice(0, 15);

  const needsSubstantialUpgrade = opportunities
    .filter(
      (o) =>
        o.targetPage &&
        (o.feasibility === "DIFFICULT" ||
          o.feasibility === "VERY DIFFICULT" ||
          o.weaknesses.some((w) => /CQ \d{2}/.test(w) || /thin/i.test(w))),
    )
    .slice(0, 15);

  const newContentOpportunities = opportunities
    .filter(
      (o) =>
        !o.targetPage ||
        o.recommendedAction.toLowerCase().includes("create") ||
        o.strengths.some((s) => /no matching/i.test(s)) ||
        o.weaknesses.some((w) => /no live matching/i.test(w)),
    )
    .filter((o) => !o.avoid)
    .slice(0, 15);

  // Also surface map-missing as synthetic new opportunities if not already covered
  for (const m of inputs.mapMissing.slice(0, 8)) {
    if (newContentOpportunities.length >= 15) break;
    if (newContentOpportunities.some((o) => o.targetPage === m.path)) continue;
    newContentOpportunities.push({
      query: m.title,
      intent: "map-gap",
      intentClass: /tool|calculator|builder|assessment/i.test(m.title)
        ? "tool-resource"
        : "other",
      targetPage: m.path ?? null,
      currentRank: null,
      opportunityScore: m.priority === "P0" ? 62 : m.priority === "P1" ? 55 : 45,
      feasibility:
        m.priority === "P0" || m.priority === "P1"
          ? "GOOD OPPORTUNITY"
          : "MODERATE",
      confidence: "low",
      competitorStrength: null,
      dimensions: [],
      strengths: [`Mapped as missing/not-yet (${m.id})`],
      weaknesses: ["Not implemented yet"],
      requiredImprovements: ["Implement map row with clear user utility"],
      internalLinksRequired: ["Wire into nearest journey hubs when published"],
      supportingContentNeeded: ["Align with parent cluster pages"],
      researchNeeded: ["Confirm demand via SERP refresh before build"],
      authorityCaveat: AUTHORITY_CAVEAT,
      recommendedAction: "Create new page",
      clusterIds: ["crm-evaluation"],
    });
  }

  const lowValueAvoid = opportunities.filter((o) => o.avoid);

  const clusters = buildClusters(opportunities).filter((c) =>
    [
      "crm-buying",
      "crm-evaluation",
      "crm-implementation",
      "crm-migration",
      "crm-features",
      "crm-industries",
      "hubspot-cluster",
      "pipedrive-cluster",
    ].includes(c.id),
  );

  const pageCount = new Set(
    opportunities.map((o) => o.targetPage).filter(Boolean),
  ).size;
  const productReviewCount = opportunities.filter((o) =>
    o.targetPage?.startsWith("/software/"),
  ).length;

  return {
    generatedAt,
    cluster: "crm",
    sources: inputs.sources,
    authorityMeasured: inputs.authorityMeasured,
    authorityCaveatGlobal: AUTHORITY_CAVEAT,
    visibilityAvailable: inputs.visibilityAvailable,
    opportunities,
    clusters,
    topStrongest,
    topHardest,
    closestToBreakthrough,
    needsSubstantialUpgrade,
    newContentOpportunities,
    lowValueAvoid,
    notes: [
      `Full CRM catalogue coverage: ${opportunities.length} opportunities across ${pageCount} target pages (${productReviewCount} product review hubs)`,
      "SERP competitor sampling remains bounded — many pages score without live SERP rows",
      "Relative opportunity/feasibility only — not a ranking probability or timeline",
      inputs.visibilityAvailable
        ? "Search visibility metrics included"
        : "Search visibility DATA NOT AVAILABLE",
      inputs.authorityMeasured
        ? "Authority metrics included"
        : AUTHORITY_CAVEAT,
      ...inputs.technicalNotes.slice(0, 2),
    ],
    disclaimers: [
      "Do not interpret opportunity scores as “chance to rank.”",
      "Do not invent timelines (“will rank in N months”).",
      AUTHORITY_CAVEAT,
    ],
  };
}
