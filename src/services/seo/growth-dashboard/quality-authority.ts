import path from "node:path";
import { buildTestCoverageMetrics } from "@/services/product-testing";
import { listTestSessions } from "@/services/product-testing";
import { scanRefreshCandidates } from "@/services/publishing/server";
import { buildContentRegistry } from "@/services/publishing/server";
import { loadAiVisibilitySummary } from "@/services/seo/ai-visibility";
import { buildCrmPricingResearchReport } from "@/services/research-reports";
import { CRM_PRICING_REPORT } from "@/services/research-reports";
import { buildAffiliateCoverageReport } from "@/services/affiliate";
import { loadDistributionTracking } from "@/services/distribution";
import {
  buildAffiliateFunnelReport,
  loadAffiliateClickStore,
  loadAffiliateConversionStore,
} from "@/services/analytics/affiliate-funnel";
import {
  firstExisting,
  notConnected,
  num,
  pct,
  readJsonIfExists,
  text,
} from "./io";
import { classifyDataValidity } from "./validity";
import type {
  AiVisibilitySection,
  AuthoritySection,
  CommercialSection,
  ContentQualitySection,
  DistributionSection,
  EvidenceTrendPoint,
  ResearchSection,
} from "./types";

type GrowthFeed = {
  generatedAt?: string;
  signals?: Array<{
    path: string;
    outdatedPricing?: boolean;
    reason?: string;
    confidence?: string;
  }>;
};

type LinkOppReport = {
  generatedAt?: string;
  summary?: {
    prospectCount?: number;
    qualifiedCount?: number;
    draftEligibleCount?: number;
    linksEarnedCount?: number;
    exportAvailable?: boolean;
    exportValidity?: string;
    fixtureProspectCount?: number;
    assetCount?: number;
    referringDomains?: number | null;
    backlinks?: number | null;
    linkedPages?: number | null;
    linksToResearchAssets?: number | null;
    linksToCommercialPages?: number | null;
    newReferringDomains?: number | null;
    lostReferringDomains?: number | null;
  };
  exportMetrics?: {
    topicalRelevanceAverage?: number | null;
    newLostAvailable?: boolean;
    notes?: string[];
  } | null;
  linksEarned?: Array<{
    domain?: string;
    targetUrl?: string;
    assetPath?: string;
    status?: string;
  }>;
  assets?: Array<{
    path: string;
    kind?: string;
    assetScore?: number;
  }>;
  exportMeta?: {
    rowCount?: number;
    validity?: string;
    filename?: string;
    provider?: string;
    exportDate?: string | null;
    sourcePath?: string;
  } | null;
};

const NON_REAL_EXPORT = new Set([
  "FIXTURE",
  "SAMPLE",
  "TEST",
  "EXAMPLE",
  "REJECTED",
]);

type DistPack = {
  generatedAt?: string;
  campaigns?: Array<{ id: string; title?: string; campaignType?: string }>;
};

type AiFull = {
  summary?: {
    exportAvailable?: boolean;
    totalCitations?: number;
    uniqueCitedPages?: number;
    platformCount?: number;
    topPlatform?: string | null;
  };
  analysis?: {
    topCitedPages?: Array<{ path: string; citationCount: number }>;
    citationsByPlatform?: Record<string, number>;
  };
};

