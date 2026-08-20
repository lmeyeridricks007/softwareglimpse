import fs from "node:fs";
import path from "node:path";
import { writeCrmKeywordTargets } from "../crm-keywords";
import { analyzeRankingOpportunities } from "./analyze";
import { loadRankingOpportunityInputs } from "./load-inputs";
import { formatRankingOpportunitiesMarkdown } from "./report";
import type { RankingOpportunitiesReport } from "./types";

export const RANKING_OPPORTUNITY_AGENT = {
  id: "ranking-opportunity-agent",
  name: "RankingOpportunityAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};

const OUT_DIR = path.join(process.cwd(), "docs", "site-intelligence");
const LATEST_PATH = path.join(OUT_DIR, "RANKING-OPPORTUNITIES-LATEST.md");
const ARCHIVE_DIR = path.join(OUT_DIR, "archive");
const JSON_PATH = path.join(OUT_DIR, "ranking-opportunities-latest.json");

export type RankingOpportunityAgentOptions = {
  write?: boolean;
  archive?: boolean;
  fixture?: boolean;
  serpSnapshotPath?: string;
  generatedAt?: string;
  /** Also refresh CRM-KEYWORD-TARGETS.md (default true when write). */
  writeKeywordTargets?: boolean;
};

export async function runRankingOpportunityAgent(
  opts: RankingOpportunityAgentOptions = {},
): Promise<{
  agent: typeof RANKING_OPPORTUNITY_AGENT;
  generatedAt: string;
  report: RankingOpportunitiesReport;
  markdown: string;
  paths: {
    latest?: string;
    archive?: string;
    json?: string;
    keywords?: string;
  };
}> {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;

  const inputs = loadRankingOpportunityInputs({
    fixture: opts.fixture,
    serpSnapshotPath: opts.serpSnapshotPath,
  });

  const report = analyzeRankingOpportunities(inputs, generatedAt);
  const markdown = formatRankingOpportunitiesMarkdown(report);
  const paths: {
    latest?: string;
    archive?: string;
    json?: string;
    keywords?: string;
  } = {};

  if (write) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.latest = path.relative(process.cwd(), LATEST_PATH);

    fs.writeFileSync(JSON_PATH, JSON.stringify(report, null, 2), "utf8");
    paths.json = path.relative(process.cwd(), JSON_PATH);

    if (opts.archive !== false) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-ranking-opportunities.md`,
      );
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }

    if (opts.writeKeywordTargets !== false) {
      const kw = writeCrmKeywordTargets({
        generatedAt,
        write: true,
        archive: opts.archive !== false,
      });
      paths.keywords = kw.paths.latest;
    }
  }

  return {
    agent: RANKING_OPPORTUNITY_AGENT,
    generatedAt,
    report,
    markdown,
    paths,
  };
}
