import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import robots from "@/app/robots";
import { getSitemapEntries } from "@/seo/sitemap";
import { canonicalUrl } from "@/seo/canonical";
import {
  CANONICAL_PRODUCTION_ORIGIN,
  LEGACY_LOCALE_PREFIXES,
  getLocalePrefix,
  isRetiredTaxonomyPath,
  resolveEnglishOnlyCutover,
  sitemapUrlHasProhibitedLegacyPath,
} from "@/seo/english-only-cutover";

function loadLocaleCutover(): Record<string, string> {
  const file = path.join(
    process.cwd(),
    "config",
    "legacy-locale-cutover.json",
  );
  const raw = JSON.parse(readFileSync(file, "utf8")) as {
    redirects?: Record<string, string>;
  };
  return raw.redirects ?? {};
}

describe("english-only cutover", () => {
  const cutover = loadLocaleCutover();

  it("recognizes legacy locale prefixes including hi/zh", () => {
    expect(getLocalePrefix("/fr/crm/")).toBe("fr");
    expect(getLocalePrefix("/hi/best-crm/")).toBe("hi");
    expect(getLocalePrefix("/zh/crm/")).toBe("zh");
    expect(getLocalePrefix("/categories/crm/")).toBeNull();
    expect(LEGACY_LOCALE_PREFIXES).toContain("hi");
  });

  it("301-maps hreflang cutover rows to English destinations (never /)", () => {
    const sample = Object.entries(cutover).slice(0, 20);
    expect(sample.length).toBeGreaterThan(0);
    for (const [source, dest] of sample) {
      const result = resolveEnglishOnlyCutover(source, cutover);
      expect(result.action).toBe("redirect");
      expect(result.destination).toBe(dest);
      expect(result.destination).not.toBe("/");
      expect(getLocalePrefix(result.destination!)).toBeNull();
    }
  });

  it("returns 410 for locale roots and unmapped locale URLs", () => {
    expect(resolveEnglishOnlyCutover("/fr/", cutover).action).toBe("gone");
    expect(resolveEnglishOnlyCutover("/de/", cutover).action).toBe("gone");
    expect(
      resolveEnglishOnlyCutover(
        "/fr/this-page-definitely-does-not-exist-xyz/",
        cutover,
      ).action,
    ).toBe("gone");
  });

  it("301-maps locale-410 equity repairs to genuine English pages", () => {
    const story = resolveEnglishOnlyCutover("/fr/mon-histoire/", cutover);
    expect(story.action).toBe("redirect");
    expect(story.destination).toBe("/company/my-story/");
    const zoho = resolveEnglishOnlyCutover(
      "/fr/systeme-dexploitation-zoho-one/",
      cutover,
    );
    expect(zoho.action).toBe("redirect");
    expect(zoho.destination).toBe("/software/zoho-crm/");
  });

  it("retires WP tags/feeds as 410 and authors as 404", () => {
    expect(resolveEnglishOnlyCutover("/tag/pipedrive/", cutover).action).toBe(
      "gone",
    );
    expect(resolveEnglishOnlyCutover("/feed/", cutover).action).toBe("gone");
    expect(
      resolveEnglishOnlyCutover("/comments/feed/", cutover).action,
    ).toBe("gone");
    expect(resolveEnglishOnlyCutover("/author/wpx_admin/", cutover).action).toBe(
      "not_found",
    );
    expect(isRetiredTaxonomyPath("/tag/crm/")).toMatchObject({
      retired: true,
      action: "410",
    });
  });

  it("redirects allowlisted WP categories and 410s the rest", () => {
    const crm = resolveEnglishOnlyCutover("/category/crm/", cutover);
    expect(crm.action).toBe("redirect");
    expect(crm.destination).toBe("/categories/crm/");

    const thin = resolveEnglishOnlyCutover("/category/random-thin-tag/", cutover);
    expect(thin.action).toBe("gone");
  });

  it("410s unmapped localized taxonomy; 301s when cutover maps them", () => {
    expect(
      resolveEnglishOnlyCutover("/fr/etiqueter/pipedrive/", cutover).action,
    ).toBe("gone");
    expect(
      resolveEnglishOnlyCutover("/de/schild/crm/", cutover).action,
    ).toBe("gone");
    expect(
      resolveEnglishOnlyCutover("/zh/标签/crm/", cutover).action,
    ).toBe("gone");

    const mappedCat = Object.entries(cutover).find(([src]) =>
      src.includes("/kategorie/") || src.includes("/categorie/") || src.includes("/categoria/"),
    );
    expect(mappedCat).toBeTruthy();
    if (mappedCat) {
      const [source, dest] = mappedCat;
      const result = resolveEnglishOnlyCutover(source, cutover);
      expect(result.action).toBe("redirect");
      expect(result.destination).toBe(dest);
      expect(result.destination).not.toBe("/");
    }
  });

  it("passes modern English IA paths", () => {
    expect(
      resolveEnglishOnlyCutover("/software/pipedrive/", cutover).action,
    ).toBe("pass");
    expect(resolveEnglishOnlyCutover("/guides/what-is-crm/", cutover).action).toBe(
      "pass",
    );
    expect(resolveEnglishOnlyCutover("/categories/crm/", cutover).action).toBe(
      "pass",
    );
  });
});

