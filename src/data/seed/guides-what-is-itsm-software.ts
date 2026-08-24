import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier30GuideScheduledAt } from "@/data/config/publishing/tier-30-itsm-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-itsm-software";
const SCHEDULED_AT = tier30GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "ITSM software manages employee incidents, service requests, change management, asset inventory, and a service catalog — not customer helpdesk refunds or git CI pipelines. Decision rule: if the blocking job is mid-market Freshworks ITSM at a similar $19/agent floor, shortlist Freshservice-class tools — confirm live terms. Wave-1 hub needs 3+ ITSM-native peers before broad rankings.",
    bullets: [
      "Incident and request ticketing",
      "Change and release management",
      "Asset and configuration inventory",
      "Service catalog and SLAs",
      "Employee self-service portal",
      "Not customer helpdesk or git CI",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "ITSM is not customer support",
        body: "Employee service desks and customer helpdesks share ticket shapes but differ on catalog, assets, and ITIL depth.",
      },
      {
        label: "Subcategory under IT",
        body: "Use the parent IT & development Finder with ITSM as the primary job to shortlist.",
      },
      {
        label: "Per-agent tiers and asset packs",
        body: "Agent seats, CMDB depth, and automation tier gates change TCO more than headline tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by ITSM job cluster, then run the IT Finder with service desk as the primary job.",
    href: "/best/itsm-software/",
    ctaLabel: "Best ITSM software →",
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

export const whatIsItsmSoftwareGuide: GuidePage = {
  id: "guide-what-is-itsm-software",
  slug: SLUG,
  title: "What Is ITSM Software?",
  summary:
    "ITSM software for employee incidents, change management, assets, and service catalogs — distinct from customer helpdesks and git hosting.",
  categorySlugs: ["itsm", "it-development"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:itsm",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-itsm-software",
    "itsm-pricing-guide",
    "itsm-evaluation-guide",
    "itsm-vs-it-development-software",
    "what-is-it-development-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is ITSM Software? | SoftwareGlimpse",
    description:
      "Employee incidents, change management, and service catalogs — how ITSM differs from customer helpdesks.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
