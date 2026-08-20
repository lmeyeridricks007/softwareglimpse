/**
 * Live HTML/HTTP probes for SEO audit agents when BASE_URL is set.
 * ANALYZE only — never mutates production.
 */
import { JSDOM } from "jsdom";
import { normalizePath } from "@/seo/canonical";
import { isPathIndexable } from "@/services/internal-linking/eligibility";
import { REPRESENTATIVE_ROUTES } from "@/performance/budgets";
import type { SeoAuditMode, SeoFixtureMedia, SeoFixturePage } from "./types";

export type LiveProbeImage = {
  src: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  className?: string;
};

export type LiveProbeEmbed = {
  src: string;
  tag: string;
};

export type LiveProbePage = {
  path: string;
  requestUrl: string;
  finalUrl: string;
  statusCode: number;
  redirectChain: string[];
  title?: string;
  robots?: string;
  canonical?: string;
  h1Count: number;
  jsonLd: unknown[];
  images: LiveProbeImage[];
  embeds: LiveProbeEmbed[];
  internalLinks: string[];
  htmlBytes: number;
  ttfbMs: number;
  error?: string;
};

export type LiveProbeBundle = {
  baseUrl: string;
  pages: LiveProbePage[];
  fetchedAt: string;
};

const UA = "SoftwareGlimpse-seo-audit/1.0 (+local BASE_URL probe)";

function stripTrailingSlash(base: string): string {
  return base.replace(/\/$/, "");
}

function absoluteUrl(baseUrl: string, path: string): string {
  return `${stripTrailingSlash(baseUrl)}${normalizePath(path)}`;
}

function parseMetaRobots(doc: Document): string | undefined {
  const nodes = [
    ...doc.querySelectorAll('meta[name="robots"], meta[name="googlebot"]'),
  ];
  const parts = nodes
    .map((n) => n.getAttribute("content")?.trim())
    .filter(Boolean) as string[];
  return parts.length ? parts.join(", ") : undefined;
}

function parseJsonLd(doc: Document): unknown[] {
  const blocks: unknown[] = [];
  for (const el of doc.querySelectorAll('script[type="application/ld+json"]')) {
    const raw = el.textContent?.trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) blocks.push(...parsed);
      else if (parsed && typeof parsed === "object" && "@graph" in parsed) {
        const graph = (parsed as Record<string, unknown>)["@graph"];
        if (Array.isArray(graph)) blocks.push(...graph);
        else blocks.push(parsed);
      } else {
        blocks.push(parsed);
      }
    } catch {
      blocks.push({ __parseError: true, raw: raw.slice(0, 120) });
    }
  }
  return blocks;
}

function parseImages(doc: Document): LiveProbeImage[] {
  const out: LiveProbeImage[] = [];
  for (const img of doc.querySelectorAll("img")) {
    const src =
      img.getAttribute("src") ||
      img.getAttribute("data-src") ||
      img.getAttribute("srcset")?.split(/\s+/)[0] ||
      "";
    if (!src || src.startsWith("data:")) continue;
    const w = img.getAttribute("width");
    const h = img.getAttribute("height");
    out.push({
      src,
      alt: img.hasAttribute("alt") ? img.getAttribute("alt") : null,
      width: w != null && w !== "" ? Number(w) || null : null,
      height: h != null && h !== "" ? Number(h) || null : null,
      className: img.getAttribute("class") || undefined,
    });
  }
  return out;
}

function parseEmbeds(doc: Document): LiveProbeEmbed[] {
  const out: LiveProbeEmbed[] = [];
  for (const el of doc.querySelectorAll("iframe[src], embed[src], video source[src]")) {
    const src = el.getAttribute("src");
    if (!src) continue;
    out.push({ src, tag: el.tagName.toLowerCase() });
  }
  return out;
}

function parseInternalLinks(doc: Document, baseUrl: string): string[] {
  const host = new URL(baseUrl).host;
  const links = new Set<string>();
  for (const a of doc.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      continue;
    }
    try {
      const u = new URL(href, baseUrl);
      if (u.host !== host) continue;
      links.add(normalizePath(u.pathname));
    } catch {
      /* ignore */
    }
  }
  return [...links];
}

async function fetchWithRedirects(
  startUrl: string,
  maxHops = 5,
): Promise<{
  statusCode: number;
  finalUrl: string;
  redirectChain: string[];
  html: string;
  ttfbMs: number;
  htmlBytes: number;
}> {
  const redirectChain: string[] = [];
  let url = startUrl;
  let ttfbMs = 0;
  for (let hop = 0; hop <= maxHops; hop++) {
    const started = performance.now();
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { Accept: "text/html", "User-Agent": UA },
    });
    if (hop === 0) ttfbMs = performance.now() - started;

    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) {
        return {
          statusCode: res.status,
          finalUrl: url,
          redirectChain,
          html: "",
          ttfbMs,
          htmlBytes: 0,
        };
      }
      redirectChain.push(`${res.status}→${loc}`);
      url = new URL(loc, url).toString();
      continue;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    return {
      statusCode: res.status,
      finalUrl: url,
      redirectChain,
      html: buf.toString("utf8"),
      ttfbMs,
      htmlBytes: buf.byteLength,
    };
  }
  return {
    statusCode: 0,
    finalUrl: url,
    redirectChain,
    html: "",
    ttfbMs,
    htmlBytes: 0,
  };
}

