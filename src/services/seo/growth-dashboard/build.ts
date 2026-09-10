import type {
  ConnectionStatus,
  DataValidity,
  GrowthDashboardReport,
  MetricValue,
  NorthStarObjective,
  NorthStarObjectiveStatus,
  StatusConfidence,
  TrendAvailability,
  WeeklyView,
} from "./types";
import { buildOrganicSearchSection } from "./organic";
import { buildIndexingSection } from "./indexing";
import { buildOpportunitySection } from "./sections";
import { buildContentEstateSection } from "./estate";
import { buildImprovementVelocitySection } from "./velocity";
import {
  buildAiVisibilitySection,
  buildAuthoritySection,
  buildCommercialSection,
  buildContentQualitySection,
  buildDistributionSection,
  buildResearchSection,
  listRecentlyCompletedTests,
} from "./quality-authority";
import { firstExisting, readJsonIfExists } from "./io";
import { validityAllowsNorthStar } from "./validity";
import path from "node:path";
import { GROWTH_DASHBOARD_VERSION } from "./types";

function metricNumber(m: MetricValue): number | null {
  return m.kind === "number" || m.kind === "percent" ? m.value : null;
}

function objectiveStatus(opts: {
  connected: boolean;
  /** Fixture/sample must not drive on_track. */
  real: boolean;
  onTrackIf: boolean;
  buildingIf: boolean;
  /** When true, prefer insufficient_trend over on_track/building directional claims. */
  insufficientTrend?: boolean;
}): NorthStarObjectiveStatus {
  if (!opts.connected || !opts.real) {
    if (!opts.connected) return "not_connected";
    // Connected but fixture — treat as building at best, never on_track
    return opts.buildingIf ? "building" : "not_connected";
  }
  if (opts.insufficientTrend) return "insufficient_trend";
  if (opts.onTrackIf) return "on_track";
  if (opts.buildingIf) return "building";
  return "behind";
}

function trendAvailabilityFrom(
  status: ConnectionStatus | "not_connected",
): TrendAvailability {
  if (status === "connected") return "available";
  if (status === "partial") return "partial";
  return "unavailable";
}

function confidenceFor(opts: {
  real: boolean;
  trend: TrendAvailability;
  strongEvidence: boolean;
}): StatusConfidence {
  if (!opts.real) return "low";
  if (opts.trend === "unavailable") return "low";
  if (opts.trend === "partial") return "medium";
  return opts.strongEvidence ? "high" : "medium";
}

/**
 * North-star objectives for PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.
 * No single synthetic score. Impressions / Top-10 counts alone never imply on_track.
 */
