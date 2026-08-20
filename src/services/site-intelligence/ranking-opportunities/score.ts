import fs from "node:fs";
import path from "node:path";
import { opportunityBandForScore } from "../bands";
import type { RankingOpportunityBand } from "@/domain/schemas/site-intelligence";
import type { RankingOppInputs } from "./load-inputs";
import type {
  FeasibilityBand,
  OpportunityDimension,
  OpportunityDimensionId,
  QueryIntentClass,
  RankingOpportunity,
} from "./types";

const AUTHORITY_CAVEAT =
  "External authority not measured. Ranking feasibility may be overstated.";

const INTENT_WEIGHTS: Record<
  QueryIntentClass,
  Partial<Record<OpportunityDimensionId, number>>
> = {
  informational: {
    "intent-match": 0.18,
    "current-page-quality": 0.16,
    "sg-differentiation": 0.14,
    "competitive-content-gap": 0.12,
    "evidence-quality": 0.1,
    "topical-authority": 0.1,
    "internal-link-support": 0.06,
    "media-tool-advantage": 0.04,
    "technical-readiness": 0.04,
    "current-search-traction": 0.03,
    "external-authority-gap": 0.03,
  },
  commercial: {
    "intent-match": 0.12,
    "current-page-quality": 0.16,
    "evidence-quality": 0.14,
    "competitive-content-gap": 0.14,
    "sg-differentiation": 0.1,
    "topical-authority": 0.08,
    "media-tool-advantage": 0.06,
    "internal-link-support": 0.06,
    "technical-readiness": 0.04,
    "current-search-traction": 0.05,
    "external-authority-gap": 0.05,
  },
  "tool-resource": {
    "intent-match": 0.12,
    "media-tool-advantage": 0.2,
    "sg-differentiation": 0.16,
    "current-page-quality": 0.12,
    "competitive-content-gap": 0.1,
    "evidence-quality": 0.08,
    "internal-link-support": 0.08,
    "topical-authority": 0.06,
    "technical-readiness": 0.04,
    "current-search-traction": 0.02,
    "external-authority-gap": 0.02,
  },
  product: {
    "intent-match": 0.12,
    "current-page-quality": 0.18,
    "evidence-quality": 0.14,
    "competitive-content-gap": 0.12,
    "sg-differentiation": 0.08,
    "topical-authority": 0.08,
    "media-tool-advantage": 0.08,
    "current-search-traction": 0.06,
    "internal-link-support": 0.05,
    "technical-readiness": 0.04,
    "external-authority-gap": 0.05,
  },
  other: {
    "intent-match": 0.12,
    "current-page-quality": 0.14,
    "competitive-content-gap": 0.12,
    "sg-differentiation": 0.1,
    "topical-authority": 0.1,
    "internal-link-support": 0.08,
    "evidence-quality": 0.08,
    "media-tool-advantage": 0.08,
    "technical-readiness": 0.06,
    "current-search-traction": 0.06,
    "external-authority-gap": 0.06,
  },
};

