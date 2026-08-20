import fs from "node:fs";
import path from "node:path";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import {
  PARTNERSHIP_LIVE_HITS,
  PARTNERSHIP_LIVE_QUERIES_RUN,
  assertPartnershipLiveHitsPresent,
} from "./live-hits";
import {
  qualifyPartnershipHit,
  rankPartnershipOpportunities,
} from "./qualify";
import { formatPartnershipReport } from "./reports";
import {
  PARTNERSHIP_AGENT,
  type PartnershipLiveHit,
  type PartnershipOpportunity,
  type PartnershipReject,
  type PartnershipReport,
  type PartnerType,
} from "./types";

export { PARTNERSHIP_AGENT };

const AUTHORITY_DIR = path.join(process.cwd(), "docs", "authority");
const MASTER_PATH = path.join(
  AUTHORITY_DIR,
  "PARTNERSHIP-OPPORTUNITIES-LATEST.md",
);
const ARCHIVE_DIR = path.join(AUTHORITY_DIR, "archive");

export type PartnershipAgentOptions = {
  hits?: PartnershipLiveHit[];
  write?: boolean;
  archive?: boolean;
  topic?: string;
  generatedAt?: string;
  requireLiveHits?: boolean;
};

export type PartnershipAgentResult = {
  agent: typeof PARTNERSHIP_AGENT;
  report: PartnershipReport;
  paths: { master?: string; archive?: string };
  markdown: string;
};

/**
 * PartnershipOpportunityAgent
 *
 * Identifies organizations with genuine collaboration reasons.
 * Never contacts partners. Never recommends mass link exchange.
 * Never misrepresents SG as an implementation partner.
 */
export function runPartnershipOpportunityAgent(
  opts: PartnershipAgentOptions = {},
): PartnershipAgentResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const topic = opts.topic ?? "CRM / business software / RevOps";
  const write = opts.write !== false;
  const hits = opts.hits ?? PARTNERSHIP_LIVE_HITS;

  if (opts.requireLiveHits !== false) {
    assertPartnershipLiveHitsPresent(hits);
  }

  const acceptedRaw: PartnershipOpportunity[] = [];
  const rejected: PartnershipReject[] = [];

  for (const hit of hits) {
    const result = qualifyPartnershipHit(hit);
    if (result.decision === "accept") acceptedRaw.push(result.opportunity);
    else rejected.push(result.rejected);
  }

  const accepted = rankPartnershipOpportunities(acceptedRaw);

  const byPartnerType: PartnershipReport["byPartnerType"] = {};
  for (const o of accepted) {
    const t = o.partnerType as PartnerType;
    byPartnerType[t] = byPartnerType[t] ?? [];
    byPartnerType[t]!.push(o);
  }

  const report: PartnershipReport = {
    version: AUTHORITY_INTELLIGENCE_VERSION,
    generatedAt,
    topic,
    liveSearchRequired: true,
    contactsPartners: false,
    hitsInvestigated: hits.length,
    accepted,
    rejected,
    byPartnerType,
    queriesRun: PARTNERSHIP_LIVE_QUERIES_RUN,
    limitations: [
      "Report only — this agent never contacts partners or submits partner applications.",
      "Mass link exchange is rejected; natural citations from real collaboration remain allowed.",
      "Vendor SI / Solutions Partner enrollments are rejected when they would misrepresent SoftwareGlimpse.",
      "Collaborate with existing accredited partners instead of claiming SI status.",
      "Refresh live hits before treating opportunities as current.",
    ],
  };

  const markdown = formatPartnershipReport(report);
  const paths: PartnershipAgentResult["paths"] = {};

  if (write) {
    fs.mkdirSync(AUTHORITY_DIR, { recursive: true });
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    fs.writeFileSync(MASTER_PATH, markdown, "utf8");
    paths.master = MASTER_PATH;
    if (opts.archive !== false) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-partnership-opportunities.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = archivePath;
    }
  }

  return {
    agent: PARTNERSHIP_AGENT,
    report,
    paths,
    markdown,
  };
}
