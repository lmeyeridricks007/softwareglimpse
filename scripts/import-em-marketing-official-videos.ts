/**
 * Register + activate official vendor YouTube videos for email/marketing batches
 * via the Approved Asset Workflow, then normalize to Apollo-compatible published shape.
 *
 * Usage: npx tsx scripts/import-em-marketing-official-videos.ts
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  addPlacementRecommendation,
  editorialApproveCandidate,
  importApprovedAsset,
  mapCandidateEntities,
  markCandidateUsageState,
  registerApprovedAssetCandidate,
  reviewCandidateRelevance,
  reviewCandidateUsage,
  saveApprovedAssetCandidate,
  verifyCandidateSource,
} from "@/services/asset-discovery/approval";
import {
  listApprovedAssetCandidates,
  loadApprovedAssetCandidate,
} from "@/services/asset-discovery/approval/store";
import { loadEnrichment } from "@/data/research/store";

type VideoSpec = {
  product: string;
  videoId: string;
  title: string;
  channel: string;
  org: string;
  assetType?: "official-product-video" | "official-tutorial";
  shows: string[];
  features: string[];
  placement?: "overview" | "features";
  existing?: boolean;
};

function loadBatch(name: string): VideoSpec[] {
  const jsonPath = join(process.cwd(), "scripts", name);
  if (!existsSync(jsonPath)) return [];
  return JSON.parse(readFileSync(jsonPath, "utf8")) as VideoSpec[];
}

function findExistingCandidate(spec: VideoSpec) {
  const url = `https://www.youtube.com/watch?v=${spec.videoId}`;
  return listApprovedAssetCandidates().find(
    (c) =>
      c.sourceUrl === url ||
      c.providerId === spec.videoId ||
      c.id.includes(spec.videoId.toLowerCase()),
  );
}

function runOne(spec: VideoSpec): { ok: boolean; detail: string } {
  if (spec.existing) {
    return { ok: true, detail: "existing-skip-register" };
  }

  const url = `https://www.youtube.com/watch?v=${spec.videoId}`;
  let c = findExistingCandidate(spec);
  if (!c) {
    const registered = registerApprovedAssetCandidate({
      productSlug: spec.product,
      sourceUrl: url,
      title: spec.title,
      assetType: spec.assetType ?? "official-product-video",
      featureIds: spec.features,
      whatThisShows: spec.shows,
    });
    if (!registered.ok) {
      return { ok: false, detail: `register: ${registered.message}` };
    }
    c = registered.candidate;
    saveApprovedAssetCandidate(c);
  } else {
    // Reload latest from disk
    c = loadApprovedAssetCandidate(c.id) ?? c;
  }

  if (c.stage === "ACTIVE") {
    return { ok: true, detail: "already-active" };
  }

  if (c.stage === "DISCOVERED") {
    const verified = verifyCandidateSource(c, {
      officialSourceKind: "vendor-channel",
      channelName: spec.channel,
      sourceOrganization: spec.org,
    });
    if (!verified.ok) {
      return { ok: false, detail: `verify: ${verified.message}` };
    }
    c = verified.candidate;
    saveApprovedAssetCandidate(c);
  }

  const relevance = reviewCandidateRelevance(c, {
    passed: true,
    whatThisShows: spec.shows,
  });
  if (!relevance.ok) {
    return { ok: false, detail: `relevance: ${relevance.message}` };
  }
  c = relevance.candidate;
  saveApprovedAssetCandidate(c);

  const usage = reviewCandidateUsage(c, {
    recommendation: "embed",
  });
  if (!usage.ok) {
    return { ok: false, detail: `usage: ${usage.message}` };
  }
  c = usage.candidate;
  saveApprovedAssetCandidate(c);

  const mapped = mapCandidateEntities(c, {
    mapping: {
      productIds: [spec.product],
      featureIds: spec.features,
      useCaseIds: [],
    },
  });
  if (!mapped.ok) {
    return { ok: false, detail: `map: ${mapped.message}` };
  }
  c = mapped.candidate;

  const placement = spec.placement ?? "overview";
  const placed = addPlacementRecommendation(c, {
    pageRoute: `/software/${spec.product}/`,
    pageType: "software-review",
    sectionId: placement,
    sectionTitle: placement === "overview" ? "Overview" : "Features",
    mediaPlacement: placement,
    recommendedUse: "embed",
    reason: `${spec.title} — official vendor video for ${spec.product}`,
  });
  c = placed.candidate;
  saveApprovedAssetCandidate(c);

  const approved = editorialApproveCandidate(c);
  if (!approved.ok) {
    return { ok: false, detail: `editorial: ${approved.message}` };
  }
  c = approved.candidate;
  saveApprovedAssetCandidate(c);

  const imported = importApprovedAsset(c, {
    persist: true,
    activate: true,
  });
  if (!imported.result.ok) {
    return {
      ok: false,
      detail: `import: ${imported.result.message ?? imported.result.action}`,
    };
  }

  let next = imported.candidate;
  if (imported.result.activated || imported.result.ok) {
    next = markCandidateUsageState(next, "embedded");
    saveApprovedAssetCandidate(next);
  }

  return {
    ok: true,
    detail: `${imported.result.action} activated=${imported.result.activated}`,
  };
}

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

function normalizeToPublished(specs: VideoSpec[]): void {
  const byProduct = new Map<string, VideoSpec[]>();
  for (const s of specs) {
    const list = byProduct.get(s.product) ?? [];
    list.push(s);
    byProduct.set(s.product, list);
  }

  const verifiedAt = "2026-08-17T15:00:00.000Z";

  for (const [product, productSpecs] of byProduct) {
    const enrichmentPath = join(
      process.cwd(),
      "src/data/research",
      product,
      "enrichment.json",
    );
    if (!existsSync(enrichmentPath)) {
      console.log(`SKIP normalize\t${product}\tno enrichment`);
      continue;
    }
    const enrichment = JSON.parse(readFileSync(enrichmentPath, "utf8")) as {
      media?: Array<Record<string, unknown>>;
      [key: string]: unknown;
    };
    const media = enrichment.media ?? [];
    let changed = false;

    for (const spec of productSpecs) {
      const idx = media.findIndex(
        (m) =>
          m.videoId === spec.videoId ||
          m.providerId === spec.videoId ||
          (typeof m.sourceUrl === "string" &&
            m.sourceUrl.includes(spec.videoId)),
      );
      if (idx < 0) {
        console.log(`MISS\t${product}\t${spec.videoId}`);
        continue;
      }
      const prev = media[idx]!;
      const placement = spec.placement ?? "overview";
      const placements = Array.isArray(prev.placements)
        ? ([...new Set([...(prev.placements as string[]), placement, "overview", "evidence"])] as string[])
        : [placement, "overview", "evidence"];

      media[idx] = {
        ...prev,
        productSlug: product,
        type:
          spec.assetType === "official-tutorial"
            ? "official-tutorial"
            : "official-video",
        provider: "youtube",
        sourceUrl: `https://www.youtube.com/watch?v=${spec.videoId}`,
        videoId: spec.videoId,
        embedUrl: `https://www.youtube-nocookie.com/embed/${spec.videoId}`,
        title: (prev.title as string) || spec.title,
        description:
          (prev.description as string) ||
          `Official product video from the ${spec.channel} YouTube channel.`,
        thumbnailUrl:
          (prev.thumbnailUrl as string) ||
          `https://i.ytimg.com/vi/${spec.videoId}/hqdefault.jpg`,
        channelName: spec.channel,
        sourceOrganization: spec.org,
        officialSource: true,
        officialSourceKind: "vendor-channel",
        verifiedAt: (prev.verifiedAt as string) || verifiedAt,
        embeddingAllowed: true,
        featureIds:
          Array.isArray(prev.featureIds) && (prev.featureIds as string[]).length
            ? prev.featureIds
            : spec.features,
        capabilityIds: Array.isArray(prev.capabilityIds)
          ? prev.capabilityIds
          : [],
        requirementIds: Array.isArray(prev.requirementIds)
          ? prev.requirementIds
          : [],
        useCaseIds: Array.isArray(prev.useCaseIds) ? prev.useCaseIds : [],
        industryIds: Array.isArray(prev.industryIds) ? prev.industryIds : [],
        mediaContext: (prev.mediaContext as string) || "general-workflow",
        workflowStageIds: Array.isArray(prev.workflowStageIds)
          ? prev.workflowStageIds
          : [],
        evidenceRefs: Array.isArray(prev.evidenceRefs) ? prev.evidenceRefs : [],
        evidenceClaimIds: Array.isArray(prev.evidenceClaimIds)
          ? prev.evidenceClaimIds
          : [],
        evidenceClaimKinds: Array.isArray(prev.evidenceClaimKinds)
          ? prev.evidenceClaimKinds
          : ["workflow-demo", "ui-layout", "feature-existence"],
        placements,
        purpose:
          (prev.purpose as string) ||
          `Official ${spec.org} overview video for product research pages`,
        demonstratesCaption:
          (prev.demonstratesCaption as string) ||
          `How ${spec.org} presents the product in an official vendor video.`,
        editorialCommentary:
          (prev.editorialCommentary as string) ||
          "Official vendor demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
        whatThisShows:
          Array.isArray(prev.whatThisShows) &&
          (prev.whatThisShows as string[]).length
            ? prev.whatThisShows
            : spec.shows,
        limitations:
          Array.isArray(prev.limitations) &&
          (prev.limitations as string[]).length
            ? prev.limitations
            : DEFAULT_LIMITATIONS,
        whatToNotice: Array.isArray(prev.whatToNotice)
          ? prev.whatToNotice
          : [
              `Shows ${spec.org}'s marketed product surfaces.`,
              "Useful as UI/workflow evidence — not as independent scoring.",
              "Does not establish pricing, deliverability claims, or comparative superiority.",
            ],
        status: "published",
      };
      changed = true;
    }

    if (changed) {
      enrichment.media = media;
      writeFileSync(enrichmentPath, `${JSON.stringify(enrichment, null, 2)}\n`);
      console.log(`NORMALIZED\t${product}\tmedia=${media.length}`);
    }
  }
}

function main() {
  const videos = [
    ...loadBatch("_em-batch-official-videos.json"),
    ...loadBatch("_marketing-batch-official-videos.json"),
  ];

  let ok = 0;
  for (const spec of videos) {
    try {
      const r = runOne(spec);
      console.log(
        `${r.ok ? "OK" : "FAIL"}\t${spec.product}\t${spec.videoId}\t${r.detail}`,
      );
      if (r.ok) ok += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`FAIL\t${spec.product}\t${spec.videoId}\t${msg}`);
    }
  }
  console.log(`\nImport pass: ${ok}/${videos.length}`);

  normalizeToPublished(videos);

  // Final verify
  const products = [...new Set(videos.map((v) => v.product))];
  console.log("\n=== Verification ===");
  for (const product of products) {
    const e = loadEnrichment(product);
    const media = e?.media ?? [];
    const published = media.filter((m) => m.status === "published");
    const ids = published.map((m) => m.videoId).filter(Boolean);
    console.log(
      `${product}\ttotal=${media.length}\tpublished=${published.length}\tids=${ids.join(",")}`,
    );
  }
}

main();
