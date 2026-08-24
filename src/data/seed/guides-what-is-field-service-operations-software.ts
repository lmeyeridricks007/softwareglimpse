import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier18GuideScheduledAt } from "@/data/config/publishing/tier-18-field-service-operations-launch-2027-03-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-field-service-operations-software";
const SCHEDULED_AT = tier18GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Field service and operations software helps teams schedule crews, manage construction jobs, dispatch trades work, and run appointment-based local services — not generic Work OS boards or helpdesk ticketing. Decision rule: if the blocking job is construction job costing, shortlist Contractor Foreman-class tools; if it is trades dispatch and mobile jobs, shortlist ServiceM8-class FSM; if it is client appointment booking, shortlist Shore-class schedulers — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Construction management",
      "Trades field service",
      "Appointment scheduling",
      "Crew dispatch",
      "Quotes & invoicing",
      "Not generic Work OS",
      "Not helpdesk ticketing",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Field ops is several purchases",
        body: "Construction, trades FSM, and appointment scheduling fail for different reasons. Name the job before you shortlist.",
      },
      {
        label: "Distinct from project management",
        body: "Monday-class Work OS boards may track tasks — but job costing, dispatch, and field mobile workflows are different buyer jobs.",
      },
      {
        label: "Pricing units differ",
        body: "Per-user, per-job, and flat trade plans change TCO more than the starter tile.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "fso-shapes",
    title: "Common field service shapes (not rankings)",
    types: [
      {
        id: "construction",
        title: "Construction management",
        bestFor: "Job costing, schedules, and contractor financial workflows.",
        avoidWhen: "You only need salon-style appointment booking.",
      },
      {
        id: "trades-fsm",
        title: "Trades field service",
        bestFor: "Dispatch, quotes, invoicing, and mobile jobs for trades crews.",
        avoidWhen: "You need multi-phase commercial construction estimating depth only.",
      },
      {
        id: "appointments",
        title: "Appointment scheduling",
        bestFor: "Client booking, reminders, and local business management.",
        avoidWhen: "You need crew dispatch and job costing for construction sites.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live scheduling and costing depth.",
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

export const whatIsFieldServiceOperationsSoftwareGuide: GuidePage = {
  id: "guide-what-is-field-service-operations-software",
  slug: SLUG,
  title: "What is Field Service & Operations Software?",
  summary:
    "Field service software schedules crews, manages construction jobs, and runs appointment-based local services — distinct from Work OS boards and helpdesks.",
  categorySlugs: ["field-service-operations"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:field-service-operations",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-field-service-operations-software",
    "field-service-operations-pricing-guide",
    "field-service-operations-vs-project-management-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What is Field Service & Operations Software?",
    description:
      "Learn how field service software schedules crews, manages construction jobs, and runs appointment-based local services.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/what-is-field-service-operations-software/",
  },
};
