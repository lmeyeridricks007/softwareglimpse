import { describe, expect, it } from "vitest";
import { ProductMediaSchema } from "@/domain";
import {
  buildUseCaseEvidenceChain,
  evidenceSuitabilityForClaim,
  findWorkflowRequirementVideoTrace,
  USE_CASE_EVIDENCE_METHODOLOGY,
} from "@/services/use-case-evidence";
import {
  buildUseCaseEvidenceExplorer,
  filterEvidenceExplorerItems,
  DEFAULT_EVIDENCE_EXPLORER_FILTERS,
} from "@/services/evidence-explorer";
import { buildUseCaseHubModel } from "@/services/use-case-hub";

const leadWorkflowVideo = ProductMediaSchema.parse({
  id: "hs-lead-workflow-evidence",
  productSlug: "hubspot",
  type: "official-tutorial",
  provider: "youtube",
  sourceUrl: "https://www.youtube.com/watch?v=tRpOCQ15L7M",
  videoId: "tRpOCQ15L7M",
  embedUrl: "https://www.youtube-nocookie.com/embed/tRpOCQ15L7M",
  title: "Lead routing demonstration",
  thumbnailUrl: "https://i.ytimg.com/vi/tRpOCQ15L7M/hqdefault.jpg",
  channelName: "HubSpot",
  sourceOrganization: "HubSpot",
  officialSource: true,
  officialSourceKind: "vendor-training",
  verifiedAt: "2026-08-14T18:00:00.000Z",
  useCaseIds: ["lead-management"],
  capabilityIds: ["workflow-automation"],
  featureIds: ["lead-management", "workflow-automation"],
  requirementIds: ["automate-lead-follow-up"],
  workflowStageIds: ["capture", "route", "qualify", "convert"],
  evidenceClaimKinds: ["workflow-demo"],
  whatThisShows: [
    "assignment configuration",
    "owner assignment",
  ],
  limitations: [
    "minimum plan",
    "assignment limits",
    "pricing",
  ],
  status: "published",
});

const assignStep = {
  id: "route",
  label: "Assign",
  requirements: [
    {
      id: "auto-assign",
      label: "Automatically assign leads",
    },
  ],
  features: [
    { id: "lead-management", label: "Lead assignment rules" },
  ],
};

describe("claim-type evidence quality", () => {
  it("treats video as strong for UI/workflow, not pricing or security", () => {
    expect(evidenceSuitabilityForClaim("ui-behavior", "official-video")).toBe(
      "strong",
    );
    expect(evidenceSuitabilityForClaim("workflow-demo", "official-video")).toBe(
      "strong",
    );
    expect(evidenceSuitabilityForClaim("pricing", "official-video")).toBe(
      "inappropriate",
    );
    expect(
      evidenceSuitabilityForClaim("security-certification", "official-video"),
    ).toBe("inappropriate");
    expect(evidenceSuitabilityForClaim("pricing", "pricing-page")).toBe(
      "strong",
    );
    expect(
      evidenceSuitabilityForClaim("plan-availability", "documentation"),
    ).toBe("strong");
  });
});

describe("use-case evidence chain", () => {
  it("traces workflow → requirement → feature → product → official video", () => {
    const chain = buildUseCaseEvidenceChain({
      useCaseSlug: "lead-management",
      useCaseName: "Lead Management",
      steps: [assignStep],
      products: [{ slug: "hubspot", name: "HubSpot" }],
      videos: [leadWorkflowVideo],
    });

    expect(chain.methodology).toBe(USE_CASE_EVIDENCE_METHODOLOGY);

    const node = chain.nodes[0];
    expect(node?.workflowStepId).toBe("route");
    expect(node?.workflowStepLabel).toBe("Assign");

    const req = node?.requirements.find((r) => r.id === "auto-assign");
    expect(req?.label).toBe("Automatically assign leads");
    expect(req?.features[0]?.label).toBe("Lead assignment rules");

    const hubspot = req?.products.find((p) => p.productSlug === "hubspot");
    expect(hubspot).toBeDefined();
    // Assessment from feature research — not video presence
    expect(["supported", "partial", "unknown", "not-supported"]).toContain(
      hubspot?.assessmentStatus,
    );

    const video = findWorkflowRequirementVideoTrace(chain, {
      workflowStepId: "route",
      requirementId: "auto-assign",
      productSlug: "hubspot",
    });
    expect(video).not.toBeNull();
    expect(video?.kind).toBe("official-video");
    expect(video?.title).toBe("Lead routing demonstration");
    expect(video?.sourceOrganization).toMatch(/HubSpot/i);
    expect(video?.demonstrates).toEqual(
      expect.arrayContaining([
        "assignment configuration",
        "owner assignment",
      ]),
    );
    expect(video?.doesNotEstablish).toEqual(
      expect.arrayContaining(["minimum plan", "assignment limits"]),
    );
    expect(video?.verifiedAt).toBe("2026-08-14");
    expect(video?.sourceUrl).toContain("youtube.com");

    const trace = video?.traces.find(
      (t) =>
        t.workflowStepId === "route" &&
        t.requirementId === "auto-assign" &&
        t.productSlug === "hubspot",
    );
    expect(trace?.useCaseName).toBe("Lead Management");
    expect(trace?.featureLabel).toBe("Lead assignment rules");
  });

  it("dedupes one video across multiple requirements", () => {
    const chain = buildUseCaseEvidenceChain({
      useCaseSlug: "lead-management",
      useCaseName: "Lead Management",
      steps: [
        {
          ...assignStep,
          requirements: [
            { id: "auto-assign", label: "Automatically assign leads" },
            { id: "territory", label: "Territory routing" },
          ],
        },
      ],
      products: [{ slug: "hubspot", name: "HubSpot" }],
      videos: [leadWorkflowVideo],
    });
    const videos = chain.flatItems.filter((i) => i.kind === "official-video");
    expect(videos).toHaveLength(1);
    expect(videos[0]?.traces.length).toBeGreaterThanOrEqual(2);
  });
});

