/**
 * Register + activate official vendor YouTube videos for SI Priority-3 products
 * via the Approved Asset Workflow.
 *
 * Loads specs from scripts/_si-priority3-official-videos.json when present.
 *
 * Usage: npx tsx scripts/import-si-priority3-official-videos.ts
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

/** Fallback inline list — kept in sync with _si-priority3-official-videos.json. */
const INLINE_VIDEOS: VideoSpec[] = [
  {
    product: "uplead",
    videoId: "6E36imNzyd4",
    title: "UpLead - Full Demo (2018)",
    channel: "UpLead",
    org: "UpLead",
    shows: [
      "UpLead product demo walkthrough",
      "Contact search and verification workflow",
    ],
    features: ["contact-data", "prospecting", "crm-sync"],
    placement: "overview",
  },
  {
    product: "leadiq",
    videoId: "9tetPqX6SBc",
    title: "LeadIQ Identify: Find, capture, and sync contact data for prospecting",
    channel: "LeadIQ",
    org: "LeadIQ",
    shows: [
      "LeadIQ Identify capture workflow",
      "Contact sync into prospecting stack",
    ],
    features: ["prospecting", "contact-data", "crm-sync"],
    placement: "features",
  },
  {
    product: "leadiq",
    videoId: "vj3lYJJJIU0",
    title: "LeadIQ: Grow sales pipeline through intelligent prospecting",
    channel: "LeadIQ",
    org: "LeadIQ",
    shows: [
      "LeadIQ intelligent prospecting overview",
      "Pipeline growth positioning",
    ],
    features: ["prospecting", "ai-assistance", "crm-sync"],
    placement: "overview",
  },
  {
    product: "hunter",
    videoId: "drfArbarAKw",
    title: "How to Find a list of Emails using Hunter.io's Bulk Domain Search",
    channel: "Hunter",
    org: "Hunter",
    shows: [
      "Hunter bulk domain search workflow",
      "Building an email list from a domain",
    ],
    features: ["prospecting", "contact-data", "email-outreach"],
    placement: "features",
  },
  {
    product: "snov",
    videoId: "N4V81iIWOEA",
    title: "LinkedIn + Email + Phone: The Omnichannel Sequence in Snov.io",
    channel: "Snovio",
    org: "Snov.io",
    shows: [
      "Snov.io omnichannel sequence UI demo",
      "LinkedIn + email + phone sequence workflow",
    ],
    features: ["email-outreach", "email-sequences", "prospecting"],
    placement: "features",
  },
  {
    product: "snov",
    videoId: "Ov8CJzDZMd8",
    title: "Find phone numbers with email address with Snov.io",
    channel: "Snovio",
    org: "Snov.io",
    shows: [
      "Finding phone numbers from email in Snov.io",
      "Contact enrichment UI demo",
    ],
    features: ["contact-data", "data-enrichment", "prospecting"],
    placement: "features",
  },
  {
    product: "kaspr",
    videoId: "62gaE6gEEHY",
    title: "Export Leads from LinkedIn to Your CRM – Fast & Easy",
    channel: "Kaspr",
    org: "Kaspr",
    shows: [
      "Exporting LinkedIn leads to CRM with Kaspr",
      "Chrome extension capture workflow",
    ],
    features: ["prospecting", "crm-sync", "contact-data"],
    placement: "features",
  },
  {
    product: "kaspr",
    videoId: "HjwozM3flxk",
    title: "How to: Discovering your first leads",
    channel: "Kaspr",
    org: "Kaspr",
    shows: [
      "Discovering first leads in Kaspr",
      "LinkedIn-led prospecting intro",
    ],
    features: ["prospecting", "contact-data"],
    placement: "overview",
  },
  {
    product: "kaspr",
    videoId: "JqQ9YyGK_GA",
    title: "How to: Launch your first automation",
    channel: "Kaspr",
    org: "Kaspr",
    shows: [
      "Launching first automation in Kaspr",
      "Automation workflow overview",
    ],
    features: ["prospecting", "integrations"],
    placement: "features",
  },
  {
    product: "ocean",
    videoId: "jv9OTqzhdLg",
    title:
      "Ocean.io explained in 2 minutes — Find the right companies and right people",
    channel: "Ocean",
    org: "Ocean.io",
    shows: [
      "Ocean.io lookalike prospecting overview",
      "Finding right companies and people",
    ],
    features: ["prospecting", "data-enrichment", "contact-data"],
    placement: "overview",
  },
];

function loadVideos(): VideoSpec[] {
  const jsonPath = join(
    process.cwd(),
    "scripts/_si-priority3-official-videos.json",
  );
  if (existsSync(jsonPath)) {
    const raw = JSON.parse(readFileSync(jsonPath, "utf8")) as VideoSpec[];
    return raw.map((v) => ({
      ...v,
      placement:
        v.placement ??
        (v.assetType === "official-tutorial" ? "features" : "overview"),
    }));
  }
  return INLINE_VIDEOS;
}

function runOne(spec: VideoSpec): { ok: boolean; detail: string } {
  const url = `https://www.youtube.com/watch?v=${spec.videoId}`;
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
  let c = registered.candidate;
  saveApprovedAssetCandidate(c);

  const verified = verifyCandidateSource(c, {
    officialSourceKind: "vendor-channel",
    channelName: spec.channel,
    organizationName: spec.org,
  });
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
      useCaseIds: ["prospecting", "data-enrichment"],
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
