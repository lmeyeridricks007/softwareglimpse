import { describe, expect, it } from "vitest";
import { getIndustryBySlug } from "@/data";
import { buildIndustryHubModel } from "@/services/industry-hub";
import {
  buildIndustryWorkflowExperience,
  resolveIndustryWorkflowStepLinks,
} from "@/services/industry-hub/build-workflow-experience";
import { buildWorkflowExperienceModel } from "@/services/workflow-experience";
import { ProductMediaSchema } from "@/domain";

describe("industry workflow experience", () => {
  it("builds a complex financial-services workflow from the content model", () => {
    const industry = getIndustryBySlug("financial-services", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(model.workflowExperience).not.toBeNull();
    const wf = model.workflowExperience!;
    expect(wf.steps.length).toBeGreaterThanOrEqual(6);
    expect(wf.title.toLowerCase()).toContain("financial");
    expect(wf.supporting.toLowerCase()).toContain("operating loop");

    const ongoing = wf.steps.find((s) => s.id === "ongoing");
    expect(ongoing).toBeDefined();
    expect(ongoing?.useCases.length).toBeGreaterThan(0);
    expect(ongoing?.capabilities.length).toBeGreaterThan(0);
    expect(ongoing?.requirements.length).toBeGreaterThan(0);
    expect(ongoing?.goal?.toLowerCase()).toContain("relationship");

    // Media cues open via drawer model — never required for workflow completeness
    const withMedia = wf.steps.filter((s) => s.mediaCues.length > 0);
    expect(withMedia.length).toBeGreaterThan(0);
    for (const step of withMedia) {
      for (const cue of step.mediaCues) {
        expect(cue.contextLabel).toBeTruthy();
        expect(cue.ctaLabel).toMatch(/example/i);
      }
    }
  });

  it("builds real-estate workflow with a different step set", () => {
    const industry = getIndustryBySlug("real-estate", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    expect(model.workflowExperience).not.toBeNull();
    const ids = model.workflowExperience!.steps.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "capture",
        "assign",
        "nurture",
        "under-contract",
        "close-follow",
      ]),
    );
    expect(ids).not.toContain("ongoing");
    expect(
      model.workflowExperience!.steps.some((s) => s.useCases.length > 0),
    ).toBe(true);
  });

  it("enriches thin vertical workflows with goals, activities, and links", () => {
    const industry = getIndustryBySlug("plumbing", {
      includeUnpublished: true,
    });
    const model = buildIndustryHubModel(industry!);
    const qualify = model.workflowExperience!.steps.find(
      (s) => s.id === "qualify",
    );
    expect(qualify).toBeDefined();
    expect(qualify!.goal?.toLowerCase()).toContain("urgency");
    expect(qualify!.goal).not.toBe(qualify!.detail);
    expect(qualify!.activities.length).toBeGreaterThanOrEqual(2);
    expect(qualify!.useCases.length).toBeGreaterThan(0);
    expect(qualify!.capabilities.length).toBeGreaterThan(0);
    expect(qualify!.requirements.length).toBeGreaterThan(0);
    expect(qualify!.features.length).toBeGreaterThan(0);
  });

  it("supports a simple 3-step workflow without media", () => {
    const model = buildWorkflowExperienceModel({
      title: "How CRM is used in example industry",
      steps: [
        {
          id: "a",
          label: "Start",
          detail: "Begin",
          useCases: [{ id: "u1", label: "Use case A", href: "/u/a/" }],
        },
        { id: "b", label: "Middle", detail: "Continue" },
        { id: "c", label: "End", detail: "Finish" },
      ],
      products: [{ slug: "hubspot", name: "HubSpot" }],
      mediaPool: [],
    });
    expect(model.steps).toHaveLength(3);
    expect(model.steps.every((s) => s.mediaCues.length === 0)).toBe(true);
    expect(model.steps[0]?.useCases[0]?.label).toBe("Use case A");
  });

  it("supports a complex 10-step workflow", () => {
    const model = buildWorkflowExperienceModel({
      title: "Complex",
      steps: Array.from({ length: 10 }, (_, i) => ({
        id: `s${i}`,
        label: `Step ${i + 1}`,
        detail: `Detail ${i + 1}`,
        features: [{ id: "pipeline-management", label: "Pipeline" }],
      })),
      products: [
        { slug: "salesforce", name: "Salesforce" },
        { slug: "hubspot", name: "HubSpot" },
      ],
    });
    expect(model.steps).toHaveLength(10);
    expect(model.steps[0]?.productSupport.salesforce).toBeDefined();
  });

  it("does not put financial-services terms in the shared resolver", () => {
    const links = resolveIndustryWorkflowStepLinks({
      industrySlug: "retail-ecommerce",
      step: {
        id: "capture",
        label: "Capture",
        detail: "Capture leads",
        useCaseSlugs: [],
        capabilitySlugs: ["pipeline-management"],
        requirementSlugs: [],
        featureSlugs: ["pipeline-management"],
      },
      profileUseCases: [],
      profilePriorities: [
        {
          id: "pipeline",
          title: "Pipeline management",
          description: "Track deals",
          capabilitySlug: "pipeline-management",
        },
      ],
    });
    expect(links.capabilities[0]?.href).toContain(
      "/industries/retail-ecommerce/capabilities/",
    );
    expect(JSON.stringify(links)).not.toMatch(/financial/i);
  });

  it("keeps industry-specific vs general media labels distinct", () => {
    const industrySpecific = ProductMediaSchema.parse({
      id: "ind-spec",
      productSlug: "salesforce",
      type: "official-video",
      provider: "youtube",
      sourceUrl: "https://www.youtube.com/watch?v=Kzjzo4Kdoc4",
      videoId: "Kzjzo4Kdoc4",
      embedUrl: "https://www.youtube-nocookie.com/embed/Kzjzo4Kdoc4",
      title: "Industry edition demo",
      thumbnailUrl: "https://i.ytimg.com/vi/Kzjzo4Kdoc4/hqdefault.jpg",
      officialSource: true,
      officialSourceKind: "vendor-channel",
      verifiedAt: "2026-08-14T20:00:00.000Z",
      industryIds: ["financial-services"],
      mediaContext: "industry-edition",
      workflowStageIds: ["ongoing"],
      whatThisShows: ["relationship"],
      status: "published",
    });

    const general = ProductMediaSchema.parse({
      id: "gen-wf",
      productSlug: "pipedrive",
      type: "official-video",
      provider: "youtube",
      sourceUrl: "https://www.youtube.com/watch?v=cU0FYEDRop8",
      videoId: "cU0FYEDRop8",
      embedUrl: "https://www.youtube-nocookie.com/embed/cU0FYEDRop8",
      title: "General pipeline",
      thumbnailUrl: "https://i.ytimg.com/vi/cU0FYEDRop8/hqdefault.jpg",
      officialSource: true,
      officialSourceKind: "vendor-channel",
      verifiedAt: "2026-08-14T18:00:00.000Z",
      industryIds: ["financial-services"],
      mediaContext: "general-workflow",
      workflowStageIds: ["opportunity"],
      whatThisShows: ["pipeline"],
      status: "published",
    });

    const model = buildIndustryWorkflowExperience({
      industrySlug: "financial-services",
      industryLabel: "Financial services",
      profile: {
        industrySlug: "financial-services",
        workflowSteps: [
          {
            id: "ongoing",
            label: "Ongoing",
            detail: "Manage relationships",
            useCaseSlugs: [],
            capabilitySlugs: [],
            requirementSlugs: [],
            featureSlugs: ["contact-management"],
          },
          {
            id: "opportunity",
            label: "Opportunity",
            detail: "Track needs",
            useCaseSlugs: [],
            capabilitySlugs: [],
            requirementSlugs: [],
            featureSlugs: ["pipeline-management"],
          },
        ],
        useCases: [],
        priorities: [],
        challenges: [],
        outcomes: [],
        capabilityNeeds: [],
        faq: [],
      },
      products: [
        { slug: "salesforce", name: "Salesforce" },
        { slug: "pipedrive", name: "Pipedrive" },
      ],
      seeInIndustryCards: [
        {
          productSlug: "salesforce",
          productName: "Salesforce",
          media: industrySpecific,
          title: industrySpecific.title,
          contextKind: "industry-edition",
          contextLabel: "Industry edition official demo",
          industryEditionLabel: "Financial Services Cloud",
          industryContext: [],
          whatThisShows: [],
          whatToNotice: [],
          whatNotEstablished: [],
          relatedCapabilities: [],
          relatedFeatures: [],
          relatedRequirements: [],
          relatedUseCases: [],
          workflowStepsShown: [],
          verifiedAt: null,
          sourceOrganization: "Salesforce",
          relevanceNote: null,
        },
        {
          productSlug: "pipedrive",
          productName: "Pipedrive",
          media: general,
          title: general.title,
          contextKind: "general-workflow",
          contextLabel: "General product workflow",
          industryEditionLabel: null,
          industryContext: [],
          whatThisShows: [],
          whatToNotice: [],
          whatNotEstablished: [],
          relatedCapabilities: [],
          relatedFeatures: [],
          relatedRequirements: [],
          relatedUseCases: [],
          workflowStepsShown: [],
          verifiedAt: null,
          sourceOrganization: "Pipedrive",
          relevanceNote: null,
        },
      ],
    });

    expect(model).not.toBeNull();
    const editionCue = model!.steps
      .flatMap((s) => s.mediaCues)
      .find((c) => c.mediaId === "ind-spec");
    const generalCue = model!.steps
      .flatMap((s) => s.mediaCues)
      .find((c) => c.mediaId === "gen-wf");
    expect(editionCue?.contextLabel).toMatch(/Industry/i);
    expect(generalCue?.contextLabel).toMatch(/General CRM workflow relevant here/i);
    expect(generalCue?.contextLabel).not.toMatch(/Industry-specific/i);
  });
});
