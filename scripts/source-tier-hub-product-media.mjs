#!/usr/bin/env node
/**
 * Source official YouTube videos + vendor-ui screenshots for tier-hub rosters.
 * Idempotent — skips existing files / screenshot ids / media ids.
 *
 * Usage:
 *   node scripts/source-tier-hub-product-media.mjs
 *   node scripts/source-tier-hub-product-media.mjs --slug=hootsuite
 *   node scripts/source-tier-hub-product-media.mjs --thumbnail-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  COVERAGE_GAP_FILES,
  MANUAL_VIDEO_SPECS,
  TIER_HUB_TARGET_SLUGS,
} from "./lib/tier-hub-product-media-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-24T05:30:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

const thumbnailOnly = process.argv.includes("--thumbnail-only");

function loadVideoSpecs() {
  const specs = [...MANUAL_VIDEO_SPECS];
  for (const file of COVERAGE_GAP_FILES) {
    const jsonPath = path.join(ROOT, "scripts", file);
    if (!fs.existsSync(jsonPath)) continue;
    specs.push(...JSON.parse(fs.readFileSync(jsonPath, "utf8")));
  }
  return specs;
}

function buildProductsMap() {
  const specs = loadVideoSpecs();
  const bySlug = new Map();
  for (const slug of TIER_HUB_TARGET_SLUGS) {
    bySlug.set(slug, { slug, name: slug, videos: [] });
  }
  for (const spec of specs) {
    if (!TIER_HUB_TARGET_SLUGS.includes(spec.product)) continue;
    const entry = bySlug.get(spec.product);
    if (!entry) continue;
    if (!entry.videos.some((v) => v.videoId === spec.videoId)) {
      entry.videos.push({
        videoId: spec.videoId,
        title: spec.title,
        description: spec.shows?.join("; ") ?? spec.title,
        channelName: spec.channel,
        sourceOrganization: spec.org,
        type: spec.assetType === "official-tutorial" ? "official-tutorial" : "official-video",
        featureIds: spec.features ?? [],
      });
    }
    entry.name = spec.org?.split("/")[0]?.trim() || entry.name;
  }
  return bySlug;
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 4000) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4000) throw new Error(`Too small (${buf.length}b): ${url}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { skipped: false, bytes: buf.length };
}

function buildScreenshot(slug, shot) {
  const id = `${slug}-shot-${shot.file.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]/gi, "-")}`;
  return {
    id,
    src: `/vendor-ui/${slug}/${shot.file}`,
    alt: shot.alt,
    caption: shot.caption,
    source: shot.source,
    checkedAt: CHECKED_AT,
    annotation: shot.annotation || `Official ${slug} product visual from vendor video thumbnail`,
    kind: "vendor-ui",
    featureIds: shot.featureIds ?? [],
  };
}

function buildMedia(slug, video) {
  const id = `${slug}-video-${video.videoId.toLowerCase()}`;
  return {
    id,
    productSlug: slug,
    productIds: [slug],
    type: video.type || "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    videoId: video.videoId,
    providerId: video.videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    title: video.title,
    description: video.description,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    sourceOrganization: video.sourceOrganization,
    channelName: video.channelName,
    officialSource: true,
    officialSourceKind: "vendor-channel",
    verifiedAt: CHECKED_AT,
    lastCheckedAt: CHECKED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: video.featureIds ?? [],
    requirementIds: [],
    useCaseIds: [],
    industryIds: [],
    guideIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: ["workflow-demo", "ui-layout", "feature-existence"],
    demonstratedDimensionIds: [],
    requirementCriterionIds: [],
    workflowStageIds: [],
    reportedOutcomes: [],
    placements: ["overview", "features", "evidence"],
    mediaContext: "general-workflow",
    purpose: `Official ${slug} video for product research pages`,
    demonstratesCaption: `How ${slug} presents the product in an official vendor video.`,
    editorialCommentary:
      "Official vendor demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
    whatThisShows: [
      `${slug} product surfaces as shown in the official vendor video`,
      "UI/workflow layout marketed by the vendor",
    ],
    limitations: [...DEFAULT_LIMITATIONS],
    whatToNotice: [],
    status: "published",
  };
}

function hasVendorUiOnDisk(enrichment) {
  return (enrichment.screenshots ?? []).some((shot) => {
    if (shot.kind !== "vendor-ui") return false;
    const rel = shot.src.replace(/^\//, "");
    if (!rel.startsWith("vendor-ui/") && !rel.startsWith("software/")) return false;
    const disk = path.join(ROOT, "public", rel);
    return fs.existsSync(disk) && fs.statSync(disk).size >= 4000;
  });
}

function firstPublishedVideo(enrichment) {
  return (enrichment.media ?? []).find(
    (m) =>
      (m.status === "published" || m.status === "active") &&
      (m.videoId || m.providerId),
  );
}

function mergeEnrichment(slug, plan, thumbnailShot) {
  const enrichmentPath = path.join(ROOT, "src/data/research", slug, "enrichment.json");
  if (!fs.existsSync(enrichmentPath)) {
    throw new Error(`Missing enrichment: ${enrichmentPath}`);
  }
  const data = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  data.screenshots = Array.isArray(data.screenshots) ? data.screenshots : [];
  data.media = Array.isArray(data.media) ? data.media : [];

  const existingShotIds = new Set(data.screenshots.map((s) => s.id));
  const existingShotSrcs = new Set(data.screenshots.map((s) => s.src));
  let shotsAdded = 0;
  let mediaAdded = 0;

  if (!thumbnailOnly) {
    const existingMediaIds = new Set(data.media.map((m) => m.id));
    const existingVideoIds = new Set(
      data.media.map((m) => m.videoId || m.providerId).filter(Boolean),
    );
    for (const video of plan.videos) {
      const entry = buildMedia(slug, video);
      if (existingMediaIds.has(entry.id) || existingVideoIds.has(entry.videoId)) continue;
      data.media.push(entry);
      existingMediaIds.add(entry.id);
      existingVideoIds.add(entry.videoId);
      mediaAdded++;
    }
  }

  if (thumbnailShot) {
    const entry = buildScreenshot(slug, thumbnailShot);
    if (!existingShotIds.has(entry.id) && !existingShotSrcs.has(entry.src)) {
      data.screenshots.push(entry);
      shotsAdded++;
    }
  }

  for (const item of data.media) {
    if (
      (item.status === "active" || item.status === "published") &&
      Array.isArray(item.placements) &&
      item.placements.length === 0
    ) {
      item.placements = ["overview", "features", "evidence"];
    }
  }

  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);

  const vendorUi = data.screenshots.filter((s) => s.kind === "vendor-ui").length;
  const publishedMedia = data.media.filter(
    (m) => m.status === "active" || m.status === "published",
  ).length;
  return { shotsAdded, mediaAdded, publishedMedia, vendorUi, enrichmentPath };
}

function resolveThumbnailShot(slug, plan, enrichment) {
  if (hasVendorUiOnDisk(enrichment)) return null;
  const videosForShots =
    plan.videos.length > 0
      ? plan.videos
      : [firstPublishedVideo(enrichment)].filter(Boolean).map((m) => ({
          videoId: m.videoId || m.providerId,
          title: m.title || `${slug} official video`,
        }));
  if (videosForShots.length === 0) return null;
  const video = videosForShots[0];
  const file = `overview-${video.videoId}.jpg`;
  return {
    file,
    url: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    alt: `${plan.name} product overview from official vendor video`,
    caption: `Overview frame from the official ${plan.name} vendor video on YouTube.`,
    source: `https://www.youtube.com/watch?v=${video.videoId}`,
    featureIds: [],
  };
}

async function processProduct(slug, plan) {
  const enrichmentPath = path.join(ROOT, "src/data/research", slug, "enrichment.json");
  const enrichment = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  const thumbnailShot = resolveThumbnailShot(slug, plan, enrichment);

  const dir = path.join(ROOT, "public/vendor-ui", slug);
  fs.mkdirSync(dir, { recursive: true });

  const downloadResults = [];
  let savedThumbnail = null;
  if (thumbnailShot) {
    const dest = path.join(dir, thumbnailShot.file);
    const urls = [
      thumbnailShot.url,
      thumbnailShot.url.replace("maxresdefault", "hqdefault"),
    ];
    for (const url of urls) {
      try {
        const result = await download(url, dest);
        downloadResults.push({ file: thumbnailShot.file, ok: true, ...result, url });
        savedThumbnail = thumbnailShot;
        break;
      } catch (err) {
        downloadResults.push({
          file: thumbnailShot.file,
          ok: false,
          error: String(err.message || err),
          url,
        });
      }
    }
  }

  const merge = mergeEnrichment(slug, plan, savedThumbnail);
  return { slug, downloadResults, ...merge };
}

async function main() {
  const argSlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const products = buildProductsMap();
  const slugs = argSlug ? [argSlug] : [...products.keys()];

  for (const slug of slugs) {
    const plan = products.get(slug);
    if (!plan) {
      console.warn(`Skip unknown slug: ${slug}`);
      continue;
    }
    process.stdout.write(`\n→ ${slug}...\n`);
    try {
      const result = await processProduct(slug, plan);
      for (const r of result.downloadResults) {
        const status = r.ok
          ? r.skipped
            ? `skip ${r.bytes}b`
            : `ok ${r.bytes}b`
          : `FAIL ${r.error}`;
        console.log(`  ${r.file}: ${status}`);
      }
      console.log(
        `  enrichment: +${result.shotsAdded} shots, +${result.mediaAdded} videos → vendor-ui=${result.vendorUi} media=${result.publishedMedia}`,
      );
    } catch (err) {
      console.error(`  ERROR: ${err.message || err}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