export function buildContentQualitySection(
  cwd = process.cwd(),
): ContentQualitySection {
  const coverage = buildTestCoverageMetrics();
  const feedPath = firstExisting(
    path.join(cwd, "data/pricing/price-change-growth-signals.json"),
  );
  const feed = feedPath ? readJsonIfExists<GrowthFeed>(feedPath) : null;
  const stalePricing = new Set(
    (feed?.signals ?? [])
      .filter((s) => s.outdatedPricing)
      .map((s) => s.path),
  );

  let refreshCount: number | null = null;
  try {
    const entries = buildContentRegistry();
    const scan = scanRefreshCandidates({ entries });
    refreshCount = scan.candidates.length;
  } catch {
    refreshCount = null;
  }

  return {
    status: "connected",
    validity: "REAL",
    handsOnTested: num(coverage.handsOnTested),
    dataVerified: num(coverage.dataVerified),
    researchOnly: num(coverage.researched),
    reviewsWithEvidence: num(coverage.reviewsWithEvidence),
    stalePricingPages:
      feed != null
        ? num(
            stalePricing.size,
            "Unique paths with outdatedPricing in price-monitor growth feed",
          )
        : notConnected("Run npm run pricing:monitor"),
    pagesRequiringRefresh:
      refreshCount != null
        ? num(refreshCount, "Refresh scanner candidates")
        : notConnected(),
    evidenceTrend: buildEvidenceTrend(cwd, {
      handsOnTested: coverage.handsOnTested,
      dataVerified: coverage.dataVerified,
      researchOnly: coverage.researched,
    }),
    notes: [
      "Evidence levels from catalogue + completed test sessions — unfinished sessions do not count as hands-on.",
      "DATA_VERIFIED requires software.pricingVerifiedAt / software.pricing.verifiedAt / enrichment.pricing.verifiedAt with sources — never domainCheckedAt, updatedAt/generatedAt twins, or mass-identical backfill stamps.",
      feed
        ? `Price growth signals from ${feed.generatedAt ?? "price-change-growth-signals.json"}`
        : "Price monitor feed missing.",
    ],
  };
}

function buildEvidenceTrend(
  cwd: string,
  current: {
    handsOnTested: number;
    dataVerified: number;
    researchOnly: number;
  },
): EvidenceTrendPoint[] {
  const points: EvidenceTrendPoint[] = [
    {
      label: "current",
      handsOnTested: current.handsOnTested,
      dataVerified: current.dataVerified,
      researchOnly: current.researchOnly,
      at: new Date().toISOString(),
    },
  ];
  const prevPath = firstExisting(
    path.join(cwd, "data/seo/growth-dashboard.json"),
  );
  const prev = prevPath
    ? readJsonIfExists<{
        generatedAt?: string;
        contentQuality?: {
          handsOnTested?: { kind?: string; value?: number };
          dataVerified?: { kind?: string; value?: number };
          researchOnly?: { kind?: string; value?: number };
        };
      }>(prevPath)
    : null;
  const cq = prev?.contentQuality;
  if (
    cq?.handsOnTested?.kind === "number" &&
    cq?.dataVerified?.kind === "number"
  ) {
    points.unshift({
      label: "previous snapshot",
      handsOnTested: cq.handsOnTested.value ?? 0,
      dataVerified: cq.dataVerified.value ?? 0,
      researchOnly:
        cq.researchOnly?.kind === "number" ? (cq.researchOnly.value ?? 0) : 0,
      at: prev?.generatedAt ?? null,
    });
  }
  return points;
}

