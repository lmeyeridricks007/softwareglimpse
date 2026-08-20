#!/usr/bin/env node
/**
 * Source first-party og:image + official-channel YouTube (oEmbed-verified)
 * for researched products still missing major official media.
 *
 * Does not invent video IDs. Skips third-party YouTube. Idempotent.
 *
 * Usage: node scripts/source-remaining-official-media.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-18T10:30:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

const PRODUCTS = {
  "adapt-io": {
    name: "Adapt.io",
    homepage: "https://www.adapt.io",
    authorTokens: ["adapt"],
    featureIds: ["contact-data", "prospecting", "data-enrichment"],
    useCaseIds: [],
  },
  brandwatch: {
    name: "Brandwatch",
    homepage: "https://www.brandwatch.com",
    authorTokens: ["brandwatch", "cision"],
    featureIds: ["social-listening", "analytics"],
    useCaseIds: [],
  },
  freshchat: {
    name: "Freshchat",
    homepage: "https://www.freshworks.com/live-chat-software/",
    authorTokens: ["freshworks", "freshchat", "freshdesk"],
    featureIds: ["live-chat", "chatbot-ai-agent"],
    useCaseIds: ["live-chat-support"],
  },
  mindstudio: {
    name: "MindStudio",
    homepage: "https://www.mindstudio.ai",
    authorTokens: ["mindstudio"],
    featureIds: ["agent-builder"],
    useCaseIds: ["ai-agents"],
  },
  quillbot: {
    name: "QuillBot",
    homepage: "https://quillbot.com",
    authorTokens: ["quillbot"],
    featureIds: ["writing-assist"],
    useCaseIds: ["ai-writing"],
  },
  uniqode: {
    name: "Uniqode",
    homepage: "https://www.uniqode.com",
    authorTokens: ["uniqode", "beaconstac"],
    featureIds: ["analytics", "forms-lead-capture"],
    useCaseIds: [],
  },
  whatconverts: {
    name: "WhatConverts",
    homepage: "https://www.whatconverts.com",
    authorTokens: ["whatconverts", "what converts"],
    featureIds: ["analytics", "forms-lead-capture"],
    useCaseIds: [],
  },
};

const CDN_ALLOW = [
  "cloudfront.net",
  "cloudinary.com",
  "imgix.net",
  "ctfassets.net",
  "storyblok.com",
  "sanity.io",
  "webflow.com",
  "website-files.com",
  "freshworks.com",
  "brandwatch.com",
  "cision.com",
  "adapt.io",
  "uniqode.com",
  "beaconstac.com",
  "whatconverts.com",
  "quillbot.com",
  "mindstudio.ai",
  "wistia.com",
  "mux.com",
];

function firstPartyHost(homepage, imageUrl) {
  try {
    const pageHost = new URL(homepage).hostname.replace(/^www\./, "");
    const imgHost = new URL(imageUrl).hostname.replace(/^www\./, "");
    const root = pageHost.split(".").slice(-2).join(".");
    if (imgHost.endsWith(root) || imgHost === pageHost) return true;
    return CDN_ALLOW.some((d) => imgHost === d || imgHost.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractOgImage(html) {
  const m =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    );
  return m?.[1] ? decodeHtml(m[1]) : null;
}

function extractYoutubeIds(html) {
  const ids = new Set();
  const re =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/g;
  let match;
  while ((match = re.exec(html))) ids.add(match[1]);
  return [...ids];
}

function extFromUrl(url) {
  try {
    const p = new URL(url).pathname.toLowerCase();
    if (p.endsWith(".webp")) return "webp";
    if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "jpg";
    if (p.endsWith(".png")) return "png";
    if (p.endsWith(".gif")) return "gif";
  } catch {
    /* ignore */
  }
  return "png";
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function oembed(videoId) {
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  return res.json();
}

