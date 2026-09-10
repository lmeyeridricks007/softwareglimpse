import { describe, expect, it } from "vitest";
import {
  canonicalUrl,
  identityPath,
  isAliasedPath,
  normalizePath,
  resolveCanonicalPath,
  stripSiteNameSuffix,
} from "@/seo/canonical";
import {
  buildPageMetadata,
  metadataFromSeoDefinition,
} from "@/seo/metadata";
import {
  decisionNoindex,
  indexabilityForFeaturePage,
  indexabilityForProductTab,
  indexabilityForRequirementPage,
  indexabilityFromSeoFlag,
  indexabilityForUtility,
} from "@/seo/indexability";
import {
  SITEMAP_CHUNK_SIZE,
  buildSitemapChildFiles,
  buildSitemapIndexXml,
  buildSitemapPartitions,
  buildUrlsetXml,
  escapeXmlText,
  getSitemapChildFile,
  getSitemapDiagnostics,
  getSitemapEntries,
  parseSitemapChildId,
} from "@/seo/sitemap";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/seo/english-only-cutover";
import { buildBreadcrumbs } from "@/seo/breadcrumbs";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  personJsonLd,
  softwareApplicationJsonLd,
  videoObjectJsonLd,
  websiteJsonLd,
} from "@/seo/structured-data";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  getGuides,
} from "@/data/repositories/guides";
import { getAllComparisonsUnfiltered } from "@/data";
import { SITE_NAME } from "@/lib/site";

describe("canonical resolver", () => {
  it("normalizes trailing slash, case, and aliases", () => {
    expect(normalizePath("Features/Reporting")).toBe(
      "/features/reporting-dashboards/",
    );
    expect(resolveCanonicalPath("/features/call-functionality")).toBe(
      "/features/calling/",
    );
    expect(canonicalUrl("/software/pipedrive")).toMatch(
      /\/software\/pipedrive\/$/,
    );
    expect(canonicalUrl("/software/pipedrive/?utm=1")).toMatch(
      /\/software\/pipedrive\/$/,
    );
  });

  it("keeps identityPath distinct from alias rewrite", () => {
    expect(isAliasedPath("/features/pipeline-management/")).toBe(true);
    expect(identityPath("/features/pipeline-management/")).toBe(
      "/features/pipeline-management/",
    );
    expect(normalizePath("/features/pipeline-management/")).toBe(
      "/capabilities/pipeline-management/",
    );
  });

  it("strips brand suffix for title template safety", () => {
    expect(stripSiteNameSuffix(`CRM Guides | ${SITE_NAME}`)).toBe("CRM Guides");
    expect(stripSiteNameSuffix(SITE_NAME)).toBe(SITE_NAME);
  });
});

describe("metadata robots + OG", () => {
  it("uses noindex,follow for soft-publish by default", () => {
    const meta = buildPageMetadata({
      title: `What Is CRM | ${SITE_NAME}`,
      description: "Soft published guide.",
      path: "/guides/what-is-crm/",
      indexable: false,
    });
    expect(meta.title).toBe("What Is CRM");
    expect(meta.robots).toMatchObject({ index: false, follow: true });
    expect(meta.alternates?.canonical).toMatch(/\/guides\/what-is-crm\/$/);
    expect(meta.openGraph?.images).toBeTruthy();
  });

  it("honours explicit nofollow for private utilities", () => {
    const meta = buildPageMetadata({
      title: "Search",
      description: "Search",
      path: "/search/",
      indexable: false,
      nofollow: true,
    });
    expect(meta.robots).toMatchObject({ index: false, follow: false });
  });

  it("builds from SeoPageDefinition", () => {
    const meta = metadataFromSeoDefinition({
      canonicalPath: "/tools/crm-finder/",
      title: "CRM Software Finder",
      description: "Fit-based CRM shortlist.",
      pageType: "tool",
      indexability: { indexable: true, nofollow: false, reason: "tool" },
    });
    expect(meta.robots).toMatchObject({ index: true, follow: true });
  });
});

describe("indexability engine", () => {
  it("marks search utility as noindex,follow", () => {
    expect(indexabilityForUtility("search")).toMatchObject({
      indexable: false,
      nofollow: false,
      reason: "utility:search",
    });
  });

  it("keeps product tabs noindex even when product is indexable", () => {
    expect(indexabilityForProductTab(true)).toMatchObject({
      indexable: false,
      nofollow: false,
    });
  });

  it("gates features and requirements", () => {
    expect(
      indexabilityForFeaturePage({
        hasModel: true,
        hasOverview: true,
        hasTagline: true,
      }).indexable,
    ).toBe(true);
    expect(
      indexabilityForFeaturePage({
        hasModel: true,
        hasOverview: false,
        hasTagline: true,
      }).indexable,
    ).toBe(false);
    expect(
      indexabilityForRequirementPage({
        isPillar: true,
        hasOverview: true,
        hasHero: true,
      }).indexable,
    ).toBe(true);
    expect(
      indexabilityForRequirementPage({
        isPillar: false,
        hasOverview: true,
        hasHero: true,
      }).indexable,
    ).toBe(false);
  });

  it("respects seo.indexable flags", () => {
    expect(
      indexabilityFromSeoFlag({ seoIndexable: false }).indexable,
    ).toBe(false);
    expect(decisionNoindex({ reason: "x" }).indexable).toBe(false);
  });
});

