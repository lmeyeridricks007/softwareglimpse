import type {
  ChannelDraft,
  DistributionCampaign,
  DistributionVisualSpec,
  SupportingDatum,
} from "@/domain";
import { channelUtm, withUtm } from "./utm";

const BANNED_ON_PIXEL = [
  "Affiliate availability does not rank the list",
  "Fit-based. Not commission-based.",
  "Results are ranked by fit, not sponsors or commissions",
  "Invented prices as facts",
  "Fake scores (e.g. 9.2)",
  "Vendor logos",
];

function datumLine(d: SupportingDatum): string {
  const n = d.sampleSize != null ? ` (n=${d.sampleSize})` : "";
  return `${d.label}: ${d.value}${n}`;
}

function evidenceBlock(campaign: DistributionCampaign): string {
  if (campaign.supportingData.length === 0) return campaign.keyFinding;
  return campaign.supportingData
    .slice(0, 6)
    .map((d) => `• ${datumLine(d)}`)
    .join("\n");
}

function trackedUrl(
  campaign: DistributionCampaign,
  channel: ChannelDraft["channel"],
): string {
  return withUtm(campaign.sourceURL, channelUtm(campaign.utmCampaign, channel));
}

function baseNotes(campaign: DistributionCampaign): string[] {
  return [
    "Draft only — requires human approval before posting.",
    "Do not auto-post.",
    ...campaign.limitations.slice(0, 2),
  ];
}

export function buildVisualSpecs(
  campaign: DistributionCampaign,
): DistributionVisualSpec[] {
  const data = campaign.supportingData.filter((d) => d.value !== "—");
  if (data.length === 0) return [];

  const specs: DistributionVisualSpec[] = [];

  const primary = data[0]!;
  specs.push({
    kind: "stat_card",
    title: campaign.sourceAsset,
    onPixelLines: [primary.value, primary.label],
    dataPoints: [primary],
    captionSuggestion: `${campaign.keyFinding} Source: SoftwareGlimpse.`,
    bannedOnPixel: BANNED_ON_PIXEL,
  });

  if (data.length >= 2) {
    specs.push({
      kind: "chart",
      title: `${campaign.sourceAsset} — key figures`,
      onPixelLines: data.slice(0, 4).map((d) => `${d.label}: ${d.value}`),
      dataPoints: data.slice(0, 4),
      captionSuggestion:
        "Chart uses catalogue-derived figures only. Methodology on the source page.",
      bannedOnPixel: BANNED_ON_PIXEL,
    });
  }

  if (data.length >= 3) {
    specs.push({
      kind: "carousel",
      title: "Insight carousel",
      onPixelLines: [
        "Slide 1: What buyers get wrong",
        ...data.slice(0, 3).map((d, i) => `Slide ${i + 2}: ${d.label} ${d.value}`),
      ],
      dataPoints: data.slice(0, 3),
      captionSuggestion:
        "Carousel: buyer hook first; stats on later slides; trust copy in caption.",
      bannedOnPixel: BANNED_ON_PIXEL,
    });
  }

  if (
    campaign.campaignType === "comparison_finding" ||
    campaign.campaignType === "verified_price_change"
  ) {
    specs.push({
      kind: "comparison_visual",
      title: "Before / after or side-by-side",
      onPixelLines: data.slice(0, 2).map((d) => `${d.label}: ${d.value}`),
      dataPoints: data.slice(0, 2),
      captionSuggestion: "Comparison visual from verified observations only.",
      bannedOnPixel: BANNED_ON_PIXEL,
    });
  }

  return specs;
}

/**
 * Generate all channel drafts for a campaign. Never auto-posts.
 */
