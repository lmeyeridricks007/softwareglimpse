import type { ExecutiveScorecard } from "./scorecard";
import type { SiteIntelligenceInputs } from "./consume-site-inputs";
import type { VisibilityHistoryDiff, TrackedOpportunity } from "./tracking";
import type { LinkableAsset } from "@/domain/schemas/authority-intelligence";
import type { EarnedBacklinkReport } from "../earned/types";
import type { PaidPromotionReport } from "../paid/types";
import type { DigitalPrReport } from "../digital-pr/types";
import type { PartnershipReport } from "../partnership/types";
import type { ContentPromotionReport } from "../promotion/types";
import type { PresenceReport } from "../presence/types";

function esc(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function trunc(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

export type VisibilityReportModel = {
  generatedAt: string;
  mode: string;
  version: string;
  agentsRun: string[];
  siteInputs: SiteIntelligenceInputs;
  scorecard: ExecutiveScorecard;
  linkableAssets: LinkableAsset[];
  earned: EarnedBacklinkReport;
  paid: PaidPromotionReport;
  digitalPr: DigitalPrReport;
  partnerships: PartnershipReport;
  promotion: ContentPromotionReport;
  presence: PresenceReport;
  tracked: TrackedOpportunity[];
  history: VisibilityHistoryDiff;
  plan30: string[];
  plan90: string[];
  plan180: string[];
  spamAvoid: Array<{ source: string; reason: string }>;
  contentGapsLinkable: string[];
  measurementNotes: string[];
  limitations: string[];
  commands: string[];
  schedule: Array<{ cadence: string; work: string }>;
  reportLocations: Array<{ name: string; path: string }>;
};

export function formatAuthorityVisibilityReport(
  m: VisibilityReportModel,
): string {
  const L: string[] = [];
  L.push("# SoftwareGlimpse Authority & Visibility Intelligence");
  L.push("");
  L.push(
    `> Orchestrator: **AuthorityVisibilityIntelligenceOrchestrator** · Mode: **${m.mode}**`,
  );
  L.push(`> Generated: ${m.generatedAt} · Framework v${m.version}`);
  L.push(
    `> **Analyze → Report → Recommend only.** Never executes outreach or purchases.`,
  );
  L.push("");

  L.push("## Executive verdict");
  L.push("");
  L.push(
    `Authority readiness is **${m.scorecard.authorityReadiness}**. Strongest near-term levers: promote linkable tools/resources, claim high-intent directory presence, pursue earned resource-page citations, and prepare one data-led PR asset — without buying dofollow links.`,
  );
  L.push("");
  L.push("## Executive scorecard");
  L.push("");
  L.push("| Dimension | Band |");
  L.push("| --- | --- |");
  L.push(`| Authority Readiness | ${m.scorecard.authorityReadiness} |`);
  L.push(`| Linkable Asset Strength | ${m.scorecard.linkableAssetStrength} |`);
  L.push(`| Earned Link Opportunity | ${m.scorecard.earnedLinkOpportunity} |`);
  L.push(`| Promotion Coverage | ${m.scorecard.promotionCoverage} |`);
  L.push(`| Partnership Opportunity | ${m.scorecard.partnershipOpportunity} |`);
  L.push(`| Digital PR Readiness | ${m.scorecard.digitalPrReadiness} |`);
  L.push(
    `| Current External Authority | ${m.scorecard.currentExternalAuthority} |`,
  );
  L.push("");
  for (const n of m.scorecard.notes) L.push(`- ${n}`);
  L.push("");

  L.push("## Current external authority");
  L.push("");
  L.push(m.scorecard.currentExternalAuthority);
  L.push("");
  L.push(
    `Recorded acquisitions (evidence-only): **${m.history.wonLinks.length}**. Won status requires an entry in \`docs/authority/tracking/link-acquisitions.json\`.`,
  );
  L.push("");

  L.push("## Best linkable assets");
  L.push("");
  L.push("| Asset | Path | Linkability | Why |");
  L.push("| --- | --- | --- | --- |");
  for (const a of m.linkableAssets
    .filter(
      (x) => x.linkability === "excellent" || x.linkability === "strong",
    )
    .slice(0, 15)) {
    L.push(
      `| ${esc(a.name)} | \`${a.path}\` | ${a.linkability} | ${esc(trunc(a.whyLinkable, 100))} |`,
    );
  }
  L.push("");

  L.push("## Top 25 free backlink opportunities");
  L.push("");
  L.push(
    "For each row: open **Submit page**, request a link to **Link this SG page**, using the ask in the earned report detail.",
  );
  L.push("");
  L.push(
    "| # | Opportunity | Domain | Submit / request page | Link this SG page | How to submit/request | Suggested ask |",
  );
  L.push("| --- | --- | --- | --- | --- | --- | --- |");
  for (const o of m.earned.top50.slice(0, 25)) {
    const submit = o.submitOrContactUrl ?? o.opportunityUrl;
    const targetLabel = esc(trunc(o.targetPageName ?? o.relevantSgPage ?? "SG page", 40));
    const targetUrl = o.targetPageUrl ?? "";
    const how = esc(trunc(o.howToSubmitOrRequest ?? o.contactPath ?? "—", 90));
    const ask = esc(trunc(o.suggestedAsk ?? "—", 90));
    L.push(
      `| ${o.priority ?? ""} | [${esc(trunc(o.opportunityTitle, 50))}](${o.opportunityUrl}) | ${o.domain} | [Open](${submit}) | [${targetLabel}](${targetUrl}) | ${how} | ${ask} |`,
    );
  }
  L.push("");
  L.push(
    `Full asks + steps: [\`EARNED-BACKLINK-OPPORTUNITIES-LATEST.md\`](./EARNED-BACKLINK-OPPORTUNITIES-LATEST.md).`,
  );
  L.push("");

  L.push("## Top 10 paid visibility opportunities");
  L.push("");
  L.push("| # | Channel | Cost | Referral | Brand | Why |");
  L.push("| --- | --- | --- | --- | --- | --- |");
  for (const o of m.paid.accepted.slice(0, 10)) {
    L.push(
      `| ${o.priority ?? ""} | ${esc(trunc(o.siteChannel, 50))} | ${esc(trunc(o.costDisplay, 40))} | ${o.referralPotential} | ${o.brandValue} | ${esc(trunc(o.whyWorthwhile, 70))} |`,
    );
  }
  L.push("");

  L.push("## Top digital PR opportunities");
  L.push("");
  L.push("| # | PR idea | Status | Linkability | Effort | Next action |");
  L.push("| --- | --- | --- | --- | --- | --- |");
  for (const o of m.digitalPr.ideas.slice(0, 10)) {
    L.push(
      `| ${o.priority ?? ""} | ${esc(o.title)} | ${o.status} | ${o.scoreBand} | ${o.effort} | ${esc(trunc(o.recommendedNextAction, 70))} |`,
    );
  }
  L.push("");

  L.push("## Best directories/listings");
  L.push("");
  L.push("| # | Organization | Kind | Visibility | Claim path |");
  L.push("| --- | --- | --- | --- | --- |");
  for (const o of m.presence.accepted.slice(0, 12)) {
    L.push(
      `| ${o.priority ?? ""} | ${esc(o.organization)} | ${o.kind} | ${o.visibilityValue} | ${esc(trunc(o.claimPath, 60))} |`,
    );
  }
  L.push("");

  L.push("## Partnership opportunities");
  L.push("");
  L.push("| # | Organization | Type | Collaboration | Difficulty |");
  L.push("| --- | --- | --- | --- | --- |");
  for (const o of m.partnerships.accepted.slice(0, 12)) {
    L.push(
      `| ${o.priority ?? ""} | ${esc(o.organization)} | ${o.partnerType} | ${esc(trunc(o.collaborationIdea, 70))} | ${o.difficulty} |`,
    );
  }
  L.push("");

  L.push("## Podcast/newsletter opportunities");
  L.push("");
  const nlPaid = m.paid.accepted.filter(
    (o) =>
      o.type === "PAID_NEWSLETTER" ||
      /newsletter|podcast/i.test(o.siteChannel),
  );
  for (const o of nlPaid.slice(0, 8)) {
    L.push(
      `- **${o.siteChannel}** (${o.costDisplay}) — ${trunc(o.whyWorthwhile, 100)}`,
    );
  }
  L.push(
    `- Expert commentary platforms (Digital PR): ${m.digitalPr.expertCommentary.map((c) => c.platform).join("; ")}`,
  );
  L.push("");

  L.push("## Community opportunities");
  L.push("");
  const communities = m.promotion.plans
    .flatMap((p) => p.primaryChannels)
    .filter((c) => /revops|reddit|revgenius|roa/i.test(c));
  const uniq = [...new Set(communities)].slice(0, 12);
  for (const c of uniq) L.push(`- ${c}`);
  L.push(
    "- Policy: help-first; no drive-by self-promo (see ContentPromotion rejects).",
  );
  L.push("");

  L.push("## Promotion opportunities");
  L.push("");
  L.push("| # | Asset | Primary channels | Angle | Effort |");
  L.push("| --- | --- | --- | --- | --- |");
  for (const p of m.promotion.plans.slice(0, 12)) {
    L.push(
      `| ${p.priority ?? ""} | ${esc(p.assetName)} | ${esc(trunc(p.primaryChannels.join(", "), 50))} | ${esc(trunc(p.promotionAngle, 70))} | ${p.effort} |`,
    );
  }
  L.push("");

  L.push("## Competitor backlink gaps");
  L.push("");
  if (m.siteInputs.competitorIntelligence) {
    L.push(
      `Competitor intelligence available at \`${m.siteInputs.competitorIntelligence}\`. Cross-check earned opportunities against competitor citation patterns in Ranking Opportunities / SERP snapshots — do not invent competitor backlink lists without live data.`,
    );
  } else {
    L.push(
      "_Competitor backlink gap dataset unavailable this run — refresh Competitor Intelligence before claiming gaps._",
    );
  }
  L.push("");

  L.push("## Content we should create specifically because it is linkable");
  L.push("");
  for (const g of m.contentGapsLinkable) L.push(`- ${g}`);
  L.push("");

  L.push("## Spam/risky opportunities to avoid");
  L.push("");
  for (const s of m.spamAvoid.slice(0, 20)) {
    L.push(`- **${esc(s.source)}** — ${esc(s.reason)}`);
  }
  L.push("");

  L.push("## Recommended 30-day plan");
  L.push("");
  L.push("_Derived from this discovery run — not a hardcoded template._");
  L.push("");
  m.plan30.forEach((x, i) => L.push(`${i + 1}. ${x}`));
  L.push("");

  L.push("## Recommended 90-day plan");
  L.push("");
  m.plan90.forEach((x, i) => L.push(`${i + 1}. ${x}`));
  L.push("");

  L.push("## Recommended six-month authority plan");
  L.push("");
  m.plan180.forEach((x, i) => L.push(`${i + 1}. ${x}`));
  L.push("");

  L.push("## History vs previous run");
  L.push("");
  L.push(`| Metric | Count |`);
  L.push(`| --- | --- |`);
  L.push(`| New opportunities | ${m.history.newOpportunities.length} |`);
  L.push(`| Missing vs previous | ${m.history.expiredOrMissing.length} |`);
  L.push(`| Won links (evidence) | ${m.history.wonLinks.length} |`);
  L.push("");
  L.push("Tracking statuses in snapshot:");
  for (const [k, v] of Object.entries(m.history.status)) {
    L.push(`- ${k}: ${v}`);
  }
  L.push("");

  L.push("## Measurement");
  L.push("");
  for (const n of m.measurementNotes) L.push(`- ${n}`);
  L.push("");

  L.push("## Consumed site / content inputs");
  L.push("");
  for (const n of m.siteInputs.notes) L.push(`- ${n}`);
  L.push("");

  L.push("## Agents run");
  L.push("");
  for (const a of m.agentsRun) L.push(`- ${a}`);
  L.push("");

  L.push("## Commands");
  L.push("");
  for (const c of m.commands) L.push(`- \`${c}\``);
  L.push("");

  L.push("## Schedule");
  L.push("");
  L.push("| Cadence | Work |");
  L.push("| --- | --- |");
  for (const s of m.schedule) L.push(`| ${s.cadence} | ${s.work} |`);
  L.push("");

  L.push("## Report locations");
  L.push("");
  L.push("| Report | Path |");
  L.push("| --- | --- |");
  for (const r of m.reportLocations) L.push(`| ${r.name} | \`${r.path}\` |`);
  L.push("");

  L.push("## Limitations");
  L.push("");
  for (const lim of m.limitations) L.push(`- ${lim}`);
  L.push("");

  L.push("---");
  L.push("");
  L.push("Regenerate: `npm run authority:intelligence` or `npm run authority:audit`");
  L.push("");

  return L.join("\n");
}