export function buildScorecard(
  report: Omit<
    GrowthDashboardReport,
    "scorecard" | "weekly" | "sourceInventory" | "complianceNotes" | "strategyLabel"
  >,
): NorthStarObjective[] {
  const org = report.organicSearch;
  const estate = report.contentEstate;
  const velocity = report.improvementVelocity;
  const quality = report.contentQuality;
  const auth = report.authority;
  const gscReal = validityAllowsNorthStar(org.validity);
  const evidenceReal = validityAllowsNorthStar(quality.validity);
  const authReal = validityAllowsNorthStar(auth.validity);

  const clicks = metricNumber(org.traffic.organicClicks);
  const top10 = metricNumber(org.ranking.top10);
  const top10Clicks = metricNumber(org.pageOneQuality.top10Clicks);
  const top10Share = metricNumber(org.pageOneQuality.top10ShareOfImpressions);
  const top10WithImp100 = metricNumber(
    org.pageOneQuality.top10PagesWith100PlusImpressions,
  );
  const top10WithClicks = metricNumber(
    org.pageOneQuality.top10PagesWithClicks,
  );
  const top10Commercial = metricNumber(
    org.pageOneQuality.top10CommercialPages,
  );
  const commercialShare = metricNumber(org.pageOneQuality.commercialTop10Share);
  const siteCtr = metricNumber(org.pageOneQuality.siteCtr);
  const indexable = estate.totals.indexable;
  const ready = estate.totals.readyForPromotion;
  const promoted = metricNumber(velocity.pagesPromotedToIndexable);
  const handsOn = metricNumber(quality.handsOnTested);
  const dataVerified = metricNumber(quality.dataVerified);
  const linksEarned = metricNumber(auth.linksEarned);

  const gscTrend = trendAvailabilityFrom(org.trend.status);
  /** Production GSC exports usually lack a paired prior period. */
  const gscTrendMissing = gscTrend === "unavailable";
  /**
   * Page-one quality mix — never on_track from avg-position≤10 count alone.
   * Requires impressions/clicks in Top 10, CTR, commercial intent, share, and trend.
   */
  const pageOneQualityOk = Boolean(
    gscReal &&
      top10 != null &&
      top10 >= 30 &&
      (top10Clicks ?? 0) >= 20 &&
      (top10Share ?? 0) >= 15 &&
      (top10WithImp100 ?? 0) >= 10 &&
      (top10WithClicks ?? 0) >= 10 &&
      (top10Commercial ?? 0) >= 5 &&
      (commercialShare ?? 0) >= 25 &&
      (siteCtr ?? 0) >= 1 &&
      (clicks ?? 0) >= 50,
  );

  return [
    {
      id: "high_quality_pages",
      label: "More high-quality pages",
      status: objectiveStatus({
        connected: estate.status !== "not_connected",
        real: true,
        onTrackIf: indexable >= 1000 && estate.totals.improve < indexable * 4,
        buildingIf: indexable > 0,
      }),
      confidence: confidenceFor({
        real: true,
        trend: "unavailable",
        strongEvidence: indexable >= 1000,
      }),
      dataFreshness: report.improvementVelocity.windowLabel,
      trendAvailability: "unavailable",
      summary: `Indexable ${indexable.toLocaleString()} · Improve ${estate.totals.improve.toLocaleString()} · Ready ${ready.toLocaleString()}`,
      evidence: estate.notes.slice(0, 2),
      gaps: [
        estate.totals.improve > indexable
          ? "Large IMPROVE backlog vs indexable set"
          : "",
      ].filter(Boolean),
    },
    {
      id: "promoted_pages",
      label: "More promoted pages",
      status: objectiveStatus({
        connected: velocity.status !== "not_connected",
        real: true,
        onTrackIf: (promoted ?? 0) >= 3,
        buildingIf: ready > 0 || (promoted ?? 0) > 0,
      }),
      confidence: confidenceFor({
        real: true,
        trend: "partial",
        strongEvidence: (promoted ?? 0) >= 3,
      }),
      dataFreshness: velocity.windowLabel,
      trendAvailability: "partial",
      summary:
        promoted != null
          ? `Promoted this week: ${promoted} · Ready for promotion: ${ready}`
          : `Promotion velocity not connected · Ready for promotion: ${ready}`,
      evidence: velocity.notes.slice(0, 2),
      gaps: [
        promoted == null
          ? "No promotion history in content-lifecycle store"
          : (promoted ?? 0) === 0
            ? "No promotions recorded in the last 7 days"
            : "",
      ].filter(Boolean),
    },
    {
      id: "page_one_rankings",
      label: "More page-one rankings",
      status: objectiveStatus({
        connected: org.status !== "not_connected",
        real: gscReal,
        // Never on_track from Top-10 count alone; require trend + quality mix.
        onTrackIf: Boolean(pageOneQualityOk && !gscTrendMissing),
        buildingIf: Boolean(
          gscReal && top10 != null && top10 > 0 && !gscTrendMissing,
        ),
        insufficientTrend: Boolean(
          gscReal && top10 != null && top10 > 0 && gscTrendMissing,
        ),
      }),
      confidence: confidenceFor({
        real: gscReal,
        trend: gscTrend,
        strongEvidence: pageOneQualityOk,
      }),
      dataFreshness: org.dataThroughDate,
      trendAvailability: gscTrend,
      summary: gscReal
        ? `Top 10: ${top10 ?? "—"} · clicks ${top10Clicks ?? "—"} · share ${top10Share ?? "—"}% · commercial ${top10Commercial ?? "—"} · CTR ${siteCtr ?? "—"}%`
        : org.validity === "FIXTURE"
          ? "GSC fixture — excluded from production ranking status"
          : "GSC ranking bands not connected",
      evidence: [
        org.sourceLabel ? `Source: ${org.sourceLabel}` : "No GSC source",
        `Validity: ${org.validity}`,
        `Top-10 ≥100 imp: ${top10WithImp100 ?? "—"} · with clicks: ${top10WithClicks ?? "—"} · commercial: ${top10Commercial ?? "—"}`,
        org.pageOneQuality.note,
        org.trend.note,
      ],
      gaps: [
        !gscReal ? `Organic validity is ${org.validity}` : "",
        gscTrendMissing
          ? "No historical trend — status stays insufficient_trend (not on_track)"
          : "",
        (top10 ?? 0) < 30 ? "Fewer than 30 pages in top-10 band" : "",
        (top10Clicks ?? 0) < 20 ? "Top-10 click volume still thin" : "",
        (top10Share ?? 0) < 15
          ? "Low share of impressions occurring in Top 10"
          : "",
        (top10WithImp100 ?? 0) < 10
          ? "Few Top-10 pages have ≥100 impressions"
          : "",
        (top10WithClicks ?? 0) < 10
          ? "Few Top-10 pages earn clicks"
          : "",
        (top10Commercial ?? 0) < 5
          ? "Few commercial/search-intent pages in Top 10"
          : "",
        (commercialShare ?? 0) < 25
          ? "Top-10 mix is light on commercial/search-intent URLs"
          : "",
        (siteCtr ?? 0) < 1 ? "Site CTR still below a decision-useful floor" : "",
      ].filter(Boolean),
    },
    {
      id: "organic_clicks",
      label: "More clicks",
      status: objectiveStatus({
        connected: org.status !== "not_connected",
        real: gscReal,
        onTrackIf: Boolean(
          gscReal &&
            clicks != null &&
            clicks >= 100 &&
            !gscTrendMissing &&
            (org.trend.clicksDeltaPct == null ||
              org.trend.clicksDeltaPct >= 0),
        ),
        buildingIf: Boolean(
          gscReal &&
            clicks != null &&
            clicks >= 25 &&
            !gscTrendMissing,
        ),
        insufficientTrend: Boolean(
          gscReal && clicks != null && clicks > 0 && gscTrendMissing,
        ),
      }),
      confidence: confidenceFor({
        real: gscReal,
        trend: gscTrend,
        strongEvidence: (clicks ?? 0) >= 100,
      }),
      dataFreshness: org.dataThroughDate,
      trendAvailability: gscTrend,
      summary: gscReal
        ? `Organic clicks ${clicks ?? "—"} · pages with clicks ${metricNumber(org.traffic.pagesWithClicks) ?? "—"}`
        : `Traffic not counted for north-star (${org.validity})`,
      evidence: [
        `CTR opportunities listed: ${org.ctrDetail.highImpressionLowCtr.length}`,
        org.ctrDetail.note,
        org.trend.note,
        (clicks ?? 0) < 50
          ? "Absolute click volume is too thin to frame as strong performance"
          : "Click volume assessed with trend when available",
      ],
      gaps: [
        !gscReal ? "Need REAL GSC Performance export" : "",
        gscTrendMissing
          ? "No period-over-period trend — avoid strong directional click labels"
          : "",
        gscReal && (clicks ?? 0) < 25
          ? "Click volume far too low to call building or on_track"
          : "",
        gscReal && (clicks ?? 0) >= 25 && (clicks ?? 0) < 100
          ? "Click volume still low for on_track"
          : "",
      ].filter(Boolean),
    },
    {
      id: "evidence",
      label: "More evidence",
      status: objectiveStatus({
        connected: quality.status !== "not_connected",
        real: evidenceReal,
        onTrackIf: Boolean(handsOn != null && handsOn >= 5),
        buildingIf: Boolean(
          (handsOn != null && handsOn > 0) ||
            (dataVerified != null && dataVerified > 0),
        ),
      }),
      confidence: confidenceFor({
        real: evidenceReal,
        trend:
          quality.evidenceTrend.length > 1 ? "partial" : "unavailable",
        strongEvidence: (handsOn ?? 0) >= 5,
      }),
      dataFreshness: quality.evidenceTrend.at(-1)?.at ?? null,
      trendAvailability:
        quality.evidenceTrend.length > 1 ? "partial" : "unavailable",
      summary: `Hands-on ${handsOn ?? 0} · data-verified ${dataVerified ?? 0} · research-based ${metricNumber(quality.researchOnly) ?? 0}`,
      evidence: [
        ...quality.notes.slice(0, 1),
        quality.evidenceTrend.length > 1
          ? `Trend points: ${quality.evidenceTrend.map((t) => t.label).join(" → ")}`
          : "No prior evidence snapshot for delta yet",
      ],
      gaps: [
        (handsOn ?? 0) === 0 ? "No completed hands-on test sessions counted" : "",
      ].filter(Boolean),
    },
    {
      id: "relevant_links",
      label: "More relevant links",
      status: objectiveStatus({
        connected: auth.status !== "not_connected",
        real: authReal,
        onTrackIf: Boolean(authReal && linksEarned != null && linksEarned >= 3),
        buildingIf: Boolean(
          auth.status === "connected" || auth.status === "partial",
        ),
      }),
      confidence: confidenceFor({
        real: authReal,
        trend: "unavailable",
        strongEvidence: (linksEarned ?? 0) >= 3,
      }),
      dataFreshness: null,
      trendAvailability: "unavailable",
      summary: authReal
        ? `Links earned ${linksEarned ?? 0} · prospects ${metricNumber(auth.qualityProspects) ?? "—"}`
        : `Authority validity ${auth.validity} — fixture/sample links do not count`,
      evidence: auth.notes.slice(0, 2),
      gaps: [
        !authReal ? `Backlink/PR validity is ${auth.validity}` : "",
        (linksEarned ?? 0) === 0 ? "No LINK_EARNED records yet" : "",
      ].filter(Boolean),
    },
  ];
}

