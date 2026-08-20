import type { SiteIntelligenceAssessment } from "@/domain/schemas/site-intelligence";
import { siteBandLabel } from "../bands";
import { opportunityBandLabel } from "../bands";
import type { SiteInventory } from "./inventory";
import type { JourneyStageAssessment } from "./journey";
import type { BacklogRecRow, ReportSource } from "./sources";

export type OverviewRisk = {
  area:
    | "Technical"
    | "Content"
    | "Competitive"
    | "Authority"
    | "UX"
    | "Research/data";
  title: string;
  evidence: string;
};

export type OverviewRecommendation = {
  priority: string;
  area: string;
  problem: string;
  whyItMatters: string;
  action: string;
  effort: string;
  expectedImpact: string;
  relatedReportIds: string[];
};

export type WebsiteOverviewModel = {
  generatedAt: string;
  agentVersion: string;
  sources: ReportSource[];
  inventory: SiteInventory;
  assessment: SiteIntelligenceAssessment;
  journey: JourneyStageAssessment[];
  strengths: string[];
  weaknesses: string[];
  advantages: string[];
  risks: OverviewRisk[];
  recommendations: OverviewRecommendation[];
  pageTypeHealth: Array<{
    pageType: string;
    pages: number;
    avgScore: number | null;
    note?: string;
  }>;
  clusterHealth: Array<{
    clusterId: string;
    pages: number;
    avgContentQuality: number;
    technicalNote: string;
    linkingNote: string;
    competitiveNote: string;
    rankingOpportunity: string;
  }>;
  growthBlockers: string[];
  differentiators: string[];
};

function fmtScore(n: number | null | undefined): string {
  return n == null ? "—" : String(n);
}

