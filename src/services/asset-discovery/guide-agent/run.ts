import fs from "node:fs";
import path from "node:path";
import type {
  GuideAssetAudit,
  GuideAssetMasterReport,
  GuideAssetRecommendation,
} from "@/domain/schemas/asset-discovery";
import {
  GUIDE_ASSET_DISCOVERY_AGENT_ID,
  GUIDE_ASSET_DISCOVERY_AGENT_VERSION,
  GuideAssetMasterReportSchema,
} from "@/domain/schemas/asset-discovery";
import {
  getAllGuidesUnfiltered,
  getGuides,
} from "@/data/repositories/guides";
import { auditGuideAssets } from "./audit-guide";
import {
  formatGuideAssetMarkdown,
  formatGuideAssetMasterMarkdown,
} from "./report";

const DOCS_GUIDES_DIR = path.join(
  process.cwd(),
  "docs",
  "content-assets",
  "guides",
);
const MASTER_REPORT_PATH = path.join(
  process.cwd(),
  "docs",
  "content-assets",
  "GUIDE-ASSET-OPPORTUNITIES.md",
);

export type GuideAssetDiscoveryAgentMeta = {
  id: typeof GUIDE_ASSET_DISCOVERY_AGENT_ID;
  name: "GuideAssetDiscoveryAgent";
  version: typeof GUIDE_ASSET_DISCOVERY_AGENT_VERSION;
  mutatesGuides: false;
};

export const GUIDE_ASSET_DISCOVERY_AGENT: GuideAssetDiscoveryAgentMeta = {
  id: GUIDE_ASSET_DISCOVERY_AGENT_ID,
  name: "GuideAssetDiscoveryAgent",
  version: GUIDE_ASSET_DISCOVERY_AGENT_VERSION,
  mutatesGuides: false,
};

export function guideReportRelPath(guideSlug: string): string {
  return `docs/content-assets/guides/${guideSlug}-asset-opportunities.md`;
}

export function writeGuideAssetReport(audit: GuideAssetAudit): string {
  fs.mkdirSync(DOCS_GUIDES_DIR, { recursive: true });
  const full = path.join(
    DOCS_GUIDES_DIR,
    `${audit.guideSlug}-asset-opportunities.md`,
  );
  fs.writeFileSync(full, formatGuideAssetMarkdown(audit), "utf8");
  return full;
}

export function writeGuideAssetMasterReport(
  report: GuideAssetMasterReport,
): string {
  fs.mkdirSync(path.dirname(MASTER_REPORT_PATH), { recursive: true });
  fs.writeFileSync(
    MASTER_REPORT_PATH,
    formatGuideAssetMasterMarkdown(report),
    "utf8",
  );
  return MASTER_REPORT_PATH;
}

function nextAction(audit: GuideAssetAudit): string {
  const first = audit.recommendations.find(
    (r) => r.recommendationLevel === "add-now",
  );
  if (first) return `ADD NOW: ${first.title}`;
  const strong = audit.recommendations.find(
    (r) => r.recommendationLevel === "strong-opportunity",
  );
  if (strong) return `STRONG: ${strong.title}`;
  if (audit.summary.originalVisualOpportunities > 0) {
    return "Create original SoftwareGlimpse teaching visual(s)";
  }
  return "Maintain — spot-check teaching visuals";
}

function priorityRank(level: GuideAssetRecommendation["recommendationLevel"]): number {
  switch (level) {
    case "add-now":
      return 0;
    case "strong-opportunity":
      return 1;
    case "optional":
      return 2;
    case "source-only":
      return 3;
    case "reuse-existing":
      return 4;
    default:
      return 5;
  }
}