export function buildWeeklyView(
  report: Pick<
    GrowthDashboardReport,
    | "organicSearch"
    | "opportunity"
    | "authority"
    | "contentQuality"
    | "research"
    | "aiVisibility"
    | "indexing"
    | "improvementVelocity"
    | "contentEstate"
  >,
  cwd = process.cwd(),
): WeeklyView {
  const improved: string[] = [];
  const declined: string[] = [];
  const topActions: string[] = [];
  const majorPricingChanges: string[] = [];
  const linksEarned: string[] = [];

  const trend = report.organicSearch.trend;
  if (trend.status !== "not_connected" && validityAllowsNorthStar(report.organicSearch.validity)) {
    if (trend.clicksDeltaPct != null && trend.clicksDeltaPct > 0) {
      improved.push(`Clicks ${trend.clicksDeltaPct.toFixed(1)}% vs prior period`);
    }
    if (trend.impressionsDeltaPct != null && trend.impressionsDeltaPct > 0) {
      improved.push(
        `Impressions ${trend.impressionsDeltaPct.toFixed(1)}% vs prior period (discovery only)`,
      );
    }
    if (trend.clicksDeltaPct != null && trend.clicksDeltaPct < 0) {
      declined.push(`Clicks ${trend.clicksDeltaPct.toFixed(1)}% vs prior period`);
    }
    if (trend.positionDelta != null && trend.positionDelta > 0.5) {
      declined.push(
        `Average position worsened by ${trend.positionDelta.toFixed(1)} (higher = worse)`,
      );
    }
    if (trend.positionDelta != null && trend.positionDelta < -0.5) {
      improved.push(
        `Average position improved by ${Math.abs(trend.positionDelta).toFixed(1)}`,
      );
    }
  } else {
    improved.push(
      "Trend comparison not connected or GSC not REAL — import a prior live GSC period.",
    );
  }

  const promoted = metricNumber(report.improvementVelocity.pagesPromotedToIndexable);
  if (promoted != null && promoted > 0) {
    improved.push(`Promoted ${promoted} page(s) to indexable this week`);
  }
  const qUp = metricNumber(report.improvementVelocity.pagesQualityScoreImproved);
  if (qUp != null && qUp > 0) {
    improved.push(`Quality score improved on ${qUp} page(s)`);
  }

  if (
    report.aiVisibility.status === "connected" &&
    validityAllowsNorthStar(report.aiVisibility.validity)
  ) {
    improved.push(
      `AI Visibility REAL (${metricNumber(report.aiVisibility.citations) ?? 0} citations)`,
    );
  } else if (report.aiVisibility.validity === "FIXTURE") {
    declined.push("AI Visibility is FIXTURE — excluded from production wins");
  }

  for (const row of report.opportunity.top20.slice(0, 5)) {
    topActions.push(
      `${row.path} → ${row.primaryAction ?? "review"} (score ${row.score ?? "—"})`,
    );
  }
  if (topActions.length === 0) {
    topActions.push(
      "Run npm run seo:gsc-opportunities to populate Top 20 growth actions.",
    );
  }

  const feedPath = firstExisting(
    path.join(cwd, "data/pricing/price-change-growth-signals.json"),
  );
  const feed = feedPath
    ? readJsonIfExists<{
        signals?: Array<{
          path: string;
          reason?: string;
          confidence?: string;
          outdatedPricing?: boolean;
        }>;
      }>(feedPath)
    : null;
  for (const s of (feed?.signals ?? []).slice(0, 8)) {
    if (s.outdatedPricing) {
      majorPricingChanges.push(
        `${s.path}: ${s.reason ?? "outdated pricing risk"} (${s.confidence ?? "—"})`,
      );
    }
  }
  if (majorPricingChanges.length === 0) {
    majorPricingChanges.push("No major pricing signals in growth feed (or feed missing).");
  }

  const linkPath = firstExisting(path.join(cwd, "data/seo/link-opportunities.json"));
  const linkReport = linkPath
    ? readJsonIfExists<{
        linksEarned?: Array<{ domain: string; targetUrl: string; assetPath: string }>;
      }>(linkPath)
    : null;
  for (const l of linkReport?.linksEarned ?? []) {
    linksEarned.push(`${l.domain} → ${l.targetUrl || l.assetPath}`);
  }
  if (linksEarned.length === 0) {
    linksEarned.push("No LINK_EARNED records — not connected / none recorded.");
  }

  const newTestedProducts = [...listRecentlyCompletedTests(8)];
  if (newTestedProducts.length === 0) {
    newTestedProducts.push("No completed product test sessions on disk.");
  }

  const researchPublished = [
    `/research/crm-pricing/ — ${
      report.research.latestResearch.kind === "text"
        ? report.research.latestResearch.value
        : "CRM pricing report"
    }`,
    "/research/crm-pricing-history/ — observation history collecting",
  ];

  if (report.indexing.status === "connected") {
    const crawled = metricNumber(report.indexing.crawledNotIndexed);
    if (crawled != null && crawled > 500) {
      declined.push(`Crawled-not-indexed count high (${crawled}) — inspect Coverage export`);
    }
  }

  return {
    improved,
    declined: declined.length
      ? declined
      : ["No verified declines this week without period-over-period GSC."],
    topActions,
    majorPricingChanges,
    linksEarned,
    newTestedProducts,
    researchPublished,
    notes: [
      "Weekly view only lists evidence from REAL connected sources — FIXTURE never counts as a win.",
      "Strategy: PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.",
    ],
  };
}