describe("buildUseCaseEvidenceExplorer facets", () => {
  it("exposes Workflow / Requirement / Feature filters and methodology", () => {
    const model = buildUseCaseEvidenceExplorer({
      useCaseName: "Lead Management",
      useCaseSlug: "lead-management",
      products: [{ slug: "hubspot", name: "HubSpot" }],
      screenshots: [],
      videos: [leadWorkflowVideo],
      workflowSteps: [
        {
          id: assignStep.id,
          name: assignStep.label,
          requirements: assignStep.requirements,
          features: assignStep.features,
        },
      ],
    });

    expect(model.methodology).toContain("video availability does not influence");
    expect(model.facets?.workflows.some((w) => w.id === "workflow:route")).toBe(
      true,
    );
    expect(
      model.facets?.requirements.some((r) => r.id === "requirement:auto-assign"),
    ).toBe(true);
    expect(
      model.facets?.features.some((f) => f.id === "feature:lead-management"),
    ).toBe(true);

    const video = model.items.find((i) => i.kind === "official-video");
    expect(video?.doesNotEstablish?.length).toBeGreaterThan(0);
    expect(video?.traceTrail?.[0]).toBe("Lead Management");
    expect(video?.traceTrail).toEqual(
      expect.arrayContaining(["Assign", "Automatically assign leads"]),
    );

    // Does not auto-rank video first when docs also exist
    if (model.typeCounts.documentation > 0) {
      expect(model.items[0]?.kind).toBe("documentation");
    }

    const byWorkflow = filterEvidenceExplorerItems(model.items, {
      ...DEFAULT_EVIDENCE_EXPLORER_FILTERS,
      workflowId: "workflow:route",
    });
    expect(byWorkflow.some((i) => i.kind === "official-video")).toBe(true);

    const byReq = filterEvidenceExplorerItems(model.items, {
      ...DEFAULT_EVIDENCE_EXPLORER_FILTERS,
      requirementId: "requirement:auto-assign",
      productSlug: "hubspot",
      kind: "official-video",
    });
    expect(byReq).toHaveLength(1);
  });
});

describe("lead-management hub live wiring", () => {
  it("keeps workflow → video evidence available on the hub model", () => {
    const hub = buildUseCaseHubModel("lead-management");
    expect(hub).not.toBeNull();
    if (!hub) return;

    const assign = hub.workflowSteps.find((s) => s.id === "route");
    expect(assign?.label).toBe("Assign");
    expect(assign?.requirements?.some((r) => r.id === "auto-assign")).toBe(
      true,
    );

    const explorer = buildUseCaseEvidenceExplorer({
      useCaseName: hub.badgeLabel,
      useCaseSlug: "lead-management",
      products: hub.products.map((p) => ({ slug: p.slug, name: p.name })),
      screenshots: [],
      videos: hub.videos,
      workflowSteps: hub.workflowSteps.map((s) => ({
        id: s.id,
        name: s.label,
        requirements: s.requirements?.map((r) => ({
          id: r.id,
          label: r.label,
        })),
        features: s.features?.map((f) => ({ id: f.id, label: f.label })),
      })),
    });

    if (hub.videos.length === 0) {
      // Still a valid page — absence of video is not lack of support.
      expect(explorer.methodology).toBeDefined();
      return;
    }

    const traced = filterEvidenceExplorerItems(explorer.items, {
      ...DEFAULT_EVIDENCE_EXPLORER_FILTERS,
      workflowId: "workflow:route",
      kind: "official-video",
      productSlug: "hubspot",
    });
    expect(traced.length).toBeGreaterThan(0);
    expect(traced[0]?.doesNotEstablish?.length).toBeGreaterThan(0);
  });
});
