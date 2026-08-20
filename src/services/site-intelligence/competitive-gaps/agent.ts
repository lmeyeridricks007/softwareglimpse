import fs from "node:fs";
import path from "node:path";
import { analyzeCompetitiveGaps } from "./analyze";
import { loadCompetitiveGapInputs } from "./load-inputs";
import { formatCompetitiveGapsMarkdown } from "./report";
import type { CompetitiveGapReport } from "./types";

export const COMPETITIVE_GAP_AGENT = {
  id: "competitive-gap-agent",
  name: "CompetitiveGapAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};

const OUT_DIR = path.join(
  process.cwd(),
  "docs",
  "site-intelligence",
  "competitors",
);
const LATEST_PATH = path.join(OUT_DIR, "COMPETITIVE-GAPS-LATEST.md");
const ARCHIVE_DIR = path.join(OUT_DIR, "archive");
const JSON_PATH = path.join(OUT_DIR, "competitive-gaps-latest.json");

export type CompetitiveGapOptions = {
  write?: boolean;
  archive?: boolean;
  fixture?: boolean;
  serpSnapshotPath?: string;
  benchmarkJsonPath?: string;
  generatedAt?: string;
};

export async function runCompetitiveGapAgent(
  opts: CompetitiveGapOptions = {},
): Promise<{
  agent: typeof COMPETITIVE_GAP_AGENT;
  generatedAt: string;
  report: CompetitiveGapReport;
  markdown: string;
  paths: { latest?: string; archive?: string; json?: string };
}> {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;

  const inputs = loadCompetitiveGapInputs({
    fixture: opts.fixture,
    serpSnapshotPath: opts.serpSnapshotPath,
    benchmarkJsonPath: opts.benchmarkJsonPath,
  });

  if (!opts.fixture && !inputs.benchmark) {
    // Soft-continue with SERP + CQ + map only
    inputs.sources.push({
      id: "benchmark-warning",
      path: "competitive-benchmark-latest.json",
      status: "missing",
    });
  }

  const report = analyzeCompetitiveGaps(inputs, generatedAt);
  const markdown = formatCompetitiveGapsMarkdown(report);
  const paths: { latest?: string; archive?: string; json?: string } = {};

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
        `${day}-competitive-gaps.md`,
      );
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }
  }

  return {
    agent: COMPETITIVE_GAP_AGENT,
    generatedAt,
    report,
    markdown,
    paths,
  };
}
