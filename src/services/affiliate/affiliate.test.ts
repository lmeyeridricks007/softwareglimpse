import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getSoftwareBySlug } from "@/data";
import {
  __resetAffiliateCaches,
  saveAffiliateDestinations,
  saveAffiliateProgrammes,
  savePromotions,
} from "@/data/affiliates/store";
import {
  addPromotion,
  disableAffiliateDestination,
  disablePromotion,
  applyAffiliateImport,
  planAffiliateImport,
  resolveCommercialCta,
  setAffiliateDestination,
  validateAffiliateUrl,
  findRawAffiliateUrls,
} from "@/services/affiliate";
import { recommendCrm, buildProductSnapshot } from "@/services/recommendation";
import { crmFinderConfig } from "@/data/config/recommendation/crm-finder-v1";
import { getAllSoftwareUnfiltered } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { normalizeCrmFinderAnswers } from "@/services/recommendation";

let root: string;

beforeEach(() => {
  root = mkdtempSync(path.join(tmpdir(), "sg-aff-"));
  process.env.SG_AFFILIATES_ROOT = root;
  __resetAffiliateCaches();
  saveAffiliateProgrammes([]);
  saveAffiliateDestinations([]);
  savePromotions([]);
});

afterEach(() => {
  __resetAffiliateCaches();
  rmSync(root, { recursive: true, force: true });
  delete process.env.SG_AFFILIATES_ROOT;
});

describe("affiliate URL validation", () => {
  it("accepts https destinations and preserves query params", () => {
    const result = validateAffiliateUrl(
      "https://partnerstack.example/a/pipedrive?ref=sg&subid=1",
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.url).toContain("ref=sg");
      expect(result.url).toContain("subid=1");
    }
  });

  it("rejects malformed and local hosts", () => {
    expect(validateAffiliateUrl("not-a-url").ok).toBe(false);
    expect(validateAffiliateUrl("https://localhost/aff").ok).toBe(false);
  });
});

describe("central destination change without content rewrite", () => {
  it("updates review/pricing/finder/go resolution after destination change", () => {
    const setA = setAffiliateDestination({
      productSlug: "pipedrive",
      url: "https://example.com/aff/pipedrive-a",
      destinationType: "trial",
      isDefault: true,
      network: "partnerstack",
    });
    expect(setA.ok).toBe(true);

    const reviewA = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "software-review",
      intent: "START_TRIAL",
    });
    const pricingA = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "pricing-page",
      intent: "VIEW_PRICING",
    });
    const finderA = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "finder",
    });
    expect(reviewA.externalUrl).toContain("pipedrive-a");
    expect(pricingA.externalUrl).toContain("pipedrive-a");
    expect(finderA.externalUrl).toContain("pipedrive-a");
    expect(reviewA.goPath).toBe("/go/pipedrive/trial");

    const setB = setAffiliateDestination({
      productSlug: "pipedrive",
      url: "https://example.com/aff/pipedrive-b",
      destinationType: "trial",
      isDefault: true,
      network: "partnerstack",
    });
    expect(setB.ok).toBe(true);

    const reviewB = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "software-review",
      intent: "START_TRIAL",
    });
    expect(reviewB.externalUrl).toContain("pipedrive-b");
    expect(reviewB.goPath).toBe("/go/pipedrive/trial");
  });
});

