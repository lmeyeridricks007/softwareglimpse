import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DIGITAL_PR_COMPETITOR_PAIRS } from "@/data/config/seo/digital-pr-competitor-pairs";
import { inventoryAndScoreLinkableAssets } from "./assets";
import { buildAssetOutreachPriorities } from "./asset-outreach";
import { computeCompetitorLinkGaps } from "./gap";
import {
  discoverLatestBacklinkExport,
  ensureBacklinkImportDirs,
  loadBacklinkExport,
} from "./ingest";
import {
  computeBacklinkExportMetrics,
  loadReferringDomainSnapshot,
} from "./metrics";
import { buildProspectsFromGaps } from "./prospects";
import { formatWeeklyLinkOpportunitiesMarkdown } from "./report";
import {
  loadDigitalPrTracking,
  relationshipMapFromTracking,
} from "./tracking";
import {
  LINK_OPPORTUNITY_ENGINE_VERSION,
  type BacklinkExportValidity,
  type LinkOpportunityReport,
  type LoadedBacklinkExport,
} from "./types";
import { isExampleOrPlaceholderDomain } from "./validity";

export type AnalyzeLinkOpportunitiesOptions = {
  exportPath?: string;
  cwd?: string;
  write?: boolean;
  outJson?: string;
  outMd?: string;
  prospectLimit?: number;
  /**
   * Allow FIXTURE/SAMPLE exports for offline tests only.
   * Production writes always reject non-REAL exports for prospect generation.
   */
  allowFixture?: boolean;
};

/**
 * Orchestrate inventory → import → gap → prospects → tracking → dual write.
 * Production reports never include fixture/sample/example prospects.
 */