function sourceStatus(
  connected: boolean,
  partial = false,
): ConnectionStatus {
  if (connected) return "connected";
  if (partial) return "partial";
  return "not_connected";
}

function inventoryValidity(
  status: ConnectionStatus,
  validity: DataValidity,
): DataValidity {
  if (status === "not_connected") return "NOT_CONNECTED";
  return validity;
}

/**
 * Assemble the full Growth Dashboard report from available machine outputs.
 */
export function buildGrowthDashboard(opts: { cwd?: string } = {}): GrowthDashboardReport {
  const cwd = opts.cwd ?? process.cwd();

  const organicSearch = buildOrganicSearchSection(cwd);
  const contentEstate = buildContentEstateSection(cwd);
  const improvementVelocity = buildImprovementVelocitySection(cwd);
  const indexing = buildIndexingSection(cwd);
  const opportunity = buildOpportunitySection(cwd);
  const contentQuality = buildContentQualitySection(cwd);
  const authority = buildAuthoritySection(cwd);
  const research = buildResearchSection(cwd);
  const aiVisibility = buildAiVisibilitySection(cwd);
  const distribution = buildDistributionSection(cwd);
  const commercial = buildCommercialSection(cwd);

  const base = {
    engineVersion: GROWTH_DASHBOARD_VERSION,
    generatedAt: new Date().toISOString(),
    organicSearch,
    contentEstate,
    improvementVelocity,
    indexing,
    opportunity,
    contentQuality,
    authority,
    research,
    aiVisibility,
    distribution,
    commercial,
  };

  const scorecard = buildScorecard(base);
  const weekly = buildWeeklyView(base, cwd);

  return {
    ...base,
    strategyLabel: "PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC",
    complianceNotes: [
      "Internal dashboard only — not a public SEO scoreboard.",
      "Do not fabricate unavailable metrics; show not connected instead of fake zeros for clicks/revenue.",
      "No single vanity composite score — north-star is six primary objectives.",
      "Do not label search strong from impressions alone.",
      "FIXTURE / sample integrations never contribute to production north-star status.",
      "Indexation ratio is withheld unless GSC indexed and sitemap scopes are explicitly comparable.",
    ],
    scorecard,
    weekly,
    sourceInventory: [
      {
        id: "gsc_performance",
        label: "GSC Performance export",
        status: sourceStatus(organicSearch.status === "connected"),
        validity: organicSearch.validity,
        path: firstExisting(
          path.join(cwd, "docs/migration/data/gsc-export.json"),
          path.join(cwd, "data/seo/gsc-export.json"),
        ),
      },
      {
        id: "gsc_coverage",
        label: "GSC Coverage export",
        status: sourceStatus(indexing.status === "connected"),
        validity: indexing.validity,
        path: firstExisting(
          path.join(cwd, "docs/migration/data/gsc-coverage.json"),
          path.join(cwd, "data/seo/gsc-coverage.json"),
        ),
      },
      {
        id: "gsc_opportunities",
        label: "GSC Opportunity Engine",
        status: sourceStatus(
          opportunity.status === "connected",
          opportunity.status === "partial",
        ),
        validity: opportunity.validity,
        path: firstExisting(path.join(cwd, "data/seo/gsc-opportunities.json")),
      },
      {
        id: "price_monitor",
        label: "Price change growth signals",
        status: sourceStatus(contentQuality.stalePricingPages.kind === "number"),
        validity:
          contentQuality.stalePricingPages.kind === "number" ? "REAL" : "NOT_CONNECTED",
        path: firstExisting(
          path.join(cwd, "data/pricing/price-change-growth-signals.json"),
        ),
      },
      {
        id: "digital_pr",
        label: "Digital PR / link opportunities",
        status: sourceStatus(
          authority.status === "connected",
          authority.status === "partial",
        ),
        validity: inventoryValidity(authority.status, authority.validity),
        path: firstExisting(path.join(cwd, "data/seo/link-opportunities.json")),
      },
      {
        id: "ai_visibility",
        label: "AI Visibility",
        status: sourceStatus(
          aiVisibility.status === "connected",
          aiVisibility.status === "partial",
        ),
        validity: aiVisibility.validity,
        path: firstExisting(path.join(cwd, "data/seo/ai-visibility.json")),
      },
      {
        id: "distribution",
        label: "Distribution pack / tracking",
        status: sourceStatus(
          distribution.status === "connected",
          distribution.status === "partial",
        ),
        validity:
          distribution.status === "not_connected" ? "NOT_CONNECTED" : "REAL",
        path: firstExisting(path.join(cwd, "data/distribution/latest-pack.json")),
      },
      {
        id: "affiliate_analytics",
        label: "Affiliate click / revenue analytics",
        status: sourceStatus(
          commercial.status === "connected",
          commercial.status === "partial",
        ),
        validity: commercial.validity,
        path: firstExisting(
          path.join(cwd, "data/analytics/affiliate-clicks.json"),
          path.join(cwd, "data/analytics/affiliate-conversions.json"),
        ),
      },
    ],
  };
}
