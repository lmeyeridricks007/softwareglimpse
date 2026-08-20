import { describe, expect, it } from "vitest";
import {
  getRequirementDetailProfile,
  listIndustryRequirementParams,
  listRequirementDetailParams,
} from "@/data/requirement-detail";
import {
  getRequirementDetailPage,
  validateRequirementDetailPage,
} from "@/services/requirement-detail";

describe("requirement detail pages", () => {
  const pillarSlugs = [
    "separate-sales-processes",
    "automate-lead-follow-up",
    "restrict-access-by-team",
    "forecast-revenue",
    "track-client-interactions",
    "customize-record-fields",
    "support-multiple-currencies",
    "integrate-with-email",
    "support-sso",
    "audit-user-activity",
  ];

  it("registers the CRM requirements pillar (CRM-REQ-001…010)", () => {
    expect(listRequirementDetailParams()).toEqual(
      expect.arrayContaining(pillarSlugs.map((slug) => ({ slug }))),
    );
  });

  it("builds separate-sales-processes from linked feature evidence", () => {
    const model = getRequirementDetailPage("separate-sales-processes");
    expect(model).not.toBeNull();
    expect(model!.requirementName).toMatch(/Separate Sales Processes/i);
    expect(model!.coreFeatures.length).toBeGreaterThan(0);
    expect(model!.profile.evaluationCriteria.length).toBeGreaterThan(0);
    expect(model!.productRows.length).toBeGreaterThan(0);
    expect(
      model!.productRows.some((p) => p.fitStatus !== "insufficient-evidence"),
    ).toBe(true);
    const gate = validateRequirementDetailPage(model);
    expect(gate.ok).toBe(true);
  });

  it("builds automate-lead-follow-up with different feature mapping", () => {
    const separate = getRequirementDetailProfile("separate-sales-processes");
    const automate = getRequirementDetailPage("automate-lead-follow-up");
    expect(automate).not.toBeNull();
    expect(automate!.profile.primaryCapabilitySlug).not.toBe(
      separate!.primaryCapabilitySlug,
    );
    expect(
      automate!.coreFeatures.some(
        (f) => f.featureSlug === "workflow-automation",
      ),
    ).toBe(true);
    expect(
      separate!.featureLinks.some((f) => f.featureSlug === "custom-pipelines"),
    ).toBe(true);
  });

  it(
    "ships depth + teaching visuals for every pillar requirement",
    () => {
      for (const slug of pillarSlugs) {
        const model = getRequirementDetailPage(slug);
        expect(model, slug).not.toBeNull();
        expect(model!.profile.overview, slug).toBeTruthy();
        expect(model!.profile.workedExample, slug).toBeTruthy();
        expect(model!.profile.challenges.length, slug).toBeGreaterThanOrEqual(3);
        expect(
          model!.profile.acceptanceNeeds.length,
          slug,
        ).toBeGreaterThanOrEqual(4);
        expect(
          model!.profile.workflowSteps.length,
          slug,
        ).toBeGreaterThanOrEqual(4);
        expect(model!.profile.heroVisual?.src, slug).toMatch(
          new RegExp(`/requirements/${slug}-hero\\.png$`),
        );
        expect(model!.profile.needsVisual?.src, slug).toMatch(
          new RegExp(`/requirements/${slug}-needs\\.png$`),
        );
        expect(model!.profile.workflowVisual?.src, slug).toMatch(
          new RegExp(`/requirements/${slug}-workflow\\.png$`),
        );
        const gate = validateRequirementDetailPage(model);
        expect(
          gate.ok,
          `${slug}: ${gate.issues.map((i) => i.code).join(", ")}`,
        ).toBe(true);
      }
    },
    60_000,
  );

  it("builds financial-services contextual variant", () => {
    expect(listIndustryRequirementParams()).toEqual(
      expect.arrayContaining([
        {
          industrySlug: "financial-services",
          requirementSlug: "separate-sales-processes",
        },
      ]),
    );
    const model = getRequirementDetailPage(
      "separate-sales-processes",
      "financial-services",
    );
    expect(model).not.toBeNull();
    expect(model!.industry?.slug).toBe("financial-services");
    expect(model!.displayTitle).toMatch(/Financial Services/i);
  });

  it("returns null for unknown requirements", () => {
    expect(getRequirementDetailPage("not-a-requirement")).toBeNull();
  });
});
