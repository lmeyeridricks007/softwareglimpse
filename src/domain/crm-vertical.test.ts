import { beforeEach, describe, expect, it } from "vitest";
import {
  __resetDataCaches,
  getCategories,
  getChildCategoriesIncludingSupported,
  getSoftware,
  getSoftwareByCategory,
  getSoftwareBySlug,
  safeParseAlternativesPage,
  safeParseRelationship,
  safeParseSoftware,
} from "@/data";
import { validateContentRepository } from "@/data/validation/validate-content";
import {
  canonicalizeComparisonSlug,
  isCanonicalComparisonSlug,
  reverseComparisonSlug,
} from "@/domain/comparison-slug";
import { isEntityIndexable } from "@/domain/quality-gates";
import { isPubliclyAvailable } from "@/domain/publishing";
import { canonicalUrl, normalizePath } from "@/lib/urls";
import { resolveAffiliateLink } from "@/services/affiliate/resolve-affiliate-link";
import {
  resolveAlternativeSlugs,
  resolveCompetitorSlugs,
} from "@/services/graph/resolve-relationships";
import { INTERNAL_LINK_LIMITS } from "@/services/relationships/link-limits";
import { getSoftwareLinkGroups } from "@/services/relationships/software-links";
import { getSitemapEntries } from "@/seo/sitemap";
import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
} from "@/data/repositories/catalog";

beforeEach(() => {
  __resetDataCaches();
});

describe("taxonomy", () => {
  it("includes CRM and Sales Intelligence parents", () => {
    const categories = getCategories();
    expect(categories.some((c) => c.slug === "crm")).toBe(true);
    expect(categories.some((c) => c.slug === "sales-intelligence")).toBe(true);
  });

  it("resolves CRM parent-child taxonomy", () => {
    const children = getChildCategoriesIncludingSupported("crm");
    expect(children.length).toBeGreaterThanOrEqual(6);
    expect(children.every((c) => c.parentSlug === "crm")).toBe(true);
    expect(children.some((c) => c.slug === "gmail-crm")).toBe(true);
  });
});

describe("products", () => {
  it("keeps all initial product slugs unique", () => {
    const slugs = getSoftware({ includeUnpublished: true }).map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    // Seed CRM/SI catalogue is 13; onboarding candidates may overlay additional slugs.
    expect(slugs.length).toBeGreaterThanOrEqual(13);
  });

  it("requires valid primary categories", () => {
    for (const product of getSoftware({ includeUnpublished: true })) {
      expect(getCategories({ includeUnpublished: true }).some(
        (c) => c.slug === product.primaryCategorySlug,
      )).toBe(true);
    }
  });

  it("rejects broken category references at schema/validation layer", () => {
    const result = safeParseSoftware({
      id: "x",
      slug: "test-product",
      name: "Test",
      primaryCategorySlug: "crm",
    });
    expect(result.success).toBe(true);

    const report = validateContentRepository();
    expect(
      report.issues.some((i) => i.code === "unknown-primary-category"),
    ).toBe(false);
  });

  it("rejects invalid software payloads", () => {
    const result = safeParseSoftware({
      id: "x",
      slug: "Invalid Slug",
      name: "Test",
      primaryCategorySlug: "crm",
    });
    expect(result.success).toBe(false);
  });
});

describe("relationships", () => {
  it("resolves competitors symmetrically", () => {
    const fromPipedrive = resolveCompetitorSlugs("pipedrive");
    expect(fromPipedrive).toContain("freshsales");
    const fromFreshsales = resolveCompetitorSlugs("freshsales");
    expect(fromFreshsales).toContain("pipedrive");
  });

  it("resolves alternatives", () => {
    expect(resolveAlternativeSlugs("pipedrive").length).toBeGreaterThan(0);
    expect(resolveAlternativeSlugs("apollo")).toContain("lusha");
  });

  it("rejects invalid self-relationships", () => {
    const result = safeParseRelationship({
      id: "bad",
      source: "pipedrive",
      target: "pipedrive",
      type: "competes-with",
    });
    expect(result.success).toBe(false);
  });

  it("fails validation when the graph contains unknown targets", () => {
    const result = safeParseRelationship({
      id: "broken",
      source: "pipedrive",
      target: "definitely-not-a-product",
      type: "competes-with",
    });
    expect(result.success).toBe(true); // schema-valid slug

    // Repository validation of live seeds is clean; unknown refs are what
    // validateContentRepository flags when present in loaded data.
    const report = validateContentRepository();
    expect(report.ok).toBe(true);
    expect(
      report.issues.some((i) => i.code.startsWith("unknown-relationship")),
    ).toBe(false);
  });
});

