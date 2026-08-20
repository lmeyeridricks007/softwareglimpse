import { describe, expect, it } from "vitest";
import {
  getIndustryCapabilityProfile,
  listIndustryCapabilityParams,
} from "@/data/industry-capability";
import { getIndustryCapabilityPage } from "@/services/industry-capability";

describe("industry capability pages", () => {
  it("registers pipeline-management and workflow-automation for financial-services", () => {
    const params = listIndustryCapabilityParams();
    expect(params).toEqual(
      expect.arrayContaining([
        {
          industrySlug: "financial-services",
          capabilitySlug: "pipeline-management",
        },
        {
          industrySlug: "financial-services",
          capabilitySlug: "workflow-automation",
        },
      ]),
    );
  });

  it("builds pipeline-management page from approved assessments and evidence", () => {
    const model = getIndustryCapabilityPage(
      "financial-services",
      "pipeline-management",
    );
    expect(model).not.toBeNull();
    expect(model!.displayTitle).toMatch(/Pipeline Management/i);
    expect(model!.requirements.length).toBeGreaterThan(0);
    expect(model!.productRows.length).toBeGreaterThan(0);
    expect(model!.faq.length).toBeGreaterThan(0);
    expect(model!.productRows.some((p) => p.fitScore != null)).toBe(true);
    expect(
      model!.productRows.every((p) =>
        ["Strong", "Good", "Limited", "Unknown"].includes(p.fitLabel),
      ),
    ).toBe(true);
    // Unknown is a valid cell — never invent unsupported as default.
    for (const row of model!.productRows) {
      for (const cell of Object.values(row.cells)) {
        expect(["supported", "partial", "unknown", "not-supported"]).toContain(
          cell,
        );
      }
    }
  });

  it("builds workflow-automation page proving the template is reusable", () => {
    const profile = getIndustryCapabilityProfile(
      "financial-services",
      "workflow-automation",
    );
    expect(profile).not.toBeNull();
    const model = getIndustryCapabilityPage(
      "financial-services",
      "workflow-automation",
    );
    expect(model).not.toBeNull();
    expect(model!.capabilitySlug).toBe("workflow-automation");
    expect(model!.productRows.length).toBeGreaterThan(0);
    expect(model!.relatedCapabilities.some((c) => c.slug === "pipeline-management")).toBe(
      true,
    );
  });

  it("returns null for unknown industry/capability pairs", () => {
    expect(
      getIndustryCapabilityPage("financial-services", "not-a-capability"),
    ).toBeNull();
  });
});