describe("robots.txt english-only policy", () => {
  it("declares canonical sitemap and host; does not blanket-block English hubs", () => {
    const doc = robots();
    expect(doc.sitemap).toBe(`${CANONICAL_PRODUCTION_ORIGIN}/sitemap.xml`);
    expect(doc.host).toBe(CANONICAL_PRODUCTION_ORIGIN);

    const rules = Array.isArray(doc.rules) ? doc.rules : [doc.rules];
    const disallow = new Set(
      rules.flatMap((r) => {
        const d = r?.disallow;
        if (!d) return [];
        return Array.isArray(d) ? d : [d];
      }),
    );

    expect(disallow.has("/go/")).toBe(true);
    expect(disallow.has("/search/")).toBe(true);
    expect(disallow.has("/api/")).toBe(true);
    expect(disallow.has("/dev/")).toBe(true);

    // Important English surfaces must remain crawlable via robots.txt
    for (const path of [
      "/software/",
      "/guides/",
      "/compare/",
      "/categories/",
      "/tools/",
      "/alternatives/",
    ]) {
      expect(disallow.has(path)).toBe(false);
    }

    // Locale prefixes must NOT be Disallow'd — Proxy returns 301/410 that Google must see
    for (const locale of ["fr", "de", "es", "nl", "zh", "hi", "ar"]) {
      expect(disallow.has(`/${locale}/`)).toBe(false);
    }
  });
});

describe("sitemap excludes legacy crawl surface", () => {
  it(
    "emits only canonical www HTTPS URLs with no locale/taxonomy paths",
    () => {
      const entries = getSitemapEntries();
      expect(entries.length).toBeGreaterThan(400);

      const prohibited: string[] = [];
      for (const entry of entries) {
        expect(entry.url.startsWith(CANONICAL_PRODUCTION_ORIGIN)).toBe(true);
        expect(entry.url.startsWith("http://")).toBe(false);
        expect(entry.url.includes("localhost")).toBe(false);
        expect(entry.url.includes("vercel.app")).toBe(false);
        if (sitemapUrlHasProhibitedLegacyPath(entry.url)) {
          prohibited.push(entry.url);
        }
      }
      expect(prohibited).toEqual([]);

      // Spot-check important English hubs remain present when indexable
      const urls = new Set(entries.map((e) => e.url));
      expect(urls.has(canonicalUrl("/"))).toBe(true);
      expect(urls.has(canonicalUrl("/software/"))).toBe(true);
      expect(urls.has(canonicalUrl("/categories/"))).toBe(true);
      expect(urls.has(canonicalUrl("/tools/"))).toBe(true);
      expect(urls.has(canonicalUrl("/guides/"))).toBe(true);
      expect(urls.has(canonicalUrl("/compare/"))).toBe(true);
    },
    20_000,
  );
});
