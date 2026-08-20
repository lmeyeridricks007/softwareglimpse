/**
 * URL normalization for legacy ↔ new comparison.
 * Does NOT collapse semantically distinct routes.
 */

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "gclid",
  "fbclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "_ga",
  "ref",
]);

export type NormalizeUrlOptions = {
  /** Default host used when input is path-only. */
  defaultHost?: string;
  stripTrackingParams?: boolean;
};

/**
 * Normalize a URL or path for equality comparison:
 * - https
 * - www host (configurable via defaultHost)
 * - lowercase path
 * - trailing slash (except bare origin root → `/`)
 * - drop fragment
 * - strip common tracking query params (keeps other query keys)
 */
export function normalizeMigrationUrl(
  input: string,
  options: NormalizeUrlOptions = {},
): string {
  const host = (options.defaultHost ?? "www.softwareglimpse.com").replace(
    /^https?:\/\//i,
    "",
  );
  const stripTracking = options.stripTrackingParams !== false;

  let raw = input.trim();
  if (!raw) return `https://${host}/`;

  if (!/^https?:\/\//i.test(raw)) {
    raw = raw.startsWith("/")
      ? `https://${host}${raw}`
      : `https://${host}/${raw}`;
  }

  const url = new URL(raw);
  url.protocol = "https:";
  // Collapse non-www / apex to www for comparison (production policy).
  const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  url.hostname = hostname === host.replace(/^www\./, "") ? host : `www.${hostname}`;

  let pathname = decodeURIComponent(url.pathname || "/").toLowerCase();
  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname !== "/" && !pathname.endsWith("/")) {
    pathname = `${pathname}/`;
  }
  url.pathname = pathname;
  url.hash = "";

  if (stripTracking && url.search) {
    const kept = new URLSearchParams();
    for (const [k, v] of url.searchParams.entries()) {
      if (!TRACKING_PARAMS.has(k.toLowerCase())) {
        kept.append(k, v);
      }
    }
    url.search = kept.toString() ? `?${kept.toString()}` : "";
  }

  return url.toString();
}

/** Pathname only (with trailing slash policy). */
export function normalizeMigrationPath(input: string): string {
  const absolute = normalizeMigrationUrl(input);
  return new URL(absolute).pathname;
}