export function generateChannelDrafts(
  campaign: DistributionCampaign,
): ChannelDraft[] {
  const visuals = buildVisualSpecs(campaign);
  const evidence = evidenceBlock(campaign);

  const linkedinPersonalUrl = trackedUrl(campaign, "linkedin_personal");
  const n = campaign.supportingData.find((d) => d.sampleSize)?.sampleSize;

  const linkedinPersonal: ChannelDraft = {
    channel: "linkedin_personal",
    campaignId: campaign.id,
    body: buildPersonalLinkedInBody(campaign, evidence, n),
    hashtags: [],
    ctaUrl: linkedinPersonalUrl,
    visualSpecs: visuals.slice(0, 1),
    requiresHumanApproval: true,
    autoPost: false,
    notes: [
      ...baseNotes(campaign),
      "Lead with insight; SoftwareGlimpse attribution is secondary.",
      "Avoid “Check out my latest blog post.”",
    ],
  };

  const linkedinCompany: ChannelDraft = {
    channel: "linkedin_company",
    campaignId: campaign.id,
    headline: campaign.title,
    body: [
      campaign.keyFinding,
      "",
      evidence,
      "",
      `Full methodology: ${trackedUrl(campaign, "linkedin_company")}`,
      "",
      "— SoftwareGlimpse Research",
    ].join("\n"),
    hashtags: ["SoftwareBuying", "CRM", "SaaS"],
    ctaUrl: trackedUrl(campaign, "linkedin_company"),
    visualSpecs: visuals,
    requiresHumanApproval: true,
    autoPost: false,
    notes: baseNotes(campaign),
  };

  const facebook: ChannelDraft = {
    channel: "facebook",
    campaignId: campaign.id,
    body: [
      campaign.keyFinding,
      "",
      "Numbers from our catalogue research (sample sizes on the page):",
      evidence,
      "",
      trackedUrl(campaign, "facebook"),
    ].join("\n"),
    hashtags: [],
    ctaUrl: trackedUrl(campaign, "facebook"),
    visualSpecs: visuals.filter((v) => v.kind === "stat_card" || v.kind === "chart"),
    requiresHumanApproval: true,
    autoPost: false,
    notes: baseNotes(campaign),
  };

  const carouselSlides = [
    "What most CRM buyers ask first is the wrong question.",
    ...campaign.supportingData
      .slice(0, 4)
      .map((d) => `${d.label}: ${d.value}${d.sampleSize != null ? ` (n=${d.sampleSize})` : ""}`),
    "Source + methodology on SoftwareGlimpse — link in caption.",
  ];

  const instagram: ChannelDraft = {
    channel: "instagram_carousel",
    campaignId: campaign.id,
    body: [
      campaign.keyFinding,
      "",
      "Swipe for the numbers (catalogue-derived).",
      `Source: ${trackedUrl(campaign, "instagram_carousel")}`,
      "",
      "Affiliate disclosure: softwareglimpse.com/legal/affiliate-disclosure/",
    ].join("\n"),
    hashtags: [],
    slides: carouselSlides,
    ctaUrl: trackedUrl(campaign, "instagram_carousel"),
    visualSpecs: visuals.filter((v) => v.kind === "carousel" || v.kind === "stat_card"),
    requiresHumanApproval: true,
    autoPost: false,
    notes: [
      ...baseNotes(campaign),
      "On-pixel: buyer hook + stats only. No affiliate lectures on the PNG.",
    ],
  };

  const newsletter: ChannelDraft = {
    channel: "newsletter",
    campaignId: campaign.id,
    headline: campaign.sourceAsset,
    body: [
      campaign.keyFinding,
      "",
      evidence,
      "",
      `Read more: ${trackedUrl(campaign, "newsletter")}`,
    ].join("\n"),
    hashtags: [],
    ctaUrl: trackedUrl(campaign, "newsletter"),
    visualSpecs: [],
    requiresHumanApproval: true,
    autoPost: false,
    notes: baseNotes(campaign),
  };

  const reddit: ChannelDraft = {
    channel: "reddit",
    campaignId: campaign.id,
    headline: insightRedditTitle(campaign),
    body: [
      "Discussion outline (help-first — not a dump link):",
      "",
      `1. Context: ${campaign.sourceAsset}`,
      `2. Finding: ${campaign.keyFinding}`,
      "3. Evidence:",
      evidence,
      "4. Limitations:",
      ...campaign.limitations.slice(0, 3).map((l) => `   - ${l}`),
      `5. Optional source (if asked): ${trackedUrl(campaign, "reddit")}`,
      "",
      "Do not spam subreddits. Post only where the sub allows research discussion.",
    ].join("\n"),
    hashtags: [],
    ctaUrl: trackedUrl(campaign, "reddit"),
    visualSpecs: [],
    requiresHumanApproval: true,
    autoPost: false,
    notes: [
      ...baseNotes(campaign),
      "Reddit: discussion outline only — human decides whether/where to post.",
    ],
  };

  const shortVideo: ChannelDraft = {
    channel: "short_video",
    campaignId: campaign.id,
    body: [
      "SCRIPT (30–45s)",
      "Hook (0–5s): Most CRM pricing posts quote a vendor. We compared catalogue list prices.",
      `Insight (5–20s): ${campaign.keyFinding}`,
      "Evidence (20–35s):",
      evidence,
      `Close (35–45s): Full sample + methodology: ${trackedUrl(campaign, "short_video")}`,
      "",
      "On-screen: stats from supportingData only. No vendor logos. No fake scores.",
    ].join("\n"),
    hashtags: [],
    ctaUrl: trackedUrl(campaign, "short_video"),
    visualSpecs: visuals,
    requiresHumanApproval: true,
    autoPost: false,
    notes: baseNotes(campaign),
  };

  return [
    linkedinPersonal,
    linkedinCompany,
    facebook,
    instagram,
    newsletter,
    reddit,
    shortVideo,
  ];
}

