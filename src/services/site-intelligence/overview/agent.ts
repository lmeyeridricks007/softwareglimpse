import fs from "node:fs";
import path from "node:path";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { evaluateSiteIntelligence } from "../evaluate";
import { siteBandLabel } from "../bands";
import { buildSiteIntelligenceInputFromSources } from "./build-input";
import { buildSiteInventory } from "./inventory";
import { assessUserJourney } from "./journey";
import {
  buildRecommendationsFromBacklog,
  formatWebsiteOverviewMarkdown,
  type OverviewRecommendation,
  type OverviewRisk,
  type WebsiteOverviewModel,
} from "./report";
import {
  hasLiveSearchPerformanceData,
  listOverviewReportSources,
  loadContentScoreSnapshot,
  loadSeoIssuesSnapshot,
  parseAssetIntelligenceSummary,
  parseImprovementBacklogTop,
  parseInternalLinkSummary,
  parseMapCoverageSummary,
  parseResourceAuditSummary,
  parseSeoHealthSkippedChecks,
  readTextIfExists,
} from "./sources";
import { loadSearchVisibilityMetricsFile } from "../search-performance";
import type { CompetitorPackInput } from "@/domain/schemas/site-intelligence";

export const WEBSITE_OVERVIEW_AGENT = {
  id: "website-overview-agent",
  name: "WebsiteOverviewAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};

const OUT_DIR = path.join(process.cwd(), "docs", "site-intelligence");
const ARCHIVE_DIR = path.join(OUT_DIR, "archive");
const LATEST_PATH = path.join(OUT_DIR, "WEBSITE-OVERVIEW-LATEST.md");

export type WebsiteOverviewOptions = {
  write?: boolean;
  archive?: boolean;
  generatedAt?: string;
};

function deriveStrengths(model: {
  inventory: ReturnType<typeof buildSiteInventory>;
  assessment: ReturnType<typeof evaluateSiteIntelligence>;
  assets: ReturnType<typeof parseAssetIntelligenceSummary>;
  links: ReturnType<typeof parseInternalLinkSummary>;
  resourcesLive?: number;
}): string[] {
  const out: string[] = [];
  const inv = model.inventory;
  if (inv.comparisons >= 100) {
    out.push(
      `Structured comparison library (${inv.comparisons} published comparisons; ${inv.indexableComparisons} indexable)`,
    );
  }
  if (inv.toolsAvailable >= 5) {
    out.push(
      `Interactive CRM decision tools (${inv.toolsAvailable} available in tools registry)`,
    );
  }
  if ((model.assessment.contentQuality.score ?? 0) >= 80) {
    out.push(
      `Strong Content Quality aggregate (${model.assessment.contentQuality.score}/100, importance-weighted)`,
    );
  }
  if ((model.links.orphans ?? 1) === 0 && (model.links.edges ?? 0) > 0) {
    out.push(
      `Internal linking graph healthy (${model.links.edges} edges, 0 orphans per latest InternalLinkAuditAgent)`,
    );
  }
  if (inv.publishedSoftware >= 20) {
    out.push(
      `Deep CRM product coverage (${inv.publishedSoftware} published software hubs)`,
    );
  }
  if ((model.assets.researchMedia ?? 0) >= 50) {
    out.push(
      `Product media catalog (${model.assets.researchMedia} ResearchMedia records)`,
    );
  }
  if ((model.resourcesLive ?? inv.resources) >= 10) {
    out.push(
      `Buyer resources library (${model.resourcesLive ?? inv.resources} resources live per resource audit/inventory)`,
    );
  }
  if (inv.useCases >= 10 && inv.capabilities >= 10) {
    out.push(
      `Use-case + capability taxonomy (${inv.useCases} use cases, ${inv.capabilities} capabilities)`,
    );
  }
  if ((model.assessment.technicalSeoHealth.score ?? 0) >= 85) {
    out.push(
      `Technical SEO Health ${model.assessment.technicalSeoHealth.score}/100 from latest SEO audit findings (open findings: ${(model.assessment.technicalSeoHealth.evidence.length)})`,
    );
  }
  return out;
}

function deriveWeaknesses(model: {
  inventory: ReturnType<typeof buildSiteInventory>;
  assessment: ReturnType<typeof evaluateSiteIntelligence>;
  map: ReturnType<typeof parseMapCoverageSummary>;
  assets: ReturnType<typeof parseAssetIntelligenceSummary>;
  resource: ReturnType<typeof parseResourceAuditSummary>;
}): string[] {
  const out: string[] = [];
  const inv = model.inventory;
  if (inv.guidesIndexable === 0 && inv.guidesPublished > 0) {
    out.push(
      `Guides published but not indexable (${inv.guidesPublished} published / ${inv.guidesIndexable} indexable) — evidence: inventory + seo.indexable gates`,
    );
  }
  if (inv.bestIndexable === 0 && inv.bestPages > 0) {
    out.push(
      `Best CRM commercial pillar not indexable (${inv.bestPages} published / ${inv.bestIndexable} indexable)`,
    );
  }
  if (inv.industriesIndexable === 0 && inv.industries > 0) {
    out.push(
      `Industry hubs seeded but not indexable (${inv.industries} / ${inv.industriesIndexable})`,
    );
  }
  if ((model.map.missing ?? 0) > 0) {
    out.push(
      `Content map gaps: ${model.map.missing} missing/NOT-YET rows (e.g. ${model.map.missingIds.slice(0, 4).join(", ") || "see map coverage"})`,
    );
  }
  if ((model.map.thin ?? 0) > 0) {
    out.push(
      `Thin/research-required map rows: ${model.map.thin} (includes commercial anchors such as Best CRM when flagged)`,
    );
  }
  if (model.assessment.competitiveContentStrength.availability !== "scored") {
    out.push(
      `Competitive Strength unavailable — competitor research pack not supplied (cannot claim SERP differentiation vs named competitors)`,
    );
  }
  if (model.assessment.searchVisibility.availability !== "scored") {
    out.push(
      `Search Visibility DATA NOT AVAILABLE — no live Search Console performance snapshot (fixtures are not treated as live GSC)`,
    );
  }
  if (model.assessment.authorityLimitations.status === "unavailable") {
    out.push(
      `Weak/unknown off-site authority — backlink/DA data unavailable (constrains Ranking Opportunity confidence)`,
    );
  }
  if ((model.assets.backlogA1 ?? 0) > 20) {
    out.push(
      `Media enrichment backlog still large (Asset Intelligence A1=${model.assets.backlogA1})`,
    );
  }
  if ((model.resource.improve ?? 0) + (model.resource.restructure ?? 0) > 5) {
    out.push(
      `Resource quality debt: IMPROVE=${model.resource.improve ?? 0}, RESTRUCTURE=${model.resource.restructure ?? 0} (RESOURCE-AUDIT)`,
    );
  }
  if (inv.toolsComingSoon > 0 || inv.toolsPartial > 0) {
    out.push(
      `Incomplete tool surface: ${inv.toolsPartial} partial, ${inv.toolsComingSoon} coming-soon`,
    );
  }
  return out;
}

function deriveAdvantages(inventory: ReturnType<typeof buildSiteInventory>): string[] {
  const out: string[] = [];
  const available = TOOLS_REGISTRY.filter((t) => t.status === "available");
  if (available.some((t) => t.slug === "crm-finder")) {
    out.push("Integrated CRM Finder (personalized shortlist without signup)");
  }
  if (available.some((t) => t.slug === "crm-requirements-builder")) {
    out.push("CRM Requirements Builder (requirements graph / decision profile)");
  }
  if (available.some((t) => t.slug === "crm-vendor-scorecard")) {
    out.push("CRM Vendor Scorecard (evidence-backed evaluation workflow)");
  }
  if (
    available.some((t) => t.slug === "crm-cost-calculator") &&
    available.some((t) => t.slug === "crm-tco-calculator")
  ) {
    out.push("Cost + TCO calculators wired into the CRM decision journey");
  }
  if (available.some((t) => t.slug === "crm-implementation-planner")) {
    out.push("CRM Implementation Planner");
  }
  if (available.some((t) => t.slug === "crm-migration-planner")) {
    out.push("CRM Migration Planner");
  }
  if (inventory.comparisons >= 100) {
    out.push(
      "Large structured comparison corpus with shared comparison templates",
    );
  }
  if (inventory.resources >= 10) {
    out.push("Downloadable CRM buyer resources (checklists/scorecards/templates)");
  }
  if (inventory.useCases >= 10 && inventory.capabilities >= 10) {
    out.push("Linked use-case ↔ capability taxonomy for CRM");
  }
  return out;
}

function deriveRisks(model: {
  inventory: ReturnType<typeof buildSiteInventory>;
  assessment: ReturnType<typeof evaluateSiteIntelligence>;
  map: ReturnType<typeof parseMapCoverageSummary>;
  sources: ReturnType<typeof listOverviewReportSources>;
  seoSkipped: number;
}): OverviewRisk[] {
  const risks: OverviewRisk[] = [];
  const inv = model.inventory;

  if (inv.bestIndexable === 0) {
    risks.push({
      area: "Content",
      title: "Primary commercial Best CRM URL not indexable",
      evidence: `${inv.bestPages} published best page(s); indexable=${inv.bestIndexable}`,
    });
  }
  if (inv.guidesIndexable === 0 && inv.guidesPublished > 0) {
    risks.push({
      area: "Content",
      title: "Guide knowledge cluster not contributing to organic index",
      evidence: `${inv.guidesPublished} published / ${inv.guidesIndexable} indexable`,
    });
  }
  if ((model.map.missing ?? 0) >= 5) {
    risks.push({
      area: "Content",
      title: "Material target-ecosystem tools/pages still missing",
      evidence: `Map missing/NOT-YET=${model.map.missing}; ids=${model.map.missingIds.slice(0, 5).join(", ")}`,
    });
  }
  if ((model.map.thin ?? 0) >= 10) {
    risks.push({
      area: "Research/data",
      title: "Thin/research-required map density still high",
      evidence: `Thin rows=${model.map.thin} of ${model.map.total ?? "?"}`,
    });
  }
  if (model.assessment.competitiveContentStrength.availability !== "scored") {
    risks.push({
      area: "Competitive",
      title: "No competitor-pack evaluation — blind spot on SERP rivalry",
      evidence: model.assessment.competitiveContentStrength.confidence.reasons[0] ?? "unavailable",
    });
  }
  if (model.assessment.authorityLimitations.status === "unavailable") {
    risks.push({
      area: "Authority",
      title: "Off-site authority unknown — may cap ranking opportunity",
      evidence: model.assessment.authorityLimitations.notes.join("; "),
    });
  }
  if (model.assessment.searchVisibility.availability !== "scored") {
    risks.push({
      area: "Authority",
      title: "No live search visibility measurement",
      evidence: "Search Visibility DATA NOT AVAILABLE (no live GSC)",
    });
  }
  if (model.seoSkipped >= 8) {
    risks.push({
      area: "Technical",
      title: "Many SEO checks skipped — incomplete technical confidence",
      evidence: `${model.seoSkipped} skipped checks in SEO-HEALTH-LATEST`,
    });
  }
  if (inv.industriesIndexable === 0 && inv.industries > 0) {
    risks.push({
      area: "Content",
      title: "Industry demand capture blocked by indexability",
      evidence: `${inv.industries} hubs / ${inv.industriesIndexable} indexable`,
    });
  }
  if (inv.toolsComingSoon > 0) {
    risks.push({
      area: "UX",
      title: "Coming-soon tools create journey dead-ends if linked",
      evidence: `${inv.toolsComingSoon} coming-soon tool(s) in registry`,
    });
  }
  const missingSources = model.sources.filter((s) => s.status === "missing");
  if (missingSources.length > 0) {
    risks.push({
      area: "Research/data",
      title: "Overview inputs incomplete",
      evidence: `Missing: ${missingSources.map((s) => s.id).join(", ")}`,
    });
  }
  if ((model.assessment.websiteExperience.score ?? 100) < 75) {
    risks.push({
      area: "UX",
      title: "Website Experience below Strong band",
      evidence: `Experience score ${model.assessment.websiteExperience.score}`,
    });
  }
  // Cap 20
  return risks.slice(0, 20);
}

function structuralRecommendations(input: {
  inventory: ReturnType<typeof buildSiteInventory>;
  map: ReturnType<typeof parseMapCoverageSummary>;
  assessment: ReturnType<typeof evaluateSiteIntelligence>;
}): OverviewRecommendation[] {
  const recs: OverviewRecommendation[] = [];
  const inv = input.inventory;
  if (inv.bestIndexable === 0) {
    recs.push({
      priority: "P0",
      area: "Content / Indexability",
      problem: "Best CRM page published but not indexable",
      whyItMatters:
        "Primary commercial pillar cannot capture organic demand while noindex/gated",
      action:
        "Finish research approvals for Best CRM; set seo.indexable only when quality gates pass",
      effort: "large",
      expectedImpact: "Unlocks choose-stage organic entry",
      relatedReportIds: [
        "CRM-BUY-001",
        "CONTENT-MAP-COVERAGE-LATEST",
        "CONTENT-INTELLIGENCE-LATEST",
      ],
    });
  }
  if (inv.guidesIndexable === 0 && inv.guidesPublished > 0) {
    recs.push({
      priority: "P1",
      area: "Content / Indexability",
      problem: "Guide corpus not indexable",
      whyItMatters: "Learn-stage demand cannot land on SoftwareGlimpse guides",
      action:
        "Prioritize indexability for pillar guides after evidence/freshness gates",
      effort: "medium",
      expectedImpact: "Discover/Understand journey organic coverage",
      relatedReportIds: ["CONTENT-INTELLIGENCE-LATEST", "SEO-HEALTH-LATEST"],
    });
  }
  if (input.map.missingIds.includes("CRM-TOOL-004")) {
    recs.push({
      priority: "P1",
      area: "UX / Tools",
      problem: "CRM ROI Calculator not yet implemented",
      whyItMatters: "Cost/ROI journey gap vs map target ecosystem",
      action: "Build CRM ROI Calculator per master map CRM-TOOL-004 (separate build)",
      effort: "large",
      expectedImpact: "Stronger Calculate-cost / Decide stage",
      relatedReportIds: ["CRM-TOOL-004", "CONTENT-MAP-COVERAGE-LATEST"],
    });
  }
  if (input.assessment.searchVisibility.availability !== "scored") {
    recs.push({
      priority: "P1",
      area: "Authority / Measurement",
      problem: "Live Search Console data not connected to Site Intelligence",
      whyItMatters:
        "Cannot prioritize true visibility gaps; Ranking Opportunity lacks current-visibility truth",
      action: "Configure GSC provider or import non-synthetic performance snapshots",
      effort: "medium",
      expectedImpact: "Enables Search Visibility score + sharper opportunity triage",
      relatedReportIds: ["seo-intelligence", "Search Visibility"],
    });
  }
  if (input.assessment.competitiveContentStrength.availability !== "scored") {
    recs.push({
      priority: "P1",
      area: "Competitive",
      problem: "Competitor research packs not evaluated",
      whyItMatters:
        "Cannot answer where SoftwareGlimpse is stronger/weaker vs SERP rivals",
      action:
        "Run competitor research for CRM clusters (separate task) then re-score Competitive Strength",
      effort: "large",
      expectedImpact: "Unlocks competitive scorecard + sharper opportunity",
      relatedReportIds: ["site-intelligence", "Competitive Strength"],
    });
  }
  if (input.assessment.authorityLimitations.status === "unavailable") {
    recs.push({
      priority: "P2",
      area: "Authority",
      problem: "Off-site authority / backlink gap unknown",
      whyItMatters: "May overestimate Ranking Opportunity for competitive heads",
      action: "Integrate referring-domain / authority data when available; do not invent DA",
      effort: "medium",
      expectedImpact: "Honest opportunity ceilings",
      relatedReportIds: ["AuthorityLimitations"],
    });
  }
  return recs;
}

/**
 * WebsiteOverviewAgent — executive assessment from existing latest reports.
 * NEVER mutates production content.
 */
export function runWebsiteOverviewAgent(
  opts: WebsiteOverviewOptions = {},
): {
  agent: typeof WEBSITE_OVERVIEW_AGENT;
  generatedAt: string;
  model: WebsiteOverviewModel;
  markdown: string;
  paths: { latest?: string; archive?: string };
} {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;
  const archive = opts.archive !== false;

  const sources = listOverviewReportSources();
  const seoHealthMd = readTextIfExists("docs/seo/reports/SEO-HEALTH-LATEST.md");
  const linksMd = readTextIfExists(
    "docs/seo/reports/internal-linking-latest.md",
  );
  const perfMd = readTextIfExists("docs/seo/reports/performance-latest.md");
  const assetMd = readTextIfExists(
    "docs/content-assets/ASSET-INTELLIGENCE-LATEST.md",
  );
  const mapMd = readTextIfExists(
    "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md",
  );
  const resourceMd = readTextIfExists(
    "docs/content-ecosystem/resources/RESOURCE-AUDIT.md",
  );
  const backlogMd = readTextIfExists(
    "docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md",
  );

  const scores = loadContentScoreSnapshot();
  const seoIssues = loadSeoIssuesSnapshot();
  const technicalChecks = parseSeoHealthSkippedChecks(seoHealthMd);
  const links = parseInternalLinkSummary(linksMd);
  const assets = parseAssetIntelligenceSummary(assetMd);
  const map = parseMapCoverageSummary(mapMd);
  const resource = parseResourceAuditSummary(resourceMd);
  const inventory = buildSiteInventory();

  const healthFindingsMatch = seoHealthMd?.match(
    /\|\s*Findings\s*\|\s*(\d+)\s*\|/i,
  );
  const healthFindingsCount = healthFindingsMatch
    ? Number(healthFindingsMatch[1])
    : null;
  if (
    seoIssues &&
    healthFindingsCount != null &&
    healthFindingsCount !== seoIssues.findings.length
  ) {
    // Prefer structured snapshot (often from a newer FULL run) over stale markdown summary.
    sources.push({
      id: "seo-source-note",
      label: "SEO findings source note",
      path: "docs/seo/reports/archive/seo-issues-latest.json",
      status: "available",
      notes: `SEO-HEALTH-LATEST summary lists ${healthFindingsCount} findings; issues snapshot has ${seoIssues.findings.length} — overview uses the snapshot`,
    });
  }

  const perfFindings = perfMd
    ? Number(
        perfMd.match(/\|\s*Findings\s*\|\s*(\d+)\s*\|/i)?.[1] ??
          perfMd.match(/(\d+)\s*finding\(s\)/i)?.[1] ??
          0,
      )
    : 0;

  const visibilityFile = loadSearchVisibilityMetricsFile();
  // Live/import only — never promote synthetic fixtures to visibility score here.
  const searchVisibility =
    visibilityFile && visibilityFile.live && !visibilityFile.synthetic
      ? visibilityFile.metrics
      : hasLiveSearchPerformanceData() &&
          visibilityFile &&
          !visibilityFile.synthetic
        ? visibilityFile.metrics
        : null;

  if (visibilityFile?.synthetic) {
    sources.push({
      id: "search-visibility-note",
      label: "Search visibility",
      path: "docs/site-intelligence/search-visibility-metrics-latest.json",
      status: "available",
      notes:
        "Synthetic search-performance metrics present — not applied to Search Visibility score",
    });
  } else if (searchVisibility) {
    sources.push({
      id: "search-visibility",
      label: "Search visibility metrics",
      path: "docs/site-intelligence/search-visibility-metrics-latest.json",
      status: "available",
      notes: "Derived from approved live/import search-performance snapshot",
    });
  }

  let competitorPack: CompetitorPackInput | null = null;
  const packPath = path.join(
    process.cwd(),
    "docs/site-intelligence/competitors/competitor-pack-latest.json",
  );
  if (fs.existsSync(packPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(packPath, "utf8")) as CompetitorPackInput;
      if (raw?.dimensions?.length) {
        competitorPack = raw;
        sources.push({
          id: "competitor-pack",
          label: "Competitor research pack",
          path: "docs/site-intelligence/competitors/competitor-pack-latest.json",
          status: "available",
          notes: `${raw.competitorsSampled} competitor(s) sampled`,
        });
      }
    } catch {
      /* ignore */
    }
  }

  const siInput = buildSiteIntelligenceInputFromSources({
    evaluatedAt: generatedAt,
    scores,
    seoIssues,
    technicalChecks,
    inventory,
    linkEdges: links.edges,
    linkOrphans: links.orphans,
    performanceFindings: perfFindings,
    mapTotal: map.total,
    mapMissing: map.missing,
    mapThin: map.thin,
    resourcesLive: resource.resourcesLive ?? inventory.resources,
    resourceImprove: resource.improve,
    searchVisibility,
    competitorPack,
  });

  const assessment = evaluateSiteIntelligence(siInput);
  const journey = assessUserJourney({
    scores,
    mapMissingIds: map.missingIds,
    mapThinIds: map.thinIds,
    resourcesLive: resource.resourcesLive ?? inventory.resources,
  });

  const strengths = deriveStrengths({
    inventory,
    assessment,
    assets,
    links,
    resourcesLive: resource.resourcesLive,
  });
  const weaknesses = deriveWeaknesses({
    inventory,
    assessment,
    map,
    assets,
    resource,
  });
  const advantages = deriveAdvantages(inventory);
  const risks = deriveRisks({
    inventory,
    assessment,
    map,
    sources,
    seoSkipped: technicalChecks.filter((c) => c.status === "skipped").length,
  });

  const growthBlockers = risks.slice(0, 8).map((r) => `${r.area}: ${r.title}`);
  const differentiators = advantages.slice(0, 8);

  const pageTypeHealth = [
    "homepage",
    "category",
    "best",
    "product-review",
    "comparison",
    "guide",
    "industry",
    "use-case",
    "capability",
    "requirement",
    "feature",
    "tool-landing",
    "resource",
  ].map((pageType) => {
    const rollup = assessment.pageTypeRollups.find((r) => r.pageType === pageType);
    const invCount =
      pageType === "product-review"
        ? inventory.pageTypeCounts.software
        : pageType === "homepage"
          ? 1
          : pageType === "category"
            ? 1
            : pageType === "tool-landing"
              ? inventory.toolsAvailable + inventory.toolsPartial
              : (inventory.pageTypeCounts[pageType] ?? rollup?.pageCount ?? 0);
    return {
      pageType:
        pageType === "product-review"
          ? "Product"
          : pageType === "tool-landing"
            ? "Tool"
            : pageType === "use-case"
              ? "Use Case"
              : pageType.charAt(0).toUpperCase() + pageType.slice(1),
      pages: rollup?.pageCount ?? invCount ?? 0,
      avgScore: rollup?.weightedScore ?? null,
      note:
        pageType === "homepage"
          ? "Homepage not in CQ CRM FAST sample"
          : pageType === "category"
            ? "Category hub quality via site templates / map"
            : rollup
              ? "Importance-weighted CQ from scores-latest.json"
              : "No CQ sample in latest snapshot",
    };
  });

  const technicalNote =
    (assessment.technicalSeoHealth.score ?? 0) >= 85
      ? `Site technical ${assessment.technicalSeoHealth.score}`
      : `Site technical ${assessment.technicalSeoHealth.score} — review SEO-HEALTH`;
  const linkingNote =
    (links.orphans ?? 0) === 0
      ? `0 orphans (${links.edges ?? "?"} edges)`
      : `${links.orphans} orphans`;
  const competitiveNote =
    assessment.competitiveContentStrength.availability === "scored"
      ? String(assessment.competitiveContentStrength.score)
      : "Not evaluated";
  const opp = assessment.rankingOpportunities[0];
  const oppLabel = opp?.opportunityBand
    ? `${opp.score} / ${opp.opportunityBand}`
    : "—";

  const clusterHealth = assessment.clusterRollups.map((c) => ({
    clusterId: c.clusterId,
    pages: c.pageCount,
    avgContentQuality: c.weightedScore,
    technicalNote,
    linkingNote,
    competitiveNote,
    rankingOpportunity: oppLabel,
  }));

  if (clusterHealth.length === 0) {
    clusterHealth.push({
      clusterId: "CRM (site)",
      pages: assessment.contentQuality.evidence.length,
      avgContentQuality: assessment.contentQuality.score ?? 0,
      technicalNote,
      linkingNote,
      competitiveNote,
      rankingOpportunity: oppLabel,
    });
  }

  const recommendations = buildRecommendationsFromBacklog(
    parseImprovementBacklogTop(backlogMd, 40),
    structuralRecommendations({ inventory, map, assessment }),
  );

  const model: WebsiteOverviewModel = {
    generatedAt,
    agentVersion: WEBSITE_OVERVIEW_AGENT.version,
    sources,
    inventory,
    assessment,
    journey,
    strengths,
    weaknesses,
    advantages,
    risks,
    recommendations,
    pageTypeHealth,
    clusterHealth,
    growthBlockers,
    differentiators,
  };

  const markdown = formatWebsiteOverviewMarkdown(model);
  const paths: { latest?: string; archive?: string } = {};

  if (write) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.latest = path.relative(process.cwd(), LATEST_PATH);
    if (archive) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-website-overview.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }
  }

  return {
    agent: WEBSITE_OVERVIEW_AGENT,
    generatedAt,
    model,
    markdown,
    paths,
  };
}

export { LATEST_PATH, siteBandLabel };
