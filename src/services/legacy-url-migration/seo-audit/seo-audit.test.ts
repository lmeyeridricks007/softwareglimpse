import { describe, expect, it } from "vitest";
import { assertNoRedirectChains } from "@/services/legacy-url-migration/redirect-plan/validate";
import { makeFinding } from "@/services/legacy-url-migration/seo-audit/findings";
import { scanRepoForLegacyReferences } from "@/services/legacy-url-migration/seo-audit/scan-repo";
import { runAllAuditChecks } from "@/services/legacy-url-migration/seo-audit/checks";
import type { AuditInputs } from "@/services/legacy-url-migration/seo-audit/load-inputs";
import type { UrlMappingRow } from "@/services/legacy-url-migration/mapping-agent/types";
import type { LegacyRedirectsFile } from "@/services/legacy-url-migration/redirect-plan/types";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function mapping(partial: Partial<UrlMappingRow>): UrlMappingRow {
  return {
    legacyUrl: "https://www.softwareglimpse.com/x/",
    legacyPath: "/x/",
    legacyTitle: "X",
    legacyPageType: "product_review",
    legacyIntent: "product_review",
    newUrl: "https://www.softwareglimpse.com/software/pipedrive/",
    newPath: "/software/pipedrive/",
    newTitle: "Pipedrive",
    relationship: "EQUIVALENT",
    recommendedAction: "301_REDIRECT",
    confidence: "HIGH",
    seoRisk: "HIGH",
    highRiskFlags: [],
    matchBasis: "same_product",
    reason: "test",
    notes: [],
    ...partial,
  };
}

function emptyRedirects(
  overrides: Partial<LegacyRedirectsFile> = {},
): LegacyRedirectsFile {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    generator: "test",
    policy: {
      onlyHighConfidence: true,
      permanentOnly: true,
      flattenChains: true,
      noHomepageDump: true,
      noMiddleware: true,
    },
    redirects: [],
    retired: [],
    excludedManual: [],
    stats: {
      redirects: 0,
      autoApproved: 0,
      manualExcluded: 0,
      retiredPatterns: 0,
      chainsFlattened: 0,
    },
    ...overrides,
  };
}

describe("MigrationSEOAuditAgent helpers", () => {
  it("detects wp-content media references in scanned roots", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mig-seo-"));
    const file = path.join(dir, "sample.ts");
    fs.writeFileSync(
      file,
      `const img = "/wp-content/uploads/2020/01/old.png";\n`,
    );
    const hits = scanRepoForLegacyReferences({
      redirectSources: new Set(["/pipedrive-crm-review/"]),
      roots: [dir],
    });
    expect(hits.some((h) => h.kind === "wp_media")).toBe(true);
  });

  it("flags redirect chain hygiene", () => {
    const problems = assertNoRedirectChains([
      { source: "/a/", destination: "/b/" },
      { source: "/b/", destination: "/c/" },
    ]);
    expect(problems.length).toBeGreaterThan(0);
  });

  it("makeFinding builds stable ids", () => {
    const f = makeFinding({
      check: "sitemaps",
      severity: "P0",
      subject: "/old/",
      problem: "bad",
      evidence: "x",
      recommendedAction: "fix",
    });
    expect(f.id).toContain("sitemaps");
    expect(f.severity).toBe("P0");
  });
});

