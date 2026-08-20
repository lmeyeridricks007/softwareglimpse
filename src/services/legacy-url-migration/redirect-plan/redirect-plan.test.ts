import { describe, expect, it } from "vitest";
import {
  assertNoRedirectChains,
  flattenRedirectChains,
  generateRedirectPlan,
  isAutoApprovedRedirect,
  loadLegacyRedirectsFile,
  toNextConfigRedirects,
  validateRedirectDestination,
  buildDestinationIndex,
} from "@/services/legacy-url-migration/redirect-plan";
import type { UrlMappingRow } from "@/services/legacy-url-migration/mapping-agent/types";
import { legacyRedirectsConfigPath } from "@/services/legacy-url-migration/redirect-plan/load-redirects";
import fs from "node:fs";

function row(partial: Partial<UrlMappingRow>): UrlMappingRow {
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

describe("RedirectPlanGenerator policy", () => {
  it("rejects unmapped match bases", () => {
    const d = isAutoApprovedRedirect(
      row({ confidence: "LOW", matchBasis: "unmapped", newPath: null }),
    );
    expect(d.approved).toBe(false);
  });

  it("rejects homepage dumps", () => {
    const d = isAutoApprovedRedirect(
      row({
        newPath: "/",
        matchBasis: "explicit_historical",
      }),
    );
    expect(d.approved).toBe(false);
  });

  it("approves stretch guide merges to pillar guides at launch", () => {
    const d = isAutoApprovedRedirect(
      row({
        legacyPath: "/crm-implementation-hotels/",
        newPath: "/guides/crm-implementation/",
        matchBasis: "same_guide_intent",
        legacyIntent: "guide",
      }),
    );
    expect(d.approved).toBe(true);
  });

  it("approves allowlisted what-is guide intent", () => {
    const d = isAutoApprovedRedirect(
      row({
        legacyPath: "/what-is-a-crms/",
        newPath: "/guides/what-is-crm/",
        matchBasis: "same_guide_intent",
        legacyIntent: "guide",
      }),
    );
    expect(d.approved).toBe(true);
  });

  it("approves medium-confidence product mappings", () => {
    const d = isAutoApprovedRedirect(
      row({
        legacyPath: "/benefits-of-zoho-crm/",
        newPath: "/software/zoho-crm/",
        confidence: "MEDIUM",
        matchBasis: "same_product",
      }),
    );
    expect(d.approved).toBe(true);
  });

  it("flattens redirect chains to final destination", () => {
    const { flattened, chainsFlattened } = flattenRedirectChains([
      { source: "/a/", destination: "/b/" },
      { source: "/b/", destination: "/c/" },
    ]);
    expect(chainsFlattened).toBeGreaterThan(0);
    const a = flattened.find((r) => r.source === "/a/");
    expect(a?.destination).toBe("/c/");
    expect(assertNoRedirectChains(flattened)).toEqual([]);
  });
});

describe("RedirectPlanGenerator generation", () => {
  it("generates only permanent redirects with valid destinations", () => {
    const stubIndex = {
      byPath: new Map([
        [
          "/software/pipedrive/",
          {
            path: "/software/pipedrive/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/hubspot/",
          {
            path: "/software/hubspot/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/guides/crm-implementation/",
          {
            path: "/guides/crm-implementation/",
            pageType: "guide" as const,
            indexable: true,
          },
        ],
        [
          "/features/calling/",
          {
            path: "/features/calling/",
            pageType: "feature" as const,
            indexable: true,
          },
        ],
        [
          "/features/reporting-dashboards/",
          {
            path: "/features/reporting-dashboards/",
            pageType: "feature" as const,
            indexable: true,
          },
        ],
        [
          "/industries/plumbing/",
          {
            path: "/industries/plumbing/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/solar/",
          {
            path: "/industries/solar/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/event-management/",
          {
            path: "/industries/event-management/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/private-equity/",
          {
            path: "/industries/private-equity/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/venture-capital/",
          {
            path: "/industries/venture-capital/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/photography/",
          {
            path: "/industries/photography/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/coaching/",
          {
            path: "/industries/coaching/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/investor-relations/",
          {
            path: "/industries/investor-relations/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/engineering/",
          {
            path: "/industries/engineering/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/music/",
          {
            path: "/industries/music/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/web-design/",
          {
            path: "/industries/web-design/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/security-companies/",
          {
            path: "/industries/security-companies/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/categories/crm/",
          {
            path: "/categories/crm/",
            pageType: "category" as const,
            indexable: true,
          },
        ],
        [
          "/compare/",
          {
            path: "/compare/",
            pageType: "compare_hub" as const,
            indexable: true,
          },
        ],
        [
          "/guides/what-is-crm/",
          {
            path: "/guides/what-is-crm/",
            pageType: "guide" as const,
            indexable: true,
          },
        ],
        [
          "/software/dynamics-365/",
          {
            path: "/software/dynamics-365/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/industries/nonprofit/",
          {
            path: "/industries/nonprofit/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/industries/financial-services/",
          {
            path: "/industries/financial-services/",
            pageType: "industry" as const,
            indexable: false,
          },
        ],
        [
          "/software/nimble/",
          {
            path: "/software/nimble/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/zendesk/",
          {
            path: "/software/zendesk/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/mailchimp/",
          {
            path: "/software/mailchimp/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/netsuite/",
          {
            path: "/software/netsuite/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/wealthbox/",
          {
            path: "/software/wealthbox/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/pipelinepro/",
          {
            path: "/software/pipelinepro/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/cloze/",
          {
            path: "/software/cloze/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/pega/",
          {
            path: "/software/pega/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/affinity/",
          {
            path: "/software/affinity/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/apptivo/",
          {
            path: "/software/apptivo/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/software/podio/",
          {
            path: "/software/podio/",
            pageType: "product" as const,
            indexable: true,
          },
        ],
        [
          "/compare/monday-sales-crm-vs-salesforce/",
          {
            path: "/compare/monday-sales-crm-vs-salesforce/",
            pageType: "comparison" as const,
            indexable: true,
          },
        ],
        [
          "/compare/hubspot-vs-monday-sales-crm/",
          {
            path: "/compare/hubspot-vs-monday-sales-crm/",
            pageType: "comparison" as const,
            indexable: true,
          },
        ],
        [
          "/compare/marketo-vs-salesforce/",
          {
            path: "/compare/marketo-vs-salesforce/",
            pageType: "comparison" as const,
            indexable: true,
          },
        ],
        [
          "/compare/hubspot-vs-tidio/",
          {
            path: "/compare/hubspot-vs-tidio/",
            pageType: "comparison" as const,
            indexable: true,
          },
        ],
        [
          "/compare/tidio-vs-zendesk/",
          {
            path: "/compare/tidio-vs-zendesk/",
            pageType: "comparison" as const,
            indexable: true,
          },
        ],
        [
          "/compare/hubspot-vs-mailchimp/",
          {
            path: "/compare/hubspot-vs-mailchimp/",
            pageType: "comparison" as const,
            indexable: true,
          },
        ],
      ]),
      sitemap: new Set([
        "/software/pipedrive/",
        "/software/hubspot/",
        "/guides/crm-implementation/",
        "/features/calling/",
        "/features/reporting-dashboards/",
      ]),
    };

    const plan = generateRedirectPlan({
      mappingRows: [
        row({
          legacyPath: "/pipedrive-crm-review/",
          newPath: "/software/pipedrive/",
          matchBasis: "explicit_historical",
        }),
        row({
          legacyPath: "/weak-guide/",
          newPath: "/guides/crm-implementation/",
          matchBasis: "same_guide_intent",
          confidence: "HIGH",
        }),
        row({
          legacyPath: "/medium-one/",
          newPath: "/software/hubspot/",
          confidence: "MEDIUM",
          matchBasis: "same_product",
        }),
      ],
      destinationIndex: stubIndex as ReturnType<typeof buildDestinationIndex>,
      includeReviewBacklog: false,
    });

    const sources = plan.file.redirects.map((r) => r.source);
    expect(sources).toContain("/pipedrive-crm-review/");
    expect(sources).toContain("/weak-guide/");
    expect(sources).toContain("/medium-one/");
    expect(plan.file.redirects.every((r) => r.permanent)).toBe(true);
    expect(plan.file.redirects.every((r) => r.destination !== "/")).toBe(true);
    expect(assertNoRedirectChains(plan.file.redirects)).toEqual([]);
    expect(plan.validationErrors).toEqual([]);

    for (const r of plan.file.redirects) {
      const v = validateRedirectDestination(r.destination, stubIndex as never);
      expect(v.ok).toBe(true);
    }
  });
});

describe("legacy-redirects.json wiring", () => {
  it("config file exists and expands slash variants for Next", () => {
    const configPath = legacyRedirectsConfigPath();
    expect(fs.existsSync(configPath)).toBe(true);
    const file = loadLegacyRedirectsFile(configPath);
    expect(file.redirects.length).toBeGreaterThan(0);
    expect(file.policy.onlyHighConfidence).toBe(false);
    expect(file.policy.permanentOnly).toBe(true);

    const nextRedirects = toNextConfigRedirects(file);
    // Each logical redirect should produce 2 sources (with/without slash), except duplicates
    expect(nextRedirects.length).toBeGreaterThanOrEqual(file.redirects.length);
    for (const r of nextRedirects) {
      expect(r.permanent).toBe(true);
      expect(r.destination.endsWith("/") || r.destination === "/").toBe(true);
      expect(r.destination).not.toBe("/");
      // Destination must not itself be a configured source (no chains)
      const destAsSource = r.destination.replace(/\/$/, "");
      const sources = new Set(
        nextRedirects.map((x) => x.source.replace(/\/$/, "")),
      );
      expect(sources.has(destAsSource)).toBe(false);
    }
  });
});
