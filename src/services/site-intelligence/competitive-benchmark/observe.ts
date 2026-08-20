import { JSDOM } from "jsdom";
import { extractDomain, inferPageTypeFromUrl } from "../serp-competitors/classify-domain";
import type { PageObservation } from "./types";

const UA =
  "SoftwareGlimpse-competitor-analysis/1.0 (+research; representative pages only; not a full-site crawl)";

const MAX_HTML_BYTES = 1_500_000;

export type ObservePageInput = {
  url: string;
  title?: string;
  query?: string;
  snippet?: string;
};

function textContent(doc: Document): string {
  const clone = doc.body?.cloneNode(true) as HTMLElement | undefined;
  if (!clone) return "";
  for (const sel of ["script", "style", "noscript", "svg"]) {
    clone.querySelectorAll(sel).forEach((n) => n.remove());
  }
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

function countMatches(text: string, re: RegExp): number {
  return (text.match(re) ?? []).length;
}

function jsonLdTypes(doc: Document): string[] {
  const types = new Set<string>();
  for (const el of doc.querySelectorAll('script[type="application/ld+json"]')) {
    const raw = el.textContent?.trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw) as unknown;
      const visit = (node: unknown) => {
        if (!node || typeof node !== "object") return;
        if (Array.isArray(node)) {
          node.forEach(visit);
          return;
        }
        const o = node as Record<string, unknown>;
        const t = o["@type"];
        if (typeof t === "string") types.add(t);
        if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
        if (o["@graph"]) visit(o["@graph"]);
      };
      visit(parsed);
    } catch {
      /* ignore */
    }
  }
  return [...types].sort();
}

export function observeFromHtml(input: {
  url: string;
  html: string;
  statusCode: number;
  ttfbMs?: number;
  titleHint?: string;
  query?: string;
  source: PageObservation["source"];
  fetchedAt?: string;
}): PageObservation {
  const dom = new JSDOM(input.html, { url: input.url });
  const doc = dom.window.document;
  const text = textContent(doc);
  const lower = text.toLowerCase();
  const title =
    doc.querySelector("title")?.textContent?.trim() ||
    input.titleHint ||
    input.url;
  const domain = extractDomain(input.url);
  const images = [...doc.querySelectorAll("img")];
  const links = [...doc.querySelectorAll("a[href]")];
  let internal = 0;
  let external = 0;
  for (const a of links) {
    const href = a.getAttribute("href") ?? "";
    if (!href || href.startsWith("#") || href.startsWith("mailto:")) continue;
    try {
      const abs = new URL(href, input.url);
      if (extractDomain(abs.href) === domain) internal += 1;
      else if (abs.protocol.startsWith("http")) external += 1;
    } catch {
      /* ignore */
    }
  }

  const videoEmbedCount =
    doc.querySelectorAll(
      'iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="wistia"], video',
    ).length;

  const forms = doc.querySelectorAll("form, input[type='range'], [data-calculator]").length;

  return {
    url: input.url,
    domain,
    title,
    query: input.query,
    pageType: inferPageTypeFromUrl(input.url, title),
    source: input.source,
    fetchedAt: input.fetchedAt ?? new Date().toISOString(),
    statusCode: input.statusCode,
    htmlBytes: Buffer.byteLength(input.html, "utf8"),
    wordCount: text.split(/\s+/).filter(Boolean).length,
    h1Count: doc.querySelectorAll("h1").length,
    h2Count: doc.querySelectorAll("h2").length,
    h3Count: doc.querySelectorAll("h3").length,
    listCount: doc.querySelectorAll("ul, ol").length,
    tableCount: doc.querySelectorAll("table").length,
    imageCount: images.length,
    imagesWithAlt: images.filter((img) => img.hasAttribute("alt")).length,
    videoEmbedCount,
    formCount: forms,
    internalLinkCount: internal,
    externalLinkCount: external,
    hasViewportMeta: Boolean(
      doc.querySelector('meta[name="viewport"]'),
    ),
    hasJsonLd: jsonLdTypes(doc).length > 0,
    jsonLdTypes: jsonLdTypes(doc),
    hasAuthorSignal:
      Boolean(doc.querySelector('[rel="author"], .author, [class*="author"]')) ||
      /byline|written by|author:/.test(lower) ||
      jsonLdTypes(doc).some((t) => /Person|Author/i.test(t)),
    hasDateSignal:
      Boolean(
        doc.querySelector(
          'time, meta[property="article:modified_time"], meta[property="article:published_time"]',
        ),
      ) || /updated|published|last (updated|reviewed)/i.test(lower),
    hasPricingSignal:
      /pricing|\$\d|per (user|month|seat)|free plan|starter plan/i.test(lower) ||
      /pricing|plans/.test(input.url.toLowerCase()),
    hasComparisonTable:
      doc.querySelectorAll("table").length > 0 &&
      (/\bvs\.?\b|versus|compare|comparison/i.test(lower) ||
        /\bvs\.?\b|compare/.test(input.url.toLowerCase())),
    hasProsCons: /pros\b|cons\b|advantages|disadvantages|strengths|weaknesses/i.test(
      lower,
    ),
    hasMethodology:
      /methodology|how we (test|rank|review|evaluate)|our criteria|scoring/i.test(
        lower,
      ),
    hasDisclosure:
      /affiliate|disclosure|compensat|we may earn|editorial independence/i.test(
        lower,
      ),
    hasChecklist: /checklist|☐|☑|\[ \]|scorecard|rubric/i.test(lower),
    hasCalculatorSignal:
      /calculator|estimate cost|pricing calculator|roi calculator/i.test(lower) ||
      forms > 0 && /calculat|estimate|cost/i.test(lower),
    hasToolSignal:
      /interactive|quiz|finder|recommender|configurator|planner/i.test(lower),
    hasDownloadSignal:
      /download|\.pdf|template|worksheet|spreadsheet/i.test(lower),
    hasScreenshotSignal:
      images.some((img) =>
        /screenshot|product|dashboard|ui|interface/i.test(
          `${img.getAttribute("alt") ?? ""} ${img.getAttribute("src") ?? ""}`,
        ),
      ) || /screenshot|product shot/i.test(lower),
    ttfbMs: input.ttfbMs,
    notes: [
      `Observable HTML analysis only (${input.source})`,
      `Word count ≈ ${text.split(/\s+/).filter(Boolean).length}; headings h2=${doc.querySelectorAll("h2").length}`,
    ],
  };
}

