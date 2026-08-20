import type { SiteIntelligenceAssessment } from "@/domain/schemas/site-intelligence";
import type { WebsiteOverviewModel } from "../overview/report";
import {
  type CollectedIntelligence,
} from "./collect";
import { compareScorecards, loadPreviousScorecard } from "./history";
import type {
  IntelligenceAction,
  IntelligenceRisk,
  ScorecardCell,
  ScorecardSnapshot,
  WebsiteIntelligenceMode,
  WebsiteIntelligenceModel,
} from "./types";
import {
  extractBulletSection,
  extractTableRows,
} from "./collect";

function cell(
  id: string,
  label: string,
  score: number | null | undefined,
  status: ScorecardCell["status"],
  opts?: { confidence?: string; note?: string; display?: string },
): ScorecardCell {
  const display =
    opts?.display ??
    (status === "scored" && score != null
      ? String(score)
      : status === "not-measured"
        ? "NOT MEASURED"
        : status === "not-available"
          ? "NOT AVAILABLE"
          : status === "not-connected"
            ? "NOT CONNECTED"
            : "UNAVAILABLE");
  return {
    id,
    label,
    score: score ?? null,
    status,
    display,
    confidence: opts?.confidence,
    note: opts?.note,
  };
}

function buildExecutiveVerdict(input: {
  overall: number | null;
  technical: number | null;
  content: number | null;
  competitive: number | null;
  competitiveAvailable: boolean;
  visibilityAvailable: boolean;
  authorityMeasured: boolean;
  strongestCluster?: string;
  hardestHead?: string;
}): WebsiteIntelligenceModel["executiveVerdict"] {
  const overall =
    input.overall != null
      ? `Overall Website Quality is ${input.overall}/100 — readiness and usefulness are measurable; this is not a ranking prediction.`
      : "Overall Website Quality could not be scored from available inputs.";

  let howCompetitive: string;
  if (!input.competitiveAvailable) {
    howCompetitive =
      "Competitor research pack incomplete or missing — competitive position is not fully scored; do not invent SERP leadership claims.";
  } else if (input.competitive != null && input.competitive >= 55) {
    howCompetitive =
      "Content depth and decision tooling often match or exceed many affiliate-style competitors on sampled CRM queries, but marketplace and vendor pages remain formidable on head terms.";
  } else {
    howCompetitive =
      "On-site quality is solid in places, but sampled SERP competitors still lead on media, list volume, or authority-facing formats for several commercial queries.";
  }

  const rankingOutlook = input.authorityMeasured
    ? "Ranking feasibility varies by cluster — prefer evaluation/tools/guides over undifferentiated head terms when authority is constrained."
    : input.strongestCluster
      ? `CRM evaluation and implementation-style opportunities appear more attainable than broad head terms such as “${input.hardestHead ?? "CRM software"}”. External authority not measured — feasibility may be overstated.`
      : "Ranking outlook is cluster-dependent. External authority not measured — feasibility may be overstated.";

  const growthLimits: string[] = [];
  if (input.technical != null && input.technical < 75) {
    growthLimits.push("Technically fair/weak spots still drag confidence");
  } else if (input.technical != null && input.technical >= 75) {
    growthLimits.push("Technically relatively strong but authority-constrained");
  }
  if (!input.visibilityAvailable) {
    growthLimits.push("Search Console / live visibility not connected");
  }
  if (!input.authorityMeasured) {
    growthLimits.push("Backlink authority NOT MEASURED");
  }
  if (input.content != null && input.content >= 80) {
    growthLimits.push(
      "Content depth exceeds many affiliate competitors, but product/industry clusters remain incomplete or non-indexable in places",
    );
  }

  return {
    howGood: overall,
    howCompetitive,
    rankingOutlook,
    growthLimits: growthLimits.join(". ") + ".",
  };
}

