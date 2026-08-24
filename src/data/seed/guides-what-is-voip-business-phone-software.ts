import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier22GuideScheduledAt } from "@/data/config/publishing/tier-22-voip-business-phone-launch-2027-06-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-voip-business-phone-software";
const SCHEDULED_AT = tier22GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "VoIP and business phone software provisions business numbers, routes calls, powers outbound dialers, and logs voice into CRM — cloud phone for SMB teams, CRM-connected CTI for mid-market sales, inbound contact-center PBX, and sales power dialers. Decision rule: if the blocking job is budget SMB VoIP with global numbers, shortlist KrispCall-class tools; if it is mid-market CRM CTI, shortlist Aircall; if it is outbound sales dialing, shortlist Kixie; if it is inbound support queues, shortlist Freshcaller — never rank those voice clusters as one undifferentiated list.",
    bullets: [
      "Cloud business phone / VoIP",
      "Sales power dialers",
      "CRM click-to-dial & CTI",
      "IVR and call queues",
      "Inbound contact-center voice",
      "Not team chat or WhatsApp inboxes",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Voice job clusters differ",
        body: "SMB VoIP, CRM CTI, sales dialers, and inbound CC voice are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under BC",
        body: "Use the parent Business Communications Finder with the voice-vs-chat primary job to shortlist.",
      },
      {
        label: "Seat minimums matter",
        body: "Licence floors and per-minute usage change TCO more than headline per-seat tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by voice job cluster, then run the BC Finder with voice as the primary job.",
    href: "/best/voip-business-phone-software/",
    ctaLabel: "Best VoIP & business phone software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T19:30:00.000Z",
        reviewedAt: "2026-08-23T19:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T19:30:00.000Z",
        publishedAt: "2026-08-23T19:30:00.000Z",
        reviewedAt: "2026-08-23T19:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const whatIsVoipBusinessPhoneSoftwareGuide: GuidePage = {
  id: "guide-what-is-voip-business-phone-software",
  slug: SLUG,
  title: "What is VoIP & Business Phone Software?",
  summary:
    "VoIP and business phone software covers cloud calling, sales dialers, and contact-center voice — distinct from team chat and messaging.",
  categorySlugs: ["voip-business-phone", "business-communications"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:voip-business-phone",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-voip-business-phone-software",
    "voip-business-phone-pricing-guide",
    "voip-business-phone-vs-business-communications",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What is VoIP & Business Phone Software?",
    description:
      "Learn how VoIP and business phone systems support cloud calling, dialers, and contact-center voice.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/what-is-voip-business-phone-software/",
  },
};
