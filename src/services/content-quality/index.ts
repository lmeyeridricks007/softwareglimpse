import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { PageQualitySnapshotSchema } from "@/domain/schemas/content-quality";
import { evaluatePageQuality } from "./evaluate";
import { formatQualityMarkdown, formatQualityText } from "./report";
import { writeQualityMarkdownReport } from "./store";
import { PAGE_QUALITY_PROFILES, getProfileForPageType } from "./profiles";
import {
  QUALITY_BAND_RANGES,
  computeOverallScore,
  qualityBandForScore,
} from "./dimensions";
import {
  FIXTURE_SNAPSHOTS,
  getFixtureSnapshot,
  listFixtureIds,
} from "./fixtures";
import { runContentQualityAgent, QUALITY_AGENT_BY_PAGE_TYPE } from "./agents";
import { runContentQualityAudit } from "./audit-engine";
import { loadAuditSnapshots } from "./loaders/inventory";
import {
  assignImprovementPriority,
  classifyPageImportance,
} from "./priority";
import {
  runContentImprovementOpportunityAgent,
  CONTENT_IMPROVEMENT_AGENT,
} from "./improvement";
import {
  runContentGapOpportunityAgent,
  CONTENT_GAP_OPPORTUNITY_AGENT,
} from "./gaps";
import {
  runContentIntelligenceOrchestrator,
  CONTENT_INTELLIGENCE_ORCHESTRATOR,
} from "./intelligence";

export {
  evaluatePageQuality,
  formatQualityMarkdown,
  formatQualityText,
  writeQualityMarkdownReport,
  PAGE_QUALITY_PROFILES,
  getProfileForPageType,
  QUALITY_BAND_RANGES,
  computeOverallScore,
  qualityBandForScore,
  FIXTURE_SNAPSHOTS,
  getFixtureSnapshot,
  listFixtureIds,
  runContentQualityAgent,
  QUALITY_AGENT_BY_PAGE_TYPE,
  runContentQualityAudit,
  loadAuditSnapshots,
  assignImprovementPriority,
  classifyPageImportance,
  runContentImprovementOpportunityAgent,
  CONTENT_IMPROVEMENT_AGENT,
  runContentGapOpportunityAgent,
  CONTENT_GAP_OPPORTUNITY_AGENT,
  runContentIntelligenceOrchestrator,
  CONTENT_INTELLIGENCE_ORCHESTRATOR,
};

export function parsePageSnapshot(input: unknown): PageQualitySnapshot {
  return PageQualitySnapshotSchema.parse(input);
}

export function evaluateAndReport(
  snap: PageQualitySnapshot,
  opts?: { writeReport?: boolean; evaluatedAt?: string },
): { assessment: ReturnType<typeof evaluatePageQuality>; reportPath?: string } {
  const assessment = evaluatePageQuality(snap, {
    evaluatedAt: opts?.evaluatedAt,
  });
  let reportPath: string | undefined;
  if (opts?.writeReport === true) {
    const slug = snap.contentId.replace(/[^a-zA-Z0-9._-]/g, "-");
    const date = assessment.evaluatedAt.slice(0, 10);
    reportPath = writeQualityMarkdownReport(
      `${date}-${slug}`,
      formatQualityMarkdown(assessment),
    );
  }
  return { assessment, reportPath };
}