function authorMatches(author, tokens) {
  const hay = String(author || "").toLowerCase();
  return tokens.some((t) => hay.includes(t.toLowerCase()));
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
    return { skipped: true, bytes: fs.statSync(dest).size };
  }
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error(`Too small (${buf.length}b): ${url}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { skipped: false, bytes: buf.length };
}

function mergeShot(slug, shot) {
  const enrichmentPath = path.join(
    ROOT,
    "src/data/research",
    slug,
    "enrichment.json",
  );
  const data = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  data.screenshots = Array.isArray(data.screenshots) ? data.screenshots : [];
  const id = `${slug}-shot-${shot.file.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-]/gi, "-")}`;
  const src = `/vendor-ui/${slug}/${shot.file}`;
  if (data.screenshots.some((s) => s.id === id || s.src === src)) {
    return { added: false };
  }
  const plan = PRODUCTS[slug];
  data.screenshots.push({
    id,
    src,
    alt: shot.alt,
    caption: shot.caption,
    source: shot.source,
    checkedAt: CHECKED_AT,
    annotation: `Official ${plan.name} marketing UI asset`,
    kind: "vendor-ui",
    featureIds: plan.featureIds,
    useCaseIds: plan.useCaseIds,
  });
  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);
  return { added: true };
}

function mergeVideo(slug, video) {
  const enrichmentPath = path.join(
    ROOT,
    "src/data/research",
    slug,
    "enrichment.json",
  );
  const data = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  data.media = Array.isArray(data.media) ? data.media : [];
  if (
    data.media.some(
      (m) => m.videoId === video.videoId || m.providerId === video.videoId,
    )
  ) {
    return { added: false };
  }
  const plan = PRODUCTS[slug];
  data.media.push({
    id: `${slug}-video-${video.videoId.toLowerCase()}`,
    productSlug: slug,
    productIds: [slug],
    type: "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    videoId: video.videoId,
    providerId: video.videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${video.videoId}`,
    title: video.title,
    description: `Official ${plan.name} video from the ${video.channel} YouTube channel.`,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    sourceOrganization: plan.name,
    channelName: video.channel,
    officialSource: true,
    officialSourceKind: "vendor-channel",
    verifiedAt: CHECKED_AT,
    lastCheckedAt: CHECKED_AT,
    sourceHealth: "live",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: plan.featureIds,
    requirementIds: [],
    useCaseIds: plan.useCaseIds,
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
    purpose: `Official ${plan.name} video for product research pages`,
    demonstratesCaption: `How ${plan.name} presents the product in an official vendor video.`,
    editorialCommentary:
      "Official vendor demo — treat as UI/workflow evidence, not SoftwareGlimpse scoring.",
    whatThisShows: [
      `${plan.name} product surfaces as shown in the official vendor video`,
      "UI/workflow layout marketed by the vendor",
    ],
    limitations: [...DEFAULT_LIMITATIONS],
    whatToNotice: [],
    status: "published",
  });
  data.updatedAt = CHECKED_AT;
  fs.writeFileSync(enrichmentPath, `${JSON.stringify(data, null, 2)}\n`);
  return { added: true };
}

async function processProduct(slug) {
  const plan = PRODUCTS[slug];
  const notes = [];
  let html;
  try {
    html = await fetchText(plan.homepage);
  } catch (err) {
    notes.push(`homepage fetch failed: ${err.message || err}`);
    return { slug, notes, shot: false, video: false };
  }

  const og = extractOgImage(html);
  let shot = false;
  if (og) {
    const abs = new URL(og, plan.homepage).href;
    if (!firstPartyHost(plan.homepage, abs)) {
      notes.push(`og:image not first-party: ${abs}`);
    } else {
      const ext = extFromUrl(abs);
      const file = `overview.${ext}`;
      const dest = path.join(ROOT, "public/vendor-ui", slug, file);
      try {
        const dl = await download(abs, dest);
        mergeShot(slug, {
          file,
          alt: `${plan.name} official Open Graph visual`,
          caption: `Official ${plan.name} Open Graph marketing visual from ${plan.homepage} — not a SoftwareGlimpse lab screenshot.`,
          source: plan.homepage,
        });
        shot = true;
        notes.push(
          `screenshot ${file} ${dl.skipped ? "exists" : `${dl.bytes}b`}`,
        );
      } catch (err) {
        notes.push(`screenshot fail: ${err.message || err}`);
      }
    }
  } else {
    notes.push("no og:image");
  }

  const ids = extractYoutubeIds(html);
  let video = false;
  for (const videoId of ids) {
    const meta = await oembed(videoId);
    if (!meta) {
      notes.push(`youtube ${videoId} oEmbed unavailable`);
      continue;
    }
    if (!authorMatches(meta.author_name, plan.authorTokens)) {
      notes.push(
        `youtube ${videoId} skipped (author=${meta.author_name})`,
      );
      continue;
    }
    mergeVideo(slug, {
      videoId,
      title: meta.title,
      channel: meta.author_name,
    });
    video = true;
    notes.push(`video ${videoId} author=${meta.author_name}`);
    break;
  }
  if (!ids.length) notes.push("no youtube ids on homepage");

  return { slug, notes, shot, video };
}

async function main() {
  for (const slug of Object.keys(PRODUCTS)) {
    process.stdout.write(`\n→ ${slug}\n`);
    const result = await processProduct(slug);
    for (const n of result.notes) console.log(`  ${n}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
