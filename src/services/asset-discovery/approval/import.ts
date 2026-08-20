import type {
  ApprovedAssetCandidate,
  ApprovedAssetImportResult,
  ProductMedia,
  ResearchSource,
} from "@/domain";
import {
  ApprovedAssetCandidateSchema,
  ApprovedAssetImportResultSchema,
  ProductMediaSchema,
  ResearchSourceSchema,
} from "@/domain";
import {
  loadEnrichment,
  loadManualSources,
  saveManualSources,
} from "@/data/research/store";
import { findDuplicateResearchMedia } from "@/services/feature-media-research/duplicates";
import {
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
} from "@/services/feature-media-research/persist";
import {
  enrichMediaFromSourceUrl,
  parseVideoSourceUrl,
} from "@/services/product-media";
import { evaluateMediaGovernance } from "@/services/product-media/governance";
import {
  listPlacementRecommendations,
  savePlacementRecommendation,
} from "./store";

function nowIso(): string {
  return new Date().toISOString();
}

function isVideoCandidate(c: ApprovedAssetCandidate): boolean {
  return (
    c.mediaFormat === "video" ||
    c.mediaFormat === "embed" ||
    Boolean(parseVideoSourceUrl(c.sourceUrl))
  );
}

function researchMediaType(
  c: ApprovedAssetCandidate,
): ProductMedia["type"] {
  if (c.assetType === "official-tutorial") return "official-tutorial";
  if (c.assetType === "official-webinar") return "official-webinar";
  if (c.assetType === "official-customer-story") {
    return "official-customer-case-study";
  }
  return "official-video";
}

function mapPlacements(
  c: ApprovedAssetCandidate,
): ProductMedia["placements"] {
  const places = listPlacementRecommendations({ candidateId: c.id });
  const buckets = new Set<ProductMedia["placements"][number]>();
  for (const p of places) {
    if (p.mediaPlacement) buckets.add(p.mediaPlacement);
  }
  return [...buckets];
}

function buildMediaFromCandidate(
  c: ApprovedAssetCandidate,
  existing?: ProductMedia,
): ProductMedia {
  const parsed = parseVideoSourceUrl(c.sourceUrl);
  if (!parsed && !existing) {
    throw new Error("Cannot build ResearchMedia without parseable video URL");
  }
  const productSlug = c.mapping.productIds[0]!;
  const base = existing
    ? { ...existing }
    : {
        id:
          c.importedMediaId ??
          `approved-${c.id}`.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120),
        productSlug,
        type: researchMediaType(c),
        provider: parsed!.provider,
        sourceUrl: parsed!.sourceUrl,
        videoId: parsed!.videoId,
        providerId: parsed!.videoId,
        embedUrl: parsed!.embedUrl,
        thumbnailUrl: parsed!.thumbnailUrl,
        officialSource: false,
        verifiedAt: nowIso(),
        sourceHealth: "unknown" as const,
        refreshFlags: [] as ProductMedia["refreshFlags"],
        embeddingAllowed: parsed!.embeddingSupported,
        evidenceRefs: [],
        evidenceClaimIds: [],
        evidenceClaimKinds: [] as ProductMedia["evidenceClaimKinds"],
        demonstratedDimensionIds: [],
        requirementCriterionIds: [],
        workflowStageIds: [],
        reportedOutcomes: [],
        limitations: [] as string[],
        whatToNotice: [] as string[],
      };

  return ProductMediaSchema.parse(
    enrichMediaFromSourceUrl({
      ...base,
      title: c.title,
      sourceOrganization: c.sourceOrganization,
      channelName: c.channelName,
      officialSource: true,
      officialSourceKind: c.officialSourceKind,
      verifiedAt: nowIso(),
      lastCheckedAt: nowIso(),
      productIds: c.mapping.productIds,
      featureIds: c.mapping.featureIds,
      capabilityIds: c.mapping.capabilityIds,
      requirementIds: c.mapping.requirementIds,
      useCaseIds: c.mapping.useCaseIds,
      industryIds: c.mapping.industryIds,
      guideIds: c.mapping.guideIds,
      whatThisShows: c.whatThisShows,
      limitations: c.limitations,
      editorialCommentary: c.editorialCommentary,
      placements: mapPlacements(c),
      purpose: c.relevanceNotes,
      status: "needs-review",
      embeddingAllowed:
        c.usageRecommendation === "link" || c.usageRecommendation === "cite"
          ? false
          : (existing?.embeddingAllowed ??
            parsed?.embeddingSupported ??
            true),
    }),
  );
}