export function buildAuthoritySection(cwd = process.cwd()): AuthoritySection {
  const abs = firstExisting(
    path.join(cwd, "data/seo/link-opportunities.json"),
  );
  const report = abs ? readJsonIfExists<LinkOppReport>(abs) : null;

  if (!report?.summary) {
    return {
      status: "not_connected",
      validity: "NOT_CONNECTED",
      referringDomains: notConnected(),
      backlinks: notConnected(),
      linkedPages: notConnected(),
      topicalRelevanceAverage: notConnected(),
      newReferringDomains: notConnected(),
      lostReferringDomains: notConnected(),
      linksToResearchAssets: notConnected(),
      linksToCommercialPages: notConnected(),
      qualityProspects: notConnected(),
      linksEarned: notConnected(),
      researchAssetsEarningLinks: notConnected(),
      sampleLinks: [],
      notes: [
        "Run npm run seo:link-opportunities after importing a REAL Ahrefs/Semrush backlink export under data/seo/imports/.",
      ],
    };
  }

  const exportValidity =
    report.summary.exportValidity ?? report.exportMeta?.validity ?? "NOT_CONNECTED";
  const fileIsReal =
    report.summary.exportAvailable === true && exportValidity === "REAL";
  const fixtureProspects = report.summary.fixtureProspectCount ?? 0;

  let validity: AuthoritySection["validity"];
  if (NON_REAL_EXPORT.has(exportValidity)) {
    validity = "FIXTURE";
  } else if (!fileIsReal) {
    validity = "NOT_CONNECTED";
  } else {
    validity = classifyDataValidity({
      connected: true,
      sourcePath: report.exportMeta?.sourcePath ?? abs,
      dataThroughDate: report.exportMeta?.exportDate ?? null,
      generatedAt: report.generatedAt,
    });
  }

  const showMetrics = fileIsReal; // REAL or age-mapped STALE still has fileIsReal true

  const referringDomains = showMetrics
    ? num(
        report.summary.referringDomains ?? report.exportMeta?.rowCount ?? 0,
        "Unique referring domains in REAL export",
      )
    : notConnected(
        NON_REAL_EXPORT.has(exportValidity)
          ? `Backlink export validity is ${exportValidity} — excluded from production authority metrics`
          : "No REAL backlink export — do not invent referring domains",
      );

  const metricOrNc = (
    value: number | null | undefined,
    connectedNote: string,
  ): ReturnType<typeof num> | ReturnType<typeof notConnected> =>
    showMetrics && value != null
      ? num(value, connectedNote)
      : notConnected(
          NON_REAL_EXPORT.has(exportValidity)
            ? `Export ${exportValidity}`
            : "No REAL backlink export",
        );

  const researchEarned = (report.linksEarned ?? []).filter((l) =>
    (l.assetPath ?? "").includes("/research/"),
  ).length;

  const researchAssets = (report.assets ?? []).filter(
    (a) => a.kind === "dataset" || a.path.includes("/research/"),
  ).length;

  const qualityProspectValue = showMetrics
    ? (report.summary.draftEligibleCount ??
        report.summary.qualifiedCount ??
        0)
    : 0;

  const sampleLinks = showMetrics
    ? (report.linksEarned ?? [])
        .slice(0, 10)
        .map((l) => ({
          sourceDomain: l.domain ?? "unknown",
          targetUrl: l.targetUrl ?? null,
          topicalRelevance: l.assetPath ?? null,
          status: l.status ?? null,
        }))
    : [];

  const newLostNote = report.exportMetrics?.newLostAvailable
    ? "Vs prior RD snapshot"
    : "Unavailable until a second REAL import (or prior snapshot)";

  return {
    status: showMetrics
      ? validity === "STALE"
        ? "partial"
        : "connected"
      : "not_connected",
    validity,
    referringDomains,
    backlinks: metricOrNc(report.summary.backlinks, "Backlink rows in export"),
    linkedPages: metricOrNc(
      report.summary.linkedPages,
      "Unique SoftwareGlimpse paths receiving links",
    ),
    topicalRelevanceAverage: metricOrNc(
      report.exportMetrics?.topicalRelevanceAverage ?? null,
      "Mean topicalRelevance across configured competitor gaps",
    ),
    newReferringDomains: showMetrics
      ? report.summary.newReferringDomains != null
        ? num(report.summary.newReferringDomains, newLostNote)
        : notConnected(newLostNote)
      : notConnected("No REAL backlink export"),
    lostReferringDomains: showMetrics
      ? report.summary.lostReferringDomains != null
        ? num(report.summary.lostReferringDomains, newLostNote)
        : notConnected(newLostNote)
      : notConnected("No REAL backlink export"),
    linksToResearchAssets: metricOrNc(
      report.summary.linksToResearchAssets,
      "Rows targeting /research/, /guides/, methodology",
    ),
    linksToCommercialPages: metricOrNc(
      report.summary.linksToCommercialPages,
      "Rows targeting /best/, /tools/, /software/, /pricing/, /compare/, /categories/",
    ),
    qualityProspects: showMetrics
      ? num(
          qualityProspectValue,
          "REAL QUALIFIED / draft-eligible prospects only — fixtures excluded",
        )
      : num(0, "No REAL export — fixture/sample prospect count forced to 0"),
    linksEarned: num(
      report.summary.linksEarnedCount ?? 0,
      "From tracking LINK_EARNED only — never invent",
    ),
    researchAssetsEarningLinks:
      (report.linksEarned?.length ?? 0) > 0
        ? num(researchEarned)
        : num(
            researchAssets,
            "Research assets in inventory (not yet proven earned links)",
          ),
    sampleLinks,
    notes: [
      "Do not buy links or invent Ahrefs/Semrush RDs.",
      "Fixture/sample/example backlink exports are rejected for production Digital PR metrics.",
      "Dashboard validity: REAL | STALE (>45d export date) | FIXTURE | NOT_CONNECTED.",
      showMetrics
        ? `REAL backlink export file (${report.exportMeta?.provider ?? "unknown"} · ${report.exportMeta?.filename ?? "—"}) · dashboard validity ${validity}`
        : validity === "FIXTURE"
          ? `Rejected non-REAL export (${exportValidity}) — shown as FIXTURE, metrics NOT_CONNECTED.`
          : "REAL backlink export not connected — authority referring domains stay NOT_CONNECTED.",
      `Fixture/sample prospect count in report: ${fixtureProspects} (must be 0 in production).`,
      ...(report.exportMetrics?.notes ?? []).slice(0, 2),
    ],
  };
}

