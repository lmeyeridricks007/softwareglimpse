import { describe, expect, it } from "vitest";
import {
  CrmDecisionProfileSchema,
  createEmptyCrmDecisionProfile,
  crmFinderAnswersFromDecisionProfile,
  crmRequirementsFromDecisionProfile,
} from "@/domain";
import {
  buildProfileCompleteness,
  buildProfileWarnings,
  deriveCapabilitiesFromUseCases,
  deriveFeaturesFromRequirements,
  deriveRequirementsFromCapabilities,
  listSelectableCrmUseCases,
  primaryFinderUseCaseFromProfile,
  profileToCsvChecklist,
  profileToPlainTextSummary,
  resolveRequirementMeta,
} from "@/services/decision-profile";

describe("CRM decision profile", () => {
  it("creates a versioned empty profile", () => {
    const profile = createEmptyCrmDecisionProfile("2026-08-14T00:00:00.000Z");
    expect(profile.version).toBe(1);
    expect(profile.categorySlug).toBe("crm");
    expect(CrmDecisionProfileSchema.parse(profile).requirements).toEqual([]);
  });

  it("lists canonical CRM use cases from the graph", () => {
    const useCases = listSelectableCrmUseCases();
    expect(useCases.map((u) => u.slug)).toEqual(
      expect.arrayContaining([
        "relationship-management",
        "complex-sales-processes",
        "high-volume-lead-management",
      ]),
    );
  });

  it("CASE 1: small business lead management derives capabilities and requirements", () => {
    const { recommended } = deriveCapabilitiesFromUseCases([
      "high-volume-lead-management",
    ]);
    expect(recommended.length).toBeGreaterThan(0);
    expect(recommended.some((c) => c.id === "workflow-automation" || c.id === "pipeline-management" || c.id === "contact-management")).toBe(
      true,
    );

    const reqs = deriveRequirementsFromCapabilities(
      recommended.map((c) => c.id),
      ["high-volume-lead-management"],
    );
    expect(reqs.every((r) => resolveRequirementMeta(r.id))).toBe(true);
  });

  it("CASE 2: financial services complex sales surfaces security-linked requirements", () => {
    const { recommended } = deriveCapabilitiesFromUseCases([
      "relationship-management",
      "complex-sales-processes",
    ]);
    const caps = [
      ...recommended.map((c) => c.id),
      "security-administration",
    ];
    const reqs = deriveRequirementsFromCapabilities(caps, [
      "relationship-management",
      "complex-sales-processes",
    ]);
    const slugs = reqs.map((r) => r.id);
    expect(slugs).toEqual(
      expect.arrayContaining([
        "separate-sales-processes",
        "restrict-access-by-team",
      ]),
    );
    const separate = resolveRequirementMeta("separate-sales-processes");
    expect(separate?.featureLinks.some((l) => l.relationship === "required")).toBe(
      true,
    );
  });

  it("CASE 3: features derive from requirement mappings without inventing slugs", () => {
    const reqs = [
      {
        id: "separate-sales-processes",
        priority: "must-have" as const,
        source: "user-selected" as const,
      },
      {
        id: "support-sso",
        priority: "must-have" as const,
        source: "user-selected" as const,
      },
    ];
    const features = deriveFeaturesFromRequirements(reqs);
    expect(features.length).toBeGreaterThan(0);
    expect(features.every((f) => f.id.length > 0)).toBe(true);
    expect(features.some((f) => f.priority === "must-have")).toBe(true);
  });

  it("CASE 5: many must-haves produce a deterministic warning", () => {
    const profile = createEmptyCrmDecisionProfile();
    profile.requirements = Array.from({ length: 14 }, (_, i) => ({
      id: `req-${i}`,
      priority: "must-have" as const,
      source: "user-selected" as const,
    }));
    profile.budget = { band: "under-15", currency: "EUR" };
    profile.requirements.push({
      id: "support-sso",
      priority: "must-have",
      source: "user-selected",
    });
    const warnings = buildProfileWarnings(profile);
    expect(warnings.some((w) => w.id === "many-must-haves")).toBe(true);
    expect(warnings.some((w) => w.id === "budget-vs-complexity")).toBe(true);
  });

  it("CASE 6/7: profile maps into Finder answers and cost requirements", () => {
    const profile = createEmptyCrmDecisionProfile();
    profile.businessContext = {
      industrySlug: "financial-services",
      companySizeSlug: "mid-market",
      crmUserCount: 50,
      teamIds: ["sales", "account-management"],
      currentState: "existing-crm",
    };
    profile.useCases = [
      { id: "complex-sales-processes", priority: "primary" },
      { id: "relationship-management", priority: "important" },
    ];
    profile.features = [
      { id: "custom-pipelines", priority: "must-have", source: "user-selected" },
      { id: "sso", priority: "must-have", source: "user-selected" },
      { id: "ai-assistance", priority: "nice-to-have", source: "user-selected" },
    ];
    profile.integrations = [
      { id: "microsoft-365", priority: "required" },
    ];
    profile.budget = { band: "30-60", currency: "EUR", billingPreference: "annual" };
    profile.implementation = { complexity: "balanced" };

    const mapped = primaryFinderUseCaseFromProfile(profile);
    expect(mapped.primary).toBeTruthy();

    const finder = crmFinderAnswersFromDecisionProfile(profile, {
      primaryUseCaseSlug: mapped.primary!,
      secondaryUseCaseSlugs: mapped.secondary,
    });
    expect(finder?.crmUsers).toBe(50);
    expect(finder?.requiredFeatureSlugs).toEqual(
      expect.arrayContaining(["custom-pipelines", "sso"]),
    );
    expect(finder?.preferredFeatureSlugs).toEqual(
      expect.arrayContaining(["ai-assistance"]),
    );

    const cost = crmRequirementsFromDecisionProfile(profile);
    expect(cost?.crmUsers).toBe(50);
    expect(cost?.billingPreference).toBe("annual");
    expect(cost?.requiredFeatureSlugs).toContain("custom-pipelines");
  });

  it("CASE 4: incomplete profiles stay partial without fake percentages", () => {
    const profile = createEmptyCrmDecisionProfile();
    profile.businessContext = {
      industrySlug: "saas",
      teamIds: [],
    };
    const completeness = buildProfileCompleteness(profile);
    expect(
      completeness.sections.find((s) => s.id === "business")?.status,
    ).toBe("partial");
    expect(
      completeness.sections.find((s) => s.id === "use-cases")?.status,
    ).toBe("not-started");
  });

  it("exports plain text and CSV without product recommendations", () => {
    const profile = createEmptyCrmDecisionProfile();
    profile.businessContext = {
      companySizeSlug: "small-business",
      crmUserCount: 10,
      teamIds: ["sales"],
    };
    profile.requirements = [
      {
        id: "integrate-with-email",
        priority: "must-have",
        source: "user-selected",
      },
    ];
    const text = profileToPlainTextSummary(profile);
    expect(text).toContain("CRM Requirements Profile");
    expect(text.toLowerCase()).not.toContain("hubspot");
    expect(text.toLowerCase()).toContain("do not influence");
    const csv = profileToCsvChecklist(profile);
    expect(csv).toContain("integrate-with-email");
  });
});
