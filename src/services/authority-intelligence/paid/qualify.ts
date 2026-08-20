import type { OpportunityScoreBand } from "@/domain/schemas/authority-intelligence";
import { evaluateLinkSpamCompliance } from "../compliance";
import { scoreOpportunity } from "../scoring";
import { stableAuthorityOpportunityId } from "../stable-ids";
import type {
  PaidAvoidOpportunity,
  PaidLiveHit,
  PaidPromotionOpportunity,
} from "./types";
import { LINK_SCHEME_AVOID_LABEL } from "./types";

function isLinkSchemePitch(hit: PaidLiveHit): boolean {
  const text = [
    hit.opportunity,
    hit.pageSummary,
    hit.whyWorthwhile,
    hit.avoidNotes ?? "",
    ...(hit.evidenceNotes ?? []),
  ]
    .join(" ")
    .toLowerCase();
  return (
    hit.avoidReason === LINK_SCHEME_AVOID_LABEL ||
    hit.avoidReason === "Paid SEO link primary" ||
    text.includes("guaranteed dofollow") ||
    text.includes("buy dofollow") ||
    text.includes("seo link juice") ||
    text.includes("pay for dofollow") ||
    (text.includes("dofollow") &&
      (text.includes("seo compounding") ||
        text.includes("backlink package") ||
        text.includes("guaranteed")))
  );
}

