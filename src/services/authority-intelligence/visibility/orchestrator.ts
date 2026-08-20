/**
 * AuthorityVisibilityIntelligenceOrchestrator
 *
 * Runs specialized authority agents + consumes site/content/asset intelligence.
 * Produces AUTHORITY-VISIBILITY-LATEST.md — never outreach or purchases.
 */

import fs from "node:fs";
import path from "node:path";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import { inventoryLinkableAssets } from "../linkable-assets";
import { runEarnedBacklinkOpportunityAgent } from "../earned";
import { runPaidPromotionOpportunityAgent } from "../paid";
import { runDigitalPrOpportunityAgent } from "../digital-pr";
import { runPartnershipOpportunityAgent } from "../partnership";
import { runContentPromotionOpportunityAgent } from "../promotion";
import { runPresenceOpportunityAgent } from "../presence";
import { consumeSiteIntelligenceInputs } from "./consume-site-inputs";
import { formatAuthorityVisibilityReport } from "./master-report";
import { buildExecutiveScorecard } from "./scorecard";
import {
  diffVisibilityHistory,
  ensureAcquisitionsFile,
  loadAcquisitions,
  loadPreviousVisibilitySnapshot,
  stableVisibilityId,
  writeVisibilitySnapshot,
  VISIBILITY_SNAPSHOT_PATH,
  type TrackedOpportunity,
} from "./tracking";

export const AUTHORITY_VISIBILITY_ORCHESTRATOR = {
  id: "authority-visibility-intelligence-orchestrator",
  label: "AuthorityVisibilityIntelligenceOrchestrator",
  version: AUTHORITY_INTELLIGENCE_VERSION,
  mutatesProduction: false as const,
  sendsOutreach: false as const,
  purchasesPlacements: false as const,
} as const;

export type VisibilityMode = "FAST" | "FULL" | "RECHECK";

export type VisibilityOrchestratorOptions = {
  mode?: VisibilityMode;
  write?: boolean;
  archive?: boolean;
  generatedAt?: string;
  /** When FAST, still runs agents but skips archive */
  skipArchiveOnFast?: boolean;
};

const AUTHORITY_DIR = path.join(process.cwd(), "docs", "authority");
const MASTER_PATH = path.join(AUTHORITY_DIR, "AUTHORITY-VISIBILITY-LATEST.md");
const ARCHIVE_DIR = path.join(AUTHORITY_DIR, "archive");
const FINAL_REPORT_PATH = path.join(
  AUTHORITY_DIR,
  "AUTHORITY-VISIBILITY-SYSTEM.md",
);

function buildPlans(discovery: {
  presenceCount: number;
  earnedTop: string[];
  promoAssets: string[];
  partners: string[];
  prReady: string[];
  paidTests: string[];
}): { plan30: string[]; plan90: string[]; plan180: string[] } {
  const plan30 = [
    `Claim/verify top directory presence (${discovery.presenceCount} accepted listings this run — start with G2/Capterra family).`,
    `Promote flagship assets: ${discovery.promoAssets.slice(0, 3).join("; ") || "CRM Evaluation Checklist + Cost Calculator"}.`,
    `Pitch ${Math.min(5, discovery.earnedTop.length)} strongest earned opportunities: ${discovery.earnedTop.slice(0, 3).join("; ")}.`,
    `Open consultant/community partnership conversations (report-only shortlist): ${discovery.partners.slice(0, 3).join("; ")}.`,
    `Prepare draft outline for one data-led PR asset: ${discovery.prReady[0] ?? "CRM Pricing Index / plan-gating study"}.`,
    "Do not purchase dofollow/SEO-link packages; skip spam directories.",
  ];

  const plan90 = [
    "Pursue earned editorial/resource citations from Top 25 list with genuine angles.",
    `Advance partnerships: ${discovery.partners.slice(0, 5).join("; ")}.`,
    "Publish/soft-launch one tool distribution plan (Finder or Cost Calculator).",
    "Ship first digital PR dataset (methodology + embeddable chart) if corpus QA passes.",
    `Run 1–2 paid visibility experiments only if budgeted: ${discovery.paidTests.slice(0, 2).join("; ") || "RevOps newsletter test"}.`,
    "Guest expertise via Featured/Qwoted/Help A B2B Writer with real SG data points.",
    "Newsletter/community promotion using ContentPromotion angles (help-first).",
  ];

  const plan180 = [
    "Sustain original research cadence (pricing index / plan-gating refreshes).",
    "Grow recognizable interactive tools as citation magnets.",
    "Build owned newsletter audience from resource downloads.",
    "Deepen industry partnerships and recurring co-webinars.",
    "Maintain quarterly PR hooks (Dreamforce / budget season).",
    "Accumulate evidence-backed link acquisition records — never invent won links.",
    "Re-run competitor authority gap analysis when backlink data source exists.",
  ];

  return { plan30, plan90, plan180 };
}

