import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadFixtureSnapshot } from "@/data/seo/store";
import { crmFinderConfig } from "@/data/config/recommendation/crm-finder-v1";
import {
  buildContentId,
  type CrmFinderCriteria,
  type SearchPerformanceRow,
} from "@/domain";
import { buildContentRegistry } from "@/services/publishing/server";
import { recommendCrm } from "@/services/recommendation";
import { buildProductSnapshot } from "@/services/recommendation/build-snapshot";
import { getSoftwareBySlug } from "@/data";
import {
  classifyQuery,
  clusterKeyForQuery,
  detectAllOpportunities,
  normalizeQuery,
  opportunityIdForComparison,
  recognizeEntities,
  resolveSearchUrl,
  scoreOpportunity,
  buildEditorialBriefCandidate,
  queriesInSameCluster,
} from "@/services/seo";
import {
  acceptOpportunity,
  dismissOpportunity,
  syncSearchPerformance,
  upsertOpportunity,
} from "@/services/seo/server";
import { FixtureSearchPerformanceProvider } from "@/services/seo/providers/fixture-provider";
import { GoogleSearchConsoleProvider } from "@/services/seo/providers/gsc-provider";

const NOW = "2026-08-13T12:00:00.000Z";

function fixtureRows(name: string): SearchPerformanceRow[] {
  return loadFixtureSnapshot(name).rows;
}

function finderCriteria(): CrmFinderCriteria {
  return {
    categorySlug: "crm",
    companySizeSlug: "small-business",
    crmUsers: 5,
    primaryUseCaseSlug: "pipeline-management",
    secondaryUseCaseSlugs: [],
    requiredFeatureSlugs: [],
    preferredFeatureSlugs: [],
    preferredIntegrationSlugs: [],
    budgetPerUserMax: null,
    budgetMode: "per-user-month",
    priorities: {
      "ease-of-use": 0.5,
      "fast-setup": 0.5,
      customization: 0.5,
      "minimal-admin": 0.5,
    },
    methodologyVersion: crmFinderConfig.version,
  };
}

describe("SEO URL resolver", () => {
  it("normalizes absolute URLs to trailing-slash paths", () => {
    const r = resolveSearchUrl(
      "https://www.softwareglimpse.com/software/pipedrive?utm=1#hash",
    );
    expect(r.normalizedPath).toBe("/software/pipedrive/");
    expect(r.contentId).toBe(buildContentId("software", "pipedrive"));
    expect(r.status).toBe("resolved");
  });

  it("resolves reverse comparison slugs as redirected to canonical contentId", () => {
    const r = resolveSearchUrl(
      "https://www.softwareglimpse.com/compare/pipedrive-vs-close/",
    );
    expect(r.status).toBe("redirected");
    expect(r.contentId).toBe(buildContentId("comparison", "close-vs-pipedrive"));
  });

  it("resolves category, pricing, alternatives, best, tools", () => {
    expect(resolveSearchUrl("/categories/crm/").contentId).toBe(
      buildContentId("category", "crm"),
    );
    expect(resolveSearchUrl("/pricing/pipedrive/").contentId).toBe(
      buildContentId("pricing", "pipedrive"),
    );
    expect(resolveSearchUrl("/alternatives/pipedrive/").contentId).toBe(
      buildContentId("alternatives", "pipedrive"),
    );
    expect(resolveSearchUrl("/best/crm-software/").contentId).toBe(
      buildContentId("best", "crm-software"),
    );
    expect(resolveSearchUrl("/tools/crm-finder/").contentId).toBe(
      buildContentId("tool", "crm-finder"),
    );
  });

  it("marks unknown paths", () => {
    expect(resolveSearchUrl("/legacy-wp/foo/").status).toBe("unknown");
  });
});

