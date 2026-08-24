import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier18GuideScheduledAt } from "@/data/config/publishing/tier-18-field-service-operations-launch-2027-03-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-field-service-operations-software";
const SCHEDULED_AT = tier18GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose field service and operations software by the job blocking work — construction management, trades dispatch, or appointment scheduling — then confirm crew size, mobile/offline needs, and quote-to-cash depth. Shortlist only tools whose core product is your job.",
    bullets: [
      "Primary field job",
      "Construction vs trades vs appointments",
      "Crew dispatch complexity",
      "Job costing requirements",
      "Mobile / offline field app",
      "Trial with one real job or booking flow",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/field-service-operations-software/",
    ctaLabel: "Best field service & operations software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T17:30:00.000Z",
        reviewedAt: "2026-08-23T17:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T17:30:00.000Z",
        publishedAt: "2026-08-23T17:30:00.000Z",
        reviewedAt: "2026-08-23T17:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseFieldServiceOperationsSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-field-service-operations-software",
  slug: SLUG,
  title: "How to Choose Field Service & Operations Software",
  summary:
    "Pick construction, trades FSM, or appointment scheduling tools by primary job, crew workflows, and mobile requirements.",
  categorySlugs: ["field-service-operations"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:field-service-operations",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-field-service-operations-software",
    "field-service-operations-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Field Service & Operations Software",
    description:
      "Choose field service software by construction, trades dispatch, or appointment scheduling jobs.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/how-to-choose-field-service-operations-software/",
  },
};
