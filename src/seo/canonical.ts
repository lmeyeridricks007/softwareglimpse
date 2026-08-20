import { getSiteUrl, SITE_NAME } from "@/lib/site";

/**
 * Canonical URL policy (SoftwareGlimpse):
 * - Absolute https URLs on the configured host (default www.softwareglimpse.com)
 * - Leading slash required; trailing slash required (except bare origin root → `/`)
 * - Lowercase pathnames
 * - Query strings and hashes stripped for canonicals (facets use self-canonical hub paths)
 * - Known path aliases rewritten to their final public path
 */

export type ResolveCanonicalOptions = {
  /** When true, preserve select query keys (none today — reserved). */
  preserveQueryKeys?: string[];
  /** Raw search string including `?`, or URLSearchParams. Ignored by default. */
  search?: string | URLSearchParams;
};

/** Legacy / alternate paths → current canonical pathname (with trailing slash). */
const PATH_ALIASES: Record<string, string> = {
  "/features/call-functionality": "/features/calling/",
  "/features/call-functionality/": "/features/calling/",
  "/features/reporting": "/features/reporting-dashboards/",
  "/features/reporting/": "/features/reporting-dashboards/",
};

/** Ensure a path starts with `/` and ends with `/` (except root). */
export function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  let pathname = path.trim();
  try {
    if (/^https?:\/\//i.test(pathname)) {
      pathname = new URL(pathname).pathname;
    }
  } catch {
    // keep raw
  }
  // Drop query/hash if a caller passed them inline
  pathname = pathname.split("?")[0]?.split("#")[0] ?? pathname;
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  // Collapse duplicate slashes (except protocol — already stripped)
  pathname = pathname.replace(/\/{2,}/g, "/");
  pathname = pathname.toLowerCase();
  if (pathname !== "/" && !pathname.endsWith("/")) {
    pathname = `${pathname}/`;
  }
  const aliased = PATH_ALIASES[pathname] ?? PATH_ALIASES[pathname.replace(/\/$/, "")];
  if (aliased) return normalizePath(aliased);
  return pathname === "" ? "/" : pathname;
}

export function resolveCanonicalPath(
  path: string,
  _options: ResolveCanonicalOptions = {},
): string {
  return normalizePath(path);
}

/** Absolute canonical URL for metadata, sitemap, and JSON-LD. */
export function canonicalUrl(
  path: string,
  options: ResolveCanonicalOptions = {},
): string {
  const base = getSiteUrl().replace(/\/$/, "");
  const normalized = resolveCanonicalPath(path, options);
  if (normalized === "/") return `${base}/`;
  return `${base}${normalized}`;
}

export function absoluteUrl(path: string): string {
  return canonicalUrl(path);
}

/** Strip a trailing ` | SoftwareGlimpse` (any casing) so the root title template owns branding. */
export function stripSiteNameSuffix(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return trimmed;
  if (trimmed === SITE_NAME) return SITE_NAME;
  const suffix = new RegExp(`\\s*[\\|\\-–—]\\s*${escapeRegExp(SITE_NAME)}\\s*$`, "i");
  const once = trimmed.replace(suffix, "").trim();
  // Avoid emptying the title
  return once || trimmed;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Default Open Graph / Twitter share image (static asset — no runtime generation). */
export function defaultOgImagePath(): string {
  return "/og/default.png";
}

/** Absolute OG image URL — must NOT use trailing-slash page canonicalization. */
export function defaultOgImageUrl(): string {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}${defaultOgImagePath()}`;
}