describe("sitemap eligibility", () => {
  it(
    "includes indexable guides/tools and excludes soft-publish and utilities",
    () => {
      const entries = getSitemapEntries();
      const urls = new Set(entries.map((e) => e.url));
      const guides = getGuides();
      const indexable = guides.filter((g) =>
        isEntityIndexable({ kind: "guide", entity: g }),
      );
      const soft = guides.filter(
        (g) => !isEntityIndexable({ kind: "guide", entity: g }),
      );
      expect(indexable.length).toBeGreaterThan(10);
      for (const g of indexable.slice(0, 5)) {
        expect(urls.has(canonicalUrl(`/guides/${g.slug}/`))).toBe(true);
      }
      for (const g of soft.slice(0, 5)) {
        expect(urls.has(canonicalUrl(`/guides/${g.slug}/`))).toBe(false);
      }
      expect(urls.has(canonicalUrl("/go/pipedrive/"))).toBe(false);
      expect(urls.has(canonicalUrl("/search/"))).toBe(false);
      expect(urls.has(canonicalUrl("/dev/design-system/"))).toBe(false);
      expect(urls.has(canonicalUrl("/tools/crm-vendor-scorecard/"))).toBe(true);
      expect(urls.has(canonicalUrl("/tools/crm-tco-calculator/"))).toBe(true);
      expect(urls.has(canonicalUrl("/tools/sales-intelligence-credit-tco/"))).toBe(
        true,
      );
      // Category-router shell — reachable, noindex, not sitemap-eligible.
      expect(urls.has(canonicalUrl("/tools/software-finder/"))).toBe(false);
      expect(urls.has(canonicalUrl("/tools/software-stack-builder/"))).toBe(false);
      expect(urls.has(canonicalUrl("/best/"))).toBe(true);
      expect(urls.has(canonicalUrl("/alternatives/"))).toBe(true);
      expect(entries.length).toBeGreaterThan(400);
    },
  );

  it("omits lastmod when no source-of-truth timestamp exists", () => {
    const entries = getSitemapEntries();
    const home = entries.find((e) => e.url === canonicalUrl("/"));
    expect(home).toBeTruthy();
    expect(home?.lastModified).toBeUndefined();

    const withStamp = entries.filter((e) => e.lastModified);
    expect(withStamp.length).toBeGreaterThan(100);
  });

  it("builds a named sitemap index and child urlsets that cover every entry", () => {
    expect(escapeXmlText(`a&b<"'>`)).toBe("a&amp;b&lt;&quot;&apos;&gt;");
    expect(parseSitemapChildId("software.xml")).toBe("software.xml");
    expect(parseSitemapChildId("software")).toBe("software.xml");
    expect(parseSitemapChildId("comparisons-2.xml")).toBe("comparisons-2.xml");
    expect(parseSitemapChildId("nope!")).toBeNull();

    const partitions = buildSitemapPartitions();
    const children = buildSitemapChildFiles(partitions);
    expect(children.length).toBeGreaterThan(5);
    expect(children.every((c) => c.entries.length > 0)).toBe(true);
    expect(children.some((c) => c.publicPath === "/sitemap-software.xml")).toBe(
      true,
    );
    expect(
      children.some((c) => c.publicPath === "/sitemap-comparisons.xml"),
    ).toBe(true);
    expect(children.some((c) => c.publicPath === "/sitemap-guides.xml")).toBe(
      true,
    );
    // No empty reviews partition — reviews live on software pages
    expect(children.some((c) => c.publicPath.includes("review"))).toBe(false);

    const indexXml = buildSitemapIndexXml({
      siteUrl: CANONICAL_PRODUCTION_ORIGIN,
      children,
    });
    expect(indexXml).toContain("<sitemapindex");
    expect(indexXml).toContain(
      `${CANONICAL_PRODUCTION_ORIGIN}/sitemap-software.xml`,
    );
    expect(indexXml).not.toContain("/sitemaps/0.xml");
    expect(indexXml).not.toContain("<urlset");
    expect(indexXml).not.toContain("<priority>");
    expect(indexXml).not.toContain("<changefreq>");

    let covered = 0;
    const seen = new Set<string>();
    for (const child of children) {
      expect(child.entries.length).toBeLessThanOrEqual(SITEMAP_CHUNK_SIZE);
      covered += child.entries.length;
      for (const entry of child.entries) {
        expect(seen.has(entry.url)).toBe(false);
        seen.add(entry.url);
      }
      const loaded = getSitemapChildFile(child.id, children);
      expect(loaded?.entries.length).toBe(child.entries.length);
      const xml = buildUrlsetXml(child.entries);
      expect(xml).toContain("<urlset");
      expect(xml).toContain(`<loc>${child.entries[0]!.url}</loc>`);
      expect(xml).not.toContain("<priority>");
      expect(xml).not.toContain("<changefreq>");
    }
    expect(covered).toBe(getSitemapEntries().length);
  });

  it(
    "fails closed on prohibited URL classes and respects compare/guide gates",
    () => {
      const diagnostics = getSitemapDiagnostics();
      expect(diagnostics.duplicateUrls).toEqual([]);
      expect(diagnostics.prohibitedUrls).toEqual([]);
      expect(diagnostics.nonCanonicalHostUrls).toEqual([]);
      expect(diagnostics.exclusions.noindexGuides).toBeGreaterThan(500);
      expect(diagnostics.exclusions.ineligibleComparisons).toBeGreaterThan(500);
      expect(diagnostics.byContentType.guides).toBeGreaterThan(10);
      expect(diagnostics.byContentType.comparisons).toBeGreaterThan(10);

      const urls = new Set(getSitemapEntries().map((e) => e.url));
      for (const guide of getGuides()) {
        if (!isEntityIndexable({ kind: "guide", entity: guide })) {
          expect(urls.has(canonicalUrl(`/guides/${guide.slug}/`))).toBe(false);
        }
      }
      for (const comparison of getAllComparisonsUnfiltered().slice(0, 200)) {
        if (!isEntityIndexable({ kind: "comparison", entity: comparison })) {
          expect(urls.has(canonicalUrl(`/compare/${comparison.slug}/`))).toBe(
            false,
          );
        }
      }
    },
    60_000,
  );
});