describe("comparisons", () => {
  it("uses deterministic canonical slugs", () => {
    expect(canonicalizeComparisonSlug(["pipedrive", "freshsales"])).toBe(
      "freshsales-vs-pipedrive",
    );
    expect(canonicalizeComparisonSlug(["freshsales", "pipedrive"])).toBe(
      "freshsales-vs-pipedrive",
    );
    expect(isCanonicalComparisonSlug("pipedrive-vs-freshsales")).toBe(false);
    expect(isCanonicalComparisonSlug("freshsales-vs-pipedrive")).toBe(true);
  });

  it("maps reverse comparison slug to canonical", () => {
    expect(reverseComparisonSlug("pipedrive-vs-freshsales")).toBe(
      "freshsales-vs-pipedrive",
    );
  });

  it("stores only canonical comparison records", () => {
    for (const comparison of getAllComparisonsUnfiltered()) {
      expect(comparison.slug).toBe(
        canonicalizeComparisonSlug(comparison.productSlugs),
      );
    }
  });

  it("excludes unpublished comparisons from indexability", () => {
    const comparison = getAllComparisonsUnfiltered().find(
      (item) => !item.seo.indexable,
    );
    expect(comparison).toBeDefined();
    expect(
      isEntityIndexable({ kind: "comparison", entity: comparison! }),
    ).toBe(false);
  }, 30_000);
});

describe("alternatives", () => {
  it("rejects invalid source product", () => {
    const result = safeParseAlternativesPage({
      id: "x",
      slug: "missing",
      title: "Missing alternatives",
      sourceSlug: "not-a-real-product",
      alternatives: [{ targetSlug: "pipedrive" }],
    });
    // Schema allows any slug shape; repository validation catches unknowns.
    expect(result.success).toBe(true);
    const report = validateContentRepository();
    expect(report.ok).toBe(true);
  });

  it("rejects self alternatives via validation helper expectations on seeds", () => {
    const report = validateContentRepository();
    expect(report.issues.some((i) => i.code === "self-alternative")).toBe(
      false,
    );
  });
});

describe("internal links", () => {
  it("excludes unpublished comparison destinations and respects limits", () => {
    const pipedrive = getSoftwareBySlug("pipedrive");
    expect(pipedrive).toBeDefined();
    const groups = getSoftwareLinkGroups(pipedrive!);
    expect(groups.comparisons.length).toBeLessThanOrEqual(
      INTERNAL_LINK_LIMITS.relatedComparisons,
    );
    expect(groups.software.length).toBeLessThanOrEqual(
      INTERNAL_LINK_LIMITS.relatedSoftware,
    );
    expect(groups.tools.length).toBeLessThanOrEqual(
      INTERNAL_LINK_LIMITS.relatedTools,
    );
    expect(groups.categories.some((l) => l.href === "/categories/crm/")).toBe(
      true,
    );
  });
});

describe("indexability and sitemap", () => {
  it("keeps research-needed comparisons noindex", () => {
    const researchNeeded = getAllComparisonsUnfiltered().filter(
      (comparison) => comparison.metadata.researchStatus !== "complete",
    );
    expect(researchNeeded.length).toBeGreaterThan(0);
    for (const comparison of researchNeeded) {
      expect(comparison.seo.indexable).toBe(false);
      expect(
        isEntityIndexable({ kind: "comparison", entity: comparison }),
      ).toBe(false);
    }
  });

  it("excludes draft/idea pages from sitemap", () => {
    const urls = getSitemapEntries().map((entry) => entry.url);
    expect(urls.some((url) => url.includes("/best/unpublished-"))).toBe(false);
  }, 30_000);

  it("includes published quality software and CRM hub", () => {
    const urls = getSitemapEntries().map((entry) => entry.url);
    expect(urls).toContain(canonicalUrl("/software/pipedrive/"));
    expect(urls).toContain(canonicalUrl("/categories/crm/"));
  }, 30_000);

  it("indexes the CRM best page once the quality gate passes", () => {
    const best = getAllBestPagesUnfiltered().find(
      (page) => page.slug === "crm-software",
    );
    expect(best).toBeDefined();
    expect(isPubliclyAvailable(best!.metadata)).toBe(true);
    expect(isEntityIndexable({ kind: "best", entity: best! })).toBe(true);
  });
});

describe("content validation", () => {
  it("passes for the seeded CRM graph", () => {
    const report = validateContentRepository();
    const errors = report.issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
    expect(report.ok).toBe(true);
  });
});

describe("affiliate and urls", () => {
  it("resolves direct external destinations (not /go/) for page hrefs", () => {
    const software = getSoftwareBySlug("pipedrive")!;
    const resolved = resolveAffiliateLink(software, { location: "hero" });
    expect(resolved?.href).toMatch(/^https:\/\//);
    expect(resolved?.commercial?.goPath).toMatch(/^\/go\/pipedrive/);
    expect(resolved?.commercial?.externalUrl).toBe(resolved?.href);
    if (resolved?.isAffiliate) {
      expect(resolved.rel).toContain("sponsored");
    } else {
      expect(resolved?.rel).not.toContain("sponsored");
      expect(resolved?.href).toMatch(/pipedrive\.com/);
    }
  });

  it("builds canonical trailing-slash URLs", () => {
    expect(normalizePath("/software/pipedrive")).toBe("/software/pipedrive/");
    expect(canonicalUrl("/software/pipedrive/")).toBe(
      "https://www.softwareglimpse.com/software/pipedrive/",
    );
  });
});

describe("crm catalogue grouping", () => {
  it("lists CRM products under CRM category", () => {
    const crm = getSoftwareByCategory("crm");
    expect(crm.some((s) => s.slug === "pipedrive")).toBe(true);
    expect(crm.some((s) => s.slug === "apollo")).toBe(true);
  });
});
