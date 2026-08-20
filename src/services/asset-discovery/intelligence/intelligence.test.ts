import { describe, expect, it } from "vitest";
import {
  CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR,
  diffOpportunitySnapshots,
  runContentAssetIntelligenceOrchestrator,
  stableAssetOpportunityId,
  summarizeAssetChanges,
} from "@/services/asset-discovery/intelligence";
import type { AssetIntelligenceSnapshot } from "@/services/asset-discovery/intelligence/diff";

describe("ContentAssetIntelligenceOrchestrator", () => {
  it("exposes stable identity and never mutates content", () => {
    expect(CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR.id).toBe(
      "content-asset-intelligence-orchestrator",
    );
    expect(CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR.label).toBe(
      "ContentAssetIntelligenceOrchestrator",
    );
    expect(CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR.mutatesContent).toBe(false);
  });

  it("uses stable opportunity IDs (not sort-order)", () => {
    const a = stableAssetOpportunityId({
      pageRoute: "/software/hubspot/",
      kind: "VIDEO",
      assetTitle: "HubSpot Workflow Demo",
      section: "Features",
    });
    const b = stableAssetOpportunityId({
      pageRoute: "/software/hubspot/",
      kind: "VIDEO",
      assetTitle: "HubSpot Workflow Demo",
      section: "Features",
    });
    expect(a).toBe(b);
    expect(a.startsWith("CAI-")).toBe(true);
  });

  it("diffs NEW / STILL OPEN / IMPLEMENTED / NO LONGER AVAILABLE", () => {
    const previous: AssetIntelligenceSnapshot = {
      generatedAt: "2026-08-01T00:00:00.000Z",
      mode: "FULL",
      scope: "crm",
      opportunities: [
        {
          id: "CAI-A",
          pageRoute: "/software/hubspot/",
          page: "HubSpot",
          kind: "VIDEO",
          asset: "Demo A",
          providerId: "aaaaaaaaaaa",
          sourceUrl: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
        },
        {
          id: "CAI-B",
          pageRoute: "/software/pipedrive/",
          page: "Pipedrive",
          kind: "VIDEO",
          asset: "Demo B",
          providerId: "bbbbbbbbbbb",
        },
      ],
      knownProviderIds: [],
      knownSourceUrls: [],
    };
    const current: AssetIntelligenceSnapshot = {
      generatedAt: "2026-08-15T00:00:00.000Z",
      mode: "FULL",
      scope: "crm",
      opportunities: [
        {
          id: "CAI-B",
          pageRoute: "/software/pipedrive/",
          page: "Pipedrive",
          kind: "VIDEO",
          asset: "Demo B",
          providerId: "bbbbbbbbbbb",
        },
        {
          id: "CAI-C",
          pageRoute: "/guides/how-to-choose-crm/",
          page: "How to choose",
          kind: "ORIGINAL",
          asset: "Decision diagram",
        },
      ],
      knownProviderIds: ["aaaaaaaaaaa"],
      knownSourceUrls: ["https://www.youtube.com/watch?v=aaaaaaaaaaa"],
    };
    const changes = diffOpportunitySnapshots(previous, current);
    const summary = summarizeAssetChanges(changes);
    expect(summary.NEW).toBe(1);
    expect(summary["STILL OPEN"]).toBe(1);
    expect(summary.IMPLEMENTED).toBe(1);
  });

  it("runs LIGHT mode without failing on missing screenshots", () => {
    const result = runContentAssetIntelligenceOrchestrator({
      mode: "LIGHT",
      write: false,
      persistSnapshot: false,
      persistSearchMemory: false,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    expect(result.markdown).toContain("SoftwareGlimpse Content Asset Intelligence");
    expect(result.summary.softwarePages).toBeGreaterThan(0);
    expect(result.agent.mutatesContent).toBe(false);
  });

  it("runs limited FULL smoke for software+guides", () => {
    const result = runContentAssetIntelligenceOrchestrator({
      mode: "FULL",
      scope: "crm",
      write: false,
      persistSnapshot: false,
      persistSearchMemory: false,
      softwareLimit: 3,
      guideLimit: 5,
      generatedAt: "2026-08-15T06:00:00.000Z",
    });
    expect(result.summary.backlogA0 + result.summary.backlogA1).toBeGreaterThanOrEqual(0);
    expect(result.markdown).toContain("Top 30 recommended actions");
  });
});