export function buildGuideMasterReport(
  audits: GuideAssetAudit[],
  generatedAt: string,
): GuideAssetMasterReport {
  const rows = audits.map((audit) => ({
    guideSlug: audit.guideSlug,
    guideTitle: audit.guideTitle,
    guideKind: audit.guideKind,
    visualQuality: audit.visualQuality,
    contentQualityVisualScore: audit.contentQualityVisualScore,
    videoOpportunities: audit.summary.videoOpportunities,
    screenshotOpportunities: audit.summary.screenshotOpportunities,
    diagramOpportunities: audit.summary.diagramOpportunities,
    officialSourceOpportunities: audit.summary.officialSourceOpportunities,
    originalVisualOpportunities: audit.summary.originalVisualOpportunities,
    priority: audit.summary.priorityScore,
    recommendedNextAction: nextAction(audit),
    reportPath: guideReportRelPath(audit.guideSlug),
  }));

  const qualityRank: Record<string, number> = {
    "very-weak": 0,
    weak: 1,
    adequate: 2,
    strong: 3,
    excellent: 4,
  };
  rows.sort(
    (a, b) =>
      b.priority - a.priority ||
      (qualityRank[a.visualQuality] ?? 9) - (qualityRank[b.visualQuality] ?? 9),
  );

  const allRecs = audits.flatMap((a) =>
    a.recommendations.map((r) => ({
      ...r,
      title: `${r.title} (${a.guideSlug})`,
    })),
  );
  allRecs.sort(
    (a, b) =>
      priorityRank(a.recommendationLevel) - priorityRank(b.recommendationLevel) ||
      (b.resolvesContentQualityIds.length ? 1 : 0) -
        (a.resolvesContentQualityIds.length ? 1 : 0),
  );

  return GuideAssetMasterReportSchema.parse({
    agentId: GUIDE_ASSET_DISCOVERY_AGENT_ID,
    agentVersion: GUIDE_ASSET_DISCOVERY_AGENT_VERSION,
    generatedAt,
    guidesAudited: audits.length,
    rows,
    topRecommendations: allRecs.slice(0, 30),
    totals: {
      videoOpportunities: audits.reduce(
        (s, a) => s + a.summary.videoOpportunities,
        0,
      ),
      screenshotOpportunities: audits.reduce(
        (s, a) => s + a.summary.screenshotOpportunities,
        0,
      ),
      diagramOpportunities: audits.reduce(
        (s, a) => s + a.summary.diagramOpportunities,
        0,
      ),
      officialSourceOpportunities: audits.reduce(
        (s, a) => s + a.summary.officialSourceOpportunities,
        0,
      ),
      originalVisualOpportunities: audits.reduce(
        (s, a) => s + a.summary.originalVisualOpportunities,
        0,
      ),
      authoritativeSourceOpportunities: audits.reduce(
        (s, a) => s + a.summary.authoritativeSourceOpportunities,
        0,
      ),
      addNow: audits.reduce((s, a) => s + a.summary.addNow, 0),
      strongOpportunity: audits.reduce(
        (s, a) => s + a.summary.strongOpportunity,
        0,
      ),
    },
  });
}

export type RunGuideAssetDiscoveryAgentOptions = {
  guideSlug?: string;
  includeUnpublished?: boolean;
  writeDocs?: boolean;
  generatedAt?: string;
  /** Limit number of guides (for smoke tests). */
  limit?: number;
};

export type GuideAssetDiscoveryAgentResult = {
  agent: GuideAssetDiscoveryAgentMeta;
  audits: GuideAssetAudit[];
  master: GuideAssetMasterReport;
  writtenPaths: string[];
};

/**
 * Run GuideAssetDiscoveryAgent across guides.
 * Never mutates guide seed content.
 */
export function runGuideAssetDiscoveryAgent(
  options: RunGuideAssetDiscoveryAgentOptions = {},
): GuideAssetDiscoveryAgentResult {
  const generatedAt = options.generatedAt ?? new Date().toISOString();

  let guides = options.includeUnpublished
    ? getAllGuidesUnfiltered()
    : getGuides({ includeUnpublished: false });

  if (options.guideSlug) {
    guides = getAllGuidesUnfiltered().filter((g) => g.slug === options.guideSlug);
  }
  if (options.limit && options.limit > 0) {
    guides = guides.slice(0, options.limit);
  }

  const audits: GuideAssetAudit[] = [];
  const writtenPaths: string[] = [];

  for (const guide of guides) {
    const audit = auditGuideAssets({ guide, generatedAt });
    audits.push(audit);
    if (options.writeDocs) {
      writtenPaths.push(writeGuideAssetReport(audit));
    }
  }

  const master = buildGuideMasterReport(audits, generatedAt);
  if (options.writeDocs) {
    writtenPaths.push(writeGuideAssetMasterReport(master));
  }

  return {
    agent: GUIDE_ASSET_DISCOVERY_AGENT,
    audits,
    master,
    writtenPaths,
  };
}
