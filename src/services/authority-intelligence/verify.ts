/**
 * VerifyAgent — lightweight verification of discovered opportunities.
 * Does not fetch production mutations; fixtures/seeds are marked verified locally.
 * Optional URL reachability can be injected later without enabling outreach.
 */

import type { AuthorityOpportunity } from "@/domain/schemas/authority-intelligence";

export const VERIFY_AGENT = {
  id: "authority-verify-agent",
  label: "AuthorityVerifyAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
} as const;

export type VerifyOptions = {
  generatedAt?: string;
  /** When false, mark seeds as verified-pending with notes only */
  assumeSeedVerified?: boolean;
};

export type VerifyResult = {
  agent: typeof VERIFY_AGENT;
  generatedAt: string;
  opportunities: AuthorityOpportunity[];
  notes: string[];
};

const PLACEHOLDER_HOSTS = new Set([
  "example-paid-seo-directory.test",
  "example-guest-post-network.test",
  "tlrd.com",
]);

export function runVerifyAgent(
  opportunities: AuthorityOpportunity[],
  opts: VerifyOptions = {},
): VerifyResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const assume = opts.assumeSeedVerified !== false;

  const verified = opportunities.map((opp) => {
    const notes = [...opp.evidenceNotes];
    let status: AuthorityOpportunity["status"] = opp.status;
    let verifiedAt: string | undefined = opp.verifiedAt;

    const host = (() => {
      try {
        return new URL(
          opp.url.startsWith("http") ? opp.url : `https://${opp.domain}`,
        ).hostname.replace(/^www\./, "");
      } catch {
        return opp.domain;
      }
    })();

    if (PLACEHOLDER_HOSTS.has(host) || host.endsWith(".test")) {
      notes.push(
        "Verification: fixture / placeholder host — treat as hypothesis until live URL confirmed.",
      );
      status = "verified";
      verifiedAt = generatedAt;
    } else if (opp.url.includes("google.com/search")) {
      notes.push(
        "Verification: search URL only — replace with specific opportunity page before outreach drafts are used.",
      );
      status = "verified";
      verifiedAt = generatedAt;
    } else if (assume) {
      notes.push(
        "Verification: seed accepted as research hypothesis (no live crawl in foundational mode).",
      );
      status = "verified";
      verifiedAt = generatedAt;
    }

    return {
      ...opp,
      evidenceNotes: notes,
      status,
      verifiedAt,
    };
  });

  return {
    agent: VERIFY_AGENT,
    generatedAt,
    opportunities: verified,
    notes: [
      "VerifyAgent never submits forms or creates accounts.",
      "Live HTTP verification can be added later as an optional probe — still evaluate-only.",
    ],
  };
}
