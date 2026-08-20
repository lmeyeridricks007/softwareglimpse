import { describe, expect, it } from "vitest";
import {
  canonicalUrl,
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
import { getSitemapEntries } from "@/seo/sitemap";
import { buildBreadcrumbs } from "@/seo/breadcrumbs";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  organizationJsonLd,
  softwareApplicationJsonLd,
  videoObjectJsonLd,
  websiteJsonLd,
} from "@/seo/structured-data";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  getGuides,
} from "@/data/repositories/guides";
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
      expect(entries.length).toBeGreaterThan(400);
    },
    20_000,
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
    const app = softwareApplicationJsonLd({
      name: "Pipedrive",
      path: "/software/pipedrive/",
    });
    expect(app.aggregateRating).toBeUndefined();
    expect(app.offers).toBeUndefined();
    expect(
      videoObjectJsonLd({
        name: "Demo",
        contentUrl: "https://www.youtube.com/watch?v=aaaaaaaaaaa",
      }),
    ).toBeNull();
    expect(faqPageJsonLd([])).toBeNull();
  });
});
