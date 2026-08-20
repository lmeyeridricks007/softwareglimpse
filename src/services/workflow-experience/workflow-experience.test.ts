import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import { buildUseCaseHubModel } from "@/services/use-case-hub";
import {
  buildWorkflowExperienceModel,
  resolveStepProductSupport,
} from "@/services/workflow-experience";

const demoVideo = ProductMediaSchema.parse({
  id: "wf-demo",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "Assignment demo",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  useCaseIds: ["lead-management"],
  workflowStageIds: ["route", "capture"],
  whatThisShows: ["assignment", "capture"],
  limitations: ["plan limits"],
  status: "published",
});

describe("buildWorkflowExperienceModel", () => {
  it("supports a 6-step workflow with media cues", () => {
    const model = buildWorkflowExperienceModel({
      title: "Lead management workflow",
      steps: [
        { id: "capture", label: "Capture", detail: "Capture leads" },
        { id: "qualify", label: "Qualify", detail: "Qualify" },
        {
          id: "route",
          label: "Assign",
          detail: "Assign owners",
          goal: "Get each qualified lead to the correct salesperson quickly.",
          capabilities: [
            { id: "automation", label: "Workflow Automation" },
          ],
          requirements: [
            {
              id: "auto",
              label: "Automatic lead assignment",
              priority: "must",
            },
          ],
          features: [{ id: "lead-management", label: "Assignment rules" }],
        },
        { id: "follow-up", label: "Follow up", detail: "Follow up" },
        { id: "convert", label: "Convert", detail: "Convert" },
        { id: "measure", label: "Measure", detail: "Measure" },
      ],
      products: [
        { slug: "hubspot", name: "HubSpot" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      mediaPool: [demoVideo],
    });
    expect(model.steps).toHaveLength(6);
    const assign = model.steps.find((s) => s.id === "route");
    expect(assign?.mediaCues[0]?.ctaLabel).toMatch(/HubSpot example/i);
    expect(assign?.requirements[0]?.priority).toBe("must");
    expect(assign?.productSupport.hubspot).toBeDefined();
  });

  it("supports 3-step and 10-step workflows", () => {
    const three = buildWorkflowExperienceModel({
      title: "Short",
      steps: [
        { id: "a", label: "A", detail: "a" },
        { id: "b", label: "B", detail: "b" },
        { id: "c", label: "C", detail: "c" },
      ],
      products: [],
    });
    expect(three.steps).toHaveLength(3);

    const ten = buildWorkflowExperienceModel({
      title: "Long",
      steps: Array.from({ length: 10 }, (_, i) => ({
        id: `s${i}`,
        label: `Step ${i + 1}`,
        detail: `Detail ${i + 1}`,
      })),
      products: [{ slug: "hubspot", name: "HubSpot" }],
    });
    expect(ten.steps).toHaveLength(10);
    expect(ten.steps.every((s) => s.mediaCues.length === 0)).toBe(true);
  });

  it("builds workflows without media cleanly", () => {
    const model = buildWorkflowExperienceModel({
      title: "No media",
      steps: [
        { id: "one", label: "One", detail: "First" },
        { id: "two", label: "Two", detail: "Second" },
      ],
      products: [{ slug: "hubspot", name: "HubSpot" }],
      mediaPool: [],
    });
    expect(model.steps.every((s) => s.mediaCues.length === 0)).toBe(true);
  });

  it("never infers support from video alone", () => {
    const status = resolveStepProductSupport({
      featureIds: [],
      productSlug: "hubspot",
    });
    expect(status).toBe("unknown");
  });
});

describe("use-case hub workflow experience wiring", () => {
  it("builds enriched expandable workflow for lead-management", () => {
    const model = buildUseCaseHubModel("lead-management");
    expect(model?.workflowExperience).not.toBeNull();
    expect(model!.workflowExperience!.steps.length).toBeGreaterThanOrEqual(5);
    const assign = model!.workflowExperience!.steps.find(
      (s) => s.id === "route",
    );
    expect(assign?.goal?.toLowerCase()).toContain("salesperson");
    expect(assign?.capabilities.length).toBeGreaterThan(0);
    expect(assign?.requirements.some((r) => r.priority === "must")).toBe(true);
    expect(assign?.mediaCues.length).toBeGreaterThan(0);
  });

  it("still builds workflow experience without media for sales-forecasting", () => {
    const model = buildUseCaseHubModel("sales-forecasting");
    expect(model?.workflowExperience).not.toBeNull();
    expect(model!.workflowExperience!.steps.length).toBeGreaterThan(0);
    expect(
      model!.workflowExperience!.steps.every((s) => s.mediaCues.length === 0),
    ).toBe(true);
  });
});
