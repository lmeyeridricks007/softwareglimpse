/**
 * Register + activate official vendor YouTube videos for Customer Service Wave-1
 * via the Approved Asset Workflow.
 *
 * Usage: npx tsx scripts/import-cs-wave1-official-videos.ts
 */
import { readFileSync, existsSync } from "node:fs";
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
};

function loadVideos(): VideoSpec[] {
  const jsonPath = join(process.cwd(), "scripts/_cs-wave1-official-videos.json");
  if (!existsSync(jsonPath)) {
    console.error(`Missing ${jsonPath}`);
    return [];
  }
  const raw = JSON.parse(readFileSync(jsonPath, "utf8")) as VideoSpec[];
  return raw.map((v) => ({
    ...v,
    placement:
      v.placement ??
      (v.assetType === "official-tutorial" ? "features" : "overview"),
  }));
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
    c = loadApprovedAssetCandidate(c.id) ?? c;
  }

  if (c.stage === "ACTIVE") {
    return { ok: true, detail: "already-active" };
  }

  const verified =
    c.stage === "DISCOVERED"
      ? verifyCandidateSource(c, {
          officialSourceKind: "vendor-channel",
          channelName: spec.channel,
          sourceOrganization: spec.org,
        })
      : { ok: true as const, candidate: c };
  if (!verified.ok) {
    return { ok: false, detail: `verify: ${verified.message}` };
  }
  c = verified.candidate;
  saveApprovedAssetCandidate(c);

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
      useCaseIds: [
        "helpdesk-ticketing",
        "live-chat-support",
        "omnichannel-support",
      ],
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

function main() {
  const videos = loadVideos();
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
  console.log(`\nDone: ${ok}/${videos.length} videos activated`);
}

main();
