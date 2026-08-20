/**
 * DiscoverAgent — find candidate authority / promotion opportunities.
 * Does NOT contact anyone, submit forms, or acquire links.
 */

import type { AuthorityOpportunity } from "@/domain/schemas/authority-intelligence";
import {
  AUTHORITY_OPPORTUNITY_SEEDS,
  DISCOVERY_QUERY_PACKS,
  type OpportunitySeed,
} from "./fixtures";
import { inventoryLinkableAssets, pickBestTargets } from "./linkable-assets";
import { stableAuthorityOpportunityId } from "./stable-ids";

export const DISCOVER_AGENT = {
  id: "authority-discover-agent",
  label: "AuthorityDiscoverAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
} as const;

export type DiscoverOptions = {
  generatedAt?: string;
  seeds?: OpportunitySeed[];
  /** Future: inject live search hits mapped to seeds */
  liveHits?: OpportunitySeed[];
};

export type DiscoverResult = {
  agent: typeof DISCOVER_AGENT;
  generatedAt: string;
  opportunities: AuthorityOpportunity[];
  queryPacks: typeof DISCOVERY_QUERY_PACKS;
  linkableAssetCount: number;
  notes: string[];
};

function resolveTargetPage(
  seed: OpportunitySeed,
  preferredPaths: string[],
): string | undefined {
  if (seed.targetSoftwareGlimpsePage) return seed.targetSoftwareGlimpsePage;
  if (seed.targetAssetHints?.length) {
    const assets = inventoryLinkableAssets();
    for (const hint of seed.targetAssetHints) {
      const match = assets.find(
        (a) =>
          a.path.includes(hint) ||
          a.name.toLowerCase().includes(hint.replace(/-/g, " ")),
      );
      if (match) return match.path;
    }
  }
  // Do not invent homepage/deep-link targets for spam fixtures or untargeted seeds.
  if (seed.primaryValueProposition === "link-equity-purchase") {
    return undefined;
  }
  // Prefer a strong linkable asset over homepage when the seed implies promotion.
  if (
    seed.primaryValueProposition === "tool-or-resource-utility" ||
    seed.primaryValueProposition === "audience-exposure" ||
    seed.primaryValueProposition === "editorial-citation"
  ) {
    return preferredPaths[0];
  }
  return undefined;
}

export function seedToOpportunity(
  seed: OpportunitySeed,
  generatedAt: string,
  preferredPaths: string[],
): AuthorityOpportunity {
  const target = resolveTargetPage(seed, preferredPaths);
  const id = stableAuthorityOpportunityId({
    type: seed.type,
    domain: seed.domain,
    url: seed.opportunityUrl ?? seed.url,
    targetPage: target,
  });

  return {
    id,
    type: seed.type,
    acquisitionType: seed.acquisitionType,
    domain: seed.domain,
    organization: seed.organization,
    url: seed.url,
    opportunityUrl: seed.opportunityUrl,
    targetSoftwareGlimpsePage: target,
    targetCluster: seed.targetCluster,
    targetAssetIds: [],
    relevance: seed.relevance,
    audienceFit: seed.audienceFit,
    opportunityDescription: seed.opportunityDescription,
    reasonWhyTheyMightLink: seed.reasonWhyTheyMightLink,
    suggestedPitchAngle: seed.suggestedPitchAngle,
    expectedLinkTreatment: seed.expectedLinkTreatment,
    likelyFollowStatus: seed.likelyFollowStatus,
    seoValue: seed.seoValue,
    referralValue: seed.referralValue,
    brandValue: seed.brandValue,
    relationshipValue: seed.relationshipValue,
    estimatedEffort: seed.estimatedEffort,
    estimatedCost: seed.estimatedCost,
    recurringCost: seed.recurringCost,
    difficulty: seed.difficulty,
    likelihood: seed.likelihood,
    sourceQuality: seed.sourceQuality,
    spamRisk: seed.spamRisk,
    contactPath: seed.contactPath,
    submissionPath: seed.submissionPath,
    promotionChannels: seed.promotionChannels,
    scoreBand: "LOW",
    complianceFlags: [],
    discoveryQueries: seed.discoveryQueries,
    evidenceNotes: seed.evidenceNotes,
    discoveredAt: generatedAt,
    status: "discovered",
    primaryValueProposition: seed.primaryValueProposition,
  };
}

export function runDiscoverAgent(opts: DiscoverOptions = {}): DiscoverResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const assets = inventoryLinkableAssets();
  const preferred = pickBestTargets(assets, 10).map((a) => a.path);
  const seeds = [
    ...(opts.seeds ?? AUTHORITY_OPPORTUNITY_SEEDS),
    ...(opts.liveHits ?? []),
  ];

  const opportunities = seeds.map((s) =>
    seedToOpportunity(s, generatedAt, preferred),
  );

  return {
    agent: DISCOVER_AGENT,
    generatedAt,
    opportunities,
    queryPacks: DISCOVERY_QUERY_PACKS,
    linkableAssetCount: assets.length,
    notes: [
      "Discovery is evaluate-only — no outreach, purchases, or form submissions.",
      "Seed catalog provides deterministic CRM-niche hypotheses; live web search can append via liveHits.",
      "Prefer deep links to tools/resources over the homepage.",
      `Query packs available for manual/live search: ${DISCOVERY_QUERY_PACKS.length}.`,
    ],
  };
}