export function qualifyPaidHit(
  hit: PaidLiveHit,
):
  | { decision: "accept"; opportunity: PaidPromotionOpportunity }
  | { decision: "avoid"; avoided: PaidAvoidOpportunity } {
  const id = stableAuthorityOpportunityId({
    type: hit.type,
    domain: hit.domain,
    url: hit.url,
    targetPage: hit.targetSgPage ?? hit.channelName,
  });

  if (hit.provisionalDecision === "avoid" || isLinkSchemePitch(hit)) {
    return {
      decision: "avoid",
      avoided: {
        id,
        siteChannel: `${hit.organization} — ${hit.channelName}`,
        domain: hit.domain,
        opportunity: hit.opportunity,
        sourceUrl: hit.url,
        reason:
          hit.avoidReason === LINK_SCHEME_AVOID_LABEL || isLinkSchemePitch(hit)
            ? LINK_SCHEME_AVOID_LABEL
            : (hit.avoidReason ?? LINK_SCHEME_AVOID_LABEL),
        notes: hit.avoidNotes ?? hit.pageSummary.slice(0, 200),
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  // Paid must not claim editorial treatment for ranking
  if (hit.expectedLinkTreatment === "EDITORIAL") {
    return {
      decision: "avoid",
      avoided: {
        id,
        siteChannel: `${hit.organization} — ${hit.channelName}`,
        domain: hit.domain,
        opportunity: hit.opportunity,
        sourceUrl: hit.url,
        reason: LINK_SCHEME_AVOID_LABEL,
        notes:
          "Paid placement claiming EDITORIAL link treatment — reject; require sponsored/nofollow qualification.",
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  const compliance = evaluateLinkSpamCompliance({
    opportunityDescription: hit.pageSummary,
    reasonWhyTheyMightLink: hit.whyWorthwhile,
    estimatedCost: hit.costDisplay,
    acquisitionType: "PAID",
    type: hit.type,
    primaryValueProposition: "paid-exposure",
    expectedLinkTreatment: hit.expectedLinkTreatment,
    evidenceNotes: hit.evidenceNotes,
    discoveryQueries: [hit.discoveryQuery],
  });

  if (compliance.reject) {
    return {
      decision: "avoid",
      avoided: {
        id,
        siteChannel: `${hit.organization} — ${hit.channelName}`,
        domain: hit.domain,
        opportunity: hit.opportunity,
        sourceUrl: hit.url,
        reason: LINK_SCHEME_AVOID_LABEL,
        notes: compliance.reason,
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  const costBurden =
    hit.budgetTier === "€5,000+"
      ? "high"
      : hit.budgetTier === "€1,000–5,000"
        ? "medium"
        : hit.budgetTier === "€250–1,000"
          ? "low"
          : "none";

  const scored = scoreOpportunity({
    relevance: hit.audienceFit,
    editorialLegitimacy:
      hit.expectedLinkTreatment === "SPONSORED" ? "strong" : "good",
    audienceOverlap: hit.audienceFit,
    referralValue: hit.referralPotential,
    seoValue: "none", // paid ≠ SEO equity objective
    targetPageFit: hit.targetSgPage ? "strong" : "good",
    likelihood: "medium",
    effort: "small",
    costBurden,
    spamRisk: "low",
    notes: [
      "Paid promotion scored for exposure/referral/brand — SEO link value ignored by design.",
      ...hit.evidenceNotes,
    ],
  });

  let band = scored.band as OpportunityScoreBand;
  let normalized = scored.normalized;
  if (band === "AVOID") {
    return {
      decision: "avoid",
      avoided: {
        id,
        siteChannel: `${hit.organization} — ${hit.channelName}`,
        domain: hit.domain,
        opportunity: hit.opportunity,
        sourceUrl: hit.url,
        reason: LINK_SCHEME_AVOID_LABEL,
        notes: "Scoring forced AVOID",
        verifiedAt: hit.verifiedAt,
      },
    };
  }

  // Boost clear published pricing + strong audience fit
  if (
    hit.budgetTier !== "PRICE UNKNOWN" &&
    (hit.audienceFit === "excellent" || hit.audienceFit === "strong") &&
    normalized < 78
  ) {
    normalized = Math.min(86, normalized + 6);
    if (normalized >= 85) band = "EXCELLENT";
    else if (normalized >= 70) band = "STRONG";
  }

  const status =
    hit.budgetTier === "€1–250" ||
    hit.budgetTier === "€250–1,000" ||
    (hit.budgetTier === "€1,000–5,000" && hit.referralPotential !== "low")
      ? ("test-candidate" as const)
      : ("recommended" as const);

  return {
    decision: "accept",
    opportunity: {
      id,
      scoreBand: band,
      scoreNormalized: normalized,
      siteChannel: `${hit.organization} — ${hit.channelName}`,
      domain: hit.domain,
      audience: hit.audience,
      opportunity: hit.opportunity,
      type: hit.type,
      costDisplay: hit.costDisplay,
      budgetTier: hit.budgetTier,
      expectedLinkTreatment: hit.expectedLinkTreatment,
      seoLinkValue: hit.seoLinkValue,
      referralPotential: hit.referralPotential,
      brandValue: hit.brandValue,
      leadValue: hit.leadValue,
      audienceFit: hit.audienceFit,
      whyWorthwhile: hit.whyWorthwhile,
      sourceUrl: hit.url,
      verifiedAt: hit.verifiedAt,
      targetSgPage: hit.targetSgPage,
      estimatedReach: hit.estimatedReach,
      format: hit.format,
      status,
    },
  };
}

export function rankPaidOpportunities(
  opportunities: PaidPromotionOpportunity[],
): PaidPromotionOpportunity[] {
  const bandRank: Record<string, number> = {
    EXCELLENT: 0,
    STRONG: 1,
    GOOD: 2,
    LOW: 3,
    AVOID: 9,
  };
  const tierPrefer: Record<string, number> = {
    "€1–250": 0,
    "€250–1,000": 1,
    "€1,000–5,000": 2,
    "PRICE UNKNOWN": 3,
    "€5,000+": 4,
    "€0": 0,
  };
  return [...opportunities]
    .sort((a, b) => {
      const br = bandRank[a.scoreBand] - bandRank[b.scoreBand];
      if (br !== 0) return br;
      const tr =
        (tierPrefer[a.budgetTier] ?? 5) - (tierPrefer[b.budgetTier] ?? 5);
      if (tr !== 0) return tr;
      return b.scoreNormalized - a.scoreNormalized;
    })
    .map((o, i) => ({ ...o, priority: i + 1 }));
}