function parseHtmlPage(
  path: string,
  requestUrl: string,
  fetched: Awaited<ReturnType<typeof fetchWithRedirects>>,
  baseUrl: string,
): LiveProbePage {
  if (!fetched.html) {
    return {
      path,
      requestUrl,
      finalUrl: fetched.finalUrl,
      statusCode: fetched.statusCode,
      redirectChain: fetched.redirectChain,
      h1Count: 0,
      jsonLd: [],
      images: [],
      embeds: [],
      internalLinks: [],
      htmlBytes: fetched.htmlBytes,
      ttfbMs: Math.round(fetched.ttfbMs),
      error: fetched.statusCode === 0 ? "redirect loop / empty" : undefined,
    };
  }

  const dom = new JSDOM(fetched.html);
  const doc = dom.window.document;
  return {
    path,
    requestUrl,
    finalUrl: fetched.finalUrl,
    statusCode: fetched.statusCode,
    redirectChain: fetched.redirectChain,
    title: doc.querySelector("title")?.textContent?.trim() || undefined,
    robots: parseMetaRobots(doc),
    canonical:
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ||
      undefined,
    h1Count: doc.querySelectorAll("h1").length,
    jsonLd: parseJsonLd(doc),
    images: parseImages(doc),
    embeds: parseEmbeds(doc),
    internalLinks: parseInternalLinks(doc, baseUrl),
    htmlBytes: fetched.htmlBytes,
    ttfbMs: Math.round(fetched.ttfbMs),
  };
}

export function probePathsForMode(mode: SeoAuditMode): string[] {
  const routes =
    mode === "FAST" ? REPRESENTATIVE_ROUTES.slice(0, 8) : REPRESENTATIVE_ROUTES;
  return routes.map((r) => normalizePath(r.path));
}

export async function fetchLiveProbeBundle(input: {
  baseUrl: string;
  mode: SeoAuditMode;
  paths?: string[];
  concurrency?: number;
}): Promise<LiveProbeBundle> {
  const baseUrl = stripTrailingSlash(input.baseUrl);
  const paths = input.paths ?? probePathsForMode(input.mode);
  const concurrency = input.concurrency ?? 4;
  const pages: LiveProbePage[] = [];

  for (let i = 0; i < paths.length; i += concurrency) {
    const batch = paths.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (path) => {
        const requestUrl = absoluteUrl(baseUrl, path);
        try {
          const fetched = await fetchWithRedirects(requestUrl);
          return parseHtmlPage(path, requestUrl, fetched, baseUrl);
        } catch (err) {
          return {
            path,
            requestUrl,
            finalUrl: requestUrl,
            statusCode: 0,
            redirectChain: [],
            h1Count: 0,
            jsonLd: [],
            images: [],
            embeds: [],
            internalLinks: [],
            htmlBytes: 0,
            ttfbMs: -1,
            error: err instanceof Error ? err.message : String(err),
          } satisfies LiveProbePage;
        }
      }),
    );
    pages.push(...results);
  }

  return { baseUrl, pages, fetchedAt: new Date().toISOString() };
}

/** Shared cache on agent context so agents do not re-fetch the same routes. */
const bundleCache = new WeakMap<object, Promise<LiveProbeBundle>>();

export async function ensureLiveProbeBundle(ctx: {
  baseUrl?: string;
  mode: SeoAuditMode;
  liveProbe?: LiveProbeBundle;
  _liveProbePromise?: Promise<LiveProbeBundle>;
}): Promise<LiveProbeBundle | undefined> {
  if (!ctx.baseUrl) return undefined;
  if (ctx.liveProbe) return ctx.liveProbe;
  if (!ctx._liveProbePromise) {
    ctx._liveProbePromise = fetchLiveProbeBundle({
      baseUrl: ctx.baseUrl,
      mode: ctx.mode,
    });
  }
  const bundle = await ctx._liveProbePromise;
  ctx.liveProbe = bundle;
  return bundle;
}

export function livePageToFixture(page: LiveProbePage): SeoFixturePage {
  const robots = page.robots?.toLowerCase() ?? "";
  const noindex = /noindex/.test(robots);
  return {
    path: page.path,
    statusCode: page.statusCode,
    indexable: page.error ? undefined : !noindex && isPathIndexable(page.path),
    canonical: page.canonical,
    robots: page.robots,
    title: page.title,
    h1Count: page.h1Count,
    jsonLd: page.jsonLd,
    internalLinks: page.internalLinks,
  };
}

export function liveImagesToFixtures(
  page: LiveProbePage,
): SeoFixtureMedia[] {
  return page.images.map((img) => ({
    src: img.src,
    pagePath: page.path,
    alt: img.alt,
    width: img.width,
    height: img.height,
    className: img.className,
    kind: "image" as const,
  }));
}

export async function headProbeUrl(
  url: string,
  timeoutMs = 8000,
): Promise<{ ok: boolean; status: number; finalUrl: string; hops: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let hops = 0;
    let current = url;
    for (let i = 0; i < 5; i++) {
      const res = await fetch(current, {
        method: "HEAD",
        redirect: "manual",
        signal: controller.signal,
        headers: { "User-Agent": UA },
      });
      if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get("location");
        if (!loc) {
          return { ok: false, status: res.status, finalUrl: current, hops };
        }
        hops += 1;
        current = new URL(loc, current).toString();
        continue;
      }
      // Some hosts reject HEAD — fall back to GET range
      if (res.status === 405 || res.status === 501) {
        const getRes = await fetch(current, {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
          headers: { "User-Agent": UA, Range: "bytes=0-0" },
        });
        return {
          ok: getRes.status > 0 && getRes.status < 400,
          status: getRes.status,
          finalUrl: getRes.url,
          hops,
        };
      }
      return {
        ok: res.status > 0 && res.status < 400,
        status: res.status,
        finalUrl: current,
        hops,
      };
    }
    return { ok: false, status: 0, finalUrl: current, hops };
  } catch {
    return { ok: false, status: 0, finalUrl: url, hops: 0 };
  } finally {
    clearTimeout(timer);
  }
}

// Silence unused WeakMap if tree-shaken oddly in tests
void bundleCache;
