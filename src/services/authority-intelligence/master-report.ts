import type {
  AuthorityOpportunity,
  ContentAssetGapForLinks,
  LinkableAsset,
  OutreachAngleDraft,
} from "@/domain/schemas/authority-intelligence";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import { LINK_SPAM_AVOID_LABEL } from "./compliance";
import type { AuthorityChange } from "./diff";
import type { AuthorityLimitations } from "@/domain/schemas/site-intelligence";
import { DISCOVERY_QUERY_PACKS } from "./fixtures";

function bandCount(
  opportunities: AuthorityOpportunity[],
  band: AuthorityOpportunity["scoreBand"],
): number {
  return opportunities.filter((o) => o.scoreBand === band).length;
}

function formatOpportunityRow(o: AuthorityOpportunity): string {
  return `| \`${o.id}\` | ${o.scoreBand} | ${o.type} | ${o.acquisitionType} | ${o.organization} | \`${o.targetSoftwareGlimpsePage ?? "—"}\` | ${o.seoValue} | ${o.referralValue} | ${o.spamRisk} |`;
}

export function formatAuthorityIntelligenceMarkdown(input: {
  generatedAt: string;
  mode: string;
  scope: string;
  opportunities: AuthorityOpportunity[];
  freeFirst: AuthorityOpportunity[];
  paidExposure: AuthorityOpportunity[];
  avoid: AuthorityOpportunity[];
  linkableAssets: LinkableAsset[];
  angles: OutreachAngleDraft[];
  contentGaps: ContentAssetGapForLinks[];
  authorityLimitations: AuthorityLimitations;
  changeSummary: Record<string, number>;
  agentsRun: string[];
}): string {
  const {
    generatedAt,
    mode,
    scope,
    opportunities,
    freeFirst,
    paidExposure,
    avoid,
    linkableAssets,
    angles,
    contentGaps,
    authorityLimitations,
    changeSummary,
    agentsRun,
  } = input;

  const top = opportunities
    .filter((o) => o.scoreBand !== "AVOID")
    .slice(0, 15);

  const lines: string[] = [
    `# Authority / Backlink / Promotion Intelligence`,
    ``,
    `> Orchestrator: **AuthorityIntelligenceOrchestrator** · Mode: **${mode}** · Scope: ${scope}`,
    `> Generated: ${generatedAt} · Framework v${AUTHORITY_INTELLIGENCE_VERSION}`,
    `> **Evaluate only** — no outreach, purchases, form submissions, or production content edits.`,
    ``,
    `## Executive summary`,
    ``,
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Opportunities | ${opportunities.length} |`,
    `| EXCELLENT | ${bandCount(opportunities, "EXCELLENT")} |`,
    `| STRONG | ${bandCount(opportunities, "STRONG")} |`,
    `| GOOD | ${bandCount(opportunities, "GOOD")} |`,
    `| LOW | ${bandCount(opportunities, "LOW")} |`,
    `| AVOID | ${bandCount(opportunities, "AVOID")} |`,
    `| Free-first queue | ${freeFirst.length} |`,
    `| Paid exposure (non-spam) | ${paidExposure.length} |`,
    `| Linkable assets inventoried | ${linkableAssets.length} |`,
    `| Outreach angles drafted | ${angles.length} |`,
    `| Content gaps for link earning | ${contentGaps.length} |`,
    ``,
    `### Change tracking`,
    ``,
    Object.entries(changeSummary)
      .map(([k, v]) => `- **${k}**: ${v}`)
      .join("\n") || "- (first run)",
    ``,
    `### Agents run`,
    ``,
    agentsRun.map((a) => `- ${a}`).join("\n"),
    ``,
    `## Non-negotiable rules`,
    ``,
    `1. **Do not** pay for dofollow link packages, PBNs, bulk guest posts, or link schemes.`,
    `2. Mark rejected strategies: **${LINK_SPAM_AVOID_LABEL}**.`,
    `3. Paid promotions may be recommended only for **exposure / referral / brand** with sponsored or nofollow-qualified treatment.`,
    `4. **DA / DR / Authority Score** (if stored) are external context — never Google ranking metrics.`,
    `5. Prefer **tools, resources, templates, research** over the homepage as link targets.`,
    `6. Agents **DISCOVER → VERIFY → QUALIFY → RECOMMEND → DRAFT ANGLES** only — humans act.`,
    ``,
    `## Site Intelligence bridge (AuthorityLimitations)`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| Status | ${authorityLimitations.status} |`,
    `| Confidence | ${authorityLimitations.confidence} |`,
    `| Impact on Ranking Opportunity | ${authorityLimitations.impactOnOpportunity} |`,
    ``,
    `**Notes**`,
    ``,
    ...authorityLimitations.notes.map((n) => `- ${n}`),
    ``,
    `**Known gaps**`,
    ``,
    ...authorityLimitations.knownGaps.map((n) => `- ${n}`),
    ``,
    `## Top recommendations (non-AVOID)`,
    ``,
    `| ID | Band | Type | Acquisition | Organization | Target page | SEO value | Referral | Spam |`,
    `| --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
    ...top.map(formatOpportunityRow),
    ``,
    `## Free-first queue`,
    ``,
    freeFirst.length === 0
      ? "_None in GOOD+ this run._"
      : [
          `| ID | Band | Type | Organization | Pitch hint |`,
          `| --- | --- | --- | --- | --- |`,
          ...freeFirst.map(
            (o) =>
              `| \`${o.id}\` | ${o.scoreBand} | ${o.type} | ${o.organization} | ${(o.suggestedPitchAngle ?? o.reasonWhyTheyMightLink).slice(0, 120)}… |`,
          ),
        ].join("\n"),
    ``,
    `## Paid exposure candidates (not link-equity purchases)`,
    ``,
    paidExposure.length === 0
      ? "_None._"
      : [
          `| ID | Band | Type | Cost | Link treatment | Why consider |`,
          `| --- | --- | --- | --- | --- | --- |`,
          ...paidExposure.map(
            (o) =>
              `| \`${o.id}\` | ${o.scoreBand} | ${o.type} | ${o.estimatedCost ?? "—"} | ${o.expectedLinkTreatment} | Referral/brand — not SEO equity |`,
          ),
        ].join("\n"),
    ``,
    `## ${LINK_SPAM_AVOID_LABEL}`,
    ``,
    avoid.length === 0
      ? "_None._"
      : [
          `| ID | Type | Organization | Flags |`,
          `| --- | --- | --- | --- |`,
          ...avoid.map(
            (o) =>
              `| \`${o.id}\` | ${o.type} | ${o.organization} | ${o.complianceFlags.join(", ") || o.spamRisk} |`,
          ),
        ].join("\n"),
    ``,
    `## Most linkable SoftwareGlimpse assets`,
    ``,
    `| Name | Kind | Path | Linkability | Why |`,
    `| --- | --- | --- | --- | --- |`,
    ...linkableAssets
      .filter((a) => a.kind !== "homepage")
      .slice(0, 20)
      .map(
        (a) =>
          `| ${a.name} | ${a.kind} | \`${a.path}\` | ${a.linkability} | ${a.whyLinkable.slice(0, 100)} |`,
      ),
    ``,
    `## Content / assets to create for more links`,
    ``,
    ...contentGaps.flatMap((g) => [
      `### ${g.title}`,
      ``,
      g.description,
      ``,
      `- Link-magnet potential: **${g.linkMagnetPotential}**`,
      `- Related types: ${g.relatedOpportunityTypes.join(", ")}`,
      ``,
    ]),
    ``,
    `## Outreach angles (human action required)`,
    ``,
    ...angles.flatMap((a) => [
      `### ${a.angleTitle}`,
      ``,
      `- Opportunity: \`${a.opportunityId}\``,
      `- Pitch: ${a.pitchSummary}`,
      `- Why: ${a.whyRelevant}`,
      `- Assets: ${a.suggestedAssetPaths.map((p) => `\`${p}\``).join(", ") || "—"}`,
      `- Do not: ${a.doNotDo.join(" ")}`,
      ``,
    ]),
    ``,
    `## Discovery query packs (manual / future live search)`,
    ``,
    ...DISCOVERY_QUERY_PACKS.flatMap((p) => [
      `### ${p.id}`,
      ``,
      p.intent,
      ``,
      ...p.queries.map((q) => `- \`${q}\``),
      ``,
    ]),
    ``,
    `## How to re-check`,
    ``,
    "```bash",
    "npm run authority:intelligence",
    "npm run authority:intelligence -- --mode RECHECK",
    "npm run authority:intelligence -- --no-write --json",
    "```",
    ``,
    `Related systems: Site Intelligence (\`docs/site-intelligence/\`), SEO (\`docs/seo/\`), Content Quality (\`docs/content-quality/\`), Content Assets (\`docs/content-assets/\`), Content Ecosystem (\`docs/content-ecosystem/\`).`,
    ``,
  ];

  return lines.join("\n");
}

