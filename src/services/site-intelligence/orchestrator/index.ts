/**
 * WebsiteIntelligenceOrchestrator
 *
 * Produces one authoritative local assessment from existing site-intel /
 * SEO / CQ / asset reports. Evaluate / recommend only — never mutates
 * production content, canonicals, robots, or affiliate links.
 */
import fs from "node:fs";
import path from "node:path";
import { runWebsiteOverviewAgent } from "../overview";
import { runCompetitiveGapAgent } from "../competitive-gaps";
import { runRankingOpportunityAgent } from "../ranking-opportunities";
import { runSearchPerformanceAgent } from "../search-performance";
import { runCompetitorWebsiteAnalysisAgent } from "../competitive-benchmark";
import { runSerpCompetitorDiscoveryAgent } from "../serp-competitors";
import { collectWebsiteIntelligence } from "./collect";
import { composeWebsiteIntelligence } from "./compose";
import { saveScorecardSnapshot } from "./history";
import { formatWebsiteIntelligenceMarkdown } from "./report";
import type { WebsiteIntelligenceMode, WebsiteIntelligenceModel } from "./types";

export const WEBSITE_INTELLIGENCE_ORCHESTRATOR = {
  id: "website-intelligence-orchestrator",
  name: "WebsiteIntelligenceOrchestrator",
  version: "1.0.0",
  mutatesProduction: false as const,
} as const;

const OUT_DIR = path.join(process.cwd(), "docs", "site-intelligence");
const ARCHIVE_DIR = path.join(OUT_DIR, "archive");
const LATEST_PATH = path.join(OUT_DIR, "WEBSITE-INTELLIGENCE-LATEST.md");
const JSON_PATH = path.join(OUT_DIR, "website-intelligence-latest.json");

export type WebsiteIntelligenceOptions = {
  mode?: WebsiteIntelligenceMode;
  cluster?: "crm";
  write?: boolean;
  archive?: boolean;
  persistScores?: boolean;
  /** Refresh search-performance from store / optional fixture. */
  refreshSearch?: boolean;
  /** FULL/DEEP: refresh gaps + ranking from existing packs. */
  refreshCompetitive?: boolean;
  /** DEEP: refresh SERP + benchmark (fixture when live APIs unavailable). */
  refreshSerpBenchmark?: boolean;
  /** Force fixture SERP/benchmark/search even when live available. */
  fixture?: boolean;
  generatedAt?: string;
};