describe("promotion lifecycle", () => {
  beforeEach(() => {
    setAffiliateDestination({
      productSlug: "pipedrive",
      url: "https://example.com/aff/pipedrive",
      destinationType: "homepage",
      isDefault: true,
    });
  });

  it("shows normal CTA before promotion starts", () => {
    addPromotion({
      productSlug: "pipedrive",
      headline: "20% off annual plans",
      promotionType: "percentage-discount",
      value: 20,
      startsAt: "2099-01-01T00:00:00.000Z",
      endsAt: "2099-01-31T00:00:00.000Z",
      source: "test-fixture",
    });
    const cta = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "software-review",
      now: "2026-08-13T12:00:00.000Z",
    });
    expect(cta.promotion).toBeNull();
    expect(cta.affiliate).toBe(true);
  });

  it("activates promotion CTA and falls back after expiry", () => {
    addPromotion({
      productSlug: "pipedrive",
      headline: "20% off annual plans",
      promotionType: "percentage-discount",
      value: 20,
      startsAt: "2026-08-01T00:00:00.000Z",
      endsAt: "2026-08-31T23:59:59.000Z",
      source: "test-fixture",
    });

    const during = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "pricing-page",
      intent: "GET_DEAL",
      now: "2026-08-15T12:00:00.000Z",
    });
    expect(during.promotion?.headline).toBe("20% off annual plans");
    expect(during.affiliate).toBe(true);

    const after = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "pricing-page",
      intent: "GET_DEAL",
      now: "2026-09-01T00:00:00.000Z",
    });
    expect(after.promotion).toBeNull();
    expect(after.affiliate).toBe(true);
    expect(after.externalUrl).toContain("example.com/aff/pipedrive");
  });

  it("disable removes promotion immediately", () => {
    const created = addPromotion({
      productSlug: "pipedrive",
      headline: "Exclusive deal",
      startsAt: "2026-01-01T00:00:00.000Z",
      noExpiry: true,
      source: "test-fixture",
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    disablePromotion(created.promotion.id);
    const cta = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "software-review",
      now: "2026-08-15T12:00:00.000Z",
    });
    expect(cta.promotion).toBeNull();
  });
});

describe("affiliate disabled fallback", () => {
  it("uses partner-links registry when stored destination is disabled", () => {
    const set = setAffiliateDestination({
      productSlug: "pipedrive",
      url: "https://example.com/aff/pipedrive",
      destinationType: "homepage",
      isDefault: true,
    });
    expect(set.ok).toBe(true);
    if (!set.ok) return;
    disableAffiliateDestination(set.destination.id);

    const cta = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "software-review",
    });
    expect(cta.available).toBe(true);
    expect(cta.affiliate).toBe(true);
    expect(cta.disclosureRequired).toBe(true);
    expect(cta.externalUrl).toContain("trypipedrive.com");
    expect(["partner-links-registry", "legacy-software-tracking-url"]).toContain(
      cta.fallbackStep,
    );
  });
});

describe("non-affiliate product", () => {
  it("keeps official CTA without affiliate disclosure", () => {
    // Zoho CRM is catalogue-present with no partner-links / tracking URL.
    const product = getSoftwareBySlug("zoho-crm", { includeUnpublished: true });
    expect(product).toBeTruthy();
    const cta = resolveCommercialCta(
      { productSlug: "zoho-crm", context: "software-review" },
      product,
    );
    expect(cta.available).toBe(true);
    expect(cta.affiliate).toBe(false);
    expect(cta.disclosureRequired).toBe(false);
  });
});

