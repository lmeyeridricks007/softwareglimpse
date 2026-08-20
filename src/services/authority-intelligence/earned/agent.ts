import fs from "node:fs";
import path from "node:path";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import {
  EARNED_LIVE_HITS,
  EARNED_LIVE_QUERIES_RUN,
  assertLiveHitsPresent,
} from "./live-hits";
import { qualifyLiveHit, rankTopN } from "./qualify";
import {
  EARNED_BACKLINK_AGENT,
  type EarnedBacklinkOpportunity,
  type EarnedBacklinkReport,
  type EarnedRejectedOpportunity,
  type LiveSearchHit,
} from "./types";
import {
  formatDomainReport,
  formatEarnedMasterReport,
  formatRejectReport,
} from "./reports";

export { EARNED_BACKLINK_AGENT };

const AUTHORITY_DIR = path.join(process.cwd(), "docs", "authority");
const EARNED_DIR = path.join(AUTHORITY_DIR, "earned");
const MASTER_PATH = path.join(
  AUTHORITY_DIR,
  "EARNED-BACKLINK-OPPORTUNITIES-LATEST.md",
);
const REJECT_PATH = path.join(
  AUTHORITY_DIR,
  "earned-backlink-rejects-latest.md",
);
const ARCHIVE_DIR = path.join(AUTHORITY_DIR, "archive");

export type EarnedBacklinkAgentOptions = {
  hits?: LiveSearchHit[];
  write?: boolean;
  archive?: boolean;
  topN?: number;
  topic?: string;
  generatedAt?: string;
  /** When true, refuse to run if hits empty (default true) */
  requireLiveHits?: boolean;
};

export type EarnedBacklinkAgentResult = {
  agent: typeof EARNED_BACKLINK_AGENT;
  report: EarnedBacklinkReport;
  paths: {
    master?: string;
    rejects?: string;
    domains: string[];
    archive?: string;
  };
  markdown: string;
};

function ensureDirs(): void {
  fs.mkdirSync(AUTHORITY_DIR, { recursive: true });
  fs.mkdirSync(EARNED_DIR, { recursive: true });
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
}

function domainSlug(domain: string): string {
  return domain
    .replace(/^www\./, "")
    .replace(/[^a-z0-9.-]+/gi, "-")
    .toLowerCase();
}

/**
 * EarnedBacklinkOpportunityAgent
 *
 * Processes live-verified web search hits into prioritized earned-link
 * opportunities. Never invents URLs. Never sends outreach.
 */
export function runEarnedBacklinkOpportunityAgent(
  opts: EarnedBacklinkAgentOptions = {},
): EarnedBacklinkAgentResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const topic =
    opts.topic ?? "CRM, sales intelligence & business software";
  const topN = opts.topN ?? 50;
  const write = opts.write !== false;
  const hits = opts.hits ?? EARNED_LIVE_HITS;

  if (opts.requireLiveHits !== false) {
    assertLiveHitsPresent(hits);
  }

  const accepted: EarnedBacklinkOpportunity[] = [];
  const rejected: EarnedRejectedOpportunity[] = [];

  for (const hit of hits) {
    const result = qualifyLiveHit(hit);
    if (result.decision === "accept") accepted.push(result.opportunity);
    else rejected.push(result.rejected);
  }

  const top50 = rankTopN(accepted, topN);

  const report: EarnedBacklinkReport = {
    version: AUTHORITY_INTELLIGENCE_VERSION,
    generatedAt,
    topic,
    liveSearchRequired: true,
    hitsInvestigated: hits.length,
    accepted,
    rejected,
    top50,
    queriesRun: EARNED_LIVE_QUERIES_RUN,
    limitations: [
      "Opportunities are limited to live-verified search hits — no invented domains.",
      "Unlinked-mention coverage depends on public index visibility of SoftwareGlimpse.",
      "Broken-link replacement requires per-URL HTTP verification; candidates flagged only when fit is clear.",
      "Competitor link-gap without a backlink index provider uses SERP co-occurrence / complementary classification only.",
      "Contact paths are public pages only — no private contact database scraping.",
      "Agents never send outreach, submit forms, or buy placements.",
    ],
  };

  const markdown = formatEarnedMasterReport(report);
  const paths: EarnedBacklinkAgentResult["paths"] = { domains: [] };

  if (write) {
    ensureDirs();
    fs.writeFileSync(MASTER_PATH, markdown, "utf8");
    paths.master = MASTER_PATH;

    fs.writeFileSync(REJECT_PATH, formatRejectReport(report), "utf8");
    paths.rejects = REJECT_PATH;

    // One report per domain (latest opportunity for that domain)
    const byDomain = new Map<string, EarnedBacklinkOpportunity[]>();
    for (const opp of top50) {
      const list = byDomain.get(opp.domain) ?? [];
      list.push(opp);
      byDomain.set(opp.domain, list);
    }
    for (const [domain, opps] of byDomain) {
      const file = path.join(EARNED_DIR, `${domainSlug(domain)}.md`);
      fs.writeFileSync(file, formatDomainReport(domain, opps, report), "utf8");
      paths.domains.push(file);
    }

    if (opts.archive !== false) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-earned-backlink-opportunities.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = archivePath;
    }
  }

  return {
    agent: EARNED_BACKLINK_AGENT,
    report,
    paths,
    markdown,
  };
}
