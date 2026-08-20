import fs from "node:fs";
import path from "node:path";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import { buildPaidExperiments } from "./experiments";
import {
  PAID_LIVE_HITS,
  PAID_LIVE_QUERIES_RUN,
  assertPaidLiveHitsPresent,
} from "./live-hits";
import { qualifyPaidHit, rankPaidOpportunities } from "./qualify";
import { formatPaidPromotionReport } from "./reports";
import {
  PAID_PROMOTION_AGENT,
  type BudgetTier,
  type PaidAvoidOpportunity,
  type PaidLiveHit,
  type PaidPromotionOpportunity,
  type PaidPromotionReport,
} from "./types";

export { PAID_PROMOTION_AGENT };

const AUTHORITY_DIR = path.join(process.cwd(), "docs", "authority");
const MASTER_PATH = path.join(
  AUTHORITY_DIR,
  "PAID-PROMOTION-OPPORTUNITIES-LATEST.md",
);
const ARCHIVE_DIR = path.join(AUTHORITY_DIR, "archive");

export type PaidPromotionAgentOptions = {
  hits?: PaidLiveHit[];
  write?: boolean;
  archive?: boolean;
  topic?: string;
  generatedAt?: string;
  requireLiveHits?: boolean;
};

export type PaidPromotionAgentResult = {
  agent: typeof PAID_PROMOTION_AGENT;
  report: PaidPromotionReport;
  paths: { master?: string; archive?: string };
  markdown: string;
};

/**
 * PaidPromotionOpportunityAgent
 *
 * Discovers paid promotional opportunities for referral/brand/visibility.
 * Never purchases placements. Never recommends paying for dofollow/SEO juice.
 */
export function runPaidPromotionOpportunityAgent(
  opts: PaidPromotionAgentOptions = {},
): PaidPromotionAgentResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const topic = opts.topic ?? "CRM / business software / RevOps";
  const write = opts.write !== false;
  const hits = opts.hits ?? PAID_LIVE_HITS;

  if (opts.requireLiveHits !== false) {
    assertPaidLiveHitsPresent(hits);
  }

  const acceptedRaw: PaidPromotionOpportunity[] = [];
  const avoided: PaidAvoidOpportunity[] = [];

  for (const hit of hits) {
    const result = qualifyPaidHit(hit);
    if (result.decision === "accept") acceptedRaw.push(result.opportunity);
    else avoided.push(result.avoided);
  }

  const accepted = rankPaidOpportunities(acceptedRaw);

  const byBudgetTier: PaidPromotionReport["byBudgetTier"] = {};
  for (const o of accepted) {
    const tier = o.budgetTier as BudgetTier;
    byBudgetTier[tier] = byBudgetTier[tier] ?? [];
    byBudgetTier[tier]!.push(o);
  }

  const experiments = buildPaidExperiments(accepted);

  const report: PaidPromotionReport = {
    version: AUTHORITY_INTELLIGENCE_VERSION,
    generatedAt,
    topic,
    liveSearchRequired: true,
    purchasesPlacements: false,
    hitsInvestigated: hits.length,
    accepted,
    avoided,
    byBudgetTier,
    experiments,
    queriesRun: PAID_LIVE_QUERIES_RUN,
    limitations: [
      "Report only — this agent never purchases placements or submits sponsorship forms.",
      "Costs use published figures when available; otherwise PRICE UNKNOWN.",
      "Paid placements are scored for referral/brand/lead value — not SEO link equity.",
      "Offers pitching dofollow / link juice are avoided under link-scheme policy.",
      "Refresh live hits before treating opportunities as current.",
    ],
  };

  const markdown = formatPaidPromotionReport(report);
  const paths: PaidPromotionAgentResult["paths"] = {};

  if (write) {
    fs.mkdirSync(AUTHORITY_DIR, { recursive: true });
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    fs.writeFileSync(MASTER_PATH, markdown, "utf8");
    paths.master = MASTER_PATH;
    if (opts.archive !== false) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-paid-promotion-opportunities.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = archivePath;
    }
  }

  return {
    agent: PAID_PROMOTION_AGENT,
    report,
    paths,
    markdown,
  };
}
