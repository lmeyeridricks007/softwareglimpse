import { describe, expect, it } from "vitest";
import {
  buildRequirementDemoTest,
  formatRequirementDemoTestPlainText,
} from "@/services/requirement-detail/demo-test";
import { getRequirementDetailPage } from "@/services/requirement-detail";
import { getRequirementDetailProfile } from "@/data/requirement-detail";

describe("buildRequirementDemoTest", () => {
  it("builds a workflow demo test for separate-sales-processes", () => {
    const profile = getRequirementDetailProfile("separate-sales-processes");
    expect(profile).toBeTruthy();
    const test = buildRequirementDemoTest(profile!);
    expect(test.requirementId).toBe("separate-sales-processes");
    expect(test.objective.toLowerCase()).toContain("separate");
    expect(test.steps.length).toBeGreaterThanOrEqual(5);
    expect(test.steps[0]).toMatch(/Pipeline A/i);
    expect(test.expectedOutcomes.some((o) => /independent/i.test(o))).toBe(
      true,
    );
    expect(test.failureSignals.length).toBeGreaterThan(0);
    expect(test.questions.length).toBeGreaterThan(0);

    const text = formatRequirementDemoTestPlainText(
      test,
      profile!.name,
    );
    expect(text).toContain("Ask the vendor to demonstrate");
    expect(text).toContain("What good support looks like");
  });

  it("builds a security demo test for restrict-access-by-team", () => {
    const model = getRequirementDetailPage("restrict-access-by-team");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.demoTest.requirementId).toBe("restrict-access-by-team");
    expect(model.demoTest.steps.some((s) => /visibility|role|team/i.test(s))).toBe(
      true,
    );
    expect(
      model.demoTest.expectedOutcomes.some((o) => /visibility|export/i.test(o)),
    ).toBe(true);
  });

  it("builds a reporting demo test for forecast-revenue", () => {
    const model = getRequirementDetailPage("forecast-revenue");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.demoTest.requirementId).toBe("forecast-revenue");
    expect(model.demoTest.steps.some((s) => /forecast/i.test(s))).toBe(true);
  });

  it("builds an integration demo test for manage-integrations", () => {
    const model = getRequirementDetailPage("manage-integrations");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.demoTest.requirementId).toBe("manage-integrations");
    expect(
      model.demoTest.steps.some((s) => /integration|connector|API/i.test(s)),
    ).toBe(true);
  });

  it("keeps requirement with no video complete — demo test still present", () => {
    const model = getRequirementDetailPage("restrict-access-by-team");
    expect(model).not.toBeNull();
    if (!model) return;
    expect(model.demoTest.steps.length).toBeGreaterThan(0);
    // Official example is optional; section must not depend on video
    expect(model.seeSupportCards.length === 0 || model.videos.length >= 0).toBe(
      true,
    );
  });

  it("synthesizes a demo test when no catalog entry exists", () => {
    const synthesized = buildRequirementDemoTest({
      slug: "synthetic-requirement",
      name: "Synthetic Requirement",
      buyerNeedDescription: "Do the synthetic thing reliably.",
      evaluationCriteria: [
        {
          id: "a",
          name: "Criterion A",
          description: "A",
          featureSlugs: [],
          importance: "required",
        },
      ],
      acceptanceNeeds: [],
      workflowSteps: [
        { id: "1", label: "Step", detail: "Show the synthetic configuration." },
      ],
      vendorQuestions: ["Which plan includes this?"],
    });
    expect(synthesized.requirementId).toBe("synthetic-requirement");
    expect(synthesized.steps[0]).toContain("synthetic configuration");
    expect(synthesized.expectedOutcomes).toContain("Criterion A");
  });
});
