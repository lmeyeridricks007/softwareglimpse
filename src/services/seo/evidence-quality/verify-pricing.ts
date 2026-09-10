import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  loadEnrichment,
  loadManualSources,
  saveEnrichment,
  saveManualSources,
} from "@/data/research/store";
import {
  clearPricingVerificationCaches,
  explainPricingVerification,
} from "@/services/editorial/pricing-verified-at";
import { getSoftwareBySlug } from "@/data";
import type { ProductEvidencePack, PricingVerificationResult } from "./types";

const MIN_HIT_RATIO = 0.75;
const FETCH_TIMEOUT_MS = 20_000;

type PricingSourceCandidate = { id: string; url: string; score: number };

function urlKey(url: string): string {
  return url.replace(/\/$/, "").toLowerCase();
}

function urlHost(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Hosts/URLs we must not re-fetch: prior 403/401/429/timeout/plan_hit.
 * 404 skips the exact URL only so a sibling docs path can still be tried.
 */
export function priorPricingFetchBlocks(slug: string): {
  skipHosts: Set<string>;
  skipUrls: Set<string>;
} {
  const skipHosts = new Set<string>();
  const skipUrls = new Set<string>();
  const packPath = path.join(
    process.cwd(),
    "data/seo/evidence-packs",
    `${slug}.json`,
  );
  if (!existsSync(packPath)) return { skipHosts, skipUrls };
  try {
    const pack = JSON.parse(readFileSync(packPath, "utf8")) as {
      pricingVerification?: PricingVerificationResult;
    };
    const v = pack.pricingVerification;
    if (!v?.attempted || v.verified) return { skipHosts, skipUrls };
    const reason = v.rejectReason ?? "";
    const attempted = [
      ...(v.attemptedUrls ?? []),
      ...(v.sourceUrl ? [v.sourceUrl] : []),
    ];
    for (const last of attempted) {
      skipUrls.add(urlKey(last));
      const host = urlHost(last);
      const skipWholeHost =
        reason.startsWith("http_403") ||
        reason.startsWith("http_401") ||
        reason.startsWith("http_429") ||
        reason.startsWith("plan_hit") ||
        reason.startsWith("fetch_failed") ||
        /timeout|aborted/i.test(reason);
      if (skipWholeHost && host) skipHosts.add(host);
    }
  } catch {
    return { skipHosts, skipUrls };
  }
  return { skipHosts, skipUrls };
}

function isFixtureSource(source: {
  authority?: string | null;
  sourceType?: string | null;
}): boolean {
  return (
    source.authority === "fixture" ||
    (source.sourceType ?? "").toLowerCase() === "fixture"
  );
}

function isPricingOrDocsSignal(
  url: string,
  type: string,
  domains: string[],
): boolean {
  const urlL = url.toLowerCase();
  return (
    type.includes("pricing") ||
    domains.includes("pricing") ||
    domains.includes("plans") ||
    /\/pricing/i.test(url) ||
    type.includes("help") ||
    type.includes("documentation") ||
    type.includes("docs") ||
    type.includes("release") ||
    type.includes("marketplace") ||
    /(help|docs|support|billing|\/plans\/|marketplace|appsource)/i.test(urlL)
  );
}

function scorePricingCandidate(input: {
  url: string;
  sourceType?: string | null;
  authority?: string | null;
  domains?: string[] | null;
}): number | null {
  const url = input.url;
  const type = (input.sourceType ?? "").toLowerCase();
  const domains = input.domains ?? [];
  if (!isPricingOrDocsSignal(url, type, domains)) return null;

  const urlL = url.toLowerCase();
  let score = 0;
  if (type.includes("pricing")) score += 50;
  if (domains.includes("pricing")) score += 30;
  if (/\/pricing/i.test(url)) score += 40;
  if (type.includes("help") || type.includes("documentation") || type.includes("docs")) {
    score += 25;
  }
  if (/(help|docs|support|billing|\/plans)/i.test(urlL)) score += 20;
  if (/(marketplace|appsource)/i.test(urlL) || type.includes("marketplace")) {
    score += 18;
  }
  if (/release|changelog/i.test(urlL) || type.includes("release")) score += 15;
  if (domains.includes("plans") || domains.includes("limits")) score += 10;
  if (input.authority === "first-party") score += 8;
  if (type.includes("official")) score += 5;
  return score > 0 ? score : null;
}

/** Ranked first-party pricing / docs / help / marketplace sources. */
export function pickPricingSources(
  slug: string,
  limit = 4,
): PricingSourceCandidate[] {
  const { skipHosts, skipUrls } = priorPricingFetchBlocks(slug);
  const sources = loadManualSources(slug).filter((s) => s.status !== "rejected");
  const scored = sources
    .map((s) => {
      if (isFixtureSource(s)) return null;
      const url = s.url?.trim();
      if (!url) return null;
      const key = urlKey(url);
      if (skipUrls.has(key)) return null;
      const host = urlHost(url);
      if (host && skipHosts.has(host)) return null;
      const score = scorePricingCandidate({
        url,
        sourceType: s.sourceType,
        authority: s.authority,
        domains: s.domains,
      });
      if (score == null) return null;
      return { id: s.id, url, score };
    })
    .filter((x): x is PricingSourceCandidate => Boolean(x))
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const out: PricingSourceCandidate[] = [];
  for (const s of scored) {
    const key = urlKey(s.url);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}

/** Prefer dedicated pricing pages over product marketing URLs. */
export function pickPricingSource(slug: string): {
  id: string;
  url: string;
} | null {
  const top = pickPricingSources(slug, 1)[0];
  return top ? { id: top.id, url: top.url } : null;
}

/** Match plan labels against vendor HTML (tolerant of parenthetical suffixes). */
export function matchPlanNamesInHtml(
  html: string,
  planNames: string[],
): { found: string[]; ratio: number } {
  const lower = html.toLowerCase();
  const found: string[] = [];
  for (const name of planNames) {
    const variants = planNameVariants(name);
    if (variants.some((v) => lower.includes(v))) {
      found.push(name);
    }
  }
  const ratio = planNames.length === 0 ? 0 : found.length / planNames.length;
  return { found, ratio };
}

function planNameVariants(name: string): string[] {
  const base = name.toLowerCase().trim();
  const beforeParen = base.split("(")[0]?.trim() ?? base;
  const firstToken = beforeParen.split(/\s+/)[0] ?? beforeParen;
  const out = new Set<string>();
  if (base.length >= 3) out.add(base);
  if (beforeParen.length >= 3) out.add(beforeParen);
  // Avoid ultra-short tokens like "pro" / "max" alone causing false positives
  if (firstToken.length >= 5) out.add(firstToken);
  return [...out];
}

function uniqueVerifiedAt(index: number): string {
  // Unique per product so mass_identical_stamp cannot reject the batch.
  const base = Date.now() + index * 1000;
  return new Date(base).toISOString();
}

/**
 * Live vendor-page pricing confirmation against enrichment plan names.
 * Does not invent plans — only confirms catalogue names appear on the vendor page.
 */
export async function verifyPricingAgainstVendor(
  pack: ProductEvidencePack,
  options: { apply?: boolean; stampIndex?: number } = {},
): Promise<PricingVerificationResult> {
  const apply = options.apply === true;
  const stampIndex = options.stampIndex ?? 0;

  const candidates = pickPricingSources(pack.slug, 4);
  const planNames = pack.plans.map((p) => p.name);
  const attemptedUrls: string[] = [];

  if (candidates.length === 0) {
    return {
      attempted: false,
      verified: false,
      httpStatus: null,
      sourceId: null,
      sourceUrl: null,
      planNamesChecked: planNames,
      planNamesFound: [],
      planHitRatio: 0,
      rejectReason: "no_pricing_source_url",
      verifiedAt: null,
      stampApplied: false,
      attemptedUrls,
    };
  }

  if (planNames.length === 0) {
    const first = candidates[0]!;
    return {
      attempted: false,
      verified: false,
      httpStatus: null,
      sourceId: first.id,
      sourceUrl: first.url,
      planNamesChecked: [],
      planNamesFound: [],
      planHitRatio: 0,
      rejectReason: "no_enrichment_plans",
      verifiedAt: null,
      stampApplied: false,
      attemptedUrls,
    };
  }

  let lastHttp: number | null = null;
  let lastSource = candidates[0]!;
  let lastFound: string[] = [];
  let lastRatio = 0;
  let lastReject = "http_error";
  const skipHostsThisRun = new Set<string>();

  for (const source of candidates) {
    const host = urlHost(source.url);
    if (host && skipHostsThisRun.has(host)) continue;
    lastSource = source;
    attemptedUrls.push(source.url);
    let httpStatus: number | null = null;
    let html = "";
    try {
      const res = await fetch(source.url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; SoftwareGlimpseEditorialBot/1.0; +https://softwareglimpse.com/bot)",
          accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      httpStatus = res.status;
      html = await res.text();
    } catch (error) {
      lastHttp = httpStatus;
      lastReject = `fetch_failed:${error instanceof Error ? error.message : String(error)}`;
      if (host) skipHostsThisRun.add(host);
      continue;
    }

    lastHttp = httpStatus;
    if (httpStatus !== 200) {
      lastReject = `http_${httpStatus}`;
      // Try next ranked URL on hard blocks. 429: skip this host, not other hosts.
      if (
        httpStatus === 403 ||
        httpStatus === 404 ||
        httpStatus === 401 ||
        httpStatus === 429
      ) {
        if ((httpStatus === 403 || httpStatus === 429) && host) {
          skipHostsThisRun.add(host);
        }
        continue;
      }
      if (host) skipHostsThisRun.add(host);
      continue;
    }

    const { found, ratio } = matchPlanNamesInHtml(html, planNames);
    lastFound = found;
    lastRatio = ratio;
    if (ratio < MIN_HIT_RATIO) {
      lastReject = `plan_hit_ratio_below_${MIN_HIT_RATIO}`;
      // Page loaded but plans mismatch — try next source before giving up.
      continue;
    }

    const verifiedAt = uniqueVerifiedAt(stampIndex);
    let stampApplied = false;

    if (apply) {
      stampApplied = applyDataVerifiedStamp(pack.slug, {
        verifiedAt,
        sourceId: source.id,
      });
    }

    return {
      attempted: true,
      verified: true,
      httpStatus,
      sourceId: source.id,
      sourceUrl: source.url,
      planNamesChecked: planNames,
      planNamesFound: found,
      planHitRatio: ratio,
      rejectReason: stampApplied || !apply ? null : "stamp_not_accepted_by_policy",
      verifiedAt: stampApplied || !apply ? verifiedAt : null,
      stampApplied,
      attemptedUrls,
    };
  }

  return {
    attempted: true,
    verified: false,
    httpStatus: lastHttp,
    sourceId: lastSource.id,
    sourceUrl: lastSource.url,
    planNamesChecked: planNames,
    planNamesFound: lastFound,
    planHitRatio: lastRatio,
    rejectReason: lastReject,
    verifiedAt: null,
    stampApplied: false,
    attemptedUrls,
  };
}

function applyDataVerifiedStamp(
  slug: string,
  input: { verifiedAt: string; sourceId: string },
): boolean {
  const enrichment = loadEnrichment(slug);
  if (!enrichment?.pricing || typeof enrichment.pricing !== "object") {
    return false;
  }

  const pricing = { ...(enrichment.pricing as Record<string, unknown>) };
  const existingIds = Array.isArray(pricing.sourceIds)
    ? (pricing.sourceIds as string[])
    : [];
  const sourceIds = existingIds.includes(input.sourceId)
    ? existingIds
    : [...existingIds, input.sourceId];

  if (sourceIds.length === 0) return false;

  pricing.verifiedAt = input.verifiedAt;
  pricing.sourceIds = sourceIds;

  // Keep updatedAt distinct from verifiedAt so policy does not twin-reject.
  const updatedAt =
    enrichment.updatedAt && enrichment.updatedAt !== input.verifiedAt
      ? enrichment.updatedAt
      : new Date(Date.parse(input.verifiedAt) - 60_000).toISOString();

  saveEnrichment(slug, {
    ...enrichment,
    pricing,
    updatedAt,
    sourceIds: [...new Set([...(enrichment.sourceIds ?? []), ...sourceIds])],
  });

  // Refresh source lastCheckedAt for provenance (no fabricated verification notes).
  const sources = loadManualSources(slug).map((s) =>
    s.id === input.sourceId || sourceIds.includes(s.id)
      ? {
          ...s,
          lastCheckedAt: input.verifiedAt,
        }
      : s,
  );
  saveManualSources(slug, sources);

  clearPricingVerificationCaches();

  const software = getSoftwareBySlug(slug);
  const expl = explainPricingVerification(software);
  return Boolean(expl.acceptedAt);
}
