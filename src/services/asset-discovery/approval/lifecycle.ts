import type {
  ApprovedAssetCandidate,
  AssetApprovalLifecycleStage,
  AssetEntityMapping,
  AssetPlacementRecommendation,
  AssetUsageState,
  DiscoveredAsset,
} from "@/domain";
import {
  APPROVED_ASSET_WORKFLOW_VERSION,
  ApprovedAssetCandidateSchema,
  AssetPlacementRecommendationSchema,
} from "@/domain";
import type { OfficialSourceKind } from "@/domain";
import type { AssetRecommendationAction } from "@/domain/schemas/asset-discovery";
import type { UsageRightsStatus } from "@/domain/schemas/asset-discovery";
import { parseVideoSourceUrl } from "@/services/product-media";
import { verifyOfficialSource as verifyVendorSource } from "@/services/asset-discovery/verify";

function nowIso(override?: string): string {
  return override ?? new Date().toISOString();
}

function slugId(parts: string[]): string {
  return parts
    .map((p) =>
      p.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    )
    .filter(Boolean)
    .join("-")
    .slice(0, 120);
}

function pushHistory(
  candidate: ApprovedAssetCandidate,
  stage: AssetApprovalLifecycleStage,
  note?: string,
  actor?: string,
  at?: string,
): ApprovedAssetCandidate {
  const ts = nowIso(at);
  return ApprovedAssetCandidateSchema.parse({
    ...candidate,
    stage,
    updatedAt: ts,
    stageHistory: [
      ...candidate.stageHistory,
      { stage, at: ts, note, actor },
    ],
  });
}

const STAGE_ORDER: AssetApprovalLifecycleStage[] = [
  "DISCOVERED",
  "SOURCE_VERIFIED",
  "RELEVANCE_REVIEWED",
  "USAGE_REVIEWED",
  "MAPPED",
  "EDITORIALLY_APPROVED",
  "ACTIVE",
];

export function stageIndex(stage: AssetApprovalLifecycleStage): number {
  if (stage === "REJECTED") return -1;
  return STAGE_ORDER.indexOf(stage);
}

export function assertCanAdvance(
  current: AssetApprovalLifecycleStage,
  target: AssetApprovalLifecycleStage,
): { ok: true } | { ok: false; message: string } {
  if (current === "REJECTED") {
    return { ok: false, message: "Candidate is REJECTED" };
  }
  if (target === "REJECTED") return { ok: true };
  const ci = stageIndex(current);
  const ti = stageIndex(target);
  if (ti < 0 || ci < 0) {
    return { ok: false, message: `Invalid stage transition ${current} → ${target}` };
  }
  // Allow same stage (idempotent) or next stage, or skip-forward only one at a time
  if (ti === ci || ti === ci + 1) return { ok: true };
  // Allow re-running earlier gates only when already past them (re-verify)
  if (ti < ci) return { ok: true };
  return {
    ok: false,
    message: `Cannot jump from ${current} to ${target} — advance one gate at a time`,
  };
}

export type RegisterCandidateInput = {
  id?: string;
  discoveredAsset?: DiscoveredAsset;
  title?: string;
  sourceUrl?: string;
  assetType?: DiscoveredAsset["assetType"];
  mediaFormat?: DiscoveredAsset["mediaFormat"];
  productSlug?: string;
  sourceOrganization?: string;
  whatThisShows?: string[];
  discoveredAssetId?: string;
  opportunityId?: string;
  actor?: string;
};

/**
 * Register a discovery recommendation into the approval queue.
 * Does NOT write ResearchMedia. Stage = DISCOVERED.
 */
