import { describe, expect, it } from "vitest";
import {
  getSoftwareBySlug,
} from "@/data";
import {
  getGuideBySlug,
} from "@/data/repositories/guides";
import {
  buildComparisonLinkPlan,
  buildFeatureLinkPlan,
  buildGuideLinkPlan,
  buildSoftwareLinkPlan,
  detectSeoOrphans,
  findSupportingGuides,
  resolveEligibleHref,
  selectLinks,
  validateInternalLinkHealth,
  makeLink,
} from "@/services/internal-linking";

describe("internal linking eligibility", () => {
  it("rejects /go and noindex utility landings when gated", () => {
    expect(resolveEligibleHref("/go/pipedrive/")).toBeNull();
    expect(resolveEligibleHref("/search/")).toBeNull();
    expect(resolveEligibleHref("/tools/software-finder/")).toBeNull();
  });

  it("accepts indexable CRM finder and guides hub", () => {
    expect(resolveEligibleHref("/tools/crm-finder/")).toBe("/tools/crm-finder/");
    expect(resolveEligibleHref("/guides/")).toBe("/guides/");
    expect(resolveEligibleHref("/features/call-functionality/")).toBe(
      "/features/calling/",
    );
  });

  it("dedupes and caps module size", () => {
    const links = selectLinks(
      [
        makeLink({
          href: "/tools/crm-finder/",
          label: "CRM Software Finder",
          relationship: "toolFor",
          module: "tryDecisionTool",
          entityType: "tool",
          score: 90,
        }),
        makeLink({
          href: "/tools/crm-finder/",
          label: "Finder again",
          relationship: "toolFor",
          module: "tryDecisionTool",
          entityType: "tool",
          score: 50,
        }),
        makeLink({
          href: "/tools/crm-cost-calculator/",
          label: "CRM Cost Calculator",
          relationship: "toolFor",
          module: "tryDecisionTool",
          entityType: "tool",
          score: 80,
        }),
      ],
      { module: "tryDecisionTool" },
    );
    expect(links).toHaveLength(2);
    expect(links[0]?.href).toBe("/tools/crm-finder/");
  });
});

describe("guide + software link plans", () => {
  it("gives CRM guides a parent hub and next step", () => {
    const guide = getGuideBySlug("what-is-crm");
    expect(guide).toBeTruthy();
    const plan = buildGuideLinkPlan(guide!);
    expect(plan.parentHub.length).toBeGreaterThan(0);
    expect(plan.recommendedNextStep.length).toBeGreaterThan(0);
    expect(
      plan.parentHub.some((l) => l.href === "/guides/" || l.href === "/categories/crm/"),
    ).toBe(true);
    // No generic "Learn more"
    for (const link of [...plan.relatedGuides, ...plan.recommendedNextStep]) {
      expect(link.label.toLowerCase()).not.toMatch(/^(learn more|click here)$/);
    }
  });

  it("builds product cluster next steps for HubSpot without affiliate bias", () => {
    const soft = getSoftwareBySlug("hubspot");
    expect(soft).toBeTruthy();
    const plan = buildSoftwareLinkPlan("hubspot");
    expect(plan).toBeTruthy();
    expect(plan!.recommendedNextStep.length).toBeGreaterThan(0);
    expect(plan!.tryDecisionTool.length).toBeGreaterThan(0);
    expect(plan!.parentHub.some((l) => l.href.includes("/categories/crm"))).toBe(
      true,
    );
  });

  it("links flagship CRM comparisons to both reviews and indexable alternatives pages", () => {
    for (const slug of ["hubspot-vs-pipedrive", "hubspot-vs-salesforce"] as const) {
      const plan = buildComparisonLinkPlan({
        comparisonSlug: slug,
        title: slug,
        productSlugs: slug === "hubspot-vs-pipedrive"
          ? ["hubspot", "pipedrive"]
          : ["hubspot", "salesforce"],
        categorySlug: "crm",
      });
      expect(
        plan.relatedProducts.some((l) => l.href === "/software/hubspot/"),
      ).toBe(true);
      expect(
        plan.relatedProducts.some((l) => l.href === "/alternatives/hubspot/"),
      ).toBe(true);
      if (slug === "hubspot-vs-pipedrive") {
        expect(
          plan.relatedProducts.some((l) => l.href === "/software/pipedrive/"),
        ).toBe(true);
        expect(
          plan.relatedProducts.some((l) => l.href === "/alternatives/pipedrive/"),
        ).toBe(true);
      } else {
        expect(
          plan.relatedProducts.some((l) => l.href === "/software/salesforce/"),
        ).toBe(true);
        expect(
          plan.relatedProducts.some((l) => l.href === "/alternatives/salesforce/"),
        ).toBe(true);
      }
    }
  });

  it("gives product-guide packs a kind-directed journey, not knowledge-area fan-out", () => {
    const setup = getGuideBySlug("pipedrive-setup");
    const worthIt = getGuideBySlug("is-pipedrive-worth-it");
    const hubspotSetup = getGuideBySlug("hubspot-setup");
    const choose = getGuideBySlug("how-to-choose-crm");
    expect(setup && worthIt && hubspotSetup && choose).toBeTruthy();

    const setupPlan = buildGuideLinkPlan(setup!);
    const worthPlan = buildGuideLinkPlan(worthIt!);
    const hubspotPlan = buildGuideLinkPlan(hubspotSetup!);

    expect(setupPlan.recommendedNextStep[0]?.href).toBe(
      "/guides/pipedrive-implementation/",
    );
    expect(worthPlan.recommendedNextStep[0]?.href).toBe("/tools/crm-finder/");
    expect(
      setupPlan.relatedGuides.some(
        (l) =>
          l.href === "/guides/crm-requirements-guide/" ||
          l.href === "/guides/crm-implementation/",
      ),
    ).toBe(true);
    expect(
      setupPlan.relatedGuides.some((l) => l.href.includes("hubspot-")),
    ).toBe(false);
    expect(setupPlan.parentHub.some((l) => l.href === "/software/pipedrive/")).toBe(
      true,
    );
    expect(hubspotPlan.parentHub.some((l) => l.href === "/software/hubspot/")).toBe(
      true,
    );
    expect(setupPlan.relatedGuides.map((l) => l.href).sort()).not.toEqual(
      worthPlan.relatedGuides.map((l) => l.href).sort(),
    );

    const supporting = findSupportingGuides(choose!);
    expect(supporting.some((g) => g.slug === "is-pipedrive-worth-it")).toBe(
      false,
    );
    expect(supporting.some((g) => g.slug.endsWith("-implementation"))).toBe(
      false,
    );
  });
});

