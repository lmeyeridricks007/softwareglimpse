import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier17GuideScheduledAt } from "@/data/config/publishing/tier-17-analytics-bi-launch-2027-02-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-analytics-bi-software";
const SCHEDULED_AT = tier17GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Analytics and business intelligence software helps teams attribute leads, unify marketing metrics, and build executive KPI dashboards — not full MAP platforms, social schedulers, or funnel builders. Decision rule: if the blocking job is lead/call attribution, shortlist WhatConverts-class tools; if it is executive KPI dashboards across scattered sources, shortlist Databox-class connectors — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Lead & call attribution",
      "KPI dashboards",
      "Marketing data connectors",
      "Channel reporting",
      "Goals & alerts",
      "Not MAP / funnel primary",
      "Not social scheduling",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Analytics is several purchases",
        body: "Attribution tools and KPI dashboard platforms fail for different reasons. Name the job before you shortlist.",
      },
      {
        label: "Distinct from marketing software",
        body: "MAP, funnels, and social suites may include reports — but proving ROI with attribution or executive dashboards is a different buyer job.",
      },
      {
        label: "Pricing units differ",
        body: "Per-source connectors, tracked numbers, and dashboard seats change TCO more than the starter tile.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "bi-shapes",
    title: "Common analytics & BI shapes (not rankings)",
    types: [
      {
        id: "attribution",
        title: "Lead & call attribution",
        bestFor: "Track leads, calls, and forms to campaigns and sources.",
        avoidWhen: "You only need a static monthly spreadsheet export.",
      },
      {
        id: "dashboards",
        title: "KPI dashboards",
        bestFor: "Executive and team dashboards with goal tracking.",
        avoidWhen: "Call-level source data is the blocking requirement.",
      },
      {
        id: "connectors",
        title: "Marketing metrics unification",
        bestFor: "Pull ads, CRM, and analytics metrics into one view.",
        avoidWhen: "You need dynamic call tracking numbers on every landing page.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live connector and attribution depth.",
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

export const whatIsAnalyticsBiSoftwareGuide: GuidePage = {
  id: "guide-what-is-analytics-bi-software",
  slug: SLUG,
  title: "What is Analytics & Business Intelligence Software?",
  summary:
    "Analytics and BI software attributes leads, unifies marketing metrics, and builds KPI dashboards — distinct from MAP, funnels, and social scheduling.",
  categorySlugs: ["analytics-bi"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:analytics-bi",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-analytics-bi-software",
    "analytics-bi-pricing-guide",
    "analytics-bi-vs-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What is Analytics & Business Intelligence Software?",
    description:
      "Learn how analytics and BI software attributes leads, unifies marketing metrics, and builds executive KPI dashboards.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/what-is-analytics-bi-software/",
  },
};