function findDuplicateSource(
  url: string,
  existing: ResearchSource[],
): ResearchSource | null {
  const key = url.replace(/\/$/, "").toLowerCase();
  for (const s of existing) {
    if (!s.url) continue;
    if (s.url.replace(/\/$/, "").toLowerCase() === key) return s;
  }
  return null;
}

function buildSourceFromCandidate(c: ApprovedAssetCandidate): ResearchSource {
  const productSlug = c.mapping.productIds[0];
  return ResearchSourceSchema.parse({
    id:
      c.importedSourceId ??
      `approved-src-${c.id}`.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120),
    productSlug,
    url: c.canonicalSourceUrl ?? c.sourceUrl,
    title: c.title,
    publisher: c.sourceOrganization,
    sourceType: "official-documentation",
    authority: "first-party",
    verifiedAt: nowIso(),
    lastCheckedAt: nowIso(),
    status: "candidate",
    notes: c.editorialCommentary ?? c.relevanceNotes,
    domains: ["official-media"],
  });
}

/**
 * Import an EDITORIALLY_APPROVED candidate into ResearchMedia or ResearchSource.
 * Dedupes by providerId / sourceUrl. Never auto-activates unless activate=true.
 */
export function importApprovedAsset(
  candidate: ApprovedAssetCandidate,
  opts?: {
    persist?: boolean;
    activate?: boolean;
    dryRun?: boolean;
  },
): {
  result: ApprovedAssetImportResult;
  candidate: ApprovedAssetCandidate;
  media?: ProductMedia;
  source?: ResearchSource;
} {
  if (candidate.stage !== "EDITORIALLY_APPROVED" && candidate.stage !== "ACTIVE") {
    return {
      result: ApprovedAssetImportResultSchema.parse({
        ok: false,
        candidateId: candidate.id,
        action: "blocked",
        message: `Import requires EDITORIALLY_APPROVED (got ${candidate.stage})`,
        persisted: false,
        activated: false,
      }),
      candidate,
    };
  }

  const productSlug = candidate.mapping.productIds[0];
  if (!productSlug) {
    return {
      result: ApprovedAssetImportResultSchema.parse({
        ok: false,
        candidateId: candidate.id,
        action: "blocked",
        message: "productIds[0] required for import",
        persisted: false,
        activated: false,
      }),
      candidate,
    };
  }

  if (opts?.dryRun) {
    return {
      result: ApprovedAssetImportResultSchema.parse({
        ok: true,
        candidateId: candidate.id,
        action: "dry-run",
        message: "Dry run — no enrichment writes",
        persisted: false,
        activated: false,
      }),
      candidate,
    };
  }

  // --- Video → ResearchMedia ---
  if (isVideoCandidate(candidate)) {
    const enrichment = loadEnrichment(productSlug);
    if (!enrichment) {
      return {
        result: ApprovedAssetImportResultSchema.parse({
          ok: false,
          candidateId: candidate.id,
          action: "blocked",
          message: `No enrichment.json for ${productSlug}`,
          persisted: false,
          activated: false,
        }),
        candidate,
      };
    }

    const existingCatalog = listEnrichmentMedia(productSlug);
    const parsed = parseVideoSourceUrl(candidate.sourceUrl);
    const duplicate = findDuplicateResearchMedia(
      {
        id: "",
        provider: parsed?.provider ?? "youtube",
        sourceUrl: candidate.sourceUrl,
        videoId: parsed?.videoId,
        providerId: candidate.providerId ?? parsed?.videoId,
      },
      existingCatalog,
    );

    let media: ProductMedia;
    let action: ApprovedAssetImportResult["action"];

    if (duplicate) {
      media = buildMediaFromCandidate(candidate, duplicate);
      action = "reused-media";
    } else {
      media = buildMediaFromCandidate(candidate);
      action = existingCatalog.some((m) => m.id === media.id)
        ? "updated-media"
        : "created-media";
    }

    if (opts?.activate) {
      media = ProductMediaSchema.parse({
        ...media,
        status: "active",
        officialSource: true,
      });
    }

    let persisted = false;
    if (opts?.persist) {
      const up = upsertResearchMediaInEnrichment(productSlug, media, {
        persist: true,
      });
      persisted = Boolean(up);
    }

    // Attach media id onto placement recommendations
    for (const p of listPlacementRecommendations({
      candidateId: candidate.id,
    })) {
      savePlacementRecommendation({
        ...p,
        mediaId: media.id,
        updatedAt: nowIso(),
      });
    }

    const next = ApprovedAssetCandidateSchema.parse({
      ...candidate,
      importedMediaId: media.id,
      reusedMediaId: duplicate?.id,
      stage: opts?.activate ? "ACTIVE" : candidate.stage,
      usageState: opts?.activate
        ? candidate.usageRecommendation === "embed"
          ? "embedded"
          : candidate.usageRecommendation === "link" ||
              candidate.usageRecommendation === "cite"
            ? "linked"
            : "active"
        : "approved",
      updatedAt: nowIso(),
      stageHistory: [
        ...candidate.stageHistory,
        {
          stage: opts?.activate ? "ACTIVE" : candidate.stage,
          at: nowIso(),
          note: opts?.activate
            ? `Imported + activated ResearchMedia ${media.id}`
            : `Imported ResearchMedia ${media.id} (needs-review / not public until activate)`,
        },
      ],
    });

    // Health check hook (recommendations only — does not auto-mutate)
    evaluateMediaGovernance({ media });

    return {
      result: ApprovedAssetImportResultSchema.parse({
        ok: true,
        candidateId: candidate.id,
        action,
        mediaId: media.id,
        duplicateOfMediaId: duplicate?.id,
        message: duplicate
          ? `Reused canonical ResearchMedia ${duplicate.id} — entity mapping merged`
          : `ResearchMedia ${media.id} ready (${media.status})`,
        persisted,
        activated: Boolean(opts?.activate),
      }),
      candidate: next,
      media,
    };
  }

  // --- Non-video → ResearchSource ---
  const sources = loadManualSources(productSlug);
  const dupSource = findDuplicateSource(
    candidate.canonicalSourceUrl ?? candidate.sourceUrl,
    sources,
  );
  let source = dupSource
    ? ResearchSourceSchema.parse({
        ...dupSource,
        title: candidate.title,
        publisher: candidate.sourceOrganization ?? dupSource.publisher,
        verifiedAt: nowIso(),
        lastCheckedAt: nowIso(),
        status: opts?.activate ? "active" : "candidate",
        notes: candidate.editorialCommentary ?? dupSource.notes,
      })
    : buildSourceFromCandidate(candidate);

  if (opts?.activate && source.status === "candidate") {
    source = ResearchSourceSchema.parse({ ...source, status: "active" });
  }

  let persisted = false;
  if (opts?.persist) {
    const nextSources = dupSource
      ? sources.map((s) => (s.id === source.id ? source : s))
      : [...sources, source];
    saveManualSources(productSlug, nextSources);
    persisted = true;
  }

  const next = ApprovedAssetCandidateSchema.parse({
    ...candidate,
    importedSourceId: source.id,
    stage: opts?.activate ? "ACTIVE" : candidate.stage,
    usageState: opts?.activate ? "linked" : "approved",
    updatedAt: nowIso(),
    stageHistory: [
      ...candidate.stageHistory,
      {
        stage: opts?.activate ? "ACTIVE" : candidate.stage,
        at: nowIso(),
        note: `Imported ResearchSource ${source.id}`,
      },
    ],
  });

  return {
    result: ApprovedAssetImportResultSchema.parse({
      ok: true,
      candidateId: candidate.id,
      action: dupSource ? "reused-source" : "created-source",
      sourceId: source.id,
      message: dupSource
        ? `Reused existing ResearchSource ${dupSource.id}`
        : `ResearchSource ${source.id} ready (${source.status})`,
      persisted,
      activated: Boolean(opts?.activate),
    }),
    candidate: next,
    source,
  };
}

/**
 * Explicit activation after import (ResearchMedia → active).
 */
export function activateImportedAsset(
  candidate: ApprovedAssetCandidate,
  opts?: { persist?: boolean },
): {
  result: ApprovedAssetImportResult;
  candidate: ApprovedAssetCandidate;
  media?: ProductMedia;
} {
  if (
    candidate.stage !== "EDITORIALLY_APPROVED" &&
    candidate.stage !== "ACTIVE"
  ) {
    return {
      result: ApprovedAssetImportResultSchema.parse({
        ok: false,
        candidateId: candidate.id,
        action: "blocked",
        message: "Activate requires editorial approval / prior import",
        persisted: false,
        activated: false,
      }),
      candidate,
    };
  }

  const imported = importApprovedAsset(candidate, {
    persist: opts?.persist,
    activate: true,
  });
  return imported;
}
