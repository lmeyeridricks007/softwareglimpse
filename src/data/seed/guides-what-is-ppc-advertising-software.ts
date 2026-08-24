import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier33GuideScheduledAt } from "@/data/config/publishing/tier-33-ppc-advertising-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-ppc-advertising-software";
const SCHEDULED_AT = tier33GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "PPC advertising software manages paid search and paid social campaigns — bid rules, budget pacing, creative testing, and cross-channel reporting — not organic social calendars, ESP sends, or funnel page builders. Decision rule: if the blocking job is search and display campaign management with agency reporting, shortlist Diginius-class PPC platforms; if it is paid social automation with rules and budget pacing, shortlist Birch-class tools — never rank those paid-media clusters as one undifferentiated list.",
    bullets: [
      "Paid search campaigns",
      "Paid social automation",
      "Budget pacing and rules",
      "Creative and bid testing",
      "Cross-channel reporting",
      "Not organic social",
      "Not ESP or MAP",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "PPC clusters differ",
        body: "Search and display management versus paid social automation are different purchases — compare inside clusters.",
      },
      {
        label: "Deferred hub under marketing",
        body: "PPC advertising is a deferred sub-hub inside the marketing parent — not generic MAP or social management.",
      },
      {
        label: "Pricing units matter",
        body: "Ad spend bands, seat tiers, and managed-account limits change TCO more than starter tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by PPC cluster, then confirm live commercial terms.",
    href: "/best/ppc-advertising-software/",
    ctaLabel: "Best PPC advertising software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T21:00:00.000Z",
        publishedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const whatIsPpcAdvertisingSoftwareGuide: GuidePage = {
  id: "guide-what-is-ppc-advertising-software",
  slug: SLUG,
  title: "What Is PPC Advertising Software?",
  summary:
    "Paid search and paid social campaign management — rules, pacing, and reporting — distinct from organic social and MAP.",
  categorySlugs: ["ppc-advertising"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:ppc-advertising",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-ppc-advertising-software",
    "ppc-advertising-pricing-guide",
    "ppc-advertising-evaluation-guide",
    "ppc-advertising-vs-marketing-software",
    "what-is-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is PPC Advertising Software? | SoftwareGlimpse",
    description:
      "Paid search and social campaign automation — how PPC software differs from organic social and MAP.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