export function buildResearchSection(cwd = process.cwd()): ResearchSection {
  const report = buildCrmPricingResearchReport();
  const ai = loadAiVisibilitySummary(cwd);
  const researchCited =
    ai?.topCitedPaths.filter((p) => p.includes("/research/")).length ?? null;

  return {
    status: "connected",
    publishedReports: num(1, CRM_PRICING_REPORT.title),
    datasetCoverage: num(
      report.sample.usdWithStartingPrice,
      `USD products with starting price / ${report.sample.primaryCrmProducts} primary CRM`,
    ),
    latestResearch: text(
      `${CRM_PRICING_REPORT.path} · n=${report.sample.usdWithStartingPrice}`,
    ),
    researchCitationsTracked:
      researchCited != null && ai?.exportAvailable
        ? num(researchCited, "AI Visibility top cited paths under /research/")
        : notConnected("AI Visibility export not available"),
    notes: [
      "Catalogue-derived research only — never invent market averages.",
      "Price history report exists at /research/crm-pricing-history/ (observations collecting).",
    ],
  };
}

export function buildAiVisibilitySection(cwd = process.cwd()): AiVisibilitySection {
  const summary = loadAiVisibilitySummary(cwd);
  const fullPath = firstExisting(path.join(cwd, "data/seo/ai-visibility.json"));
  const full = fullPath ? readJsonIfExists<AiFull>(fullPath) : null;

  if (!summary?.exportAvailable) {
    return {
      status: "not_connected",
      validity: "NOT_CONNECTED",
      citations: notConnected(),
      uniqueCitedPages: notConnected(),
      platforms: notConnected(),
      topCitedContent: [],
      notes: [
        "Import Ahrefs AI Visibility (or similar) and run npm run seo:ai-visibility.",
        "Never fabricate ChatGPT/Perplexity citations.",
      ],
    };
  }

  const platforms = full?.analysis?.citationsByPlatform
    ? Object.keys(full.analysis.citationsByPlatform).length
    : full?.summary?.platformCount ?? null;

  const sourcePath =
    (full as { exportMeta?: { sourcePath?: string; label?: string } } | null)
      ?.exportMeta?.sourcePath ?? fullPath;

  const validity = classifyDataValidity({
    connected: true,
    sourcePath,
    fixturePathHint: sourcePath,
    generatedAt: summary.generatedAt,
  });

  // Production ops: FIXTURE must never look "connected". Surface as NOT_CONNECTED
  // with an explicit fixture note — real export required for REAL metrics.
  if (validity === "FIXTURE") {
    return {
      status: "not_connected",
      validity: "NOT_CONNECTED",
      citations: notConnected("FIXTURE sample — excluded from production metrics"),
      uniqueCitedPages: notConnected("FIXTURE sample — excluded"),
      platforms: notConnected("FIXTURE sample — excluded"),
      topCitedContent: [],
      notes: [
        "AI Visibility source is FIXTURE/sample — treated as NOT_CONNECTED for production status.",
        "Drop a REAL Ahrefs AI Visibility (or similar) export under data/seo/imports/ and re-run npm run seo:ai-visibility.",
        "Never fabricate ChatGPT/Perplexity citations.",
      ],
    };
  }

  return {
    status: "connected",
    validity,
    citations: num(summary.totalCitations),
    uniqueCitedPages: num(summary.uniqueCitedPages),
    platforms:
      platforms != null
        ? num(platforms, summary.topPlatform ? `Top: ${summary.topPlatform}` : undefined)
        : text(summary.topPlatform ?? "platforms connected"),
    topCitedContent: summary.topCitedPaths,
    notes: [
      `Generated ${summary.generatedAt}`,
      "Measurement only — do not manipulate AI systems.",
    ],
  };
}