describe("breadcrumbs + structured data", () => {
  it("aligns breadcrumb UI model with JSON-LD absolute URLs", () => {
    const items = [
      { name: "Home", path: "/" },
      { name: "Features", path: "/features/" },
      { name: "Workflow Automation", path: "/features/workflow-automation/" },
    ];
    const crumbs = buildBreadcrumbs(items);
    const ld = breadcrumbJsonLd(items);
    expect(crumbs[2]?.item).toBe(
      canonicalUrl("/features/workflow-automation/"),
    );
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect((ld.itemListElement as Array<{ item: string }>)[2]?.item).toBe(
      crumbs[2]?.item,
    );
  });

  it("does not fabricate ratings, offers, or incomplete VideoObject", () => {
    expect(organizationJsonLd()["@type"]).toBe("Organization");
    expect(websiteJsonLd()["@type"]).toBe("WebSite");
    const person = personJsonLd({
      name: "Lee Meyeridricks",
      path: "/company/my-story/",
      jobTitle: "Founder",
      description: "Founder of SoftwareGlimpse.",
    });
    expect(person["@type"]).toBe("Person");
    expect(person.name).toBe("Lee Meyeridricks");
    expect(person.url).toBe(canonicalUrl("/company/my-story/"));
    expect((person.worksFor as { name?: string })?.name).toBeTruthy();
    const app = softwareApplicationJsonLd({
      name: "Pipedrive",
      path: "/software/pipedrive/",
    });
    expect(app.aggregateRating).toBeUndefined();
    expect(app.review).toBeUndefined();
    expect(app.offers).toBeUndefined();
    const scored = softwareApplicationJsonLd({
      name: "Pipedrive",
      path: "/software/pipedrive/",
      dateModified: "2026-08-26T00:00:00.000Z",
      priceOffer: {
        price: 14,
        currency: "USD",
        priceAsOf: "2026-08-13T00:00:00.000Z",
      },
    });
    expect(scored.review).toBeUndefined();
    expect(scored.dateModified).toBe("2026-08-26T00:00:00.000Z");
    expect((scored.offers as { price?: string })?.price).toBe("14");
    expect(
      videoObjectJsonLd({
        name: "Demo",
        contentUrl: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
      }),
    ).toBeNull();
    expect(faqPageJsonLd([])).toBeNull();

    const article = articleJsonLd({
      headline: "How to choose a CRM",
      path: "/guides/how-to-choose-crm/",
      authorName: "Lee Meyeridricks",
      authorPath: "/company/my-story/",
      dateModified: "2026-09-06T00:00:00.000Z",
    });
    expect(article["@type"]).toBe("Article");
    expect(article.aggregateRating).toBeUndefined();
    expect(article.review).toBeUndefined();
    expect((article.author as { name?: string })?.name).toBe("Lee Meyeridricks");
  });
});
