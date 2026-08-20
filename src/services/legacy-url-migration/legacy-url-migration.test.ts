import { describe, expect, it } from "vitest";
import {
  classifyLegacyPath,
  matchLegacyToNew,
  normalizeMigrationPath,
  normalizeMigrationUrl,
} from "@/services/legacy-url-migration";
import type { NewUrlInventoryRow } from "@/services/legacy-url-migration";

describe("legacy-url-migration normalize", () => {
  it("normalizes protocol, www, trailing slash, case, and tracking params", () => {
    expect(
      normalizeMigrationUrl(
        "HTTP://SoftwareGlimpse.com/Pipedrive-CRM-Review?utm_source=x#frag",
      ),
    ).toBe("https://www.softwareglimpse.com/pipedrive-crm-review/");
    expect(normalizeMigrationPath("/Software/Pipedrive")).toBe(
      "/software/pipedrive/",
    );
  });

  it("does not collapse distinct routes", () => {
    expect(normalizeMigrationPath("/hubspot-vs-monday/")).not.toBe(
      normalizeMigrationPath("/hubspot-vs-monday-2/"),
    );
  });
});

describe("legacy-url-migration classify + match", () => {
  const inventory: NewUrlInventoryRow[] = [
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
    {
      url: "https://www.softwareglimpse.com/compare/hubspot-vs-pipedrive/",
      path: "/compare/hubspot-vs-pipedrive/",
      routeType: "dynamic",
      pageType: "comparison",
      title: "HubSpot vs Pipedrive",
      canonical: "https://www.softwareglimpse.com/compare/hubspot-vs-pipedrive/",
      indexable: true,
      publicationState: "published",
      inSitemap: true,
    },
    {
      url: "https://www.softwareglimpse.com/best/crm-software/",
      path: "/best/crm-software/",
      routeType: "dynamic",
      pageType: "best",
      title: "Best CRM",
      canonical: "https://www.softwareglimpse.com/best/crm-software/",
      indexable: true,
      publicationState: "published",
      inSitemap: true,
    },
  ];

  it("classifies legacy page types", () => {
    expect(classifyLegacyPath("/pipedrive-crm-review/")).toBe("product_review");
    expect(classifyLegacyPath("/pipedrive-vs-hubspot/")).toBe("comparison");
    expect(classifyLegacyPath("/best-crms/")).toBe("best_list");
    expect(classifyLegacyPath("/category/crm/")).toBe("wp_category");
  });

  it("maps review and compare aliases", () => {
    const home = matchLegacyToNew("/", inventory);
    expect(home.relationship).toBe("EXACT");
    expect(home.recommendedAction).toBe("KEEP");

    const review = matchLegacyToNew("/pipedrive-crm-review/", inventory);
    expect(review.relationship).toBe("EQUIVALENT");
    expect(review.newPath).toBe("/software/pipedrive/");
    expect(review.recommendedAction).toBe("301_REDIRECT");

    const compare = matchLegacyToNew("/pipedrive-vs-hubspot/", inventory);
    expect(compare.newPath).toBe("/compare/hubspot-vs-pipedrive/");

    const best = matchLegacyToNew("/best-crms/", inventory);
    expect(best.newPath).toBe("/best/crm-software/");
    expect(best.recommendedAction).toBe("MERGE_AND_301");
  });
});
