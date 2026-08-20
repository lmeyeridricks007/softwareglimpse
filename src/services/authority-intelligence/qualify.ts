/**
 * QualifyAgent — compliance + scoring + status qualification.
 */

import type {
  AuthorityOpportunity,
  LinkableAsset,
} from "@/domain/schemas/authority-intelligence";
import { evaluateLinkSpamCompliance } from "./compliance";
import { scoreOpportunity } from "./scoring";
import type { OpportunitySeed } from "./fixtures";
import { AUTHORITY_OPPORTUNITY_SEEDS } from "./fixtures";
import { inventoryLinkableAssets } from "./linkable-assets";

export const QUALIFY_AGENT = {
  id: "authority-qualify-agent",
  label: "AuthorityQualifyAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
} as const;

export type QualifyResult = {
  agent: typeof QUALIFY_AGENT;
  generatedAt: string;
  opportunities: AuthorityOpportunity[];
  linkableAssets: LinkableAsset[];
  notes: string[];
};

function findSeed(opp: AuthorityOpportunity): OpportunitySeed | undefined {
  return AUTHORITY_OPPORTUNITY_SEEDS.find(
    (s) =>
      s.domain === opp.domain &&
      s.type === opp.type &&
      (s.url === opp.url || s.organization === opp.organization),
  );
}

function attachTargetAssets(
  opp: AuthorityOpportunity,
  assets: LinkableAsset[],
): string[] {
  const ids: string[] = [];
  if (opp.targetSoftwareGlimpsePage) {
    const match = assets.find((a) => a.path === opp.targetSoftwareGlimpsePage);
    if (match) ids.push(match.id);
  }
  const seed = findSeed(opp);
  for (const hint of seed?.targetAssetHints ?? []) {
    const match = assets.find(
      (a) =>
        a.path.includes(hint) ||
        a.id.toLowerCase().includes(hint.toLowerCase()),
    );
    if (match && !ids.includes(match.id)) ids.push(match.id);
  }
  return ids;
}

export function runQualifyAgent(
  opportunities: AuthorityOpportunity[],
  opts: { generatedAt?: string } = {},
): QualifyResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const linkableAssets = inventoryLinkableAssets();

  const qualified = opportunities.map((opp) => {
    const seed = findSeed(opp);
    const compliance = evaluateLinkSpamCompliance({
      opportunityDescription: opp.opportunityDescription,
      reasonWhyTheyMightLink: opp.reasonWhyTheyMightLink,
      suggestedPitchAngle: opp.suggestedPitchAngle,
      estimatedCost: opp.estimatedCost,
      primaryValueProposition: opp.primaryValueProposition,
      acquisitionType: opp.acquisitionType,
      type: opp.type,
      expectedLinkTreatment: opp.expectedLinkTreatment,
      evidenceNotes: opp.evidenceNotes,
      discoveryQueries: opp.discoveryQueries,
    });

    const scored = scoreOpportunity({
      relevance: opp.relevance,
      editorialLegitimacy: seed?.editorialLegitimacy ?? opp.sourceQuality === "excellent"
        ? "excellent"
        : opp.sourceQuality === "strong"
          ? "strong"
          : opp.sourceQuality === "good"
            ? "good"
            : opp.sourceQuality === "weak"
              ? "low"
              : "unknown",
      audienceOverlap: opp.audienceFit,
      referralValue: opp.referralValue,
      seoValue: opp.seoValue,
      targetPageFit: opp.targetSoftwareGlimpsePage ? "strong" : "low",
      likelihood: opp.likelihood,
      effort: opp.estimatedEffort,
      costBurden: seed?.costBurden,
      spamRisk: compliance.reject ? "link-spam-avoid" : opp.spamRisk,
      compliance,
      notes: [
        "SEO value scored separately from referral/brand — paid ≠ link equity.",
        "Third-party DA/DR not used as ranking truth.",
      ],
    });

    const status: AuthorityOpportunity["status"] = compliance.reject
      ? "avoid"
      : "qualified";

    return {
      ...opp,
      targetAssetIds: attachTargetAssets(opp, linkableAssets),
      spamRisk: compliance.reject ? ("link-spam-avoid" as const) : opp.spamRisk,
      complianceFlags: compliance.flags,
      scoreBand: scored.band,
      scoreNormalized: scored.normalized,
      scoreBreakdown: scored.breakdown,
      status,
      evidenceNotes: [
        ...opp.evidenceNotes,
        ...(compliance.reason ? [compliance.reason] : []),
        ...(compliance.label ? [compliance.label] : []),
      ],
    };
  });

  return {
    agent: QUALIFY_AGENT,
    generatedAt,
    opportunities: qualified,
    linkableAssets,
    notes: [
      "Qualification applies Google-compliance rejection before priority ranking.",
      "Paid exposure may remain GOOD/STRONG when primary value is audience — not dofollow purchase.",
    ],
  };
}