/** Lightweight observation when HTML fetch is unavailable. */
export function observeFromSerpMetadata(input: ObservePageInput): PageObservation {
  const title = input.title ?? input.url;
  const domain = extractDomain(input.url);
  const blob = `${title} ${input.snippet ?? ""} ${input.url}`.toLowerCase();
  return {
    url: input.url,
    domain,
    title,
    query: input.query,
    pageType: inferPageTypeFromUrl(input.url, title),
    source: "serp-metadata",
    fetchedAt: new Date().toISOString(),
    wordCount: undefined,
    hasPricingSignal: /pricing|\$|cost/.test(blob),
    hasComparisonTable: /\bvs\.?\b|compare/.test(blob),
    hasChecklist: /checklist/.test(blob),
    hasMethodology: /how we|methodology/.test(blob),
    notes: [
      "SERP title/snippet/URL only — depth and media not verified",
      "Do not treat as full page evaluation",
    ],
  };
}

export async function fetchCompetitorPage(
  input: ObservePageInput,
  opts: { timeoutMs?: number } = {},
): Promise<PageObservation> {
  const timeoutMs = opts.timeoutMs ?? 12_000;
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(input.url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": UA,
      },
    });
    const ttfbMs = Date.now() - started;
    const buf = Buffer.from(await res.arrayBuffer());
    if (!res.ok) {
      const meta = observeFromSerpMetadata(input);
      return {
        ...meta,
        statusCode: res.status,
        ttfbMs,
        error: `HTTP ${res.status}`,
        notes: [
          ...(meta.notes ?? []),
          `Fetch returned HTTP ${res.status}; fell back to SERP metadata`,
        ],
      };
    }
    const html = buf.subarray(0, MAX_HTML_BYTES).toString("utf8");
    return observeFromHtml({
      url: res.url || input.url,
      html,
      statusCode: res.status,
      ttfbMs,
      titleHint: input.title,
      query: input.query,
      source: "live-html",
    });
  } catch (err) {
    const meta = observeFromSerpMetadata(input);
    return {
      ...meta,
      error: err instanceof Error ? err.message : String(err),
      notes: [
        ...(meta.notes ?? []),
        `Fetch failed (${err instanceof Error ? err.message : "error"}); SERP metadata only`,
      ],
    };
  } finally {
    clearTimeout(timer);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Unused helper kept for signal density heuristics in tests. */
export function signalDensity(text: string): number {
  return countMatches(text, /\b(crm|software|review|compare|checklist)\b/gi);
}
