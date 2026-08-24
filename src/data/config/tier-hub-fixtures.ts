/**
 * Expected hub rosters for thin tier category launches.
 * Used by completeness tests — must stay aligned with category-product-membership patches.
 */
export type TierHubFixture = {
  /** Minimum products on grid, logo strip, and reviews rail */
  minProducts: number;
  /** Expected product slugs (core membership roster) */
  products: readonly string[];
  /** Minimum comparisons surfaced on the hub */
  minComparisons: number;
  chooseGuideHref?: string;
};

/** Products scheduled for a later launch wave — media gates are deferred. */
export const TIER_HUB_MEDIA_DEFERRED_SLUGS = new Set([
  "webinarjam-everwebinar",
]);

export const TIER_HUB_FIXTURES: Record<string, TierHubFixture> = {
  "social-media-marketing": {
    minProducts: 5,
    products: [
      "brand24",
      "zypper",
      "sprout-social",
      "meltwater",
      "brandwatch",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-social-media-marketing-software/",
  },
  "analytics-bi": {
    minProducts: 5,
    products: [
      "databox",
      "brand24",
      "meltwater",
      "whatconverts",
      "uniqode",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-analytics-bi-software/",
  },
  "reputation-reviews": {
    minProducts: 5,
    products: ["wati", "shore", "nicejob", "ueni", "uniqode"],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-reputation-reviews-software/",
  },
  "field-service-operations": {
    minProducts: 5,
    products: [
      "connecteam",
      "jibble",
      "servicem8",
      "contractor-foreman",
      "shore",
    ],
    minComparisons: 3,
    chooseGuideHref:
      "/guides/how-to-choose-field-service-operations-software/",
  },
  "webinar-virtual-events": {
    minProducts: 5,
    products: [
      "zoom",
      "webex",
      "microsoft-teams",
      "webinarjam-everwebinar",
      "livestorm",
      "switcher-studio",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-webinar-virtual-events-software/",
  },
  "lms-course-creation": {
    minProducts: 5,
    products: ["kartra", "trainual", "flexiquiz", "learnworlds", "clickfunnels"],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-lms-course-creation-software/",
  },
  "website-digital-presence": {
    minProducts: 5,
    products: ["shopify", "leadpages", "wegic", "ueni", "flippa"],
    minComparisons: 3,
    chooseGuideHref:
      "/guides/how-to-choose-website-digital-presence-software/",
  },
  "accounting-finance": {
    minProducts: 5,
    products: ["monday", "hive", "mrpeasy", "navan", "dext"],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-accounting-finance-software/",
  },
  "social-media-management": {
    minProducts: 5,
    products: ["buffer", "socialbee", "hootsuite", "agorapulse", "later"],
    minComparisons: 3,
    chooseGuideHref:
      "/guides/how-to-choose-social-media-management-software/",
  },
  "landing-pages-cro": {
    minProducts: 5,
    products: [
      "getresponse",
      "kartra",
      "freshmarketer",
      "leadpages",
      "clickfunnels",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-landing-pages-cro-software/",
  },
  "ppc-advertising": {
    minProducts: 5,
    products: ["adcreative-ai", "birch", "diginius", "evolve", "uniqode"],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-ppc-advertising-software/",
  },
  "ai-writing": {
    minProducts: 5,
    products: ["gamma", "adcreative-ai", "quillbot", "rank-prompt"],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-ai-writing-software/",
  },
  "ai-website-builder": {
    minProducts: 5,
    products: ["gamma", "emergent", "mindstudio", "wegic", "ueni"],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-ai-website-builder-software/",
  },
  "ats-recruiting": {
    minProducts: 5,
    products: [
      "greenhouse",
      "ashby",
      "breezy-hr",
      "lever",
      "workable",
      "freshteam",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-ats-recruiting-software/",
  },
  "fulfillment-shipping": {
    minProducts: 5,
    products: ["shopify", "spocket", "alidrop", "shipbob"],
    minComparisons: 3,
    chooseGuideHref:
      "/guides/how-to-choose-fulfillment-shipping-software/",
  },
  "time-attendance": {
    minProducts: 5,
    products: [
      "connecteam",
      "7shifts",
      "deputy",
      "homebase",
      "when-i-work",
      "jibble",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-time-attendance-software/",
  },
  "web-hosting": {
    minProducts: 5,
    products: [
      "cloudways",
      "kinsta",
      "plesk",
      "cpanel",
      "siteground",
      "directadmin",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-web-hosting-software/",
  },
  itsm: {
    minProducts: 5,
    products: [
      "servicenow",
      "freshservice",
      "jira-service-management",
      "haloitsm",
      "manageengine-servicedesk-plus",
      "sysaid",
    ],
    minComparisons: 3,
    chooseGuideHref: "/guides/how-to-choose-itsm-software/",
  },
};