export function runAuthorityVisibilityIntelligenceOrchestrator(
  opts: VisibilityOrchestratorOptions = {},
): {
  agent: typeof AUTHORITY_VISIBILITY_ORCHESTRATOR;
  generatedAt: string;
  mode: VisibilityMode;
  paths: Record<string, string | undefined>;
  markdown: string;
  scorecard: ReturnType<typeof buildExecutiveScorecard>;
  summary: Record<string, number | string>;
} {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const mode: VisibilityMode = opts.mode ?? "FULL";
  const write = opts.write !== false;
  const archive =
    opts.archive !== false && !(mode === "FAST" && opts.skipArchiveOnFast !== false);

  const agentsRun: string[] = [];
  const siteInputs = consumeSiteIntelligenceInputs();

  // Specialized agents (report-only)
  agentsRun.push("EarnedBacklinkOpportunityAgent");
  const earned = runEarnedBacklinkOpportunityAgent({
    write,
    archive: false,
    generatedAt,
  });

  agentsRun.push("PaidPromotionOpportunityAgent");
  const paid = runPaidPromotionOpportunityAgent({
    write,
    archive: false,
    generatedAt,
  });

  agentsRun.push("DigitalPROpportunityAgent");
  const digitalPr = runDigitalPrOpportunityAgent({
    write,
    archive: false,
    generatedAt,
  });

  agentsRun.push("PresenceOpportunityAgent");
  const presence = runPresenceOpportunityAgent({ write, generatedAt });

  agentsRun.push("PartnershipOpportunityAgent");
  const partnerships = runPartnershipOpportunityAgent({
    write,
    archive: false,
    generatedAt,
  });

  agentsRun.push("ContentPromotionOpportunityAgent");
  const promotion = runContentPromotionOpportunityAgent({
    write,
    archive: false,
    generatedAt,
  });

  const linkableAssets = inventoryLinkableAssets();
  ensureAcquisitionsFile();
  const acquisitions = loadAcquisitions();

  const scorecard = buildExecutiveScorecard({
    linkableAssets,
    earned: earned.report,
    paid: paid.report,
    digitalPr: digitalPr.report,
    partnerships: partnerships.report,
    promotion: promotion.report,
    presence: presence.report,
    acquisitionCount: acquisitions.length,
  });

  // Unified tracking IDs
  const tracked: TrackedOpportunity[] = [];
  let i = 1;
  for (const a of linkableAssets
    .filter((x) => x.linkability === "excellent" || x.linkability === "strong")
    .slice(0, 20)) {
    tracked.push({
      id: stableVisibilityId("RESOURCE", a.path, i++),
      family: "RESOURCE",
      title: a.name,
      status: "NEW",
      scoreBand: a.linkability.toUpperCase(),
      agentId: "linkable-assets",
    });
  }
  i = 1;
  for (const o of earned.report.top50.slice(0, 25)) {
    tracked.push({
      id: stableVisibilityId("EARNED", o.id, i++),
      family: "EARNED",
      title: o.opportunityTitle,
      sourceUrl: o.opportunityUrl,
      status: "NEW",
      scoreBand: o.scoreBand,
      agentId: earned.agent.id,
    });
  }
  i = 1;
  for (const o of paid.report.accepted.slice(0, 10)) {
    tracked.push({
      id: stableVisibilityId("PAID", o.id, i++),
      family: "PAID",
      title: o.siteChannel,
      sourceUrl: o.sourceUrl,
      status: "NEW",
      scoreBand: o.scoreBand,
      agentId: paid.agent.id,
    });
  }
  i = 1;
  for (const o of digitalPr.report.ideas.slice(0, 10)) {
    tracked.push({
      id: stableVisibilityId("PR", o.id, i++),
      family: "PR",
      title: o.title,
      status: "NEW",
      scoreBand: o.scoreBand,
      agentId: digitalPr.agent.id,
    });
  }
  i = 1;
  for (const o of presence.report.accepted) {
    tracked.push({
      id: stableVisibilityId("PRESENCE", o.id, i++),
      family: "PRESENCE",
      title: o.organization,
      sourceUrl: o.sourceUrl,
      status: "NEW",
      scoreBand: o.scoreBand,
      agentId: presence.agent.id,
    });
  }
  i = 1;
  for (const o of partnerships.report.accepted.slice(0, 15)) {
    tracked.push({
      id: stableVisibilityId("PARTNER", o.id, i++),
      family: "PARTNER",
      title: o.organization,
      sourceUrl: o.sourceUrl,
      status: "NEW",
      scoreBand: o.scoreBand,
      agentId: partnerships.agent.id,
    });
  }
  i = 1;
  for (const o of promotion.report.plans.slice(0, 15)) {
    tracked.push({
      id: stableVisibilityId("PROMO", o.id, i++),
      family: "PROMO",
      title: o.assetName,
      status: "NEW",
      scoreBand: o.scoreBand,
      agentId: promotion.agent.id,
    });
  }

  const spamAvoid: Array<{ source: string; reason: string }> = [
    ...paid.report.avoided.map((a) => ({
      source: a.siteChannel,
      reason: a.reason,
    })),
    ...partnerships.report.rejected.map((a) => ({
      source: a.organization,
      reason: a.reason,
    })),
    ...presence.report.rejected.map((a) => ({
      source: a.organization,
      reason: a.reason,
    })),
    ...promotion.report.rejectedTactics.map((a) => ({
      source: a.tactic,
      reason: a.reason,
    })),
    ...earned.report.rejected.slice(0, 10).map((a) => ({
      source: a.opportunityTitle,
      reason: a.reason,
    })),
  ];

  const contentGapsLinkable = [
    ...digitalPr.report.ideas
      .filter((i) => i.status === "ready" || i.status === "near-ready")
      .slice(0, 5)
      .map((i) => `${i.title} (${i.status}) — ${i.recommendedNextAction}`),
    ...digitalPr.report.deferredIdeas.map(
      (d) => `Deferred until data exists: ${d.title} — ${d.reason}`,
    ),
  ];

  const { plan30, plan90, plan180 } = buildPlans({
    presenceCount: presence.report.accepted.length,
    earnedTop: earned.report.top50
      .slice(0, 5)
      .map((o) => o.opportunityTitle),
    promoAssets: promotion.report.plans
      .slice(0, 5)
      .map((p) => p.assetName),
    partners: partnerships.report.accepted
      .slice(0, 5)
      .map((p) => p.organization),
    prReady: digitalPr.report.ideas
      .filter((i) => i.status === "ready")
      .map((i) => i.title),
    paidTests: paid.report.experiments.map((e) => e.title),
  });

  const previous = loadPreviousVisibilitySnapshot();
  const snapshot = {
    generatedAt,
    mode,
    opportunityIds: tracked.map((t) => t.id),
    items: tracked,
    acquisitions,
  };
  const history = diffVisibilityHistory(previous, snapshot);

  const model = {
    generatedAt,
    mode,
    version: AUTHORITY_INTELLIGENCE_VERSION,
    agentsRun,
    siteInputs,
    scorecard,
    linkableAssets,
    earned: earned.report,
    paid: paid.report,
    digitalPr: digitalPr.report,
    partnerships: partnerships.report,
    promotion: promotion.report,
    presence: presence.report,
    tracked,
    history,
    plan30,
    plan90,
    plan180,
    spamAvoid,
    contentGapsLinkable,
    measurementNotes: [
      "Where analytics/GSC exist: track referral traffic, downloads, Finder starts, signups, brand impressions, branded queries, organic visibility, links acquired.",
      "Do not attribute ranking movement to one backlink without evidence.",
      "Do not invent follow/rel — record only observed attributes in link-acquisitions.json.",
    ],
    limitations: [
      "Never sends outreach, submits forms, or purchases placements.",
      "Current External Authority is UNKNOWN unless acquisitions are recorded with evidence.",
      "Competitor backlink gaps require live competitor intelligence — not invented lists.",
      "Opportunity tracking IDs (AUTH-*) are regenerated each run for cataloging; human status updates should be merged carefully in future RECHECK work.",
      "Seed catalog AuthorityIntelligenceOrchestrator remains available via npm run authority:seed for foundational fixture discovery.",
    ],
    commands: [
      "npm run authority:intelligence",
      "npm run authority:audit",
      "npm run authority:links",
      "npm run authority:paid",
      "npm run authority:pr",
      "npm run authority:partners",
      "npm run authority:promotion",
      "npm run authority:presence",
      "npm run authority:seed",
    ],
    schedule: [
      {
        cadence: "Weekly",
        work: "Opportunity freshness + mention/link health (RECHECK / snapshot diff)",
      },
      {
        cadence: "Monthly",
        work: "Full discovery across earned/paid/PR/presence/partners/promotion",
      },
      {
        cadence: "Quarterly",
        work: "Deep competitor authority gap + digital PR planning",
      },
    ],
    reportLocations: [
      { name: "Master visibility", path: "docs/authority/AUTHORITY-VISIBILITY-LATEST.md" },
      { name: "System doc", path: "docs/authority/AUTHORITY-VISIBILITY-SYSTEM.md" },
      { name: "Earned", path: "docs/authority/EARNED-BACKLINK-OPPORTUNITIES-LATEST.md" },
      { name: "Paid", path: "docs/authority/PAID-PROMOTION-OPPORTUNITIES-LATEST.md" },
      { name: "Digital PR", path: "docs/authority/DIGITAL-PR-OPPORTUNITIES-LATEST.md" },
      { name: "Presence", path: "docs/authority/PRESENCE-OPPORTUNITIES-LATEST.md" },
      { name: "Partnerships", path: "docs/authority/PARTNERSHIP-OPPORTUNITIES-LATEST.md" },
      { name: "Promotion", path: "docs/authority/PROMOTION-OPPORTUNITIES-LATEST.md" },
      {
        name: "Acquisitions store",
        path: "docs/authority/tracking/link-acquisitions.json",
      },
      {
        name: "Visibility snapshot",
        path: "docs/authority/tracking/visibility-snapshot-latest.json",
      },
    ],
  };

  const markdown = formatAuthorityVisibilityReport(model);
  const paths: Record<string, string | undefined> = {};

  if (write) {
    fs.mkdirSync(AUTHORITY_DIR, { recursive: true });
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    fs.writeFileSync(MASTER_PATH, markdown, "utf8");
    paths.master = MASTER_PATH;
    writeVisibilitySnapshot(snapshot);
    paths.snapshot = VISIBILITY_SNAPSHOT_PATH;

    if (archive) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-authority-visibility.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = archivePath;
    }

    // System / final report
    const systemDoc = buildSystemDoc(model.agentsRun, model.commands, model.schedule, model.reportLocations, model.limitations);
    fs.writeFileSync(FINAL_REPORT_PATH, systemDoc, "utf8");
    paths.system = FINAL_REPORT_PATH;
  }

  return {
    agent: AUTHORITY_VISIBILITY_ORCHESTRATOR,
    generatedAt,
    mode,
    paths,
    markdown,
    scorecard,
    summary: {
      earnedTop: earned.report.top50.length,
      paid: paid.report.accepted.length,
      prIdeas: digitalPr.report.ideas.length,
      presence: presence.report.accepted.length,
      partnerships: partnerships.report.accepted.length,
      promotionPlans: promotion.report.plans.length,
      tracked: tracked.length,
      newOpportunities: history.newOpportunities.length,
      wonLinks: history.wonLinks.length,
      authorityReadiness: scorecard.authorityReadiness,
    },
  };
}

