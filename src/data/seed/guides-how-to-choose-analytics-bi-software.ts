import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier17GuideScheduledAt } from "@/data/config/publishing/tier-17-analytics-bi-launch-2027-02-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-analytics-bi-software";
const SCHEDULED_AT = tier17GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose analytics and BI software by the job blocking work — lead/call attribution, executive KPI dashboards, or marketing metrics unification — then confirm required data sources, agency vs in-house reporting, and alert workflows. Shortlist only tools whose core product is your job.",
    bullets: [
      "Primary analytics job",
      "Attribution vs dashboard depth",
      "Required data sources",
      "Agency multi-client needs",
      "Goal alerts & delivery",
      "Trial with one real dashboard or source",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/analytics-bi-software/",
    ctaLabel: "Best analytics & BI software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T17:00:00.000Z",
        reviewedAt: "2026-08-23T17:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T17:00:00.000Z",
        publishedAt: "2026-08-23T17:00:00.000Z",
        reviewedAt: "2026-08-23T17:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseAnalyticsBiSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-analytics-bi-software",
  slug: SLUG,
  title: "How to Choose Analytics & BI Software",
  summary:
    "Pick attribution tools or KPI dashboard platforms by primary job, data sources, and reporting audience.",
  categorySlugs: ["analytics-bi"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:analytics-bi",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-analytics-bi-software",
    "analytics-bi-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Analytics & BI Software",
    description:
      "Choose analytics software by attribution vs dashboard jobs, data sources, and reporting workflows.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/how-to-choose-analytics-bi-software/",
  },
};