export function composeWebsiteIntelligence(input: {
  generatedAt: string;
  mode: WebsiteIntelligenceMode;
  cluster: string;
  overview: WebsiteOverviewModel;
  collected: CollectedIntelligence;
  refreshNotes: string[];
}): WebsiteIntelligenceModel {
  const a: SiteIntelligenceAssessment = input.overview.assessment;
  const gaps = input.collected.json.competitiveGaps;
  const ranking = input.collected.json.rankingOpportunities;
  const searchPerf = input.collected.json.searchPerformance;
  const pack = input.collected.json.competitorPack;

  const competitiveAvailable =
    a.competitiveContentStrength.availability === "scored";
  const visibilityAvailable =
    a.searchVisibility.availability === "scored" &&
    Boolean(searchPerf?.live && !searchPerf?.synthetic);

  const gscConnected =
    searchPerf?.live === true && searchPerf?.synthetic !== true;

  const scorecard: ScorecardCell[] = [
    cell("overall", "Overall Website Quality", a.overallWebsiteQuality.score, "scored", {
      confidence: a.overallWebsiteQuality.confidence.level,
      display:
        a.overallWebsiteQuality.score != null
          ? `${a.overallWebsiteQuality.score} / 100`
          : "—",
    }),
    cell(
      "technical",
      "Technical SEO",
      a.technicalSeoHealth.score,
      a.technicalSeoHealth.availability === "scored" ? "scored" : "unavailable",
      { confidence: a.technicalSeoHealth.confidence.level },
    ),
    cell(
      "content",
      "Content Quality",
      a.contentQuality.score,
      a.contentQuality.availability === "scored" ? "scored" : "unavailable",
      { confidence: a.contentQuality.confidence.level },
    ),
    cell(
      "experience",
      "Website Experience",
      a.websiteExperience.score,
      a.websiteExperience.availability === "scored" ? "scored" : "unavailable",
      { confidence: a.websiteExperience.confidence.level },
    ),
    cell(
      "ecosystem",
      "Content Ecosystem",
      a.contentEcosystemStrength.score,
      a.contentEcosystemStrength.availability === "scored"
        ? "scored"
        : "unavailable",
      { confidence: a.contentEcosystemStrength.confidence.level },
    ),
    cell(
      "competitive",
      "Competitive Strength",
      a.competitiveContentStrength.score,
      competitiveAvailable ? "scored" : "unavailable",
      {
        confidence: a.competitiveContentStrength.confidence.level,
        note: competitiveAvailable
          ? `${pack?.competitorsSampled ?? "?"} competitors sampled`
          : "No competitor pack / research not supplied",
        display: competitiveAvailable
          ? String(a.competitiveContentStrength.score)
          : "UNAVAILABLE",
      },
    ),
    cell(
      "visibility",
      "Search Visibility",
      a.searchVisibility.score,
      visibilityAvailable
        ? "scored"
        : gscConnected
          ? "not-available"
          : "not-connected",
      {
        confidence: a.searchVisibility.confidence.level,
        display: visibilityAvailable
          ? `${a.searchVisibility.score} / 100`
          : gscConnected
            ? "NOT AVAILABLE"
            : "NOT CONNECTED",
        note: searchPerf?.synthetic
          ? "Synthetic search-performance present — not treated as live visibility"
          : undefined,
      },
    ),
  ];

  const hardest = ranking?.topHardest?.[0];
  const bestCluster = ranking?.clusters?.[0];

  const executiveVerdict = buildExecutiveVerdict({
    overall: a.overallWebsiteQuality.score,
    technical: a.technicalSeoHealth.score,
    content: a.contentQuality.score,
    competitive: a.competitiveContentStrength.score,
    competitiveAvailable,
    visibilityAvailable,
    authorityMeasured: ranking?.authorityMeasured === true,
    strongestCluster: bestCluster?.label,
    hardestHead: hardest?.query,
  });

  const missingSources = input.collected.sources.filter(
    (s) => s.status === "missing",
  ).length;
  const confidenceLevel =
    missingSources >= 5 || !competitiveAvailable
      ? "low"
      : missingSources >= 2 || !visibilityAvailable
        ? "medium"
        : "high";

  const doesWell = [
    ...input.overview.strengths.slice(0, 6),
    ...(gaps?.advantages?.slice(0, 4).map((x) => x.title) ?? []),
  ];

  const behindCompetitors = [
    ...(gaps?.competitorStronger?.slice(0, 8).map((x) => x.title) ?? []),
    ...input.overview.weaknesses
      .filter((w) => /competitor|SERP|marketplace/i.test(w))
      .slice(0, 4),
  ];
  if (!behindCompetitors.length) {
    behindCompetitors.push(
      competitiveAvailable
        ? "No major competitor-ahead gaps flagged in the latest gap pack"
        : "Competitor position incompletely measured — cannot claim parity",
    );
  }

  const seoHealth = [
    `Technical SEO Health ${a.technicalSeoHealth.score ?? "—"}/100 (${a.technicalSeoHealth.confidence.level} confidence)`,
    ...extractBulletSection(input.collected.texts.seoHealth, "Findings", 5),
    ...extractTableRows(input.collected.texts.performance, "Findings", 3),
    `Internal linking: ${extractTableRows(input.collected.texts.internalLinks, "Summary", 3).join("; ") || "see internal-linking-latest.md"}`,
  ].filter(Boolean);

  const contentHealth = [
    `Content Quality ${a.contentQuality.score ?? "—"}/100`,
    ...extractBulletSection(
      input.collected.texts.contentIntelligence,
      "Executive summary",
      5,
    ),
    ...extractBulletSection(input.collected.texts.mapCoverage, "Missing / not-yet-implemented", 5),
  ];

  const uxProductHealth = [
    `Website Experience ${a.websiteExperience.score ?? "—"}/100`,
    ...input.overview.differentiators.slice(0, 6),
    ...extractBulletSection(
      input.collected.texts.assetIntelligence,
      "Executive summary",
      4,
    ),
  ];

  const competitorLandscape = [
    pack
      ? `Competitor pack: ${pack.competitorsSampled ?? 0} domains sampled`
      : "Competitor pack: NOT AVAILABLE",
    ...extractTableRows(
      input.collected.texts.serpCompetitors,
      "Top competitor domains",
      8,
    ),
    ...extractBulletSection(
      input.collected.texts.competitiveBenchmark,
      "Top competitor profiles \\(summary\\)",
      5,
    ),
  ];

  const rankingFeasibility = [
    ranking?.authorityMeasured
      ? "Authority metrics measured"
      : "External authority not measured. Ranking feasibility may be overstated.",
    ...(ranking?.topStrongest ?? [])
      .slice(0, 6)
      .map(
        (o) =>
          `${o.query} → ${o.feasibility} (${o.opportunityScore}) — ${o.recommendedAction}`,
      ),
  ];

  const strongestClusters = (ranking?.clusters ?? [])
    .slice(0, 5)
    .map((c) => `${c.label}: ${c.feasibility} (avg ${c.avgScore})`);
  const weakestClusters = [...(ranking?.clusters ?? [])]
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 5)
    .map((c) => `${c.label}: ${c.feasibility} (avg ${c.avgScore})`);

  const closestToRanking = (ranking?.closestToBreakthrough ?? ranking?.topStrongest ?? [])
    .slice(0, 10)
    .map(
      (o) =>
        `${o.query} (${o.targetPage ?? "—"}) — ${o.feasibility} / score ${o.opportunityScore}`,
    );

  const unlikelyWithoutMajorWork = (ranking?.needsSubstantialUpgrade ?? ranking?.topHardest ?? [])
    .slice(0, 10)
    .map(
      (o) =>
        `${o.query} (${o.targetPage ?? "—"}) — ${o.feasibility}`,
    );

  const missingContent = [
    ...(gaps?.missingTopics?.map((t) => t.title) ?? []),
    ...extractBulletSection(
      input.collected.texts.mapCoverage,
      "Missing / not-yet-implemented",
      8,
    ),
  ].slice(0, 15);

  const missingToolsResources = [
    ...(gaps?.missingTools?.map((t) => t.title) ?? []),
    ...(gaps?.missingResources?.map((t) => t.title) ?? []),
  ].slice(0, 15);

  const internalLinkOpportunities = [
    ...extractBulletSection(
      input.collected.texts.internalLinks,
      "Recommendations",
      8,
    ),
    ...extractTableRows(
      input.collected.texts.rankingOpportunities,
      "Top 25 strongest opportunities",
      0,
    ),
  ];
  // Prefer ranking actions' link needs from overview recommendations
  const linkRecs = input.overview.recommendations
    .filter((r) => /link/i.test(r.action) || /link/i.test(r.area))
    .map((r) => r.action);
  internalLinkOpportunities.push(...linkRecs);
  if (internalLinkOpportunities.length === 0) {
    internalLinkOpportunities.push(
      "See internal-linking-latest.md and ranking opportunity internal-link fields",
    );
  }

  const authorityLimitations = [
    "Backlink authority: NOT MEASURED",
    ranking?.authorityMeasured
      ? "Authority data integrated into ranking opportunities"
      : "External authority not measured. Ranking feasibility may be overstated.",
    pack?.backlinkDataAvailable
      ? "Competitor pack includes backlink data"
      : "Competitor pack backlink data: NOT AVAILABLE",
    gscConnected
      ? "Search Console: CONNECTED (approved snapshot)"
      : "Search Console: NOT CONNECTED",
    visibilityAvailable
      ? "Search traffic/visibility: scored from approved performance snapshot"
      : "Search traffic: NOT AVAILABLE",
  ];

  const measurementStatus = [
    {
      label: "Backlink authority",
      status: "NOT MEASURED",
    },
    {
      label: "Search traffic",
      status: visibilityAvailable ? "AVAILABLE (derived)" : "NOT AVAILABLE",
    },
    {
      label: "Search Console",
      status: gscConnected ? "CONNECTED" : "NOT CONNECTED",
    },
    {
      label: "Competitor pack",
      status: pack ? "AVAILABLE" : "NOT AVAILABLE",
    },
  ];

  const topRisks: IntelligenceRisk[] = input.overview.risks
    .slice(0, 10)
    .map((r, i) => ({
      id: `RISK-${String(i + 1).padStart(2, "0")}`,
      priority: i < 3 ? "P0" : i < 7 ? "P1" : "P2",
      area: r.area,
      title: r.title,
      evidence: r.evidence,
    }));

  const topAdvantages = [
    ...input.overview.advantages.slice(0, 6),
    ...input.overview.differentiators.slice(0, 4),
  ].slice(0, 10);

  const topActions: IntelligenceAction[] = [];
  for (const r of input.overview.recommendations.slice(0, 15)) {
    topActions.push({
      id: `WI-${String(topActions.length + 1).padStart(3, "0")}`,
      priority: (r.priority as IntelligenceAction["priority"]) || "P1",
      area: r.area,
      affected: r.relatedReportIds[0] ?? "site",
      problem: r.problem,
      evidence: r.whyItMatters,
      recommendation: r.action,
      impact: /large|unlock|pillar/i.test(r.expectedImpact)
        ? "large"
        : /small/i.test(r.effort)
          ? "small"
          : "medium",
      effort: (["small", "medium", "large"].includes(r.effort)
        ? r.effort
        : "medium") as IntelligenceAction["effort"],
      dependency: r.relatedReportIds.join(", ") || "—",
    });
  }
  for (const a of gaps?.topActions?.slice(0, 12) ?? []) {
    if (topActions.length >= 30) break;
    topActions.push({
      id: `WI-${String(topActions.length + 1).padStart(3, "0")}`,
      priority: "P1",
      area: "Competitive",
      affected: a.page ?? a.title,
      problem: a.why ?? a.title,
      evidence: "Competitive gaps pack",
      recommendation: a.title,
      impact: "medium",
      effort: "medium",
      dependency: "COMPETITIVE-GAPS-LATEST",
    });
  }
  for (const o of ranking?.topStrongest?.slice(0, 8) ?? []) {
    if (topActions.length >= 30) break;
    topActions.push({
      id: `WI-${String(topActions.length + 1).padStart(3, "0")}`,
      priority: o.feasibility.includes("STRONG") ? "P0" : "P1",
      area: "Ranking opportunity",
      affected: o.targetPage ?? o.query,
      problem: `${o.query} feasibility ${o.feasibility}`,
      evidence: `Opportunity score ${o.opportunityScore}`,
      recommendation: o.recommendedAction,
      impact: "medium",
      effort: "medium",
      dependency: "RANKING-OPPORTUNITIES-LATEST",
    });
  }

  const currentSnap: ScorecardSnapshot = {
    generatedAt: input.generatedAt,
    mode: input.mode,
    cluster: input.cluster,
    scores: Object.fromEntries(scorecard.map((c) => [c.id, c.score])),
    displays: Object.fromEntries(scorecard.map((c) => [c.id, c.display])),
  };
  const previous = loadPreviousScorecard();
  const scoreHistory = compareScorecards(previous, currentSnap, {
    overall: "Overall",
    technical: "Technical SEO",
    content: "Content Quality",
    experience: "Website Experience",
    ecosystem: "Content Ecosystem",
    competitive: "Competitive Strength",
    visibility: "Search Visibility",
  });

  return {
    generatedAt: input.generatedAt,
    mode: input.mode,
    cluster: input.cluster,
    agentVersion: "1.0.0",
    executiveVerdict,
    scorecard,
    overallScore: a.overallWebsiteQuality.score,
    confidence: {
      level: confidenceLevel,
      reasons: [
        `${input.collected.sources.filter((s) => s.status === "available").length} sources available`,
        `${missingSources} sources missing`,
        competitiveAvailable
          ? "Competitive strength scored from competitor pack"
          : "Competitive strength unavailable",
        visibilityAvailable
          ? "Search visibility scored from live/import performance"
          : "Search visibility NOT CONNECTED / NOT AVAILABLE",
        "Authority / backlinks NOT MEASURED",
      ],
    },
    doesWell,
    behindCompetitors,
    seoHealth,
    contentHealth,
    uxProductHealth,
    competitorLandscape,
    rankingFeasibility,
    strongestClusters,
    weakestClusters,
    closestToRanking,
    unlikelyWithoutMajorWork,
    missingContent,
    missingToolsResources,
    internalLinkOpportunities: [...new Set(internalLinkOpportunities)].slice(
      0,
      12,
    ),
    authorityLimitations,
    measurementStatus,
    topRisks,
    topAdvantages,
    topActions: topActions.slice(0, 30),
    scoreHistory,
    sources: input.collected.sources.map((s) => ({
      id: s.id,
      path: s.path,
      status: s.status,
      notes: s.notes,
    })),
    refreshNotes: input.refreshNotes,
    disclaimers: [
      "Does not autonomously modify the site, canonicals, robots, rankings, or affiliate links.",
      "Scores are not Google ranking probabilities.",
      "Missing measurement stays explicit — never inferred into fake authority or traffic scores.",
      a.disclaimer,
    ],
  };
}
