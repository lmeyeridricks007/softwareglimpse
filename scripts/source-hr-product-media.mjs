#!/usr/bin/env node
/**
 * Source REAL vendor-ui product screenshots + official YouTube videos for
 * HR Wave-1 + Priority-3 products that currently lack gallery media.
 *
 * Idempotent: skips existing files / screenshot ids / media ids.
 *
 * Usage:
 *   node scripts/source-hr-product-media.mjs
 *   node scripts/source-hr-product-media.mjs --slug=breezy-hr
 *
 * Videos verified 2026-08-18 via YouTube oEmbed author_name matching vendor.
 * Screenshots: official marketing UI from first-party CDNs / vendor sites.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CHECKED_AT = "2026-08-18T13:00:00.000Z";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 SoftwareGlimpseMediaBot/1.0";

const DEFAULT_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
];

const PRODUCTS = {
  "breezy-hr": {
    name: "Breezy HR",
    homepage: "https://breezy.hr/",
    shots: [
      {
        file: "qualify.webp",
        url: "https://cdn.prod.website-files.com/6127d83f257132e4fe0bddc6/621ce82cce0386e3a6229f13_breezyhr-qualify.webp",
        alt: "Breezy HR candidate qualification workspace",
        caption: "Qualify-stage product UI from the official Breezy HR homepage.",
        source: "https://breezy.hr/",
        featureIds: ["applicant-tracking"],
        useCaseIds: ["recruiting-ats"],
      },
      {
        file: "hire.webp",
        url: "https://cdn.prod.website-files.com/6127d83f257132e4fe0bddc6/621ce87fce0386784822a03f_breezyhr-hire.webp",
        alt: "Breezy HR hire and offer workspace",
        caption: "Hire-stage product UI from the official Breezy HR homepage.",
        source: "https://breezy.hr/",
        featureIds: ["applicant-tracking", "interview-scheduling"],
        useCaseIds: ["recruiting-ats"],
      },
      {
        file: "pipeline.png",
        url: "https://cdn.prod.website-files.com/6127d83f257132e4fe0bddc6/6a63bf20bed9b55ede1ffe06_edit-pipeline.png",
        alt: "Breezy HR hiring pipeline editor",
        caption: "Pipeline editor screenshot from the official Breezy ATS page.",
        source: "https://breezy.hr/applicant-tracking-system",
        featureIds: ["applicant-tracking"],
        useCaseIds: ["recruiting-ats"],
      },
      {
        file: "compare-candidates.png",
        url: "https://cdn.prod.website-files.com/6127d83f257132e4fe0bddc6/6a6b7e6c5a0b9177839d687d_compare-candidates.png",
        alt: "Breezy HR candidate comparison",
        caption: "Candidate comparison UI from the official Breezy ATS page.",
        source: "https://breezy.hr/applicant-tracking-system",
        featureIds: ["applicant-tracking"],
        useCaseIds: ["recruiting-ats"],
      },
      {
        file: "sourcing.png",
        url: "https://cdn.prod.website-files.com/6127d83f257132e4fe0bddc6/6a6b7ca9fc27fac056e81bb7_sourcing-candidates.png",
        alt: "Breezy HR candidate sourcing",
        caption: "Sourcing candidates UI from the official Breezy ATS page.",
        source: "https://breezy.hr/applicant-tracking-system",
        featureIds: ["career-site-job-boards", "applicant-tracking"],
        useCaseIds: ["recruiting-ats"],
      },
    ],
    videos: [
      {
        videoId: "1zcPr_py6g4",
        title: "Intro to Breezy HR - Full Demo",
        channelName: "Breezy HR",
        sourceOrganization: "Breezy HR",
        description:
          "Official Breezy HR full product demo from the Breezy HR YouTube channel.",
        featureIds: ["applicant-tracking", "career-site-job-boards", "interview-scheduling"],
        useCaseIds: ["recruiting-ats"],
      },
    ],
  },
  connecteam: {
    name: "Connecteam",
    homepage: "https://connecteam.com/",
    shots: [
      {
        file: "scheduling-1.jpg",
        url: "https://connecteam.com/wp-content/uploads/3553-Scheduling-page_desktop1.jpg",
        alt: "Connecteam employee scheduling calendar",
        caption: "Scheduling calendar UI from the official Connecteam scheduling page.",
        source: "https://connecteam.com/employee-scheduling-app/",
        featureIds: ["workforce-scheduling"],
        useCaseIds: ["workforce-scheduling", "frontline-ops"],
      },
      {
        file: "scheduling-2.jpg",
        url: "https://connecteam.com/wp-content/uploads/3553-Scheduling-page_desktop2.jpg",
        alt: "Connecteam shift schedule management",
        caption: "Shift management product frame from connecteam.com.",
        source: "https://connecteam.com/employee-scheduling-app/",
        featureIds: ["workforce-scheduling"],
        useCaseIds: ["workforce-scheduling"],
      },
      {
        file: "time-clock.webp",
        url: "https://connecteam.com/wp-content/uploads/3511_time_clock_page_redesign_desktop1_1_1x.webp",
        alt: "Connecteam time clock product UI",
        caption: "Time clock product frame from the official Connecteam time-clock page.",
        source: "https://connecteam.com/time-clock-app/",
        featureIds: ["time-attendance", "gps-geofence-clockin"],
        useCaseIds: ["time-attendance", "frontline-ops"],
      },
      {
        file: "mobile-schedule.webp",
        url: "https://connecteam.com/wp-content/uploads/2026/06/Know-your-schedule_2x-2.webp",
        alt: "Connecteam mobile schedule view",
        caption: "Mobile schedule view marketed on the official Connecteam homepage.",
        source: "https://connecteam.com/",
        featureIds: ["workforce-scheduling", "frontline-comms"],
        useCaseIds: ["frontline-ops"],
      },
      {
        file: "hero-desktop.webp",
        url: "https://connecteam.com/wp-content/uploads/hero_desktop_2x.webp",
        alt: "Connecteam workforce app overview",
        caption: "Product overview hero UI from the official Connecteam scheduling page.",
        source: "https://connecteam.com/employee-scheduling-app/",
        featureIds: ["workforce-scheduling", "frontline-comms"],
        useCaseIds: ["frontline-ops"],
      },
    ],
    videos: [
      {
        videoId: "p9r3UojoeIE",
        title: "Connecteam Demo (4 minutes) 2025",
        channelName: "Connecteam",
        sourceOrganization: "Connecteam",
        description:
          "Official Connecteam product demo from the Connecteam YouTube channel.",
        featureIds: ["workforce-scheduling", "time-attendance", "frontline-comms"],
        useCaseIds: ["frontline-ops", "workforce-scheduling"],
      },
      {
        videoId: "yV8_nETiQe0",
        title: "Connecteam - Product Overview for Food & Beverage Businesses",
        channelName: "Connecteam",
        sourceOrganization: "Connecteam",
        type: "official-tutorial",
        description:
          "Official Connecteam industry walkthrough for food & beverage frontline operations.",
        featureIds: ["workforce-scheduling", "time-attendance", "employee-training-paths"],
        useCaseIds: ["frontline-ops"],
      },
    ],
  },
  jibble: {
    name: "Jibble",
    homepage: "https://www.jibble.io/",
    shots: [
      {
        file: "dashboard.jpg",
        url: "https://www.jibble.io/wp-content/uploads/2026/04/jibble-dashboard-real-time-overview-of-attendance-trends.jpg",
        alt: "Jibble attendance dashboard",
        caption: "Real-time attendance dashboard from the official Jibble homepage.",
        source: "https://www.jibble.io/",
        featureIds: ["time-attendance", "analytics-reporting"],
        useCaseIds: ["time-attendance"],
      },
      {
        file: "activity-feed.jpg",
        url: "https://www.jibble.io/wp-content/uploads/2026/04/jibble-activity-feed-live-view-of-who-is-clocked-in-right-no.jpg",
        alt: "Jibble live clock-in activity feed",
        caption: "Live activity feed of who is clocked in, from jibble.io.",
        source: "https://www.jibble.io/",
        featureIds: ["time-attendance"],
        useCaseIds: ["time-attendance"],
      },
      {
        file: "face-recognition.jpg",
        url: "https://www.jibble.io/wp-content/uploads/2026/04/jibble-face-recognition-ai-powered-identity-verification-at-.jpg",
        alt: "Jibble face-recognition clock-in",
        caption: "AI face-recognition identity verification at clock-in, from jibble.io.",
        source: "https://www.jibble.io/",
        featureIds: ["time-attendance", "ai-assistance"],
        useCaseIds: ["time-attendance"],
      },
      {
        file: "geofencing.jpg",
        url: "https://www.jibble.io/wp-content/uploads/2026/04/jibble-geofencing-location-based-clock-in-zones-for-job-site.jpg",
        alt: "Jibble geofenced clock-in zones",
        caption: "Location-based clock-in geofences from the official Jibble site.",
        source: "https://www.jibble.io/",
        featureIds: ["gps-geofence-clockin"],
        useCaseIds: ["time-attendance"],
      },
      {
        file: "kiosk.jpg",
        url: "https://www.jibble.io/wp-content/uploads/2026/04/jibble-kiosk-shared-ipad-or-tablet-clock-in-station-with-pin.jpg",
        alt: "Jibble shared kiosk clock-in",
        caption: "Shared tablet kiosk clock-in station from jibble.io.",
        source: "https://www.jibble.io/",
        featureIds: ["time-attendance"],
        useCaseIds: ["time-attendance"],
      },
    ],
    videos: [
      {
        videoId: "q90UxXmoooo",
        title: "Easy Time Tracking with Jibble | Walkthrough",
        channelName: "Jibble",
        sourceOrganization: "Jibble",
        description:
          "Official Jibble time-tracking walkthrough from the Jibble YouTube channel.",
        featureIds: ["time-attendance", "gps-geofence-clockin"],
        useCaseIds: ["time-attendance"],
      },
    ],
  },
  trainual: {
    name: "Trainual",
    homepage: "https://trainual.com/",
    shots: [
      {
        file: "ai-assistant.png",
        url: "https://cdn.prod.website-files.com/699d952b0db70396d7a1210a/6a79aee319f9f8ba33f7bf20_preview-ai-assistant.png",
        alt: "Trainual AI assistant",
        caption: "AI assistant product preview from the official Trainual homepage.",
        source: "https://trainual.com/",
        featureIds: ["ai-assistance", "sop-knowledge-base"],
        useCaseIds: ["sop-documentation", "employee-training"],
      },
      {
        file: "goals-planning.png",
        url: "https://cdn.prod.website-files.com/699d952b0db70396d7a1210a/6a79aee3770c6282bd3ec7bc_preview-goals-planning.png",
        alt: "Trainual goals and planning",
        caption: "Goals and planning product preview from trainual.com.",
        source: "https://trainual.com/",
        featureIds: ["employee-training-paths"],
        useCaseIds: ["employee-training"],
      },
      {
        file: "training-progress.webp",
        url: "https://cdn.prod.website-files.com/61aa482275701e897156da77/69a1a251eb1c138d87736196_03aed638ebf36ee0f97edeb6a238fa42_onboarding-training-progress.webp",
        alt: "Trainual onboarding training progress",
        caption: "Onboarding / training progress UI from the official Trainual homepage.",
        source: "https://trainual.com/",
        featureIds: ["employee-training-paths"],
        useCaseIds: ["employee-training"],
      },
      {
        file: "agendas.png",
        url: "https://cdn.prod.website-files.com/699d952b0db70396d7a1210a/6a79aee34dd8be56ad6004a7_preview-agendas-action-items.png",
        alt: "Trainual agendas and action items",
        caption: "Agendas and action items preview from trainual.com.",
        source: "https://trainual.com/",
        featureIds: ["sop-knowledge-base"],
        useCaseIds: ["sop-documentation"],
      },
      {
        file: "scorecards.png",
        url: "https://cdn.prod.website-files.com/699d952b0db70396d7a1210a/6a79aee3d5b0b78b17456328_preview-goals-scorecards.png",
        alt: "Trainual goals and scorecards",
        caption: "Goals and scorecards product preview from the official Trainual site.",
        source: "https://trainual.com/",
        featureIds: ["analytics-reporting"],
      },
    ],
    videos: [
      {
        videoId: "JUun9n-65Qg",
        title: "What is Trainual? | Complete Feature Overview",
        channelName: "Trainual",
        sourceOrganization: "Trainual",
        description:
          "Official Trainual feature overview from the Trainual YouTube channel.",
        featureIds: ["sop-knowledge-base", "employee-training-paths"],
        useCaseIds: ["employee-training", "sop-documentation"],
      },
    ],
  },
  workday: {
    name: "Workday",
    homepage:
      "https://www.workday.com/en-us/products/human-capital-management/overview.html",
    shots: [
      {
        file: "job-architecture-hub.png",
        url: "https://www.workday.com/content/dam/web/en-us/images/screenshots/2026r1/job-architecture-hub-hcm-overview-hero.png",
        alt: "Workday HCM job architecture hub",
        caption:
          "Job architecture hub UI from the official Workday Human Capital Management overview.",
        source:
          "https://www.workday.com/en-us/products/human-capital-management/overview.html",
        featureIds: ["core-hris"],
        useCaseIds: ["enterprise-hcm"],
      },
      {
        file: "employee-self-service.png",
        url: "https://www.workday.com/content/dam/web/en-us/images/screenshots/2026r1/screenshot-hcm-employee-experience-self-service-desktop.png",
        alt: "Workday employee self-service",
        caption:
          "Employee self-service product UI from the official Workday employee experience page.",
        source:
          "https://www.workday.com/en-us/products/human-capital-management/employee-experience.html",
        featureIds: ["core-hris"],
        useCaseIds: ["enterprise-hcm"],
      },
      {
        file: "manager-journeys.png",
        url: "https://www.workday.com/content/dam/web/en-us/images/screenshots/2026r1/screenshot-hcm-employee-experience-journeys-managerview-desktop.png",
        alt: "Workday manager journeys view",
        caption:
          "Manager journeys view from the official Workday employee experience page.",
        source:
          "https://www.workday.com/en-us/products/human-capital-management/employee-experience.html",
        featureIds: ["core-hris"],
        useCaseIds: ["enterprise-hcm"],
      },
      {
        file: "talent-management.png",
        url: "https://www.workday.com/content/dam/web/en-us/images/screenshots/2020r1/screenshot-human-capital-management-talent-management-desktop.png",
        alt: "Workday talent management",
        caption:
          "Talent management product UI from the official Workday talent management page.",
        source:
          "https://www.workday.com/en-us/products/human-capital-management/talent-management.html",
        featureIds: ["core-hris"],
        useCaseIds: ["enterprise-hcm"],
      },
      {
        file: "help-center.png",
        url: "https://www.workday.com/content/dam/web/en-us/images/screenshots/2024r2/treated/screenshot-human-capital-management-help-center-desktop-updated.png",
        alt: "Workday HCM help center",
        caption:
          "Help center product UI from the official Workday HR service delivery page.",
        source:
          "https://www.workday.com/en-us/products/human-capital-management/hr-service-delivery.html",
        featureIds: ["core-hris"],
        useCaseIds: ["enterprise-hcm"],
      },
    ],
    videos: [
      {
        videoId: "SVguFcK8LWg",
        title: "Workday GO for Instant Transformation",
        channelName: "Workday",
        sourceOrganization: "Workday, Inc.",
        description:
          "Official Workday GO packaged-deployment overview from the Workday YouTube channel.",
        featureIds: ["core-hris", "payroll-processing"],
        useCaseIds: ["enterprise-hcm"],
      },
    ],
  },
};

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
    featureIds: shot.featureIds ?? [],
    useCaseIds: shot.useCaseIds ?? [],
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
    featureIds: video.featureIds ?? [],
    requirementIds: [],
    useCaseIds: video.useCaseIds ?? [],
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

function mergeEnrichment(slug) {
  const enrichmentPath = path.join(
    ROOT,
    "src/data/research",
    slug,
    "enrichment.json",
  );
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
  for (const shot of plan.shots) {
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
  for (const video of plan.videos) {
    const entry = buildMedia(slug, video);
    if (existingMediaIds.has(entry.id) || existingVideoIds.has(entry.videoId)) continue;
    data.media.push(entry);
    existingMediaIds.add(entry.id);
    existingVideoIds.add(entry.videoId);
    mediaAdded++;
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
  return { shotsAdded, mediaAdded, vendorUi, publishedMedia, enrichmentPath };
}

async function processProduct(slug) {
  const plan = PRODUCTS[slug];
  if (!plan) throw new Error(`Unknown slug: ${slug}`);
  const dir = path.join(ROOT, "public/vendor-ui", slug);
  fs.mkdirSync(dir, { recursive: true });

  const downloadResults = [];
  for (const shot of plan.shots) {
    const dest = path.join(dir, shot.file);
    try {
      const result = await download(shot.url, dest);
      downloadResults.push({ file: shot.file, ok: true, ...result, url: shot.url });
    } catch (err) {
      downloadResults.push({
        file: shot.file,
        ok: false,
        error: String(err.message || err),
        url: shot.url,
      });
    }
  }

  const okFiles = new Set(
    downloadResults.filter((r) => r.ok).map((r) => r.file),
  );
  const original = plan.shots;
  plan.shots = plan.shots.filter((s) => okFiles.has(s.file));
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
    const result = await processProduct(slug);
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
    const fails = result.downloadResults.filter((r) => !r.ok);
    if (fails.length) console.warn(`  ⚠ ${fails.length} download failure(s)`);
    summary.push(result);
  }

  console.log("\n=== SUMMARY ===");
  for (const s of summary) {
    console.log(
      `${s.slug}\tvendor-ui=${s.vendorUi}\tvideos=${s.publishedMedia}\t(+${s.shotsAdded}/+${s.mediaAdded})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
