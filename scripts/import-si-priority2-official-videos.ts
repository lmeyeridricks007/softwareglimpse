/**
 * Register + activate official vendor YouTube videos for SI Priority-2 products
 * via the Approved Asset Workflow.
 *
 * Usage: npx tsx scripts/import-si-priority2-official-videos.ts
 */
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

/** Official-channel videos verified via YouTube oEmbed author_name (2026-08-17). */
const VIDEOS: VideoSpec[] = [
  // 6sense
  {
    product: "sixsense",
    videoId: "DjzS_DZOEYw",
    title: "How 6sense BDRs Use Rich Intelligence to Book More Meetings",
    channel: "6sense",
    org: "6sense",
    shows: [
      "BDR workflow using 6sense sales intelligence",
      "Account and buyer signal prioritization",
    ],
    features: ["prospecting", "contact-data", "ai-assistance"],
    placement: "overview",
  },
  {
    product: "sixsense",
    videoId: "r9wxryV4BvQ",
    title: "6sense Sales Explainer Video",
    channel: "6sense",
    org: "6sense",
    shows: [
      "6sense sales intelligence product positioning",
      "How sales teams use account intelligence",
    ],
    features: ["prospecting", "lead-scoring"],
    placement: "overview",
  },
  {
    product: "sixsense",
    videoId: "Iv9rAS1mNPw",
    title:
      "Ways 6sense AEs Use AI to Accelerate Open Opportunities & Boost Deal Sizes",
    channel: "6sense",
    org: "6sense",
    assetType: "official-tutorial",
    shows: [
      "AE workflows using 6sense AI on open opportunities",
      "Deal acceleration with account intelligence",
    ],
    features: ["ai-assistance", "prospecting", "reporting"],
    placement: "features",
  },

  // Demandbase
  {
    product: "demandbase",
    videoId: "1G5ItvG8ivU",
    title: "Demandbase One. Something for Everyone.",
    channel: "Demandbase",
    org: "Demandbase",
    shows: [
      "Demandbase One platform overview",
      "Account-based go-to-market framing",
    ],
    features: ["prospecting", "data-enrichment", "reporting"],
    placement: "overview",
  },
  {
    product: "demandbase",
    videoId: "qYY57bRnHTk",
    title: "An Inside Look at the New Demandbase",
    channel: "Demandbase",
    org: "Demandbase",
    shows: [
      "Demandbase product UI walkthrough",
      "Account intelligence and ABX surfaces",
    ],
    features: ["prospecting", "crm-sync", "reporting"],
    placement: "features",
  },
  {
    product: "demandbase",
    videoId: "A2HYw1oh5oI",
    title: "Account Journey Builder: Enhance Your ABM Strategy with Demandbase One",
    channel: "Demandbase",
    org: "Demandbase",
    assetType: "official-tutorial",
    shows: [
      "Account Journey Builder in Demandbase One",
      "ABM orchestration across account stages",
    ],
    features: ["lead-management", "reporting", "prospecting"],
    placement: "features",
  },

  // Seamless.AI
  {
    product: "seamless-ai",
    videoId: "zYvxvkyLS3c",
    title: "How to Use the Seamless Chrome Extension on LinkedIn",
    channel: "Seamless",
    org: "Seamless Contacts",
    assetType: "official-tutorial",
    shows: [
      "Chrome extension prospecting on LinkedIn",
      "Contact capture workflow",
    ],
    features: ["prospecting", "contact-data"],
    placement: "features",
  },
  {
    product: "seamless-ai",
    videoId: "TRs5KQyNahw",
    title: "How to Use All NEW Seamless AI | Full Beginner Tour & Step-By-Step Tutorial",
    channel: "Seamless",
    org: "Seamless Contacts",
    assetType: "official-tutorial",
    shows: [
      "Full Seamless.AI product tour for beginners",
      "Step-by-step prospecting and contact workflows",
    ],
    features: ["prospecting", "contact-data", "email-outreach"],
    placement: "overview",
  },

  // Clay
  {
    product: "clay",
    videoId: "v31hKg-WSCc",
    title: "What is Clay?",
    channel: "Clay",
    org: "Clay",
    shows: [
      "Clay product overview and GTM positioning",
      "Enrichment and table-based workflow framing",
    ],
    features: ["data-enrichment", "prospecting"],
    placement: "overview",
  },
  {
    product: "clay",
    videoId: "Oc5w3FEEijw",
    title: "Clay 101 Lesson 8: Claygent AI Web Research Agent",
    channel: "Clay",
    org: "Clay",
    assetType: "official-tutorial",
    shows: [
      "Claygent AI web research agent walkthrough",
      "Enrichment workflow in Clay tables",
    ],
    features: ["data-enrichment", "ai-assistance", "prospecting"],
    placement: "features",
  },
  {
    product: "clay",
    videoId: "Aa8CyIH9jSY",
    title: "Clay 101: Claygent AI Web Scraper",
    channel: "Clay",
    org: "Clay",
    assetType: "official-tutorial",
    shows: [
      "Claygent AI web scraper setup",
      "Multi-provider research enrichment in Clay",
    ],
    features: ["data-enrichment", "ai-assistance"],
    placement: "features",
  },

  // Clearbit / HubSpot Breeze Intelligence
  {
    product: "clearbit",
    videoId: "Kar1L_8LPx4",
    title: "Breeze Intelligence: HubSpot’s New Data Layer | Spotlight Fall 2024",
    channel: "HubSpot",
    org: "HubSpot",
    shows: [
      "HubSpot Breeze Intelligence data layer overview",
      "Clearbit-powered enrichment positioning inside HubSpot",
    ],
    features: ["data-enrichment", "contact-data", "crm-sync"],
    placement: "overview",
  },
  {
    product: "clearbit",
    videoId: "uwVj-tsDDDo",
    title: "Introducing Form Shortening With Breeze Intelligence | Spotlight Fall 2024",
    channel: "HubSpot",
    org: "HubSpot",
    assetType: "official-tutorial",
    shows: [
      "Form shortening powered by Breeze Intelligence",
      "Inbound enrichment reducing form fields",
    ],
    features: ["data-enrichment", "lead-management"],
    placement: "features",
  },
  {
    product: "clearbit",
    videoId: "avrRGdfErg4",
    title: "Buyer Intent From Breeze Intelligence | Spotlight Fall 2024",
    channel: "HubSpot",
    org: "HubSpot",
    assetType: "official-tutorial",
    shows: [
      "Buyer intent signals from Breeze Intelligence",
      "How HubSpot surfaces intent for sales/marketing",
    ],
    features: ["prospecting", "data-enrichment", "lead-scoring"],
    placement: "features",
  },
  {
    product: "clearbit",
    videoId: "8fT7RKEyiVA",
    title: "What can Enrichment do for me?",
    channel: "Clearbit",
    org: "HubSpot",
    shows: [
      "Clearbit enrichment value and use cases",
      "Firmographic and person enrichment concepts",
    ],
    features: ["data-enrichment", "contact-data"],
    placement: "overview",
  },

  // Bombora
  {
    product: "bombora",
    videoId: "Gt8jG9-Y2g8",
    title: "Bombora Company Surge® demo",
    channel: "Bombora",
    org: "Bombora",
    shows: [
      "Company Surge intent dashboard demo",
      "Account surge scoring and topic signals",
    ],
    features: ["prospecting", "data-enrichment", "reporting"],
    placement: "overview",
  },
  {
    product: "bombora",
    videoId: "mi9bA7DItmY",
    title: "Bombora Company Surge® Demonstration",
    channel: "Bombora",
    org: "Bombora",
    assetType: "official-tutorial",
    shows: [
      "Company Surge demonstration walkthrough",
      "Intent topic and surge account workflows",
    ],
    features: ["prospecting", "reporting", "data-enrichment"],
    placement: "features",
  },
  {
    product: "bombora",
    videoId: "32VSB9nXLNM",
    title: "Bombora - Data that lets you do big things",
    channel: "Bombora",
    org: "Bombora",
    shows: [
      "Bombora intent-data positioning",
      "Company Surge value framing",
    ],
    features: ["data-enrichment", "reporting", "prospecting"],
    placement: "overview",
  },
];

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
  let ok = 0;
  for (const spec of VIDEOS) {
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
  console.log(`\nDone: ${ok}/${VIDEOS.length} videos activated`);
}

main();