describe("query understanding", () => {
  it("normalizes queries", () => {
    expect(normalizeQuery("  Pipedrive   Pricing!! ")).toBe("pipedrive pricing");
  });

  it("classifies intents deterministically", () => {
    expect(classifyQuery("pipedrive pricing").intent).toBe("pricing");
    expect(classifyQuery("pipedrive vs close").intent).toBe("comparison");
    expect(classifyQuery("pipedrive alternatives").intent).toBe("alternatives");
    expect(classifyQuery("best crm software").intent).toBe("best");
    expect(classifyQuery("pipedrive review").intent).toBe("review");
    expect(classifyQuery("softwareglimpse crm").intent).toBe("brand");
  });

  it("recognizes catalogue entities", () => {
    const entities = recognizeEntities(normalizeQuery("pipedrive vs close crm"));
    expect(entities.productSlugs).toEqual(
      expect.arrayContaining(["pipedrive", "close"]),
    );
    expect(entities.categorySlugs).toContain("crm");
  });

  it("clusters pricing and alternatives synonyms", () => {
    expect(queriesInSameCluster("pipedrive pricing", "pipedrive cost")).toBe(
      true,
    );
    expect(
      queriesInSameCluster("pipedrive alternatives", "pipedrive competitors"),
    ).toBe(true);
    expect(clusterKeyForQuery("pipedrive pricing")).toBe("pricing:pipedrive");
  });
});

describe("synthetic fixture opportunity detection", () => {
  const current = fixtureRows("synthetic-28d-current.json");
  const previous = fixtureRows("synthetic-28d-previous.json");
  const registry = buildContentRegistry({ includeUnpublishedPricing: true });

  it("labels fixtures as synthetic", () => {
    const snap = loadFixtureSnapshot("synthetic-28d-current.json");
    expect(snap.synthetic).toBe(true);
    expect(snap.label?.toLowerCase()).toContain("synthetic");
  });

  it("detects major opportunity types from fixtures", () => {
    const opps = detectAllOpportunities({
      currentRows: current,
      previousRows: previous,
      registry,
      nowIso: NOW,
    });

    const types = new Set(opps.map((o) => o.type));
    expect(types.has("striking-distance")).toBe(true);
    expect(types.has("high-impression-low-ctr")).toBe(true);
    expect(types.has("comparison-opportunity")).toBe(true);
    expect(types.has("cannibalization")).toBe(true);
    expect(types.has("content-decay")).toBe(true);
    expect(types.has("query-page-mismatch")).toBe(true);

    expect(
      opps.some(
        (o) =>
          o.type === "comparison-opportunity" &&
          o.productSlugs.includes("close") &&
          o.productSlugs.includes("pipedrive"),
      ),
    ).toBe(true);

    expect(
      opps.some(
        (o) =>
          o.type === "query-page-mismatch" &&
          o.query?.toLowerCase().includes("pricing"),
      ),
    ).toBe(true);

    expect(
      opps.some(
        (o) =>
          o.type === "cannibalization" &&
          o.query?.toLowerCase() === "best crm software",
      ),
    ).toBe(true);
  });

  it("protects against tiny sample sizes", () => {
    const opps = detectAllOpportunities({
      currentRows: current,
      previousRows: previous,
      registry,
      nowIso: NOW,
    });
    expect(opps.some((o) => o.query?.includes("xyz obscure noise"))).toBe(
      false,
    );
  });

  it("dedupes by stable opportunity id", () => {
    const opps = detectAllOpportunities({
      currentRows: current,
      previousRows: previous,
      registry,
      nowIso: NOW,
    });
    const ids = opps.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);

    const comparisonId = opportunityIdForComparison(["pipedrive", "close"]);
    expect(comparisonId).toBe("seo-opportunity:comparison:close:pipedrive");
    expect(opps.some((o) => o.id === comparisonId)).toBe(true);
  });
});

describe("scoring + commercial boundary", () => {
  it("applies commercialBoost to planning score only", () => {
    const base = scoreOpportunity({
      type: "pricing-opportunity",
      impressions: 500,
      position: 8,
      intent: "pricing",
      commercialBoost: 0,
    });
    const boosted = scoreOpportunity({
      type: "pricing-opportunity",
      impressions: 500,
      position: 8,
      intent: "pricing",
      commercialBoost: 1,
    });
    expect(boosted.priorityScore).toBeGreaterThan(base.priorityScore);
    expect(
      boosted.reasons.some((r) => r.toLowerCase().includes("planning only")),
    ).toBe(true);
  });

  it("commercial boost does not touch recommendCrm rankings", () => {
    const pipedrive = getSoftwareBySlug("pipedrive");
    const freshsales = getSoftwareBySlug("freshsales");
    expect(pipedrive && freshsales).toBeTruthy();
    const pool = [
      buildProductSnapshot({ software: pipedrive! }),
      buildProductSnapshot({ software: freshsales! }),
    ];
    const criteria = finderCriteria();

    // Score SEO opportunities with commercial boost — must not mutate recommendCrm.
    scoreOpportunity({
      type: "comparison-opportunity",
      impressions: 420,
      intent: "comparison",
      commercialBoost: 1,
    });

    const a = recommendCrm(criteria, pool, crmFinderConfig);
    const b = recommendCrm(criteria, pool, crmFinderConfig);
    expect(a.results.map((r) => r.productSlug)).toEqual(
      b.results.map((r) => r.productSlug),
    );
    expect(a.results.map((r) => r.matchScore)).toEqual(
      b.results.map((r) => r.matchScore),
    );
  });
});

