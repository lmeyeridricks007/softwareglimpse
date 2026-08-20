import { describe, expect, it } from "vitest";
import {
  __resetSearchIndexCache,
  buildSearchIndex,
  runSearch,
  suggestSearch,
} from "@/services/search";
import { SEARCH_RELEVANCE_FIXTURES } from "@/services/search/fixtures";

describe("search index", () => {
  it("indexes published ecosystem types without drafts-only leakage markers", () => {
    __resetSearchIndexCache();
    const index = buildSearchIndex({ force: true });
    expect(index.length).toBeGreaterThan(50);
    const types = new Set(index.map((d) => d.type));
    expect(types.has("SOFTWARE")).toBe(true);
    expect(types.has("COMPARISON")).toBe(true);
    expect(types.has("GUIDE")).toBe(true);
    expect(types.has("TOOL")).toBe(true);
    expect(types.has("RESOURCE")).toBe(true);
    expect(types.has("FEATURE")).toBe(true);
    expect(index.every((d) => d.published)).toBe(true);
    expect(index.every((d) => d.canonicalUrl.startsWith("/"))).toBe(true);
    expect(index.every((d) => !d.canonicalUrl.startsWith("/go/"))).toBe(true);
    expect(index.every((d) => !d.canonicalUrl.startsWith("/api/"))).toBe(true);
  });
});

describe("search relevance fixtures", () => {
  for (const fixture of SEARCH_RELEVANCE_FIXTURES) {
    it(`${fixture.name}: "${fixture.query}"`, () => {
      const result = runSearch({ query: fixture.query });
      if (fixture.expectZero) {
        expect(result.total).toBe(0);
        return;
      }
      expect(result.total).toBeGreaterThan(0);
      const top = result.featured ?? result.hits[0];
      expect(top).toBeTruthy();
      if (fixture.expectType) {
        expect(top!.document.type).toBe(fixture.expectType);
      }
      if (fixture.expectTitleIncludes) {
        expect(
          top!.document.title
            .toLowerCase()
            .includes(fixture.expectTitleIncludes.toLowerCase()),
        ).toBe(true);
      }
      if (fixture.expectSlug) {
        expect(top!.document.slug).toBe(fixture.expectSlug);
      }
    });
  }
});

describe("search performance", () => {
  it("loads precompiled index quickly when artifact exists", () => {
    __resetSearchIndexCache();
    const started = performance.now();
    const index = buildSearchIndex();
    const elapsedMs = performance.now() - started;
    expect(index.length).toBeGreaterThan(1000);
    expect(elapsedMs).toBeLessThan(500);
  });
});

describe("search autocomplete", () => {
  it("returns compact typed suggestions for piped", () => {
    const result = suggestSearch("piped");
    expect(result.suggestions.length).toBeGreaterThan(0);
    expect(result.suggestions.length).toBeLessThanOrEqual(8);
    expect(result.suggestions[0]?.title.toLowerCase()).toContain("pipedrive");
    expect(result.seeAllHref).toContain("piped");
  });
});

describe("search SEO policy helpers", () => {
  it("does not invent popularity analytics in response", () => {
    const result = runSearch({ query: "pipedrive" });
    expect(result.relatedSearches.length).toBeGreaterThan(0);
    // Related searches are curated templates, not fabricated click counts.
    expect(result.relatedSearches.every((s) => typeof s === "string")).toBe(
      true,
    );
  });
});
