import { describe, expect, it } from "vitest";
import { discoverOfficialVideo } from "@/services/feature-media-research";
import {
  addPlacementRecommendation,
  editorialApproveCandidate,
  importApprovedAsset,
  mapCandidateEntities,
  registerApprovedAssetCandidate,
  reviewCandidateRelevance,
  reviewCandidateUsage,
  verifyCandidateSource,
} from "@/services/asset-discovery/approval";
import { findDuplicateResearchMedia } from "@/services/feature-media-research/duplicates";

describe("Approved Asset Workflow", () => {
  it("does not treat discovery as approval", () => {
    const reg = registerApprovedAssetCandidate({
      title: "HubSpot Sales Hub Overview Demo",
      sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
      productSlug: "hubspot",
      whatThisShows: ["Sales workspace layout"],
    });
    expect(reg.ok).toBe(true);
    if (!reg.ok) return;
    expect(reg.candidate.stage).toBe("DISCOVERED");
    expect(reg.candidate.officialSource).toBe(false);
    expect(reg.candidate.usageState).toBe("not-used");
  });

  it("advances gates and blocks import before editorial approval", () => {
    let c = registerApprovedAssetCandidate({
      title: "HubSpot Sales Hub Overview Demo",
      sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
      productSlug: "hubspot",
      whatThisShows: ["Sales workspace layout"],
    });
    expect(c.ok).toBe(true);
    if (!c.ok) return;

    const verified = verifyCandidateSource(c.candidate, {
      officialSourceKind: "vendor-channel",
      channelName: "HubSpot",
      sourceOrganization: "HubSpot",
    });
    expect(verified.ok).toBe(true);
    if (!verified.ok) return;
    expect(verified.candidate.stage).toBe("SOURCE_VERIFIED");
    expect(verified.candidate.officialSource).toBe(true);

    const relevant = reviewCandidateRelevance(verified.candidate, {
      passed: true,
      whatThisShows: ["Sales workspace layout", "Pipeline surfaces"],
    });
    expect(relevant.ok).toBe(true);
    if (!relevant.ok) return;

    const usage = reviewCandidateUsage(relevant.candidate, {
      recommendation: "embed",
    });
    expect(usage.ok).toBe(true);
    if (!usage.ok) return;

    const mapped = mapCandidateEntities(usage.candidate, {
      mapping: {
        productIds: ["hubspot"],
        featureIds: ["workflow-automation", "pipeline-management"],
        useCaseIds: ["lead-management"],
      },
    });
    expect(mapped.ok).toBe(true);
    if (!mapped.ok) return;

    const placed = addPlacementRecommendation(mapped.candidate, {
      pageRoute: "/software/hubspot/",
      pageType: "software-review",
      sectionId: "features",
      sectionTitle: "Features",
      subsection: "Workflow Automation",
      mediaPlacement: "features",
      recommendedUse: "embed",
      reason: "HubSpot Review → Features → Workflow Automation",
    });
    expect(placed.placement.pageRoute).toBe("/software/hubspot/");

    const earlyImport = importApprovedAsset(placed.candidate, {
      dryRun: true,
    });
    // still not editorially approved
    expect(earlyImport.result.ok).toBe(false);

    const approved = editorialApproveCandidate(placed.candidate);
    expect(approved.ok).toBe(true);
    if (!approved.ok) return;
    expect(approved.candidate.stage).toBe("EDITORIALLY_APPROVED");
    expect(approved.candidate.usageState).toBe("approved");

    const dry = importApprovedAsset(approved.candidate, { dryRun: true });
    expect(dry.result.ok).toBe(true);
    expect(dry.result.action).toBe("dry-run");
  });

  it("dedupes by provider id / source URL before import", () => {
    const existing = discoverOfficialVideo(
      {
        productSlug: "hubspot",
        sourceUrl: "https://www.youtube.com/watch?v=HKaG5HN89x8",
        title: "Existing HubSpot video",
        featureId: "pipeline-management",
      },
      [],
    );
    expect(existing.ok).toBe(true);
    if (!existing.ok) return;

    const dup = findDuplicateResearchMedia(
      {
        id: "other",
        provider: "youtube",
        sourceUrl: "https://youtu.be/HKaG5HN89x8",
        videoId: "HKaG5HN89x8",
        providerId: "HKaG5HN89x8",
      },
      [existing.media],
    );
    expect(dup?.id).toBe(existing.media.id);
  });
});
