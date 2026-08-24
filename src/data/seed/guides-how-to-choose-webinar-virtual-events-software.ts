import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier14GuideScheduledAt } from "@/data/config/publishing/tier-14-webinar-virtual-events-launch-2026-11-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-webinar-virtual-events-software";
const SCHEDULED_AT = tier14GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose webinar and virtual events software by the job blocking work — live hosting, evergreen automation, multi-session virtual events, or multi-camera live production — then confirm audience size, integrations, and simulive vs live requirements. Shortlist only tools whose core product is your job.",
    bullets: [
      "Primary webinar job",
      "Audience size & caps",
      "Simulive vs live",
      "CRM / MAP integrations",
      "Registration workflow",
      "Trial with one real event",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/webinar-virtual-events-software/",
    ctaLabel: "Best webinar & virtual events software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T15:00:00.000Z",
        reviewedAt: "2026-08-23T15:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T15:00:00.000Z",
        publishedAt: "2026-08-23T15:00:00.000Z",
        reviewedAt: "2026-08-23T15:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseWebinarVirtualEventsSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-webinar-virtual-events-software",
  slug: SLUG,
  title: "How to Choose Webinar & Virtual Events Software",
  summary:
    "Pick webinar hosts, virtual event platforms, evergreen tools, or live production software by primary job, audience size, and integrations.",
  categorySlugs: ["webinar-virtual-events"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:webinar-virtual-events",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-webinar-virtual-events-software",
    "webinar-virtual-events-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Webinar & Virtual Events Software | SoftwareGlimpse",
    description:
      "How to choose webinar software by live hosting, evergreen, virtual events, or production job cluster.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
