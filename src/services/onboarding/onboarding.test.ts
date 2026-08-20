import { beforeEach, describe, expect, it } from "vitest";
import { __resetDataCaches } from "@/data";
import {
  deleteCandidateSoftware,
  listOnboardingRuns,
} from "@/data/onboarding/store";
import { SoftwareOnboardingRequestSchema } from "@/domain";
import {
  buildCandidateSoftware,
  buildContentMap,
  buildResearchPlan,
  checkDuplicateProduct,
  classifyTaxonomy,
  discoverRelationshipCandidates,
  onboardSoftware,
  resolveSlug,
  slugifyProductName,
} from "@/services/onboarding";
import { assessPricingReadiness } from "@/services/onboarding/pricing-readiness";

describe("software onboarding", () => {
  beforeEach(() => {
    __resetDataCaches();
  });

  it("slugifies product names deterministically", () => {
    expect(slugifyProductName("Get Response")).toBe("get-response");
    expect(
      resolveSlug(
        SoftwareOnboardingRequestSchema.parse({
          name: "GetResponse",
          source: "manual",
        }),
      ),
    ).toBe("getresponse");
  });

  it("detects existing product as EXISTING (pipedrive)", () => {
    const result = checkDuplicateProduct({
      name: "Pipedrive",
      slug: "pipedrive",
      website: "https://www.pipedrive.com",
    });
    expect(result.outcome).toBe("EXISTING");
    expect(result.matched?.slug).toBe("pipedrive");
  });

  it("classifies email-marketing taxonomy for getresponse hint", () => {
    const tax = classifyTaxonomy({
      productSlug: "getresponse",
      productName: "GetResponse",
      suggestedCategorySlugs: ["email-marketing"],
      source: "affiliate-catalogue",
    });
    expect(tax.primaryCategorySlug).toBe("email-marketing");
    expect(tax.categoryGaps).toHaveLength(0);
  });

  it("emits CATEGORY_GAP when category missing", () => {
    const tax = classifyTaxonomy({
      productSlug: "acme",
      productName: "Acme",
      suggestedCategorySlugs: ["totally-unknown-category-xyz"],
    });
    expect(tax.categoryGaps.length).toBeGreaterThan(0);
    expect(tax.primaryCategorySlug).toBeUndefined();
  });

  it("builds category-aware research plan for marketing", () => {
    const plan = buildResearchPlan({
      productSlug: "getresponse",
      primaryCategorySlug: "marketing",
    });
    expect(plan.requiredDomains).toContain("identity");
    expect(plan.requiredDomains).toContain("pricing");
    expect(plan.optionalDomains).toContain("limits");
  });

  it("creates candidate entity without inventing scores", () => {
    const product = buildCandidateSoftware({
      request: SoftwareOnboardingRequestSchema.parse({
        name: "GetResponse",
        website: "https://www.getresponse.com",
        source: "affiliate-catalogue",
        suggestedCategoryIds: ["marketing"],
        options: { dryRun: true, runResearch: false },
      }),
      slug: "getresponse",
      primaryCategorySlug: "marketing",
      entityType: "software",
    });
    expect(product.scores).toBeUndefined();
    expect(product.seo.indexable).toBe(false);
    expect(product.productLifecycle).toBe("candidate");
    expect(product.affiliate.enabled).toBe(false);
  });

  it("caps comparison candidates", () => {
    const product = buildCandidateSoftware({
      request: SoftwareOnboardingRequestSchema.parse({
        name: "Fixture CRM Peer",
        source: "manual",
        suggestedCategoryIds: ["crm"],
        options: { dryRun: true, runResearch: false },
      }),
      slug: "fixture-crm-peer-test",
      primaryCategorySlug: "crm",
      entityType: "software",
    });
    const rels = discoverRelationshipCandidates(product, { maxPeers: 20 });
    const pages = buildContentMap({
      product,
      categoryContentReady: true,
      researchPercent: 80,
      pricingStatus: "INSUFFICIENT_RESEARCH",
      relationshipCandidates: rels,
    });
    const comparisons = pages.filter((p) => p.pageType === "comparison");
    expect(comparisons.length).toBeLessThanOrEqual(5);
  });

  it("treats curated product peers as approved (relationship review cleared)", () => {
    const product = buildCandidateSoftware({
      request: SoftwareOnboardingRequestSchema.parse({
        name: "Fixture Peer CRM",
        source: "manual",
        suggestedCategoryIds: ["crm"],
        options: { dryRun: true, runResearch: false },
      }),
      slug: "fixture-peer-crm-rels",
      primaryCategorySlug: "crm",
      entityType: "software",
    });
    // Simulate editorially curated denormalized peers
    (product as { competitorSlugs: string[] }).competitorSlugs = [
      "pipedrive",
      "hubspot",
    ];
    (product as { alternativeSlugs: string[] }).alternativeSlugs = [
      "salesforce",
      "zoho-crm",
    ];
    const rels = discoverRelationshipCandidates(product, { maxPeers: 20 });
    expect(rels.length).toBeGreaterThan(0);
    expect(rels.every((r) => r.status === "approved")).toBe(true);
    expect(rels.every((r) => r.confidence === "high")).toBe(true);
    // No soft taxonomy candidates when curated peers exist
    expect(rels.some((r) => r.origin === "taxonomy")).toBe(false);
  });

  it("reconciles pipedrive without creating a new entity", async () => {
    const beforeRuns = listOnboardingRuns().length;
    const run = await onboardSoftware(
      SoftwareOnboardingRequestSchema.parse({
        name: "Pipedrive",
        slug: "pipedrive",
        website: "https://www.pipedrive.com",
        source: "existing-content",
        suggestedCategoryIds: ["crm"],
        options: {
          dryRun: true,
          runResearch: false,
          createContentPlan: true,
        },
      }),
    );
    expect(run.mode).toBe("reconcile");
    expect(run.duplicateOutcome).toBe("EXISTING");
    expect(run.productSlug).toBe("pipedrive");
    expect(run.status === "ready" || run.status === "review-required").toBe(
      true,
    );
    expect(run.scorecard?.overall).toMatch(/READY|RECONCILE/);
    expect(listOnboardingRuns().length).toBe(beforeRuns);
  });

  it("blocks non-software entity types", async () => {
    const run = await onboardSoftware(
      SoftwareOnboardingRequestSchema.parse({
        name: "Acme Agency Services",
        slug: "acme-agency-services",
        source: "manual",
        entityTypeHint: "service",
        suggestedCategoryIds: ["marketing"],
        options: { dryRun: true, runResearch: false },
      }),
    );
    expect(run.status).toBe("blocked");
    expect(run.issues.some((i) => i.code === "NOT_STANDARD_SOFTWARE")).toBe(
      true,
    );
  });

  it("affiliate absence does not block pricing readiness assessment", () => {
    const product = buildCandidateSoftware({
      request: SoftwareOnboardingRequestSchema.parse({
        name: "No Affiliate CRM",
        source: "manual",
        suggestedCategoryIds: ["crm"],
        options: { dryRun: true, runResearch: false },
      }),
      slug: "no-affiliate-crm",
      primaryCategorySlug: "crm",
      entityType: "software",
    });
    expect(product.affiliate.enabled).toBe(false);
    const pricing = assessPricingReadiness(product);
    expect(pricing.status).toBe("INSUFFICIENT_RESEARCH");
  });

  it("onboards getresponse end-to-end (dry-run, skip research)", async () => {
    // Use a unique slug so this asserts NEW mode regardless of committed candidates
    const run = await onboardSoftware(
      SoftwareOnboardingRequestSchema.parse({
        name: "GetResponse Test Twin",
        slug: "getresponse-test-twin",
        website: "https://www.getresponse-test-twin.example",
        source: "manual",
        suggestedCategoryIds: ["marketing"],
        aliases: [],
        options: {
          dryRun: true,
          runResearch: false,
          createContentPlan: true,
        },
      }),
    );
    expect(run.productSlug).toBe("getresponse-test-twin");
    expect(run.mode).toBe("new");
    expect(run.taxonomy.some((t) => t.slug === "marketing")).toBe(true);
    expect(run.researchPlan?.requiredDomains.length).toBeGreaterThan(0);
    expect(
      run.pageCandidates.some((p) => p.pageType === "software-review"),
    ).toBe(true);
    expect(run.agentTasks.length).toBeGreaterThan(0);
    expect(run.scorecard).toBeDefined();
  });

  it("persisted getresponse run creates candidate and reconciles next", async () => {
    deleteCandidateSoftware("getresponse");
    __resetDataCaches();
    const run = await onboardSoftware(
      SoftwareOnboardingRequestSchema.parse({
        name: "GetResponse",
        slug: "getresponse",
        website: "https://www.getresponse.com",
        source: "affiliate-catalogue",
        affiliateProgramId: "aff-getresponse",
        suggestedCategoryIds: ["marketing"],
        aliases: ["Get Response"],
        options: {
          dryRun: false,
          runResearch: false,
          createContentPlan: true,
        },
      }),
    );
    expect(run.id).toMatch(/^onboard-getresponse-/);
    expect(
      run.status === "review-required" ||
        run.status === "ready" ||
        run.status === "blocked",
    ).toBe(true);

    __resetDataCaches();
    const again = await onboardSoftware(
      SoftwareOnboardingRequestSchema.parse({
        name: "GetResponse",
        slug: "getresponse",
        website: "https://www.getresponse.com",
        source: "affiliate-catalogue",
        suggestedCategoryIds: ["marketing"],
        options: { dryRun: true, runResearch: false },
      }),
    );
    expect(again.mode).toBe("reconcile");
    expect(again.duplicateOutcome).toBe("EXISTING");
  });
});
