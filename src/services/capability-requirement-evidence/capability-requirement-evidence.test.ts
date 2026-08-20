import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  buildCapabilityRequirementEvidence,
  mediaMatchesCapabilityRequirement,
  uniqueVideosForProduct,
} from "@/services/capability-requirement-evidence";
import { getIndustryCapabilityPage } from "@/services/industry-capability";

const multiMappedVideo = ProductMediaSchema.parse({
  id: "pd-pipeline-multi",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
  videoId: "cU0FYEDRop8",
  embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
  title: "Official Pipedrive Pipeline Demo",
  thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  capabilityIds: ["pipeline-management"],
  featureIds: [
    "pipeline-management",
    "deal-management",
    "custom-pipelines",
  ],
  requirementIds: [
    "track-opportunity-progress",
    "assign-ownership",
    "separate-sales-processes",
  ],
  evidenceClaimKinds: ["workflow-demo"],
  whatThisShows: [
    "opportunity visible in pipeline",
    "stage movement",
    "activity association",
  ],
  limitations: ["plan limits", "reporting depth", "comparative superiority"],
  status: "published",
});

describe("mediaMatchesCapabilityRequirement", () => {
  it("links via capability + feature + requirement", () => {
    const match = mediaMatchesCapabilityRequirement(multiMappedVideo, {
      capabilityId: "pipeline-management",
      requirementSlug: "track-opportunity-progress",
      featureSlug: "pipeline-management",
    });
    expect(match.matches).toBe(true);
    expect(match.linkedVia).toEqual(
      expect.arrayContaining(["capability", "requirement", "feature"]),
    );
  });

  it("blocks cross-capability leak via shared features", () => {
    const match = mediaMatchesCapabilityRequirement(multiMappedVideo, {
      capabilityId: "security-administration",
      featureSlug: "pipeline-management",
    });
    expect(match.matches).toBe(false);
  });
});

describe("buildCapabilityRequirementEvidence", () => {
  it("maps one video to multiple requirements without double-counting the record", () => {
    const model = buildCapabilityRequirementEvidence({
      capabilityId: "pipeline-management",
      capabilityName: "Pipeline Management",
      requirements: [
        {
          id: "progress",
          name: "Track opportunity progress",
          featureSlug: "pipeline-management",
          requirementSlug: "track-opportunity-progress",
          priority: "core",
        },
        {
          id: "ownership",
          name: "Assign ownership",
          featureSlug: "deal-management",
          requirementSlug: "assign-ownership",
          priority: "core",
        },
        {
          id: "separate",
          name: "Support separate sales processes",
          featureSlug: "custom-pipelines",
          requirementSlug: "separate-sales-processes",
          priority: "advanced",
        },
      ],
      products: [
        {
          slug: "pipedrive",
          name: "Pipedrive",
          cells: {
            "pipeline-management": "supported",
            "deal-management": "supported",
            "custom-pipelines": "supported",
          },
          reviewHref: "/software/pipedrive/",
          documentationByFeature: {
            "pipeline-management": 2,
            "deal-management": 1,
            "custom-pipelines": 1,
          },
        },
      ],
      mediaPool: [multiMappedVideo],
    });

    expect(model.rows).toHaveLength(3);
    for (const row of model.rows) {
      const pe = row.products[0]!;
      expect(pe.officialVideoCount).toBe(1);
      expect(pe.items).toHaveLength(1);
      expect(pe.items[0]?.id).toBe("video:pd-pipeline-multi");
      expect(pe.items[0]?.demonstrates.length).toBeGreaterThan(0);
      expect(pe.items[0]?.doesNotEstablish).toEqual(
        expect.arrayContaining(["plan limits"]),
      );
    }

    // Same ResearchMedia id across all requirement contexts
    const unique = uniqueVideosForProduct(model, "pipedrive");
    expect(unique).toHaveLength(1);
    expect(unique[0]?.title).toBe("Official Pipedrive Pipeline Demo");
  });

  it("attaches via feature when requirementSlug differs but feature matches", () => {
    const model = buildCapabilityRequirementEvidence({
      capabilityId: "pipeline-management",
      capabilityName: "Pipeline Management",
      requirements: [
        {
          id: "follow-ups",
          name: "Activity / follow-up tracking",
          featureSlug: "pipeline-management",
          priority: "core",
        },
      ],
      products: [
        {
          slug: "pipedrive",
          name: "Pipedrive",
          cells: { "pipeline-management": "supported" },
          reviewHref: "/software/pipedrive/",
        },
      ],
      mediaPool: [multiMappedVideo],
    });
    expect(model.rows[0]?.products[0]?.officialVideoCount).toBe(1);
    expect(model.rows[0]?.products[0]?.items[0]?.linkedVia).toContain(
      "feature",
    );
  });
});

describe("industry capability requirement evidence wiring", () => {
  it("builds requirement evidence drawers for pipeline-management", () => {
    const page = getIndustryCapabilityPage(
      "financial-services",
      "pipeline-management",
    );
    expect(page).not.toBeNull();
    if (!page) return;
    expect(page.requirementEvidence).not.toBeNull();
    const withVideo = page.requirementEvidence!.rows.filter((r) =>
      r.products.some((p) => p.officialVideoCount > 0),
    );
    // At least one requirement should pick up pipedrive/hubspot feature-linked video
    expect(withVideo.length).toBeGreaterThan(0);

    // No double-count: unique video ids per product across requirements
    for (const product of page.productRows.slice(0, 3)) {
      const unique = uniqueVideosForProduct(
        page.requirementEvidence!,
        product.slug,
      );
      const ids = unique.map((v) => v.id);
      expect(ids.length).toBe(new Set(ids).size);
    }
  });
});
