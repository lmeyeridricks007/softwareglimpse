#!/usr/bin/env node
/**
 * Source vendor-ui screenshots + official YouTube videos for affiliate-gap reconcile products.
 *
 * Idempotent — skips existing files / screenshot ids / media ids.
 *
 * Usage:
 *   node scripts/source-affiliate-gap-product-media.mjs
 *   node scripts/source-affiliate-gap-product-media.mjs --slug=navan
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTS } from "./lib/affiliate-gap-product-media-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-19T13:30:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1500) throw new Error(`Too small (${buf.length}b): ${url}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { skipped: false, bytes: buf.length };
}

function copyLocalCapture(localPath, dest) {
  const src = path.isAbsolute(localPath)
    ? localPath
    : path.join(ROOT, localPath);
  if (!fs.existsSync(src)) throw new Error(`Missing local capture: ${src}`);
  const bytes = fs.statSync(src).size;
  if (bytes < 1500) throw new Error(`Local capture too small (${bytes}b): ${src}`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    return { skipped: true, bytes: fs.statSync(dest).size, local: true };
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return { skipped: false, bytes, local: true };
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
    annotation: shot.annotation || `Official ${PRODUCTS[slug].name} marketing UI asset`,
    kind: "vendor-ui",
    featureIds: [],
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
    officialSourceKind: video.officialSourceKind || "vendor-channel",
    verifiedAt: CHECKED_AT,
    lastCheckedAt: CHECKED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: [],
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
    purpose: `Official ${PRODUCTS[slug].name} video for product research pages`,
    demonstratesCaption: `How ${PRODUCTS[slug].name} presents the product in an official vendor video.`,
    editorialCommentary:
      "Official vendor demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
    whatThisShows: [
      `${PRODUCTS[slug].name} product surfaces as shown in the official vendor video`,
      "UI/workflow layout marketed by the vendor",
    ],
    limitations: [...DEFAULT_LIMITATIONS],
    whatToNotice: [],
    status: "published",
  };
}

function buildHostedMedia(slug, hosted) {
  const id = `${slug}-hosted-${hosted.id}`;
  return {
    id,
    productSlug: slug,
    productIds: [slug],
    type: hosted.type || "official-video",
    provider: "vendor-hosted",
    sourceUrl: hosted.sourceUrl,
    videoId: hosted.id,
    providerId: hosted.id,
    embedUrl: hosted.embedUrl || hosted.sourceUrl,
    title: hosted.title,
    description: hosted.description,
    sourceOrganization: hosted.sourceOrganization || PRODUCTS[slug].name,
    channelName: hosted.channelName || PRODUCTS[slug].name,
    officialSource: true,
    officialSourceKind: hosted.officialSourceKind || "vendor-website",
    verifiedAt: CHECKED_AT,
    lastCheckedAt: CHECKED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: hosted.embeddingAllowed ?? true,
    capabilityIds: [],
    featureIds: [],
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
    placements: ["overview", "features", "evidence", "implementation"],
    mediaContext: "general-workflow",
    purpose: `Official ${PRODUCTS[slug].name} vendor-hosted demo for product research pages`,
    demonstratesCaption: `How ${PRODUCTS[slug].name} presents the product in a first-party hosted demo.`,
    editorialCommentary:
      "Official vendor-hosted demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
    whatThisShows: [
      `${PRODUCTS[slug].name} product story as shown in the official vendor-hosted demo`,
      "UI/workflow layout marketed by the vendor",
    ],
    limitations: [...DEFAULT_LIMITATIONS],
    whatToNotice: [],
    status: "published",
  };
}

function mergeEnrichment(slug) {
  const enrichmentPath = path.join(ROOT, "src/data/research", slug, "enrichment.json");
  if (!fs.existsSync(enrichmentPath)) {
    throw new Error(`Missing enrichment: ${enrichmentPath}`);
  }
  const data = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  const plan = PRODUCTS[slug];
  data.screenshots = Array.isArray(data.screenshots) ? data.screenshots : [];
  data.media = Array.isArray(data.media) ? data.media : [];

  const existingShotIds = new Set(data.screenshots.map((s) => s.id));
  const existingShotSrcs = new Set(data.screenshots.map((s) => s.src));
  let shotsAdded = 0;
  for (const shot of plan.shots ?? []) {
    const entry = buildScreenshot(slug, shot);
    if (existingShotIds.has(entry.id) || existingShotSrcs.has(entry.src)) continue;
    data.screenshots.push(entry);
    existingShotIds.add(entry.id);
    existingShotSrcs.add(entry.src);
    shotsAdded++;
  }

  const existingMediaIds = new Set(data.media.map((m) => m.id));
  const existingVideoIds = new Set(
    data.media.map((m) => m.videoId || m.providerId).filter(Boolean),
  );
  let mediaAdded = 0;
  for (const video of plan.videos ?? []) {
    const entry = buildMedia(slug, video);
    if (existingMediaIds.has(entry.id) || existingVideoIds.has(entry.videoId)) continue;
    data.media.push(entry);
    existingMediaIds.add(entry.id);
    existingVideoIds.add(entry.videoId);
    mediaAdded++;
  }

  for (const hosted of plan.hostedVideos ?? []) {
    const entry = buildHostedMedia(slug, hosted);
    if (existingMediaIds.has(entry.id)) continue;
    data.media.push(entry);
    existingMediaIds.add(entry.id);
    mediaAdded++;
  }

  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);

  const vendorUi = data.screenshots.filter((s) => s.kind === "vendor-ui").length;
  const publishedMedia = data.media.filter(
    (m) => m.status === "active" || m.status === "published",
  ).length;
  return { shotsAdded, mediaAdded, vendorUi, publishedMedia, enrichmentPath };
}

async function processProduct(slug) {
  const plan = PRODUCTS[slug];
  if (!plan) throw new Error(`Unknown slug: ${slug}`);
  const dir = path.join(ROOT, "public/vendor-ui", slug);
  fs.mkdirSync(dir, { recursive: true });

  const downloadResults = [];
  for (const shot of plan.shots ?? []) {
    const dest = path.join(dir, shot.file);
    try {
      const result = shot.localPath
        ? copyLocalCapture(shot.localPath, dest)
        : await download(shot.url, dest);
      downloadResults.push({
        file: shot.file,
        ok: true,
        ...result,
        url: shot.url ?? shot.localPath,
      });
    } catch (err) {
      downloadResults.push({
        file: shot.file,
        ok: false,
        error: String(err.message || err),
        url: shot.url ?? shot.localPath,
      });
    }
  }

  const okFiles = new Set(downloadResults.filter((r) => r.ok).map((r) => r.file));
  const original = plan.shots ?? [];
  plan.shots = original.filter((s) => okFiles.has(s.file));
  const merge = mergeEnrichment(slug);
  plan.shots = original;

  return { slug, downloadResults, ...merge };
}

async function main() {
  const argSlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = argSlug ? [argSlug] : Object.keys(PRODUCTS);
  const summary = [];

  for (const slug of slugs) {
    process.stdout.write(`\n→ ${slug}...\n`);
    try {
      const result = await processProduct(slug);
      const fails = result.downloadResults.filter((r) => !r.ok);
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
      if (fails.length) console.warn(`  ⚠ ${fails.length} download failure(s)`);
      summary.push(result);
    } catch (err) {
      console.error(`  ERROR ${slug}: ${err.message || err}`);
      summary.push({ slug, error: String(err.message || err) });
    }
  }

  console.log("\n=== SUMMARY ===");
  for (const s of summary) {
    if (s.error) {
      console.log(`${s.slug}\tERROR\t${s.error}`);
    } else {
      console.log(
        `${s.slug}\tvendor-ui=${s.vendorUi}\tvideos=${s.publishedMedia}\t(+${s.shotsAdded}/+${s.mediaAdded})`,
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