export function analyzeLinkOpportunities(
  opts: AnalyzeLinkOpportunitiesOptions = {},
): LinkOpportunityReport {
  const cwd = opts.cwd ?? process.cwd();
  ensureBacklinkImportDirs(cwd);

  let exportData: LoadedBacklinkExport | null = opts.exportPath
    ? loadBacklinkExport(
        path.isAbsolute(opts.exportPath)
          ? opts.exportPath
          : path.join(cwd, opts.exportPath),
      )
    : discoverLatestBacklinkExport(cwd, { realOnly: true });

  let rejectedExportCount = 0;
  let exportValidity: BacklinkExportValidity = "NOT_CONNECTED";

  if (exportData) {
    exportValidity = exportData.meta.validity;
    const productionWrite = opts.write !== false;
    const fixtureAllowed = opts.allowFixture === true && !productionWrite;
    if (exportData.meta.validity !== "REAL" && !fixtureAllowed) {
      rejectedExportCount = 1;
      exportData = null;
      exportValidity =
        exportValidity === "NOT_CONNECTED" ? "REJECTED" : exportValidity;
    }
  }

  const assets = inventoryAndScoreLinkableAssets();
  const assetOutreachPriorities = buildAssetOutreachPriorities(assets, 40);
  const gaps = computeCompetitorLinkGaps(exportData);
  const trackingStore = loadDigitalPrTracking();
  const relationshipByDomain = relationshipMapFromTracking(trackingStore);

  const prospects =
    exportData && exportData.meta.validity === "REAL"
      ? buildProspectsFromGaps({
          gaps,
          assets,
          relationshipByDomain,
          limit: opts.prospectLimit ?? 40,
        })
      : opts.allowFixture === true &&
          exportData &&
          opts.write === false
        ? buildProspectsFromGaps({
            gaps,
            assets,
            relationshipByDomain,
            limit: opts.prospectLimit ?? 40,
          }).filter((p) => !isExampleOrPlaceholderDomain(p.domain))
        : [];

  // Merge tracking status onto prospects when present
  for (const p of prospects) {
    const status = relationshipByDomain.get(p.domain.toLowerCase());
    if (status) {
      p.relationshipStatus = status;
      if (status !== "QUALIFIED") {
        p.outreachDraft = null;
      }
    }
  }

  const linksEarned = trackingStore.records.filter(
    (r) => r.status === "LINK_EARNED",
  );

  const fixtureProspectCount = prospects.filter((p) =>
    isExampleOrPlaceholderDomain(p.domain),
  ).length;

  const draftEligible = prospects.filter(
    (p) => p.relationshipStatus === "QUALIFIED",
  );

  const exportMetrics =
    exportData && exportData.rows.length > 0
      ? computeBacklinkExportMetrics(exportData, {
          gaps,
          cwd,
          previousSnapshot: loadReferringDomainSnapshot(cwd),
          persistSnapshot:
            opts.write !== false && exportData.meta.validity === "REAL",
        })
      : null;

  const report: LinkOpportunityReport = {
    engineVersion: LINK_OPPORTUNITY_ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    methodologyNotes: [
      "Asset scores prioritize citation value and journalist usefulness; they are not Google ranking predictions.",
      "Competitor link gaps use imported Ahrefs/Semrush/other REAL exports only — missing/fixture export ⇒ zero invented RDs.",
      "Authority metrics (DR/DA) appear only when present in the export.",
      "Export metrics count unique referring domains, backlinks (rows), linked SG pages, research vs commercial targets, and new/lost RDs when a prior snapshot exists.",
      "Prospect quality excludes spam, PBN-like, casino/adult/pharma, and example domains.",
      "Outreach drafts are generated only for QUALIFIED prospects and never sent by this engine.",
      "Asset outreach priorities (HIGH/MEDIUM/LOW) rank EXISTING linkable assets for draft pitches — they are not earned links and invent no referring domains.",
      "Relevance, editorial fit, asset fit, and real link evidence are weighted above raw domain authority.",
    ],
    complianceNotes: [
      "Do not buy links, create fake sites/profiles, mass-submit directories, comment/forum spam, use PBNs, or automate unsolicited bulk email.",
      "Human approval is mandatory before any outreach is sent.",
      "Record LINK_EARNED only when a real link is observed.",
      "Fixture/sample/example/test exports are rejected from production opportunity reports.",
      "Do not count draft prospects or asset priorities as earned backlinks.",
    ],
    exportMeta: exportData?.meta ?? null,
    exportMetrics,
    assets,
    assetOutreachPriorities,
    competitorPairsConfigured: DIGITAL_PR_COMPETITOR_PAIRS.length,
    gaps,
    prospects,
    tracking: trackingStore.records,
    linksEarned,
    summary: {
      assetCount: assets.length,
      topAssetScore: assets[0]?.assetScore ?? null,
      gapCount: gaps.filter((g) => g.domainsLinkingToCompetitor > 0).length,
      prospectCount: prospects.length,
      qualifiedCount: prospects.filter(
        (p) =>
          p.relationshipStatus === "QUALIFIED" ||
          p.relationshipStatus === "IDENTIFIED",
      ).length,
      draftEligibleCount: draftEligible.length,
      contactedCount: trackingStore.records.filter(
        (r) => r.status === "CONTACTED",
      ).length,
      linksEarnedCount: linksEarned.length,
      exportAvailable: Boolean(
        exportData &&
          exportData.rows.length > 0 &&
          exportData.meta.validity === "REAL",
      ),
      exportValidity:
        exportData?.meta.validity ??
        (rejectedExportCount > 0 ? exportValidity : "NOT_CONNECTED"),
      fixtureProspectCount,
      rejectedExportCount,
      referringDomains: exportMetrics?.referringDomains ?? null,
      backlinks: exportMetrics?.backlinks ?? null,
      linkedPages: exportMetrics?.linkedPages ?? null,
      linksToResearchAssets: exportMetrics?.linksToResearchAssets ?? null,
      linksToCommercialPages: exportMetrics?.linksToCommercialPages ?? null,
      newReferringDomains: exportMetrics?.newReferringDomains ?? null,
      lostReferringDomains: exportMetrics?.lostReferringDomains ?? null,
    },
  };

  if (opts.write !== false) {
    // Production safety: never persist fixture prospects.
    if (report.summary.fixtureProspectCount > 0) {
      report.prospects = [];
      report.summary.prospectCount = 0;
      report.summary.qualifiedCount = 0;
      report.summary.draftEligibleCount = 0;
      report.summary.fixtureProspectCount = 0;
      report.complianceNotes.push(
        "Stripped fixture/example prospects before writing production report.",
      );
    }
    const jsonPath =
      opts.outJson ?? path.join(cwd, "data/seo/link-opportunities.json");
    const mdPath =
      opts.outMd ?? path.join(cwd, "docs/seo/WEEKLY-LINK-OPPORTUNITIES.md");
    mkdirSync(path.dirname(jsonPath), { recursive: true });
    mkdirSync(path.dirname(mdPath), { recursive: true });
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(mdPath, formatWeeklyLinkOpportunitiesMarkdown(report), "utf8");
  }

  return report;
}
