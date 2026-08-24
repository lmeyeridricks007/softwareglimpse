import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier24GuideScheduledAt } from "@/data/config/publishing/tier-24-helpdesk-ticketing-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-helpdesk-ticketing-software";
const SCHEDULED_AT = tier24GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose helpdesk and ticketing software by the support job blocking work — SMB helpdesk, enterprise omnichannel, ecommerce order-aware inbox, or ITSM — then confirm pricing unit (per-agent vs ticket caps), SLA/routing depth, knowledge base, and channel integrations. Shortlist only tools whose core product is helpdesk ticketing, not website live chat widgets or phone-only VoIP.",
    bullets: [
      "Primary helpdesk job",
      "Per-agent vs ticket-based pricing",
      "SLA and routing rules",
      "Knowledge base and deflection",
      "Omnichannel channel coverage",
      "Trial with one real ticket workflow",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by helpdesk cluster, then confirm live commercial terms.",
    href: "/tools/customer-service-finder/",
    ctaLabel: "CS Finder (helpdesk primary) →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T20:00:00.000Z",
        reviewedAt: "2026-08-23T20:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T20:00:00.000Z",
        publishedAt: "2026-08-23T20:00:00.000Z",
        reviewedAt: "2026-08-23T20:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseHelpdeskTicketingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-helpdesk-ticketing-software",
  slug: SLUG,
  title: "How to Choose Helpdesk & Ticketing Software",
  summary:
    "Pick helpdesk tools by job cluster — SMB helpdesk, enterprise omnichannel, ecommerce inbox, or ITSM — not as one generic list.",
  categorySlugs: ["helpdesk-ticketing", "customer-service"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:helpdesk-ticketing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-helpdesk-ticketing-software",
    "helpdesk-ticketing-pricing-guide",
    "helpdesk-ticketing-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Helpdesk & Ticketing Software | SoftwareGlimpse",
    description:
      "Choose helpdesk software by job cluster, pricing unit, SLA depth, and channel coverage.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
