import { normalizePagePath } from "../url-resolver";
import { getSiteUrl } from "@/lib/site";

/**
 * Infer page type from SoftwareGlimpse path (heuristic, not ranking science).
 */
export function inferAiVisibilityPageType(pathname: string): string {
  const p = ensureSlash(pathname);
  if (p.startsWith("/software/")) return "product-review";
  if (p.startsWith("/compare/")) return "comparison";
  if (p.startsWith("/best/")) return "best";
  if (p.startsWith("/guides/")) return "guide";
  if (p.startsWith("/industries/")) return "industry";
  if (p.startsWith("/categories/")) return "category-hub";
  if (p.startsWith("/alternatives/")) return "alternatives";
  if (p.startsWith("/pricing/")) return "pricing";
  if (p.startsWith("/tools/")) return "tool-landing";
  if (p.startsWith("/research/")) return "research";
  if (p.startsWith("/use-cases/")) return "use-case";
  if (p.startsWith("/company/")) return "company";
  return "unknown";
}

/**
 * Best-effort category from path segments / known hubs.
 */
export function inferAiVisibilityCategory(pathname: string): string | null {
  const p = ensureSlash(pathname);
  const parts = p.split("/").filter(Boolean);
  if (parts[0] === "categories" && parts[1]) return parts[1];
  if (parts[0] === "best" && parts[1]) {
    const slug = parts[1];
    if (slug.includes("crm")) return "crm";
    if (slug.includes("sales-intelligence")) return "sales-intelligence";
    if (slug.includes("customer-service")) return "customer-service";
    if (slug.includes("marketing")) return "marketing";
    return slug.replace(/-software$/, "") || null;
  }
  if (parts[0] === "tools" && parts[1]) {
    const t = parts[1];
    if (t.startsWith("crm-")) return "crm";
    if (t.startsWith("sales-intelligence-")) return "sales-intelligence";
    if (t.startsWith("customer-service-")) return "customer-service";
    return "cross-category";
  }
  if (parts[0] === "research") return "crm";
  if (parts[0] === "software") return null;
  return null;
}

export function canonicalizeCitedUrl(raw: string | null | undefined): {
  citedUrl: string | null;
  citedPath: string | null;
  isSoftwareGlimpse: boolean;
} {
  if (!raw || !String(raw).trim()) {
    return { citedUrl: null, citedPath: null, isSoftwareGlimpse: false };
  }
  const text = String(raw).trim();
  try {
    const siteHost = new URL(getSiteUrl()).hostname.replace(/^www\./, "");
    const url = new URL(text.startsWith("http") ? text : `https://${text}`);
    const host = url.hostname.replace(/^www\./, "");
    const path = ensureSlash(normalizePagePath(url.pathname));
    const isOurs =
      host === siteHost ||
      host.endsWith(`.${siteHost}`) ||
      host.includes("softwareglimpse");
    return {
      citedUrl: url.toString(),
      citedPath: isOurs ? path : null,
      isSoftwareGlimpse: isOurs,
    };
  } catch {
    if (text.startsWith("/")) {
      const path = ensureSlash(normalizePagePath(text));
      return {
        citedUrl: `${getSiteUrl().replace(/\/$/, "")}${path}`,
        citedPath: path,
        isSoftwareGlimpse: true,
      };
    }
    return { citedUrl: text, citedPath: null, isSoftwareGlimpse: false };
  }
}

function ensureSlash(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p.endsWith("/") ? p : `${p}/`;
}
