import fs from "node:fs";
import path from "node:path";
import { buildContentCluster } from "@/services/content-clusters";
import { runContentQualityAudit } from "../audit-engine";
import {
  formatImprovementBacklogMarkdown,
  writeImprovementBacklog,
} from "../improvement/report";
import { generateImprovementOpportunities } from "../improvement/generate";
import { analyzeContentGaps } from "../gaps/analyze";
import {
  formatNewContentOpportunitiesMarkdown,
  writeNewContentOpportunities,
} from "../gaps/report";
import {
  isMissingStatus,
  isOptionalStatus,
  isThinOrResearch,
  loadMapRegister,
  resolveRowRoute,
} from "../gaps/map-register";
import {
  diffScoreSnapshots,
  loadPreviousScoreSnapshot,
  writeScoreSnapshot,
  type ScoreSnapshot,
} from "./diff";
import { inspectContentIntegrity } from "./integrity";
import {
  formatContentIntelligenceMarkdown,
  formatMapCoverageMarkdown,
} from "./master-report";

export const CONTENT_INTELLIGENCE_ORCHESTRATOR = {
  id: "content-intelligence-orchestrator",
  label: "ContentIntelligenceOrchestrator",
  version: "1.0.0",
} as const;

const QUALITY_DIR = path.join(process.cwd(), "docs", "content-quality");
const ARCHIVE_DIR = path.join(QUALITY_DIR, "archive");
const LATEST_PATH = path.join(QUALITY_DIR, "CONTENT-INTELLIGENCE-LATEST.md");
const MAP_COVERAGE_PATH = path.join(
  QUALITY_DIR,
  "CONTENT-MAP-COVERAGE-LATEST.md",
);

export type IntelligenceMode = "FAST" | "FULL";

export type ContentIntelligenceOptions = {
  scope?: "crm";
  mode?: IntelligenceMode;
  write?: boolean;
  /** Write archive copy under docs/content-quality/archive/ */
  archive?: boolean;
  /** Persist score snapshot for next-run diff */
  persistScores?: boolean;
  evaluatedAt?: string;
  /**
   * Optional: refresh generated map coverage report only.
   * Never mutates production page content. Does not rewrite the master map
   * unless explicitly requested via updateMasterMap (docs-only merge note).
   */
  updateMapReport?: boolean;
  /** Docs-only — records a note; does not auto-edit 04-crm-master-content-map.md */
  updateMasterMap?: boolean;
};

function notePath(rel: string, missing: string): string {
  return fs.existsSync(path.join(process.cwd(), rel))
    ? `available (\`${rel}\`)`
    : missing;
}

/**
 * ContentIntelligenceOrchestrator
 *
 * Runs the full evaluate → recommend workflow and writes local Markdown.
 * NEVER creates, rewrites, or publishes production content.
 */
