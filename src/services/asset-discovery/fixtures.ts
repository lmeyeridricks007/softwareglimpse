import type { PageAssetSnapshot } from "@/domain/schemas/asset-discovery";
import { PageAssetSnapshotSchema } from "@/domain/schemas/asset-discovery";
import type { SeededCandidate } from "./search";

/**
 * Fixtures for asset discovery tests.
 * Seeded candidate URLs are taken from known official research records —
 * never invented for symmetry.
 */

export const FIXTURE_PAGE_SNAPSHOTS: Record<string, PageAssetSnapshot> = {
  "hubspot-product": PageAssetSnapshotSchema.parse({
    pageId: "content:software:hubspot",
    route: "/software/hubspot/",
    pageType: "product-review",
    title: "HubSpot review",
    summary: "CRM platform with Sales Hub and free core CRM.",
    productIds: ["hubspot"],
    useCaseIds: ["pipeline-management", "lead-management"],
    featureIds: ["pipeline-management", "deal-management", "lead-management"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        kind: "overview",
        topics: ["sales-hub"],
        hasVisual: true,
        hasOfficialVideo: true,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "features",
        title: "Features",
        kind: "features",
        topics: ["workflow-automation", "reporting"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "implementation",
        title: "Implementation",
        kind: "implementation",
        topics: ["setup"],
        hasVisual: true,
        hasOfficialVideo: true,
        hasScreenshot: false,
        claimHeavy: false,
      },
      {
        id: "pricing",
        title: "Pricing",
        kind: "pricing",
        topics: ["pricing"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "evidence",
        title: "Evidence",
        kind: "evidence",
        topics: ["docs"],
        hasVisual: true,
        hasOfficialVideo: true,
        hasScreenshot: false,
        claimHeavy: true,
      },
    ],
    existingOfficialVideoCount: 2,
    existingScreenshotCount: 0,
    existingFigureCount: 0,
    existingOfficialSourceCount: 4,
    existingMediaIds: [
      "hs-video-sales-hub-overview",
      "hs-video-sales-hub-tutorial",
    ],
    notes: ["Fixture mirrors HubSpot research media population"],
  }),
  "pipedrive-product": PageAssetSnapshotSchema.parse({
    pageId: "content:software:pipedrive",
    route: "/software/pipedrive/",
    pageType: "product-review",
    title: "Pipedrive review",
    summary: "Pipeline-first sales CRM.",
    productIds: ["pipedrive"],
    useCaseIds: ["pipeline-management"],
    featureIds: ["pipeline-management", "deal-management"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        kind: "overview",
        topics: ["product-overview"],
        hasVisual: true,
        hasOfficialVideo: true,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "features",
        title: "Features",
        kind: "features",
        topics: ["pipeline-management", "activity-based-selling"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "implementation",
        title: "Implementation",
        kind: "implementation",
        topics: ["setup"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: false,
      },
      {
        id: "pricing",
        title: "Pricing",
        kind: "pricing",
        topics: ["pricing"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "integrations",
        title: "Integrations",
        kind: "integrations",
        topics: [],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: false,
      },
    ],
    existingOfficialVideoCount: 1,
    existingScreenshotCount: 0,
    existingFigureCount: 0,
    existingOfficialSourceCount: 5,
    existingMediaIds: ["pd-video-overview"],
    notes: ["Fixture mirrors Pipedrive overview-only media gap notes"],
  }),
  "crm-guide": PageAssetSnapshotSchema.parse({
    pageId: "content:guide:what-is-crm",
    route: "/guides/what-is-crm/",
    pageType: "guide",
    title: "What is CRM?",
    summary: "Educational guide to CRM fundamentals.",
    productIds: [],
    sections: [
      {
        id: "quick-answer",
        title: "Quick answer",
        kind: "overview",
        topics: [],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "crm-loop",
        title: "How CRM works",
        kind: "workflow",
        topics: ["pipeline"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: false,
      },
      {
        id: "teaching-figure",
        title: "CRM system of record",
        kind: "teaching",
        topics: [],
        hasVisual: true,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: false,
      },
    ],
    existingFigureCount: 1,
    topicType: "fundamental",
  }),
  "industry-guide": PageAssetSnapshotSchema.parse({
    pageId: "content:guide:financial-services-crm",
    route: "/guides/financial-services-crm/",
    pageType: "guide",
    title: "CRM for Financial Services",
    summary: "How advisory and FS teams use CRM.",
    productIds: [],
    industryIds: ["financial-services"],
    sections: [
      {
        id: "quick-answer",
        title: "Quick answer",
        kind: "overview",
        topics: [],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "fs-crm-loop",
        title: "How FS teams run CRM",
        kind: "workflow",
        topics: ["govern", "review"],
        hasVisual: true,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: false,
      },
      {
        id: "security-access",
        title: "Access and governance",
        kind: "security",
        topics: ["permissions"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
    ],
    existingFigureCount: 2,
    topicType: "how-it-works",
  }),
  "feature-guide": PageAssetSnapshotSchema.parse({
    pageId: "content:guide:crm-automation-best-practices",
    route: "/guides/crm-automation-best-practices/",
    pageType: "guide",
    title: "CRM Automation Best Practices",
    summary: "When to automate vs keep manual.",
    productIds: [],
    featureIds: ["sales-automation"],
    sections: [
      {
        id: "automate-or-not",
        title: "Automate or not",
        kind: "workflow",
        topics: ["automation"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "features-triggers",
        title: "Trigger patterns",
        kind: "features",
        topics: ["workflow-automation"],
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "automate-decision-map",
        title: "When to automate vs keep manual",
        kind: "teaching",
        topics: [],
        hasVisual: true,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: false,
      },
    ],
    existingFigureCount: 1,
    topicType: "feature-explainer",
  }),
};

/** Known official URLs from HubSpot / Pipedrive research — not invented. */
export const FIXTURE_SEEDED_CANDIDATES: Record<string, SeededCandidate[]> = {
  "hubspot-product": [
    {
      title: "HubSpot Sales Hub Overview Demo",
      url: "https://www.youtube.com/watch?v=HKaG5HN89x8",
      channelName: "HubSpot",
      keywords: ["overview", "demo", "youtube"],
      assetTypeHint: "official-product-video",
      mediaFormatHint: "video",
    },
    {
      title: "HubSpot CRM / Customer Platform",
      url: "https://www.hubspot.com/products/crm",
      keywords: ["pricing"],
      assetTypeHint: "official-pricing-visual",
      mediaFormatHint: "page",
    },
    {
      title: "HubSpot Brand Kit",
      url: "https://www.hubspot.com/brand-kit",
      keywords: ["brand", "logo", "assets"],
      assetTypeHint: "official-brand-asset",
      mediaFormatHint: "page",
    },
  ],
  "pipedrive-product": [
    {
      title: "Pipedrive Pricing",
      url: "https://www.pipedrive.com/en/pricing",
      keywords: ["pricing"],
      assetTypeHint: "official-pricing-visual",
      mediaFormatHint: "page",
    },
    {
      title: "How does pricing work in Pipedrive?",
      url: "https://support.pipedrive.com/en/article/how-does-pricing-work-in-pipedrive",
      keywords: ["pricing"],
      assetTypeHint: "official-pricing-visual",
      mediaFormatHint: "page",
    },
  ],
};

export function getFixturePageSnapshot(id: string): PageAssetSnapshot {
  const snap = FIXTURE_PAGE_SNAPSHOTS[id];
  if (!snap) {
    throw new Error(
      `Unknown asset discovery fixture: ${id}. Known: ${listFixturePageIds().join(", ")}`,
    );
  }
  return snap;
}

export function listFixturePageIds(): string[] {
  return Object.keys(FIXTURE_PAGE_SNAPSHOTS);
}

export function getFixtureSeededCandidates(id: string): SeededCandidate[] {
  return FIXTURE_SEEDED_CANDIDATES[id] ?? [];
}
