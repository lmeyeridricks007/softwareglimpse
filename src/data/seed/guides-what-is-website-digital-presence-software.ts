import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier16GuideScheduledAt } from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-website-digital-presence-software";
const SCHEDULED_AT = tier16GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Website and digital presence software helps you launch sites, publish landing pages, run hosted storefronts, administer hosting servers, generate sites with AI, or buy and sell online businesses — not MAP automation or 3PL fulfillment alone. Decision rule: if the blocking job is a hosted ecommerce storefront, shortlist Shopify-class platforms; if it is campaign landing pages, shortlist Leadpages-class tools; if it is SMB site building, shortlist UENI or Wegic-class builders; if it is buying/selling sites, shortlist Flippa-class marketplaces; if it is server administration, shortlist Plesk-class panels — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Hosted storefronts",
      "Website builders",
      "Landing pages & CRO",
      "AI site generation",
      "Hosting control panels",
      "Digital business marketplaces",
      "Not MAP / 3PL only",
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary web job, then shortlist within that cluster.",
    href: "/best/website-digital-presence-software/",
    ctaLabel: "See Best Website & Digital Presence Software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T16:30:00.000Z",
        reviewedAt: "2026-08-23T16:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T16:30:00.000Z",
        publishedAt: "2026-08-23T16:30:00.000Z",
        reviewedAt: "2026-08-23T16:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const whatIsWebsiteDigitalPresenceSoftwareGuide: GuidePage = {
  id: "guide-what-is-website-digital-presence-software",
  slug: SLUG,
  title: "What Is Website & Digital Presence Software?",
  summary:
    "A clear definition of site builders, landing pages, storefronts, hosting panels, AI site tools, and digital business marketplaces — scattered jobs unified for buyers.",
  categorySlugs: ["website-digital-presence"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:website-digital-presence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:website-digital-presence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-website-digital-presence-software",
    "website-digital-presence-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Website & Digital Presence Software? | SoftwareGlimpse",
    description:
      "Definition of site builders, landing pages, storefronts, hosting panels, and digital business marketplaces.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