function dayStamp(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * Resolve default refresh behavior from mode.
 * LIGHT  — search + overview compose (consume competitive packs)
 * FULL   — + gaps + ranking refresh
 * DEEP   — + SERP/benchmark refresh (fixture-safe)
 */
function resolveRefresh(opts: WebsiteIntelligenceOptions): {
  refreshSearch: boolean;
  refreshCompetitive: boolean;
  refreshSerpBenchmark: boolean;
} {
  const mode = opts.mode ?? "FULL";
  return {
    refreshSearch: opts.refreshSearch ?? true,
    refreshCompetitive:
      opts.refreshCompetitive ?? (mode === "FULL" || mode === "DEEP"),
    refreshSerpBenchmark:
      opts.refreshSerpBenchmark ?? mode === "DEEP",
  };
}

export async function runWebsiteIntelligenceOrchestrator(
  opts: WebsiteIntelligenceOptions = {},
): Promise<{
  agent: typeof WEBSITE_INTELLIGENCE_ORCHESTRATOR;
  generatedAt: string;
  mode: WebsiteIntelligenceMode;
  cluster: string;
  model: WebsiteIntelligenceModel;
  markdown: string;
  paths: {
    latest?: string;
    archive?: string;
    json?: string;
    scorecard?: string;
    overview?: string;
  };
  refreshNotes: string[];
}> {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const mode: WebsiteIntelligenceMode = opts.mode ?? "FULL";
  const cluster = opts.cluster ?? "crm";
  const write = opts.write !== false;
  const refreshNotes: string[] = [];
  const refresh = resolveRefresh(opts);

  // --- Optional refreshes (never mutate production pages) ---
  if (refresh.refreshSerpBenchmark) {
    try {
      const serp = await runSerpCompetitorDiscoveryAgent({
        cluster: "crm",
        write,
        archive: write,
        fixture: opts.fixture === true ? true : undefined,
        generatedAt,
      });
      refreshNotes.push(
        `SERP competitors refreshed → ${serp.paths.latest ?? "(no write)"}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (opts.fixture || /not configured|API|provider/i.test(msg)) {
        try {
          const serp = await runSerpCompetitorDiscoveryAgent({
            cluster: "crm",
            write,
            archive: write,
            fixture: true,
            generatedAt,
          });
          refreshNotes.push(
            `SERP live unavailable (${msg.slice(0, 80)}); used fixture → ${serp.paths.latest ?? "(no write)"}`,
          );
        } catch (err2) {
          refreshNotes.push(
            `SERP refresh skipped: ${err2 instanceof Error ? err2.message : String(err2)}`,
          );
        }
      } else {
        refreshNotes.push(`SERP refresh skipped: ${msg}`);
      }
    }

    try {
      const bench = await runCompetitorWebsiteAnalysisAgent({
        write,
        archive: write,
        // Default offline-safe (fixture HTML) unless --live is wired later.
        // Prefer existing SERP snapshot over built-in SERP fixtures.
        fixture: opts.fixture === true,
        generatedAt,
      });
      refreshNotes.push(
        `Competitive benchmark refreshed → ${bench.paths.latest ?? "(no write)"}`,
      );
    } catch (err) {
      refreshNotes.push(
        `Competitive benchmark skipped: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  if (refresh.refreshCompetitive) {
    try {
      const gaps = await runCompetitiveGapAgent({
        write,
        archive: write,
        fixture: opts.fixture,
        generatedAt,
      });
      refreshNotes.push(
        `Competitive gaps refreshed → ${gaps.paths.latest ?? "(no write)"}`,
      );
    } catch (err) {
      refreshNotes.push(
        `Competitive gaps skipped: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    try {
      const ranking = await runRankingOpportunityAgent({
        write,
        archive: write,
        fixture: opts.fixture,
        generatedAt,
      });
      refreshNotes.push(
        `Ranking opportunities refreshed → ${ranking.paths.latest ?? "(no write)"}`,
      );
    } catch (err) {
      refreshNotes.push(
        `Ranking opportunities skipped: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  } else {
    refreshNotes.push(
      "Competitive gaps / ranking: consumed existing LATEST reports (LIGHT mode)",
    );
  }

  if (refresh.refreshSearch) {
    try {
      const search = await runSearchPerformanceAgent({
        write,
        archive: write,
        fixture: opts.fixture ? true : undefined,
        fromStore: !opts.fixture,
        generatedAt,
      });
      refreshNotes.push(
        `Search performance refreshed (${search.report.sourceMode}, live=${search.report.live}) → ${search.paths.latest ?? "(no write)"}`,
      );
    } catch (err) {
      refreshNotes.push(
        `Search performance skipped: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Always refresh overview so scorecard pillars reflect latest packs
  const overviewResult = runWebsiteOverviewAgent({
    write,
    archive: write,
    generatedAt,
  });
  refreshNotes.push(
    `Website overview refreshed → ${overviewResult.paths.latest ?? "(no write)"}`,
  );

  const collected = collectWebsiteIntelligence(mode);
  const model = composeWebsiteIntelligence({
    generatedAt,
    mode,
    cluster,
    overview: overviewResult.model,
    collected,
    refreshNotes,
  });

  const markdown = formatWebsiteIntelligenceMarkdown(model);
  const paths: {
    latest?: string;
    archive?: string;
    json?: string;
    scorecard?: string;
    overview?: string;
  } = {
    overview: overviewResult.paths.latest,
  };

  if (write) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.latest = path.relative(process.cwd(), LATEST_PATH);

    fs.writeFileSync(
      JSON_PATH,
      JSON.stringify(
        {
          generatedAt,
          mode,
          cluster,
          overallScore: model.overallScore,
          scorecard: model.scorecard,
          confidence: model.confidence,
          executiveVerdict: model.executiveVerdict,
          topRisks: model.topRisks,
          topActions: model.topActions,
          measurementStatus: model.measurementStatus,
          scoreHistory: model.scoreHistory,
          refreshNotes,
          sources: model.sources,
        },
        null,
        2,
      ),
      "utf8",
    );
    paths.json = path.relative(process.cwd(), JSON_PATH);

    if (opts.archive !== false) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${dayStamp(generatedAt)}-website-intelligence.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }

    if (opts.persistScores !== false) {
      paths.scorecard = saveScorecardSnapshot({
        generatedAt,
        mode,
        cluster,
        scores: Object.fromEntries(model.scorecard.map((c) => [c.id, c.score])),
        displays: Object.fromEntries(
          model.scorecard.map((c) => [c.id, c.display]),
        ),
      });
    }
  }

  return {
    agent: WEBSITE_INTELLIGENCE_ORCHESTRATOR,
    generatedAt,
    mode,
    cluster,
    model,
    markdown,
    paths,
    refreshNotes,
  };
}
