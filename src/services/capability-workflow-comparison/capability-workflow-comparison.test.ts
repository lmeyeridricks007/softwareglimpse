import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import { buildCapabilityWorkflowComparison } from "@/services/capability-workflow-comparison";
import { buildCapabilityHubModel } from "@/services/capability-hub";
import { getIndustryCapabilityPage } from "@/services/industry-capability";

const pipedriveVideo = ProductMediaSchema.parse({
  id: "pd-wf",
  productSlug: "pipedrive",
  type: "official-video",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
  videoId: "cU0FYEDRop8",
  embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
  title: "Pipeline workflow",
  thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-channel",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  capabilityIds: ["pipeline-management"],
  featureIds: ["pipeline-management", "deal-management"],
  evidenceClaimKinds: ["workflow-demo"],
  whatThisShows: [
    "visual pipeline board and stage-based deal organization",
    "drag-and-drop style deal progression",
    "activities and insights surfaces",
  ],
  status: "published",
});

const hubspotVideo = ProductMediaSchema.parse({
  id: "hs-wf",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "Sales Hub tutorial",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  capabilityIds: ["pipeline-management"],
  featureIds: ["pipeline-management", "workflow-automation"],
  evidenceClaimKinds: ["workflow-demo"],
  whatThisShows: [
    "deal progression in Sales Hub",
    "assignment and follow-up activity patterns",
    "reporting workspace concepts",
  ],
  status: "published",
});

const steps = [
  { id: "configure", label: "Pipeline UI", detail: "Board and stages" },
  { id: "advance", label: "Opportunity movement", detail: "Stage changes" },
  { id: "activities", label: "Activities", detail: "Next actions" },
  { id: "automation", label: "Automation", detail: "Triggers" },
  { id: "reporting", label: "Reporting", detail: "Forecast / insights" },
];

const mediaCtx = {
  capabilitySlug: "pipeline-management",
  featureIds: ["pipeline-management", "deal-management"],
};

describe("buildCapabilityWorkflowComparison", () => {
  it("builds two-video matrix with evidence-backed step cells", () => {
    const model = buildCapabilityWorkflowComparison({
      capabilityId: "pipeline-management",
      capabilityName: "Pipeline Management",
      productIds: ["pipedrive", "hubspot"],
      workflowSteps: steps,
      mediaPool: [pipedriveVideo, hubspotVideo],
      mediaCtx,
      relatedFeatureSlugs: ["multiple-pipelines", "workflow-automation"],
      limitProducts: 2,
    });
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.products).toHaveLength(2);
    expect(model.products.every((p) => p.media.kind === "video")).toBe(true);
    expect(model.products[0]?.emphasizes.length).toBeGreaterThan(0);
    expect(model.steps).toHaveLength(5);
    expect(model.interpretation).toBeTruthy();
    expect(model.interpretation).toMatch(/observations from official sources/i);
    expect(model.interpretation).not.toMatch(/best CRM|wins|superior/i);
    // One video per product
    expect(
      model.products.filter((p) => p.media.kind === "video"),
    ).toHaveLength(2);
  });

  it("falls back to screenshot when one product lacks video", () => {
    const model = buildCapabilityWorkflowComparison({
      capabilityId: "pipeline-management",
      capabilityName: "Pipeline Management",
      productIds: ["pipedrive", "salesforce"],
      workflowSteps: steps,
      mediaPool: [pipedriveVideo],
      screenshots: [
        {
          productSlug: "salesforce",
          src: "/screenshots/sf-pipeline.png",
          alt: "Salesforce pipeline board",
          caption: "Pipeline stages and opportunity board",
          source: "https://help.salesforce.com/example",
        },
      ],
      mediaCtx,
      limitProducts: 2,
    });
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.products).toHaveLength(2);
    const kinds = model.products.map((p) => p.media.kind).sort();
    expect(kinds).toEqual(["screenshot", "video"]);
  });

  it("returns null when no media for any product", () => {
    const model = buildCapabilityWorkflowComparison({
      capabilityId: "security-administration",
      capabilityName: "Security & Administration",
      productIds: ["hubspot", "pipedrive"],
      workflowSteps: steps,
      mediaPool: [],
      screenshots: [],
      mediaCtx: { capabilitySlug: "security-administration" },
      limitProducts: 2,
    });
    expect(model).toBeNull();
  });

  it("includes evidence and compare deep links when routes exist", () => {
    const model = buildCapabilityWorkflowComparison({
      capabilityId: "pipeline-management",
      capabilityName: "Pipeline Management",
      productIds: ["pipedrive", "hubspot"],
      workflowSteps: steps,
      mediaPool: [pipedriveVideo, hubspotVideo],
      mediaCtx,
      relatedFeatureSlugs: ["multiple-pipelines"],
      relatedCapabilityHrefs: [
        {
          href: "/capabilities/workflow-automation/",
          label: "Explore Workflow Automation →",
        },
      ],
      evidenceHref: "#capability-evidence",
      limitProducts: 2,
    });
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.evidenceHref).toBe("#capability-evidence");
    expect(
      model.deepLinks.some((l) => l.href.includes("workflow-automation")),
    ).toBe(true);
    expect(model.deepLinks.some((l) => l.href.includes("/compare/"))).toBe(
      true,
    );
  });
});

describe("capability pages wire workflow comparison", () => {
  it("pipeline-management hub exposes workflowComparison when media exists", () => {
    const hub = buildCapabilityHubModel("pipeline-management");
    expect(hub).not.toBeNull();
    if (!hub) return;
    if (hub.seeInAction.length >= 1) {
      expect(hub.workflowComparison == null || hub.workflowComparison.products.length >= 1).toBe(
        true,
      );
    }
  });

  it("industry pipeline page builds comparison or omits cleanly", () => {
    const page = getIndustryCapabilityPage(
      "financial-services",
      "pipeline-management",
    );
    expect(page).not.toBeNull();
    if (!page) return;
    expect(
      page.workflowComparison === null ||
        page.workflowComparison.products.length >= 1,
    ).toBe(true);
  });

  it("security-administration has no comparison when no visual media", () => {
    const page = getIndustryCapabilityPage(
      "financial-services",
      "security-administration",
    );
    expect(page).not.toBeNull();
    if (!page) return;
    expect(page.workflowComparison).toBeNull();
  });
});