function buildPersonalLinkedInBody(
  campaign: DistributionCampaign,
  evidence: string,
  sampleHint?: number,
): string {
  if (campaign.campaignType === "research_insight") {
    const n =
      sampleHint ??
      campaign.supportingData.find((d) => d.sampleSize)?.sampleSize;
    return [
      n != null
        ? `I analysed pricing across ${n} CRM platforms.`
        : "I dug into CRM list pricing across our research catalogue.",
      "",
      "The interesting part wasn't the cheapest platform.",
      "",
      "It was what the medians and free-plan share actually look like when you refuse to invent market averages:",
      "",
      evidence,
      "",
      `Method + sample notes: ${campaign.sourceURL}`,
      "",
      "(Work done via SoftwareGlimpse research — figures are catalogue-derived, not survey folklore.)",
    ].join("\n");
  }

  if (campaign.campaignType === "verified_price_change") {
    return [
      "A CRM list-price change just cleared verification.",
      "",
      "Not a rumour thread — a CONFIRMED delta against our price observations:",
      "",
      evidence,
      "",
      `Details: ${campaign.sourceURL}`,
      "",
      "SoftwareGlimpse tracks observations; we don't invent history.",
    ].join("\n");
  }

  if (campaign.campaignType === "product_testing") {
    return [
      "Hands-on testing only counts when a session is completed.",
      "",
      campaign.keyFinding,
      "",
      evidence,
      "",
      `Public summary lives on: ${campaign.sourceURL}`,
      "",
      "SoftwareGlimpse — evidence levels stay honest.",
    ].join("\n");
  }

  return [
    campaign.keyFinding,
    "",
    evidence,
    "",
    `Source: ${campaign.sourceURL}`,
  ].join("\n");
}

function insightRedditTitle(campaign: DistributionCampaign): string {
  if (campaign.campaignType === "research_insight") {
    return "CRM list-price medians from a transparent catalogue sample (not a vendor survey)";
  }
  if (campaign.campaignType === "verified_price_change") {
    return "Verified CRM list-price change — what moved";
  }
  return campaign.title;
}
