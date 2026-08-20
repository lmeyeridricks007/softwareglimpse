import type { LiveSearchHit } from "./types";
import type { OpportunityScoreBand } from "@/domain/schemas/authority-intelligence";
import { evaluateLinkSpamCompliance } from "../compliance";
import { scoreOpportunity } from "../scoring";
import { stableAuthorityOpportunityId } from "../stable-ids";
import { buildAskBundle } from "./ask-angles";
import type {
  EarnedBacklinkOpportunity,
  EarnedRejectedOpportunity,
} from "./types";

const VALUE_OK = new Set(["excellent", "strong", "good", "low", "none", "unknown"]);

function assertHonestWhy(why: string): boolean {
  const bad = [
    "because a backlink would help",
    "for seo",
    "to get a backlink",
    "link juice",
    "increase our da",
  ];
  const lower = why.toLowerCase();
  return !bad.some((b) => lower.includes(b)) && why.trim().length >= 40;
}

export function qualifyLiveHit(
  hit: LiveSearchHit,
):
  | { decision: "accept"; opportunity: EarnedBacklinkOpportunity }
  | { decision: "reject"; rejected: EarnedRejectedOpportunity } {
  const id = stableAuthorityOpportunityId({
    type: hit.type,
    domain: hit.domain,
    url: hit.url,
    targetPage: hit.relevantSgPage,
  });

  if (hit.provisionalDecision === "reject") {
    return {
      decision: "reject",
      rejected: {
        id,
        site: hit.organization,
        domain: hit.domain,
        opportunityUrl: hit.url,
        opportunityTitle: hit.title,
        type: hit.type,
        reason: hit.rejectReason ?? "Irrelevant",
        notes: hit.rejectNotes,
        discoveryQuery: hit.discoveryQuery,
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  if (!assertHonestWhy(hit.whyTheyMightLink)) {
    return {
      decision: "reject",
      rejected: {
        id,
        site: hit.organization,
        domain: hit.domain,
        opportunityUrl: hit.url,
        opportunityTitle: hit.title,
        type: hit.type,
        reason: "No editorial value",
        notes:
          "whyTheyMightLink failed honesty check (too short or link-begging framing).",
        discoveryQuery: hit.discoveryQuery,
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  const compliance = evaluateLinkSpamCompliance({
    opportunityDescription: hit.pageSummary,
    reasonWhyTheyMightLink: hit.whyTheyMightLink,
    acquisitionType: "EARNED",
    type: hit.type,
    primaryValueProposition: "editorial-citation",
    expectedLinkTreatment: "EDITORIAL",
    evidenceNotes: hit.evidenceNotes,
    discoveryQueries: [hit.discoveryQuery],
  });

  if (compliance.reject) {
    return {
      decision: "reject",
      rejected: {
        id,
        site: hit.organization,
        domain: hit.domain,
        opportunityUrl: hit.url,
        opportunityTitle: hit.title,
        type: hit.type,
        reason: "Paid link scheme",
        notes: compliance.reason,
        discoveryQuery: hit.discoveryQuery,
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  const scored = scoreOpportunity({
    relevance:
      hit.seoValue === "none"
        ? "low"
        : (VALUE_OK.has(hit.seoValue) ? hit.referralValue : "good"),
    editorialLegitimacy:
      hit.domain.endsWith(".gov") || hit.domain.endsWith(".edu")
        ? "excellent"
        : hit.referralValue === "excellent"
          ? "strong"
          : "good",
    audienceOverlap: hit.referralValue,
    referralValue: hit.referralValue,
    seoValue: hit.seoValue,
    targetPageFit: hit.relevantSgPage ? "strong" : "low",
    likelihood: hit.likelihood,
    effort: hit.effort,
    costBurden: "none",
    spamRisk: "none",
    notes: [
      "Live-verified earned opportunity — SEO and referral scored separately.",
      ...hit.evidenceNotes,
    ],
  });

  // Force relevance boost from pageSummary fit already in referral
  let band = scored.band as OpportunityScoreBand;
  let normalized = scored.normalized;
  if (band === "AVOID") {
    return {
      decision: "reject",
      rejected: {
        id,
        site: hit.organization,
        domain: hit.domain,
        opportunityUrl: hit.url,
        opportunityTitle: hit.title,
        type: hit.type,
        reason: "Spammy",
        notes: "Scoring returned AVOID",
        discoveryQuery: hit.discoveryQuery,
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  // Soft boost for curated resource lists with clear complementary fit
  if (
    hit.type === "RESOURCE_PAGE" &&
    hit.competitorGapClass === "COMPLEMENTARY" &&
    normalized < 72
  ) {
    normalized = Math.min(84, normalized + 8);
    if (normalized >= 70) band = "STRONG";
    else if (normalized >= 50) band = "GOOD";
  }

  const ask = buildAskBundle({
    opportunityUrl: hit.url,
    opportunityTitle: hit.title,
    type: hit.type,
    relevantSgPage: hit.relevantSgPage,
    contactPath: hit.contactPath,
    submissionPath: hit.submissionPath,
    whyTheyMightLink: hit.whyTheyMightLink,
  });

  const status =
    hit.contactPath || hit.submissionPath
      ? ("recommended" as const)
      : ("needs-contact-path" as const);

  return {
    decision: "accept",
    opportunity: {
      id,
      scoreBand: band,
      scoreNormalized: normalized,
      site: hit.organization,
      domain: hit.domain,
      opportunityUrl: hit.url,
      opportunityTitle: hit.title,
      type: hit.type,
      relevantSgPage: ask.targetPagePath,
      whyTheyMightLink: hit.whyTheyMightLink,
      seoValue: hit.seoValue,
      referralValue: hit.referralValue,
      difficulty: hit.difficulty,
      effort: hit.effort,
      likelihood: hit.likelihood,
      contactPath: hit.contactPath,
      submissionPath: hit.submissionPath,
      targetPageUrl: ask.targetPageUrl,
      targetPageName: ask.targetPageName,
      submitOrContactUrl: ask.submitOrContactUrl,
      howToSubmitOrRequest: ask.howToSubmitOrRequest,
      suggestedAsk: ask.suggestedAsk,
      competitorGapClass: hit.competitorGapClass,
      discoveryQuery: hit.discoveryQuery,
      verifiedAt: hit.verifiedAt,
      status,
      evidenceNotes: hit.evidenceNotes,
    },
  };
}

export function rankTopN(
  opportunities: EarnedBacklinkOpportunity[],
  n = 50,
): EarnedBacklinkOpportunity[] {
  const bandRank: Record<string, number> = {
    EXCELLENT: 0,
    STRONG: 1,
    GOOD: 2,
    LOW: 3,
    AVOID: 9,
  };
  const sorted = [...opportunities].sort((a, b) => {
    const br = bandRank[a.scoreBand] - bandRank[b.scoreBand];
    if (br !== 0) return br;
    // Prefer realistic likelihood over prestige SEO
    const lik = { high: 3, medium: 2, low: 1, "very-low": 0, unknown: 1 };
    const lr = (lik[b.likelihood] ?? 0) - (lik[a.likelihood] ?? 0);
    if (lr !== 0) return lr;
    return b.scoreNormalized - a.scoreNormalized;
  });
  return sorted.slice(0, n).map((o, i) => ({ ...o, priority: i + 1 }));
}
