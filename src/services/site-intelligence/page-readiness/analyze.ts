import type { FeasibilityBand } from "../ranking-opportunities/types";
import type { PageReadinessContext } from "./load-context";
import type {
  CompetitorBenchmarkRow,
  CompetitorStance,
  ImprovementBucket,
  PageRankingReadinessReport,
  PageReadinessDimension,
  ReadinessConfidence,
} from "./types";

const AUTHORITY_LIMITATION =
  "Backlink / domain authority: NOT MEASURED. Ranking readiness may be overstated vs high-authority SERP incumbents.";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function avg(nums: number[]): number | null {
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function feasibilityFor(score: number): FeasibilityBand {
  if (score >= 80) return "STRONG OPPORTUNITY";
  if (score >= 65) return "GOOD OPPORTUNITY";
  if (score >= 50) return "MODERATE";
  if (score >= 35) return "DIFFICULT";
  return "VERY DIFFICULT";
}

const FEASIBILITY_ORDER: FeasibilityBand[] = [
  "VERY DIFFICULT",
  "DIFFICULT",
  "MODERATE",
  "GOOD OPPORTUNITY",
  "STRONG OPPORTUNITY",
];

function moreConservative(
  a: FeasibilityBand,
  b: FeasibilityBand,
): FeasibilityBand {
  return FEASIBILITY_ORDER.indexOf(a) <= FEASIBILITY_ORDER.indexOf(b) ? a : b;
}

function dim(
  id: PageReadinessDimension["id"],
  label: string,
  score: number | null,
  status: PageReadinessDimension["status"],
  summary: string,
): PageReadinessDimension {
  return { id, label, score, status, summary };
}

function stanceFromDelta(delta: number | null): CompetitorStance {
  if (delta == null) return "unknown";
  if (delta >= 8) return "better";
  if (delta <= -8) return "weaker";
  return "equal";
}

function buildCompetitorRows(
  ctx: PageReadinessContext,
): CompetitorBenchmarkRow[] {
  const rows: CompetitorBenchmarkRow[] = [];
  for (const bench of ctx.relatedBenchmarks) {
    const sg = bench.rows.find((r) =>
      /softwareglimpse/i.test(r.domain),
    );
    const competitors = bench.rows.filter(
      (r) => !/softwareglimpse/i.test(r.domain),
    );
    for (const c of competitors.slice(0, 5)) {
      const keys = [
        "content-depth",
        "original-value",
        "evidence",
        "tools",
        "product-screenshots",
        "comparison-depth",
        "freshness",
        "video",
      ] as const;
      const sgBetter: string[] = [];
      const equal: string[] = [];
      const weaker: string[] = [];
      const deltas: number[] = [];
      for (const k of keys) {
        const a = sg?.dimensions[k] ?? null;
        const b = c.dimensions[k] ?? null;
        if (a == null || b == null) continue;
        const d = a - b;
        deltas.push(d);
        if (d >= 8) sgBetter.push(k);
        else if (d <= -8) weaker.push(k);
        else equal.push(k);
      }
      const mean = avg(deltas);
      rows.push({
        url: c.url,
        domain: c.domain,
        query: bench.query,
        stance: stanceFromDelta(mean),
        sgBetter,
        equal,
        weaker,
        notes: c.notes.slice(0, 2),
      });
    }
  }

  // Fallback: SERP-ish gaps without dimension rows
  if (!rows.length && ctx.relatedSeeds.length) {
    for (const seed of ctx.relatedSeeds.slice(0, 1)) {
      rows.push({
        url: "—",
        domain: "(see SERP-COMPETITORS-LATEST)",
        query: seed.query,
        stance: "unknown",
        sgBetter: [],
        equal: [],
        weaker: [],
        notes: [
          "No page-matched competitive benchmark rows — refresh `npm run site:competitive-benchmark`",
        ],
      });
    }
  }
  return rows.slice(0, 12);
}

export function analyzePageRankingReadiness(
  ctx: PageReadinessContext,
  generatedAt: string,
): PageRankingReadinessReport {
  const { page, cq } = ctx;
  const primaryOpp = ctx.relatedOpportunities[0];
  const targetQueries = [
    ...new Set([
      ...ctx.relatedSeeds.map((s) => s.query),
      ...ctx.relatedOpportunities.map((o) => o.query),
      ...ctx.relatedBenchmarks.map((b) => b.query),
    ]),
  ].slice(0, 12);

  const targetIntent =
    primaryOpp?.intent ??
    ctx.relatedSeeds[0]?.intent ??
    (page.pageType === "resource" || page.pageType === "tool"
      ? "tool-resource / commercial-investigation"
      : page.pageType === "best"
        ? "commercial"
        : page.pageType === "product"
          ? "product review"
          : "informational / commercial");

  const dimensions: PageReadinessDimension[] = [];

  // Intent
  const intentScore = primaryOpp
    ? (primaryOpp.dimensions.find((d) => d.id === "intent-match")?.score ?? 70)
    : targetQueries.length
      ? 72
      : page.existsInCatalog
        ? 55
        : 35;
  dimensions.push(
    dim(
      "target-intent",
      "Target intent",
      intentScore,
      "scored",
      `Primary intent: ${targetIntent}`,
    ),
  );

  // Query coverage
  const queryScore = clamp(
    Math.min(95, 40 + targetQueries.length * 12 + (primaryOpp ? 10 : 0)),
  );
  dimensions.push(
    dim(
      "query-coverage",
      "Likely target query set",
      queryScore,
      targetQueries.length ? "scored" : "not-available",
      targetQueries.length
        ? `${targetQueries.length} related queries mapped`
        : "No related query seeds/opportunities mapped to this route",
    ),
  );

  // Technical
  const techPenalty = ctx.technicalFindings.length * 8;
  const techScore = clamp(88 - techPenalty);
  dimensions.push(
    dim(
      "technical-status",
      "Technical status",
      techScore,
      "scored",
      ctx.technicalFindings.length
        ? `${ctx.technicalFindings.length} SEO finding(s) reference this page`
        : "No page-specific SEO findings in latest issues snapshot",
    ),
  );

  // Indexability
  let indexScore: number | null = null;
  let indexStatus: PageReadinessDimension["status"] = "not-available";
  let indexSummary = page.indexableReason;
  if (page.indexableHint === true) {
    indexScore = 90;
    indexStatus = "scored";
  } else if (page.indexableHint === false) {
    indexScore = 15;
    indexStatus = "scored";
    indexSummary = `Likely non-indexable — ${page.indexableReason}`;
  } else if (cq) {
    indexScore = 70;
    indexStatus = "scored";
    indexSummary =
      "Present in CQ scores (implies audited page) — entity indexability not fully verified";
  }
  dimensions.push(
    dim("indexability", "Indexability", indexScore, indexStatus, indexSummary),
  );

  // Content quality
  dimensions.push(
    dim(
      "content-quality",
      "Content quality",
      cq?.score ?? null,
      cq ? "scored" : "not-available",
      cq
        ? `CQ ${cq.score}/100 (${cq.band}, ${cq.pageType}, ${cq.priority})`
        : "No CQ score in scores-latest.json for this route",
    ),
  );

  // Depth / original / evidence / media / tools from benchmark SG row or CQ proxies
  const sgRow = ctx.relatedBenchmarks[0]?.rows.find((r) =>
    /softwareglimpse/i.test(r.domain),
  );
  const depth =
    sgRow?.dimensions["content-depth"] ??
    (cq ? clamp(cq.score - 5) : null);
  const original =
    sgRow?.dimensions["original-value"] ??
    (page.pageType === "resource" || page.pageType === "tool" ? 78 : cq ? 65 : null);
  const evidence =
    sgRow?.dimensions.evidence ??
    primaryOpp?.dimensions.find((d) => d.id === "evidence-quality")?.score ??
    (cq ? clamp(cq.score - 10) : null);
  const media =
    sgRow?.dimensions["product-screenshots"] ??
    sgRow?.dimensions.video ??
    (page.pageType === "product" ? 55 : 40);
  const toolsRes =
    sgRow?.dimensions.tools ??
    sgRow?.dimensions["templates-resources"] ??
    (page.pageType === "resource" || page.pageType === "tool"
      ? 82
      : page.relatedToolIds.length
        ? 70
        : 35);

  dimensions.push(
    dim(
      "content-depth",
      "Content depth",
      depth,
      depth != null ? "scored" : "not-available",
      depth != null
        ? "From competitive benchmark SG row or CQ proxy"
        : "Depth not measured for this page",
    ),
  );
  dimensions.push(
    dim(
      "original-value",
      "Original value",
      original,
      original != null ? "scored" : "not-available",
      page.pageType === "resource"
        ? "Resources/tools usually carry original utility (downloadable / interactive)"
        : "Original-value proxy from benchmark or page type",
    ),
  );
  dimensions.push(
    dim(
      "evidence",
      "Evidence",
      evidence,
      evidence != null ? "scored" : "not-available",
      "Methodology / sources / examples depth proxy",
    ),
  );
  dimensions.push(
    dim(
      "media",
      "Media",
      media,
      "scored",
      ctx.assetNotes[0] ?? "Media signals from benchmark / page-type proxy",
    ),
  );
  dimensions.push(
    dim(
      "tools-resources",
      "Tools / resources",
      toolsRes,
      "scored",
      page.relatedToolIds.length
        ? `Related tools: ${page.relatedToolIds.join(", ")}`
        : "Tool/resource utility proxy",
    ),
  );

  // Internal links + cluster
  const linkOpp =
    primaryOpp?.dimensions.find((d) => d.id === "internal-link-support")
      ?.score ?? null;
  const linkScore =
    linkOpp ??
    (ctx.linkingNotes.some((n) => /appears in linking/i.test(n)) ? 70 : 55);
  dimensions.push(
    dim(
      "internal-links",
      "Internal links",
      linkScore,
      "scored",
      ctx.linkingNotes.join("; "),
    ),
  );

  const clusterScore = clamp(
    45 +
      ctx.pageGaps.advantages.length * 8 +
      ctx.relatedOpportunities.length * 6 +
      (cq && cq.score >= 85 ? 15 : 0),
  );
  dimensions.push(
    dim(
      "cluster-support",
      "Cluster support",
      clusterScore,
      "scored",
      `${ctx.relatedOpportunities.length} ranking opportunities + ${ctx.pageGaps.advantages.length} gap advantages tied to page`,
    ),
  );

  // Freshness
  const freshness =
    sgRow?.dimensions.freshness ??
    primaryOpp?.dimensions.find((d) => d.id === "current-page-quality")?.score ??
    (cq ? 70 : null);
  dimensions.push(
    dim(
      "freshness",
      "Freshness",
      freshness,
      freshness != null ? "scored" : "not-available",
      "Freshness proxy — not a crawl date claim",
    ),
  );

  // Search performance
  let searchScore: number | null = null;
  let searchStatus: PageReadinessDimension["status"] = "not-connected";
  let searchSummary = "Search Console: NOT CONNECTED";
  if (ctx.searchPerf?.live) {
    if (ctx.searchPerf.rows.length) {
      const best = [...ctx.searchPerf.rows].sort(
        (a, b) => a.position - b.position,
      )[0]!;
      searchScore = clamp(100 - best.position * 4 + Math.min(20, best.impressions / 50));
      searchStatus = "scored";
      searchSummary = `${ctx.searchPerf.rows.length} live/import row(s); best avg position ~${best.position.toFixed(1)} (period average, not fixed SERP rank)`;
    } else {
      searchScore = null;
      searchStatus = "not-available";
      searchSummary =
        "Search Console connected/imported but no rows for this page — Search traffic: NOT AVAILABLE for route";
    }
  } else if (ctx.searchPerf?.synthetic) {
    searchStatus = "not-connected";
    searchSummary =
      "Synthetic search-performance present — NOT treated as live SoftwareGlimpse visibility";
  }
  dimensions.push(
    dim(
      "search-performance",
      "Current search performance",
      searchScore,
      searchStatus,
      searchSummary,
    ),
  );

  // SERP / competitor quality
  const competitorStrengths = ctx.relatedOpportunities
    .map((o) => o.competitorStrength)
    .filter((n): n is number => n != null);
  const compAvg = avg(competitorStrengths);
  const serpScore =
    ctx.relatedBenchmarks.length || ctx.relatedSeeds.length
      ? clamp(70 - (compAvg != null ? (compAvg - 50) * 0.4 : 0))
      : null;
  dimensions.push(
    dim(
      "serp-competitors",
      "SERP competitors",
      serpScore,
      serpScore != null ? "scored" : "not-available",
      ctx.relatedBenchmarks.length
        ? `${ctx.relatedBenchmarks.length} benchmark query(ies) with competitor rows`
        : "No SERP/benchmark pack matched to this page",
    ),
  );

  const sgOverall = avg(
    Object.values(sgRow?.dimensions ?? {}).filter(
      (n): n is number => typeof n === "number",
    ),
  );
  const competitorPageScore =
    sgOverall != null && compAvg != null
      ? clamp(50 + (sgOverall - compAvg))
      : sgOverall;
  dimensions.push(
    dim(
      "competitor-page-quality",
      "Competitor page quality (relative)",
      competitorPageScore,
      competitorPageScore != null ? "scored" : "not-available",
      competitorPageScore != null
        ? "Relative observable page quality vs sampled competitors"
        : "Insufficient competitor page observations for this route",
    ),
  );

  // Authority — never invent a score
  dimensions.push(
    dim(
      "authority-limitation",
      "Authority limitation",
      null,
      "not-measured",
      AUTHORITY_LIMITATION,
    ),
  );

  // Weighted readiness (exclude authority null)
  const weights: Partial<Record<PageReadinessDimension["id"], number>> = {
    "target-intent": 0.1,
    "query-coverage": 0.08,
    "technical-status": 0.06,
    indexability: 0.08,
    "content-quality": 0.14,
    "content-depth": 0.08,
    "original-value": 0.08,
    evidence: 0.07,
    media: 0.05,
    "tools-resources": 0.06,
    "internal-links": 0.06,
    "cluster-support": 0.06,
    freshness: 0.04,
    "search-performance": 0.04,
    "serp-competitors": 0.05,
    "competitor-page-quality": 0.05,
  };

  let weightSum = 0;
  let scoreSum = 0;
  for (const d of dimensions) {
    const w = weights[d.id];
    if (w == null || d.score == null) continue;
    weightSum += w;
    scoreSum += d.score * w;
  }
  let rankingReadiness = weightSum > 0 ? clamp(scoreSum / weightSum) : 0;

  // Hard caps
  if (page.indexableHint === false) {
    rankingReadiness = Math.min(rankingReadiness, 35);
  }
  if (!page.existsInCatalog && !cq) {
    rankingReadiness = Math.min(rankingReadiness, 40);
  }
  if (primaryOpp?.opportunityScore != null) {
    // Blend slightly toward known opportunity score
    rankingReadiness = clamp(rankingReadiness * 0.7 + primaryOpp.opportunityScore * 0.3);
  }

  const feasibility = primaryOpp
    ? moreConservative(
        feasibilityFor(rankingReadiness),
        primaryOpp.feasibility,
      )
    : feasibilityFor(rankingReadiness);

  const missingCritical = [
    !cq && "CQ score missing",
    !ctx.relatedBenchmarks.length && "competitor benchmark missing for page",
    searchStatus === "not-connected" && "Search Console NOT CONNECTED",
    "authority NOT MEASURED",
  ].filter(Boolean) as string[];

  let confidence: ReadinessConfidence = "medium";
  const confidenceReasons: string[] = [];
  if (cq && ctx.relatedBenchmarks.length && ctx.relatedOpportunities.length) {
    confidence = "high";
    confidenceReasons.push("CQ + ranking opportunities + competitor benchmark present");
  } else if (!cq || missingCritical.length >= 3) {
    confidence = "low";
    confidenceReasons.push(`Sparse page evidence: ${missingCritical.join("; ")}`);
  } else {
    confidenceReasons.push("Partial packs — readiness is relative, not a ranking forecast");
  }
  confidenceReasons.push(AUTHORITY_LIMITATION);

  const strong: string[] = [];
  const weak: string[] = [];
  if (cq && cq.score >= 85) strong.push(`excellent content quality (CQ ${cq.score})`);
  if (intentScore >= 80) strong.push("excellent intent match");
  if ((toolsRes ?? 0) >= 70) {
    strong.push(
      page.pageType === "resource"
        ? "original downloadable / resource utility"
        : "interactive tools/resources advantage",
    );
  }
  if (clusterScore >= 70) strong.push("strong related CRM cluster support");
  if ((original ?? 0) >= 70) strong.push("original-value signals");
  if (pageGapsAdvantages(ctx)) {
    strong.push(...ctx.pageGaps.advantages.slice(0, 2).map((a) => a.title));
  }
  if (ctx.searchPerf?.live && ctx.searchPerf.rows.length) {
    strong.push("existing search traction rows for this page");
  }

  if (!ctx.searchPerf?.live || !ctx.searchPerf.rows.length) {
    weak.push("no existing live rankings / Search Console traction for this page");
  }
  if ((media ?? 0) < 55) weak.push("page lacks strong official video/demo / media evidence");
  if ((linkScore ?? 0) < 60) weak.push("internal-link support looks thin or unmeasured at page level");
  if (ctx.pageGaps.weaker.length) {
    weak.push(...ctx.pageGaps.weaker.slice(0, 2).map((w) => w.title));
  }
  if (compAvg != null && compAvg >= 65) {
    weak.push(
      `sampled SERP competitors look strong on observable page quality (avg ~${Math.round(compAvg)})`,
    );
  }
  weak.push("top competitors likely have stronger external authority (NOT MEASURED — assumed risk)");
  if (cq && cq.score < 80) weak.push(`content quality below strong band (CQ ${cq.score})`);
  if (page.indexableHint === false) weak.push("indexability risk — page may be noindex/unpublished");

  const improvements = buildImprovements(ctx, {
    cqScore: cq?.score ?? null,
    media: media ?? null,
    evidence: evidence ?? null,
    linkScore,
    toolsRes: toolsRes ?? null,
    rankingReadiness,
  });

  const competitors = buildCompetitorRows(ctx);

  return {
    generatedAt,
    agentVersion: "1.0.0",
    route: page.route,
    slug: page.slug,
    contentId: page.contentId,
    title: page.title ?? cq?.title ?? null,
    pageType: page.pageType ?? cq?.pageType ?? null,
    existsInCatalog: page.existsInCatalog,
    existsInScores: Boolean(cq),
    targetIntent,
    targetQueries,
    rankingReadiness,
    feasibility,
    confidence,
    confidenceReasons,
    strong: [...new Set(strong)].slice(0, 10),
    weak: [...new Set(weak)].slice(0, 10),
    dimensions,
    improvements,
    competitors,
    authorityLimitation: AUTHORITY_LIMITATION,
    searchPerformanceNote: searchSummary,
    relatedOpportunityScores: ctx.relatedOpportunities.slice(0, 8).map((o) => ({
      query: o.query,
      opportunityScore: o.opportunityScore,
      feasibility: o.feasibility,
    })),
    sources: ctx.sources,
    disclaimers: [
      "Ranking readiness is a local relative assessment — not a Google ranking probability or timeline.",
      "Does not promise rankings or claim the page will outrank named competitors.",
      "Does not autonomously modify the page, canonicals, robots, or affiliate links.",
      AUTHORITY_LIMITATION,
    ],
  };
}

function pageGapsAdvantages(ctx: PageReadinessContext): boolean {
  return ctx.pageGaps.advantages.length > 0;
}

function buildImprovements(
  ctx: PageReadinessContext,
  scores: {
    cqScore: number | null;
    media: number | null;
    evidence: number | null;
    linkScore: number;
    toolsRes: number | null;
    rankingReadiness: number;
  },
): ImprovementBucket {
  const mustDo: string[] = [];
  const shouldDo: string[] = [];
  const optional: string[] = [];
  const avoid: string[] = [];

  if (ctx.page.indexableHint === false) {
    mustDo.push("Resolve indexability / publish gates before investing in SERP competition");
  }
  if (scores.cqScore != null && scores.cqScore < 80) {
    mustDo.push(
      "Raise content quality into the strong band (decision criteria, evidence, modules)",
    );
  }
  if (scores.evidence != null && scores.evidence < 55) {
    mustDo.push("Add methodology, primary sources, and concrete worked examples");
  }
  for (const o of ctx.relatedOpportunities.slice(0, 2)) {
    for (const r of o.requiredImprovements.slice(0, 2)) {
      mustDo.push(r);
    }
  }

  if (scores.media != null && scores.media < 60) {
    shouldDo.push("Add official product video / demo evidence where claims need proof");
  }
  if (scores.linkScore < 65) {
    shouldDo.push(
      "Add meaningful contextual internal links from cluster hubs (best, guides, comparisons, software)",
    );
  }
  for (const link of ctx.relatedOpportunities[0]?.internalLinksRequired.slice(0, 3) ?? []) {
    shouldDo.push(link);
  }
  if (scores.toolsRes != null && scores.toolsRes < 55) {
    shouldDo.push("Attach interactive tools or downloadable resources that change buyer decisions");
  }
  shouldDo.push("Refresh competitor feature/pricing checks before major content upgrades");

  optional.push("Capture approved Search Console import to measure near-wins for this URL");
  optional.push("Integrate backlink/authority measurement before prioritizing head-term investment");
  for (const s of ctx.relatedOpportunities[0]?.supportingContentNeeded.slice(0, 2) ?? []) {
    optional.push(s);
  }

  avoid.push("Do not promise or imply guaranteed rankings in on-page copy");
  avoid.push("Do not copy competitor feature lists without user-decision value");
  avoid.push("Do not chase undifferentiated head terms solely with thin listicle expansion");
  for (const o of ctx.relatedOpportunities.filter((x) => x.avoid).slice(0, 2)) {
    avoid.push(o.avoidReason ?? `Avoid low-ROI pursuit of “${o.query}”`);
  }

  if (scores.rankingReadiness >= 80 && mustDo.length === 0) {
    mustDo.push("Protect advantage: keep evidence fresh and cluster links healthy");
  }

  return {
    mustDo: [...new Set(mustDo)].slice(0, 8),
    shouldDo: [...new Set(shouldDo)].slice(0, 8),
    optional: [...new Set(optional)].slice(0, 8),
    avoid: [...new Set(avoid)].slice(0, 8),
  };
}
