import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier16GuideScheduledAt } from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-website-digital-presence-software";
const SCHEDULED_AT = tier16GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose website and digital presence software by the blocking job — hosted storefront, site builder, landing/CRO, hosting panel, AI site generation, or digital business marketplace — then confirm commerce depth, technical control, and integrations. Shortlist only tools whose core product is your job.",
    bullets: [
      "Primary web job",
      "Commerce vs brochure site",
      "Self-host vs hosted",
      "CRO / testing needs",
      "Payment & analytics integrations",
      "Trial with one real page or SKU",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/website-digital-presence-software/",
    ctaLabel: "Best website & digital presence software →",
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

export const howToChooseWebsiteDigitalPresenceSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-website-digital-presence-software",
  slug: SLUG,
  title: "How to Choose Website & Digital Presence Software",
  summary:
    "Pick storefronts, site builders, landing tools, hosting panels, or marketplaces by primary job and commerce depth.",
  categorySlugs: ["website-digital-presence"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:website-digital-presence",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-website-digital-presence-software",
    "website-digital-presence-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Website & Digital Presence Software | SoftwareGlimpse",
    description:
      "How to choose website software by storefront, builder, landing, panel, or marketplace job cluster.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
