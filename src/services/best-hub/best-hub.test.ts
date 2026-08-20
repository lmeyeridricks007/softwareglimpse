import { describe, expect, it } from "vitest";
import {
  buildBestHubModel,
  getFeaturedBestPages,
  getPopularComparisonsForBestHub,
  getPublishedBestPages,
  getRecentlyUpdatedBestPages,
} from "@/services/best-hub";
import { isInternalEditorialCopy } from "@/services/category-hub/public-copy";

describe("best hub", () => {
  it("lists only publicly available Best pages", () => {
    const pages = getPublishedBestPages();
    expect(pages.length).toBeGreaterThanOrEqual(1);
    expect(pages.every((p) => p.metadata.status === "published")).toBe(true);
  });

  it("features the most mature published Best page without hardcoding CRM", () => {
    const featured = getFeaturedBestPages(1);
    expect(featured).toHaveLength(1);
    expect(featured[0]!.slug).toBeTruthy();
  });

  it("builds a hub model with public-safe copy and no editorial labels", () => {
    const model = buildBestHubModel();
    expect(model.featured).not.toBeNull();
    expect(model.featured!.buyingContext).toBeTruthy();
    expect(isInternalEditorialCopy(model.featured!.buyingContext)).toBe(false);

    const blob = JSON.stringify(model);
    expect(blob).not.toMatch(/provisional/i);
    expect(blob).not.toMatch(/research in progress/i);
    expect(blob).not.toMatch(/noindex until/i);
    expect(blob).not.toMatch(/not approved/i);
    expect(blob).not.toMatch(/candidate recommendations/i);
  });

  it("does not invent approved Best-for claims", () => {
    const model = buildBestHubModel();
    // Seed recommendations are all approved:false today
    expect(model.approvedBestFor).toEqual([]);
  });

  it("exposes CRM Finder when that tool is the live personalization path", () => {
    const model = buildBestHubModel();
    expect(model.finder.exists).toBe(true);
    expect(model.finder.href).toBe("/tools/crm-finder/");
    expect(model.finder.label).toBe("Find My CRM");
    expect(model.tools.some((t) => t.id === "crm-finder")).toBe(true);
    expect(model.tools.some((t) => t.id === "crm-cost")).toBe(true);
  });

  it("only includes publicly published comparisons", () => {
    // Seed comparisons are researching / not public — hub must not invent a grid
    expect(getPopularComparisonsForBestHub()).toEqual([]);
    expect(buildBestHubModel().comparisons).toEqual([]);
  });

  it("surfaces recently updated Best pages with safe change labels", () => {
    const recent = getRecentlyUpdatedBestPages(3);
    expect(recent.length).toBeGreaterThan(0);
    const model = buildBestHubModel();
    expect(model.recentUpdates.length).toBeGreaterThan(0);
    expect(
      model.recentUpdates.every((u) => u.changeLabel === "Research updated"),
    ).toBe(true);
  });

  it("builds need and decision paths from real category taxonomy", () => {
    const model = buildBestHubModel();
    expect(model.needs.length).toBeGreaterThan(0);
    expect(model.decisionPaths.length).toBeGreaterThan(0);
    expect(model.filterCategories.some((c) => c.slug === "crm")).toBe(true);
  });
});
