import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import { buildUseCaseHubModel } from "@/services/use-case-hub";
import {
  buildPairAnalysis,
  buildUseCaseWorkflowProductCompare,
  selectDefaultComparePair,
} from "@/services/use-case-workflow-comparison";

const hubspotVideo = ProductMediaSchema.parse({
  id: "hs-wf",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "HubSpot lead workflow",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  useCaseIds: ["lead-management"],
  workflowStageIds: ["capture", "route"],
  featureIds: ["lead-management"],
  whatThisShows: ["lead capture", "assignment"],
  whatToNotice: ["ownership visibility"],
  limitations: ["plan limits"],
  status: "published",
});

const steps = [
  {
    id: "capture",
    label: "Capture",
    features: [{ id: "lead-management", label: "Lead management" }],
    requirements: [
      { id: "capture-channels", label: "Capture leads from required channels" },
    ],
  },
  {
    id: "route",
    label: "Assign",
    features: [
      { id: "lead-management", label: "Assignment rules" },
      { id: "workflow-automation", label: "Workflow automation" },
    ],
    requirements: [
      {
        id: "auto-assign",
        label: "Automatic lead assignment",
        priority: "must" as const,
      },
    ],
  },
  {
    id: "qualify",
    label: "Qualify",
    features: [{ id: "lead-scoring", label: "Lead scoring" }],
    requirements: [],
  },
];

describe("selectDefaultComparePair", () => {
  it("prefers researched products and ignores video presence", () => {
    const [a, b] = selectDefaultComparePair([
      {
        slug: "no-research",
        name: "No Research",
        media: {
          kind: "official-video",
          media: hubspotVideo,
          title: "x",
          whatToNotice: [],
          notShown: [],
          sourceUrl: hubspotVideo.sourceUrl,
          sourceOrganization: "x",
        },
        stepSupport: { capture: "unknown" },
        researchNotes: [],
        researched: false,
      },
      {
        slug: "hubspot",
        name: "HubSpot",
        media: null,
        stepSupport: { capture: "supported", route: "supported" },
        researchNotes: [],
        researched: true,
      },
      {
        slug: "pipedrive",
        name: "Pipedrive",
        media: null,
        stepSupport: { capture: "supported", route: "partial" },
        researchNotes: [],
        researched: true,
      },
    ]);
    expect(a).toBe("hubspot");
    expect(b).toBe("pipedrive");
  });
});

describe("buildUseCaseWorkflowProductCompare", () => {
  it("supports video vs video when both have strong demos", () => {
    const pipedriveVideo = ProductMediaSchema.parse({
      ...hubspotVideo,
      id: "pd-wf",
      productSlug: "pipedrive",
      sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
      videoId: "cU0FYEDRop8",
      embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
      thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
      title: "Pipedrive lead workflow",
    });
    const model = buildUseCaseWorkflowProductCompare({
      useCaseSlug: "lead-management",
      useCaseLabel: "Lead management",
      steps,
      products: [
        { slug: "hubspot", name: "HubSpot" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      mediaPool: [hubspotVideo, pipedriveVideo],
      mediaCtx: {
        useCaseSlug: "lead-management",
        workflowStepIds: ["capture", "route", "qualify"],
        featureIds: ["lead-management"],
      },
    });
    expect(model).not.toBeNull();
    expect(model!.products[0]?.media?.kind).toBe("official-video");
    expect(model!.products[1]?.media?.kind).toBe("official-video");
  });

  it("falls back to screenshots when video missing", () => {
    const model = buildUseCaseWorkflowProductCompare({
      useCaseSlug: "lead-management",
      useCaseLabel: "Lead management",
      steps,
      products: [
        { slug: "hubspot", name: "HubSpot" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      mediaPool: [hubspotVideo],
      screenshots: [
        {
          productSlug: "pipedrive",
          src: "/software/pipedrive/pipeline.png",
          alt: "Pipedrive pipeline board",
          caption: "Pipeline board",
          source: "https://www.pipedrive.com",
        },
      ],
      mediaCtx: {
        useCaseSlug: "lead-management",
        workflowStepIds: ["capture", "route"],
        featureIds: ["lead-management"],
      },
    });
    expect(model).not.toBeNull();
    const hs = model!.products.find((p) => p.slug === "hubspot");
    const pd = model!.products.find((p) => p.slug === "pipedrive");
    expect(hs?.media?.kind).toBe("official-video");
    expect(pd?.media?.kind).toBe("screenshot");
  });

  it("supports screenshots vs screenshots without empty players", () => {
    const model = buildUseCaseWorkflowProductCompare({
      useCaseSlug: "lead-management",
      useCaseLabel: "Lead management",
      steps,
      products: [
        { slug: "hubspot", name: "HubSpot" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      mediaPool: [],
      screenshots: [
        {
          productSlug: "hubspot",
          src: "/software/hubspot/a.png",
          alt: "HubSpot leads",
        },
        {
          productSlug: "pipedrive",
          src: "/software/pipedrive/b.png",
          alt: "Pipedrive leads",
        },
      ],
      mediaCtx: { useCaseSlug: "lead-management" },
    });
    expect(model!.products.every((p) => p.media?.kind === "screenshot")).toBe(
      true,
    );
  });
});

describe("buildPairAnalysis", () => {
  it("builds matrix and diffs including partial/unknown support", () => {
    const model = buildUseCaseWorkflowProductCompare({
      useCaseSlug: "lead-management",
      useCaseLabel: "Lead management",
      steps,
      products: [
        { slug: "hubspot", name: "HubSpot" },
        { slug: "pipedrive", name: "Pipedrive" },
        { slug: "close", name: "Close" },
      ],
      mediaPool: [hubspotVideo],
      screenshots: [
        {
          productSlug: "pipedrive",
          src: "/software/pipedrive/pipeline.png",
          alt: "Pipedrive",
        },
      ],
      mediaCtx: {
        useCaseSlug: "lead-management",
        workflowStepIds: ["capture", "route", "qualify"],
        featureIds: ["lead-management", "workflow-automation"],
      },
    });
    expect(model).not.toBeNull();
    const pair = buildPairAnalysis(model!, "hubspot", "pipedrive");
    expect(pair).not.toBeNull();
    expect(pair!.matrix.length).toBe(3);
    expect(pair!.matrix.every((r) => r.left && r.right)).toBe(true);
    expect(pair!.compareHref).toContain("hubspot");
    expect(pair!.compareHref).toContain("useCase=lead-management");
    // statuses are from enrichment — may be supported/partial/unknown
    for (const row of pair!.matrix) {
      expect([
        "supported",
        "partial",
        "not-supported",
        "unknown",
      ]).toContain(row.left);
      expect([
        "supported",
        "partial",
        "not-supported",
        "unknown",
      ]).toContain(row.right);
    }
  });
});

describe("use-case hub wiring", () => {
  it("exposes workflow product compare on lead-management", () => {
    const page = buildUseCaseHubModel("lead-management");
    expect(page?.workflowProductCompare).not.toBeNull();
    expect(page!.workflowProductCompare!.products.length).toBeGreaterThanOrEqual(
      2,
    );
    expect(page!.workflowProductCompare!.defaultLeftSlug).toBeTruthy();
    expect(page!.workflowProductCompare!.defaultRightSlug).toBeTruthy();
    expect(page!.navItems.some((n) => n.id === "compare-workflow")).toBe(true);
  });
});
