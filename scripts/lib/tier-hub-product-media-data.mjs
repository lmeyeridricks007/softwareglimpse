/**
 * Tier-hub product media: official YouTube videos + vendor-ui screenshots
 * for thin category launch rosters. Merges coverage-gap video specs with
 * YouTube thumbnail screenshots when first-party UI assets are unavailable.
 */
export const TIER_HUB_TARGET_SLUGS = [
  "7shifts",
  "agorapulse",
  "ashby",
  "clickfunnels",
  "cloudways",
  "deputy",
  "directadmin",
  "evolve",
  "flippa",
  "greenhouse",
  "haloitsm",
  "homebase",
  "hootsuite",
  "kinsta",
  "later",
  "leadpages",
  "lever",
  "manageengine-servicedesk-plus",
  "meltwater",
  "mindstudio",
  "quillbot",
  "siteground",
  "sprout-social",
  "switcher-studio",
  "sysaid",
  "webinarjam-everwebinar",
  "whatconverts",
  "when-i-work",
  "workable",
  "zypper",
];

/** Manual additions not present in coverage-gap JSON batches. */
export const MANUAL_VIDEO_SPECS = [
  {
    product: "quillbot",
    videoId: "3bGyaBlQeS0",
    title: "Paraphrase with QuillBot and make writing painless today.",
    channel: "Quillbot",
    org: "QuillBot",
    assetType: "official-product-video",
    shows: [
      "Official QuillBot paraphrasing and writing assistant positioning",
      "Vendor-produced product advertisement on the QuillBot YouTube channel",
    ],
    features: ["writing-assist"],
    placement: "overview",
  },
  {
    product: "kinsta",
    videoId: "PKB91icvQng",
    title: "Faster, Safer, Smarter Hosting Starts with Kinsta",
    channel: "Kinsta",
    org: "Kinsta",
    assetType: "official-product-video",
    shows: [
      "Kinsta managed WordPress hosting product overview",
      "Dedicated environments, edge caching, and migrations from the Kinsta channel",
    ],
    features: ["managed-hosting"],
    placement: "overview",
  },
  {
    product: "sysaid",
    videoId: "T22hMsgCcps",
    title: "Power Hour: How to Add a New Department in SysAid #9",
    channel: "SysAid",
    org: "SysAid",
    assetType: "official-tutorial",
    shows: [
      "SysAid ITSM to ESM department onboarding walkthrough",
      "Live product demo from the official SysAid YouTube channel",
    ],
    features: ["incident-management", "service-catalog"],
    placement: "overview",
  },
  {
    product: "whatconverts",
    videoId: "9XlrTkdWMrs",
    title: "Send leads from WhatConverts to Zoho CRM",
    channel: "WhatConverts",
    org: "WhatConverts",
    assetType: "official-tutorial",
    shows: [
      "WhatConverts lead mapping and CRM integration workflow",
      "Official tutorial from the WhatConverts YouTube channel",
    ],
    features: ["analytics", "forms-lead-capture"],
    placement: "overview",
  },
  {
    product: "siteground",
    videoId: "KvLuIS7TdKc",
    title: "How to make the most out of AI in WordPress 7.0?",
    channel: "SiteGround.com",
    org: "SiteGround",
    assetType: "official-product-video",
    shows: [
      "SiteGround AI and WordPress product positioning",
      "Official SiteGround YouTube channel webinar trailer",
    ],
    features: ["managed-hosting"],
    placement: "overview",
  },
];

export const COVERAGE_GAP_FILES = [
  "_coverage-gap-official-videos.json",
  "_coverage-gap-wave2-official-videos.json",
  "_coverage-gap-wave3-official-videos.json",
  "_coverage-gap-wave4-official-videos.json",
];