export function registerApprovedAssetCandidate(
  input: RegisterCandidateInput,
):
  | { ok: true; candidate: ApprovedAssetCandidate }
  | { ok: false; message: string } {
  const asset = input.discoveredAsset;
  const title = (input.title ?? asset?.title)?.trim();
  const sourceUrl = input.sourceUrl ?? asset?.sourceUrl;
  if (!title || !sourceUrl) {
    return {
      ok: false,
      message: "title and sourceUrl are required (or pass discoveredAsset)",
    };
  }

  const parsed = parseVideoSourceUrl(sourceUrl);
  const productSlug =
    input.productSlug ?? asset?.productIds[0] ?? "unknown-product";
  const id =
    input.id ??
    slugId([
      "cand",
      productSlug,
      parsed?.videoId ?? "asset",
      title.slice(0, 40),
    ]);

  const at = nowIso();
  const mapping: AssetEntityMapping = {
    productIds: asset?.productIds?.length
      ? asset.productIds
      : productSlug !== "unknown-product"
        ? [productSlug]
        : [],
    featureIds: asset?.featureIds ?? [],
    capabilityIds: asset?.capabilityIds ?? [],
    requirementIds: asset?.requirementIds ?? [],
    useCaseIds: asset?.useCaseIds ?? [],
    industryIds: asset?.industryIds ?? [],
    guideIds: [],
  };

  const candidate = ApprovedAssetCandidateSchema.parse({
    id,
    workflowVersion: APPROVED_ASSET_WORKFLOW_VERSION,
    discoveredAssetId: input.discoveredAssetId ?? asset?.id,
    opportunityId: input.opportunityId ?? asset?.opportunityId,
    title,
    sourceUrl: parsed?.sourceUrl ?? sourceUrl,
    canonicalSourceUrl: asset?.canonicalSourceUrl ?? parsed?.sourceUrl,
    assetType: input.assetType ?? asset?.assetType ?? "official-product-video",
    mediaFormat:
      input.mediaFormat ??
      asset?.mediaFormat ??
      (parsed ? "video" : "page"),
    provider: parsed?.provider,
    providerId: parsed?.videoId,
    sourceOrganization:
      input.sourceOrganization ?? asset?.sourceOrganization,
    stage: "DISCOVERED",
    usageState: "not-used",
    officialSource: false,
    mapping,
    whatThisShows: input.whatThisShows ?? asset?.whatItShows ?? [],
    limitations: [],
    placementIds: [],
    createdAt: at,
    updatedAt: at,
    stageHistory: [
      {
        stage: "DISCOVERED",
        at,
        note: "Registered from discovery — not approved, not imported",
        actor: input.actor,
      },
    ],
  });

  return { ok: true, candidate };
}

export function verifyCandidateSource(
  candidate: ApprovedAssetCandidate,
  opts: {
    officialSourceKind: OfficialSourceKind;
    productSlug?: string;
    sourceOrganization?: string;
    channelName?: string;
    actor?: string;
  },
):
  | { ok: true; candidate: ApprovedAssetCandidate }
  | { ok: false; message: string } {
  const gate = assertCanAdvance(candidate.stage, "SOURCE_VERIFIED");
  if (!gate.ok) return gate;

  const productSlug =
    opts.productSlug ?? candidate.mapping.productIds[0] ?? undefined;
  const verification = verifyVendorSource({
    sourceUrl: candidate.sourceUrl,
    productSlug,
    claimedChannelName: opts.channelName ?? candidate.channelName,
    researcherConfirmedOfficialChannel: true,
  });

  if (!verification.officialSource) {
    return {
      ok: false,
      message: `Source verification failed (confidence=${verification.confidence}): ${verification.notes.join("; ") || "not official"}`,
    };
  }

  let next = pushHistory(
    {
      ...candidate,
      officialSource: true,
      officialSourceKind: opts.officialSourceKind,
      sourceOrganization:
        opts.sourceOrganization ?? candidate.sourceOrganization,
      channelName: opts.channelName ?? candidate.channelName,
      sourceVerification: verification,
    },
    "SOURCE_VERIFIED",
    "Official vendor source confirmed",
    opts.actor,
  );
  return { ok: true, candidate: next };
}