describe("MigrationSEOAuditAgent checks", () => {
  it("flags internal links to redirect sources and wrong destinations", () => {
    const redirects = emptyRedirects({
      redirects: [
        {
          source: "/pipedrive-crm-review/",
          destination: "/software/hubspot/",
          permanent: true,
          id: "redir-test",
          reason: "wrong on purpose",
        },
      ],
    });

    const inputs: AuditInputs = {
      mappingRows: [
        mapping({
          legacyPath: "/pipedrive-crm-review/",
          newPath: "/software/pipedrive/",
          recommendedAction: "301_REDIRECT",
          confidence: "HIGH",
        }),
      ],
      seoPriority: [
        {
          legacyPath: "/pipedrive-crm-review/",
          legacyUrl: "https://www.softwareglimpse.com/pipedrive-crm-review/",
          legacyTitle: "Pipedrive",
          newPath: "/software/pipedrive/",
          newTitle: "Pipedrive",
          recommendedAction: "301_REDIRECT",
          relationship: "EQUIVALENT",
          mappingConfidence: "HIGH",
          historicalSeoImportance: "HIGH",
          migrationRisk: "HIGH",
          dataSources: [],
          metricConfidence: "NONE",
          importanceReasons: [],
          riskReasons: [],
          gsc: null,
          analytics: null,
          backlinks: null,
          proxy: {
            commercialValue: true,
            contentClusterRole: true,
            brandProductRelevance: true,
          },
        },
      ],
      redirects,
      inventory: [
        {
          url: "https://www.softwareglimpse.com/software/pipedrive/",
          path: "/software/pipedrive/",
          routeType: "dynamic",
          pageType: "software",
          title: "Pipedrive",
          canonical: "https://www.softwareglimpse.com/software/pipedrive/",
          indexable: true,
          publicationState: "published",
          inSitemap: true,
        },
        {
          url: "https://www.softwareglimpse.com/software/hubspot/",
          path: "/software/hubspot/",
          routeType: "dynamic",
          pageType: "software",
          title: "HubSpot",
          canonical: "https://www.softwareglimpse.com/software/hubspot/",
          indexable: true,
          publicationState: "published",
          inSitemap: true,
        },
      ],
      inventoryByPath: new Map(),
      sitemapPaths: new Set([
        "/software/pipedrive/",
        "/software/hubspot/",
      ]),
      redirectBySource: new Map([
        ["/pipedrive-crm-review/", "/software/hubspot/"],
      ]),
      redirectSources: new Set(["/pipedrive-crm-review/"]),
      internalLinkEdges: [
        { from: "/guides/what-is-crm/", to: "/pipedrive-crm-review/" },
      ],
      importanceByPath: new Map(),
    };
    inputs.inventoryByPath = new Map(
      inputs.inventory.map((r) => [r.path, r]),
    );
    inputs.importanceByPath = new Map([
      ["/pipedrive-crm-review/", inputs.seoPriority[0]!],
    ]);

    const stubIndex = {
      byPath: inputs.inventoryByPath,
      sitemap: inputs.sitemapPaths,
    };

    const { findings } = runAllAuditChecks(inputs, {
      destinationIndex: stubIndex as never,
      skipRepoScan: true,
    });

    expect(
      findings.some(
        (f) =>
          f.check === "legacy_url_fate" &&
          f.problem.includes("Incorrect destination"),
      ),
    ).toBe(true);
    expect(
      findings.some((f) => f.check === "internal_links"),
    ).toBe(true);
    expect(
      findings.some((f) => f.check === "high_risk_coverage"),
    ).toBe(true);
  });

  it("passes clean KEEP + matching redirect", () => {
    const inputs: AuditInputs = {
      mappingRows: [
        mapping({
          legacyPath: "/",
          newPath: "/",
          recommendedAction: "KEEP",
          confidence: "HIGH",
          matchBasis: "canonical_entity",
        }),
        mapping({
          legacyPath: "/pipedrive-crm-review/",
          newPath: "/software/pipedrive/",
          recommendedAction: "301_REDIRECT",
          confidence: "HIGH",
          matchBasis: "explicit_historical",
        }),
      ],
      seoPriority: [],
      redirects: emptyRedirects({
        redirects: [
          {
            source: "/pipedrive-crm-review/",
            destination: "/software/pipedrive/",
            permanent: true,
            id: "ok",
            reason: "ok",
          },
        ],
      }),
      inventory: [
        {
          url: "https://www.softwareglimpse.com/",
          path: "/",
          routeType: "static",
          pageType: "homepage",
          title: "Home",
          canonical: "https://www.softwareglimpse.com/",
          indexable: true,
          publicationState: "published",
          inSitemap: true,
        },
        {
          url: "https://www.softwareglimpse.com/software/pipedrive/",
          path: "/software/pipedrive/",
          routeType: "dynamic",
          pageType: "software",
          title: "Pipedrive",
          canonical: "https://www.softwareglimpse.com/software/pipedrive/",
          indexable: true,
          publicationState: "published",
          inSitemap: true,
        },
      ],
      inventoryByPath: new Map(),
      sitemapPaths: new Set(["/", "/software/pipedrive/"]),
      redirectBySource: new Map([
        ["/pipedrive-crm-review/", "/software/pipedrive/"],
      ]),
      redirectSources: new Set(["/pipedrive-crm-review/"]),
      internalLinkEdges: [
        { from: "/guides/what-is-crm/", to: "/software/pipedrive/" },
      ],
      importanceByPath: new Map(),
    };
    inputs.inventoryByPath = new Map(
      inputs.inventory.map((r) => [r.path, r]),
    );

    const { findings, fateRows } = runAllAuditChecks(inputs, {
      destinationIndex: {
        byPath: inputs.inventoryByPath,
        sitemap: inputs.sitemapPaths,
      } as never,
      skipRepoScan: true,
    });

    expect(fateRows.every((r) => r.ok)).toBe(true);
    expect(
      findings.filter(
        (f) =>
          f.check === "legacy_url_fate" ||
          f.check === "internal_links" ||
          f.check === "redirect_hygiene",
      ),
    ).toEqual([]);
  });
});