export function buildDistributionSection(cwd = process.cwd()): DistributionSection {
  const packPath = firstExisting(
    path.join(cwd, "data/distribution/latest-pack.json"),
  );
  const pack = packPath ? readJsonIfExists<DistPack>(packPath) : null;
  const tracking = loadDistributionTracking();
  const withSessions = tracking.records.filter(
    (r) => r.measurement?.sessions != null,
  );
  const withSignups = tracking.records.filter(
    (r) => r.measurement?.signups != null,
  );
  const sessionSum = withSessions.reduce(
    (s, r) => s + (r.measurement?.sessions ?? 0),
    0,
  );
  const signupSum = withSignups.reduce(
    (s, r) => s + (r.measurement?.signups ?? 0),
    0,
  );

  return {
    status: pack?.campaigns?.length ? "partial" : "not_connected",
    campaigns: pack?.campaigns?.length
      ? num(pack.campaigns.length, `Pack ${pack.generatedAt ?? ""}`.trim())
      : notConnected("Run npm run distribution:pack"),
    referralSessions:
      withSessions.length > 0
        ? num(sessionSum, "From distribution tracking measurement imports")
        : notConnected("Analytics measurement not connected"),
    newsletterSignups:
      withSignups.length > 0
        ? num(signupSum)
        : notConnected("Newsletter signup measurement not connected"),
    notes: [
      ...tracking.measurementHints,
      "Draft packs are not auto-posted.",
    ],
  };
}