export function formatOpportunityListMarkdown(
  title: string,
  opportunities: AuthorityOpportunity[],
  intro: string,
): string {
  return [
    `# ${title}`,
    ``,
    intro,
    ``,
    `| ID | Band | Type | Acquisition | Organization | Target | SEO | Referral | Brand | Effort |`,
    `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
    ...opportunities.map(
      (o) =>
        `| \`${o.id}\` | ${o.scoreBand} | ${o.type} | ${o.acquisitionType} | ${o.organization} | \`${o.targetSoftwareGlimpsePage ?? "—"}\` | ${o.seoValue} | ${o.referralValue} | ${o.brandValue} | ${o.estimatedEffort} |`,
    ),
    ``,
    ...opportunities.flatMap((o) => [
      `## ${o.id}`,
      ``,
      `- **${o.organization}** (\`${o.domain}\`) — ${o.type}`,
      `- ${o.opportunityDescription}`,
      `- Why they might link: ${o.reasonWhyTheyMightLink}`,
      `- Pitch: ${o.suggestedPitchAngle ?? "—"}`,
      `- Link treatment: ${o.expectedLinkTreatment} / ${o.likelyFollowStatus}`,
      `- Score: ${o.scoreBand}${o.scoreNormalized != null ? ` (${o.scoreNormalized})` : ""}`,
      `- Status: ${o.status}`,
      ...(o.complianceFlags.length
        ? [`- Compliance flags: ${o.complianceFlags.join(", ")}`]
        : []),
      ``,
    ]),
  ].join("\n");
}

