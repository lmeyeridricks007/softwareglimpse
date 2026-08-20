import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  capabilityMediaAliases,
  scoreCapabilityPageMedia,
  selectCapabilityPageVideos,
  selectCapabilitySeeInActionCards,
} from "@/services/product-media/capability-page-media";
import { buildCapabilityHubModel } from "@/services/capability-hub";
import { getIndustryCapabilityPage } from "@/services/industry-capability";
import { buildCapabilityEvidenceExplorer } from "@/services/evidence-explorer";
import { isVideoPublicEligible } from "@/services/product-media";

const pipelineDemo = ProductMediaSchema.parse({
  id: "pd-pipeline",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
  videoId: "cU0FYEDRop8",
  embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
  title: "Pipeline workflow demo",
  thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
  sourceOrganization: "Pipedrive",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  capabilityIds: ["pipeline-management"],
  featureIds: ["pipeline-management", "deal-management"],
  requirementIds: ["track-opportunity-progress"],
  evidenceClaimKinds: ["workflow-demo"],
  whatThisShows: ["visual deal pipeline", "stage movement"],
  whatToNotice: ["how deals move between stages"],
  limitations: ["pricing", "comparative superiority"],
  status: "published",
});

const brandPromo = ProductMediaSchema.parse({
  id: "brand-promo",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
  videoId: "aaaaaaaaaaa",
  embedUrl: "https://www.youtube-nocookie.com/embed/aaaaaaaaaaa",
  title: "Why teams love our CRM brand story",
  thumbnailUrl: "https://i.ytimg.com/vi/aaaaaaaaaaa/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  capabilityIds: [],
  featureIds: [],
  whatThisShows: ["brand story"],
  status: "published",
});

describe("capabilityMediaAliases", () => {
  it("expands security-administration", () => {
    expect(capabilityMediaAliases("security-administration")).toContain(
      "security",
    );
    expect(capabilityMediaAliases("security-administration")).toContain(
      "administration",
    );
  });
});

describe("scoreCapabilityPageMedia", () => {
  it("ranks exact capability + product highest", () => {
    const exact = scoreCapabilityPageMedia(pipelineDemo, {
      capabilitySlug: "pipeline-management",
      productSlug: "pipedrive",
    });
    const otherProduct = scoreCapabilityPageMedia(pipelineDemo, {
      capabilitySlug: "pipeline-management",
      productSlug: "hubspot",
    });
    expect(exact).toBeGreaterThan(otherProduct);
  });

  it("prefers workflow demos over brand promos", () => {
    const workflow = scoreCapabilityPageMedia(pipelineDemo, {
      capabilitySlug: "pipeline-management",
      productSlug: "pipedrive",
    });
    const promo = scoreCapabilityPageMedia(brandPromo, {
      capabilitySlug: "pipeline-management",
      productSlug: "pipedrive",
      featureIds: ["pipeline-management"],
    });
    expect(workflow).toBeGreaterThan(promo);
  });
});

describe("selectCapabilitySeeInActionCards", () => {
  it("returns one card per product with eligible media", () => {
    const cards = selectCapabilitySeeInActionCards({
      mediaPool: [pipelineDemo, brandPromo],
      products: [
        { slug: "pipedrive", name: "Pipedrive" },
        { slug: "hubspot", name: "HubSpot" },
      ],
      ctx: { capabilitySlug: "pipeline-management" },
      limit: 4,
    });
    expect(cards).toHaveLength(1);
    expect(cards[0]?.productSlug).toBe("pipedrive");
    expect(cards[0]?.relatedFeatures.length).toBeGreaterThan(0);
    expect(isVideoPublicEligible(cards[0]!.media).eligible).toBe(true);
  });

  it("does not leak pipeline-tagged media onto security-administration", () => {
    const selected = selectCapabilityPageVideos(
      [pipelineDemo],
      {
        capabilitySlug: "security-administration",
        capabilityAliases: capabilityMediaAliases("security-administration"),
        featureIds: ["contact-management", "sso", "permissions"],
      },
      { limit: 4 },
    );
    expect(selected).toHaveLength(0);
  });
});

describe("capability pages with ResearchMedia", () => {
  it("pipeline-management hub resolves see-in-action without inventing media", () => {
    const model = buildCapabilityHubModel("pipeline-management");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.seeInAction.length).toBeGreaterThan(0);
    expect(model.seeInAction.length).toBeLessThanOrEqual(4);
    for (const card of model.seeInAction) {
      expect(card.media.officialSource).toBe(true);
      expect(isVideoPublicEligible(card.media).eligible).toBe(true);
    }
  });

  it("workflow-automation industry page wires media when tagged", () => {
    const model = getIndustryCapabilityPage(
      "financial-services",
      "workflow-automation",
    );
    expect(model).not.toBeNull();
    if (!model) return;
    // May be 0–N depending on enrichment tagging — must not throw / invent
    expect(Array.isArray(model.seeInAction)).toBe(true);
    expect(model.research.officialVideoCount).toBeGreaterThanOrEqual(0);
    // Fit labels independent of video counts
    for (const row of model.productRows) {
      expect(["Strong", "Good", "Limited", "Unknown"]).toContain(row.fitLabel);
      expect(typeof row.officialVideoCount).toBe("number");
    }
  });

  it("security-administration remains complete with sparse/zero video", () => {
    const model = getIndustryCapabilityPage(
      "financial-services",
      "security-administration",
    );
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.productRows.length).toBeGreaterThan(0);
    expect(model.requirements.length).toBeGreaterThan(0);
    // Zero-video state: sections simply empty — page still builds
    expect(Array.isArray(model.seeInAction)).toBe(true);
  });

  it("builds capability evidence explorer from page media", () => {
    const model = getIndustryCapabilityPage(
      "financial-services",
      "pipeline-management",
    );
    expect(model).not.toBeNull();
    if (!model) return;
    const explorer = buildCapabilityEvidenceExplorer({
      capabilityName: model.capabilityName,
      capabilitySlug: model.capabilitySlug,
      products: model.productRows,
      screenshots: model.screenshots,
      videos: model.videos,
    });
    expect(explorer.heading).toBe("Capability evidence");
    expect(explorer.typeCounts.all).toBe(explorer.items.length);
  });
});