export function classifyIntent(
  query: string,
  intent: string,
  page: string | null,
): QueryIntentClass {
  const q = `${query} ${intent} ${page ?? ""}`.toLowerCase();
  if (/checklist|calculator|planner|template|tool|scorecard|finder|roi/.test(q)) {
    return "tool-resource";
  }
  if (/review|\/software\//.test(q)) return "product";
  if (/best|vs\.?|compar|alternatives|pricing|buy/.test(q)) return "commercial";
  if (/what is|how to|guide|types of|benefits|glossary|implement|migrat/.test(q)) {
    return "informational";
  }
  return "other";
}

export function feasibilityLabel(band: RankingOpportunityBand): FeasibilityBand {
  switch (band) {
    case "strong":
      return "STRONG OPPORTUNITY";
    case "good":
      return "GOOD OPPORTUNITY";
    case "moderate":
      return "MODERATE";
    case "low":
      return "DIFFICULT";
    case "very-low":
      return "VERY DIFFICULT";
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avg(nums: number[]): number | null {
  if (!nums.length) return null;
  return clamp(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function normalizePath(p: string | null | undefined): string | null {
  if (!p) return null;
  let x = p.trim();
  if (!x.startsWith("/")) x = `/${x}`;
  if (!x.endsWith("/")) x = `${x}/`;
  return x;
}

function pageScore(
  scores: RankingOppInputs["scores"],
  page: string | null,
): number | null {
  const p = normalizePath(page);
  if (!p || !scores) return null;
  const hit =
    scores.pages[p] ??
    scores.pages[p.replace(/\/$/, "")] ??
    scores.pages[`${p.replace(/\/$/, "")}/`];
  return hit?.score ?? null;
}

function pageExistsOnDisk(page: string | null): boolean {
  const p = normalizePath(page);
  if (!p) return false;
  const rel = p.replace(/\/$/, "");
  return [
    path.join(process.cwd(), "src/app/(site)", rel, "page.tsx"),
    path.join(process.cwd(), "src/app", rel, "page.tsx"),
  ].some((c) => fs.existsSync(c));
}

export function clusterIdsForQuery(query: string, page: string | null): string[] {
  const q = `${query} ${page ?? ""}`.toLowerCase();
  const ids: string[] = [];
  if (/best|buy|choose|compar|vs\.?/.test(q)) ids.push("crm-buying");
  if (/evaluat|checklist|requirement|scorecard|rfp|vendor/.test(q)) {
    ids.push("crm-evaluation");
  }
  if (/implement|deploy|setup|adoption/.test(q)) ids.push("crm-implementation");
  if (/migrat/.test(q)) ids.push("crm-migration");
  if (/feature|capabilit|pipeline|workflow|automat|reporting/.test(q)) {
    ids.push("crm-features");
  }
  if (/industr|financial|saas|small business|healthcare|real estate/.test(q)) {
    ids.push("crm-industries");
  }
  if (/hubspot/.test(q)) ids.push("hubspot-cluster");
  if (/pipedrive/.test(q)) ids.push("pipedrive-cluster");
  if (!ids.length) ids.push("crm-general");
  return ids;
}

function dim(
  id: OpportunityDimensionId,
  score: number | null,
  reason: string,
): OpportunityDimension {
  return {
    id,
    score,
    reason,
    available: score != null,
  };
}

function weightedOpportunityScore(
  intentClass: QueryIntentClass,
  dimensions: OpportunityDimension[],
): number {
  const weights = INTENT_WEIGHTS[intentClass];
  const byId = new Map(dimensions.map((d) => [d.id, d]));
  let sum = 0;
  let wsum = 0;
  for (const [id, w] of Object.entries(weights)) {
    const d = byId.get(id as OpportunityDimensionId);
    const score = d?.score;
    if (score == null) continue;
    sum += score * (w ?? 0);
    wsum += w ?? 0;
  }
  if (wsum <= 0) return 50;
  return clamp(sum / wsum);
}

/**
 * Score one query/topic opportunity from assembled evidence.
 * Relative feasibility only — never a ranking probability.
 */
export function scoreQueryOpportunity(
  seed: RankingOppInputs["seeds"][number],
  inputs: RankingOppInputs,
): RankingOpportunity {
  const page = seed.associatedPage;
  const intentClass = classifyIntent(seed.query, seed.intent, page);
  const cq = pageScore(inputs.scores, page);
  const exists = cq != null || pageExistsOnDisk(page);
  const thin = inputs.mapThin.find(
    (t) => t.path && normalizePath(t.path) === normalizePath(page),
  );
  const missingMap = inputs.mapMissing.find(
    (t) => t.path && normalizePath(t.path) === normalizePath(page),
  );

  const serpQ = inputs.serp.byQuery.find(
    (q) => q.query.toLowerCase() === seed.query.toLowerCase(),
  );
  const competitorCount = serpQ?.competitors.length ?? 0;
  const avgCompRank =
    competitorCount > 0
      ? avg(serpQ!.competitors.map((c) => c.rank))
      : null;
  // Inverse: weaker/sparser SERP competition → higher opportunity factor
  const competitiveGapScore =
    competitorCount === 0
      ? 55
      : clamp(
          100 -
            Math.min(55, competitorCount * 6) -
            Math.min(25, ((avgCompRank ?? 5) - 1) * 2),
        );

  const bench = inputs.benchmark?.benchmarks.find(
    (b) => b.query.toLowerCase() === seed.query.toLowerCase(),
  );
  const sgRow = bench?.rows.find((r) => r.domain === "softwareglimpse.com");
  const compRows =
    bench?.rows.filter((r) => r.domain !== "softwareglimpse.com") ?? [];
  const intentMatch =
    (sgRow?.dimensions["search-intent-alignment"] as number | undefined) ??
    (exists ? 70 : 35);
  const evidence =
    (sgRow?.dimensions.evidence as number | undefined) ??
    (cq != null ? clamp(cq - 10) : exists ? 50 : 25);
  const differentiation =
    (sgRow?.dimensions["original-value"] as number | undefined) ??
    (sgRow?.dimensions["content-differentiation"] as number | undefined) ??
    (intentClass === "tool-resource" && exists ? 70 : exists ? 55 : 30);
  const mediaTool = avg(
    [
      sgRow?.dimensions.tools as number | undefined,
      sgRow?.dimensions.calculators as number | undefined,
      sgRow?.dimensions["product-screenshots"] as number | undefined,
      sgRow?.dimensions["templates-resources"] as number | undefined,
    ].filter((n): n is number => typeof n === "number"),
  );
  const mediaToolScore =
    mediaTool ??
    (intentClass === "tool-resource" && exists
      ? 72
      : exists
        ? 45
        : 20);

  const gapRow = inputs.gaps?.queryGaps.find(
    (g) => g.query.toLowerCase() === seed.query.toLowerCase(),
  );
  const competitorStrength =
    gapRow?.competitorAvgStrength ??
    avg(
      compRows
        .map((r) => {
          const vals = Object.values(r.dimensions).filter(
            (n): n is number => typeof n === "number",
          );
          return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
        })
        .filter((n): n is number => n != null),
    );

  // Competitive content gap dimension: higher = better opportunity (weaker comps / SG ahead)
  let competitiveContentGap = competitiveGapScore;
  if (gapRow?.sgBenchmarkStrength != null && competitorStrength != null) {
    competitiveContentGap = clamp(
      50 + (gapRow.sgBenchmarkStrength - competitorStrength) / 2,
    );
  }

  const clusterIds = clusterIdsForQuery(seed.query, page);
  const clusterSupportBase = 45 + Math.min(35, clusterIds.length * 8);
  const topical =
    thin || missingMap
      ? clamp(clusterSupportBase - 15)
      : exists
        ? clamp(clusterSupportBase + (cq != null && cq >= 85 ? 10 : 0))
        : clamp(clusterSupportBase - 20);

  const linkingPenalty = inputs.linkingNotes.some((n) =>
    /gap|orphan|incomplete/i.test(n),
  )
    ? 12
    : 0;
  const internalLinks = exists
    ? clamp(62 - linkingPenalty + (intentClass === "tool-resource" ? 5 : 0))
    : clamp(35 - linkingPenalty);

  const technical = inputs.technicalScoreProxy;
  const traction = inputs.visibilityAvailable ? 55 : null;
  // Authority: unavailable → neutral-low so we don't invent strength
  const authorityGap = inputs.authorityMeasured ? 50 : 42;

  const pageQuality = exists
    ? cq ?? (thin ? 55 : missingMap ? 40 : 60)
    : 25;

  const dimensions: OpportunityDimension[] = [
    dim("intent-match", intentMatch, `Intent class ${intentClass}; alignment proxy ${intentMatch}`),
    dim(
      "current-page-quality",
      pageQuality,
      exists
        ? cq != null
          ? `CQ score ${cq}`
          : "Page exists but CQ score missing — proxy used"
        : "No matching page — quality treated as weak",
    ),
    dim(
      "competitive-content-gap",
      competitiveContentGap,
      competitorCount
        ? `${competitorCount} SERP competitors observed; gap factor ${competitiveContentGap}`
        : "No SERP rows for query — neutral/cautious gap factor",
    ),
    dim("sg-differentiation", differentiation, "Differentiation / original-value proxy"),
    dim("topical-authority", topical, `Cluster support via ${clusterIds.join(", ")}`),
    dim(
      "internal-link-support",
      internalLinks,
      inputs.linkingNotes[0] ?? "Internal link support proxy",
    ),
    dim("evidence-quality", evidence, "Evidence/methodology observability proxy"),
    dim(
      "media-tool-advantage",
      mediaToolScore,
      "Tools/calculators/screenshots/resources proxy",
    ),
    dim(
      "technical-readiness",
      technical,
      technical != null
        ? inputs.technicalNotes[0] ?? "Site technical readiness proxy"
        : "Technical readiness not available",
    ),
    dim(
      "current-search-traction",
      traction,
      inputs.visibilityAvailable
        ? "Visibility metrics available"
        : "Search visibility DATA NOT AVAILABLE — not fabricated",
    ),
    dim(
      "external-authority-gap",
      authorityGap,
      inputs.authorityMeasured
        ? "Authority metrics integrated"
        : AUTHORITY_CAVEAT,
    ),
  ];

  let opportunityScore = weightedOpportunityScore(intentClass, dimensions);
  // Soft penalty when authority unknown on commercial/product (don't overstate)
  if (!inputs.authorityMeasured && (intentClass === "commercial" || intentClass === "product")) {
    opportunityScore = clamp(opportunityScore - 4);
  }
  if (!exists) opportunityScore = clamp(Math.min(opportunityScore, 58));

  const feasibility = feasibilityLabel(opportunityBandForScore(opportunityScore));

  const availableDims = dimensions.filter((d) => d.available).length;
  const confidence: RankingOpportunity["confidence"] =
    availableDims >= 9 && inputs.benchmark
      ? inputs.authorityMeasured
        ? "high"
        : "medium"
      : availableDims >= 6
        ? "medium"
        : "low";

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  if (exists) strengths.push(`Dedicated target page ${page}`);
  if (cq != null && cq >= 85) strengths.push(`Strong CQ score (${cq})`);
  if (intentClass === "tool-resource" && mediaToolScore >= 65) {
    strengths.push("Tool/resource utility signals favor SoftwareGlimpse positioning");
  }
  if (differentiation >= 65) strengths.push("Differentiation / original-value signals");
  if (gapRow?.stance === "STRONGER") {
    strengths.push("Competitive gap analysis marks SG stronger on this query");
  }
  if (intentMatch >= 80) strengths.push("Strong intent alignment to target page");

  if (!exists) weaknesses.push("No live matching page for this query seed");
  if (cq != null && cq < 80) weaknesses.push(`Page quality below strong band (CQ ${cq})`);
  if (thin) weaknesses.push(`Content map marks page thin/research-required (${thin.id})`);
  if (mediaToolScore < 45) weaknesses.push("Limited media/tool advantage vs SERP norms");
  if (evidence < 55) weaknesses.push("Evidence/methodology depth needs work");
  if (linkingPenalty > 0) weaknesses.push("Internal linking gaps may limit cluster support");
  if (!inputs.authorityMeasured) {
    weaknesses.push("External authority / backlink gap not measured");
  }
  if (competitorStrength != null && competitorStrength >= 70) {
    weaknesses.push(`Sampled competitor pages look strong (avg ~${competitorStrength})`);
  }

  const requiredImprovements: string[] = [];
  if (!exists) requiredImprovements.push("Create purpose-built page matching query intent");
  else if (cq != null && cq < 85) {
    requiredImprovements.push("Improve existing page quality (decision depth, evidence, modules)");
  }
  if (mediaToolScore < 55 && intentClass === "tool-resource") {
    requiredImprovements.push("Strengthen interactive utility (preview, download, workflow)");
  }
  if (evidence < 60) {
    requiredImprovements.push("Add methodology, sources, and concrete examples");
  }
  if (intentClass === "commercial" && (sgRow?.dimensions["comparison-depth"] ?? 50) < 70) {
    requiredImprovements.push("Deepen comparison/trade-off modules with product research");
  }

  const internalLinksRequired: string[] = [];
  if (page?.includes("/resources/") || page?.includes("/tools/")) {
    internalLinksRequired.push("Link from /compare/* and /software/* reviews into this resource/tool");
    internalLinksRequired.push("Link from /guides/how-to-choose-crm/ and evaluation guides");
  }
  if (page?.includes("/best/")) {
    internalLinksRequired.push("Link from category hub, industries, and top comparisons");
  }
  if (page?.includes("/compare/")) {
    internalLinksRequired.push("Link from both product reviews and best/list pages");
  }
  if (!internalLinksRequired.length && exists) {
    internalLinksRequired.push("Add contextual links from nearest cluster hubs");
  }

  const supportingContentNeeded: string[] = [];
  for (const c of clusterIds) {
    if (c === "crm-evaluation") {
      supportingContentNeeded.push("Evaluation guide + Vendor Scorecard / CRM Finder integrations");
    }
    if (c === "crm-migration") {
      supportingContentNeeded.push("Migration cost/checklist companions");
    }
    if (c === "crm-buying") {
      supportingContentNeeded.push("Requirements / demo / trial evaluation companions");
    }
  }

  const researchNeeded: string[] = [];
  if (thin || (cq != null && cq < 80)) {
    researchNeeded.push("Primary-source product/pricing research for claims");
  }
  if (intentClass === "commercial" || intentClass === "product") {
    researchNeeded.push("Fresh competitor feature/pricing checks before publishing upgrades");
  }
  if (!inputs.authorityMeasured) {
    researchNeeded.push("Optional: integrate backlink/authority metrics before prioritizing head terms");
  }

  let recommendedAction: string;
  if (!exists) recommendedAction = "Create new page";
  else if (feasibility === "STRONG OPPORTUNITY" || feasibility === "GOOD OPPORTUNITY") {
    recommendedAction =
      cq != null && cq >= 85
        ? "Improve existing page (links + modules) — protect advantage"
        : "Improve existing page";
  } else if (feasibility === "MODERATE") {
    recommendedAction = "Improve existing page with substantial upgrades";
  } else {
    recommendedAction = exists
      ? "Deprioritize unless strategic — requires substantial upgrades + authority growth"
      : "Avoid for now — low relative opportunity";
  }

  // Low-value avoid heuristics
  let avoid = false;
  let avoidReason: string | undefined;
  if (
    seed.query.toLowerCase().includes("softwareglimpse") ||
    (competitorCount >= 8 && !exists && intentClass === "commercial")
  ) {
    avoid = true;
    avoidReason = !exists
      ? "Head commercial query with crowded SERP and no matching page — poor near-term ROI vs cluster tools/resources"
      : "Brand/noise query";
  }
  if (
    serpQ?.competitors.some((c) => c.domain === "reddit.com") &&
    intentClass === "informational" &&
    !exists
  ) {
    avoid = true;
    avoidReason =
      "Community-dominated informational SERP without an owned page — low editorial leverage";
  }

  return {
    query: seed.query,
    intent: seed.intent,
    intentClass,
    targetPage: page,
    currentRank: null,
    opportunityScore,
    feasibility,
    confidence,
    competitorStrength,
    dimensions,
    strengths: strengths.length ? strengths : ["Limited positive signals in current evidence"],
    weaknesses: weaknesses.length ? weaknesses : ["No major weakness flagged from available evidence"],
    requiredImprovements: requiredImprovements.length
      ? requiredImprovements
      : ["Maintain quality and refresh evidence periodically"],
    internalLinksRequired,
    supportingContentNeeded: supportingContentNeeded.length
      ? [...new Set(supportingContentNeeded)]
      : ["Ensure nearest cluster hubs link contextually"],
    researchNeeded: researchNeeded.length
      ? researchNeeded
      : ["No extra research flagged beyond normal editorial QA"],
    authorityCaveat: AUTHORITY_CAVEAT,
    recommendedAction,
    clusterIds,
    avoid,
    avoidReason,
  };
}

export { AUTHORITY_CAVEAT };