export function buildCommercialSection(cwd = process.cwd()): CommercialSection {
  const coverage = buildAffiliateCoverageReport();
  const clicks = loadAffiliateClickStore(cwd);
  const conversions = loadAffiliateConversionStore(cwd);
  const funnel = buildAffiliateFunnelReport(clicks, conversions);

  const clicksConnected =
    funnel.clicks.validity === "REAL" ||
    funnel.clicks.validity === "PARTIAL" ||
    funnel.clicks.validity === "STALE";
  const conversionsConnected =
    funnel.conversions.validity === "REAL" ||
    funnel.conversions.validity === "PARTIAL" ||
    funnel.conversions.validity === "STALE";

  const clickValidity = clicksConnected
    ? classifyDataValidity({
        connected: true,
        synthetic: clicks!.synthetic,
        sourcePath: path.join(cwd, "data/analytics/affiliate-clicks.json"),
        dataThroughDate: clicks!.dataThroughDate,
        generatedAt: clicks!.generatedAt,
      })
    : "NOT_CONNECTED";

  const conversionValidity = !conversionsConnected
    ? "NOT_CONNECTED"
    : conversions!.validity === "PARTIAL"
      ? "PARTIAL"
      : classifyDataValidity({
          connected: true,
          synthetic: false,
          dataThroughDate: conversions!.dataThroughDate,
          generatedAt: conversions!.generatedAt,
        });

  const commissionConnected = funnel.commission.total != null;
  const revenueConnected = funnel.revenue.total != null;

  let overallValidity: CommercialSection["validity"] = "NOT_CONNECTED";
  if (clicksConnected && conversionsConnected) {
    if (clickValidity === "STALE" || conversionValidity === "STALE") {
      overallValidity = "STALE";
    } else if (
      conversionValidity === "PARTIAL" ||
      !commissionConnected ||
      !revenueConnected
    ) {
      overallValidity = "PARTIAL";
    } else {
      overallValidity = "REAL";
    }
  } else if (clicksConnected) {
    overallValidity =
      clickValidity === "STALE" ? "STALE" : "PARTIAL";
  }

  return {
    status: clicksConnected
      ? conversionsConnected
        ? commissionConnected && revenueConnected
          ? "connected"
          : "partial"
        : "partial"
      : "not_connected",
    validity: overallValidity,
    affiliateClicks: clicksConnected
      ? num(
          funnel.clicks.count,
          `First-party clicks (${clicks!.sourceLabel ?? "beacon"}) · ${funnel.clicks.uniqueProducts} products`,
        )
      : notConnected(
          "No affiliate click aggregate store — deploy beacon / import GA4",
        ),
    conversions: conversionsConnected
      ? num(
          funnel.conversions.count,
          conversions!.sourceLabel ?? "network import",
        )
      : notConnected(
          "Conversion analytics NOT_CONNECTED — import network export (never invent; never show 0)",
        ),
    matchedConversions: conversionsConnected
      ? num(
          funnel.conversions.matched,
          `Joined via clickId only · unmatched ${funnel.conversions.unmatched}`,
        )
      : notConnected("Matched conversions require network import"),
    conversionRate:
      funnel.conversions.conversionRate != null
        ? pct(
            Math.round(funnel.conversions.conversionRate * 10000) / 100,
            "matched conversions / clicks",
          )
        : notConnected("Conversion rate unavailable until clicks + conversions connect"),
    commission: commissionConnected
      ? num(
          funnel.commission.total as number,
          `${funnel.commission.currency ?? "amount"} · network commission`,
        )
      : notConnected(
          funnel.commission.validity === "PARTIAL"
            ? "Commission PARTIAL — incomplete amount coverage (never show $0)"
            : "Commission NOT_CONNECTED — do not show $0",
        ),
    revenue: revenueConnected
      ? num(
          funnel.revenue.total as number,
          `${funnel.revenue.currency ?? "amount"} · order/sale revenue when provided`,
        )
      : notConnected(
          funnel.revenue.validity === "PARTIAL"
            ? "Revenue PARTIAL — incomplete sale amounts (never show $0)"
            : "Revenue NOT_CONNECTED — do not show $0 without network amounts",
        ),
    unmatchedConversions: conversionsConnected
      ? num(funnel.conversions.unmatched, "No inventing attribution for these")
      : notConnected("Unmatched count unavailable"),
    topConvertingSourcePages: funnel.topConvertingSourcePages
      .slice(0, 8)
      .map(
        (p) =>
          `${p.path} · ${p.matchedConversions} matched / ${p.clicks} clicks`,
      ),
    topProducts: funnel.topProducts
      .slice(0, 8)
      .map(
        (p) =>
          `${p.productSlug} · ${p.matchedConversions} matched / ${p.clicks} clicks${
            p.commission != null ? ` · commission ${p.commission}` : ""
          }`,
      ),
    programmeCoverage: num(
      coverage.withActiveProgramme,
      `${coverage.withActiveProgramme}/${coverage.totalSoftware} products with active programme`,
    ),
    notes: [
      ...funnel.notes,
      `Published with affiliate CTA: ${coverage.monetization?.publishedWithAffiliateCta ?? "—"}`,
      "Personal data: path + host only — no emails, IPs, or full referrer URLs.",
    ],
  };
}

export function listRecentlyCompletedTests(limit = 10): string[] {
  return listTestSessions()
    .filter((s) => s.status === "completed")
    .sort((a, b) => (b.completedAt ?? b.updatedAt).localeCompare(a.completedAt ?? a.updatedAt))
    .slice(0, limit)
    .map((s) => `${s.productSlug} (${s.completedAt ?? s.updatedAt})`);
}