export function runContentIntelligenceOrchestrator(
  opts: ContentIntelligenceOptions = {},
): {
  agent: typeof CONTENT_INTELLIGENCE_ORCHESTRATOR;
  generatedAt: string;
  mode: IntelligenceMode;
  scope: string;
  paths: {
    qualityLatest?: string;
    improvementBacklog?: string;
    newOpportunities?: string;
    intelligenceLatest?: string;
    mapCoverage?: string;
    archive?: string;
    scoresSnapshot?: string;
  };
  summary: {
    pagesAudited: number;
    averageScore: number;
    improvements: number;
    gaps: number;
    duplicates: number;
    integrityCritical: number;
    changeSummary: Record<string, number>;
    exitHint: "ok" | "integrity-critical";
  };
  markdown: string;
} {
  const generatedAt = opts.evaluatedAt ?? new Date().toISOString();
  const mode: IntelligenceMode = opts.mode ?? "FULL";
  const scope = opts.scope ?? "crm";
  const write = opts.write !== false;

  // 1–2. Inventory + page quality audits
  const audit = runContentQualityAudit({
    scope,
    mode,
    writeReports: write,
    writeMaster: write,
    evaluatedAt: generatedAt,
  });

  // 3. Evaluate content clusters (supporting knowledge coverage)
  const cluster = buildContentCluster(scope);
  const clusterCoverage =
    cluster?.coverage.map((c) => ({
      label: c.label,
      existingCore: c.existingCoreCount,
      targetCore: c.targetCoreCount,
      missing: c.missingCoreTopicIds,
    })) ?? [];

  // 4. Improvement opportunities
  const { opportunities, patterns } = generateImprovementOpportunities(
    audit.results,
  );
  const improvementMarkdown = formatImprovementBacklogMarkdown({
    generatedAt,
    opportunities,
    patterns,
    seoNote: notePath(
      "docs/seo/reports/SEO-HEALTH-LATEST.md",
      "not found",
    ),
  });

  // 5–6. New content gaps + duplicates/cannibalization
  const gapAnalysis = analyzeContentGaps();
  const coverageNote = notePath(
    "docs/seo/reports/content-coverage-latest.md",
    "not found",
  );
  const gapsMarkdown = formatNewContentOpportunitiesMarkdown({
    generatedAt,
    analysis: gapAnalysis,
    coverageNote,
    qualityNote: "from this intelligence run",
    backlogNote: "from this intelligence run",
  });

  // 7. Content-map coverage
  const mapRows = loadMapRegister();
  const missingRows = mapRows
    .filter((r) => isMissingStatus(r.statusRaw) && !isOptionalStatus(r.statusRaw))
    .map((r) => ({
      id: r.id,
      title: r.title,
      priority: r.priority,
      status: r.statusRaw,
    }));
  const thinRows = mapRows
    .filter((r) => isThinOrResearch(r.statusRaw, r.researchState))
    .map((r) => ({
      id: r.id,
      title: r.title,
      priority: r.priority,
      route: resolveRowRoute(r) ?? undefined,
    }));
  const mapCoverage = {
    total: mapRows.length,
    missing: missingRows.length,
    thin: thinRows.length,
    optional: mapRows.filter((r) => isOptionalStatus(r.statusRaw)).length,
  };

  // 8. Internal-link support (from improvement link-graph + audit link gaps)
  const linkGaps = audit.results
    .filter((r) =>
      r.assessment.dimensions.some(
        (d) =>
          (d.id === "internal-linking" || d.id === "journey-next-step") &&
          d.score <= 2,
      ),
    )
    .slice(0, 30)
    .map((r) => ({
      route: r.assessment.route,
      note:
        r.assessment.dimensions.find(
          (d) =>
            d.id === "internal-linking" || d.id === "journey-next-step",
        )?.gap ||
        r.assessment.dimensions.find(
          (d) =>
            d.id === "internal-linking" || d.id === "journey-next-step",
        )?.reason ||
        "Weak internal-link / next-step support",
    }));

  // Integrity (deterministic)
  const integrity = inspectContentIntegrity(audit.results);

  // Change tracking
  const previous = loadPreviousScoreSnapshot();
  const scoreSnapshot: ScoreSnapshot = {
    generatedAt,
    mode,
    scope,
    pages: Object.fromEntries(
      audit.results.map((r) => [
        r.assessment.route,
        {
          score: r.assessment.overallScore,
          band: r.assessment.qualityBand,
          pageType: r.assessment.pageType,
          priority: r.improvementPriority,
          title: r.assessment.title,
        },
      ]),
    ),
    recommendationIds: [
      ...opportunities.map((o) => o.id),
      ...gapAnalysis.opportunities.map((o) => o.id),
    ],
  };
  const changes = diffScoreSnapshots(previous, scoreSnapshot);

  // 9. Master recommendations report
  const markdown = formatContentIntelligenceMarkdown({
    generatedAt,
    mode,
    scope,
    results: audit.results,
    improvements: opportunities,
    patterns,
    gaps: gapAnalysis.opportunities,
    duplicates: gapAnalysis.duplicates,
    changes,
    integrity,
    clusterCoverage,
    mapCoverage,
    linkGaps,
    previousGeneratedAt: previous?.generatedAt,
  });

  const mapCoverageMarkdown = formatMapCoverageMarkdown({
    generatedAt,
    mapCoverage,
    missingRows,
    thinRows,
  });

  const paths: {
    qualityLatest?: string;
    improvementBacklog?: string;
    newOpportunities?: string;
    intelligenceLatest?: string;
    mapCoverage?: string;
    archive?: string;
    scoresSnapshot?: string;
  } = {
    qualityLatest: audit.masterPath,
  };

  if (write) {
    paths.improvementBacklog = writeImprovementBacklog(improvementMarkdown);
    paths.newOpportunities = writeNewContentOpportunities(gapsMarkdown);

    fs.mkdirSync(QUALITY_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.intelligenceLatest = LATEST_PATH;

    if (opts.updateMapReport !== false) {
      fs.writeFileSync(MAP_COVERAGE_PATH, mapCoverageMarkdown, "utf8");
      paths.mapCoverage = MAP_COVERAGE_PATH;
    }

    if (opts.archive !== false) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-content-intelligence.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = archivePath;
    }

    if (opts.persistScores !== false) {
      paths.scoresSnapshot = writeScoreSnapshot(scoreSnapshot);
    }

    // 10. Optional master-map note only — never auto-edit production content map
    // unless a human-driven docs merge is requested elsewhere.
    if (opts.updateMasterMap) {
      const notePathFile = path.join(
        QUALITY_DIR,
        "CONTENT-MAP-UPDATE-PENDING.md",
      );
      fs.writeFileSync(
        notePathFile,
        [
          `# Content map update pending`,
          "",
          `Generated: ${generatedAt}`,
          "",
          "ContentIntelligenceOrchestrator does **not** auto-edit",
          "`docs/content-ecosystem/04-crm-master-content-map.md`.",
          "",
          "Human step: merge findings from CONTENT-INTELLIGENCE-LATEST.md +",
          "CONTENT-MAP-COVERAGE-LATEST.md into the master map (docs-only).",
          "",
        ].join("\n"),
        "utf8",
      );
    }
  }

  const changeSummary = {
    "NEW ISSUES": 0,
    RESOLVED: 0,
    IMPROVED: 0,
    REGRESSED: 0,
    UNCHANGED: 0,
  };
  for (const c of changes) changeSummary[c.kind] += 1;

  const integrityCritical = integrity.filter((i) => i.severity === "critical")
    .length;

  return {
    agent: CONTENT_INTELLIGENCE_ORCHESTRATOR,
    generatedAt,
    mode,
    scope,
    paths,
    summary: {
      pagesAudited: audit.results.length,
      averageScore: audit.summary.averageScore,
      improvements: opportunities.length,
      gaps: gapAnalysis.opportunities.length,
      duplicates: gapAnalysis.duplicates.length,
      integrityCritical,
      changeSummary,
      exitHint: integrityCritical > 0 ? "integrity-critical" : "ok",
    },
    markdown,
  };
}
