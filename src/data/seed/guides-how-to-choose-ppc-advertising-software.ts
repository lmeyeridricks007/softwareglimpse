import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier33GuideScheduledAt } from "@/data/config/publishing/tier-33-ppc-advertising-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-ppc-advertising-software";
const SCHEDULED_AT = tier33GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose PPC advertising software by the paid-media job blocking work — search and display campaign management with agency reporting, or paid social automation with rules and budget pacing — then confirm ad spend bands, connected ad accounts, seat limits, and creative testing depth. Shortlist only tools whose core product is paid campaign management, not organic social calendars, ESP sends, or landing page builders.",
    bullets: [
      "Primary PPC cluster",
      "Ad spend and account bands",
      "Search vs paid social channels",
      "Rules and budget pacing",
      "Reporting and client workspaces",
      "Trial with one live ad account",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by PPC cluster, then confirm live commercial terms.",
    href: "/tools/marketing-finder/",
    ctaLabel: "Marketing Finder (PPC primary) →",
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

export const howToChoosePpcAdvertisingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-ppc-advertising-software",
  slug: SLUG,
  title: "How to Choose PPC Advertising Software",
  summary:
    "Pick PPC tools by search-management or paid-social automation cluster — not as one generic marketing list.",
  categorySlugs: ["ppc-advertising"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:ppc-advertising",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ppc-advertising-software",
    "ppc-advertising-pricing-guide",
    "ppc-advertising-evaluation-guide",
    "ppc-advertising-vs-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose PPC Advertising Software | SoftwareGlimpse",
    description:
      "Choose PPC software by cluster, ad spend bands, channel coverage, and automation depth.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
