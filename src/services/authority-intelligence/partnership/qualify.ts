import type { OpportunityScoreBand } from "@/domain/schemas/authority-intelligence";
import { stableAuthorityOpportunityId } from "../stable-ids";
import type {
  PartnershipLiveHit,
  PartnershipOpportunity,
  PartnershipReject,
} from "./types";
import { LINK_EXCHANGE_REJECT_LABEL } from "./types";

const VIS_POINTS: Record<string, number> = {
  excellent: 40,
  strong: 32,
  good: 22,
  low: 10,
  none: 0,
  unknown: 12,
};

const DIFF_POINTS: Record<string, number> = {
  low: 25,
  medium: 18,
  high: 10,
  "very-high": 4,
};

function isLinkExchangePitch(hit: PartnershipLiveHit): boolean {
  const text = [
    hit.collaborationIdea,
    hit.mutualValue,
    hit.potentialLink,
    hit.pageSummary,
    hit.rejectNotes ?? "",
    ...(hit.evidenceNotes ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return (
    hit.rejectReason === LINK_EXCHANGE_REJECT_LABEL ||
    text.includes("you link to me") ||
    text.includes("i'll link to you") ||
    text.includes("ill link to you") ||
    text.includes("reciprocal link exchange") ||
    text.includes("mass link exchange") ||
    (text.includes("link exchange") && text.includes("seo"))
  );
}

function scoreHit(hit: PartnershipLiveHit): number {
  let score =
    (VIS_POINTS[hit.visibilityValue] ?? 12) +
    (DIFF_POINTS[hit.difficulty] ?? 10);
  // Mutual value signals
  if (/both|mutual|complement|exchange of expertise/i.test(hit.mutualValue)) {
    score += 15;
  }
  if (hit.collaborationModels.length >= 3) score += 8;
  if (hit.targetSgAssets.length >= 2) score += 7;
  if (hit.claimsImplementationPartnerStatus) score -= 50;
  return Math.max(0, Math.min(100, score));
}

function bandFromScore(score: number): OpportunityScoreBand {
  if (score >= 85) return "EXCELLENT";
  if (score >= 70) return "STRONG";
  if (score >= 55) return "GOOD";
  if (score >= 40) return "LOW";
  return "AVOID";
}

export function qualifyPartnershipHit(
  hit: PartnershipLiveHit,
):
  | { decision: "accept"; opportunity: PartnershipOpportunity }
  | { decision: "reject"; rejected: PartnershipReject } {
  const id = stableAuthorityOpportunityId({
    type: "PARTNERSHIP",
    domain: hit.domain,
    url: hit.url,
    targetPage: hit.organization,
  });

  if (
    hit.provisionalDecision === "reject" ||
    isLinkExchangePitch(hit) ||
    hit.claimsImplementationPartnerStatus
  ) {
    let reason =
      hit.rejectReason ??
      (isLinkExchangePitch(hit)
        ? LINK_EXCHANGE_REJECT_LABEL
        : "Misrepresentation risk (SI/partner claim)");
    if (hit.claimsImplementationPartnerStatus && !isLinkExchangePitch(hit)) {
      reason = "Misrepresentation risk (SI/partner claim)";
    }
    return {
      decision: "reject",
      rejected: {
        id,
        organization: hit.organization,
        domain: hit.domain,
        opportunity: hit.collaborationIdea,
        sourceUrl: hit.url,
        reason,
        notes: hit.rejectNotes ?? hit.pageSummary.slice(0, 220),
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  const scoreNormalized = scoreHit(hit);
  const status: PartnershipOpportunity["status"] =
    scoreNormalized >= 70
      ? "recommended"
      : scoreNormalized >= 50
        ? "explore"
        : "deferred";

  return {
    decision: "accept",
    opportunity: {
      id,
      scoreBand: bandFromScore(scoreNormalized),
      scoreNormalized,
      organization: hit.organization,
      domain: hit.domain,
      partnerType: hit.partnerType,
      whyRelevant: hit.whyRelevant,
      collaborationIdea: hit.collaborationIdea,
      collaborationModels: hit.collaborationModels,
      whatWeOffer: hit.whatWeOffer,
      whatTheyOffer: hit.whatTheyOffer,
      mutualValue: hit.mutualValue,
      potentialLink: hit.potentialLink,
      visibilityValue: hit.visibilityValue,
      difficulty: hit.difficulty,
      contactPath: hit.contactPath,
      sourceUrl: hit.url,
      verifiedAt: hit.verifiedAt,
      targetSgAssets: hit.targetSgAssets ?? [],
      vendorEcosystemNotes: hit.vendorEcosystemNotes,
      status,
    },
  };
}

export function rankPartnershipOpportunities(
  items: PartnershipOpportunity[],
): PartnershipOpportunity[] {
  const sorted = [...items].sort((a, b) => {
    if (b.scoreNormalized !== a.scoreNormalized) {
      return b.scoreNormalized - a.scoreNormalized;
    }
    return a.organization.localeCompare(b.organization);
  });
  return sorted.map((o, i) => ({ ...o, priority: i + 1 }));
}
