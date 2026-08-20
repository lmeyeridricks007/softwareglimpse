/**
 * Affiliate destination URL validation.
 * Never accept arbitrary user-supplied redirect targets.
 */

const BLOCKED_HOST_SUFFIXES = [
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
];

export type UrlValidationResult =
  | { ok: true; url: string; host: string }
  | { ok: false; code: string; message: string };

export function validateAffiliateUrl(raw: string): UrlValidationResult {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return {
      ok: false,
      code: "MALFORMED_URL",
      message: "URL syntax is invalid",
    };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return {
      ok: false,
      code: "INVALID_PROTOCOL",
      message: "Only http(s) affiliate destinations are allowed",
    };
  }

  if (parsed.protocol === "http:" && process.env.NODE_ENV === "production") {
    return {
      ok: false,
      code: "INSECURE_PROTOCOL",
      message: "Production affiliate destinations must use https",
    };
  }

  const host = parsed.hostname.toLowerCase();
  if (!host || host.includes(" ")) {
    return {
      ok: false,
      code: "INVALID_HOST",
      message: "Host is missing or invalid",
    };
  }

  if (
    BLOCKED_HOST_SUFFIXES.some(
      (blocked) => host === blocked || host.endsWith(`.${blocked}`),
    )
  ) {
    return {
      ok: false,
      code: "BLOCKED_HOST",
      message: "Local/private hosts are not allowed as affiliate destinations",
    };
  }

  // Preserve tracking query params — do not strip.
  return { ok: true, url: parsed.toString(), host };
}

/** Patterns that look like affiliate network click URLs in prose. */
export const RAW_AFFILIATE_URL_PATTERNS: RegExp[] = [
  /https?:\/\/[^\s"'<>]*(shareasale|impact\.com|partnerstack|awin1|cj\.com|anrdoezrs|dpbolvw)[^\s"'<>]*/i,
  /https?:\/\/[^\s"'<>]*\/(?:click|aff|affiliate|track)[^\s"'<>]*/i,
];

export function findRawAffiliateUrls(text: string): string[] {
  const found: string[] = [];
  for (const pattern of RAW_AFFILIATE_URL_PATTERNS) {
    const matches = text.match(new RegExp(pattern.source, "gi"));
    if (matches) found.push(...matches);
  }
  return [...new Set(found)];
}