export function formatLinkableAssetsMarkdown(assets: LinkableAsset[]): string {
  return [
    `# Linkable SoftwareGlimpse assets`,
    ``,
    `Inventory of pages/tools/resources worth promoting. Homepage is deprioritized.`,
    ``,
    `| Name | Kind | Path | Linkability | Status |`,
    `| --- | --- | --- | --- | --- |`,
    ...assets.map(
      (a) =>
        `| ${a.name} | ${a.kind} | \`${a.path}\` | ${a.linkability} | ${a.status} |`,
    ),
    ``,
    ...assets.flatMap((a) => [
      `## ${a.name}`,
      ``,
      a.whyLinkable,
      ``,
      `- Angles: ${a.promotionAngles.join("; ") || "—"}`,
      ``,
    ]),
  ].join("\n");
}

export function formatAnglesMarkdown(angles: OutreachAngleDraft[]): string {
  return [
    `# Outreach angle drafts`,
    ``,
    `**Human action required.** These drafts are never sent by Authority Intelligence.`,
    ``,
    ...angles.flatMap((a) => [
      `## ${a.angleTitle}`,
      ``,
      `| Field | Value |`,
      `| --- | --- |`,
      `| Opportunity | \`${a.opportunityId}\` |`,
      `| Pitch | ${a.pitchSummary} |`,
      `| Why relevant | ${a.whyRelevant} |`,
      `| Assets | ${a.suggestedAssetPaths.map((p) => `\`${p}\``).join(", ") || "—"} |`,
      `| Requires human | yes |`,
      ``,
      `**Do not**`,
      ``,
      ...a.doNotDo.map((d) => `- ${d}`),
      ``,
    ]),
  ].join("\n");
}

export function formatContentGapsMarkdown(
  gaps: ContentAssetGapForLinks[],
): string {
  return [
    `# Content / asset gaps for earning more links`,
    ``,
    `Create these to improve earned-link potential. Authority Intelligence does not create them.`,
    ``,
    ...gaps.flatMap((g) => [
      `## ${g.title}`,
      ``,
      g.description,
      ``,
      `- ID: \`${g.id}\``,
      `- Link-magnet potential: **${g.linkMagnetPotential}**`,
      `- Types: ${g.relatedOpportunityTypes.join(", ")}`,
      `- Cluster: ${g.suggestedCluster ?? "—"}`,
      ``,
    ]),
  ].join("\n");
}

export function formatChangesSection(changes: AuthorityChange[]): string {
  if (changes.length === 0) return "_No prior snapshot._";
  return changes
    .slice(0, 40)
    .map(
      (c) =>
        `- **${c.kind}** \`${c.id}\`${c.previousBand || c.currentBand ? ` (${c.previousBand ?? "—"} → ${c.currentBand ?? "—"})` : ""}`,
    )
    .join("\n");
}
