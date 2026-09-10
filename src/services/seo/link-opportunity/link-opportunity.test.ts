import { describe, expect, it } from "vitest";
import path from "node:path";
import { inventoryAndScoreLinkableAssets } from "@/services/seo/link-opportunity/assets";
import { classifyProspectType } from "@/services/seo/link-opportunity/classify";
import { computeCompetitorLinkGaps } from "@/services/seo/link-opportunity/gap";
import {
  discoverLatestBacklinkExport,
  loadBacklinkExport,
} from "@/services/seo/link-opportunity/ingest";
import { analyzeLinkOpportunities } from "@/services/seo/link-opportunity/analyze";
import {
  buildOutreachDraft,
  buildPitchAngle,
  buildProspectsFromGaps,
} from "@/services/seo/link-opportunity/prospects";
import { evaluateProspectQuality } from "@/services/seo/link-opportunity/prospect-quality";
import { formatWeeklyLinkOpportunitiesMarkdown } from "@/services/seo/link-opportunity/report";
import { classifyBacklinkExportValidity } from "@/services/seo/link-opportunity/validity";
import { buildAuthoritySection } from "@/services/seo/growth-dashboard/quality-authority";

describe("digital PR link opportunity engine", () => {
  it("scores linkable assets including research datasets", () => {
    const assets = inventoryAndScoreLinkableAssets();
    expect(assets.length).toBeGreaterThan(5);
    const crmPricing = assets.find((a) =>
      a.path.includes("/research/crm-pricing/"),
    );
    expect(crmPricing).toBeTruthy();
    expect(crmPricing!.dimensions.citationValue).toBeGreaterThanOrEqual(80);
    expect(crmPricing!.assetScore).toBeGreaterThan(50);
  });

  it("classifies prospect types without inventing roles", () => {
    expect(
      classifyProspectType({ domain: "mit.edu", url: "https://mit.edu/research" }),
    ).toBe("ACADEMIC");
    expect(
      classifyProspectType({
        domain: "techcrunch.com",
        url: "https://techcrunch.com/saas",
      }),
    ).toBe("BUSINESS_PUBLICATION");
    expect(
      classifyProspectType({
        domain: "example.com",
        url: "https://example.com/resources/tools",
      }),
    ).toBe("RESOURCE_PAGE");
  });

  it("rejects fixture/sample/example exports for production validity", () => {
    const fixture = path.join(
      process.cwd(),
      "src/data/seo/fixtures/backlink-export-sample.csv",
    );
    const loaded = loadBacklinkExport(fixture);
    expect(loaded).toBeTruthy();
    expect(loaded!.meta.validity).not.toBe("REAL");
    expect(loaded!.meta.filename).toContain("sample");
    expect(loaded!.meta.metricsAvailable.length).toBeGreaterThan(0);
    expect(
      classifyBacklinkExportValidity({
        sourcePath: fixture,
        rows: loaded!.rows,
      }).validity,
    ).not.toBe("REAL");
  });

  it("loads fixture export for gap unit tests but strips example domains from samples", () => {
    const fixture = path.join(
      process.cwd(),
      "src/data/seo/fixtures/backlink-export-sample.csv",
    );
    const loaded = loadBacklinkExport(fixture);
    expect(loaded).toBeTruthy();
    expect(loaded!.rows.length).toBeGreaterThan(0);

    const gaps = computeCompetitorLinkGaps(loaded);
    expect(gaps.length).toBeGreaterThan(0);
    for (const g of gaps) {
      for (const d of g.sampleDomains) {
        expect(d).not.toMatch(/example/i);
      }
    }
  });

  it("discoverLatestBacklinkExport skips fixtures under import dirs", () => {
    const discovered = discoverLatestBacklinkExport(process.cwd(), {
      realOnly: true,
    });
    if (discovered) {
      expect(discovered.meta.validity).toBe("REAL");
    } else {
      expect(discovered).toBeNull();
    }
  });

  it("returns honest empty-gap notes when export is missing", () => {
    const gaps = computeCompetitorLinkGaps(null);
    expect(gaps.length).toBeGreaterThan(0);
    expect(gaps[0]!.notes.some((n) => n.includes("No backlink export"))).toBe(
      true,
    );
    expect(gaps[0]!.domainsLinkingToCompetitor).toBe(0);
  });

  it("excludes spam/casino and example domains from quality", () => {
    expect(
      evaluateProspectQuality({
        domain: "best-casino-slots.xyz",
        prospectType: "BLOG",
        topicalRelevance: 80,
        competitorLinkEvidence: 10,
        assetFit: 70,
        authorityScore: 40,
      }).ok,
    ).toBe(false);
    expect(
      evaluateProspectQuality({
        domain: "example-saas-blog.com",
        prospectType: "SAAS_PUBLICATION",
        topicalRelevance: 80,
        competitorLinkEvidence: 10,
        assetFit: 70,
        authorityScore: 40,
      }).ok,
    ).toBe(false);
  });

  it("builds pitches without invented personalization; drafts only when QUALIFIED", () => {
    const assets = inventoryAndScoreLinkableAssets();
    const asset = assets[0]!;
    const pitch = buildPitchAngle({
      domain: "techcrunch.com",
      prospectType: "BUSINESS_PUBLICATION",
      asset,
      gap: {
        softwareGlimpsePath: asset.path,
        competitorUrl: "https://www.g2.com/categories/crm",
        domainsLinkingToCompetitor: 1,
        domainsAlsoLinkingToSoftwareGlimpse: 0,
        domainsNotLinkingToSoftwareGlimpse: 1,
        competitorCountReceivingLink: 1,
        topicalRelevance: 80,
        authorityMetricAverage: 55,
        opportunityScore: 70,
        sampleDomains: ["techcrunch.com"],
        notes: [],
      },
      relationshipStatus: "QUALIFIED",
    });
    expect(pitch.personalizationEvidence.length).toBeGreaterThan(0);
    expect(pitch.personalizationEvidence.join(" ")).not.toMatch(
      /John Doe|I loved your article titled/i,
    );

    const draft = buildOutreachDraft({
      domain: "techcrunch.com",
      asset,
      pitch,
    });
    expect(draft).toContain("not sent");
    expect(draft).toContain("No paid link request");

    const prospects = buildProspectsFromGaps({
      gaps: [
        {
          softwareGlimpsePath: asset.path,
          competitorUrl: "https://www.g2.com/categories/crm",
          domainsLinkingToCompetitor: 2,
          domainsAlsoLinkingToSoftwareGlimpse: 0,
          domainsNotLinkingToSoftwareGlimpse: 1,
          competitorCountReceivingLink: 1,
          topicalRelevance: 85,
          authorityMetricAverage: 60,
          opportunityScore: 75,
          sampleDomains: ["techcrunch.com", "example-saas-blog.com"],
          notes: [],
        },
      ],
      assets,
      limit: 10,
    });
    expect(prospects.every((p) => !/example/i.test(p.domain))).toBe(true);
    for (const p of prospects) {
      if (p.relationshipStatus === "QUALIFIED") {
        expect(p.outreachDraft).toBeTruthy();
      } else {
        expect(p.outreachDraft).toBeNull();
      }
    }
  });

  it("rejects fixture exports from production analyze reports", () => {
    const report = analyzeLinkOpportunities({
      exportPath: "src/data/seo/fixtures/backlink-export-sample.csv",
      write: false,
      prospectLimit: 20,
    });
    expect(report.summary.exportAvailable).toBe(false);
    expect(report.summary.fixtureProspectCount).toBe(0);
    expect(report.prospects).toHaveLength(0);
    expect(report.summary.rejectedExportCount).toBe(1);
    expect(report.summary.exportValidity).not.toBe("REAL");
    expect(report.exportMetrics).toBeNull();

    const md = formatWeeklyLinkOpportunitiesMarkdown(report);
    expect(md).toContain("## Top 20 prospects");
    expect(md).toContain("## Best linkable assets");
    expect(md).toContain("Fixture/sample prospect count");
    expect(md).toContain("Never");
  });

  it("computes unique RD / research / commercial metrics from allowFixture rows", () => {
    const report = analyzeLinkOpportunities({
      exportPath: "src/data/seo/fixtures/backlink-export-sample.csv",
      write: false,
      allowFixture: true,
      prospectLimit: 20,
    });
    expect(report.exportMetrics).toBeTruthy();
    expect(report.exportMetrics!.referringDomains).toBeGreaterThan(0);
    expect(report.exportMetrics!.backlinks).toBe(
      report.exportMeta!.rowCount,
    );
    expect(report.summary.referringDomains).toBe(
      report.exportMetrics!.referringDomains,
    );
  });

  it("dashboard authority metrics stay at zero without REAL export", () => {
    const authority = buildAuthoritySection();
    expect(["NOT_CONNECTED", "FIXTURE", "STALE", "REAL"]).toContain(
      authority.validity,
    );
    if (authority.validity === "NOT_CONNECTED" || authority.validity === "FIXTURE") {
      expect(authority.referringDomains.kind).toBe("not_connected");
      expect(
        authority.qualityProspects.kind === "number"
          ? authority.qualityProspects.value
          : 0,
      ).toBe(0);
    }
  });
});
