import type {
  AssetSourceType,
  OfficialSourceVerificationResult,
} from "@/domain/schemas/asset-discovery";
import { OfficialSourceVerificationResultSchema } from "@/domain/schemas/asset-discovery";
import {
  domainMatchesOfficial,
  getVendorOfficialSourceEntry,
  normalizeDomain,
} from "./vendor-registry";

/**
 * Official source verification.
 * Never relies solely on search snippet / title text.
 */

const AFFILIATE_HOST_HINTS = [
  "aff.",
  "partner.",
  "go.",
  "shareasale",
  "impact.com",
  "cj.com",
  "trypipedrive.com",
];

const AUTHORITATIVE_TLDS = [".gov", ".gov.uk", ".europa.eu", ".int"];

const STANDARDS_HOSTS = [
  "iso.org",
  "nist.gov",
  "ietf.org",
  "w3.org",
  "oasis-open.org",
];

function hostOf(url: string): string | null {
  try {
    return normalizeDomain(new URL(url).hostname);
  } catch {
    return null;
  }
}

function isAffiliateHost(host: string): boolean {
  return AFFILIATE_HOST_HINTS.some((h) => host.includes(h));
}

function classifyNonVendorHost(host: string): {
  sourceType: AssetSourceType;
  confidence: "high" | "medium" | "low" | "none";
} | null {
  if (AUTHORITATIVE_TLDS.some((t) => host.endsWith(t))) {
    return { sourceType: "government", confidence: "high" };
  }
  if (STANDARDS_HOSTS.some((s) => host === s || host.endsWith(`.${s}`))) {
    return { sourceType: "standards-body", confidence: "high" };
  }
  if (host.includes("youtube.com") || host === "youtu.be") {
    return { sourceType: "secondary", confidence: "low" };
  }
  if (host.includes("vimeo.com")) {
    return { sourceType: "secondary", confidence: "low" };
  }
  return null;
}

function inferVendorSourceType(
  url: string,
  kind?: string,
): AssetSourceType {
  const lower = url.toLowerCase();
  if (kind === "vendor-documentation") return "vendor-documentation";
  if (kind === "vendor-help-center") return "vendor-help-center";
  if (kind === "vendor-academy") return "vendor-academy";
  if (kind === "vendor-trust-center") return "vendor-trust-center";
  if (lower.includes("pricing")) return "vendor-pricing";
  if (lower.includes("brand")) return "vendor-brand-center";
  if (lower.includes("customer") || lower.includes("case-stud")) {
    return "vendor-customer-story";
  }
  return "vendor-official-site";
}

export type VerifyOfficialSourceInput = {
  sourceUrl: string;
  productSlug?: string;
  /**
   * Researcher-supplied channel name for YouTube/Vimeo.
   * Required for officialSource=true on video hosts — never inferred from title.
   */
  claimedChannelName?: string;
  /** When researcher has already confirmed vendor channel ownership. */
  researcherConfirmedOfficialChannel?: boolean;
};

/**
 * Verify whether a URL appears to be an official / authoritative source.
 * YouTube/Vimeo remain unofficial unless channel confirmation is supplied.
 */
