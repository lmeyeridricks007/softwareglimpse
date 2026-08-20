/**
 * Google-compliance / link-spam policy for Authority Intelligence.
 *
 * Paid promotional opportunities may still be recommended when the primary
 * value is legitimate exposure / referral / brand — never when the pitch is
 * "pay for a dofollow backlink."
 */

import type {
  AuthorityOpportunity,
  SpamRisk,
} from "@/domain/schemas/authority-intelligence";

export const LINK_SPAM_AVOID_LABEL = "AVOID — LINK SPAM RISK" as const;

/** Strategies whose primary value prop is manipulative link acquisition. */
export const LINK_SPAM_STRATEGY_PATTERNS: Array<{
  id: string;
  label: string;
  signals: string[];
}> = [
  {
    id: "pay-for-dofollow",
    label: "Pay for dofollow backlink",
    signals: [
      "pay for dofollow",
      "buy dofollow",
      "guaranteed dofollow",
      "dofollow backlink package",
      "paid dofollow link",
    ],
  },
  {
    id: "large-scale-guest-posts",
    label: "Large-scale guest-post placement",
    signals: [
      "guest post package",
      "bulk guest posts",
      "100 guest posts",
      "guest posting network",
      "write for us network",
    ],
  },
  {
    id: "pbn",
    label: "Private blog networks",
    signals: ["private blog network", "pbn links", "pbn package"],
  },
  {
    id: "automated-insertion",
    label: "Automated link insertion",
    signals: [
      "automated link insertion",
      "auto insert backlinks",
      "link insertion service",
      "niche edit package",
    ],
  },
  {
    id: "expired-domain-schemes",
    label: "Expired-domain link schemes",
    signals: [
      "expired domain links",
      "expired domain backlinks",
      "301 redirect package",
      "expired domain network",
    ],
  },
  {
    id: "mass-syndication",
    label: "Mass article syndication for anchor-rich links",
    signals: [
      "mass syndication",
      "article spinning",
      "press release blast seo",
      "syndication for backlinks",
    ],
  },
  {
    id: "sitewide-footer-purchase",
    label: "Sitewide footer links purchased for ranking",
    signals: [
      "sitewide footer link",
      "footer link package",
      "sitewide backlink",
      "blogroll link package",
    ],
  },
  {
    id: "link-exchange-scale",
    label: "Link exchanges at scale",
    signals: [
      "link exchange network",
      "reciprocal link package",
      "link exchange at scale",
      "3-way link exchange",
    ],
  },
];

export type ComplianceVerdict = {
  reject: boolean;
  spamRisk: SpamRisk;
  flags: string[];
  label?: typeof LINK_SPAM_AVOID_LABEL;
  reason?: string;
};

function haystackFromOpportunity(
  partial: Pick<
    AuthorityOpportunity,
    | "opportunityDescription"
    | "reasonWhyTheyMightLink"
    | "suggestedPitchAngle"
    | "estimatedCost"
    | "primaryValueProposition"
    | "acquisitionType"
    | "type"
  > & { evidenceNotes?: string[]; discoveryQueries?: string[] },
): string {
  return [
    partial.opportunityDescription,
    partial.reasonWhyTheyMightLink,
    partial.suggestedPitchAngle ?? "",
    partial.estimatedCost ?? "",
    partial.primaryValueProposition ?? "",
    partial.acquisitionType,
    partial.type,
    ...(partial.evidenceNotes ?? []),
    ...(partial.discoveryQueries ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

/** True when `signal` appears as an affirmative offer, not a negation warning. */
function matchesSpamSignal(text: string, signal: string): boolean {
  let from = 0;
  while (from < text.length) {
    const idx = text.indexOf(signal, from);
    if (idx < 0) return false;
    const windowStart = Math.max(0, idx - 48);
    const before = text.slice(windowStart, idx);
    const negated =
      /\b(not|never|don't|do not|dont|avoid|isn't|is not|no longer)\b/.test(
        before,
      ) ||
      /\bnot a place to\b/.test(before) ||
      /\brather than\b/.test(before) ||
      /\binstead of\b/.test(before);
    if (!negated) return true;
    from = idx + signal.length;
  }
  return false;
}

/**
 * Reject opportunities whose primary proposition is manipulative link buying.
 * Paid exposure with sponsored/nofollow treatment may still pass.
 */
export function evaluateLinkSpamCompliance(
  partial: Parameters<typeof haystackFromOpportunity>[0] & {
    expectedLinkTreatment?: AuthorityOpportunity["expectedLinkTreatment"];
    primaryValueProposition?: AuthorityOpportunity["primaryValueProposition"];
  },
): ComplianceVerdict {
  const flags: string[] = [];
  const text = haystackFromOpportunity(partial);

  if (partial.primaryValueProposition === "link-equity-purchase") {
    return {
      reject: true,
      spamRisk: "link-spam-avoid",
      flags: ["primary-value-link-equity-purchase"],
      label: LINK_SPAM_AVOID_LABEL,
      reason:
        "Primary value proposition is purchasing link equity — rejected under Google-compliance policy.",
    };
  }

  for (const pattern of LINK_SPAM_STRATEGY_PATTERNS) {
    if (pattern.signals.some((s) => matchesSpamSignal(text, s))) {
      flags.push(pattern.id);
    }
  }

  // Paid + editorial/follow assumption without exposure framing → treat as spam risk
  if (
    partial.acquisitionType === "PAID" &&
    partial.expectedLinkTreatment === "EDITORIAL" &&
    partial.primaryValueProposition !== "paid-exposure" &&
    partial.primaryValueProposition !== "audience-exposure" &&
    partial.primaryValueProposition !== "brand-awareness"
  ) {
    flags.push("paid-posing-as-editorial");
  }

  if (flags.length > 0) {
    return {
      reject: true,
      spamRisk: "link-spam-avoid",
      flags,
      label: LINK_SPAM_AVOID_LABEL,
      reason: `Matched link-spam policy signals: ${flags.join(", ")}.`,
    };
  }

  // Paid exposure that is explicitly sponsored / nofollow is allowed (not SEO equity pitch)
  if (
    partial.acquisitionType === "PAID" &&
    (partial.expectedLinkTreatment === "SPONSORED" ||
      partial.expectedLinkTreatment === "NOFOLLOW" ||
      partial.primaryValueProposition === "paid-exposure" ||
      partial.primaryValueProposition === "audience-exposure")
  ) {
    return {
      reject: false,
      spamRisk: "low",
      flags: ["paid-exposure-allowed"],
      reason:
        "Paid opportunity evaluated for exposure/referral value; link treatment must stay sponsored/nofollow-qualified.",
    };
  }

  return { reject: false, spamRisk: "none", flags: [] };
}

export function isFreeAcquisition(
  acquisitionType: AuthorityOpportunity["acquisitionType"],
): boolean {
  return (
    acquisitionType === "EARNED" ||
    acquisitionType === "OWNED_PROFILE" ||
    acquisitionType === "CONTRIBUTED" ||
    acquisitionType === "UGC" ||
    acquisitionType === "PARTNERSHIP"
  );
}