export function reviewCandidateRelevance(
  candidate: ApprovedAssetCandidate,
  opts: {
    passed: boolean;
    notes?: string;
    whatThisShows?: string[];
    actor?: string;
  },
):
  | { ok: true; candidate: ApprovedAssetCandidate }
  | { ok: false; message: string } {
  if (!opts.passed) {
    return {
      ok: true,
      candidate: pushHistory(
        {
          ...candidate,
          relevancePassed: false,
          relevanceNotes: opts.notes,
          rejectedReason: opts.notes ?? "Failed relevance review",
        },
        "REJECTED",
        "Relevance review failed",
        opts.actor,
      ),
    };
  }

  const gate = assertCanAdvance(candidate.stage, "RELEVANCE_REVIEWED");
  if (!gate.ok) return gate;
  if (candidate.stage === "DISCOVERED") {
    return {
      ok: false,
      message: "Complete SOURCE_VERIFIED before relevance review",
    };
  }

  const whatThisShows = (
    opts.whatThisShows ?? candidate.whatThisShows
  ).filter((s) => s.trim());

  return {
    ok: true,
    candidate: pushHistory(
      {
        ...candidate,
        relevancePassed: true,
        relevanceNotes: opts.notes,
        whatThisShows:
          whatThisShows.length > 0 ? whatThisShows : candidate.whatThisShows,
      },
      "RELEVANCE_REVIEWED",
      opts.notes ?? "Relevance accepted",
      opts.actor,
    ),
  };
}

export function reviewCandidateUsage(
  candidate: ApprovedAssetCandidate,
  opts: {
    recommendation: AssetRecommendationAction;
    usageRightsStatus?: UsageRightsStatus;
    notes?: string;
    actor?: string;
  },
):
  | { ok: true; candidate: ApprovedAssetCandidate }
  | { ok: false; message: string } {
  if (opts.recommendation === "do-not-use") {
    return {
      ok: true,
      candidate: pushHistory(
        {
          ...candidate,
          usageRecommendation: "do-not-use",
          usageRightsStatus: opts.usageRightsStatus,
          usageReviewNotes: opts.notes,
          rejectedReason: opts.notes ?? "Usage review: do-not-use",
        },
        "REJECTED",
        "Usage review rejected asset",
        opts.actor,
      ),
    };
  }

  const gate = assertCanAdvance(candidate.stage, "USAGE_REVIEWED");
  if (!gate.ok) return gate;
  if (stageIndex(candidate.stage) < stageIndex("RELEVANCE_REVIEWED")) {
    return {
      ok: false,
      message: "Complete RELEVANCE_REVIEWED before usage review",
    };
  }

  return {
    ok: true,
    candidate: pushHistory(
      {
        ...candidate,
        usageRecommendation: opts.recommendation,
        usageRightsStatus: opts.usageRightsStatus,
        usageReviewNotes: opts.notes,
      },
      "USAGE_REVIEWED",
      opts.notes ?? `Usage: ${opts.recommendation}`,
      opts.actor,
    ),
  };
}

export function mapCandidateEntities(
  candidate: ApprovedAssetCandidate,
  opts: {
    mapping: Partial<AssetEntityMapping>;
    actor?: string;
  },
):
  | { ok: true; candidate: ApprovedAssetCandidate }
  | { ok: false; message: string } {
  const gate = assertCanAdvance(candidate.stage, "MAPPED");
  if (!gate.ok) return gate;
  if (stageIndex(candidate.stage) < stageIndex("USAGE_REVIEWED")) {
    return {
      ok: false,
      message: "Complete USAGE_REVIEWED before entity mapping",
    };
  }

  const mapping: AssetEntityMapping = {
    productIds: [
      ...new Set([
        ...(opts.mapping.productIds ?? candidate.mapping.productIds),
      ]),
    ],
    featureIds: [
      ...new Set([
        ...(opts.mapping.featureIds ?? candidate.mapping.featureIds),
      ]),
    ],
    capabilityIds: [
      ...new Set([
        ...(opts.mapping.capabilityIds ?? candidate.mapping.capabilityIds),
      ]),
    ],
    requirementIds: [
      ...new Set([
        ...(opts.mapping.requirementIds ?? candidate.mapping.requirementIds),
      ]),
    ],
    useCaseIds: [
      ...new Set([
        ...(opts.mapping.useCaseIds ?? candidate.mapping.useCaseIds),
      ]),
    ],
    industryIds: [
      ...new Set([
        ...(opts.mapping.industryIds ?? candidate.mapping.industryIds),
      ]),
    ],
    guideIds: [
      ...new Set([...(opts.mapping.guideIds ?? candidate.mapping.guideIds)]),
    ],
  };

  if (mapping.productIds.length === 0) {
    return {
      ok: false,
      message: "At least one productId is required for mapping",
    };
  }

  return {
    ok: true,
    candidate: pushHistory(
      { ...candidate, mapping },
      "MAPPED",
      "Entity mapping recorded",
      opts.actor,
    ),
  };
}

