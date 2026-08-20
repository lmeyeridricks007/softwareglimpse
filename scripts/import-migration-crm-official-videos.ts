/**
 * Batch-register and activate verified official vendor YouTube videos
 * for migration-gap CRM products via the Approved Asset Workflow.
 *
 * Usage: npx tsx scripts/import-migration-crm-official-videos.ts
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
};

/** Official-channel videos verified via YouTube oEmbed author_name. */
const VIDEOS: VideoSpec[] = [
  {
    product: "affinity",
    videoId: "n8SDv-w17Gc",
    title: "Introduction to Affinity for Venture Capital",
    channel: "Affinity",
    org: "Affinity",
    assetType: "official-product-video",
    shows: [
      "Affinity network and lists workspace layout",
      "Relationship intelligence and deal-flow list workflows",
    ],
    features: ["contact-management", "pipeline-management", "deal-management"],
  },
  {
    product: "affinity",
    videoId: "FrKIjthCRcA",
    title: "How to Use Relationship Intelligence in your CRM",
    channel: "Affinity",
    org: "Affinity",
    assetType: "official-tutorial",
    shows: [
      "Automatic email and calendar capture into Affinity profiles",
      "Relationship strength and warm-introduction workflows",
    ],
    features: ["contact-management", "email-sync"],
  },
  {
    product: "agile-crm",
    videoId: "Bg3DWGZBSa0",
    title: "Sales Automation",
    channel: "Agile CRM",
    org: "Agile CRM",
    assetType: "official-product-video",
    shows: [
      "Agile CRM sales automation surfaces",
      "Pipeline and follow-up automation as shown by Agile CRM",
    ],
    features: ["sales-automation", "pipeline-management"],
  },
  {
    product: "apptivo",
    videoId: "JbJVBtcUVXc",
    title: "What is Apptivo?",
    channel: "Apptivo Inc.",
    org: "Apptivo",
    assetType: "official-product-video",
    shows: [
      "Apptivo product overview and app suite positioning",
      "CRM suite navigation as marketed by Apptivo",
    ],
    features: ["contact-management", "pipeline-management"],
  },
  {
    product: "apptivo",
    videoId: "jFUPGMo4epQ",
    title: "Apptivo - Beginner's Guide to Apptivo CRM",
    channel: "Apptivo Inc.",
    org: "Apptivo",
    assetType: "official-tutorial",
    shows: [
      "Apptivo CRM end-user navigation and core apps",
      "Customer and activity collaboration basics",
    ],
    features: ["contact-management", "pipeline-management"],
  },
  {
    product: "cloze",
    videoId: "woCC-jYneOY",
    title: "Cloze CRM: Section Tour",
    channel: "Cloze",
    org: "Cloze",
    assetType: "official-tutorial",
    shows: [
      "Cloze Agenda, People, and section navigation",
      "Contact audiences and keep-in-touch workflow surfaces",
    ],
    features: ["contact-management", "email-sync", "pipeline-management"],
  },
  {
    product: "mailchimp",
    videoId: "81cbkLjXqmY",
    title: "Import + Organize Contacts in Mailchimp (2023)",
    channel: "Intuit Mailchimp",
    org: "Mailchimp",
    assetType: "official-tutorial",
    shows: [
      "Mailchimp audience import and contact organization",
      "Tags, segments, and audience dashboard surfaces",
    ],
    features: ["contact-management", "lead-management"],
  },
  {
    product: "netsuite",
    videoId: "ynk0A_NUF6M",
    title: "NetSuite CRM: Sales",
    channel: "NetSuite",
    org: "Oracle NetSuite",
    assetType: "official-product-video",
    shows: [
      "NetSuite CRM sales dashboard and opportunity workflow",
      "Pipeline, activities, and customer transaction context",
    ],
    features: ["pipeline-management", "deal-management", "contact-management"],
  },
  {
    product: "pipelinepro",
    videoId: "-hXbGD0R24k",
    title: "Pipeline CRM Full Demo: Automate Your Sales Process in 10 Minutes",
    channel: "Pipeline CRM",
    org: "Pipeline CRM",
    assetType: "official-product-video",
    shows: [
      "Pipeline CRM deals, people, and companies list views",
      "Automation and sales process walkthrough from Pipeline CRM",
    ],
    features: ["pipeline-management", "deal-management", "sales-automation"],
  },
  {
    product: "pipelinepro",
    videoId: "aKYCcRywuYM",
    title:
      "Pipeline CRM Tour: Home Dashboard, Pipeline & Activity Feed in 5 Minutes",
    channel: "Pipeline CRM",
    org: "Pipeline CRM",
    assetType: "official-tutorial",
    shows: [
      "Pipeline CRM home dashboard and pipeline board",
      "Activity feed, tasks, and record creation basics",
    ],
    features: ["pipeline-management", "contact-management"],
  },
  {
    product: "wealthbox",
    videoId: "-6hyJwGg4D4",
    title: "How to Invite the Wealthbox AI Notetaker to a Virtual Meeting",
    channel: "Wealthbox",
    org: "Wealthbox",
    assetType: "official-tutorial",
    shows: [
      "Wealthbox AI Notetaker meeting invite workflow",
      "Advisor CRM meeting capture as shown by Wealthbox",
    ],
    features: ["contact-management"],
  },
  {
    product: "marketo",
    videoId: "LQR3dB53blI",
    title:
      "Create One-to-One Personalized Experiences at Scale with Marketo Engage",
    channel: "Adobe for Business",
    org: "Adobe",
    assetType: "official-product-video",
    shows: [
      "Marketo Engage Smart Campaigns and personalization surfaces",
      "Engagement data and content library as marketed by Adobe",
    ],
    features: ["lead-management", "sales-automation", "email-sync"],
  },
  {
    product: "tidio",
    videoId: "QDWFFTFN6Ro",
    title: "Tidio Demo: Complete Walkthrough of All Features (2026)",
    channel: "Tidio",
    org: "Tidio",
    assetType: "official-product-video",
    shows: [
      "Tidio live chat, Flows, Lyro AI, and Help Desk overview",
      "Unified inbox and automation surfaces from Tidio",
    ],
    features: ["contact-management", "lead-management"],
  },
  {
    product: "pega",
    videoId: "BGJ6Ffp3SiE",
    title: "Pega Express Bytes: What is Pega Express? We can tell you in 90 seconds",
    channel: "Pegasystems",
    org: "Pegasystems",
    assetType: "official-product-video",
    shows: [
      "Pega Express delivery approach and microjourney framing",
      "How Pegasystems positions Express for faster CRM outcomes",
    ],
    features: ["pipeline-management", "sales-automation"],
  },
  {
    product: "pega",
    videoId: "e5AoSCO-wAg",
    title: "Nationwide Building Society Transforms with Pega Customer Decision Hub",
    channel: "Pegasystems",
    org: "Pegasystems",
    assetType: "official-product-video",
    shows: [
      "Pega Customer Decision Hub in a real customer engagement program",
      "Next-best-action CRM decisioning as marketed by Pegasystems",
    ],
    features: ["lead-management", "sales-automation"],
  },
  {
    product: "podio",
    videoId: "kdFX6z_7FfI",
    title: "Podio - how to work smarter, in your way",
    channel: "Progress Podio",
    org: "Citrix Podio",
    assetType: "official-product-video",
    shows: [
      "Podio workspaces, apps, and employee network overview",
      "Custom CRM-style project and recruiting apps built in Podio",
    ],
    features: ["contact-management", "pipeline-management"],
  },
  {
    product: "zendesk",
    videoId: "zYdVo5ewMek",
    title: "Introducing Zendesk Sell",
    channel: "Zendesk",
    org: "Zendesk",
    assetType: "official-product-video",
    shows: [
      "Zendesk Sell product introduction and sales CRM positioning",
      "Pipeline and sales activity surfaces as marketed by Zendesk",
    ],
    features: ["pipeline-management", "deal-management", "contact-management"],
  },
  {
    product: "zendesk",
    videoId: "tIe8upjycR8",
    title: "Zendesk Sell: Mobile App Demo",
    channel: "Zendesk",
    org: "Zendesk",
    assetType: "official-tutorial",
    shows: [
      "Zendesk Sell mobile CRM navigation and deal updates",
      "On-the-go pipeline and contact workflows from Zendesk",
    ],
    features: ["pipeline-management", "contact-management"],
  },
  {
    product: "pardot",
    videoId: "TJmFTiZ8km4",
    title:
      "Salesforce Marketing Cloud Account Engagement: B2B Marketing Automation Overview Demo",
    channel: "Salesforce Product Center",
    org: "Salesforce",
    assetType: "official-product-video",
    shows: [
      "Account Engagement (Pardot) B2B marketing automation overview",
      "Lead engagement and sales alignment surfaces from Salesforce",
    ],
    features: ["lead-management", "sales-automation", "email-sync"],
  },
  {
    product: "pardot",
    videoId: "tpwbPgJ-bis",
    title: "What’s Next for Marketing Cloud Account Engagement?",
    channel: "Salesforce",
    org: "Salesforce",
    assetType: "official-product-video",
    shows: [
      "Salesforce roadmap framing for Account Engagement (Pardot)",
      "How Account Engagement fits Agentforce Marketing",
    ],
    features: ["lead-management", "sales-automation"],
  },
  {
    product: "act",
    videoId: "0viY7UOn658",
    title: "Introduction to Act! CRM",
    channel: "Act! CRM",
    org: "ACT!",
    assetType: "official-product-video",
    shows: [
      "Act! CRM welcome screen, contacts, and opportunity dashlets",
      "Sales, marketing, and service navigation in Act! Cloud",
    ],
    features: ["contact-management", "pipeline-management", "deal-management"],
  },
  {
    product: "act",
    videoId: "tdU4rvvMmJE",
    title: "Act! CRM Training | Fundamentals: Mastering the Basics",
    channel: "Act! CRM",
    org: "ACT!",
    assetType: "official-tutorial",
    shows: [
      "Act! fundamentals for contacts, companies, and activities",
      "Core CRM navigation taught by the Act! CRM channel",
    ],
    features: ["contact-management", "pipeline-management"],
  },
  {
    product: "sap",
    videoId: "X8-jSdLP1h4",
    title: "Discover the New SAP Sales Cloud: Your Guide to Modern Selling Solutions",
    channel: "SAP",
    org: "SAP",
    assetType: "official-product-video",
    shows: [
      "SAP Sales Cloud guided selling and AI insights overview",
      "Modern sales workspace capabilities from SAP",
    ],
    features: ["pipeline-management", "deal-management", "lead-management"],
  },
  {
    product: "sap",
    videoId: "w0PyfiS4G_Q",
    title:
      "SAP Sales Cloud Version 2 with SAP S/4HANA in Action | Product Inspiration Series",
    channel: "SAP Help and Learning",
    org: "SAP",
    assetType: "official-tutorial",
    shows: [
      "SAP Sales Cloud V2 guided selling and lead management demo",
      "Customer insights and generative AI account synopsis surfaces",
    ],
    features: ["pipeline-management", "deal-management", "lead-management"],
  },
  {
    product: "siebel",
    videoId: "7fyINzHoyCM",
    title:
      "Transcribing voice messages for service requests in Siebel CRM using OCI Speech",
    channel: "Oracle Developers",
    org: "Oracle",
    assetType: "official-tutorial",
    shows: [
      "Siebel CRM service request workflow with OCI Speech transcription",
      "Official Oracle Developers demo of Siebel + OCI AI integration",
    ],
    features: ["contact-management", "pipeline-management"],
  },
  {
    product: "siebel",
    videoId: "_-AjaoNsWTc",
    title: "Book Appointments in Siebel CRM and Oracle Fusion Field Service",
    channel: "Oracle Integration",
    org: "Oracle",
    assetType: "official-tutorial",
    shows: [
      "Siebel CRM appointment booking with Fusion Field Service",
      "Official Oracle Integration walkthrough of CRM field workflows",
    ],
    features: ["contact-management", "pipeline-management"],
  },
];

function runOne(spec: VideoSpec): { ok: boolean; detail: string } {
  const sourceUrl = `https://www.youtube.com/watch?v=${spec.videoId}`;
  const registered = registerApprovedAssetCandidate({
    productSlug: spec.product,
    sourceUrl,
    title: spec.title,
    assetType: spec.assetType ?? "official-product-video",
    whatThisShows: spec.shows,
    sourceOrganization: spec.org,
  });
  if (!registered.ok) {
    return { ok: false, detail: `register: ${registered.message}` };
  }

  let c = registered.candidate;
  saveApprovedAssetCandidate(c);

  const verified = verifyCandidateSource(c, {
    officialSourceKind: "vendor-channel",
    productSlug: spec.product,
    channelName: spec.channel,
    sourceOrganization: spec.org,
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
      capabilityIds: ["contact-management", "pipeline-management"],
    },
  });
  if (!mapped.ok) {
    return { ok: false, detail: `map: ${mapped.message}` };
  }
  c = mapped.candidate;

  const placed = addPlacementRecommendation(c, {
    pageRoute: `/software/${spec.product}/`,
    pageType: "software-review",
    sectionId: "overview",
    sectionTitle: "Overview",
    mediaPlacement: "overview",
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
