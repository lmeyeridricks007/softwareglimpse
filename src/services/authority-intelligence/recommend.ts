/**
 * RecommendAgent — prioritized free-first vs paid-exposure recommendations.
 * Never executes outreach.
 */

import type {
  AuthorityOpportunity,
  ContentAssetGapForLinks,
  LinkableAsset,
} from "@/domain/schemas/authority-intelligence";
import { isFreeAcquisition } from "./compliance";
import { stableContentGapId } from "./stable-ids";

export const RECOMMEND_AGENT = {
  id: "authority-recommend-agent",
  label: "AuthorityRecommendAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
} as const;

const BAND_ORDER: Record<AuthorityOpportunity["scoreBand"], number> = {
  EXCELLENT: 0,
  STRONG: 1,
  GOOD: 2,
  LOW: 3,
  AVOID: 9,
};

export type RecommendResult = {
  agent: typeof RECOMMEND_AGENT;
  generatedAt: string;
  opportunities: AuthorityOpportunity[];
  freeFirst: AuthorityOpportunity[];
  paidExposure: AuthorityOpportunity[];
  avoid: AuthorityOpportunity[];
  contentGapsForLinks: ContentAssetGapForLinks[];
  topLinkableAssets: LinkableAsset[];
  notes: string[];
};

export function buildContentGapsForLinks(): ContentAssetGapForLinks[] {
  return [
    {
      id: stableContentGapId("Original CRM pricing research dataset"),
      title: "Original CRM pricing / packaging research dataset",
      description:
        "Publish citeable pricing methodology + anonymized plan comparisons so journalists and educators have a primary source.",
      linkMagnetPotential: "excellent",
      relatedOpportunityTypes: ["DATA_CITATION", "JOURNALIST_SOURCE", "REFERENCE_LINK"],
      suggestedCluster: "crm",
    },
    {
      id: stableContentGapId("CRM selection visual framework"),
      title: "CRM selection visual decision framework",
      description:
        "One shareable visual framework (journey map / decision tree) linking Finder → Scorecard → Cost tools.",
      linkMagnetPotential: "strong",
      relatedOpportunityTypes: ["RESOURCE_PAGE", "NEWSLETTER", "TEMPLATE_CITATION"],
      suggestedCluster: "crm",
    },
    {
      id: stableContentGapId("Annual CRM evaluation statistics"),
      title: "Annual SoftwareGlimpse CRM evaluation statistics",
      description:
        "Aggregated, privacy-safe stats from tool usage (e.g. common requirement patterns) for earned media citations.",
      linkMagnetPotential: "excellent",
      relatedOpportunityTypes: ["DATA_CITATION", "PR_OUTREACH", "PODCAST"],
      suggestedCluster: "crm",
    },
    {
      id: stableContentGapId("Migration playbook PDF"),
      title: "CRM migration playbook (downloadable)",
      description:
        "Combine migration planner + checklists into a citeable playbook for partner and association libraries.",
      linkMagnetPotential: "strong",
      relatedOpportunityTypes: ["TEMPLATE_CITATION", "VENDOR_ECOSYSTEM", "ASSOCIATION"],
      suggestedCluster: "crm",
    },
  ];
}

export function runRecommendAgent(
  opportunities: AuthorityOpportunity[],
  linkableAssets: LinkableAsset[],
  opts: { generatedAt?: string } = {},
): RecommendResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();

  const sorted = [...opportunities].sort((a, b) => {
    const band = BAND_ORDER[a.scoreBand] - BAND_ORDER[b.scoreBand];
    if (band !== 0) return band;
    return (b.scoreNormalized ?? 0) - (a.scoreNormalized ?? 0);
  });

  const recommended = sorted.map((opp) => {
    if (opp.scoreBand === "AVOID" || opp.status === "avoid") {
      return { ...opp, status: "avoid" as const };
    }
    return { ...opp, status: "recommended" as const };
  });

  const avoid = recommended.filter(
    (o) => o.scoreBand === "AVOID" || o.status === "avoid",
  );
  const actionable = recommended.filter((o) => o.scoreBand !== "AVOID");

  const freeFirst = actionable
    .filter((o) => isFreeAcquisition(o.acquisitionType))
    .filter((o) => o.scoreBand === "EXCELLENT" || o.scoreBand === "STRONG" || o.scoreBand === "GOOD");

  const paidExposure = actionable.filter(
    (o) =>
      o.acquisitionType === "PAID" &&
      (o.primaryValueProposition === "paid-exposure" ||
        o.primaryValueProposition === "audience-exposure" ||
        o.expectedLinkTreatment === "SPONSORED" ||
        o.expectedLinkTreatment === "NOFOLLOW"),
  );

  const topLinkableAssets = [...linkableAssets]
    .filter((a) => a.kind !== "homepage" && a.status === "available")
    .filter(
      (a) =>
        a.linkability === "excellent" ||
        a.linkability === "strong" ||
        a.linkability === "good",
    )
    .slice(0, 15);

  return {
    agent: RECOMMEND_AGENT,
    generatedAt,
    opportunities: recommended,
    freeFirst,
    paidExposure,
    avoid,
    contentGapsForLinks: buildContentGapsForLinks(),
    topLinkableAssets,
    notes: [
      "Pursue freeFirst before paidExposure.",
      "AVOID list is non-negotiable under link-spam policy.",
      "Recommendations never auto-send email or submit listings.",
    ],
  };
}