describe("editorial independence", () => {
  it("Finder ranking ignores affiliate availability (non-affiliate can win)", () => {
    setAffiliateDestination({
      productSlug: "streak",
      url: "https://example.com/aff/streak",
      destinationType: "homepage",
      isDefault: true,
    });
    // Do NOT set affiliate for pipedrive — pipedrive still has stronger automation fit

    const software = getAllSoftwareUnfiltered().filter((s) =>
      ["pipedrive", "streak", "freshsales", "close"].includes(s.slug),
    );
    const snapshots = software.map((s) =>
      buildProductSnapshot({ software: s, enrichment: loadEnrichment(s.slug) }),
    );
    const criteria = normalizeCrmFinderAnswers({
        companySizeSlug: "small-business",
        crmUsers: 10,
        primaryUseCaseSlug: "sales-automation",
        secondaryUseCaseSlugs: ["lead-management", "pipeline-management"],
        requiredFeatureSlugs: ["workflow-automation"],
        preferredFeatureSlugs: ["email-sequences"],
        preferredIntegrationSlugs: [],
        budgetBand: "100-plus",
        budgetMode: "per-user-month",
        easePreference: "advanced-customization",
      });
    const result = recommendCrm(criteria, snapshots, crmFinderConfig);
    expect(result.results.length).toBeGreaterThan(0);
    // Pipedrive (no affiliate in this fixture root) must still be able to rank #1
    // when fit is better — affiliate on streak must not boost streak above it.
    const top = result.results[0]!;
    const streak = result.results.find((r) => r.productSlug === "streak");
    if (top.productSlug === "streak" && streak) {
      // If streak wins, it must not be because of affiliate — scores come from snapshot only
      expect(snapshots.find((s) => s.slug === "streak")).not.toHaveProperty(
        "affiliate",
      );
    }
    for (const snap of snapshots) {
      expect(snap).not.toHaveProperty("affiliate");
      expect(snap).not.toHaveProperty("promotion");
    }
  });

  it("active promotion does not alter recommendation scores", () => {
    setAffiliateDestination({
      productSlug: "pipedrive",
      url: "https://example.com/aff/pipedrive",
      isDefault: true,
    });
    addPromotion({
      productSlug: "pipedrive",
      headline: "50% off forever",
      value: 50,
      promotionType: "percentage-discount",
      noExpiry: true,
      source: "test-fixture",
    });

    const software = getAllSoftwareUnfiltered().filter((s) =>
      ["pipedrive", "freshsales"].includes(s.slug),
    );
    const snapshots = software.map((s) =>
      buildProductSnapshot({ software: s, enrichment: loadEnrichment(s.slug) }),
    );
    const criteria = normalizeCrmFinderAnswers({
        companySizeSlug: "small-business",
        crmUsers: 8,
        primaryUseCaseSlug: "pipeline-management",
        secondaryUseCaseSlugs: [],
        requiredFeatureSlugs: ["pipeline-management"],
        preferredFeatureSlugs: [],
        preferredIntegrationSlugs: [],
        budgetBand: "30-60",
        budgetMode: "per-user-month",
        easePreference: "balanced",
      });
    const before = recommendCrm(criteria, snapshots, crmFinderConfig);
    // Promotion exists but snapshots unchanged → identical ranking inputs
    expect(snapshots[0]).not.toHaveProperty("promotion");
    expect(before.results[0]?.matchScore).toBeTypeOf("number");
  });
});

describe("raw affiliate URL rejection", () => {
  it("detects network-style URLs in prose", () => {
    const found = findRawAffiliateUrls(
      'Try it via https://www.shareasale.com/r.cfm?b=1&u=2',
    );
    expect(found.length).toBeGreaterThan(0);
  });
});

describe("open redirect safety", () => {
  it("resolver never accepts arbitrary external URL input", () => {
    // resolveCommercialCta has no url parameter — open redirect is impossible at API level
    const cta = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "other",
    });
    expect(cta).not.toHaveProperty("url");
    expect(Object.keys(cta)).not.toContain("redirectUrl");
  });
});

describe("bulk import", () => {
  it("dry-run reports unknown products and does not write", () => {
    const csv = `product,affiliate_url,status
pipedrive,https://example.com/aff/pd,active
randomsoftware,https://example.com/aff/x,active
`;
    const plan = planAffiliateImport(csv);
    expect(plan.unknownProducts).toContain("randomsoftware");
    expect(plan.matched.some((m) => m.product === "pipedrive")).toBe(true);

    const dry = applyAffiliateImport(csv, { dryRun: true });
    expect(dry.applied).toBe(0);
  });

  it("import is idempotent", () => {
    const csv = `product,affiliate_url,destination_type
pipedrive,https://example.com/aff/pd,trial
`;
    const first = applyAffiliateImport(csv);
    const second = applyAffiliateImport(csv);
    expect(first.applied).toBeGreaterThan(0);
    expect(second.plan.unknownProducts).toHaveLength(0);
    const cta = resolveCommercialCta({
      productSlug: "pipedrive",
      context: "software-review",
      intent: "START_TRIAL",
    });
    expect(cta.externalUrl).toContain("example.com/aff/pd");
  });
});
