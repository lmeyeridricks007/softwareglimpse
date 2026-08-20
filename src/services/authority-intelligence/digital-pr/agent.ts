import fs from "node:fs";
import path from "node:path";
import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import { buildDigitalPrIdeas, DEFERRED_PR_IDEAS } from "./ideas";
import { buildDataInventory, scanResearchCorpus } from "./inventory";
import {
  DIGITAL_PR_LIVE_QUERIES_RUN,
  EXPERT_COMMENTARY_CHANNELS,
  PUBLICATION_MATCHES,
  SEASONAL_HOOKS,
  assertDigitalPrLiveMatchesPresent,
} from "./live-matches";
import { assertNoInventedStats } from "./qualify";
import { formatDigitalPrReport } from "./reports";
import {
  DIGITAL_PR_AGENT,
  type DigitalPrReport,
  type ExpertCommentaryChannel,
  type PublicationMatch,
  type SeasonalHook,
} from "./types";

export { DIGITAL_PR_AGENT };

const AUTHORITY_DIR = path.join(process.cwd(), "docs", "authority");
const MASTER_PATH = path.join(
  AUTHORITY_DIR,
  "DIGITAL-PR-OPPORTUNITIES-LATEST.md",
);
const ARCHIVE_DIR = path.join(AUTHORITY_DIR, "archive");

export type DigitalPrAgentOptions = {
  write?: boolean;
  archive?: boolean;
  topic?: string;
  generatedAt?: string;
  requireLiveMatches?: boolean;
  publicationMatches?: PublicationMatch[];
  expertCommentary?: ExpertCommentaryChannel[];
  seasonalHooks?: SeasonalHook[];
};

export type DigitalPrAgentResult = {
  agent: typeof DIGITAL_PR_AGENT;
  report: DigitalPrReport;
  paths: { master?: string; archive?: string };
  markdown: string;
};

/**
 * DigitalPROpportunityAgent
 *
 * Identifies genuinely reference-worthy research/asset opportunities.
 * Never invents statistics. Never sends pitches. Report only.
 */
export function runDigitalPrOpportunityAgent(
  opts: DigitalPrAgentOptions = {},
): DigitalPrAgentResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const topic = opts.topic ?? "CRM / business software / RevOps";
  const write = opts.write !== false;

  const publications = opts.publicationMatches ?? PUBLICATION_MATCHES;
  const commentary = opts.expertCommentary ?? EXPERT_COMMENTARY_CHANNELS;
  const seasonal = opts.seasonalHooks ?? SEASONAL_HOOKS;

  if (opts.requireLiveMatches !== false) {
    assertDigitalPrLiveMatchesPresent(publications, commentary);
  }

  const corpus = scanResearchCorpus(generatedAt);
  const dataInventory = buildDataInventory(corpus);
  const ideas = buildDigitalPrIdeas(corpus);
  assertNoInventedStats(ideas);

  const report: DigitalPrReport = {
    version: AUTHORITY_INTELLIGENCE_VERSION,
    generatedAt,
    topic,
    liveSearchRequired: true,
    inventsStatistics: false,
    sendsOutreach: false,
    dataInventory,
    ideas,
    publicationMatches: publications,
    expertCommentary: commentary,
    seasonalHooks: seasonal,
    deferredIdeas: DEFERRED_PR_IDEAS,
    queriesRun: DIGITAL_PR_LIVE_QUERIES_RUN,
    limitations: [
      "Report only — never invents statistics, never pitches journalists, never publishes assets.",
      "PR ideas marked ready/near-ready are limited to dimensions present in SoftwareGlimpse research corpora.",
      "Publication matches list outlets + coverage angles from live verification; journalist names only when verified on-page.",
      "Embeddable assets should require attribution at most — never followed links as a usage condition.",
      "Refresh live publication/commentary matches and re-scan enrichment before treating opportunities as current.",
      `Corpus scan: ${corpus.productCount} products · ${corpus.planCount} plans · ${corpus.featureSupportRows} feature-support rows.`,
    ],
  };

  const markdown = formatDigitalPrReport(report);
  const paths: DigitalPrAgentResult["paths"] = {};

  if (write) {
    fs.mkdirSync(AUTHORITY_DIR, { recursive: true });
    fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
    fs.writeFileSync(MASTER_PATH, markdown, "utf8");
    paths.master = MASTER_PATH;
    if (opts.archive !== false) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-digital-pr-opportunities.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = archivePath;
    }
  }

  return {
    agent: DIGITAL_PR_AGENT,
    report,
    paths,
    markdown,
  };
}