describe("feature deep graph", () => {
  it("links feature upward to capability/hub and forward to tools", () => {
    const plan = buildFeatureLinkPlan({
      featureSlug: "workflow-automation",
      featureName: "Workflow Automation",
      capabilityHref: "/capabilities/workflow-automation/",
      capabilityName: "Workflow Automation",
      relatedFeatures: [],
      relatedCapabilities: [
        {
          slug: "workflow-automation",
          name: "Workflow Automation",
          href: "/capabilities/workflow-automation/",
        },
      ],
      relatedRequirementSlugs: ["automate-lead-follow-up"],
      useCaseSlugs: ["lead-management"],
      productSlugs: ["pipedrive"],
    });
    expect(plan.parentHub.length).toBeGreaterThan(0);
    expect(plan.recommendedNextStep.length).toBeGreaterThan(0);
  });
});

describe("orphan detector + health", () => {
  it(
    "runs without throwing and reports structured findings",
    () => {
      const report = detectSeoOrphans();
      expect(report.scannedIndexable).toBeGreaterThan(50);
      expect(Array.isArray(report.orphans)).toBe(true);
      expect(Array.isArray(report.chromeOnly)).toBe(true);
    },
    120_000,
  );

  it(
    "wires CRM tools, startup subcategory, and non-CRM compare/guide hubs",
    () => {
      const report = detectSeoOrphans();
      const orphanPaths = new Set(report.orphans.map((o) => o.path));
      for (const path of [
        "/tools/crm-plan-selector/",
        "/tools/crm-roi-calculator/",
        "/tools/crm-readiness-assessment/",
        "/tools/crm-rfp-builder/",
        "/tools/crm-demo-checklist-builder/",
        "/tools/crm-migration-cost-calculator/",
        "/tools/crm-adoption-health-assessment/",
        "/tools/crm-multi-compare/",
        "/resources/crm-uat-test-script/",
        "/categories/crm/startup/",
        "/compare/apollo-vs-lusha/",
        "/guides/what-is-sales-intelligence/",
        "/software/zoominfo/",
        "/categories/hr/",
        "/industries/saas/",
        "/best/hr-software/",
        "/alternatives/hubspot/",
      ]) {
        expect(orphanPaths.has(path)).toBe(false);
      }
      expect(report.orphans).toEqual([]);
      expect(report.weaklyLinked).toEqual([]);
    },
    120_000,
  );

  it(
    "health validation shares graph and excludes /go/ targets",
    () => {
      const issues = validateInternalLinkHealth();
      expect(Array.isArray(issues)).toBe(true);
      expect(
        issues.some(
          (i) =>
            i.code === "BROKEN_TARGET" &&
            i.to?.includes("/go/") &&
            i.module === "relatedProducts",
        ),
      ).toBe(false);
      expect(issues.filter((i) => i.severity === "error")).toEqual([]);
    },
    120_000,
  );
});
