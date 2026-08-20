/**
 * PageRankingReadinessAgent
 *
 * Given a SoftwareGlimpse route or content id, produce a local ranking-readiness
 * report. Evaluate / recommend only — never mutates production.
 */
import fs from "node:fs";
import path from "node:path";
import { analyzePageRankingReadiness } from "./analyze";
import { loadPageReadinessContext } from "./load-context";
import { formatPageRankingReadinessMarkdown } from "./report";
import { resolvePageInput } from "./resolve-page";
import type { PageRankingReadinessReport } from "./types";

export const PAGE_RANKING_READINESS_AGENT = {
  id: "page-ranking-readiness-agent",
  name: "PageRankingReadinessAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
} as const;

const OUT_DIR = path.join(
  process.cwd(),
  "docs",
  "site-intelligence",
  "pages",
);

export type PageRankingReadinessOptions = {
  input: string;
  write?: boolean;
  generatedAt?: string;
};

export function runPageRankingReadinessAgent(
  opts: PageRankingReadinessOptions,
): {
  agent: typeof PAGE_RANKING_READINESS_AGENT;
  generatedAt: string;
  report: PageRankingReadinessReport;
  markdown: string;
  paths: { report?: string };
} {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;

  const page = resolvePageInput(opts.input);
  const ctx = loadPageReadinessContext(page);
  const report = analyzePageRankingReadiness(ctx, generatedAt);
  const markdown = formatPageRankingReadinessMarkdown(report);
  const paths: { report?: string } = {};

  if (write) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const outPath = path.join(OUT_DIR, `${report.slug}-ranking-readiness.md`);
    fs.writeFileSync(outPath, markdown, "utf8");
    paths.report = path.relative(process.cwd(), outPath);
  }

  return {
    agent: PAGE_RANKING_READINESS_AGENT,
    generatedAt,
    report,
    markdown,
    paths,
  };
}