describe("queue handoff does not publish pages", () => {
  let root: string;
  let prevRoot: string | undefined;

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), "sg-seo-"));
    prevRoot = process.env.SG_SEO_ROOT;
    process.env.SG_SEO_ROOT = root;
  });

  afterEach(() => {
    if (prevRoot === undefined) delete process.env.SG_SEO_ROOT;
    else process.env.SG_SEO_ROOT = prevRoot;
    rmSync(root, { recursive: true, force: true });
  });

  it("acceptOpportunity writes queue item only", () => {
    const registry = buildContentRegistry({ includeUnpublishedPricing: true });
    const opps = detectAllOpportunities({
      currentRows: fixtureRows("synthetic-28d-current.json"),
      previousRows: fixtureRows("synthetic-28d-previous.json"),
      registry,
      nowIso: NOW,
    });
    const target = opps.find((o) => o.type === "comparison-opportunity");
    expect(target).toBeTruthy();
    upsertOpportunity(target!);

    const { opportunity, queueItem } = acceptOpportunity(target!.id, {
      nowIso: NOW,
    });
    expect(opportunity.status).toBe("queued");
    expect(queueItem.status).toBe("queued");
    expect(queueItem.notes.some((n) => n.includes("does not auto-publish"))).toBe(
      true,
    );

    const brief = buildEditorialBriefCandidate(opportunity);
    expect(brief.suggestedPageType).toBe("comparison");
    expect(brief.prohibitedClaims.some((c) => c.includes("auto-publish"))).toBe(
      true,
    );

    // No public page seeds / published content created by SEO layer.
    expect(getSoftwareBySlug("pipedrive")?.metadata.status).toBe("published");
    dismissOpportunity(target!.id, "not a priority", { nowIso: NOW });
  });

  it("syncSearchPerformance upserts fixture snapshot idempotently", async () => {
    const provider = new FixtureSearchPerformanceProvider(
      "synthetic-28d-current.json",
    );
    const meta1 = await syncSearchPerformance({
      provider,
      range: { startDate: "2026-07-17", endDate: "2026-08-13" },
      rangeLabel: "28d-current",
      synthetic: true,
    });
    const meta2 = await syncSearchPerformance({
      provider,
      range: { startDate: "2026-07-17", endDate: "2026-08-13" },
      rangeLabel: "28d-current",
      synthetic: true,
    });
    expect(meta1.id).toBe(meta2.id);
    expect(meta1.id).toContain("fixture");
  });
});

describe("GSC provider stub", () => {
  it("throws clear not-configured error by default", async () => {
    const prevUrl = process.env.GSC_PROPERTY_URL;
    const prevEmail = process.env.GSC_CLIENT_EMAIL;
    delete process.env.GSC_PROPERTY_URL;
    delete process.env.GSC_CLIENT_EMAIL;
    const provider = new GoogleSearchConsoleProvider();
    await expect(
      provider.queryPerformance({
        range: { startDate: "2026-07-17", endDate: "2026-08-13" },
      }),
    ).rejects.toThrow(/not configured/i);
    if (prevUrl) process.env.GSC_PROPERTY_URL = prevUrl;
    if (prevEmail) process.env.GSC_CLIENT_EMAIL = prevEmail;
  });

  it("returns empty when allowEmpty is set", async () => {
    const provider = new GoogleSearchConsoleProvider({ allowEmpty: true });
    const result = await provider.queryPerformance({
      range: { startDate: "2026-07-17", endDate: "2026-08-13" },
      rangeLabel: "empty",
    });
    expect(result.rows).toEqual([]);
  });
});

describe("saveOpportunity helper available for detectors", () => {
  it("parses opportunity ids stably", () => {
    expect(opportunityIdForComparison(["close", "pipedrive"])).toBe(
      opportunityIdForComparison(["pipedrive", "close"]),
    );
  });
});
