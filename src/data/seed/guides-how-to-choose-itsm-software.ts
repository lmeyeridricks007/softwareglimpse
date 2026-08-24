import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier30GuideScheduledAt } from "@/data/config/publishing/tier-30-itsm-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-itsm-software";
const SCHEDULED_AT = tier30GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose ITSM software by the internal service desk job blocking work — mid-market ITSM, enterprise ITIL suites, or lightweight employee ticketing — then confirm per-agent pricing, change and asset depth, service catalog, and identity/endpoint integrations. Shortlist only tools whose core product is employee IT service management, not customer helpdesks or observability.",
    bullets: [
      "Primary ITSM job cluster",
      "Per-agent vs asset-pack pricing",
      "Incident and request workflows",
      "Change and CMDB depth",
      "Service catalog and SLAs",
      "Trial with one real employee ticket flow",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by ITSM cluster, then confirm live commercial terms.",
    href: "/tools/it-development-finder/",
    ctaLabel: "IT Finder (ITSM primary) →",
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

export const howToChooseItsmSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-itsm-software",
  slug: SLUG,
  title: "How to Choose ITSM Software",
  summary:
    "Pick ITSM tools by internal service desk cluster — mid-market, enterprise ITIL, or lightweight employee ticketing.",
  categorySlugs: ["itsm", "it-development"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:itsm",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-itsm-software",
    "itsm-pricing-guide",
    "itsm-evaluation-guide",
    "itsm-vs-it-development-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose ITSM Software | SoftwareGlimpse",
    description:
      "Choose ITSM software by service desk job, change/asset depth, and per-agent pricing.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
