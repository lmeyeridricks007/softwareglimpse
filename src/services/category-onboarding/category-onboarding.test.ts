import { beforeEach, describe, expect, it } from "vitest";
import { __resetDataCaches } from "@/data";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import {
  activateCategoryDefinition,
} from "@/data/category-onboarding/store";
import { emailMarketingDefinition } from "@/data/category-onboarding/seed/email-marketing";
import { buildCrmCategoryDefinition } from "@/data/category-onboarding/seed/crm";
import { CategoryOnboardingRequestSchema, SoftwareOnboardingRequestSchema } from "@/domain";
import {
  checkDuplicateCategory,
  classifyMemberships,
  onboardCategory,
  validateCategoryDefinition,
  validateCategorySeedAlignment,
} from "@/services/category-onboarding";
import { listCategoryDefinitionSeeds } from "@/data/category-onboarding/seed";
import { onboardSoftware } from "@/services/onboarding";

describe("category onboarding", () => {
  beforeEach(() => {
    __resetDataCaches();
  });

  it("validates email marketing definition", () => {
    const issues = validateCategoryDefinition(emailMarketingDefinition);
    const errors = issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
    expect(emailMarketingDefinition.features.length).toBeGreaterThanOrEqual(10);
    expect(emailMarketingDefinition.editorialMethodology.criteria.length).toBe(
      10,
    );
    const weightSum = emailMarketingDefinition.editorialMethodology.criteria.reduce(
      (a, c) => a + c.weight,
      0,
    );
    expect(weightSum).toBe(100);
  });

  it("onboards email-marketing (dry-run)", async () => {
    const run = await onboardCategory(
      CategoryOnboardingRequestSchema.parse({
        name: "Email Marketing",
        slug: "email-marketing",
        parentCategorySlug: "marketing",
        source: "manual",
        options: { dryRun: true, reconcile: true, activate: false },
      }),
    );
    expect(run.categorySlug).toBe("email-marketing");
    expect(run.definition?.features.length).toBeGreaterThan(5);
    expect(run.definition?.editorialMethodology.slug).toBe(
      "email-marketing-editorial",
    );
    expect(run.memberships.some((m) => m.productSlug === "getresponse")).toBe(
      true,
    );
    expect(run.memberships.find((m) => m.productSlug === "inboxally")?.role).toBe(
      "adjacent",
    );
    expect(run.agentContext?.contextRef).toContain("email-marketing");
    expect(run.status === "ready" || run.status === "ready-with-warnings").toBe(
      true,
    );
    expect(run.activated).toBe(false);
  });

  it("reconciles CRM without duplicate", async () => {
    const run = await onboardCategory(
      CategoryOnboardingRequestSchema.parse({
        name: "CRM",
        slug: "crm",
        source: "catalogue-analysis",
        options: { dryRun: true, reconcile: true, activate: false },
      }),
    );
    expect(run.mode).toBe("reconcile");
    expect(run.duplicateOutcome).toBe("EXISTING");
    expect(run.definition?.editorialMethodology.slug).toBe("crm-editorial");
    expect(run.definition?.pricingCapability).toBe("SUPPORTED");
    expect(run.definition?.finderReadiness).toBe("UI_READY");
    expect(
      run.status === "ready" ||
        run.status === "ready-with-warnings" ||
        run.scorecard?.overall === "RECONCILE_OK",
    ).toBe(true);
  });

  it("detects existing category", () => {
    const result = checkDuplicateCategory({
      name: "CRM",
      slug: "crm",
    });
    expect(result.outcome).toBe("EXISTING");
  });

  it("rejects invalid weights", () => {
    const bad = {
      ...emailMarketingDefinition,
      editorialMethodology: {
        ...emailMarketingDefinition.editorialMethodology,
        criteria: emailMarketingDefinition.editorialMethodology.criteria.map(
          (c, i) => ({ ...c, weight: i === 0 ? 50 : 1 }),
        ),
      },
    };
    const errors = validateCategoryDefinition(bad).filter(
      (i) => i.severity === "error",
    );
    expect(errors.some((e) => e.code === "invalid-weights")).toBe(true);
  });

  it("classifies memberships without inventing catalogue products", () => {
    const memberships = classifyMemberships(emailMarketingDefinition, []);
    expect(memberships.find((m) => m.productSlug === "getresponse")?.role).toBe(
      "primary",
    );
    expect(memberships.find((m) => m.productSlug === "kartra")?.role).toBe(
      "secondary",
    );
    expect(memberships.find((m) => m.productSlug === "inboxally")?.role).toBe(
      "adjacent",
    );
  });

  it("CRM projection reuses existing methodology", () => {
    const crm = buildCrmCategoryDefinition();
    expect(crm.editorialMethodology.id).toBe("methodology-crm-v1");
    expect(crm.features.length).toBeGreaterThan(5);
  });

  it("category activation clears CATEGORY_NOT_READY for software onboarding", async () => {
    activateCategoryDefinition(emailMarketingDefinition);
    __resetDataCaches();

    expect(getCategoryOnboardingOverride("email-marketing").categoryContentReady).toBe(
      true,
    );

    const run = await onboardSoftware(
      SoftwareOnboardingRequestSchema.parse({
        name: "GetResponse",
        slug: "getresponse",
        website: "https://www.getresponse.com",
        source: "affiliate-catalogue",
        suggestedCategoryIds: ["email-marketing"],
        options: {
          dryRun: true,
          runResearch: false,
          createContentPlan: true,
        },
      }),
    );

    expect(run.issues.some((i) => i.code === "CATEGORY_NOT_READY")).toBe(false);
    const productPage = run.pageCandidates.find(
      (p) => p.pageType === "software-review",
    );
    expect(productPage?.status).not.toBe("category-blocked");
  });

  it("requires every seeded category definition to exist in the catalogue", () => {
    const errors = validateCategorySeedAlignment().filter(
      (issue) => issue.severity === "error",
    );
    expect(errors).toEqual([]);
    expect(listCategoryDefinitionSeeds().length).toBeGreaterThan(5);
  });
});
