/**
 * English-only cutover for WordPress-era locale + taxonomy crawl debt.
 *
 * SoftwareGlimpse serves English IA only. Legacy `/fr|de|es|…` URLs and WP
 * taxonomy archives must either 301 to a genuine English equivalent or return
 * 410/404 — never dump to the homepage.
 *
 * Runtime enforcement: `src/proxy.ts` (Next.js 16 Proxy).
 * Config source for mapped 301s: `config/legacy-locale-cutover.json`.
 */

export const LEGACY_LOCALE_PREFIXES = [
  "fr",
  "de",
  "es",
  "nl",
  "zh",
  "hi",
  "ar",
  "pt",
  "it",
  "ja",
] as const;

export type LegacyLocalePrefix = (typeof LEGACY_LOCALE_PREFIXES)[number];

const LOCALE_SET = new Set<string>(LEGACY_LOCALE_PREFIXES);

/** Canonical production host used in robots/sitemap declarations. */
export const CANONICAL_PRODUCTION_ORIGIN = "https://www.softwareglimpse.com";

/**
 * Exact WP `/category/…` → modern IA maps (also in config/legacy-redirects.json).
 * Unmapped `/category/…` archives are 410 — never homepage.
 */
export const WP_CATEGORY_REDIRECTS: Readonly<Record<string, string>> = {
  "/category/best-crms/": "/best/crm-software/",
  "/category/crm-comparisons/": "/compare/",
  "/category/crm-engineering/": "/industries/engineering/",
  "/category/crm-event-management/": "/industries/event-management/",
  "/category/crm-guides/": "/guides/",
  "/category/crm-music/": "/industries/music/",
  "/category/crm-plumbing/": "/industries/plumbing/",
  "/category/crm-private-equity/": "/industries/private-equity/",
  "/category/crm-real-estate/": "/industries/real-estate/",
  "/category/crm-solar/": "/industries/solar/",
  "/category/crm-venture-capital/": "/industries/venture-capital/",
  "/category/crm/": "/categories/crm/",
  "/category/guides/": "/guides/",
  "/category/software-comparison/": "/compare/",
};

/** Path prefixes that must never appear in the XML sitemap. */
export const SITEMAP_PROHIBITED_PREFIXES = [
  "/fr/",
  "/de/",
  "/es/",
  "/nl/",
  "/zh/",
  "/hi/",
  "/ar/",
  "/pt/",
  "/it/",
  "/ja/",
  "/tag/",
  "/category/",
  "/author/",
  "/feed/",
  "/comments/feed/",
  "/etiqueter/",
  "/etiqueta/",
  "/schild/",
] as const;

export type CutoverAction = "redirect" | "gone" | "not_found" | "pass";

export type EnglishOnlyCutoverResult = {
  action: CutoverAction;
  /** Present when action === "redirect". Always an English path, never `/`. */
  destination?: string;
  reason: string;
};

export type RetiredTaxonomyResult = {
  retired: boolean;
  action?: "410" | "404";
  pattern?: string;
};

/** Ensure leading + trailing slash (except bare `/`). */
export function ensureCutoverPath(path: string): string {
  if (!path || path === "/") return "/";
  let pathname = path.trim();
  try {
    if (/^https?:\/\//i.test(pathname)) {
      pathname = new URL(pathname).pathname;
    }
  } catch {
    // keep raw
  }
  pathname = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname !== "/" && !pathname.endsWith("/")) {
    pathname = `${pathname}/`;
  }
  return pathname === "" ? "/" : pathname;
}

function decodeSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function encodeSegment(seg: string): string {
  return encodeURIComponent(decodeSafe(seg));
}

/** Lookup keys covering encoded + decoded path variants. */
export function cutoverLookupKeys(path: string): string[] {
  const normalized = ensureCutoverPath(path);
  const keys = new Set<string>([normalized]);

  const decoded = ensureCutoverPath(decodeSafe(normalized));
  keys.add(decoded);

  const segs = normalized.split("/").filter(Boolean);
  if (segs.length > 0) {
    keys.add(`/${segs.map(encodeSegment).join("/")}/`);
    keys.add(`/${segs.map(decodeSafe).join("/")}/`);
  }

  return [...keys];
}

export function getLocalePrefix(path: string): LegacyLocalePrefix | null {
  const normalized = ensureCutoverPath(path);
  const first = normalized.split("/").filter(Boolean)[0];
  if (!first) return null;
  const lower = first.toLowerCase();
  if (LOCALE_SET.has(lower)) return lower as LegacyLocalePrefix;
  return null;
}

export function isLegacyLocalePath(path: string): boolean {
  return getLocalePrefix(path) !== null;
}

/**
 * WP taxonomy / feed / author surfaces (EN + localized segment names).
 * Locale-prefixed taxonomy is also caught by the locale catch-all when unmapped.
 */
