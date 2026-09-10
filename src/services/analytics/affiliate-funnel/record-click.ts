import { randomUUID } from "node:crypto";
import type { AffiliateClickEvent } from "./types";
import {
  ensureAffiliateClickStore,
  recomputeClickAggregates,
  saveAffiliateClickStore,
} from "./store";

const MAX_EVENTS_RETAINED = 5_000;

export type RecordAffiliateClickInput = {
  productSlug: string;
  sourcePage?: string | null;
  programId?: string | null;
  vendor?: string | null;
  ctaLocation?: string | null;
  ctaType?: string | null;
  destinationDomain?: string | null;
  destinationType?: string | null;
  referrerHost?: string | null;
  trafficSource?: string | null;
  captureChannel?: string | null;
  ts?: string | null;
  /** Optional network sub-id; defaults to minted click id for joinability */
  trackingId?: string | null;
};

/** Path-only; strip query/hash. */
export function sanitizeSourcePage(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "/";
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      const u = new URL(raw);
      return normalizePath(u.pathname);
    }
  } catch {
    // fall through
  }
  const pathOnly = raw.split("?")[0]?.split("#")[0] ?? "/";
  return normalizePath(pathOnly);
}

function normalizePath(p: string): string {
  const s = p.startsWith("/") ? p : `/${p}`;
  if (s === "/") return "/";
  return s.endsWith("/") ? s : `${s}/`;
}

/** Hostname only from Referer header or URL — never full URL with tokens. */
export function sanitizeReferrerHost(
  raw: string | null | undefined,
): string | null {
  if (!raw) return null;
  try {
    const u = raw.includes("://") ? new URL(raw) : new URL(`https://${raw}`);
    return u.hostname.replace(/^www\./, "").toLowerCase() || null;
  } catch {
    return null;
  }
}

export function inferTrafficSource(
  referrerHost: string | null,
): string {
  if (!referrerHost) return "direct";
  if (
    /google\.|bing\.|duckduckgo\.|yahoo\.|baidu\.|yandex\./i.test(referrerHost)
  ) {
    return "organic";
  }
  return "referral";
}

/**
 * Append a first-party affiliate click. Caps retained raw events; aggregates always accurate for window.
 */
export function recordAffiliateClick(
  input: RecordAffiliateClickInput,
  cwd = process.cwd(),
): AffiliateClickEvent {
  const store = ensureAffiliateClickStore(cwd);
  if (store.synthetic) {
    throw new Error("Refusing to write clicks into a synthetic/fixture store");
  }

  const referrerHost = sanitizeReferrerHost(input.referrerHost);
  const trafficSource =
    input.trafficSource?.trim() || inferTrafficSource(referrerHost);
  const ts = input.ts?.trim() || new Date().toISOString();
  const id = randomUUID();
  const event: AffiliateClickEvent = {
    id,
    ts,
    sourcePage: sanitizeSourcePage(input.sourcePage),
    productSlug: (input.productSlug || "unknown").trim().toLowerCase(),
    programId: input.programId?.trim() || null,
    vendor: input.vendor?.trim() || null,
    ctaLocation: (input.ctaLocation || "other").trim().toLowerCase(),
    ctaType: (input.ctaType || "affiliate").trim().toLowerCase(),
    destinationDomain: input.destinationDomain?.trim().toLowerCase() || null,
    destinationType: input.destinationType?.trim() || null,
    referrerHost,
    trafficSource,
    captureChannel: (input.captureChannel || "beacon").trim().toLowerCase(),
    trackingId: input.trackingId?.trim() || id,
  };

  const events = [...store.events, event].slice(-MAX_EVENTS_RETAINED);
  const next = {
    ...store,
    validity: "REAL" as const,
    synthetic: false,
    generatedAt: new Date().toISOString(),
    dataThroughDate: ts.slice(0, 10),
    events,
    aggregates: recomputeClickAggregates(events),
  };
  saveAffiliateClickStore(next, cwd);
  return event;
}
