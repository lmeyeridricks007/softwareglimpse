import type { LinkableAsset } from "@/domain/schemas/authority-intelligence";
import type { EarnedBacklinkReport } from "../earned/types";
import type { PaidPromotionReport } from "../paid/types";
import type { DigitalPrReport } from "../digital-pr/types";
import type { PartnershipReport } from "../partnership/types";
import type { ContentPromotionReport } from "../promotion/types";
import type { PresenceReport } from "../presence/types";

export type ExecutiveScorecard = {
  authorityReadiness: string;
  linkableAssetStrength: string;
  earnedLinkOpportunity: string;
  promotionCoverage: string;
  partnershipOpportunity: string;
  digitalPrReadiness: string;
  currentExternalAuthority: string;
  notes: string[];
};

function band(score: number): string {
  if (score >= 85) return "EXCELLENT";
  if (score >= 70) return "STRONG";
  if (score >= 55) return "GOOD";
  if (score >= 40) return "LOW";
  return "WEAK";
}

export function buildExecutiveScorecard(input: {
  linkableAssets: LinkableAsset[];
  earned: EarnedBacklinkReport;
  paid: PaidPromotionReport;
  digitalPr: DigitalPrReport;
  partnerships: PartnershipReport;
  promotion: ContentPromotionReport;
  presence: PresenceReport;
  acquisitionCount: number;
}): ExecutiveScorecard {
  const notes: string[] = [];

  const excellentAssets = input.linkableAssets.filter(
    (a) => a.linkability === "excellent" || a.linkability === "strong",
  ).length;
  const linkableScore = Math.min(
    100,
    Math.round((excellentAssets / Math.max(1, input.linkableAssets.length)) * 100),
  );

  const earnedScore = Math.min(
    100,
    40 + input.earned.accepted.length * 1.2,
  );
  const promoScore = Math.min(100, 35 + input.promotion.plans.length * 3);
  const partnerScore = Math.min(
    100,
    40 + input.partnerships.accepted.length * 3,
  );
  const prReady = input.digitalPr.ideas.filter(
    (i) => i.status === "ready" || i.status === "near-ready",
  ).length;
  const prScore = Math.min(100, 40 + prReady * 8);
  const presenceScore = Math.min(
    100,
    45 + input.presence.accepted.length * 5,
  );

  const readiness = Math.round(
    (linkableScore +
      earnedScore +
      promoScore +
      partnerScore +
      prScore +
      presenceScore) /
      6,
  );

  let external = "UNKNOWN — no verified backlink acquisition dataset";
  if (input.acquisitionCount > 0) {
    external = `PARTIAL — ${input.acquisitionCount} recorded acquisition(s) with evidence`;
    notes.push(
      "Current External Authority uses only recorded acquisitions — not third-party DA/DR.",
    );
  } else {
    notes.push(
      "No link acquisitions recorded yet (docs/authority/tracking/link-acquisitions.json empty).",
    );
  }

  notes.push(
    `Paid opportunities catalogued: ${input.paid.accepted.length} (tests only — not purchases).`,
  );

  return {
    authorityReadiness: band(readiness),
    linkableAssetStrength: band(linkableScore),
    earnedLinkOpportunity: band(earnedScore),
    promotionCoverage: band(promoScore),
    partnershipOpportunity: band(partnerScore),
    digitalPrReadiness: band(prScore),
    currentExternalAuthority: external,
    notes,
  };
}
