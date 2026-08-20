/**
 * Affiliate gap Business Communications pack.
 * fastmail, sanebox.
 *
 * Research, enrichment, assessments, and reviews already onboarded 2026-08-17
 * (business-communications Wave-1). writeProduct() would clobber those artifacts —
 * this pack exports comparison stubs only plus SKIP_PRODUCT_WRITE for the batch runner.
 *
 * VERIFIED_AT refreshed for affiliate-gap batch metadata.
 */
export const VERIFIED_AT = "2026-08-19T12:00:00.000Z";

/**
 * When true, onboard batch must NOT call writeProduct() for PRODUCTS in this pack.
 * Existing src/data/research/{fastmail,sanebox}/ and editorial assessments stand.
 */
export const SKIP_PRODUCT_WRITE = true;

/** Scores mirror approved assessments — used by writeComparisonSpec only. */
const COMPARISON_STUBS = [
  {
    slug: "fastmail",
    name: "Fastmail",
    company: "Fastmail Pty Ltd",
    website: "https://www.fastmail.com",
    skipWrite: true,
    membershipRole: "adjacent",
    jobCluster: "inbox-adjacent",
    startingPriceMonthly: 3,
    startingPriceConfidence: "high",
    alternativeSlugs: ["sanebox"],
    competitorSlugs: ["sanebox"],
    comparableSlugs: ["sanebox"],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 4,
      "routing-workflows": 5,
      integrations: 5,
      analytics: 2,
      "outbound-tools": 2,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 2,
    },
  },
  {
    slug: "sanebox",
    name: "SaneBox",
    company: "SaneBox, Inc.",
    website: "https://www.sanebox.com",
    skipWrite: true,
    membershipRole: "adjacent",
    jobCluster: "inbox-adjacent",
    startingPriceMonthly: 4.92,
    startingPriceConfidence: "high",
    alternativeSlugs: ["fastmail"],
    competitorSlugs: ["fastmail"],
    comparableSlugs: ["fastmail"],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 3,
      "routing-workflows": 6,
      integrations: 4,
      analytics: 3,
      "outbound-tools": 2,
      scalability: 4,
      "value-for-money": 6,
      "ai-capabilities": 5,
    },
  },
];

export const PRODUCTS = COMPARISON_STUBS;

export const COMPARISON_PAIRS = [["fastmail", "sanebox"]];
