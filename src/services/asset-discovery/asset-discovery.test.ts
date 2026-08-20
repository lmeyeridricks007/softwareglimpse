import { describe, expect, it } from "vitest";
import {
  AssetDiscoveryReportSchema,
  AssetTypeSchema,
  MediaFormatSchema,
  AssetSourceTypeSchema,
} from "@/domain/schemas/asset-discovery";
import {
  auditAndReport,
  bridgeDiscoveredAssetToResearchMedia,
  buildSearchTasks,
  classifyUsageRights,
  discoverAssetOpportunities,
  getFixturePageSnapshot,
  getFixtureSeededCandidates,
  listFixturePageIds,
  loadGuidePageSnapshot,
  loadSoftwarePageSnapshot,
  runAssetDiscovery,
  scoreAssetQuality,
  verifyOfficialSource,
  getVendorOfficialSourceEntry,
} from "@/services/asset-discovery";

describe("asset discovery framework", () => {
  it("defines canonical asset taxonomy and source types", () => {
    expect(AssetTypeSchema.options).toContain("official-product-video");
    expect(AssetTypeSchema.options).toContain(
      "softwareglimpse-original-visual-opportunity",
    );
    expect(MediaFormatSchema.options).toEqual(
      expect.arrayContaining([
        "video",
        "image",
        "diagram",
        "pdf",
        "interactive",
        "page",
        "embed",
      ]),
    );
    expect(AssetSourceTypeSchema.options).toContain("vendor-youtube");
    expect(AssetSourceTypeSchema.options).toContain("standards-body");
  });

  it("registers HubSpot and Pipedrive official domains/channels", () => {
    const hubspot = getVendorOfficialSourceEntry("hubspot");
    const pipedrive = getVendorOfficialSourceEntry("pipedrive");
    expect(hubspot?.officialDomains.some((d) => d.includes("hubspot.com"))).toBe(
      true,
    );
    expect(hubspot?.helpCenterDomains).toContain("knowledge.hubspot.com");
    expect(hubspot?.officialVideoChannels.length).toBeGreaterThan(0);
    expect(
      pipedrive?.helpCenterDomains.some((d) => d.includes("pipedrive.com")),
    ).toBe(true);
  });

  it("identifies needs before searching (HubSpot fixture)", async () => {
    const snap = getFixturePageSnapshot("hubspot-product");
    const opportunities = discoverAssetOpportunities(snap);
    const open = opportunities.filter((o) => o.status === "open");
    const satisfied = opportunities.filter(
      (o) => o.status === "satisfied-existing",
    );

    expect(opportunities.length).toBeGreaterThan(0);
    expect(satisfied.some((o) => o.needType === "overview-demo")).toBe(true);
    expect(open.some((o) => o.needType === "feature-demo")).toBe(true);
    expect(open.some((o) => o.needType === "pricing-evidence")).toBe(true);
    expect(open.some((o) => o.needType === "brand-logo")).toBe(true);

    const tasks = buildSearchTasks(opportunities);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.every((t) => t.query.length > 0)).toBe(true);
    // Search tasks only for non-satisfied needs
    expect(
      tasks.every((t) =>
        opportunities.some(
          (o) =>
            o.id === t.opportunityId && o.status !== "satisfied-existing",
        ),
      ),
    ).toBe(true);

    const { report } = await runAssetDiscovery({
      snapshot: snap,
      needsOnly: true,
      generatedAt: "2026-08-15T00:00:00.000Z",
    });
    expect(report.discoveredAssets).toHaveLength(0);
    expect(report.searchTasks.length).toBeGreaterThan(0);
    AssetDiscoveryReportSchema.parse(report);
  });

  it("materializes only seeded official URLs (never invents)", async () => {
    const snap = getFixturePageSnapshot("hubspot-product");
    const { report } = await runAssetDiscovery({
      snapshot: snap,
      seededCandidates: getFixtureSeededCandidates("hubspot-product"),
      generatedAt: "2026-08-15T00:00:00.000Z",
    });

    expect(report.discoveredAssets.length).toBeGreaterThan(0);
    for (const asset of report.discoveredAssets) {
      expect(asset.sourceUrl.startsWith("https://")).toBe(true);
      expect(asset.sourceUrl).not.toContain("example.com");
    }
    const yt = report.discoveredAssets.find((a) =>
      a.sourceUrl.includes("youtube.com"),
    );
    expect(yt?.officialSource).toBe(true);
    expect(yt?.recommendation).toBe("embed");
    expect(yt?.researchMediaBridgeSuggested).toBe(true);
  });

  it("verifies official sources by domain/channel — not title alone", () => {
    const officialPage = verifyOfficialSource({
      sourceUrl: "https://www.hubspot.com/products/crm",
      productSlug: "hubspot",
    });
    expect(officialPage.officialSource).toBe(true);
    expect(officialPage.confidence).toBe("high");

    const randomYt = verifyOfficialSource({
      sourceUrl: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
      productSlug: "hubspot",
      // no channel confirmation
    });
    expect(randomYt.officialSource).toBe(false);

    const confirmedYt = verifyOfficialSource({
      sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
      productSlug: "hubspot",
      claimedChannelName: "HubSpot",
    });
    expect(confirmedYt.officialSource).toBe(true);

    const affiliate = verifyOfficialSource({
      sourceUrl: "https://aff.trypipedrive.com/4nvrdp5mbmb7",
      productSlug: "pipedrive",
    });
    expect(affiliate.officialSource).toBe(false);
    expect(affiliate.notes.some((n) => n.toLowerCase().includes("affiliate"))).toBe(
      true,
    );
  });

  it("classifies usage rights conservatively for images vs embeds", () => {
    const embed = classifyUsageRights({
      assetType: "official-product-video",
      mediaFormat: "video",
      sourceType: "vendor-youtube",
      officialSource: true,
      sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
      embedEnabled: true,
    });
    expect(embed.recommendation).toBe("embed");

    const screenshot = classifyUsageRights({
      assetType: "official-screenshot",
      mediaFormat: "image",
      sourceType: "vendor-help-center",
      officialSource: true,
      sourceUrl: "https://knowledge.hubspot.com/example",
    });
    expect(screenshot.recommendation).toBe(
      "create-original-visual-based-on-source",
    );
    expect(screenshot.usageRightsStatus).toBe("better-create-original-visual");

    const secondary = classifyUsageRights({
      assetType: "official-ui-image",
      mediaFormat: "image",
      sourceType: "secondary",
      officialSource: false,
      sourceUrl: "https://random-blog.example/shot.png",
    });
    expect(secondary.recommendation).toBe("do-not-use");
  });

  it("prefers specific workflow demos over generic brand films in scoring", () => {
    const specific = scoreAssetQuality({
      assetType: "official-workflow-demo",
      officialSource: true,
      officialConfidence: "high",
      title: "HubSpot pipeline workflow demo",
      whatItShows: ["pipeline stages", "deal workflow"],
    });
    const generic = scoreAssetQuality({
      assetType: "official-product-video",
      officialSource: true,
      officialConfidence: "high",
      title: "Our company culture brand film",
    });
    expect(specific.specificity).toBeGreaterThan(generic.specificity);
    expect(specific.overall).toBeGreaterThan(generic.overall);
  });

  it("audits Pipedrive, CRM guide, industry guide, feature guide fixtures", async () => {
    for (const id of [
      "pipedrive-product",
      "crm-guide",
      "industry-guide",
      "feature-guide",
    ]) {
      expect(listFixturePageIds()).toContain(id);
      const { report } = await auditAndReport(getFixturePageSnapshot(id), {
        writeReport: false,
        needsOnly: true,
        generatedAt: "2026-08-15T00:00:00.000Z",
      });
      expect(report.opportunities.length).toBeGreaterThan(0);
      expect(report.summary.searchTaskCount).toBeGreaterThan(0);
      // Needs identified first: every search task maps to an opportunity
      for (const task of report.searchTasks) {
        expect(
          report.opportunities.some((o) => o.id === task.opportunityId),
        ).toBe(true);
      }
    }

    const industry = await auditAndReport(
      getFixturePageSnapshot("industry-guide"),
      { needsOnly: true, generatedAt: "2026-08-15T00:00:00.000Z" },
    );
    expect(
      industry.report.opportunities.some(
        (o) => o.needType === "authoritative-reference",
      ),
    ).toBe(true);

    const feature = await auditAndReport(
      getFixturePageSnapshot("feature-guide"),
      { needsOnly: true, generatedAt: "2026-08-15T00:00:00.000Z" },
    );
    expect(
      feature.report.opportunities.some((o) => o.needType === "feature-demo"),
    ).toBe(true);
  });

  it("loads live HubSpot / Pipedrive / guide pages without mutating them", async () => {
    const hubspot = loadSoftwarePageSnapshot("hubspot");
    const pipedrive = loadSoftwarePageSnapshot("pipedrive");
    const crmGuide = loadGuidePageSnapshot("what-is-crm");
    const industryGuide = loadGuidePageSnapshot("financial-services-crm");
    const featureGuide = loadGuidePageSnapshot("crm-automation-best-practices");

    expect(hubspot?.productIds).toContain("hubspot");
    expect(pipedrive?.productIds).toContain("pipedrive");
    expect(crmGuide?.pageType).toBe("guide");
    expect(industryGuide?.industryIds).toContain("financial-services");
    expect(featureGuide?.title.toLowerCase()).toContain("automation");

    for (const snap of [
      hubspot,
      pipedrive,
      crmGuide,
      industryGuide,
      featureGuide,
    ]) {
      expect(snap).toBeTruthy();
      const { report } = await runAssetDiscovery({
        snapshot: snap!,
        needsOnly: true,
        generatedAt: "2026-08-15T00:00:00.000Z",
      });
      expect(report.opportunities.length).toBeGreaterThan(0);
      expect(report.discoveredAssets).toHaveLength(0);
    }
  });

  it("bridges official video recommendations to ResearchMedia drafts only", async () => {
    const { report } = await runAssetDiscovery({
      snapshot: getFixturePageSnapshot("hubspot-product"),
      seededCandidates: getFixtureSeededCandidates("hubspot-product"),
      generatedAt: "2026-08-15T00:00:00.000Z",
    });
    const video = report.discoveredAssets.find(
      (a) => a.mediaFormat === "video" && a.officialSource,
    );
    expect(video).toBeTruthy();
    const bridged = bridgeDiscoveredAssetToResearchMedia(video!);
    expect(bridged.ok).toBe(true);
    if (bridged.ok) {
      expect(bridged.media.status).toBe("discovered");
      expect(bridged.media.officialSource).toBe(false);
      expect(bridged.note.toLowerCase()).toContain("never auto-publish");
    }
  });
});