export function isRetiredTaxonomyPath(path: string): RetiredTaxonomyResult {
  const p = ensureCutoverPath(path);
  const segs = p.split("/").filter(Boolean);
  if (segs.length === 0) return { retired: false };

  const first = segs[0]!.toLowerCase();
  const second = segs[1]?.toLowerCase();

  if (first === "tag") {
    return { retired: true, action: "410", pattern: "/tag/:slug*" };
  }
  if (first === "author") {
    return { retired: true, action: "404", pattern: "/author/:slug*" };
  }
  if (first === "feed" || (first === "comments" && second === "feed")) {
    return {
      retired: true,
      action: "410",
      pattern: first === "feed" ? "/feed" : "/comments/feed",
    };
  }
  if (first === "category") {
    const mapped = lookupMap(p, WP_CATEGORY_REDIRECTS);
    if (mapped) return { retired: false };
    return { retired: true, action: "410", pattern: "/category/:slug*" };
  }

  // Locale-prefixed taxonomy (etiqueter, kategorie, 标签, …) is NOT marked
  // retired here — `resolveEnglishOnlyCutover` applies hreflang 301s first,
  // then 410 for unmapped leftovers.

  return { retired: false };
}

function lookupMap(
  path: string,
  map: Record<string, string>,
): string | undefined {
  for (const key of cutoverLookupKeys(path)) {
    const hit = map[key] ?? map[ensureCutoverPath(key)];
    if (hit) return ensureCutoverPath(hit);
  }
  return undefined;
}

function safeRedirectResult(
  destination: string,
  reason: string,
): EnglishOnlyCutoverResult {
  const dest = ensureCutoverPath(destination);
  if (dest === "/" || getLocalePrefix(dest)) {
    return {
      action: "gone",
      reason: "Rejected unsafe cutover destination (homepage or locale)",
    };
  }
  return { action: "redirect", destination: dest, reason };
}

/**
 * Resolve how a legacy crawl URL should be treated under English-only policy.
 * Never returns a homepage dump destination.
 *
 * Order matters: hreflang-mapped locale URLs (including localized category
 * archives) must 301 before generic taxonomy-410 rules apply.
 */
export function resolveEnglishOnlyCutover(
  inputPath: string,
  localeRedirects: Record<string, string> = {},
): EnglishOnlyCutoverResult {
  const path = ensureCutoverPath(inputPath);

  // Exact EN WP category passthrough (modern IA equivalent)
  const categoryHit = lookupMap(path, WP_CATEGORY_REDIRECTS);
  if (categoryHit) {
    return safeRedirectResult(
      categoryHit,
      "WP category → modern IA equivalent",
    );
  }

  const locale = getLocalePrefix(path);
  if (locale) {
    const segs = path.split("/").filter(Boolean);
    // Locale root → 410 (no homepage dump)
    if (segs.length === 1) {
      return {
        action: "gone",
        reason: `Locale root /${locale}/ — English-only; no homepage dump`,
      };
    }

    // Prefer explicit hreflang map (may include localized /categorie/ etc.)
    const mapped = lookupMap(path, localeRedirects);
    if (mapped) {
      return safeRedirectResult(
        mapped,
        "hreflang-mapped locale → English canonical",
      );
    }

    // Unmapped localized taxonomy under a locale prefix
    const tax = isRetiredTaxonomyPath(path);
    if (tax.retired) {
      if (tax.action === "404") {
        return {
          action: "not_found",
          reason: tax.pattern
            ? `Retired taxonomy (${tax.pattern})`
            : "Retired author archive",
        };
      }
      return {
        action: "gone",
        reason: tax.pattern
          ? `Retired taxonomy (${tax.pattern})`
          : "Retired taxonomy archive",
      };
    }

    return {
      action: "gone",
      reason: `Unmapped locale URL /${locale}/… — no English equivalent`,
    };
  }

  // EN WP taxonomy / feeds / authors
  const tax = isRetiredTaxonomyPath(path);
  if (tax.retired) {
    if (tax.action === "404") {
      return {
        action: "not_found",
        reason: tax.pattern
          ? `Retired taxonomy (${tax.pattern})`
          : "Retired author archive",
      };
    }
    return {
      action: "gone",
      reason: tax.pattern
        ? `Retired taxonomy (${tax.pattern})`
        : "Retired taxonomy archive",
    };
  }

  return { action: "pass", reason: "Not a legacy locale/taxonomy path" };
}

/** True when a sitemap loc is prohibited legacy crawl surface. */
export function sitemapUrlHasProhibitedLegacyPath(url: string): boolean {
  let pathname = url;
  try {
    pathname = new URL(url).pathname;
  } catch {
    // treat as path
  }
  const path = ensureCutoverPath(pathname);
  if (isLegacyLocalePath(path)) return true;
  if (path.startsWith("/tag/")) return true;
  if (path.startsWith("/category/")) return true;
  if (path.startsWith("/author/")) return true;
  if (path === "/feed/" || path.startsWith("/feed/")) return true;
  if (path.startsWith("/comments/feed/")) return true;
  return false;
}
