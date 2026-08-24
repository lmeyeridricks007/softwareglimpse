import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier22GuideScheduledAt } from "@/data/config/publishing/tier-22-voip-business-phone-launch-2027-06-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "voip-business-phone-pricing-guide";
const SCHEDULED_AT = tier22GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "VoIP and business phone pricing mixes per-seat monthly plans, licence minimums, and per-minute usage. KrispCall Essential starts around $12/user/mo annual; CallHippo Starter ~$18/user/mo annual (2-user min); Aircall Essentials ~$30/licence/mo with a 3-licence minimum; Freshcaller offers a free agent tier with pay-per-minute; Kixie uses seat + usage packaging — confirm live terms. Compare seat floors and minute bundles, not headline tiles alone.",
    bullets: [
      "Per-seat monthly vs usage minutes",
      "Licence minimums (2-user, 3-licence)",
      "IVR / recording tier gates",
      "CRM CTI add-ons",
      "Inbound minute bundles",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your seat count and call volume, then shortlist inside the voice cluster.",
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

export const voipBusinessPhonePricingGuide: GuidePage = {
  id: "guide-voip-business-phone-pricing-guide",
  slug: SLUG,
  title: "VoIP & Business Phone Pricing Guide",
  summary:
    "How VoIP and business phone platforms price seats, minutes, and licence minimums — by voice cluster.",
  categorySlugs: ["voip-business-phone", "business-communications"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:voip-business-phone",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-voip-business-phone-software",
    "how-to-choose-voip-business-phone-software",
    "voip-business-phone-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "VoIP & Business Phone Pricing Guide",
    description:
      "Compare VoIP and business phone pricing — SMB VoIP, CRM CTI, dialers, and inbound CC voice.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/voip-business-phone-pricing-guide/",
  },
};
