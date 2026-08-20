import { getAllSoftwareUnfiltered } from "@/data";
import type { CompetitorDomainType } from "./types";

const MARKETPLACE = [
  "g2.com",
  "capterra.com",
  "getapp.com",
  "softwareadvice.com",
  "trustradius.com",
  "sourceforge.net",
  "alternativeto.net",
  "producthunt.com",
];

const REVIEW_AFFILIATE = [
  "pcmag.com",
  "techradar.com",
  "forbes.com",
  "forbesadvisor.com",
  "zapier.com",
  "nerdwallet.com",
  "business.com",
  "selecthub.com",
  "softwaresuggest.com",
  "softwareworld.co",
  "spiceworks.com",
  "techopedia.com",
  "cnet.com",
  "tomsguide.com",
  "wirecutter.com",
  "nytimes.com",
  "investopedia.com",
  "saasworthy.com",
  "serchen.com",
];

const EDITORIAL = [
  "techcrunch.com",
  "wired.com",
  "theverge.com",
  "zdnet.com",
  "computerworld.com",
  "cio.com",
  "venturebeat.com",
  "medium.com",
  "wikipedia.org",
];

const COMMUNITY = [
  "reddit.com",
  "quora.com",
  "stackoverflow.com",
  "stackexchange.com",
  "youtube.com",
  "linkedin.com",
  "facebook.com",
  "x.com",
  "twitter.com",
];

const CONSULTANCY = [
  "delotte.com",
  "deloitte.com",
  "accenture.com",
  "pwc.com",
  "kpmg.com",
  "mckinsey.com",
  "gartner.com",
  "forrester.com",
  "idc.com",
];

function registrableDomain(hostname: string): string {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  // naive eTLD+1 — good enough for competitor aggregation
  const last2 = parts.slice(-2).join(".");
  if (
    /co\.uk$|com\.au$|co\.za$|com\.br$|co\.jp$|co\.in$/.test(host)
  ) {
    return parts.slice(-3).join(".");
  }
  return last2;
}

export function extractDomain(url: string): string {
  try {
    return registrableDomain(new URL(url).hostname);
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0]?.replace(/^www\./, "") ?? url;
  }
}

function vendorDomains(): Set<string> {
  const set = new Set<string>();
  for (const s of getAllSoftwareUnfiltered()) {
    const site = (s as { websiteUrl?: string; website?: string }).websiteUrl
      ?? (s as { officialUrl?: string }).officialUrl;
    if (typeof site === "string" && site.startsWith("http")) {
      set.add(extractDomain(site));
    }
    // Common vendor host patterns from slug
    set.add(`${s.slug.replace(/-/g, "")}.com`);
    if (s.slug === "hubspot") set.add("hubspot.com");
    if (s.slug === "pipedrive") set.add("pipedrive.com");
    if (s.slug === "salesforce") set.add("salesforce.com");
    if (s.slug === "zoho-crm") set.add("zoho.com");
    if (s.slug === "freshsales") {
      set.add("freshworks.com");
      set.add("freshsales.com");
    }
    if (s.slug === "dynamics-365") set.add("microsoft.com");
    if (s.slug === "monday-sales-crm") set.add("monday.com");
  }
  return set;
}

let _vendors: Set<string> | null = null;

function vendors(): Set<string> {
  if (!_vendors) _vendors = vendorDomains();
  return _vendors;
}

function matchesList(domain: string, list: string[]): boolean {
  return list.some((d) => domain === d || domain.endsWith(`.${d}`));
}

/**
 * Classify a SERP domain by observable site type — not from a business rival list.
 */
export function classifyCompetitorDomain(domain: string): CompetitorDomainType {
  const d = domain.toLowerCase().replace(/^www\./, "");
  if (d === "softwareglimpse.com" || d.endsWith(".softwareglimpse.com")) {
    return "other";
  }
  if (matchesList(d, MARKETPLACE)) return "software-marketplace";
  if (matchesList(d, REVIEW_AFFILIATE)) return "direct-review-affiliate";
  if (matchesList(d, EDITORIAL)) return "editorial-media";
  if (matchesList(d, COMMUNITY)) return "community";
  if (matchesList(d, CONSULTANCY)) return "consultancy";
  if (vendors().has(d) || [...vendors()].some((v) => d === v || d.endsWith(`.${v}`))) {
    return "vendor";
  }
  // Heuristic: many consultancies use agency-/consulting- in host
  if (/agency|consult|advisor|partners|solutions/.test(d)) return "consultancy";
  if (/review|advisor|bestof|roundup/.test(d)) return "direct-review-affiliate";
  return "other";
}

export function inferPageTypeFromUrl(url: string, title: string): string {
  const u = url.toLowerCase();
  const t = title.toLowerCase();
  if (/\/compare|vs\.|versus/.test(u) || /\bvs\.?\b/.test(t)) return "comparison";
  if (/\/best|top-/.test(u) || /\bbest\b|\btop\b/.test(t)) return "best";
  if (/\/review|reviews/.test(u) || /\breview\b/.test(t)) return "review";
  if (/\/alternatives?/.test(u) || /alternative/.test(t)) return "alternatives";
  if (/pricing|plans/.test(u) || /pricing/.test(t)) return "pricing";
  if (/checklist|template|worksheet/.test(u) || /checklist|template/.test(t)) {
    return "resource";
  }
  if (/migration|implement|setup|guide|what-is|how-to/.test(u)) return "guide";
  if (classifyCompetitorDomain(extractDomain(url)) === "vendor") return "vendor-page";
  if (classifyCompetitorDomain(extractDomain(url)) === "software-marketplace") {
    return "marketplace";
  }
  return "article";
}

export function competitorTypeLabel(type: CompetitorDomainType): string {
  switch (type) {
    case "direct-review-affiliate":
      return "DIRECT REVIEW / AFFILIATE";
    case "software-marketplace":
      return "SOFTWARE MARKETPLACE";
    case "vendor":
      return "VENDOR";
    case "editorial-media":
      return "EDITORIAL / MEDIA";
    case "consultancy":
      return "CONSULTANCY";
    case "community":
      return "COMMUNITY";
    default:
      return "OTHER";
  }
}