export function editorialApproveCandidate(
  candidate: ApprovedAssetCandidate,
  opts?: { commentary?: string; actor?: string },
):
  | { ok: true; candidate: ApprovedAssetCandidate }
  | { ok: false; message: string } {
  const gate = assertCanAdvance(candidate.stage, "EDITORIALLY_APPROVED");
  if (!gate.ok) return gate;
  if (stageIndex(candidate.stage) < stageIndex("MAPPED")) {
    return {
      ok: false,
      message: "Complete MAPPED before editorial approval",
    };
  }
  if (!candidate.officialSource) {
    return { ok: false, message: "Official source required" };
  }
  if (candidate.whatThisShows.filter((s) => s.trim()).length === 0) {
    return {
      ok: false,
      message: "Grounded whatThisShows required before editorial approval",
    };
  }

  return {
    ok: true,
    candidate: pushHistory(
      {
        ...candidate,
        editorialCommentary:
          opts?.commentary ?? candidate.editorialCommentary,
        usageState: "approved",
      },
      "EDITORIALLY_APPROVED",
      "Editorial approval granted — eligible for import",
      opts?.actor,
    ),
  };
}

export function markCandidateUsageState(
  candidate: ApprovedAssetCandidate,
  usageState: AssetUsageState,
  opts?: { actor?: string; note?: string },
): ApprovedAssetCandidate {
  const at = nowIso();
  return ApprovedAssetCandidateSchema.parse({
    ...candidate,
    usageState,
    updatedAt: at,
    stageHistory: [
      ...candidate.stageHistory,
      {
        stage: candidate.stage,
        at,
        note: opts?.note ?? `Usage state → ${usageState}`,
        actor: opts?.actor,
      },
    ],
  });
}

export function addPlacementRecommendation(
  candidate: ApprovedAssetCandidate,
  input: {
    pageRoute: string;
    pageType: string;
    sectionId: string;
    sectionTitle: string;
    subsection?: string;
    mediaPlacement?: AssetPlacementRecommendation["mediaPlacement"];
    recommendedUse: AssetRecommendationAction;
    reason: string;
    id?: string;
  },
): {
  candidate: ApprovedAssetCandidate;
  placement: AssetPlacementRecommendation;
} {
  const at = nowIso();
  const placement = AssetPlacementRecommendationSchema.parse({
    id:
      input.id ??
      slugId([
        "place",
        candidate.id,
        input.pageRoute,
        input.sectionId,
        input.subsection ?? "",
      ]),
    candidateId: candidate.id,
    mediaId: candidate.importedMediaId ?? candidate.reusedMediaId,
    pageRoute: input.pageRoute.endsWith("/")
      ? input.pageRoute
      : `${input.pageRoute}/`,
    pageType: input.pageType,
    sectionId: input.sectionId,
    sectionTitle: input.sectionTitle,
    subsection: input.subsection,
    mediaPlacement: input.mediaPlacement,
    recommendedUse: input.recommendedUse,
    reason: input.reason,
    status: "recommended",
    createdAt: at,
  });

  const next = ApprovedAssetCandidateSchema.parse({
    ...candidate,
    placementIds: [...new Set([...candidate.placementIds, placement.id])],
    updatedAt: at,
  });

  return { candidate: next, placement };
}