export function formatWebsiteOverviewMarkdown(
  model: WebsiteOverviewModel,
): string {
  const a = model.assessment;
  const o = a.overallWebsiteQuality;
  const band =
    o.band != null ? siteBandLabel(o.band) : o.availability.toUpperCase();

  const lines: string[] = [];
  lines.push("# SoftwareGlimpse Website Overview");
  lines.push("");
  lines.push(`**Agent:** WebsiteOverviewAgent v${model.agentVersion}`);
  lines.push(`**Generated:** ${model.generatedAt}`);
  lines.push(
    "> Executive assessment only — consumes existing latest reports. **Does not** modify production content, SEO config, rankings, or affiliate links.",
  );
  lines.push("");
  lines.push(a.disclaimer);
  lines.push("");

  lines.push("## Executive answer");
  lines.push("");
  lines.push(
    `**How good is SoftwareGlimpse today?** Overall Website Quality **${fmtScore(o.score)} / 100** (${band}).`,
  );
  lines.push("");
  lines.push(
    `**What is strong?** ${model.strengths.slice(0, 5).join("; ") || "See strengths section."}`,
  );
  lines.push("");
  lines.push(
    `**What is weak?** ${model.weaknesses.slice(0, 5).join("; ") || "See weaknesses section."}`,
  );
  lines.push("");
  lines.push(
    `**What prevents growth?** ${model.growthBlockers.slice(0, 5).join("; ") || "See risks."}`,
  );
  lines.push("");
  lines.push(
    `**What differentiates the site?** ${model.differentiators.slice(0, 5).join("; ") || "See advantages."}`,
  );
  lines.push("");
  lines.push(
    `**What should we improve next?** ${model.recommendations
      .slice(0, 3)
      .map((r) => r.action)
      .join("; ") || "See recommendations."}`,
  );
  lines.push("");

  lines.push("## Executive scorecard");
  lines.push("");
  lines.push("```text");
  lines.push("OVERALL WEBSITE QUALITY");
  lines.push(`${fmtScore(o.score)} / 100`);
  lines.push(band);
  lines.push("");
  lines.push(
    `Technical SEO ……… ${fmtScore(a.technicalSeoHealth.score)}  (confidence: ${a.technicalSeoHealth.confidence.level})`,
  );
  lines.push(
    `Content Quality …… ${fmtScore(a.contentQuality.score)}  (confidence: ${a.contentQuality.confidence.level})`,
  );
  lines.push(
    `Website Experience … ${fmtScore(a.websiteExperience.score)}  (confidence: ${a.websiteExperience.confidence.level})`,
  );
  lines.push(
    `Content Ecosystem … ${fmtScore(a.contentEcosystemStrength.score)}  (confidence: ${a.contentEcosystemStrength.confidence.level})`,
  );
  lines.push(
    `Competitive Strength ${
      a.competitiveContentStrength.availability === "scored"
        ? fmtScore(a.competitiveContentStrength.score)
        : "Not available"
    }  (confidence: ${a.competitiveContentStrength.confidence.level})`,
  );
  lines.push(
    `Search Visibility … ${
      a.searchVisibility.availability === "scored"
        ? fmtScore(a.searchVisibility.score)
        : "Not available"
    }  (confidence: ${a.searchVisibility.confidence.level})`,
  );
  lines.push("```");
  lines.push("");
  lines.push("| Component | Score | Band / status | Confidence | Notes |");
  lines.push("| --- | ---: | --- | --- | --- |");
  const rows = [
    a.technicalSeoHealth,
    a.contentQuality,
    a.websiteExperience,
    a.contentEcosystemStrength,
    a.competitiveContentStrength,
    a.searchVisibility,
    a.overallWebsiteQuality,
  ];
  for (const c of rows) {
    const status =
      c.availability === "scored"
        ? c.band
          ? siteBandLabel(c.band)
          : String(c.score)
        : c.availability === "data-not-available"
          ? "DATA NOT AVAILABLE"
          : "Unavailable";
    lines.push(
      `| ${c.id} | ${fmtScore(c.score)} | ${status} | ${c.confidence.level} | ${c.confidence.reasons[0] ?? "—"} |`,
    );
  }
  lines.push("");
  lines.push("### Overall breakdown");
  lines.push("");
  for (const row of a.overallBreakdown) {
    lines.push(
      `- **${row.componentId}:** ${row.score}/100 × weight ${row.weight.toFixed(2)} (confidence ${row.confidence})`,
    );
  }
  lines.push("");
  lines.push(
    `**Authority / off-site:** ${a.authorityLimitations.status} — impact ${a.authorityLimitations.impactOnOpportunity}. ${a.authorityLimitations.notes.join(" ")}`,
  );
  lines.push("");

  lines.push("## Inputs consumed");
  lines.push("");
  lines.push("| Source | Status | Path |");
  lines.push("| --- | --- | --- |");
  for (const s of model.sources) {
    lines.push(
      `| ${s.label} | ${s.status}${s.mtimeIso ? ` (${s.mtimeIso.slice(0, 10)})` : ""} | \`${s.path}\` |`,
    );
  }
  lines.push("");
  lines.push(
    "Expensive audits were **not** re-run. Missing/stale sources reduce confidence.",
  );
  lines.push("");

  lines.push("## Site inventory");
  lines.push("");
  const inv = model.inventory;
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Sitemap / indexable surface URLs | ${inv.sitemapUrls} |`);
  lines.push(`| Software published / indexable | ${inv.publishedSoftware} / ${inv.indexableSoftware} |`);
  lines.push(`| Comparisons published / indexable | ${inv.comparisons} / ${inv.indexableComparisons} |`);
  lines.push(`| Guides published / indexable | ${inv.guidesPublished} / ${inv.guidesIndexable} |`);
  lines.push(`| Best pages published / indexable | ${inv.bestPages} / ${inv.bestIndexable} |`);
  lines.push(`| Industries / indexable | ${inv.industries} / ${inv.industriesIndexable} |`);
  lines.push(`| Use cases / indexable | ${inv.useCases} / ${inv.useCasesIndexable} |`);
  lines.push(`| Capabilities / indexable | ${inv.capabilities} / ${inv.capabilitiesIndexable} |`);
  lines.push(`| Requirements | ${inv.requirements} |`);
  lines.push(`| Features | ${inv.features} |`);
  lines.push(`| Resources published / indexable | ${inv.resources} / ${inv.resourcesIndexable} |`);
  lines.push(
    `| Tools available / partial / coming-soon | ${inv.toolsAvailable} / ${inv.toolsPartial} / ${inv.toolsComingSoon} |`,
  );
  lines.push("");
  lines.push("### Page types");
  lines.push("");
  lines.push("| Page type | Count |");
  lines.push("| --- | ---: |");
  for (const [k, v] of Object.entries(inv.pageTypeCounts).sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push("");
  lines.push("### Content clusters (CRM)");
  lines.push("");
  for (const c of inv.clusters) lines.push(`- ${c}`);
  lines.push("");
  if (inv.notes.length) {
    lines.push("### Inventory notes");
    lines.push("");
    for (const n of inv.notes) lines.push(`- ${n}`);
    lines.push("");
  }

  lines.push("## Site strengths");
  lines.push("");
  if (model.strengths.length === 0) {
    lines.push("_No evidenced strengths derived from current inputs._");
  } else {
    for (const s of model.strengths) lines.push(`- ${s}`);
  }
  lines.push("");

  lines.push("## Site weaknesses");
  lines.push("");
  if (model.weaknesses.length === 0) {
    lines.push("_No evidenced weaknesses derived from current inputs._");
  } else {
    for (const s of model.weaknesses) lines.push(`- ${s}`);
  }
  lines.push("");

  lines.push("## User journey assessment");
  lines.push("");
  lines.push("| Stage | Status | Evidence |");
  lines.push("| --- | --- | --- |");
  for (const j of model.journey) {
    lines.push(
      `| ${j.label} | **${j.status.toUpperCase()}** | ${j.evidence.join("; ")} |`,
    );
  }
  lines.push("");

  lines.push("## Page-type health");
  lines.push("");
  lines.push("| Page type | Pages (CQ sample) | Avg CQ | Notes |");
  lines.push("| --- | ---: | ---: | --- |");
  for (const p of model.pageTypeHealth) {
    lines.push(
      `| ${p.pageType} | ${p.pages} | ${p.avgScore ?? "—"} | ${p.note ?? "—"} |`,
    );
  }
  lines.push("");

  lines.push("## Cluster health (CRM)");
  lines.push("");
  lines.push(
    "| Cluster | Pages | Avg CQ | Technical | Linking | Competitive | Ranking opportunity |",
  );
  lines.push("| --- | ---: | ---: | --- | --- | --- | --- |");
  for (const c of model.clusterHealth) {
    lines.push(
      `| ${c.clusterId} | ${c.pages} | ${c.avgContentQuality} | ${c.technicalNote} | ${c.linkingNote} | ${c.competitiveNote} | ${c.rankingOpportunity} |`,
    );
  }
  lines.push("");
  if (a.rankingOpportunities[0]) {
    const opp = a.rankingOpportunities[0];
    lines.push(
      `Cluster CRM opportunity score: **${fmtScore(opp.score)}** (${opp.opportunityBand ? opportunityBandLabel(opp.opportunityBand) : "—"}) — opportunity assessment, not a ranking probability.`,
    );
    lines.push("");
  }

  lines.push("## Top risks (growth constraints)");
  lines.push("");
  lines.push("| # | Area | Risk | Evidence |");
  lines.push("| --- | --- | --- | --- |");
  model.risks.forEach((r, i) => {
    lines.push(`| ${i + 1} | ${r.area} | ${r.title} | ${r.evidence} |`);
  });
  lines.push("");

  lines.push("## Top advantages (harder for competitors to replicate)");
  lines.push("");
  if (model.advantages.length === 0) {
    lines.push(
      "_No advantages claimed — only list capabilities that are implemented._",
    );
  } else {
    for (const s of model.advantages) lines.push(`- ${s}`);
  }
  lines.push("");

  lines.push("## Top 25 recommendations");
  lines.push("");
  lines.push(
    "| # | Priority | Area | Problem | Why it matters | Action | Effort | Expected impact | Related IDs |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  model.recommendations.slice(0, 25).forEach((r, i) => {
    lines.push(
      `| ${i + 1} | ${r.priority} | ${r.area} | ${esc(r.problem)} | ${esc(r.whyItMatters)} | ${esc(r.action)} | ${r.effort} | ${esc(r.expectedImpact)} | ${r.relatedReportIds.map((id) => `\`${id}\``).join(" ")} |`,
    );
  });
  lines.push("");

  lines.push("## Methodology");
  lines.push("");
  lines.push(
    "Scores composed via Site Intelligence (`docs/site-intelligence/01-scoring-methodology.md`). Competitive Strength and live Search Visibility require research / GSC data — not fabricated. Ranking Opportunity is not a chance-of-ranking percentage.",
  );
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(
    `_Generated by WebsiteOverviewAgent v${model.agentVersion}. No production mutations._`,
  );
  lines.push("");
  return lines.join("\n");
}

function esc(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ").slice(0, 160);
}

export function buildRecommendationsFromBacklog(
  rows: BacklogRecRow[],
  extras: OverviewRecommendation[],
): OverviewRecommendation[] {
  const fromBacklog: OverviewRecommendation[] = rows.map((r) => ({
    priority: r.priority,
    area: "Content",
    problem: r.issue,
    whyItMatters: `Page ${r.route} (${r.pageType}) scored ${r.score}; commercial/journey leverage`,
    action: r.action,
    effort: r.effort || "medium",
    expectedImpact: r.impact,
    relatedReportIds: [
      r.relatedId,
      "CONTENT-IMPROVEMENT-BACKLOG",
      "CONTENT-INTELLIGENCE-LATEST",
    ].filter(Boolean) as string[],
  }));
  const merged = [...extras, ...fromBacklog];
  const seen = new Set<string>();
  const out: OverviewRecommendation[] = [];
  for (const r of merged) {
    const key = `${r.priority}|${r.action.slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
    if (out.length >= 25) break;
  }
  return out;
}
