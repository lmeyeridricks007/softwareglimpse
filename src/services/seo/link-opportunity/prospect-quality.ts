import type { DigitalPrProspectType } from "./types";
import { isExampleOrPlaceholderDomain } from "./validity";

export type ProspectQualityVerdict = {
  ok: boolean;
  /** Auto-QUALIFIED when ok and evidence is strong enough for a draft. */
  qualify: boolean;
  exclusionReasons: string[];
  qualityNotes: string[];
};

const SPAM_DOMAIN_RE =
  /\b(casino|betting|poker|slots?|gambling|porn|xxx|adult|escort|cialis|viagra|pharma|pharmacy|crypto-?pump|forex-?robot|loan-?spam|weight-?loss-?pill)\b/i;

const SCRAPER_RE =
  /\b(scrapebox|screaming.?frog.?spam|bulk.?backlink|link.?farm|private.?blog.?network|\bpbn\b|seo.?spam)\b/i;

const IRRELEVANT_DIRECTORY_RE =
  /\b(free[- ]?submit|addurl|linkexchange|link[- ]?dir|article[- ]?directory|ezinearticles)\b/i;

/**
 * Exclude scraper/spam/PBN/adult/casino/irrelevant domains from Digital PR.
 * Does not invent prospects — only filters domains already evidenced in exports.
 */
export function evaluateProspectQuality(input: {
  domain: string;
  prospectType: DigitalPrProspectType;
  topicalRelevance: number;
  competitorLinkEvidence: number;
  assetFit: number;
  authorityScore: number | null;
}): ProspectQualityVerdict {
  const exclusionReasons: string[] = [];
  const qualityNotes: string[] = [];
  const domain = input.domain.replace(/^www\./, "").toLowerCase();

  if (isExampleOrPlaceholderDomain(domain)) {
    exclusionReasons.push("example/placeholder domain");
  }
  if (
    domain === "softwareglimpse.com" ||
    domain.endsWith(".softwareglimpse.com")
  ) {
    exclusionReasons.push("own property");
  }
  if (SPAM_DOMAIN_RE.test(domain)) {
    exclusionReasons.push("casino/adult/pharma/spam vertical");
  }
  if (SCRAPER_RE.test(domain)) {
    exclusionReasons.push("scraper / PBN-like signal in domain");
  }
  if (IRRELEVANT_DIRECTORY_RE.test(domain)) {
    exclusionReasons.push("irrelevant link directory");
  }

  // Heuristic PBN-like: long hyphenated nonsense host labels
  const labels = domain.split(".");
  const sld = labels.length >= 2 ? labels[labels.length - 2]! : labels[0]!;
  if (sld.length >= 24 && (sld.match(/-/g) ?? []).length >= 3) {
    exclusionReasons.push("PBN-like long hyphenated domain");
  }
  if (/^[a-z0-9]{16,}\.(com|net|xyz|top|click|info)$/i.test(domain)) {
    exclusionReasons.push("PBN-like random-looking domain");
  }

  if (input.topicalRelevance < 40) {
    exclusionReasons.push("insufficient topical relevance");
  }
  if (input.prospectType === "OTHER" && input.topicalRelevance < 55) {
    exclusionReasons.push("OTHER type without strong topical relevance");
  }
  if (input.competitorLinkEvidence <= 0) {
    exclusionReasons.push("no real competitor link evidence in export");
  }

  if (exclusionReasons.length > 0) {
    return {
      ok: false,
      qualify: false,
      exclusionReasons,
      qualityNotes,
    };
  }

  qualityNotes.push("Passed spam / PBN / vertical exclusion checks");
  if (input.authorityScore != null) {
    qualityNotes.push(`Export authority metric present (${input.authorityScore})`);
  } else {
    qualityNotes.push("No DR/DA in export — relevance + evidence used instead");
  }

  const qualify =
    input.topicalRelevance >= 55 &&
    input.assetFit >= 50 &&
    input.competitorLinkEvidence > 0 &&
    input.prospectType !== "OTHER";

  if (qualify) {
    qualityNotes.push(
      "Auto-QUALIFIED for draft eligibility (relevance + asset fit + link evidence)",
    );
  } else {
    qualityNotes.push(
      "Identified only — raise to QUALIFIED after human review before drafting",
    );
  }

  return {
    ok: true,
    qualify,
    exclusionReasons: [],
    qualityNotes,
  };
}
