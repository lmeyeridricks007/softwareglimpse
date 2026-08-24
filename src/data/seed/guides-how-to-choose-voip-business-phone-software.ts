import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier22GuideScheduledAt } from "@/data/config/publishing/tier-22-voip-business-phone-launch-2027-06-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-voip-business-phone-software";
const SCHEDULED_AT = tier22GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose VoIP and business phone software by the voice job blocking work — SMB cloud phone, mid-market CRM CTI, outbound sales dialing, or inbound contact-center voice — then confirm seat minimums, IVR depth, CRM integrations, and per-minute TCO. Shortlist only tools whose core product is business voice, not team chat or WhatsApp inboxes.",
    bullets: [
      "Primary voice job",
      "SMB VoIP vs CRM CTI vs dialer",
      "Seat / licence minimums",
      "IVR and queue depth",
      "CRM / helpdesk CTI",
      "Trial with one real call flow",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by voice cluster, then confirm live commercial terms.",
    href: "/tools/business-communications-finder/",
    ctaLabel: "BC Finder (voice vs chat) →",
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

export const howToChooseVoipBusinessPhoneSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-voip-business-phone-software",
  slug: SLUG,
  title: "How to Choose VoIP & Business Phone Software",
  summary:
    "Pick business phone tools by voice job cluster — SMB VoIP, CRM CTI, sales dialer, or inbound CC — not as one generic list.",
  categorySlugs: ["voip-business-phone", "business-communications"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:voip-business-phone",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-voip-business-phone-software",
    "voip-business-phone-pricing-guide",
    "voip-business-phone-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose VoIP & Business Phone Software",
    description:
      "Choose VoIP and business phone software by SMB VoIP, CRM CTI, dialer, or inbound CC job fit.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/how-to-choose-voip-business-phone-software/",
  },
};