export function verifyOfficialSource(
  input: VerifyOfficialSourceInput,
): OfficialSourceVerificationResult {
  const checks: OfficialSourceVerificationResult["checks"] = [];
  const notes: string[] = [];
  const host = hostOf(input.sourceUrl);

  if (!host) {
    return OfficialSourceVerificationResultSchema.parse({
      sourceUrl: input.sourceUrl,
      officialSource: false,
      sourceType: "secondary",
      confidence: "none",
      checks: [
        {
          id: "parseable-url",
          passed: false,
          detail: "URL could not be parsed",
        },
      ],
      notes: ["Invalid URL — do not invent a replacement"],
    });
  }

  checks.push({
    id: "parseable-url",
    passed: true,
    detail: `Host ${host}`,
  });

  if (isAffiliateHost(host)) {
    checks.push({
      id: "not-affiliate",
      passed: false,
      detail: "Affiliate / partner tracking host — not an evidence URL",
    });
    return OfficialSourceVerificationResultSchema.parse({
      sourceUrl: input.sourceUrl,
      officialSource: false,
      sourceType: "secondary",
      confidence: "none",
      checks,
      notes: ["Affiliate URLs are not evidence or official media sources"],
    });
  }
  checks.push({
    id: "not-affiliate",
    passed: true,
    detail: "Not an affiliate tracking host",
  });

  const isVideoHost =
    host.includes("youtube.com") ||
    host === "youtu.be" ||
    host.includes("vimeo.com");

  if (input.productSlug) {
    const match = domainMatchesOfficial(input.sourceUrl, input.productSlug);
    const entry = getVendorOfficialSourceEntry(input.productSlug);

    if (isVideoHost) {
      const channel = input.claimedChannelName?.trim();
      const channelMatch =
        channel &&
        entry?.officialVideoChannels.some(
          (c) =>
            c.channelName.toLowerCase() === channel.toLowerCase() ||
            (c.channelUrl &&
              channel.toLowerCase().includes(c.channelName.toLowerCase())),
        );

      checks.push({
        id: "vendor-channel-association",
        passed: Boolean(
          channelMatch || input.researcherConfirmedOfficialChannel,
        ),
        detail: channel
          ? `Claimed channel “${channel}” ${channelMatch || input.researcherConfirmedOfficialChannel ? "matches registry / researcher confirmation" : "does not match registry — not official from name alone"}`
          : "No channel identity supplied — cannot mark YouTube/Vimeo official from URL alone",
      });

      const official =
        Boolean(channelMatch || input.researcherConfirmedOfficialChannel) &&
        Boolean(entry);

      const sourceType: AssetSourceType = host.includes("vimeo")
        ? "vendor-vimeo"
        : "vendor-youtube";

      if (!official) {
        notes.push(
          "Video hosts require channel verification against the vendor registry or explicit researcher confirmation — title/snippet is insufficient",
        );
      }

      return OfficialSourceVerificationResultSchema.parse({
        sourceUrl: input.sourceUrl,
        officialSource: official,
        sourceType: official ? sourceType : "secondary",
        matchedChannel: channel,
        confidence: official ? "high" : "low",
        checks,
        notes,
      });
    }

    checks.push({
      id: "domain-ownership",
      passed: match.matched,
      detail: match.matched
        ? `Matched official domain ${match.domain} (${match.kind})`
        : "Host is not in the vendor official domain registry",
    });

    if (match.matched) {
      return OfficialSourceVerificationResultSchema.parse({
        sourceUrl: input.sourceUrl,
        officialSource: true,
        sourceType: inferVendorSourceType(input.sourceUrl, match.kind),
        matchedDomain: match.domain,
        confidence: "high",
        checks,
        notes,
      });
    }

    notes.push(
      `No registry domain match for product “${input.productSlug}” — treat as secondary until manually verified`,
    );
  }

  const nonVendor = classifyNonVendorHost(host);
  if (nonVendor && !isVideoHost) {
    checks.push({
      id: "authoritative-primary",
      passed: nonVendor.confidence === "high",
      detail: `Classified as ${nonVendor.sourceType}`,
    });
    return OfficialSourceVerificationResultSchema.parse({
      sourceUrl: input.sourceUrl,
      officialSource: nonVendor.confidence === "high",
      sourceType: nonVendor.sourceType,
      matchedDomain: host,
      confidence: nonVendor.confidence,
      checks,
      notes,
    });
  }

  checks.push({
    id: "domain-ownership",
    passed: false,
    detail: "No product slug and/or no authoritative host match",
  });

  return OfficialSourceVerificationResultSchema.parse({
    sourceUrl: input.sourceUrl,
    officialSource: false,
    sourceType: "secondary",
    confidence: "none",
    checks,
    notes: [
      ...notes,
      "Do not classify as official based only on name/title similarity",
    ],
  });
}