function buildSystemDoc(
  agents: string[],
  commands: string[],
  schedule: Array<{ cadence: string; work: string }>,
  locations: Array<{ name: string; path: string }>,
  limitations: string[],
): string {
  return `# Authority Visibility Intelligence — System

> Generated by AuthorityVisibilityIntelligenceOrchestrator

## Agents

${agents.map((a) => `- ${a}`).join("\n")}
- (Foundational seed catalog) AuthorityIntelligenceOrchestrator via \`authority:seed\`

## Search integrations

- Live-verified hit catalogs per specialized agent (earned / paid / PR / presence / partnerships / promotion channels)
- Refresh catalogs with a new live search pass before treating opportunities as current
- No invented journalist names, statistics, or won links

## Commands

${commands.map((c) => `- \`${c}\``).join("\n")}

## Report locations

| Report | Path |
| --- | --- |
${locations.map((l) => `| ${l.name} | \`${l.path}\` |`).join("\n")}

## Scheduling

| Cadence | Work |
| --- | --- |
${schedule.map((s) => `| ${s.cadence} | ${s.work} |`).join("\n")}

## Measurement

- Referral traffic, downloads, Finder starts, signups, brand impressions, branded queries, organic visibility, links acquired (when analytics/GSC/acquisition records exist)
- Do not attribute ranking movement to one backlink without evidence
- Link acquisition records: source URL, target URL, anchor, link type, observed rel, date, acquisition type, cost — never invent follow status

## Limitations

${limitations.map((l) => `- ${l}`).join("\n")}

## Tests

\`\`\`bash
npx vitest run src/services/authority-intelligence/visibility/visibility.test.ts
npx vitest run src/services/authority-intelligence/earned/earned-backlink.test.ts
npx vitest run src/services/authority-intelligence/paid/paid-promotion.test.ts
npx vitest run src/services/authority-intelligence/digital-pr/digital-pr.test.ts
npx vitest run src/services/authority-intelligence/partnership/partnership.test.ts
npx vitest run src/services/authority-intelligence/promotion/promotion.test.ts
\`\`\`
`;
}
