import fs from "node:fs";
import path from "node:path";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import { stableAuthorityOpportunityId } from "../stable-ids";
import {
  PRESENCE_LIVE_HITS,
  PRESENCE_LIVE_QUERIES_RUN,
  assertPresenceHitsPresent,
} from "./live-hits";
import {
  PRESENCE_AGENT,
  type PresenceLiveHit,
  type PresenceOpportunity,
  type PresenceReject,
  type PresenceReport,
} from "./types";

export { PRESENCE_AGENT };

const AUTHORITY_DIR = path.join(process.cwd(), "docs", "authority");
const MASTER_PATH = path.join(
  AUTHORITY_DIR,
  "PRESENCE-OPPORTUNITIES-LATEST.md",
);

function qualify(hit: PresenceLiveHit):
  | { decision: "accept"; opportunity: PresenceOpportunity }
  | { decision: "reject"; rejected: PresenceReject } {
  const id = stableAuthorityOpportunityId({
    type: "DIRECTORY",
    domain: hit.domain,
    url: hit.url,
    targetPage: hit.organization,
  });

  if (hit.provisionalDecision === "reject" || hit.seoLinkPrimary) {
    return {
      decision: "reject",
      rejected: {
        id,
        organization: hit.organization,
        reason: hit.rejectReason ?? "AVOID — LINK SCHEME RISK",
        sourceUrl: hit.url,
        notes: hit.pageSummary,
      },
    };
  }

  const score =
    hit.visibilityValue === "excellent"
      ? 90
      : hit.visibilityValue === "strong"
        ? 75
        : hit.visibilityValue === "good"
          ? 60
          : 40;

  return {
    decision: "accept",
    opportunity: {
      id,
      scoreBand:
        score >= 85
          ? "EXCELLENT"
          : score >= 70
            ? "STRONG"
            : score >= 55
              ? "GOOD"
              : "LOW",
      organization: hit.organization,
      domain: hit.domain,
      kind: hit.kind,
      opportunity: hit.opportunity,
      audience: hit.audience,
      visibilityValue: hit.visibilityValue,
      costNotes: hit.costNotes,
      claimPath: hit.claimPath,
      whyWorthwhile: hit.whyWorthwhile,
      sourceUrl: hit.url,
      verifiedAt: hit.verifiedAt,
    },
  };
}

export type PresenceAgentOptions = {
  hits?: PresenceLiveHit[];
  write?: boolean;
  generatedAt?: string;
};

export function runPresenceOpportunityAgent(
  opts: PresenceAgentOptions = {},
): {
  agent: typeof PRESENCE_AGENT;
  report: PresenceReport;
  paths: { master?: string };
  markdown: string;
} {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const hits = opts.hits ?? PRESENCE_LIVE_HITS;
  assertPresenceHitsPresent(hits);

  const accepted: PresenceOpportunity[] = [];
  const rejected: PresenceReject[] = [];
  for (const hit of hits) {
    const r = qualify(hit);
    if (r.decision === "accept") accepted.push(r.opportunity);
    else rejected.push(r.rejected);
  }
  accepted.sort((a, b) => {
    const rank = { EXCELLENT: 4, STRONG: 3, GOOD: 2, LOW: 1, AVOID: 0 };
    return (rank[b.scoreBand] ?? 0) - (rank[a.scoreBand] ?? 0);
  });
  accepted.forEach((o, i) => {
    o.priority = i + 1;
  });

  const report: PresenceReport = {
    version: AUTHORITY_INTELLIGENCE_VERSION,
    generatedAt,
    hitsInvestigated: hits.length,
    accepted,
    rejected,
    queriesRun: PRESENCE_LIVE_QUERIES_RUN,
    limitations: [
      "Report only — never submits directory forms.",
      "Recommend visibility listings; reject dofollow SEO-link primary buys.",
    ],
  };

  const lines = [
    "# Presence / Directory Opportunities — Latest",
    "",
    `> Agent: **PresenceOpportunityAgent** · Generated: ${generatedAt}`,
    "",
    "## Accepted",
    "",
    "| Priority | Organization | Kind | Opportunity | Visibility | Cost | Claim path | Source |",
    "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ...accepted.map(
      (o) =>
        `| ${o.priority} | ${o.organization} | ${o.kind} | ${o.opportunity.replace(/\|/g, "/")} | ${o.visibilityValue} | ${o.costNotes.replace(/\|/g, "/")} | ${o.claimPath.replace(/\|/g, "/")} | ${o.sourceUrl} |`,
    ),
    "",
    "## Rejected",
    "",
    ...rejected.map((r) => `- **${r.organization}**: ${r.reason} — ${r.sourceUrl}`),
    "",
  ];
  const markdown = lines.join("\n");

  const paths: { master?: string } = {};
  if (opts.write !== false) {
    fs.mkdirSync(AUTHORITY_DIR, { recursive: true });
    fs.writeFileSync(MASTER_PATH, markdown, "utf8");
    paths.master = MASTER_PATH;
  }

  return { agent: PRESENCE_AGENT, report, paths, markdown };
}
